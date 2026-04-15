export default function (instance, properties, context) {
  if (!instance.data || instance.data.completed) return;

  const labelEl = instance.data.labelEl;
  const knob = instance.data.knob;
  const iconEl = instance.data.iconEl;
  const track = instance.data.track;

  const text = properties.text != null ? String(properties.text) : 'Slide to confirm';
  const defaultColor = properties.default_color || '#ef4444';
  const successColor = properties.success_color || '#22c55e';
  const holdMs = properties.hold_duration_ms != null ? parseInt(properties.hold_duration_ms, 10) : 500;

  let borderRadius = properties.border_radius != null ? parseInt(properties.border_radius, 10) : 9999;
  if (isNaN(borderRadius)) borderRadius = 9999;
  if (borderRadius < 0) borderRadius = 0;

  let padding = properties.padding != null ? parseInt(properties.padding, 10) : 0;
  if (isNaN(padding)) padding = 0;
  if (padding < 0) padding = 0;

  instance.data.defaultColor = defaultColor;
  instance.data.successColor = successColor;
  instance.data.holdDurationMs = isNaN(holdMs) ? 500 : holdMs;
  instance.data.borderRadiusPx = borderRadius;
  instance.data.paddingPx = padding;

  labelEl.textContent = text;

  if (typeof instance.data.applyDefaultTrackStyle === 'function') {
    instance.data.applyDefaultTrackStyle(defaultColor);
  }

  track.style.boxSizing = 'border-box';
  track.style.padding = padding + 'px';
  track.style.borderRadius = borderRadius === 0 ? '0' : borderRadius + 'px';

  const knobRadius = borderRadius === 0 ? 0 : Math.max(0, borderRadius - padding);
  knob.style.borderRadius = knobRadius + 'px';

  const h = instance.canvas[0] ? instance.canvas[0].offsetHeight : track.clientHeight;
  const innerH = Math.max(0, track.clientHeight - 2 * padding);
  const knobSize = Math.max(28, Math.round(innerH > 0 ? innerH : h - 8));
  knob.style.width = knobSize + 'px';
  knob.style.height = knobSize + 'px';
  knob.style.top = '50%';
  knob.style.left = padding + 'px';

  const iconSize = Math.max(14, Math.round(knobSize * 0.38));
  iconEl.style.fontSize = iconSize + 'px';

  const fs = Math.max(11, Math.round(h * 0.22));
  labelEl.style.fontSize = fs + 'px';
  labelEl.style.width = '100%';
  labelEl.style.boxSizing = 'border-box';
  labelEl.style.display = 'flex';
  labelEl.style.alignItems = 'center';
  labelEl.style.justifyContent = 'center';
  labelEl.style.textAlign = 'center';
  labelEl.style.padding = '0 10px';

  const off = instance.data.knobOffset || 0;
  if (typeof instance.data.applyKnobTransform === 'function') {
    instance.data.applyKnobTransform(off);
  }
}
