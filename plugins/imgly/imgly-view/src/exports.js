import { PAGE_PREVIEWS_COOLDOWN_MS, PAGE_PREVIEWS_DEBOUNCE_MS, SCENE_PUBLISH_DEBOUNCE_MS } from './constants.js';
import {
  ensureAllBlocksIncludedInExport,
  lockPageDeletion,
  lockPageSelection,
} from './export-lock.js';
import { getPageIds } from './scene.js';

function sanitizeFileBase(title) {
  const raw = typeof title === 'string' ? title.trim() : '';
  const safe = raw.replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
  return safe || 'document';
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string' || dataUrl.indexOf(',') < 0) {
        reject(new Error('Invalid data URL from blob'));
        return;
      }
      resolve(dataUrl.split(',')[1]);
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

function uploadBlob(context, fileName, blob) {
  if (!context || typeof context.uploadContent !== 'function' || !blob) {
    return Promise.resolve('');
  }
  return blobToBase64(blob).then((base64) => {
    if (!base64) return '';
    return new Promise((resolve) => {
      try {
        context.uploadContent(fileName, base64, (err, url) => {
          if (err || typeof url !== 'string' || !/^https?:\/\/|^blob:/i.test(url)) {
            resolve('');
          } else {
            resolve(url);
          }
        });
      } catch (e) {
        resolve('');
      }
    });
  });
}

export function publishSceneJson(instance) {
  const engine = instance.data.engine;
  if (!engine || !engine.scene || typeof engine.scene.saveToString !== 'function') {
    return Promise.resolve();
  }
  if (instance.data._suppressCanvasJsonPublish === true) return Promise.resolve();

  return engine.scene.saveToString().then((sceneString) => {
    if (typeof sceneString !== 'string' || sceneString.length === 0) return;
    if (sceneString === instance.data._lastPublishedCanvasJson) return;
    instance.data._lastPublishedCanvasJson = sceneString;
    instance.publishState('canvas_json', sceneString);
    instance.triggerEvent('json_changed');
    schedulePagePreviews(instance);
  }).catch((err) => {
    console.error('IMG.LY View: saveToString failed', err);
  });
}

export function scheduleScenePublish(instance) {
  if (!instance || !instance.data) return;
  if (instance.data._suppressCanvasJsonPublish === true) return;
  if (instance.data._scheduleScenePublishTimer) {
    clearTimeout(instance.data._scheduleScenePublishTimer);
  }
  instance.data._scheduleScenePublishTimer = setTimeout(() => {
    instance.data._scheduleScenePublishTimer = null;
    publishSceneJson(instance);
  }, SCENE_PUBLISH_DEBOUNCE_MS);
}

export function schedulePagePreviews(instance) {
  if (!instance || !instance.data) return;
  if (instance.data._suppressCanvasJsonPublish === true) return;
  const d = instance.data;
  const sinceLast = Date.now() - (d._lastPagePreviewsAt || 0);
  const delay = sinceLast < PAGE_PREVIEWS_COOLDOWN_MS
    ? Math.max(PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS - sinceLast)
    : PAGE_PREVIEWS_DEBOUNCE_MS;
  if (d._schedulePagePreviewsTimer) {
    clearTimeout(d._schedulePagePreviewsTimer);
  }
  d._schedulePagePreviewsTimer = setTimeout(() => {
    d._schedulePagePreviewsTimer = null;
    if (typeof d.createPagePreviews === 'function') {
      d.createPagePreviews();
    }
  }, delay);
}

export function createPagePreviews(instance) {
  const engine = instance.data.engine;
  const context = instance.data.bubbleContext || null;
  if (!engine || !engine.block) return Promise.resolve([]);

  let pageIds = getPageIds(engine);
  if (!pageIds.length) {
    pageIds = instance.data.pageIds || [];
  }
  if (!pageIds.length) return Promise.resolve([]);

  const base = sanitizeFileBase(instance.data.documentTitle);
  const runId = (instance.data._pagePreviewsRunId || 0) + 1;
  instance.data._pagePreviewsRunId = runId;
  instance.data._lastPagePreviewsAt = Date.now();

  const exportOne = (pageId, index) => engine.block.export(pageId, {
    mimeType: 'image/png',
    targetWidth: 500,
  }).then((blob) => {
    const safeName = (base + '-preview-' + (index + 1) + '.png').replace(/[^\w.-]/g, '_');
    return uploadBlob(context, safeName, blob);
  }).catch((err) => {
    console.error('IMG.LY View: page preview export failed', err);
    return '';
  });

  return Promise.all(pageIds.map(exportOne)).then((uploaded) => {
    if (instance.data._pagePreviewsRunId !== runId) return uploaded;
    instance.data._lastPreviewedSceneKey = instance.data._lastPublishedCanvasJson || '';
    instance.publishState('page_previews', uploaded);
    instance.triggerEvent('page_previews_ready');
    return uploaded;
  }).catch((err) => {
    console.error('IMG.LY View: create_page_previews', err);
    return [];
  });
}

export function triggerPdfExport(instance) {
  const engine = instance.data.engine;
  const context = instance.data.bubbleContext || null;
  if (!engine || !engine.block || !engine.scene) return Promise.resolve('');

  const scene = engine.scene.get();
  if (scene == null) return Promise.resolve('');

  const base = sanitizeFileBase(instance.data.documentTitle);
  const safePdfName = (base + '.pdf').replace(/[^\w.-]/g, '_') || 'document.pdf';

  return engine.block.export(scene, {
    mimeType: 'application/pdf',
    exportPdfWithHighCompatibility: true,
  }).then((blob) => uploadBlob(context, safePdfName, blob)).then((url) => {
    if (typeof url === 'string' && url.length > 0) {
      instance.publishState('pdf_url', url);
      instance.triggerEvent('pdf_ready');
    }
    return url || '';
  }).catch((err) => {
    console.error('IMG.LY View: PDF export failed', err);
    return '';
  });
}

export function wireHistoryListener(instance) {
  const engine = instance.data.engine;
  if (!engine || !engine.editor || typeof engine.editor.onHistoryUpdated !== 'function') return;
  if (typeof instance.data._unsubscribeHistory === 'function') {
    instance.data._unsubscribeHistory();
  }
  instance.data._unsubscribeHistory = engine.editor.onHistoryUpdated((kind) => {
    if (kind === 'Activated') return;
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
    scheduleScenePublish(instance);
  });
}
