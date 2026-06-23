/**
 * Action Bubble : export PDF imposé (avec téléchargement local).
 */
export default function(instance, properties, context) {
  if (!instance || !instance.data || typeof instance.data.triggerPdfExport !== 'function') {
    return '';
  }
  if (context) {
    instance.data.bubbleContext = context;
  }
  return instance.data.triggerPdfExport();
}
