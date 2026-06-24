export const PRINTER_MARGIN_MM = {
  top: 3,
  bottom: 5,
  left: 3.5,
  right: 3.5,
};

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

export function getPrinterTrimSizeMm() {
  return {
    width: A4_WIDTH_MM - PRINTER_MARGIN_MM.left - PRINTER_MARGIN_MM.right,
    height: A4_HEIGHT_MM - PRINTER_MARGIN_MM.top - PRINTER_MARGIN_MM.bottom,
  };
}
