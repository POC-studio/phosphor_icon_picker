function readDimension(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export default function(instance, properties) {
  const docW = readDimension(properties && properties.canvas_width, 1000);
  const docH = readDimension(properties && properties.canvas_height, 1000);

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.background = '#e5e7eb';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.boxSizing = 'border-box';
  container.style.padding = '12px';

  const stage = document.createElement('div');
  stage.style.position = 'relative';
  stage.style.width = '100%';
  stage.style.height = '100%';
  stage.style.display = 'flex';
  stage.style.alignItems = 'center';
  stage.style.justifyContent = 'center';

  const artboard = document.createElement('div');
  artboard.style.width = '85%';
  artboard.style.maxWidth = '100%';
  artboard.style.maxHeight = '100%';
  artboard.style.aspectRatio = `${docW} / ${docH}`;
  artboard.style.background = '#ffffff';
  artboard.style.border = 'none';
  artboard.style.boxSizing = 'border-box';
  artboard.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.12)';

  stage.appendChild(artboard);
  container.appendChild(stage);
  instance.canvas.append(container);
}
