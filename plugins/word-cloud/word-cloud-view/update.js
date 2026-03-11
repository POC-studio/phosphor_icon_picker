import { parseWordsList, sortAndNormalizeWordList } from '../shared.js';

export default function (instance, properties, context) {
  if (!properties) return;

  if (properties.text_color != null && properties.text_color !== '') {
    instance.data.currentColor = String(properties.text_color).trim() || instance.data.currentColor || '#333333';
  }
  if (properties.font_family != null && properties.font_family !== '') {
    instance.data.currentFontFamily = String(properties.font_family).trim() || 'sans serif';
  }
  if (properties.words_list != null) {
    const raw = parseWordsList(properties.words_list);
    instance.data.currentList = sortAndNormalizeWordList(raw);
  }

  if (instance.data.drawWordCloud) {
    instance.data.drawWordCloud();
  }
}
