import { ARTBOARD_PRESETS, ARTBOARD_VIEWER_MARGIN_PX } from './constants.js';
import { getActiveSelectionTargets, isTextLikeObject } from './objects.js';
import { loadFromJsonPromise, publishCanvasJson } from './serialize.js';
import { syncImageCornerRadiusClipsOnCanvas } from './shapes.js';
import { applyTextboxEditingControls, loadWebFontsThenRedraw } from './text.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { clampArtboardIndex, computeFit } from './utils.js';


function getActivePreset(instance) {
  const idx = clampArtboardIndex(instance && instance.data ? instance.data.activeArtboardIndex : 0);
  return ARTBOARD_PRESETS[idx];
}


function getDocumentSize(instance) {
  const p = getActivePreset(instance);
  return { width: p.width, height: p.height };
}


function ensureArtboardAtBack(instance) {
  if (!instance || !instance.data) return;
  const canvas = instance.data.fabricCanvas;
  const artboard = instance.data.artboardRect;
  if (!canvas || !artboard) return;
  if (typeof canvas.sendObjectToBack === 'function') {
    canvas.sendObjectToBack(artboard);
  } else if (typeof artboard.sendToBack === 'function') {
    artboard.sendToBack();
  }
}


function getDocumentMargins(instance) {
  const p = getActivePreset(instance);
  return {
    top: p.marginTop,
    right: p.marginRight,
    bottom: p.marginBottom,
    left: p.marginLeft,
  };
}


function rebindArtboardFromCanvas(instance) {
  const canvas = instance && instance.data ? instance.data.fabricCanvas : null;
  if (!canvas) return;
  const objs = canvas.getObjects();
  const artboard = objs.find((o) => o && o.isArtboard)
    || objs.find((o) => o && String(o.type || '') === 'rect' && o.excludeFromExport);
  instance.data.artboardRect = artboard || null;
}


function stripSafeZoneObjects(instance) {
  const canvas = instance && instance.data ? instance.data.fabricCanvas : null;
  if (!canvas) return;
  const toRemove = canvas.getObjects().filter((o) => o && o.isSafeZone);
  toRemove.forEach((o) => {
    try {
      canvas.remove(o);
    } catch (e) {
      /* ignore */
    }
  });
  instance.data.marginGuideLines = {
    top: null, right: null, bottom: null, left: null, fold: null,
  };
}


function finalizeAfterArtboardLoad(instance, fabricLib) {
  if (!instance || !instance.data || !fabricLib) return;
  rebindArtboardFromCanvas(instance);
  stripSafeZoneObjects(instance);
  const doc = getDocumentSize(instance);
  let artboard = instance.data.artboardRect;
  if (!artboard) {
    ensureArtboardRect(instance, fabricLib);
  } else {
    artboard.set({
      left: 0,
      top: 0,
      width: doc.width,
      height: doc.height,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      isArtboard: true,
      stroke: 'transparent',
      fill: '#ffffff',
    });
    if (typeof artboard.setCoords === 'function') artboard.setCoords();
  }
  ensureArtboardAtBack(instance);
  syncGuideLayers(instance);
  ensureCanvasSize(instance);
  const canvas = instance.data.fabricCanvas;
  if (canvas) syncImageCornerRadiusClipsOnCanvas(canvas, fabricLib);
  // Textes rechargés depuis le JSON : on applique la config de poignées et on
  // remesure une fois les web fonts prêtes (sinon métriques fallback => curseur décalé).
  if (canvas && typeof canvas.getObjects === 'function') {
    const textObjects = canvas.getObjects().filter((o) => isTextLikeObject(o));
    textObjects.forEach((t) => applyTextboxEditingControls(t));
    if (textObjects.length > 0) loadWebFontsThenRedraw(canvas, textObjects);
  }
}


function goToArtboard(instance, targetIndex, opts) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  const fabricLib = instance && instance.data ? instance.data.fabricLib : null;
  if (!fabricCanvas || !fabricLib) return Promise.resolve();
  const skipSave = opts && opts.skipSave;
  const idx = clampArtboardIndex(targetIndex);
  const prev = clampArtboardIndex(instance.data.activeArtboardIndex);
  if (!Array.isArray(instance.data.pageSnapshots)) {
    instance.data.pageSnapshots = [null, null, null];
  }
  if (!skipSave) {
    try {
      instance.data.pageSnapshots[prev] = fabricCanvas.toJSON();
    } catch (e) {
      /* ignore */
    }
  }
  instance.data._artboardSwapInProgress = true;
  fabricCanvas.discardActiveObject();
  instance.data.zoomScale = 1;
  instance.data.panX = 0;
  instance.data.panY = 0;
  instance.data.activeArtboardIndex = idx;
  const preset = ARTBOARD_PRESETS[idx];
  instance.data.canvasWidth = preset.width;
  instance.data.canvasHeight = preset.height;
  const snap = instance.data.pageSnapshots[idx];
  const loadInput = snap != null ? snap : { objects: [] };
  const p = loadFromJsonPromise(fabricCanvas, loadInput);
  return p
    .then(() => finalizeAfterArtboardLoad(instance, fabricLib))
    .finally(() => {
      instance.data._artboardSwapInProgress = false;
    });
}


function ensureMarginGuidesAtFront(instance) {
  if (!instance || !instance.data) return;
  const canvas = instance.data.fabricCanvas;
  const guides = instance.data.marginGuideLines;
  if (!canvas || !guides) return;
  ['top', 'right', 'bottom', 'left', 'fold'].forEach((key) => {
    const line = guides[key];
    if (!line) return;
    if (typeof canvas.bringObjectToFront === 'function') {
      canvas.bringObjectToFront(line);
    } else if (typeof line.bringToFront === 'function') {
      line.bringToFront();
    }
  });
}


function ensureMarginGuideLines(instance, fabricLib) {
  if (!instance || !instance.data || !instance.data.fabricCanvas || !fabricLib) return;
  const canvas = instance.data.fabricCanvas;
  const LineCtor = fabricLib.Line;
  if (typeof LineCtor !== 'function') return;
  const doc = getDocumentSize(instance);
  const dw = doc.width;
  const dh = doc.height;
  const m = getDocumentMargins(instance);
  const vpScale = Math.max(1e-6, Number(instance.data.viewport && instance.data.viewport.scale) || 1);
  const strokeDoc = 1 / vpScale;

  if (instance.data.safeZoneRect) {
    try {
      canvas.remove(instance.data.safeZoneRect);
    } catch (e) {
      /* ignore */
    }
    instance.data.safeZoneRect = null;
  }

  if (!instance.data.marginGuideLines) {
    instance.data.marginGuideLines = {
      top: null, right: null, bottom: null, left: null, fold: null,
    };
  }
  const guides = instance.data.marginGuideLines;

  const baseOpts = {
    stroke: '#7dd3fc',
    strokeWidth: strokeDoc,
    strokeUniform: true,
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    excludeFromExport: true,
    isSafeZone: true,
  };

  const upsertLine = (key, show, x1, y1, x2, y2, stylePatch) => {
    const lineOpts = { ...baseOpts, ...(stylePatch || {}) };
    if (!show) {
      if (guides[key]) {
        try {
          canvas.remove(guides[key]);
        } catch (e) {
          /* ignore */
        }
        guides[key] = null;
      }
      return;
    }
    if (!guides[key]) {
      guides[key] = new LineCtor([x1, y1, x2, y2], { ...lineOpts });
      canvas.add(guides[key]);
    } else {
      guides[key].set({
        x1,
        y1,
        x2,
        y2,
        strokeWidth: strokeDoc,
        visible: true,
        stroke: lineOpts.stroke,
        strokeUniform: lineOpts.strokeUniform,
        ...(stylePatch && stylePatch.strokeDashArray != null
          ? { strokeDashArray: stylePatch.strokeDashArray }
          : {}),
      });
      if (typeof guides[key].setCoords === 'function') guides[key].setCoords();
    }
  };

  upsertLine('top', m.top > 0 && m.top < dh, 0, m.top, dw, m.top);
  upsertLine('bottom', m.bottom > 0 && m.bottom < dh, 0, dh - m.bottom, dw, dh - m.bottom);
  upsertLine('left', m.left > 0 && m.left < dw, m.left, 0, m.left, dh);
  upsertLine('right', m.right > 0 && m.right < dw, dw - m.right, 0, dw - m.right, dh);

  const isMiddleSpread = clampArtboardIndex(instance.data.activeArtboardIndex) === 1;
  const midX = dw / 2;
  upsertLine(
    'fold',
    isMiddleSpread && midX > 0.5 && midX < dw - 0.5,
    midX,
    0,
    midX,
    dh,
    {
      stroke: '#cbd5e1',
      strokeDashArray: [8, 6],
    },
  );
}


function syncGuideLayers(instance) {
  ensureArtboardAtBack(instance);
  ensureMarginGuideLines(instance, instance.data.fabricLib);
  ensureMarginGuidesAtFront(instance);
}


/** Après bring/send sur le contenu : page au fond + guides au-dessus, sans recréer les lignes (évite un réordonnancement inutile de la pile). */
function syncGuideStackAfterUserZOrder(instance) {
  if (!instance || !instance.data) return;
  rebindArtboardFromCanvas(instance);
  ensureArtboardAtBack(instance);
  ensureMarginGuidesAtFront(instance);
}


function ensureArtboardRect(instance, fabricLib) {
  if (!instance || !instance.data) return null;
  const canvas = instance.data.fabricCanvas;
  if (!canvas || !fabricLib) return null;
  const doc = getDocumentSize(instance);
  let artboard = instance.data.artboardRect || null;
  if (!artboard) {
    artboard = new fabricLib.Rect({
      left: 0,
      top: 0,
      width: doc.width,
      height: doc.height,
      originX: 'left',
      originY: 'top',
      fill: '#ffffff',
      stroke: 'transparent',
      strokeWidth: 0,
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      excludeFromExport: true,
      isArtboard: true,
    });
    canvas.add(artboard);
    instance.data.artboardRect = artboard;
  } else {
    artboard.set({
      left: 0,
      top: 0,
      width: doc.width,
      height: doc.height,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      isArtboard: true,
      stroke: 'transparent',
      fill: '#ffffff',
    });
  }
  ensureArtboardAtBack(instance);
  return artboard;
}


function applyViewportTransform(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas || !instance.data.viewport) return;
  const fabricCanvas = instance.data.fabricCanvas;
  const viewport = instance.data.viewport;
  fabricCanvas.setViewportTransform([
    viewport.scale,
    0,
    0,
    viewport.scale,
    viewport.offsetX,
    viewport.offsetY,
  ]);
}


function getDocumentCenter(instance) {
  const doc = getDocumentSize(instance);
  return {
    x: doc.width / 2,
    y: doc.height / 2,
  };
}


function unionBoundingRectOfObjects(objects) {
  let minL = Infinity;
  let minT = Infinity;
  let maxR = -Infinity;
  let maxB = -Infinity;
  objects.forEach((obj) => {
    if (!obj || obj.isArtboard || obj.isSafeZone) return;
    obj.setCoords();
    const br = obj.getBoundingRect();
    minL = Math.min(minL, br.left);
    minT = Math.min(minT, br.top);
    maxR = Math.max(maxR, br.left + br.width);
    maxB = Math.max(maxB, br.top + br.height);
  });
  if (!Number.isFinite(minL)) return null;
  return {
    left: minL,
    top: minT,
    width: maxR - minL,
    height: maxB - minT,
    right: maxR,
    bottom: maxB,
  };
}


function deltasForAlignInUnion(br, union, mode) {
  let dx = 0;
  let dy = 0;
  const cx = br.left + br.width / 2;
  const cy = br.top + br.height / 2;
  const uc = union.left + union.width / 2;
  const vc = union.top + union.height / 2;
  if (mode === 'left') dx = union.left - br.left;
  else if (mode === 'center-h') dx = uc - cx;
  else if (mode === 'right') dx = union.right - (br.left + br.width);
  else if (mode === 'top') dy = union.top - br.top;
  else if (mode === 'middle') dy = vc - cy;
  else if (mode === 'bottom') dy = union.bottom - (br.top + br.height);
  return { dx, dy };
}


/** Cadre pour aligner un seul objet sur les bords (gauche/droite/haut/bas) : zone intérieure aux marges si définie, sinon artboard. Les centres H/V utilisent toujours l’artboard plein. */
function getSingleObjectAlignFrame(instance) {
  const doc = getDocumentSize(instance);
  const docW = doc.width;
  const docH = doc.height;
  const m = getDocumentMargins(instance);
  const innerW = docW - m.left - m.right;
  const innerH = docH - m.top - m.bottom;
  const hasAnyMargin = m.left > 0 || m.right > 0 || m.top > 0 || m.bottom > 0;
  if (hasAnyMargin && innerW > 0 && innerH > 0) {
    return {
      left: m.left,
      top: m.top,
      right: docW - m.right,
      bottom: docH - m.bottom,
      width: innerW,
      height: innerH,
    };
  }
  return {
    left: 0,
    top: 0,
    right: docW,
    bottom: docH,
    width: docW,
    height: docH,
  };
}


function alignSelectionToDocument(instance, fabricCanvas, mode) {
  if (!instance || !fabricCanvas || !mode) return;
  const active = fabricCanvas.getActiveObject();
  if (!active || active.isArtboard || active.isSafeZone) return;
  const targets = getActiveSelectionTargets(fabricCanvas).filter(
    (o) => o && !o.isArtboard && !o.isSafeZone,
  );
  if (targets.length === 0) return;

  if (targets.length === 1) {
    const target = targets[0];
    target.setCoords();
    const br = target.getBoundingRect();
    const doc = getDocumentSize(instance);
    const docW = doc.width;
    const docH = doc.height;
    const docCx = docW / 2;
    const docCy = docH / 2;
    const frame = getSingleObjectAlignFrame(instance);
    let dx = 0;
    let dy = 0;
    if (mode === 'left') dx = frame.left - br.left;
    else if (mode === 'center-h') dx = docCx - (br.left + br.width / 2);
    else if (mode === 'right') dx = frame.right - (br.left + br.width);
    else if (mode === 'top') dy = frame.top - br.top;
    else if (mode === 'middle') dy = docCy - (br.top + br.height / 2);
    else if (mode === 'bottom') dy = frame.bottom - (br.top + br.height);
    else return;
    if (dx === 0 && dy === 0) return;
    target.set({
      left: target.left + dx,
      top: target.top + dy,
    });
    target.setCoords();
  } else {
    const fabricLib = instance.data.fabricLib;
    const union = unionBoundingRectOfObjects(targets);
    if (!union) return;
    const items = targets.slice();
    fabricCanvas.discardActiveObject();
    items.forEach((obj) => {
      if (!obj || obj.isArtboard || obj.isSafeZone) return;
      obj.setCoords();
      const br = obj.getBoundingRect();
      const { dx, dy } = deltasForAlignInUnion(br, union, mode);
      if (dx === 0 && dy === 0) return;
      obj.set({
        left: obj.left + dx,
        top: obj.top + dy,
      });
      obj.setCoords();
    });
    if (items.length > 1 && fabricLib && typeof fabricLib.ActiveSelection === 'function') {
      const sel = new fabricLib.ActiveSelection(items, { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(sel);
      sel.setCoords();
    }
  }

  fabricCanvas.requestRenderAll();
  syncGuideLayers(instance);
  publishCanvasJson(instance);
  updateTopBarForSelection(instance);
}


function ensureCanvasSize(instance) {
  const fabricCanvas = instance.data.fabricCanvas;
  const ui = instance.data.ui;
  if (!fabricCanvas || !ui || !ui.board) return;
  const width = Math.max(Number(ui.board.clientWidth) || 1, 1);
  const height = Math.max(Number(ui.board.clientHeight) || 1, 1);
  const doc = getDocumentSize(instance);
  const margin = Math.max(0, Number(ARTBOARD_VIEWER_MARGIN_PX) || 0);
  const fitAreaWidth = Math.max(1, width - margin * 2);
  const fitAreaHeight = Math.max(1, height - margin * 2);
  const fit = computeFit(fitAreaWidth, fitAreaHeight, doc.width, doc.height);
  const zoomScale = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
  const scaled = fit.scale * zoomScale;
  const panX = Number.isFinite(Number(instance.data.panX)) ? Number(instance.data.panX) : 0;
  const panY = Number.isFinite(Number(instance.data.panY)) ? Number(instance.data.panY) : 0;
  const offsetX = (width - doc.width * scaled) / 2 + panX;
  const offsetY = (height - doc.height * scaled) / 2 + panY;
  instance.data.viewport = {
    docW: doc.width,
    docH: doc.height,
    scale: scaled,
    offsetX,
    offsetY,
    zoomScale,
    panX,
    panY,
  };

  fabricCanvas.setDimensions({ width, height });
  applyViewportTransform(instance);
  const artboard = ensureArtboardRect(instance, instance.data.fabricLib);
  if (artboard) {
    artboard.set({
      left: 0,
      top: 0,
      width: doc.width,
      height: doc.height,
      strokeWidth: 0,
    });
    if (typeof artboard.setCoords === 'function') artboard.setCoords();
  }
  syncGuideLayers(instance);
  fabricCanvas.requestRenderAll();
}

export {
  getActivePreset,
  getDocumentSize,
  ensureArtboardAtBack,
  getDocumentMargins,
  rebindArtboardFromCanvas,
  stripSafeZoneObjects,
  finalizeAfterArtboardLoad,
  goToArtboard,
  ensureMarginGuidesAtFront,
  ensureMarginGuideLines,
  syncGuideLayers,
  syncGuideStackAfterUserZOrder,
  ensureArtboardRect,
  applyViewportTransform,
  getDocumentCenter,
  unionBoundingRectOfObjects,
  deltasForAlignInUnion,
  getSingleObjectAlignFrame,
  alignSelectionToDocument,
  ensureCanvasSize,
};
