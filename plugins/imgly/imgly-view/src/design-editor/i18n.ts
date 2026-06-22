/**
 * Internationalisation — interface en français.
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import fr from '../i18n/fr.json';

/** Corrections manuelles par-dessus la traduction auto. */
const FR_OVERRIDES: Record<string, string> = {
  'common.undo': 'Défaire',
  'common.redo': 'Rétablir',
  'component.library.elements': 'Éléments',
  'libraries.ly.img.templates.label': 'Modèles',
  'libraries.ly.img.upload.label': 'Importations',
  'libraries.ly.img.image.upload.label': 'Images importées',
  'panel.imgly.bookmarks.label': 'Contributions',
  'panel.imgly.bookmarks.panel': 'Contributions',
  'panel.imgly.bookmarks.search': 'Rechercher…',
  'panel.imgly.bookmarks.empty': 'Aucune contribution',
  'panel.imgly.bookmarks.noResults': 'Aucun résultat',
  'panel.imgly.bookmarks.add': 'Ajouter',
  'panel.imgly.icons.label': 'Icônes',
  'panel.imgly.icons.panel': 'Icônes',
  'panel.imgly.icons.style': 'Style',
  'panel.imgly.icons.style.regular': 'Regular',
  'panel.imgly.icons.style.bold': 'Bold',
  'panel.imgly.icons.style.fill': 'Fill',
  'panel.imgly.icons.style.light': 'Light',
  'panel.imgly.icons.style.duotone': 'Duotone',
  'libraries.imgly.phosphor.label': 'Icônes Phosphor',
};

export function setupTranslations(cesdk: CreativeEditorSDK): void {
  cesdk.i18n.setTranslations({
    fr: { ...fr, ...FR_OVERRIDES },
  });
  cesdk.i18n.setLocale('fr');
}

export function ensureFrenchLocale(cesdk: CreativeEditorSDK): void {
  if (cesdk.i18n.getLocale() !== 'fr') {
    cesdk.i18n.setLocale('fr');
  }
}
