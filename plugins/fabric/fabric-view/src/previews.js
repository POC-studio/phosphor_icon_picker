import { ARTBOARD_PRESETS } from './constants.js';
import { loadFromJsonPromise, syncCurrentCanvasToPageSnapshots } from './serialize.js';
import { clampArtboardIndex, dataUrlToBase64, normalizeFontFamily } from './utils.js';


function getJsPdfConstructor() {
  const w = typeof window !== 'undefined' ? window : null;
  const mod = w && w.jspdf;
  return mod && typeof mod.jsPDF === 'function' ? mod.jsPDF : null;
}


/* =========================================================================
 * Export PDF VECTORIEL (SVG -> svg2pdf -> jsPDF)
 *
 * - Formes / icônes Phosphor / grilles : vectoriels via Fabric.toSVG().
 * - Images (fabric.Image) : embarquées en raster (data URL) dans le SVG.
 * - Texte : converti en CONTOURS vectoriels via opentype.js (fidèle « tel quel »,
 *   sans dépendre des polices côté PDF).
 * - Pages A4 portrait ; le contenu (spreads paysage) est pivoté 90°.
 *   Page intérieure pivotée +180° pour l'impression recto-verso « côté long ».
 * ========================================================================= */

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

/** A4 portrait @300dpi en pixels (= 210 x 297 mm), repère interne des pages PDF. */
const PDF_PAGE_W_PX = 2480;
const PDF_PAGE_H_PX = 3508;

/** Sens de rotation paysage -> portrait (ajustable après test d'impression). */
const PDF_ROTATE_CLOCKWISE = true;
/** +180° sur la page intérieure pour le recto-verso « côté long ». */
const PDF_DUPLEX_FLIP_INSIDE_PAGE = true;

/** Polices custom -> binaires TTF statiques (@expo-google-fonts via jsDelivr, CORS *). */
const PDF_FONT_BASE = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts';
const PDF_FONT_FACES = {
  'jetbrains mono': {
    pkg: 'jetbrains-mono@0.4.1',
    file: 'JetBrainsMono',
    weights: { 100: '100Thin', 200: '200ExtraLight', 300: '300Light', 400: '400Regular', 500: '500Medium', 600: '600SemiBold', 700: '700Bold', 800: '800ExtraBold' },
  },
  fraunces: {
    pkg: 'fraunces@0.4.1',
    file: 'Fraunces',
    weights: { 100: '100Thin', 200: '200ExtraLight', 300: '300Light', 400: '400Regular', 500: '500Medium', 600: '600SemiBold', 700: '700Bold', 800: '800ExtraBold', 900: '900Black' },
  },
  schoolbell: {
    pkg: 'schoolbell@0.4.0',
    file: 'Schoolbell',
    weights: { 400: '400Regular' },
  },
  'space grotesk': {
    pkg: 'space-grotesk@0.4.1',
    file: 'SpaceGrotesk',
    weights: { 300: '300Light', 400: '400Regular', 500: '500Medium', 600: '600SemiBold', 700: '700Bold' },
  },
  ultra: {
    pkg: 'ultra@0.4.0',
    file: 'Ultra',
    weights: { 400: '400Regular' },
  },
};


/** URL du TTF pour une famille normalisée + poids (choisit le poids dispo le plus proche). */
function resolvePdfFontUrl(family, weight) {
  const face = PDF_FONT_FACES[family];
  if (!face) return null;
  const wanted = Number(weight) || 400;
  const available = Object.keys(face.weights).map(Number).sort((a, b) => a - b);
  let chosen = available[0];
  let bestDelta = Infinity;
  available.forEach((w) => {
    const delta = Math.abs(w - wanted);
    if (delta < bestDelta) {
      bestDelta = delta;
      chosen = w;
    }
  });
  const dir = face.weights[chosen];
  return `${PDF_FONT_BASE}/${face.pkg}/${dir}/${face.file}_${dir}.ttf`;
}


function getPdfFontCache(instance) {
  if (!instance.data._pdfFontCache || typeof instance.data._pdfFontCache.get !== 'function') {
    instance.data._pdfFontCache = new Map();
  }
  return instance.data._pdfFontCache;
}


/** Charge (et met en cache) une police opentype.js pour famille + poids. Renvoie null si indisponible. */
function loadOpentypeFont(instance, family, weight) {
  const opentype = typeof window !== 'undefined' ? window.opentype : null;
  if (!opentype || typeof opentype.parse !== 'function') return Promise.resolve(null);
  const url = resolvePdfFontUrl(family, weight);
  if (!url) return Promise.resolve(null);
  const cache = getPdfFontCache(instance);
  if (cache.has(url)) return cache.get(url);
  const promise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      return opentype.parse(buf);
    } catch (e) {
      return null;
    }
  })();
  cache.set(url, promise);
  return promise;
}


/** Lit une propriété SVG depuis l'attribut puis le style inline. */
function readSvgProp(el, name) {
  if (!el || typeof el.getAttribute !== 'function') return '';
  const attr = el.getAttribute(name);
  if (attr != null && attr !== '') return attr;
  const style = el.getAttribute('style');
  if (style) {
    const match = style.match(new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`));
    if (match) return match[1].trim();
  }
  return '';
}


function readFontWeight(el, fallbackEl) {
  const raw = readSvgProp(el, 'font-weight') || (fallbackEl ? readSvgProp(fallbackEl, 'font-weight') : '');
  if (!raw) return 400;
  if (raw === 'bold') return 700;
  if (raw === 'normal') return 400;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 400;
}


function readFontFamily(el, fallbackEl) {
  const raw = readSvgProp(el, 'font-family') || (fallbackEl ? readSvgProp(fallbackEl, 'font-family') : '');
  return normalizeFontFamily(raw);
}


function firstNumber(value) {
  if (value == null) return NaN;
  return parseFloat(String(value).trim().split(/\s+/)[0]);
}


/** Écrit stroke-width en respectant l'emplacement existant (style inline prioritaire sur l'attribut). */
function setSvgStrokeWidth(el, width) {
  const value = Number.isFinite(width) ? String(width) : '0';
  const style = el.getAttribute('style');
  if (style && /(?:^|;)\s*stroke-width\s*:/.test(style)) {
    el.setAttribute('style', style.replace(/((?:^|;)\s*stroke-width\s*:\s*)[^;]+/, `$1${value}`));
  } else {
    el.setAttribute('stroke-width', value);
  }
}


/**
 * svg2pdf n'honore pas `vector-effect="non-scaling-stroke"` : il applique le scale de
 * la matrice de l'objet au trait. On « cuit » donc l'épaisseur (stroke-width / scale cumulé)
 * et on retire l'attribut, pour que la remise à l'échelle de svg2pdf redonne l'épaisseur voulue
 * (= rendu identique à la chaîne PNG, où strokeUniform garde un trait constant).
 * Le SVG de page doit être attaché au DOM (getCTM) au moment de l'appel.
 */
function bakeNonScalingStrokes(rootSvg) {
  const els = Array.from(rootSvg.querySelectorAll('[vector-effect="non-scaling-stroke"]'));
  els.forEach((el) => {
    let scale = 1;
    try {
      const ctm = typeof el.getCTM === 'function' ? el.getCTM() : null;
      if (ctm) {
        const det = ctm.a * ctm.d - ctm.b * ctm.c;
        const s = Math.sqrt(Math.abs(det));
        if (Number.isFinite(s) && s > 0) scale = s;
      }
    } catch (e) {
      /* garde scale = 1 */
    }
    el.removeAttribute('vector-effect');
    if (scale === 1) return;
    const sw = parseFloat(readSvgProp(el, 'stroke-width'));
    const width = Number.isFinite(sw) ? sw : 1;
    setSvgStrokeWidth(el, width / scale);
  });
}


/** Remplace un <text> Fabric par des <path> (contours opentype) dans le même repère local. */
async function outlineOneTextElement(instance, textEl) {
  const family = readFontFamily(textEl);
  const baseWeight = readFontWeight(textEl);
  const baseSize = firstNumber(textEl.getAttribute('font-size')) || 16;
  const tspans = Array.from(textEl.querySelectorAll('tspan'));
  const runs = tspans.length ? tspans : [textEl];

  // Pré-charge toutes les polices nécessaires (famille|poids par run).
  const fontPromises = new Map();
  runs.forEach((node) => {
    const fam = readFontFamily(node, textEl) || family;
    const weight = readFontWeight(node, textEl) || baseWeight;
    const key = `${fam}|${weight}`;
    if (!fontPromises.has(key)) {
      fontPromises.set(key, loadOpentypeFont(instance, fam, weight));
    }
  });
  const fonts = new Map();
  await Promise.all(Array.from(fontPromises.entries()).map(async ([key, p]) => {
    fonts.set(key, await p);
  }));

  const fragment = document.createDocumentFragment();
  let producedAny = false;

  runs.forEach((node) => {
    const text = node.textContent;
    if (text == null || text === '') return;
    const fam = readFontFamily(node, textEl) || family;
    const weight = readFontWeight(node, textEl) || baseWeight;
    const font = fonts.get(`${fam}|${weight}`);
    if (!font) return;
    const x = firstNumber(node.getAttribute('x'));
    const y = firstNumber(node.getAttribute('y'));
    const size = firstNumber(readSvgProp(node, 'font-size')) || baseSize;
    const fill = readSvgProp(node, 'fill') || readSvgProp(textEl, 'fill') || '#000000';
    const fillOpacity = readSvgProp(node, 'fill-opacity') || readSvgProp(textEl, 'fill-opacity');
    let pathData = '';
    try {
      pathData = font.getPath(text, Number.isFinite(x) ? x : 0, Number.isFinite(y) ? y : 0, size).toPathData(2);
    } catch (e) {
      pathData = '';
    }
    if (!pathData) return;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', fill);
    if (fillOpacity) path.setAttribute('fill-opacity', fillOpacity);
    fragment.appendChild(path);
    producedAny = true;
  });

  // Si une seule police a échoué (réseau), on garde le <text> d'origine (fallback svg2pdf).
  if (producedAny && textEl.parentNode) {
    textEl.parentNode.replaceChild(fragment, textEl);
  }
}


async function outlineTextInSvg(instance, svgEl) {
  const texts = Array.from(svgEl.querySelectorAll('text'));
  for (const textEl of texts) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await outlineOneTextElement(instance, textEl);
    } catch (e) {
      /* garde le texte d'origine */
    }
  }
}


/** Embarque les <image> distantes en data URL (réutilise crossOrigin anonymous, comme la chaîne PNG). */
function inlineSvgImages(svgEl) {
  const images = Array.from(svgEl.querySelectorAll('image'));
  return Promise.all(images.map((node) => {
    const href = node.getAttribute('href') || node.getAttributeNS(XLINK_NS, 'href') || '';
    if (!href || /^data:/i.test(href)) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const w = img.naturalWidth || firstNumber(node.getAttribute('width')) || 1;
          const h = img.naturalHeight || firstNumber(node.getAttribute('height')) || 1;
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const data = c.toDataURL('image/png');
          node.setAttribute('href', data);
          node.setAttributeNS(XLINK_NS, 'href', data);
        } catch (e) {
          /* laisse l'href distant */
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = href;
    });
  }));
}


function parseSvgString(str) {
  if (typeof str !== 'string' || !str) return null;
  const doc = new DOMParser().parseFromString(str, 'image/svg+xml');
  if (doc.querySelector('parsererror')) return null;
  return doc.documentElement;
}


/** Préfixe tous les id (et leurs références url(#id) / href="#id") pour éviter les collisions entre artboards. */
function prefixSvgIds(root, prefix) {
  const idEls = Array.from(root.querySelectorAll('[id]'));
  if (idEls.length === 0) return;
  const ids = idEls.map((el) => el.getAttribute('id')).filter(Boolean);
  const remapUrls = (value) => {
    let out = value;
    ids.forEach((id) => {
      out = out.split(`url(#${id})`).join(`url(#${prefix}${id})`);
      out = out.split(`url("#${id}")`).join(`url("#${prefix}${id}")`);
      out = out.split(`url('#${id}')`).join(`url('#${prefix}${id}')`);
    });
    return out;
  };
  const idSet = new Set(ids);
  idEls.forEach((el) => el.setAttribute('id', prefix + el.getAttribute('id')));
  const all = [root, ...Array.from(root.querySelectorAll('*'))];
  all.forEach((el) => {
    if (!el.attributes) return;
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name;
      const value = attr.value;
      if ((name === 'href' || name === 'xlink:href') && value && value.charAt(0) === '#' && idSet.has(value.slice(1))) {
        el.setAttribute(name, `#${prefix}${value.slice(1)}`);
      } else if (value && value.indexOf('url(#') !== -1) {
        el.setAttribute(name, remapUrls(value));
      }
    });
  });
}


/** Canvas off-screen -> SVG (vectoriel), texte en contours + images embarquées. */
async function renderArtboardSnapshotToSvg(fabricLib, presetIndex, snapshot, instance) {
  const preset = ARTBOARD_PRESETS[clampArtboardIndex(presetIndex)];
  const w = preset.width;
  const h = preset.height;
  const el = document.createElement('canvas');
  el.width = w;
  el.height = h;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(el);
  const c = new fabricLib.Canvas(el, { preserveObjectStacking: true });
  c.setDimensions({ width: w, height: h });
  c.backgroundColor = '#ffffff';
  const loadInput = snapshot != null && typeof snapshot === 'object' ? snapshot : { objects: [] };
  try {
    await loadFromJsonPromise(c, loadInput);
    if (typeof c.requestRenderAll === 'function') {
      c.requestRenderAll();
    } else if (typeof c.renderAll === 'function') {
      c.renderAll();
    }
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const svgString = c.toSVG();
    const svgEl = parseSvgString(svgString);
    if (!svgEl) return null;
    await inlineSvgImages(svgEl);
    if (instance) await outlineTextInSvg(instance, svgEl);
    return svgEl;
  } finally {
    try {
      c.dispose();
    } catch (e) {
      /* ignore */
    }
    el.remove();
  }
}


function createPageSvg() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('xmlns:xlink', XLINK_NS);
  svg.setAttribute('width', String(PDF_PAGE_W_PX));
  svg.setAttribute('height', String(PDF_PAGE_H_PX));
  svg.setAttribute('viewBox', `0 0 ${PDF_PAGE_W_PX} ${PDF_PAGE_H_PX}`);
  return svg;
}


function makeGroup(transform) {
  const g = document.createElementNS(SVG_NS, 'g');
  if (transform) g.setAttribute('transform', transform);
  return g;
}


/** Transform paysage (W=3508 x H=2480) -> portrait (2480 x 3508). */
function portraitRotateTransform() {
  return PDF_ROTATE_CLOCKWISE
    ? `translate(${PDF_PAGE_W_PX},0) rotate(90)`
    : `translate(0,${PDF_PAGE_H_PX}) rotate(-90)`;
}


/**
 * Importe les enfants d'un SVG d'artboard dans un groupe (translaté), avec id préfixés,
 * et CLIPPE le contenu au cadre de l'artboard (clipW x clipH) pour qu'un élément qui
 * déborde du canvas n'apparaisse pas sur le montage (ex. jointure des deux A5).
 */
function appendArtboardChildren(parentGroup, artboardSvgEl, translateX, idPrefix, clipW, clipH) {
  if (!artboardSvgEl) return;
  prefixSvgIds(artboardSvgEl, idPrefix);
  const outer = makeGroup(translateX ? `translate(${translateX},0)` : null);

  const clipId = `${idPrefix}clip`;
  const clipPath = document.createElementNS(SVG_NS, 'clipPath');
  clipPath.setAttribute('id', clipId);
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', String(clipW));
  rect.setAttribute('height', String(clipH));
  clipPath.appendChild(rect);
  outer.appendChild(clipPath);

  const inner = makeGroup(null);
  inner.setAttribute('clip-path', `url(#${clipId})`);
  Array.from(artboardSvgEl.childNodes).forEach((node) => {
    inner.appendChild(document.importNode(node, true));
  });
  outer.appendChild(inner);
  parentGroup.appendChild(outer);
}


/** Page extérieure : dos (snaps[2]) à gauche | couverture (snaps[0]) à droite, paysage pivoté en portrait. */
async function buildOutsidePageSvg(instance, fabricLib, snaps) {
  const [artBack, artFront] = await Promise.all([
    renderArtboardSnapshotToSvg(fabricLib, 2, snaps[2], instance),
    renderArtboardSnapshotToSvg(fabricLib, 0, snaps[0], instance),
  ]);
  const svg = createPageSvg();
  const rot = makeGroup(portraitRotateTransform());
  appendArtboardChildren(rot, artBack, 0, 'pdfBack_', ARTBOARD_PRESETS[2].width, ARTBOARD_PRESETS[2].height);
  appendArtboardChildren(rot, artFront, ARTBOARD_PRESETS[2].width, 'pdfFront_', ARTBOARD_PRESETS[0].width, ARTBOARD_PRESETS[0].height);
  svg.appendChild(rot);
  return svg;
}


/** Page intérieure : artboard A4 paysage (snaps[1]) pivoté en portrait, +180° pour recto-verso côté long. */
async function buildInsidePageSvg(instance, fabricLib, snaps) {
  const artInside = await renderArtboardSnapshotToSvg(fabricLib, 1, snaps[1], instance);
  const svg = createPageSvg();
  let parent = svg;
  if (PDF_DUPLEX_FLIP_INSIDE_PAGE) {
    const flip = makeGroup(`rotate(180,${PDF_PAGE_W_PX / 2},${PDF_PAGE_H_PX / 2})`);
    svg.appendChild(flip);
    parent = flip;
  }
  const rot = makeGroup(portraitRotateTransform());
  appendArtboardChildren(rot, artInside, 0, 'pdfInside_', ARTBOARD_PRESETS[1].width, ARTBOARD_PRESETS[1].height);
  parent.appendChild(rot);
  return svg;
}


/** Rend un SVG de page (mm A4) dans le doc jsPDF via svg2pdf. */
async function renderSvgToPdfPage(doc, svgEl) {
  svgEl.style.position = 'fixed';
  svgEl.style.left = '-99999px';
  svgEl.style.top = '0';
  document.body.appendChild(svgEl);
  try {
    // Doit être fait une fois le SVG dans le DOM (getCTM) et avant le rendu svg2pdf.
    bakeNonScalingStrokes(svgEl);
    if (typeof doc.svg === 'function') {
      await doc.svg(svgEl, { x: 0, y: 0, width: 210, height: 297 });
    } else if (typeof window !== 'undefined' && typeof window.svg2pdf === 'function') {
      await window.svg2pdf(svgEl, doc, { x: 0, y: 0, width: 210, height: 297 });
    } else {
      throw new Error('svg2pdf indisponible');
    }
  } finally {
    svgEl.remove();
  }
}


function dataUrlToImageCanvas(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D indisponible'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}


function rotateCanvas90Clockwise(sourceCanvas) {
  const out = document.createElement('canvas');
  out.width = sourceCanvas.height;
  out.height = sourceCanvas.width;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.translate(out.width, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(sourceCanvas, 0, 0);
  return out;
}


function compositeSpreadPage3LeftPage1Right(dataUrl3, dataUrl0) {
  const pL = ARTBOARD_PRESETS[2];
  const pR = ARTBOARD_PRESETS[0];
  const cw = pL.width + pR.width;
  const ch = Math.max(pL.height, pR.height);
  return Promise.all([dataUrlToImageCanvas(dataUrl3), dataUrlToImageCanvas(dataUrl0)]).then(([cL, cR]) => {
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(cL, 0, 0);
    ctx.drawImage(cR, pL.width, 0);
    return rotateCanvas90Clockwise(c);
  });
}


function renderArtboardSnapshotToDataUrl(fabricLib, presetIndex, snapshot) {
  const preset = ARTBOARD_PRESETS[clampArtboardIndex(presetIndex)];
  const w = preset.width;
  const h = preset.height;
  const el = document.createElement('canvas');
  el.width = w;
  el.height = h;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(el);
  const c = new fabricLib.Canvas(el, {
    preserveObjectStacking: true,
  });
  c.setDimensions({ width: w, height: h });
  c.backgroundColor = '#ffffff';
  const loadInput = snapshot != null && typeof snapshot === 'object' ? snapshot : { objects: [] };
  return loadFromJsonPromise(c, loadInput)
    .then(() => {
      if (typeof c.requestRenderAll === 'function') {
        c.requestRenderAll();
      } else if (typeof c.renderAll === 'function') {
        c.renderAll();
      }
      return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    })
    .then(() => c.toDataURL({ format: 'png', multiplier: 1 }))
    .finally(() => {
      try {
        c.dispose();
      } catch (e) {
        /* ignore */
      }
      el.remove();
    });
}


function pdfDownloadBaseName(instance) {
  const raw = typeof instance.data.documentTitle === 'string' ? instance.data.documentTitle.trim() : '';
  return raw
    ? raw.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80) || 'document'
    : 'document';
}

let _fabricViewPdfSpinStyleInjected = false;

function ensureFabricViewPdfSpinStyle() {
  if (_fabricViewPdfSpinStyleInjected || typeof document === 'undefined') return;
  _fabricViewPdfSpinStyleInjected = true;
  const s = document.createElement('style');
  s.setAttribute('data-fabric-view', 'pdf-spin');
  s.textContent = '@keyframes fabric-view-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}


function setPdfDownloadButtonLoading(btn, loading) {
  if (!btn) return;
  ensureFabricViewPdfSpinStyle();
  const icon = btn.querySelector('i');
  btn.disabled = !!loading;
  btn.style.pointerEvents = loading ? 'none' : '';
  btn.title = loading ? 'Génération du PDF…' : 'Télécharger PDF (pli A4)';
  if (icon) {
    if (loading) {
      icon.className = 'ph ph-circle-notch';
      icon.style.display = 'inline-block';
      icon.style.animation = 'fabric-view-spin 0.7s linear infinite';
    } else {
      icon.className = 'ph ph-download-simple';
      icon.style.animation = '';
      icon.style.display = '';
    }
  }
}


function triggerFoldedA4PdfDownload(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) {
    return Promise.resolve();
  }
  // Contexte Bubble (uploadContent) posé par app.js à l'init.
  const context = instance.data.bubbleContext || null;
  const JsPDF = getJsPdfConstructor();
  if (!JsPDF) {
    console.error('jsPDF introuvable : ajoutez jspdf.umd.min.js dans shared.html (plugin Fabric).');
    return Promise.resolve();
  }
  const fabricLib = instance.data.fabricLib;
  if (!fabricLib || typeof fabricLib.Canvas !== 'function') {
    return Promise.resolve();
  }

  syncCurrentCanvasToPageSnapshots(instance);

  if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
    return Promise.resolve();
  }

  const downloadBtn = instance.data.ui && instance.data.ui.artboardDownloadBtn;
  setPdfDownloadButtonLoading(downloadBtn, true);

  const snaps = instance.data.pageSnapshots;
  const base = pdfDownloadBaseName(instance);

  const run = async () => {
    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined') {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
    }

    const doc = new JsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    });

    if (typeof doc.svg !== 'function' && !(typeof window !== 'undefined' && typeof window.svg2pdf === 'function')) {
      console.error('svg2pdf introuvable : ajoutez svg2pdf.umd.min.js dans shared.html (plugin Fabric).');
      return;
    }

    // Page 1 : extérieur (dos | couverture). Page 2 : intérieur (pivoté 180° pour recto-verso côté long).
    const outsideSvg = await buildOutsidePageSvg(instance, fabricLib, snaps);
    const insideSvg = await buildInsidePageSvg(instance, fabricLib, snaps);

    await renderSvgToPdfPage(doc, outsideSvg);
    doc.addPage();
    await renderSvgToPdfPage(doc, insideSvg);

    const dataUri = typeof doc.output === 'function' ? doc.output('datauristring') : '';
    const base64 = dataUri ? dataUrlToBase64(dataUri) : '';
    const safePdfName = `${base}.pdf`.replace(/[^\w.-]/g, '_') || 'document.pdf';

    if (context && typeof context.uploadContent === 'function' && base64) {
      try {
        const url = await new Promise((resolve, reject) => {
          context.uploadContent(safePdfName, base64, (err, url) => {
            if (err) reject(err);
            else resolve(url);
          });
        });
        instance.publishState('pdf_url', typeof url === 'string' ? url : '');
        instance.triggerEvent('pdf_ready');
      } catch (uploadErr) {
        console.error('Upload PDF Bubble :', uploadErr);
      }
    }

    doc.save(`${base}.pdf`);
  };

  return run()
    .catch((err) => {
      console.error('Export PDF pli A4 :', err);
    })
    .finally(() => {
      setPdfDownloadButtonLoading(downloadBtn, false);
    });
}


function cropCanvasToDataUrl(sourceCanvas, sx, sy, sw, sh) {
  const out = document.createElement('canvas');
  out.width = sw;
  out.height = sh;
  const ctx = out.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sw, sh);
  ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
  return out.toDataURL('image/png');
}


/**
 * Rend les 4 demi-pages en ordre naturel :
 *  0 = page 0 (A5), 1 = page 1 moitié gauche, 2 = page 1 moitié droite, 3 = page 2 (A5).
 * Page 1 (A4 paysage) est découpée en deux A5.
 */
function buildHalfPageDataUrls(fabricLib, snaps) {
  return Promise.all([
    renderArtboardSnapshotToDataUrl(fabricLib, 0, snaps[0]),
    renderArtboardSnapshotToDataUrl(fabricLib, 1, snaps[1]),
    renderArtboardSnapshotToDataUrl(fabricLib, 2, snaps[2]),
  ]).then((urls) => {
    const du0 = urls[0];
    const du1 = urls[1];
    const du2 = urls[2];
    return dataUrlToImageCanvas(du1).then((mid) => {
      const halfW = Math.round(ARTBOARD_PRESETS[1].width / 2);
      const h = mid.height;
      const leftUrl = cropCanvasToDataUrl(mid, 0, 0, halfW, h);
      const rightUrl = cropCanvasToDataUrl(mid, halfW, 0, mid.width - halfW, h);
      return [du0, leftUrl, rightUrl, du2];
    });
  });
}


/**
 * Génère et publie les previews des demi-pages dans le state `page_previews`,
 * puis déclenche l'event `page_previews_ready`. Renvoie la Promise des URLs
 * (utilisable comme « Result of step » côté action Bubble).
 * Toujours exécutée à fond (pas de skip) : l'appel manuel doit régénérer.
 */
function createPagePreviews(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) {
    return Promise.resolve([]);
  }
  // Contexte Bubble (uploadContent) posé par app.js à l'init.
  const context = instance.data.bubbleContext || null;
  const fabricLib = instance.data.fabricLib;
  if (!fabricLib || typeof fabricLib.Canvas !== 'function') {
    return Promise.resolve([]);
  }
  syncCurrentCanvasToPageSnapshots(instance);
  if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
    return Promise.resolve([]);
  }
  const snaps = instance.data.pageSnapshots.slice();
  const base = pdfDownloadBaseName(instance);
  const runId = (instance.data._pagePreviewsRunId || 0) + 1;
  instance.data._pagePreviewsRunId = runId;
  instance.data._lastPagePreviewsAt = Date.now();

  const uploadOne = (name, dataUrl) => {
    const base64 = dataUrlToBase64(dataUrl);
    if (context && typeof context.uploadContent === 'function' && base64) {
      return new Promise((resolve) => {
        try {
          context.uploadContent(name, base64, (err, url) => {
            if (err || typeof url !== 'string' || !/^https?:\/\/|^blob:/i.test(url)) {
              resolve(dataUrl);
            } else {
              resolve(url);
            }
          });
        } catch (e) {
          resolve(dataUrl);
        }
      });
    }
    return Promise.resolve(dataUrl);
  };

  const run = async () => {
    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined') {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
    }
    const halfUrls = await buildHalfPageDataUrls(fabricLib, snaps);
    const uploaded = await Promise.all(halfUrls.map((dataUrl, i) => {
      const safeName = `${base}-preview-${i + 1}.png`.replace(/[^\w.-]/g, '_') || `preview-${i + 1}.png`;
      return uploadOne(safeName, dataUrl);
    }));
    if (instance.data._pagePreviewsRunId !== runId) {
      return uploaded;
    }
    instance.data._lastPreviewedContentKey = JSON.stringify(snaps);
    instance.publishState('page_previews', uploaded);
    instance.triggerEvent('page_previews_ready');
    return uploaded;
  };

  return run().catch((err) => {
    console.error('Fabric View: create_page_previews', err);
    return [];
  });
}


/**
 * Régénère les previews après un changement de contenu.
 * Debounce 1500 ms + cooldown 30 s : si une génération a eu lieu il y a moins de
 * PAGE_PREVIEWS_COOLDOWN_MS, on repousse à la fin du cooldown (au lieu d'en relancer une).
 * Skip si le contenu n'a pas changé. L'action manuelle (createPagePreviews) n'est pas bridée.
 */
function schedulePagePreviews(instance) {
  if (!instance || !instance.data) return;
  const d = instance.data;
  if (d._suppressCanvasJsonPublish === true) return;
  const PAGE_PREVIEWS_DEBOUNCE_MS = 1500;
  const PAGE_PREVIEWS_COOLDOWN_MS = 30000;
  const sinceLast = Date.now() - (d._lastPagePreviewsAt || 0);
  const delay = sinceLast < PAGE_PREVIEWS_COOLDOWN_MS
    ? Math.max(PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS - sinceLast)
    : PAGE_PREVIEWS_DEBOUNCE_MS;
  if (d._schedulePagePreviewsTimer) {
    clearTimeout(d._schedulePagePreviewsTimer);
  }
  d._schedulePagePreviewsTimer = setTimeout(() => {
    d._schedulePagePreviewsTimer = null;
    if (!Array.isArray(d.pageSnapshots)) return;
    const contentKey = JSON.stringify(d.pageSnapshots);
    if (contentKey === d._lastPreviewedContentKey) return;
    createPagePreviews(instance);
  }, delay);
}

export {
  getJsPdfConstructor,
  dataUrlToImageCanvas,
  rotateCanvas90Clockwise,
  compositeSpreadPage3LeftPage1Right,
  renderArtboardSnapshotToDataUrl,
  renderArtboardSnapshotToSvg,
  buildOutsidePageSvg,
  buildInsidePageSvg,
  renderSvgToPdfPage,
  loadOpentypeFont,
  outlineTextInSvg,
  pdfDownloadBaseName,
  ensureFabricViewPdfSpinStyle,
  setPdfDownloadButtonLoading,
  triggerFoldedA4PdfDownload,
  cropCanvasToDataUrl,
  buildHalfPageDataUrls,
  createPagePreviews,
  schedulePagePreviews,
};
