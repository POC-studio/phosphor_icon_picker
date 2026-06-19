const RANDOM_COLORS = ['#f97316', '#06b6d4', '#22c55e', '#a855f7', '#ef4444', '#0ea5e9', '#f59e0b'];


const FONT_PRESETS = [
  { label: 'JetBrains Mono', fontFamily: "'JetBrains Mono'" },
  { label: 'Fraunces', fontFamily: "'Fraunces'" },
  { label: 'Schoolbell', fontFamily: "'Schoolbell'" },
  { label: 'Space Grotesk', fontFamily: "'Space Grotesk'" },
  { label: 'Ultra', fontFamily: "'Ultra'" },
];

const DEFAULT_TEXT_FONT_FAMILY = FONT_PRESETS[0].fontFamily;


const TOOLBAR_VISIBILITY_BY_TYPE = {
  default: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false, opacity: true },
  rect: { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: false, opacity: true },
  circle: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false, opacity: true },
  /** Raster fabric.Image : type sérialisé `'image'`, pas de fill (bitmap), stroke possible pour un cadre. */
  image: { fill: false, stroke: true, strokeWidth: true, radius: true, fontSize: false, opacity: true },
  textbox: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true },
  text: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true },
  iText: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true },
};


const PHOSPHOR_REGULAR_ICONS_FALLBACK = [
  'smiley', 'heart', 'star', 'house', 'user', 'users', 'bell', 'camera', 'image', 'chat-circle',
  'paper-plane-tilt', 'bookmark', 'calendar', 'clock', 'gear', 'lightbulb', 'cloud', 'sun',
  'moon', 'rocket', 'leaf', 'music-note', 'shopping-cart', 'gift', 'globe', 'map-pin',
];

const PHOSPHOR_STYLES = ['regular', 'bold', 'fill', 'light', 'thin', 'duotone'];

const ARTBOARD_VIEWER_MARGIN_PX = 24;

/** Couleur des repères d'alignement / d'aide (ex. ligne de contrainte Shift). */
const GUIDE_HIGHLIGHT_COLOR = '#FFEDC5';

/** Alt+drag duplicate : ignore le bruit avant ce déplacement (px). */
const ALT_DUP_MIN_MOVE_PX = 5;


/** 5 mm @ 300 dpi — même logique que le plan (A4 plié, 3 pages). */
const PX_PER_MM = 300 / 25.4;

const MARGIN_5MM_PX = Math.round(5 * PX_PER_MM);


/** Page 0 et 2 : A5 vertical (portrait, hauteur > largeur) ; page 1 : A4 paysage. */
const ARTBOARD_PRESETS = [
  {
    width: 1754,
    height: 2480,
    marginTop: MARGIN_5MM_PX,
    marginRight: MARGIN_5MM_PX,
    marginBottom: MARGIN_5MM_PX,
    marginLeft: 0,
  },
  {
    width: 3508,
    height: 2480,
    marginTop: MARGIN_5MM_PX,
    marginRight: MARGIN_5MM_PX,
    marginBottom: MARGIN_5MM_PX,
    marginLeft: MARGIN_5MM_PX,
  },
  {
    width: 1754,
    height: 2480,
    marginTop: MARGIN_5MM_PX,
    marginRight: 0,
    marginBottom: MARGIN_5MM_PX,
    marginLeft: MARGIN_5MM_PX,
  },
];

export {
  RANDOM_COLORS,
  FONT_PRESETS,
  DEFAULT_TEXT_FONT_FAMILY,
  TOOLBAR_VISIBILITY_BY_TYPE,
  PHOSPHOR_REGULAR_ICONS_FALLBACK,
  PHOSPHOR_STYLES,
  ARTBOARD_VIEWER_MARGIN_PX,
  GUIDE_HIGHLIGHT_COLOR,
  ALT_DUP_MIN_MOVE_PX,
  PX_PER_MM,
  MARGIN_5MM_PX,
  ARTBOARD_PRESETS,
};
