function loadScriptNode(node) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    for (const attr of node.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    script.text = node.textContent || '';
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Script failed: ${script.src || 'inline'}`)), { once: true });
    document.head.appendChild(script);
    if (!script.src) resolve();
  });
}

async function injectSharedFragment(path) {
  const res = await fetch(path);
  if (!res.ok) return;
  const html = await res.text();

  const container = document.createElement('div');
  container.innerHTML = html;

  const loads = [];
  for (const node of Array.from(container.children)) {
    if (node.tagName === 'SCRIPT') {
      loads.push(loadScriptNode(node));
    } else {
      document.head.appendChild(node);
    }
  }
  await Promise.all(loads);
}

const SHARED_FRAGMENTS = [
  './plugins/phosphor-icon-picker/shared.html',
  './plugins/lucide-icon-picker/shared.html',
  './plugins/word-cloud/shared.html',
  './plugins/fabric/shared.html',
  './plugins/imgly/shared.html',
  './plugins/slider-button/shared.html',
];

export const sharedScriptsReady = Promise.all(
  SHARED_FRAGMENTS.map((path) => injectSharedFragment(path)),
).catch((err) => {
  console.warn('Certains shared headers n’ont pas pu être chargés:', err);
});
