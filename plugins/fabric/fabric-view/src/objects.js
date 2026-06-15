import { ALT_DUP_MIN_MOVE_PX, DEFAULT_TEXT_FONT_FAMILY, RANDOM_COLORS } from './constants.js';
import { ensureArtboardAtBack, rebindArtboardFromCanvas, syncGuideLayers, syncGuideStackAfterUserZOrder } from './guides.js';
import { applyTextboxEditingControls, relayoutParentGroups } from './text.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { ensureHexColor, isTransparentColor, randomFrom, randomInt } from './utils.js';


function createRandomSeedObjects(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return [];
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);

  const rect = new fabricLib.Rect({
    left: randomInt(40, Math.floor(maxW * 0.3)),
    top: randomInt(40, Math.floor(maxH * 0.3)),
    width: randomInt(90, 180),
    height: randomInt(70, 140),
    fill: randomFrom(RANDOM_COLORS),
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    rx: 8,
    ry: 8,
    cornerRadiusPx: 8,
    angle: randomInt(-20, 20),
  });

  const circle = new fabricLib.Circle({
    left: randomInt(Math.floor(maxW * 0.35), Math.floor(maxW * 0.65)),
    top: randomInt(40, Math.floor(maxH * 0.35)),
    radius: randomInt(35, 70),
    fill: randomFrom(RANDOM_COLORS),
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    angle: randomInt(-25, 25),
  });

  const text = new fabricLib.Textbox('Fabric V1', {
    left: randomInt(Math.floor(maxW * 0.2), Math.floor(maxW * 0.6)),
    top: randomInt(Math.floor(maxH * 0.45), Math.floor(maxH * 0.75)),
    width: 180,
    fontFamily: DEFAULT_TEXT_FONT_FAMILY,
    fontSize: 34,
    fontWeight: 700,
    fill: '#111827',
    stroke: '#00000000',
    strokeWidth: 0,
    strokeUniform: true,
    angle: randomInt(-10, 10),
  });
  applyTextboxEditingControls(text);

  return [rect, circle, text];
}


function createDefaultRectangle(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return null;
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);
  return new fabricLib.Rect({
    left: Math.round(maxW * 0.5 - 60),
    top: Math.round(maxH * 0.5 - 45),
    width: 120,
    height: 90,
    fill: '#14b8a6',
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    rx: 8,
    ry: 8,
    cornerRadiusPx: 8,
  });
}


function createDefaultTextbox(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return null;
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);
  const textbox = new fabricLib.Textbox('Edit me', {
    left: Math.round(maxW * 0.5 - 90),
    top: Math.round(maxH * 0.5 - 20),
    width: 180,
    fontFamily: DEFAULT_TEXT_FONT_FAMILY,
    fontSize: 36,
    fontWeight: 600,
    fill: '#111827',
    stroke: '#00000000',
    strokeWidth: 0,
    strokeUniform: true,
  });
  applyTextboxEditingControls(textbox);
  return textbox;
}


function getObjectStyle(target) {
  if (!target) {
    return { fill: 'transparent', stroke: 'transparent', strokeWidth: 1, radius: 0, opacity: 1 };
  }
  const fill = typeof target.fill === 'string'
    ? target.fill
    : (target.fill && typeof target.fill.toString === 'function' ? String(target.fill.toString()) : 'transparent');
  const stroke = typeof target.stroke === 'string'
    ? target.stroke
    : (target.stroke && typeof target.stroke.toString === 'function' ? String(target.stroke.toString()) : 'transparent');
  let strokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 1;
  const scaleX = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
  const scaleY = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
  const rawRx = Number.isFinite(Number(target.rx)) ? Number(target.rx) : 0;
  const rawRy = Number.isFinite(Number(target.ry)) ? Number(target.ry) : rawRx;
  const visualRadius = Number.isFinite(Number(target.cornerRadiusPx))
    ? Math.max(0, Number(target.cornerRadiusPx))
    : Math.max(0, Math.min(rawRx * scaleX, rawRy * scaleY));
  const normalizedFill = isTransparentColor(fill) ? 'transparent' : ensureHexColor(fill, '#111827');
  const normalizedStroke = isTransparentColor(stroke) ? 'transparent' : ensureHexColor(stroke, '#000000');
  const rawOpacity = Number.isFinite(Number(target.opacity)) ? Number(target.opacity) : 1;
  const opacity = Math.max(0, Math.min(1, rawOpacity));
  return {
    fill: normalizedFill,
    stroke: normalizedStroke,
    strokeWidth: Math.max(0, Math.min(50, strokeWidth)),
    radius: Math.max(0, Math.min(200, visualRadius)),
    opacity,
  };
}




function resolveFabric() {
  if (window.fabric) return window.fabric;
  if (window.Fabric) return window.Fabric;
  return null;
}


/** Identifiant stable pour chaque image raster (sérialisé via FabricObject.customProperties). */
function newFabricImageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `img_${Math.random().toString(36).slice(2, 12)}_${Date.now().toString(36)}`;
}


function ensureFabricImageIdSerialization(fabricLib) {
  if (!fabricLib || !fabricLib.FabricObject || !Array.isArray(fabricLib.FabricObject.customProperties)) return;
  if (fabricLib.FabricObject.customProperties.indexOf('id') === -1) {
    fabricLib.FabricObject.customProperties.push('id');
  }
  if (fabricLib.FabricObject.customProperties.indexOf('cornerRadiusPx') === -1) {
    fabricLib.FabricObject.customProperties.push('cornerRadiusPx');
  }
}


function isFabricRasterImage(target) {
  if (!target) return false;
  return String(target.type || '').toLowerCase() === 'image';
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


/** Groupe Fabric « normal » (pas ActiveSelection). */
function isFabricGroupObject(target) {
  if (!target) return false;
  return String(target.type || '').toLowerCase() === 'group';
}


/** Objets feuilles pour fill / stroke / typo (développe les groupes imbriqués). */
function flattenStyleTargetsFromGroup(group) {
  const out = [];
  if (!group || typeof group.getObjects !== 'function') return out;
  const kids = group.getObjects();
  if (!Array.isArray(kids)) return out;
  kids.forEach((child) => {
    if (!child || child.isArtboard || child.isSafeZone) return;
    if (isFabricGroupObject(child)) {
      out.push(...flattenStyleTargetsFromGroup(child));
    } else {
      out.push(child);
    }
  });
  return out;
}


/**
 * Cibles pour la barre d’outils et applyStyleToSelection : comme une multi-sélection,
 * avec développement des groupes pour éditer toutes les formes à l’intérieur.
 */
function getToolbarStyleTargets(fabricCanvas) {
  if (!fabricCanvas) return [];
  const active = fabricCanvas.getActiveObject();
  if (!active) return [];

  const expandTopLevel = (list) => {
    const out = [];
    list.forEach((item) => {
      if (!item || item.isArtboard || item.isSafeZone) return;
      if (isFabricGroupObject(item)) {
        out.push(...flattenStyleTargetsFromGroup(item));
      } else {
        out.push(item);
      }
    });
    return out;
  };

  if (isSelectionContainer(active)) {
    const objects = active.getObjects();
    const raw = Array.isArray(objects) ? objects.filter(Boolean) : [];
    return expandTopLevel(raw);
  }
  if (isFabricGroupObject(active)) {
    return flattenStyleTargetsFromGroup(active);
  }
  return [active];
}


function walkFabricObjectsDepthFirst(rootList, visit) {
  if (!Array.isArray(rootList)) return;
  rootList.forEach((o) => {
    if (!o) return;
    visit(o);
    if (typeof o.getObjects === 'function') {
      const kids = o.getObjects();
      if (Array.isArray(kids)) walkFabricObjectsDepthFirst(kids, visit);
    }
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


function isPartOfActiveObject(active, clicked) {
  if (!active || !clicked) return false;
  if (active === clicked) return true;
  if (isSelectionContainer(active)) {
    const objs = active.getObjects();
    return Array.isArray(objs) && objs.indexOf(clicked) !== -1;
  }
  if (clicked.group && clicked.group === active) return true;
  return false;
}


function applyStateFromTransformOriginal(target, orig) {
  if (!target || !orig || typeof orig !== 'object') return;
  // Ne pas copier originX/originY depuis transform.original : Fabric y met les
  // coordonnées d’ancrage du contrôle de drag (u.x/u.y), pas originX/originY
  // de l’objet — les appliquer décale le clone (souvent haut-gauche).
  const keys = ['left', 'top', 'scaleX', 'scaleY', 'angle', 'skewX', 'skewY', 'flipX', 'flipY'];
  const patch = {};
  keys.forEach((k) => {
    if (orig[k] !== undefined) patch[k] = orig[k];
  });
  target.set(patch);
  if (typeof target.setCoords === 'function') target.setCoords();
}


function isDragMoveTransform(transform) {
  if (!transform) return false;
  if (transform.corner) return false;
  const a = transform.action;
  if (a === 'scale' || a === 'rotate' || a === 'skewX' || a === 'skewY') return false;
  if (a === 'drag' || a === 'translate' || a === 'move') return true;
  return a === undefined || a === null;
}


function performAltDuplicateDrag(instance, fabricCanvas, e) {
  if (!instance || !fabricCanvas || !e) return;
  const target = e.target;
  const transform = e.transform;
  if (!target || !transform || !transform.original) return;
  if (target.isArtboard || target.isSafeZone) return;
  if (typeof target.isEditing === 'function' && target.isEditing) return;
  if (typeof target.isEditing === 'boolean' && target.isEditing) return;
  if (!isDragMoveTransform(transform)) return;

  const active = fabricCanvas.getActiveObject();
  if (!active || target !== active) return;
  if (!instance.data.altKeyAtMouseDown) return;

  const gid = Number(instance.data._canvasPointerGestureId) || 0;
  if (Number.isFinite(instance.data._altDupClonedGestureId) && instance.data._altDupClonedGestureId === gid) {
    return;
  }

  const moveEv = e.e;
  if (moveEv && Number.isFinite(Number(instance.data._altDupDownClientX)) && Number.isFinite(Number(instance.data._altDupDownClientY))) {
    const dx = (Number(moveEv.clientX) || 0) - Number(instance.data._altDupDownClientX);
    const dy = (Number(moveEv.clientY) || 0) - Number(instance.data._altDupDownClientY);
    if (dx * dx + dy * dy < ALT_DUP_MIN_MOVE_PX * ALT_DUP_MIN_MOVE_PX) {
      return;
    }
  }

  const orig = transform.original;

  // Déduplication irréversible : ce geste a « consommé » son clone. On ne rétablit
  // jamais ces drapeaux en cas d'échec (sinon le verrou se rouvre dans le même geste
  // et on empile des centaines de copies). Reset uniquement au prochain mouse:down.
  instance.data._altDupClonedGestureId = gid;
  instance.data._altDuplicateDone = true;

  const cloneSource = active;
  const done = (cloned) => {
    if (!cloned) {
      console.warn('[FabricView alt-drag] clone vide — duplication ignorée pour ce geste');
      return;
    }
    // Comportement type Illustrator inversé : le clone reste à la position de départ,
    // l’objet d’origine continue d’être déplacé (transform inchangé sur la source).
    applyStateFromTransformOriginal(cloned, orig);
    if (typeof cloned.setCoords === 'function') cloned.setCoords();
    applyStrokeUniformDeep(cloned);
    const stackIndex = fabricCanvas.getObjects().indexOf(cloneSource);
    if (stackIndex >= 0 && typeof fabricCanvas.insertAt === 'function') {
      fabricCanvas.insertAt(stackIndex, cloned);
    } else {
      fabricCanvas.add(cloned);
    }
    fabricCanvas.requestRenderAll();
    syncGuideLayers(instance);
    updateTopBarForSelection(instance);
  };

  if (typeof cloneSource.clone !== 'function') {
    return;
  }

  // En cas d'échec, on ne rouvre PAS le verrou (pire cas : pas de clone, jamais de boucle).
  try {
    const result = cloneSource.clone();
    if (result && typeof result.then === 'function') {
      result.then(done).catch((err) => {
        console.warn('[FabricView alt-drag] clone échoué', err);
      });
    } else {
      done(result);
    }
  } catch (err) {
    console.warn('[FabricView alt-drag] clone échoué (exception)', err);
  }
}


/**
 * Déplace l’objet vers l’index final `dest` (indices avant le move).
 * Équivalent Fabric : remove puis splice à (dest > from ? dest - 1 : dest).
 */
function moveCanvasObjectToFinalIndex(fabricCanvas, object, from, dest) {
  if (!fabricCanvas || !object || from < 0 || dest < 0 || from === dest) return;
  if (typeof fabricCanvas.moveObjectTo === 'function') {
    const idxAfterRemoval = dest > from ? dest - 1 : dest;
    fabricCanvas.moveObjectTo(object, idxAfterRemoval);
    return;
  }
  fabricCanvas.remove(object);
  const idxAfterRemoval = dest > from ? dest - 1 : dest;
  const len = fabricCanvas.getObjects().length;
  const clamped = Math.max(0, Math.min(idxAfterRemoval, len));
  if (typeof fabricCanvas.insertAt === 'function') {
    fabricCanvas.insertAt(clamped, object);
  } else {
    fabricCanvas.add(object);
  }
}


/** Objet réellement empilé sur le canvas (sélection simple ou ActiveSelection / groupe), pas les feuilles. */
function getZOrderStackTarget(fabricCanvas) {
  const active = fabricCanvas && fabricCanvas.getActiveObject ? fabricCanvas.getActiveObject() : null;
  if (!active || active.isArtboard || active.isSafeZone) return null;
  return active;
}


function applyZOrderToSelection(fabricCanvas, action, instance) {
  if (!fabricCanvas) return;
  const target = getZOrderStackTarget(fabricCanvas);
  if (!target) return;
  const objects = fabricCanvas.getObjects();
  const idx = objects.indexOf(target);
  if (idx < 0) return;

  if (instance) {
    rebindArtboardFromCanvas(instance);
    ensureArtboardAtBack(instance);
  }

  /** Page + 1 couche réservée en dessous du contenu éditable ; premier slot contenu = 2. */
  const minUser = 2;

  if (action === 'to-back') {
    moveCanvasObjectToFinalIndex(fabricCanvas, target, idx, minUser);
  } else if (action === 'backward') {
    const dest = Math.max(minUser, idx - 1);
    moveCanvasObjectToFinalIndex(fabricCanvas, target, idx, dest);
  } else if (action === 'forward') {
    if (typeof fabricCanvas.bringObjectForward === 'function') fabricCanvas.bringObjectForward(target, false);
    else if (typeof target.bringForward === 'function') target.bringForward(false);
  } else if (action === 'to-front') {
    if (typeof fabricCanvas.bringObjectToFront === 'function') fabricCanvas.bringObjectToFront(target);
    else if (typeof target.bringToFront === 'function') target.bringToFront();
  }

  if (typeof fabricCanvas.setActiveObject === 'function') {
    try {
      fabricCanvas.setActiveObject(target);
    } catch (e) {
      /* ignore */
    }
  }

  if (instance) syncGuideStackAfterUserZOrder(instance);
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
    || t === 'image'
    || isRoundedPolygonShape(target);
}


function isCornerControl(controlName) {
  return controlName === 'tl' || controlName === 'tr' || controlName === 'bl' || controlName === 'br';
}


function oppositeOriginForCorner(corner) {
  if (corner === 'tl') return { x: 'right', y: 'bottom' };
  if (corner === 'tr') return { x: 'left', y: 'bottom' };
  if (corner === 'bl') return { x: 'right', y: 'top' };
  if (corner === 'br') return { x: 'left', y: 'top' };
  return null;
}


function normalizeObjectScale(target) {
  if (!target || typeof target.set !== 'function') return;
  if (target.type === 'activeSelection') return;
  const scaleX = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
  const scaleY = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
  if (scaleX === 1 && scaleY === 1) return;

  const type = target.type || '';
  // FabricImage : width/height servent au cadre / crop source — ne pas y fusionner scaleX/Y (effet « crop » au resize).
  if (String(type).toLowerCase() === 'image') {
    return;
  }
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
    if (typeof target.setCoords === 'function') target.setCoords();
    relayoutParentGroups(target);
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

export {
  createRandomSeedObjects,
  createDefaultRectangle,
  createDefaultTextbox,
  getObjectStyle,
  resolveFabric,
  newFabricImageId,
  ensureFabricImageIdSerialization,
  isFabricRasterImage,
  isSelectionContainer,
  getActiveSelectionTargets,
  isFabricGroupObject,
  flattenStyleTargetsFromGroup,
  getToolbarStyleTargets,
  walkFabricObjectsDepthFirst,
  applyStrokeUniformDeep,
  isPartOfActiveObject,
  applyStateFromTransformOriginal,
  isDragMoveTransform,
  performAltDuplicateDrag,
  moveCanvasObjectToFinalIndex,
  getZOrderStackTarget,
  applyZOrderToSelection,
  isTextLikeObject,
  isRoundedPolygonShape,
  isShapeObject,
  isCornerControl,
  oppositeOriginForCorner,
  normalizeObjectScale,
};
