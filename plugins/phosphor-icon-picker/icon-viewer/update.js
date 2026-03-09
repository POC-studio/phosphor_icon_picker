// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  
  if (properties) {
    const style = properties.style || 'regular';
    instance.data.currentStyle = style;
    
    const color = properties.color || '#333333';
    instance.data.currentColor = color;
    
    // On utilise la taille native de l'élément Bubble s'il est disponible (responsive)
    // Sinon on retombe sur properties.size au cas où il y ait encore le paramètre
    const size = (properties.bubble && properties.bubble.width) 
                 ? Math.min(properties.bubble.width, properties.bubble.height) 
                 : (properties.size || 32);
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