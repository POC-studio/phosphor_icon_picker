export default function(instance, properties, context) {
  if (!properties) return;

  instance.data._pendingProperties = properties;
  if (instance.data.bubbleContext == null && context) {
    instance.data.bubbleContext = context;
  }

  if (!instance.data.cesdkReady) return;

  if (typeof instance.data.applyPropertiesUpdate === 'function') {
    instance.data.applyPropertiesUpdate(properties, context);
  }
}
