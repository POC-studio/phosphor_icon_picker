import { FONT_PRESETS } from './constants.js';
import { isTextLikeObject } from './objects.js';
import { normalizeFontFamily } from './utils.js';


/** Après changement de fontFamily : attend la face web puis remesure + redraw (évite le rendu en fallback générique). */
function loadWebFontsThenRedraw(fabricCanvas, targets) {
  if (!fabricCanvas || !Array.isArray(targets) || targets.length === 0) return;
  const doc = typeof document !== 'undefined' ? document : null;
  if (!doc || !doc.fonts || typeof doc.fonts.load !== 'function') {
    fabricCanvas.requestRenderAll();
    return;
  }
  const loads = targets.map((target) => {
    const size = Number.isFinite(Number(target.fontSize)) ? Math.max(1, Math.min(400, Number(target.fontSize))) : 16;
    const ff = typeof target.fontFamily === 'string' ? target.fontFamily.trim() : '';
    if (!ff) return Promise.resolve();
    return doc.fonts.load(`${size}px ${ff}`).catch(() => {});
  });
  Promise.all(loads).finally(() => {
    targets.forEach((t) => {
      if (typeof t.initDimensions === 'function') t.initDimensions();
      if (typeof t.setCoords === 'function') t.setCoords();
      relayoutParentGroups(t);
    });
    fabricCanvas.requestRenderAll();
  });
}


/**
 * Remonte la chaîne des Groups parents et les re-layoute. Sans ça, le cache du
 * Group garde ses bounds périmés et clippe un enfant texte qui a grandi.
 */
function relayoutParentGroups(target) {
  let parent = target ? (target.group || target.parent) : null;
  while (parent) {
    if (typeof parent.triggerLayout === 'function') parent.triggerLayout();
    if (typeof parent.setCoords === 'function') parent.setCoords();
    parent = parent.group || parent.parent;
  }
}


// applyTextMutation a migré dans commands.js (applyTextCommand, command layer unique).


function syncFontFamilySelect(ui, rawFontFamily, mixed) {
  const sel = ui.fontFamilySelect;
  if (!sel) return;
  while (sel.options.length > FONT_PRESETS.length) {
    sel.remove(sel.options.length - 1);
  }
  if (mixed) {
    sel.selectedIndex = -1;
    sel.style.background = '#f1f5f9';
    sel.style.color = '#64748b';
    sel.style.borderColor = '#cbd5e1';
    return;
  }
  sel.style.background = '#ffffff';
  sel.style.color = '#0f172a';
  sel.style.borderColor = '#cbd5e1';
  const n = normalizeFontFamily(rawFontFamily);
  let matched = false;
  for (let i = 0; i < FONT_PRESETS.length; i += 1) {
    if (normalizeFontFamily(FONT_PRESETS[i].fontFamily) === n) {
      sel.value = FONT_PRESETS[i].fontFamily;
      matched = true;
      break;
    }
  }
  if (!matched && rawFontFamily && typeof rawFontFamily === 'string' && rawFontFamily.trim()) {
    const opt = document.createElement('option');
    opt.value = rawFontFamily;
    opt.textContent = 'Autre';
    sel.appendChild(opt);
    sel.value = rawFontFamily;
  } else if (!matched) {
    sel.value = FONT_PRESETS[0].fontFamily;
  }
}


/**
 * Restreint les poignées de redimensionnement d'un objet texte : on retire les
 * poignées milieu verticales (mt/mb) qui déforment les glyphes, et on bloque le
 * skew. Restent les poignées latérales (largeur de wrap) et les coins (scale uniforme).
 */
function applyTextboxEditingControls(target) {
  if (!isTextLikeObject(target)) return;
  if (typeof target.setControlsVisibility === 'function') {
    target.setControlsVisibility({
      mt: false,
      mb: false,
      ml: true,
      mr: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
      mtr: true,
    });
  }
  if (typeof target.set === 'function') {
    target.set({ lockSkewingX: true, lockSkewingY: true });
  }
}

export {
  loadWebFontsThenRedraw,
  relayoutParentGroups,
  syncFontFamilySelect,
  applyTextboxEditingControls,
};
