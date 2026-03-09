export default function(instance, context) {
  // 1. Charger la librairie Phosphor Icons (si pas déjà fait)
  if (!document.getElementById('phosphor-script')) {
    const script = document.createElement('script');
    script.id = 'phosphor-script';
    script.src = 'https://unpkg.com/@phosphor-icons/web';
    document.head.appendChild(script);
  }

  // 2. Créer le conteneur principal
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  
  // Helper pour obtenir la classe complète (avec le style/poids)
  instance.data.getIconClass = function(iconName, style) {
    const cleanStyle = (style || 'regular').trim().toLowerCase();
    const cleanIcon = (iconName || '').trim().toLowerCase();
    const weightClass = cleanStyle === 'regular' ? 'ph' : `ph-${cleanStyle}`;
    return `${weightClass} ph-${cleanIcon}`;
  };
  
  instance.data.currentStyle = 'regular';
  instance.data.currentColor = '#333333';
  instance.data.currentSize = 32;

  // 3. Créer l'icône principale (celle qui est affichée)
  const mainIcon = document.createElement('i');
  mainIcon.className = 'ph ph-smiley'; // Default initial
  mainIcon.style.fontSize = `${instance.data.currentSize}px`;
  mainIcon.style.color = instance.data.currentColor;
  mainIcon.style.cursor = 'pointer'; // Pour indiquer que c'est cliquable
  mainIcon.style.lineHeight = '1';
  mainIcon.style.display = 'flex';
  mainIcon.style.alignItems = 'center';
  mainIcon.style.justifyContent = 'center';
  mainIcon.style.width = '100%';
  mainIcon.style.height = '100%';

  // Rendre l'icône parfaitement responsive à la taille de la boîte (Bubble responsive engine)
  if (window.ResizeObserver) {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const size = Math.min(width, height);
        // On s'assure d'avoir une taille valide
        if (size > 0 && mainIcon) {
          mainIcon.style.fontSize = `${size}px`;
          instance.data.currentSize = size;
        }
      }
    });
    // On observe l'élément parent fourni par Bubble (plus fiable que le conteneur)
    if (instance.canvas && instance.canvas[0]) {
      observer.observe(instance.canvas[0]);
    } else {
      observer.observe(container);
    }
  }
  
  // Événement de clic : déclencher l'événement Bubble
  mainIcon.addEventListener('click', () => {
    instance.triggerEvent('is_clicked');
  });

  container.appendChild(mainIcon);

  // 4. Attacher le tout au canvas Bubble
  instance.canvas.append(container);
  
  // Sauvegarder la référence pour update.js plus tard
  instance.data.mainIcon = mainIcon;
}