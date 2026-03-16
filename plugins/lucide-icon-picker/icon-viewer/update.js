export default function(instance, properties, context) {
  console.log("[Lucide Viewer][update] start", { properties, context });
  if (!properties) {
    console.log("[Lucide Viewer][update] no properties, abort");
    return;
  }

  // 1) Récupération des props Bubble
  var iconName = (properties.initial_icon || "smile").toLowerCase();
  console.log("[Lucide Viewer][update] iconName", iconName);

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
    console.log("[Lucide Viewer][update] no canvas root", instance.canvas);
    return;
  }
  console.log("[Lucide Viewer][update] canvas root before html", root);

  var current = instance.data.current_icon_name;
  var svg = root.firstChild;

  // 2) Création ou changement d'icône
  if (!svg || iconName !== current) {
    console.log("[Lucide Viewer][update] creating/replacing icon", {
      previous: current,
      next: iconName,
    });
    instance.data.current_icon_name = iconName;

    instance.canvas.html('<i data-lucide="' + iconName + '"></i>');
    console.log(
      "[Lucide Viewer][update] after html",
      root.innerHTML
    );
    var element = root.firstChild;

    var lucideGlobal =
      (typeof window !== "undefined" && window.lucide) ||
      (typeof lucide !== "undefined" ? lucide : null);

    if (lucideGlobal && typeof lucideGlobal.createIcons === "function") {
      console.log(
        "[Lucide Viewer][update] calling createIcons",
        lucideGlobal,
        { color, size, strokeWidth }
      );
      try {
        lucideGlobal.createIcons({
          attrs: {
            color: color,
            width: size,
            height: size,
            "stroke-width": strokeWidth,
          },
        });
      } catch (e) {
        console.error("[Lucide Viewer][update] createIcons error", e);
      }
    } else {
      console.warn(
        "[Lucide Viewer][update] lucideGlobal.createIcons not available",
        lucideGlobal
      );
    }

    instance.canvas.css({
      cursor: "pointer",
      display: "inline-block",
    });

    // On vérifie globalement si Lucide a vraiment généré un SVG
    var svgElement = root.querySelector("svg");
    console.log(
      "[Lucide Viewer][update] svgElement after createIcons",
      svgElement
    );
    if (!svgElement) {
      var naElement = document.createElement("div");
      naElement.textContent = "NA";
      naElement.style.width = size + "px";
      naElement.style.height = size + "px";
      naElement.style.display = "flex";
      naElement.style.alignItems = "center";
      naElement.style.justifyContent = "center";
      naElement.style.borderRadius = "4px";
      naElement.style.color = "#000000";
      naElement.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      naElement.style.fontSize = size / 3 + "px";
      naElement.style.fontFamily = "sans-serif";
      naElement.style.fontWeight = "bold";

      instance.canvas.append(naElement);
    } else {
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
