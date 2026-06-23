const PRODUCTION_CESDK_CONTENT_BASE_URL =
  'https://poc-studio.github.io/phosphor_icon_picker/public/cesdk-assets/';

/**
 * Base URL for self-hosted CE.SDK content libraries (stickers, etc.).
 * Local sandbox serves `public/cesdk-assets/`; Bubble loads from GitHub Pages.
 */
export function getCesdkContentBaseURL() {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${origin}/cesdk-assets/`;
    }
  }
  return PRODUCTION_CESDK_CONTENT_BASE_URL;
}
