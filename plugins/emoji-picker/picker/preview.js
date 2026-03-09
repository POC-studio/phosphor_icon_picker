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
  mainEmoji.style.fontSize = '32px';
  
  container.appendChild(mainEmoji);
  instance.canvas.append(container);
}