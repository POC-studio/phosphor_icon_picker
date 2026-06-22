import { scheduleScenePublish } from './exports.js';
import { getPhosphorIconUrl, normalizePhosphorStyle } from './phosphor-icons.js';
import { fetchPhosphorSvgData } from './phosphor-svg.js';
import { insertVectorGraphicOnCurrentPage } from './page-insert.js';

export const ICONS_PANEL_ID = 'imgly.icons.panel';

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} instance
 * @param {string} iconName
 * @param {string} [style]
 */
export async function insertPhosphorIcon(engine, cesdk, instance, iconName, style) {
  if (!engine || !iconName) return;

  const safeStyle = normalizePhosphorStyle(style || instance?.data?.phosphorIconStyle);
  const url = getPhosphorIconUrl(iconName, safeStyle);
  if (!url) return;

  let svgData;
  try {
    svgData = await fetchPhosphorSvgData(url);
  } catch (err) {
    console.error('IMG.LY View: chargement SVG Phosphor', url, err);
    return;
  }

  const blockId = await insertVectorGraphicOnCurrentPage(engine, {
    paths: svgData.paths,
    width: svgData.width,
    height: svgData.height,
  });
  if (blockId == null) return;

  try {
    engine.block.setMetadata(blockId, 'phosphorIconName', iconName);
    engine.block.setMetadata(blockId, 'phosphorIconStyle', safeStyle);
  } catch {
    /* metadata optionnelle */
  }

  scheduleScenePublish(instance);

  if (cesdk?.ui) {
    cesdk.ui.closePanel(ICONS_PANEL_ID);
  }
}
