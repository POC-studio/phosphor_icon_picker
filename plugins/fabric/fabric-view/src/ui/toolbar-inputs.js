import { applyStyleToSelection, applyTextCommand, finalizeCanvasMutation } from '../commands.js';
import { getToolbarStyleTargets, isFabricGroupObject, isFabricRasterImage, isRoundedPolygonShape, isSelectionContainer, isTextLikeObject } from '../objects.js';
import { applyImageCornerRadiusPx, applyRectCornerRadiusPx, replaceRoundedPolygon } from '../shapes.js';
import { relayoutParentGroups } from '../text.js';
import { updateTopBarForSelection } from './toolbar-sync.js';
import { normalizeCanvasColor, shouldZeroStrokeWidth } from '../utils.js';

/** Inputs de la top bar : fill / stroke / width / opacity / radius / fontSize / fontFamily. */
export function setupToolbarInputs(app) {
  const { instance, fabricCanvas, fabricLib, ui, applyPenBrush } = app;

  ui.fillControl.setHandlers({
    onPresetSelect: (color) => {
      applyStyleToSelection(instance, { fill: normalizeCanvasColor(color, '#111827') });
    },
    onCustomSelect: (hex) => {
      const color = normalizeCanvasColor(hex, '#111827');
      instance.publishState('new_color', color);
      instance.triggerEvent('new_color_selected');
      applyStyleToSelection(instance, { fill: color });
    },
  });
  ui.strokeControl.setHandlers({
    onPresetSelect: (color) => {
      if (instance.data.toolMode === 'draw') {
        instance.data.penColor = normalizeCanvasColor(color, '#111827');
        applyPenBrush();
        updateTopBarForSelection(instance);
        return;
      }
      const target = fabricCanvas.getActiveObject();
      if (!target) return;
      const normalizedStroke = normalizeCanvasColor(color, '#000000');
      const patch = { stroke: normalizedStroke };
      const styleTargets = getToolbarStyleTargets(fabricCanvas);
      const needsTextStrokeDefault = styleTargets.some(
        (t) => isTextLikeObject(t) && Number(t.strokeWidth || 0) <= 0
      );
      if (shouldZeroStrokeWidth(normalizedStroke)) {
        patch.strokeWidth = 0;
        ui.strokeWidthInput.value = '0';
      } else if (needsTextStrokeDefault) {
        patch.strokeWidth = 1;
        ui.strokeWidthInput.value = '1';
      }
      applyStyleToSelection(instance, patch);
    },
    onCustomSelect: (hex) => {
      if (instance.data.toolMode === 'draw') {
        const color = normalizeCanvasColor(hex, '#111827');
        instance.data.penColor = color;
        applyPenBrush();
        instance.publishState('new_color', color);
        instance.triggerEvent('new_color_selected');
        updateTopBarForSelection(instance);
        return;
      }
      const target = fabricCanvas.getActiveObject();
      if (!target) return;
      const color = normalizeCanvasColor(hex, '#000000');
      const patch = { stroke: color };
      const styleTargets = getToolbarStyleTargets(fabricCanvas);
      const needsTextStrokeDefault = styleTargets.some(
        (t) => isTextLikeObject(t) && Number(t.strokeWidth || 0) <= 0
      );
      if (shouldZeroStrokeWidth(color)) {
        patch.strokeWidth = 0;
        ui.strokeWidthInput.value = '0';
      } else if (needsTextStrokeDefault) {
        patch.strokeWidth = 1;
        ui.strokeWidthInput.value = '1';
      }
      instance.publishState('new_color', color);
      instance.triggerEvent('new_color_selected');
      applyStyleToSelection(instance, patch);
    },
  });

  ui.strokeWidthInput.addEventListener('input', () => {
    const strokeWidth = Math.max(0, Math.min(50, Number(ui.strokeWidthInput.value || 0)));
    if (instance.data.toolMode === 'draw') {
      instance.data.penWidth = Math.max(1, strokeWidth);
      applyPenBrush();
      updateTopBarForSelection(instance);
      return;
    }
    applyStyleToSelection(instance, { strokeWidth });
  });
  ui.opacityInput.addEventListener('input', () => {
    const pct = Math.max(0, Math.min(100, Number(ui.opacityInput.value || 0)));
    applyStyleToSelection(instance, { opacity: pct / 100 });
  });
  ui.radiusInput.addEventListener('input', () => {
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    const targets = getToolbarStyleTargets(fabricCanvas);
    if (targets.length === 0) return;
    const radius = Math.max(0, Math.min(200, Number(ui.radiusInput.value || 0)));
    const updated = [];
    targets.forEach((target) => {
      if (isRoundedPolygonShape(target)) {
        const replacement = replaceRoundedPolygon(instance, target, radius, fabricLib);
        if (replacement) {
          replacement.cornerRadiusPx = radius;
          updated.push(replacement);
        }
        return;
      }
      if (isFabricRasterImage(target)) {
        applyImageCornerRadiusPx(target, fabricLib, radius);
        if (typeof target.setCoords === 'function') target.setCoords();
        updated.push(target);
        return;
      }
      if (target.type === 'rect') {
        applyRectCornerRadiusPx(target, radius);
      } else if (Number.isFinite(Number(target.rx))) {
        target.set({ rx: radius, ry: radius });
      } else {
        return;
      }
      if (typeof target.setCoords === 'function') target.setCoords();
      updated.push(target);
    });
    if (updated.length === 0) return;
    updated.forEach((target) => relayoutParentGroups(target));
    if (isSelectionContainer(active) && updated.length > 1) {
      const selection = new fabricLib.ActiveSelection(updated, { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(selection);
    } else if (isFabricGroupObject(active)) {
      if (typeof active.triggerLayout === 'function') active.triggerLayout();
      fabricCanvas.setActiveObject(active);
    } else if (updated.length === 1) {
      fabricCanvas.setActiveObject(updated[0]);
    }
    finalizeCanvasMutation(instance);
  });
  const applyFontSizeFromInput = (commit) => {
    const targets = getToolbarStyleTargets(fabricCanvas).filter((item) => isTextLikeObject(item));
    if (targets.length === 0) return;
    const raw = Number(ui.fontSizeInput.value);
    if (!Number.isFinite(raw) || raw <= 0) return;
    const fontSize = Math.max(1, Math.min(400, raw));
    // En cours de frappe, ignorer les valeurs transitoires (taper "48" passe par 4) ;
    // la valeur finale est toujours appliquée au change/blur.
    if (!commit && fontSize < 8) return;
    applyTextCommand(instance, targets, { fontSize });
  };
  // Les flèches haut/bas dispatchent un event 'input' programmatique (isTrusted=false) :
  // c'est un pas délibéré, on l'applique immédiatement même sous 8.
  ui.fontSizeInput.addEventListener('input', (event) => applyFontSizeFromInput(!(event && event.isTrusted)));
  ui.fontSizeInput.addEventListener('change', () => applyFontSizeFromInput(true));
  ui.fontFamilySelect.addEventListener('change', () => {
    const nextFamily = ui.fontFamilySelect.value;
    if (!nextFamily) return;
    const targets = getToolbarStyleTargets(fabricCanvas).filter((item) => isTextLikeObject(item));
    applyTextCommand(instance, targets, { fontFamily: nextFamily });
  });

  return {  };
}
