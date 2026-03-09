export default function(instance, context) {
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  const size = 32;
  const circle = document.createElement('div');
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.borderRadius = '50%';
  circle.style.overflow = 'hidden';
  circle.style.display = 'flex';
  circle.style.alignItems = 'center';
  circle.style.justifyContent = 'center';
  circle.style.flexShrink = '0';
  circle.style.backgroundColor = '#e5e7eb';
  circle.style.cursor = 'pointer';

  circle.addEventListener('click', () => {
    instance.triggerEvent('is_clicked');
  });

  const img = document.createElement('img');
  img.setAttribute('alt', '');
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.display = 'none';

  const letterSpan = document.createElement('span');
  letterSpan.style.display = 'flex';
  letterSpan.style.alignItems = 'center';
  letterSpan.style.justifyContent = 'center';
  letterSpan.style.width = '100%';
  letterSpan.style.height = '100%';
  letterSpan.style.fontWeight = 'bold';
  letterSpan.style.lineHeight = '1';
  letterSpan.style.fontSize = `${Math.round(size * 0.48)}px`;
  letterSpan.textContent = '?';

  circle.appendChild(img);
  circle.appendChild(letterSpan);
  container.appendChild(circle);

  instance.data.getFontFamily = function(style) {
    const s = (style || 'sans serif').toLowerCase();
    if (s === 'serif') return 'Georgia, serif';
    if (s === 'monospace') return 'monospace';
    return 'sans-serif';
  };

  instance.data.container = container;
  instance.data.circle = circle;
  instance.data.img = img;
  instance.data.letterSpan = letterSpan;
  instance.data.currentSize = size;

  if (window.ResizeObserver && (instance.canvas && instance.canvas[0])) {
    const observer = new ResizeObserver(() => {
      const target = instance.canvas[0];
      if (!target) return;
      const w = target.offsetWidth || 32;
      const h = target.offsetHeight || 32;
      const newSize = Math.min(w, h);
      if (newSize > 0 && instance.data.circle) {
        instance.data.currentSize = newSize;
        instance.data.circle.style.width = `${newSize}px`;
        instance.data.circle.style.height = `${newSize}px`;
        const fontSize = Math.round(newSize * 0.48);
        instance.data.letterSpan.style.fontSize = `${fontSize}px`;
      }
    });
    observer.observe(instance.canvas[0]);
  }

  instance.canvas.append(container);
}
