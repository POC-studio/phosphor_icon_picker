/**
 * Action Bubble : JSON + previews + PDF (sans téléchargement local).
 * Coller dans l’onglet Actions de l’élément (pas après preview.js).
 */
export default function(instance, properties, context) {
  if (!instance || !instance.data || typeof instance.data.triggerSaveDocument !== 'function') {
    return false;
  }
  return instance.data.triggerSaveDocument();
}
