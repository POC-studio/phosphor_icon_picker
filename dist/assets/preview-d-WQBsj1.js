const e=`// preview.js
export default function(instance, properties) {
  // Charger la librairie Phosphor Icons pour le rendu dans l'éditeur Bubble
  if (!document.getElementById('phosphor-script')) {
    const script = document.createElement('script');
    script.id = 'phosphor-script';
    script.src = 'https://unpkg.com/@phosphor-icons/web';
    document.head.appendChild(script);
  }

  const getIconClass = (iconName, style) => {
    const cleanStyle = (style || 'regular').trim().toLowerCase();
    const cleanIcon = (iconName || '').trim().toLowerCase();
    const weightClass = cleanStyle === 'regular' ? 'ph' : \`ph-\${cleanStyle}\`;
    return \`\${weightClass} ph-\${cleanIcon}\`;
  };

  // Affichage statique pour l'éditeur
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = 'transparent';

  const mainIcon = document.createElement('i');
  const iconName = (properties.initial_icon && String(properties.initial_icon).trim()) ? String(properties.initial_icon).trim().toLowerCase() : 'smiley';
  const style = (properties.style && String(properties.style).trim()) ? String(properties.style).trim() : 'regular';
  mainIcon.className = getIconClass(iconName, style);

  // Taille : width/height natifs Bubble
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
  mainIcon.style.fontSize = \`\${size}px\`;
  mainIcon.style.lineHeight = '1';
  mainIcon.style.display = 'flex';
  mainIcon.style.alignItems = 'center';
  mainIcon.style.justifyContent = 'center';
  mainIcon.style.width = '100%';
  mainIcon.style.height = '100%';

  container.appendChild(mainIcon);
  instance.canvas.append(container);
}
`;export{e as default};
