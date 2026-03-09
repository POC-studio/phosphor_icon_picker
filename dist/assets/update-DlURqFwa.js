const n=`// update.js
function parseStrokeWidth(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

export default function (instance, properties, context) {
  if (!properties) return;

  const strokeWidth = parseStrokeWidth(properties.stroke_width);
  instance.data.currentStrokeWidth = strokeWidth;
  const color = properties.color || "#333333";
  instance.data.currentColor = color;

  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === "function" ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === "function" ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  instance.data.currentSize = size;

  if (properties.initial_icon) {
    instance.data.currentIcon = properties.initial_icon.trim();
  }

  const wrapper = instance.data.mainIconWrapper;
  if (wrapper && instance.data.currentIcon) {
    wrapper.innerHTML = \`<i data-lucide="\${instance.data.currentIcon}"></i>\`;
    if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
      window.lucide.createIcons({
        root: wrapper,
        attrs: {
          stroke: color,
          "stroke-width": instance.data.currentStrokeWidth,
          width: size,
          height: size,
        },
      });
    }
  }
}
`;export{n as default};
