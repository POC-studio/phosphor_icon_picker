/**
 * Vérification automatique du sandbox (outil one-shot, nécessite Chrome) :
 * charge le plugin Fabric, ajoute un texte, applique fontSize / opacity via la
 * top bar (command layer), et vérifie l'absence d'erreurs console.
 */
import { chromium } from 'playwright-core';

const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
});

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.selectOption('#plugin-selector', 'fabric');
await page.waitForTimeout(2500);

const state = await page.evaluate(() => {
  const host = document.querySelector('.canvas-area') || document.body;
  return {
    canvasCount: host.querySelectorAll('canvas').length,
    buttonCount: host.querySelectorAll('button').length,
  };
});
console.log('état initial:', JSON.stringify(state));
if (state.canvasCount === 0) errors.push('aucun canvas Fabric rendu');

// 1. Ajouter un texte (auto-sélectionné)
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const textBtn = btns.find((b) => /text/i.test(b.title || ''));
  if (textBtn) textBtn.click();
});
await page.waitForTimeout(1000);

// 2. fontSize 72 via l'input de la top bar (passe par applyTextCommand).
//    updateTopBarForSelection resynchronise l'input depuis l'objet : si la
//    mutation échoue, la valeur retombe à 36.
const fontSizeResult = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.canvas-area input')];
  const sizeInput = inputs.find((i) => i.value === '36');
  if (!sizeInput) return { ok: false, reason: 'input fontSize 36 introuvable' };
  sizeInput.value = '72';
  sizeInput.dispatchEvent(new Event('input', { bubbles: true }));
  sizeInput.dispatchEvent(new Event('change', { bubbles: true }));
  return { ok: true, valueAfter: sizeInput.value };
});
await page.waitForTimeout(600);
const fontSizeSynced = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.canvas-area input')];
  return inputs.some((i) => i.value === '72');
});
console.log('fontSize:', JSON.stringify(fontSizeResult), '— resync à 72 :', fontSizeSynced);
if (!fontSizeResult.ok || !fontSizeSynced) errors.push('mutation fontSize non appliquée');

// 3. opacity 50 (passe par applyStyleToSelection → applyCommand)
const opacityResult = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.canvas-area input')];
  const opacityInput = inputs.find((i) => i.value === '100');
  if (!opacityInput) return { ok: false, reason: 'input opacity introuvable' };
  opacityInput.value = '50';
  opacityInput.dispatchEvent(new Event('input', { bubbles: true }));
  return { ok: true };
});
await page.waitForTimeout(600);
const opacitySynced = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.canvas-area input')];
  return inputs.some((i) => i.value === '50');
});
console.log('opacity:', JSON.stringify(opacityResult), '— resync à 50 :', opacitySynced);
if (!opacityResult.ok || !opacitySynced) errors.push('mutation opacity non appliquée');

await page.screenshot({ path: 'verify-sandbox.png' });
await browser.close();

const realErrors = errors.filter((e) => !/favicon|net::ERR_|404/i.test(e));
if (realErrors.length) {
  console.error('ERREURS DÉTECTÉES:');
  realErrors.forEach((e) => console.error(' -', e));
  process.exit(1);
}
console.log('VERIFICATION OK (mutations appliquées, aucune erreur console/page)');
