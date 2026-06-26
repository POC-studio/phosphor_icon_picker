export const BUBBLE_GROUP_CREATE_ID = 'imgly.bubble.group.create.inspectorBar';
export const BUBBLE_GROUP_UNGROUP_ID = 'imgly.bubble.group.ungroup.inspectorBar';

const GROUP_BLOCK_TYPE = '//ly.img.ubq/group';

/**
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 */
function canCreateGroup(engine) {
  const selected = engine.block.findAllSelected();
  return selected.length >= 2 && engine.block.isGroupable(selected);
}

/**
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 */
function canUngroup(engine) {
  const [selected] = engine.block.findAllSelected();
  return selected != null && engine.block.getType(selected) === GROUP_BLOCK_TYPE;
}

/**
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 * @param {{ setValue: (v: number) => void, value: number }} revision
 */
function ensureSelectionRevisionWatcher(engine, revision) {
  if (engine._bubbleGroupSelectionWatcher) return;
  engine._bubbleGroupSelectionWatcher = true;
  if (typeof engine.block.onSelectionChanged !== 'function') return;
  engine.block.onSelectionChanged(() => {
    revision.setValue(revision.value + 1);
  });
}

/**
 * Boutons Grouper / Dissocier sans rôle Creator (évite la section « Exporter »).
 * @param {import('@cesdk/cesdk-js').CreativeEditorSDK} cesdk
 */
export function setupGroupActions(cesdk) {
  if (!cesdk?.ui || !cesdk?.engine) return;

  cesdk.ui.registerComponent(BUBBLE_GROUP_CREATE_ID, ({ builder, engine, state }) => {
    const revision = state('selectionRevision', 0);
    ensureSelectionRevisionWatcher(engine, revision);
    void revision.value;

    if (!canCreateGroup(engine)) return;

    builder.Button('bubble-group-create', {
      icon: '@imgly/Group',
      label: 'action.group',
      variant: 'plain',
      onClick: () => {
        const selected = engine.block.findAllSelected();
        if (!canCreateGroup(engine)) return;
        try {
          engine.block.group(selected);
        } catch (err) {
          console.error('IMG.LY View: échec du groupement', err);
        }
      },
    });
  });

  cesdk.ui.registerComponent(BUBBLE_GROUP_UNGROUP_ID, ({ builder, engine, state }) => {
    const revision = state('selectionRevision', 0);
    ensureSelectionRevisionWatcher(engine, revision);
    void revision.value;

    if (!canUngroup(engine)) return;

    builder.Button('bubble-group-ungroup', {
      icon: '@imgly/Ungroup',
      label: 'action.ungroup',
      variant: 'plain',
      onClick: () => {
        const [groupId] = engine.block.findAllSelected();
        if (!canUngroup(engine) || groupId == null) return;
        try {
          const children = engine.block.getChildren(groupId);
          engine.block.ungroup(groupId);
          for (const childId of children) {
            engine.block.setSelected(childId, true);
          }
        } catch (err) {
          console.error('IMG.LY View: échec de la dissociation', err);
        }
      },
    });
  });
}
