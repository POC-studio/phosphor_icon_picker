/**
 * Action Bubble : export PDF imposé (avec téléchargement local).
 */
export default function(instance, properties, context) {
  if (!instance || !instance.data || typeof instance.data.triggerPdfExport !== 'function') {
    return '';
  }
  return instance.data.triggerPdfExport();
}
