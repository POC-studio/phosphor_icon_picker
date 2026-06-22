/**
 * Génère plugins/imgly/imgly-view/src/i18n/fr.json à partir de en.json CE.SDK.
 * Usage : node scripts/generate-cesdk-fr-i18n.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { translate } from '@vitalets/google-translate-api';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EN_PATH = path.join(ROOT, 'node_modules/@cesdk/cesdk-js/assets/i18n/en.json');
const OUT_PATH = path.join(ROOT, 'plugins/imgly/imgly-view/src/i18n/fr.json');

const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
const keys = Object.keys(en);
const fr = {};
const BATCH = 80;

function shouldSkipTranslation(value) {
  return typeof value !== 'string'
    || value.startsWith('$t(')
    || /^https?:\/\//.test(value)
    || /^[A-Z0-9_]+$/.test(value);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateBatch(entries) {
  const payload = entries.map(([key, value]) => `[[${key}]]${value}`).join('\n');
  const { text } = await translate(payload, { from: 'en', to: 'fr' });
  const parts = text.split(/\[\[([^\]]+)\]\]/).filter(Boolean);
  const out = new Map();
  for (let i = 0; i < parts.length; i += 2) {
    const key = parts[i]?.trim();
    const value = parts[i + 1]?.trim();
    if (key && value) out.set(key, value);
  }
  return out;
}

async function main() {
  const pending = [];
  for (const key of keys) {
    const value = en[key];
    if (shouldSkipTranslation(value)) {
      fr[key] = value;
    } else {
      pending.push([key, value]);
    }
  }

  console.log(`[fr-i18n] ${keys.length} clés, ${pending.length} à traduire`);

  for (let i = 0; i < pending.length; i += BATCH) {
    const batch = pending.slice(i, i + BATCH);
    try {
      const translated = await translateBatch(batch);
      for (const [key, value] of batch) {
        fr[key] = translated.get(key) || value;
      }
    } catch (err) {
      console.warn(`[fr-i18n] batch ${i}-${i + batch.length} fallback EN:`, err.message);
      for (const [key, value] of batch) fr[key] = value;
    }
    console.log(`[fr-i18n] ${Math.min(i + BATCH, pending.length)}/${pending.length}`);
    await sleep(400);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(fr, null, 2)}\n`, 'utf8');
  console.log(`[fr-i18n] écrit → ${path.relative(ROOT, OUT_PATH)}`);
}

await main();
