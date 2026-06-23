export const BUBBLE_DOCUMENT_TITLE_NAV_ID = 'imgly.bubble.documentTitle.navigationBar';

function readDocumentTitle(instance) {
  const raw = typeof instance.data.documentTitle === 'string'
    ? instance.data.documentTitle.trim()
    : '';
  return raw;
}

/** Affiche document_title à gauche de la barre (sans action au clic). */
export function syncNavigationDocumentTitle(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  cesdk.ui.updateOrderComponent(
    { in: 'ly.img.navigation.bar', match: BUBBLE_DOCUMENT_TITLE_NAV_ID },
    { content: readDocumentTitle(instance) },
  );
}

export function setupNavigationDocumentTitle(cesdk, instance) {
  if (!cesdk?.ui || !instance?.data) return;

  cesdk.ui.registerComponent(BUBBLE_DOCUMENT_TITLE_NAV_ID, ({ builder, payload }) => {
    const payloadContent = typeof payload?.content === 'string' ? payload.content.trim() : '';
    const content = payloadContent || readDocumentTitle(instance);
    if (!content) return;

    builder.Heading('bubble-document-title', { content });
  });

  cesdk.ui.removeOrderComponent({
    in: 'ly.img.navigation.bar',
    match: 'ly.img.documentSettings.navigationBar',
  });

  syncNavigationDocumentTitle(cesdk, instance);
}
