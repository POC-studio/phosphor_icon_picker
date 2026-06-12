import { DEFAULT_TEXT_FONT_FAMILY, TOOLBAR_VISIBILITY_BY_TYPE } from '../constants.js';
import { getObjectStyle, getToolbarStyleTargets, isFabricGroupObject, isFabricRasterImage, isRoundedPolygonShape, isTextLikeObject } from '../objects.js';
import { getRectCornerRadiusPx } from '../shapes.js';
import { syncFontFamilySelect } from '../text.js';
import { clampArtboardIndex, getSharedValue, normalizeFontFamily, shouldZeroStrokeWidth } from '../utils.js';


function getToolbarVisibilityForTarget(target) {
  if (!target) return TOOLBAR_VISIBILITY_BY_TYPE.default;
  if (target.iconKind) {
    return { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: false, opacity: true };
  }
  if (isRoundedPolygonShape(target)) {
    return { ...TOOLBAR_VISIBILITY_BY_TYPE.default, radius: true };
  }
  const key = String(target.type || 'default');
  return TOOLBAR_VISIBILITY_BY_TYPE[key] || TOOLBAR_VISIBILITY_BY_TYPE.default;
}


function getSharedToolbarVisibility(targets) {
  if (!Array.isArray(targets) || targets.length === 0) return TOOLBAR_VISIBILITY_BY_TYPE.default;
  const initial = { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: true, opacity: true };
  return targets.reduce((acc, target) => {
    const v = getToolbarVisibilityForTarget(target);
    return {
      fill: !!(acc.fill && v.fill),
      stroke: !!(acc.stroke && v.stroke),
      strokeWidth: !!(acc.strokeWidth && v.strokeWidth),
      radius: !!(acc.radius && v.radius),
      fontSize: !!(acc.fontSize && v.fontSize),
      opacity: !!(acc.opacity && v.opacity),
    };
  }, initial);
}


function updateArtboardNavVisibility(instance) {
  const ui = instance && instance.data ? instance.data.ui : null;
  if (!ui || !ui.artboardNav || !ui.artboardPrevBtn || !ui.artboardNextBtn || !ui.artboardDownloadBtn) return;
  const canvas = instance.data.fabricCanvas;
  const hasSelection = !!(canvas && canvas.getActiveObject());
  const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
  const showNav = !hasSelection;
  ui.artboardNav.style.display = showNav ? 'flex' : 'none';
  const prevDisabled = idx <= 0;
  const nextDisabled = idx >= 2;
  ui.artboardPrevBtn.disabled = prevDisabled;
  ui.artboardNextBtn.disabled = nextDisabled;
  ui.artboardPrevBtn.style.opacity = prevDisabled ? '0.45' : '';
  ui.artboardNextBtn.style.opacity = nextDisabled ? '0.45' : '';
  ui.artboardPrevBtn.style.cursor = prevDisabled ? 'not-allowed' : 'pointer';
  ui.artboardNextBtn.style.cursor = nextDisabled ? 'not-allowed' : 'pointer';
}


function updateTopBarForSelection(instance) {
  const ui = instance.data.ui;
  if (!ui) return;
  try {
  if (ui.alignToolbar) {
    ui.alignToolbar.style.display = 'none';
  }
  const rawTitle = typeof instance.data.documentTitle === 'string'
    ? instance.data.documentTitle.trim()
    : '';
  const hasTitle = rawTitle.length > 0;
  const pageNum = clampArtboardIndex(instance.data.activeArtboardIndex) + 1;
  ui.documentTitle.textContent = hasTitle
    ? `${rawTitle} / page ${pageNum}`
    : `page ${pageNum}`;
  ui.documentTitle.style.display = 'block';
  const toolMode = instance.data && instance.data.toolMode ? instance.data.toolMode : 'select';
  const isDrawMode = toolMode === 'draw';
  const isPanMode = toolMode === 'pan';
  const fabricCanvas = instance.data.fabricCanvas;
  const target = fabricCanvas ? fabricCanvas.getActiveObject() : null;
  const targets = getToolbarStyleTargets(fabricCanvas);
  const hasMultiSelection = targets.length > 1 || isFabricGroupObject(target);
  if (isPanMode) {
    ui.topBar.style.visibility = 'visible';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setDisabled(true);
    ui.strokeControl.setDisabled(true);
    ui.strokeWidthInput.disabled = true;
    ui.radiusInput.disabled = true;
    ui.fontSizeInput.disabled = true;
    ui.fontFamilySelect.disabled = true;
    ui.strokeWidthInput.style.opacity = '0.55';
    ui.radiusInput.style.opacity = '0.55';
    ui.fontSizeInput.style.opacity = '0.55';
    ui.fontFamilySelect.style.opacity = '0.55';
    ui.opacityInput.disabled = true;
    ui.opacityInput.style.opacity = '0.55';
    ui.topFill.style.display = 'none';
    ui.topStroke.style.display = 'none';
    ui.topStrokeWidth.style.display = 'none';
    ui.topRadius.style.display = 'none';
    ui.topFontFamily.style.display = 'none';
    ui.topFontSize.style.display = 'none';
    ui.topOpacity.style.display = 'none';
    return;
  }
  if (!target && !isDrawMode) {
    ui.topBar.style.visibility = 'visible';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setDisabled(true);
    ui.strokeControl.setDisabled(true);
    ui.strokeWidthInput.disabled = true;
    ui.radiusInput.disabled = true;
    ui.fontSizeInput.disabled = true;
    ui.fontFamilySelect.disabled = true;
    ui.strokeWidthInput.style.opacity = '0.55';
    ui.radiusInput.style.opacity = '0.55';
    ui.fontSizeInput.style.opacity = '0.55';
    ui.fontFamilySelect.style.opacity = '0.55';
    ui.opacityInput.disabled = true;
    ui.opacityInput.style.opacity = '0.55';
    ui.topFill.style.display = 'none';
    ui.topStroke.style.display = 'none';
    ui.topStrokeWidth.style.display = 'none';
    ui.topRadius.style.display = 'none';
    ui.topFontFamily.style.display = 'none';
    ui.topFontSize.style.display = 'none';
    ui.topOpacity.style.display = 'none';
    return;
  }
  if (!target && isDrawMode) {
    ui.topBar.style.visibility = 'visible';
    ui.documentTitle.style.display = 'none';
    ui.fillControl.setMixed(false);
    ui.strokeControl.setMixed(false);
    ui.fillControl.setVisible(false);
    ui.strokeControl.setVisible(true);
    ui.strokeControl.setDisabled(false);
    ui.strokeControl.setColor(instance.data.penColor || '#111827');
    ui.topStrokeWidth.style.display = 'inline-flex';
    ui.strokeWidthInput.disabled = false;
    ui.strokeWidthInput.style.opacity = '1';
    ui.strokeWidthInput.value = String(Math.max(1, Math.round(instance.data.penWidth || 3)));
    ui.topRadius.style.display = 'none';
    ui.topFontFamily.style.display = 'none';
    ui.topFontSize.style.display = 'none';
    ui.topOpacity.style.display = 'none';
    return;
  }
  ui.topBar.style.visibility = 'visible';
  ui.documentTitle.style.display = 'none';
  if (ui.alignToolbar) {
    const canAlign = target && !target.isArtboard && !target.isSafeZone;
    ui.alignToolbar.style.display = canAlign ? 'flex' : 'none';
  }
  const visibility = hasMultiSelection ? getSharedToolbarVisibility(targets) : getToolbarVisibilityForTarget(target);
  ui.fillControl.setVisible(visibility.fill);
  ui.strokeControl.setVisible(visibility.stroke);
  ui.topStrokeWidth.style.display = visibility.strokeWidth ? 'inline-flex' : 'none';
  ui.topRadius.style.display = visibility.radius ? 'inline-flex' : 'none';
  ui.topFontFamily.style.display = visibility.fontSize ? 'inline-flex' : 'none';
  ui.topFontSize.style.display = visibility.fontSize ? 'inline-flex' : 'none';
  ui.topOpacity.style.display = visibility.opacity ? 'inline-flex' : 'none';

  const style = getObjectStyle(target || targets[0]);
  ui.fillControl.setDisabled(false);
  ui.strokeControl.setDisabled(false);
  ui.strokeWidthInput.disabled = false;
  ui.opacityInput.disabled = false;
  ui.fontSizeInput.disabled = !visibility.fontSize;
  ui.fontFamilySelect.disabled = !visibility.fontSize;
  ui.strokeWidthInput.style.opacity = '1';
  ui.fontSizeInput.style.opacity = visibility.fontSize ? '1' : '0.55';
  ui.fontFamilySelect.style.opacity = visibility.fontSize ? '1' : '0.55';
  ui.strokeWidthInput.style.background = '#ffffff';
  ui.strokeWidthInput.style.color = '#0f172a';
  ui.strokeWidthInput.style.borderColor = '#cbd5e1';
  ui.strokeWidthInput.placeholder = '';
  ui.fontSizeInput.style.background = '#ffffff';
  ui.fontSizeInput.style.color = '#0f172a';
  ui.fontSizeInput.style.borderColor = '#cbd5e1';
  ui.fontSizeInput.placeholder = '';
  ui.fontFamilySelect.style.background = '#ffffff';
  ui.fontFamilySelect.style.color = '#0f172a';
  ui.fontFamilySelect.style.borderColor = '#cbd5e1';
  ui.radiusInput.style.background = '#ffffff';
  ui.radiusInput.style.color = '#0f172a';
  ui.radiusInput.style.borderColor = '#cbd5e1';
  ui.radiusInput.placeholder = '';
  ui.opacityInput.style.background = '#ffffff';
  ui.opacityInput.style.color = '#0f172a';
  ui.opacityInput.style.borderColor = '#cbd5e1';
  ui.opacityInput.placeholder = '';
  ui.fillControl.setMixed(false);
  ui.strokeControl.setMixed(false);

  if (!hasMultiSelection) {
    ui.fillControl.setColor(style.fill);
    ui.strokeControl.setColor(style.stroke);
    ui.strokeWidthInput.value = String(style.strokeWidth);
    if (visibility.fontSize) {
      const size = Number.isFinite(Number(target.fontSize)) ? Math.round(Number(target.fontSize)) : 16;
      ui.fontSizeInput.value = String(Math.max(1, Math.min(400, size)));
      const rawFf = typeof target.fontFamily === 'string' ? target.fontFamily : DEFAULT_TEXT_FONT_FAMILY;
      syncFontFamilySelect(ui, rawFf, false);
    }
    const supportsRadius = visibility.radius
      && (Number.isFinite(Number(target.rx)) || target.type === 'rect' || isRoundedPolygonShape(target) || isFabricRasterImage(target));
    ui.radiusInput.disabled = !supportsRadius;
    const polygonRadius = Number.isFinite(Number(target.cornerRadius)) ? Number(target.cornerRadius) : 0;
    ui.radiusInput.value = supportsRadius
      ? String(isRoundedPolygonShape(target) ? polygonRadius : style.radius)
      : '0';
    ui.radiusInput.style.opacity = supportsRadius ? '1' : '0.55';
    ui.opacityInput.disabled = !visibility.opacity;
    if (visibility.opacity) {
      ui.opacityInput.value = String(Math.round(style.opacity * 100));
      ui.opacityInput.style.opacity = '1';
      ui.opacityInput.style.background = '#ffffff';
      ui.opacityInput.style.color = '#0f172a';
      ui.opacityInput.style.borderColor = '#cbd5e1';
      ui.opacityInput.placeholder = '';
    } else {
      ui.opacityInput.value = '100';
      ui.opacityInput.style.opacity = '0.55';
    }
    return;
  }

  const styleList = targets.map((item) => getObjectStyle(item));
  const fillShared = getSharedValue(styleList, (item) => item.fill);
  const strokeShared = getSharedValue(styleList, (item) => item.stroke);
  const strokeWidthShared = getSharedValue(styleList, (item) => item.strokeWidth);
  const fontSizeShared = getSharedValue(targets, (item) => {
    const size = Number.isFinite(Number(item.fontSize)) ? Math.round(Number(item.fontSize)) : 16;
    return Math.max(1, Math.min(400, size));
  });
  const textTargets = targets.filter((item) => isTextLikeObject(item));
  const fontFamilyShared = getSharedValue(textTargets, (item) => normalizeFontFamily(item.fontFamily));
  const radiusShared = getSharedValue(targets, (item) => {
    if (isRoundedPolygonShape(item)) return Number.isFinite(Number(item.cornerRadius)) ? Number(item.cornerRadius) : 0;
    if (item.type === 'rect') return getRectCornerRadiusPx(item);
    if (isFabricRasterImage(item)) {
      return Number.isFinite(Number(item.cornerRadiusPx)) ? Math.max(0, Number(item.cornerRadiusPx)) : 0;
    }
    if (Number.isFinite(Number(item.rx))) {
      return Number(item.rx);
    }
    return null;
  });
  const opacityShared = getSharedValue(styleList, (item) => item.opacity);

  ui.fillControl.setColor(fillShared.mixed ? 'transparent' : fillShared.value);
  ui.fillControl.setMixed(fillShared.mixed);
  ui.strokeControl.setColor(strokeShared.mixed ? 'transparent' : strokeShared.value);
  ui.strokeControl.setMixed(strokeShared.mixed);

  if (strokeWidthShared.mixed) {
    ui.strokeWidthInput.value = '';
    ui.strokeWidthInput.placeholder = 'mix';
    ui.strokeWidthInput.style.background = '#f1f5f9';
    ui.strokeWidthInput.style.color = '#64748b';
    ui.strokeWidthInput.style.borderColor = '#cbd5e1';
  } else {
    ui.strokeWidthInput.value = String(strokeWidthShared.value);
  }

  if (visibility.fontSize) {
    ui.fontSizeInput.disabled = false;
    ui.fontFamilySelect.disabled = false;
    if (fontSizeShared.mixed) {
      ui.fontSizeInput.value = '';
      ui.fontSizeInput.placeholder = 'mix';
      ui.fontSizeInput.style.background = '#f1f5f9';
      ui.fontSizeInput.style.color = '#64748b';
      ui.fontSizeInput.style.borderColor = '#cbd5e1';
    } else {
      ui.fontSizeInput.value = String(fontSizeShared.value);
    }
    if (fontFamilyShared.mixed) {
      syncFontFamilySelect(ui, '', true);
    } else if (textTargets.length > 0) {
      const rawFf = typeof textTargets[0].fontFamily === 'string'
        ? textTargets[0].fontFamily
        : DEFAULT_TEXT_FONT_FAMILY;
      syncFontFamilySelect(ui, rawFf, false);
    }
  }

  if (visibility.opacity) {
    ui.opacityInput.disabled = false;
    ui.opacityInput.style.opacity = '1';
    if (opacityShared.mixed) {
      ui.opacityInput.value = '';
      ui.opacityInput.placeholder = 'mix';
      ui.opacityInput.style.background = '#f1f5f9';
      ui.opacityInput.style.color = '#64748b';
      ui.opacityInput.style.borderColor = '#cbd5e1';
    } else {
      ui.opacityInput.value = String(Math.max(0, Math.min(100, Math.round(Number(opacityShared.value) * 100))));
      ui.opacityInput.style.background = '#ffffff';
      ui.opacityInput.style.color = '#0f172a';
      ui.opacityInput.style.borderColor = '#cbd5e1';
      ui.opacityInput.placeholder = '';
    }
  } else {
    ui.opacityInput.disabled = true;
    ui.opacityInput.value = '100';
    ui.opacityInput.style.opacity = '0.55';
  }

  if (visibility.radius) {
    ui.radiusInput.disabled = false;
    ui.radiusInput.style.opacity = '1';
    if (radiusShared.mixed) {
      ui.radiusInput.value = '';
      ui.radiusInput.placeholder = 'mix';
      ui.radiusInput.style.background = '#f1f5f9';
      ui.radiusInput.style.color = '#64748b';
      ui.radiusInput.style.borderColor = '#cbd5e1';
    } else {
      ui.radiusInput.value = String(Math.max(0, Math.min(200, Number(radiusShared.value) || 0)));
    }
  } else {
    ui.radiusInput.disabled = true;
    ui.radiusInput.value = '0';
    ui.radiusInput.style.opacity = '0.55';
  }
  } finally {
    updateArtboardNavVisibility(instance);
  }
}


// applyStyleToSelection a migré dans commands.js (command layer unique).

export {
  getToolbarVisibilityForTarget,
  getSharedToolbarVisibility,
  updateArtboardNavVisibility,
  updateTopBarForSelection,
};
