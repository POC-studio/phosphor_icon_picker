/**
 * Livret A4 plié — demi-pages A5 (148,5 × 210 mm), layout Free.
 *
 * `sheetCount` feuilles → 4×sheetCount demi-pages, spreads entre couverture et dos :
 *         [Page 1]
 *       [2][3]
 *         …
 *         [4n]
 *
 * @see https://img.ly/docs/cesdk/js/concepts/pages-7b6bae/
 */

export const HALF_A4_WIDTH_MM = 148.5;
export const PAGE_HEIGHT_MM = 210;

/** Espacement vertical entre les rangées (mm). */
export const BOOKLET_ROW_GAP_MM = 28;

/** Plafond raisonnable pour le nombre de feuilles. */
export const MAX_SHEET_COUNT = 20;

export const BOOKLET_SCENE_LAYOUT = 'Free';

const ROW_STEP_MM = PAGE_HEIGHT_MM + BOOKLET_ROW_GAP_MM;

export function clampSheetCount(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, MAX_SHEET_COUNT);
}

export function getSpreadCount(sheetCount) {
  return 2 * clampSheetCount(sheetCount) - 1;
}

export function getTotalPageCount(sheetCount) {
  return 4 * clampSheetCount(sheetCount);
}

function spreadRowY(spreadIndex) {
  return (spreadIndex + 1) * ROW_STEP_MM;
}

/**
 * @param {number} sheetCount
 * @returns {Array<{ key: string, name: string, width: number, height: number, x: number, y: number }>}
 */
export function buildBookletPageLayout(sheetCount) {
  const sheets = clampSheetCount(sheetCount);
  const spreadCount = getSpreadCount(sheets);
  const totalPages = getTotalPageCount(sheets);
  const layout = [];

  layout.push({
    key: 'cover',
    name: 'Page 1',
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: HALF_A4_WIDTH_MM,
    y: 0,
  });

  for (let s = 0; s < spreadCount; s += 1) {
    const rowY = spreadRowY(s);
    const leftPageNum = 2 + s * 2;
    const rightPageNum = leftPageNum + 1;
    layout.push({
      key: `page${leftPageNum}`,
      name: `Page ${leftPageNum}`,
      width: HALF_A4_WIDTH_MM,
      height: PAGE_HEIGHT_MM,
      x: 0,
      y: rowY,
    });
    layout.push({
      key: `page${rightPageNum}`,
      name: `Page ${rightPageNum}`,
      width: HALF_A4_WIDTH_MM,
      height: PAGE_HEIGHT_MM,
      x: HALF_A4_WIDTH_MM,
      y: rowY,
    });
  }

  layout.push({
    key: 'back',
    name: `Page ${totalPages}`,
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: 0,
    y: (spreadCount + 1) * ROW_STEP_MM,
  });

  return layout;
}

/** Specs pour scene.create (dimensions uniquement). */
export function getBookletPageSpecs(sheetCount) {
  return buildBookletPageLayout(sheetCount).map(({ width, height }) => ({
    width,
    height,
    unit: 'Millimeter',
  }));
}
