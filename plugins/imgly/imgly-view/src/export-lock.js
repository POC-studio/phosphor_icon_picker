const TRANSPARENT_COLOR = { r: 0, g: 0, b: 0, a: 0 };

/**
 * Masque la section « Exporter / Afficher lors de l'exportation » via l’API rôles CE.SDK.
 * `ui/manageExportable` n’est disponible qu’en rôle Creator ; Adopter conserve l’édition
 * complète grâce aux scopes globaux Allow.
 */
export function configureEditorRoleForHiddenExportToggle(engine) {
  if (!engine?.editor) return;

  engine.editor.setRole('Adopter');

  if (typeof engine.editor.findAllScopes !== 'function') return;

  for (const scope of engine.editor.findAllScopes()) {
    try {
      engine.editor.setGlobalScope(scope, 'Allow');
    } catch {
      /* ignore invalid scopes */
    }
  }
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

/** Désactive le trait de cadre page (éditeur) — conserve le fond blanc. */
export function hidePageCanvasBorder(engine, pageId) {
  if (!engine?.block || pageId == null) return;
  try {
    if (typeof engine.block.supportsStroke === 'function' && engine.block.supportsStroke(pageId)) {
      engine.block.setStrokeEnabled(pageId, false);
    }
    if (typeof engine.block.setFloat === 'function') {
      engine.block.setFloat(pageId, 'stroke/width', 0);
    }
    if (typeof engine.block.setBool === 'function') {
      engine.block.setBool(pageId, 'stroke/enabled', false);
    }
    if (typeof engine.block.supportsFill === 'function' && engine.block.supportsFill(pageId)) {
      engine.block.setFillEnabled(pageId, true);
    }
  } catch {
    /* ignore */
  }
}

function readPageExportVisualState(engine, pageId) {
  const state = {};
  try {
    if (typeof engine.block.isStrokeEnabled === 'function') {
      state.strokeEnabled = engine.block.isStrokeEnabled(pageId);
    }
    if (typeof engine.block.isFillEnabled === 'function') {
      state.fillEnabled = engine.block.isFillEnabled(pageId);
    }
  } catch {
    /* ignore */
  }
  return state;
}

function restorePageExportVisualState(engine, pageId, state) {
  try {
    if (state.strokeEnabled !== undefined && typeof engine.block.setStrokeEnabled === 'function') {
      engine.block.setStrokeEnabled(pageId, state.strokeEnabled);
    }
    if (state.fillEnabled !== undefined && typeof engine.block.setFillEnabled === 'function') {
      engine.block.setFillEnabled(pageId, state.fillEnabled);
    }
  } catch {
    /* ignore */
  }
}

/** Prépare une page pour l'export SVG/PDF sans cadre (temporaire, restauré après). */
export async function withPageHiddenForExport(engine, pageId, exportFn) {
  const previous = readPageExportVisualState(engine, pageId);
  try {
    hidePageCanvasBorder(engine, pageId);
    if (typeof engine.block.setFillEnabled === 'function') {
      engine.block.setFillEnabled(pageId, false);
    }
    return await exportFn();
  } finally {
    restorePageExportVisualState(engine, pageId, previous);
    hidePageCanvasBorder(engine, pageId);
  }
}

export function hideAllPageCanvasBorders(engine) {
  if (!engine?.block || typeof engine.block.findByType !== 'function') return;

  if (engine.editor?.setSetting) {
    try {
      engine.editor.setSetting('page/innerBorderColor', TRANSPARENT_COLOR);
      engine.editor.setSetting('page/outerBorderColor', TRANSPARENT_COLOR);
    } catch {
      /* ignore */
    }
  }

  const pageIds = engine.block.findByType('page') || [];
  for (const pageId of pageIds) {
    hidePageCanvasBorder(engine, pageId);
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
  configureEditorRoleForHiddenExportToggle(engine);
  hideAllPageCanvasBorders(engine);
  ensureAllBlocksIncludedInExport(engine);
  lockPageDeletion(engine);
  lockPageSelection(engine);
}
