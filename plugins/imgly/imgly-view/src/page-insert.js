/**
 * @param {import('@cesdk/engine').default} engine
 * @returns {number|null}
 */
export function resolveTargetPageId(engine) {
  if (!engine?.scene) return null;

  const fromCurrent = engine.scene.getCurrentPage();
  if (fromCurrent != null) return fromCurrent;

  const fromViewport = engine.scene.findNearestToViewPortCenterByType('page')[0]
    ?? engine.scene.findNearestToViewPortCenterByType('//ly.img.ubq/page')[0];
  if (fromViewport != null) return fromViewport;

  const pages = engine.block?.findByType?.('page') || [];
  return pages.length > 0 ? pages[0] : null;
}

/** Couleur de remplissage par défaut des icônes Phosphor (#0f172a). */
export const DEFAULT_VECTOR_FILL = {
  r: 15 / 255,
  g: 23 / 255,
  b: 42 / 255,
  a: 1,
};

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {number} blockId
 * @param {number} pageId
 */
export function fitBlockOnPage(engine, blockId, pageId) {
  const pageW = engine.block.getWidth(pageId);
  const pageH = engine.block.getHeight(pageId);
  const imgW = engine.block.getWidth(blockId);
  const imgH = engine.block.getHeight(blockId);
  if (!(pageW > 0 && pageH > 0 && imgW > 0 && imgH > 0)) return;

  const scale = Math.min((pageW * 0.85) / imgW, (pageH * 0.85) / imgH, 1);
  engine.block.setWidth(blockId, imgW * scale);
  engine.block.setHeight(blockId, imgH * scale);
  engine.block.alignHorizontally([blockId], 'Center');
  engine.block.alignVertically([blockId], 'Center');
}

/** @deprecated Alias conservé pour les bookmarks. */
export const fitImageOnPage = fitBlockOnPage;

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {{ d: string, opacity?: number }} pathLayer
 * @param {number} coordWidth
 * @param {number} coordHeight
 * @param {{ r: number, g: number, b: number, a: number }} fillColor
 */
function createVectorPathGraphic(engine, pathLayer, coordWidth, coordHeight, fillColor) {
  const graphic = engine.block.create('graphic');
  const shape = engine.block.createShape('vector_path');
  engine.block.setShape(graphic, shape);
  engine.block.setString(shape, 'shape/vector_path/path', pathLayer.d);
  engine.block.setFloat(shape, 'shape/vector_path/width', coordWidth);
  engine.block.setFloat(shape, 'shape/vector_path/height', coordHeight);
  engine.block.setWidth(graphic, coordWidth);
  engine.block.setHeight(graphic, coordHeight);

  const opacity = typeof pathLayer.opacity === 'number' ? pathLayer.opacity : 1;
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: fillColor.r,
    g: fillColor.g,
    b: fillColor.b,
    a: fillColor.a * opacity,
  });
  engine.block.setFill(graphic, fill);
  return graphic;
}

/**
 * Insère un ou plusieurs chemins vectoriels (ex. icône duotone) sur la page courante.
 * @param {import('@cesdk/engine').default} engine
 * @param {{ paths: { d: string, opacity?: number }[], width: number, height: number, fillColor?: { r: number, g: number, b: number, a: number } }} options
 * @returns {Promise<number|null>}
 */
export async function insertVectorGraphicOnCurrentPage(engine, options) {
  if (!engine || !options?.paths?.length) return null;

  const pageId = resolveTargetPageId(engine);
  if (pageId == null) {
    console.error('IMG.LY View: aucune page pour insérer le vecteur');
    return null;
  }

  try {
    if (typeof engine.scene.zoomToBlock === 'function') {
      await engine.scene.zoomToBlock(pageId);
    }
  } catch {
    /* ignore */
  }

  const fillColor = options.fillColor || DEFAULT_VECTOR_FILL;
  const coordWidth = options.width > 0 ? options.width : 256;
  const coordHeight = options.height > 0 ? options.height : 256;
  const childIds = [];

  try {
    for (const pathLayer of options.paths) {
      const graphicId = createVectorPathGraphic(
        engine,
        pathLayer,
        coordWidth,
        coordHeight,
        pathLayer.fillColor || fillColor,
      );
      engine.block.appendChild(pageId, graphicId);
      childIds.push(graphicId);
    }

    if (childIds.length > 1) {
      engine.block.alignHorizontally(childIds, 'Center');
      engine.block.alignVertically(childIds, 'Center');
    }

    let blockId = childIds[0];
    if (childIds.length > 1 && typeof engine.block.group === 'function') {
      if (engine.block.isGroupable(childIds)) {
        blockId = engine.block.group(childIds);
      }
    }

    fitBlockOnPage(engine, blockId, pageId);
    if (typeof engine.block.select === 'function') {
      engine.block.select(blockId);
    }
    return blockId;
  } catch (err) {
    console.error('IMG.LY View: insertion vectorielle échouée', err);
    return null;
  }
}

/**
 * @param {import('@cesdk/engine').default} engine
 * @param {string} imageUrl
 * @returns {Promise<number|null>}
 */
export async function insertImageOnCurrentPage(engine, imageUrl) {
  if (!engine || !imageUrl) return null;

  const pageId = resolveTargetPageId(engine);
  if (pageId == null) {
    console.error('IMG.LY View: aucune page pour insérer l’image');
    return null;
  }

  try {
    if (typeof engine.scene.zoomToBlock === 'function') {
      await engine.scene.zoomToBlock(pageId);
    }
  } catch {
    /* ignore */
  }

  let blockId;
  try {
    blockId = await engine.block.addImage(imageUrl);
  } catch (err) {
    console.error('IMG.LY View: addImage failed', imageUrl, err);
    return null;
  }

  try {
    fitBlockOnPage(engine, blockId, pageId);
    if (typeof engine.block.select === 'function') {
      engine.block.select(blockId);
    }
  } catch (err) {
    console.warn('IMG.LY View: redimensionnement image', err);
  }

  return blockId;
}
