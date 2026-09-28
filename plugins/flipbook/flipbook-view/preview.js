const DEMO_PAGES = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1131&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1131&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=1131&fit=crop&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1131&fit=crop&q=80',
];

/**
 * @param {unknown} raw
 * @returns {string[]}
 */
function previewUrls(raw) {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return DEMO_PAGES.slice();
    if (trimmed.charAt(0) === '[') {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const urls = parsed.map((item) => String(item || '').trim()).filter(Boolean);
          return urls.length ? urls.slice(0, 4) : DEMO_PAGES.slice();
        }
      } catch {
        /* ignore */
      }
    }
    if (/^https?:\/\//i.test(trimmed)) return [trimmed];
  }
  if (Array.isArray(raw)) {
    const urls = raw.map((item) => String(item || '').trim()).filter(Boolean);
    if (urls.length) return urls.slice(0, 4);
  }
  return DEMO_PAGES.slice();
}

export default function(instance, properties) {
  const urls = previewUrls(properties && properties.pages);

  const root = document.createElement('div');
  root.style.cssText = [
    'width:100%',
    'height:100%',
    'box-sizing:border-box',
    'background:transparent',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'overflow:hidden',
    'position:relative',
  ].join(';');

  const stage = document.createElement('div');
  stage.style.cssText = [
    'position:relative',
    'width:100%',
    'height:63%',
    'perspective:1100px',
    'transform-style:preserve-3d',
  ].join(';');

  const book = document.createElement('div');
  book.style.cssText = [
    'position:absolute',
    'inset:0',
    'transform:rotateX(8deg) rotateY(-8deg)',
    'transform-style:preserve-3d',
  ].join(';');

  const cover = document.createElement('div');
  cover.style.cssText = [
    'position:absolute',
    'right:0',
    'top:0',
    'height:100%',
    'width:48%',
    'min-width:38%',
    'max-width:56%',
    'background:#f4efe6',
    'background-size:cover',
    'background-position:center',
    'box-shadow:12px 18px 40px rgba(0,0,0,0.45), inset 8px 0 18px rgba(0,0,0,0.18)',
    'border-radius:2px 6px 6px 2px',
  ].join(';');
  if (urls[0]) cover.style.backgroundImage = `url("${urls[0]}")`;

  const spine = document.createElement('div');
  spine.style.cssText = [
    'position:absolute',
    'right:100%',
    'top:0',
    'height:100%',
    'width:10px',
    'margin-right:-1px',
    'background:linear-gradient(90deg,#3f2f22,#6b4f3a 40%,#2a1d14)',
    'box-shadow:inset 0 0 6px rgba(0,0,0,0.45)',
  ].join(';');

  const stack = document.createElement('div');
  stack.style.cssText = [
    'position:absolute',
    'right:4%',
    'top:3%',
    'height:94%',
    'width:18%',
    'background:repeating-linear-gradient(90deg,#efe7d8 0 2px,#d9d0c0 2px 3px)',
    'opacity:0.9',
    'transform:translateZ(-18px)',
    'border-radius:0 4px 4px 0',
  ].join(';');

  cover.appendChild(spine);
  book.appendChild(stack);
  book.appendChild(cover);
  stage.appendChild(book);

  const caption = document.createElement('div');
  caption.textContent = 'Flipbook 3D';
  caption.style.cssText = [
    'position:absolute',
    'left:14px',
    'bottom:12px',
    'color:rgba(55,48,40,0.55)',
    'font:600 11px/1.2 ui-sans-serif,system-ui,sans-serif',
    'letter-spacing:0.08em',
    'text-transform:uppercase',
  ].join(';');

  root.appendChild(stage);
  root.appendChild(caption);
  instance.canvas.append(root);
}
