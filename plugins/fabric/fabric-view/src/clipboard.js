import { DEFAULT_TEXT_FONT_FAMILY } from './constants.js';
import { getDocumentCenter, getDocumentSize } from './guides.js';
import { applyStrokeUniformDeep, newFabricImageId } from './objects.js';
import { isWrappedArtboardsJson } from './serialize.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { dataUrlToBase64, guessImageFileExtension, readFileAsDataUrl } from './utils.js';


async function loadFabricImageFromUrl(ImageApi, url) {
  if (!ImageApi || typeof ImageApi.fromURL !== 'function' || !url) return null;
  const isDataOrBlob = /^data:|^blob:/i.test(url);
  if (isDataOrBlob) {
    try {
      return await ImageApi.fromURL(url, {});
    } catch (e) {
      return null;
    }
  }
  const isRemoteHttp = /^https?:\/\//i.test(url);
  if (isRemoteHttp) {
    try {
      return await ImageApi.fromURL(url, { crossOrigin: 'anonymous' });
    } catch (e) {
      // Préprod / mock Bubble : souvent pas de CORS — retenter sans crossOrigin.
    }
    try {
      return await ImageApi.fromURL(url, {});
    } catch (e) {
      return null;
    }
  }
  try {
    return await ImageApi.fromURL(url, {});
  } catch (e) {
    return null;
  }
}


/**
 * @param {string} primaryUrl - URL Bubble (https) ou data URL (sandbox sans uploadContent)
 * @param {{ fallbackDataUrl?: string, forbidDataUrlFallback?: boolean, position?: { x: number, y: number } }} options
 *   - forbidDataUrlFallback: true après upload Bubble réussi → pas de src data: sur le canvas
 *   - position: point scène où centrer l’image (défaut : centre du document)
 * @returns {Promise<string|undefined>} `id` de l’image Fabric ajoutée, ou undefined si échec
 */
async function addRasterImageFromUrl(instance, fabricLib, primaryUrl, options) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  const log = '[FabricView image]';
  if (!fabricCanvas || !fabricLib || !primaryUrl) {
    return undefined;
  }
  const opts = options || {};
  const fallbackDataUrl = opts.fallbackDataUrl;
  const forbidFallback = opts.forbidDataUrlFallback === true;

  const ImageApi = fabricLib.Image;
  let img = await loadFabricImageFromUrl(ImageApi, primaryUrl);
  if (!img && forbidFallback) {
    console.error(log, 'Échec chargement depuis l’URL Bubble (repli data URL désactivé en prod Bubble)', primaryUrl);
  }
  if (!img && !forbidFallback && fallbackDataUrl && fallbackDataUrl !== primaryUrl) {
    img = await loadFabricImageFromUrl(ImageApi, fallbackDataUrl);
  }
  if (!img) {
    if (!forbidFallback) {
      console.error(log, 'Impossible de charger l’image (URL primaire et repli échoués)');
    }
    return undefined;
  }
  const imageId = newFabricImageId();
  const doc = getDocumentSize(instance);
  const center = getDocumentCenter(instance);
  const position = opts.position
    && Number.isFinite(Number(opts.position.x))
    && Number.isFinite(Number(opts.position.y))
    ? { x: Number(opts.position.x), y: Number(opts.position.y) }
    : center;
  const el = img._element || (typeof img.getElement === 'function' ? img.getElement() : null);
  const iw = (el && el.naturalWidth) || img.width || 100;
  const ih = (el && el.naturalHeight) || img.height || 100;
  const maxW = doc.width * 0.85;
  const maxH = doc.height * 0.85;
  let scale = 1;
  if (iw > 0 && ih > 0) {
    scale = Math.min(maxW / iw, maxH / ih, 1);
  }
  img.set({
    id: imageId,
    left: Math.round(position.x),
    top: Math.round(position.y),
    originX: 'center',
    originY: 'center',
    scaleX: scale,
    scaleY: scale,
  });
  applyStrokeUniformDeep(img);
  fabricCanvas.add(img);
  fabricCanvas.setActiveObject(img);
  fabricCanvas.requestRenderAll();
  updateTopBarForSelection(instance);
  return imageId;
}


/**
 * Flux complet fichier image → upload Bubble (si dispo) → insertion sur le canvas.
 * Partagé entre le picker d’image, le paste et le drag & drop.
 * @param {File} file
 * @param {{ position?: { x: number, y: number }, logTag?: string }} options
 * @returns {Promise<string|undefined>} `id` de l’image Fabric ajoutée, ou undefined si échec
 */
async function insertImageFileOnCanvas(instance, fabricLib, context, file, options) {
  const opts = options || {};
  const log = opts.logTag || '[FabricView image]';
  if (!file || !String(file.type || '').toLowerCase().startsWith('image/')) return undefined;
  const insertOpts = opts.position ? { position: opts.position } : {};
  try {
    const dataUrl = await readFileAsDataUrl(file);
    const base64 = dataUrlToBase64(dataUrl);
    const ext = guessImageFileExtension(file);
    const rawName = typeof file.name === 'string' && file.name.trim() ? file.name.trim() : `image${ext}`;
    const safeName = rawName.replace(/[^\w.-]/g, '_') || `image${ext}`;

    if (context && typeof context.uploadContent === 'function' && base64) {
      try {
        const uploadedUrl = await new Promise((resolve, reject) => {
          context.uploadContent(safeName, base64, (err, url) => {
            if (err) reject(err);
            else resolve(typeof url === 'string' ? url : '');
          });
        });
        const trimmed = String(uploadedUrl || '').trim();
        // blob: = mock sandbox local ; https?: = CDN Bubble en prod.
        if (/^https?:\/\/|^blob:/i.test(trimmed)) {
          // Si l'URL uploadée ne charge pas (sandbox local, CORS), repli sur la
          // data URL locale plutôt que de ne rien insérer du tout.
          return await addRasterImageFromUrl(instance, fabricLib, trimmed, {
            ...insertOpts,
            fallbackDataUrl: dataUrl,
          });
        }
        return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
      } catch (uploadErr) {
        console.error(log, 'uploadContent erreur', uploadErr);
        return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
      }
    }
    return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
  } catch (e) {
    console.error(log, 'chargement image', e);
    return undefined;
  }
}


function looksLikeSvgMarkup(text) {
  if (typeof text !== 'string') return false;
  const s = text.trim().replace(/^\uFEFF/, '');
  if (!s) return false;
  if (/^<\?xml/i.test(s)) {
    return /<svg[\s>/]/i.test(s);
  }
  return /^<svg[\s>/]/i.test(s);
}


async function addPastedSvgFromString(instance, fabricLib, svgString) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  if (!fabricCanvas || !fabricLib || typeof fabricLib.loadSVGFromString !== 'function') return;
  let objects = null;
  let options = null;
  try {
    const result = await fabricLib.loadSVGFromString(svgString);
    if (Array.isArray(result)) {
      objects = result[0];
      options = result[1];
    } else if (result && typeof result === 'object') {
      objects = result.objects;
      options = result.options;
    }
  } catch (e) {
    return;
  }
  if (!Array.isArray(objects) || objects.length === 0) return;

  const grouped = fabricLib.util.groupSVGElements(objects, options || {});
  const initialScale = 0.16;
  grouped.set({
    scaleX: initialScale,
    scaleY: initialScale,
  });
  grouped.set({
    originX: 'center',
    originY: 'center',
    centeredScaling: true,
    centeredRotation: true,
    objectCaching: false,
    strokeUniform: true,
  });
  const center = getDocumentCenter(instance);
  grouped.set({
    left: Math.round(center.x),
    top: Math.round(center.y),
  });
  applyStrokeUniformDeep(grouped);
  fabricCanvas.add(grouped);
  fabricCanvas.setActiveObject(grouped);
  fabricCanvas.requestRenderAll();
  updateTopBarForSelection(instance);
}


async function tryPasteFabricObjectsFromJson(instance, fabricLib, parsed) {
  if (!instance || !instance.data || !instance.data.fabricCanvas || !fabricLib) return false;
  if (isWrappedArtboardsJson(parsed)) return false;
  const fabricCanvas = instance.data.fabricCanvas;
  const util = fabricLib.util;
  if (!util || typeof util.enlivenObjects !== 'function') return false;

  let specs = null;
  if (Array.isArray(parsed.objects) && parsed.objects.length > 0) {
    specs = parsed.objects;
  } else if (typeof parsed.type === 'string' && parsed.type.length > 0) {
    specs = [parsed];
  }
  if (!specs || specs.length === 0) return false;

  try {
    const enlivened = await util.enlivenObjects(specs);
    if (!Array.isArray(enlivened) || enlivened.length === 0) return false;
    enlivened.forEach((o) => {
      if (o && typeof o.set === 'function') o.set({ strokeUniform: true });
    });
    const center = getDocumentCenter(instance);
    fabricCanvas.discardActiveObject();
    enlivened.forEach((o) => {
      applyStrokeUniformDeep(o);
      fabricCanvas.add(o);
    });
    if (enlivened.length === 1) {
      const o = enlivened[0];
      o.set({ originX: 'center', originY: 'center', left: center.x, top: center.y });
      if (typeof o.setCoords === 'function') o.setCoords();
      fabricCanvas.setActiveObject(o);
    } else if (typeof fabricLib.ActiveSelection === 'function') {
      const sel = new fabricLib.ActiveSelection(enlivened, { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(sel);
      sel.set({ originX: 'center', originY: 'center', left: center.x, top: center.y });
      if (typeof sel.setCoords === 'function') sel.setCoords();
    } else {
      fabricCanvas.setActiveObject(enlivened[enlivened.length - 1]);
    }
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    return true;
  } catch (e) {
    return false;
  }
}


function addPastedPlainText(instance, fabricLib, text) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  if (!fabricCanvas || !fabricLib) return;
  const doc = getDocumentSize(instance);
  const center = getDocumentCenter(instance);
  const box = new fabricLib.Textbox(text, {
    left: Math.round(center.x),
    top: Math.round(center.y),
    originX: 'center',
    originY: 'center',
    width: Math.min(560, Math.max(120, doc.width * 0.6)),
    fontFamily: DEFAULT_TEXT_FONT_FAMILY,
    fontSize: 30,
    fill: '#0f172a',
    strokeUniform: true,
  });
  fabricCanvas.add(box);
  fabricCanvas.setActiveObject(box);
  fabricCanvas.requestRenderAll();
  updateTopBarForSelection(instance);
}


async function runCanvasPasteFromClipboardData(instance, fabricLib, context, cd) {
  if (!instance || !instance.data || !fabricLib || !cd) return false;

  const files = cd.files && cd.files.length ? Array.from(cd.files) : [];
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const t = String(file.type || '').toLowerCase();
      const name = String(file.name || '');
      if (t === 'image/svg+xml' || /\.svg$/i.test(name)) {
        try {
          const svgText = await file.text();
          await addPastedSvgFromString(instance, fabricLib, svgText);
        } catch (e) {
          /* ignore */
        }
        return true;
      }
      if (t.startsWith('image/')) {
        await insertImageFileOnCanvas(instance, fabricLib, context, file, { logTag: '[FabricView paste]' });
        return true;
      }
    }
  }

  const plain = cd.getData('text/plain');
  if (typeof plain !== 'string') return false;
  const trimmed = plain.trim();
  if (!trimmed) return false;

  if (looksLikeSvgMarkup(trimmed)) {
    await addPastedSvgFromString(instance, fabricLib, trimmed);
    return true;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (isWrappedArtboardsJson(parsed)) {
      return false;
    }
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.objects) && parsed.objects.length === 0) {
      return true;
    }
    const ok = await tryPasteFabricObjectsFromJson(instance, fabricLib, parsed);
    if (ok) return true;
  } catch (e) {
    /* not JSON */
  }

  addPastedPlainText(instance, fabricLib, trimmed);
  return true;
}


async function buildClipboardDataFromNavigatorRead() {
  const files = [];
  let textPlain = '';
  if (navigator.clipboard && navigator.clipboard.read) {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            let ext = 'png';
            if (type === 'image/svg+xml') ext = 'svg';
            else if (type === 'image/jpeg') ext = 'jpg';
            else if (type === 'image/gif') ext = 'gif';
            else if (type === 'image/webp') ext = 'webp';
            else {
              const m = type.match(/image\/([^+;\s]+)/);
              if (m) ext = m[1];
            }
            files.push(new File([blob], `clipboard.${ext}`, { type }));
          }
          if (type === 'text/plain' && textPlain === '') {
            const blob = await item.getType(type);
            textPlain = await blob.text();
          }
        }
      }
    } catch (e) {
      /* permission or empty */
    }
  }
  if (!textPlain && navigator.clipboard && navigator.clipboard.readText) {
    try {
      textPlain = await navigator.clipboard.readText();
    } catch (e) {
      /* ignore */
    }
  }
  return {
    files: {
      length: files.length,
      item: (idx) => files[idx],
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) yield files[i];
      },
    },
    getData(type) {
      return type === 'text/plain' ? textPlain : '';
    },
  };
}


async function clipboardHasPastableContent() {
  if (!navigator.clipboard) return false;
  try {
    if (navigator.clipboard.readText) {
      const t = await navigator.clipboard.readText();
      if (t && String(t).trim()) return true;
    }
  } catch (e) {
    /* ignore */
  }
  try {
    if (navigator.clipboard.read) {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (String(type || '').startsWith('image/')) return true;
        }
      }
    }
  } catch (e) {
    /* ignore */
  }
  return false;
}


async function handleClipboardPasteEvent(event, instance, fabricLib, context) {
  if (!event || !instance || !instance.data || !fabricLib) return;
  const fabricCanvas = instance.data.fabricCanvas;
  if (shouldIgnorePaste(event.target, fabricCanvas)) return;

  const cd = event.clipboardData;
  if (!cd) return;

  const consumed = await runCanvasPasteFromClipboardData(instance, fabricLib, context, cd);
  if (consumed) event.preventDefault();
}


function isTypingContext(target) {
  if (!target) return false;
  const tag = target.tagName ? String(target.tagName).toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  return false;
}


function shouldIgnorePaste(target, fabricCanvas) {
  if (isTypingContext(target)) return true;
  if (!fabricCanvas) return false;
  const active = fabricCanvas.getActiveObject();
  if (active && active.isEditing === true) return true;
  return false;
}


function isFabricHiddenTextarea(target) {
  if (!target || typeof target.getAttribute !== 'function') return false;
  return target.getAttribute('data-fabric') === 'textarea';
}


/** Ne pas voler Ctrl+C hors canvas : champs HTML + édition iText / Textbox. La textarea cachée Fabric hors édition ne bloque pas. */
function shouldBlockFabricCopyShortcut(target, fabricCanvas) {
  if (isFabricHiddenTextarea(target)) {
    const active = fabricCanvas ? fabricCanvas.getActiveObject() : null;
    return !!(active && active.isEditing);
  }
  if (isTypingContext(target)) return true;
  if (!fabricCanvas) return true;
  const active = fabricCanvas.getActiveObject();
  if (active && active.isEditing) return true;
  return false;
}

export {
  loadFabricImageFromUrl,
  addRasterImageFromUrl,
  insertImageFileOnCanvas,
  looksLikeSvgMarkup,
  addPastedSvgFromString,
  tryPasteFabricObjectsFromJson,
  addPastedPlainText,
  runCanvasPasteFromClipboardData,
  buildClipboardDataFromNavigatorRead,
  clipboardHasPastableContent,
  handleClipboardPasteEvent,
  isTypingContext,
  shouldIgnorePaste,
  isFabricHiddenTextarea,
  shouldBlockFabricCopyShortcut,
};
