/**
 * Action Bubble propre : délègue tout le reset à initialize.js via instance.data.
 */
export default function (instance, properties, context) {
  if (!instance.data || typeof instance.data.resetToInitial !== 'function') {
    return Promise.resolve();
  }
  instance.data.resetToInitial();
  return Promise.resolve(true);
}
