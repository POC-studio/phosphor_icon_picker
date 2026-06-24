/**
 * Export PDF livret imposé — PDF natif CE.SDK par page → composition pdf-lib.
 * Rotation + placement 1:1 (pas de redimensionnement).
 */

import {
  PDFDocument,
  PageSizes,
  concatTransformationMatrix,
  popGraphicsState,
  pushGraphicsState,
} from 'pdf-lib';
import {
  HALF_A4_WIDTH_MM,
  PAGE_HEIGHT_MM,
} from './booklet-layout.js';
import { withPageHiddenForExport } from './export-lock.js';
import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  PRINTER_MARGIN_MM,
} from './printer-margins.js';

const PDF_ROTATE_CLOCKWISE = false;
const PDF_DUPLEX_FLIP_INSIDE_PAGE = true;

/** Paires 1-indexées [gauche, droite] pour saddle-stitch. */
export function buildImpositionPairs(totalPages) {
  if (totalPages % 4 !== 0) {
    throw new Error(`Nombre de pages invalide pour imposition: ${totalPages}`);
  }
  const numSheets = totalPages / 4;
  const pairs = [];
  for (let s = 0; s < numSheets; s += 1) {
    pairs.push([totalPages - 2 * s, 1 + 2 * s]);
    pairs.push([2 + 2 * s, totalPages - 1 - 2 * s]);
  }
  return pairs;
}

function mmToPt(mm) {
  return (mm * 72) / 25.4;
}

function blobToArrayBuffer(blob) {
  if (blob instanceof ArrayBuffer) return blob;
  if (blob?.arrayBuffer) return blob.arrayBuffer();
  return blob;
}

/**
 * @param {number} widthPt
 * @param {number} heightPt
 */
function logUnexpectedPageSize(widthPt, heightPt) {
  const expectedW = mmToPt(HALF_A4_WIDTH_MM);
  const expectedH = mmToPt(PAGE_HEIGHT_MM);
  const tolerance = 2;
  if (
    Math.abs(widthPt - expectedW) > tolerance
    || Math.abs(heightPt - expectedH) > tolerance
  ) {
    console.warn(
      'IMG.LY View: taille PDF page inattendue',
      { widthPt, heightPt, expectedW, expectedH },
    );
  }
}

/**
 * @param {import('pdf-lib').PDFPage} outPage
 * @param {import('pdf-lib').PDFEmbeddedPage} leftEmbedded
 * @param {import('pdf-lib').PDFEmbeddedPage} rightEmbedded
 * @param {boolean} flip180
 */
function drawImposedSpread(outPage, leftEmbedded, rightEmbedded, flip180) {
  const a4W = mmToPt(A4_WIDTH_MM);
  const a4H = mmToPt(A4_HEIGHT_MM);
  const halfW = mmToPt(HALF_A4_WIDTH_MM);

  logUnexpectedPageSize(leftEmbedded.width, leftEmbedded.height);
  logUnexpectedPageSize(rightEmbedded.width, rightEmbedded.height);

  outPage.pushOperators(pushGraphicsState());

  if (flip180 && PDF_DUPLEX_FLIP_INSIDE_PAGE) {
    outPage.pushOperators(
      concatTransformationMatrix(-1, 0, 0, -1, a4W, a4H),
    );
  }

  if (PDF_ROTATE_CLOCKWISE) {
    outPage.pushOperators(
      concatTransformationMatrix(0, 1, -1, 0, a4W, 0),
    );
  } else {
    outPage.pushOperators(
      concatTransformationMatrix(0, -1, 1, 0, 0, a4H),
    );
  }

  outPage.drawPage(leftEmbedded, { x: 0, y: 0 });
  outPage.drawPage(rightEmbedded, { x: halfW, y: 0 });

  outPage.pushOperators(popGraphicsState());
}

/**
 * @param {Uint8Array[]|ArrayBuffer[]} pagePdfBytesList
 * @param {[number, number][]} pairs
 * @returns {Promise<Blob>}
 */
export async function composeImposedPdf(pagePdfBytesList, pairs) {
  const outputDoc = await PDFDocument.create();

  for (let i = 0; i < pairs.length; i += 1) {
    const [leftNum, rightNum] = pairs[i];
    const leftBytes = pagePdfBytesList[leftNum - 1];
    const rightBytes = pagePdfBytesList[rightNum - 1];
    if (!leftBytes || !rightBytes) {
      throw new Error(`PDF manquant pour la paire [${leftNum}|${rightNum}]`);
    }

    const leftDoc = await PDFDocument.load(await blobToArrayBuffer(leftBytes));
    const rightDoc = await PDFDocument.load(await blobToArrayBuffer(rightBytes));
    const [leftEmbedded] = await outputDoc.embedPdf(leftDoc);
    const [rightEmbedded] = await outputDoc.embedPdf(rightDoc);

    const outPage = outputDoc.addPage(PageSizes.A4);
    drawImposedSpread(outPage, leftEmbedded, rightEmbedded, i % 2 === 1);
  }

  const bytes = await outputDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} pageId
 */
export async function exportPagePdf(engine, pageId) {
  if (!engine?.block || pageId == null) return null;
  const blob = await withPageHiddenForExport(engine, pageId, () => engine.block.export(pageId, {
    mimeType: 'application/pdf',
    exportPdfWithHighCompatibility: true,
  }));
  if (!blob) return null;
  return blobToArrayBuffer(blob);
}

/**
 * Construit un PDF A4 portrait imposé à partir des pages CE.SDK (PDF natif).
 * @param {import('@cesdk/engine').default} engine
 * @param {number[]} pageIds — ordre éditeur (page 1 → index 0)
 * @returns {Promise<Blob>}
 */
export async function buildFoldedA4Pdf(engine, pageIds) {
  const totalPages = pageIds.length;
  if (totalPages % 4 !== 0) {
    throw new Error(`Imposition: ${totalPages} pages (attendu multiple de 4)`);
  }

  const pagePdfBytes = await Promise.all(pageIds.map((id) => exportPagePdf(engine, id)));
  if (pagePdfBytes.some((bytes) => !bytes)) {
    throw new Error('Export PDF CE.SDK incomplet (page manquante)');
  }

  const pairs = buildImpositionPairs(totalPages);
  return composeImposedPdf(pagePdfBytes, pairs);
}

/**
 * PDF standard : toutes les demi-pages à la suite, dans l’ordre éditeur.
 * @param {import('@cesdk/engine').default} engine
 * @param {number[]} pageIds
 * @returns {Promise<Blob>}
 */
export async function buildSequentialPdf(engine, pageIds) {
  if (!pageIds.length) {
    throw new Error('Export PDF séquentiel : aucune page');
  }

  const pagePdfBytes = await Promise.all(pageIds.map((id) => exportPagePdf(engine, id)));
  if (pagePdfBytes.some((bytes) => !bytes)) {
    throw new Error('Export PDF CE.SDK incomplet (page manquante)');
  }

  const outputDoc = await PDFDocument.create();
  for (const bytes of pagePdfBytes) {
    const srcDoc = await PDFDocument.load(await blobToArrayBuffer(bytes));
    const [embedded] = await outputDoc.embedPdf(srcDoc);
    const page = outputDoc.addPage([embedded.width, embedded.height]);
    page.drawPage(embedded, { x: 0, y: 0 });
  }

  const outBytes = await outputDoc.save();
  return new Blob([outBytes], { type: 'application/pdf' });
}

/**
 * Rogne chaque feuille A4 du PDF imposé selon les marges imprimeur (sans rescale).
 * @param {Blob} imposedPdfBlob
 * @returns {Promise<Blob>}
 */
export async function trimImposedPdfForPrinter(imposedPdfBlob) {
  const doc = await PDFDocument.load(await blobToArrayBuffer(imposedPdfBlob));
  const { left, bottom, right, top } = PRINTER_MARGIN_MM;
  const trimW = mmToPt(A4_WIDTH_MM - left - right);
  const trimH = mmToPt(A4_HEIGHT_MM - top - bottom);
  const cropX = mmToPt(left);
  const cropY = mmToPt(bottom);

  for (const page of doc.getPages()) {
    page.setMediaBox(cropX, cropY, trimW, trimH);
    page.setCropBox(cropX, cropY, trimW, trimH);
  }

  const bytes = await doc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
