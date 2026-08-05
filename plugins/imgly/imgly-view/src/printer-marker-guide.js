/**
 * Marqueur imprimeur (datamatrix) — guide éditeur uniquement, exclu des exports.
 *
 * À l'imposition, le recto de chaque feuille porte la paire [N−2s | 1+2s] et le
 * membre droit (page 1+2s) occupe la moitié basse de l'A4 imprimé. L'imprimeur
 * ajoute son marqueur en bas à gauche de l'A4 (25×13 mm, calé au bord gauche,
 * à 3,5 mm du bas), zone qui correspond au coin bas-droit de la demi-page A5
 * dans l'éditeur : rectangle 13 mm (large) × 25 mm (haut), collé au bord bas,
 * à 3,5 mm du bord droit. Pages concernées : impaires de la première moitié
 * (1, 3, …, N/2−1).
 */

import { HALF_A4_WIDTH_MM, PAGE_HEIGHT_MM } from './booklet-layout.js';

export const PRINTER_MARKER_GUIDE_METADATA_KEY = 'imgly.printerMarkerGuide';

/** Dimensions du marqueur sur la demi-page éditeur (mm). */
const MARKER_WIDTH_MM = 13;
const MARKER_HEIGHT_MM = 25;
/** = 3,5 mm du bas de l'A4 imprimé. */
const MARKER_OFFSET_FROM_RIGHT_MM = 3.5;

const PRODUCTION_MARKER_IMAGE_URL =
  'https://poc-studio.github.io/phosphor_icon_picker/public/qr.png';

function getMarkerImageUrl() {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${origin}/qr.png`;
    }
  }
  return PRODUCTION_MARKER_IMAGE_URL;
}

/** @param {import('@cesdk/engine').default} engine */
export function isPrinterMarkerGuideBlock(engine, blockId) {
  if (!engine?.block || blockId == null) return false;
  try {
    const value = engine.block.getMetadata(blockId, PRINTER_MARKER_GUIDE_METADATA_KEY);
    return typeof value === 'string' && value.length > 0;
  } catch {
    return false;
  }
}

/**
 * Le marqueur est imprimé sur le recto de chaque feuille : pages 1+2s,
 * soit les pages impaires de la première moitié du livret.
 * @param {number} pageNumber — 1-indexé
 * @param {number} totalPages
 */
export function pageNeedsPrinterMarker(pageNumber, totalPages) {
  return pageNumber % 2 === 1 && pageNumber < totalPages / 2;
}

/** @param {import('@cesdk/engine').default} engine */
function removePrinterMarkerGuidesFromPage(engine, pageId) {
  if (!engine?.block || pageId == null) return;
  let children = [];
  try {
    children = engine.block.getChildren(pageId) || [];
  } catch {
    return;
  }
  for (const childId of children) {
    if (!isPrinterMarkerGuideBlock(engine, childId)) continue;
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
 */
function createPrinterMarkerGuide(engine, pageId) {
  const pageW = engine.block.getWidth(pageId) || HALF_A4_WIDTH_MM;
  const pageH = engine.block.getHeight(pageId) || PAGE_HEIGHT_MM;

  const block = engine.block.create('graphic');
  const shape = engine.block.createShape('rect');
  engine.block.setShape(block, shape);

  const fill = engine.block.createFill('image');
  engine.block.setString(fill, 'fill/image/imageFileURI', getMarkerImageUrl());
  engine.block.setFill(block, fill);

  engine.block.setWidthMode(block, 'Absolute');
  engine.block.setHeightMode(block, 'Absolute');
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setWidth(block, MARKER_WIDTH_MM);
  engine.block.setHeight(block, MARKER_HEIGHT_MM);
  engine.block.setPositionX(block, pageW - MARKER_WIDTH_MM - MARKER_OFFSET_FROM_RIGHT_MM);
  engine.block.setPositionY(block, pageH - MARKER_HEIGHT_MM);

  engine.block.appendChild(pageId, block);

  engine.block.setBool(block, 'alwaysOnTop', true);
  engine.block.setBool(block, 'selectionEnabled', false);
  engine.block.setBool(block, 'transformLocked', true);
  engine.block.setIncludedInExport(block, false);
  engine.block.setMetadata(block, PRINTER_MARKER_GUIDE_METADATA_KEY, 'printer-marker');
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {Array<{ width?: number, height?: number }>} layout
 */
export function syncPrinterMarkerGuides(engine, layout) {
  if (!engine?.block || !Array.isArray(layout) || layout.length === 0) return;

  const pageIds = engine.block.findByType('page') || [];
  if (pageIds.length !== layout.length) return;

  const totalPages = pageIds.length;
  pageIds.forEach((pageId, index) => {
    removePrinterMarkerGuidesFromPage(engine, pageId);
    if (!pageNeedsPrinterMarker(index + 1, totalPages)) return;
    try {
      createPrinterMarkerGuide(engine, pageId);
    } catch {
      /* ignore */
    }
  });
}
