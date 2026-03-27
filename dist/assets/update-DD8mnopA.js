const n=`export default function(instance, properties, context) {
  if (!properties) {
    return;
  }

  // 1) Récupération des props Bubble
  // Autobinding : priorité à la valeur liée, puis à initial_icon.
  var autobindingTrimmed =
    properties.autobinding != null ? String(properties.autobinding).trim() : "";
  var initialIconTrimmed =
    properties.initial_icon != null
      ? String(properties.initial_icon).trim()
      : "";
  var PLACEHOLDER_ICON = "smile";
  var PLACEHOLDER_GRAY = "#9ca3af";

  if (!initialIconTrimmed) {
    initialIconTrimmed = PLACEHOLDER_ICON;
  }
  var iconName = (autobindingTrimmed || initialIconTrimmed).toLowerCase();

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
    return;
  }

  var previousIcon = instance.data.currentIcon;
  if (!previousIcon || previousIcon !== iconName) {
    instance.data.currentIcon = iconName;
    instance.publishState("selected_icon", iconName);
    // mettre à jour la valeur d'autobinding si disponible (même pattern que Phosphor)
    if (typeof instance.publishAutobinding === "function") {
      instance.publishAutobinding(iconName);
    }
  }

  // Icône principale : si aucune icône « réelle » (autobinding / initial) → smile grisé
  var isPlaceholder =
    !autobindingTrimmed &&
    (!properties.initial_icon || !String(properties.initial_icon).trim());

  var mainColor = isPlaceholder ? PLACEHOLDER_GRAY : color;

  // On ne touche pas au dropdown : il est géré par initialize
  if (instance.data.mainIconWrapper) {
    instance.data.mainIconWrapper.innerHTML =
      '<i data-lucide="' + iconName + '"></i>';
  } else {
    // fallback : tout mettre dans le canvas si jamais
    instance.canvas.html('<i data-lucide="' + iconName + '"></i>');
  }

  var lucideGlobal =
    (typeof window !== "undefined" && window.lucide) ||
    (typeof lucide !== "undefined" ? lucide : null);

  if (lucideGlobal && typeof lucideGlobal.createIcons === "function") {
    try {
      // Global scan comme dans le code qui marche
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
  if (instance.data.searchInput) {
    var placeholder =
      properties.search_placeholder !== undefined &&
      properties.search_placeholder !== null &&
      String(properties.search_placeholder).trim() !== ""
        ? String(properties.search_placeholder)
        : "Search...";
    instance.data.searchInput.placeholder = placeholder;
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
`;export{n as default};
