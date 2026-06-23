import {
  BOOKLET_SCENE_LAYOUT,
  buildBookletPageLayout,
} from './booklet-layout.js';
import {
  ensureAllBlocksIncludedInExport,
  hideAllPageCanvasBorders,
  hidePageCanvasBorder,
  lockPageDeletion,
  lockPageSelection,
} from './export-lock.js';

function applyBookletPagePositions(engine, layout) {
  if (!engine?.block || !Array.isArray(layout) || layout.length === 0) return;

  const pageIds = getPageIds(engine);
  if (pageIds.length !== layout.length) return;

  pageIds.forEach((pageId, index) => {
    const spec = layout[index];
    if (!spec) return;
    try {
      engine.block.setWidthMode(pageId, 'Absolute');
      engine.block.setHeightMode(pageId, 'Absolute');
      engine.block.setPositionXMode(pageId, 'Absolute');
      engine.block.setPositionYMode(pageId, 'Absolute');
      engine.block.setWidth(pageId, spec.width);
      engine.block.setHeight(pageId, spec.height);
      engine.block.setPositionX(pageId, spec.x);
      engine.block.setPositionY(pageId, spec.y);
    } catch {
      /* ignore */
    }
  });
}

function ensureBookletGuides(engine, layout) {
  if (!Array.isArray(layout) || layout.length === 0) return;

  const pageIds = getPageIds(engine);
  if (pageIds.length !== layout.length) return;

  pageIds.forEach((pageId, index) => {
    const spec = layout[index];
    try {
      engine.block.setClipped(pageId, true);
    } catch {
      /* ignore */
    }
    hidePageCanvasBorder(engine, pageId);
    if (spec?.name) {
      try {
        engine.block.setName(pageId, spec.name);
      } catch {
        /* ignore */
      }
    }
  });
}

export function getPageIds(engine) {
  if (!engine || !engine.block || typeof engine.block.findByType !== 'function') return [];
  return engine.block.findByType('page') || [];
}

function getPageParent(engine) {
  const scene = engine.scene.get();
  if (scene == null) return null;
  const stacks = engine.block.findByType('stack') || [];
  return stacks.length > 0 ? stacks[0] : scene;
}

/**
 * Crée une page livret — ordre doc img.ly :
 * setDesignUnit → create → setWidth/setHeight → appendChild(stack|scene)
 * @see https://img.ly/docs/cesdk/js/concepts/pages-7b6bae/
 */
function createBookletPage(engine, parent, spec) {
  const page = engine.block.create('page');
  engine.block.setWidthMode(page, 'Absolute');
  engine.block.setHeightMode(page, 'Absolute');
  engine.block.setPositionXMode(page, 'Absolute');
  engine.block.setPositionYMode(page, 'Absolute');
  engine.block.setWidth(page, spec.width);
  engine.block.setHeight(page, spec.height);
  engine.block.setPositionX(page, spec.x);
  engine.block.setPositionY(page, spec.y);
  engine.block.setClipped(page, true);
  engine.block.setBool(page, 'selectionEnabled', false);
  engine.block.setScopeEnabled(page, 'lifecycle/destroy', false);
  hidePageCanvasBorder(engine, page);
  if (spec.name) {
    engine.block.setName(page, spec.name);
  }
  engine.block.appendChild(parent, page);
  return page;
}

function ensureBookletSceneLayout(engine, layout) {
  if (!engine?.scene || typeof engine.scene.setLayout !== 'function') return;
  if (!Array.isArray(layout) || layout.length === 0) return;
  if (getPageIds(engine).length !== layout.length) return;

  try {
    if (engine.scene.getLayout() !== BOOKLET_SCENE_LAYOUT) {
      for (const pageId of getPageIds(engine)) {
        try {
          engine.block.setBool(pageId, 'transformLocked', false);
        } catch {
          /* ignore */
        }
      }
      engine.scene.setLayout(BOOKLET_SCENE_LAYOUT);
    }
    applyBookletPagePositions(engine, layout);
  } catch (err) {
    console.warn('IMG.LY View: ensureBookletSceneLayout failed', err);
  }
}

export function fitSceneInView(cesdk) {
  if (!cesdk || !cesdk.actions || typeof cesdk.actions.run !== 'function') {
    return Promise.resolve();
  }
  return Promise.resolve(
    cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true }),
  ).catch((err) => {
    console.error('IMG.LY View: zoom.toPage failed', err);
  });
}

export async function createBookletScene(_cesdk, engine, sheetCount) {
  if (!engine || !engine.scene || !engine.block) return [];

  const layout = buildBookletPageLayout(sheetCount);

  engine.scene.create(BOOKLET_SCENE_LAYOUT);

  if (typeof engine.scene.setDesignUnit === 'function') {
    engine.scene.setDesignUnit('Millimeter');
  }
  if (typeof engine.scene.setMode === 'function') {
    engine.scene.setMode('Design');
  }

  const scene = engine.scene.get();
  if (scene == null) return [];

  engine.block.setFloat(scene, 'scene/dpi', 300);
  engine.block.setFloat(scene, 'scene/pageDimensions/width', layout[0].width);
  engine.block.setFloat(scene, 'scene/pageDimensions/height', layout[0].height);

  for (const pageId of getPageIds(engine)) {
    try { engine.block.destroy(pageId); } catch (e) { /* ignore */ }
  }

  const parent = getPageParent(engine);
  if (parent == null) return [];

  for (const spec of layout) {
    createBookletPage(engine, parent, spec);
  }

  ensureBookletSceneLayout(engine, layout);
  ensureBookletGuides(engine, layout);
  hideAllPageCanvasBorders(engine);

  ensureAllBlocksIncludedInExport(engine);
  lockPageDeletion(engine);
  lockPageSelection(engine);
  return getPageIds(engine);
}

export async function loadSceneFromString(instance, sceneString) {
  const engine = instance.data.engine;
  if (!engine || !engine.scene || typeof engine.scene.loadFromString !== 'function') {
    return false;
  }
  if (typeof sceneString !== 'string' || sceneString.trim().length === 0) {
    return false;
  }

  const layout = buildBookletPageLayout(instance.data.sheetCount ?? 1);

  instance.data._suppressCanvasJsonPublish = true;
  try {
    await engine.scene.loadFromString(sceneString.trim());
    instance.data.pageIds = getPageIds(engine);
    instance.data._lastPublishedCanvasJson = sceneString.trim();
    ensureBookletSceneLayout(engine, layout);
    ensureBookletGuides(engine, layout);
    hideAllPageCanvasBorders(engine);
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
    await fitSceneInView(instance.data.cesdk);
    return true;
  } catch (err) {
    console.error('IMG.LY View: loadFromString failed', err);
    return false;
  }
}
