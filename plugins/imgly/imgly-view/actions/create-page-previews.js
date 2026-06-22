export default async function(instance) {
  if (!instance || !instance.data || typeof instance.data.createPagePreviews !== 'function') {
    return [];
  }
  return instance.data.createPagePreviews();
}
