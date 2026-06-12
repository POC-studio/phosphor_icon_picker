import { syncGuideLayers } from './guides.js';
import { applyStrokeUniformDeep, getActiveSelectionTargets, isSelectionContainer } from './objects.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';

/** Opérations sur la sélection : group / ungroup / duplicate. */
export function setupSelectionOps(app) {
  const { instance, fabricCanvas, fabricLib } = app;

  const removeEmptySelectionContainers = () => {
    const objs = [...fabricCanvas.getObjects()];
    objs.forEach((o) => {
      if (!o || !isSelectionContainer(o)) return;
      const kids = typeof o.getObjects === 'function' ? o.getObjects() : [];
      if (Array.isArray(kids) && kids.length === 0) {
        fabricCanvas.remove(o);
      }
    });
  };

  const groupSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || !isSelectionContainer(active)) return;
    if (typeof fabricLib.Group !== 'function') return;

    const targets = getActiveSelectionTargets(fabricCanvas).filter(
      (o) => o && !o.isArtboard && !o.isSafeZone
    );
    if (targets.length <= 1) return;

    const objectRefs = targets.slice();
    fabricCanvas.discardActiveObject();
    removeEmptySelectionContainers();

    objectRefs.forEach((o) => {
      if (typeof o.setCoords === 'function') o.setCoords();
    });

    const group = new fabricLib.Group(objectRefs, {
      canvas: fabricCanvas,
      originX: 'left',
      originY: 'top',
    });
    if (typeof group.triggerLayout === 'function') {
      group.triggerLayout();
    } else if (typeof group.setCoords === 'function') {
      group.setCoords();
    }
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    syncGuideLayers(instance);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  };

  const isGroupObject = (active) => {
    if (!active) return false;
    const type = String(active.type || '').toLowerCase();
    return type === 'group';
  };

  const ungroupSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active || !isGroupObject(active)) return;
    // Fabric 6 : il faut d’abord retirer chaque enfant du groupe avec group.remove().
    // Sinon les objets restent dans group._objects tout en étant ré-ajoutés au canvas :
    // état incohérent → plus de sélection / hit-test.
    const children = typeof active.getObjects === 'function' ? [...active.getObjects()] : [];
    if (children.length === 0) return;

    children.forEach((obj) => {
      if (typeof active.remove === 'function') {
        active.remove(obj);
      }
    });
    fabricCanvas.remove(active);

    // Fabric 6: après retrait du Group, certains enfants peuvent ne plus être présents
    // sur le canvas (donc invisibles / in-sélectionnables). On les ré-ajoute explicitement.
    if (typeof fabricCanvas.add === 'function') {
      const existing = new Set(
        typeof fabricCanvas.getObjects === 'function' ? fabricCanvas.getObjects() : []
      );
      children.forEach((obj) => {
        if (!obj) return;
        if (existing.has(obj)) return;
        fabricCanvas.add(obj);
        if (typeof obj.setCoords === 'function') obj.setCoords();
        obj.visible = obj.visible !== false;
      });
    }

    if (typeof fabricLib.ActiveSelection === 'function') {
      const selection = new fabricLib.ActiveSelection(children, { canvas: fabricCanvas });
      fabricCanvas.setActiveObject(selection);
      if (typeof selection.setCoords === 'function') {
        selection.setCoords();
      }
    } else if (children.length === 1) {
      fabricCanvas.setActiveObject(children[0]);
    }
    syncGuideLayers(instance);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  };

  /** Décalage en coordonnées document (px) pour Dupliquer depuis le menu contextuel */
  const DUPLICATE_MENU_OFFSET_X = 14;
  const DUPLICATE_MENU_OFFSET_Y = 14;

  const duplicateSelection = () => {
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    if (active.isArtboard || active.isSafeZone) return;
    if (typeof active.isEditing === 'function' && active.isEditing) return;
    if (typeof active.isEditing === 'boolean' && active.isEditing) return;
    if (typeof active.clone !== 'function') return;

    const finish = (cloned) => {
      if (!cloned) return;
      cloned.set({
        left: (Number(cloned.left) || 0) + DUPLICATE_MENU_OFFSET_X,
        top: (Number(cloned.top) || 0) + DUPLICATE_MENU_OFFSET_Y,
      });
      if (typeof cloned.setCoords === 'function') cloned.setCoords();
      applyStrokeUniformDeep(cloned);
      fabricCanvas.add(cloned);
      fabricCanvas.discardActiveObject();
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.requestRenderAll();
      syncGuideLayers(instance);
      updateTopBarForSelection(instance);
    };

    try {
      const result = active.clone();
      if (result && typeof result.then === 'function') {
        result.then(finish).catch(() => {});
      } else {
        finish(result);
      }
    } catch (e) {
      /* ignore */
    }
  };

  return { removeEmptySelectionContainers, groupSelection, isGroupObject, ungroupSelection, duplicateSelection };
}
