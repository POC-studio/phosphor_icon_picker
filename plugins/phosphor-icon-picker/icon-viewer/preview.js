// preview.js
export default function(instance, properties) {
  // Charger la librairie Phosphor Icons pour le rendu dans l'éditeur Bubble
  if (!document.getElementById('phosphor-script')) {
    const script = document.createElement('script');
    script.id = 'phosphor-script';
    script.src = 'https://unpkg.com/@phosphor-icons/web';
    document.head.appendChild(script);
  }
  
  // Affichage statique pour l'éditeur
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = 'transparent';
  
  const mainIcon = document.createElement('i');
  mainIcon.className = 'ph ph-smiley';
  // On récupère dynamiquement la taille dans l'éditeur
  const size = (properties.bubble && properties.bubble.width) ? Math.min(properties.bubble.width, properties.bubble.height) : 32;
  mainIcon.style.fontSize = `${size}px`;
  mainIcon.style.color = '#333';
  
  container.appendChild(mainIcon);
  instance.canvas.append(container);
}
