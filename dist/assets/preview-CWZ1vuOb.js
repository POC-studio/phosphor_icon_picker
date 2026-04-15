const n=`export default function (instance, properties) {
  const text = properties.text != null ? String(properties.text) : 'Slide to confirm';
  const defaultColor = properties.default_color || '#ef4444';

  let borderRadius = properties.border_radius != null ? parseInt(properties.border_radius, 10) : 9999;
  if (isNaN(borderRadius)) borderRadius = 9999;
  if (borderRadius < 0) borderRadius = 0;

  let padding = properties.padding != null ? parseInt(properties.padding, 10) : 0;
  if (isNaN(padding)) padding = 0;
  if (padding < 0) padding = 0;

  const knobRadius = borderRadius === 0 ? 0 : Math.max(0, borderRadius - padding);

  const root = document.createElement('div');
  root.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;';

  const track = document.createElement('div');
  track.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;overflow:hidden;background:rgba(0,0,0,0.06);';
  track.style.borderRadius = borderRadius === 0 ? '0' : borderRadius + 'px';
  track.style.padding = padding + 'px';
  track.style.boxSizing = 'border-box';

  const labelEl = document.createElement('div');
  labelEl.textContent = text;
  labelEl.style.cssText =
    'position:absolute;inset:0;box-sizing:border-box;width:100%;display:flex;align-items:center;justify-content:center;padding:0 10px;text-align:center;font-size:13px;font-weight:500;color:rgba(55,65,81,0.85);pointer-events:none;z-index:0;';

  const knob = document.createElement('div');
  knob.style.cssText =
    'position:absolute;left:' +
    padding +
    'px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:' +
    knobRadius +
    'px;display:flex;align-items:center;justify-content:center;background:' +
    defaultColor +
    ';z-index:2;box-shadow:0 1px 3px rgba(0,0,0,0.12);';

  const iconEl = document.createElement('i');
  iconEl.className = 'ph ph-arrow-right';
  iconEl.style.cssText = 'font-size:18px;color:#fff;';
  knob.appendChild(iconEl);

  track.appendChild(labelEl);
  track.appendChild(knob);
  root.appendChild(track);
  instance.canvas.append(root);
}
`;export{n as default};
