export default function(instance, properties, context) {
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

  const incomingJson = properties && properties.canvas_json;
  if (typeof incomingJson === 'string' && incomingJson.length > 0) {
    const last = instance.data._lastPublishedCanvasJson;
    if (incomingJson !== last && typeof instance.data.loadWrappedCanvasJson === 'function') {
      instance.data.loadWrappedCanvasJson(incomingJson);
    }
  }
}
