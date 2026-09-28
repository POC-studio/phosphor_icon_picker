const STYLE_ID = 'flipbook-loader-styles';
const HIDE_MS = 240;

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .flipbook-loader {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      background: transparent;
      transform: translateZ(0);
      opacity: 0;
      pointer-events: none;
      transition: opacity ${HIDE_MS}ms ease;
    }
    .flipbook-loader.is-visible {
      opacity: 1;
      pointer-events: auto;
      cursor: wait;
    }
    .flipbook-loader-book {
      width: 108px;
      height: 78px;
      perspective: 560px;
    }
    .flipbook-loader-spread {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transform: rotateX(16deg);
    }
    .flipbook-loader-leaf {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(180deg, #fffdf8 0%, #f2e6d0 100%);
      border: 1px solid rgba(74, 52, 32, 0.28);
      box-shadow: 0 12px 22px rgba(42, 28, 14, 0.18);
    }
    .flipbook-loader-leaf.is-left {
      left: 0;
      border-radius: 2px 0 0 2px;
      box-shadow: inset -6px 0 10px rgba(90, 68, 44, 0.08);
    }
    .flipbook-loader-leaf.is-right {
      right: 0;
      border-radius: 0 2px 2px 0;
    }
    .flipbook-loader-flip {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      transform-origin: left center;
      transform-style: preserve-3d;
      animation: flipbook-loader-flip 1.2s cubic-bezier(0.42, 0.02, 0.52, 0.98) infinite;
    }
    .flipbook-loader-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 1px solid rgba(74, 52, 32, 0.28);
      border-radius: 0 2px 2px 0;
    }
    .flipbook-loader-face.is-front {
      background:
        linear-gradient(90deg, rgba(90, 68, 44, 0.08), transparent 10%),
        linear-gradient(180deg, #fffdf8 0%, #f3e8d6 100%);
    }
    .flipbook-loader-face.is-back {
      transform: rotateY(180deg);
      background:
        linear-gradient(270deg, rgba(90, 68, 44, 0.08), transparent 10%),
        linear-gradient(180deg, #f6ecdc 0%, #e7d7c0 100%);
    }
    .flipbook-loader-label {
      font-family: 'Iowan Old Style', Palatino, 'Palatino Linotype', 'Times New Roman', serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4a3728;
    }
    @keyframes flipbook-loader-flip {
      0% { transform: rotateY(0deg); }
      42% { transform: rotateY(-180deg); }
      58% { transform: rotateY(-180deg); }
      100% { transform: rotateY(0deg); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Overlay de chargement posé sur le conteneur de la scène.
 * @param {HTMLElement} container
 * @returns {{ show: () => void, hide: () => void, dispose: () => void }}
 */
export function createLoader(container) {
  injectStyles();

  const overlay = document.createElement('div');
  overlay.className = 'flipbook-loader';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML =
    '<div class="flipbook-loader-book" aria-hidden="true">' +
      '<div class="flipbook-loader-spread">' +
        '<div class="flipbook-loader-leaf is-left"></div>' +
        '<div class="flipbook-loader-leaf is-right"></div>' +
        '<div class="flipbook-loader-flip">' +
          '<div class="flipbook-loader-face is-front"></div>' +
          '<div class="flipbook-loader-face is-back"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="flipbook-loader-label">Chargement des pages…</div>';

  container.appendChild(overlay);

  function show() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-busy', 'true');
    void overlay.offsetHeight;
    overlay.classList.add('is-visible');
  }

  function hide() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-busy', 'false');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function dispose() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  return { show, hide, dispose };
}
