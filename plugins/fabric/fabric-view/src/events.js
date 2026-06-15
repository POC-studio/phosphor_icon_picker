import { handleClipboardPasteEvent, insertImageFileOnCanvas, shouldBlockFabricCopyShortcut } from './clipboard.js';
import { ensureCanvasSize, syncGuideLayers } from './guides.js';
import { applyStrokeUniformDeep, getActiveSelectionTargets, isCornerControl, isFabricGroupObject, isFabricRasterImage, isPartOfActiveObject, isRoundedPolygonShape, isSelectionContainer, isShapeObject, normalizeObjectScale, oppositeOriginForCorner, performAltDuplicateDrag } from './objects.js';
import { buildFabricClipboardJsonString, publishCanvasJson, schedulePublishCanvasJson } from './serialize.js';
import { applyImageCornerRadiusPx, applyRectCornerRadiusPx, getRectCornerRadiusPx, replaceRoundedPolygon } from './shapes.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';

/** Câblage des events Fabric (sélection, pan, alt-dup, scaling, modified, path) + listeners document. */
export function wireCanvasEvents(app) {
  const { instance, context, fabricCanvas, fabricLib, ui, shapeMenu, iconMenu, bookmarkMenu, tableMenu } = app;

  // Garde anti double-binding : si initialize est rappelé, on ne réempile pas les
  // listeners (sinon object:moving cloné N fois → risque d'emballement Alt+drag).
  if (instance.data._eventsWired === true) return;
  instance.data._eventsWired = true;

  const onSelectionChanged = () => {
    updateTopBarForSelection(instance);
    // Ne pas appeler publishCanvasJson ici : ajouter un objet déclenche déjà object:added
    // puis setActiveObject → selection:created, ce qui doublait la publication.
    // Le JSON du canevas ne change pas lors d’un simple changement de sélection.
  };
  const onSelectionCleared = () => {
    onSelectionChanged();
    // Après dégroupe / désélection, Fabric peut laisser selectable/evented à false sur les objets
    // remis au premier plan — on rétablit pour que le hit-test refonctionne au frame suivant.
    requestAnimationFrame(() => {
      if (!fabricCanvas) return;
      fabricCanvas.getObjects().forEach((obj) => {
        if (!obj || obj.isArtboard || obj.isSafeZone) return;
        if (isFabricGroupObject(obj) || isSelectionContainer(obj)) return;
        if (typeof obj.set === 'function') {
          obj.set({ selectable: true, evented: true });
        }
      });
    });
  };
  fabricCanvas.on('selection:created', onSelectionChanged);
  fabricCanvas.on('selection:updated', onSelectionChanged);
  fabricCanvas.on('selection:cleared', onSelectionCleared);
  fabricCanvas.on('mouse:down', (opt) => {
    instance.data._canvasPointerGestureId = (Number(instance.data._canvasPointerGestureId) || 0) + 1;
    instance.data.altKeyAtMouseDown = false;
    instance.data._altDupDownClientX = null;
    instance.data._altDupDownClientY = null;
    if (instance.data.toolMode === 'pan' || instance.data.toolMode === 'draw') return;
    const t = opt.target;
    if (!t || t.isArtboard || t.isSafeZone) return;
    const active = fabricCanvas.getActiveObject();
    if (!active) return;
    if (!isPartOfActiveObject(active, t)) return;
    instance.data.altKeyAtMouseDown = !!opt.e.altKey;
    if (opt.e && instance.data.altKeyAtMouseDown) {
      instance.data._altDupDownClientX = Number(opt.e.clientX) || 0;
      instance.data._altDupDownClientY = Number(opt.e.clientY) || 0;
    }
  });
  fabricCanvas.on('object:moving', (e) => {
    if (instance.data.toolMode === 'pan' || instance.data.toolMode === 'draw') return;
    if (!instance.data.altKeyAtMouseDown) return;
    const gid = Number(instance.data._canvasPointerGestureId) || 0;
    if (Number.isFinite(instance.data._altDupClonedGestureId) && instance.data._altDupClonedGestureId === gid) {
      return;
    }
    if (instance.data._altDuplicateDone) return;
    performAltDuplicateDrag(instance, fabricCanvas, e);
  });
  fabricCanvas.on('mouse:down', (event) => {
    if (instance.data.toolMode !== 'pan') return;
    const e = event && event.e ? event.e : null;
    if (!e) return;
    instance.data.isPanning = true;
    instance.data.panLastClientX = Number(e.clientX) || 0;
    instance.data.panLastClientY = Number(e.clientY) || 0;
    ui.board.style.cursor = 'grabbing';
  });
  fabricCanvas.on('mouse:down', (event) => {
    if (instance.data.toolMode === 'pan') return;
    const target = event && event.target ? event.target : null;
    const clickedArtboard = !!(target && target.isArtboard);
    const clickedEmpty = !target || clickedArtboard;
    if (!clickedEmpty) return;
    if (!fabricCanvas.getActiveObject()) return;
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  });
  fabricCanvas.on('mouse:move', (event) => {
    if (instance.data.toolMode !== 'pan' || !instance.data.isPanning) return;
    const e = event && event.e ? event.e : null;
    if (!e) return;
    const currentX = Number(e.clientX) || 0;
    const currentY = Number(e.clientY) || 0;
    const deltaX = currentX - (Number(instance.data.panLastClientX) || 0);
    const deltaY = currentY - (Number(instance.data.panLastClientY) || 0);
    instance.data.panLastClientX = currentX;
    instance.data.panLastClientY = currentY;
    instance.data.panX = (Number(instance.data.panX) || 0) + deltaX;
    instance.data.panY = (Number(instance.data.panY) || 0) + deltaY;
    ensureCanvasSize(instance);
  });
  fabricCanvas.on('mouse:up', () => {
    if (!instance.data.isPanning) return;
    instance.data.isPanning = false;
    ui.board.style.cursor = instance.data.toolMode === 'pan' ? 'grab' : '';
  });
  const onWindowPointerUp = () => {
    instance.data.altKeyAtMouseDown = false;
    instance.data._altDuplicateDone = false;
  };
  window.addEventListener('pointerup', onWindowPointerUp, true);
  instance.data._altDupWindowPointerUp = onWindowPointerUp;

  fabricCanvas.on('mouse:up', () => {
    instance.data.altKeyAtMouseDown = false;
    instance.data._altDuplicateDone = false;
  });

  // Drag & drop d'images (depuis le Finder / bureau) sur la zone du canvas.
  // Listeners DOM sur ui.board (et non les events Fabric) : couvre aussi un drop
  // juste à côté du canvas et empêche le navigateur d'ouvrir le fichier.
  // Le filtre sur 'Files' laisse passer le drag natif de texte sélectionné (iText).
  const dragHasFiles = (e) => {
    if (!e || !e.dataTransfer) return false;
    return Array.from(e.dataTransfer.types || []).includes('Files');
  };
  const setDropHighlight = (active) => {
    ui.board.style.outline = active ? '2px dashed #2563eb' : '';
    ui.board.style.outlineOffset = active ? '-2px' : '';
  };
  ui.board.addEventListener('dragover', (e) => {
    if (!dragHasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropHighlight(true);
  });
  ui.board.addEventListener('dragleave', (e) => {
    if (e.relatedTarget && ui.board.contains(e.relatedTarget)) return;
    setDropHighlight(false);
  });
  ui.board.addEventListener('drop', async (e) => {
    setDropHighlight(false);
    if (!dragHasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || [])
      .filter((f) => String(f.type || '').toLowerCase().startsWith('image/'));
    if (!files.length) return;
    const point = typeof fabricCanvas.getScenePoint === 'function' ? fabricCanvas.getScenePoint(e) : null;
    const bubbleContext = (instance.data && instance.data.bubbleContext) || context;
    for (const file of files) {
      await insertImageFileOnCanvas(instance, fabricLib, bubbleContext, file, {
        position: point ? { x: point.x, y: point.y } : undefined,
        logTag: '[FabricView drop]',
      });
    }
  });

  fabricCanvas.on('object:scaling', (event) => {
    const target = event && event.target ? event.target : null;
    const transform = event && event.transform ? event.transform : null;
    if (!target || !isShapeObject(target) || !transform) return;
    // Keep stroke visually stable during live scaling (not only after drop).
    applyStrokeUniformDeep(target);
    const original = transform.original && typeof transform.original === 'object'
      ? transform.original
      : null;

    if (isCornerControl(transform.corner)) {
      const opposite = oppositeOriginForCorner(transform.corner);
      if (!opposite || typeof target.getPointByOrigin !== 'function' || typeof target.setPositionByOrigin !== 'function') {
        return;
      }
      const anchorPoint = target.getPointByOrigin(opposite.x, opposite.y);
      const sx = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
      const sy = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
      const signX = sx < 0 ? -1 : 1;
      const signY = sy < 0 ? -1 : 1;

      // Preserve the existing object aspect ratio at the beginning of corner scaling.
      const baseX = Number.isFinite(Number(original && original.scaleX))
        ? Math.abs(Number(original.scaleX))
        : Math.abs(sx);
      const baseY = Number.isFinite(Number(original && original.scaleY))
        ? Math.abs(Number(original.scaleY))
        : Math.abs(sy);
      const safeBaseX = Math.max(baseX, 1e-6);
      const safeBaseY = Math.max(baseY, 1e-6);

      const factorX = Math.abs(sx) / safeBaseX;
      const factorY = Math.abs(sy) / safeBaseY;
      const uniformFactor = Math.max(factorX, factorY);
      target.set({
        scaleX: signX * safeBaseX * uniformFactor,
        scaleY: signY * safeBaseY * uniformFactor,
      });
      target.setPositionByOrigin(anchorPoint, opposite.x, opposite.y);
    }

    // Keep corner radius visually locked in pixels, regardless of deformation.
    if (target.type === 'rect') {
      const lockedRadiusPx = original && Number.isFinite(Number(original.cornerRadiusPx))
        ? Math.max(0, Number(original.cornerRadiusPx))
        : getRectCornerRadiusPx(target);
      applyRectCornerRadiusPx(target, lockedRadiusPx);
    }

    if (isFabricRasterImage(target) && Number.isFinite(Number(target.cornerRadiusPx)) && Number(target.cornerRadiusPx) > 0) {
      const lockedPx = original && Number.isFinite(Number(original.cornerRadiusPx))
        ? Math.max(0, Number(original.cornerRadiusPx))
        : Math.max(0, Number(target.cornerRadiusPx));
      applyImageCornerRadiusPx(target, fabricLib, lockedPx);
    }

    if (original && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
      const sxFinal = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
      const syFinal = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
      const baseScaleX = Math.max(Math.abs(Number(original.scaleX) || 1), 1e-6);
      const baseScaleY = Math.max(Math.abs(Number(original.scaleY) || 1), 1e-6);
      const baseRadiusPx = Number.isFinite(Number(original.cornerRadiusPx))
        ? Math.max(0, Number(original.cornerRadiusPx))
        : (() => {
          const baseCorner = Number.isFinite(Number(original.cornerRadius))
            ? Number(original.cornerRadius)
            : Number(target.cornerRadius);
          return Math.max(0, Number(baseCorner) || 0) * Math.min(baseScaleX, baseScaleY);
        })();
      target.cornerRadiusPx = baseRadiusPx;
      target.cornerRadius = Math.max(0, baseRadiusPx / Math.min(sxFinal, syFinal));
    }

    if (typeof target.setCoords === 'function') target.setCoords();
  });
  fabricCanvas.on('object:added', (event) => {
    const target = event && event.target ? event.target : null;
    if (target && (target.isArtboard || target.isSafeZone)) return;
    if (target && typeof target.set === 'function' && 'strokeWidth' in target) {
      target.set({ strokeUniform: true });
    }
    syncGuideLayers(instance);
    schedulePublishCanvasJson(instance);
  });
  fabricCanvas.on('object:modified', (event) => {
    let target = event && event.target ? event.target : null;
    normalizeObjectScale(target);
    if (target && target.type === 'rect' && Number.isFinite(Number(target.rx)) && Number.isFinite(Number(target.ry))) {
      const lockedRadiusPx = getRectCornerRadiusPx(target);
      applyRectCornerRadiusPx(target, lockedRadiusPx);
    }
    if (target && isFabricRasterImage(target) && Number.isFinite(Number(target.cornerRadiusPx)) && Number(target.cornerRadiusPx) > 0) {
      applyImageCornerRadiusPx(target, instance.data.fabricLib, Number(target.cornerRadiusPx));
    }
    if (target && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
      if (!Number.isFinite(Number(target.cornerRadiusPx))) {
        const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
        const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
        target.cornerRadiusPx = Math.max(0, Number(target.cornerRadius) || 0) * Math.min(sx, sy);
      }
      const replacement = replaceRoundedPolygon(instance, target, Number(target.cornerRadius), fabricLib);
      if (replacement) {
        replacement.cornerRadiusPx = target.cornerRadiusPx;
        target = replacement;
        fabricCanvas.setActiveObject(replacement);
      }
    }
    if (target && typeof target.setCoords === 'function') {
      target.setCoords();
    }
    syncGuideLayers(instance);
    fabricCanvas.requestRenderAll();
    schedulePublishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });
  fabricCanvas.on('object:removed', () => {
    syncGuideLayers(instance);
    schedulePublishCanvasJson(instance);
  });
  fabricCanvas.on('path:created', (opt) => {
    // Fabric ajoute le path mais ne le sélectionne pas : il faut le lire sur l'event,
    // getActiveObject() est null en mode dessin.
    const path = opt && opt.path ? opt.path : fabricCanvas.getActiveObject();
    const finalPath = path && path.type === 'path' ? path : null;
    // On garde le tracé natif de Fabric (déjà lissé) : juste les extrémités arrondies,
    // pas de re-lissage maison (qui rendait le trait moins doux).
    if (finalPath && typeof finalPath.set === 'function') {
      finalPath.set({
        strokeUniform: true,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
      });
    }
    // Fin du tracé : on quitte le mode crayon et on sélectionne le dessin pour
    // permettre d'en éditer immédiatement la couleur / l'épaisseur.
    if (finalPath && typeof app.setToolMode === 'function') {
      app.setToolMode('select');
      fabricCanvas.setActiveObject(finalPath);
    }
    syncGuideLayers(instance);
    fabricCanvas.requestRenderAll();
    schedulePublishCanvasJson(instance);
    updateTopBarForSelection(instance);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;
    const clickedShapeTrigger = ui.shapeBtn.contains(target);
    const clickedMenu = shapeMenu.contains(target);
    const clickedIconTrigger = ui.iconBtn.contains(target);
    const clickedIconMenu = iconMenu.contains(target);
    const clickedBookmarkTrigger = ui.bookmarkBtn.contains(target);
    const clickedBookmarkMenu = bookmarkMenu.contains(target);
    const clickedTableTrigger = ui.tableBtn.contains(target);
    const clickedTableMenu = tableMenu.contains(target);
    if (clickedShapeTrigger || clickedMenu || clickedIconTrigger || clickedIconMenu
        || clickedBookmarkTrigger || clickedBookmarkMenu || clickedTableTrigger || clickedTableMenu) return;
    shapeMenu.style.display = 'none';
    iconMenu.style.display = 'none';
    bookmarkMenu.style.display = 'none';
    tableMenu.style.display = 'none';
  }, true);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => ensureCanvasSize(instance));
    observer.observe(ui.board);
    instance.data.resizeObserver = observer;
  }

  const onDocumentPaste = (e) => {
    void handleClipboardPasteEvent(e, instance, fabricLib, context);
  };
  document.addEventListener('paste', onDocumentPaste, true);
  instance.data.documentPasteHandler = onDocumentPaste;

  const onDocumentCopy = (e) => {
    if (!e || !fabricCanvas) return;
    if (shouldBlockFabricCopyShortcut(e.target, fabricCanvas)) return;
    if (!fabricCanvas.getActiveObject()) return;
    const targets = getActiveSelectionTargets(fabricCanvas).filter(
      (o) => o && !o.isArtboard && !o.isSafeZone,
    );
    const json = buildFabricClipboardJsonString(targets);
    if (!json || !e.clipboardData) return;
    e.preventDefault();
    e.clipboardData.setData('text/plain', json);
  };
  document.addEventListener('copy', onDocumentCopy, true);
  instance.data.documentCopyHandler = onDocumentCopy;

  return {  };
}
