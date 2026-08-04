/**
 * Overlay bloquant pendant l'enregistrement — empêche toute édition
 * (souris + clavier) tant que triggerSaveDocument n'est pas terminé.
 */

const STYLE_ID = 'imgly-save-overlay-styles';
const OVERLAY_CLASS = 'imgly-save-overlay';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${OVERLAY_CLASS} {
      position: absolute;
      inset: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      pointer-events: all;
      cursor: wait;
      opacity: 0;
      transition: opacity 150ms ease;
    }
    .${OVERLAY_CLASS}.is-visible {
      opacity: 1;
    }
    .${OVERLAY_CLASS} .imgly-save-overlay-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(17, 24, 39, 0.15);
      border-top-color: #111827;
      border-radius: 50%;
      animation: imgly-save-overlay-spin 0.8s linear infinite;
    }
    .${OVERLAY_CLASS} .imgly-save-overlay-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #111827;
    }
    @keyframes imgly-save-overlay-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * @param {object} instance
 * @returns {HTMLElement|null}
 */
function getEditorHost(instance) {
  if (!instance?.canvas) return null;
  if (typeof instance.canvas[0] !== 'undefined') return instance.canvas[0];
  return instance.canvas;
}

/** Bloque les raccourcis clavier (Suppr, ⌘Z…) qui passeraient à travers l'overlay. */
function blockKeydown(event) {
  event.stopPropagation();
  event.preventDefault();
}

/**
 * Affiche l'overlay bloquant sur l'éditeur. Idempotent.
 * @param {object} instance
 */
export function showSaveOverlay(instance) {
  if (typeof document === 'undefined') return;
  if (!instance?.data) return;
  if (instance.data._saveOverlayEl) return;

  const host = getEditorHost(instance);
  if (!host || typeof host.appendChild !== 'function') return;

  injectStyles();

  if (typeof getComputedStyle === 'function' && getComputedStyle(host).position === 'static') {
    host.style.position = 'relative';
  }

  const overlay = document.createElement('div');
  overlay.className = OVERLAY_CLASS;

  const spinner = document.createElement('div');
  spinner.className = 'imgly-save-overlay-spinner';
  overlay.appendChild(spinner);

  const label = document.createElement('div');
  label.className = 'imgly-save-overlay-label';
  label.textContent = 'Enregistrement…';
  overlay.appendChild(label);

  host.appendChild(overlay);
  // Force un reflow pour que la transition d'opacité se joue.
  void overlay.offsetHeight;
  overlay.classList.add('is-visible');

  window.addEventListener('keydown', blockKeydown, true);
  instance.data._saveOverlayEl = overlay;
}

/**
 * Retire l'overlay. Idempotent.
 * @param {object} instance
 */
export function hideSaveOverlay(instance) {
  if (!instance?.data) return;
  const overlay = instance.data._saveOverlayEl;
  instance.data._saveOverlayEl = null;

  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', blockKeydown, true);
  }

  if (overlay && overlay.parentNode) {
    overlay.classList.remove('is-visible');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 160);
  }
}
