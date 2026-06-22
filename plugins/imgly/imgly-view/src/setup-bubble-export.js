/** Boutons d’export / téléchargement CE.SDK à retirer de la barre de navigation. */
const EXPORT_NAV_IDS_TO_REMOVE = [
  'ly.img.actions.navigationBar',
  'ly.img.saveScene.navigationBar',
  'ly.img.exportImage.navigationBar',
  'ly.img.exportScene.navigationBar',
  'ly.img.exportArchive.navigationBar',
  'ly.img.importScene.navigationBar',
  'ly.img.importArchive.navigationBar',
  'ly.img.exportVideo.navigationBar',
  'ly.img.shareScene.navigationBar',
  'ly.img.download.navigationBar',
  'ly.img.export.navigationBar',
];

/**
 * Un seul bouton PDF (livret imposé) — branchement direct, sans exportDesign CE.SDK.
 */
export function setupBubblePdfExport(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  const runPdfExport = async () => {
    if (typeof instance.data.triggerPdfExport !== 'function') {
      console.error('IMG.LY View: export PDF indisponible (éditeur non prêt)');
      return;
    }
    try {
      await instance.data.triggerPdfExport();
    } catch (err) {
      console.error('IMG.LY View: export PDF imposé', err);
    }
  };

  cesdk.actions.register('exportImposedPdf', runPdfExport);
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    if (exportOptions?.mimeType === 'application/pdf') {
      await runPdfExport();
    }
  });

  for (const id of EXPORT_NAV_IDS_TO_REMOVE) {
    cesdk.ui.removeOrderComponent({ in: 'ly.img.navigation.bar', match: id });
  }

  cesdk.ui.updateOrderComponent(
    { in: 'ly.img.navigation.bar', match: 'ly.img.exportPDF.navigationBar' },
    {
      onClick: runPdfExport,
      label: 'Exporter le PDF',
      icon: '@imgly/Download',
    },
  );
}
