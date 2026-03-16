export default function(instance, context) {
  console.log("[Lucide Viewer][init] start", { instance, context });

  // Initialisation minimale : on laisse tout le rendu à update.js
  instance.canvas.css({
    cursor: "pointer",
    display: "inline-block",
  });

  const root = instance.canvas && instance.canvas.get
    ? instance.canvas.get(0)
    : null;
  console.log("[Lucide Viewer][init] canvas root", root);
}
