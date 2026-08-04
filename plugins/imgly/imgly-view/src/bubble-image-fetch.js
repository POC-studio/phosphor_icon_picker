const DEFAULT_API_SLUG = 'get_image';

/** Cache global des URIs chargeables (blob URL ou data URI) par URL CDN. */
/** @type {Map<string, string>} */
const globalDataUriCache = new Map();

/**
 * @param {unknown} url
 * @returns {boolean}
 */
export function isBubbleCdnImageUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false;
  let normalized = url.trim();
  if (/^\/\//.test(normalized)) normalized = `https:${normalized}`;
  try {
    const host = new URL(normalized).hostname.toLowerCase();
    return host.endsWith('.cdn.bubble.io');
  } catch {
    return /\.cdn\.bubble\.io/i.test(normalized);
  }
}

/**
 * @returns {boolean}
 */
export function isBubbleVersionTestPath() {
  if (typeof window === 'undefined' || !window.location) return false;
  return window.location.pathname.includes('/version-test');
}

/**
 * @param {string} [slug]
 * @returns {string}
 */
export function buildGetImageWorkflowUrl(slug = DEFAULT_API_SLUG) {
  const trimmedSlug = String(slug || DEFAULT_API_SLUG).trim().replace(/^\/+|\/+$/g, '');
  const prefix = isBubbleVersionTestPath() ? '/version-test' : '';
  const origin = typeof window !== 'undefined' && window.location
    ? window.location.origin
    : '';
  return `${origin}${prefix}/api/1.1/wf/${trimmedSlug}`;
}

/**
 * @param {object} instance
 * @returns {string}
 */
export function resolveImageFetchApiSlug(instance) {
  const fromData = instance?.data?.imageFetchApiSlug;
  if (typeof fromData === 'string' && fromData.trim()) return fromData.trim();
  return DEFAULT_API_SLUG;
}

/**
 * @param {unknown} payload
 * @returns {{ base64: string, content_type: string } | null}
 */
function parseFetchImageResponse(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const root = /** @type {Record<string, unknown>} */ (payload);
  const body = root.response && typeof root.response === 'object'
    ? /** @type {Record<string, unknown>} */ (root.response)
    : root;

  const base64 = typeof body.base64 === 'string' ? body.base64.trim() : '';
  const contentTypeRaw = typeof body.content_type === 'string'
    ? body.content_type
    : (typeof body.contentType === 'string' ? body.contentType : '');
  const contentType = contentTypeRaw.trim().split(';')[0] || 'image/png';

  if (!base64) return null;
  return { base64, content_type: contentType };
}

/**
 * @param {string} base64
 * @param {string} contentType
 * @returns {string}
 */
function toDataUri(base64, contentType) {
  return `data:${contentType};base64,${base64}`;
}

/**
 * Fetch direct du CDN Bubble (CORS ouvert : access-control-allow-origin: *).
 * Blob URL plutôt que data URI — évite des chaînes de plusieurs Mo en mémoire.
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchCdnImageAsBlobUrl(url) {
  // no-store : évite de relire l'entrée de cache « no-cors » créée par les
  // vignettes <img> (sans en-têtes CORS), qui ferait échouer ce fetch cors.
  const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`CDN fetch HTTP ${response.status}`);
  }
  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error('CDN fetch: empty blob');
  }
  return URL.createObjectURL(blob);
}

/**
 * Fallback : workflow Bubble get_image (fetch CDN → base64). Échoue en HTTP 500
 * pour les images > ~5 Mo (limite de taille de réponse API Bubble).
 * @param {object} instance
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchViaGetImageWorkflow(instance, url) {
  const slug = resolveImageFetchApiSlug(instance);
  const endpoint = buildGetImageWorkflowUrl(slug);
  const requestUrl = `${endpoint}?url=${encodeURIComponent(url)}`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`get_image HTTP ${response.status}`);
  }

  const json = await response.json();
  const parsed = parseFetchImageResponse(json);
  if (!parsed) {
    throw new Error('get_image: missing base64 in response');
  }

  return toDataUri(parsed.base64, parsed.content_type);
}

/**
 * Résout une URL CDN Bubble en URI chargeable par CE.SDK (blob URL ou data URI).
 * @param {object} instance
 * @param {string} cdnUrl
 * @returns {Promise<string>}
 */
export async function fetchBubbleImageAsDataUri(instance, cdnUrl) {
  const url = String(cdnUrl || '').trim();
  if (!url) throw new Error('Missing image URL');

  const cacheKey = url;
  const instanceCache = instance?.data?.bubbleImageDataUriCache;
  if (instanceCache instanceof Map && instanceCache.has(cacheKey)) {
    return instanceCache.get(cacheKey);
  }
  if (globalDataUriCache.has(cacheKey)) {
    return globalDataUriCache.get(cacheKey);
  }

  let loadableUri;
  try {
    loadableUri = await fetchCdnImageAsBlobUrl(url);
  } catch (directErr) {
    console.warn('IMG.LY View: fetch direct CDN échoué, fallback get_image', url, directErr);
    loadableUri = await fetchViaGetImageWorkflow(instance, url);
  }

  if (instance?.data) {
    if (!(instance.data.bubbleImageDataUriCache instanceof Map)) {
      instance.data.bubbleImageDataUriCache = new Map();
    }
    instance.data.bubbleImageDataUriCache.set(cacheKey, loadableUri);
  }
  globalDataUriCache.set(cacheKey, loadableUri);

  return loadableUri;
}

/**
 * @param {string} imageUrl
 * @param {object} [instance]
 * @returns {Promise<string>}
 */
export async function resolveImageUriForEngine(imageUrl, instance) {
  const url = String(imageUrl || '').trim();
  if (!url) return url;

  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  if (isBubbleCdnImageUrl(url)) {
    return fetchBubbleImageAsDataUri(instance, url);
  }

  return url;
}

/**
 * @param {object} instance
 * @param {unknown} slug
 */
export function syncImageFetchApiSlug(instance, slug) {
  if (!instance?.data) return;
  const trimmed = typeof slug === 'string' ? slug.trim() : '';
  instance.data.imageFetchApiSlug = trimmed || DEFAULT_API_SLUG;
}

/**
 * Résout les URLs CDN Bubble en data URI au chargement de scène (CORS).
 * @param {import('@cesdk/engine').default} engine
 * @param {object} instance
 */
export function setupBubbleUriResolver(engine, instance) {
  if (!engine?.editor || typeof engine.editor.setURIResolverAsync !== 'function') return;

  engine.editor.setURIResolverAsync(async (uri, defaultResolver) => {
    if (isBubbleCdnImageUrl(uri)) {
      try {
        return await resolveImageUriForEngine(uri, instance);
      } catch (err) {
        console.warn('IMG.LY View: résolution URI Bubble au chargement', uri, err);
      }
    }
    return defaultResolver(uri);
  });
}
