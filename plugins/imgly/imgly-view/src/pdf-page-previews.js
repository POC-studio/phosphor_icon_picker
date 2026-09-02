/**
 * Previews PNG 72 DPI à partir des PDF pages CE.SDK (raster CPU via pdf.js).
 * Évite un second export GPU image, saturé dès ~12 pages.
 */

const PDFJS_VERSION = '3.11.174';
const PDFJS_WORKER_SRC = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;

/** 1 unité PDF = 1/72 pouce → scale 1 = 72 DPI. */
const PREVIEW_SCALE = 1;

function getPdfjsLib() {
  const lib = typeof globalThis.pdfjsLib !== 'undefined' ? globalThis.pdfjsLib : null;
  if (!lib || typeof lib.getDocument !== 'function') {
    throw new Error('pdf.js non chargé');
  }
  if (lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  }
  return lib;
}

async function waitForPdfjs(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      return getPdfjsLib();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error('pdf.js non chargé');
}

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) return bytes;
  if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
  if (bytes?.buffer instanceof ArrayBuffer) {
    return new Uint8Array(bytes.buffer, bytes.byteOffset || 0, bytes.byteLength);
  }
  return null;
}

/**
 * @param {Uint8Array|ArrayBuffer} pagePdfBytes
 * @returns {Promise<Blob|null>}
 */
export async function rasterizePagePdfToPng(pagePdfBytes) {
  const data = toUint8Array(pagePdfBytes);
  if (!data || data.length === 0) return null;

  const pdfjs = await waitForPdfjs();
  const doc = await pdfjs.getDocument({ data }).promise;
  try {
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: PREVIEW_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise((resolve) => {
      canvas.toBlob((next) => resolve(next), 'image/png');
    });
    return blob;
  } finally {
    if (typeof doc.destroy === 'function') {
      await doc.destroy();
    }
  }
}

/**
 * @param {Array<Uint8Array|ArrayBuffer>} pagePdfBytesList
 * @param {string} base
 * @returns {Promise<Array<{ name: string, blob: Blob }>>}
 */
export async function rasterizePagePdfsToPreviewItems(pagePdfBytesList, base) {
  const items = [];
  const safeBase = base || 'document';
  for (let index = 0; index < pagePdfBytesList.length; index += 1) {
    try {
      const blob = await rasterizePagePdfToPng(pagePdfBytesList[index]);
      if (!blob) continue;
      const safeName = `${safeBase}-preview-${String(index + 1).padStart(2, '0')}.png`.replace(/[^\w.-]/g, '_');
      items.push({ name: safeName, blob });
    } catch (err) {
      console.error('IMG.LY View: raster preview PDF failed', index + 1, err);
    }
  }
  return items;
}
