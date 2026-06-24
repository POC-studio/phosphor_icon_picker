/**
 * Images d’équipe — parse du JSON Bubble { "images": ["https://…", …] }.
 */

/**
 * @param {unknown} raw
 * @returns {string[] | null}
 */
export function parseImagesJson(raw) {
  let urls = null;

  if (Array.isArray(raw)) {
    urls = raw;
  } else if (raw && typeof raw === 'object' && Array.isArray(raw.images)) {
    urls = raw.images;
  } else if (typeof raw === 'string' && raw.trim().length > 0) {
    try {
      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed)) {
        urls = parsed;
      } else if (parsed && Array.isArray(parsed.images)) {
        urls = parsed.images;
      }
    } catch {
      return null;
    }
  }

  if (!urls) return null;

  const seen = new Set();
  return urls
    .map((entry) => (entry != null ? String(entry).trim() : ''))
    .filter((url) => {
      if (url.length === 0 || !/^https?:\/\//i.test(url)) return false;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

/**
 * @param {object} instance
 * @param {unknown} rawImagesJson
 * @param {boolean} [clearIfEmpty]
 */
export function applyImagesFromProperties(instance, rawImagesJson, clearIfEmpty = true) {
  if (!instance?.data) return;

  const parsed = parseImagesJson(rawImagesJson);
  const canonical = parsed ? JSON.stringify(parsed) : '';

  if (parsed) {
    if (canonical === instance.data._lastAppliedImagesJson) return;
    instance.data._lastAppliedImagesJson = canonical;
    instance.data.teamImageUrls = parsed;
  } else if (clearIfEmpty && (rawImagesJson == null || rawImagesJson === '')) {
    if (instance.data._lastAppliedImagesJson === '') return;
    instance.data._lastAppliedImagesJson = '';
    instance.data.teamImageUrls = [];
  } else {
    return;
  }

  if (instance.data.cesdkReady && typeof instance.data.refreshTeamImagesPanel === 'function') {
    instance.data.refreshTeamImagesPanel();
  }
}
