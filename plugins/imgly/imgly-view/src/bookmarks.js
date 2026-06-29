import { insertImageOnCurrentPage } from './page-insert.js';

export const BOOKMARKS_PANEL_ID = 'imgly.bookmarks.panel';

/**
 * @param {unknown} raw
 * @returns {{ contribution_id: string, image_url: string, contributor: string }[] | null}
 */
export function parseBookmarksJson(raw) {
  let bookmarksItems = null;

  if (raw && typeof raw === 'object' && Array.isArray(raw.bookmarks)) {
    bookmarksItems = raw.bookmarks;
  } else if (typeof raw === 'string' && raw.trim().length > 0) {
    try {
      const parsed = JSON.parse(raw.trim());
      if (parsed && Array.isArray(parsed.bookmarks)) {
        bookmarksItems = parsed.bookmarks;
      }
    } catch (e) {
      bookmarksItems = null;
    }
  }

  if (!bookmarksItems) return null;

  return bookmarksItems
    .map((item) => {
      const url = item && item.image_url != null ? String(item.image_url).trim() : '';
      const contributor = item && item.contributor != null ? String(item.contributor).trim() : '';
      const contributionId = item && item.contribution_id != null
        ? String(item.contribution_id).trim()
        : '';
      return { contribution_id: contributionId, image_url: url, contributor };
    })
    .filter((item) => item.image_url.length > 0);
}

/**
 * @param {{ contribution_id?: string, image_url: string, contributor: string }} item
 * @returns {string}
 */
function getBookmarkSearchHaystack(item) {
  const contributionId = String(item && item.contribution_id != null ? item.contribution_id : '').trim().toLowerCase();
  const contributor = String(item && item.contributor != null ? item.contributor : '').trim().toLowerCase();
  const url = String(item && item.image_url ? item.image_url : '').trim();
  let fileName = '';
  try {
    const u = new URL(url, 'https://placeholder.local');
    const parts = u.pathname.split('/').filter(Boolean);
    fileName = decodeURIComponent(parts[parts.length - 1] || '').toLowerCase();
  } catch (e) {
    fileName = '';
  }
  return `${contributionId} ${contributor} ${fileName} ${url.toLowerCase()}`.trim();
}

/**
 * @param {{ contribution_id?: string, image_url: string, contributor: string }[]} list
 * @param {string} query
 * @returns {{ contribution_id: string, image_url: string, contributor: string }[]}
 */
export function filterBookmarks(list, query) {
  const items = Array.isArray(list) ? list : [];
  const q = String(query || '').trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => getBookmarkSearchHaystack(item).includes(q));
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} instance
 * @param {{ contribution_id?: string, image_url: string, contributor: string }} item
 */
export async function insertContributionImage(engine, cesdk, instance, item) {
  if (!engine || !item || !item.image_url) return;

  const blockId = await insertImageOnCurrentPage(engine, item.image_url, instance);
  if (blockId == null) return;

  const bookmarkContributionId = item.contribution_id != null
    ? String(item.contribution_id).trim()
    : '';
  const contributionId = bookmarkContributionId.length > 0
    ? bookmarkContributionId
    : (typeof engine.block.getUUID === 'function'
      ? String(engine.block.getUUID(blockId) || blockId)
      : String(blockId));

  instance.publishState('contribution_id', contributionId);
  instance.triggerEvent('contribution_added');

  if (cesdk?.ui) {
    cesdk.ui.closePanel(BOOKMARKS_PANEL_ID);
  }
}

/**
 * @param {object} instance
 * @param {unknown} rawBookmarks
 * @param {boolean} [clearIfEmpty]
 */
export function applyBookmarksFromProperties(instance, rawBookmarks, clearIfEmpty = true) {
  const parsed = parseBookmarksJson(rawBookmarks);
  if (parsed) {
    instance.data.bookmarksList = parsed;
  } else if (clearIfEmpty && (rawBookmarks == null || rawBookmarks === '')) {
    instance.data.bookmarksList = [];
  }
  if (typeof instance.data.refreshBookmarksPanel === 'function') {
    instance.data.refreshBookmarksPanel();
  }
}
