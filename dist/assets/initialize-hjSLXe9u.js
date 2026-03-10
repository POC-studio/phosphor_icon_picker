const n=`function parseStrokeWidth(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

function loadLucideAndRun(callback) {
  if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
    callback();
    return;
  }
  if (!document.getElementById("lucide-script")) {
    const script = document.createElement("script");
    script.id = "lucide-script";
    script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    const check = setInterval(() => {
      if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
        clearInterval(check);
        callback();
      }
    }, 50);
  }
}

export default function (instance, context) {
  if (!document.getElementById("lucide-script")) {
    const script = document.createElement("script");
    script.id = "lucide-script";
    script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";
    document.head.appendChild(script);
  }

  const ICONS = [
    "a-arrow-down", "a-arrow-up", "a-large-small", "accessibility", "activity",
    "alert-circle", "archive", "arrow-down", "arrow-left", "arrow-right", "arrow-up",
    "bell", "book-marked", "calendar", "camera", "check", "chevron-down", "chevron-left",
    "chevron-right", "chevron-up", "circle-user", "clipboard", "clock", "cloud", "code",
    "copy", "download", "edit", "file", "folder", "heart", "help-circle", "home",
    "image", "info", "link", "list", "lock", "mail", "map-pin", "menu", "message-circle",
    "minus", "more-horizontal", "more-vertical", "pen-line", "phone", "plus", "search",
    "send", "settings", "share-2", "shield", "smile", "star", "sun", "trash-2",
    "upload", "user", "video", "wifi", "x", "zap"
  ];

  if (instance.canvas) {
    instance.canvas.css("overflow", "visible");
    if (instance.canvas.parent()) {
      instance.canvas.parent().css("overflow", "visible");
    }
  }

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.overflow = "visible";

  instance.data.parseStrokeWidth = parseStrokeWidth;
  instance.data.currentStrokeWidth = 2;
  instance.data.currentColor = "#fbbf24";
  instance.data.currentSize = 32;
  instance.data.dropdownIconWrappers = [];
  instance.data.allIcons = ICONS;
  instance.data.allowedIcons = null;

  function applyMainIcon() {
    const name = instance.data.currentIcon || "smile";
    const strokeWidth = instance.data.currentStrokeWidth;
    const color = instance.data.currentColor;
    const size = instance.data.currentSize;
    mainIconWrapper.innerHTML = \`<i data-lucide="\${name}"></i>\`;
    if (typeof window.lucide !== "undefined" && window.lucide.createIcons) {
      window.lucide.createIcons({
        root: mainIconWrapper,
        attrs: {
          stroke: color,
          "stroke-width": strokeWidth,
          width: size,
          height: size,
        },
      });
    }
  }

  const mainIconWrapper = document.createElement("div");
  mainIconWrapper.style.cursor = "pointer";
  mainIconWrapper.style.display = "flex";
  mainIconWrapper.style.alignItems = "center";
  mainIconWrapper.style.justifyContent = "center";
  mainIconWrapper.style.width = "100%";
  mainIconWrapper.style.height = "100%";
  mainIconWrapper.style.borderRadius = "8px";
  mainIconWrapper.style.transition = "background-color 0.2s";
  mainIconWrapper.innerHTML = '<i data-lucide="smile"></i>';

  if (window.ResizeObserver && instance.canvas && instance.canvas[0]) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const size = Math.min(width, height);
        if (size > 0) {
          instance.data.currentSize = size;
          const svg = mainIconWrapper.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", size);
            svg.setAttribute("height", size);
          }
        }
      }
    });
    observer.observe(instance.canvas[0]);
  }

  mainIconWrapper.onmouseover = () => (mainIconWrapper.style.backgroundColor = "#f3f4f6");
  mainIconWrapper.onmouseout = () => (mainIconWrapper.style.backgroundColor = "transparent");

  container.appendChild(mainIconWrapper);

  const dropdown = document.createElement("div");
  dropdown.style.position = "absolute";
  dropdown.style.marginTop = "0px";
  dropdown.style.backgroundColor = "#ffffff";
  dropdown.style.border = "1px solid #e5e7eb";
  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  dropdown.style.display = "none";
  dropdown.style.flexDirection = "column";
  dropdown.style.width = "280px";
  dropdown.style.zIndex = "1000";

  const searchContainer = document.createElement("div");
  searchContainer.style.padding = "8px";
  searchContainer.style.borderBottom = "1px solid #e5e7eb";
  searchContainer.style.backgroundColor = "#f9fafb";
  searchContainer.style.borderTopLeftRadius = "8px";
  searchContainer.style.borderTopRightRadius = "8px";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";
  searchInput.style.width = "100%";
  searchInput.style.padding = "8px";
  searchInput.style.border = "1px solid #d1d5db";
  searchInput.style.borderRadius = "4px";
  searchInput.style.fontSize = "14px";
  searchInput.style.outline = "none";
  searchInput.style.boxSizing = "border-box";
  instance.data.searchInput = searchInput;
  searchInput.addEventListener("focus", () => (searchInput.style.borderColor = "#3b82f6"));
  searchInput.addEventListener("blur", () => (searchInput.style.borderColor = "#d1d5db"));
  searchContainer.appendChild(searchInput);
  dropdown.appendChild(searchContainer);

  const iconsGrid = document.createElement("div");
  iconsGrid.style.display = "grid";
  iconsGrid.style.gridTemplateColumns = "repeat(5, 1fr)";
  iconsGrid.style.gap = "8px";
  iconsGrid.style.padding = "8px";
  iconsGrid.style.maxHeight = "300px";
  iconsGrid.style.overflowY = "auto";
  iconsGrid.style.overflowX = "hidden";

  ICONS.forEach((iconName) => {
    const wrapper = document.createElement("div");
    wrapper.dataset.iconName = iconName;
    wrapper.style.fontSize = "24px";
    wrapper.style.padding = "8px";
    wrapper.style.cursor = "pointer";
    wrapper.style.borderRadius = "4px";
    wrapper.style.color = instance.data.currentColor;
    wrapper.style.transition = "all 0.2s";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.innerHTML = \`<i data-lucide="\${iconName}"></i>\`;
    instance.data.dropdownIconWrappers.push(wrapper);

    wrapper.onmouseover = () => {
      wrapper.style.backgroundColor = "#f3f4f6";
      const svg = wrapper.querySelector("svg");
      if (svg) svg.setAttribute("stroke", "#111827");
    };
    wrapper.onmouseout = () => {
      wrapper.style.backgroundColor = "transparent";
      const svg = wrapper.querySelector("svg");
      if (svg) svg.setAttribute("stroke", instance.data.currentColor);
    };

    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      instance.data.currentIcon = iconName;
      instance.publishState("selected_icon", iconName);

      // Auto-binding : si la propriété initial_icon est auto-bindée dans Bubble,
      // Bubble utilisera cette valeur pour mettre à jour le champ relié.
      if (typeof instance.publishAutobindingValue === "function") {
        instance.publishAutobindingValue(iconName);
      }

      instance.triggerEvent("icon_selected");
      dropdown.style.display = "none";
      instance.publishState("is_open", false);
      applyMainIcon();
    });

    wrapper.title = iconName;
    iconsGrid.appendChild(wrapper);
  });

  dropdown.appendChild(iconsGrid);
  document.body.appendChild(dropdown);

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    instance.data.dropdownIconWrappers.forEach((wrapper) => {
      const name = wrapper.dataset.iconName.toLowerCase();
      const matchesSearch = name.includes(term);
      const isAllowed = instance.data.allowedIcons === null || instance.data.allowedIcons.has(name);
      wrapper.style.display = matchesSearch && isAllowed ? "flex" : "none";
    });
  });

  mainIconWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    const isCurrentlyClosed = dropdown.style.display === "none";
    if (isCurrentlyClosed) {
      const rect = mainIconWrapper.getBoundingClientRect();
      dropdown.style.top = \`\${rect.bottom + window.scrollY + 8}px\`;
      dropdown.style.left = \`\${rect.left + window.scrollX}px\`;
      dropdown.style.display = "flex";
      searchInput.focus();
    } else {
      dropdown.style.display = "none";
    }
    instance.publishState("is_open", isCurrentlyClosed);
  });

  document.addEventListener("click", () => {
    if (dropdown.style.display !== "none") {
      dropdown.style.display = "none";
      instance.publishState("is_open", false);
    }
  });

  window.addEventListener(
    "scroll",
    (e) => {
      if (dropdown.contains(e.target)) return;
      if (dropdown.style.display !== "none") {
        dropdown.style.display = "none";
        instance.publishState("is_open", false);
      }
    },
    true
  );

  instance.canvas.append(container);
  instance.data.mainIconWrapper = mainIconWrapper;
  instance.data.iconsGrid = iconsGrid;
  instance.data.applyMainIcon = applyMainIcon;
  instance.data.currentIcon = "smile";

  loadLucideAndRun(() => {
    applyMainIcon();
    window.lucide.createIcons({
      root: iconsGrid,
      attrs: {
        stroke: instance.data.currentColor,
        "stroke-width": instance.data.currentStrokeWidth,
        width: 24,
        height: 24,
      },
    });
  });
}
`;export{n as default};
