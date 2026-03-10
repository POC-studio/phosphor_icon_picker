// update.js
function parseStrokeWidth(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

export default function (instance, properties, context) {
  if (!properties) return;

  const strokeWidth = parseStrokeWidth(properties.stroke_width);
  instance.data.currentStrokeWidth = strokeWidth;
  let color = properties.color != null ? String(properties.color).trim() : "";
  if (!color) {
    color = instance.data.currentColor || "#000000";
  }
  instance.data.currentColor = color;

  let width = 32;
  let height = 32;
  if (properties.bubble) {
    width = typeof properties.bubble.width === "function" ? properties.bubble.width() : properties.bubble.width;
    height = typeof properties.bubble.height === "function" ? properties.bubble.height() : properties.bubble.height;
  }
  const size = Math.min(width || 32, height || 32);
  instance.data.currentSize = size;

  if (instance.data.isOpen === undefined) {
    instance.data.isOpen = false;
    instance.publishState("is_open", false);
  }

  if (instance.data.dropdownIconWrappers) {
    instance.data.dropdownIconWrappers.forEach((wrapper) => {
      const svg = wrapper.querySelector("svg");
      if (svg) {
        svg.setAttribute("stroke", color);
        svg.setAttribute("stroke-width", strokeWidth);
      }
    });
  }

  if (properties.search_placeholder !== undefined && instance.data.searchInput) {
    instance.data.searchInput.placeholder = properties.search_placeholder;
  }

  if (properties.allowed_icons !== undefined) {
    const rawAllowed = (properties.allowed_icons || "").trim();
    if (rawAllowed === "") {
      instance.data.allowedIcons = null;
    } else {
      const allowedList = rawAllowed
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .map((i) => (i.startsWith("lucide-") ? i.replace("lucide-", "") : i))
        .filter((i) => instance.data.allIcons.includes(i));
      instance.data.allowedIcons = new Set(allowedList);
    }

    const searchTerm =
      instance.data.searchInput && instance.data.searchInput.value
        ? instance.data.searchInput.value.toLowerCase()
        : "";
    if (instance.data.dropdownIconWrappers) {
      instance.data.dropdownIconWrappers.forEach((wrapper) => {
        const name = wrapper.dataset.iconName.toLowerCase();
        const matchesSearch = name.includes(searchTerm);
        const isAllowed = instance.data.allowedIcons === null || instance.data.allowedIcons.has(name);
        wrapper.style.display = matchesSearch && isAllowed ? "flex" : "none";
      });
    }
  }

  // Icône affichée : priorité à "value" (champ autobinding) puis à "initial_icon"
  const valueTrimmed = properties.value != null ? String(properties.value).trim() : "";
  const initialIconTrimmed = properties.initial_icon != null ? String(properties.initial_icon).trim() : "";
  const iconFromProps = valueTrimmed || initialIconTrimmed;
  if (iconFromProps) {
    if (!instance.data.currentIcon || instance.data.lastInitialIcon !== iconFromProps) {
      instance.data.currentIcon = iconFromProps;
      instance.data.lastInitialIcon = iconFromProps;
      instance.publishState("selected_icon", iconFromProps);
    }
  }

  if (instance.data.mainIconWrapper && instance.data.applyMainIcon) {
    instance.data.applyMainIcon();
  }
}
