import { applyStyleToSelection } from './commands.js';
import { DEFAULT_TEXT_FONT_FAMILY, PHOSPHOR_STYLES } from './constants.js';
import { getDocumentCenter, getDocumentSize } from './guides.js';
import { getStyleAssetFileName } from './icons.js';
import { flattenStyleTargetsFromGroup, getObjectStyle, isRoundedPolygonShape } from './objects.js';
import { createRegularPolygonPoints, createStarPoints } from './shapes.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';

/** Insertion d objets : formes, tableau (grille), icônes Phosphor SVG. */
export function setupInserts(app) {
  const { instance, fabricCanvas, fabricLib, syncToolButtonHighlightToMode } = app;

  // Héritage de style « même catégorie » : un nouvel objet reprend le style de
  // l'objet précédemment sélectionné s'il appartient à la même famille.
  const buildInheritPatch = (style) => {
    const strokeTransparent = style.stroke === 'transparent';
    return {
      fill: style.fill === 'transparent' ? '' : style.fill,
      stroke: strokeTransparent ? '' : style.stroke,
      strokeWidth: strokeTransparent ? 0 : (Number.isFinite(style.strokeWidth) ? style.strokeWidth : 0),
    };
  };

  // Style d'une « forme » sélectionnée (rect/cercle/ellipse/triangle/polygone/
  // polygone arrondi). Exclut splines (path nu), icônes, images et textes.
  const captureShapeStyleFromSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || active.iconKind) return null;
    const type = String(active.type || '').toLowerCase();
    const isShape = type === 'rect' || type === 'circle' || type === 'ellipse'
      || type === 'triangle' || type === 'polygon' || isRoundedPolygonShape(active);
    if (!isShape) return null;
    return getObjectStyle(active);
  };

  // Couleur d'une icône sélectionnée : lue sur un enfant du groupe car le
  // recolorage applique le fill aux enfants, pas à group.fill (qui reste périmé).
  const captureIconFillFromSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || !active.iconKind) return null;
    const kids = flattenStyleTargetsFromGroup(active);
    const child = kids.find((c) => c && typeof c.fill === 'string' && c.fill) || kids[0];
    const fill = child && typeof child.fill === 'string' ? child.fill
      : (typeof active.fill === 'string' ? active.fill : null);
    return fill ? { fill } : null;
  };

  const addShapeByType = (shapeType) => {
    const inheritStyle = captureShapeStyleFromSelection();
    const center = getDocumentCenter(instance);
    const baseLeft = Math.round(center.x - 60);
    const baseTop = Math.round(center.y - 60);
    let shape = null;

    if (shapeType === 'square') {
      shape = new fabricLib.Rect({
        left: baseLeft,
        top: baseTop,
        width: 120,
        height: 120,
        fill: '#14b8a6',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        cornerRadiusPx: 0,
      });
    } else if (shapeType === 'round') {
      shape = new fabricLib.Rect({
        left: baseLeft,
        top: baseTop + 10,
        width: 130,
        height: 95,
        rx: 18,
        ry: 18,
        fill: '#0ea5e9',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        cornerRadiusPx: 18,
      });
    } else if (shapeType === 'circle') {
      shape = new fabricLib.Circle({
        left: baseLeft,
        top: baseTop,
        radius: 58,
        fill: '#f59e0b',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
      });
    } else if (shapeType === 'triangle') {
      const points = createRegularPolygonPoints(3, 62);
      shape = new fabricLib.Polygon(points, {
        left: baseLeft,
        top: baseTop + 10,
        originX: 'center',
        originY: 'center',
        fill: '#8b5cf6',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        shapeKind: 'triangle',
        shapePoints: points,
        cornerRadius: 0,
      });
    } else if (shapeType === 'star') {
      const points = createStarPoints(62, 28, 5);
      shape = new fabricLib.Polygon(points, {
        left: baseLeft,
        top: baseTop,
        originX: 'center',
        originY: 'center',
        fill: '#ef4444',
        stroke: '#111827',
        strokeWidth: 2,
        strokeUniform: true,
        shapeKind: 'star',
        shapePoints: points,
        cornerRadius: 0,
      });
    }

    if (!shape) return;
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    if (inheritStyle) {
      applyStyleToSelection(instance, buildInheritPatch(inheritStyle));
    }
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    syncToolButtonHighlightToMode();
  };

  const addTableGrid = (cols, rows) => {
    const safeCols = Math.max(1, Math.floor(Number(cols) || 1));
    const safeRows = Math.max(1, Math.floor(Number(rows) || 1));
    const doc = getDocumentSize(instance);

    // Fit à 80% max (on garde le ratio 4:1 des cellules).
    const tableMaxW = doc.width * 0.8;
    const tableMaxH = doc.height * 0.8;

    const cellH = Math.min(tableMaxW / (safeCols * 3), tableMaxH / safeRows);
    const cellW = 3 * cellH;
    const tableW = safeCols * cellW;
    const tableH = safeRows * cellH;

    const center = getDocumentCenter(instance);
    const groupLeft = center.x - tableW / 2;
    const groupTop = center.y - tableH / 2;

    // Fond couleur modifiable (via barre de propriétés quand le groupe est sélectionné).
    const bgFill = '#ffffff';
    const gridStroke = '#cbd5e1';
    const gridStrokeWidth = 1;

    const backgroundRect = new fabricLib.Rect({
      left: 0,
      top: 0,
      width: tableW,
      height: tableH,
      fill: bgFill,
      stroke: '#00000000',
      strokeWidth: 0,
      originX: 'left',
      originY: 'top',
    });

    const lines = [];
    for (let c = 0; c <= safeCols; c++) {
      const x = c * cellW;
      lines.push(new fabricLib.Line([x, 0, x, tableH], {
        stroke: gridStroke,
        strokeWidth: gridStrokeWidth,
        fill: bgFill,
        strokeUniform: true,
      }));
    }
    for (let r = 0; r <= safeRows; r++) {
      const y = r * cellH;
      lines.push(new fabricLib.Line([0, y, tableW, y], {
        stroke: gridStroke,
        strokeWidth: gridStrokeWidth,
        fill: bgFill,
        strokeUniform: true,
      }));
    }

    const group = new fabricLib.Group([backgroundRect, ...lines], {
      left: groupLeft,
      top: groupTop,
      originX: 'left',
      originY: 'top',
      // Important: la logique d'ungroup du projet suppose que le groupe est "lié" au canvas.
      canvas: fabricCanvas,
    });

    if (typeof group.triggerLayout === 'function') {
      group.triggerLayout();
    } else if (typeof group.setCoords === 'function') {
      group.setCoords();
    }
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    syncToolButtonHighlightToMode();
  };

  const addPhosphorSvg = async (iconName, style = 'regular') => {
    if (!iconName || typeof fabricLib.loadSVGFromURL !== 'function') return;
    const inheritIconFill = captureIconFillFromSelection();
    const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : 'regular';
    const fileName = getStyleAssetFileName(iconName, safeStyle);
    if (!fileName) return;
    const iconUrl = `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/${safeStyle}/${fileName}`;

    let objects = null;
    let options = null;
    try {
      // Fabric v6: Promise-based API
      const result = await fabricLib.loadSVGFromURL(iconUrl);
      if (Array.isArray(result)) {
        objects = result[0];
        options = result[1];
      } else if (result && typeof result === 'object') {
        objects = result.objects;
        options = result.options;
      }
    } catch (e) {
      objects = null;
      options = null;
    }

    if (!Array.isArray(objects) || objects.length === 0) {
      // Fallback for callback-style loaders
      await new Promise((resolve) => {
        try {
          fabricLib.loadSVGFromURL(iconUrl, (loadedObjects, loadedOptions) => {
            objects = loadedObjects;
            options = loadedOptions;
            resolve();
          });
        } catch (err) {
          resolve();
        }
      });
    }

    if (!Array.isArray(objects) || objects.length === 0) {
      // Last-resort fallback: add visible text marker so click always gives feedback.
      const center = getDocumentCenter(instance);
      const fallback = new fabricLib.Textbox(iconName, {
        left: Math.round(center.x),
        top: Math.round(center.y),
        originX: 'center',
        originY: 'center',
        fontFamily: DEFAULT_TEXT_FONT_FAMILY,
        fontSize: 32,
        fontWeight: 700,
        fill: '#0f172a',
      });
      fabricCanvas.add(fallback);
      fabricCanvas.setActiveObject(fallback);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      syncToolButtonHighlightToMode();
      return;
    }

    const grouped = fabricLib.util.groupSVGElements(objects, options || {});
    const initialScale = 0.3;
    grouped.set({
      scaleX: initialScale,
      scaleY: initialScale,
    });
    grouped.set({
      originX: 'center',
      originY: 'center',
      centeredScaling: true,
      centeredRotation: true,
      objectCaching: false,
    });
    const center = getDocumentCenter(instance);
    grouped.set({
      left: Math.round(center.x),
      top: Math.round(center.y),
      fill: '#0f172a',
      stroke: '#00000000',
      strokeWidth: 0,
      strokeUniform: true,
      iconKind: `phosphor-${safeStyle}`,
      iconName,
      iconStyle: safeStyle,
    });
    fabricCanvas.add(grouped);
    fabricCanvas.setActiveObject(grouped);
    if (inheritIconFill) {
      applyStyleToSelection(instance, { fill: inheritIconFill.fill });
    }
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    syncToolButtonHighlightToMode();
  };

  return { addShapeByType, addTableGrid, addPhosphorSvg };
}
