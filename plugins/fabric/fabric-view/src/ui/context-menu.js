import { buildClipboardDataFromNavigatorRead, clipboardHasPastableContent, isTypingContext, runCanvasPasteFromClipboardData } from '../clipboard.js';
import { PX_PER_MM } from '../constants.js';
import { applyZOrderToSelection, getActiveSelectionTargets, isSelectionContainer } from '../objects.js';
import { buildFabricClipboardJsonString, publishCanvasJson, schedulePublishCanvasJson } from '../serialize.js';
import { updateTopBarForSelection } from './toolbar-sync.js';

/** Déplacement au clavier : flèche = 1 mm, Shift+flèche = 10 mm (document à 300 dpi). */
const NUDGE_DIRECTIONS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

/** Menu contextuel (clic droit) + clavier : suppression (Backspace) et déplacement (flèches). */
export function setupContextMenu(app) {
  const { instance, context, fabricCanvas, fabricLib, ui, groupSelection, isGroupObject, ungroupSelection, duplicateSelection } = app;

  const contextMenu = document.createElement('div');
  contextMenu.style.position = 'fixed';
  contextMenu.style.display = 'none';
  contextMenu.style.zIndex = '2147483647';
  contextMenu.style.width = 'auto';
  contextMenu.style.minWidth = '0';
  contextMenu.style.maxWidth = '280px';
  contextMenu.style.padding = '6px';
  contextMenu.style.background = '#ffffff';
  contextMenu.style.border = '1px solid #e2e8f0';
  contextMenu.style.borderRadius = '12px';
  contextMenu.style.boxShadow = '0 14px 32px rgba(15, 23, 42, 0.2)';

  const closeContextMenu = () => {
    contextMenu.style.display = 'none';
  };

  const addContextItem = (label, action) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.width = '100%';
    btn.style.height = '32px';
    btn.style.border = 'none';
    btn.style.background = '#ffffff';
    btn.style.color = '#0f172a';
    btn.style.fontSize = '13px';
    btn.style.borderRadius = '8px';
    btn.style.padding = '0 10px';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'left';
    btn.style.whiteSpace = 'nowrap';
    btn.style.display = 'block';
    btn.style.boxSizing = 'border-box';
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#f1f5f9';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#ffffff';
    });
    btn.addEventListener('click', () => {
      closeContextMenu();
      if (action === 'paste') {
        void (async () => {
          try {
            const cd = await buildClipboardDataFromNavigatorRead();
            await runCanvasPasteFromClipboardData(instance, fabricLib, context, cd);
          } catch (e) {
            /* ignore */
          }
        })();
        return;
      }
      if (action === 'copy') {
        const targets = getActiveSelectionTargets(fabricCanvas).filter(
          (o) => o && !o.isArtboard && !o.isSafeZone,
        );
        const json = buildFabricClipboardJsonString(targets);
        if (json && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          void navigator.clipboard.writeText(json);
        }
        return;
      }
      if (action === 'duplicate') {
        duplicateSelection();
        return;
      }
      if (action === 'group') {
        groupSelection();
        return;
      }
      if (action === 'ungroup') {
        ungroupSelection();
        return;
      }
      applyZOrderToSelection(fabricCanvas, action, instance);
      publishCanvasJson(instance);
      updateTopBarForSelection(instance);
    });
    contextMenu.appendChild(btn);
  };

  const renderContextMenuItems = () => {
    contextMenu.innerHTML = '';
    const active = fabricCanvas.getActiveObject();
    if (isSelectionContainer(active)) {
      addContextItem('Group', 'group');
    } else if (isGroupObject(active)) {
      addContextItem('Ungroup', 'ungroup');
    }
    addContextItem('Copy', 'copy');
    addContextItem('Duplicate', 'duplicate');
    addContextItem('Bring to Front', 'to-front');
    addContextItem('Bring Forward', 'forward');
    addContextItem('Send Backward', 'backward');
    addContextItem('Send to Back', 'to-back');
  };
  document.body.appendChild(contextMenu);

  const onKeyDown = (event) => {
    const nudgeDir = NUDGE_DIRECTIONS[event.key];
    if (nudgeDir) {
      if (isTypingContext(event.target)) return;
      if (!fabricCanvas) return;
      const active = fabricCanvas.getActiveObject();
      if (!active || active.isEditing) return;
      event.preventDefault();
      const stepPx = (event.shiftKey ? 10 : 1) * PX_PER_MM;
      active.set({
        left: active.left + nudgeDir[0] * stepPx,
        top: active.top + nudgeDir[1] * stepPx,
      });
      active.setCoords();
      fabricCanvas.requestRenderAll();
      // Debounce : la répétition de touche (flèche maintenue) déclenche une rafale de keydown.
      schedulePublishCanvasJson(instance);
      updateTopBarForSelection(instance);
      return;
    }
    if (event.key !== 'Backspace') return;
    if (isTypingContext(event.target)) return;
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    if (active.isEditing) return;

    event.preventDefault();
    if (isSelectionContainer(active)) {
      const items = active.getObjects();
      fabricCanvas.discardActiveObject();
      items.forEach((obj) => fabricCanvas.remove(obj));
    } else {
      fabricCanvas.remove(active);
    }
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  };
  document.addEventListener('keydown', onKeyDown);
  instance.data.onKeyDown = onKeyDown;

  const positionContextMenuAtEvent = (event) => {
    const rect = contextMenu.getBoundingClientRect();
    const menuWidth = Math.max(1, rect.width || 1);
    const menuHeight = Math.max(1, rect.height || 1);
    const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, event.clientX));
    const top = Math.max(8, Math.min(window.innerHeight - menuHeight - 8, event.clientY));
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
  };

  ui.board.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!fabricCanvas) return;

    void (async () => {
      if (typeof fabricCanvas.findTarget === 'function') {
        const found = fabricCanvas.findTarget(event);
        let nextActive = found;
        if (nextActive && nextActive.group && isGroupObject(nextActive.group)) {
          nextActive = nextActive.group;
        }
        if (nextActive && fabricCanvas.getActiveObject() !== nextActive) {
          fabricCanvas.setActiveObject(nextActive);
        }
      }

      const hasSelection = getActiveSelectionTargets(fabricCanvas).length > 0;
      if (!hasSelection) {
        let canPaste = false;
        try {
          canPaste = await clipboardHasPastableContent();
        } catch (e) {
          canPaste = false;
        }
        if (!canPaste) {
          closeContextMenu();
          return;
        }
        contextMenu.innerHTML = '';
        addContextItem('Paste', 'paste');
        contextMenu.style.display = 'block';
        requestAnimationFrame(() => positionContextMenuAtEvent(event));
        return;
      }

      renderContextMenuItems();
      contextMenu.style.display = 'block';
      requestAnimationFrame(() => positionContextMenuAtEvent(event));
    })();
  }, true);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target && contextMenu.contains(target)) return;
    closeContextMenu();
  }, true);

  return { closeContextMenu };
}
