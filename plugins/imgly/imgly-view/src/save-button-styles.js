const STYLE_ID = 'imgly-save-button-styles';

const COLORS = {
  activeBg: '#111827',
  activeFg: '#ffffff',
  activeHoverBg: '#1f2937',
  disabledBg: '#e5e7eb',
  disabledFg: '#9ca3af',
};

/**
 * @param {Node} node
 * @param {ParentNode[]} [out]
 * @returns {ParentNode[]}
 */
function collectSearchRoots(node, out = []) {
  if (!node) return out;
  if (node.nodeType === 1) {
    const el = /** @type {Element} */ (node);
    out.push(/** @type {ParentNode} */ (el));
    if (el.shadowRoot) collectSearchRoots(el.shadowRoot, out);
  }
  node.childNodes?.forEach((child) => collectSearchRoots(child, out));
  return out;
}

/**
 * @param {ParentNode} root
 * @returns {Element|null}
 */
function findSaveButtonGroup(root) {
  const roots = collectSearchRoots(root);
  for (const searchRoot of roots) {
    if (!('querySelectorAll' in searchRoot)) continue;
    const groups = searchRoot.querySelectorAll('[class*="ButtonGroup"]');
    for (const group of groups) {
      const buttons = group.querySelectorAll('button');
      for (const btn of buttons) {
        if ((btn.textContent || '').includes('Enregistrer')) {
          return group;
        }
      }
    }
  }
  return null;
}

/**
 * @param {HTMLButtonElement} btn
 * @param {'active' | 'disabled'} mode
 */
function paintButton(btn, mode) {
  if (!btn?.style) return;
  const bg = mode === 'disabled' ? COLORS.disabledBg : COLORS.activeBg;
  const fg = mode === 'disabled' ? COLORS.disabledFg : COLORS.activeFg;
  btn.style.setProperty('background-color', bg, 'important');
  btn.style.setProperty('background', bg, 'important');
  btn.style.setProperty('color', fg, 'important');
  btn.style.setProperty('border-color', bg, 'important');
  btn.style.setProperty('--ubq-interactive-accent-default', bg, 'important');
  btn.style.setProperty('--ubq-interactive-accent-hover', COLORS.activeHoverBg, 'important');
  btn.style.setProperty('--ubq-foreground-accent', fg, 'important');
}

/**
 * @param {ParentNode} root
 * @param {{ saveDisabled?: boolean }} [options]
 * @returns {boolean}
 */
export function paintSaveButtonGroup(root, options = {}) {
  if (typeof document === 'undefined' || !root) return false;
  const saveDisabled = options.saveDisabled === true;
  const group = findSaveButtonGroup(root);
  if (!group) return false;

  group.classList.add('imgly-save-button-group');
  const buttons = group.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const isSaveMain = index === 0 || (btn.textContent || '').includes('Enregistrer');
    if (isSaveMain) {
      paintButton(btn, saveDisabled || btn.disabled ? 'disabled' : 'active');
      return;
    }
    paintButton(btn, btn.disabled ? 'disabled' : 'active');
  });
  return true;
}

function injectGlobalFallbackStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .imgly-save-button-group button:not(:disabled) {
      background: ${COLORS.activeBg} !important;
      color: ${COLORS.activeFg} !important;
    }
    .imgly-save-button-group button:disabled {
      background: ${COLORS.disabledBg} !important;
      color: ${COLORS.disabledFg} !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * @param {ParentNode} root
 * @param {{ saveDisabled?: boolean }} [options]
 */
export function scheduleSaveButtonPaint(root, options = {}) {
  const run = () => paintSaveButtonGroup(root, options);
  run();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(run);
    requestAnimationFrame(() => requestAnimationFrame(run));
  }
}

/**
 * @param {object} instance
 */
export function ensureSaveButtonStyleWatcher(instance) {
  if (!instance?.data || instance.data._saveButtonStyleWatcherStarted) return;
  instance.data._saveButtonStyleWatcherStarted = true;
  injectGlobalFallbackStyles();

  const getHost = () => {
    if (!instance?.canvas) return null;
    if (typeof instance.canvas[0] !== 'undefined') return instance.canvas[0];
    return instance.canvas;
  };

  const paint = () => {
    const host = getHost();
    if (!host) return;
    scheduleSaveButtonPaint(host, {
      saveDisabled: instance.data.hasUnsavedChanges !== true,
    });
  };

  instance.data.repaintSaveButton = paint;
  paint();

  if (typeof window === 'undefined') return;
  let ticks = 0;
  const intervalId = window.setInterval(() => {
    paint();
    ticks += 1;
    if (ticks >= 30) window.clearInterval(intervalId);
  }, 200);
}

export function ensureSaveButtonStyles() {
  injectGlobalFallbackStyles();
}
