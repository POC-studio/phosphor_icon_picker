const STYLE_ID = 'imgly-save-button-styles';

const SAVE_BUTTON_CSS = `
  .imgly-save-button-group [class*="ubq-color_accent"]:not(:disabled) {
    background: #111827 !important;
    color: #ffffff !important;
  }
  .imgly-save-button-group [class*="ubq-color_accent"]:not(:disabled):hover:not(:active) {
    background: #1f2937 !important;
    color: #ffffff !important;
  }
  .imgly-save-button-group [class*="ubq-color_accent"]:not(:disabled):active {
    background: #030712 !important;
    color: #ffffff !important;
  }
  .imgly-save-button-group [class*="ubq-color_accent"]:disabled {
    background: #e5e7eb !important;
    color: #9ca3af !important;
    cursor: not-allowed !important;
  }
`;

/** @param {ParentNode} [root] */
export function tagSaveButtonGroup(root) {
  if (typeof document === 'undefined' || !root) return;
  const groups = root.querySelectorAll('[class*="ButtonGroup"]');
  for (const group of groups) {
    const saveBtn = group.querySelector('button');
    if (!saveBtn) continue;
    const label = (saveBtn.textContent || '').trim();
    if (!label.includes('Enregistrer')) continue;
    group.classList.add('imgly-save-button-group');
    return;
  }
}

export function ensureSaveButtonStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = SAVE_BUTTON_CSS;
  document.head.appendChild(style);
}

/**
 * @param {ParentNode} [root]
 */
export function scheduleSaveButtonGroupTag(root) {
  if (typeof requestAnimationFrame === 'undefined') {
    tagSaveButtonGroup(root);
    return;
  }
  requestAnimationFrame(() => {
    tagSaveButtonGroup(root);
    requestAnimationFrame(() => tagSaveButtonGroup(root));
  });
}
