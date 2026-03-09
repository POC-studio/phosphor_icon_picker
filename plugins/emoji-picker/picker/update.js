// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  
  if (properties) {
    // Récupérer et stocker le format de retour (emoji, hexcode, shortcode)
    const returnFormat = properties.return_format || 'emoji';
    instance.data.returnFormat = returnFormat;
    
    // Récupérer la taille de l'élément (width/height natifs de Bubble)
    let width = 32;
    let height = 32;
    if (properties.bubble) {
      width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
      height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
    }
    const size = Math.min(width || 32, height || 32);
    instance.data.currentSize = size;
    
    // Initialisation de l'état "is_open" s'il n'existe pas encore
    if (instance.data.isOpen === undefined) {
      instance.data.isOpen = false;
      instance.publishState('is_open', false);
    }
    
    // Mettre à jour l'emoji principal
    if (instance.data.mainEmoji) {
      instance.data.mainEmoji.style.fontSize = `${size}px`;
      
      // Si on n'a pas encore cliqué sur un emoji manuellement OU que la propriété initiale change
      const initialEmoji = properties.initial_emoji || '';
      
      if (!instance.data.currentEmoji || instance.data.lastInitialEmoji !== initialEmoji) {
        
        instance.data.lastInitialEmoji = initialEmoji;
        
        if (initialEmoji) {
          // Si un emoji initial est fourni, on l'affiche et on enlève l'effet grisé
          instance.data.mainEmoji.textContent = initialEmoji;
          instance.data.mainEmoji.style.opacity = '1';
          instance.data.currentEmoji = initialEmoji;
          
          // On le publie tel quel (l'utilisateur Bubble est responsable du bon format d'entrée)
          instance.publishState('selected_emoji', initialEmoji);
        } else {
          // Sinon on met le smiley grisé par défaut
          instance.data.mainEmoji.textContent = '🙂';
          instance.data.mainEmoji.style.opacity = '0.5';
          // On peut réinitialiser l'état
          instance.publishState('selected_emoji', null);
        }
      }
    }
  }
}