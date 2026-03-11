import { getFontFamily, getVariedColor } from '../shared.js';

const WORDCLOUD2_SCRIPT_ID = 'wordcloud2-script';
const WORDCLOUD2_URL = 'https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.0.2/wordcloud2.min.js';

function loadWordCloud2() {
  return new Promise((resolve) => {
    if (typeof window.WordCloud !== 'undefined') {
      resolve();
      return;
    }
    const existing = document.getElementById(WORDCLOUD2_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.id = WORDCLOUD2_SCRIPT_ID;
    script.src = WORDCLOUD2_URL;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // no-op on error to avoid hanging
    document.head.appendChild(script);
  });
}

export default function (instance, context) {
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  instance.data.canvas = canvas;
  instance.data.container = container;
  instance.data.currentList = [];
  instance.data.currentColor = '#333333';
  instance.data.currentFontFamily = 'sans serif';

  instance.data.drawWordCloud = function () {
    const list = instance.data.currentList || [];
    const color = instance.data.currentColor || '#333333';
    const fontKey = instance.data.currentFontFamily || 'sans serif';
    const fontFamily = getFontFamily(fontKey);

    const target = instance.canvas && instance.canvas[0] ? instance.canvas[0] : container;
    const w = target.clientWidth || 300;
    const h = target.clientHeight || 200;
    if (w <= 0 || h <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    if (typeof window.WordCloud === 'undefined') return;
    if (list.length === 0) {
      const ctx2 = canvas.getContext('2d');
      if (ctx2) ctx2.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    try {
        const base = Math.min(w, h);
        const maxFontPx = base * 0.32;
        window.WordCloud(canvas, {
          list,
          fontFamily,
          color: (word, weight) => getVariedColor(color, (word || '') + (weight ?? '')),
          clearCanvas: true,
          gridSize: Math.max(1, Math.round(2 * dpr)),
          weightFactor: (size) => Math.min((size * base) / 35, maxFontPx),
          minSize: Math.max(10, base / 80),
          rotateRatio: 0.2,
          minRotation: -0.5,
          maxRotation: 0.5,
          shrinkToFit: true,
        });
      } catch (e) {
        // ignore
      }
  };

  loadWordCloud2().then(() => {
    instance.data.drawWordCloud();
  });

  if (window.ResizeObserver && instance.canvas && instance.canvas[0]) {
    const observer = new ResizeObserver(() => {
      instance.data.drawWordCloud();
    });
    observer.observe(instance.canvas[0]);
  }

  instance.canvas.append(container);
}
