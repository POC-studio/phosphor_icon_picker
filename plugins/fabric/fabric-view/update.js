export default function(instance, properties, context) {
  if (!properties) {
    return;
  }

  var rawBookmarks = properties.bookmarks_json;
  var bookmarksItems = null;
  if (rawBookmarks && typeof rawBookmarks === 'object' && Array.isArray(rawBookmarks.bookmarks)) {
    bookmarksItems = rawBookmarks.bookmarks;
  } else if (typeof rawBookmarks === 'string' && rawBookmarks.trim().length > 0) {
    try {
      var parsedBookmarks = JSON.parse(rawBookmarks.trim());
      if (parsedBookmarks && Array.isArray(parsedBookmarks.bookmarks)) {
        bookmarksItems = parsedBookmarks.bookmarks;
      }
    } catch (e) {
      bookmarksItems = null;
    }
  }

  if (bookmarksItems) {
    instance.data.bookmarksList = bookmarksItems
      .map(function(item) {
        var url = item && item.image_url != null ? String(item.image_url).trim() : '';
        var contributor = item && item.contributor != null ? String(item.contributor).trim() : '';
        var contributionId = item && item.contribution_id != null ? String(item.contribution_id).trim() : '';
        return { contribution_id: contributionId, image_url: url, contributor: contributor };
      })
      .filter(function(item) {
        return item.image_url.length > 0;
      });
  } else if (rawBookmarks == null || rawBookmarks === '') {
    instance.data.bookmarksList = [];
  }
  if (typeof instance.data.refreshBookmarksPanel === 'function') {
    instance.data.refreshBookmarksPanel();
  }

  var fabricCanvas = instance.data ? instance.data.fabricCanvas : null;
  var ui = instance.data ? instance.data.ui : null;
  if (!fabricCanvas || !ui || !ui.board) {
    return;
  }

  var nextTitleRaw = typeof properties.document_title === 'string' ? properties.document_title : '';
  instance.data.documentTitle = nextTitleRaw;

  if (typeof instance.data.ensureCanvasSize === 'function') {
    instance.data.ensureCanvasSize();
  } else {
    var width = Math.max(ui.board.clientWidth || 1, 1);
    var height = Math.max(ui.board.clientHeight || 1, 1);
    fabricCanvas.setDimensions({ width: width, height: height });
    fabricCanvas.requestRenderAll();
  }
  if (typeof instance.data.refreshTopBar === 'function') {
    instance.data.refreshTopBar();
  }

  var incomingCanvasJson = properties.canvas_json;
  var hasBubbleCanvasJson = typeof incomingCanvasJson === 'string' && incomingCanvasJson.length > 0;
  if (hasBubbleCanvasJson) {
    var last = instance.data._lastPublishedCanvasJson;
    if (incomingCanvasJson !== last && typeof instance.data.loadWrappedCanvasJson === 'function') {
      instance.data.loadWrappedCanvasJson(incomingCanvasJson);
    }
  } else {
    var initialJson = properties.initial_json;
    if (
      typeof initialJson === 'string'
      && initialJson.trim().length > 0
      && !instance.data._hydratedFromInitialJsonProperty
      && typeof instance.data.loadWrappedCanvasJson === 'function'
    ) {
      try {
        var trimmed = initialJson.trim();
        var parsed = JSON.parse(trimmed);
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
