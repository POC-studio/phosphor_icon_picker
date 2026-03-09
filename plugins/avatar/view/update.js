export default function(instance, properties, context) {
  if (!properties || !instance.data.circle) return;

  const username = (properties.username || '').trim();
  const imageUrl = (properties.image_url || '').trim();
  const style = properties.style || 'sans serif';
  const textColor = properties.text_color || '#333333';
  const backgroundColor = properties.background_color || '#e5e7eb';

  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);

  const circle = instance.data.circle;
  const img = instance.data.img;
  const letterSpan = instance.data.letterSpan;

  instance.data.currentSize = size;
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.backgroundColor = backgroundColor;

  const fontSize = Math.round(size * 0.48);
  letterSpan.style.fontSize = `${fontSize}px`;
  letterSpan.style.color = textColor;
  letterSpan.style.fontFamily = instance.data.getFontFamily(style);
  letterSpan.textContent = imageUrl ? '' : ((username[0] || '?').toUpperCase());

  if (imageUrl) {
    img.src = imageUrl;
    img.style.display = 'block';
    letterSpan.style.display = 'none';
  } else {
    img.style.display = 'none';
    img.removeAttribute('src');
    letterSpan.style.display = 'flex';
  }

  circle.title = username || '';
}
