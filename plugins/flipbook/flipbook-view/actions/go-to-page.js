/**
 * Action Bubble : aller à une page (1-indexée).
 * Champ d’action : `page` (number).
 */
export default function(instance, properties, context) {
  if (!instance.data || typeof instance.data.goToPage !== 'function') {
    return Promise.resolve();
  }
  instance.data.goToPage(properties && properties.page);
  return Promise.resolve(true);
}
