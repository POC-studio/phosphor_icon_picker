/**
 * Element action: export the word cloud canvas as PNG and send the image to Bubble.
 * Returns the URL of the uploaded image (Bubble uses this as "Result of step").
 * @param {object} instance - Bubble element instance (instance.data.canvas = the canvas)
 * @param {object} properties - Element properties
 * @param {object} context - Bubble context (context.uploadContent(fileName, base64, callback))
 * @returns {Promise<string>} Resolves with the image URL returned by Bubble.
 */
export default function(instance, properties, context) {
  return new Promise((resolve, reject) => {
    const canvas = instance.data && instance.data.canvas;
    if (!canvas || typeof canvas.toDataURL !== 'function') {
      reject(new Error('Word cloud canvas not available'));
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const fileName = 'wordcloud.png';

    if (context && typeof context.uploadContent === 'function') {
      context.uploadContent(fileName, base64, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    } else {
      // Fallback when no context (e.g. sandbox): resolve with data URL so Bubble can use it
      resolve(dataUrl);
    }
  });
}
