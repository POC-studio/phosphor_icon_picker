import {
  PHOSPHOR_STYLES,
  buildPhosphorAsset,
  fetchAllPhosphorIconsByStyle,
  filterIconNames,
  normalizePhosphorStyle,
  parsePhosphorAssetId,
} from './phosphor-icons.js';
import { ICONS_PANEL_ID, insertPhosphorIcon } from './phosphor-icon-insert.js';

const SOURCE_ID = 'imgly.phosphor';
const LIBRARY_ENTRY_ID = 'imgly.phosphor';
const DOCK_ID = 'imgly.icons.dock';
const PHOSPHOR_ICON = '@imgly.phosphor/Icons';
const ASSETS_PER_PAGE = 60;

const PHOSPHOR_STYLE_OPTIONS = PHOSPHOR_STYLES.map((style) => ({
  id: style,
  label: `panel.imgly.icons.style.${style}`,
}));

/**
 * @param {string} styleId
 */
function getPhosphorStyleOption(styleId) {
  const safeStyle = normalizePhosphorStyle(styleId);
  return PHOSPHOR_STYLE_OPTIONS.find((option) => option.id === safeStyle) ?? PHOSPHOR_STYLE_OPTIONS[0];
}

const PHOSPHOR_ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="@imgly.phosphor/Icons" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8.5 14.5c1.2 1.8 5.8 1.8 7 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</svg>`;

/**
 * @param {object} instance
 * @param {string} style
 */
async function getIconNamesForStyle(instance, style) {
  const safeStyle = normalizePhosphorStyle(style);
  if (!instance.data.phosphorIconNamesByStyle) {
    instance.data.phosphorIconNamesByStyle = {};
  }
  if (Array.isArray(instance.data.phosphorIconNamesByStyle[safeStyle])) {
    return instance.data.phosphorIconNamesByStyle[safeStyle];
  }
  const names = await fetchAllPhosphorIconsByStyle(safeStyle);
  instance.data.phosphorIconNamesByStyle[safeStyle] = names;
  return names;
}

/**
 * @param {import('@cesdk/cesdk-js').default} cesdk
 * @param {object} instance
 */
export function setupIcons(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  instance.data.phosphorIconStyle = instance.data.phosphorIconStyle || 'regular';
  instance.data.phosphorIconNamesByStyle = instance.data.phosphorIconNamesByStyle || {};

  cesdk.ui.addIconSet('@imgly.phosphor', PHOSPHOR_ICON_SPRITE);

  cesdk.ui.addAssetLibraryEntry({
    id: LIBRARY_ENTRY_ID,
    sourceIds: [SOURCE_ID],
    title: 'libraries.imgly.phosphor.label',
    icon: PHOSPHOR_ICON,
    gridColumns: 4,
    gridItemHeight: 'square',
    previewLength: 3,
    cardLabel: () => '',
  });

  const engine = cesdk.engine;
  engine.asset.addSource({
    id: SOURCE_ID,
    findAssets: async (queryData) => {
      const style = normalizePhosphorStyle(instance.data.phosphorIconStyle);
      const locale = queryData?.locale || cesdk.i18n.getLocale() || 'fr';
      const page = Math.max(0, Number(queryData?.page) || 0);
      const perPage = Math.max(1, Number(queryData?.perPage) || ASSETS_PER_PAGE);
      const allNames = await getIconNamesForStyle(instance, style);
      const filtered = filterIconNames(allNames, queryData?.query);
      const start = page * perPage;
      const slice = filtered.slice(start, start + perPage);
      const assets = slice.map((iconName) => buildPhosphorAsset(iconName, style, locale));
      const nextStart = start + perPage;
      return {
        assets,
        currentPage: page,
        nextPage: nextStart < filtered.length ? page + 1 : undefined,
        total: filtered.length,
      };
    },
    fetchAsset: async (assetId, params) => {
      const parsed = parsePhosphorAssetId(assetId);
      const style = normalizePhosphorStyle(parsed.style || instance.data.phosphorIconStyle);
      const locale = params?.locale || cesdk.i18n.getLocale() || 'fr';
      const asset = buildPhosphorAsset(parsed.iconName || assetId, style, locale);
      return {
        ...asset,
        context: { sourceId: SOURCE_ID },
        active: false,
      };
    },
    applyAsset: async (asset) => {
      const parsed = parsePhosphorAssetId(asset?.id);
      if (!parsed.iconName) return undefined;
      const style = normalizePhosphorStyle(parsed.style || instance.data.phosphorIconStyle);
      await insertPhosphorIcon(engine, cesdk, instance, parsed.iconName, style);
      return undefined;
    },
  });

  cesdk.ui.registerComponent(DOCK_ID, ({ builder, payload }) => {
    const icon = payload?.icon ?? PHOSPHOR_ICON;
    const isOpen = cesdk.ui.isPanelOpen(ICONS_PANEL_ID);
    builder.Button('open-icons', {
      tooltip: 'panel.imgly.icons.label',
      icon,
      isSelected: isOpen,
      onClick: () => {
        if (cesdk.ui.isPanelOpen(ICONS_PANEL_ID)) {
          cesdk.ui.closePanel(ICONS_PANEL_ID);
        } else {
          cesdk.ui.openPanel(ICONS_PANEL_ID);
        }
      },
    });
  });

  cesdk.ui.registerPanel(ICONS_PANEL_ID, ({ builder, state }) => {
    const styleState = state('phosphor-style', getPhosphorStyleOption(instance.data.phosphorIconStyle));
    const versionState = state('phosphor-version', 0);

    builder.Section('phosphor-style-section', {
      children: () => {
        const selectedStyle = getPhosphorStyleOption(
          typeof styleState.value === 'object' && styleState.value?.id
            ? styleState.value.id
            : instance.data.phosphorIconStyle,
        );
        builder.Select('phosphor-style', {
          inputLabel: 'panel.imgly.icons.style',
          value: selectedStyle,
          setValue: (option) => {
            const nextStyle = normalizePhosphorStyle(option?.id);
            styleState.setValue(getPhosphorStyleOption(nextStyle));
            instance.data.phosphorIconStyle = nextStyle;
            versionState.setValue(versionState.value + 1);
            engine.asset.assetSourceContentsChanged(SOURCE_ID);
          },
          values: PHOSPHOR_STYLE_OPTIONS,
        });
      },
    });

    builder.Section('phosphor-library-section', {
      children: () => {
        void versionState.value;
        void styleState.value;
        builder.Library('phosphor-library', {
          entries: [LIBRARY_ENTRY_ID],
          searchable: true,
        });
      },
    });
  });

  cesdk.ui.setPanelPosition(ICONS_PANEL_ID, 'left');
  cesdk.ui.setPanelFloating(ICONS_PANEL_ID, false);

  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', before: 'imgly.bookmarks.dock' },
    {
      id: DOCK_ID,
      key: 'imgly.icons',
      icon: PHOSPHOR_ICON,
    },
  );
}
