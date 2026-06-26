import { insertImageOnCurrentPage } from './page-insert.js';
import { uploadFileToBubble } from './bubble-upload.js';

export const TEAM_IMAGES_PANEL_ID = 'imgly.team.images.panel';

const DOCK_ID = 'imgly.team.images.dock';
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/svg+xml,image/bmp,image/gif';

/**
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} instance
 */
export function setupTeamImages(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  let refreshPanel = null;

  cesdk.ui.registerComponent(DOCK_ID, ({ builder, payload }) => {
    const icon = payload?.icon ?? '@imgly/Image';
    const isOpen = cesdk.ui.isPanelOpen(TEAM_IMAGES_PANEL_ID);
    builder.Button('open-team-images', {
      tooltip: 'libraries.ly.img.image.label',
      icon,
      isSelected: isOpen,
      onClick: () => {
        if (cesdk.ui.isPanelOpen(TEAM_IMAGES_PANEL_ID)) {
          cesdk.ui.closePanel(TEAM_IMAGES_PANEL_ID);
        } else {
          cesdk.ui.openPanel(TEAM_IMAGES_PANEL_ID);
        }
      },
    });
  });

  cesdk.ui.registerPanel(TEAM_IMAGES_PANEL_ID, ({ builder, state, engine }) => {
    const versionState = state('version', 0);

    refreshPanel = () => {
      versionState.setValue(versionState.value + 1);
    };

    builder.Section('team-images-upload', {
      children: () => {
        builder.Button('upload-image', {
          label: 'panel.imgly.teamImages.upload',
          icon: '@imgly/Upload',
          onClick: async () => {
            try {
              const file = await cesdk.utils.loadFile({
                accept: IMAGE_ACCEPT,
                returnType: 'File',
              });
              if (!file) return;
              await uploadFileToBubble(instance, file, undefined);
            } catch (err) {
              console.error('IMG.LY View: upload image', err);
            }
          },
        });
      },
    });

    builder.Section('team-images-list', {
      children: () => {
        void versionState.value;

        const urls = Array.isArray(instance.data.teamImageUrls) ? instance.data.teamImageUrls : [];
        if (urls.length === 0) {
          builder.Text('team-images-empty', {
            content: cesdk.i18n.translate('panel.imgly.teamImages.empty'),
          });
          return;
        }

        urls.forEach((url, index) => {
          builder.Section(`team-image-${index}`, {
            children: () => {
              builder.MediaPreview(`team-image-preview-${index}`, {
                size: 'medium',
                preview: {
                  type: 'image',
                  uri: url,
                  fillType: 'cover',
                },
                action: {
                  icon: '@imgly/Plus',
                  tooltip: 'panel.imgly.teamImages.add',
                  onClick: async () => {
                    try {
                      await insertImageOnCurrentPage(engine, url, instance);
                      cesdk.ui.closePanel(TEAM_IMAGES_PANEL_ID);
                    } catch (err) {
                      console.error('IMG.LY View: insertion image équipe', err);
                    }
                  },
                },
              });
            },
          });
        });
      },
    });
  });

  cesdk.ui.setPanelPosition(TEAM_IMAGES_PANEL_ID, 'left');
  cesdk.ui.setPanelFloating(TEAM_IMAGES_PANEL_ID, false);

  const dockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
  const nextDockOrder = dockOrder.map((item) => {
    if (item.key === 'ly.img.image') {
      return {
        id: DOCK_ID,
        key: 'imgly.team.images',
        icon: '@imgly/Image',
        label: 'libraries.ly.img.image.label',
      };
    }
    return item;
  });
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, nextDockOrder);

  instance.data.refreshTeamImagesPanel = () => {
    if (typeof refreshPanel === 'function') {
      refreshPanel();
    }
  };
}
