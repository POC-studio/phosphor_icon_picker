const EXPORT_UI_STYLE_ID = 'imgly-hide-show-in-export';

/** Masque la section « Exporter / Afficher lors de l'exportation ». */
export function hideShowInExportUI() {
  if (typeof document === 'undefined' || document.getElementById(EXPORT_UI_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = EXPORT_UI_STYLE_ID;
  style.textContent = `
    .UBQ_Section-module__block:has([name="exportable"]),
    .UBQ_Section-module__block:has([data-cy="exportable"]) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

/** Force includedInExport=true sur tous les blocs (toujours exportés). */
export function ensureAllBlocksIncludedInExport(engine) {
  if (!engine?.block || typeof engine.block.findAll !== 'function') return;

  for (const blockId of engine.block.findAll()) {
    try {
      if (
        typeof engine.block.isIncludedInExport === 'function'
        && engine.block.isIncludedInExport(blockId)
      ) {
        continue;
      }
      if (typeof engine.block.setIncludedInExport === 'function') {
        engine.block.setIncludedInExport(blockId, true);
      }
    } catch {
      /* ignore invalid blocks */
    }
  }
}

/** Interdit la destruction des pages (menu, raccourci clavier…). */
export function lockPageDeletion(engine) {
  if (!engine?.block || typeof engine.block.findByType !== 'function') return;

  const pageIds = engine.block.findByType('page') || [];
  for (const pageId of pageIds) {
    try {
      engine.block.setScopeEnabled(pageId, 'lifecycle/destroy', false);
    } catch {
      /* ignore invalid blocks */
    }
  }
}

/** Empêche la sélection / transformation des pages (pas de barres d’action page). */
export function lockPageSelection(engine) {
  if (!engine?.block || typeof engine.block.findByType !== 'function') return;

  const pageIds = engine.block.findByType('page') || [];
  for (const pageId of pageIds) {
    try {
      engine.block.setBool(pageId, 'selectionEnabled', false);
    } catch {
      /* ignore invalid blocks */
    }
  }
}

export function setupExportLock(engine) {
  hideShowInExportUI();
  ensureAllBlocksIncludedInExport(engine);
  lockPageDeletion(engine);
  lockPageSelection(engine);
}
