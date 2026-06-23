async function injectSharedFragment(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return;
    const html = await res.text();

    const container = document.createElement('div');
    container.innerHTML = html;

    Array.from(container.children).forEach((node) => {
      if (node.tagName === 'SCRIPT') {
        const script = document.createElement('script');
        for (const attr of node.attributes) {
          script.setAttribute(attr.name, attr.value);
        }
        script.text = node.textContent || '';
        document.head.appendChild(script);
      } else {
        document.head.appendChild(node);
      }
    });
  } catch (e) {
    console.warn('Impossible de charger le shared:', path, e);
  }
}

const SHARED_FRAGMENTS = [
  './plugins/phosphor-icon-picker/shared.html',
  './plugins/lucide-icon-picker/shared.html',
  './plugins/word-cloud/shared.html',
  './plugins/fabric/shared.html',
  './plugins/imgly/shared.html',
  './plugins/slider-button/shared.html',
];

for (const path of SHARED_FRAGMENTS) {
  injectSharedFragment(path);
}
