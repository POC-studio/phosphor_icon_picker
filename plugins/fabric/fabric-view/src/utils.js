
function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function ensureHexColor(value, fallback) {
  const safeFallback = fallback || '#111827';
  if (!value || typeof value !== 'string') return safeFallback;
  const color = value.trim();
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color)) return color;
  const rgbMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
    const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
    const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
    const a = rgbMatch[4] == null ? 1 : Number(rgbMatch[4]);
    if (Number.isFinite(a) && a <= 0) return 'transparent';
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = color;
      const normalized = String(ctx.fillStyle || '').trim();
      if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(normalized)) return normalized;
      const nMatch = normalized.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
      if (nMatch) {
        const r = Math.max(0, Math.min(255, Number(nMatch[1])));
        const g = Math.max(0, Math.min(255, Number(nMatch[2])));
        const b = Math.max(0, Math.min(255, Number(nMatch[3])));
        const a = nMatch[4] == null ? 1 : Number(nMatch[4]);
        if (Number.isFinite(a) && a <= 0) return 'transparent';
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    }
  } catch (e) {
    // ignore parsing fallback errors
  }
  // Keep original CSS color instead of forcing black fallback.
  return color;
}


function isTransparentColor(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  return v === 'transparent' || v === '#00000000' || v === 'rgba(0,0,0,0)' || v === 'rgba(0, 0, 0, 0)';
}


function ensureHex(value, fallback) {
  if (!value || typeof value !== 'string') return fallback;
  const v = value.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;
  const rgbMatch = v.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
    const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
    const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
    const a = rgbMatch[4] == null ? 1 : Number(rgbMatch[4]);
    if (Number.isFinite(a) && a <= 0) return 'transparent';
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = v;
      const normalized = String(ctx.fillStyle || '').trim();
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return normalized;
      const nMatch = normalized.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
      if (nMatch) {
        const r = Math.max(0, Math.min(255, Number(nMatch[1])));
        const g = Math.max(0, Math.min(255, Number(nMatch[2])));
        const b = Math.max(0, Math.min(255, Number(nMatch[3])));
        const a = nMatch[4] == null ? 1 : Number(nMatch[4]);
        if (Number.isFinite(a) && a <= 0) return 'transparent';
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    }
  } catch (e) {
    // ignore parsing fallback errors
  }
  // Preserve valid CSS color strings instead of forcing fallback.
  return v;
}


function clampArtboardIndex(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(2, Math.floor(n)));
}


function getSharedValue(items, getter) {
  if (!Array.isArray(items) || items.length === 0) return { mixed: true, value: null };
  const first = getter(items[0]);
  for (let i = 1; i < items.length; i += 1) {
    if (getter(items[i]) !== first) return { mixed: true, value: null };
  }
  return { mixed: false, value: first };
}


function normalizeFontFamily(value) {
  if (value == null || typeof value !== 'string') return '';
  const first = value.split(',')[0].trim();
  return first.replace(/\s+/g, ' ').replace(/['"]/g, '').toLowerCase();
}


function normalizeCanvasColor(value, fallback) {
  return isTransparentColor(value) ? 'transparent' : ensureHexColor(value, fallback);
}


function shouldZeroStrokeWidth(colorValue) {
  if (typeof colorValue !== 'string') return false;
  const v = colorValue.trim().toLowerCase();
  return v === 'transparent' || v === '#00000000' || v === 'rgba(0,0,0,0)' || v === 'rgba(0, 0, 0, 0)';
}


function computeFit(boardWidth, boardHeight, docWidth, docHeight) {
  const safeBoardW = Math.max(Number(boardWidth) || 1, 1);
  const safeBoardH = Math.max(Number(boardHeight) || 1, 1);
  const safeDocW = Math.max(Number(docWidth) || 1, 1);
  const safeDocH = Math.max(Number(docHeight) || 1, 1);
  const scale = Math.min(safeBoardW / safeDocW, safeBoardH / safeDocH);
  const offsetX = (safeBoardW - safeDocW * scale) / 2;
  const offsetY = (safeBoardH - safeDocH * scale) / 2;
  return { scale, offsetX, offsetY };
}


function guessImageFileExtension(file) {
  const t = String(file && file.type ? file.type : '').toLowerCase();
  if (t === 'image/jpeg') return '.jpg';
  if (t === 'image/png') return '.png';
  if (t === 'image/gif') return '.gif';
  if (t === 'image/webp') return '.webp';
  if (t === 'image/svg+xml') return '.svg';
  return '.png';
}


function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}


function dataUrlToBase64(dataUrl) {
  if (typeof dataUrl !== 'string') return '';
  const idx = dataUrl.indexOf('base64,');
  return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
}

export {
  randomFrom,
  randomInt,
  ensureHexColor,
  isTransparentColor,
  ensureHex,
  clampArtboardIndex,
  getSharedValue,
  normalizeFontFamily,
  normalizeCanvasColor,
  shouldZeroStrokeWidth,
  computeFit,
  guessImageFileExtension,
  readFileAsDataUrl,
  dataUrlToBase64,
};
