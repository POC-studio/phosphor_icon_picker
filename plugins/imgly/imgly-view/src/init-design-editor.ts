/**
 * CE.SDK Design Editor — aligné sur le starter kit img.ly.
 * @see https://img.ly/docs/cesdk/js/serve-assets-6ch24x/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource,
} from '@cesdk/cesdk-js/plugins';

import { DesignEditorConfig } from './design-editor/plugin';

export { DesignEditorConfig } from './design-editor/plugin';

export type InitDesignEditorOptions = {
  contentBaseURL: string;
};

/**
 * Configure CE.SDK comme le Design Editor officiel img.ly :
 * DesignEditorConfig → plugins d’assets → barre d’actions.
 */
export async function initDesignEditor(
  cesdk: CreativeEditorSDK,
  { contentBaseURL }: InitDesignEditorOptions,
) {
  const localAssets = { baseURL: contentBaseURL };

  await cesdk.addPlugin(new DesignEditorConfig());

  await cesdk.addPlugin(new BlurAssetSource(localAssets));
  await cesdk.addPlugin(new ColorPaletteAssetSource(localAssets));
  await cesdk.addPlugin(new CropPresetsAssetSource(localAssets));

  // Pas de UploadAssetSources : uploads Bubble via uploadFile (drag-and-drop), sans galerie locale.

  await cesdk.addPlugin(new EffectsAssetSource(localAssets));
  await cesdk.addPlugin(new FiltersAssetSource(localAssets));
  await cesdk.addPlugin(new StickerAssetSource(localAssets));
  await cesdk.addPlugin(new TextAssetSource(localAssets));
  await cesdk.addPlugin(new TextComponentAssetSource(localAssets));
  await cesdk.addPlugin(new TypefaceAssetSource(localAssets));
  await cesdk.addPlugin(new VectorShapeAssetSource(localAssets));
}
