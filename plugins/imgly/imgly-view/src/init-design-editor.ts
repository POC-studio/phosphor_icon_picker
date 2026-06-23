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
  UploadAssetSources,
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
  await cesdk.addPlugin(new DesignEditorConfig());

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload'],
    }),
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new StickerAssetSource({
      baseURL: contentBaseURL,
    }),
  );
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
}
