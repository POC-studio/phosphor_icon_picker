// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  if (!properties || !instance.data.mainIcon) return;

  const style = properties.style || 'pixel';
  const variant = properties.variant || 'regular';

  // On ne remet pas la couleur à zéro si elle est vide
  let color = properties.icon_color;
  if (typeof color === 'string') {
    color = color.trim();
  }
  if (!color) {
    color = instance.data.currentColor || '#333333';
  }
  instance.data.currentColor = color;

  // Récupérer la taille de l'élément (width/height natifs de Bubble)
  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  instance.data.currentSize = size;

  if (properties.initial_icon && String(properties.initial_icon).trim()) {
    instance.data.currentIcon = String(properties.initial_icon).trim();
  }
  const iconName = instance.data.currentIcon || 'face-smile';

  const mainIcon = instance.data.mainIcon;
  mainIcon.className = instance.data.getIconClass(iconName, style, variant);
  mainIcon.style.color = color;
  mainIcon.style.fontSize = `${size}px`;
}
