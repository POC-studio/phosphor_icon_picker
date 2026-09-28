import * as THREE from 'three';

/**
 * @param {import('quick_flipbook').FlipBook} book
 * @param {THREE.Object3D} object
 * @returns {object | null}
 */
function findFlipPage(book, object) {
  let node = object;
  while (node) {
    if (node.parent === book) return node;
    node = node.parent;
  }
  return null;
}

/**
 * @param {object} instance
 * @param {HTMLCanvasElement} canvas
 * @param {THREE.Camera} camera
 */
export function attachClickToFlip(instance, canvas, camera) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function pointerFromEvent(event) {
    const book = instance.data.book;
    const rect = canvas.getBoundingClientRect();
    if (!book || !rect.width || !rect.height) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(book, true);
    if (!hits.length) return null;
    return findFlipPage(book, hits[0].object);
  }

  function onPointerMove(event) {
    const page = pointerFromEvent(event);
    canvas.style.cursor = page ? 'pointer' : 'default';
  }

  function onPointerLeave() {
    canvas.style.cursor = 'default';
  }

  function onPointerUp(event) {
    const book = instance.data.book;
    if (!book || typeof book.flipPage !== 'function') return;
    const page = pointerFromEvent(event);
    if (!page) return;
    try {
      book.flipPage(page);
    } catch (err) {
      console.warn('Flipbook: flipPage failed', err);
    }
  }

  canvas.style.cursor = 'default';
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('pointerup', onPointerUp);
  instance.data._clickHandler = onPointerUp;
  instance.data._moveHandler = onPointerMove;
  instance.data._leaveHandler = onPointerLeave;
}

/**
 * @param {object} instance
 * @param {HTMLCanvasElement} canvas
 */
export function detachClickToFlip(instance, canvas) {
  if (!instance.data) return;
  if (instance.data._clickHandler) {
    canvas.removeEventListener('pointerup', instance.data._clickHandler);
    instance.data._clickHandler = null;
  }
  if (instance.data._moveHandler) {
    canvas.removeEventListener('pointermove', instance.data._moveHandler);
    instance.data._moveHandler = null;
  }
  if (instance.data._leaveHandler) {
    canvas.removeEventListener('pointerleave', instance.data._leaveHandler);
    instance.data._leaveHandler = null;
  }
  canvas.style.cursor = 'default';
}
