import { DEFAULT_TEXT_FONT_FAMILY, FONT_PRESETS } from '../constants.js';
import { normalizeFontFamily } from '../utils.js';


const FALLBACK_UI_FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif";


/** Nom lisible d'une fontFamily CSS (retire les guillemets et garde la 1re famille). */
function cleanFamilyLabel(raw) {
  if (typeof raw !== 'string') return '';
  const first = raw.split(',')[0].trim();
  return first.replace(/^['"]|['"]$/g, '');
}


/**
 * Dropdown de police maison : chaque entrée (et le bouton) est rendue DANS sa
 * propre typo pour un aperçu. Calqué sur createFlatColorPicker (popover en
 * position:fixed sur le body, placement, fermeture clic extérieur / resize).
 *
 * API : { root, setValue(raw, mixed), setDisabled(b), setVisible(b), onSelect(fn), close }
 */
function createFontPicker(options = {}) {
  let current = typeof options.initial === 'string' && options.initial.trim()
    ? options.initial.trim()
    : DEFAULT_TEXT_FONT_FAMILY;
  let disabled = false;
  let mixed = false;
  let onSelectHandler = null;

  const root = document.createElement('div');
  root.style.display = 'inline-flex';
  root.style.alignItems = 'center';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Font family');
  trigger.style.display = 'inline-flex';
  trigger.style.alignItems = 'center';
  trigger.style.justifyContent = 'space-between';
  trigger.style.gap = '6px';
  trigger.style.width = '148px';
  trigger.style.height = '28px';
  trigger.style.border = '1px solid #cbd5e1';
  trigger.style.borderRadius = '8px';
  trigger.style.padding = '0 8px';
  trigger.style.background = '#ffffff';
  trigger.style.color = '#0f172a';
  trigger.style.fontSize = '12px';
  trigger.style.fontWeight = '500';
  trigger.style.cursor = 'pointer';
  trigger.style.outline = 'none';
  trigger.style.boxSizing = 'border-box';

  const triggerLabel = document.createElement('span');
  triggerLabel.style.flex = '1 1 auto';
  triggerLabel.style.minWidth = '0';
  triggerLabel.style.overflow = 'hidden';
  triggerLabel.style.textOverflow = 'ellipsis';
  triggerLabel.style.whiteSpace = 'nowrap';
  triggerLabel.style.textAlign = 'left';
  trigger.appendChild(triggerLabel);

  const caret = document.createElement('i');
  caret.className = 'ph ph-caret-down';
  caret.style.fontSize = '14px';
  caret.style.color = '#64748b';
  caret.style.flex = '0 0 auto';
  trigger.appendChild(caret);

  root.appendChild(trigger);

  const popover = document.createElement('div');
  popover.style.position = 'fixed';
  popover.style.zIndex = '2147483647';
  popover.style.display = 'none';
  popover.style.background = '#ffffff';
  popover.style.border = '1px solid #e2e8f0';
  popover.style.borderRadius = '12px';
  popover.style.padding = '6px';
  popover.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.16)';
  popover.style.width = '200px';
  popover.style.maxHeight = '280px';
  popover.style.overflowY = 'auto';
  popover.style.boxSizing = 'border-box';

  // Item supplémentaire pour une police inconnue (ex. JSON importé). Inséré en
  // tête de liste quand nécessaire, retiré sinon.
  let extraItem = null;

  function makeItem(label, family) {
    const item = document.createElement('button');
    item.type = 'button';
    item.dataset.family = family;
    item.textContent = label;
    item.style.display = 'block';
    item.style.width = '100%';
    item.style.textAlign = 'left';
    item.style.border = 'none';
    item.style.borderRadius = '8px';
    item.style.padding = '8px 10px';
    item.style.background = 'transparent';
    item.style.color = '#0f172a';
    item.style.fontSize = '15px';
    item.style.lineHeight = '1.2';
    item.style.cursor = 'pointer';
    item.style.whiteSpace = 'nowrap';
    item.style.overflow = 'hidden';
    item.style.textOverflow = 'ellipsis';
    item.style.boxSizing = 'border-box';
    item.style.fontFamily = family;
    item.addEventListener('mouseenter', () => {
      if (!isCurrentFamily(family)) item.style.background = '#f1f5f9';
    });
    item.addEventListener('mouseleave', () => {
      applyItemHighlight();
    });
    item.addEventListener('click', () => {
      if (disabled) return;
      select(family);
    });
    return item;
  }

  const presetItems = FONT_PRESETS.map((p) => makeItem(p.label, p.fontFamily));
  presetItems.forEach((it) => popover.appendChild(it));

  function allItems() {
    const arr = [];
    if (extraItem) arr.push(extraItem);
    presetItems.forEach((it) => arr.push(it));
    return arr;
  }

  function isCurrentFamily(family) {
    if (mixed) return false;
    return normalizeFontFamily(family) === normalizeFontFamily(current);
  }

  function applyItemHighlight() {
    allItems().forEach((it) => {
      const match = isCurrentFamily(it.dataset.family);
      it.style.background = match ? '#eef2ff' : 'transparent';
      it.style.fontWeight = match ? '600' : '400';
    });
  }

  function setExtra(family) {
    if (extraItem) {
      popover.removeChild(extraItem);
      extraItem = null;
    }
    if (!family) return;
    extraItem = makeItem(cleanFamilyLabel(family) || 'Autre', family);
    popover.insertBefore(extraItem, popover.firstChild);
  }

  function updateTrigger() {
    if (mixed) {
      triggerLabel.textContent = 'Plusieurs polices';
      triggerLabel.style.fontFamily = FALLBACK_UI_FONT;
      trigger.style.color = '#64748b';
      return;
    }
    trigger.style.color = disabled ? '#94a3b8' : '#0f172a';
    const preset = FONT_PRESETS.find(
      (p) => normalizeFontFamily(p.fontFamily) === normalizeFontFamily(current),
    );
    const label = preset ? preset.label : cleanFamilyLabel(current);
    triggerLabel.textContent = label || cleanFamilyLabel(DEFAULT_TEXT_FONT_FAMILY);
    triggerLabel.style.fontFamily = current;
  }

  function setValue(raw, isMixed) {
    mixed = !!isMixed;
    if (mixed) {
      updateTrigger();
      applyItemHighlight();
      return;
    }
    let next = typeof raw === 'string' && raw.trim() ? raw.trim() : DEFAULT_TEXT_FONT_FAMILY;
    const preset = FONT_PRESETS.find(
      (p) => normalizeFontFamily(p.fontFamily) === normalizeFontFamily(next),
    );
    if (preset) {
      next = preset.fontFamily;
      setExtra(null);
    } else {
      setExtra(next);
    }
    current = next;
    updateTrigger();
    applyItemHighlight();
  }

  function select(family) {
    setValue(family, false);
    if (typeof onSelectHandler === 'function') onSelectHandler(family);
    close();
  }

  function placePopover() {
    const rect = trigger.getBoundingClientRect();
    const width = 200;
    const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left));
    const top = rect.bottom + 8;
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  // Charge les faces web à l'ouverture pour éviter un aperçu en police de repli.
  function preloadFonts() {
    const doc = typeof document !== 'undefined' ? document : null;
    if (!doc || !doc.fonts || typeof doc.fonts.load !== 'function') return;
    FONT_PRESETS.forEach((p) => {
      doc.fonts.load(`16px ${p.fontFamily}`).catch(() => {});
    });
  }

  function open() {
    if (disabled) return;
    preloadFonts();
    applyItemHighlight();
    popover.style.display = 'block';
    placePopover();
  }

  function close() {
    popover.style.display = 'none';
  }

  function setDisabled(next) {
    disabled = !!next;
    trigger.disabled = disabled;
    trigger.style.opacity = disabled ? '0.55' : '1';
    trigger.style.cursor = disabled ? 'default' : 'pointer';
    if (!mixed) trigger.style.color = disabled ? '#94a3b8' : '#0f172a';
    if (disabled) close();
  }

  function setVisible(next) {
    root.style.display = next ? 'inline-flex' : 'none';
    if (!next) close();
  }

  function onSelect(fn) {
    onSelectHandler = typeof fn === 'function' ? fn : null;
  }

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (popover.style.display === 'none') open();
    else close();
  });

  document.addEventListener('click', (event) => {
    if (popover.style.display === 'none') return;
    const t = event.target;
    if (t && (popover.contains(t) || trigger.contains(t))) return;
    close();
  }, true);

  window.addEventListener('resize', () => {
    if (popover.style.display !== 'none') placePopover();
  });

  document.body.appendChild(popover);

  setValue(current, false);

  return {
    root,
    setValue,
    setDisabled,
    setVisible,
    onSelect,
    close,
  };
}

export {
  cleanFamilyLabel,
  createFontPicker,
};
