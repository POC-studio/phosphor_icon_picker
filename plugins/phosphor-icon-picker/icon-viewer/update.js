// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  
  if (properties) {
    const style = properties.style || 'regular';
    instance.data.currentStyle = style;
    
    // Même logique que pour l'Icon Picker : on ne remet pas la couleur à zéro
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
    
    if (properties.initial_icon) {
      instance.data.currentIcon = properties.initial_icon;
    }
    
    // Toujours mettre à jour l'icône principale avec l'icône courante, le nouveau style, la couleur et la taille
    if (instance.data.mainIcon && instance.data.currentIcon) {
      instance.data.mainIcon.className = instance.data.getIconClass(instance.data.currentIcon, style);
      instance.data.mainIcon.style.color = color;
      instance.data.mainIcon.style.fontSize = `${size}px`;
    }
  }
}