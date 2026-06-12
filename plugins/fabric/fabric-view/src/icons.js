import { PHOSPHOR_REGULAR_ICONS_FALLBACK, PHOSPHOR_STYLES } from './constants.js';


function stripStyleSuffix(iconFileName, style) {
  if (typeof iconFileName !== 'string') return '';
  const raw = iconFileName.replace('.svg', '');
  if (style === 'regular') return raw;
  const suffix = `-${style}`;
  return raw.endsWith(suffix) ? raw.slice(0, -suffix.length) : raw;
}


function getStyleAssetFileName(iconName, style) {
  if (typeof iconName !== 'string') return '';
  const safeName = iconName.trim();
  if (!safeName) return '';
  if (style === 'regular') return `${safeName}.svg`;
  return `${safeName}-${style}.svg`;
}


async function fetchAllPhosphorIconsByStyle(style) {
  const fallback = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
  const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : 'regular';
  try {
    const response = await fetch('https://data.jsdelivr.com/v1/package/npm/@phosphor-icons/core@2.1.1', {
      method: 'GET',
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return fallback;
    const payload = await response.json();
    const roots = Array.isArray(payload && payload.files) ? payload.files : [];
    if (roots.length === 0) return fallback;

    const iconSet = new Set();
    const walk = (node, prefix) => {
      if (!node || typeof node !== 'object') return;
      const name = typeof node.name === 'string' ? node.name : '';
      const nextPath = prefix ? `${prefix}/${name}` : name;
      if (node.type === 'file') {
        if (nextPath.startsWith(`assets/${safeStyle}/`) && nextPath.endsWith('.svg')) {
          const fileName = nextPath.replace(`assets/${safeStyle}/`, '');
          const normalized = stripStyleSuffix(fileName, safeStyle);
          if (normalized) iconSet.add(normalized);
        }
        return;
      }
      const children = Array.isArray(node.files) ? node.files : [];
      children.forEach((child) => walk(child, nextPath));
    };
    roots.forEach((node) => walk(node, ''));

    const result = Array.from(iconSet).filter(Boolean).sort((a, b) => a.localeCompare(b));
    return result.length > 0 ? result : fallback;
  } catch (e) {
    return fallback;
  }
}

export {
  stripStyleSuffix,
  getStyleAssetFileName,
  fetchAllPhosphorIconsByStyle,
};
