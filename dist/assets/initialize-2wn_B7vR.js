const n=`import { loadLucide } from '../shared-code.js';

function parseStrokeWidth(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

export default function (instance, context) {

  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  instance.data.currentStrokeWidth = 2;
  instance.data.currentColor = "#000000";
  instance.data.currentSize = 32;

  const mainIconWrapper = document.createElement("div");
  mainIconWrapper.style.cursor = "pointer";
  mainIconWrapper.style.display = "flex";
  mainIconWrapper.style.alignItems = "center";
  mainIconWrapper.style.justifyContent = "center";
  mainIconWrapper.style.width = "100%";
  mainIconWrapper.style.height = "100%";
  mainIconWrapper.innerHTML = '<i data-lucide="smile"></i>';

  if (window.ResizeObserver && instance.canvas && instance.canvas[0]) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const size = Math.min(width, height);
        if (size > 0) {
          instance.data.currentSize = size;
          const svg = mainIconWrapper.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", size);
            svg.setAttribute("height", size);
          }
        }
      }
    });
    observer.observe(instance.canvas[0]);
  }

  mainIconWrapper.addEventListener("click", () => {
    instance.triggerEvent("is_clicked");
  });

  container.appendChild(mainIconWrapper);
  instance.canvas.append(container);
  instance.data.mainIconWrapper = mainIconWrapper;
  instance.data.currentIcon = "smile";

  loadLucide().then(() => {
    if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
      window.lucide.createIcons({
        root: mainIconWrapper,
        attrs: {
          stroke: instance.data.currentColor,
          "stroke-width": instance.data.currentStrokeWidth,
          width: instance.data.currentSize,
          height: instance.data.currentSize,
        },
      });
    }
  });
}
`;export{n as default};
