const n=`export default function (instance, properties, context) {
  if (!instance.data || instance.data.completed) return;

  const labelEl = instance.data.labelEl;
  const knob = instance.data.knob;
  const iconEl = instance.data.iconEl;
  const track = instance.data.track;

  const text = properties.text != null ? String(properties.text) : 'Slide to confirm';
  const defaultColor = properties.default_color || '#ef4444';
  const successColor = properties.success_color || '#22c55e';
  const holdMs = properties.hold_duration_ms != null ? parseInt(properties.hold_duration_ms, 10) : 500;

  instance.data.defaultColor = defaultColor;
  instance.data.successColor = successColor;
  instance.data.holdDurationMs = isNaN(holdMs) ? 500 : holdMs;

  labelEl.textContent = text;

  if (typeof instance.data.applyDefaultTrackStyle === 'function') {
    instance.data.applyDefaultTrackStyle(defaultColor);
  }

  const h = instance.canvas[0] ? instance.canvas[0].offsetHeight : track.clientHeight;
  const knobSize = Math.max(28, Math.round(h - 8));
  knob.style.width = knobSize + 'px';
  knob.style.height = knobSize + 'px';
  knob.style.top = '50%';
  knob.style.left = '4px';

  const iconSize = Math.max(14, Math.round(knobSize * 0.38));
  iconEl.style.fontSize = iconSize + 'px';

  const fs = Math.max(11, Math.round(h * 0.22));
  labelEl.style.fontSize = fs + 'px';

  const off = instance.data.knobOffset || 0;
  if (typeof instance.data.applyKnobTransform === 'function') {
    instance.data.applyKnobTransform(off);
  }
}
`;export{n as default};
