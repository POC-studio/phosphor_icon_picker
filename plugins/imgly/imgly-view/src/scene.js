import {
  BOOKLET_PAGE_LAYOUT,
  BOOKLET_SCENE_LAYOUT,
} from './booklet-layout.js';
import {
  ensureAllBlocksIncludedInExport,
  lockPageDeletion,
  lockPageSelection,
} from './export-lock.js';

function applyBookletPagePositions(engine) {
  if (!engine?.block) return;

  const pageIds = getPageIds(engine);
  pageIds.forEach((pageId, index) => {
    const spec = BOOKLET_PAGE_LAYOUT[index];
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

function ensureBookletGuides(engine) {
  const pageIds = getPageIds(engine);
  pageIds.forEach((pageId, index) => {
    const spec = BOOKLET_PAGE_LAYOUT[index];
    try {
      engine.block.setClipped(pageId, true);
    } catch {
      /* ignore */
    }
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
  if (spec.name) {
    engine.block.setName(page, spec.name);
  }
  engine.block.appendChild(parent, page);
  return page;
}

/** Layout Free + positions livret (Page 1 au-dessus de la 3, Page 4 sous la 2). */
function ensureBookletSceneLayout(engine) {
  if (!engine?.scene || typeof engine.scene.setLayout !== 'function') return;
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
    applyBookletPagePositions(engine);
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

export async function createBookletScene(_cesdk, engine) {
  if (!engine || !engine.scene || !engine.block) return [];

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
  engine.block.setFloat(scene, 'scene/pageDimensions/width', BOOKLET_PAGE_LAYOUT[0].width);
  engine.block.setFloat(scene, 'scene/pageDimensions/height', BOOKLET_PAGE_LAYOUT[0].height);

  for (const pageId of getPageIds(engine)) {
    try { engine.block.destroy(pageId); } catch (e) { /* ignore */ }
  }

  const parent = getPageParent(engine);
  if (parent == null) return [];

  for (const spec of BOOKLET_PAGE_LAYOUT) {
    createBookletPage(engine, parent, spec);
  }

  ensureBookletSceneLayout(engine);
  ensureBookletGuides(engine);

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

  instance.data._suppressCanvasJsonPublish = true;
  try {
    await engine.scene.loadFromString(sceneString.trim());
    instance.data.pageIds = getPageIds(engine);
    instance.data._lastPublishedCanvasJson = sceneString.trim();
    instance.data._suppressCanvasJsonPublish = false;
    ensureBookletSceneLayout(engine);
    ensureBookletGuides(engine);
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
    await fitSceneInView(instance.data.cesdk);
    return true;
  } catch (err) {
    instance.data._suppressCanvasJsonPublish = false;
    console.error('IMG.LY View: loadFromString failed', err);
    return false;
  }
}
