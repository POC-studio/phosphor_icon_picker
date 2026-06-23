/** Résout @cesdk/cesdk-js depuis window.CreativeEditorSDK (shared.html / CDN). */
const sdk = typeof CreativeEditorSDK !== 'undefined' ? CreativeEditorSDK : null;

export default sdk;
