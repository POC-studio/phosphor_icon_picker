// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  
  if (properties) {
    const style = properties.style || 'regular';
    instance.data.currentStyle = style;
    
    const color = properties.color || '#333333';
    instance.data.currentColor = color;
    
    const size = properties.size || 32;
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