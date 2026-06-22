export default function(instance, properties) {
  var host = instance && instance.canvas;
  if (host && typeof host.empty === 'function') {
    host.empty();
  } else if (host && host[0]) {
    host[0].innerHTML = '';
  }

  var root = document.createElement('div');
  root.style.cssText = 'box-sizing:border-box;width:100%;height:100%;min-height:120px;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;color:#475569;text-align:center;';
  root.innerHTML = '<div><strong>IMG.LY CE.SDK</strong><br><span style="font-size:13px;margin-top:8px;display:inline-block;">Mode éditeur Bubble — lancez le plugin en mode <em>Run</em> pour ouvrir l’éditeur.</span></div>';

  if (host && typeof host.append === 'function') {
    host.append(root);
  } else if (host && host[0]) {
    host[0].appendChild(root);
  }
}
