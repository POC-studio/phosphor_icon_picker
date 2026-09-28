/**
 * Action Bubble : page suivante.
 */
export default function(instance, properties, context) {
  if (!instance.data || typeof instance.data.nextPage !== 'function') {
    return Promise.resolve();
  }
  instance.data.nextPage();
  return Promise.resolve(true);
}
