import { parseWordsList, getFontFamily, getVariedColor, sortAndNormalizeWordList } from '../shared-code.js';

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
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

export default function (instance, properties) {
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

  let w = 300;
  let h = 200;
  if (properties.bubble) {
    w = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    h = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  w = Math.max(w || 300, 1);
  h = Math.max(h || 200, 1);

  const rawList = parseWordsList(properties.words_list != null ? properties.words_list : '');
  const list = sortAndNormalizeWordList(rawList);
  const color = (properties.text_color != null && properties.text_color !== '')
    ? String(properties.text_color).trim()
    : '#333333';
  const fontFamily = getFontFamily(properties.font_family);

  loadWordCloud2().then(() => {
    canvas.width = w;
    canvas.height = h;
    if (list.length > 0 && typeof window.WordCloud !== 'undefined') {
      try {
        const base = Math.min(w, h);
        const maxFontPx = base * 0.32;
        window.WordCloud(canvas, {
          list,
          fontFamily,
          color: (word, weight) => getVariedColor(color, (word || '') + (weight ?? '')),
          clearCanvas: true,
          gridSize: Math.max(1, 2),
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
    }
  });

  instance.canvas.append(container);
}
