import {
  createRandomSeedObjects,
  createDefaultTextbox,
  ensureHexColor,
  getObjectStyle,
} from '../shared-code.js';
import { createFlatColorPicker } from '../../shared/flat-color-picker.js';

function resolveFabric() {
  if (window.fabric) return window.fabric;
  if (window.Fabric) return window.Fabric;
  return null;
}

const TOOLBAR_VISIBILITY_BY_TYPE = {
  default: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false },
  rect: { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: false },
  circle: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false },
  textbox: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true },
  text: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true },
  iText: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true },
};

const PHOSPHOR_REGULAR_ICONS_FALLBACK = [
  'smiley', 'heart', 'star', 'house', 'user', 'users', 'bell', 'camera', 'image', 'chat-circle',
  'paper-plane-tilt', 'bookmark', 'calendar', 'clock', 'gear', 'lightbulb', 'cloud', 'sun',
  'moon', 'rocket', 'leaf', 'music-note', 'shopping-cart', 'gift', 'globe', 'map-pin',
];
const PHOSPHOR_STYLES = ['regular', 'bold', 'fill', 'light', 'thin', 'duotone'];
const ARTBOARD_VIEWER_MARGIN_PX = 24;

function stripStyleSuffix(iconFileName, style) {
  if (typeof iconFileName !== 'string') return '';
  const raw = iconFileName.replace('.svg', '');
  if (style === 'regular') return raw;
  const suffix = `-${style}`;
  return raw.endsWith(suffix) ? raw.slice(0, -suffix.length) : raw;
}

function getStyleAssetFileName(iconName, style) {
  if (typeof iconName !== 'string') return '';
  const safeName = iconName.trim();
  if (!safeName) return '';
  if (style === 'regular') return `${safeName}.svg`;
  return `${safeName}-${style}.svg`;
}

function getToolbarVisibilityForTarget(target) {
  if (!target) return TOOLBAR_VISIBILITY_BY_TYPE.default;
  if (target.iconKind) {
    return { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: false };
  }
  if (isRoundedPolygonShape(target)) {
    return { ...TOOLBAR_VISIBILITY_BY_TYPE.default, radius: true };
  }
  const key = String(target.type || 'default');
  return TOOLBAR_VISIBILITY_BY_TYPE[key] || TOOLBAR_VISIBILITY_BY_TYPE.default;
}

function isSelectionContainer(active) {
  if (!active || typeof active.getObjects !== 'function') return false;
  const normalize = (value) => String(value || '').toLowerCase().replace(/[\s_-]/g, '');
  const type = normalize(active.type);
  if (type === 'activeselection') return true;
  const ctorName = normalize(active.constructor && active.constructor.name);
  if (ctorName === 'activeselection') return true;
  return false;
}

function getActiveSelectionTargets(fabricCanvas) {
  if (!fabricCanvas) return [];
  const active = fabricCanvas.getActiveObject();
  if (!active) return [];
  if (isSelectionContainer(active)) {
    const objects = active.getObjects();
    return Array.isArray(objects) ? objects.filter(Boolean) : [];
  }
  return [active];
}

function getSharedToolbarVisibility(targets) {
  if (!Array.isArray(targets) || targets.length === 0) return TOOLBAR_VISIBILITY_BY_TYPE.default;
  const initial = { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: true };
  return targets.reduce((acc, target) => {
    const v = getToolbarVisibilityForTarget(target);
    return {
      fill: !!(acc.fill && v.fill),
      stroke: !!(acc.stroke && v.stroke),
      strokeWidth: !!(acc.strokeWidth && v.strokeWidth),
      radius: !!(acc.radius && v.radius),
      fontSize: !!(acc.fontSize && v.fontSize),
    };
  }, initial);
}

function getSharedValue(items, getter) {
  if (!Array.isArray(items) || items.length === 0) return { mixed: true, value: null };
  const first = getter(items[0]);
  for (let i = 1; i < items.length; i += 1) {
    if (getter(items[i]) !== first) return { mixed: true, value: null };
  }
  return { mixed: false, value: first };
}

function getRectCornerRadiusPx(target) {
  if (!target || target.type !== 'rect') return 0;
  if (Number.isFinite(Number(target.cornerRadiusPx))) {
    return Math.max(0, Number(target.cornerRadiusPx));
  }
  const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
  const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
  const rx = Number.isFinite(Number(target.rx)) ? Number(target.rx) : 0;
  const ry = Number.isFinite(Number(target.ry)) ? Number(target.ry) : rx;
  return Math.max(0, Math.min(rx * sx, ry * sy));
}

function applyRectCornerRadiusPx(target, radiusPx) {
  if (!target || target.type !== 'rect') return;
  const safeRadiusPx = Math.max(0, Number(radiusPx) || 0);
  const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
  const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
  target.set({
    cornerRadiusPx: safeRadiusPx,
    rx: safeRadiusPx / sx,
    ry: safeRadiusPx / sy,
  });
}

function applyStrokeUniformDeep(target) {
  if (!target) return;
  if (typeof target.set === 'function' && Object.prototype.hasOwnProperty.call(target, 'strokeWidth')) {
    target.set({ strokeUniform: true });
  }
  if (typeof target.getObjects === 'function') {
    const children = target.getObjects();
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child && typeof child.set === 'function' && Object.prototype.hasOwnProperty.call(child, 'strokeWidth')) {
          child.set({ strokeUniform: true });
        }
      });
    }
  }
}

function applyZOrderToSelection(fabricCanvas, action) {
  if (!fabricCanvas) return;
  const targets = getActiveSelectionTargets(fabricCanvas);
  if (!Array.isArray(targets) || targets.length === 0) return;
  const objects = fabricCanvas.getObjects();
  const ordered = [...targets].sort((a, b) => objects.indexOf(a) - objects.indexOf(b));

  const bringFront = (obj) => {
    if (typeof fabricCanvas.bringObjectToFront === 'function') fabricCanvas.bringObjectToFront(obj);
    else if (typeof obj.bringToFront === 'function') obj.bringToFront();
  };
  const sendBack = (obj) => {
    if (typeof fabricCanvas.sendObjectToBack === 'function') fabricCanvas.sendObjectToBack(obj);
    else if (typeof obj.sendToBack === 'function') obj.sendToBack();
  };
  const bringForward = (obj) => {
    if (typeof fabricCanvas.bringObjectForward === 'function') fabricCanvas.bringObjectForward(obj, false);
    else if (typeof obj.bringForward === 'function') obj.bringForward(false);
  };
  const sendBackward = (obj) => {
    if (typeof fabricCanvas.sendObjectBackwards === 'function') fabricCanvas.sendObjectBackwards(obj, false);
    else if (typeof obj.sendBackwards === 'function') obj.sendBackwards(false);
  };

  if (action === 'to-front') {
    ordered.forEach((obj) => bringFront(obj));
  } else if (action === 'forward') {
    [...ordered].reverse().forEach((obj) => bringForward(obj));
  } else if (action === 'backward') {
    ordered.forEach((obj) => sendBackward(obj));
  } else if (action === 'to-back') {
    [...ordered].reverse().forEach((obj) => sendBack(obj));
  }

  fabricCanvas.requestRenderAll();
}

function isTextLikeObject(target) {
  if (!target) return false;
  const t = String(target.type || '');
  return t === 'textbox' || t === 'text' || t === 'iText';
}

function isRoundedPolygonShape(target) {
  if (!target) return false;
  return target.shapeKind === 'triangle' || target.shapeKind === 'star';
}

function isShapeObject(target) {
  if (!target) return false;
  if (String(target.type || '') === 'group') return true;
  if (target.iconKind && String(target.type || '') === 'group') return true;
  const t = String(target.type || '');
  return t === 'rect'
    || t === 'circle'
    || t === 'ellipse'
    || t === 'triangle'
    || t === 'polygon'
    || t === 'path'
    || isRoundedPolygonShape(target);
}

function isCornerControl(controlName) {
  return controlName === 'tl' || controlName === 'tr' || controlName === 'bl' || controlName === 'br';
}

function isTransparentColor(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === 'transparent' || v === '#00000000' || v === 'rgba(0,0,0,0)' || v === 'rgba(0, 0, 0, 0)';
}

function normalizeCanvasColor(value, fallback) {
  return isTransparentColor(value) ? 'transparent' : ensureHexColor(value, fallback);
}

function shouldZeroStrokeWidth(colorValue) {
  if (typeof colorValue !== 'string') return false;
  const v = colorValue.trim().toLowerCase();
  return v === 'transparent' || v === '#00000000' || v === 'rgba(0,0,0,0)' || v === 'rgba(0, 0, 0, 0)';
}

async function fetchAllPhosphorIconsByStyle(style) {
  const fallback = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
  const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : 'regular';
  try {
    const response = await fetch('https://data.jsdelivr.com/v1/package/npm/@phosphor-icons/core@2.1.1', {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return fallback;
    const payload = await response.json();
    const roots = Array.isArray(payload && payload.files) ? payload.files : [];
    if (roots.length === 0) return fallback;

    const iconSet = new Set();
    const walk = (node, prefix) => {
      if (!node || typeof node !== 'object') return;
      const name = typeof node.name === 'string' ? node.name : '';
      const nextPath = prefix ? `${prefix}/${name}` : name;
      if (node.type === 'file') {
        if (nextPath.startsWith(`assets/${safeStyle}/`) && nextPath.endsWith('.svg')) {
          const fileName = nextPath.replace(`assets/${safeStyle}/`, '');
          const normalized = stripStyleSuffix(fileName, safeStyle);
          if (normalized) iconSet.add(normalized);
        }
        return;
      }
      const children = Array.isArray(node.files) ? node.files : [];
      children.forEach((child) => walk(child, nextPath));
    };
    roots.forEach((node) => walk(node, ''));

    const result = Array.from(iconSet).filter(Boolean).sort((a, b) => a.localeCompare(b));
    return result.length > 0 ? result : fallback;
  } catch (e) {
    return fallback;
  }
}

function oppositeOriginForCorner(corner) {
  if (corner === 'tl') return { x: 'right', y: 'bottom' };
  if (corner === 'tr') return { x: 'left', y: 'bottom' };
  if (corner === 'bl') return { x: 'right', y: 'top' };
  if (corner === 'br') return { x: 'left', y: 'top' };
  return null;
}

function publishCanvasJson(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) return;
  try {
    const payload = JSON.stringify(instance.data.fabricCanvas.toJSON());
    instance.publishState('canvas_json', payload);
  } catch (e) {
    instance.publishState('canvas_json', '{}');
  }
}

function readDocumentDimension(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function getDocumentSize(instance) {
  const fallbackWidth = 1000;
  const fallbackHeight = 1000;
  const data = instance && instance.data ? instance.data : {};
  const width = readDocumentDimension(data.canvasWidth, fallbackWidth);
  const height = readDocumentDimension(data.canvasHeight, fallbackHeight);
  return { width, height };
}

function computeFit(boardWidth, boardHeight, docWidth, docHeight) {
  const safeBoardW = Math.max(Number(boardWidth) || 1, 1);
  const safeBoardH = Math.max(Number(boardHeight) || 1, 1);
  const safeDocW = Math.max(Number(docWidth) || 1, 1);
  const safeDocH = Math.max(Number(docHeight) || 1, 1);
  const scale = Math.min(safeBoardW / safeDocW, safeBoardH / safeDocH);
  const offsetX = (safeBoardW - safeDocW * scale) / 2;
  const offsetY = (safeBoardH - safeDocH * scale) / 2;
  return { scale, offsetX, offsetY };
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

function normalizeObjectScale(target) {
  if (!target || typeof target.set !== 'function') return;
  if (target.type === 'activeSelection') return;
  const scaleX = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
  const scaleY = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
  if (scaleX === 1 && scaleY === 1) return;

  const type = target.type || '';
  // Keep all shapes as scaled objects so side handles can deform them.
  if (isShapeObject(target)) {
    return;
  }

  if (isTextLikeObject(target)) {
    const currentFontSize = Number.isFinite(Number(target.fontSize)) ? Number(target.fontSize) : 16;
    // Text resize should update glyph size while keeping control box stable.
    const nextFontSize = Math.max(1, Math.round(currentFontSize * scaleY));
    target.set('fontSize', nextFontSize);
    // For textbox, horizontal resize controls wrapping width.
    if (type === 'textbox' && Number.isFinite(Number(target.width))) {
      target.set('width', Math.max(1, Number(target.width) * scaleX));
    }
    target.set({ scaleX: 1, scaleY: 1 });
    if (typeof target.initDimensions === 'function') target.initDimensions();
    return;
  }
  if (Number.isFinite(Number(target.width))) {
    target.set('width', Math.max(1, Number(target.width) * scaleX));
  }
  if (Number.isFinite(Number(target.height))) {
    target.set('height', Math.max(1, Number(target.height) * scaleY));
  }
  target.set({ scaleX: 1, scaleY: 1 });
}

function buildShell() {
  const styleTopNumberInput = (input) => {
    input.style.width = '56px';
    input.style.height = '28px';
    input.style.border = '1px solid #cbd5e1';
    input.style.borderRadius = '8px';
    input.style.padding = '0 8px';
    input.style.background = '#ffffff';
    input.style.color = '#0f172a';
    input.style.fontSize = '12px';
    input.style.fontWeight = '500';
    input.style.letterSpacing = '0';
    input.style.transition = 'border-color 120ms ease, background-color 120ms ease';
    input.style.outline = 'none';
    input.style.boxSizing = 'border-box';
    input.style.appearance = 'none';
    input.style.webkitAppearance = 'none';
    input.style.MozAppearance = 'textfield';
    input.addEventListener('focus', () => {
      input.style.borderColor = '#94a3b8';
      input.style.background = '#ffffff';
      input.style.boxShadow = 'none';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#cbd5e1';
      input.style.background = '#ffffff';
      input.style.boxShadow = 'none';
    });
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      const step = Number.isFinite(Number(input.step)) ? Number(input.step) : 1;
      const min = Number.isFinite(Number(input.min)) ? Number(input.min) : -Infinity;
      const max = Number.isFinite(Number(input.max)) ? Number(input.max) : Infinity;
      const base = Number.isFinite(Number(input.value)) ? Number(input.value) : (Number.isFinite(min) ? min : 0);
      const delta = event.key === 'ArrowUp' ? step : -step;
      const next = Math.max(min, Math.min(max, base + delta));
      input.value = String(next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };

  const root = document.createElement('div');
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.position = 'relative';
  root.style.background = '#f8fafc';
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";

  const topBar = document.createElement('div');
  topBar.style.display = 'flex';
  topBar.style.visibility = 'hidden';
  topBar.style.alignItems = 'center';
  topBar.style.justifyContent = 'flex-end';
  topBar.style.gap = '10px';
  topBar.style.padding = '10px 12px';
  topBar.style.background = '#ffffff';
  topBar.style.borderBottom = '1px solid #e2e8f0';
  topBar.style.flexShrink = '0';

  const fillControl = createFlatColorPicker({ label: 'Fill', initialColor: '#111827', swatchMode: 'fill' });
  const strokeControl = createFlatColorPicker({ label: 'Stroke', initialColor: '#000000', swatchMode: 'stroke' });

  const strokeWidthInput = document.createElement('input');
  strokeWidthInput.type = 'text';
  strokeWidthInput.inputMode = 'numeric';
  strokeWidthInput.min = '0';
  strokeWidthInput.max = '50';
  strokeWidthInput.step = '1';
  strokeWidthInput.value = '1';
  styleTopNumberInput(strokeWidthInput);

  const radiusInput = document.createElement('input');
  radiusInput.type = 'text';
  radiusInput.inputMode = 'numeric';
  radiusInput.min = '0';
  radiusInput.max = '200';
  radiusInput.step = '1';
  radiusInput.value = '0';
  styleTopNumberInput(radiusInput);

  const fontSizeInput = document.createElement('input');
  fontSizeInput.type = 'text';
  fontSizeInput.inputMode = 'numeric';
  fontSizeInput.min = '1';
  fontSizeInput.max = '400';
  fontSizeInput.step = '1';
  fontSizeInput.value = '16';
  styleTopNumberInput(fontSizeInput);

  const topFill = fillControl.root;
  const topStroke = strokeControl.root;

  const topStrokeWidth = document.createElement('label');
  topStrokeWidth.textContent = 'Stroke width';
  topStrokeWidth.style.display = 'inline-flex';
  topStrokeWidth.style.gap = '8px';
  topStrokeWidth.style.alignItems = 'center';
  topStrokeWidth.style.fontSize = '12px';
  topStrokeWidth.style.color = '#334155';
  topStrokeWidth.appendChild(strokeWidthInput);

  const topRadius = document.createElement('label');
  topRadius.textContent = 'Radius';
  topRadius.style.display = 'inline-flex';
  topRadius.style.gap = '8px';
  topRadius.style.alignItems = 'center';
  topRadius.style.fontSize = '12px';
  topRadius.style.color = '#334155';
  topRadius.appendChild(radiusInput);

  const topFontSize = document.createElement('label');
  topFontSize.textContent = 'Size';
  topFontSize.style.display = 'inline-flex';
  topFontSize.style.gap = '8px';
  topFontSize.style.alignItems = 'center';
  topFontSize.style.fontSize = '12px';
  topFontSize.style.color = '#334155';
  topFontSize.appendChild(fontSizeInput);


  topBar.appendChild(topFill);
  topBar.appendChild(topStroke);
  topBar.appendChild(topStrokeWidth);
  topBar.appendChild(topRadius);
  topBar.appendChild(topFontSize);

  const body = document.createElement('div');
  body.style.display = 'flex';
  body.style.flex = '1';
  body.style.minHeight = '0';

  const leftBar = document.createElement('div');
  leftBar.style.width = '56px';
  leftBar.style.background = '#ffffff';
  leftBar.style.borderRight = '1px solid #e2e8f0';
  leftBar.style.display = 'flex';
  leftBar.style.flexDirection = 'column';
  leftBar.style.alignItems = 'center';
  leftBar.style.paddingTop = '12px';
  leftBar.style.paddingBottom = '12px';
  leftBar.style.gap = '10px';
  leftBar.style.flexShrink = '0';

  const board = document.createElement('div');
  board.style.flex = '1';
  board.style.position = 'relative';
  board.style.minWidth = '0';
  board.style.minHeight = '0';
  board.style.background = '#e5e7eb';

  const canvasHost = document.createElement('div');
  canvasHost.style.position = 'absolute';
  canvasHost.style.inset = '0';

  const canvasEl = document.createElement('canvas');
  canvasEl.style.width = '100%';
  canvasEl.style.height = '100%';
  canvasEl.style.display = 'block';

  canvasHost.appendChild(canvasEl);
  board.appendChild(canvasHost);
  body.appendChild(leftBar);
  body.appendChild(board);
  root.appendChild(topBar);
  root.appendChild(body);

  const mkBtn = (iconClass, title) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.background = '#ffffff';
    btn.style.borderRadius = '10px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.cursor = 'pointer';
    btn.style.color = '#0f172a';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);
    return btn;
  };

  const textBtn = mkBtn('ph ph-text-t', 'Text');
  const shapeBtn = mkBtn('ph ph-square', 'Shape');
  const iconBtn = mkBtn('ph ph-smiley', 'Emojis');
  const penBtn = mkBtn('ph ph-pen', 'Pen');
  const panBtn = mkBtn('ph ph-hand', 'Pan');
  const imageBtn = mkBtn('ph ph-image', 'Image');
  const zoomOutBtn = mkBtn('ph ph-minus', 'Zoom out');
  const zoomInBtn = mkBtn('ph ph-plus', 'Zoom in');
  const fitBtn = mkBtn('ph ph-corners-in', 'Fit');

  leftBar.appendChild(textBtn);
  leftBar.appendChild(shapeBtn);
  leftBar.appendChild(iconBtn);
  leftBar.appendChild(penBtn);
  leftBar.appendChild(imageBtn);
  const leftSpacer = document.createElement('div');
  leftSpacer.style.flex = '1';
  leftBar.appendChild(leftSpacer);
  leftBar.appendChild(panBtn);
  leftBar.appendChild(zoomInBtn);
  leftBar.appendChild(zoomOutBtn);
  leftBar.appendChild(fitBtn);

  return {
    root,
    topBar,
    fillControl,
    strokeControl,
    strokeWidthInput,
    radiusInput,
    fontSizeInput,
    topFill,
    topStroke,
    topStrokeWidth,
    topRadius,
    topFontSize,
    canvasEl,
    textBtn,
    iconBtn,
    penBtn,
    panBtn,
    imageBtn,
    zoomOutBtn,
    zoomInBtn,
    fitBtn,
    shapeBtn,
    board,
  };
}

function updateTopBarForSelection(instance) {
  const ui = instance.data.ui;
  if (!ui) return;
  const toolMode = instance.data && instance.data.toolMode ? instance.data.toolMode : 'select';
  const isDrawMode = toolMode === 'draw';
  const isPanMode = toolMode === 'pan';
  const fabricCanvas = instance.data.fabricCanvas;
  const target = fabricCanvas ? fabricCanvas.getActiveObject() : null;
  const targets = getActiveSelectionTargets(fabricCanvas);
  const hasMultiSelection = targets.length > 1;
  if (isPanMode) {
    ui.topBar.style.visibility = 'hidden';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setDisabled(true);
    ui.strokeControl.setDisabled(true);
    ui.strokeWidthInput.disabled = true;
    ui.radiusInput.disabled = true;
    ui.fontSizeInput.disabled = true;
    ui.strokeWidthInput.style.opacity = '0.55';
    ui.radiusInput.style.opacity = '0.55';
    ui.fontSizeInput.style.opacity = '0.55';
    ui.topFill.style.display = 'inline-flex';
    ui.topStroke.style.display = 'inline-flex';
    ui.topStrokeWidth.style.display = 'inline-flex';
    ui.topRadius.style.display = 'inline-flex';
    ui.topFontSize.style.display = 'inline-flex';
    return;
  }
  if (!target && !isDrawMode) {
    ui.topBar.style.visibility = 'hidden';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setDisabled(true);
    ui.strokeControl.setDisabled(true);
    ui.strokeWidthInput.disabled = true;
    ui.radiusInput.disabled = true;
    ui.fontSizeInput.disabled = true;
    ui.strokeWidthInput.style.opacity = '0.55';
    ui.radiusInput.style.opacity = '0.55';
    ui.fontSizeInput.style.opacity = '0.55';
    ui.topFill.style.display = 'inline-flex';
    ui.topStroke.style.display = 'inline-flex';
    ui.topStrokeWidth.style.display = 'inline-flex';
    ui.topRadius.style.display = 'inline-flex';
    ui.topFontSize.style.display = 'inline-flex';
    return;
  }
  if (!target && isDrawMode) {
    ui.topBar.style.visibility = 'visible';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setVisible(false);
    ui.strokeControl.setVisible(true);
    ui.strokeControl.setDisabled(false);
    ui.strokeControl.setColor(instance.data.penColor || '#111827');
    ui.topStrokeWidth.style.display = 'inline-flex';
    ui.strokeWidthInput.disabled = false;
    ui.strokeWidthInput.style.opacity = '1';
    ui.strokeWidthInput.value = String(Math.max(1, Math.round(instance.data.penWidth || 3)));
    ui.topRadius.style.display = 'none';
    ui.topFontSize.style.display = 'none';
    return;
  }
  ui.topBar.style.visibility = 'visible';
  const visibility = hasMultiSelection ? getSharedToolbarVisibility(targets) : getToolbarVisibilityForTarget(target);
  ui.fillControl.setVisible(visibility.fill);
  ui.strokeControl.setVisible(visibility.stroke);
  ui.topStrokeWidth.style.display = visibility.strokeWidth ? 'inline-flex' : 'none';
  ui.topRadius.style.display = visibility.radius ? 'inline-flex' : 'none';
  ui.topFontSize.style.display = visibility.fontSize ? 'inline-flex' : 'none';

  const style = getObjectStyle(target || targets[0]);
  ui.fillControl.setDisabled(false);
  ui.strokeControl.setDisabled(false);
  ui.strokeWidthInput.disabled = false;
  ui.fontSizeInput.disabled = !visibility.fontSize;
  ui.strokeWidthInput.style.opacity = '1';
  ui.fontSizeInput.style.opacity = visibility.fontSize ? '1' : '0.55';
  ui.strokeWidthInput.style.background = '#ffffff';
  ui.strokeWidthInput.style.color = '#0f172a';
  ui.strokeWidthInput.style.borderColor = '#cbd5e1';
  ui.strokeWidthInput.placeholder = '';
  ui.fontSizeInput.style.background = '#ffffff';
  ui.fontSizeInput.style.color = '#0f172a';
  ui.fontSizeInput.style.borderColor = '#cbd5e1';
  ui.fontSizeInput.placeholder = '';
  ui.radiusInput.style.background = '#ffffff';
  ui.radiusInput.style.color = '#0f172a';
  ui.radiusInput.style.borderColor = '#cbd5e1';
  ui.radiusInput.placeholder = '';
  ui.fillControl.setMixed(false);
  ui.strokeControl.setMixed(false);

  if (!hasMultiSelection) {
    ui.fillControl.setColor(style.fill);
    ui.strokeControl.setColor(style.stroke);
    ui.strokeWidthInput.value = String(style.strokeWidth);
    if (visibility.fontSize) {
      const size = Number.isFinite(Number(target.fontSize)) ? Math.round(Number(target.fontSize)) : 16;
      ui.fontSizeInput.value = String(Math.max(1, Math.min(400, size)));
    }
    const supportsRadius = visibility.radius
      && (Number.isFinite(Number(target.rx)) || target.type === 'rect' || isRoundedPolygonShape(target));
    ui.radiusInput.disabled = !supportsRadius;
    const polygonRadius = Number.isFinite(Number(target.cornerRadius)) ? Number(target.cornerRadius) : 0;
    ui.radiusInput.value = supportsRadius
      ? String(isRoundedPolygonShape(target) ? polygonRadius : style.radius)
      : '0';
    ui.radiusInput.style.opacity = supportsRadius ? '1' : '0.55';
    return;
  }

  const styleList = targets.map((item) => getObjectStyle(item));
  const fillShared = getSharedValue(styleList, (item) => item.fill);
  const strokeShared = getSharedValue(styleList, (item) => item.stroke);
  const strokeWidthShared = getSharedValue(styleList, (item) => item.strokeWidth);
  const fontSizeShared = getSharedValue(targets, (item) => {
    const size = Number.isFinite(Number(item.fontSize)) ? Math.round(Number(item.fontSize)) : 16;
    return Math.max(1, Math.min(400, size));
  });
  const radiusShared = getSharedValue(targets, (item) => {
    if (isRoundedPolygonShape(item)) return Number.isFinite(Number(item.cornerRadius)) ? Number(item.cornerRadius) : 0;
    if (item.type === 'rect') return getRectCornerRadiusPx(item);
    if (Number.isFinite(Number(item.rx))) {
      return Number(item.rx);
    }
    return null;
  });

  ui.fillControl.setColor(fillShared.mixed ? 'transparent' : fillShared.value);
  ui.fillControl.setMixed(fillShared.mixed);
  ui.strokeControl.setColor(strokeShared.mixed ? 'transparent' : strokeShared.value);
  ui.strokeControl.setMixed(strokeShared.mixed);

  if (strokeWidthShared.mixed) {
    ui.strokeWidthInput.value = '';
    ui.strokeWidthInput.placeholder = 'mix';
    ui.strokeWidthInput.style.background = '#f1f5f9';
    ui.strokeWidthInput.style.color = '#64748b';
    ui.strokeWidthInput.style.borderColor = '#cbd5e1';
  } else {
    ui.strokeWidthInput.value = String(strokeWidthShared.value);
  }

  if (visibility.fontSize) {
    ui.fontSizeInput.disabled = false;
    if (fontSizeShared.mixed) {
      ui.fontSizeInput.value = '';
      ui.fontSizeInput.placeholder = 'mix';
      ui.fontSizeInput.style.background = '#f1f5f9';
      ui.fontSizeInput.style.color = '#64748b';
      ui.fontSizeInput.style.borderColor = '#cbd5e1';
    } else {
      ui.fontSizeInput.value = String(fontSizeShared.value);
    }
  }

  if (visibility.radius) {
    ui.radiusInput.disabled = false;
    ui.radiusInput.style.opacity = '1';
    if (radiusShared.mixed) {
      ui.radiusInput.value = '';
      ui.radiusInput.placeholder = 'mix';
      ui.radiusInput.style.background = '#f1f5f9';
      ui.radiusInput.style.color = '#64748b';
      ui.radiusInput.style.borderColor = '#cbd5e1';
    } else {
      ui.radiusInput.value = String(Math.max(0, Math.min(200, Number(radiusShared.value) || 0)));
    }
  } else {
    ui.radiusInput.disabled = true;
    ui.radiusInput.value = '0';
    ui.radiusInput.style.opacity = '0.55';
  }
}

function applyStyleToSelection(instance, patch) {
  const fabricCanvas = instance.data.fabricCanvas;
  if (!fabricCanvas) return;
  const targets = getActiveSelectionTargets(fabricCanvas);
  if (targets.length === 0) return;
  targets.forEach((target) => {
    const nextPatch = { ...patch };
    // Keep stroke width visually constant while object is scaled.
    if (nextPatch.stroke != null || nextPatch.strokeWidth != null) {
      nextPatch.strokeUniform = true;
    }
    const nextStrokeColor = typeof nextPatch.stroke === 'string'
      ? nextPatch.stroke
      : (typeof target.stroke === 'string' ? target.stroke : '');
    const hasVisibleStrokeColor = !shouldZeroStrokeWidth(nextStrokeColor);
    const currentStrokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 0;
    if (hasVisibleStrokeColor && nextPatch.strokeWidth == null && currentStrokeWidth <= 0) {
      nextPatch.strokeWidth = 1;
    }

    if (isTextLikeObject(target) && (nextPatch.stroke != null || nextPatch.strokeWidth != null)) {
      const nextStrokeWidth = nextPatch.strokeWidth != null ? Number(nextPatch.strokeWidth) : currentStrokeWidth;
      const wantsTransparentStroke = shouldZeroStrokeWidth(nextStrokeColor);
      if (wantsTransparentStroke) {
        nextPatch.strokeWidth = 0;
      } else if (!Number.isFinite(nextStrokeWidth) || nextStrokeWidth <= 0) {
        nextPatch.strokeWidth = 1;
      }
      if (nextPatch.stroke == null && !wantsTransparentStroke) {
        const currentStroke = typeof target.stroke === 'string' ? target.stroke.trim() : '';
        if (!currentStroke || currentStroke === '#00000000' || currentStroke.toLowerCase() === 'transparent') {
          nextPatch.stroke = '#000000';
        }
      }
      nextPatch.paintFirst = 'stroke';
      nextPatch.strokeLineJoin = 'round';
    }
    target.set(nextPatch);
    target.dirty = true;
    target.setCoords();
  });
  fabricCanvas.requestRenderAll();
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
    ensureArtboardAtBack(instance);
  }
  fabricCanvas.requestRenderAll();
}

function createStarPoints(outerRadius, innerRadius, spikes) {
  const points = [];
  const step = Math.PI / spikes;
  let angle = -Math.PI / 2;
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
    angle += step;
  }
  return points;
}

function createRegularPolygonPoints(sides, radius) {
  const points = [];
  const step = (Math.PI * 2) / sides;
  let angle = -Math.PI / 2;
  for (let i = 0; i < sides; i++) {
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
    angle += step;
  }
  return points;
}

function buildRoundedPolygonPath(points, radius) {
  if (!Array.isArray(points) || points.length < 3) return '';
  const safeRadius = Math.max(0, Number(radius) || 0);
  if (safeRadius <= 0) {
    return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
  }

  const n = points.length;
  const commands = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    if (len1 < 1e-6 || len2 < 1e-6) continue;

    const n1x = v1x / len1;
    const n1y = v1y / len1;
    const n2x = v2x / len2;
    const n2y = v2y / len2;

    const dot = Math.max(-1, Math.min(1, n1x * n2x + n1y * n2y));
    const angle = Math.acos(dot);
    const tangentDist = Math.min(
      safeRadius / Math.tan(angle / 2 || 1e-6),
      len1 * 0.45,
      len2 * 0.45,
    );

    const p1x = curr.x + n1x * tangentDist;
    const p1y = curr.y + n1y * tangentDist;
    const p2x = curr.x + n2x * tangentDist;
    const p2y = curr.y + n2y * tangentDist;

    if (commands.length === 0) commands.push(`M ${p1x} ${p1y}`);
    else commands.push(`L ${p1x} ${p1y}`);
    commands.push(`Q ${curr.x} ${curr.y} ${p2x} ${p2y}`);
  }
  commands.push('Z');
  return commands.join(' ');
}

function extractPathPoints(pathObject) {
  if (!pathObject || !Array.isArray(pathObject.path)) return [];
  const points = [];
  for (const cmd of pathObject.path) {
    if (!Array.isArray(cmd) || cmd.length < 3) continue;
    const op = String(cmd[0] || '').toUpperCase();
    if (op === 'M' || op === 'L') {
      points.push({ x: Number(cmd[1]), y: Number(cmd[2]) });
    } else if (op === 'Q' && cmd.length >= 5) {
      points.push({ x: Number(cmd[3]), y: Number(cmd[4]) });
    } else if (op === 'C' && cmd.length >= 7) {
      points.push({ x: Number(cmd[5]), y: Number(cmd[6]) });
    }
  }
  return points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}

function buildSmoothFreehandPath(points, smoothing = 0.22) {
  if (!Array.isArray(points) || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  const tension = Math.max(0.05, Math.min(0.45, Number(smoothing) || 0.22));
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

function replaceRoundedPolygon(instance, target, radius, fabricLib) {
  if (!target || !fabricLib || !instance || !instance.data || !instance.data.fabricCanvas) return null;
  const canvas = instance.data.fabricCanvas;
  const basePoints = Array.isArray(target.shapePoints) && target.shapePoints.length >= 3
    ? target.shapePoints
    : (Array.isArray(target.points) ? target.points.map((p) => ({ x: p.x, y: p.y })) : null);
  if (!basePoints || basePoints.length < 3) return null;

  const pathData = buildRoundedPolygonPath(basePoints, radius);
  if (!pathData) return null;

  const replacement = new fabricLib.Path(pathData, {
    left: target.left,
    top: target.top,
    angle: target.angle,
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    originX: target.originX || 'center',
    originY: target.originY || 'center',
    fill: target.fill,
    stroke: target.stroke,
    strokeWidth: target.strokeWidth,
    strokeUniform: true,
    shapeKind: target.shapeKind,
    shapePoints: basePoints,
    cornerRadius: Math.max(0, Number(radius) || 0),
    cornerRadiusPx: Number.isFinite(Number(target.cornerRadiusPx))
      ? Math.max(0, Number(target.cornerRadiusPx))
      : Math.max(0, Number(radius) || 0) * Math.min(Math.abs(Number(target.scaleX) || 1), Math.abs(Number(target.scaleY) || 1)),
  });

  const objects = canvas.getObjects();
  const index = objects.indexOf(target);
  canvas.remove(target);
  if (index >= 0) canvas.insertAt(index, replacement);
  else canvas.add(replacement);
  return replacement;
}

function isTypingContext(target) {
  if (!target) return false;
  const tag = target.tagName ? String(target.tagName).toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  return false;
}

export default function(instance) {
  const fabricLib = resolveFabric();
  const ui = buildShell();
  instance.data.ui = ui;
  instance.data.fabricLib = fabricLib;
  instance.data.canvasWidth = 1000;
  instance.data.canvasHeight = 1000;
  instance.data.viewport = {
    docW: 1000,
    docH: 1000,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    zoomScale: 1,
    panX: 0,
    panY: 0,
  };
  instance.canvas.append(ui.root);

  if (!fabricLib || typeof fabricLib.Canvas !== 'function') {
    const errorBox = document.createElement('div');
    errorBox.textContent = 'Fabric.js v6 is not loaded.';
    errorBox.style.position = 'absolute';
    errorBox.style.top = '12px';
    errorBox.style.left = '12px';
    errorBox.style.padding = '8px 10px';
    errorBox.style.fontSize = '12px';
    errorBox.style.color = '#991b1b';
    errorBox.style.background = '#fee2e2';
    errorBox.style.border = '1px solid #fecaca';
    errorBox.style.borderRadius = '8px';
    ui.board.appendChild(errorBox);
    return;
  }

  const fabricCanvas = new fabricLib.Canvas(ui.canvasEl, {
    preserveObjectStacking: true,
    selection: true,
    centeredScaling: false,
    centeredRotation: false,
  });
  instance.data.fabricCanvas = fabricCanvas;
  instance.publishState('new_color', '');
  instance.data.toolMode = 'select';
  instance.data.penColor = '#111827';
  instance.data.penWidth = 3;
  instance.data.zoomScale = 1;
  instance.data.panX = 0;
  instance.data.panY = 0;
  instance.data.isPanning = false;
  instance.data.panLastClientX = 0;
  instance.data.panLastClientY = 0;

  const applyPenBrush = () => {
    if (!fabricCanvas.freeDrawingBrush && typeof fabricLib.PencilBrush === 'function') {
      fabricCanvas.freeDrawingBrush = new fabricLib.PencilBrush(fabricCanvas);
    }
    if (!fabricCanvas.freeDrawingBrush) return;
    fabricCanvas.freeDrawingBrush.color = normalizeCanvasColor(instance.data.penColor, '#111827');
    fabricCanvas.freeDrawingBrush.width = Math.max(1, Number(instance.data.penWidth) || 3);
    // Smoother freehand: round joins/caps + slight point decimation.
    fabricCanvas.freeDrawingBrush.strokeLineCap = 'round';
    fabricCanvas.freeDrawingBrush.strokeLineJoin = 'round';
    fabricCanvas.freeDrawingBrush.decimate = 10;
  };

  const setToolMode = (mode) => {
    instance.data.toolMode = mode === 'draw' || mode === 'pan' ? mode : 'select';
    const isDrawMode = instance.data.toolMode === 'draw';
    const isPanMode = instance.data.toolMode === 'pan';
    fabricCanvas.isDrawingMode = isDrawMode;
    fabricCanvas.selection = !isDrawMode && !isPanMode;
    fabricCanvas.skipTargetFind = isDrawMode || isPanMode;
    fabricCanvas.defaultCursor = isDrawMode ? 'crosshair' : (isPanMode ? 'grab' : 'default');
    if (isDrawMode) {
      fabricCanvas.discardActiveObject();
      applyPenBrush();
    }
    if (isPanMode) {
      fabricCanvas.discardActiveObject();
    }
    if (!isPanMode) {
      instance.data.isPanning = false;
      ui.board.style.cursor = '';
    }
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  };

  const setActiveToolButton = (activeBtn) => {
    [ui.textBtn, ui.shapeBtn, ui.iconBtn, ui.penBtn, ui.panBtn, ui.imageBtn].forEach((btn) => {
      if (!btn) return;
      btn.style.background = btn === activeBtn ? '#eef2ff' : '#ffffff';
      btn.style.borderColor = btn === activeBtn ? '#93c5fd' : '#cbd5e1';
    });
  };
  const exitPanMode = () => {
    if (instance.data.toolMode !== 'pan') return;
    setToolMode('select');
    setActiveToolButton(null);
  };

  const groupSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || !isSelectionContainer(active)) return;
    if (typeof active.toGroup === 'function') {
      const grouped = active.toGroup();
      if (grouped) fabricCanvas.setActiveObject(grouped);
    } else {
      const targets = getActiveSelectionTargets(fabricCanvas);
      if (targets.length <= 1 || typeof fabricLib.Group !== 'function') return;
      targets.forEach((obj) => fabricCanvas.remove(obj));
      const group = new fabricLib.Group(targets, {
        originX: 'left',
        originY: 'top',
      });
      fabricCanvas.add(group);
      fabricCanvas.setActiveObject(group);
    }
    ensureArtboardAtBack(instance);
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  };

  const isGroupObject = (active) => {
    if (!active) return false;
    const type = String(active.type || '').toLowerCase();
    return type === 'group';
  };

  const ungroupSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || !isGroupObject(active)) return;
    let didUngroup = false;
    if (typeof active.toActiveSelection === 'function') {
      try {
        const selection = active.toActiveSelection();
        if (selection) {
          fabricCanvas.setActiveObject(selection);
          didUngroup = true;
        }
      } catch (e) {
        didUngroup = false;
      }
    }
    if (!didUngroup) {
      // Fallback path for Fabric variants where toActiveSelection is unavailable
      // or does not update canvas state as expected.
      const children = typeof active.getObjects === 'function'
        ? [...active.getObjects()]
        : [];
      if (children.length === 0) return;
      if (typeof active._restoreObjectsState === 'function') {
        active._restoreObjectsState();
      }
      fabricCanvas.remove(active);
      children.forEach((obj) => {
        fabricCanvas.add(obj);
      });
      if (typeof fabricLib.ActiveSelection === 'function') {
        const selection = new fabricLib.ActiveSelection(children, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(selection);
      } else if (children.length === 1) {
        fabricCanvas.setActiveObject(children[0]);
      }
    }
    ensureArtboardAtBack(instance);
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  };

  const contextMenu = document.createElement('div');
  contextMenu.style.position = 'fixed';
  contextMenu.style.display = 'none';
  contextMenu.style.zIndex = '2147483647';
  contextMenu.style.width = 'auto';
  contextMenu.style.minWidth = '0';
  contextMenu.style.maxWidth = '280px';
  contextMenu.style.padding = '6px';
  contextMenu.style.background = '#ffffff';
  contextMenu.style.border = '1px solid #e2e8f0';
  contextMenu.style.borderRadius = '12px';
  contextMenu.style.boxShadow = '0 14px 32px rgba(15, 23, 42, 0.2)';

  const closeContextMenu = () => {
    contextMenu.style.display = 'none';
  };

  const addContextItem = (label, action) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.width = '100%';
    btn.style.height = '32px';
    btn.style.border = 'none';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.fontSize = '13px';
    btn.style.borderRadius = '8px';
    btn.style.padding = '0 10px';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'left';
    btn.style.whiteSpace = 'nowrap';
    btn.style.display = 'block';
    btn.style.boxSizing = 'border-box';
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f1f5f9';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    btn.addEventListener('click', () => {
      if (action === 'group') groupSelection();
      else if (action === 'ungroup') ungroupSelection();
      else applyZOrderToSelection(fabricCanvas, action);
      ensureArtboardAtBack(instance);
      closeContextMenu();
      publishCanvasJson(instance);
      updateTopBarForSelection(instance);
    });
    contextMenu.appendChild(btn);
  };

  const renderContextMenuItems = () => {
    contextMenu.innerHTML = '';
    const active = fabricCanvas.getActiveObject();
    if (isSelectionContainer(active)) {
      addContextItem('Group', 'group');
    } else if (isGroupObject(active)) {
      addContextItem('Ungroup', 'ungroup');
    }
    addContextItem('Bring to Front', 'to-front');
    addContextItem('Bring Forward', 'forward');
    addContextItem('Send Backward', 'backward');
    addContextItem('Send to Back', 'to-back');
  };
  document.body.appendChild(contextMenu);

  const onKeyDown = (event) => {
    if (event.key !== 'Backspace') return;
    if (isTypingContext(event.target)) return;
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    if (active.isEditing) return;

    event.preventDefault();
    if (isSelectionContainer(active)) {
      const items = active.getObjects();
      fabricCanvas.discardActiveObject();
      items.forEach((obj) => fabricCanvas.remove(obj));
    } else {
      fabricCanvas.remove(active);
    }
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  };
  document.addEventListener('keydown', onKeyDown);
  instance.data.onKeyDown = onKeyDown;

  ui.board.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!fabricCanvas) return;

    if (typeof fabricCanvas.findTarget === 'function') {
      const found = fabricCanvas.findTarget(event);
      let nextActive = found;
      // If right-click hits an object inside a group, target the parent group
      // so Ungroup can appear and act on the correct container.
      if (nextActive && nextActive.group && isGroupObject(nextActive.group)) {
        nextActive = nextActive.group;
      }
      if (nextActive && fabricCanvas.getActiveObject() !== nextActive) {
        fabricCanvas.setActiveObject(nextActive);
      }
    }
    const hasSelection = getActiveSelectionTargets(fabricCanvas).length > 0;
    if (!hasSelection) {
      closeContextMenu();
      return;
    }

    renderContextMenuItems();
    contextMenu.style.display = 'block';
    const rect = contextMenu.getBoundingClientRect();
    const menuWidth = Math.max(1, rect.width || 1);
    const menuHeight = Math.max(1, rect.height || 1);
    const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, event.clientX));
    const top = Math.max(8, Math.min(window.innerHeight - menuHeight - 8, event.clientY));
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
  }, true);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target && contextMenu.contains(target)) return;
    closeContextMenu();
  }, true);

  const addShapeByType = (shapeType) => {
    const center = getDocumentCenter(instance);
    const baseLeft = Math.round(center.x - 60);
    const baseTop = Math.round(center.y - 60);
    let shape = null;

    if (shapeType === 'square') {
      shape = new fabricLib.Rect({
        left: baseLeft,
        top: baseTop,
        width: 120,
        height: 120,
        fill: '#14b8a6',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        cornerRadiusPx: 0,
      });
    } else if (shapeType === 'round') {
      shape = new fabricLib.Rect({
        left: baseLeft,
        top: baseTop + 10,
        width: 130,
        height: 95,
        rx: 18,
        ry: 18,
        fill: '#0ea5e9',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        cornerRadiusPx: 18,
      });
    } else if (shapeType === 'circle') {
      shape = new fabricLib.Circle({
        left: baseLeft,
        top: baseTop,
        radius: 58,
        fill: '#f59e0b',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
      });
    } else if (shapeType === 'triangle') {
      const points = createRegularPolygonPoints(3, 62);
      shape = new fabricLib.Polygon(points, {
        left: baseLeft,
        top: baseTop + 10,
        originX: 'center',
        originY: 'center',
        fill: '#8b5cf6',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        shapeKind: 'triangle',
        shapePoints: points,
        cornerRadius: 0,
      });
    } else if (shapeType === 'star') {
      const points = createStarPoints(62, 28, 5);
      shape = new fabricLib.Polygon(points, {
        left: baseLeft,
        top: baseTop,
        originX: 'center',
        originY: 'center',
        fill: '#ef4444',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        shapeKind: 'star',
        shapePoints: points,
        cornerRadius: 0,
      });
    }

    if (!shape) return;
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    publishCanvasJson(instance);
  };

  const addPhosphorSvg = async (iconName, style = 'regular') => {
    if (!iconName || typeof fabricLib.loadSVGFromURL !== 'function') return;
    const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : 'regular';
    const fileName = getStyleAssetFileName(iconName, safeStyle);
    if (!fileName) return;
    const iconUrl = `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/${safeStyle}/${fileName}`;

    let objects = null;
    let options = null;
    try {
      // Fabric v6: Promise-based API
      const result = await fabricLib.loadSVGFromURL(iconUrl);
      if (Array.isArray(result)) {
        objects = result[0];
        options = result[1];
      } else if (result && typeof result === 'object') {
        objects = result.objects;
        options = result.options;
      }
    } catch (e) {
      objects = null;
      options = null;
    }

    if (!Array.isArray(objects) || objects.length === 0) {
      // Fallback for callback-style loaders
      await new Promise((resolve) => {
        try {
          fabricLib.loadSVGFromURL(iconUrl, (loadedObjects, loadedOptions) => {
            objects = loadedObjects;
            options = loadedOptions;
            resolve();
          });
        } catch (err) {
          resolve();
        }
      });
    }

    if (!Array.isArray(objects) || objects.length === 0) {
      // Last-resort fallback: add visible text marker so click always gives feedback.
      const center = getDocumentCenter(instance);
      const fallback = new fabricLib.Textbox(iconName, {
        left: Math.round(center.x),
        top: Math.round(center.y),
        originX: 'center',
        originY: 'center',
        fontSize: 28,
        fontWeight: 700,
        fill: '#0f172a',
      });
      fabricCanvas.add(fallback);
      fabricCanvas.setActiveObject(fallback);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      publishCanvasJson(instance);
      return;
    }

    const grouped = fabricLib.util.groupSVGElements(objects, options || {});
    const initialScale = 0.16;
    grouped.set({
      scaleX: initialScale,
      scaleY: initialScale,
    });
    // Keep transform anchored to opposite handle (not centered).
    grouped.set({
      originX: 'left',
      originY: 'top',
      centeredScaling: false,
      centeredRotation: false,
      objectCaching: false,
    });
    const scaledW = typeof grouped.getScaledWidth === 'function' ? grouped.getScaledWidth() : 0;
    const scaledH = typeof grouped.getScaledHeight === 'function' ? grouped.getScaledHeight() : 0;
    const center = getDocumentCenter(instance);
    grouped.set({
      left: Math.round(center.x - scaledW / 2),
      top: Math.round(center.y - scaledH / 2),
      fill: '#0f172a',
      stroke: '#00000000',
      strokeWidth: 0,
      strokeUniform: true,
      iconKind: `phosphor-${safeStyle}`,
      iconName,
      iconStyle: safeStyle,
    });
    fabricCanvas.add(grouped);
    fabricCanvas.setActiveObject(grouped);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    publishCanvasJson(instance);
  };

  const doc = getDocumentSize(instance);
  const seed = createRandomSeedObjects(fabricLib, doc.width, doc.height);
  seed.forEach((obj) => fabricCanvas.add(obj));
  ensureCanvasSize(instance);
  updateTopBarForSelection(instance);

  ui.textBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    setActiveToolButton(ui.textBtn);
    const docSize = getDocumentSize(instance);
    const text = createDefaultTextbox(fabricLib, docSize.width, docSize.height);
    if (!text) return;
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    publishCanvasJson(instance);
  });

  const shapeMenu = document.createElement('div');
  shapeMenu.style.position = 'absolute';
  shapeMenu.style.left = '62px';
  shapeMenu.style.top = '108px';
  shapeMenu.style.display = 'none';
  shapeMenu.style.flexDirection = 'column';
  shapeMenu.style.gap = '8px';
  shapeMenu.style.padding = '8px';
  shapeMenu.style.background = '#ffffff';
  shapeMenu.style.border = '1px solid #e2e8f0';
  shapeMenu.style.borderRadius = '12px';
  shapeMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  shapeMenu.style.zIndex = '25';

  const makeShapeItem = (iconClass, title, type) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.borderRadius = '10px';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.cursor = 'pointer';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);

    btn.addEventListener('click', () => {
      addShapeByType(type);
      shapeMenu.style.display = 'none';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f8fafc';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    return btn;
  };

  shapeMenu.appendChild(makeShapeItem('ph ph-square', 'Carre', 'square'));
  shapeMenu.appendChild(makeShapeItem('ph ph-circle', 'Cercle', 'circle'));
  shapeMenu.appendChild(makeShapeItem('ph ph-triangle', 'Triangle', 'triangle'));
  shapeMenu.appendChild(makeShapeItem('ph ph-star', 'Etoile', 'star'));
  ui.root.appendChild(shapeMenu);
  instance.data.shapeMenu = shapeMenu;

  const iconMenu = document.createElement('div');
  iconMenu.style.position = 'absolute';
  iconMenu.style.left = '62px';
  iconMenu.style.top = '64px';
  iconMenu.style.display = 'none';
  iconMenu.style.flexDirection = 'column';
  iconMenu.style.alignItems = 'stretch';
  iconMenu.style.gap = '8px';
  iconMenu.style.padding = '10px';
  iconMenu.style.background = '#ffffff';
  iconMenu.style.border = '1px solid #e2e8f0';
  iconMenu.style.borderRadius = '12px';
  iconMenu.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.16)';
  iconMenu.style.zIndex = '25';
  iconMenu.style.width = '198px';

  const styleSelect = document.createElement('select');
  styleSelect.style.height = '32px';
  styleSelect.style.border = '1px solid #cbd5e1';
  styleSelect.style.borderRadius = '8px';
  styleSelect.style.padding = '0 10px';
  styleSelect.style.fontSize = '12px';
  styleSelect.style.outline = 'none';
  styleSelect.style.color = '#0f172a';
  styleSelect.style.background = '#ffffff';
  PHOSPHOR_STYLES.forEach((style) => {
    const opt = document.createElement('option');
    opt.value = style;
    opt.textContent = style.charAt(0).toUpperCase() + style.slice(1);
    styleSelect.appendChild(opt);
  });
  iconMenu.appendChild(styleSelect);

  const iconSearch = document.createElement('input');
  iconSearch.type = 'text';
  iconSearch.placeholder = 'Search icon...';
  iconSearch.autocomplete = 'off';
  iconSearch.spellcheck = false;
  iconSearch.style.height = '32px';
  iconSearch.style.border = '1px solid #cbd5e1';
  iconSearch.style.borderRadius = '8px';
  iconSearch.style.padding = '0 10px';
  iconSearch.style.fontSize = '12px';
  iconSearch.style.outline = 'none';
  iconSearch.style.color = '#0f172a';
  iconSearch.style.background = '#ffffff';
  iconMenu.appendChild(iconSearch);

  const iconGridScroller = document.createElement('div');
  iconGridScroller.style.maxHeight = '320px';
  iconGridScroller.style.overflowY = 'auto';
  iconGridScroller.style.paddingRight = '2px';
  iconMenu.appendChild(iconGridScroller);

  const iconGrid = document.createElement('div');
  iconGrid.style.display = 'grid';
  iconGrid.style.gridTemplateColumns = 'repeat(4, 36px)';
  iconGrid.style.justifyContent = 'space-between';
  iconGrid.style.gap = '8px';
  iconGridScroller.appendChild(iconGrid);

  const iconStatus = document.createElement('div');
  iconStatus.style.fontSize = '11px';
  iconStatus.style.color = '#64748b';
  iconStatus.style.padding = '6px 0';
  iconStatus.style.textAlign = 'left';
  iconGridScroller.appendChild(iconStatus);

  let allIconNames = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
  let isLoadingIcons = false;
  let loadedStyle = '';
  let currentIconStyle = 'regular';

  const iconClassPrefixByStyle = {
    regular: 'ph',
    bold: 'ph-bold',
    fill: 'ph-fill',
    light: 'ph-light',
    thin: 'ph-thin',
    duotone: 'ph-duotone',
  };

  const makeIconItem = (iconName) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = iconName;
    btn.style.width = '36px';
    btn.style.minWidth = '36px';
    btn.style.height = '36px';
    btn.style.flex = '0 0 auto';
    btn.style.alignSelf = 'center';
    btn.style.padding = '0';
    btn.style.appearance = 'none';
    btn.style.webkitAppearance = 'none';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.borderRadius = '10px';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.cursor = 'pointer';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    const icon = document.createElement('i');
    const styleClass = iconClassPrefixByStyle[currentIconStyle] || 'ph';
    icon.className = `${styleClass} ph-${iconName}`;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f8fafc';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    btn.addEventListener('click', () => {
      addPhosphorSvg(iconName, currentIconStyle);
      iconMenu.style.display = 'none';
    });
    return btn;
  };

  const renderIconGrid = (filterText = '') => {
    const q = String(filterText || '').trim().toLowerCase();
    iconGrid.innerHTML = '';
    const filtered = q
      ? allIconNames.filter((name) => name.includes(q))
      : allIconNames;
    filtered.forEach((iconName) => iconGrid.appendChild(makeIconItem(iconName)));
    if (isLoadingIcons) {
      iconStatus.textContent = 'Loading all icons...';
    } else if (filtered.length === 0) {
      iconStatus.textContent = 'No icon found.';
    } else {
      iconStatus.textContent = `${filtered.length} icon${filtered.length > 1 ? 's' : ''}`;
    }
  };

  const ensureAllIconsLoaded = async () => {
    if (isLoadingIcons) return;
    if (loadedStyle === currentIconStyle && allIconNames.length > 0) return;
    isLoadingIcons = true;
    renderIconGrid(iconSearch.value);
    const names = await fetchAllPhosphorIconsByStyle(currentIconStyle);
    allIconNames = Array.isArray(names) && names.length > 0
      ? names
      : [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
    isLoadingIcons = false;
    loadedStyle = currentIconStyle;
    renderIconGrid(iconSearch.value);
  };

  styleSelect.addEventListener('change', () => {
    currentIconStyle = String(styleSelect.value || 'regular');
    loadedStyle = '';
    ensureAllIconsLoaded();
  });
  iconSearch.addEventListener('input', () => {
    renderIconGrid(iconSearch.value);
  });
  renderIconGrid('');
  ui.root.appendChild(iconMenu);
  instance.data.iconMenu = iconMenu;

  ui.shapeBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    setActiveToolButton(ui.shapeBtn);
    iconMenu.style.display = 'none';
    shapeMenu.style.display = shapeMenu.style.display === 'none' ? 'flex' : 'none';
  });
  ui.iconBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    setActiveToolButton(ui.iconBtn);
    shapeMenu.style.display = 'none';
    const willOpen = iconMenu.style.display === 'none';
    iconMenu.style.display = willOpen ? 'flex' : 'none';
    if (willOpen) {
      ensureAllIconsLoaded();
      iconSearch.focus();
    }
  });
  ui.penBtn.addEventListener('click', (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    exitPanMode();
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    const nextMode = instance.data.toolMode === 'draw' ? 'select' : 'draw';
    setToolMode(nextMode);
    setActiveToolButton(nextMode === 'draw' ? ui.penBtn : null);
  });
  ui.panBtn.addEventListener('click', (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    const nextMode = instance.data.toolMode === 'pan' ? 'select' : 'pan';
    setToolMode(nextMode);
    setActiveToolButton(nextMode === 'pan' ? ui.panBtn : null);
  });

  ui.imageBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    setActiveToolButton(ui.imageBtn);
    // Placeholder V1: outil affiché, import d'image non implémenté.
  });

  const updateZoomButtons = () => {
    const z = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
    ui.zoomOutBtn.disabled = z <= 0.1;
    ui.zoomInBtn.disabled = z >= 8;
    ui.zoomOutBtn.style.opacity = ui.zoomOutBtn.disabled ? '0.45' : '1';
    ui.zoomInBtn.style.opacity = ui.zoomInBtn.disabled ? '0.45' : '1';
    ui.zoomOutBtn.style.cursor = ui.zoomOutBtn.disabled ? 'default' : 'pointer';
    ui.zoomInBtn.style.cursor = ui.zoomInBtn.disabled ? 'default' : 'pointer';
  };
  const applyZoomDelta = (delta) => {
    const current = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
    const next = Math.max(0.1, Math.min(8, current + delta));
    if (next === current) return;
    instance.data.zoomScale = next;
    ensureCanvasSize(instance);
    updateZoomButtons();
  };
  const applyZoomAtViewerPoint = (nextZoomScale, clientX, clientY) => {
    const clampedZoom = Math.max(0.1, Math.min(8, Number(nextZoomScale) || 1));
    const viewport = instance.data.viewport || {};
    const currentScale = Math.max(1e-6, Number(viewport.scale) || 1);
    const currentOffsetX = Number(viewport.offsetX) || 0;
    const currentOffsetY = Number(viewport.offsetY) || 0;
    const boardRect = ui.board.getBoundingClientRect();
    const viewerX = (Number(clientX) || 0) - boardRect.left;
    const viewerY = (Number(clientY) || 0) - boardRect.top;
    const docX = (viewerX - currentOffsetX) / currentScale;
    const docY = (viewerY - currentOffsetY) / currentScale;

    instance.data.zoomScale = clampedZoom;

    const boardW = Math.max(Number(ui.board.clientWidth) || 1, 1);
    const boardH = Math.max(Number(ui.board.clientHeight) || 1, 1);
    const doc = getDocumentSize(instance);
    const margin = Math.max(0, Number(ARTBOARD_VIEWER_MARGIN_PX) || 0);
    const fitAreaWidth = Math.max(1, boardW - margin * 2);
    const fitAreaHeight = Math.max(1, boardH - margin * 2);
    const fit = computeFit(fitAreaWidth, fitAreaHeight, doc.width, doc.height);
    const nextScale = fit.scale * clampedZoom;
    const baseOffsetX = (boardW - doc.width * nextScale) / 2;
    const baseOffsetY = (boardH - doc.height * nextScale) / 2;
    instance.data.panX = viewerX - docX * nextScale - baseOffsetX;
    instance.data.panY = viewerY - docY * nextScale - baseOffsetY;

    ensureCanvasSize(instance);
    updateZoomButtons();
  };
  ui.zoomOutBtn.addEventListener('click', () => {
    exitPanMode();
    applyZoomDelta(-0.1);
  });
  ui.zoomInBtn.addEventListener('click', () => {
    exitPanMode();
    applyZoomDelta(0.1);
  });
  ui.fitBtn.addEventListener('click', () => {
    exitPanMode();
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    ensureCanvasSize(instance);
    updateZoomButtons();
  });
  updateZoomButtons();
  fabricCanvas.on('mouse:wheel', (event) => {
    const e = event && event.e ? event.e : null;
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    const current = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
    const delta = Number(e.deltaY) || 0;
    if (delta === 0) return;
    const factor = delta > 0 ? 0.92 : 1.08;
    const next = Math.max(0.1, Math.min(8, current * factor));
    if (next === current) return;
    applyZoomAtViewerPoint(next, e.clientX, e.clientY);
  });

  ui.fillControl.setHandlers({
    onPresetSelect: (color) => {
      applyStyleToSelection(instance, { fill: normalizeCanvasColor(color, '#111827') });
    },
    onCustomSelect: (hex) => {
      const color = normalizeCanvasColor(hex, '#111827');
      instance.publishState('new_color', color);
      instance.triggerEvent('new_color_selected');
      applyStyleToSelection(instance, { fill: color });
    },
  });
  ui.strokeControl.setHandlers({
    onPresetSelect: (color) => {
      if (instance.data.toolMode === 'draw') {
        instance.data.penColor = normalizeCanvasColor(color, '#111827');
        applyPenBrush();
        updateTopBarForSelection(instance);
        return;
      }
      const target = fabricCanvas.getActiveObject();
      if (!target) return;
      const normalizedStroke = normalizeCanvasColor(color, '#000000');
      const patch = { stroke: normalizedStroke };
      if (shouldZeroStrokeWidth(normalizedStroke)) {
        patch.strokeWidth = 0;
        ui.strokeWidthInput.value = '0';
      } else if (isTextLikeObject(target) && Number(target.strokeWidth || 0) <= 0) {
        patch.strokeWidth = 1;
        ui.strokeWidthInput.value = '1';
      }
      applyStyleToSelection(instance, patch);
    },
    onCustomSelect: (hex) => {
      if (instance.data.toolMode === 'draw') {
        const color = normalizeCanvasColor(hex, '#111827');
        instance.data.penColor = color;
        applyPenBrush();
        instance.publishState('new_color', color);
        instance.triggerEvent('new_color_selected');
        updateTopBarForSelection(instance);
        return;
      }
      const target = fabricCanvas.getActiveObject();
      if (!target) return;
      const color = normalizeCanvasColor(hex, '#000000');
      const patch = { stroke: color };
      if (shouldZeroStrokeWidth(color)) {
        patch.strokeWidth = 0;
        ui.strokeWidthInput.value = '0';
      } else if (isTextLikeObject(target) && Number(target.strokeWidth || 0) <= 0) {
        patch.strokeWidth = 1;
        ui.strokeWidthInput.value = '1';
      }
      instance.publishState('new_color', color);
      instance.triggerEvent('new_color_selected');
      applyStyleToSelection(instance, patch);
    },
  });

  ui.strokeWidthInput.addEventListener('input', () => {
    const strokeWidth = Math.max(0, Math.min(50, Number(ui.strokeWidthInput.value || 0)));
    if (instance.data.toolMode === 'draw') {
      instance.data.penWidth = Math.max(1, strokeWidth);
      applyPenBrush();
      updateTopBarForSelection(instance);
      return;
    }
    applyStyleToSelection(instance, { strokeWidth });
  });
  ui.radiusInput.addEventListener('input', () => {
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    const targets = getActiveSelectionTargets(fabricCanvas);
    if (targets.length === 0) return;
    const radius = Math.max(0, Math.min(200, Number(ui.radiusInput.value || 0)));
    const updated = [];
    targets.forEach((target) => {
      if (isRoundedPolygonShape(target)) {
        const replacement = replaceRoundedPolygon(instance, target, radius, fabricLib);
        if (replacement) {
          replacement.cornerRadiusPx = radius;
          updated.push(replacement);
        }
        return;
      }
      if (target.type === 'rect') {
        applyRectCornerRadiusPx(target, radius);
      } else if (Number.isFinite(Number(target.rx))) {
        target.set({ rx: radius, ry: radius });
      } else {
        return;
      }
      if (typeof target.setCoords === 'function') target.setCoords();
      updated.push(target);
    });
    if (updated.length === 0) return;
    if (isSelectionContainer(active) && updated.length > 1) {
      const selection = new fabricLib.ActiveSelection(updated, { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(selection);
    } else if (updated.length === 1) {
      fabricCanvas.setActiveObject(updated[0]);
    }
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });
  ui.fontSizeInput.addEventListener('input', () => {
    const targets = getActiveSelectionTargets(fabricCanvas).filter((item) => isTextLikeObject(item));
    if (targets.length === 0) return;
    const fontSize = Math.max(1, Math.min(400, Number(ui.fontSizeInput.value || 16)));
    targets.forEach((target) => {
      target.set({ fontSize });
      target.dirty = true;
      if (typeof target.initDimensions === 'function') target.initDimensions();
      if (typeof target.setCoords === 'function') target.setCoords();
    });
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });

  const onSelectionChanged = () => {
    updateTopBarForSelection(instance);
    publishCanvasJson(instance);
  };
  fabricCanvas.on('selection:created', onSelectionChanged);
  fabricCanvas.on('selection:updated', onSelectionChanged);
  fabricCanvas.on('selection:cleared', onSelectionChanged);
  fabricCanvas.on('mouse:down', (event) => {
    if (instance.data.toolMode !== 'pan') return;
    const e = event && event.e ? event.e : null;
    if (!e) return;
    instance.data.isPanning = true;
    instance.data.panLastClientX = Number(e.clientX) || 0;
    instance.data.panLastClientY = Number(e.clientY) || 0;
    ui.board.style.cursor = 'grabbing';
  });
  fabricCanvas.on('mouse:down', (event) => {
    if (instance.data.toolMode === 'pan') return;
    const target = event && event.target ? event.target : null;
    const clickedArtboard = !!(target && target.isArtboard);
    const clickedEmpty = !target || clickedArtboard;
    if (!clickedEmpty) return;
    if (!fabricCanvas.getActiveObject()) return;
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  });
  fabricCanvas.on('mouse:move', (event) => {
    if (instance.data.toolMode !== 'pan' || !instance.data.isPanning) return;
    const e = event && event.e ? event.e : null;
    if (!e) return;
    const currentX = Number(e.clientX) || 0;
    const currentY = Number(e.clientY) || 0;
    const deltaX = currentX - (Number(instance.data.panLastClientX) || 0);
    const deltaY = currentY - (Number(instance.data.panLastClientY) || 0);
    instance.data.panLastClientX = currentX;
    instance.data.panLastClientY = currentY;
    instance.data.panX = (Number(instance.data.panX) || 0) + deltaX;
    instance.data.panY = (Number(instance.data.panY) || 0) + deltaY;
    ensureCanvasSize(instance);
  });
  fabricCanvas.on('mouse:up', () => {
    if (!instance.data.isPanning) return;
    instance.data.isPanning = false;
    ui.board.style.cursor = instance.data.toolMode === 'pan' ? 'grab' : '';
  });
  fabricCanvas.on('object:scaling', (event) => {
    const target = event && event.target ? event.target : null;
    const transform = event && event.transform ? event.transform : null;
    if (!target || !isShapeObject(target) || !transform) return;
    // Keep stroke visually stable during live scaling (not only after drop).
    applyStrokeUniformDeep(target);
    const original = transform.original && typeof transform.original === 'object'
      ? transform.original
      : null;

    if (isCornerControl(transform.corner)) {
      const opposite = oppositeOriginForCorner(transform.corner);
      if (!opposite || typeof target.getPointByOrigin !== 'function' || typeof target.setPositionByOrigin !== 'function') {
        return;
      }
      const anchorPoint = target.getPointByOrigin(opposite.x, opposite.y);
      const sx = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
      const sy = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
      const signX = sx < 0 ? -1 : 1;
      const signY = sy < 0 ? -1 : 1;

      // Preserve the existing object aspect ratio at the beginning of corner scaling.
      const baseX = Number.isFinite(Number(original && original.scaleX))
        ? Math.abs(Number(original.scaleX))
        : Math.abs(sx);
      const baseY = Number.isFinite(Number(original && original.scaleY))
        ? Math.abs(Number(original.scaleY))
        : Math.abs(sy);
      const safeBaseX = Math.max(baseX, 1e-6);
      const safeBaseY = Math.max(baseY, 1e-6);

      const factorX = Math.abs(sx) / safeBaseX;
      const factorY = Math.abs(sy) / safeBaseY;
      const uniformFactor = Math.max(factorX, factorY);
      target.set({
        scaleX: signX * safeBaseX * uniformFactor,
        scaleY: signY * safeBaseY * uniformFactor,
      });
      target.setPositionByOrigin(anchorPoint, opposite.x, opposite.y);
    }

    // Keep corner radius visually locked in pixels, regardless of deformation.
    if (target.type === 'rect') {
      const lockedRadiusPx = original && Number.isFinite(Number(original.cornerRadiusPx))
        ? Math.max(0, Number(original.cornerRadiusPx))
        : getRectCornerRadiusPx(target);
      applyRectCornerRadiusPx(target, lockedRadiusPx);
    }

    if (original && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
      const sxFinal = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
      const syFinal = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
      const baseScaleX = Math.max(Math.abs(Number(original.scaleX) || 1), 1e-6);
      const baseScaleY = Math.max(Math.abs(Number(original.scaleY) || 1), 1e-6);
      const baseRadiusPx = Number.isFinite(Number(original.cornerRadiusPx))
        ? Math.max(0, Number(original.cornerRadiusPx))
        : (() => {
          const baseCorner = Number.isFinite(Number(original.cornerRadius))
            ? Number(original.cornerRadius)
            : Number(target.cornerRadius);
          return Math.max(0, Number(baseCorner) || 0) * Math.min(baseScaleX, baseScaleY);
        })();
      target.cornerRadiusPx = baseRadiusPx;
      target.cornerRadius = Math.max(0, baseRadiusPx / Math.min(sxFinal, syFinal));
    }

    if (typeof target.setCoords === 'function') target.setCoords();
  });
  fabricCanvas.on('object:added', (event) => {
    const target = event && event.target ? event.target : null;
    if (target && target.isArtboard) return;
    if (target && typeof target.set === 'function' && 'strokeWidth' in target) {
      target.set({ strokeUniform: true });
    }
    ensureArtboardAtBack(instance);
    publishCanvasJson(instance);
  });
  fabricCanvas.on('object:modified', (event) => {
    let target = event && event.target ? event.target : null;
    normalizeObjectScale(target);
    if (target && target.type === 'rect' && Number.isFinite(Number(target.rx)) && Number.isFinite(Number(target.ry))) {
      const lockedRadiusPx = getRectCornerRadiusPx(target);
      applyRectCornerRadiusPx(target, lockedRadiusPx);
    }
    if (target && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
      if (!Number.isFinite(Number(target.cornerRadiusPx))) {
        const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
        const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
        target.cornerRadiusPx = Math.max(0, Number(target.cornerRadius) || 0) * Math.min(sx, sy);
      }
      const replacement = replaceRoundedPolygon(instance, target, Number(target.cornerRadius), fabricLib);
      if (replacement) {
        replacement.cornerRadiusPx = target.cornerRadiusPx;
        target = replacement;
        fabricCanvas.setActiveObject(replacement);
      }
    }
    if (target && typeof target.setCoords === 'function') {
      target.setCoords();
    }
    ensureArtboardAtBack(instance);
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });
  fabricCanvas.on('object:removed', () => {
    ensureArtboardAtBack(instance);
    publishCanvasJson(instance);
  });
  fabricCanvas.on('path:created', () => {
    const path = fabricCanvas.getActiveObject();
    if (path && path.type === 'path') {
      const points = extractPathPoints(path);
      if (points.length >= 3) {
        const smoothedPathData = buildSmoothFreehandPath(points, 0.45);
        if (smoothedPathData) {
          const smoothed = new fabricLib.Path(smoothedPathData, {
            left: path.left,
            top: path.top,
            angle: path.angle,
            scaleX: path.scaleX,
            scaleY: path.scaleY,
            originX: path.originX,
            originY: path.originY,
            fill: '',
            stroke: path.stroke,
            strokeWidth: path.strokeWidth,
            strokeUniform: true,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
          });
          const objects = fabricCanvas.getObjects();
          const index = objects.indexOf(path);
          fabricCanvas.remove(path);
          if (index >= 0) fabricCanvas.insertAt(index, smoothed);
          else fabricCanvas.add(smoothed);
          fabricCanvas.setActiveObject(smoothed);
        }
      } else if (typeof path.set === 'function') {
        path.set({
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
        });
      }
    }
    ensureArtboardAtBack(instance);
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;
    const clickedShapeTrigger = ui.shapeBtn.contains(target);
    const clickedMenu = shapeMenu.contains(target);
    const clickedIconTrigger = ui.iconBtn.contains(target);
    const clickedIconMenu = iconMenu.contains(target);
    if (clickedShapeTrigger || clickedMenu || clickedIconTrigger || clickedIconMenu) return;
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
  }, true);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => ensureCanvasSize(instance));
    observer.observe(ui.board);
    instance.data.resizeObserver = observer;
  }

  instance.data.ensureCanvasSize = () => ensureCanvasSize(instance);
  setActiveToolButton(null);
  publishCanvasJson(instance);
}
