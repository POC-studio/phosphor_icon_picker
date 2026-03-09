// update.js
export default function(instance, properties, context) {
  // Appelé à chaque changement de propriété
  
  if (properties) {
    const style = properties.style || 'regular';
    instance.data.currentStyle = style;
    
    const color = properties.color || '#fbbf24';
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
    
    // Initialisation de l'état "is_open" s'il n'existe pas encore
    if (instance.data.isOpen === undefined) {
      instance.data.isOpen = false;
      instance.publishState('is_open', false);
    }
    
    // Mettre à jour le style et la couleur de toutes les icônes du dropdown
    if (instance.data.dropdownIcons) {
      instance.data.dropdownIcons.forEach(btn => {
        const name = btn.dataset.iconName;
        btn.className = instance.data.getIconClass(name, style);
        btn.style.color = color;
      });
    }
    
    // Mettre à jour le placeholder de recherche
    if (properties.search_placeholder !== undefined && instance.data.searchInput) {
      instance.data.searchInput.placeholder = properties.search_placeholder;
    }
    
    // Gérer la liste des icônes autorisées
    if (properties.allowed_icons !== undefined) {
      const rawAllowed = (properties.allowed_icons || '').trim();
      if (rawAllowed === '') {
        // Si vide, on autorise tout
        instance.data.allowedIcons = null;
      } else {
        // Transformer "smiley, heart, house" en un Set pour la rapidité
        const allowedList = rawAllowed.split(',')
          .map(i => i.trim().toLowerCase())
          // Enlever un éventuel préfixe "ph-" si l'utilisateur l'a mis par erreur
          .map(i => i.startsWith('ph-') ? i.replace('ph-', '') : i)
          // Vérifier que l'icône existe bien dans notre base
          .filter(i => instance.data.allIcons.includes(i));
          
        instance.data.allowedIcons = new Set(allowedList);
      }
      
      // Appliquer le filtre de visibilité global
      // Note : on relance la logique de la barre de recherche (si elle n'est pas vide)
      const searchTerm = (instance.data.searchInput && instance.data.searchInput.value) 
        ? instance.data.searchInput.value.toLowerCase() 
        : '';
        
      if (instance.data.dropdownIcons) {
        instance.data.dropdownIcons.forEach(btn => {
          const name = btn.dataset.iconName.toLowerCase();
          
          // Conditions pour afficher l'icône :
          // 1. Elle matche la barre de recherche
          // 2. ET (aucune restriction OU elle est dans la liste des autorisées)
          const matchesSearch = name.includes(searchTerm);
          // FIX: allowedIcons is a Set, so we should check its size to see if it's empty, 
          // or just check if it's null as we set it earlier
          const isAllowed = instance.data.allowedIcons === null || instance.data.allowedIcons.has(name);
          
          if (matchesSearch && isAllowed) {
            btn.style.display = 'flex';
          } else {
            btn.style.display = 'none';
          }
        });
      }
    }

    if (properties.initial_icon) {
      const initialIconName = properties.initial_icon;
      
      // On met à jour l'icône si c'est la première fois, OU si la propriété initiale a changé 
      // (utile pour notre sandbox quand on tape dans l'input)
      if (!instance.data.currentIcon || instance.data.lastInitialIcon !== initialIconName) {
        
        // On sauvegarde l'état
        instance.data.currentIcon = initialIconName;
        instance.data.lastInitialIcon = initialIconName;
        
        instance.publishState('selected_icon', initialIconName);
      }
    }
    
    // Toujours mettre à jour l'icône principale avec l'icône courante, le nouveau style, la couleur et la taille
    if (instance.data.mainIcon && instance.data.currentIcon) {
      instance.data.mainIcon.className = instance.data.getIconClass(instance.data.currentIcon, style);
      instance.data.mainIcon.style.color = color;
      instance.data.mainIcon.style.fontSize = `${size}px`;
    }
  }
}
