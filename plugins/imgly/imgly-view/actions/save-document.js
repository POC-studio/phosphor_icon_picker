/**
 * Action Bubble : JSON + previews + PDF (sans téléchargement local).
 */
export default function(instance, properties, context) {
  if (!instance || !instance.data || typeof instance.data.triggerSaveDocument !== 'function') {
    return false;
  }
  if (context) {
    instance.data.bubbleContext = context;
  }
  return instance.data.triggerSaveDocument();
}
