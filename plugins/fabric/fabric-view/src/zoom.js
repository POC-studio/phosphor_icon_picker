import { ARTBOARD_VIEWER_MARGIN_PX } from './constants.js';
import { ensureCanvasSize, getDocumentSize, goToArtboard } from './guides.js';
import { triggerFoldedA4PdfDownload } from './previews.js';
import { publishCanvasJson } from './serialize.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { computeFit } from './utils.js';

/** Zoom (boutons, molette, fit) et navigation entre artboards + téléchargement PDF. */
export function setupZoomAndNav(app) {
  const { instance, fabricCanvas, ui, setToolMode, exitPanMode, closeFloatingMenus } = app;

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
    closeFloatingMenus();
    applyZoomDelta(-0.1);
  });
  ui.zoomInBtn.addEventListener('click', () => {
    exitPanMode();
    closeFloatingMenus();
    applyZoomDelta(0.1);
  });
  ui.fitBtn.addEventListener('click', () => {
    exitPanMode();
    closeFloatingMenus();
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    ensureCanvasSize(instance);
    updateZoomButtons();
  });
  ui.artboardPrevBtn.addEventListener('click', () => {
    if (ui.artboardPrevBtn.disabled) return;
    exitPanMode();
    setToolMode('select');
    closeFloatingMenus();
    const i = instance.data.activeArtboardIndex ?? 0;
    if (i <= 0) return;
    goToArtboard(instance, i - 1).then(() => {
      updateTopBarForSelection(instance);
      publishCanvasJson(instance, { silent: true });
    });
  });
  ui.artboardNextBtn.addEventListener('click', () => {
    if (ui.artboardNextBtn.disabled) return;
    exitPanMode();
    setToolMode('select');
    closeFloatingMenus();
    const i = instance.data.activeArtboardIndex ?? 0;
    if (i >= 2) return;
    goToArtboard(instance, i + 1).then(() => {
      updateTopBarForSelection(instance);
      publishCanvasJson(instance, { silent: true });
    });
  });
  ui.artboardDownloadBtn.addEventListener('click', () => {
    exitPanMode();
    setToolMode('select');
    closeFloatingMenus();
    void triggerFoldedA4PdfDownload(instance);
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

  return { updateZoomButtons, applyZoomDelta, applyZoomAtViewerPoint };
}
