const e=`export default function (instance, properties) {
  const text = properties.text != null ? String(properties.text) : 'Slide to confirm';
  const defaultColor = properties.default_color || '#ef4444';

  const root = document.createElement('div');
  root.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;';

  const track = document.createElement('div');
  track.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;border-radius:9999px;overflow:hidden;background:rgba(0,0,0,0.06);';

  const labelEl = document.createElement('div');
  labelEl.textContent = text;
  labelEl.style.cssText =
    'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 52px 0 12px;text-align:center;font-size:13px;font-weight:500;color:rgba(55,65,81,0.85);pointer-events:none;z-index:0;';

  const knob = document.createElement('div');
  knob.style.cssText =
    'position:absolute;left:4px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:' +
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
`;export{e as default};
