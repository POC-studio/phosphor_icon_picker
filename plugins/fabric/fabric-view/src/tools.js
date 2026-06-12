import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { normalizeCanvasColor } from './utils.js';

/** Modes outils (select / draw / pan) et surbrillance des boutons de la barre gauche. */
export function setupTools(app) {
  const { instance, fabricCanvas, fabricLib, ui } = app;

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

  const setActiveToolButton = (activeBtn) => {
    [ui.textBtn, ui.shapeBtn, ui.iconBtn, ui.penBtn, ui.panBtn, ui.imageBtn, ui.bookmarkBtn].forEach((btn) => {
      if (!btn) return;
      btn.style.background = btn === activeBtn ? '#eef2ff' : '#ffffff';
      btn.style.borderColor = btn === activeBtn ? '#93c5fd' : '#cbd5e1';
    });
  };

  /** Seuls draw / pan ont un état « actif » persistant ; le reste est ponctuel. */
  const syncToolButtonHighlightToMode = () => {
    const m = instance.data.toolMode;
    if (m === 'draw') {
      setActiveToolButton(ui.penBtn);
    } else if (m === 'pan') {
      setActiveToolButton(ui.panBtn);
    } else {
      setActiveToolButton(null);
    }
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
    syncToolButtonHighlightToMode();
  };

  const exitPanMode = () => {
    if (instance.data.toolMode !== 'pan') return;
    setToolMode('select');
  };

  return { applyPenBrush, setActiveToolButton, syncToolButtonHighlightToMode, setToolMode, exitPanMode };
}
