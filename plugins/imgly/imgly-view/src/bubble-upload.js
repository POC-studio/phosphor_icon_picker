/**
 * Upload vers Bubble (context.uploadContent) + normalisation des URLs renvoyées.
 */

export function normalizeBubbleUploadUrl(err, url) {
  if (err) return '';
  if (typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed) return '';
  if (/^\/\//.test(trimmed)) trimmed = `https:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed) || /^blob:/i.test(trimmed)) return trimmed;
  // Bubble peut renvoyer une URL sans schéma explicite — on la garde si non vide.
  return trimmed;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string' || dataUrl.indexOf(',') < 0) {
        reject(new Error('Invalid data URL from blob'));
        return;
      }
      resolve(dataUrl.split(',')[1]);
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

function fileToBase64(file) {
  return blobToBase64(file);
}

function uploadBase64(context, fileName, base64) {
  if (!context || typeof context.uploadContent !== 'function' || !base64) {
    return Promise.resolve('');
  }
  return new Promise((resolve) => {
    try {
      context.uploadContent(fileName, base64, (err, url) => {
        resolve(normalizeBubbleUploadUrl(err, url));
      });
    } catch (e) {
      console.error('IMG.LY View: uploadContent failed', e);
      resolve('');
    }
  });
}

export function uploadBlob(context, fileName, blob) {
  if (!blob) return Promise.resolve('');
  return blobToBase64(blob)
    .then((base64) => uploadBase64(context, fileName, base64))
    .catch((err) => {
      console.error('IMG.LY View: blobToBase64 failed', err);
      return '';
    });
}

function safeUploadFileName(file) {
  const raw = file && typeof file.name === 'string' ? file.name.trim() : '';
  const safe = raw.replace(/[^\w.-]/g, '_');
  if (safe) return safe;
  const ext = file && typeof file.type === 'string' && file.type.includes('/')
    ? file.type.split('/').pop()
    : 'bin';
  return `upload-${Date.now()}.${ext}`;
}

/**
 * Upload CE.SDK (uploadFile action) → URL permanente Bubble.
 * @returns {Promise<object>} AssetDefinition minimal pour CE.SDK
 */
export async function uploadFileToBubble(instance, file, onProgress) {
  const context = instance?.data?.bubbleContext || null;
  const cesdk = instance?.data?.cesdk || null;

  if (!file) {
    throw new Error('No file to upload');
  }

  if (typeof onProgress === 'function') {
    try { onProgress(0); } catch (e) { /* ignore */ }
  }

  const fileName = safeUploadFileName(file);

  if (context && typeof context.uploadContent === 'function') {
    const base64 = await fileToBase64(file);
    const url = await uploadBase64(context, fileName, base64);
    if (url) {
      if (typeof onProgress === 'function') {
        try { onProgress(1); } catch (e) { /* ignore */ }
      }
      if (file.type?.startsWith('image/') && instance?.publishState && instance?.triggerEvent) {
        instance.publishState('image_uploaded_url', url);
        instance.triggerEvent('image_uploaded');
      }
      return {
        id: `bubble-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        meta: {
          uri: url,
          thumbUri: url,
          mimeType: file.type || 'application/octet-stream',
        },
      };
    }
    console.warn('IMG.LY View: uploadContent sans URL utilisable pour', fileName);
  }

  if (cesdk?.utils && typeof cesdk.utils.localUpload === 'function') {
    console.warn('IMG.LY View: repli localUpload (sandbox / pas de context Bubble)');
    return cesdk.utils.localUpload(file, { context: { source: 'user-upload' } });
  }

  throw new Error('Upload indisponible (context Bubble ou CE.SDK manquant)');
}

export function syncBubbleContext(instance, context) {
  if (instance?.data && context) {
    instance.data.bubbleContext = context;
  }
}
