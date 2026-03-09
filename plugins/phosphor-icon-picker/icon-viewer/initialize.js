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
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  
  // Helper pour obtenir la classe complète (avec le style/poids)
  instance.data.getIconClass = function(iconName, style) {
    const weightClass = style === 'regular' ? 'ph' : `ph-${style}`;
    return `${weightClass} ph-${iconName}`;
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