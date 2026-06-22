/**
 * Export PDF livret imposé (vectoriel) — SVG CE.SDK → montage → svg2pdf → jsPDF.
 * @see plugins/fabric/fabric-view/src/previews.js
 */

import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { hidePageCanvasBorder, withPageHiddenForExport } from './export-lock.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

/** A4 portrait @300dpi (210 × 297 mm). */
export const PDF_PAGE_W_PX = 2480;
export const PDF_PAGE_H_PX = 3508;

/** Demi-page A5 @300dpi (148,5 × 210 mm). */
export const HALF_PAGE_W_PX = 1754;
export const HALF_PAGE_H_PX = 2480;

const PDF_ROTATE_CLOCKWISE = true;
const PDF_DUPLEX_FLIP_INSIDE_PAGE = true;

/** ~0,85 mm @300dpi — retire le trait de cadre CE.SDK sans couper le contenu utile. */
const PAGE_BORDER_CLIP_INSET_PX = 10;
/** Jointure gauche|droite : inset additionnel de chaque côté. */
const PAGE_SEAM_CLIP_INSET_PX = 8;

/** Paires 1-indexées [gauche, droite] pour saddle-stitch. */
export function buildImpositionPairs(totalPages) {
  if (totalPages % 4 !== 0) {
    throw new Error(`Nombre de pages invalide pour imposition: ${totalPages}`);
  }
  const numSheets = totalPages / 4;
  const pairs = [];
  for (let s = 0; s < numSheets; s += 1) {
    pairs.push([totalPages - 2 * s, 1 + 2 * s]);
    pairs.push([2 + 2 * s, totalPages - 1 - 2 * s]);
  }
  return pairs;
}

export function getJsPdfConstructor() {
  return jsPDF;
}

function parseSvgString(str) {
  if (typeof str !== 'string' || !str) return null;
  const doc = new DOMParser().parseFromString(str, 'image/svg+xml');
  if (doc.querySelector('parsererror')) return null;
  return doc.documentElement;
}

function isNear(a, b, tolerance = 1.5) {
  return Math.abs(a - b) <= tolerance;
}

function getPageBounds(svgEl) {
  let vx = 0;
  let vy = 0;
  let vw = parseFloat(svgEl.getAttribute('width') || '0');
  let vh = parseFloat(svgEl.getAttribute('height') || '0');
  const vb = svgEl.getAttribute('viewBox');
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      [vx, vy, vw, vh] = parts;
    }
  }
  return { vx, vy, vw, vh };
}

function readStyleStroke(el) {
  const style = el.getAttribute('style') || '';
  const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i);
  const widthMatch = style.match(/stroke-width\s*:\s*([^;]+)/i);
  return {
    stroke: strokeMatch ? strokeMatch[1].trim().toLowerCase() : '',
    width: widthMatch ? parseFloat(widthMatch[1]) : 0,
  };
}

function hasVisibleStroke(el) {
  const stroke = (el.getAttribute('stroke') || '').trim().toLowerCase();
  const strokeWidth = parseFloat(el.getAttribute('stroke-width') || '0');
  if (stroke && stroke !== 'none' && strokeWidth > 0) return true;
  const fromStyle = readStyleStroke(el);
  return !!(fromStyle.stroke && fromStyle.stroke !== 'none' && fromStyle.width > 0);
}

function clearElementStroke(el) {
  el.setAttribute('stroke', 'none');
  el.removeAttribute('stroke-width');
  const style = el.getAttribute('style') || '';
  if (!style) return;
  const next = style
    .replace(/stroke-width\s*:\s*[^;]+;?/gi, '')
    .replace(/stroke\s*:\s*[^;]+;?/gi, '')
    .trim();
  if (next) el.setAttribute('style', next);
  else el.removeAttribute('style');
}

function rectCoversPageBounds(x, y, w, h, bounds, tolerance = 6) {
  return x <= bounds.vx + tolerance
    && y <= bounds.vy + tolerance
    && w >= bounds.vw - tolerance * 2
    && h >= bounds.vh - tolerance * 2;
}

function isPageBackgroundFill(fill) {
  const value = (fill || '').trim().toLowerCase();
  return !value || value === 'none' || value === '#fff' || value === '#ffffff' || value === 'white';
}

/** Retire cadres / traits de page du SVG CE.SDK (rect, path, line). */
function stripPageBorderFromSvg(svgEl) {
  if (!svgEl || svgEl.nodeName !== 'svg') return svgEl;

  const bounds = getPageBounds(svgEl);
  if (!bounds.vw || !bounds.vh) return svgEl;

  const toRemove = new Set();

  svgEl.querySelectorAll('rect').forEach((rect) => {
    const x = parseFloat(rect.getAttribute('x') || '0');
    const y = parseFloat(rect.getAttribute('y') || '0');
    const w = parseFloat(rect.getAttribute('width') || '0');
    const h = parseFloat(rect.getAttribute('height') || '0');
    if (!rectCoversPageBounds(x, y, w, h, bounds)) return;
    const fill = (rect.getAttribute('fill') || '').toLowerCase();
    if (hasVisibleStroke(rect) || isPageBackgroundFill(fill)) {
      toRemove.add(rect);
    }
  });

  svgEl.querySelectorAll('path').forEach((path) => {
    const d = (path.getAttribute('d') || '').replace(/\s+/g, ' ').trim();
    if (!hasVisibleStroke(path)) return;
    if (/^M\s*[0-9.+-]+\s*[0-9.+-]+\s*[HhVv]/i.test(d)) {
      toRemove.add(path);
    }
  });

  svgEl.querySelectorAll('line').forEach((line) => {
    if (!hasVisibleStroke(line)) return;
    const x1 = parseFloat(line.getAttribute('x1') || '0');
    const x2 = parseFloat(line.getAttribute('x2') || '0');
    const y1 = parseFloat(line.getAttribute('y1') || '0');
    const y2 = parseFloat(line.getAttribute('y2') || '0');
    const horizontal = isNear(y1, y2, 2) && Math.abs(x2 - x1) >= bounds.vw - 8;
    const vertical = isNear(x1, x2, 2) && Math.abs(y2 - y1) >= bounds.vh - 8;
    if (horizontal || vertical) toRemove.add(line);
  });

  toRemove.forEach((el) => el.remove());

  svgEl.querySelectorAll('rect, path, line, polygon, polyline').forEach((el) => {
    if (!hasVisibleStroke(el)) return;
    clearElementStroke(el);
  });

  return svgEl;
}

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

function portraitRotateTransform() {
  return PDF_ROTATE_CLOCKWISE
    ? `translate(${PDF_PAGE_W_PX},0) rotate(90)`
    : `translate(0,${PDF_PAGE_H_PX}) rotate(-90)`;
}

function appendPageSvgChildren(parentGroup, pageSvgEl, translateX, idPrefix, clipW, clipH, clipInsets = {}) {
  if (!pageSvgEl) return;
  prefixSvgIds(pageSvgEl, idPrefix);
  const outer = makeGroup(translateX ? `translate(${translateX},0)` : null);

  const insetLeft = clipInsets.left ?? PAGE_BORDER_CLIP_INSET_PX;
  const insetTop = clipInsets.top ?? PAGE_BORDER_CLIP_INSET_PX;
  const insetRight = clipInsets.right ?? PAGE_BORDER_CLIP_INSET_PX;
  const insetBottom = clipInsets.bottom ?? PAGE_BORDER_CLIP_INSET_PX;

  const clipId = `${idPrefix}clip`;
  const clipPath = document.createElementNS(SVG_NS, 'clipPath');
  clipPath.setAttribute('id', clipId);
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('x', String(insetLeft));
  rect.setAttribute('y', String(insetTop));
  rect.setAttribute('width', String(Math.max(0, clipW - insetLeft - insetRight)));
  rect.setAttribute('height', String(Math.max(0, clipH - insetTop - insetBottom)));
  clipPath.appendChild(rect);
  outer.appendChild(clipPath);

  const inner = makeGroup(null);
  inner.setAttribute('clip-path', `url(#${clipId})`);
  Array.from(pageSvgEl.childNodes).forEach((node) => {
    inner.appendChild(document.importNode(node, true));
  });
  outer.appendChild(inner);
  parentGroup.appendChild(outer);
}

export async function exportPageSvg(engine, pageId) {
  if (!engine?.block || pageId == null) return null;
  const blob = await withPageHiddenForExport(engine, pageId, () => engine.block.export(pageId, {
    mimeType: 'image/svg+xml',
  }));
  const text = await blob.text();
  const svgEl = parseSvgString(text);
  return svgEl ? stripPageBorderFromSvg(svgEl) : null;
}

export function buildImposedPageSvg(leftSvg, rightSvg, flip180) {
  const svg = createPageSvg();
  let parent = svg;
  if (flip180 && PDF_DUPLEX_FLIP_INSIDE_PAGE) {
    const flip = makeGroup(`rotate(180,${PDF_PAGE_W_PX / 2},${PDF_PAGE_H_PX / 2})`);
    svg.appendChild(flip);
    parent = flip;
  }
  const rot = makeGroup(portraitRotateTransform());
  const seam = PAGE_BORDER_CLIP_INSET_PX + PAGE_SEAM_CLIP_INSET_PX;
  appendPageSvgChildren(rot, leftSvg, 0, 'pdfL_', HALF_PAGE_W_PX, HALF_PAGE_H_PX, { right: seam });
  appendPageSvgChildren(rot, rightSvg, HALF_PAGE_W_PX, 'pdfR_', HALF_PAGE_W_PX, HALF_PAGE_H_PX, { left: seam });
  parent.appendChild(rot);
  return svg;
}

export async function renderSvgToPdfPage(doc, svgEl) {
  if (typeof document === 'undefined') return;
  svgEl.style.position = 'fixed';
  svgEl.style.left = '-99999px';
  svgEl.style.top = '0';
  document.body.appendChild(svgEl);
  try {
    if (typeof doc.svg === 'function') {
      await doc.svg(svgEl, { x: 0, y: 0, width: 210, height: 297 });
    } else {
      await svg2pdf(svgEl, doc, { x: 0, y: 0, width: 210, height: 297 });
    }
  } finally {
    svgEl.remove();
  }
}

/**
 * Construit un PDF A4 portrait imposé (vectoriel) à partir des pages CE.SDK.
 * @param {import('@cesdk/engine').default} engine
 * @param {number[]} pageIds — ordre éditeur (page 1 → index 0)
 */
export async function buildFoldedA4Pdf(engine, pageIds) {
  const totalPages = pageIds.length;
  if (totalPages % 4 !== 0) {
    throw new Error(`Imposition: ${totalPages} pages (attendu multiple de 4)`);
  }

  const JsPDF = getJsPdfConstructor();
  const pairs = buildImpositionPairs(totalPages);
  const pageSvgs = await Promise.all(pageIds.map((id) => exportPageSvg(engine, id)));

  const doc = new JsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });

  for (let i = 0; i < pairs.length; i += 1) {
    const [leftNum, rightNum] = pairs[i];
    const leftSvg = pageSvgs[leftNum - 1];
    const rightSvg = pageSvgs[rightNum - 1];
    if (!leftSvg || !rightSvg) {
      throw new Error(`SVG manquant pour la paire [${leftNum}|${rightNum}]`);
    }
    const pageSvg = buildImposedPageSvg(leftSvg, rightSvg, i % 2 === 1);
    if (i > 0) doc.addPage();
    await renderSvgToPdfPage(doc, pageSvg);
  }

  return doc.output('blob');
}
