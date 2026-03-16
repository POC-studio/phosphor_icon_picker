export default function(instance, properties, context) {
  if (!properties) {
    return;
  }

  // 1) Récupération des props Bubble
  var rawInitial =
    properties.initial_icon != null
      ? String(properties.initial_icon).trim()
      : "";
  var PLACEHOLDER_ICON = "smile";
  var PLACEHOLDER_GRAY = "#9ca3af";

  if (!rawInitial) {
    rawInitial = PLACEHOLDER_ICON;
  }
  var iconName = rawInitial.toLowerCase();

  var width = 32;
  var height = 32;
  if (properties.bubble) {
    width =
      typeof properties.bubble.width === "function"
        ? properties.bubble.width()
        : properties.bubble.width;
    height =
      typeof properties.bubble.height === "function"
        ? properties.bubble.height()
        : properties.bubble.height;
  }
  var size = Math.min(width || 32, height || 32);

  var color =
    properties.color != null ? String(properties.color).trim() : "#000000";
  if (!color) color = "#000000";

  var strokeWidthRaw =
    properties.stroke_width !== undefined ? properties.stroke_width : 2;
  var n = Number(strokeWidthRaw);
  var strokeWidth = Number.isFinite(n) && n > 0 ? n : 2;

  var transitionDuration = 0;
  var transitionEasing = "ease";

  var root = instance.canvas && instance.canvas.get
    ? instance.canvas.get(0)
    : null;
  if (!root) {
    return;
  }

  var current = instance.data.current_icon_name;
  var svg = root.firstChild;

  // Placeholder gris si aucune icône initiale fournie
  var isPlaceholder =
    !properties.initial_icon || !String(properties.initial_icon).trim();
  var mainColor = isPlaceholder ? PLACEHOLDER_GRAY : color;

  // 2) Création ou changement d'icône
  if (!svg || iconName !== current) {
    instance.data.current_icon_name = iconName;

    instance.canvas.html('<i data-lucide="' + iconName + '"></i>');
    var element = root.firstChild;

    var lucideGlobal =
      (typeof window !== "undefined" && window.lucide) ||
      (typeof lucide !== "undefined" ? lucide : null);

    if (lucideGlobal && typeof lucideGlobal.createIcons === "function") {
      try {
        lucideGlobal.createIcons({
          attrs: {
            color: mainColor,
            width: size,
            height: size,
            "stroke-width": strokeWidth,
          },
        });
      } catch (e) {
        // ignore
      }
    }

    instance.canvas.css({
      cursor: "pointer",
      display: "inline-block",
    });

    // On vérifie globalement si Lucide a vraiment généré un SVG
    var svgElement = root.querySelector("svg");
    if (svgElement) {
      svgElement.style.transition =
        "all " + transitionDuration + "ms " + transitionEasing;
    }
  } else {
    // 3) Mise à jour des propriétés sur une icône déjà rendue
    var svgExisting = root.querySelector("svg");
    if (svgExisting) {
      svgExisting.style.stroke = color;
      svgExisting.style.width = size + "px";
      svgExisting.style.height = size + "px";
      svgExisting.style.strokeWidth = strokeWidth;
      svgExisting.style.transition =
        "all " + transitionDuration + "ms " + transitionEasing;
    }
  }
}
