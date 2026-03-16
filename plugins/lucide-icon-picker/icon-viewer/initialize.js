export default function(instance, context) {
  // Initialisation minimale : on laisse tout le rendu à update.js
  // mais on garde le clic pour l'événement Bubble.
  instance.canvas.css({
    cursor: "pointer",
    display: "inline-block",
  });

  const root = instance.canvas && instance.canvas.get
    ? instance.canvas.get(0)
    : null;

  if (root) {
    root.addEventListener("click", function(e) {
      e.stopPropagation();
      if (typeof instance.triggerEvent === "function") {
        instance.triggerEvent("is_clicked");
      }
    });
  }
}
