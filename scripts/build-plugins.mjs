/**
 * Bundle les plugins qui le demandent (clé "bundles" dans plugins/<id>/config.json)
 * en un fichier unique compatible Bubble.
 *
 * Forme de sortie (identique au format historique des initialize.js) :
 *   export default function(instance, context) { <bundle IIFE> return __pluginInit.default(instance, context); }
 * → tout le code reste DANS la fonction : aucun état de module partagé entre instances,
 * et le sandbox (toBubbleCode) peut toujours stripper `export default` pour Bubble.
 *
 * Usage :
 *   node scripts/build-plugins.mjs           # build one-shot
 *   node scripts/build-plugins.mjs --watch   # rebuild à chaque changement de src/
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const GLOBAL_NAME = '__pluginInit';

export function loadBundleTargets() {
  const targets = [];
  if (!existsSync(PLUGINS_DIR)) return targets;
  for (const pluginId of readdirSync(PLUGINS_DIR)) {
    const pluginDir = path.join(PLUGINS_DIR, pluginId);
    if (!statSync(pluginDir).isDirectory()) continue;
    const configPath = path.join(pluginDir, 'config.json');
    if (!existsSync(configPath)) continue;
    let config;
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.warn(`[build-plugins] ${pluginId}: config.json invalide, ignoré.`);
      continue;
    }
    if (!Array.isArray(config.bundles)) continue;
    for (const bundle of config.bundles) {
      if (!bundle || !bundle.entry || !bundle.output) continue;
      const entry = path.join(pluginDir, bundle.entry);
      const output = path.join(pluginDir, bundle.output);
      if (!existsSync(entry)) {
        console.warn(`[build-plugins] ${pluginId}: entry introuvable (${bundle.entry}), bundle ignoré.`);
        continue;
      }
      targets.push({
        pluginId,
        pluginDir,
        entry,
        output,
        entryRel: bundle.entry,
        alias: bundle.alias,
        target: bundle.target,
        globals: bundle.globals && typeof bundle.globals === 'object' ? bundle.globals : undefined,
        waitForGlobal: typeof bundle.waitForGlobal === 'string' ? bundle.waitForGlobal : undefined,
        globalCdn: typeof bundle.globalCdn === 'string' ? bundle.globalCdn : undefined,
      });
    }
  }
  return targets;
}

function notifyPlugin(target, hooks) {
  return {
    name: 'bubble-notify',
    setup(build) {
      build.onStart(() => {
        if (hooks && hooks.onStart) hooks.onStart(target);
      });
      build.onEnd((result) => {
        const errors = result.errors ? result.errors.length : 0;
        if (errors === 0) {
          console.log(`[build-plugins] ${target.pluginId}: ${path.relative(ROOT, target.output)} régénéré.`);
        } else {
          console.error(`[build-plugins] ${target.pluginId}: échec du build (${errors} erreur(s)).`);
        }
        if (hooks && hooks.onEnd) hooks.onEnd(target, result);
      });
    },
  };
}

function exactAliasPlugin(aliasMap, pluginDir) {
  const entries = Object.entries(aliasMap).map(([key, relPath]) => [
    key,
    path.join(pluginDir, relPath),
  ]);
  return {
    name: 'exact-alias',
    setup(build) {
      for (const [alias, aliasPath] of entries) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        build.onResolve({ filter: new RegExp(`^${escaped}$`) }, () => ({
          path: aliasPath,
        }));
      }
    },
  };
}

/** Résout un import npm vers un global navigateur (ex. three → window.THREE). */
function globalExternalsPlugin(globals) {
  const names = Object.keys(globals || {});
  if (!names.length) return null;
  const filter = new RegExp(
    `^(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`,
  );
  return {
    name: 'global-externals',
    setup(build) {
      build.onResolve({ filter }, (args) => ({
        path: args.path,
        namespace: 'global-externals',
      }));
      build.onLoad({ filter: /.*/, namespace: 'global-externals' }, (args) => {
        const ident = globals[args.path];
        return {
          contents: [
            `const g = globalThis[${JSON.stringify(ident)}];`,
            `if (!g) throw new Error(${JSON.stringify(`${ident} n’est pas chargé. Ajoute le script dans shared.html.`)});`,
            'module.exports = g;',
          ].join('\n'),
          loader: 'js',
        };
      });
    },
  };
}

function esbuildOptions(target, hooks) {
  const srcDirRel = path.dirname(target.entryRel);
  const aliasEntries = target.alias && typeof target.alias === 'object'
    ? Object.entries(target.alias)
    : [];
  const globalPlugin = globalExternalsPlugin(target.globals);
  const waitFor = target.waitForGlobal;
  const cdn = target.globalCdn;
  const bannerJs = waitFor
    ? `/* GENERATED FILE - ne pas éditer. Source : ${srcDirRel}/ (npm run build:plugins) */\nexport default function(instance, context) {\nfunction __bootPlugin() {\n`
    : `/* GENERATED FILE - ne pas éditer. Source : ${srcDirRel}/ (npm run build:plugins) */\nexport default function(instance, context) {\n`;
  const footerJs = waitFor
    ? [
        `return ${GLOBAL_NAME}.default(instance, context);`,
        `}`,
        `function __startPlugin() {`,
        `  if (globalThis[${JSON.stringify(waitFor)}]) return __bootPlugin();`,
        cdn
          ? `  return import(${JSON.stringify(cdn)}).then(function (mod) { globalThis[${JSON.stringify(waitFor)}] = mod; return __bootPlugin(); });`
          : `  window.addEventListener(${JSON.stringify(`${waitFor.toLowerCase()}-ready`)}, function() { __bootPlugin(); }, { once: true });`,
        `}`,
        `return __startPlugin();`,
        `}`,
      ].join('\n')
    : `return ${GLOBAL_NAME}.default(instance, context);\n}`;
  return {
    entryPoints: [target.entry],
    outfile: target.output,
    bundle: true,
    format: 'iife',
    globalName: GLOBAL_NAME,
    platform: 'browser',
    target: target.target || 'es2020',
    minify: false,
    sourcemap: false,
    legalComments: 'none',
    banner: {
      js: bannerJs,
    },
    footer: {
      js: footerJs,
    },
    plugins: [
      notifyPlugin(target, hooks),
      ...(aliasEntries.length ? [exactAliasPlugin(target.alias, target.pluginDir)] : []),
      ...(globalPlugin ? [globalPlugin] : []),
    ],
  };
}

/** Build one-shot de tous les bundles déclarés. */
export async function buildAll(hooks) {
  const targets = loadBundleTargets();
  if (targets.length === 0) {
    console.log('[build-plugins] Aucun bundle déclaré, rien à faire.');
    return;
  }
  for (const target of targets) {
    await esbuild.build(esbuildOptions(target, hooks));
  }
}

/** Watch de tous les bundles ; retourne une fonction de dispose. */
export async function watchAll(hooks) {
  const targets = loadBundleTargets();
  const contexts = [];
  for (const target of targets) {
    const ctx = await esbuild.context(esbuildOptions(target, hooks));
    await ctx.watch();
    contexts.push(ctx);
  }
  if (targets.length > 0) {
    console.log(`[build-plugins] Watch actif sur ${targets.length} bundle(s).`);
  }
  return async () => {
    await Promise.all(contexts.map((ctx) => ctx.dispose()));
  };
}

const isCliEntry = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCliEntry) {
  const watch = process.argv.includes('--watch');
  if (watch) {
    await watchAll();
  } else {
    await buildAll();
  }
}
