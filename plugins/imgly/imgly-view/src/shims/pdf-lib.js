/** Résout pdf-lib depuis window.PDFLib (shared.html / CDN). */
const lib = typeof PDFLib !== 'undefined' ? PDFLib : {};

export const PDFDocument = lib.PDFDocument;
export const PageSizes = lib.PageSizes;
export const concatTransformationMatrix = lib.concatTransformationMatrix;
export const popGraphicsState = lib.popGraphicsState;
export const pushGraphicsState = lib.pushGraphicsState;
