import { uploadFileToBubble } from './bubble-upload.js';
import {
  ensureSaveButtonStyles,
  scheduleSaveButtonGroupTag,
} from './save-button-styles.js';

export const BUBBLE_SAVE_NAV_ID = 'imgly.bubble.save.navigationBar';

function getEditorHost(instance) {
  if (!instance?.canvas) return null;
  if (typeof instance.canvas[0] !== 'undefined') return instance.canvas[0];
  return instance.canvas;
}

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
  'ly.img.exportPDF.navigationBar',
];

/** Branche uploadFile CE.SDK → context.uploadContent Bubble (URLs permanentes). */
export function setupBubbleUpload(cesdk, instance) {
  if (!cesdk?.actions || !instance) return;
  cesdk.actions.register('uploadFile', (file, onProgress) => uploadFileToBubble(instance, file, onProgress));
}

/**
 * Bouton Enregistrer + menu PDF (imposé / séquentiel) dans la barre CE.SDK.
 */
export function setupBubblePdfExport(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  ensureSaveButtonStyles();
  instance.data.hasUnsavedChanges = instance.data.hasUnsavedChanges === true;

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

  const runPdfDownload = async (mode) => {
    if (typeof instance.data.triggerPdfExport !== 'function') {
      console.error('IMG.LY View: export PDF indisponible (éditeur non prêt)');
      return;
    }
    try {
      await instance.data.triggerPdfExport({ mode, download: true });
    } catch (err) {
      console.error('IMG.LY View: téléchargement PDF', err);
    }
  };

  const runPreviewsZipDownload = async () => {
    if (typeof instance.data.triggerPreviewsZipDownload !== 'function') {
      console.error('IMG.LY View: export ZIP previews indisponible (éditeur non prêt)');
      return;
    }
    try {
      await instance.data.triggerPreviewsZipDownload();
    } catch (err) {
      console.error('IMG.LY View: téléchargement ZIP previews', err);
    }
  };

  cesdk.ui.registerComponent(BUBBLE_SAVE_NAV_ID, ({ builder, state }) => {
    const loading = state('loading', false);
    const unsavedRevision = state('unsavedRevision', 0);

    instance.data.notifySaveUiState = () => {
      unsavedRevision.setValue(unsavedRevision.value + 1);
    };

    const hasUnsavedChanges = () => {
      void unsavedRevision.value;
      return instance.data.hasUnsavedChanges === true;
    };

    const canSave = () => hasUnsavedChanges() && !loading.value;

    builder.ButtonGroup('save-button-group', {
      children: () => {
        scheduleSaveButtonGroupTag(getEditorHost(instance));

        builder.Button('save-document', {
          color: 'accent',
          variant: 'regular',
          label: 'Enregistrer',
          icon: '@imgly/Save',
          isLoading: loading.value,
          isDisabled: !canSave(),
          onClick: async () => {
            if (!canSave()) return;
            loading.setValue(true);
            try {
              await runSaveDocument();
            } finally {
              loading.setValue(false);
            }
          },
        });

        builder.Dropdown('save-pdf-dropdown', {
          color: 'accent',
          variant: 'regular',
          tooltip: 'Télécharger',
          showIndicator: true,
          isDisabled: loading.value,
          children: ({ close }) => {
            builder.Button('download-pdf-print', {
              label: 'PDF pour impression',
              icon: '@imgly/Download',
              onClick: async () => {
                close();
                if (loading.value) return;
                loading.setValue(true);
                try {
                  await runPdfDownload('imposed');
                } finally {
                  loading.setValue(false);
                }
              },
            });
            builder.Button('download-pdf-standard', {
              label: 'PDF standard',
              icon: '@imgly/Download',
              onClick: async () => {
                close();
                if (loading.value) return;
                loading.setValue(true);
                try {
                  await runPdfDownload('sequential');
                } finally {
                  loading.setValue(false);
                }
              },
            });
            builder.Button('download-previews-zip', {
              label: 'Images (zip)',
              icon: '@imgly/Download',
              onClick: async () => {
                close();
                if (loading.value) return;
                loading.setValue(true);
                try {
                  await runPreviewsZipDownload();
                } finally {
                  loading.setValue(false);
                }
              },
            });
          },
        });
      },
    });
  });

  cesdk.actions.register('saveDocument', runSaveDocument);

  const runImposedPdfExport = async () => {
    await runPdfDownload('imposed');
  };

  cesdk.actions.register('exportImposedPdf', runImposedPdfExport);
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    if (exportOptions?.mimeType === 'application/pdf') {
      await runImposedPdfExport();
    }
  });

  for (const id of EXPORT_NAV_IDS_TO_REMOVE) {
    cesdk.ui.removeOrderComponent({ in: 'ly.img.navigation.bar', match: id });
  }
}
