import { ARTBOARD_PRESETS, DEFAULT_TEXT_FONT_FAMILY } from './constants.js';
import { ensureCanvasSize } from './guides.js';
import { ensureFabricImageIdSerialization, resolveFabric } from './objects.js';
import { createPagePreviews } from './previews.js';
import { loadWrappedCanvasJson, publishCanvasJson } from './serialize.js';
import { buildShell } from './ui/shell.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { setupTools } from './tools.js';
import { setupSelectionOps } from './selection-ops.js';
import { setupContextMenu } from './ui/context-menu.js';
import { setupInserts } from './inserts.js';
import { setupMenus } from './ui/menus.js';
import { setupZoomAndNav } from './zoom.js';
import { setupToolbarInputs } from './ui/toolbar-inputs.js';
import { wireCanvasEvents } from './events.js';

export default function initializeFabricView(instance, context) {
  const fabricLib = resolveFabric();
  ensureFabricImageIdSerialization(fabricLib);
  const ui = buildShell();
  instance.data.ui = ui;
  instance.data.fabricLib = fabricLib;
  // Contexte Bubble accessible aux modules (uploadContent pour PDF / previews).
  instance.data.bubbleContext = context || null;
  const initialPreset = ARTBOARD_PRESETS[0];
  instance.data.canvasWidth = initialPreset.width;
  instance.data.canvasHeight = initialPreset.height;
  instance.data.viewport = {
    docW: initialPreset.width,
    docH: initialPreset.height,
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
  // Précharge la font texte par défaut pour que le tout premier textbox soit
  // déjà mesuré avec les bonnes métriques (curseur bien placé dès l'ajout).
  if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.load === 'function') {
    document.fonts.load(`36px ${DEFAULT_TEXT_FONT_FAMILY}`).catch(() => {});
  }
  instance.publishState('new_color', '');
  instance.publishState('contribution_id', '');
  instance.publishState('pdf_url', '');
  instance.data.toolMode = 'select';
  instance.data.documentTitle = 'Document title';
  instance.data.activeArtboardIndex = 0;
  instance.data.pageSnapshots = [null, null, null];
  instance.data._lastPublishedCanvasJson = null;
  /** Tant que true : pas de publishState(canvas_json) — Bubble reçoit le doc seulement après loadWrappedCanvasJson (ton initial_json, vide ou non). */
  instance.data._suppressCanvasJsonPublish = true;
  instance.data.penColor = '#111827';
  instance.data.penWidth = 3;
  instance.data.zoomScale = 1;
  instance.data.panX = 0;
  instance.data.panY = 0;
  instance.data.isPanning = false;
  instance.data.panLastClientX = 0;
  instance.data.panLastClientY = 0;
  instance.data.altKeyAtMouseDown = false;
  instance.data._altDuplicateDone = false;
  instance.data._canvasPointerGestureId = 0;
  instance.data._altDupClonedGestureId = null;
  instance.data._altDupDownClientX = null;
  instance.data._altDupDownClientY = null;
  instance.data.bookmarksList = [];


  /** Contexte partagé entre les sections (tools, menus, events…). */
  const app = { instance, context, fabricCanvas, fabricLib, ui };
  Object.assign(app, setupTools(app));
  Object.assign(app, setupSelectionOps(app));
  setupContextMenu(app);
  Object.assign(app, setupInserts(app));

  // Bootstrap des 3 pages : snapshots vides puis retour page 0.
  const snapshots = [];
  for (let i = 0; i < 3; i++) {
    instance.data.activeArtboardIndex = i;
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    fabricCanvas.clear();
    instance.data.artboardRect = null;
    instance.data.marginGuideLines = null;
    const p = ARTBOARD_PRESETS[i];
    instance.data.canvasWidth = p.width;
    instance.data.canvasHeight = p.height;
    ensureCanvasSize(instance);
    snapshots[i] = fabricCanvas.toJSON();
  }
  instance.data.pageSnapshots = snapshots;
  instance.data.activeArtboardIndex = 0;
  instance.data.zoomScale = 1;
  instance.data.panX = 0;
  instance.data.panY = 0;
  fabricCanvas.clear();
  instance.data.artboardRect = null;
  instance.data.marginGuideLines = null;
  {
    const p = ARTBOARD_PRESETS[0];
    instance.data.canvasWidth = p.width;
    instance.data.canvasHeight = p.height;
  }
  ensureCanvasSize(instance);
  updateTopBarForSelection(instance);

  Object.assign(app, setupMenus(app));
  Object.assign(app, setupZoomAndNav(app));
  setupToolbarInputs(app);
  wireCanvasEvents(app);

  instance.data.ensureCanvasSize = () => ensureCanvasSize(instance);
  instance.data.refreshTopBar = () => updateTopBarForSelection(instance);
  instance.data.loadWrappedCanvasJson = (jsonString) => loadWrappedCanvasJson(instance, jsonString);
  instance.data.createPagePreviews = () => createPagePreviews(instance);
  app.syncToolButtonHighlightToMode();
  /* Pas de publishCanvasJson ici : update() charge initial_json → loadWrappedCanvasJson lève _suppress puis publie (évite d’écraser Bubble avec les 3 pages vides du bootstrap). */
}
