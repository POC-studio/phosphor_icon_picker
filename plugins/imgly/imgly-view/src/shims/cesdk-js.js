/** Résout @cesdk/cesdk-js depuis window.CreativeEditorSDK (shared.html / CDN). */
function resolveCreativeEditorSDK() {
  const sdk = typeof globalThis.CreativeEditorSDK !== 'undefined'
    ? globalThis.CreativeEditorSDK
    : null;
  if (sdk && typeof sdk.create === 'function') return sdk;
  return null;
}

/** Proxy lazy : le UMD peut arriver après l'évaluation du bundle sandbox. */
const cesdkLazy = new Proxy(
  {},
  {
    get(_target, prop) {
      const sdk = resolveCreativeEditorSDK();
      if (!sdk) return undefined;
      const value = sdk[prop];
      return typeof value === 'function' ? value.bind(sdk) : value;
    },
  },
);

export default cesdkLazy;
