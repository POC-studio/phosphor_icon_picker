export default function (instance, properties) {
  const text = properties.text != null ? String(properties.text) : 'Slide to confirm';
  const defaultColor = properties.default_color || '#ef4444';
  let width = 200;
  let height = 40;
  if (properties && properties.bubble) {
    const bw =
      typeof properties.bubble.width === 'function'
        ? properties.bubble.width()
        : properties.bubble.width;
    const bh =
      typeof properties.bubble.height === 'function'
        ? properties.bubble.height()
        : properties.bubble.height;
    if (Number.isFinite(bw) && bw > 0) width = bw;
    if (Number.isFinite(bh) && bh > 0) height = bh;
  }

  let borderRadius = properties.border_radius != null ? parseInt(properties.border_radius, 10) : 9999;
  if (isNaN(borderRadius)) borderRadius = 9999;
  if (borderRadius < 0) borderRadius = 0;

  let padding = properties.padding != null ? parseInt(properties.padding, 10) : 0;
  if (isNaN(padding)) padding = 0;
  if (padding < 0) padding = 0;

  function hexToRgba(hex, alpha) {
    let h = String(hex || '#000000').replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
    const num = parseInt(h, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const knobRadius = borderRadius === 0 ? 0 : Math.max(0, borderRadius - padding);

  if (instance.canvas && typeof instance.canvas.empty === 'function') {
    instance.canvas.empty();
  }

  const root = document.createElement('div');
  root.style.cssText =
    'position:relative;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;';
  root.style.width = `${width}px`;
  root.style.height = `${height}px`;

  const track = document.createElement('div');
  track.style.cssText =
    'position:relative;box-sizing:border-box;overflow:hidden;';
  track.style.width = `${width}px`;
  track.style.height = `${height}px`;
  track.style.background = hexToRgba(defaultColor, 0.14);
  track.style.borderRadius = borderRadius === 0 ? '0' : borderRadius + 'px';
  track.style.padding = padding + 'px';
  track.style.boxSizing = 'border-box';

  const labelEl = document.createElement('div');
  labelEl.textContent = text;
  labelEl.style.cssText =
    'position:absolute;inset:0;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:0 10px;text-align:center;font-size:13px;font-weight:500;color:rgba(55,65,81,0.85);pointer-events:none;z-index:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

  const knob = document.createElement('div');
  const innerH = Math.max(0, height - 2 * padding);
  const knobSize = Math.max(28, innerH || 36);
  knob.style.cssText =
    'position:absolute;left:' +
    padding +
    'px;top:50%;transform:translateY(-50%);width:' +
    knobSize +
    'px;height:' +
    knobSize +
    'px;border-radius:' +
    knobRadius +
    'px;display:flex;align-items:center;justify-content:center;background:' +
    defaultColor +
    ';z-index:2;box-shadow:0 1px 3px rgba(0,0,0,0.12);';

  // En preview Bubble, on utilise un fallback texte simple (pas de dépendance à la lib d'icônes).
  const iconEl = document.createElement('span');
  iconEl.textContent = '→';
  iconEl.style.cssText = 'font-size:18px;color:#fff;line-height:1;font-weight:700;';
  knob.appendChild(iconEl);

  track.appendChild(labelEl);
  track.appendChild(knob);
  root.appendChild(track);
  instance.canvas.append(root);
}
