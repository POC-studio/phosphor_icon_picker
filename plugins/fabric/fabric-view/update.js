function readDimension(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function readMarginPx(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 100000);
}

export default function(instance, properties) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  const ui = instance && instance.data ? instance.data.ui : null;
  if (!instance || !instance.data || !fabricCanvas || !ui || !ui.board) return;

  const nextDocW = readDimension(properties && properties.canvas_width, 1000);
  const nextDocH = readDimension(properties && properties.canvas_height, 1000);
  const nextTitleRaw = properties && typeof properties.document_title === 'string'
    ? properties.document_title
    : '';
  instance.data.documentTitle = nextTitleRaw;
  instance.data.marginTop = readMarginPx(properties && properties.margin_top);
  instance.data.marginRight = readMarginPx(properties && properties.margin_right);
  instance.data.marginBottom = readMarginPx(properties && properties.margin_bottom);
  instance.data.marginLeft = readMarginPx(properties && properties.margin_left);
  instance.data.canvasWidth = nextDocW;
  instance.data.canvasHeight = nextDocH;
  if (!instance.data.viewport) {
    instance.data.viewport = {
      docW: nextDocW,
      docH: nextDocH,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    };
  } else {
    instance.data.viewport.docW = nextDocW;
    instance.data.viewport.docH = nextDocH;
  }

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

  try {
    const payload = JSON.stringify(fabricCanvas.toJSON());
    instance.publishState('canvas_json', payload);
  } catch (e) {
    instance.publishState('canvas_json', '{}');
  }
  instance.triggerEvent('json_changed');
}
