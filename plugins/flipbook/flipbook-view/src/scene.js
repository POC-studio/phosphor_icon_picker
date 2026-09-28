import * as THREE from 'three';

/** A5 portrait : 148 × 210 mm. */
export const A5_PAGE_RATIO = 148 / 210;

/** Légère levée du livre pour qu’une seule ombre projetée reste visible au repos. */
export const BOOK_LIFT = 0.1;

export const DEFAULT_FOV = 20;
export const DEFAULT_ZOOM = 1.25;

/** Largeur monde d’un livre ouvert (2 pages A5). */
export const BOOK_OPEN_WIDTH = A5_PAGE_RATIO * 2;
/** Hauteur monde d’une page (PlaneGeometry 1×1). */
export const BOOK_PAGE_HEIGHT = 1;
/** Part de la largeur du canvas occupée par le livre ouvert (9 % de marge de chaque côté pour l’ombre). */
export const WIDTH_FILL = 0.82;
/** Part de la hauteur du canvas occupée par le livre (le reste = marge haut/bas, y compris pendant le flip). */
export const HEIGHT_FILL = 0.76 / 1.2;

/**
 * Hauteur de l’élément Bubble pour une largeur donnée, afin que le livre
 * tienne à ~100 % de largeur avec la même marge verticale qu’à l’écran actuel.
 * @param {number} width
 * @returns {number}
 */
export function heightForWidth(width) {
  const w = Math.max(1, Number(width) || 1);
  return Math.max(
    1,
    Math.round((w * BOOK_PAGE_HEIGHT * WIDTH_FILL) / (BOOK_OPEN_WIDTH * HEIGHT_FILL)),
  );
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * Sol transparent qui reçoit uniquement l’ombre projetée du livre.
 * @returns {{ mesh: THREE.Mesh, dispose: () => void }}
 */
function createShadowFloor() {
  const material = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity: 0.28,
    transparent: true,
    depthWrite: false,
  });
  if ('toneMapped' in material) material.toneMapped = false;

  const geometry = new THREE.PlaneGeometry(6, 6);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  mesh.receiveShadow = true;
  mesh.renderOrder = -1;
  mesh.raycast = () => {};

  return {
    mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

/**
 * @param {HTMLElement} host
 * @returns {{
 *   container: HTMLDivElement,
 *   canvas: HTMLCanvasElement,
 *   renderer: THREE.WebGLRenderer | null,
 *   scene: THREE.Scene,
 *   camera: THREE.PerspectiveCamera,
 *   timer: THREE.Timer,
 *   fitCamera: () => void,
 *   setCameraRig: (opts?: { fov?: number, zoom?: number }) => void,
 *   resize: () => void,
 *   startLoop: (tick: (delta: number) => void) => void,
 *   stopLoop: () => void,
 *   dispose: () => void,
 * }}
 */
export function createScene(host) {
  const container = document.createElement('div');
  container.style.cssText =
    'position:relative;width:100%;height:100%;overflow:visible;box-sizing:border-box;background:transparent;isolation:isolate;';

  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'display:block;width:100%;height:100%;touch-action:none;background:transparent;position:relative;z-index:0;';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, 1, 0.2, 24);
  const timer = new THREE.Timer();
  timer.connect(document);

  const ambient = new THREE.AmbientLight(0xffffff, 2.05);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 0.4);
  key.position.set(0, 8, -0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 5;
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 10;
  key.shadow.camera.left = -2.8;
  key.shadow.camera.right = 2.8;
  key.shadow.camera.top = 2.8;
  key.shadow.camera.bottom = -2.8;
  key.shadow.camera.up.set(0, 0, -1);
  key.target.position.set(0, BOOK_LIFT, 0);
  scene.add(key);
  scene.add(key.target);

  const fill = new THREE.HemisphereLight(0xffffff, 0xe8e4dc, 0.55);
  scene.add(fill);

  const shadowFloor = createShadowFloor();
  scene.add(shadowFloor.mesh);

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
  } catch (err) {
    renderer = null;
    const errorBox = document.createElement('div');
    errorBox.textContent = 'WebGL is not available.';
    errorBox.style.cssText =
      'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7f1d1d;font:13px/1.4 system-ui,sans-serif;padding:16px;text-align:center;';
    container.appendChild(errorBox);
    console.warn('Flipbook: WebGL init failed', err);
  }

  if (host) host.appendChild(container);

  let rafId = 0;
  let tickFn = null;

  function getSize() {
    const w = Math.max(1, container.clientWidth || host?.clientWidth || 320);
    const h = Math.max(1, container.clientHeight || host?.clientHeight || 240);
    return { w, h };
  }

  let cameraFov = DEFAULT_FOV;
  let cameraZoom = DEFAULT_ZOOM;

  function setCameraRig(opts = {}) {
    if (opts.fov !== undefined) {
      cameraFov = clampNumber(opts.fov, 8, 80, cameraFov);
    }
    if (opts.zoom !== undefined) {
      cameraZoom = clampNumber(opts.zoom, 0.3, 3, cameraZoom);
    }
    fitCamera();
  }

  function fitCamera() {
    const { w, h } = getSize();
    const aspect = w / h;
    camera.aspect = aspect;
    camera.fov = cameraFov;

    const vFov = (camera.fov * Math.PI) / 180;
    const dist =
      BOOK_OPEN_WIDTH /
      WIDTH_FILL /
      2 /
      Math.max(aspect, 0.05) /
      Math.tan(vFov / 2);

    camera.position.set(0, dist, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, BOOK_LIFT, 0);
    camera.near = 0.02;
    camera.far = Math.max(40, dist * 14);
    camera.updateProjectionMatrix();

    key.position.set(0, dist + 1.4, -0.9);
    key.target.position.set(0, BOOK_LIFT, 0);
    key.target.updateMatrixWorld();
    key.shadow.camera.up.set(0, 0, -1);
    key.shadow.camera.near = 0.2;
    key.shadow.camera.far = dist + 6;
    key.shadow.camera.updateProjectionMatrix();
  }

  function resize() {
    if (!renderer) return;
    const { w, h } = getSize();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function loop(timestamp) {
    rafId = requestAnimationFrame(loop);
    if (!renderer) return;
    if (!canvas.isConnected) return;
    timer.update(timestamp);
    const delta = timer.getDelta();
    if (typeof tickFn === 'function') tickFn(delta);
    renderer.render(scene, camera);
  }

  function startLoop(tick) {
    tickFn = tick;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    tickFn = null;
  }

  function dispose() {
    stopLoop();
    timer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
    });
    shadowFloor.dispose();
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }
    if (container.parentNode) container.parentNode.removeChild(container);
  }

  resize();
  fitCamera();

  return {
    container,
    canvas,
    renderer,
    scene,
    camera,
    timer,
    fitCamera,
    setCameraRig,
    resize,
    startLoop,
    stopLoop,
    dispose,
  };
}
