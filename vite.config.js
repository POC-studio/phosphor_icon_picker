import { defineConfig } from 'vite';
import { buildAll, watchAll } from './scripts/build-plugins.mjs';

/**
 * Lance le bundling des plugins (clé "bundles" des config.json) :
 * - `vite` (dev) : watch esbuild + événements HMR custom plugin-build:start/end
 *   pour que le sandbox bloque la copie du code pendant un build.
 * - `vite build` : build one-shot avant le build Vite.
 */
function bubblePluginBundler() {
  let dispose = null;
  let isDevServer = false;
  return {
    name: 'bubble-plugin-bundler',
    configResolved(config) {
      isDevServer = config.command === 'serve';
    },
    async configureServer(server) {
      dispose = await watchAll({
        onStart() {
          server.ws.send({ type: 'custom', event: 'plugin-build:start' });
        },
        onEnd(target, result) {
          server.ws.send({
            type: 'custom',
            event: 'plugin-build:end',
            data: { ok: !result.errors || result.errors.length === 0 },
          });
        },
      });
      server.httpServer?.once('close', () => {
        if (dispose) dispose();
      });
    },
    async buildStart() {
      // En mode `vite build` (pas de dev server) : build one-shot.
      if (!isDevServer) await buildAll();
    },
  };
}

export default defineConfig({
  plugins: [bubblePluginBundler()],
});
