import { FlipBook } from 'quick_flipbook';
import * as THREE from 'three';
import { A5_PAGE_RATIO, BOOK_LIFT, createScene, heightForWidth } from './scene.js';
import { attachClickToFlip } from './interaction.js';
import { createLoader } from './loader.js';
import {
  hashPageUrls,
  materializePageSources,
  padAndCapPages,
  parsePageImages,
} from './pages.js';

const FLIP_DURATION = 0.5;

/**
 * Face visible à droite (1-indexée), ou unique si le livre est fermé.
 * @param {import('quick_flipbook').FlipBook} book
 * @returns {number}
 */
export function getDisplayedPage(book) {
  if (!book || typeof book.totalPages !== 'number') return 0;
  const total = book.totalPages;
  if (total <= 0) return 0;
  const sheets = total / 2;
  const progress = book.progress;
  if (progress <= 0.02) return 1;
  if (progress >= sheets - 0.02) return total;
  return Math.floor(progress) * 2 + 1;
}

/**
 * @param {number} page1Indexed
 * @param {import('quick_flipbook').FlipBook} book
 */
function goToUserPage(book, page1Indexed) {
  const total = book.totalPages || 0;
  if (total <= 0) return;
  const page = Math.max(1, Math.min(total, Math.round(Number(page1Indexed) || 1)));
  const sheetProgress = Math.ceil((page - 1) / 2);
  book.progress = sheetProgress;
}

/**
 * Attend que FlipBook ait collé les textures (TextureLoader interne).
 * @param {import('quick_flipbook').FlipBook} book
 * @param {string[]} urls
 * @param {number} [timeoutMs]
 * @returns {Promise<void>}
 */
function waitForBookMaps(book, urls, timeoutMs = 8000) {
  const needed = (urls || []).filter((url) => url && String(url).trim()).length;
  if (!book || needed === 0) return Promise.resolve();

  return new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      let ready = 0;
      for (const sheet of book) {
        if (!sheet || !sheet.page) continue;
        const mats = Array.isArray(sheet.page.material)
          ? sheet.page.material
          : [sheet.page.material];
        for (const mat of mats) {
          if (mat && mat.map && mat.map.image) ready += 1;
        }
      }
      if (ready >= needed || performance.now() - started > timeoutMs) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export default function initializeFlipbook(instance, context) {
  const host = instance.canvas && instance.canvas[0] ? instance.canvas[0] : instance.canvas;
  const sceneApi = createScene(host);

  instance.data.bubbleContext = context || null;
  instance.data.sceneApi = sceneApi;
  instance.data.book = null;
  instance.data.lastPagesHash = null;
  instance.data.pagesGeneration = 0;
  instance.data.publishedPage = null;
  instance.data._lastProgress = 0;
  instance.data._wasProgressing = false;
  instance.data.bubbleImageDataUriCache = new Map();

  const loader = createLoader(sceneApi.container);
  instance.data.loader = loader;
  loader.show();

  sceneApi.canvas.style.cursor = 'default';
  attachClickToFlip(instance, sceneApi.canvas, sceneApi.camera);

  function getHostEl() {
    return instance.canvas && instance.canvas[0] ? instance.canvas[0] : instance.canvas;
  }

  function syncElementHeight() {
    const hostEl = getHostEl();
    if (!hostEl || typeof hostEl.clientWidth !== 'number') return;
    const width = Math.max(1, hostEl.clientWidth || 320);
    const height = heightForWidth(width);
    const widthChanged = instance.data._layoutWidth !== width;
    const heightChanged = instance.data._layoutHeight !== height;
    if (!widthChanged && !heightChanged) return;

    instance.data._layoutWidth = width;
    instance.data._layoutHeight = height;

    if (instance.canvas && typeof instance.canvas.css === 'function') {
      instance.canvas.css({
        height: `${height}px`,
        overflow: 'visible',
      });
    } else {
      hostEl.style.height = `${height}px`;
    }
    if (typeof instance.setHeight === 'function') {
      instance.setHeight(height);
    }

    sceneApi.resize();
    sceneApi.fitCamera();
  }

  instance.data._layoutWidth = 0;
  instance.data._layoutHeight = 0;
  syncElementHeight();

  const roTarget = getHostEl() || sceneApi.container;
  const resizeObserver = new ResizeObserver(() => {
    syncElementHeight();
  });
  resizeObserver.observe(roTarget);
  instance.data.resizeObserver = resizeObserver;

  function publishPages() {
    const book = instance.data.book;
    const total = book && typeof book.totalPages === 'number' ? book.totalPages : 0;
    instance.publishState('total_pages', total);
    const page = getDisplayedPage(book);
    instance.data.publishedPage = page;
    instance.publishState('current_page', page);
  }

  function recreateBook() {
    const prev = instance.data.book;
    let keepProgress = 0;
    if (prev) {
      keepProgress = prev.progress || 0;
      sceneApi.scene.remove(prev);
      if (typeof prev.dispose === 'function') prev.dispose();
    }

    const book = new FlipBook({
      flipDuration: FLIP_DURATION,
      yBetweenPages: 0.004,
      pageSubdivisions: 20,
    });
    book.scale.x = A5_PAGE_RATIO;
    book.position.y = BOOK_LIFT;
    sceneApi.scene.add(book);
    instance.data.book = book;
    if (keepProgress > 0) book.progress = keepProgress;
    return book;
  }

  function softenPageMaterials(book) {
    const aniso = sceneApi.renderer
      ? Math.min(8, sceneApi.renderer.capabilities.getMaxAnisotropy())
      : 1;
    for (const page of book) {
      if (!page || !page.page) continue;
      page.page.castShadow = true;
      page.page.receiveShadow = false;
      const mats = Array.isArray(page.page.material)
        ? page.page.material
        : [page.page.material];
      for (const mat of mats) {
        if (!mat) continue;
        if (mat.map) {
          mat.map.generateMipmaps = true;
          mat.map.minFilter = THREE.LinearMipmapLinearFilter;
          mat.map.magFilter = THREE.LinearFilter;
          mat.map.anisotropy = aniso;
          mat.map.needsUpdate = true;
        }
        if (typeof mat.aoMapIntensity === 'number') {
          mat.aoMapIntensity = 0.08;
        }
        if (typeof mat.roughness === 'number') mat.roughness = 0.92;
        if (typeof mat.metalness === 'number') mat.metalness = 0;
        if ('envMapIntensity' in mat) mat.envMapIntensity = 0;
      }
    }
  }

  function applyPages(urls) {
    const book = instance.data.book;
    if (!book || typeof book.setPages !== 'function') return;
    book.setPages(urls);
    publishPages();
    softenPageMaterials(book);
    setTimeout(() => softenPageMaterials(book), 250);
    setTimeout(() => softenPageMaterials(book), 900);
  }

  instance.data.nextPage = function nextPage() {
    const book = instance.data.book;
    if (book && typeof book.nextPage === 'function') book.nextPage();
  };

  instance.data.previousPage = function previousPage() {
    const book = instance.data.book;
    if (book && typeof book.previousPage === 'function') book.previousPage();
  };

  instance.data.goToPage = function goToPage(page) {
    const book = instance.data.book;
    if (!book) return;
    goToUserPage(book, page);
  };

  function loadPages(rawImages) {
    const parsed = padAndCapPages(parsePageImages(rawImages));
    const hash = hashPageUrls(parsed);
    if (hash === instance.data.lastPagesHash && instance.data.book) return;

    instance.data.pagesGeneration += 1;
    const gen = instance.data.pagesGeneration;
    const hasImages = parsed.some((url) => Boolean(url));
    if (hasImages) loader.show();
    else loader.hide();

    materializePageSources(instance, rawImages)
      .then(async (result) => {
        if (gen !== instance.data.pagesGeneration) return;
        if (!instance.data.book) recreateBook();
        instance.data.lastPagesHash = result.hash;
        applyPages(result.urls);
        await waitForBookMaps(instance.data.book, result.urls);
        if (gen !== instance.data.pagesGeneration) return;
        loader.hide();
      })
      .catch((err) => {
        console.warn('Flipbook: chargement des pages', err);
        if (gen === instance.data.pagesGeneration) loader.hide();
      });
  }

  instance.data.applyProperties = function applyProperties(properties) {
    if (!properties) return;
    loadPages(properties.pages);
  };

  recreateBook();

  sceneApi.startLoop((delta) => {
    const book = instance.data.book;
    if (!book) return;
    book.animate(delta);

    const page = getDisplayedPage(book);
    if (page !== instance.data.publishedPage) {
      instance.data.publishedPage = page;
      instance.publishState('current_page', page);
    }

    const progressing = Math.abs(book.progress - instance.data._lastProgress) > 1e-4;
    if (instance.data._wasProgressing && !progressing) {
      instance.triggerEvent('page_changed');
    }
    instance.data._wasProgressing = progressing;
    instance.data._lastProgress = book.progress;
  });

  instance.publishState('current_page', 1);
  instance.publishState('total_pages', 0);
}
