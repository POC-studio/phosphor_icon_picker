// preview.js
export default function(instance, properties) {
  // Rendu statique très simple pour l'éditeur Bubble
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = 'transparent';
  
  const mainEmoji = document.createElement('span');
  mainEmoji.textContent = '🙂';
  
  // On utilise la taille du composant dans l'éditeur (width/height natifs)
  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  
  mainEmoji.style.fontSize = `${size}px`;
  mainEmoji.style.lineHeight = '1';
  mainEmoji.style.display = 'flex';
  mainEmoji.style.alignItems = 'center';
  mainEmoji.style.justifyContent = 'center';
  mainEmoji.style.width = '100%';
  mainEmoji.style.height = '100%';
  
  container.appendChild(mainEmoji);
  instance.canvas.append(container);
}