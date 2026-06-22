export default async function(instance) {
  if (!instance || !instance.data || typeof instance.data.triggerPdfExport !== 'function') {
    return '';
  }
  return instance.data.triggerPdfExport();
}
