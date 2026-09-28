/** @type {Map<string, string>} */
const globalLoadableCache = new Map();

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchImageAsBlobUrl(url) {
  const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Image fetch HTTP ${response.status}`);
  }
  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error('Image fetch: empty blob');
  }
  return URL.createObjectURL(blob);
}

/**
 * @param {object} instance
 * @param {string} imageUrl
 * @returns {Promise<string>}
 */
export async function resolveImageUriForEngine(instance, imageUrl) {
  const url = String(imageUrl || '').trim();
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  const cacheKey = url;
  const instanceCache = instance?.data?.bubbleImageDataUriCache;
  if (instanceCache instanceof Map && instanceCache.has(cacheKey)) {
    return instanceCache.get(cacheKey);
  }
  if (globalLoadableCache.has(cacheKey)) {
    return globalLoadableCache.get(cacheKey);
  }

  let loadableUri = url;
  try {
    loadableUri = await fetchImageAsBlobUrl(url);
  } catch (directErr) {
    console.warn('Flipbook: fetch CORS échoué, URL brute', url, directErr);
    loadableUri = url;
  }

  if (instance?.data) {
    if (!(instance.data.bubbleImageDataUriCache instanceof Map)) {
      instance.data.bubbleImageDataUriCache = new Map();
    }
    instance.data.bubbleImageDataUriCache.set(cacheKey, loadableUri);
  }
  globalLoadableCache.set(cacheKey, loadableUri);

  return loadableUri;
}
