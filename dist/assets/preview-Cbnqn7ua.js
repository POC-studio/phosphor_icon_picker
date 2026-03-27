const e=`export default function(instance) {
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.background = '#f8fafc';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.border = '1px dashed #cbd5e1';
  container.style.boxSizing = 'border-box';

  const label = document.createElement('div');
  label.textContent = 'Fabric View (Preview)';
  label.style.padding = '10px 14px';
  label.style.borderRadius = '10px';
  label.style.border = '1px solid #e2e8f0';
  label.style.background = '#ffffff';
  label.style.color = '#334155';
  label.style.fontSize = '13px';
  label.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";

  container.appendChild(label);
  instance.canvas.append(container);
}
`;export{e as default};
