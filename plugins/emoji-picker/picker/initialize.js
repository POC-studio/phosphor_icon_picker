export default function(instance, context) {
  // 1. Charger la librairie emoji-picker-element (si pas déjà fait)
  if (!document.getElementById('emoji-picker-script')) {
    const script = document.createElement('script');
    script.id = 'emoji-picker-script';
    script.type = 'module';
    script.src = 'https://unpkg.com/emoji-picker-element';
    document.head.appendChild(script);
  }

  // 2. Créer le conteneur principal
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.fontFamily = 'sans-serif';
  
  // Variables d'état
  instance.data.currentSize = 32;
  instance.data.returnFormat = 'emoji';

  // 3. Créer le bouton d'affichage principal
  const mainEmoji = document.createElement('span');
  mainEmoji.textContent = '🙂'; // Smiley par défaut
  mainEmoji.style.fontSize = `${instance.data.currentSize}px`;
  mainEmoji.style.cursor = 'pointer';
  mainEmoji.style.display = 'flex';
  mainEmoji.style.alignItems = 'center';
  mainEmoji.style.justifyContent = 'center';
  mainEmoji.style.width = '100%';
  mainEmoji.style.height = '100%';
  mainEmoji.style.lineHeight = '1';
  mainEmoji.style.borderRadius = '8px';
  mainEmoji.style.transition = 'background-color 0.2s';
  mainEmoji.style.opacity = '0.5'; // Grisé par défaut (vide)
  
  mainEmoji.onmouseover = () => mainEmoji.style.backgroundColor = '#f3f4f6';
  mainEmoji.onmouseout = () => mainEmoji.style.backgroundColor = 'transparent';

  container.appendChild(mainEmoji);

  // 4. Créer le conteneur du popup
  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.top = '100%';
  popup.style.left = '0';
  popup.style.marginTop = '8px';
  popup.style.display = 'none'; // Caché par défaut
  popup.style.zIndex = '1000';
  // Ajout de l'ombre et des arrondis directement sur le conteneur pour simuler notre style
  popup.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  popup.style.borderRadius = '8px';
  popup.style.overflow = 'hidden';
  popup.style.border = '1px solid #e5e7eb';
  popup.style.backgroundColor = '#ffffff';
  
  // Instancier le web component emoji-picker
  const pickerElement = document.createElement('emoji-picker');
  
  // Personnalisation du style pour correspondre au Phosphor Icon Picker
  pickerElement.style.setProperty('--background', '#ffffff');
  pickerElement.style.setProperty('--border-color', 'transparent');
  pickerElement.style.setProperty('--border-radius', '8px');
  pickerElement.style.setProperty('--indicator-color', '#3b82f6');
  pickerElement.style.setProperty('--input-border-color', '#d1d5db');
  pickerElement.style.setProperty('--input-border-radius', '4px');
  pickerElement.style.setProperty('--input-padding', '8px');
  pickerElement.style.setProperty('--input-font-size', '14px');
  pickerElement.style.setProperty('--outline-color', '#3b82f6');
  pickerElement.style.setProperty('--category-font-size', '12px');
  pickerElement.style.setProperty('--category-font-color', '#6b7280');
  pickerElement.style.setProperty('--emoji-padding', '6px');
  
  // Suppression de la box-shadow interne car on gère l'arrondi et l'ombre sur le conteneur principal
  pickerElement.style.boxShadow = 'none';
  
  // Injection de CSS dans le Shadow DOM pour forcer le style de la barre de recherche
  customElements.whenDefined('emoji-picker').then(() => {
    if (pickerElement.shadowRoot) {
      const style = document.createElement('style');
      style.textContent = `
        /* Nettoyage du header pour qu'il soit fluide */
        
        .search-row {
          padding: 8px !important;
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }

        /* Ajuster la barre de recherche */
        .search-wrapper {
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          margin: 0 !important;
          width: 100% !important;
        }

        .search-icon {
          display: none !important;
        }

        input.search {
          background-color: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          padding: 8px !important;
          font-size: 14px !important;
          outline: none !important;
          box-shadow: none !important;
          width: 100% !important;
          box-sizing: border-box !important;
          color: #1f2937 !important;
          font-family: inherit !important;
          transition: border-color 0.2s !important;
          margin: 0 !important;
        }

        input.search::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }

        input.search:focus {
          border-color: #3b82f6 !important;
        }
        
        /* Affichage des catégories */
        .nav {
          background-color: #ffffff !important;
          border-radius: 0 !important;
          padding: 4px 8px 0 8px !important;
          border-bottom: 1px solid #e5e7eb !important;
          margin: 0 !important;
        }

        /* Masquer la div de padding qui crée un espace blanc gênant en haut */
        .pad-top {
          display: none !important;
        }

        /* Masquer TOTALEMENT la couleur de peau */
        #skintone-button, .skintone-button-wrapper {
          display: none !important;
        }
      `;
      pickerElement.shadowRoot.appendChild(style);
    }
  });
  
  popup.appendChild(pickerElement);
  document.body.appendChild(popup); // On l'attache au body pour éviter qu'il soit coupé par un overflow hidden de Bubble

  // 5. Gérer l'ouverture / fermeture du popup
  mainEmoji.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyClosed = popup.style.display === 'none';
    
    if (isCurrentlyClosed) {
      // Calculer la position de l'emoji
      const rect = mainEmoji.getBoundingClientRect();
      
      // Placer le popup juste en dessous
      popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      
      popup.style.display = 'block';
      
      // Mettre le focus sur l'input de recherche
      setTimeout(() => {
        const searchInput = pickerElement.shadowRoot?.querySelector('input.search');
        if (searchInput) {
          searchInput.focus();
        }
      }, 50);
    } else {
      popup.style.display = 'none';
    }
    
    // Publier l'état d'ouverture
    instance.publishState('is_open', isCurrentlyClosed);
  });

  // Fermer le popup si on clique en dehors
  document.addEventListener('click', (e) => {
    if (popup.contains(e.target)) return;
    
    if (popup.style.display !== 'none') {
      popup.style.display = 'none';
      instance.publishState('is_open', false);
    }
  });

  // Fermer le popup au scroll pour éviter qu'il flotte n'importe où
  window.addEventListener('scroll', () => {
    if (popup.style.display !== 'none') {
      popup.style.display = 'none';
      instance.publishState('is_open', false);
    }
  }, true);

  // 6. Écouter l'événement de sélection d'emoji
  pickerElement.addEventListener('emoji-click', event => {
    // L'événement fournit un objet detail: { unicode, hexcode, emoji, shortcodes... }
    const detail = event.detail;
    
    // Mettre à jour l'affichage
    mainEmoji.textContent = detail.unicode;
    mainEmoji.style.opacity = '1'; // Enlever l'effet grisé
    
    // Formater la valeur de retour selon la configuration
    let returnValue = detail.unicode;
    if (instance.data.returnFormat === 'hexcode') {
      returnValue = detail.hexcode;
    } else if (instance.data.returnFormat === 'shortcode') {
      // Les shortcodes sont souvent fournis sous forme de tableau, on prend le premier
      if (detail.shortcodes && detail.shortcodes.length > 0) {
        returnValue = detail.shortcodes[0];
      } else {
        returnValue = detail.unicode; // Fallback
      }
    }
    
    // Bubble : Publier l'état et déclencher l'événement
    instance.publishState('selected_emoji', returnValue);
    instance.triggerEvent('emoji_selected');
    
    // Fermer le popup et mettre à jour l'état
    popup.style.display = 'none';
    instance.publishState('is_open', false);
  });

  // 7. Attacher le tout au canvas Bubble
  instance.canvas.append(container);
  
  // Sauvegarder la référence pour update.js plus tard
  instance.data.mainEmoji = mainEmoji;
}