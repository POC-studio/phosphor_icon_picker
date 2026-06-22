/**
 * Livret A4 plié — 4 demi-pages A5 (148,5 × 210 mm), layout Free.
 *
 * Disposition :
 *         [Page 1]
 * [Page 2][Page 3]
 * [Page 4]
 *
 * @see https://img.ly/docs/cesdk/js/concepts/pages-7b6bae/
 */

export const HALF_A4_WIDTH_MM = 148.5;
export const PAGE_HEIGHT_MM = 210;

/** Espacement vertical entre les rangées (mm). */
export const BOOKLET_ROW_GAP_MM = 28;

export const BOOKLET_SCENE_LAYOUT = 'Free';

const SPREAD_ROW_Y = PAGE_HEIGHT_MM + BOOKLET_ROW_GAP_MM;
const BACK_ROW_Y = SPREAD_ROW_Y + PAGE_HEIGHT_MM + BOOKLET_ROW_GAP_MM;

export const BOOKLET_PAGE_LAYOUT = [
  {
    key: 'cover',
    name: 'Page 1',
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: HALF_A4_WIDTH_MM,
    y: 0,
  },
  {
    key: 'page2',
    name: 'Page 2',
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: 0,
    y: SPREAD_ROW_Y,
  },
  {
    key: 'page3',
    name: 'Page 3',
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: HALF_A4_WIDTH_MM,
    y: SPREAD_ROW_Y,
  },
  {
    key: 'back',
    name: 'Page 4',
    width: HALF_A4_WIDTH_MM,
    height: PAGE_HEIGHT_MM,
    x: 0,
    y: BACK_ROW_Y,
  },
];

/** Specs pour scene.create (dimensions uniquement). */
export function getBookletPageSpecs() {
  return BOOKLET_PAGE_LAYOUT.map(({ width, height }) => ({
    width,
    height,
    unit: 'Millimeter',
  }));
}
