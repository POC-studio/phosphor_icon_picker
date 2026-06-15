import { DEFAULT_TEXT_FONT_FAMILY } from '../constants.js';
import { createFlatColorPicker } from './color-picker.js';
import { createFontPicker } from './font-picker.js';


function buildShell() {
  const styleTopNumberInput = (input) => {
    input.style.width = '56px';
    input.style.height = '28px';
    input.style.border = '1px solid #cbd5e1';
    input.style.borderRadius = '8px';
    input.style.padding = '0 8px';
    input.style.background = '#ffffff';
    input.style.color = '#0f172a';
    input.style.fontSize = '12px';
    input.style.fontWeight = '500';
    input.style.letterSpacing = '0';
    input.style.transition = 'border-color 120ms ease, background-color 120ms ease';
    input.style.outline = 'none';
    input.style.boxSizing = 'border-box';
    input.style.appearance = 'none';
    input.style.webkitAppearance = 'none';
    input.style.MozAppearance = 'textfield';
    input.addEventListener('focus', () => {
      input.style.borderColor = '#94a3b8';
      input.style.background = '#ffffff';
      input.style.boxShadow = 'none';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#cbd5e1';
      input.style.background = '#ffffff';
      input.style.boxShadow = 'none';
    });
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      const step = Number.isFinite(Number(input.step)) ? Number(input.step) : 1;
      const min = Number.isFinite(Number(input.min)) ? Number(input.min) : -Infinity;
      const max = Number.isFinite(Number(input.max)) ? Number(input.max) : Infinity;
      const base = Number.isFinite(Number(input.value)) ? Number(input.value) : (Number.isFinite(min) ? min : 0);
      const delta = event.key === 'ArrowUp' ? step : -step;
      const next = Math.max(min, Math.min(max, base + delta));
      input.value = String(next);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  };

  const root = document.createElement('div');
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.position = 'relative';
  root.style.background = '#f8fafc';
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";

  const topBar = document.createElement('div');
  topBar.style.display = 'flex';
  topBar.style.alignItems = 'center';
  topBar.style.justifyContent = 'flex-start';
  topBar.style.gap = '10px';
  topBar.style.paddingTop = '10px';
  topBar.style.paddingRight = '12px';
  topBar.style.paddingBottom = '10px';
  // Même retrait horizontal que la toolbar verticale : 56px de large, boutons 36px centrés → 10px de chaque côté.
  topBar.style.paddingLeft = '10px';
  topBar.style.height = '52px';
  topBar.style.minHeight = '52px';
  topBar.style.maxHeight = '52px';
  topBar.style.boxSizing = 'border-box';
  topBar.style.background = '#ffffff';
  topBar.style.borderBottom = '1px solid #e2e8f0';
  topBar.style.flexShrink = '0';
  const documentTitle = document.createElement('div');
  documentTitle.style.fontSize = '13px';
  documentTitle.style.fontWeight = '600';
  documentTitle.style.color = '#0f172a';
  documentTitle.style.whiteSpace = 'nowrap';
  documentTitle.style.overflow = 'hidden';
  documentTitle.style.textOverflow = 'ellipsis';
  documentTitle.style.flex = '1 1 auto';
  documentTitle.style.minWidth = '0';

  const topControls = document.createElement('div');
  topControls.style.display = 'flex';
  topControls.style.alignItems = 'center';
  topControls.style.justifyContent = 'flex-end';
  topControls.style.gap = '10px';
  topControls.style.flexShrink = '0';
  topControls.style.marginLeft = 'auto';

  const fillControl = createFlatColorPicker({ label: 'Fill', initialColor: '#111827', swatchMode: 'fill' });
  const strokeControl = createFlatColorPicker({ label: 'Stroke', initialColor: '#000000', swatchMode: 'stroke' });

  const strokeWidthInput = document.createElement('input');
  strokeWidthInput.type = 'text';
  strokeWidthInput.inputMode = 'numeric';
  strokeWidthInput.min = '0';
  strokeWidthInput.max = '50';
  strokeWidthInput.step = '1';
  strokeWidthInput.value = '1';
  styleTopNumberInput(strokeWidthInput);

  const radiusInput = document.createElement('input');
  radiusInput.type = 'text';
  radiusInput.inputMode = 'numeric';
  radiusInput.min = '0';
  radiusInput.max = '200';
  radiusInput.step = '1';
  radiusInput.value = '0';
  styleTopNumberInput(radiusInput);

  const fontSizeInput = document.createElement('input');
  fontSizeInput.type = 'text';
  fontSizeInput.inputMode = 'numeric';
  fontSizeInput.min = '1';
  fontSizeInput.max = '400';
  fontSizeInput.step = '1';
  fontSizeInput.value = '16';
  styleTopNumberInput(fontSizeInput);

  const opacityInput = document.createElement('input');
  opacityInput.type = 'text';
  opacityInput.inputMode = 'numeric';
  opacityInput.min = '0';
  opacityInput.max = '100';
  opacityInput.step = '1';
  opacityInput.value = '100';
  styleTopNumberInput(opacityInput);

  const fontFamilyPicker = createFontPicker({ initial: DEFAULT_TEXT_FONT_FAMILY });

  const topFill = fillControl.root;
  const topStroke = strokeControl.root;

  const topStrokeWidth = document.createElement('label');
  topStrokeWidth.textContent = 'Width';
  topStrokeWidth.style.display = 'inline-flex';
  topStrokeWidth.style.gap = '8px';
  topStrokeWidth.style.alignItems = 'center';
  topStrokeWidth.style.fontSize = '12px';
  topStrokeWidth.style.color = '#334155';
  topStrokeWidth.appendChild(strokeWidthInput);

  const topRadius = document.createElement('label');
  topRadius.textContent = 'Radius';
  topRadius.style.display = 'inline-flex';
  topRadius.style.gap = '8px';
  topRadius.style.alignItems = 'center';
  topRadius.style.fontSize = '12px';
  topRadius.style.color = '#334155';
  topRadius.appendChild(radiusInput);

  const topFontFamily = fontFamilyPicker.root;

  const topFontSize = document.createElement('label');
  topFontSize.textContent = 'Size';
  topFontSize.style.display = 'inline-flex';
  topFontSize.style.gap = '8px';
  topFontSize.style.alignItems = 'center';
  topFontSize.style.fontSize = '12px';
  topFontSize.style.color = '#334155';
  topFontSize.appendChild(fontSizeInput);

  const topOpacity = document.createElement('label');
  topOpacity.textContent = 'Opacity';
  topOpacity.style.display = 'inline-flex';
  topOpacity.style.gap = '8px';
  topOpacity.style.alignItems = 'center';
  topOpacity.style.fontSize = '12px';
  topOpacity.style.color = '#334155';
  topOpacity.appendChild(opacityInput);

  const mkBtn = (iconClass, title) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.border = '1px solid #cbd5e1';
    btn.style.background = '#ffffff';
    btn.style.borderRadius = '10px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.cursor = 'pointer';
    btn.style.color = '#0f172a';

    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '18px';
    btn.appendChild(icon);
    return btn;
  };

  const artboardNav = document.createElement('div');
  artboardNav.style.display = 'flex';
  artboardNav.style.alignItems = 'center';
  artboardNav.style.gap = '4px';
  artboardNav.style.flexShrink = '0';
  const artboardPrevBtn = mkBtn('ph ph-caret-left', 'Page précédente');
  const artboardNextBtn = mkBtn('ph ph-caret-right', 'Page suivante');
  const artboardDownloadBtn = mkBtn('ph ph-download-simple', 'Télécharger PDF (pli A4)');
  artboardNav.appendChild(artboardPrevBtn);
  artboardNav.appendChild(artboardNextBtn);
  artboardNav.appendChild(artboardDownloadBtn);

  topBar.appendChild(documentTitle);
  topControls.appendChild(artboardNav);
  topControls.appendChild(topFill);
  topControls.appendChild(topStroke);
  topControls.appendChild(topStrokeWidth);
  topControls.appendChild(topRadius);
  topControls.appendChild(topFontFamily);
  topControls.appendChild(topFontSize);
  topControls.appendChild(topOpacity);
  topBar.appendChild(topControls);

  const body = document.createElement('div');
  body.style.display = 'flex';
  body.style.flex = '1';
  body.style.minHeight = '0';

  const leftBar = document.createElement('div');
  leftBar.style.width = '56px';
  leftBar.style.background = '#ffffff';
  leftBar.style.borderRight = '1px solid #e2e8f0';
  leftBar.style.display = 'flex';
  leftBar.style.flexDirection = 'column';
  leftBar.style.alignItems = 'center';
  leftBar.style.paddingTop = '12px';
  leftBar.style.paddingBottom = '12px';
  leftBar.style.gap = '4px';
  leftBar.style.flexShrink = '0';

  const board = document.createElement('div');
  board.style.flex = '1';
  board.style.position = 'relative';
  board.style.minWidth = '0';
  board.style.minHeight = '0';
  board.style.background = '#e5e7eb';

  const canvasHost = document.createElement('div');
  canvasHost.style.position = 'absolute';
  canvasHost.style.inset = '0';

  const canvasEl = document.createElement('canvas');
  canvasEl.style.width = '100%';
  canvasEl.style.height = '100%';
  canvasEl.style.display = 'block';

  canvasHost.appendChild(canvasEl);
  board.appendChild(canvasHost);

  // Overlay de chargement (affiché pendant le rendu d'une page : attente des images).
  const loadingOverlay = document.createElement('div');
  loadingOverlay.style.position = 'absolute';
  loadingOverlay.style.inset = '0';
  loadingOverlay.style.display = 'none';
  loadingOverlay.style.alignItems = 'center';
  loadingOverlay.style.justifyContent = 'center';
  loadingOverlay.style.background = 'rgba(229, 231, 235, 0.6)';
  loadingOverlay.style.zIndex = '20';
  loadingOverlay.style.pointerEvents = 'none';
  const loadingSpinner = document.createElement('i');
  loadingSpinner.className = 'ph ph-circle-notch';
  loadingSpinner.style.fontSize = '40px';
  loadingSpinner.style.color = '#475569';
  loadingSpinner.style.animation = 'fabric-view-spin 0.7s linear infinite';
  loadingOverlay.appendChild(loadingSpinner);
  board.appendChild(loadingOverlay);

  body.appendChild(leftBar);
  body.appendChild(board);
  root.appendChild(topBar);
  root.appendChild(body);

  const alignToolbar = document.createElement('div');
  alignToolbar.style.display = 'none';
  alignToolbar.style.flexDirection = 'row';
  alignToolbar.style.alignItems = 'center';
  alignToolbar.style.gap = '4px';
  alignToolbar.style.flexShrink = '0';
  alignToolbar.style.marginRight = '10px';

  const mkAlignBtn = (iconClass, title, mode) => {
    const btn = mkBtn(iconClass, title);
    btn.setAttribute('data-align-mode', mode);
    return btn;
  };

  alignToolbar.appendChild(mkAlignBtn('ph ph-align-left-simple', 'Aligner à gauche', 'left'));
  alignToolbar.appendChild(mkAlignBtn('ph ph-align-center-horizontal-simple', 'Centrer horizontalement', 'center-h'));
  alignToolbar.appendChild(mkAlignBtn('ph ph-align-right-simple', 'Aligner à droite', 'right'));
  alignToolbar.appendChild(mkAlignBtn('ph ph-align-top-simple', 'Aligner en haut', 'top'));
  alignToolbar.appendChild(mkAlignBtn('ph ph-align-center-vertical-simple', 'Centrer verticalement', 'middle'));
  alignToolbar.appendChild(mkAlignBtn('ph ph-align-bottom-simple', 'Aligner en bas', 'bottom'));

  topBar.insertBefore(alignToolbar, documentTitle);

  const textBtn = mkBtn('ph ph-text-t', 'Text');
  const shapeBtn = mkBtn('ph ph-square', 'Shape');
  const iconBtn = mkBtn('ph ph-smiley', 'Emojis');
  const tableBtn = mkBtn('ph ph-grid-nine', 'Table');
  const penBtn = mkBtn('ph ph-pen', 'Pen');
  const panBtn = mkBtn('ph ph-hand', 'Pan');
  const imageBtn = mkBtn('ph ph-image', 'Image');
  const bookmarkBtn = mkBtn('ph ph-bookmark-simple', 'Bookmark');
  const zoomOutBtn = mkBtn('ph ph-minus', 'Zoom out');
  const zoomInBtn = mkBtn('ph ph-plus', 'Zoom in');
  const fitBtn = mkBtn('ph ph-corners-in', 'Fit');

  leftBar.appendChild(textBtn);
  leftBar.appendChild(shapeBtn);
  leftBar.appendChild(iconBtn);
  leftBar.appendChild(tableBtn);
  leftBar.appendChild(penBtn);
  leftBar.appendChild(imageBtn);
  leftBar.appendChild(bookmarkBtn);
  const leftSpacer = document.createElement('div');
  leftSpacer.style.flex = '1';
  leftBar.appendChild(leftSpacer);
  leftBar.appendChild(panBtn);
  leftBar.appendChild(zoomInBtn);
  leftBar.appendChild(zoomOutBtn);
  leftBar.appendChild(fitBtn);

  return {
    root,
    topBar,
    alignToolbar,
    documentTitle,
    artboardNav,
    artboardPrevBtn,
    artboardNextBtn,
    artboardDownloadBtn,
    topControls,
    fillControl,
    strokeControl,
    strokeWidthInput,
    radiusInput,
    fontFamilyPicker,
    fontSizeInput,
    opacityInput,
    topFill,
    topStroke,
    topStrokeWidth,
    topRadius,
    topFontFamily,
    topFontSize,
    topOpacity,
    canvasEl,
    textBtn,
    iconBtn,
    tableBtn,
    penBtn,
    panBtn,
    imageBtn,
    bookmarkBtn,
    zoomOutBtn,
    zoomInBtn,
    fitBtn,
    shapeBtn,
    board,
    loadingOverlay,
  };
}

export {
  buildShell,
};
