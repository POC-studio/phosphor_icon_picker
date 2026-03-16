export default function(instance, properties) {
  if (!document.getElementById("lucide-script")) {
    const script = document.createElement("script");
    script.id = "lucide-script";
    script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";
    document.head.appendChild(script);
  }

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.backgroundColor = "transparent";

  const iconName = (properties && properties.initial_icon) ? properties.initial_icon.trim() : "smile";
  const strokeWidthRaw = (properties && properties.stroke_width !== undefined) ? properties.stroke_width : 2;
  const strokeWidth = (() => { const n = Number(strokeWidthRaw); return Number.isFinite(n) && n > 0 ? n : 2; })();
  const colorRaw = (properties && properties.color != null) ? String(properties.color).trim() : "";
  const color = colorRaw || "#000000";
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.innerHTML = `<i data-lucide="${iconName}"></i>`;

  let width = 32;
  let height = 32;
  if (properties && properties.bubble) {
    width = typeof properties.bubble.width === "function" ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === "function" ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);

  container.appendChild(wrapper);
  instance.canvas.append(container);

  function apply() {
    if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
      window.lucide.createIcons({
        root: wrapper,
        attrs: {
          stroke: color,
          "stroke-width": strokeWidth,
          width: size,
          height: size,
        },
      });
    }
  }

  if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
    apply();
  } else {
    const scriptEl = document.getElementById("lucide-script");
    if (scriptEl) scriptEl.addEventListener("load", apply);
    else setTimeout(apply, 300);
  }
}
