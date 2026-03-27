export default function(instance, properties) {
  const username = (properties && (properties.username || '').trim()) || '';
  const imageUrl = (properties && (properties.image_url || '').trim()) || '';
  const style = (properties && properties.style) || 'sans serif';
  const textColor = (properties && properties.text_color) || '#333333';
  const backgroundColor = (properties && properties.background_color) || '#e5e7eb';

  let width = 32;
  let height = 32;
  if (properties && properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  const fontSize = Math.round(size * 0.48);

  function getFontFamily(s) {
    const x = (s || 'sans serif').toLowerCase();
    if (x === 'serif') return 'Georgia, serif';
    if (x === 'monospace') return 'monospace';
    return 'sans-serif';
  }

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  const circle = document.createElement('div');
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.borderRadius = '50%';
  circle.style.overflow = 'hidden';
  circle.style.display = 'flex';
  circle.style.alignItems = 'center';
  circle.style.justifyContent = 'center';
  circle.style.flexShrink = '0';
  circle.style.backgroundColor = backgroundColor;
  circle.title = username || '';

  if (imageUrl) {
    const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="156" cy="100" r="12" fill="currentColor"/><path d="M147.31,164,173,138.34a8,8,0,0,1,11.31,0L224,178.06" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,168.69l54.34-54.35a8,8,0,0,1,11.32,0L191.31,208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = svgRaw;
    const svgEl = wrapper.firstElementChild;

    // Colorize strokes with the same text color as the initial variant.
    if (svgEl) {
      svgEl.style.width = `${Math.round(size * 0.6)}px`;
      svgEl.style.height = `${Math.round(size * 0.6)}px`;
      svgEl.style.color = textColor;
      svgEl.style.display = 'block';
    }

    if (svgEl) circle.appendChild(svgEl);
  } else {
    const letterSpan = document.createElement('span');
    letterSpan.style.display = 'flex';
    letterSpan.style.alignItems = 'center';
    letterSpan.style.justifyContent = 'center';
    letterSpan.style.width = '100%';
    letterSpan.style.height = '100%';
    letterSpan.style.fontWeight = 'bold';
    letterSpan.style.fontSize = `${fontSize}px`;
    letterSpan.style.color = textColor;
    letterSpan.style.fontFamily = getFontFamily(style);
    letterSpan.style.lineHeight = '1';
    letterSpan.textContent = (username[0] || '?').toUpperCase();
    circle.appendChild(letterSpan);
  }

  container.appendChild(circle);
  instance.canvas.append(container);
}
