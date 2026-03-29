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

  const rawBookmarks = properties && properties.bookmarks_json;
  if (typeof rawBookmarks === 'string' && rawBookmarks.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawBookmarks.trim());
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.bookmarks)) {
        const next = parsed.bookmarks
          .map((item) => {
            const url = item && typeof item.image_url === 'string' ? item.image_url.trim() : '';
            const contributor = item && typeof item.contributor === 'string' ? item.contributor.trim() : '';
            return { image_url: url, contributor };
          })
          .filter((item) => item.image_url.length > 0);
        instance.data.bookmarksList = next;
        if (typeof instance.data.refreshBookmarksPanel === 'function') {
          instance.data.refreshBookmarksPanel();
        }
      }
    } catch (e) {
      /* JSON invalide — on garde bookmarksList tel quel */
    }
  } else if (rawBookmarks === '' || rawBookmarks == null) {
    instance.data.bookmarksList = [];
    if (typeof instance.data.refreshBookmarksPanel === 'function') {
      instance.data.refreshBookmarksPanel();
    }
  }
}
