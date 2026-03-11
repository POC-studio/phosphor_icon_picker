/**
 * Parse multiline text "weight word" into wordcloud2.js list format [[word, weight], ...].
 * Format: one line = number (weight) + space + word. Invalid lines are skipped.
 */
export function parseWordsList(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.trim().split(/\n/);
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const firstSpace = trimmed.indexOf(' ');
    if (firstSpace < 0) continue;
    const weightStr = trimmed.slice(0, firstSpace);
    const word = trimmed.slice(firstSpace + 1).trim();
    const weight = parseInt(weightStr, 10);
    if (!word || isNaN(weight) || weight <= 0) continue;
    result.push([word, weight]);
  }
  return result;
}

/** Max normalized size for the largest word (keeps it on canvas). */
const NORMALIZED_MAX = 22;
/** Min normalized size (low floor so ratio between words is preserved: 200 vs 2 → much bigger vs much smaller). */
const NORMALIZED_MIN = 1;

/**
 * Sort list by weight descending, then normalize proportionally: size = (weight / maxWeight) * NORMALIZED_MAX.
 * Floor at NORMALIZED_MIN so tiny weights still render. Preserves true size ratio (e.g. 200 vs 2 → 22 vs 1).
 */
export function sortAndNormalizeWordList(list) {
  if (!list || list.length === 0) return list;
  const sorted = [...list].sort((a, b) => b[1] - a[1]);
  const maxWeight = sorted[0][1];
  if (maxWeight <= 0) return sorted;
  return sorted.map(([word, weight]) => {
    const normalized = (weight / maxWeight) * NORMALIZED_MAX;
    return [word, Math.max(NORMALIZED_MIN, normalized)];
  });
}

/** Amplitude of RGB variation so shades are clearly visible (same hue, lighter/darker). */
const COLOR_DELTA = 45;

/**
 * Returns a visible variation of baseColor for the given seed (e.g. word text).
 * Same hue: we add the same delta to R, G and B so the result is strictly
 * a lighter or darker shade of the requested color. Deterministic per seed.
 */
export function getVariedColor(baseColor, seed) {
  if (!baseColor || typeof baseColor !== 'string') return '#333333';
  const str = baseColor.trim();
  let r, g, b;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str)) {
    const m = str.slice(1).match(str.length === 4 ? /(.)(.)(.)/ : /(..)(..)(..)/);
    if (!m) return baseColor;
    r = parseInt(m[1].length === 1 ? m[1] + m[1] : m[1], 16);
    g = parseInt(m[2].length === 1 ? m[2] + m[2] : m[2], 16);
    b = parseInt(m[3].length === 1 ? m[3] + m[3] : m[3], 16);
  } else {
    const rgb = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!rgb) return baseColor;
    r = parseInt(rgb[1], 10);
    g = parseInt(rgb[2], 10);
    b = parseInt(rgb[3], 10);
  }
  const seedStr = typeof seed === 'string' ? seed : (seed != null ? String(seed) : '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
  const delta = (Math.abs(hash) % (COLOR_DELTA * 2 + 1)) - COLOR_DELTA;
  r = Math.max(0, Math.min(255, r + delta));
  g = Math.max(0, Math.min(255, g + delta));
  b = Math.max(0, Math.min(255, b + delta));
  return `rgb(${r},${g},${b})`;
}

/**
 * Map Bubble dropdown option to CSS font-family string for wordcloud2.
 */
export function getFontFamily(option) {
  const key = (option || 'sans serif').toLowerCase().replace(/\s+/g, ' ');
  const map = {
    serif: "Georgia, 'Times New Roman', serif",
    'sans serif': "'Helvetica Neue', Arial, sans-serif",
    monospace: "'Consolas', 'Monaco', monospace",
  };
  return map[key] != null ? map[key] : map['sans serif'];
}
