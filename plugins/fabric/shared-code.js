const RANDOM_COLORS = ['#f97316', '#06b6d4', '#22c55e', '#a855f7', '#ef4444', '#0ea5e9', '#f59e0b'];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createRandomSeedObjects(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return [];
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);

  const rect = new fabricLib.Rect({
    left: randomInt(40, Math.floor(maxW * 0.3)),
    top: randomInt(40, Math.floor(maxH * 0.3)),
    width: randomInt(90, 180),
    height: randomInt(70, 140),
    fill: randomFrom(RANDOM_COLORS),
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    rx: 8,
    ry: 8,
    cornerRadiusPx: 8,
    angle: randomInt(-20, 20),
  });

  const circle = new fabricLib.Circle({
    left: randomInt(Math.floor(maxW * 0.35), Math.floor(maxW * 0.65)),
    top: randomInt(40, Math.floor(maxH * 0.35)),
    radius: randomInt(35, 70),
    fill: randomFrom(RANDOM_COLORS),
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    angle: randomInt(-25, 25),
  });

  const text = new fabricLib.Textbox('Fabric V1', {
    left: randomInt(Math.floor(maxW * 0.2), Math.floor(maxW * 0.6)),
    top: randomInt(Math.floor(maxH * 0.45), Math.floor(maxH * 0.75)),
    width: 180,
    fontSize: 34,
    fontWeight: 700,
    fill: '#111827',
    stroke: '#00000000',
    strokeWidth: 0,
    strokeUniform: true,
    angle: randomInt(-10, 10),
  });

  return [rect, circle, text];
}

export function createDefaultRectangle(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return null;
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);
  return new fabricLib.Rect({
    left: Math.round(maxW * 0.5 - 60),
    top: Math.round(maxH * 0.5 - 45),
    width: 120,
    height: 90,
    fill: '#14b8a6',
    stroke: '#111827',
    strokeWidth: 2,
    strokeUniform: true,
    rx: 8,
    ry: 8,
    cornerRadiusPx: 8,
  });
}

export function createDefaultTextbox(fabricLib, canvasWidth, canvasHeight) {
  if (!fabricLib) return null;
  const maxW = Math.max(canvasWidth || 900, 600);
  const maxH = Math.max(canvasHeight || 520, 360);
  return new fabricLib.Textbox('Edit me', {
    left: Math.round(maxW * 0.5 - 90),
    top: Math.round(maxH * 0.5 - 20),
    width: 180,
    fontSize: 30,
    fontWeight: 600,
    fill: '#111827',
    stroke: '#00000000',
    strokeWidth: 0,
    strokeUniform: true,
  });
}

export function ensureHexColor(value, fallback) {
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

export function getObjectStyle(target) {
  if (!target) {
    return { fill: 'transparent', stroke: 'transparent', strokeWidth: 1, radius: 0 };
  }
  const fill = typeof target.fill === 'string'
    ? target.fill
    : (target.fill && typeof target.fill.toString === 'function' ? String(target.fill.toString()) : 'transparent');
  const stroke = typeof target.stroke === 'string'
    ? target.stroke
    : (target.stroke && typeof target.stroke.toString === 'function' ? String(target.stroke.toString()) : 'transparent');
  let strokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 1;
  const scaleX = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
  const scaleY = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
  const rawRx = Number.isFinite(Number(target.rx)) ? Number(target.rx) : 0;
  const rawRy = Number.isFinite(Number(target.ry)) ? Number(target.ry) : rawRx;
  const visualRadius = Number.isFinite(Number(target.cornerRadiusPx))
    ? Math.max(0, Number(target.cornerRadiusPx))
    : Math.max(0, Math.min(rawRx * scaleX, rawRy * scaleY));
  const normalizedFill = isTransparentColor(fill) ? 'transparent' : ensureHexColor(fill, '#111827');
  const normalizedStroke = isTransparentColor(stroke) ? 'transparent' : ensureHexColor(stroke, '#000000');
  if (normalizedStroke !== 'transparent' && strokeWidth <= 0) {
    strokeWidth = 1;
  }
  return {
    fill: normalizedFill,
    stroke: normalizedStroke,
    strokeWidth: Math.max(0, Math.min(50, strokeWidth)),
    radius: Math.max(0, Math.min(200, visualRadius)),
  };
}
