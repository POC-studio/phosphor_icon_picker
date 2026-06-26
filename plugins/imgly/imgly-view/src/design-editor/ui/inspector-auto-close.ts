import type CreativeEditorSDK from '@cesdk/cesdk-js';

const INSPECTOR_PANEL = '//ly.img.panel/inspector';
const PAGE_BLOCK_TYPE = '//ly.img.ubq/page';

/**
 * Ferme le panneau inspecteur quand plus aucun bloc éditable n’est sélectionné
 * (clic sur le fond → panneau vide sinon).
 */
export function setupInspectorAutoClose(cesdk: CreativeEditorSDK): void {
  const engine = cesdk.engine;
  if (!engine?.block || typeof engine.block.onSelectionChanged !== 'function') return;

  const hasInspectableSelection = () => {
    const selected = engine.block.findAllSelected();
    if (!selected.length) return false;
    return selected.some((id) => engine.block.getType(id) !== PAGE_BLOCK_TYPE);
  };

  engine.block.onSelectionChanged(() => {
    if (hasInspectableSelection()) return;
    if (cesdk.ui.isPanelOpen(INSPECTOR_PANEL)) {
      cesdk.ui.closePanel(INSPECTOR_PANEL);
    }
  });
}
