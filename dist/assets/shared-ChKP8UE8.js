const n=`/**
 * Parse multiline text "weight word" into wordcloud2.js list format [[word, weight], ...].
 * Format: one line = number (weight) + space + word. Invalid lines are skipped.
 */
export function parseWordsList(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.trim().split(/\\n/);
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const firstSpace = trimmed.indexOf(' ');
    if (firstSpace < 0) continue;
    const weightStr = trimmed.slice(0, firstSpace);
    const word = trimmed.slice(firstSpace + 1).trim();
    const weight = parseInt(weightStr, 10);
    if (!word || isNaN(weight) || weight <= 0) continue;
    result.push([word, weight]);
  }
  return result;
}

/**
 * Map Bubble dropdown option to CSS font-family string for wordcloud2.
 */
export function getFontFamily(option) {
  const key = (option || 'sans serif').toLowerCase().replace(/\\s+/g, ' ');
  const map = {
    serif: "Georgia, 'Times New Roman', serif",
    'sans serif': "'Helvetica Neue', Arial, sans-serif",
    monospace: "'Consolas', 'Monaco', monospace",
  };
  return map[key] != null ? map[key] : map['sans serif'];
}
`;export{n as default};
