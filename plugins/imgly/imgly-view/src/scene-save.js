/**
 * Sauvegarde scène CE.SDK — remplace data:/blob: par les URLs CDN Bubble persistantes.
 */

/**
 * @param {object} instance
 * @param {string} sourceUrl
 * @param {string} loadableUri
 * @param {number} [blockId]
 */
export function registerBubbleImagePersistence(instance, sourceUrl, loadableUri, blockId) {
  if (!instance?.data || !sourceUrl) return;
  const source = String(sourceUrl).trim();
  const loadable = String(loadableUri || source).trim();
  if (!source) return;

  if (!(instance.data.imageSourceByTransientUri instanceof Map)) {
    instance.data.imageSourceByTransientUri = new Map();
  }
  if (loadable !== source) {
    instance.data.imageSourceByTransientUri.set(loadable, source);
  }
  if (blockId != null && typeof blockId === 'number') {
    if (!(instance.data.imageSourceByBlockId instanceof Map)) {
      instance.data.imageSourceByBlockId = new Map();
    }
    instance.data.imageSourceByBlockId.set(blockId, source);
  }
}

/**
 * @param {object} instance
 * @param {string} transientUrl
 * @returns {string|null}
 */
export function resolvePersistentUrlForTransient(instance, transientUrl) {
  if (!instance?.data || typeof transientUrl !== 'string') return null;
  const map = instance.data.imageSourceByTransientUri;
  if (map instanceof Map && map.has(transientUrl)) {
    return map.get(transientUrl);
  }
  return null;
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} blockId
 * @param {string} sourceUrl
 */
export function persistImageBlockSourceUri(engine, blockId, sourceUrl) {
  if (!engine?.block || blockId == null || !sourceUrl) return;
  const url = String(sourceUrl).trim();
  if (!/^https?:\/\//i.test(url)) return;

  const candidates = [
    ['fill/image/imageFileURI', blockId],
    ['fill/image/externalReference', blockId],
  ];

  for (const [prop, id] of candidates) {
    try {
      if (typeof engine.block.hasProperty === 'function' && !engine.block.hasProperty(id, prop)) {
        continue;
      }
      engine.block.setString(id, prop, url);
      return;
    } catch {
      /* try next */
    }
  }

  try {
    const fillId = engine.block.getFill?.(blockId);
    if (fillId != null) {
      engine.block.setString(fillId, 'fill/image/imageFileURI', url);
    }
  } catch {
    /* ignore */
  }
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {object} instance
 * @returns {Promise<string>}
 */
export async function saveSceneToPersistableString(engine, instance) {
  if (!engine?.scene || typeof engine.scene.saveToString !== 'function') {
    throw new Error('saveToString unavailable');
  }

  const allowedSchemes = ['http', 'https'];
  const onDisallowed = async (url) => {
    const persistent = resolvePersistentUrlForTransient(instance, url);
    if (persistent) return persistent;
    console.warn('IMG.LY View: ressource transitoire sans URL persistante', url.slice(0, 80));
    return url;
  };

  if (engine.scene.saveToString.length >= 1) {
    try {
      return await engine.scene.saveToString({
        allowedResourceSchemes: allowedSchemes,
        onDisallowedResourceScheme: onDisallowed,
      });
    } catch {
      /* fallback signature ci-dessous */
    }
  }

  return engine.scene.saveToString(allowedSchemes, onDisallowed);
}
