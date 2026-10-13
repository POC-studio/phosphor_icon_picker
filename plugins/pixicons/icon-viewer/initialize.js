export default function(instance, context) {
  // 1. Charger le kit Pixicons (si pas déjà fait)
  if (!document.getElementById('pixicons-script')) {
    const script = document.createElement('script');
    script.id = 'pixicons-script';
    script.src = 'https://www.pixicons.io/kit/pixicons.js';
    document.head.appendChild(script);
  }

  // 2. Créer le conteneur principal
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  // Helper pour obtenir la classe complète (nom + style + variante).
  // Le kit observe les changements de classe et re-rend le SVG tout seul.
  instance.data.getIconClass = function(iconName, style, variant) {
    const cleanIcon = (iconName || '').trim().toLowerCase();
    const cleanStyle = (style || 'pixel').trim().toLowerCase();
    const cleanVariant = (variant || 'regular').trim().toLowerCase();
    return `px px-${cleanIcon} px-${cleanStyle} px-${cleanVariant}`;
  };

  instance.data.currentColor = '#333333';
  instance.data.currentSize = 32;

  // 3. Créer l'icône principale
  const mainIcon = document.createElement('i');
  mainIcon.className = instance.data.getIconClass('face-smile', 'pixel', 'regular');
  mainIcon.style.fontSize = `${instance.data.currentSize}px`;
  mainIcon.style.color = instance.data.currentColor;
  mainIcon.style.cursor = 'pointer';

  // Rendre l'icône responsive à la taille de la boîte (Bubble responsive engine)
  if (window.ResizeObserver) {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const size = Math.min(entry.contentRect.width, entry.contentRect.height);
        if (size > 0 && mainIcon) {
          mainIcon.style.fontSize = `${size}px`;
          instance.data.currentSize = size;
        }
      }
    });
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

  // Sauvegarder la référence pour update.js
  instance.data.mainIcon = mainIcon;
}
