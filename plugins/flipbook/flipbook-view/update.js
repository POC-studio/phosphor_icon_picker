export default function(instance, properties, context) {
  if (!instance.data || typeof instance.data.applyProperties !== 'function') {
    return;
  }
  instance.data.applyProperties(properties, context);
}
