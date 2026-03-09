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
    const img = document.createElement('img');
    img.src = imageUrl;
    img.setAttribute('alt', '');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    circle.appendChild(img);
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
