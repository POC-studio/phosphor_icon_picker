const n=`export default function(instance, properties, context) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  const ui = instance && instance.data ? instance.data.ui : null;
  if (!instance || !instance.data || !fabricCanvas || !ui || !ui.board) return;

  const nextTitleRaw = properties && typeof properties.document_title === 'string'
    ? properties.document_title
    : '';
  instance.data.documentTitle = nextTitleRaw;

  if (typeof instance.data.ensureCanvasSize === 'function') {
    instance.data.ensureCanvasSize();
  } else {
    const width = Math.max(ui.board.clientWidth || 1, 1);
    const height = Math.max(ui.board.clientHeight || 1, 1);
    fabricCanvas.setDimensions({ width, height });
    fabricCanvas.requestRenderAll();
  }
  if (typeof instance.data.refreshTopBar === 'function') {
    instance.data.refreshTopBar();
  }

  const incomingCanvasJson = properties && properties.canvas_json;
  const hasBubbleCanvasJson = typeof incomingCanvasJson === 'string' && incomingCanvasJson.length > 0;
  if (hasBubbleCanvasJson) {
    const last = instance.data._lastPublishedCanvasJson;
    if (incomingCanvasJson !== last && typeof instance.data.loadWrappedCanvasJson === 'function') {
      instance.data.loadWrappedCanvasJson(incomingCanvasJson);
    }
  } else {
    const initialJson = properties && properties.initial_json;
    if (
      typeof initialJson === 'string'
      && initialJson.trim().length > 0
      && !instance.data._hydratedFromInitialJsonProperty
      && typeof instance.data.loadWrappedCanvasJson === 'function'
    ) {
      try {
        const trimmed = initialJson.trim();
        const parsed = JSON.parse(trimmed);
        if (parsed && Array.isArray(parsed.artboards) && parsed.artboards.length === 3) {
          instance.data._hydratedFromInitialJsonProperty = true;
          instance.data.loadWrappedCanvasJson(trimmed);
        }
      } catch (e) {
        /* JSON invalide — on garde l’état issu de initialize */
      }
    }
  }
}
`;export{n as default};
