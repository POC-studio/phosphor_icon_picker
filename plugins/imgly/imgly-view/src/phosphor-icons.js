export const PHOSPHOR_VERSION = '2.1.1';
export const PHOSPHOR_STYLES = ['regular', 'bold', 'fill', 'light', 'duotone'];

export const PHOSPHOR_REGULAR_ICONS_FALLBACK = [
  'smiley', 'heart', 'star', 'house', 'user', 'users', 'bell', 'camera', 'image', 'chat-circle',
  'paper-plane-tilt', 'bookmark', 'calendar', 'clock', 'gear', 'lightbulb', 'cloud', 'sun',
  'moon', 'rocket', 'leaf', 'music-note', 'shopping-cart', 'gift', 'globe', 'map-pin',
];

const namesCacheByStyle = new Map();

function stripStyleSuffix(iconFileName, style) {
  if (typeof iconFileName !== 'string') return '';
  const raw = iconFileName.replace('.svg', '');
  if (style === 'regular') return raw;
  const suffix = `-${style}`;
  return raw.endsWith(suffix) ? raw.slice(0, -suffix.length) : raw;
}

export function getStyleAssetFileName(iconName, style) {
  if (typeof iconName !== 'string') return '';
  const safeName = iconName.trim();
  if (!safeName) return '';
  if (style === 'regular') return `${safeName}.svg`;
  return `${safeName}-${style}.svg`;
}

export function normalizePhosphorStyle(style) {
  return PHOSPHOR_STYLES.includes(style) ? style : 'regular';
}

export function getPhosphorIconUrl(iconName, style) {
  const safeStyle = normalizePhosphorStyle(style);
  const fileName = getStyleAssetFileName(iconName, safeStyle);
  if (!fileName) return '';
  return `https://unpkg.com/@phosphor-icons/core@${PHOSPHOR_VERSION}/assets/${safeStyle}/${fileName}`;
}

export function filterIconNames(names, query) {
  const list = Array.isArray(names) ? names : [];
  const q = String(query || '').trim().toLowerCase();
  if (!q) return list;
  return list.filter((name) => String(name).toLowerCase().includes(q));
}

export async function fetchAllPhosphorIconsByStyle(style) {
  const safeStyle = normalizePhosphorStyle(style);
  if (namesCacheByStyle.has(safeStyle)) {
    return namesCacheByStyle.get(safeStyle);
  }

  const fallback = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
  let result = fallback;

  try {
    const response = await fetch(
      `https://data.jsdelivr.com/v1/package/npm/@phosphor-icons/core@${PHOSPHOR_VERSION}`,
      { method: 'GET', headers: { accept: 'application/json' } },
    );
    if (response.ok) {
      const payload = await response.json();
      const roots = Array.isArray(payload?.files) ? payload.files : [];
      if (roots.length > 0) {
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
        const parsed = Array.from(iconSet).filter(Boolean).sort((a, b) => a.localeCompare(b));
        if (parsed.length > 0) result = parsed;
      }
    }
  } catch (e) {
    /* fallback */
  }

  namesCacheByStyle.set(safeStyle, result);
  return result;
}

export function buildPhosphorAssetId(iconName, style) {
  const safeStyle = normalizePhosphorStyle(style);
  return `${safeStyle}/${iconName}`;
}

export function parsePhosphorAssetId(assetId) {
  if (typeof assetId !== 'string') return { style: 'regular', iconName: '' };
  const slash = assetId.indexOf('/');
  if (slash === -1) return { style: 'regular', iconName: assetId };
  return {
    style: normalizePhosphorStyle(assetId.slice(0, slash)),
    iconName: assetId.slice(slash + 1),
  };
}

export function buildPhosphorAsset(iconName, style, locale = 'fr') {
  const safeStyle = normalizePhosphorStyle(style);
  const url = getPhosphorIconUrl(iconName, safeStyle);
  return {
    id: buildPhosphorAssetId(iconName, safeStyle),
    label: iconName,
    locale,
    meta: {
      uri: url,
      thumbUri: url,
      mimeType: 'image/svg+xml',
      blockType: '//ly.img.ubq/graphic',
      shapeType: '//ly.img.ubq/shape/vector_path',
    },
  };
}
