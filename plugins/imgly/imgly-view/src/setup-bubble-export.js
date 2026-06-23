export const BUBBLE_SAVE_NAV_ID = 'imgly.bubble.save.navigationBar';

/** Boutons d’export / téléchargement CE.SDK à retirer de la barre de navigation. */
const EXPORT_NAV_IDS_TO_REMOVE = [
  'ly.img.actions.navigationBar',
  'ly.img.save.navigationBar',
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
 * Bouton Enregistrer (JSON + previews + PDF) et export PDF imposé dans la barre CE.SDK.
 */
export function setupBubblePdfExport(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  const runSaveDocument = async () => {
    if (typeof instance.data.triggerSaveDocument !== 'function') {
      console.error('IMG.LY View: enregistrement indisponible (éditeur non prêt)');
      return;
    }
    try {
      await instance.data.triggerSaveDocument();
    } catch (err) {
      console.error('IMG.LY View: enregistrement document', err);
    }
  };

  cesdk.ui.registerComponent(BUBBLE_SAVE_NAV_ID, ({ builder, state }) => {
    const loading = state('loading', false);
    builder.Button('save-document', {
      color: 'accent',
      variant: 'regular',
      label: 'Enregistrer',
      icon: '@imgly/Save',
      isLoading: loading.value,
      isDisabled: loading.value,
      onClick: async () => {
        if (loading.value) return;
        loading.setValue(true);
        try {
          await runSaveDocument();
        } finally {
          loading.setValue(false);
        }
      },
    });
  });

  cesdk.actions.register('saveDocument', runSaveDocument);

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
