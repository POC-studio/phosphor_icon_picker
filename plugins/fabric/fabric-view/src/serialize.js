import { goToArtboard } from './guides.js';
import { schedulePagePreviews } from './previews.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { clampArtboardIndex } from './utils.js';


/**
 * Met à jour uniquement pageSnapshots depuis le canvas courant — sans publishState.
 * À utiliser quand on a besoin d’un snapshot à jour (ex. export PDF) sans pousser canvas_json
 * vers Bubble (sinon des workflows peuvent réécraser le champ qui alimente initial_json).
 */
function syncCurrentCanvasToPageSnapshots(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) return;
  const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
  instance.data.activeArtboardIndex = idx;
  if (!Array.isArray(instance.data.pageSnapshots)) {
    instance.data.pageSnapshots = [null, null, null];
  }
  try {
    instance.data.pageSnapshots[idx] = instance.data.fabricCanvas.toJSON();
  } catch (e) {
    /* ignore */
  }
}


function publishCanvasJson(instance, options) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) return;
  const silent = (options && options.silent)
    || (instance.data._artboardSwapInProgress === true);
  const skipPreviews = options && options.skipPreviews === true;
  const forceBubble = options && options.forcePublishToBubble === true;
  const suppressBubble = instance.data._suppressCanvasJsonPublish === true && !forceBubble;
  const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
  instance.data.activeArtboardIndex = idx;
  if (!Array.isArray(instance.data.pageSnapshots)) {
    instance.data.pageSnapshots = [null, null, null];
  }
  try {
    instance.data.pageSnapshots[idx] = instance.data.fabricCanvas.toJSON();
    const payload = JSON.stringify({
      version: 1,
      activeArtboardIndex: idx,
      artboards: instance.data.pageSnapshots.slice(),
    });
    if (!suppressBubble) {
      instance.data._lastPublishedCanvasJson = payload;
      instance.publishState('canvas_json', payload);
    }
  } catch (e) {
    /* Ne jamais publier '{}' : un workflow Bubble qui écrit canvas_json en base effacerait la donnée (ex. collage image + toJSON échoue). */
    console.warn('Fabric View: publishCanvasJson ignoré (toJSON / stringify)', e);
  }
  if (!silent && !suppressBubble) {
    instance.triggerEvent('json_changed');
  }
  if (!suppressBubble && !skipPreviews) {
    schedulePagePreviews(instance);
  }
}


/** Regroupe les publications déclenchées par les events Fabric (collage, guides, etc.) pour limiter les rafales vers Bubble. */
function schedulePublishCanvasJson(instance) {
  if (!instance || !instance.data) return;
  const d = instance.data;
  if (d._schedulePublishCanvasJsonTimer) {
    clearTimeout(d._schedulePublishCanvasJsonTimer);
  }
  d._schedulePublishCanvasJsonTimer = setTimeout(() => {
    d._schedulePublishCanvasJsonTimer = null;
    publishCanvasJson(instance);
  }, 120);
}


/**
 * Marque les Image du JSON Fabric avec crossOrigin: 'anonymous' avant enliven,
 * pour que toDataURL (export PDF) ne tombe pas en SecurityError (canvas tainted).
 */
function ensureFabricSnapshotCrossOrigin(snap) {
  if (!snap || typeof snap !== 'object') return;

  const tagImage = (o) => {
    if (!o || o.type !== 'Image') return;
    const src = o.src;
    if (typeof src === 'string' && /^https?:\/\//i.test(src)) {
      o.crossOrigin = 'anonymous';
    }
  };

  const walk = (objs) => {
    if (!Array.isArray(objs)) return;
    objs.forEach((o) => {
      if (!o || typeof o !== 'object') return;
      tagImage(o);
      if (Array.isArray(o.objects)) walk(o.objects);
    });
  };

  walk(snap.objects);
  tagImage(snap.backgroundImage);
  tagImage(snap.overlayImage);
}


function loadFromJsonPromise(fabricCanvas, json) {
  if (!fabricCanvas) return Promise.resolve();
  let data = json;
  if (typeof json === 'string') {
    try {
      data = JSON.parse(json);
    } catch (e) {
      const maybe = fabricCanvas.loadFromJSON(json);
      if (maybe && typeof maybe.then === 'function') return maybe;
      return Promise.resolve();
    }
  }
  ensureFabricSnapshotCrossOrigin(data);
  const maybe = fabricCanvas.loadFromJSON(data);
  if (maybe && typeof maybe.then === 'function') return maybe;
  return Promise.resolve();
}


function loadWrappedCanvasJson(instance, jsonString) {
  if (!instance || !instance.data) return;
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return;
  }
  if (!parsed || !Array.isArray(parsed.artboards) || parsed.artboards.length !== 3) {
    return;
  }
  instance.data.pageSnapshots = [
    parsed.artboards[0],
    parsed.artboards[1],
    parsed.artboards[2],
  ];
  const idx = clampArtboardIndex(parsed.activeArtboardIndex);
  instance.data.activeArtboardIndex = idx;
  goToArtboard(instance, idx, { skipSave: true })
    .then(() => {
      instance.data._suppressCanvasJsonPublish = false;
      // Hydrate initial : publie le doc à Bubble mais ne régénère pas les previews
      // des 3 pages (coûteux : rendu + upload). Elles seront générées à la 1re modif.
      publishCanvasJson(instance, { skipPreviews: true });
      updateTopBarForSelection(instance);
    })
    .catch(() => {
      instance.data._suppressCanvasJsonPublish = false;
    });
}


function isWrappedArtboardsJson(parsed) {
  return parsed && typeof parsed === 'object'
    && parsed.version === 1
    && Array.isArray(parsed.artboards)
    && parsed.artboards.length === 3;
}


const FABRIC_CLIPBOARD_EXTRA_KEYS = [
  'id',
  'iconKind',
  'iconName',
  'iconStyle',
  'shapeKind',
  'shapePoints',
  'cornerRadiusPx',
  'cornerRadius',
];


function buildFabricClipboardJsonString(targets) {
  if (!Array.isArray(targets) || targets.length === 0) return '';
  try {
    const objectsPayload = targets.map((o) => (
      typeof o.toObject === 'function' ? o.toObject(FABRIC_CLIPBOARD_EXTRA_KEYS) : null
    )).filter(Boolean);
    if (objectsPayload.length === 0) return '';
    const payload = objectsPayload.length === 1 ? objectsPayload[0] : { objects: objectsPayload };
    return JSON.stringify(payload);
  } catch (e) {
    return '';
  }
}

export {
  syncCurrentCanvasToPageSnapshots,
  publishCanvasJson,
  schedulePublishCanvasJson,
  ensureFabricSnapshotCrossOrigin,
  loadFromJsonPromise,
  loadWrappedCanvasJson,
  isWrappedArtboardsJson,
  FABRIC_CLIPBOARD_EXTRA_KEYS,
  buildFabricClipboardJsonString,
};
