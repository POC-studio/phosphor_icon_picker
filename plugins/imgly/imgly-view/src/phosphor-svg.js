/**
 * @typedef {{ d: string, opacity: number }} PhosphorSvgPath
 * @typedef {{ width: number, height: number, paths: PhosphorSvgPath[] }} PhosphorSvgData
 */

/**
 * @param {string} svgText
 * @returns {PhosphorSvgData|null}
 */
export function parsePhosphorSvgMarkup(svgText) {
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

  /** @type {PhosphorSvgPath[]} */
  const paths = Array.from(svg.querySelectorAll('path'))
    .map((node) => {
      const d = node.getAttribute('d');
      if (!d) return null;
      let opacity = 1;
      if (node.hasAttribute('opacity')) {
        const parsed = parseFloat(node.getAttribute('opacity') || '');
        if (!Number.isNaN(parsed)) opacity = parsed;
      }
      return { d, opacity };
    })
    .filter(Boolean);

  if (paths.length === 0) return null;
  return { width, height, paths };
}

/**
 * @param {string} url
 * @returns {Promise<PhosphorSvgData>}
 */
export async function fetchPhosphorSvgData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Phosphor SVG fetch failed (${response.status}): ${url}`);
  }
  const text = await response.text();
  const parsed = parsePhosphorSvgMarkup(text);
  if (!parsed) {
    throw new Error(`Phosphor SVG parse failed: ${url}`);
  }
  return parsed;
}
