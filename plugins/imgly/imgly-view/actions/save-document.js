export default async function(instance) {
  if (!instance || !instance.data || typeof instance.data.triggerSaveDocument !== 'function') {
    return false;
  }
  return instance.data.triggerSaveDocument();
}
