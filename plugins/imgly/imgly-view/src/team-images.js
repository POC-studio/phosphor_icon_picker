import { normalizeBubbleUploadUrl } from './bubble-upload.js';
import {
  isBubbleList,
  isBubbleNotReady,
  materializeBubbleList,
  resolveBubbleListLength,
} from './bubble-list.js';

/** Champs Bubble connus pour une URL image / fichier. */
const IMAGE_FIELD_CANDIDATES = [
  'saved_to_s3',
  'saved_to_aws',
  'image',
  'Image',
  'file',
  'photo',
  'picture',
  'image_url',
  'url',
  'upload',
  'fichier',
  'value',
];

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeUrlString(value) {
  if (value == null) return '';
  let trimmed = String(value).trim();
  if (!trimmed || trimmed === '[object Object]') return '';
  trimmed = normalizeBubbleUploadUrl(null, trimmed) || trimmed;
  if (/^\/\//.test(trimmed)) trimmed = `https:${trimmed}`;
  if (!/^https?:\/\//i.test(trimmed) && /^[\w.-]+\.[\w.-]+/.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Thing Bubble (type custom, ex. Image) — a listProperties + get('field').
 *
 * @param {unknown} thing
 * @returns {string}
 */
function bubbleThingToImageUrl(thing) {
  if (!thing || typeof thing !== 'object' || typeof thing.get !== 'function') return '';
  if (typeof thing.listProperties !== 'function') return '';

  for (const name of IMAGE_FIELD_CANDIDATES) {
    try {
      const val = thing.get(name);
      const url = entryToImageUrl(val);
      if (url) return url;
    } catch (err) {
      if (isBubbleNotReady(err)) throw err;
    }
  }

  let props = null;
  try {
    props = thing.listProperties();
  } catch (err) {
    if (isBubbleNotReady(err)) throw err;
  }
  if (Array.isArray(props)) {
    for (const prop of props) {
      if (typeof prop !== 'string') continue;
      try {
        const val = thing.get(prop);
        const url = entryToImageUrl(val);
        if (url) return url;
      } catch (err) {
        if (isBubbleNotReady(err)) throw err;
      }
    }
  }

  return '';
}

/**
 * Une entrée de liste Bubble — string URL (liste de primitives), Thing, ou wrapper fichier.
 *
 * @param {unknown} entry
 * @returns {string}
 */
export function entryToImageUrl(entry) {
  if (entry == null) return '';

  if (typeof entry === 'string') {
    return normalizeUrlString(entry);
  }

  if (typeof entry !== 'object') {
    return normalizeUrlString(entry);
  }

  if (typeof entry.listProperties === 'function') {
    const fromThing = bubbleThingToImageUrl(entry);
    if (fromThing) return fromThing;
  }

  if (typeof entry.get === 'function') {
    for (const name of IMAGE_FIELD_CANDIDATES) {
      try {
        const val = entry.get(name);
        const url = entryToImageUrl(val);
        if (url) return url;
      } catch (err) {
        if (isBubbleNotReady(err)) throw err;
      }
    }
  }

  const obj = /** @type {Record<string, unknown>} */ (entry);
  for (const key of IMAGE_FIELD_CANDIDATES) {
    if (typeof obj[key] === 'string' && obj[key].trim()) {
      return normalizeUrlString(obj[key]);
    }
  }

  return '';
}

/**
 * @param {string[]} urls
 * @returns {string[]}
 */
function dedupeImageUrls(urls) {
  const seen = new Set();
  return urls
    .map((url) => normalizeUrlString(url))
    .filter((url) => {
      if (url.length === 0 || !/^https?:\/\//i.test(url)) return false;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

/**
 * @param {object} properties
 * @returns {unknown}
 */
export function readImagesProperty(properties) {
  if (!properties || typeof properties !== 'object') return null;
  const p = /** @type {Record<string, unknown>} */ (properties);
  if (p.images != null && p.images !== '') return p.images;
  if (p.images_json != null && p.images_json !== '') return p.images_json;
  return null;
}

/**
 * Parse une propriété plugin `type: image, is_list: true` (ou legacy JSON).
 *
 * @param {unknown} raw
 * @returns {string[] | null}
 */
export function parseTeamImages(raw) {
  if (raw == null || raw === '') return null;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) {
      const url = entryToImageUrl(trimmed);
      return url ? dedupeImageUrls([url]) : null;
    }
    try {
      return parseTeamImages(JSON.parse(trimmed));
    } catch {
      return null;
    }
  }

  const listEntries = materializeBubbleList(raw);
  if (listEntries != null) {
    const urls = dedupeImageUrls(listEntries.map(entryToImageUrl));
    return urls.length > 0 ? urls : null;
  }

  if (Array.isArray(raw)) {
    const urls = dedupeImageUrls(raw.map(entryToImageUrl));
    return urls.length > 0 ? urls : null;
  }

  if (typeof raw === 'object') {
    const obj = /** @type {Record<string, unknown>} */ (raw);
    if (Array.isArray(obj.images)) {
      const urls = dedupeImageUrls(obj.images.map(entryToImageUrl));
      return urls.length > 0 ? urls : null;
    }
    const single = entryToImageUrl(raw);
    if (single) return dedupeImageUrls([single]);
  }

  return null;
}

/** @deprecated Alias legacy */
export const parseImagesJson = parseTeamImages;

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
function isEmptyTeamImagesInput(raw) {
  if (raw == null || raw === '') return true;
  if (typeof raw === 'string' && raw.trim() === '') return true;
  if (Array.isArray(raw)) return raw.length === 0;
  if (isBubbleList(raw)) return resolveBubbleListLength(raw) === 0;
  return false;
}

/**
 * @param {object} instance
 * @param {unknown} rawImages
 * @param {boolean} [clearIfEmpty]
 */
export function applyImagesFromProperties(instance, rawImages, clearIfEmpty = true) {
  if (!instance?.data) return;

  const parsed = parseTeamImages(rawImages);
  const canonical = parsed ? JSON.stringify(parsed) : '';

  if (parsed && parsed.length > 0) {
    if (canonical === instance.data._lastAppliedTeamImages) return;
    instance.data._lastAppliedTeamImages = canonical;
    instance.data.teamImageUrls = parsed;
  } else if (clearIfEmpty && isEmptyTeamImagesInput(rawImages)) {
    if (instance.data._lastAppliedTeamImages === '') return;
    instance.data._lastAppliedTeamImages = '';
    instance.data.teamImageUrls = [];
  } else {
    return;
  }

  if (instance.data.cesdkReady && typeof instance.data.refreshTeamImagesPanel === 'function') {
    instance.data.refreshTeamImagesPanel();
  }
}
