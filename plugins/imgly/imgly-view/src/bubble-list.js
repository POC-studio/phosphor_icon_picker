/**
 * Materialize une BubbleList (doc Bubble + pattern communauté plugin builders).
 *
 * @see https://manual.bubble.io/account-and-marketplace/building-plugins/loading-data
 * List.get(start, length) — le 2e argument est le **nombre** d’éléments, pas l’index de fin.
 */

/**
 * @param {unknown} err
 * @returns {boolean}
 */
export function isBubbleNotReady(err) {
  return err && typeof err === 'object' && /** @type {{ message?: string }} */ (err).message === 'not ready';
}

/**
 * BubbleList : .get + .length, sans .listProperties (réservé aux Things).
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isBubbleList(value) {
  if (!value || typeof value !== 'object' || typeof value.get !== 'function') return false;
  if (typeof value.listProperties === 'function') return false;
  if (value.list_api === false || value.single_api === true) return false;
  return true;
}

/**
 * @param {unknown} list
 * @returns {number}
 */
export function resolveBubbleListLength(list) {
  if (!list || typeof list !== 'object') return 0;
  const raw = /** @type {{ length?: unknown }} */ (list).length;
  if (typeof raw === 'number') return Math.max(0, raw);
  if (typeof raw === 'function') {
    try {
      const value = raw.call(list);
      if (typeof value === 'number') return Math.max(0, value);
    } catch (err) {
      if (isBubbleNotReady(err)) throw err;
    }
  }
  return 0;
}

/**
 * @param {unknown} value
 * @returns {unknown[]}
 */
function toArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Charge toute la liste (ou un premier paquet si length indisponible).
 * Peut throw { message: 'not ready' } — ne pas catcher dans update/initialize.
 *
 * @param {unknown} list
 * @returns {unknown[]|null} null si ce n’est pas une BubbleList
 */
export function materializeBubbleList(list) {
  if (!isBubbleList(list)) return null;

  const len = resolveBubbleListLength(list);

  if (len > 0) {
    let from = 0;
    const entries = [];
    while (from < len) {
      const count = Math.min(100, len - from);
      const batch = list.get(from, count);
      const chunk = toArray(batch);
      if (chunk.length === 0) break;
      entries.push(...chunk);
      from += chunk.length;
      if (chunk.length < count) break;
    }
    return entries;
  }

  for (const count of [100, 99]) {
    try {
      const batch = list.get(0, count);
      const chunk = toArray(batch);
      if (chunk.length > 0) return chunk;
    } catch (err) {
      if (isBubbleNotReady(err)) throw err;
    }
  }

  return [];
}
