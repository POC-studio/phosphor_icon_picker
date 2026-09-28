/**
 * Action Bubble : page précédente.
 */
export default function(instance, properties, context) {
  if (!instance.data || typeof instance.data.previousPage !== 'function') {
    return Promise.resolve();
  }
  instance.data.previousPage();
  return Promise.resolve(true);
}
