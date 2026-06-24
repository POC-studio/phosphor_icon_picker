import { zipSync } from 'fflate';
import { uploadBlob } from './bubble-upload.js';
import { PAGE_PREVIEWS_COOLDOWN_MS, PAGE_PREVIEWS_DEBOUNCE_MS, SCENE_PUBLISH_DEBOUNCE_MS } from './constants.js';
import {
  ensureAllBlocksIncludedInExport,
  hideAllPageCanvasBorders,
  lockPageDeletion,
  lockPageSelection,
} from './export-lock.js';
import { buildFoldedA4Pdf, buildSequentialPdf, trimImposedPdfForPrinter } from './pdf-imposition.js';
import { getPageIds } from './scene.js';

function sanitizeFileBase(title) {
  const raw = typeof title === 'string' ? title.trim() : '';
  const safe = raw.replace(/[^\w.-]+/g, '_').replace(/^_+|_+$/g, '');
  return safe || 'document';
}

function downloadBlob(blob, fileName) {
  if (!blob || typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'document.pdf';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function setUnsavedChanges(instance, value) {
  if (!instance?.publishState) return;
  instance.publishState('unsaved_changes', value === true);
}

export function publishSceneJson(instance, options) {
  const engine = instance.data.engine;
  const force = options && options.force === true;
  const skipPreviews = options && options.skipPreviews === true;
  if (!engine || !engine.scene || typeof engine.scene.saveToString !== 'function') {
    return Promise.resolve(false);
  }
  if (!force && instance.data._suppressCanvasJsonPublish === true) return Promise.resolve(false);

  return engine.scene.saveToString().then((sceneString) => {
    if (typeof sceneString !== 'string' || sceneString.length === 0) return false;
    if (!force && sceneString === instance.data._lastPublishedCanvasJson) return false;
    instance.data._lastPublishedCanvasJson = sceneString;
    instance.publishState('canvas_json', sceneString);
    instance.triggerEvent('json_changed');
    if (!skipPreviews) {
      schedulePagePreviews(instance);
    }
    return true;
  }).catch((err) => {
    console.error('IMG.LY View: saveToString failed', err);
    return false;
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

function resolveExportPageIds(instance) {
  const engine = instance.data.engine;
  if (!engine?.block) return [];
  let pageIds = getPageIds(engine);
  if (!pageIds.length) {
    pageIds = instance.data.pageIds || [];
  }
  return pageIds;
}

async function exportAllPagePreviewPngs(engine, pageIds, base) {
  ensureAllBlocksIncludedInExport(engine);
  hideAllPageCanvasBorders(engine);

  const exports = [];
  for (let index = 0; index < pageIds.length; index += 1) {
    try {
      const blob = await engine.block.export(pageIds[index], {
        mimeType: 'image/png',
        targetWidth: 500,
      });
      const safeName = `${base}-preview-${String(index + 1).padStart(2, '0')}.png`.replace(/[^\w.-]/g, '_');
      exports.push({ name: safeName, blob });
    } catch (err) {
      console.error('IMG.LY View: page preview export failed', err);
    }
  }
  return exports;
}

export function createPagePreviews(instance) {
  const engine = instance.data.engine;
  const context = instance.data.bubbleContext || null;
  if (!engine || !engine.block) return Promise.resolve([]);

  const pageIds = resolveExportPageIds(instance);
  if (!pageIds.length) return Promise.resolve([]);

  const base = sanitizeFileBase(instance.data.documentTitle);
  const runId = (instance.data._pagePreviewsRunId || 0) + 1;
  instance.data._pagePreviewsRunId = runId;
  instance.data._lastPagePreviewsAt = Date.now();

  return exportAllPagePreviewPngs(engine, pageIds, base).then((items) => {
    const exportOne = (item) => uploadBlob(context, item.name, item.blob).catch((err) => {
      console.error('IMG.LY View: page preview upload failed', err);
      return '';
    });
    return Promise.all(items.map(exportOne));
  }).then((uploaded) => {
    if (instance.data._pagePreviewsRunId !== runId) return uploaded;
    instance.data._lastPreviewedSceneKey = instance.data._lastPublishedCanvasJson || '';
    const urls = uploaded.filter((u) => typeof u === 'string' && u.length > 0);
    instance.publishState('page_previews', urls);
    if (urls.length > 0) {
      instance.triggerEvent('page_previews_ready');
    } else {
      console.warn('IMG.LY View: previews uploadées sans URL exploitable — page_previews_ready non déclenché');
    }
    return urls;
  }).catch((err) => {
    console.error('IMG.LY View: create_page_previews', err);
    return [];
  });
}

/** Figé l'état CE.SDK avant export PDF sans publier canvas_json. */
async function syncSceneBeforePdfExport(instance) {
  const engine = instance.data.engine;
  if (!engine?.scene || typeof engine.scene.saveToString !== 'function') return;
  try {
    await engine.scene.saveToString();
  } catch (err) {
    console.error('IMG.LY View: pre-PDF saveToString failed', err);
  }
}

export async function triggerSaveDocument(instance) {
  if (!instance || !instance.data) return false;
  if (instance.data._saveInProgress === true) return false;

  instance.data._saveInProgress = true;
  try {
    await publishSceneJson(instance, { force: true, skipPreviews: true });
    await createPagePreviews(instance);
    await triggerPdfExport(instance, { download: false, generateTrimmed: true });
    setUnsavedChanges(instance, false);
    instance.triggerEvent('document_saved');
    return true;
  } catch (err) {
    console.error('IMG.LY View: enregistrement document', err);
    return false;
  } finally {
    instance.data._saveInProgress = false;
  }
}

export async function triggerPreviewsZipDownload(instance) {
  const engine = instance.data.engine;
  if (!engine?.block) return '';

  const pageIds = resolveExportPageIds(instance);
  if (!pageIds.length) return '';

  const base = sanitizeFileBase(instance.data.documentTitle);
  const safeZipName = `${base}-previews.zip`.replace(/[^\w.-]/g, '_') || 'previews.zip';

  try {
    const items = await exportAllPagePreviewPngs(engine, pageIds, base);
    if (!items.length) return '';

    const zipEntries = {};
    for (const item of items) {
      zipEntries[item.name] = new Uint8Array(await item.blob.arrayBuffer());
    }

    const zipped = zipSync(zipEntries);
    downloadBlob(new Blob([zipped], { type: 'application/zip' }), safeZipName);
    return 'downloaded';
  } catch (err) {
    console.error('IMG.LY View: previews ZIP export failed', err);
    return '';
  }
}

export async function triggerPdfExport(instance, options) {
  const download = !options || options.download !== false;
  const generateTrimmed = options?.generateTrimmed === true;
  const mode = options?.mode === 'sequential' ? 'sequential' : 'imposed';
  const engine = instance.data.engine;
  const context = instance.data.bubbleContext || null;
  if (!engine?.block) return '';

  let pageIds = getPageIds(engine);
  if (!pageIds.length) {
    pageIds = instance.data.pageIds || [];
  }
  if (!pageIds.length) return '';

  if (mode === 'imposed' && pageIds.length % 4 !== 0) {
    console.error('IMG.LY View: PDF export aborted — page count must be a multiple of 4:', pageIds.length);
    return '';
  }

  ensureAllBlocksIncludedInExport(engine);
  hideAllPageCanvasBorders(engine);
  await syncSceneBeforePdfExport(instance);

  if (typeof engine.block.forceLoadResources === 'function') {
    try {
      await engine.block.forceLoadResources(pageIds);
    } catch (err) {
      console.warn('IMG.LY View: forceLoadResources avant export PDF', err);
    }
  }

  const base = sanitizeFileBase(instance.data.documentTitle);
  const safePdfName = (base + (mode === 'sequential' ? '.pdf' : '-impression.pdf')).replace(/[^\w.-]/g, '_') || 'document.pdf';

  try {
    const blob = mode === 'sequential'
      ? await buildSequentialPdf(engine, pageIds)
      : await buildFoldedA4Pdf(engine, pageIds);
    const url = await uploadBlob(context, safePdfName, blob);
    if (mode === 'imposed' && typeof url === 'string' && url.length > 0) {
      instance.publishState('pdf_url', url);
      instance.triggerEvent('pdf_ready');
    } else if (mode === 'imposed' && blob && blob.size > 0) {
      console.warn('IMG.LY View: PDF uploadé dans Bubble mais URL non reçue — pdf_ready non déclenché');
    }
    if (generateTrimmed && mode === 'imposed' && blob && blob.size > 0) {
      try {
        const trimmedBlob = await trimImposedPdfForPrinter(blob);
        const safeTrimmedName = (base + '-trimed-impression.pdf').replace(/[^\w.-]/g, '_') || 'document-trimed-impression.pdf';
        const trimmedUrl = await uploadBlob(context, safeTrimmedName, trimmedBlob);
        if (typeof trimmedUrl === 'string' && trimmedUrl.length > 0) {
          instance.publishState('trimed_pdf_url', trimmedUrl);
          instance.triggerEvent('trimed_pdf_ready');
        } else {
          console.warn('IMG.LY View: PDF trimé uploadé dans Bubble mais URL non reçue — trimed_pdf_ready non déclenché');
        }
      } catch (err) {
        console.warn('IMG.LY View: échec génération/upload PDF trimé (pdf_url inchangé)', err);
      }
    }
    if (download) {
      downloadBlob(blob, safePdfName);
    }
    return url || (download ? 'downloaded' : '');
  } catch (err) {
    console.error('IMG.LY View: PDF export failed', err);
    return '';
  }
}

export function wireHistoryListener(instance) {
  const engine = instance.data.engine;
  if (!engine || !engine.editor || typeof engine.editor.onHistoryUpdated !== 'function') return;
  if (typeof instance.data._unsubscribeHistory === 'function') {
    instance.data._unsubscribeHistory();
  }
  instance.data._unsubscribeHistory = engine.editor.onHistoryUpdated(() => {
    if (instance.data._suppressUnsavedChanges === true) return;
    if (instance.data._saveInProgress === true) return;
    setUnsavedChanges(instance, true);
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
  });
}
