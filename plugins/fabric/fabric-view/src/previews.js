import { ARTBOARD_PRESETS } from './constants.js';
import { loadFromJsonPromise, syncCurrentCanvasToPageSnapshots } from './serialize.js';
import { clampArtboardIndex, dataUrlToBase64 } from './utils.js';


function getJsPdfConstructor() {
  const w = typeof window !== 'undefined' ? window : null;
  const mod = w && w.jspdf;
  return mod && typeof mod.jsPDF === 'function' ? mod.jsPDF : null;
}


function dataUrlToImageCanvas(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D indisponible'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}


function rotateCanvas90Clockwise(sourceCanvas) {
  const out = document.createElement('canvas');
  out.width = sourceCanvas.height;
  out.height = sourceCanvas.width;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.translate(out.width, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(sourceCanvas, 0, 0);
  return out;
}


function compositeSpreadPage3LeftPage1Right(dataUrl3, dataUrl0) {
  const pL = ARTBOARD_PRESETS[2];
  const pR = ARTBOARD_PRESETS[0];
  const cw = pL.width + pR.width;
  const ch = Math.max(pL.height, pR.height);
  return Promise.all([dataUrlToImageCanvas(dataUrl3), dataUrlToImageCanvas(dataUrl0)]).then(([cL, cR]) => {
    const c = document.createElement('canvas');
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(cL, 0, 0);
    ctx.drawImage(cR, pL.width, 0);
    return rotateCanvas90Clockwise(c);
  });
}


function renderArtboardSnapshotToDataUrl(fabricLib, presetIndex, snapshot) {
  const preset = ARTBOARD_PRESETS[clampArtboardIndex(presetIndex)];
  const w = preset.width;
  const h = preset.height;
  const el = document.createElement('canvas');
  el.width = w;
  el.height = h;
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(el);
  const c = new fabricLib.Canvas(el, {
    preserveObjectStacking: true,
  });
  c.setDimensions({ width: w, height: h });
  c.backgroundColor = '#ffffff';
  const loadInput = snapshot != null && typeof snapshot === 'object' ? snapshot : { objects: [] };
  return loadFromJsonPromise(c, loadInput)
    .then(() => {
      if (typeof c.requestRenderAll === 'function') {
        c.requestRenderAll();
      } else if (typeof c.renderAll === 'function') {
        c.renderAll();
      }
      return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    })
    .then(() => c.toDataURL({ format: 'png', multiplier: 1 }))
    .finally(() => {
      try {
        c.dispose();
      } catch (e) {
        /* ignore */
      }
      el.remove();
    });
}


function pdfDownloadBaseName(instance) {
  const raw = typeof instance.data.documentTitle === 'string' ? instance.data.documentTitle.trim() : '';
  return raw
    ? raw.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80) || 'document'
    : 'document';
}

let _fabricViewPdfSpinStyleInjected = false;

function ensureFabricViewPdfSpinStyle() {
  if (_fabricViewPdfSpinStyleInjected || typeof document === 'undefined') return;
  _fabricViewPdfSpinStyleInjected = true;
  const s = document.createElement('style');
  s.setAttribute('data-fabric-view', 'pdf-spin');
  s.textContent = '@keyframes fabric-view-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}


function setPdfDownloadButtonLoading(btn, loading) {
  if (!btn) return;
  ensureFabricViewPdfSpinStyle();
  const icon = btn.querySelector('i');
  btn.disabled = !!loading;
  btn.style.pointerEvents = loading ? 'none' : '';
  btn.title = loading ? 'Génération du PDF…' : 'Télécharger PDF (pli A4)';
  if (icon) {
    if (loading) {
      icon.className = 'ph ph-circle-notch';
      icon.style.display = 'inline-block';
      icon.style.animation = 'fabric-view-spin 0.7s linear infinite';
    } else {
      icon.className = 'ph ph-download-simple';
      icon.style.animation = '';
      icon.style.display = '';
    }
  }
}


function triggerFoldedA4PdfDownload(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) {
    return Promise.resolve();
  }
  // Contexte Bubble (uploadContent) posé par app.js à l'init.
  const context = instance.data.bubbleContext || null;
  const JsPDF = getJsPdfConstructor();
  if (!JsPDF) {
    console.error('jsPDF introuvable : ajoutez jspdf.umd.min.js dans shared.html (plugin Fabric).');
    return Promise.resolve();
  }
  const fabricLib = instance.data.fabricLib;
  if (!fabricLib || typeof fabricLib.Canvas !== 'function') {
    return Promise.resolve();
  }

  syncCurrentCanvasToPageSnapshots(instance);

  if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
    return Promise.resolve();
  }

  const downloadBtn = instance.data.ui && instance.data.ui.artboardDownloadBtn;
  setPdfDownloadButtonLoading(downloadBtn, true);

  const snaps = instance.data.pageSnapshots;
  const base = pdfDownloadBaseName(instance);

  const run = async () => {
    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined') {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
    }

    const [du3, du0, du1] = await Promise.all([
      renderArtboardSnapshotToDataUrl(fabricLib, 2, snaps[2]),
      renderArtboardSnapshotToDataUrl(fabricLib, 0, snaps[0]),
      renderArtboardSnapshotToDataUrl(fabricLib, 1, snaps[1]),
    ]);

    const spreadRotated = await compositeSpreadPage3LeftPage1Right(du3, du0);
    const spreadDataUrl = spreadRotated.toDataURL('image/png');

    const middleCanvas = await dataUrlToImageCanvas(du1).then((can) => rotateCanvas90Clockwise(can));
    const middleDataUrl = middleCanvas.toDataURL('image/png');

    const doc = new JsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    });
    doc.addImage(spreadDataUrl, 'PNG', 0, 0, 210, 297);
    doc.addPage();
    doc.addImage(middleDataUrl, 'PNG', 0, 0, 210, 297);

    const dataUri = typeof doc.output === 'function' ? doc.output('datauristring') : '';
    const base64 = dataUri ? dataUrlToBase64(dataUri) : '';
    const safePdfName = `${base}.pdf`.replace(/[^\w.-]/g, '_') || 'document.pdf';

    if (context && typeof context.uploadContent === 'function' && base64) {
      try {
        const url = await new Promise((resolve, reject) => {
          context.uploadContent(safePdfName, base64, (err, url) => {
            if (err) reject(err);
            else resolve(url);
          });
        });
        instance.publishState('pdf_url', typeof url === 'string' ? url : '');
        instance.triggerEvent('pdf_ready');
      } catch (uploadErr) {
        console.error('Upload PDF Bubble :', uploadErr);
      }
    }

    doc.save(`${base}.pdf`);
  };

  return run()
    .catch((err) => {
      console.error('Export PDF pli A4 :', err);
    })
    .finally(() => {
      setPdfDownloadButtonLoading(downloadBtn, false);
    });
}


function cropCanvasToDataUrl(sourceCanvas, sx, sy, sw, sh) {
  const out = document.createElement('canvas');
  out.width = sw;
  out.height = sh;
  const ctx = out.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sw, sh);
  ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
  return out.toDataURL('image/png');
}


/**
 * Rend les 4 demi-pages en ordre naturel :
 *  0 = page 0 (A5), 1 = page 1 moitié gauche, 2 = page 1 moitié droite, 3 = page 2 (A5).
 * Page 1 (A4 paysage) est découpée en deux A5.
 */
function buildHalfPageDataUrls(fabricLib, snaps) {
  return Promise.all([
    renderArtboardSnapshotToDataUrl(fabricLib, 0, snaps[0]),
    renderArtboardSnapshotToDataUrl(fabricLib, 1, snaps[1]),
    renderArtboardSnapshotToDataUrl(fabricLib, 2, snaps[2]),
  ]).then((urls) => {
    const du0 = urls[0];
    const du1 = urls[1];
    const du2 = urls[2];
    return dataUrlToImageCanvas(du1).then((mid) => {
      const halfW = Math.round(ARTBOARD_PRESETS[1].width / 2);
      const h = mid.height;
      const leftUrl = cropCanvasToDataUrl(mid, 0, 0, halfW, h);
      const rightUrl = cropCanvasToDataUrl(mid, halfW, 0, mid.width - halfW, h);
      return [du0, leftUrl, rightUrl, du2];
    });
  });
}


/**
 * Génère et publie les previews des demi-pages dans le state `page_previews`,
 * puis déclenche l'event `page_previews_ready`. Renvoie la Promise des URLs
 * (utilisable comme « Result of step » côté action Bubble).
 * Toujours exécutée à fond (pas de skip) : l'appel manuel doit régénérer.
 */
function createPagePreviews(instance) {
  if (!instance || !instance.data || !instance.data.fabricCanvas) {
    return Promise.resolve([]);
  }
  // Contexte Bubble (uploadContent) posé par app.js à l'init.
  const context = instance.data.bubbleContext || null;
  const fabricLib = instance.data.fabricLib;
  if (!fabricLib || typeof fabricLib.Canvas !== 'function') {
    return Promise.resolve([]);
  }
  syncCurrentCanvasToPageSnapshots(instance);
  if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
    return Promise.resolve([]);
  }
  const snaps = instance.data.pageSnapshots.slice();
  const base = pdfDownloadBaseName(instance);
  const runId = (instance.data._pagePreviewsRunId || 0) + 1;
  instance.data._pagePreviewsRunId = runId;
  instance.data._lastPagePreviewsAt = Date.now();

  const uploadOne = (name, dataUrl) => {
    const base64 = dataUrlToBase64(dataUrl);
    if (context && typeof context.uploadContent === 'function' && base64) {
      return new Promise((resolve) => {
        try {
          context.uploadContent(name, base64, (err, url) => {
            if (err || typeof url !== 'string' || !/^https?:\/\/|^blob:/i.test(url)) {
              resolve(dataUrl);
            } else {
              resolve(url);
            }
          });
        } catch (e) {
          resolve(dataUrl);
        }
      });
    }
    return Promise.resolve(dataUrl);
  };

  const run = async () => {
    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined') {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
    }
    const halfUrls = await buildHalfPageDataUrls(fabricLib, snaps);
    const uploaded = await Promise.all(halfUrls.map((dataUrl, i) => {
      const safeName = `${base}-preview-${i + 1}.png`.replace(/[^\w.-]/g, '_') || `preview-${i + 1}.png`;
      return uploadOne(safeName, dataUrl);
    }));
    if (instance.data._pagePreviewsRunId !== runId) {
      return uploaded;
    }
    instance.data._lastPreviewedContentKey = JSON.stringify(snaps);
    instance.publishState('page_previews', uploaded);
    instance.triggerEvent('page_previews_ready');
    return uploaded;
  };

  return run().catch((err) => {
    console.error('Fabric View: create_page_previews', err);
    return [];
  });
}


/**
 * Régénère les previews après un changement de contenu.
 * Debounce 1500 ms + cooldown : si une génération a eu lieu il y a moins de
 * PAGE_PREVIEWS_COOLDOWN_MS, on repousse à la fin du cooldown (au lieu d'en relancer une).
 * Skip si le contenu n'a pas changé. L'action manuelle (createPagePreviews) n'est pas bridée.
 */
function schedulePagePreviews(instance) {
  if (!instance || !instance.data) return;
  const d = instance.data;
  if (d._suppressCanvasJsonPublish === true) return;
  const PAGE_PREVIEWS_DEBOUNCE_MS = 1500;
  const PAGE_PREVIEWS_COOLDOWN_MS = 10000;
  const sinceLast = Date.now() - (d._lastPagePreviewsAt || 0);
  const delay = sinceLast < PAGE_PREVIEWS_COOLDOWN_MS
    ? Math.max(PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS - sinceLast)
    : PAGE_PREVIEWS_DEBOUNCE_MS;
  if (d._schedulePagePreviewsTimer) {
    clearTimeout(d._schedulePagePreviewsTimer);
  }
  d._schedulePagePreviewsTimer = setTimeout(() => {
    d._schedulePagePreviewsTimer = null;
    if (!Array.isArray(d.pageSnapshots)) return;
    const contentKey = JSON.stringify(d.pageSnapshots);
    if (contentKey === d._lastPreviewedContentKey) return;
    createPagePreviews(instance);
  }, delay);
}

export {
  getJsPdfConstructor,
  dataUrlToImageCanvas,
  rotateCanvas90Clockwise,
  compositeSpreadPage3LeftPage1Right,
  renderArtboardSnapshotToDataUrl,
  pdfDownloadBaseName,
  ensureFabricViewPdfSpinStyle,
  setPdfDownloadButtonLoading,
  triggerFoldedA4PdfDownload,
  cropCanvasToDataUrl,
  buildHalfPageDataUrls,
  createPagePreviews,
  schedulePagePreviews,
};
