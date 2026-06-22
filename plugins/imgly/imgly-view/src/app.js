import CreativeEditorSDK from '@cesdk/cesdk-js';
import { clampSheetCount } from './booklet-layout.js';
import { initDesignEditor } from './init-design-editor.ts';
import { ensureFrenchLocale } from './design-editor/i18n.ts';
import {
  createPagePreviews,
  publishSceneJson,
  triggerPdfExport,
  wireHistoryListener,
} from './exports.js';
import { setupBubblePdfExport } from './setup-bubble-export.js';
import {
  createBookletScene,
  fitSceneInView,
  loadSceneFromString,
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
  instance.data.pageIds = await createBookletScene(cesdk, engine, instance.data.sheetCount);
  instance.data._lastPublishedCanvasJson = null;
  instance.data._suppressCanvasJsonPublish = false;
  await fitSceneInView(cesdk);
  void publishSceneJson(instance);
}

function applyPropertiesUpdate(instance, properties, context) {
  if (!properties) return;
  instance.data.bubbleContext = context || instance.data.bubbleContext || null;

  const nextTitle = typeof properties.document_title === 'string' ? properties.document_title : '';
  instance.data.documentTitle = nextTitle;

  const nextSheetCount = parseSheetCountFromProperties(properties);
  const sheetCountChanged = nextSheetCount !== instance.data.sheetCount;
  instance.data.sheetCount = nextSheetCount;

  const incomingCanvasJson = properties.canvas_json;
  const hasBubbleCanvasJson = typeof incomingCanvasJson === 'string' && incomingCanvasJson.length > 0;

  if (hasBubbleCanvasJson) {
    if (incomingCanvasJson !== instance.data._lastPublishedCanvasJson) {
      void loadSceneFromString(instance, incomingCanvasJson);
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

async function initImglyEditor(instance, context, properties) {
  const host = getHostElement(instance);
  if (!host) return;

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
  const baseURL = `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets/`;
  const pendingProps = instance.data._pendingProperties;
  const sheetCount = parseSheetCountFromProperties(pendingProps || properties);

  try {
    const cesdk = await CreativeEditorSDK.create(container, {
      license,
      baseURL,
      callbacks: { onUpload: 'local' },
    });

    instance.data.cesdk = cesdk;
    instance.data.engine = cesdk.engine;
    instance.data.bubbleContext = context || null;
    instance.data.sheetCount = sheetCount;
    if (typeof cesdk.disableNoSceneWarning === 'function') {
      cesdk.disableNoSceneWarning();
    }
    instance.data.documentTitle = 'Titre du document';
    instance.data._lastPublishedCanvasJson = null;
    instance.data._suppressCanvasJsonPublish = true;
    instance.data._hydratedFromInitialJsonProperty = false;

    instance.publishState('new_color', '');
    instance.publishState('contribution_id', '');
    instance.publishState('pdf_url', '');

    await initDesignEditor(cesdk);
    ensureFrenchLocale(cesdk);
    instance.data.pageIds = await createBookletScene(cesdk, cesdk.engine, sheetCount);

    await fitSceneInView(cesdk);
    setTimeout(() => { void fitSceneInView(cesdk); }, 300);

    wireHistoryListener(instance);

    instance.data.createPagePreviews = () => createPagePreviews(instance);
    instance.data.triggerPdfExport = () => triggerPdfExport(instance);
    setupBubblePdfExport(cesdk, instance);
    instance.data.loadSceneFromString = (sceneString) => loadSceneFromString(instance, sceneString);
    instance.data.applyPropertiesUpdate = (props, ctx) => {
      applyPropertiesUpdate(instance, props, ctx);
    };

    instance.data.cesdkReady = true;
    const pending = instance.data._pendingProperties;
    applyPropertiesUpdate(instance, pending || properties || {}, context);

    if (!instance.data._hydratedFromInitialJsonProperty && !(
      properties && typeof properties.canvas_json === 'string' && properties.canvas_json.length > 0
    )) {
      instance.data._suppressCanvasJsonPublish = false;
      void publishSceneJson(instance);
    }
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
