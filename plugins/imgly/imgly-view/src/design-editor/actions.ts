/**
 * Actions Configuration - Override Default Actions and Add Custom Actions
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations for the Design Editor starterkit.
 *
 * ## Actions API
 *
 * - `cesdk.actions.register(id, handler)` - Register or override an action
 * - `cesdk.actions.run(id, ...args)` - Execute an action (async, throws if not found)
 * - `cesdk.actions.get(id)` - Get action handler (returns undefined if not found)
 * - `cesdk.actions.list()` - List all registered action IDs
 *
 * ## Built-in Utility Functions
 *
 * CE.SDK provides utilities for common operations that you can use in your actions:
 *
 * - `cesdk.utils.export(options)` - Export current design to various formats.
 * Options: mimeType, targetWidth, targetHeight, jpegQuality, pngCompressionLevel.
 * Returns: { blobs: Blob[], options: ExportOptions }.
 *
 * - `cesdk.utils.downloadFile(data, mimeType, filename?)` - Trigger browser file download.
 * data: Blob, string, or ArrayBuffer.
 * mimeType: MIME type (e.g., 'image/png', 'application/json').
 * filename: Optional filename (auto-generated if not provided).
 *
 * - `cesdk.utils.loadFile(options)` - Open browser file picker.
 * Options: accept (file extensions), returnType ('text', 'arrayBuffer', 'objectURL').
 * Returns: Promise<string | ArrayBuffer | string> based on returnType.
 *
 * - `cesdk.utils.localUpload(file, context)` - Create local blob URL for uploads.
 * file: File object from input or drag-drop.
 * context: Upload context ('image', 'video', 'audio', etc.).
 * Returns: Promise<string> - Blob URL that can be used with engine.
 *
 * @see https://img.ly/docs/cesdk/js/actions-6ch24x
 * @see https://img.ly/docs/cesdk/js/export/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Register actions and configure the navigation bar.
 *
 * Override default actions to integrate with your backend, cloud storage,
 * or customize the export/import behavior for your application's needs.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Running actions programmatically
 * ```typescript
 * // Run built-in actions
 * await cesdk.actions.run('saveScene');
 * await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
 * await cesdk.actions.run('zoom.toPage', { page: 'current' });
 *
 * // Run custom actions
 * await cesdk.actions.run('exportImage');  // Custom PNG export
 * await cesdk.actions.run('exportScene', { format: 'archive' });
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // Import scène (dev) — pas de boutons téléchargement dans la barre pour l'instant.
  cesdk.actions.register('importScene', async ({ format = 'scene' }) => {
    if (format === 'scene') {
      // Import from .scene JSON file
      const scene = await cesdk.utils.loadFile({
        accept: '.scene',
        returnType: 'text'
      });
      await cesdk.engine.scene.loadFromString(scene);
    } else {
      // Import from .cesdk archive (includes embedded assets)
      const blobURL = await cesdk.utils.loadFile({
        accept: '.zip',
        returnType: 'objectURL'
      });
      try {
        await cesdk.engine.scene.loadFromArchiveURL(blobURL);
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    }

    // Reset zoom to show the first page after import
    await cesdk.actions.run('zoom.toPage', { page: 'first' });
  });

  // uploadFile Bubble : enregistré dans setup-bubble-upload.js (après init, avec instance).
}
