/**
 * Préparation des images avant upload Bubble — compression au-delà de 5 Mo.
 * (Le workflow get_image plafonne ; et les scènes restent légères.)
 */

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Plus grande dimension après redimensionnement (suffisant pour A5 à 300 dpi). */
const MAX_DIMENSION_PX = 2400;

const JPEG_QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4];

/** Types raster recompressables via canvas. */
const COMPRESSIBLE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
]);

export const IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE';

/**
 * @param {File} file
 * @returns {Promise<ImageBitmap>}
 */
async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      // 'from-image' applique l'orientation EXIF (photos smartphone).
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* fallback <img> ci-dessous */
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Image decode failed'));
      el.src = objectUrl;
    });
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} type
 * @param {number} [quality]
 * @returns {Promise<Blob|null>}
 */
function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean}
 */
function canvasHasTransparency(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  // Échantillonnage sur une version réduite — évite de scanner 2400×2400 px.
  const sample = document.createElement('canvas');
  const sampleSize = 64;
  sample.width = sampleSize;
  sample.height = sampleSize;
  const sampleCtx = sample.getContext('2d');
  if (!sampleCtx) return false;
  sampleCtx.drawImage(canvas, 0, 0, sampleSize, sampleSize);
  const { data } = sampleCtx.getImageData(0, 0, sampleSize, sampleSize);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

/**
 * @param {string} fileName
 * @param {string} newExt
 * @returns {string}
 */
function replaceExtension(fileName, newExt) {
  const base = String(fileName || 'image').replace(/\.[^.]+$/, '');
  return `${base}.${newExt}`;
}

/**
 * Redimensionne et recompresse une image raster sous MAX_IMAGE_UPLOAD_BYTES.
 * @param {File} file
 * @returns {Promise<File>}
 */
async function compressImageFile(file) {
  const bitmap = await decodeImage(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponible');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const keepAlpha = file.type === 'image/png' && canvasHasTransparency(canvas);

    if (keepAlpha) {
      const blob = await canvasToBlob(canvas, 'image/png');
      if (blob && blob.size <= MAX_IMAGE_UPLOAD_BYTES) {
        return new File([blob], replaceExtension(file.name, 'png'), { type: 'image/png' });
      }
      throw new Error(IMAGE_TOO_LARGE);
    }

    for (const quality of JPEG_QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
      if (blob && blob.size <= MAX_IMAGE_UPLOAD_BYTES) {
        return new File([blob], replaceExtension(file.name, 'jpg'), { type: 'image/jpeg' });
      }
    }
    throw new Error(IMAGE_TOO_LARGE);
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close();
  }
}

/**
 * Prépare un fichier pour l'upload Bubble.
 * @param {File} file
 * @returns {Promise<{ file: File, resized: boolean }>}
 * @throws {Error} message IMAGE_TOO_LARGE si irrécupérable
 */
export async function prepareImageFileForUpload(file) {
  if (!file || typeof file.size !== 'number') return { file, resized: false };
  if (!file.type || !file.type.startsWith('image/')) return { file, resized: false };
  if (file.size <= MAX_IMAGE_UPLOAD_BYTES) return { file, resized: false };

  if (!COMPRESSIBLE_TYPES.has(file.type)) {
    // SVG, GIF animé… : pas de recompression canvas propre.
    throw new Error(IMAGE_TOO_LARGE);
  }

  const compressed = await compressImageFile(file);
  return { file: compressed, resized: true };
}
