import {
  getToolbarStyleTargets,
  isFabricGroupObject,
  isFabricRasterImage,
  isTextLikeObject,
} from './objects.js';
import { publishCanvasJson } from './serialize.js';
import { loadWebFontsThenRedraw, relayoutParentGroups } from './text.js';
import { updateTopBarForSelection } from './ui/toolbar-sync.js';
import { shouldZeroStrokeWidth } from './utils.js';

/**
 * Fin de pipeline commune à toute mutation du canvas :
 * render → publish du JSON vers Bubble → resynchronisation de la top bar.
 */
function finalizeCanvasMutation(instance) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  if (!fabricCanvas) return;
  fabricCanvas.requestRenderAll();
  publishCanvasJson(instance);
  updateTopBarForSelection(instance);
}

/**
 * Pipeline unique de mutation de style des objets. Toute modification de
 * propriétés visuelles doit passer par ici pour garantir le même traitement :
 * set(props) → remesure des textes (initDimensions) → setCoords → relayout des
 * groupes parents (sinon bounds périmés ⇒ texte croppé) → relayout du Group
 * actif → render → publish → sync top bar → remesure web fonts si typo.
 *
 * @param {object} instance - instance Bubble
 * @param {object} command
 * @param {Array}  [command.targets] - cibles ; défaut : getToolbarStyleTargets
 * @param {object} command.props - propriétés à appliquer
 * @param {(target, patch) => object|null} [command.normalizePatch]
 *   - ajuste le patch par cible (retourner null pour ignorer la cible)
 */
function applyCommand(instance, command) {
  if (!instance || !instance.data || !command || !command.props) return;
  const fabricCanvas = instance.data.fabricCanvas;
  if (!fabricCanvas) return;
  const targets = Array.isArray(command.targets)
    ? command.targets
    : getToolbarStyleTargets(fabricCanvas);
  if (targets.length === 0) return;

  const activeObject = fabricCanvas.getActiveObject();
  const textTargets = [];
  targets.forEach((target) => {
    if (!target || typeof target.set !== 'function') return;
    const patch = command.normalizePatch
      ? command.normalizePatch(target, { ...command.props })
      : { ...command.props };
    if (!patch) return;
    target.set(patch);
    target.dirty = true;
    if (isTextLikeObject(target)) {
      if (typeof target.initDimensions === 'function') target.initDimensions();
      textTargets.push(target);
    }
    if (typeof target.setCoords === 'function') target.setCoords();
    relayoutParentGroups(target);
  });

  // Group actif : relayout. Ne pas appeler triggerLayout sur une
  // ActiveSelection : ça peut casser la sélection / le hit-test.
  if (isFabricGroupObject(activeObject)) {
    activeObject.set('dirty', true);
    if (typeof activeObject.triggerLayout === 'function') {
      activeObject.triggerLayout();
    } else if (typeof activeObject.setCoords === 'function') {
      activeObject.setCoords();
    }
  }

  finalizeCanvasMutation(instance);

  // La web font (display=swap) n'est pas forcément chargée pour la nouvelle
  // famille/taille : on remesure une fois la face prête.
  if (textTargets.length > 0
      && (command.props.fontFamily != null || command.props.fontSize != null)) {
    loadWebFontsThenRedraw(fabricCanvas, textTargets);
  }
}

/** Mutation typo (fontSize / fontFamily) : ne garde que les cibles texte. */
function applyTextCommand(instance, targets, props) {
  const textTargets = (Array.isArray(targets) ? targets : []).filter((t) => isTextLikeObject(t));
  if (textTargets.length === 0) return;
  applyCommand(instance, { targets: textTargets, props });
}

/**
 * Style générique de la sélection (fill / stroke / strokeWidth / opacity),
 * avec la normalisation par cible historique : strokeUniform forcé,
 * largeur de trait par défaut pour les textes, pas de fill sur les images.
 */
function applyStyleToSelection(instance, patch) {
  applyCommand(instance, {
    props: patch,
    normalizePatch: (target, nextPatch) => {
      // Keep stroke width visually constant while object is scaled.
      if (nextPatch.stroke != null || nextPatch.strokeWidth != null) {
        nextPatch.strokeUniform = true;
      }
      const nextStrokeColor = typeof nextPatch.stroke === 'string'
        ? nextPatch.stroke
        : (typeof target.stroke === 'string' ? target.stroke : '');
      const hasVisibleStrokeColor = !shouldZeroStrokeWidth(nextStrokeColor);
      const currentStrokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 0;
      // Ne bumper la largeur à 1 que lorsqu'on applique réellement une couleur de stroke.
      // Sinon un simple changement de fill réactiverait un stroke à 1 sur une forme à 0.
      if (nextPatch.stroke != null && hasVisibleStrokeColor && nextPatch.strokeWidth == null && currentStrokeWidth <= 0) {
        nextPatch.strokeWidth = 1;
      }

      if (isTextLikeObject(target) && (nextPatch.stroke != null || nextPatch.strokeWidth != null)) {
        const nextStrokeWidth = nextPatch.strokeWidth != null ? Number(nextPatch.strokeWidth) : currentStrokeWidth;
        const wantsTransparentStroke = shouldZeroStrokeWidth(nextStrokeColor);
        if (wantsTransparentStroke) {
          nextPatch.strokeWidth = 0;
        } else if (!Number.isFinite(nextStrokeWidth) || nextStrokeWidth <= 0) {
          nextPatch.strokeWidth = 1;
        }
        if (nextPatch.stroke == null && !wantsTransparentStroke) {
          const currentStroke = typeof target.stroke === 'string' ? target.stroke.trim() : '';
          if (!currentStroke || currentStroke === '#00000000' || currentStroke.toLowerCase() === 'transparent') {
            nextPatch.stroke = '#000000';
          }
        }
        nextPatch.paintFirst = 'stroke';
        nextPatch.strokeLineJoin = 'round';
      }
      if (isFabricRasterImage(target) && nextPatch.fill != null) {
        delete nextPatch.fill;
      }
      return nextPatch;
    },
  });
}

export {
  applyCommand,
  applyTextCommand,
  applyStyleToSelection,
  finalizeCanvasMutation,
};
