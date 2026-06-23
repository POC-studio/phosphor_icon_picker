import { getCesdkContentBaseURL } from './cesdk-content-base-url.js';
import { fetchSvgMarkup } from './phosphor-svg.js';
import { DEFAULT_VECTOR_FILL, insertVectorGraphicOnCurrentPage } from './page-insert.js';

export const STICKER_SOURCE_ID = 'ly.img.sticker';

/**
 * @param {string} templateUri
 */
export function resolveStickerAssetUri(templateUri) {
  if (!templateUri) return '';
  if (/^https?:\/\//i.test(templateUri)) return templateUri;
  return templateUri.replace('{{base_url}}/', getCesdkContentBaseURL());
}

/**
 * @param {object | null | undefined} asset
 */
export function isJournalStickerAsset(asset) {
  if (!asset) return false;
  if (Array.isArray(asset.groups) && asset.groups.includes('journal')) return true;
  return String(asset.id || '').startsWith('ly.img.sticker.journal.');
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} asset
 */
export async function applyJournalStickerAsset(engine, cesdk, asset) {
  const svgUrl = resolveStickerAssetUri(asset?.meta?.uri);
  if (!svgUrl) return undefined;

  const svgData = await fetchSvgMarkup(svgUrl);
  await insertVectorGraphicOnCurrentPage(engine, {
    paths: svgData.paths,
    width: svgData.width,
    height: svgData.height,
    fillColor: svgData.fillColor || DEFAULT_VECTOR_FILL,
  });

  if (cesdk?.ui) {
    cesdk.ui.closePanel('ly.img.assetLibrary');
  }

  return undefined;
}

/**
 * Résout les URIs {{base_url}} avant addAssetToSource (sinon les thumbs ne chargent pas).
 *
 * @param {object} asset
 */
function prepareJournalAssetForSource(asset) {
  return {
    ...asset,
    meta: {
      ...asset.meta,
      uri: resolveStickerAssetUri(asset.meta?.uri),
      thumbUri: resolveStickerAssetUri(asset.meta?.thumbUri),
    },
  };
}

/**
 * @returns {Promise<object[]>}
 */
export async function loadJournalStickerAssets() {
  const manifestUrl = `${getCesdkContentBaseURL()}ly.img.sticker/journal.content.json`;
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`Journal stickers manifest failed (${response.status}): ${manifestUrl}`);
  }
  const payload = await response.json();
  return Array.isArray(payload.assets) ? payload.assets : [];
}

/**
 * @param {import('@cesdk/engine').default} engine
 */
function patchStickerApplyForJournal(engine, cesdk) {
  if (engine.asset.__journalApplyPatched) return;

  const originalApply = engine.asset.apply.bind(engine.asset);
  engine.asset.apply = async (sourceId, assetResult, options) => {
    if (sourceId === STICKER_SOURCE_ID && isJournalStickerAsset(assetResult)) {
      return applyJournalStickerAsset(engine, cesdk, assetResult);
    }
    return originalApply(sourceId, assetResult, options);
  };
  engine.asset.__journalApplyPatched = true;
}

/**
 * Ajoute les autocollants journal à la source ly.img.sticker (groupe « journal »)
 * sans second sourceId, pour conserver la vue par familles dans la sidebar.
 *
 * @param {import('@cesdk/cesdk-js').default} cesdk
 */
export async function setupJournalStickers(cesdk) {
  if (!cesdk?.engine?.asset) return;

  const engine = cesdk.engine;
  if (!engine.asset.findAllSources().includes(STICKER_SOURCE_ID)) {
    console.warn('IMG.LY View: source ly.img.sticker introuvable');
    return;
  }

  let journalAssets = [];
  try {
    journalAssets = await loadJournalStickerAssets();
  } catch (err) {
    console.warn('IMG.LY View: journal stickers non chargés', err);
    return;
  }

  if (journalAssets.length === 0) return;

  for (const asset of journalAssets) {
    engine.asset.addAssetToSource(STICKER_SOURCE_ID, prepareJournalAssetForSource(asset));
  }

  patchStickerApplyForJournal(engine, cesdk);
  engine.asset.assetSourceContentsChanged(STICKER_SOURCE_ID);
}
