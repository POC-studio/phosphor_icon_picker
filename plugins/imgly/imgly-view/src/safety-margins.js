import {
  HALF_A4_WIDTH_MM,
  PAGE_HEIGHT_MM,
  getSafetyMarginsForPageNumber,
} from './booklet-layout.js';

export const SAFETY_MARGIN_GUIDE_METADATA_KEY = 'imgly.safetyMarginGuide';

const GUIDE_FILL = { r: 0.45, g: 0.45, b: 0.45, a: 0.14 };

/** @param {import('@cesdk/engine').default} engine */
export function isSafetyMarginGuideBlock(engine, blockId) {
  if (!engine?.block || blockId == null) return false;
  try {
    const value = engine.block.getMetadata(blockId, SAFETY_MARGIN_GUIDE_METADATA_KEY);
    return typeof value === 'string' && value.length > 0;
  } catch {
    return false;
  }
}

/** Désactive les marges « bleed » natives CE.SDK (extérieures à la page). */
function disableNativePageMargins(engine, pageId) {
  try {
    engine.block.setBool(pageId, 'page/marginEnabled', false);
  } catch {
    /* ignore */
  }
}

/** @param {import('@cesdk/engine').default} engine */
function removeSafetyMarginGuidesFromPage(engine, pageId) {
  if (!engine?.block || pageId == null) return;
  let children = [];
  try {
    children = engine.block.getChildren(pageId) || [];
  } catch {
    return;
  }
  for (const childId of children) {
    if (!isSafetyMarginGuideBlock(engine, childId)) continue;
    try {
      engine.block.destroy(childId);
    } catch {
      /* ignore */
    }
  }
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} pageId
 * @param {{ x: number, y: number, width: number, height: number, side: string }} spec
 */
function createGuideStrip(engine, pageId, spec) {
  const block = engine.block.create('graphic');
  const shape = engine.block.createShape('rect');
  engine.block.setShape(block, shape);

  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', GUIDE_FILL);
  engine.block.setFill(block, fill);

  engine.block.setWidthMode(block, 'Absolute');
  engine.block.setHeightMode(block, 'Absolute');
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setWidth(block, spec.width);
  engine.block.setHeight(block, spec.height);
  engine.block.setPositionX(block, spec.x);
  engine.block.setPositionY(block, spec.y);

  engine.block.appendChild(pageId, block);

  engine.block.setBool(block, 'alwaysOnBottom', true);
  engine.block.setBool(block, 'selectionEnabled', false);
  engine.block.setBool(block, 'transformLocked', true);
  engine.block.setIncludedInExport(block, false);
  engine.block.setMetadata(block, SAFETY_MARGIN_GUIDE_METADATA_KEY, spec.side);
}

/**
 * Bandes intérieures (mm) — bord extérieur alterné selon parité de page.
 * @param {import('@cesdk/engine').default} engine
 * @param {number} pageId
 * @param {number} pageNumber — 1-indexé
 */
function applyInnerSafetyMarginGuides(engine, pageId, pageNumber) {
  if (!engine?.block || pageId == null) return;

  disableNativePageMargins(engine, pageId);
  removeSafetyMarginGuidesFromPage(engine, pageId);

  const pageW = engine.block.getWidth(pageId) || HALF_A4_WIDTH_MM;
  const pageH = engine.block.getHeight(pageId) || PAGE_HEIGHT_MM;
  const margins = getSafetyMarginsForPageNumber(pageNumber);

  if (margins.top > 0) {
    createGuideStrip(engine, pageId, {
      side: 'top',
      x: 0,
      y: 0,
      width: pageW,
      height: margins.top,
    });
  }
  if (margins.bottom > 0) {
    createGuideStrip(engine, pageId, {
      side: 'bottom',
      x: 0,
      y: pageH - margins.bottom,
      width: pageW,
      height: margins.bottom,
    });
  }
  if (margins.left > 0) {
    createGuideStrip(engine, pageId, {
      side: 'left',
      x: 0,
      y: 0,
      width: margins.left,
      height: pageH,
    });
  }
  if (margins.right > 0) {
    createGuideStrip(engine, pageId, {
      side: 'right',
      x: pageW - margins.right,
      y: 0,
      width: margins.right,
      height: pageH,
    });
  }
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {Array<{ width?: number, height?: number }>} layout
 */
export function syncInnerSafetyMarginGuides(engine, layout) {
  if (!engine?.block || !Array.isArray(layout) || layout.length === 0) return;

  const pageIds = engine.block.findByType('page') || [];
  if (pageIds.length !== layout.length) return;

  pageIds.forEach((pageId, index) => {
    applyInnerSafetyMarginGuides(engine, pageId, index + 1);
  });
}
