import {
  BOOKMARKS_PANEL_ID,
  filterBookmarks,
  insertContributionImage,
} from './bookmarks.js';

const DOCK_ID = 'imgly.bookmarks.dock';
const BOOKMARK_ICON = '@imgly.bookmarks/Bookmark';

const BOOKMARK_ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="@imgly.bookmarks/Bookmark" viewBox="0 0 24 24" fill="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</svg>`;

function selectBookmarkItem(engine, cesdk, instance, item) {
  return insertContributionImage(engine, cesdk, instance, item);
}

/**
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} instance
 */
export function setupBookmarks(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  cesdk.ui.addIconSet('@imgly.bookmarks', BOOKMARK_ICON_SPRITE);

  let refreshPanel = null;

  cesdk.ui.registerComponent(DOCK_ID, ({ builder, payload }) => {
    const icon = payload?.icon ?? BOOKMARK_ICON;
    const isOpen = cesdk.ui.isPanelOpen(BOOKMARKS_PANEL_ID);
    builder.Button('open-bookmarks', {
      tooltip: 'panel.imgly.bookmarks.label',
      icon,
      isSelected: isOpen,
      onClick: () => {
        if (cesdk.ui.isPanelOpen(BOOKMARKS_PANEL_ID)) {
          cesdk.ui.closePanel(BOOKMARKS_PANEL_ID);
        } else {
          cesdk.ui.openPanel(BOOKMARKS_PANEL_ID);
        }
      },
    });
  });

  cesdk.ui.registerPanel(BOOKMARKS_PANEL_ID, ({ builder, state, engine }) => {
    const queryState = state('query', '');
    const versionState = state('version', 0);

    refreshPanel = () => {
      versionState.setValue(versionState.value + 1);
    };

    builder.Section('bookmarks-search', {
      children: () => {
        builder.TextInput('bookmarks-search-input', {
          inputLabel: 'panel.imgly.bookmarks.search',
          value: queryState.value,
          setValue: (value) => queryState.setValue(value),
          requireConfirm: false,
        });
      },
    });

    builder.Section('bookmarks-list', {
      children: () => {
        void versionState.value;

        const list = Array.isArray(instance.data.bookmarksList) ? instance.data.bookmarksList : [];
        const filtered = filterBookmarks(list, queryState.value);

        if (list.length === 0) {
          builder.Text('bookmarks-empty', {
            content: cesdk.i18n.translate('panel.imgly.bookmarks.empty'),
          });
          return;
        }

        if (filtered.length === 0) {
          builder.Text('bookmarks-no-results', {
            content: cesdk.i18n.translate('panel.imgly.bookmarks.noResults'),
          });
          return;
        }

        filtered.forEach((item, index) => {
          const onSelect = async () => {
            try {
              await selectBookmarkItem(engine, cesdk, instance, item);
            } catch (err) {
              console.error('IMG.LY View: insertion contribution', err);
            }
          };

          builder.Section(`bookmark-item-${index}`, {
            children: () => {
              builder.MediaPreview(`bookmark-preview-${index}`, {
                size: 'medium',
                preview: {
                  type: 'image',
                  uri: item.image_url,
                  fillType: 'cover',
                },
                action: {
                  icon: '@imgly/Plus',
                  tooltip: item.contributor || 'panel.imgly.bookmarks.add',
                  onClick: onSelect,
                },
              });
            },
          });
        });
      },
    });
  });

  cesdk.ui.setPanelPosition(BOOKMARKS_PANEL_ID, 'left');
  cesdk.ui.setPanelFloating(BOOKMARKS_PANEL_ID, false);

  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', position: 'end' },
    {
      id: DOCK_ID,
      key: 'imgly.bookmarks',
      icon: BOOKMARK_ICON,
    },
  );

  instance.data.refreshBookmarksPanel = () => {
    if (typeof refreshPanel === 'function') {
      refreshPanel();
    }
  };
}
