import CreativeEditorSDK from '@cesdk/cesdk-js';
import { clampSheetCount } from './booklet-layout.js';
import { getCesdkContentBaseURL } from './cesdk-content-base-url.js';
import { initDesignEditor } from './init-design-editor.ts';
import { ensureFrenchLocale } from './design-editor/i18n.ts';
import {
  createPagePreviews,
  triggerPdfExport,
  triggerPreviewsZipDownload,
  setUnsavedChanges,
  triggerSaveDocument,
  wireHistoryListener,
} from './exports.js';
import { applyBookmarksFromProperties } from './bookmarks.js';
import { setupBubblePdfExport, setupBubbleUpload } from './setup-bubble-export.js';
import { setupNavigationDocumentTitle, syncNavigationDocumentTitle } from './navigation-title.js';
import { setupBookmarks } from './setup-bookmarks.js';
import { setupIcons } from './setup-icons.js';
import { setupJournalStickers } from './setup-journal-stickers.js';
import {
  createBookletScene,
  fitSceneInView,
  loadSceneFromString,
  syncScenePageCount,
} from './scene.js';

function getHostElement(instance) {
  if (!instance || !instance.canvas) return null;
  if (typeof instance.canvas[0] !== 'undefined') return instance.canvas[0];
  return instance.canvas;
}

function showBootError(host, message) {
  if (!host) return;
  host.innerHTML = '';
  const box = document.createElement('div');
  box.textContent = message;
  box.style.cssText = 'position:absolute;top:12px;left:12px;right:12px;padding:10px 12px;font-size:12px;color:#991b1b;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;z-index:2;';
  host.appendChild(box);
}

function parseSheetCountFromProperties(properties) {
  if (!properties) return 1;
  return clampSheetCount(properties.pages);
}

async function recreateBookletScene(instance) {
  const cesdk = instance.data.cesdk;
  const engine = instance.data.engine;
  if (!cesdk || !engine) return;

  instance.data._suppressCanvasJsonPublish = true;
  instance.data._suppressUnsavedChanges = true;
  try {
    instance.data.pageIds = await createBookletScene(cesdk, engine, instance.data.sheetCount);
    instance.data._lastPublishedCanvasJson = null;
    await fitSceneInView(cesdk);
    setUnsavedChanges(instance, false);
  } finally {
    instance.data._suppressUnsavedChanges = false;
  }
}

function applyPropertiesUpdate(instance, properties, context) {
  if (!properties) return;
  instance.data.bubbleContext = context || instance.data.bubbleContext || null;

  applyBookmarksFromProperties(instance, properties.bookmarks_json);

  const nextTitle = typeof properties.document_title === 'string' ? properties.document_title : '';
  const titleChanged = nextTitle !== instance.data.documentTitle;
  instance.data.documentTitle = nextTitle;
  if (titleChanged && instance.data.cesdk) {
    syncNavigationDocumentTitle(instance.data.cesdk, instance);
  }

  const nextSheetCount = parseSheetCountFromProperties(properties);
  const sheetCountChanged = nextSheetCount !== instance.data.sheetCount;
  instance.data.sheetCount = nextSheetCount;

  const incomingCanvasJson = properties.canvas_json;
  const hasBubbleCanvasJson = typeof incomingCanvasJson === 'string' && incomingCanvasJson.length > 0;

  if (hasBubbleCanvasJson) {
    if (incomingCanvasJson !== instance.data._lastPublishedCanvasJson) {
      void loadSceneFromString(instance, incomingCanvasJson);
    } else if (sheetCountChanged && instance.data.cesdkReady) {
      void syncScenePageCount(instance);
    }
    return;
  }

  const initialJson = properties.initial_json;
  if (
    typeof initialJson === 'string'
    && initialJson.trim().length > 0
    && !instance.data._hydratedFromInitialJsonProperty
  ) {
    instance.data._hydratedFromInitialJsonProperty = true;
    void loadSceneFromString(instance, initialJson);
    return;
  }

  if (sheetCountChanged && instance.data.cesdkReady) {
    void recreateBookletScene(instance);
  }
}

async function waitForCreativeEditorSDK(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (CreativeEditorSDK && typeof CreativeEditorSDK.create === 'function') {
      return CreativeEditorSDK;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return null;
}

async function initImglyEditor(instance, context, properties) {
  const host = getHostElement(instance);
  if (!host) return;

  const sdk = await waitForCreativeEditorSDK();
  if (!sdk) {
    showBootError(
      host,
      'CE.SDK non chargé — vérifiez que le shared header du plugin (scripts CDN) est bien collé dans Bubble.',
    );
    return;
  }

  if (instance.data.cesdk && typeof instance.data.cesdk.dispose === 'function') {
    try { instance.data.cesdk.dispose(); } catch (e) { /* ignore */ }
  }

  host.innerHTML = '';
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  host.appendChild(container);

  const license = '';
  const engineBaseURL = `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets/`;
  const contentBaseURL = getCesdkContentBaseURL();
  const pendingProps = instance.data._pendingProperties;
  const sheetCount = parseSheetCountFromProperties(pendingProps || properties);

  try {
    const cesdk = await sdk.create(container, {
      license,
      baseURL: engineBaseURL,
      role: 'Adopter',
    });

    instance.data.cesdk = cesdk;
    instance.data.engine = cesdk.engine;
    instance.data.bubbleContext = context || null;
    instance.data.sheetCount = sheetCount;
    if (typeof cesdk.disableNoSceneWarning === 'function') {
      cesdk.disableNoSceneWarning();
    }
    instance.data.documentTitle = '';
    instance.data._lastPublishedCanvasJson = null;
    instance.data._suppressCanvasJsonPublish = true;
    instance.data._hydratedFromInitialJsonProperty = false;
    instance.data.bookmarksList = [];

    instance.publishState('contribution_id', '');
    instance.publishState('pdf_url', '');
    setUnsavedChanges(instance, false);

    await initDesignEditor(cesdk, { contentBaseURL });
    ensureFrenchLocale(cesdk);
    instance.data.pageIds = await createBookletScene(cesdk, cesdk.engine, sheetCount);

    await fitSceneInView(cesdk);
    setTimeout(() => { void fitSceneInView(cesdk); }, 300);

    wireHistoryListener(instance);

    instance.data.createPagePreviews = () => createPagePreviews(instance);
    instance.data.triggerPdfExport = (options) => triggerPdfExport(instance, options);
    instance.data.triggerPreviewsZipDownload = () => triggerPreviewsZipDownload(instance);
    instance.data.triggerSaveDocument = () => triggerSaveDocument(instance);
    setupBubbleUpload(cesdk, instance);
    setupBubblePdfExport(cesdk, instance);
    setupNavigationDocumentTitle(cesdk, instance);
    setupBookmarks(cesdk, instance);
    setupIcons(cesdk, instance);
    await setupJournalStickers(cesdk);
    instance.data.loadSceneFromString = (sceneString) => loadSceneFromString(instance, sceneString);
    instance.data.applyPropertiesUpdate = (props, ctx) => {
      applyPropertiesUpdate(instance, props, ctx);
    };

    instance.data.cesdkReady = true;
    const pending = instance.data._pendingProperties;
    applyPropertiesUpdate(instance, pending || properties || {}, context);
  } catch (err) {
    console.error('IMG.LY View: init failed', err);
    const detail = err && err.message ? String(err.message) : '';
    showBootError(host, detail
      ? 'Échec du chargement CE.SDK — ' + detail
      : 'Échec du chargement CE.SDK — vérifiez la connexion réseau ou la licence.');
  }
}

export default function initializeImglyView(instance, context) {
  instance.data.cesdkReady = false;
  instance.data._pendingProperties = null;
  void initImglyEditor(instance, context, null);
}
