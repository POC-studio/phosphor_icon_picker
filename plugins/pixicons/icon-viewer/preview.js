// preview.js
export default function(instance, properties) {
  // Charger le kit Pixicons pour le rendu dans l'éditeur Bubble
  if (!document.getElementById('pixicons-script')) {
    const script = document.createElement('script');
    script.id = 'pixicons-script';
    script.src = 'https://www.pixicons.io/kit/pixicons.js';
    document.head.appendChild(script);
  }

  const clean = (value, fallback) => {
    const str = value != null ? String(value).trim().toLowerCase() : '';
    return str || fallback;
  };

  // Affichage statique pour l'éditeur
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = 'transparent';

  const rawIcon = clean(properties.initial_icon, 'face-smile');
  const iconName = /^[a-z0-9-]+$/.test(rawIcon) ? rawIcon : 'face-smile';
  const style = clean(properties.style, 'pixel');
  const variant = clean(properties.variant, 'regular');

  const mainIcon = document.createElement('i');
  mainIcon.className = `px px-${iconName} px-${style} px-${variant}`;

  // On utilise la taille du composant dans l'éditeur
  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === 'function' ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === 'function' ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);

  let color = (properties.icon_color != null && properties.icon_color !== '') ? String(properties.icon_color).trim() : '';
  if (!color) color = '#000000';
  mainIcon.style.color = color;
  mainIcon.style.fontSize = `${size}px`;

  container.appendChild(mainIcon);
  instance.canvas.append(container);
}
