import { ensureHex, isTransparentColor } from '../utils.js';



const DEFAULT_FLAT_UI_COLORS = [
  '#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db',
  '#2980b9', '#9b59b6', '#8e44ad', '#f1c40f', '#f39c12',
  '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1',
  '#bdc3c7', '#95a5a6', '#7f8c8d', '#34495e', '#2c3e50',
];



function applySwatchStyle(swatch, swatchMode, color) {
  if (!swatch) return;
  if (isTransparentColor(color)) {
    swatch.style.background = '#ffffff';
    swatch.style.border = '1px solid #cbd5e1';
    return;
  }
  if (swatchMode === 'stroke') {
    swatch.style.border = `3px solid ${color}`;
    swatch.style.background = 'transparent';
    return;
  }
  // Quand la couleur de fond est blanche, une bordure est nécessaire pour rester visible.
  const normalized = typeof color === 'string' ? color.trim().toLowerCase() : '';
  const isWhite = normalized === '#ffffff' || normalized === '#fff';
  swatch.style.border = isWhite ? '1px solid #cbd5e1' : 'none';
  swatch.style.background = color;
}


function styleButtonBase(button) {
  button.style.height = '28px';
  button.style.minWidth = '28px';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.background = 'transparent';
  button.style.cursor = 'pointer';
  button.style.display = 'inline-flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
}


function createFlatColorPicker(options = {}) {
  const label = options.label || 'Color';
  const flatColors = Array.isArray(options.flatColors) && options.flatColors.length > 0
    ? options.flatColors
    : DEFAULT_FLAT_UI_COLORS;
  const initial = typeof options.initialColor === 'string' ? options.initialColor : '#111827';
  let currentColor = isTransparentColor(initial) ? 'transparent' : ensureHex(initial, '#111827');
  const swatchMode = options.swatchMode === 'stroke' ? 'stroke' : 'fill';
  let handlers = { onPresetSelect: null, onCustomSelect: null };
  let disabled = false;
  let mixed = false;

  const root = document.createElement('label');
  root.style.display = 'inline-flex';
  root.style.gap = '8px';
  root.style.alignItems = 'center';
  root.style.fontSize = '12px';
  root.style.color = '#334155';
  root.textContent = label;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  styleButtonBase(trigger);
  trigger.style.width = '28px';
  trigger.style.padding = '0';

  const swatch = document.createElement('span');
  swatch.style.width = '16px';
  swatch.style.height = '16px';
  swatch.style.borderRadius = '999px';
  applySwatchStyle(swatch, swatchMode, currentColor);
  trigger.appendChild(swatch);

  root.appendChild(trigger);

  const popover = document.createElement('div');
  popover.style.position = 'fixed';
  popover.style.zIndex = '2147483647';
  popover.style.display = 'none';
  popover.style.background = '#ffffff';
  popover.style.border = '1px solid #e2e8f0';
  popover.style.borderRadius = '12px';
  popover.style.padding = '10px';
  popover.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.16)';
  popover.style.width = '220px';

  const paletteTitle = document.createElement('div');
  paletteTitle.textContent = 'Flat UI colors';
  paletteTitle.style.fontSize = '12px';
  paletteTitle.style.color = '#64748b';
  paletteTitle.style.marginBottom = '8px';
  popover.appendChild(paletteTitle);

  const swatchGrid = document.createElement('div');
  swatchGrid.style.display = 'grid';
  swatchGrid.style.gridTemplateColumns = 'repeat(5, minmax(0, 1fr))';
  swatchGrid.style.gap = '8px';
  swatchGrid.style.marginBottom = '10px';
  popover.appendChild(swatchGrid);

  flatColors.forEach((color) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.title = color;
    b.style.width = '100%';
    b.style.aspectRatio = '1 / 1';
    b.style.borderRadius = '999px';
    b.style.border = '1px solid #cbd5e1';
    b.style.background = color;
    b.style.cursor = 'pointer';
    b.addEventListener('click', () => {
      if (disabled) return;
      currentColor = color;
      swatch.style.background = color;
      if (typeof handlers.onPresetSelect === 'function') handlers.onPresetSelect(color);
      close();
    });
    swatchGrid.appendChild(b);
  });

  const customRow = document.createElement('div');
  customRow.style.display = 'flex';
  customRow.style.alignItems = 'center';
  customRow.style.justifyContent = 'space-between';
  customRow.style.gap = '8px';
  popover.appendChild(customRow);

  const customLabel = document.createElement('span');
  customLabel.textContent = 'Custom color';
  customLabel.style.fontSize = '12px';
  customLabel.style.color = '#64748b';
  customRow.appendChild(customLabel);

  const openCustomBtn = document.createElement('button');
  openCustomBtn.type = 'button';
  openCustomBtn.textContent = '+';
  styleButtonBase(openCustomBtn);
  openCustomBtn.style.width = '28px';
  openCustomBtn.style.fontWeight = '700';
  customRow.appendChild(openCustomBtn);

  const transparentBtn = document.createElement('button');
  transparentBtn.type = 'button';
  transparentBtn.textContent = 'Transparent';
  styleButtonBase(transparentBtn);
  transparentBtn.style.padding = '0 10px';
  transparentBtn.style.fontSize = '12px';
  transparentBtn.style.border = '1px solid #e2e8f0';
  transparentBtn.style.background = '#ffffff';
  transparentBtn.style.color = '#475569';
  transparentBtn.style.width = '100%';
  transparentBtn.style.marginTop = '10px';
  transparentBtn.style.justifyContent = 'flex-start';
  popover.appendChild(transparentBtn);

  const customPanel = document.createElement('div');
  customPanel.style.display = 'none';
  customPanel.style.marginTop = '10px';
  customPanel.style.paddingTop = '10px';
  customPanel.style.borderTop = '1px solid #eef2f7';

  const customInput = document.createElement('input');
  customInput.type = 'color';
  customInput.value = currentColor;
  customInput.style.width = '100%';
  customInput.style.height = '34px';
  customInput.style.border = '1px solid #cbd5e1';
  customInput.style.borderRadius = '8px';
  customInput.style.padding = '0';
  customInput.style.background = '#ffffff';
  customPanel.appendChild(customInput);

  const customActions = document.createElement('div');
  customActions.style.display = 'flex';
  customActions.style.justifyContent = 'flex-end';
  customActions.style.gap = '8px';
  customActions.style.marginTop = '8px';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';
  styleButtonBase(cancelBtn);
  cancelBtn.style.padding = '0 10px';

  const applyBtn = document.createElement('button');
  applyBtn.type = 'button';
  applyBtn.textContent = 'Apply';
  styleButtonBase(applyBtn);
  applyBtn.style.padding = '0 10px';
  applyBtn.style.borderColor = '#93c5fd';
  applyBtn.style.background = '#eff6ff';

  customActions.appendChild(cancelBtn);
  customActions.appendChild(applyBtn);
  customPanel.appendChild(customActions);
  popover.appendChild(customPanel);

  function placePopover() {
    const rect = trigger.getBoundingClientRect();
    const width = 220;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width));
    const top = rect.bottom + 8;
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  function open() {
    if (disabled) return;
    customInput.value = isTransparentColor(currentColor) ? '#111827' : currentColor;
    customPanel.style.display = 'none';
    popover.style.display = 'block';
    placePopover();
  }

  function close() {
    popover.style.display = 'none';
    customPanel.style.display = 'none';
  }

  function setColor(color) {
    currentColor = isTransparentColor(color) ? 'transparent' : ensureHex(color, currentColor);
    if (!mixed) {
      applySwatchStyle(swatch, swatchMode, currentColor);
    }
  }

  function setMixed(isMixed) {
    mixed = !!isMixed;
    if (mixed) {
      swatch.style.background = '#e2e8f0';
      swatch.style.border = '1px solid #94a3b8';
      trigger.style.opacity = disabled ? '0.55' : '1';
      root.style.color = '#94a3b8';
      return;
    }
    root.style.color = '#334155';
    applySwatchStyle(swatch, swatchMode, currentColor);
  }

  function setDisabled(nextDisabled) {
    disabled = !!nextDisabled;
    trigger.disabled = disabled;
    trigger.style.opacity = disabled ? '0.55' : '1';
    if (!mixed) root.style.color = disabled ? '#94a3b8' : '#334155';
    if (disabled) close();
  }

  function setVisible(isVisible) {
    root.style.display = isVisible ? 'inline-flex' : 'none';
    if (!isVisible) close();
  }

  function setHandlers(nextHandlers) {
    handlers = {
      onPresetSelect: nextHandlers && typeof nextHandlers.onPresetSelect === 'function'
        ? nextHandlers.onPresetSelect
        : null,
      onCustomSelect: nextHandlers && typeof nextHandlers.onCustomSelect === 'function'
        ? nextHandlers.onCustomSelect
        : null,
    };
  }

  openCustomBtn.addEventListener('click', () => {
    if (disabled) return;
    customPanel.style.display = customPanel.style.display === 'none' ? 'block' : 'none';
    if (customPanel.style.display === 'block') customInput.focus();
    placePopover();
  });
  cancelBtn.addEventListener('click', () => {
    close();
  });
  applyBtn.addEventListener('click', () => {
    if (disabled) return;
    const hex = ensureHex(customInput.value, currentColor);
    currentColor = hex;
    applySwatchStyle(swatch, swatchMode, hex);
    if (typeof handlers.onCustomSelect === 'function') handlers.onCustomSelect(hex);
    close();
  });
  transparentBtn.addEventListener('click', () => {
    if (disabled) return;
    currentColor = 'transparent';
    applySwatchStyle(swatch, swatchMode, currentColor);
    if (typeof handlers.onPresetSelect === 'function') handlers.onPresetSelect('transparent');
    close();
  });
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (popover.style.display === 'none') open();
    else close();
  });

  document.addEventListener('click', (event) => {
    if (popover.style.display === 'none') return;
    const target = event.target;
    if (target && (popover.contains(target) || trigger.contains(target))) return;
    close();
  }, true);
  window.addEventListener('resize', () => {
    if (popover.style.display !== 'none') placePopover();
  });

  document.body.appendChild(popover);

  return {
    root,
    setColor,
    setMixed,
    setDisabled,
    setVisible,
    setHandlers,
    close,
  };
}

export {
  DEFAULT_FLAT_UI_COLORS,
  applySwatchStyle,
  styleButtonBase,
  createFlatColorPicker,
};
