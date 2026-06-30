/** @typedef {import('@cesdk/cesdk-js').CreativeEditorSDK} CreativeEditorSDK */

/** @type {boolean} */
let clipboardHasData = false;

/**
 * @param {CreativeEditorSDK} cesdk
 * @param {string} messageKey
 */
function showInfoNotification(cesdk, messageKey) {
  cesdk.ui.showNotification({
    type: 'info',
    message: messageKey,
    duration: 'short',
  });
}

/**
 * @param {CreativeEditorSDK} cesdk
 */
function wrapCopyPasteActions(cesdk) {
  const originalCopy = cesdk.actions.get('copy');
  const originalPaste = cesdk.actions.get('paste');
  if (!originalCopy || !originalPaste) return;

  cesdk.actions.register('copy', (...args) => {
    const selected = cesdk.engine.block.findAllSelected();
    if (selected.length === 0) return;
    if (!cesdk.feature.isEnabled('ly.img.duplicate', { engine: cesdk.engine })) return;

    originalCopy(...args);
    clipboardHasData = true;
    showInfoNotification(cesdk, 'notification.block.copy');
  });

  cesdk.actions.register('paste', async (...args) => {
    if (!cesdk.feature.isEnabled('ly.img.duplicate', { engine: cesdk.engine })) return;
    if (!clipboardHasData) {
      showInfoNotification(cesdk, 'notification.block.paste.empty');
      return;
    }

    await originalPaste(...args);
    showInfoNotification(cesdk, 'notification.block.paste');
  });
}

/**
 * @param {CreativeEditorSDK} cesdk
 * @param {'copy' | 'paste'} actionId
 * @param {string} componentId
 * @param {string} buttonId
 * @param {import('@cesdk/cesdk-js').CustomIcon} icon
 * @param {string} labelKey
 * @param {string} shortcut
 */
function registerCanvasMenuAction(cesdk, actionId, componentId, buttonId, icon, labelKey, shortcut) {
  cesdk.ui.registerComponent(componentId, ({ cesdk: sdk, builder, engine, payload }) => {
    if (!sdk.feature.isEnabled('ly.img.duplicate', { engine })) return;

    const close = typeof payload?.close === 'function' ? payload.close : () => {};

    builder.Button(buttonId, {
      icon,
      label: labelKey,
      variant: 'plain',
      shortcut,
      onClick: () => {
        void sdk.actions.run(actionId).catch(() => {}).finally(close);
      },
    });
  });
}

/**
 * Copier / coller : toast info, fermeture du menu « … », buffer interne CE.SDK uniquement.
 * @param {CreativeEditorSDK} cesdk
 */
export function setupCopyPasteMenu(cesdk) {
  if (!cesdk?.ui || !cesdk?.engine || !cesdk?.actions) return;

  wrapCopyPasteActions(cesdk);

  registerCanvasMenuAction(
    cesdk,
    'copy',
    'ly.img.copy.canvasMenu',
    'ly.img.copy.canvasMenu.button',
    '@imgly/Copy',
    'action.block.copy',
    'Meta+C',
  );

  registerCanvasMenuAction(
    cesdk,
    'paste',
    'ly.img.paste.canvasMenu',
    'ly.img.paste.canvasMenu.button',
    '@imgly/Paste',
    'action.block.paste',
    'Meta+V',
  );
}
