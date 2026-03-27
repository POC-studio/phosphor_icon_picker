const n=`export default function(instance) {
  const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
  const ui = instance && instance.data ? instance.data.ui : null;
  if (!fabricCanvas || !ui || !ui.board) return;

  const width = Math.max(ui.board.clientWidth || 1, 1);
  const height = Math.max(ui.board.clientHeight || 1, 1);
  fabricCanvas.setDimensions({ width, height });
  fabricCanvas.requestRenderAll();

  try {
    const payload = JSON.stringify(fabricCanvas.toJSON());
    instance.publishState('canvas_json', payload);
  } catch (e) {
    instance.publishState('canvas_json', '{}');
  }
}
`;export{n as default};
