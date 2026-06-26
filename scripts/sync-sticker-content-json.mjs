import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STICKER_ROOT = path.join(ROOT, 'public/cesdk-assets/ly.img.sticker');
const CONTENT_JSON_PATH = path.join(STICKER_ROOT, 'content.json');
const JOURNAL_CONTENT_JSON_PATH = path.join(STICKER_ROOT, 'journal.content.json');
const IMAGES_DIR = path.join(STICKER_ROOT, 'images');
const VECTOR_STICKER_GROUPS = new Set(['journal']);

function resolveAssetPath(relativeUri) {
  const withoutBase = relativeUri.replace('{{base_url}}/', '');
  const localPath = withoutBase.replace(/^ly\.img\.sticker\//, '');
  return path.join(STICKER_ROOT, localPath);
}

function assetFilesExist(asset) {
  const uri = asset.meta?.uri;
  const thumbUri = asset.meta?.thumbUri;
  if (!uri || !thumbUri) return false;

  const imagePath = resolveAssetPath(uri);
  const thumbPath = resolveAssetPath(thumbUri);
  if (!fs.existsSync(imagePath) || !fs.existsSync(thumbPath)) return false;

  // macOS peut résoudre des chemins en casse différente : vérifier le nom exact.
  const imageDir = path.dirname(imagePath);
  const thumbDir = path.dirname(thumbPath);
  const imageName = path.basename(imagePath);
  const thumbName = path.basename(thumbPath);
  const imageMatch = fs.readdirSync(imageDir).includes(imageName);
  const thumbMatch = fs.readdirSync(thumbDir).includes(thumbName);
  return imageMatch && thumbMatch;
}

function slugifyFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  const simplified = base.includes('=') ? base.split('=').pop() : base;
  return simplified
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function humanizeFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  const simplified = base.includes('=') ? base.split('=').pop() : base;
  return simplified.replace(/_/g, ' ').trim();
}

function readSvgDimensions(svgPath) {
  const content = fs.readFileSync(svgPath, 'utf8');
  const widthMatch = content.match(/\bwidth="([\d.]+)/);
  const heightMatch = content.match(/\bheight="([\d.]+)/);
  if (widthMatch && heightMatch) {
    return {
      width: Math.round(parseFloat(widthMatch[1])),
      height: Math.round(parseFloat(heightMatch[1])),
    };
  }
  const viewBoxMatch = content.match(/viewBox="[\d.\s]+[\d.\s]+([\d.]+)\s+([\d.]+)"/);
  if (viewBoxMatch) {
    return {
      width: Math.round(parseFloat(viewBoxMatch[1])),
      height: Math.round(parseFloat(viewBoxMatch[2])),
    };
  }
  return { width: 2048, height: 2048 };
}

function readImageDimensions(imagePath) {
  if (imagePath.endsWith('.svg')) {
    return readSvgDimensions(imagePath);
  }
  return { width: 2048, height: 2048 };
}

function walkImageFiles(dir, group = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkImageFiles(fullPath, entry.name));
      continue;
    }
    if (!/\.(svg|png)$/i.test(entry.name)) continue;
    files.push({ group, filename: entry.name, imagePath: fullPath });
  }
  return files;
}

function isVectorStickerGroup(group) {
  return VECTOR_STICKER_GROUPS.has(group);
}

function splitAssetsByGroup(assets) {
  const rasterAssets = [];
  const vectorAssets = [];
  for (const asset of assets) {
    const group = asset.groups?.[0];
    if (group && isVectorStickerGroup(group)) {
      vectorAssets.push(asset);
    } else {
      rasterAssets.push(asset);
    }
  }
  return { rasterAssets, vectorAssets };
}

function buildAssetEntry({ group, filename, imagePath }) {
  const thumbFilename = filename.replace(/\.(svg|png)$/i, '.png');
  const thumbPath = path.join(STICKER_ROOT, 'thumbnails', group, thumbFilename);
  if (!fs.existsSync(thumbPath)) {
    return null;
  }

  const slug = slugifyFilename(filename);
  const { width, height } = readImageDimensions(imagePath);
  const label = humanizeFilename(filename);

  return {
    id: `ly.img.sticker.${group}.${slug}`,
    groups: [group],
    label: {
      en: label,
      de: label,
    },
    tags: {
      en: [group],
      de: [group],
    },
    meta: {
      uri: `{{base_url}}/ly.img.sticker/images/${group}/${filename}`,
      thumbUri: `{{base_url}}/ly.img.sticker/thumbnails/${group}/${thumbFilename}`,
      filename,
      kind: 'sticker',
      fillType: '//ly.img.ubq/fill/image',
      width,
      height,
    },
  };
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

const knownUris = new Set(
  kept.map((asset) => asset.meta?.uri?.replace('{{base_url}}/', '')),
);
const added = [];

for (const file of walkImageFiles(IMAGES_DIR)) {
  const relativeUri = `ly.img.sticker/images/${file.group}/${file.filename}`;
  if (knownUris.has(relativeUri)) continue;

  const entry = buildAssetEntry(file);
  if (!entry) {
    console.warn(`  skip (no thumb): ${relativeUri}`);
    continue;
  }

  kept.push(entry);
  knownUris.add(relativeUri);
  added.push(entry.id);
}

kept.sort((a, b) => a.id.localeCompare(b.id));

const { rasterAssets, vectorAssets } = splitAssetsByGroup(kept);
rasterAssets.sort((a, b) => a.id.localeCompare(b.id));
vectorAssets.sort((a, b) => a.id.localeCompare(b.id));

const rasterGroups = new Set();
for (const asset of rasterAssets) {
  asset.groups?.forEach((group) => rasterGroups.add(group));
}

const vectorGroups = new Set();
for (const asset of vectorAssets) {
  asset.groups?.forEach((group) => vectorGroups.add(group));
}

const updated = {
  version: content.version,
  id: content.id,
  assets: rasterAssets,
};

const journalManifest = {
  version: content.version,
  id: 'imgly.journal.sticker',
  assets: vectorAssets,
};

fs.writeFileSync(CONTENT_JSON_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
fs.writeFileSync(JOURNAL_CONTENT_JSON_PATH, `${JSON.stringify(journalManifest, null, 2)}\n`, 'utf8');

console.log('Sticker content.json synced:');
console.log(`  raster:  ${rasterAssets.length} (${[...rasterGroups].sort().join(', ') || 'none'})`);
console.log(`  vector:  ${vectorAssets.length} (${[...vectorGroups].sort().join(', ') || 'none'})`);
console.log(`  added:   ${added.length}`);
console.log(`  removed: ${removed.length}`);

if (added.length > 0) {
  console.log('  new assets:', added.join(', '));
}

if (removed.length > 0) {
  const removedGroups = {};
  for (const asset of removed) {
    for (const group of asset.groups ?? []) {
      removedGroups[group] = (removedGroups[group] ?? 0) + 1;
    }
  }
  console.log('  removed by group:', removedGroups);
}
