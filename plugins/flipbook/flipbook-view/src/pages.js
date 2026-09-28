import {
  isBubbleList,
  isBubbleNotReady,
  materializeBubbleList,
  resolveBubbleListLength,
} from './bubble-list.js';
import { resolveImageUriForEngine } from './image-fetch.js';

export const MAX_FACES = 40;
export const MAX_TEXTURE_SIZE = 1024;
export const BLANK_BOOK_PAGES = ['', '', '', ''];

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
  if (/^\/\//.test(trimmed)) trimmed = `https:${trimmed}`;
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('data:') && !trimmed.startsWith('blob:')) {
    if (/^[\w.-]+\.[\w.-]+/.test(trimmed)) trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
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
 * @param {unknown} raw
 * @returns {string[]}
 */
export function parsePageImages(raw) {
  if (raw == null || raw === '') return [];

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      const url = entryToImageUrl(trimmed);
      return url ? [url] : [];
    }
    try {
      return parsePageImages(JSON.parse(trimmed));
    } catch {
      return [];
    }
  }

  const listEntries = materializeBubbleList(raw);
  if (listEntries != null) {
    return listEntries.map(entryToImageUrl).filter(Boolean);
  }

  if (Array.isArray(raw)) {
    return raw.map(entryToImageUrl).filter(Boolean);
  }

  if (typeof raw === 'object') {
    const obj = /** @type {Record<string, unknown>} */ (raw);
    if (Array.isArray(obj.pages)) {
      return obj.pages.map(entryToImageUrl).filter(Boolean);
    }
    if (Array.isArray(obj.images)) {
      return obj.images.map(entryToImageUrl).filter(Boolean);
    }
    const single = entryToImageUrl(raw);
    if (single) return [single];
  }

  return [];
}

/**
 * @param {string[]} urls
 * @returns {string[]}
 */
export function padAndCapPages(urls) {
  const sliced = (Array.isArray(urls) ? urls : []).slice(0, MAX_FACES);
  if (sliced.length === 0) return BLANK_BOOK_PAGES.slice();
  if (sliced.length % 2 !== 0) sliced.push('');
  return sliced;
}

/**
 * @param {string[]} urls
 * @returns {string}
 */
export function hashPageUrls(urls) {
  return (urls || []).join('\0');
}

/**
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
function loadHtmlImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

/**
 * Dessine l’image sur un papier blanc (et downsample si besoin).
 * Les PNG transparents gardent ainsi un fond blanc au lieu du noir Three.js.
 * @param {HTMLImageElement} image
 * @returns {HTMLCanvasElement | null}
 */
function paintPageOnWhite(image) {
  const srcW = image.naturalWidth || image.width;
  const srcH = image.naturalHeight || image.height;
  if (!srcW || !srcH) return null;

  const longest = Math.max(srcW, srcH);
  const scale = longest > MAX_TEXTURE_SIZE ? MAX_TEXTURE_SIZE / longest : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(srcW * scale));
  canvas.height = Math.max(1, Math.round(srcH * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Charge une URL en source FlipBook (papier blanc, éventuellement downsamplée).
 * @param {object} instance
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function preparePageSource(instance, url) {
  const raw = String(url || '').trim();
  if (!raw) return '';

  const loadable = await resolveImageUriForEngine(instance, raw);
  if (!loadable) return '';

  try {
    const image = await loadHtmlImage(loadable);
    const canvas = paintPageOnWhite(image);
    if (!canvas) return loadable;
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((out) => {
        if (out) resolve(out);
        else reject(new Error('toBlob failed'));
      }, 'image/jpeg', 0.92);
    });
    return URL.createObjectURL(blob);
  } catch {
    return loadable;
  }
}

/**
 * @param {object} instance
 * @param {unknown} rawImages
 * @returns {Promise<{ urls: string[], hash: string }>}
 */
export async function materializePageSources(instance, rawImages) {
  const parsed = padAndCapPages(parsePageImages(rawImages));
  const hash = hashPageUrls(parsed);
  const urls = await Promise.all(parsed.map((url) => preparePageSource(instance, url)));
  return { urls, hash };
}

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isEmptyImagesInput(raw) {
  if (raw == null || raw === '') return true;
  if (typeof raw === 'string' && raw.trim() === '') return true;
  if (Array.isArray(raw)) return raw.length === 0;
  if (isBubbleList(raw)) return resolveBubbleListLength(raw) === 0;
  return false;
}
