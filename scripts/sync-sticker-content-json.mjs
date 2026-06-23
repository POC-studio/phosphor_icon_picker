import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STICKER_ROOT = path.join(ROOT, 'public/cesdk-assets/ly.img.sticker');
const CONTENT_JSON_PATH = path.join(STICKER_ROOT, 'content.json');

function resolveAssetPath(relativeUri) {
  const withoutBase = relativeUri.replace('{{base_url}}/', '');
  const localPath = withoutBase.replace(/^ly\.img\.sticker\//, '');
  return path.join(STICKER_ROOT, localPath);
}

function assetFilesExist(asset) {
  const uri = asset.meta?.uri;
  const thumbUri = asset.meta?.thumbUri;
  if (!uri || !thumbUri) return false;
  return (
    fs.existsSync(resolveAssetPath(uri))
    && fs.existsSync(resolveAssetPath(thumbUri))
  );
}

const content = JSON.parse(fs.readFileSync(CONTENT_JSON_PATH, 'utf8'));
const kept = [];
const removed = [];

for (const asset of content.assets) {
  if (assetFilesExist(asset)) {
    kept.push(asset);
  } else {
    removed.push(asset);
  }
}

const groups = new Set();
for (const asset of kept) {
  asset.groups?.forEach((group) => groups.add(group));
}

const updated = {
  version: content.version,
  id: content.id,
  assets: kept,
};

fs.writeFileSync(CONTENT_JSON_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');

console.log(`Sticker content.json synced:`);
console.log(`  kept:    ${kept.length}`);
console.log(`  removed: ${removed.length}`);
console.log(`  groups:  ${[...groups].sort().join(', ')}`);

if (removed.length > 0) {
  const removedGroups = {};
  for (const asset of removed) {
    for (const group of asset.groups ?? []) {
      removedGroups[group] = (removedGroups[group] ?? 0) + 1;
    }
  }
  console.log(`  removed by group:`, removedGroups);
}
