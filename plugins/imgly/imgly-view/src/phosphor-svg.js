/**
 * @typedef {{ d: string, opacity: number, fillColor?: { r: number, g: number, b: number, a: number } }} SvgPathLayer
 * @typedef {{ width: number, height: number, paths: SvgPathLayer[], fillColor?: { r: number, g: number, b: number, a: number } }} SvgMarkupData
 */

/**
 * @param {string} hex
 */
function parseHexColor(hex) {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length === 3) {
    return {
      r: parseInt(normalized[0] + normalized[0], 16) / 255,
      g: parseInt(normalized[1] + normalized[1], 16) / 255,
      b: parseInt(normalized[2] + normalized[2], 16) / 255,
      a: 1,
    };
  }
  if (normalized.length >= 6) {
    return {
      r: parseInt(normalized.slice(0, 2), 16) / 255,
      g: parseInt(normalized.slice(2, 4), 16) / 255,
      b: parseInt(normalized.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  return null;
}

/**
 * @param {Element} node
 */
function parsePathFillColor(node) {
  const fill = node.getAttribute('fill');
  if (fill && fill !== 'none' && fill.startsWith('#')) {
    return parseHexColor(fill);
  }
  return null;
}

/**
 * @param {string} svgText
 * @returns {SvgMarkupData|null}
 */
export function parseSvgMarkup(svgText) {
  if (typeof svgText !== 'string' || !svgText.trim()) return null;
  if (typeof DOMParser === 'undefined') return null;

  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) return null;

  let width = 256;
  let height = 256;
  const viewBox = svg.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      width = parts[2];
      height = parts[3];
    }
  } else {
    const w = parseFloat(svg.getAttribute('width') || '');
    const h = parseFloat(svg.getAttribute('height') || '');
    if (w > 0) width = w;
    if (h > 0) height = h;
  }

  /** @type {SvgPathLayer[]} */
  const paths = Array.from(svg.querySelectorAll('path'))
    .map((node) => {
      const d = node.getAttribute('d');
      if (!d) return null;
      let opacity = 1;
      if (node.hasAttribute('opacity')) {
        const parsed = parseFloat(node.getAttribute('opacity') || '');
        if (!Number.isNaN(parsed)) opacity = parsed;
      }
      const fillColor = parsePathFillColor(node);
      return { d, opacity, fillColor: fillColor || undefined };
    })
    .filter(Boolean);

  if (paths.length === 0) return null;

  const fillColor = paths.find((path) => path.fillColor)?.fillColor;
  return { width, height, paths, fillColor };
}

/** @deprecated Alias conservé pour Phosphor. */
export const parsePhosphorSvgMarkup = parseSvgMarkup;

/**
 * @param {string} url
 * @returns {Promise<SvgMarkupData>}
 */
export async function fetchSvgMarkup(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SVG fetch failed (${response.status}): ${url}`);
  }
  const text = await response.text();
  const parsed = parseSvgMarkup(text);
  if (!parsed) {
    throw new Error(`SVG parse failed: ${url}`);
  }
  return parsed;
}

/** @deprecated Alias conservé pour Phosphor. */
export const fetchPhosphorSvgData = fetchSvgMarkup;
