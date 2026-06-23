/**
 * Action Bubble : génère et publie les previews PNG (page_previews).
 */
export default function(instance, properties, context) {
  if (!instance || !instance.data || typeof instance.data.createPagePreviews !== 'function') {
    return [];
  }
  return instance.data.createPagePreviews();
}
