export default function(instance, properties, context) {
  console.log("[Lucide Picker][update] start", { properties, context });
  if (!properties) {
    console.log("[Lucide Picker][update] no properties, abort");
    return;
  }

  // 1) Récupération des props Bubble
  var valueTrimmed =
    properties.value != null ? String(properties.value).trim() : "";
  var initialIconTrimmed =
    properties.initial_icon != null
      ? String(properties.initial_icon).trim()
      : "";
  var iconName = (valueTrimmed || initialIconTrimmed || "smile").toLowerCase();
  console.log("[Lucide Picker][update] iconName", {
    valueTrimmed,
    initialIconTrimmed,
    iconName,
  });

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

  // 2) Etats internes
  instance.data.currentStrokeWidth = strokeWidth;
  instance.data.currentColor = color;
  instance.data.currentSize = size;

  if (instance.data.isOpen === undefined) {
    instance.data.isOpen = false;
    instance.publishState("is_open", false);
  }

  // 3) Rendu de l'icône principale dans le canvas
  var root =
    instance.canvas && instance.canvas.get ? instance.canvas.get(0) : null;
  if (!root) {
    console.log("[Lucide Picker][update] no canvas root", instance.canvas);
    return;
  }
  console.log("[Lucide Picker][update] canvas root before render", root);

  var previousIcon = instance.data.currentIcon;
  if (!previousIcon || previousIcon !== iconName) {
    instance.data.currentIcon = iconName;
    instance.publishState("selected_icon", iconName);
  }

  // On ne touche pas au dropdown : il est géré par initialize
  if (instance.data.mainIconWrapper) {
    instance.data.mainIconWrapper.innerHTML =
      '<i data-lucide="' + iconName + '"></i>';
  } else {
    // fallback : tout mettre dans le canvas si jamais
    instance.canvas.html('<i data-lucide="' + iconName + '"></i>');
  }
  console.log("[Lucide Picker][update] after html", root.innerHTML);

  var lucideGlobal =
    (typeof window !== "undefined" && window.lucide) ||
    (typeof lucide !== "undefined" ? lucide : null);

  if (lucideGlobal && typeof lucideGlobal.createIcons === "function") {
    console.log(
      "[Lucide Picker][update] calling createIcons",
      lucideGlobal,
      { color, size, strokeWidth }
    );
    try {
      // Global scan comme dans le code qui marche
      lucideGlobal.createIcons({
        attrs: {
          color: color,
          width: size,
          height: size,
          "stroke-width": strokeWidth,
        },
      });
    } catch (e) {
      console.error("[Lucide Picker][update] createIcons error", e);
    }
  } else {
    console.warn(
      "[Lucide Picker][update] lucideGlobal.createIcons not available",
      lucideGlobal
    );
  }

  // 4) Mettre à jour les SVG du dropdown (si Lucide les a générés)
  if (instance.data.dropdownIconWrappers) {
    instance.data.dropdownIconWrappers.forEach(function(wrapper) {
      var svg = wrapper.querySelector("svg");
      if (svg) {
        svg.setAttribute("stroke", color);
        svg.setAttribute("stroke-width", strokeWidth);
      }
    });
  }

  // 5) Filtrage allowed_icons + placeholder de recherche (on garde ta logique)
  if (properties.search_placeholder !== undefined && instance.data.searchInput) {
    instance.data.searchInput.placeholder = properties.search_placeholder;
  }

  if (properties.allowed_icons !== undefined) {
    var rawAllowed = (properties.allowed_icons || "").trim();
    if (rawAllowed === "") {
      instance.data.allowedIcons = null;
    } else {
      var allowedList = rawAllowed
        .split(",")
        .map(function(i) {
          return i.trim().toLowerCase();
        })
        .map(function(i) {
          return i.startsWith("lucide-") ? i.replace("lucide-", "") : i;
        })
        .filter(function(i) {
          return instance.data.allIcons && instance.data.allIcons.includes(i);
        });
      instance.data.allowedIcons = new Set(allowedList);
    }

    var searchTerm =
      instance.data.searchInput && instance.data.searchInput.value
        ? instance.data.searchInput.value.toLowerCase()
        : "";
    if (instance.data.dropdownIconWrappers) {
      instance.data.dropdownIconWrappers.forEach(function(wrapper) {
        var name = wrapper.dataset.iconName.toLowerCase();
        var matchesSearch = name.includes(searchTerm);
        var isAllowed =
          instance.data.allowedIcons === null ||
          instance.data.allowedIcons.has(name);
        wrapper.style.display = matchesSearch && isAllowed ? "flex" : "none";
      });
    }
  }
}
