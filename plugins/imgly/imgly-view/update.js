export default function(instance, properties, context) {
  if (!properties) return;

  instance.data._pendingProperties = properties;
  if (context) {
    instance.data.bubbleContext = context;
  }

  // Charger la liste d’images en premier (Bubble lazy-load — peut throw 'not ready').
  if (typeof instance.data.applyTeamImagesFromProperties === 'function') {
    var rawImages = properties.images != null && properties.images !== ''
      ? properties.images
      : (properties.images_json != null && properties.images_json !== '' ? properties.images_json : null);
    instance.data.applyTeamImagesFromProperties(rawImages);
  }

  if (!instance.data.cesdkReady) return;

  if (typeof instance.data.applyPropertiesUpdate === 'function') {
    instance.data.applyPropertiesUpdate(properties, context);
  }
}
