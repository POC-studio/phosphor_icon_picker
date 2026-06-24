import {
  HALF_A4_WIDTH_MM,
  PAGE_HEIGHT_MM,
  getSafetyMarginsForPageNumber,
} from './booklet-layout.js';
import { isSafetyMarginGuideBlock } from './safety-margins.js';

const BOUNDS_EPSILON_MM = 0.05;
const MIN_CONTENT_SIZE_MM = 0.01;

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} blockId
 */
function readGlobalBounds(engine, blockId) {
  try {
    const width = engine.block.getGlobalBoundingBoxWidth(blockId);
    const height = engine.block.getGlobalBoundingBoxHeight(blockId);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    if (width < MIN_CONTENT_SIZE_MM || height < MIN_CONTENT_SIZE_MM) return null;
    return {
      x: engine.block.getGlobalBoundingBoxX(blockId),
      y: engine.block.getGlobalBoundingBoxY(blockId),
      width,
      height,
    };
  } catch {
    return null;
  }
}

/**
 * @param {{ x: number, y: number, width: number, height: number }} bounds
 * @param {{ left: number, top: number, right: number, bottom: number }} safe
 */
function boundsViolateSafeZone(bounds, safe) {
  const right = bounds.x + bounds.width;
  const bottom = bounds.y + bounds.height;
  return (
    bounds.x < safe.left - BOUNDS_EPSILON_MM
    || bounds.y < safe.top - BOUNDS_EPSILON_MM
    || right > safe.right + BOUNDS_EPSILON_MM
    || bottom > safe.bottom + BOUNDS_EPSILON_MM
  );
}

/**
 * Zone de contenu autorisée (repère scène), alignée sur les bandes grises 5 mm.
 * @param {import('@cesdk/engine').default} engine
 * @param {number} pageId
 * @param {number} pageNumber — 1-indexé
 */
function getPageSafeZoneGlobal(engine, pageId, pageNumber) {
  const pageW = engine.block.getWidth(pageId) || HALF_A4_WIDTH_MM;
  const pageH = engine.block.getHeight(pageId) || PAGE_HEIGHT_MM;
  const margins = getSafetyMarginsForPageNumber(pageNumber);
  const pageX = engine.block.getGlobalBoundingBoxX(pageId);
  const pageY = engine.block.getGlobalBoundingBoxY(pageId);
  return {
    left: pageX + margins.left,
    top: pageY + margins.top,
    right: pageX + pageW - margins.right,
    bottom: pageY + pageH - margins.bottom,
  };
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} blockId
 */
function shouldSkipBlockType(engine, blockId) {
  try {
    const type = engine.block.getType(blockId);
    return type === 'page' || type === 'camera';
  } catch {
    return true;
  }
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} pageId
 * @param {{ left: number, top: number, right: number, bottom: number }} safe
 */
function pageHasMarginViolation(engine, pageId, safe) {
  /** @param {number} blockId */
  function walk(blockId) {
    if (isSafetyMarginGuideBlock(engine, blockId)) return false;
    if (shouldSkipBlockType(engine, blockId)) return false;

    const bounds = readGlobalBounds(engine, blockId);
    if (bounds && boundsViolateSafeZone(bounds, safe)) {
      return true;
    }

    let children = [];
    try {
      children = engine.block.getChildren(blockId) || [];
    } catch {
      return false;
    }

    for (const childId of children) {
      if (walk(childId)) return true;
    }
    return false;
  }

  let children = [];
  try {
    children = engine.block.getChildren(pageId) || [];
  } catch {
    return false;
  }

  for (const childId of children) {
    if (walk(childId)) return true;
  }
  return false;
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @returns {boolean}
 */
export function scanMarginViolations(engine) {
  if (!engine?.block) return false;

  const pageIds = engine.block.findByType('page') || [];
  for (let index = 0; index < pageIds.length; index += 1) {
    const pageId = pageIds[index];
    const safe = getPageSafeZoneGlobal(engine, pageId, index + 1);
    if (pageHasMarginViolation(engine, pageId, safe)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {object} instance
 * @param {boolean} value
 */
export function setMarginsWarning(instance, value) {
  if (!instance?.publishState) return;
  instance.publishState('margins_warning', value === true);
}

/**
 * Scan à l'enregistrement → publie margins_warning (non bloquant).
 * @param {object} instance
 * @returns {boolean}
 */
export function publishMarginsWarningFromScan(instance) {
  const engine = instance?.data?.engine;
  if (!engine) {
    setMarginsWarning(instance, false);
    return false;
  }

  try {
    const hasViolation = scanMarginViolations(engine);
    setMarginsWarning(instance, hasViolation);
    return hasViolation;
  } catch (err) {
    console.error('IMG.LY View: scan marges', err);
    setMarginsWarning(instance, false);
    return false;
  }
}
