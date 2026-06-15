/* GENERATED FILE - ne pas éditer. Source : fabric-view/src/ (npm run build:plugins) */
export default function(instance, context) {
var __pluginInit = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/fabric/fabric-view/src/index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });

  // plugins/fabric/fabric-view/src/constants.js
  var FONT_PRESETS = [
    { label: "JetBrains Mono", fontFamily: "'JetBrains Mono'" },
    { label: "Fraunces", fontFamily: "'Fraunces'" },
    { label: "Schoolbell", fontFamily: "'Schoolbell'" },
    { label: "Space Grotesk", fontFamily: "'Space Grotesk'" },
    { label: "Ultra", fontFamily: "'Ultra'" }
  ];
  var DEFAULT_TEXT_FONT_FAMILY = FONT_PRESETS[0].fontFamily;
  var TOOLBAR_VISIBILITY_BY_TYPE = {
    default: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false, opacity: true },
    rect: { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: false, opacity: true },
    circle: { fill: true, stroke: true, strokeWidth: true, radius: false, fontSize: false, opacity: true },
    /** Raster fabric.Image : type sérialisé `'image'`, pas de fill (bitmap), stroke possible pour un cadre. */
    image: { fill: false, stroke: true, strokeWidth: true, radius: true, fontSize: false, opacity: true },
    textbox: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true },
    text: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true },
    iText: { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: true, opacity: true }
  };
  var PHOSPHOR_REGULAR_ICONS_FALLBACK = [
    "smiley",
    "heart",
    "star",
    "house",
    "user",
    "users",
    "bell",
    "camera",
    "image",
    "chat-circle",
    "paper-plane-tilt",
    "bookmark",
    "calendar",
    "clock",
    "gear",
    "lightbulb",
    "cloud",
    "sun",
    "moon",
    "rocket",
    "leaf",
    "music-note",
    "shopping-cart",
    "gift",
    "globe",
    "map-pin"
  ];
  var PHOSPHOR_STYLES = ["regular", "bold", "fill", "light", "thin", "duotone"];
  var ARTBOARD_VIEWER_MARGIN_PX = 24;
  var ALT_DUP_MIN_MOVE_PX = 5;
  var PX_PER_MM = 300 / 25.4;
  var MARGIN_5MM_PX = Math.round(5 * PX_PER_MM);
  var ARTBOARD_PRESETS = [
    {
      width: 1754,
      height: 2480,
      marginTop: MARGIN_5MM_PX,
      marginRight: MARGIN_5MM_PX,
      marginBottom: MARGIN_5MM_PX,
      marginLeft: 0
    },
    {
      width: 3508,
      height: 2480,
      marginTop: MARGIN_5MM_PX,
      marginRight: MARGIN_5MM_PX,
      marginBottom: MARGIN_5MM_PX,
      marginLeft: MARGIN_5MM_PX
    },
    {
      width: 1754,
      height: 2480,
      marginTop: MARGIN_5MM_PX,
      marginRight: 0,
      marginBottom: MARGIN_5MM_PX,
      marginLeft: MARGIN_5MM_PX
    }
  ];

  // plugins/fabric/fabric-view/src/utils.js
  function ensureHexColor(value, fallback) {
    const safeFallback = fallback || "#111827";
    if (!value || typeof value !== "string") return safeFallback;
    const color = value.trim();
    if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color)) return color;
    const rgbMatch = color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
      const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
      const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
      const a = rgbMatch[4] == null ? 1 : Number(rgbMatch[4]);
      if (Number.isFinite(a) && a <= 0) return "transparent";
      const toHex = (n) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillStyle = color;
        const normalized = String(ctx.fillStyle || "").trim();
        if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(normalized)) return normalized;
        const nMatch = normalized.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
        if (nMatch) {
          const r = Math.max(0, Math.min(255, Number(nMatch[1])));
          const g = Math.max(0, Math.min(255, Number(nMatch[2])));
          const b = Math.max(0, Math.min(255, Number(nMatch[3])));
          const a = nMatch[4] == null ? 1 : Number(nMatch[4]);
          if (Number.isFinite(a) && a <= 0) return "transparent";
          const toHex = (n) => n.toString(16).padStart(2, "0");
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
      }
    } catch (e) {
    }
    return color;
  }
  function isTransparentColor(value) {
    if (typeof value !== "string") return false;
    const v = value.trim().toLowerCase();
    return v === "transparent" || v === "#00000000" || v === "rgba(0,0,0,0)" || v === "rgba(0, 0, 0, 0)";
  }
  function ensureHex(value, fallback) {
    if (!value || typeof value !== "string") return fallback;
    const v = value.trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;
    const rgbMatch = v.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
      const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
      const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
      const a = rgbMatch[4] == null ? 1 : Number(rgbMatch[4]);
      if (Number.isFinite(a) && a <= 0) return "transparent";
      const toHex = (n) => n.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillStyle = v;
        const normalized = String(ctx.fillStyle || "").trim();
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized)) return normalized;
        const nMatch = normalized.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
        if (nMatch) {
          const r = Math.max(0, Math.min(255, Number(nMatch[1])));
          const g = Math.max(0, Math.min(255, Number(nMatch[2])));
          const b = Math.max(0, Math.min(255, Number(nMatch[3])));
          const a = nMatch[4] == null ? 1 : Number(nMatch[4]);
          if (Number.isFinite(a) && a <= 0) return "transparent";
          const toHex = (n) => n.toString(16).padStart(2, "0");
          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
      }
    } catch (e) {
    }
    return v;
  }
  function clampArtboardIndex(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(2, Math.floor(n)));
  }
  function getSharedValue(items, getter) {
    if (!Array.isArray(items) || items.length === 0) return { mixed: true, value: null };
    const first = getter(items[0]);
    for (let i = 1; i < items.length; i += 1) {
      if (getter(items[i]) !== first) return { mixed: true, value: null };
    }
    return { mixed: false, value: first };
  }
  function normalizeFontFamily(value) {
    if (value == null || typeof value !== "string") return "";
    const first = value.split(",")[0].trim();
    return first.replace(/\s+/g, " ").replace(/['"]/g, "").toLowerCase();
  }
  function normalizeCanvasColor(value, fallback) {
    return isTransparentColor(value) ? "transparent" : ensureHexColor(value, fallback);
  }
  function shouldZeroStrokeWidth(colorValue) {
    if (typeof colorValue !== "string") return false;
    const v = colorValue.trim().toLowerCase();
    return v === "transparent" || v === "#00000000" || v === "rgba(0,0,0,0)" || v === "rgba(0, 0, 0, 0)";
  }
  function computeFit(boardWidth, boardHeight, docWidth, docHeight) {
    const safeBoardW = Math.max(Number(boardWidth) || 1, 1);
    const safeBoardH = Math.max(Number(boardHeight) || 1, 1);
    const safeDocW = Math.max(Number(docWidth) || 1, 1);
    const safeDocH = Math.max(Number(docHeight) || 1, 1);
    const scale = Math.min(safeBoardW / safeDocW, safeBoardH / safeDocH);
    const offsetX = (safeBoardW - safeDocW * scale) / 2;
    const offsetY = (safeBoardH - safeDocH * scale) / 2;
    return { scale, offsetX, offsetY };
  }
  function guessImageFileExtension(file) {
    const t = String(file && file.type ? file.type : "").toLowerCase();
    if (t === "image/jpeg") return ".jpg";
    if (t === "image/png") return ".png";
    if (t === "image/gif") return ".gif";
    if (t === "image/webp") return ".webp";
    if (t === "image/svg+xml") return ".svg";
    return ".png";
  }
  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("FileReader failed"));
      reader.readAsDataURL(file);
    });
  }
  function dataUrlToBase64(dataUrl) {
    if (typeof dataUrl !== "string") return "";
    const idx = dataUrl.indexOf("base64,");
    return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
  }

  // plugins/fabric/fabric-view/src/text.js
  function loadWebFontsThenRedraw(fabricCanvas, targets) {
    if (!fabricCanvas || !Array.isArray(targets) || targets.length === 0) return;
    const doc = typeof document !== "undefined" ? document : null;
    if (!doc || !doc.fonts || typeof doc.fonts.load !== "function") {
      fabricCanvas.requestRenderAll();
      return;
    }
    const loads = targets.map((target) => {
      const size = Number.isFinite(Number(target.fontSize)) ? Math.max(1, Math.min(400, Number(target.fontSize))) : 16;
      const ff = typeof target.fontFamily === "string" ? target.fontFamily.trim() : "";
      if (!ff) return Promise.resolve();
      return doc.fonts.load(`${size}px ${ff}`).catch(() => {
      });
    });
    Promise.all(loads).finally(() => {
      targets.forEach((t) => {
        if (typeof t.initDimensions === "function") t.initDimensions();
        if (typeof t.setCoords === "function") t.setCoords();
        relayoutParentGroups(t);
      });
      fabricCanvas.requestRenderAll();
    });
  }
  function relayoutParentGroups(target) {
    let parent = target ? target.group || target.parent : null;
    while (parent) {
      if (typeof parent.triggerLayout === "function") parent.triggerLayout();
      if (typeof parent.setCoords === "function") parent.setCoords();
      parent = parent.group || parent.parent;
    }
  }
  function syncFontFamilySelect(ui, rawFontFamily, mixed) {
    const sel = ui.fontFamilySelect;
    if (!sel) return;
    while (sel.options.length > FONT_PRESETS.length) {
      sel.remove(sel.options.length - 1);
    }
    if (mixed) {
      sel.selectedIndex = -1;
      sel.style.background = "#f1f5f9";
      sel.style.color = "#64748b";
      sel.style.borderColor = "#cbd5e1";
      return;
    }
    sel.style.background = "#ffffff";
    sel.style.color = "#0f172a";
    sel.style.borderColor = "#cbd5e1";
    const n = normalizeFontFamily(rawFontFamily);
    let matched = false;
    for (let i = 0; i < FONT_PRESETS.length; i += 1) {
      if (normalizeFontFamily(FONT_PRESETS[i].fontFamily) === n) {
        sel.value = FONT_PRESETS[i].fontFamily;
        matched = true;
        break;
      }
    }
    if (!matched && rawFontFamily && typeof rawFontFamily === "string" && rawFontFamily.trim()) {
      const opt = document.createElement("option");
      opt.value = rawFontFamily;
      opt.textContent = "Autre";
      sel.appendChild(opt);
      sel.value = rawFontFamily;
    } else if (!matched) {
      sel.value = FONT_PRESETS[0].fontFamily;
    }
  }
  function applyTextboxEditingControls(target) {
    if (!isTextLikeObject(target)) return;
    if (typeof target.setControlsVisibility === "function") {
      target.setControlsVisibility({
        mt: false,
        mb: false,
        ml: true,
        mr: true,
        tl: true,
        tr: true,
        bl: true,
        br: true,
        mtr: true
      });
    }
    if (typeof target.set === "function") {
      target.set({ lockSkewingX: true, lockSkewingY: true });
    }
  }

  // plugins/fabric/fabric-view/src/shapes.js
  function getRectCornerRadiusPx(target) {
    if (!target || target.type !== "rect") return 0;
    if (Number.isFinite(Number(target.cornerRadiusPx))) {
      return Math.max(0, Number(target.cornerRadiusPx));
    }
    const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
    const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
    const rx = Number.isFinite(Number(target.rx)) ? Number(target.rx) : 0;
    const ry = Number.isFinite(Number(target.ry)) ? Number(target.ry) : rx;
    return Math.max(0, Math.min(rx * sx, ry * sy));
  }
  function applyRectCornerRadiusPx(target, radiusPx) {
    if (!target || target.type !== "rect") return;
    const safeRadiusPx = Math.max(0, Number(radiusPx) || 0);
    const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
    const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
    target.set({
      cornerRadiusPx: safeRadiusPx,
      rx: safeRadiusPx / sx,
      ry: safeRadiusPx / sy
    });
  }
  function applyImageCornerRadiusPx(target, fabricLib, radiusPx) {
    if (!target || !isFabricRasterImage(target) || !fabricLib || !fabricLib.Rect) return;
    const safePx = Math.max(0, Math.min(200, Number(radiusPx) || 0));
    const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
    const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
    const s = Math.min(sx, sy);
    const w = Math.max(1e-6, Number(target.width) || 1);
    const h = Math.max(1e-6, Number(target.height) || 1);
    target.set({ cornerRadiusPx: safePx });
    if (safePx <= 0) {
      target.set({ clipPath: null });
      if (typeof target.setCoords === "function") target.setCoords();
      return;
    }
    const rLocal = Math.min(safePx / s, w / 2, h / 2);
    const clip = new fabricLib.Rect({
      width: w,
      height: h,
      rx: rLocal,
      ry: rLocal,
      originX: "center",
      originY: "center",
      left: 0,
      top: 0,
      absolutePositioned: false
    });
    target.set({ clipPath: clip });
    if (typeof target.setCoords === "function") target.setCoords();
  }
  function syncImageCornerRadiusClipsOnCanvas(fabricCanvas, fabricLib) {
    if (!fabricCanvas || !fabricLib) return;
    walkFabricObjectsDepthFirst(fabricCanvas.getObjects(), (o) => {
      if (!isFabricRasterImage(o)) return;
      if (!Number.isFinite(Number(o.cornerRadiusPx)) || Number(o.cornerRadiusPx) <= 0) return;
      applyImageCornerRadiusPx(o, fabricLib, Number(o.cornerRadiusPx));
    });
  }
  function createStarPoints(outerRadius, innerRadius, spikes) {
    const points = [];
    const step = Math.PI / spikes;
    let angle = -Math.PI / 2;
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
      angle += step;
    }
    return points;
  }
  function createRegularPolygonPoints(sides, radius) {
    const points = [];
    const step = Math.PI * 2 / sides;
    let angle = -Math.PI / 2;
    for (let i = 0; i < sides; i++) {
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
      angle += step;
    }
    return points;
  }
  function buildRoundedPolygonPath(points, radius) {
    if (!Array.isArray(points) || points.length < 3) return "";
    const safeRadius = Math.max(0, Number(radius) || 0);
    if (safeRadius <= 0) {
      return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
    }
    const n = points.length;
    const commands = [];
    for (let i = 0; i < n; i++) {
      const prev = points[(i - 1 + n) % n];
      const curr = points[i];
      const next = points[(i + 1) % n];
      const v1x = prev.x - curr.x;
      const v1y = prev.y - curr.y;
      const v2x = next.x - curr.x;
      const v2y = next.y - curr.y;
      const len1 = Math.hypot(v1x, v1y);
      const len2 = Math.hypot(v2x, v2y);
      if (len1 < 1e-6 || len2 < 1e-6) continue;
      const n1x = v1x / len1;
      const n1y = v1y / len1;
      const n2x = v2x / len2;
      const n2y = v2y / len2;
      const dot = Math.max(-1, Math.min(1, n1x * n2x + n1y * n2y));
      const angle = Math.acos(dot);
      const tangentDist = Math.min(
        safeRadius / Math.tan(angle / 2 || 1e-6),
        len1 * 0.45,
        len2 * 0.45
      );
      const p1x = curr.x + n1x * tangentDist;
      const p1y = curr.y + n1y * tangentDist;
      const p2x = curr.x + n2x * tangentDist;
      const p2y = curr.y + n2y * tangentDist;
      if (commands.length === 0) commands.push(`M ${p1x} ${p1y}`);
      else commands.push(`L ${p1x} ${p1y}`);
      commands.push(`Q ${curr.x} ${curr.y} ${p2x} ${p2y}`);
    }
    commands.push("Z");
    return commands.join(" ");
  }
  function extractPathPoints(pathObject) {
    if (!pathObject || !Array.isArray(pathObject.path)) return [];
    const points = [];
    for (const cmd of pathObject.path) {
      if (!Array.isArray(cmd) || cmd.length < 3) continue;
      const op = String(cmd[0] || "").toUpperCase();
      if (op === "M" || op === "L") {
        points.push({ x: Number(cmd[1]), y: Number(cmd[2]) });
      } else if (op === "Q" && cmd.length >= 5) {
        points.push({ x: Number(cmd[3]), y: Number(cmd[4]) });
      } else if (op === "C" && cmd.length >= 7) {
        points.push({ x: Number(cmd[5]), y: Number(cmd[6]) });
      }
    }
    return points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  }
  function buildSmoothFreehandPath(points, smoothing = 0.22) {
    if (!Array.isArray(points) || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    const tension = Math.max(0.05, Math.min(0.45, Number(smoothing) || 0.22));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) * tension;
      const c1y = p1.y + (p2.y - p0.y) * tension;
      const c2x = p2.x - (p3.x - p1.x) * tension;
      const c2y = p2.y - (p3.y - p1.y) * tension;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }
  function replaceRoundedPolygon(instance, target, radius, fabricLib) {
    if (!target || !fabricLib || !instance || !instance.data || !instance.data.fabricCanvas) return null;
    const canvas = instance.data.fabricCanvas;
    const basePoints = Array.isArray(target.shapePoints) && target.shapePoints.length >= 3 ? target.shapePoints : Array.isArray(target.points) ? target.points.map((p) => ({ x: p.x, y: p.y })) : null;
    if (!basePoints || basePoints.length < 3) return null;
    const pathData = buildRoundedPolygonPath(basePoints, radius);
    if (!pathData) return null;
    const replacement = new fabricLib.Path(pathData, {
      left: target.left,
      top: target.top,
      angle: target.angle,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      originX: target.originX || "center",
      originY: target.originY || "center",
      fill: target.fill,
      stroke: target.stroke,
      strokeWidth: target.strokeWidth,
      strokeUniform: true,
      shapeKind: target.shapeKind,
      shapePoints: basePoints,
      cornerRadius: Math.max(0, Number(radius) || 0),
      cornerRadiusPx: Number.isFinite(Number(target.cornerRadiusPx)) ? Math.max(0, Number(target.cornerRadiusPx)) : Math.max(0, Number(radius) || 0) * Math.min(Math.abs(Number(target.scaleX) || 1), Math.abs(Number(target.scaleY) || 1))
    });
    const objects = canvas.getObjects();
    const index = objects.indexOf(target);
    canvas.remove(target);
    if (index >= 0) canvas.insertAt(index, replacement);
    else canvas.add(replacement);
    return replacement;
  }

  // plugins/fabric/fabric-view/src/ui/toolbar-sync.js
  function getToolbarVisibilityForTarget(target) {
    if (!target) return TOOLBAR_VISIBILITY_BY_TYPE.default;
    if (target.iconKind) {
      return { fill: true, stroke: false, strokeWidth: false, radius: false, fontSize: false, opacity: true };
    }
    if (isRoundedPolygonShape(target)) {
      return { ...TOOLBAR_VISIBILITY_BY_TYPE.default, radius: true };
    }
    const key = String(target.type || "default");
    return TOOLBAR_VISIBILITY_BY_TYPE[key] || TOOLBAR_VISIBILITY_BY_TYPE.default;
  }
  function getSharedToolbarVisibility(targets) {
    if (!Array.isArray(targets) || targets.length === 0) return TOOLBAR_VISIBILITY_BY_TYPE.default;
    const initial = { fill: true, stroke: true, strokeWidth: true, radius: true, fontSize: true, opacity: true };
    return targets.reduce((acc, target) => {
      const v = getToolbarVisibilityForTarget(target);
      return {
        fill: !!(acc.fill && v.fill),
        stroke: !!(acc.stroke && v.stroke),
        strokeWidth: !!(acc.strokeWidth && v.strokeWidth),
        radius: !!(acc.radius && v.radius),
        fontSize: !!(acc.fontSize && v.fontSize),
        opacity: !!(acc.opacity && v.opacity)
      };
    }, initial);
  }
  function updateArtboardNavVisibility(instance) {
    const ui = instance && instance.data ? instance.data.ui : null;
    if (!ui || !ui.artboardNav || !ui.artboardPrevBtn || !ui.artboardNextBtn || !ui.artboardDownloadBtn) return;
    const canvas = instance.data.fabricCanvas;
    const hasSelection = !!(canvas && canvas.getActiveObject());
    const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
    const showNav = !hasSelection;
    ui.artboardNav.style.display = showNav ? "flex" : "none";
    const prevDisabled = idx <= 0;
    const nextDisabled = idx >= 2;
    ui.artboardPrevBtn.disabled = prevDisabled;
    ui.artboardNextBtn.disabled = nextDisabled;
    ui.artboardPrevBtn.style.opacity = prevDisabled ? "0.45" : "";
    ui.artboardNextBtn.style.opacity = nextDisabled ? "0.45" : "";
    ui.artboardPrevBtn.style.cursor = prevDisabled ? "not-allowed" : "pointer";
    ui.artboardNextBtn.style.cursor = nextDisabled ? "not-allowed" : "pointer";
  }
  function updateTopBarForSelection(instance) {
    const ui = instance.data.ui;
    if (!ui) return;
    try {
      if (ui.alignToolbar) {
        ui.alignToolbar.style.display = "none";
      }
      const rawTitle = typeof instance.data.documentTitle === "string" ? instance.data.documentTitle.trim() : "";
      const hasTitle = rawTitle.length > 0;
      const pageNum = clampArtboardIndex(instance.data.activeArtboardIndex) + 1;
      ui.documentTitle.textContent = hasTitle ? `${rawTitle} / page ${pageNum}` : `page ${pageNum}`;
      ui.documentTitle.style.display = "block";
      const toolMode = instance.data && instance.data.toolMode ? instance.data.toolMode : "select";
      const isDrawMode = toolMode === "draw";
      const isPanMode = toolMode === "pan";
      const fabricCanvas = instance.data.fabricCanvas;
      const target = fabricCanvas ? fabricCanvas.getActiveObject() : null;
      const targets = getToolbarStyleTargets(fabricCanvas);
      const hasMultiSelection = targets.length > 1 || isFabricGroupObject(target);
      if (isPanMode) {
        ui.topBar.style.visibility = "visible";
        ui.fillControl.setMixed(false);
        ui.strokeControl.setMixed(false);
        ui.fillControl.setDisabled(true);
        ui.strokeControl.setDisabled(true);
        ui.strokeWidthInput.disabled = true;
        ui.radiusInput.disabled = true;
        ui.fontSizeInput.disabled = true;
        ui.fontFamilySelect.disabled = true;
        ui.strokeWidthInput.style.opacity = "0.55";
        ui.radiusInput.style.opacity = "0.55";
        ui.fontSizeInput.style.opacity = "0.55";
        ui.fontFamilySelect.style.opacity = "0.55";
        ui.opacityInput.disabled = true;
        ui.opacityInput.style.opacity = "0.55";
        ui.topFill.style.display = "none";
        ui.topStroke.style.display = "none";
        ui.topStrokeWidth.style.display = "none";
        ui.topRadius.style.display = "none";
        ui.topFontFamily.style.display = "none";
        ui.topFontSize.style.display = "none";
        ui.topOpacity.style.display = "none";
        return;
      }
      if (!target && !isDrawMode) {
        ui.topBar.style.visibility = "visible";
        ui.fillControl.setMixed(false);
        ui.strokeControl.setMixed(false);
        ui.fillControl.setDisabled(true);
        ui.strokeControl.setDisabled(true);
        ui.strokeWidthInput.disabled = true;
        ui.radiusInput.disabled = true;
        ui.fontSizeInput.disabled = true;
        ui.fontFamilySelect.disabled = true;
        ui.strokeWidthInput.style.opacity = "0.55";
        ui.radiusInput.style.opacity = "0.55";
        ui.fontSizeInput.style.opacity = "0.55";
        ui.fontFamilySelect.style.opacity = "0.55";
        ui.opacityInput.disabled = true;
        ui.opacityInput.style.opacity = "0.55";
        ui.topFill.style.display = "none";
        ui.topStroke.style.display = "none";
        ui.topStrokeWidth.style.display = "none";
        ui.topRadius.style.display = "none";
        ui.topFontFamily.style.display = "none";
        ui.topFontSize.style.display = "none";
        ui.topOpacity.style.display = "none";
        return;
      }
      if (!target && isDrawMode) {
        ui.topBar.style.visibility = "visible";
        ui.documentTitle.style.display = "none";
        ui.fillControl.setMixed(false);
        ui.strokeControl.setMixed(false);
        ui.fillControl.setVisible(false);
        ui.strokeControl.setVisible(true);
        ui.strokeControl.setDisabled(false);
        ui.strokeControl.setColor(instance.data.penColor || "#111827");
        ui.topStrokeWidth.style.display = "inline-flex";
        ui.strokeWidthInput.disabled = false;
        ui.strokeWidthInput.style.opacity = "1";
        ui.strokeWidthInput.value = String(Math.max(1, Math.round(instance.data.penWidth || 3)));
        ui.topRadius.style.display = "none";
        ui.topFontFamily.style.display = "none";
        ui.topFontSize.style.display = "none";
        ui.topOpacity.style.display = "none";
        return;
      }
      ui.topBar.style.visibility = "visible";
      ui.documentTitle.style.display = "none";
      if (ui.alignToolbar) {
        const canAlign = target && !target.isArtboard && !target.isSafeZone;
        ui.alignToolbar.style.display = canAlign ? "flex" : "none";
      }
      const visibility = hasMultiSelection ? getSharedToolbarVisibility(targets) : getToolbarVisibilityForTarget(target);
      ui.fillControl.setVisible(visibility.fill);
      ui.strokeControl.setVisible(visibility.stroke);
      ui.topStrokeWidth.style.display = visibility.strokeWidth ? "inline-flex" : "none";
      ui.topRadius.style.display = visibility.radius ? "inline-flex" : "none";
      ui.topFontFamily.style.display = visibility.fontSize ? "inline-flex" : "none";
      ui.topFontSize.style.display = visibility.fontSize ? "inline-flex" : "none";
      ui.topOpacity.style.display = visibility.opacity ? "inline-flex" : "none";
      const style = getObjectStyle(target || targets[0]);
      ui.fillControl.setDisabled(false);
      ui.strokeControl.setDisabled(false);
      ui.strokeWidthInput.disabled = false;
      ui.opacityInput.disabled = false;
      ui.fontSizeInput.disabled = !visibility.fontSize;
      ui.fontFamilySelect.disabled = !visibility.fontSize;
      ui.strokeWidthInput.style.opacity = "1";
      ui.fontSizeInput.style.opacity = visibility.fontSize ? "1" : "0.55";
      ui.fontFamilySelect.style.opacity = visibility.fontSize ? "1" : "0.55";
      ui.strokeWidthInput.style.background = "#ffffff";
      ui.strokeWidthInput.style.color = "#0f172a";
      ui.strokeWidthInput.style.borderColor = "#cbd5e1";
      ui.strokeWidthInput.placeholder = "";
      ui.fontSizeInput.style.background = "#ffffff";
      ui.fontSizeInput.style.color = "#0f172a";
      ui.fontSizeInput.style.borderColor = "#cbd5e1";
      ui.fontSizeInput.placeholder = "";
      ui.fontFamilySelect.style.background = "#ffffff";
      ui.fontFamilySelect.style.color = "#0f172a";
      ui.fontFamilySelect.style.borderColor = "#cbd5e1";
      ui.radiusInput.style.background = "#ffffff";
      ui.radiusInput.style.color = "#0f172a";
      ui.radiusInput.style.borderColor = "#cbd5e1";
      ui.radiusInput.placeholder = "";
      ui.opacityInput.style.background = "#ffffff";
      ui.opacityInput.style.color = "#0f172a";
      ui.opacityInput.style.borderColor = "#cbd5e1";
      ui.opacityInput.placeholder = "";
      ui.fillControl.setMixed(false);
      ui.strokeControl.setMixed(false);
      if (!hasMultiSelection) {
        ui.fillControl.setColor(style.fill);
        ui.strokeControl.setColor(style.stroke);
        ui.strokeWidthInput.value = String(style.strokeWidth);
        if (visibility.fontSize) {
          const size = Number.isFinite(Number(target.fontSize)) ? Math.round(Number(target.fontSize)) : 16;
          ui.fontSizeInput.value = String(Math.max(1, Math.min(400, size)));
          const rawFf = typeof target.fontFamily === "string" ? target.fontFamily : DEFAULT_TEXT_FONT_FAMILY;
          syncFontFamilySelect(ui, rawFf, false);
        }
        const supportsRadius = visibility.radius && (Number.isFinite(Number(target.rx)) || target.type === "rect" || isRoundedPolygonShape(target) || isFabricRasterImage(target));
        ui.radiusInput.disabled = !supportsRadius;
        const polygonRadius = Number.isFinite(Number(target.cornerRadius)) ? Number(target.cornerRadius) : 0;
        ui.radiusInput.value = supportsRadius ? String(isRoundedPolygonShape(target) ? polygonRadius : style.radius) : "0";
        ui.radiusInput.style.opacity = supportsRadius ? "1" : "0.55";
        ui.opacityInput.disabled = !visibility.opacity;
        if (visibility.opacity) {
          ui.opacityInput.value = String(Math.round(style.opacity * 100));
          ui.opacityInput.style.opacity = "1";
          ui.opacityInput.style.background = "#ffffff";
          ui.opacityInput.style.color = "#0f172a";
          ui.opacityInput.style.borderColor = "#cbd5e1";
          ui.opacityInput.placeholder = "";
        } else {
          ui.opacityInput.value = "100";
          ui.opacityInput.style.opacity = "0.55";
        }
        return;
      }
      const styleList = targets.map((item) => getObjectStyle(item));
      const fillShared = getSharedValue(styleList, (item) => item.fill);
      const strokeShared = getSharedValue(styleList, (item) => item.stroke);
      const strokeWidthShared = getSharedValue(styleList, (item) => item.strokeWidth);
      const fontSizeShared = getSharedValue(targets, (item) => {
        const size = Number.isFinite(Number(item.fontSize)) ? Math.round(Number(item.fontSize)) : 16;
        return Math.max(1, Math.min(400, size));
      });
      const textTargets = targets.filter((item) => isTextLikeObject(item));
      const fontFamilyShared = getSharedValue(textTargets, (item) => normalizeFontFamily(item.fontFamily));
      const radiusShared = getSharedValue(targets, (item) => {
        if (isRoundedPolygonShape(item)) return Number.isFinite(Number(item.cornerRadius)) ? Number(item.cornerRadius) : 0;
        if (item.type === "rect") return getRectCornerRadiusPx(item);
        if (isFabricRasterImage(item)) {
          return Number.isFinite(Number(item.cornerRadiusPx)) ? Math.max(0, Number(item.cornerRadiusPx)) : 0;
        }
        if (Number.isFinite(Number(item.rx))) {
          return Number(item.rx);
        }
        return null;
      });
      const opacityShared = getSharedValue(styleList, (item) => item.opacity);
      ui.fillControl.setColor(fillShared.mixed ? "transparent" : fillShared.value);
      ui.fillControl.setMixed(fillShared.mixed);
      ui.strokeControl.setColor(strokeShared.mixed ? "transparent" : strokeShared.value);
      ui.strokeControl.setMixed(strokeShared.mixed);
      if (strokeWidthShared.mixed) {
        ui.strokeWidthInput.value = "";
        ui.strokeWidthInput.placeholder = "mix";
        ui.strokeWidthInput.style.background = "#f1f5f9";
        ui.strokeWidthInput.style.color = "#64748b";
        ui.strokeWidthInput.style.borderColor = "#cbd5e1";
      } else {
        ui.strokeWidthInput.value = String(strokeWidthShared.value);
      }
      if (visibility.fontSize) {
        ui.fontSizeInput.disabled = false;
        ui.fontFamilySelect.disabled = false;
        if (fontSizeShared.mixed) {
          ui.fontSizeInput.value = "";
          ui.fontSizeInput.placeholder = "mix";
          ui.fontSizeInput.style.background = "#f1f5f9";
          ui.fontSizeInput.style.color = "#64748b";
          ui.fontSizeInput.style.borderColor = "#cbd5e1";
        } else {
          ui.fontSizeInput.value = String(fontSizeShared.value);
        }
        if (fontFamilyShared.mixed) {
          syncFontFamilySelect(ui, "", true);
        } else if (textTargets.length > 0) {
          const rawFf = typeof textTargets[0].fontFamily === "string" ? textTargets[0].fontFamily : DEFAULT_TEXT_FONT_FAMILY;
          syncFontFamilySelect(ui, rawFf, false);
        }
      }
      if (visibility.opacity) {
        ui.opacityInput.disabled = false;
        ui.opacityInput.style.opacity = "1";
        if (opacityShared.mixed) {
          ui.opacityInput.value = "";
          ui.opacityInput.placeholder = "mix";
          ui.opacityInput.style.background = "#f1f5f9";
          ui.opacityInput.style.color = "#64748b";
          ui.opacityInput.style.borderColor = "#cbd5e1";
        } else {
          ui.opacityInput.value = String(Math.max(0, Math.min(100, Math.round(Number(opacityShared.value) * 100))));
          ui.opacityInput.style.background = "#ffffff";
          ui.opacityInput.style.color = "#0f172a";
          ui.opacityInput.style.borderColor = "#cbd5e1";
          ui.opacityInput.placeholder = "";
        }
      } else {
        ui.opacityInput.disabled = true;
        ui.opacityInput.value = "100";
        ui.opacityInput.style.opacity = "0.55";
      }
      if (visibility.radius) {
        ui.radiusInput.disabled = false;
        ui.radiusInput.style.opacity = "1";
        if (radiusShared.mixed) {
          ui.radiusInput.value = "";
          ui.radiusInput.placeholder = "mix";
          ui.radiusInput.style.background = "#f1f5f9";
          ui.radiusInput.style.color = "#64748b";
          ui.radiusInput.style.borderColor = "#cbd5e1";
        } else {
          ui.radiusInput.value = String(Math.max(0, Math.min(200, Number(radiusShared.value) || 0)));
        }
      } else {
        ui.radiusInput.disabled = true;
        ui.radiusInput.value = "0";
        ui.radiusInput.style.opacity = "0.55";
      }
    } finally {
      updateArtboardNavVisibility(instance);
    }
  }

  // plugins/fabric/fabric-view/src/objects.js
  function createDefaultTextbox(fabricLib, canvasWidth, canvasHeight) {
    if (!fabricLib) return null;
    const maxW = Math.max(canvasWidth || 900, 600);
    const maxH = Math.max(canvasHeight || 520, 360);
    const textbox = new fabricLib.Textbox("Edit me", {
      left: Math.round(maxW * 0.5 - 90),
      top: Math.round(maxH * 0.5 - 20),
      width: 180,
      fontFamily: DEFAULT_TEXT_FONT_FAMILY,
      fontSize: 36,
      fontWeight: 600,
      fill: "#111827",
      stroke: "#00000000",
      strokeWidth: 0,
      strokeUniform: true
    });
    applyTextboxEditingControls(textbox);
    return textbox;
  }
  function getObjectStyle(target) {
    if (!target) {
      return { fill: "transparent", stroke: "transparent", strokeWidth: 1, radius: 0, opacity: 1 };
    }
    const fill = typeof target.fill === "string" ? target.fill : target.fill && typeof target.fill.toString === "function" ? String(target.fill.toString()) : "transparent";
    const stroke = typeof target.stroke === "string" ? target.stroke : target.stroke && typeof target.stroke.toString === "function" ? String(target.stroke.toString()) : "transparent";
    let strokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 1;
    const scaleX = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
    const scaleY = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
    const rawRx = Number.isFinite(Number(target.rx)) ? Number(target.rx) : 0;
    const rawRy = Number.isFinite(Number(target.ry)) ? Number(target.ry) : rawRx;
    const visualRadius = Number.isFinite(Number(target.cornerRadiusPx)) ? Math.max(0, Number(target.cornerRadiusPx)) : Math.max(0, Math.min(rawRx * scaleX, rawRy * scaleY));
    const normalizedFill = isTransparentColor(fill) ? "transparent" : ensureHexColor(fill, "#111827");
    const normalizedStroke = isTransparentColor(stroke) ? "transparent" : ensureHexColor(stroke, "#000000");
    const rawOpacity = Number.isFinite(Number(target.opacity)) ? Number(target.opacity) : 1;
    const opacity = Math.max(0, Math.min(1, rawOpacity));
    return {
      fill: normalizedFill,
      stroke: normalizedStroke,
      strokeWidth: Math.max(0, Math.min(50, strokeWidth)),
      radius: Math.max(0, Math.min(200, visualRadius)),
      opacity
    };
  }
  function resolveFabric() {
    if (window.fabric) return window.fabric;
    if (window.Fabric) return window.Fabric;
    return null;
  }
  function newFabricImageId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `img_${Math.random().toString(36).slice(2, 12)}_${Date.now().toString(36)}`;
  }
  function ensureFabricImageIdSerialization(fabricLib) {
    if (!fabricLib || !fabricLib.FabricObject || !Array.isArray(fabricLib.FabricObject.customProperties)) return;
    if (fabricLib.FabricObject.customProperties.indexOf("id") === -1) {
      fabricLib.FabricObject.customProperties.push("id");
    }
    if (fabricLib.FabricObject.customProperties.indexOf("cornerRadiusPx") === -1) {
      fabricLib.FabricObject.customProperties.push("cornerRadiusPx");
    }
  }
  function isFabricRasterImage(target) {
    if (!target) return false;
    return String(target.type || "").toLowerCase() === "image";
  }
  function isSelectionContainer(active) {
    if (!active || typeof active.getObjects !== "function") return false;
    const normalize = (value) => String(value || "").toLowerCase().replace(/[\s_-]/g, "");
    const type = normalize(active.type);
    if (type === "activeselection") return true;
    const ctorName = normalize(active.constructor && active.constructor.name);
    if (ctorName === "activeselection") return true;
    return false;
  }
  function getActiveSelectionTargets(fabricCanvas) {
    if (!fabricCanvas) return [];
    const active = fabricCanvas.getActiveObject();
    if (!active) return [];
    if (isSelectionContainer(active)) {
      const objects = active.getObjects();
      return Array.isArray(objects) ? objects.filter(Boolean) : [];
    }
    return [active];
  }
  function isFabricGroupObject(target) {
    if (!target) return false;
    return String(target.type || "").toLowerCase() === "group";
  }
  function flattenStyleTargetsFromGroup(group) {
    const out = [];
    if (!group || typeof group.getObjects !== "function") return out;
    const kids = group.getObjects();
    if (!Array.isArray(kids)) return out;
    kids.forEach((child) => {
      if (!child || child.isArtboard || child.isSafeZone) return;
      if (isFabricGroupObject(child)) {
        out.push(...flattenStyleTargetsFromGroup(child));
      } else {
        out.push(child);
      }
    });
    return out;
  }
  function getToolbarStyleTargets(fabricCanvas) {
    if (!fabricCanvas) return [];
    const active = fabricCanvas.getActiveObject();
    if (!active) return [];
    const expandTopLevel = (list) => {
      const out = [];
      list.forEach((item) => {
        if (!item || item.isArtboard || item.isSafeZone) return;
        if (isFabricGroupObject(item)) {
          out.push(...flattenStyleTargetsFromGroup(item));
        } else {
          out.push(item);
        }
      });
      return out;
    };
    if (isSelectionContainer(active)) {
      const objects = active.getObjects();
      const raw = Array.isArray(objects) ? objects.filter(Boolean) : [];
      return expandTopLevel(raw);
    }
    if (isFabricGroupObject(active)) {
      return flattenStyleTargetsFromGroup(active);
    }
    return [active];
  }
  function walkFabricObjectsDepthFirst(rootList, visit) {
    if (!Array.isArray(rootList)) return;
    rootList.forEach((o) => {
      if (!o) return;
      visit(o);
      if (typeof o.getObjects === "function") {
        const kids = o.getObjects();
        if (Array.isArray(kids)) walkFabricObjectsDepthFirst(kids, visit);
      }
    });
  }
  function applyStrokeUniformDeep(target) {
    if (!target) return;
    if (typeof target.set === "function" && Object.prototype.hasOwnProperty.call(target, "strokeWidth")) {
      target.set({ strokeUniform: true });
    }
    if (typeof target.getObjects === "function") {
      const children = target.getObjects();
      if (Array.isArray(children)) {
        children.forEach((child) => {
          if (child && typeof child.set === "function" && Object.prototype.hasOwnProperty.call(child, "strokeWidth")) {
            child.set({ strokeUniform: true });
          }
        });
      }
    }
  }
  function isPartOfActiveObject(active, clicked) {
    if (!active || !clicked) return false;
    if (active === clicked) return true;
    if (isSelectionContainer(active)) {
      const objs = active.getObjects();
      return Array.isArray(objs) && objs.indexOf(clicked) !== -1;
    }
    if (clicked.group && clicked.group === active) return true;
    return false;
  }
  function applyStateFromTransformOriginal(target, orig) {
    if (!target || !orig || typeof orig !== "object") return;
    const keys = ["left", "top", "scaleX", "scaleY", "angle", "skewX", "skewY", "flipX", "flipY"];
    const patch = {};
    keys.forEach((k) => {
      if (orig[k] !== void 0) patch[k] = orig[k];
    });
    target.set(patch);
    if (typeof target.setCoords === "function") target.setCoords();
  }
  function isDragMoveTransform(transform) {
    if (!transform) return false;
    if (transform.corner) return false;
    const a = transform.action;
    if (a === "scale" || a === "rotate" || a === "skewX" || a === "skewY") return false;
    if (a === "drag" || a === "translate" || a === "move") return true;
    return a === void 0 || a === null;
  }
  function performAltDuplicateDrag(instance, fabricCanvas, e) {
    if (!instance || !fabricCanvas || !e) return;
    const target = e.target;
    const transform = e.transform;
    if (!target || !transform || !transform.original) return;
    if (target.isArtboard || target.isSafeZone) return;
    if (typeof target.isEditing === "function" && target.isEditing) return;
    if (typeof target.isEditing === "boolean" && target.isEditing) return;
    if (!isDragMoveTransform(transform)) return;
    const active = fabricCanvas.getActiveObject();
    if (!active || target !== active) return;
    if (!instance.data.altKeyAtMouseDown) return;
    const gid = Number(instance.data._canvasPointerGestureId) || 0;
    if (Number.isFinite(instance.data._altDupClonedGestureId) && instance.data._altDupClonedGestureId === gid) {
      return;
    }
    const moveEv = e.e;
    if (moveEv && Number.isFinite(Number(instance.data._altDupDownClientX)) && Number.isFinite(Number(instance.data._altDupDownClientY))) {
      const dx = (Number(moveEv.clientX) || 0) - Number(instance.data._altDupDownClientX);
      const dy = (Number(moveEv.clientY) || 0) - Number(instance.data._altDupDownClientY);
      if (dx * dx + dy * dy < ALT_DUP_MIN_MOVE_PX * ALT_DUP_MIN_MOVE_PX) {
        return;
      }
    }
    const orig = transform.original;
    instance.data._altDupClonedGestureId = gid;
    instance.data._altDuplicateDone = true;
    const cloneSource = active;
    const done = (cloned) => {
      if (!cloned) {
        console.warn("[FabricView alt-drag] clone vide \u2014 duplication ignor\xE9e pour ce geste");
        return;
      }
      applyStateFromTransformOriginal(cloned, orig);
      if (typeof cloned.setCoords === "function") cloned.setCoords();
      applyStrokeUniformDeep(cloned);
      const stackIndex = fabricCanvas.getObjects().indexOf(cloneSource);
      if (stackIndex >= 0 && typeof fabricCanvas.insertAt === "function") {
        fabricCanvas.insertAt(stackIndex, cloned);
      } else {
        fabricCanvas.add(cloned);
      }
      fabricCanvas.requestRenderAll();
      syncGuideLayers(instance);
      updateTopBarForSelection(instance);
    };
    if (typeof cloneSource.clone !== "function") {
      return;
    }
    try {
      const result = cloneSource.clone();
      if (result && typeof result.then === "function") {
        result.then(done).catch((err) => {
          console.warn("[FabricView alt-drag] clone \xE9chou\xE9", err);
        });
      } else {
        done(result);
      }
    } catch (err) {
      console.warn("[FabricView alt-drag] clone \xE9chou\xE9 (exception)", err);
    }
  }
  function moveCanvasObjectToFinalIndex(fabricCanvas, object, from, dest) {
    if (!fabricCanvas || !object || from < 0 || dest < 0 || from === dest) return;
    if (typeof fabricCanvas.moveObjectTo === "function") {
      const idxAfterRemoval2 = dest > from ? dest - 1 : dest;
      fabricCanvas.moveObjectTo(object, idxAfterRemoval2);
      return;
    }
    fabricCanvas.remove(object);
    const idxAfterRemoval = dest > from ? dest - 1 : dest;
    const len = fabricCanvas.getObjects().length;
    const clamped = Math.max(0, Math.min(idxAfterRemoval, len));
    if (typeof fabricCanvas.insertAt === "function") {
      fabricCanvas.insertAt(clamped, object);
    } else {
      fabricCanvas.add(object);
    }
  }
  function getZOrderStackTarget(fabricCanvas) {
    const active = fabricCanvas && fabricCanvas.getActiveObject ? fabricCanvas.getActiveObject() : null;
    if (!active || active.isArtboard || active.isSafeZone) return null;
    return active;
  }
  function applyZOrderToSelection(fabricCanvas, action, instance) {
    if (!fabricCanvas) return;
    const target = getZOrderStackTarget(fabricCanvas);
    if (!target) return;
    const objects = fabricCanvas.getObjects();
    const idx = objects.indexOf(target);
    if (idx < 0) return;
    if (instance) {
      rebindArtboardFromCanvas(instance);
      ensureArtboardAtBack(instance);
    }
    const minUser = 2;
    if (action === "to-back") {
      moveCanvasObjectToFinalIndex(fabricCanvas, target, idx, minUser);
    } else if (action === "backward") {
      const dest = Math.max(minUser, idx - 1);
      moveCanvasObjectToFinalIndex(fabricCanvas, target, idx, dest);
    } else if (action === "forward") {
      if (typeof fabricCanvas.bringObjectForward === "function") fabricCanvas.bringObjectForward(target, false);
      else if (typeof target.bringForward === "function") target.bringForward(false);
    } else if (action === "to-front") {
      if (typeof fabricCanvas.bringObjectToFront === "function") fabricCanvas.bringObjectToFront(target);
      else if (typeof target.bringToFront === "function") target.bringToFront();
    }
    if (typeof fabricCanvas.setActiveObject === "function") {
      try {
        fabricCanvas.setActiveObject(target);
      } catch (e) {
      }
    }
    if (instance) syncGuideStackAfterUserZOrder(instance);
    fabricCanvas.requestRenderAll();
  }
  function isTextLikeObject(target) {
    if (!target) return false;
    const t = String(target.type || "");
    return t === "textbox" || t === "text" || t === "iText";
  }
  function isRoundedPolygonShape(target) {
    if (!target) return false;
    return target.shapeKind === "triangle" || target.shapeKind === "star";
  }
  function isShapeObject(target) {
    if (!target) return false;
    if (String(target.type || "") === "group") return true;
    if (target.iconKind && String(target.type || "") === "group") return true;
    const t = String(target.type || "");
    return t === "rect" || t === "circle" || t === "ellipse" || t === "triangle" || t === "polygon" || t === "path" || t === "image" || isRoundedPolygonShape(target);
  }
  function isCornerControl(controlName) {
    return controlName === "tl" || controlName === "tr" || controlName === "bl" || controlName === "br";
  }
  function oppositeOriginForCorner(corner) {
    if (corner === "tl") return { x: "right", y: "bottom" };
    if (corner === "tr") return { x: "left", y: "bottom" };
    if (corner === "bl") return { x: "right", y: "top" };
    if (corner === "br") return { x: "left", y: "top" };
    return null;
  }
  function normalizeObjectScale(target) {
    if (!target || typeof target.set !== "function") return;
    if (target.type === "activeSelection") return;
    const scaleX = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
    const scaleY = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
    if (scaleX === 1 && scaleY === 1) return;
    const type = target.type || "";
    if (String(type).toLowerCase() === "image") {
      return;
    }
    if (isShapeObject(target)) {
      return;
    }
    if (isTextLikeObject(target)) {
      const currentFontSize = Number.isFinite(Number(target.fontSize)) ? Number(target.fontSize) : 16;
      const nextFontSize = Math.max(1, Math.round(currentFontSize * scaleY));
      target.set("fontSize", nextFontSize);
      if (type === "textbox" && Number.isFinite(Number(target.width))) {
        target.set("width", Math.max(1, Number(target.width) * scaleX));
      }
      target.set({ scaleX: 1, scaleY: 1 });
      if (typeof target.initDimensions === "function") target.initDimensions();
      if (typeof target.setCoords === "function") target.setCoords();
      relayoutParentGroups(target);
      return;
    }
    if (Number.isFinite(Number(target.width))) {
      target.set("width", Math.max(1, Number(target.width) * scaleX));
    }
    if (Number.isFinite(Number(target.height))) {
      target.set("height", Math.max(1, Number(target.height) * scaleY));
    }
    target.set({ scaleX: 1, scaleY: 1 });
  }

  // plugins/fabric/fabric-view/src/previews.js
  function getJsPdfConstructor() {
    const w = typeof window !== "undefined" ? window : null;
    const mod = w && w.jspdf;
    return mod && typeof mod.jsPDF === "function" ? mod.jsPDF : null;
  }
  function dataUrlToImageCanvas(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 2D indisponible"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(c);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = dataUrl;
    });
  }
  function rotateCanvas90Clockwise(sourceCanvas) {
    const out = document.createElement("canvas");
    out.width = sourceCanvas.height;
    out.height = sourceCanvas.width;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.translate(out.width, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(sourceCanvas, 0, 0);
    return out;
  }
  function compositeSpreadPage3LeftPage1Right(dataUrl3, dataUrl0) {
    const pL = ARTBOARD_PRESETS[2];
    const pR = ARTBOARD_PRESETS[0];
    const cw = pL.width + pR.width;
    const ch = Math.max(pL.height, pR.height);
    return Promise.all([dataUrlToImageCanvas(dataUrl3), dataUrlToImageCanvas(dataUrl0)]).then(([cL, cR]) => {
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(cL, 0, 0);
      ctx.drawImage(cR, pL.width, 0);
      return rotateCanvas90Clockwise(c);
    });
  }
  function renderArtboardSnapshotToDataUrl(fabricLib, presetIndex, snapshot) {
    const preset = ARTBOARD_PRESETS[clampArtboardIndex(presetIndex)];
    const w = preset.width;
    const h = preset.height;
    const el = document.createElement("canvas");
    el.width = w;
    el.height = h;
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(el);
    const c = new fabricLib.Canvas(el, {
      preserveObjectStacking: true
    });
    c.setDimensions({ width: w, height: h });
    c.backgroundColor = "#ffffff";
    const loadInput = snapshot != null && typeof snapshot === "object" ? snapshot : { objects: [] };
    return loadFromJsonPromise(c, loadInput).then(() => {
      if (typeof c.requestRenderAll === "function") {
        c.requestRenderAll();
      } else if (typeof c.renderAll === "function") {
        c.renderAll();
      }
      return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }).then(() => c.toDataURL({ format: "png", multiplier: 1 })).finally(() => {
      try {
        c.dispose();
      } catch (e) {
      }
      el.remove();
    });
  }
  function pdfDownloadBaseName(instance) {
    const raw = typeof instance.data.documentTitle === "string" ? instance.data.documentTitle.trim() : "";
    return raw ? raw.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 80) || "document" : "document";
  }
  var _fabricViewPdfSpinStyleInjected = false;
  function ensureFabricViewPdfSpinStyle() {
    if (_fabricViewPdfSpinStyleInjected || typeof document === "undefined") return;
    _fabricViewPdfSpinStyleInjected = true;
    const s = document.createElement("style");
    s.setAttribute("data-fabric-view", "pdf-spin");
    s.textContent = "@keyframes fabric-view-spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(s);
  }
  function setPdfDownloadButtonLoading(btn, loading) {
    if (!btn) return;
    ensureFabricViewPdfSpinStyle();
    const icon = btn.querySelector("i");
    btn.disabled = !!loading;
    btn.style.pointerEvents = loading ? "none" : "";
    btn.title = loading ? "G\xE9n\xE9ration du PDF\u2026" : "T\xE9l\xE9charger PDF (pli A4)";
    if (icon) {
      if (loading) {
        icon.className = "ph ph-circle-notch";
        icon.style.display = "inline-block";
        icon.style.animation = "fabric-view-spin 0.7s linear infinite";
      } else {
        icon.className = "ph ph-download-simple";
        icon.style.animation = "";
        icon.style.display = "";
      }
    }
  }
  function triggerFoldedA4PdfDownload(instance) {
    if (!instance || !instance.data || !instance.data.fabricCanvas) {
      return Promise.resolve();
    }
    const context = instance.data.bubbleContext || null;
    const JsPDF = getJsPdfConstructor();
    if (!JsPDF) {
      console.error("jsPDF introuvable : ajoutez jspdf.umd.min.js dans shared.html (plugin Fabric).");
      return Promise.resolve();
    }
    const fabricLib = instance.data.fabricLib;
    if (!fabricLib || typeof fabricLib.Canvas !== "function") {
      return Promise.resolve();
    }
    syncCurrentCanvasToPageSnapshots(instance);
    if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
      return Promise.resolve();
    }
    const downloadBtn = instance.data.ui && instance.data.ui.artboardDownloadBtn;
    setPdfDownloadButtonLoading(downloadBtn, true);
    const snaps = instance.data.pageSnapshots;
    const base = pdfDownloadBaseName(instance);
    const run = async () => {
      if (typeof document !== "undefined" && document.fonts && typeof document.fonts.ready !== "undefined") {
        try {
          await document.fonts.ready;
        } catch (e) {
        }
      }
      const [du3, du0, du1] = await Promise.all([
        renderArtboardSnapshotToDataUrl(fabricLib, 2, snaps[2]),
        renderArtboardSnapshotToDataUrl(fabricLib, 0, snaps[0]),
        renderArtboardSnapshotToDataUrl(fabricLib, 1, snaps[1])
      ]);
      const spreadRotated = await compositeSpreadPage3LeftPage1Right(du3, du0);
      const spreadDataUrl = spreadRotated.toDataURL("image/png");
      const middleCanvas = await dataUrlToImageCanvas(du1).then((can) => rotateCanvas90Clockwise(can));
      const middleDataUrl = middleCanvas.toDataURL("image/png");
      const doc = new JsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true
      });
      doc.addImage(spreadDataUrl, "PNG", 0, 0, 210, 297);
      doc.addPage();
      doc.addImage(middleDataUrl, "PNG", 0, 0, 210, 297);
      const dataUri = typeof doc.output === "function" ? doc.output("datauristring") : "";
      const base64 = dataUri ? dataUrlToBase64(dataUri) : "";
      const safePdfName = `${base}.pdf`.replace(/[^\w.-]/g, "_") || "document.pdf";
      if (context && typeof context.uploadContent === "function" && base64) {
        try {
          const url = await new Promise((resolve, reject) => {
            context.uploadContent(safePdfName, base64, (err, url2) => {
              if (err) reject(err);
              else resolve(url2);
            });
          });
          instance.publishState("pdf_url", typeof url === "string" ? url : "");
          instance.triggerEvent("pdf_ready");
        } catch (uploadErr) {
          console.error("Upload PDF Bubble :", uploadErr);
        }
      }
      doc.save(`${base}.pdf`);
    };
    return run().catch((err) => {
      console.error("Export PDF pli A4 :", err);
    }).finally(() => {
      setPdfDownloadButtonLoading(downloadBtn, false);
    });
  }
  function cropCanvasToDataUrl(sourceCanvas, sx, sy, sw, sh) {
    const out = document.createElement("canvas");
    out.width = sw;
    out.height = sh;
    const ctx = out.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sw, sh);
    ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return out.toDataURL("image/png");
  }
  function buildHalfPageDataUrls(fabricLib, snaps) {
    return Promise.all([
      renderArtboardSnapshotToDataUrl(fabricLib, 0, snaps[0]),
      renderArtboardSnapshotToDataUrl(fabricLib, 1, snaps[1]),
      renderArtboardSnapshotToDataUrl(fabricLib, 2, snaps[2])
    ]).then((urls) => {
      const du0 = urls[0];
      const du1 = urls[1];
      const du2 = urls[2];
      return dataUrlToImageCanvas(du1).then((mid) => {
        const halfW = Math.round(ARTBOARD_PRESETS[1].width / 2);
        const h = mid.height;
        const leftUrl = cropCanvasToDataUrl(mid, 0, 0, halfW, h);
        const rightUrl = cropCanvasToDataUrl(mid, halfW, 0, mid.width - halfW, h);
        return [du0, leftUrl, rightUrl, du2];
      });
    });
  }
  function createPagePreviews(instance) {
    if (!instance || !instance.data || !instance.data.fabricCanvas) {
      return Promise.resolve([]);
    }
    const context = instance.data.bubbleContext || null;
    const fabricLib = instance.data.fabricLib;
    if (!fabricLib || typeof fabricLib.Canvas !== "function") {
      return Promise.resolve([]);
    }
    syncCurrentCanvasToPageSnapshots(instance);
    if (!Array.isArray(instance.data.pageSnapshots) || instance.data.pageSnapshots.length < 3) {
      return Promise.resolve([]);
    }
    const snaps = instance.data.pageSnapshots.slice();
    const base = pdfDownloadBaseName(instance);
    const runId = (instance.data._pagePreviewsRunId || 0) + 1;
    instance.data._pagePreviewsRunId = runId;
    instance.data._lastPagePreviewsAt = Date.now();
    const uploadOne = (name, dataUrl) => {
      const base64 = dataUrlToBase64(dataUrl);
      if (context && typeof context.uploadContent === "function" && base64) {
        return new Promise((resolve) => {
          try {
            context.uploadContent(name, base64, (err, url) => {
              if (err || typeof url !== "string" || !/^https?:\/\/|^blob:/i.test(url)) {
                resolve(dataUrl);
              } else {
                resolve(url);
              }
            });
          } catch (e) {
            resolve(dataUrl);
          }
        });
      }
      return Promise.resolve(dataUrl);
    };
    const run = async () => {
      if (typeof document !== "undefined" && document.fonts && typeof document.fonts.ready !== "undefined") {
        try {
          await document.fonts.ready;
        } catch (e) {
        }
      }
      const halfUrls = await buildHalfPageDataUrls(fabricLib, snaps);
      const uploaded = await Promise.all(halfUrls.map((dataUrl, i) => {
        const safeName = `${base}-preview-${i + 1}.png`.replace(/[^\w.-]/g, "_") || `preview-${i + 1}.png`;
        return uploadOne(safeName, dataUrl);
      }));
      if (instance.data._pagePreviewsRunId !== runId) {
        return uploaded;
      }
      instance.data._lastPreviewedContentKey = JSON.stringify(snaps);
      instance.publishState("page_previews", uploaded);
      instance.triggerEvent("page_previews_ready");
      return uploaded;
    };
    return run().catch((err) => {
      console.error("Fabric View: create_page_previews", err);
      return [];
    });
  }
  function schedulePagePreviews(instance) {
    if (!instance || !instance.data) return;
    const d = instance.data;
    if (d._suppressCanvasJsonPublish === true) return;
    const PAGE_PREVIEWS_DEBOUNCE_MS = 1500;
    const PAGE_PREVIEWS_COOLDOWN_MS = 3e4;
    const sinceLast = Date.now() - (d._lastPagePreviewsAt || 0);
    const delay = sinceLast < PAGE_PREVIEWS_COOLDOWN_MS ? Math.max(PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS - sinceLast) : PAGE_PREVIEWS_DEBOUNCE_MS;
    if (d._schedulePagePreviewsTimer) {
      clearTimeout(d._schedulePagePreviewsTimer);
    }
    d._schedulePagePreviewsTimer = setTimeout(() => {
      d._schedulePagePreviewsTimer = null;
      if (!Array.isArray(d.pageSnapshots)) return;
      const contentKey = JSON.stringify(d.pageSnapshots);
      if (contentKey === d._lastPreviewedContentKey) return;
      createPagePreviews(instance);
    }, delay);
  }

  // plugins/fabric/fabric-view/src/serialize.js
  function syncCurrentCanvasToPageSnapshots(instance) {
    if (!instance || !instance.data || !instance.data.fabricCanvas) return;
    const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
    instance.data.activeArtboardIndex = idx;
    if (!Array.isArray(instance.data.pageSnapshots)) {
      instance.data.pageSnapshots = [null, null, null];
    }
    try {
      instance.data.pageSnapshots[idx] = instance.data.fabricCanvas.toJSON();
    } catch (e) {
    }
  }
  function publishCanvasJson(instance, options) {
    if (!instance || !instance.data || !instance.data.fabricCanvas) return;
    const silent = options && options.silent || instance.data._artboardSwapInProgress === true;
    const skipPreviews = options && options.skipPreviews === true;
    const forceBubble = options && options.forcePublishToBubble === true;
    const suppressBubble = instance.data._suppressCanvasJsonPublish === true && !forceBubble;
    const idx = clampArtboardIndex(instance.data.activeArtboardIndex);
    instance.data.activeArtboardIndex = idx;
    if (!Array.isArray(instance.data.pageSnapshots)) {
      instance.data.pageSnapshots = [null, null, null];
    }
    try {
      instance.data.pageSnapshots[idx] = instance.data.fabricCanvas.toJSON();
      const payload = JSON.stringify({
        version: 1,
        activeArtboardIndex: idx,
        artboards: instance.data.pageSnapshots.slice()
      });
      if (!suppressBubble) {
        instance.data._lastPublishedCanvasJson = payload;
        instance.publishState("canvas_json", payload);
      }
    } catch (e) {
      console.warn("Fabric View: publishCanvasJson ignor\xE9 (toJSON / stringify)", e);
    }
    if (!silent && !suppressBubble) {
      instance.triggerEvent("json_changed");
    }
    if (!suppressBubble && !skipPreviews) {
      schedulePagePreviews(instance);
    }
  }
  function schedulePublishCanvasJson(instance) {
    if (!instance || !instance.data) return;
    const d = instance.data;
    if (d._schedulePublishCanvasJsonTimer) {
      clearTimeout(d._schedulePublishCanvasJsonTimer);
    }
    d._schedulePublishCanvasJsonTimer = setTimeout(() => {
      d._schedulePublishCanvasJsonTimer = null;
      publishCanvasJson(instance);
    }, 120);
  }
  function ensureFabricSnapshotCrossOrigin(snap) {
    if (!snap || typeof snap !== "object") return;
    const tagImage = (o) => {
      if (!o || o.type !== "Image") return;
      const src = o.src;
      if (typeof src === "string" && /^https?:\/\//i.test(src)) {
        o.crossOrigin = "anonymous";
      }
    };
    const walk = (objs) => {
      if (!Array.isArray(objs)) return;
      objs.forEach((o) => {
        if (!o || typeof o !== "object") return;
        tagImage(o);
        if (Array.isArray(o.objects)) walk(o.objects);
      });
    };
    walk(snap.objects);
    tagImage(snap.backgroundImage);
    tagImage(snap.overlayImage);
  }
  function loadFromJsonPromise(fabricCanvas, json) {
    if (!fabricCanvas) return Promise.resolve();
    let data = json;
    if (typeof json === "string") {
      try {
        data = JSON.parse(json);
      } catch (e) {
        const maybe2 = fabricCanvas.loadFromJSON(json);
        if (maybe2 && typeof maybe2.then === "function") return maybe2;
        return Promise.resolve();
      }
    }
    ensureFabricSnapshotCrossOrigin(data);
    const maybe = fabricCanvas.loadFromJSON(data);
    if (maybe && typeof maybe.then === "function") return maybe;
    return Promise.resolve();
  }
  function loadWrappedCanvasJson(instance, jsonString) {
    if (!instance || !instance.data) return;
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return;
    }
    if (!parsed || !Array.isArray(parsed.artboards) || parsed.artboards.length !== 3) {
      return;
    }
    instance.data.pageSnapshots = [
      parsed.artboards[0],
      parsed.artboards[1],
      parsed.artboards[2]
    ];
    const idx = clampArtboardIndex(parsed.activeArtboardIndex);
    instance.data.activeArtboardIndex = idx;
    goToArtboard(instance, idx, { skipSave: true }).then(() => {
      instance.data._suppressCanvasJsonPublish = false;
      publishCanvasJson(instance, { skipPreviews: true });
      updateTopBarForSelection(instance);
    }).catch(() => {
      instance.data._suppressCanvasJsonPublish = false;
    });
  }
  function isWrappedArtboardsJson(parsed) {
    return parsed && typeof parsed === "object" && parsed.version === 1 && Array.isArray(parsed.artboards) && parsed.artboards.length === 3;
  }
  var FABRIC_CLIPBOARD_EXTRA_KEYS = [
    "id",
    "iconKind",
    "iconName",
    "iconStyle",
    "shapeKind",
    "shapePoints",
    "cornerRadiusPx",
    "cornerRadius"
  ];
  function buildFabricClipboardJsonString(targets) {
    if (!Array.isArray(targets) || targets.length === 0) return "";
    try {
      const objectsPayload = targets.map((o) => typeof o.toObject === "function" ? o.toObject(FABRIC_CLIPBOARD_EXTRA_KEYS) : null).filter(Boolean);
      if (objectsPayload.length === 0) return "";
      const payload = objectsPayload.length === 1 ? objectsPayload[0] : { objects: objectsPayload };
      return JSON.stringify(payload);
    } catch (e) {
      return "";
    }
  }

  // plugins/fabric/fabric-view/src/guides.js
  function getActivePreset(instance) {
    const idx = clampArtboardIndex(instance && instance.data ? instance.data.activeArtboardIndex : 0);
    return ARTBOARD_PRESETS[idx];
  }
  function getDocumentSize(instance) {
    const p = getActivePreset(instance);
    return { width: p.width, height: p.height };
  }
  function ensureArtboardAtBack(instance) {
    if (!instance || !instance.data) return;
    const canvas = instance.data.fabricCanvas;
    const artboard = instance.data.artboardRect;
    if (!canvas || !artboard) return;
    if (typeof canvas.sendObjectToBack === "function") {
      canvas.sendObjectToBack(artboard);
    } else if (typeof artboard.sendToBack === "function") {
      artboard.sendToBack();
    }
  }
  function getDocumentMargins(instance) {
    const p = getActivePreset(instance);
    return {
      top: p.marginTop,
      right: p.marginRight,
      bottom: p.marginBottom,
      left: p.marginLeft
    };
  }
  function rebindArtboardFromCanvas(instance) {
    const canvas = instance && instance.data ? instance.data.fabricCanvas : null;
    if (!canvas) return;
    const objs = canvas.getObjects();
    const artboard = objs.find((o) => o && o.isArtboard) || objs.find((o) => o && String(o.type || "") === "rect" && o.excludeFromExport);
    instance.data.artboardRect = artboard || null;
  }
  function stripSafeZoneObjects(instance) {
    const canvas = instance && instance.data ? instance.data.fabricCanvas : null;
    if (!canvas) return;
    const toRemove = canvas.getObjects().filter((o) => o && o.isSafeZone);
    toRemove.forEach((o) => {
      try {
        canvas.remove(o);
      } catch (e) {
      }
    });
    instance.data.marginGuideLines = {
      top: null,
      right: null,
      bottom: null,
      left: null,
      fold: null
    };
  }
  function finalizeAfterArtboardLoad(instance, fabricLib) {
    if (!instance || !instance.data || !fabricLib) return;
    rebindArtboardFromCanvas(instance);
    stripSafeZoneObjects(instance);
    const doc = getDocumentSize(instance);
    let artboard = instance.data.artboardRect;
    if (!artboard) {
      ensureArtboardRect(instance, fabricLib);
    } else {
      artboard.set({
        left: 0,
        top: 0,
        width: doc.width,
        height: doc.height,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        isArtboard: true,
        stroke: "transparent",
        fill: "#ffffff"
      });
      if (typeof artboard.setCoords === "function") artboard.setCoords();
    }
    ensureArtboardAtBack(instance);
    syncGuideLayers(instance);
    ensureCanvasSize(instance);
    const canvas = instance.data.fabricCanvas;
    if (canvas) syncImageCornerRadiusClipsOnCanvas(canvas, fabricLib);
    if (canvas && typeof canvas.getObjects === "function") {
      const textObjects = canvas.getObjects().filter((o) => isTextLikeObject(o));
      textObjects.forEach((t) => applyTextboxEditingControls(t));
      if (textObjects.length > 0) loadWebFontsThenRedraw(canvas, textObjects);
    }
  }
  function setBoardLoading(instance, loading) {
    const overlay = instance && instance.data && instance.data.ui ? instance.data.ui.loadingOverlay : null;
    if (overlay) overlay.style.display = loading ? "flex" : "none";
  }
  function goToArtboard(instance, targetIndex, opts) {
    const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
    const fabricLib = instance && instance.data ? instance.data.fabricLib : null;
    if (!fabricCanvas || !fabricLib) return Promise.resolve();
    const skipSave = opts && opts.skipSave;
    const idx = clampArtboardIndex(targetIndex);
    const prev = clampArtboardIndex(instance.data.activeArtboardIndex);
    if (!Array.isArray(instance.data.pageSnapshots)) {
      instance.data.pageSnapshots = [null, null, null];
    }
    if (!skipSave) {
      try {
        instance.data.pageSnapshots[prev] = fabricCanvas.toJSON();
      } catch (e) {
      }
    }
    instance.data._artboardSwapInProgress = true;
    fabricCanvas.discardActiveObject();
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    instance.data.activeArtboardIndex = idx;
    const preset = ARTBOARD_PRESETS[idx];
    instance.data.canvasWidth = preset.width;
    instance.data.canvasHeight = preset.height;
    const snap = instance.data.pageSnapshots[idx];
    const loadInput = snap != null ? snap : { objects: [] };
    setBoardLoading(instance, true);
    const p = loadFromJsonPromise(fabricCanvas, loadInput);
    return p.then(() => finalizeAfterArtboardLoad(instance, fabricLib)).finally(() => {
      instance.data._artboardSwapInProgress = false;
      setBoardLoading(instance, false);
    });
  }
  function ensureMarginGuidesAtFront(instance) {
    if (!instance || !instance.data) return;
    const canvas = instance.data.fabricCanvas;
    const guides = instance.data.marginGuideLines;
    if (!canvas || !guides) return;
    ["top", "right", "bottom", "left", "fold"].forEach((key) => {
      const line = guides[key];
      if (!line) return;
      if (typeof canvas.bringObjectToFront === "function") {
        canvas.bringObjectToFront(line);
      } else if (typeof line.bringToFront === "function") {
        line.bringToFront();
      }
    });
  }
  function ensureMarginGuideLines(instance, fabricLib) {
    if (!instance || !instance.data || !instance.data.fabricCanvas || !fabricLib) return;
    const canvas = instance.data.fabricCanvas;
    const LineCtor = fabricLib.Line;
    if (typeof LineCtor !== "function") return;
    const doc = getDocumentSize(instance);
    const dw = doc.width;
    const dh = doc.height;
    const m = getDocumentMargins(instance);
    const vpScale = Math.max(1e-6, Number(instance.data.viewport && instance.data.viewport.scale) || 1);
    const strokeDoc = 1 / vpScale;
    if (instance.data.safeZoneRect) {
      try {
        canvas.remove(instance.data.safeZoneRect);
      } catch (e) {
      }
      instance.data.safeZoneRect = null;
    }
    if (!instance.data.marginGuideLines) {
      instance.data.marginGuideLines = {
        top: null,
        right: null,
        bottom: null,
        left: null,
        fold: null
      };
    }
    const guides = instance.data.marginGuideLines;
    const baseOpts = {
      stroke: "#7dd3fc",
      strokeWidth: strokeDoc,
      strokeUniform: true,
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      excludeFromExport: true,
      isSafeZone: true
    };
    const upsertLine = (key, show, x1, y1, x2, y2, stylePatch) => {
      const lineOpts = { ...baseOpts, ...stylePatch || {} };
      if (!show) {
        if (guides[key]) {
          try {
            canvas.remove(guides[key]);
          } catch (e) {
          }
          guides[key] = null;
        }
        return;
      }
      if (!guides[key]) {
        guides[key] = new LineCtor([x1, y1, x2, y2], { ...lineOpts });
        canvas.add(guides[key]);
      } else {
        guides[key].set({
          x1,
          y1,
          x2,
          y2,
          strokeWidth: strokeDoc,
          visible: true,
          stroke: lineOpts.stroke,
          strokeUniform: lineOpts.strokeUniform,
          ...stylePatch && stylePatch.strokeDashArray != null ? { strokeDashArray: stylePatch.strokeDashArray } : {}
        });
        if (typeof guides[key].setCoords === "function") guides[key].setCoords();
      }
    };
    upsertLine("top", m.top > 0 && m.top < dh, 0, m.top, dw, m.top);
    upsertLine("bottom", m.bottom > 0 && m.bottom < dh, 0, dh - m.bottom, dw, dh - m.bottom);
    upsertLine("left", m.left > 0 && m.left < dw, m.left, 0, m.left, dh);
    upsertLine("right", m.right > 0 && m.right < dw, dw - m.right, 0, dw - m.right, dh);
    const isMiddleSpread = clampArtboardIndex(instance.data.activeArtboardIndex) === 1;
    const midX = dw / 2;
    upsertLine(
      "fold",
      isMiddleSpread && midX > 0.5 && midX < dw - 0.5,
      midX,
      0,
      midX,
      dh,
      {
        stroke: "#cbd5e1",
        strokeDashArray: [8, 6]
      }
    );
  }
  function syncGuideLayers(instance) {
    ensureArtboardAtBack(instance);
    ensureMarginGuideLines(instance, instance.data.fabricLib);
    ensureMarginGuidesAtFront(instance);
  }
  function syncGuideStackAfterUserZOrder(instance) {
    if (!instance || !instance.data) return;
    rebindArtboardFromCanvas(instance);
    ensureArtboardAtBack(instance);
    ensureMarginGuidesAtFront(instance);
  }
  function ensureArtboardRect(instance, fabricLib) {
    if (!instance || !instance.data) return null;
    const canvas = instance.data.fabricCanvas;
    if (!canvas || !fabricLib) return null;
    const doc = getDocumentSize(instance);
    let artboard = instance.data.artboardRect || null;
    if (!artboard) {
      artboard = new fabricLib.Rect({
        left: 0,
        top: 0,
        width: doc.width,
        height: doc.height,
        originX: "left",
        originY: "top",
        fill: "#ffffff",
        stroke: "transparent",
        strokeWidth: 0,
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        excludeFromExport: true,
        isArtboard: true
      });
      canvas.add(artboard);
      instance.data.artboardRect = artboard;
    } else {
      artboard.set({
        left: 0,
        top: 0,
        width: doc.width,
        height: doc.height,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        isArtboard: true,
        stroke: "transparent",
        fill: "#ffffff"
      });
    }
    ensureArtboardAtBack(instance);
    return artboard;
  }
  function applyViewportTransform(instance) {
    if (!instance || !instance.data || !instance.data.fabricCanvas || !instance.data.viewport) return;
    const fabricCanvas = instance.data.fabricCanvas;
    const viewport = instance.data.viewport;
    fabricCanvas.setViewportTransform([
      viewport.scale,
      0,
      0,
      viewport.scale,
      viewport.offsetX,
      viewport.offsetY
    ]);
  }
  function getDocumentCenter(instance) {
    const doc = getDocumentSize(instance);
    return {
      x: doc.width / 2,
      y: doc.height / 2
    };
  }
  function unionBoundingRectOfObjects(objects) {
    let minL = Infinity;
    let minT = Infinity;
    let maxR = -Infinity;
    let maxB = -Infinity;
    objects.forEach((obj) => {
      if (!obj || obj.isArtboard || obj.isSafeZone) return;
      obj.setCoords();
      const br = obj.getBoundingRect();
      minL = Math.min(minL, br.left);
      minT = Math.min(minT, br.top);
      maxR = Math.max(maxR, br.left + br.width);
      maxB = Math.max(maxB, br.top + br.height);
    });
    if (!Number.isFinite(minL)) return null;
    return {
      left: minL,
      top: minT,
      width: maxR - minL,
      height: maxB - minT,
      right: maxR,
      bottom: maxB
    };
  }
  function deltasForAlignInUnion(br, union, mode) {
    let dx = 0;
    let dy = 0;
    const cx = br.left + br.width / 2;
    const cy = br.top + br.height / 2;
    const uc = union.left + union.width / 2;
    const vc = union.top + union.height / 2;
    if (mode === "left") dx = union.left - br.left;
    else if (mode === "center-h") dx = uc - cx;
    else if (mode === "right") dx = union.right - (br.left + br.width);
    else if (mode === "top") dy = union.top - br.top;
    else if (mode === "middle") dy = vc - cy;
    else if (mode === "bottom") dy = union.bottom - (br.top + br.height);
    return { dx, dy };
  }
  function getSingleObjectAlignFrame(instance) {
    const doc = getDocumentSize(instance);
    const docW = doc.width;
    const docH = doc.height;
    const m = getDocumentMargins(instance);
    const innerW = docW - m.left - m.right;
    const innerH = docH - m.top - m.bottom;
    const hasAnyMargin = m.left > 0 || m.right > 0 || m.top > 0 || m.bottom > 0;
    if (hasAnyMargin && innerW > 0 && innerH > 0) {
      return {
        left: m.left,
        top: m.top,
        right: docW - m.right,
        bottom: docH - m.bottom,
        width: innerW,
        height: innerH
      };
    }
    return {
      left: 0,
      top: 0,
      right: docW,
      bottom: docH,
      width: docW,
      height: docH
    };
  }
  function alignSelectionToDocument(instance, fabricCanvas, mode) {
    if (!instance || !fabricCanvas || !mode) return;
    const active = fabricCanvas.getActiveObject();
    if (!active || active.isArtboard || active.isSafeZone) return;
    const targets = getActiveSelectionTargets(fabricCanvas).filter(
      (o) => o && !o.isArtboard && !o.isSafeZone
    );
    if (targets.length === 0) return;
    if (targets.length === 1) {
      const target = targets[0];
      target.setCoords();
      const br = target.getBoundingRect();
      const doc = getDocumentSize(instance);
      const docW = doc.width;
      const docH = doc.height;
      const docCx = docW / 2;
      const docCy = docH / 2;
      const frame = getSingleObjectAlignFrame(instance);
      let dx = 0;
      let dy = 0;
      if (mode === "left") dx = frame.left - br.left;
      else if (mode === "center-h") dx = docCx - (br.left + br.width / 2);
      else if (mode === "right") dx = frame.right - (br.left + br.width);
      else if (mode === "top") dy = frame.top - br.top;
      else if (mode === "middle") dy = docCy - (br.top + br.height / 2);
      else if (mode === "bottom") dy = frame.bottom - (br.top + br.height);
      else return;
      if (dx === 0 && dy === 0) return;
      target.set({
        left: target.left + dx,
        top: target.top + dy
      });
      target.setCoords();
    } else {
      const fabricLib = instance.data.fabricLib;
      const union = unionBoundingRectOfObjects(targets);
      if (!union) return;
      const items = targets.slice();
      fabricCanvas.discardActiveObject();
      items.forEach((obj) => {
        if (!obj || obj.isArtboard || obj.isSafeZone) return;
        obj.setCoords();
        const br = obj.getBoundingRect();
        const { dx, dy } = deltasForAlignInUnion(br, union, mode);
        if (dx === 0 && dy === 0) return;
        obj.set({
          left: obj.left + dx,
          top: obj.top + dy
        });
        obj.setCoords();
      });
      if (items.length > 1 && fabricLib && typeof fabricLib.ActiveSelection === "function") {
        const sel = new fabricLib.ActiveSelection(items, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(sel);
        sel.setCoords();
      }
    }
    fabricCanvas.requestRenderAll();
    syncGuideLayers(instance);
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  }
  function ensureCanvasSize(instance) {
    const fabricCanvas = instance.data.fabricCanvas;
    const ui = instance.data.ui;
    if (!fabricCanvas || !ui || !ui.board) return;
    const width = Math.max(Number(ui.board.clientWidth) || 1, 1);
    const height = Math.max(Number(ui.board.clientHeight) || 1, 1);
    const doc = getDocumentSize(instance);
    const margin = Math.max(0, Number(ARTBOARD_VIEWER_MARGIN_PX) || 0);
    const fitAreaWidth = Math.max(1, width - margin * 2);
    const fitAreaHeight = Math.max(1, height - margin * 2);
    const fit = computeFit(fitAreaWidth, fitAreaHeight, doc.width, doc.height);
    const zoomScale = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
    const scaled = fit.scale * zoomScale;
    const panX = Number.isFinite(Number(instance.data.panX)) ? Number(instance.data.panX) : 0;
    const panY = Number.isFinite(Number(instance.data.panY)) ? Number(instance.data.panY) : 0;
    const offsetX = (width - doc.width * scaled) / 2 + panX;
    const offsetY = (height - doc.height * scaled) / 2 + panY;
    instance.data.viewport = {
      docW: doc.width,
      docH: doc.height,
      scale: scaled,
      offsetX,
      offsetY,
      zoomScale,
      panX,
      panY
    };
    fabricCanvas.setDimensions({ width, height });
    applyViewportTransform(instance);
    const artboard = ensureArtboardRect(instance, instance.data.fabricLib);
    if (artboard) {
      artboard.set({
        left: 0,
        top: 0,
        width: doc.width,
        height: doc.height,
        strokeWidth: 0
      });
      if (typeof artboard.setCoords === "function") artboard.setCoords();
    }
    syncGuideLayers(instance);
    fabricCanvas.requestRenderAll();
  }

  // plugins/fabric/fabric-view/src/ui/color-picker.js
  var DEFAULT_FLAT_UI_COLORS = [
    "#1abc9c",
    "#16a085",
    "#2ecc71",
    "#27ae60",
    "#3498db",
    "#2980b9",
    "#9b59b6",
    "#8e44ad",
    "#f1c40f",
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#e74c3c",
    "#c0392b",
    "#ecf0f1",
    "#bdc3c7",
    "#95a5a6",
    "#7f8c8d",
    "#34495e",
    "#2c3e50"
  ];
  function applySwatchStyle(swatch, swatchMode, color) {
    if (!swatch) return;
    if (isTransparentColor(color)) {
      swatch.style.background = "#ffffff";
      swatch.style.border = "1px solid #cbd5e1";
      return;
    }
    if (swatchMode === "stroke") {
      swatch.style.border = `3px solid ${color}`;
      swatch.style.background = "transparent";
      return;
    }
    const normalized = typeof color === "string" ? color.trim().toLowerCase() : "";
    const isWhite = normalized === "#ffffff" || normalized === "#fff";
    swatch.style.border = isWhite ? "1px solid #cbd5e1" : "none";
    swatch.style.background = color;
  }
  function styleButtonBase(button) {
    button.style.height = "28px";
    button.style.minWidth = "28px";
    button.style.border = "none";
    button.style.borderRadius = "8px";
    button.style.background = "transparent";
    button.style.cursor = "pointer";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
  }
  function createFlatColorPicker(options = {}) {
    const label = options.label || "Color";
    const flatColors = Array.isArray(options.flatColors) && options.flatColors.length > 0 ? options.flatColors : DEFAULT_FLAT_UI_COLORS;
    const initial = typeof options.initialColor === "string" ? options.initialColor : "#111827";
    let currentColor = isTransparentColor(initial) ? "transparent" : ensureHex(initial, "#111827");
    const swatchMode = options.swatchMode === "stroke" ? "stroke" : "fill";
    let handlers = { onPresetSelect: null, onCustomSelect: null };
    let disabled = false;
    let mixed = false;
    const root = document.createElement("label");
    root.style.display = "inline-flex";
    root.style.gap = "8px";
    root.style.alignItems = "center";
    root.style.fontSize = "12px";
    root.style.color = "#334155";
    root.textContent = label;
    const trigger = document.createElement("button");
    trigger.type = "button";
    styleButtonBase(trigger);
    trigger.style.width = "28px";
    trigger.style.padding = "0";
    const swatch = document.createElement("span");
    swatch.style.width = "16px";
    swatch.style.height = "16px";
    swatch.style.borderRadius = "999px";
    applySwatchStyle(swatch, swatchMode, currentColor);
    trigger.appendChild(swatch);
    root.appendChild(trigger);
    const popover = document.createElement("div");
    popover.style.position = "fixed";
    popover.style.zIndex = "2147483647";
    popover.style.display = "none";
    popover.style.background = "#ffffff";
    popover.style.border = "1px solid #e2e8f0";
    popover.style.borderRadius = "12px";
    popover.style.padding = "10px";
    popover.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.16)";
    popover.style.width = "220px";
    const paletteTitle = document.createElement("div");
    paletteTitle.textContent = "Flat UI colors";
    paletteTitle.style.fontSize = "12px";
    paletteTitle.style.color = "#64748b";
    paletteTitle.style.marginBottom = "8px";
    popover.appendChild(paletteTitle);
    const swatchGrid = document.createElement("div");
    swatchGrid.style.display = "grid";
    swatchGrid.style.gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
    swatchGrid.style.gap = "8px";
    swatchGrid.style.marginBottom = "10px";
    popover.appendChild(swatchGrid);
    flatColors.forEach((color) => {
      const b = document.createElement("button");
      b.type = "button";
      b.title = color;
      b.style.width = "100%";
      b.style.aspectRatio = "1 / 1";
      b.style.borderRadius = "999px";
      b.style.border = "1px solid #cbd5e1";
      b.style.background = color;
      b.style.cursor = "pointer";
      b.addEventListener("click", () => {
        if (disabled) return;
        currentColor = color;
        swatch.style.background = color;
        if (typeof handlers.onPresetSelect === "function") handlers.onPresetSelect(color);
        close();
      });
      swatchGrid.appendChild(b);
    });
    const customRow = document.createElement("div");
    customRow.style.display = "flex";
    customRow.style.alignItems = "center";
    customRow.style.justifyContent = "space-between";
    customRow.style.gap = "8px";
    popover.appendChild(customRow);
    const customLabel = document.createElement("span");
    customLabel.textContent = "Custom color";
    customLabel.style.fontSize = "12px";
    customLabel.style.color = "#64748b";
    customRow.appendChild(customLabel);
    const openCustomBtn = document.createElement("button");
    openCustomBtn.type = "button";
    openCustomBtn.textContent = "+";
    styleButtonBase(openCustomBtn);
    openCustomBtn.style.width = "28px";
    openCustomBtn.style.fontWeight = "700";
    customRow.appendChild(openCustomBtn);
    const transparentBtn = document.createElement("button");
    transparentBtn.type = "button";
    transparentBtn.textContent = "Transparent";
    styleButtonBase(transparentBtn);
    transparentBtn.style.padding = "0 10px";
    transparentBtn.style.fontSize = "12px";
    transparentBtn.style.border = "1px solid #e2e8f0";
    transparentBtn.style.background = "#ffffff";
    transparentBtn.style.color = "#475569";
    transparentBtn.style.width = "100%";
    transparentBtn.style.marginTop = "10px";
    transparentBtn.style.justifyContent = "flex-start";
    popover.appendChild(transparentBtn);
    const customPanel = document.createElement("div");
    customPanel.style.display = "none";
    customPanel.style.marginTop = "10px";
    customPanel.style.paddingTop = "10px";
    customPanel.style.borderTop = "1px solid #eef2f7";
    const customInput = document.createElement("input");
    customInput.type = "color";
    customInput.value = currentColor;
    customInput.style.width = "100%";
    customInput.style.height = "34px";
    customInput.style.border = "1px solid #cbd5e1";
    customInput.style.borderRadius = "8px";
    customInput.style.padding = "0";
    customInput.style.background = "#ffffff";
    customPanel.appendChild(customInput);
    const customActions = document.createElement("div");
    customActions.style.display = "flex";
    customActions.style.justifyContent = "flex-end";
    customActions.style.gap = "8px";
    customActions.style.marginTop = "8px";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    styleButtonBase(cancelBtn);
    cancelBtn.style.padding = "0 10px";
    const applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.textContent = "Apply";
    styleButtonBase(applyBtn);
    applyBtn.style.padding = "0 10px";
    applyBtn.style.borderColor = "#93c5fd";
    applyBtn.style.background = "#eff6ff";
    customActions.appendChild(cancelBtn);
    customActions.appendChild(applyBtn);
    customPanel.appendChild(customActions);
    popover.appendChild(customPanel);
    function placePopover() {
      const rect = trigger.getBoundingClientRect();
      const width = 220;
      const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width));
      const top = rect.bottom + 8;
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    }
    function open() {
      if (disabled) return;
      customInput.value = isTransparentColor(currentColor) ? "#111827" : currentColor;
      customPanel.style.display = "none";
      popover.style.display = "block";
      placePopover();
    }
    function close() {
      popover.style.display = "none";
      customPanel.style.display = "none";
    }
    function setColor(color) {
      currentColor = isTransparentColor(color) ? "transparent" : ensureHex(color, currentColor);
      if (!mixed) {
        applySwatchStyle(swatch, swatchMode, currentColor);
      }
    }
    function setMixed(isMixed) {
      mixed = !!isMixed;
      if (mixed) {
        swatch.style.background = "#e2e8f0";
        swatch.style.border = "1px solid #94a3b8";
        trigger.style.opacity = disabled ? "0.55" : "1";
        root.style.color = "#94a3b8";
        return;
      }
      root.style.color = "#334155";
      applySwatchStyle(swatch, swatchMode, currentColor);
    }
    function setDisabled(nextDisabled) {
      disabled = !!nextDisabled;
      trigger.disabled = disabled;
      trigger.style.opacity = disabled ? "0.55" : "1";
      if (!mixed) root.style.color = disabled ? "#94a3b8" : "#334155";
      if (disabled) close();
    }
    function setVisible(isVisible) {
      root.style.display = isVisible ? "inline-flex" : "none";
      if (!isVisible) close();
    }
    function setHandlers(nextHandlers) {
      handlers = {
        onPresetSelect: nextHandlers && typeof nextHandlers.onPresetSelect === "function" ? nextHandlers.onPresetSelect : null,
        onCustomSelect: nextHandlers && typeof nextHandlers.onCustomSelect === "function" ? nextHandlers.onCustomSelect : null
      };
    }
    openCustomBtn.addEventListener("click", () => {
      if (disabled) return;
      customPanel.style.display = customPanel.style.display === "none" ? "block" : "none";
      if (customPanel.style.display === "block") customInput.focus();
      placePopover();
    });
    cancelBtn.addEventListener("click", () => {
      close();
    });
    applyBtn.addEventListener("click", () => {
      if (disabled) return;
      const hex = ensureHex(customInput.value, currentColor);
      currentColor = hex;
      applySwatchStyle(swatch, swatchMode, hex);
      if (typeof handlers.onCustomSelect === "function") handlers.onCustomSelect(hex);
      close();
    });
    transparentBtn.addEventListener("click", () => {
      if (disabled) return;
      currentColor = "transparent";
      applySwatchStyle(swatch, swatchMode, currentColor);
      if (typeof handlers.onPresetSelect === "function") handlers.onPresetSelect("transparent");
      close();
    });
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (popover.style.display === "none") open();
      else close();
    });
    document.addEventListener("click", (event) => {
      if (popover.style.display === "none") return;
      const target = event.target;
      if (target && (popover.contains(target) || trigger.contains(target))) return;
      close();
    }, true);
    window.addEventListener("resize", () => {
      if (popover.style.display !== "none") placePopover();
    });
    document.body.appendChild(popover);
    return {
      root,
      setColor,
      setMixed,
      setDisabled,
      setVisible,
      setHandlers,
      close
    };
  }

  // plugins/fabric/fabric-view/src/ui/shell.js
  function buildShell() {
    const styleTopNumberInput = (input) => {
      input.style.width = "56px";
      input.style.height = "28px";
      input.style.border = "1px solid #cbd5e1";
      input.style.borderRadius = "8px";
      input.style.padding = "0 8px";
      input.style.background = "#ffffff";
      input.style.color = "#0f172a";
      input.style.fontSize = "12px";
      input.style.fontWeight = "500";
      input.style.letterSpacing = "0";
      input.style.transition = "border-color 120ms ease, background-color 120ms ease";
      input.style.outline = "none";
      input.style.boxSizing = "border-box";
      input.style.appearance = "none";
      input.style.webkitAppearance = "none";
      input.style.MozAppearance = "textfield";
      input.addEventListener("focus", () => {
        input.style.borderColor = "#94a3b8";
        input.style.background = "#ffffff";
        input.style.boxShadow = "none";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#cbd5e1";
        input.style.background = "#ffffff";
        input.style.boxShadow = "none";
      });
      input.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        const step = Number.isFinite(Number(input.step)) ? Number(input.step) : 1;
        const min = Number.isFinite(Number(input.min)) ? Number(input.min) : -Infinity;
        const max = Number.isFinite(Number(input.max)) ? Number(input.max) : Infinity;
        const base = Number.isFinite(Number(input.value)) ? Number(input.value) : Number.isFinite(min) ? min : 0;
        const delta = event.key === "ArrowUp" ? step : -step;
        const next = Math.max(min, Math.min(max, base + delta));
        input.value = String(next);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    };
    const root = document.createElement("div");
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.position = "relative";
    root.style.background = "#f8fafc";
    root.style.overflow = "hidden";
    root.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";
    const topBar = document.createElement("div");
    topBar.style.display = "flex";
    topBar.style.alignItems = "center";
    topBar.style.justifyContent = "flex-start";
    topBar.style.gap = "10px";
    topBar.style.paddingTop = "10px";
    topBar.style.paddingRight = "12px";
    topBar.style.paddingBottom = "10px";
    topBar.style.paddingLeft = "10px";
    topBar.style.height = "52px";
    topBar.style.minHeight = "52px";
    topBar.style.maxHeight = "52px";
    topBar.style.boxSizing = "border-box";
    topBar.style.background = "#ffffff";
    topBar.style.borderBottom = "1px solid #e2e8f0";
    topBar.style.flexShrink = "0";
    const documentTitle = document.createElement("div");
    documentTitle.style.fontSize = "13px";
    documentTitle.style.fontWeight = "600";
    documentTitle.style.color = "#0f172a";
    documentTitle.style.whiteSpace = "nowrap";
    documentTitle.style.overflow = "hidden";
    documentTitle.style.textOverflow = "ellipsis";
    documentTitle.style.flex = "1 1 auto";
    documentTitle.style.minWidth = "0";
    const topControls = document.createElement("div");
    topControls.style.display = "flex";
    topControls.style.alignItems = "center";
    topControls.style.justifyContent = "flex-end";
    topControls.style.gap = "10px";
    topControls.style.flexShrink = "0";
    topControls.style.marginLeft = "auto";
    const fillControl = createFlatColorPicker({ label: "Fill", initialColor: "#111827", swatchMode: "fill" });
    const strokeControl = createFlatColorPicker({ label: "Stroke", initialColor: "#000000", swatchMode: "stroke" });
    const strokeWidthInput = document.createElement("input");
    strokeWidthInput.type = "text";
    strokeWidthInput.inputMode = "numeric";
    strokeWidthInput.min = "0";
    strokeWidthInput.max = "50";
    strokeWidthInput.step = "1";
    strokeWidthInput.value = "1";
    styleTopNumberInput(strokeWidthInput);
    const radiusInput = document.createElement("input");
    radiusInput.type = "text";
    radiusInput.inputMode = "numeric";
    radiusInput.min = "0";
    radiusInput.max = "200";
    radiusInput.step = "1";
    radiusInput.value = "0";
    styleTopNumberInput(radiusInput);
    const fontSizeInput = document.createElement("input");
    fontSizeInput.type = "text";
    fontSizeInput.inputMode = "numeric";
    fontSizeInput.min = "1";
    fontSizeInput.max = "400";
    fontSizeInput.step = "1";
    fontSizeInput.value = "16";
    styleTopNumberInput(fontSizeInput);
    const opacityInput = document.createElement("input");
    opacityInput.type = "text";
    opacityInput.inputMode = "numeric";
    opacityInput.min = "0";
    opacityInput.max = "100";
    opacityInput.step = "1";
    opacityInput.value = "100";
    styleTopNumberInput(opacityInput);
    const fontFamilySelect = document.createElement("select");
    fontFamilySelect.setAttribute("aria-label", "Font family");
    fontFamilySelect.style.width = "148px";
    fontFamilySelect.style.height = "28px";
    fontFamilySelect.style.border = "1px solid #cbd5e1";
    fontFamilySelect.style.borderRadius = "8px";
    fontFamilySelect.style.padding = "0 8px";
    fontFamilySelect.style.background = "#ffffff";
    fontFamilySelect.style.color = "#0f172a";
    fontFamilySelect.style.fontSize = "12px";
    fontFamilySelect.style.fontWeight = "500";
    fontFamilySelect.style.cursor = "pointer";
    fontFamilySelect.style.outline = "none";
    fontFamilySelect.style.boxSizing = "border-box";
    fontFamilySelect.style.fontFamily = "'Inter', 'Helvetica Neue', Arial, sans-serif";
    FONT_PRESETS.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.fontFamily;
      o.textContent = p.label;
      fontFamilySelect.appendChild(o);
    });
    fontFamilySelect.value = DEFAULT_TEXT_FONT_FAMILY;
    const topFill = fillControl.root;
    const topStroke = strokeControl.root;
    const topStrokeWidth = document.createElement("label");
    topStrokeWidth.textContent = "Width";
    topStrokeWidth.style.display = "inline-flex";
    topStrokeWidth.style.gap = "8px";
    topStrokeWidth.style.alignItems = "center";
    topStrokeWidth.style.fontSize = "12px";
    topStrokeWidth.style.color = "#334155";
    topStrokeWidth.appendChild(strokeWidthInput);
    const topRadius = document.createElement("label");
    topRadius.textContent = "Radius";
    topRadius.style.display = "inline-flex";
    topRadius.style.gap = "8px";
    topRadius.style.alignItems = "center";
    topRadius.style.fontSize = "12px";
    topRadius.style.color = "#334155";
    topRadius.appendChild(radiusInput);
    const topFontFamily = document.createElement("div");
    topFontFamily.style.display = "inline-flex";
    topFontFamily.style.alignItems = "center";
    topFontFamily.appendChild(fontFamilySelect);
    const topFontSize = document.createElement("label");
    topFontSize.textContent = "Size";
    topFontSize.style.display = "inline-flex";
    topFontSize.style.gap = "8px";
    topFontSize.style.alignItems = "center";
    topFontSize.style.fontSize = "12px";
    topFontSize.style.color = "#334155";
    topFontSize.appendChild(fontSizeInput);
    const topOpacity = document.createElement("label");
    topOpacity.textContent = "Opacity";
    topOpacity.style.display = "inline-flex";
    topOpacity.style.gap = "8px";
    topOpacity.style.alignItems = "center";
    topOpacity.style.fontSize = "12px";
    topOpacity.style.color = "#334155";
    topOpacity.appendChild(opacityInput);
    const mkBtn = (iconClass, title) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = title;
      btn.style.width = "36px";
      btn.style.height = "36px";
      btn.style.border = "1px solid #cbd5e1";
      btn.style.background = "#ffffff";
      btn.style.borderRadius = "10px";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.cursor = "pointer";
      btn.style.color = "#0f172a";
      const icon = document.createElement("i");
      icon.className = iconClass;
      icon.style.fontSize = "18px";
      btn.appendChild(icon);
      return btn;
    };
    const artboardNav = document.createElement("div");
    artboardNav.style.display = "flex";
    artboardNav.style.alignItems = "center";
    artboardNav.style.gap = "4px";
    artboardNav.style.flexShrink = "0";
    const artboardPrevBtn = mkBtn("ph ph-caret-left", "Page pr\xE9c\xE9dente");
    const artboardNextBtn = mkBtn("ph ph-caret-right", "Page suivante");
    const artboardDownloadBtn = mkBtn("ph ph-download-simple", "T\xE9l\xE9charger PDF (pli A4)");
    artboardNav.appendChild(artboardPrevBtn);
    artboardNav.appendChild(artboardNextBtn);
    artboardNav.appendChild(artboardDownloadBtn);
    topBar.appendChild(documentTitle);
    topControls.appendChild(artboardNav);
    topControls.appendChild(topFill);
    topControls.appendChild(topStroke);
    topControls.appendChild(topStrokeWidth);
    topControls.appendChild(topRadius);
    topControls.appendChild(topFontFamily);
    topControls.appendChild(topFontSize);
    topControls.appendChild(topOpacity);
    topBar.appendChild(topControls);
    const body = document.createElement("div");
    body.style.display = "flex";
    body.style.flex = "1";
    body.style.minHeight = "0";
    const leftBar = document.createElement("div");
    leftBar.style.width = "56px";
    leftBar.style.background = "#ffffff";
    leftBar.style.borderRight = "1px solid #e2e8f0";
    leftBar.style.display = "flex";
    leftBar.style.flexDirection = "column";
    leftBar.style.alignItems = "center";
    leftBar.style.paddingTop = "12px";
    leftBar.style.paddingBottom = "12px";
    leftBar.style.gap = "4px";
    leftBar.style.flexShrink = "0";
    const board = document.createElement("div");
    board.style.flex = "1";
    board.style.position = "relative";
    board.style.minWidth = "0";
    board.style.minHeight = "0";
    board.style.background = "#e5e7eb";
    const canvasHost = document.createElement("div");
    canvasHost.style.position = "absolute";
    canvasHost.style.inset = "0";
    const canvasEl = document.createElement("canvas");
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.display = "block";
    canvasHost.appendChild(canvasEl);
    board.appendChild(canvasHost);
    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.position = "absolute";
    loadingOverlay.style.inset = "0";
    loadingOverlay.style.display = "none";
    loadingOverlay.style.alignItems = "center";
    loadingOverlay.style.justifyContent = "center";
    loadingOverlay.style.background = "rgba(229, 231, 235, 0.6)";
    loadingOverlay.style.zIndex = "20";
    loadingOverlay.style.pointerEvents = "none";
    const loadingSpinner = document.createElement("i");
    loadingSpinner.className = "ph ph-circle-notch";
    loadingSpinner.style.fontSize = "40px";
    loadingSpinner.style.color = "#475569";
    loadingSpinner.style.animation = "fabric-view-spin 0.7s linear infinite";
    loadingOverlay.appendChild(loadingSpinner);
    board.appendChild(loadingOverlay);
    body.appendChild(leftBar);
    body.appendChild(board);
    root.appendChild(topBar);
    root.appendChild(body);
    const alignToolbar = document.createElement("div");
    alignToolbar.style.display = "none";
    alignToolbar.style.flexDirection = "row";
    alignToolbar.style.alignItems = "center";
    alignToolbar.style.gap = "4px";
    alignToolbar.style.flexShrink = "0";
    alignToolbar.style.marginRight = "10px";
    const mkAlignBtn = (iconClass, title, mode) => {
      const btn = mkBtn(iconClass, title);
      btn.setAttribute("data-align-mode", mode);
      return btn;
    };
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-left-simple", "Aligner \xE0 gauche", "left"));
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-center-horizontal-simple", "Centrer horizontalement", "center-h"));
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-right-simple", "Aligner \xE0 droite", "right"));
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-top-simple", "Aligner en haut", "top"));
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-center-vertical-simple", "Centrer verticalement", "middle"));
    alignToolbar.appendChild(mkAlignBtn("ph ph-align-bottom-simple", "Aligner en bas", "bottom"));
    topBar.insertBefore(alignToolbar, documentTitle);
    const textBtn = mkBtn("ph ph-text-t", "Text");
    const shapeBtn = mkBtn("ph ph-square", "Shape");
    const iconBtn = mkBtn("ph ph-smiley", "Emojis");
    const tableBtn = mkBtn("ph ph-grid-nine", "Table");
    const penBtn = mkBtn("ph ph-pen", "Pen");
    const panBtn = mkBtn("ph ph-hand", "Pan");
    const imageBtn = mkBtn("ph ph-image", "Image");
    const bookmarkBtn = mkBtn("ph ph-bookmark-simple", "Bookmark");
    const zoomOutBtn = mkBtn("ph ph-minus", "Zoom out");
    const zoomInBtn = mkBtn("ph ph-plus", "Zoom in");
    const fitBtn = mkBtn("ph ph-corners-in", "Fit");
    leftBar.appendChild(textBtn);
    leftBar.appendChild(shapeBtn);
    leftBar.appendChild(iconBtn);
    leftBar.appendChild(tableBtn);
    leftBar.appendChild(penBtn);
    leftBar.appendChild(imageBtn);
    leftBar.appendChild(bookmarkBtn);
    const leftSpacer = document.createElement("div");
    leftSpacer.style.flex = "1";
    leftBar.appendChild(leftSpacer);
    leftBar.appendChild(panBtn);
    leftBar.appendChild(zoomInBtn);
    leftBar.appendChild(zoomOutBtn);
    leftBar.appendChild(fitBtn);
    return {
      root,
      topBar,
      alignToolbar,
      documentTitle,
      artboardNav,
      artboardPrevBtn,
      artboardNextBtn,
      artboardDownloadBtn,
      topControls,
      fillControl,
      strokeControl,
      strokeWidthInput,
      radiusInput,
      fontFamilySelect,
      fontSizeInput,
      opacityInput,
      topFill,
      topStroke,
      topStrokeWidth,
      topRadius,
      topFontFamily,
      topFontSize,
      topOpacity,
      canvasEl,
      textBtn,
      iconBtn,
      tableBtn,
      penBtn,
      panBtn,
      imageBtn,
      bookmarkBtn,
      zoomOutBtn,
      zoomInBtn,
      fitBtn,
      shapeBtn,
      board,
      loadingOverlay
    };
  }

  // plugins/fabric/fabric-view/src/tools.js
  function setupTools(app) {
    const { instance, fabricCanvas, fabricLib, ui } = app;
    const applyPenBrush = () => {
      if (!fabricCanvas.freeDrawingBrush && typeof fabricLib.PencilBrush === "function") {
        fabricCanvas.freeDrawingBrush = new fabricLib.PencilBrush(fabricCanvas);
      }
      if (!fabricCanvas.freeDrawingBrush) return;
      fabricCanvas.freeDrawingBrush.color = normalizeCanvasColor(instance.data.penColor, "#111827");
      fabricCanvas.freeDrawingBrush.width = Math.max(1, Number(instance.data.penWidth) || 3);
      fabricCanvas.freeDrawingBrush.strokeLineCap = "round";
      fabricCanvas.freeDrawingBrush.strokeLineJoin = "round";
      fabricCanvas.freeDrawingBrush.decimate = 10;
    };
    const setActiveToolButton = (activeBtn) => {
      [ui.textBtn, ui.shapeBtn, ui.iconBtn, ui.penBtn, ui.panBtn, ui.imageBtn, ui.bookmarkBtn].forEach((btn) => {
        if (!btn) return;
        btn.style.background = btn === activeBtn ? "#eef2ff" : "#ffffff";
        btn.style.borderColor = btn === activeBtn ? "#93c5fd" : "#cbd5e1";
      });
    };
    const syncToolButtonHighlightToMode = () => {
      const m = instance.data.toolMode;
      if (m === "draw") {
        setActiveToolButton(ui.penBtn);
      } else if (m === "pan") {
        setActiveToolButton(ui.panBtn);
      } else {
        setActiveToolButton(null);
      }
    };
    const setToolMode = (mode) => {
      instance.data.toolMode = mode === "draw" || mode === "pan" ? mode : "select";
      const isDrawMode = instance.data.toolMode === "draw";
      const isPanMode = instance.data.toolMode === "pan";
      fabricCanvas.isDrawingMode = isDrawMode;
      fabricCanvas.selection = !isDrawMode && !isPanMode;
      fabricCanvas.skipTargetFind = isDrawMode || isPanMode;
      fabricCanvas.defaultCursor = isDrawMode ? "crosshair" : isPanMode ? "grab" : "default";
      if (isDrawMode) {
        fabricCanvas.discardActiveObject();
        applyPenBrush();
      }
      if (isPanMode) {
        fabricCanvas.discardActiveObject();
      }
      if (!isPanMode) {
        instance.data.isPanning = false;
        ui.board.style.cursor = "";
      }
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      syncToolButtonHighlightToMode();
    };
    const exitPanMode = () => {
      if (instance.data.toolMode !== "pan") return;
      setToolMode("select");
    };
    return { applyPenBrush, setActiveToolButton, syncToolButtonHighlightToMode, setToolMode, exitPanMode };
  }

  // plugins/fabric/fabric-view/src/selection-ops.js
  function setupSelectionOps(app) {
    const { instance, fabricCanvas, fabricLib } = app;
    const removeEmptySelectionContainers = () => {
      const objs = [...fabricCanvas.getObjects()];
      objs.forEach((o) => {
        if (!o || !isSelectionContainer(o)) return;
        const kids = typeof o.getObjects === "function" ? o.getObjects() : [];
        if (Array.isArray(kids) && kids.length === 0) {
          fabricCanvas.remove(o);
        }
      });
    };
    const groupSelection = () => {
      const active = fabricCanvas.getActiveObject();
      if (!active || !isSelectionContainer(active)) return;
      if (typeof fabricLib.Group !== "function") return;
      const targets = getActiveSelectionTargets(fabricCanvas).filter(
        (o) => o && !o.isArtboard && !o.isSafeZone
      );
      if (targets.length <= 1) return;
      const objectRefs = targets.slice();
      fabricCanvas.discardActiveObject();
      removeEmptySelectionContainers();
      objectRefs.forEach((o) => {
        if (typeof o.setCoords === "function") o.setCoords();
      });
      const group = new fabricLib.Group(objectRefs, {
        canvas: fabricCanvas,
        originX: "left",
        originY: "top"
      });
      if (typeof group.triggerLayout === "function") {
        group.triggerLayout();
      } else if (typeof group.setCoords === "function") {
        group.setCoords();
      }
      fabricCanvas.add(group);
      fabricCanvas.setActiveObject(group);
      syncGuideLayers(instance);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
    };
    const isGroupObject = (active) => {
      if (!active) return false;
      const type = String(active.type || "").toLowerCase();
      return type === "group";
    };
    const ungroupSelection = () => {
      const active = fabricCanvas.getActiveObject();
      if (!active || !isGroupObject(active)) return;
      const children = typeof active.getObjects === "function" ? [...active.getObjects()] : [];
      if (children.length === 0) return;
      children.forEach((obj) => {
        if (typeof active.remove === "function") {
          active.remove(obj);
        }
      });
      fabricCanvas.remove(active);
      if (typeof fabricCanvas.add === "function") {
        const existing = new Set(
          typeof fabricCanvas.getObjects === "function" ? fabricCanvas.getObjects() : []
        );
        children.forEach((obj) => {
          if (!obj) return;
          if (existing.has(obj)) return;
          fabricCanvas.add(obj);
          if (typeof obj.setCoords === "function") obj.setCoords();
          obj.visible = obj.visible !== false;
        });
      }
      if (typeof fabricLib.ActiveSelection === "function") {
        const selection = new fabricLib.ActiveSelection(children, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(selection);
        if (typeof selection.setCoords === "function") {
          selection.setCoords();
        }
      } else if (children.length === 1) {
        fabricCanvas.setActiveObject(children[0]);
      }
      syncGuideLayers(instance);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
    };
    const DUPLICATE_MENU_OFFSET_X = 14;
    const DUPLICATE_MENU_OFFSET_Y = 14;
    const duplicateSelection = () => {
      const active = fabricCanvas.getActiveObject();
      if (!active) return;
      if (active.isArtboard || active.isSafeZone) return;
      if (typeof active.isEditing === "function" && active.isEditing) return;
      if (typeof active.isEditing === "boolean" && active.isEditing) return;
      if (typeof active.clone !== "function") return;
      const finish = (cloned) => {
        if (!cloned) return;
        cloned.set({
          left: (Number(cloned.left) || 0) + DUPLICATE_MENU_OFFSET_X,
          top: (Number(cloned.top) || 0) + DUPLICATE_MENU_OFFSET_Y
        });
        if (typeof cloned.setCoords === "function") cloned.setCoords();
        applyStrokeUniformDeep(cloned);
        fabricCanvas.add(cloned);
        fabricCanvas.discardActiveObject();
        fabricCanvas.setActiveObject(cloned);
        fabricCanvas.requestRenderAll();
        syncGuideLayers(instance);
        updateTopBarForSelection(instance);
      };
      try {
        const result = active.clone();
        if (result && typeof result.then === "function") {
          result.then(finish).catch(() => {
          });
        } else {
          finish(result);
        }
      } catch (e) {
      }
    };
    return { removeEmptySelectionContainers, groupSelection, isGroupObject, ungroupSelection, duplicateSelection };
  }

  // plugins/fabric/fabric-view/src/clipboard.js
  async function loadFabricImageFromUrl(ImageApi, url) {
    if (!ImageApi || typeof ImageApi.fromURL !== "function" || !url) return null;
    const isDataOrBlob = /^data:|^blob:/i.test(url);
    if (isDataOrBlob) {
      try {
        return await ImageApi.fromURL(url, {});
      } catch (e) {
        return null;
      }
    }
    const isRemoteHttp = /^https?:\/\//i.test(url);
    if (isRemoteHttp) {
      try {
        return await ImageApi.fromURL(url, { crossOrigin: "anonymous" });
      } catch (e) {
      }
      try {
        return await ImageApi.fromURL(url, {});
      } catch (e) {
        return null;
      }
    }
    try {
      return await ImageApi.fromURL(url, {});
    } catch (e) {
      return null;
    }
  }
  async function addRasterImageFromUrl(instance, fabricLib, primaryUrl, options) {
    const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
    const log = "[FabricView image]";
    if (!fabricCanvas || !fabricLib || !primaryUrl) {
      console.warn(log, "canvas, fabric ou primaryUrl manquant");
      return void 0;
    }
    const opts = options || {};
    const fallbackDataUrl = opts.fallbackDataUrl;
    const forbidFallback = opts.forbidDataUrlFallback === true;
    const ImageApi = fabricLib.Image;
    let img = await loadFabricImageFromUrl(ImageApi, primaryUrl);
    if (!img && forbidFallback) {
      console.error(log, "\xC9chec chargement depuis l\u2019URL Bubble (repli data URL d\xE9sactiv\xE9 en prod Bubble)", primaryUrl);
    }
    if (!img && !forbidFallback && fallbackDataUrl && fallbackDataUrl !== primaryUrl) {
      console.warn(log, "Repli data URL apr\xE8s \xE9chec URL primaire (sandbox ou secours)");
      img = await loadFabricImageFromUrl(ImageApi, fallbackDataUrl);
    }
    if (!img) {
      if (!forbidFallback) {
        console.error(log, "Impossible de charger l\u2019image (URL primaire et repli \xE9chou\xE9s)");
      }
      return void 0;
    }
    const imageId = newFabricImageId();
    const doc = getDocumentSize(instance);
    const center = getDocumentCenter(instance);
    const position = opts.position && Number.isFinite(Number(opts.position.x)) && Number.isFinite(Number(opts.position.y)) ? { x: Number(opts.position.x), y: Number(opts.position.y) } : center;
    const el = img._element || (typeof img.getElement === "function" ? img.getElement() : null);
    const iw = el && el.naturalWidth || img.width || 100;
    const ih = el && el.naturalHeight || img.height || 100;
    const maxW = doc.width * 0.85;
    const maxH = doc.height * 0.85;
    let scale = 1;
    if (iw > 0 && ih > 0) {
      scale = Math.min(maxW / iw, maxH / ih, 1);
    }
    img.set({
      id: imageId,
      left: Math.round(position.x),
      top: Math.round(position.y),
      originX: "center",
      originY: "center",
      scaleX: scale,
      scaleY: scale
    });
    applyStrokeUniformDeep(img);
    fabricCanvas.add(img);
    fabricCanvas.setActiveObject(img);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
    return imageId;
  }
  async function insertImageFileOnCanvas(instance, fabricLib, context, file, options) {
    const opts = options || {};
    const log = opts.logTag || "[FabricView image]";
    if (!file || !String(file.type || "").toLowerCase().startsWith("image/")) return void 0;
    const insertOpts = opts.position ? { position: opts.position } : {};
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const base64 = dataUrlToBase64(dataUrl);
      const ext = guessImageFileExtension(file);
      const rawName = typeof file.name === "string" && file.name.trim() ? file.name.trim() : `image${ext}`;
      const safeName = rawName.replace(/[^\w.-]/g, "_") || `image${ext}`;
      if (context && typeof context.uploadContent === "function" && base64) {
        try {
          const uploadedUrl = await new Promise((resolve, reject) => {
            context.uploadContent(safeName, base64, (err, url) => {
              if (err) reject(err);
              else resolve(typeof url === "string" ? url : "");
            });
          });
          const trimmed = String(uploadedUrl || "").trim();
          if (/^https?:\/\/|^blob:/i.test(trimmed)) {
            return await addRasterImageFromUrl(instance, fabricLib, trimmed, {
              ...insertOpts,
              fallbackDataUrl: dataUrl
            });
          }
          console.warn(log, "uploadContent sans URL http(s) \u2014 utilisation data URL", trimmed || "(vide)");
          return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
        } catch (uploadErr) {
          console.error(log, "uploadContent erreur", uploadErr);
          console.warn(log, "Repli data URL apr\xE8s \xE9chec upload");
          return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
        }
      }
      console.log(log, "Pas de context.uploadContent \u2014 data URL (local / sandbox)");
      return await addRasterImageFromUrl(instance, fabricLib, dataUrl, insertOpts);
    } catch (e) {
      console.error(log, "chargement image", e);
      return void 0;
    }
  }
  function looksLikeSvgMarkup(text) {
    if (typeof text !== "string") return false;
    const s = text.trim().replace(/^\uFEFF/, "");
    if (!s) return false;
    if (/^<\?xml/i.test(s)) {
      return /<svg[\s>/]/i.test(s);
    }
    return /^<svg[\s>/]/i.test(s);
  }
  async function addPastedSvgFromString(instance, fabricLib, svgString) {
    const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
    if (!fabricCanvas || !fabricLib || typeof fabricLib.loadSVGFromString !== "function") return;
    let objects = null;
    let options = null;
    try {
      const result = await fabricLib.loadSVGFromString(svgString);
      if (Array.isArray(result)) {
        objects = result[0];
        options = result[1];
      } else if (result && typeof result === "object") {
        objects = result.objects;
        options = result.options;
      }
    } catch (e) {
      return;
    }
    if (!Array.isArray(objects) || objects.length === 0) return;
    const grouped = fabricLib.util.groupSVGElements(objects, options || {});
    const initialScale = 0.16;
    grouped.set({
      scaleX: initialScale,
      scaleY: initialScale
    });
    grouped.set({
      originX: "center",
      originY: "center",
      centeredScaling: true,
      centeredRotation: true,
      objectCaching: false,
      strokeUniform: true
    });
    const center = getDocumentCenter(instance);
    grouped.set({
      left: Math.round(center.x),
      top: Math.round(center.y)
    });
    applyStrokeUniformDeep(grouped);
    fabricCanvas.add(grouped);
    fabricCanvas.setActiveObject(grouped);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  }
  async function tryPasteFabricObjectsFromJson(instance, fabricLib, parsed) {
    if (!instance || !instance.data || !instance.data.fabricCanvas || !fabricLib) return false;
    if (isWrappedArtboardsJson(parsed)) return false;
    const fabricCanvas = instance.data.fabricCanvas;
    const util = fabricLib.util;
    if (!util || typeof util.enlivenObjects !== "function") return false;
    let specs = null;
    if (Array.isArray(parsed.objects) && parsed.objects.length > 0) {
      specs = parsed.objects;
    } else if (typeof parsed.type === "string" && parsed.type.length > 0) {
      specs = [parsed];
    }
    if (!specs || specs.length === 0) return false;
    try {
      const enlivened = await util.enlivenObjects(specs);
      if (!Array.isArray(enlivened) || enlivened.length === 0) return false;
      enlivened.forEach((o) => {
        if (o && typeof o.set === "function") o.set({ strokeUniform: true });
      });
      const center = getDocumentCenter(instance);
      fabricCanvas.discardActiveObject();
      enlivened.forEach((o) => {
        applyStrokeUniformDeep(o);
        fabricCanvas.add(o);
      });
      if (enlivened.length === 1) {
        const o = enlivened[0];
        o.set({ originX: "center", originY: "center", left: center.x, top: center.y });
        if (typeof o.setCoords === "function") o.setCoords();
        fabricCanvas.setActiveObject(o);
      } else if (typeof fabricLib.ActiveSelection === "function") {
        const sel = new fabricLib.ActiveSelection(enlivened, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(sel);
        sel.set({ originX: "center", originY: "center", left: center.x, top: center.y });
        if (typeof sel.setCoords === "function") sel.setCoords();
      } else {
        fabricCanvas.setActiveObject(enlivened[enlivened.length - 1]);
      }
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      return true;
    } catch (e) {
      return false;
    }
  }
  function addPastedPlainText(instance, fabricLib, text) {
    const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
    if (!fabricCanvas || !fabricLib) return;
    const doc = getDocumentSize(instance);
    const center = getDocumentCenter(instance);
    const box = new fabricLib.Textbox(text, {
      left: Math.round(center.x),
      top: Math.round(center.y),
      originX: "center",
      originY: "center",
      width: Math.min(560, Math.max(120, doc.width * 0.6)),
      fontFamily: DEFAULT_TEXT_FONT_FAMILY,
      fontSize: 30,
      fill: "#0f172a",
      strokeUniform: true
    });
    fabricCanvas.add(box);
    fabricCanvas.setActiveObject(box);
    fabricCanvas.requestRenderAll();
    updateTopBarForSelection(instance);
  }
  async function runCanvasPasteFromClipboardData(instance, fabricLib, context, cd) {
    if (!instance || !instance.data || !fabricLib || !cd) return false;
    const files = cd.files && cd.files.length ? Array.from(cd.files) : [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const t = String(file.type || "").toLowerCase();
        const name = String(file.name || "");
        if (t === "image/svg+xml" || /\.svg$/i.test(name)) {
          try {
            const svgText = await file.text();
            await addPastedSvgFromString(instance, fabricLib, svgText);
          } catch (e) {
          }
          return true;
        }
        if (t.startsWith("image/")) {
          await insertImageFileOnCanvas(instance, fabricLib, context, file, { logTag: "[FabricView paste]" });
          return true;
        }
      }
    }
    const plain = cd.getData("text/plain");
    if (typeof plain !== "string") return false;
    const trimmed = plain.trim();
    if (!trimmed) return false;
    if (looksLikeSvgMarkup(trimmed)) {
      await addPastedSvgFromString(instance, fabricLib, trimmed);
      return true;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (isWrappedArtboardsJson(parsed)) {
        return false;
      }
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.objects) && parsed.objects.length === 0) {
        return true;
      }
      const ok = await tryPasteFabricObjectsFromJson(instance, fabricLib, parsed);
      if (ok) return true;
    } catch (e) {
    }
    addPastedPlainText(instance, fabricLib, trimmed);
    return true;
  }
  async function buildClipboardDataFromNavigatorRead() {
    const files = [];
    let textPlain = "";
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith("image/")) {
              const blob = await item.getType(type);
              let ext = "png";
              if (type === "image/svg+xml") ext = "svg";
              else if (type === "image/jpeg") ext = "jpg";
              else if (type === "image/gif") ext = "gif";
              else if (type === "image/webp") ext = "webp";
              else {
                const m = type.match(/image\/([^+;\s]+)/);
                if (m) ext = m[1];
              }
              files.push(new File([blob], `clipboard.${ext}`, { type }));
            }
            if (type === "text/plain" && textPlain === "") {
              const blob = await item.getType(type);
              textPlain = await blob.text();
            }
          }
        }
      } catch (e) {
      }
    }
    if (!textPlain && navigator.clipboard && navigator.clipboard.readText) {
      try {
        textPlain = await navigator.clipboard.readText();
      } catch (e) {
      }
    }
    return {
      files: {
        length: files.length,
        item: (idx) => files[idx],
        [Symbol.iterator]: function* () {
          for (let i = 0; i < files.length; i++) yield files[i];
        }
      },
      getData(type) {
        return type === "text/plain" ? textPlain : "";
      }
    };
  }
  async function clipboardHasPastableContent() {
    if (!navigator.clipboard) return false;
    try {
      if (navigator.clipboard.readText) {
        const t = await navigator.clipboard.readText();
        if (t && String(t).trim()) return true;
      }
    } catch (e) {
    }
    try {
      if (navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (String(type || "").startsWith("image/")) return true;
          }
        }
      }
    } catch (e) {
    }
    return false;
  }
  async function handleClipboardPasteEvent(event, instance, fabricLib, context) {
    if (!event || !instance || !instance.data || !fabricLib) return;
    const fabricCanvas = instance.data.fabricCanvas;
    if (shouldIgnorePaste(event.target, fabricCanvas)) return;
    const cd = event.clipboardData;
    if (!cd) return;
    const consumed = await runCanvasPasteFromClipboardData(instance, fabricLib, context, cd);
    if (consumed) event.preventDefault();
  }
  function isTypingContext(target) {
    if (!target) return false;
    const tag = target.tagName ? String(target.tagName).toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (target.isContentEditable) return true;
    return false;
  }
  function shouldIgnorePaste(target, fabricCanvas) {
    if (isTypingContext(target)) return true;
    if (!fabricCanvas) return false;
    const active = fabricCanvas.getActiveObject();
    if (active && active.isEditing === true) return true;
    return false;
  }
  function isFabricHiddenTextarea(target) {
    if (!target || typeof target.getAttribute !== "function") return false;
    return target.getAttribute("data-fabric") === "textarea";
  }
  function shouldBlockFabricCopyShortcut(target, fabricCanvas) {
    if (isFabricHiddenTextarea(target)) {
      const active2 = fabricCanvas ? fabricCanvas.getActiveObject() : null;
      return !!(active2 && active2.isEditing);
    }
    if (isTypingContext(target)) return true;
    if (!fabricCanvas) return true;
    const active = fabricCanvas.getActiveObject();
    if (active && active.isEditing) return true;
    return false;
  }

  // plugins/fabric/fabric-view/src/ui/context-menu.js
  var NUDGE_DIRECTIONS = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  };
  function setupContextMenu(app) {
    const { instance, context, fabricCanvas, fabricLib, ui, groupSelection, isGroupObject, ungroupSelection, duplicateSelection } = app;
    const contextMenu = document.createElement("div");
    contextMenu.style.position = "fixed";
    contextMenu.style.display = "none";
    contextMenu.style.zIndex = "2147483647";
    contextMenu.style.width = "auto";
    contextMenu.style.minWidth = "0";
    contextMenu.style.maxWidth = "280px";
    contextMenu.style.padding = "6px";
    contextMenu.style.background = "#ffffff";
    contextMenu.style.border = "1px solid #e2e8f0";
    contextMenu.style.borderRadius = "12px";
    contextMenu.style.boxShadow = "0 14px 32px rgba(15, 23, 42, 0.2)";
    const closeContextMenu = () => {
      contextMenu.style.display = "none";
    };
    const addContextItem = (label, action) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.style.width = "100%";
      btn.style.height = "32px";
      btn.style.border = "none";
      btn.style.background = "#ffffff";
      btn.style.color = "#0f172a";
      btn.style.fontSize = "13px";
      btn.style.borderRadius = "8px";
      btn.style.padding = "0 10px";
      btn.style.cursor = "pointer";
      btn.style.textAlign = "left";
      btn.style.whiteSpace = "nowrap";
      btn.style.display = "block";
      btn.style.boxSizing = "border-box";
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#f1f5f9";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "#ffffff";
      });
      btn.addEventListener("click", () => {
        closeContextMenu();
        if (action === "paste") {
          void (async () => {
            try {
              const cd = await buildClipboardDataFromNavigatorRead();
              await runCanvasPasteFromClipboardData(instance, fabricLib, context, cd);
            } catch (e) {
            }
          })();
          return;
        }
        if (action === "copy") {
          const targets = getActiveSelectionTargets(fabricCanvas).filter(
            (o) => o && !o.isArtboard && !o.isSafeZone
          );
          const json = buildFabricClipboardJsonString(targets);
          if (json && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            void navigator.clipboard.writeText(json);
          }
          return;
        }
        if (action === "duplicate") {
          duplicateSelection();
          return;
        }
        if (action === "group") {
          groupSelection();
          return;
        }
        if (action === "ungroup") {
          ungroupSelection();
          return;
        }
        applyZOrderToSelection(fabricCanvas, action, instance);
        publishCanvasJson(instance);
        updateTopBarForSelection(instance);
      });
      contextMenu.appendChild(btn);
    };
    const renderContextMenuItems = () => {
      contextMenu.innerHTML = "";
      const active = fabricCanvas.getActiveObject();
      if (isSelectionContainer(active)) {
        addContextItem("Group", "group");
      } else if (isGroupObject(active)) {
        addContextItem("Ungroup", "ungroup");
      }
      addContextItem("Copy", "copy");
      addContextItem("Duplicate", "duplicate");
      addContextItem("Bring to Front", "to-front");
      addContextItem("Bring Forward", "forward");
      addContextItem("Send Backward", "backward");
      addContextItem("Send to Back", "to-back");
    };
    document.body.appendChild(contextMenu);
    const onKeyDown = (event) => {
      const nudgeDir = NUDGE_DIRECTIONS[event.key];
      if (nudgeDir) {
        if (isTypingContext(event.target)) return;
        if (!fabricCanvas) return;
        const active2 = fabricCanvas.getActiveObject();
        if (!active2 || active2.isEditing) return;
        event.preventDefault();
        const stepPx = (event.shiftKey ? 10 : 1) * PX_PER_MM;
        active2.set({
          left: active2.left + nudgeDir[0] * stepPx,
          top: active2.top + nudgeDir[1] * stepPx
        });
        active2.setCoords();
        fabricCanvas.requestRenderAll();
        schedulePublishCanvasJson(instance);
        updateTopBarForSelection(instance);
        return;
      }
      if (event.key !== "Backspace") return;
      if (isTypingContext(event.target)) return;
      if (!fabricCanvas) return;
      const active = fabricCanvas.getActiveObject();
      if (!active) return;
      if (active.isEditing) return;
      event.preventDefault();
      if (isSelectionContainer(active)) {
        const items = active.getObjects();
        fabricCanvas.discardActiveObject();
        items.forEach((obj) => fabricCanvas.remove(obj));
      } else {
        fabricCanvas.remove(active);
      }
      fabricCanvas.requestRenderAll();
      publishCanvasJson(instance);
      updateTopBarForSelection(instance);
    };
    document.addEventListener("keydown", onKeyDown);
    instance.data.onKeyDown = onKeyDown;
    const positionContextMenuAtEvent = (event) => {
      const rect = contextMenu.getBoundingClientRect();
      const menuWidth = Math.max(1, rect.width || 1);
      const menuHeight = Math.max(1, rect.height || 1);
      const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, event.clientX));
      const top = Math.max(8, Math.min(window.innerHeight - menuHeight - 8, event.clientY));
      contextMenu.style.left = `${left}px`;
      contextMenu.style.top = `${top}px`;
    };
    ui.board.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!fabricCanvas) return;
      void (async () => {
        if (typeof fabricCanvas.findTarget === "function") {
          const found = fabricCanvas.findTarget(event);
          let nextActive = found;
          if (nextActive && nextActive.group && isGroupObject(nextActive.group)) {
            nextActive = nextActive.group;
          }
          if (nextActive && fabricCanvas.getActiveObject() !== nextActive) {
            fabricCanvas.setActiveObject(nextActive);
          }
        }
        const hasSelection = getActiveSelectionTargets(fabricCanvas).length > 0;
        if (!hasSelection) {
          let canPaste = false;
          try {
            canPaste = await clipboardHasPastableContent();
          } catch (e) {
            canPaste = false;
          }
          if (!canPaste) {
            closeContextMenu();
            return;
          }
          contextMenu.innerHTML = "";
          addContextItem("Paste", "paste");
          contextMenu.style.display = "block";
          requestAnimationFrame(() => positionContextMenuAtEvent(event));
          return;
        }
        renderContextMenuItems();
        contextMenu.style.display = "block";
        requestAnimationFrame(() => positionContextMenuAtEvent(event));
      })();
    }, true);
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target && contextMenu.contains(target)) return;
      closeContextMenu();
    }, true);
    return { closeContextMenu };
  }

  // plugins/fabric/fabric-view/src/icons.js
  function stripStyleSuffix(iconFileName, style) {
    if (typeof iconFileName !== "string") return "";
    const raw = iconFileName.replace(".svg", "");
    if (style === "regular") return raw;
    const suffix = `-${style}`;
    return raw.endsWith(suffix) ? raw.slice(0, -suffix.length) : raw;
  }
  function getStyleAssetFileName(iconName, style) {
    if (typeof iconName !== "string") return "";
    const safeName = iconName.trim();
    if (!safeName) return "";
    if (style === "regular") return `${safeName}.svg`;
    return `${safeName}-${style}.svg`;
  }
  async function fetchAllPhosphorIconsByStyle(style) {
    const fallback = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
    const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : "regular";
    try {
      const response = await fetch("https://data.jsdelivr.com/v1/package/npm/@phosphor-icons/core@2.1.1", {
        method: "GET",
        headers: { accept: "application/json" }
      });
      if (!response.ok) return fallback;
      const payload = await response.json();
      const roots = Array.isArray(payload && payload.files) ? payload.files : [];
      if (roots.length === 0) return fallback;
      const iconSet = /* @__PURE__ */ new Set();
      const walk = (node, prefix) => {
        if (!node || typeof node !== "object") return;
        const name = typeof node.name === "string" ? node.name : "";
        const nextPath = prefix ? `${prefix}/${name}` : name;
        if (node.type === "file") {
          if (nextPath.startsWith(`assets/${safeStyle}/`) && nextPath.endsWith(".svg")) {
            const fileName = nextPath.replace(`assets/${safeStyle}/`, "");
            const normalized = stripStyleSuffix(fileName, safeStyle);
            if (normalized) iconSet.add(normalized);
          }
          return;
        }
        const children = Array.isArray(node.files) ? node.files : [];
        children.forEach((child) => walk(child, nextPath));
      };
      roots.forEach((node) => walk(node, ""));
      const result = Array.from(iconSet).filter(Boolean).sort((a, b) => a.localeCompare(b));
      return result.length > 0 ? result : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // plugins/fabric/fabric-view/src/inserts.js
  function setupInserts(app) {
    const { instance, fabricCanvas, fabricLib, syncToolButtonHighlightToMode } = app;
    const addShapeByType = (shapeType) => {
      const center = getDocumentCenter(instance);
      const baseLeft = Math.round(center.x - 60);
      const baseTop = Math.round(center.y - 60);
      let shape = null;
      if (shapeType === "square") {
        shape = new fabricLib.Rect({
          left: baseLeft,
          top: baseTop,
          width: 120,
          height: 120,
          fill: "#14b8a6",
          stroke: "#111827",
          strokeWidth: 2,
          strokeUniform: true,
          cornerRadiusPx: 0
        });
      } else if (shapeType === "round") {
        shape = new fabricLib.Rect({
          left: baseLeft,
          top: baseTop + 10,
          width: 130,
          height: 95,
          rx: 18,
          ry: 18,
          fill: "#0ea5e9",
          stroke: "#111827",
          strokeWidth: 2,
          strokeUniform: true,
          cornerRadiusPx: 18
        });
      } else if (shapeType === "circle") {
        shape = new fabricLib.Circle({
          left: baseLeft,
          top: baseTop,
          radius: 58,
          fill: "#f59e0b",
          stroke: "#111827",
          strokeWidth: 2,
          strokeUniform: true
        });
      } else if (shapeType === "triangle") {
        const points = createRegularPolygonPoints(3, 62);
        shape = new fabricLib.Polygon(points, {
          left: baseLeft,
          top: baseTop + 10,
          originX: "center",
          originY: "center",
          fill: "#8b5cf6",
          stroke: "#111827",
          strokeWidth: 2,
          strokeUniform: true,
          shapeKind: "triangle",
          shapePoints: points,
          cornerRadius: 0
        });
      } else if (shapeType === "star") {
        const points = createStarPoints(62, 28, 5);
        shape = new fabricLib.Polygon(points, {
          left: baseLeft,
          top: baseTop,
          originX: "center",
          originY: "center",
          fill: "#ef4444",
          stroke: "#111827",
          strokeWidth: 2,
          strokeUniform: true,
          shapeKind: "star",
          shapePoints: points,
          cornerRadius: 0
        });
      }
      if (!shape) return;
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      syncToolButtonHighlightToMode();
    };
    const addTableGrid = (cols, rows) => {
      const safeCols = Math.max(1, Math.floor(Number(cols) || 1));
      const safeRows = Math.max(1, Math.floor(Number(rows) || 1));
      const doc = getDocumentSize(instance);
      const tableMaxW = doc.width * 0.8;
      const tableMaxH = doc.height * 0.8;
      const cellH = Math.min(tableMaxW / (safeCols * 3), tableMaxH / safeRows);
      const cellW = 3 * cellH;
      const tableW = safeCols * cellW;
      const tableH = safeRows * cellH;
      const center = getDocumentCenter(instance);
      const groupLeft = center.x - tableW / 2;
      const groupTop = center.y - tableH / 2;
      const bgFill = "#ffffff";
      const gridStroke = "#cbd5e1";
      const gridStrokeWidth = 1;
      const backgroundRect = new fabricLib.Rect({
        left: 0,
        top: 0,
        width: tableW,
        height: tableH,
        fill: bgFill,
        stroke: "#00000000",
        strokeWidth: 0,
        originX: "left",
        originY: "top"
      });
      const lines = [];
      for (let c = 0; c <= safeCols; c++) {
        const x = c * cellW;
        lines.push(new fabricLib.Line([x, 0, x, tableH], {
          stroke: gridStroke,
          strokeWidth: gridStrokeWidth,
          fill: bgFill,
          strokeUniform: true
        }));
      }
      for (let r = 0; r <= safeRows; r++) {
        const y = r * cellH;
        lines.push(new fabricLib.Line([0, y, tableW, y], {
          stroke: gridStroke,
          strokeWidth: gridStrokeWidth,
          fill: bgFill,
          strokeUniform: true
        }));
      }
      const group = new fabricLib.Group([backgroundRect, ...lines], {
        left: groupLeft,
        top: groupTop,
        originX: "left",
        originY: "top",
        // Important: la logique d'ungroup du projet suppose que le groupe est "lié" au canvas.
        canvas: fabricCanvas
      });
      if (typeof group.triggerLayout === "function") {
        group.triggerLayout();
      } else if (typeof group.setCoords === "function") {
        group.setCoords();
      }
      fabricCanvas.add(group);
      fabricCanvas.setActiveObject(group);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      syncToolButtonHighlightToMode();
    };
    const addPhosphorSvg = async (iconName, style = "regular") => {
      if (!iconName || typeof fabricLib.loadSVGFromURL !== "function") return;
      const safeStyle = PHOSPHOR_STYLES.includes(style) ? style : "regular";
      const fileName = getStyleAssetFileName(iconName, safeStyle);
      if (!fileName) return;
      const iconUrl = `https://unpkg.com/@phosphor-icons/core@2.1.1/assets/${safeStyle}/${fileName}`;
      let objects = null;
      let options = null;
      try {
        const result = await fabricLib.loadSVGFromURL(iconUrl);
        if (Array.isArray(result)) {
          objects = result[0];
          options = result[1];
        } else if (result && typeof result === "object") {
          objects = result.objects;
          options = result.options;
        }
      } catch (e) {
        objects = null;
        options = null;
      }
      if (!Array.isArray(objects) || objects.length === 0) {
        await new Promise((resolve) => {
          try {
            fabricLib.loadSVGFromURL(iconUrl, (loadedObjects, loadedOptions) => {
              objects = loadedObjects;
              options = loadedOptions;
              resolve();
            });
          } catch (err) {
            resolve();
          }
        });
      }
      if (!Array.isArray(objects) || objects.length === 0) {
        const center2 = getDocumentCenter(instance);
        const fallback = new fabricLib.Textbox(iconName, {
          left: Math.round(center2.x),
          top: Math.round(center2.y),
          originX: "center",
          originY: "center",
          fontFamily: DEFAULT_TEXT_FONT_FAMILY,
          fontSize: 32,
          fontWeight: 700,
          fill: "#0f172a"
        });
        fabricCanvas.add(fallback);
        fabricCanvas.setActiveObject(fallback);
        fabricCanvas.requestRenderAll();
        updateTopBarForSelection(instance);
        syncToolButtonHighlightToMode();
        return;
      }
      const grouped = fabricLib.util.groupSVGElements(objects, options || {});
      const initialScale = 0.3;
      grouped.set({
        scaleX: initialScale,
        scaleY: initialScale
      });
      grouped.set({
        originX: "center",
        originY: "center",
        centeredScaling: true,
        centeredRotation: true,
        objectCaching: false
      });
      const center = getDocumentCenter(instance);
      grouped.set({
        left: Math.round(center.x),
        top: Math.round(center.y),
        fill: "#0f172a",
        stroke: "#00000000",
        strokeWidth: 0,
        strokeUniform: true,
        iconKind: `phosphor-${safeStyle}`,
        iconName,
        iconStyle: safeStyle
      });
      fabricCanvas.add(grouped);
      fabricCanvas.setActiveObject(grouped);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      syncToolButtonHighlightToMode();
    };
    return { addShapeByType, addTableGrid, addPhosphorSvg };
  }

  // plugins/fabric/fabric-view/src/ui/menus.js
  function setupMenus(app) {
    const { instance, context, fabricCanvas, fabricLib, ui, syncToolButtonHighlightToMode, setToolMode, exitPanMode, addShapeByType, addTableGrid, addPhosphorSvg } = app;
    ui.textBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = "none";
      const docSize = getDocumentSize(instance);
      const text = createDefaultTextbox(fabricLib, docSize.width, docSize.height);
      if (!text) return;
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
      loadWebFontsThenRedraw(fabricCanvas, [text]);
    });
    const shapeMenu = document.createElement("div");
    shapeMenu.style.position = "absolute";
    shapeMenu.style.left = "62px";
    shapeMenu.style.top = "108px";
    shapeMenu.style.display = "none";
    shapeMenu.style.flexDirection = "column";
    shapeMenu.style.gap = "8px";
    shapeMenu.style.padding = "8px";
    shapeMenu.style.background = "#ffffff";
    shapeMenu.style.border = "1px solid #e2e8f0";
    shapeMenu.style.borderRadius = "12px";
    shapeMenu.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.16)";
    shapeMenu.style.zIndex = "25";
    const makeShapeItem = (iconClass, title, type) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = title;
      btn.style.width = "36px";
      btn.style.height = "36px";
      btn.style.border = "1px solid #cbd5e1";
      btn.style.borderRadius = "10px";
      btn.style.background = "#ffffff";
      btn.style.color = "#0f172a";
      btn.style.cursor = "pointer";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      const icon = document.createElement("i");
      icon.className = iconClass;
      icon.style.fontSize = "18px";
      btn.appendChild(icon);
      btn.addEventListener("click", () => {
        addShapeByType(type);
        shapeMenu.style.display = "none";
        if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = "none";
      });
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#f8fafc";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "#ffffff";
      });
      return btn;
    };
    shapeMenu.appendChild(makeShapeItem("ph ph-square", "Carre", "square"));
    shapeMenu.appendChild(makeShapeItem("ph ph-circle", "Cercle", "circle"));
    shapeMenu.appendChild(makeShapeItem("ph ph-triangle", "Triangle", "triangle"));
    shapeMenu.appendChild(makeShapeItem("ph ph-star", "Etoile", "star"));
    ui.root.appendChild(shapeMenu);
    instance.data.shapeMenu = shapeMenu;
    const iconMenu = document.createElement("div");
    iconMenu.style.position = "absolute";
    iconMenu.style.left = "62px";
    iconMenu.style.top = "64px";
    iconMenu.style.display = "none";
    iconMenu.style.flexDirection = "column";
    iconMenu.style.alignItems = "stretch";
    iconMenu.style.gap = "8px";
    iconMenu.style.padding = "10px";
    iconMenu.style.background = "#ffffff";
    iconMenu.style.border = "1px solid #e2e8f0";
    iconMenu.style.borderRadius = "12px";
    iconMenu.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.16)";
    iconMenu.style.zIndex = "25";
    iconMenu.style.width = "198px";
    const styleSelect = document.createElement("select");
    styleSelect.style.height = "32px";
    styleSelect.style.border = "1px solid #cbd5e1";
    styleSelect.style.borderRadius = "8px";
    styleSelect.style.padding = "0 10px";
    styleSelect.style.fontSize = "12px";
    styleSelect.style.outline = "none";
    styleSelect.style.color = "#0f172a";
    styleSelect.style.background = "#ffffff";
    PHOSPHOR_STYLES.forEach((style) => {
      const opt = document.createElement("option");
      opt.value = style;
      opt.textContent = style.charAt(0).toUpperCase() + style.slice(1);
      styleSelect.appendChild(opt);
    });
    iconMenu.appendChild(styleSelect);
    const iconSearch = document.createElement("input");
    iconSearch.type = "text";
    iconSearch.placeholder = "Search icon...";
    iconSearch.autocomplete = "off";
    iconSearch.spellcheck = false;
    iconSearch.style.height = "32px";
    iconSearch.style.border = "1px solid #cbd5e1";
    iconSearch.style.borderRadius = "8px";
    iconSearch.style.padding = "0 10px";
    iconSearch.style.fontSize = "12px";
    iconSearch.style.outline = "none";
    iconSearch.style.color = "#0f172a";
    iconSearch.style.background = "#ffffff";
    iconMenu.appendChild(iconSearch);
    const iconGridScroller = document.createElement("div");
    iconGridScroller.style.maxHeight = "320px";
    iconGridScroller.style.overflowY = "auto";
    iconGridScroller.style.paddingRight = "2px";
    iconMenu.appendChild(iconGridScroller);
    const iconGrid = document.createElement("div");
    iconGrid.style.display = "grid";
    iconGrid.style.gridTemplateColumns = "repeat(4, 36px)";
    iconGrid.style.justifyContent = "space-between";
    iconGrid.style.gap = "8px";
    iconGridScroller.appendChild(iconGrid);
    const iconStatus = document.createElement("div");
    iconStatus.style.fontSize = "11px";
    iconStatus.style.color = "#64748b";
    iconStatus.style.padding = "6px 0";
    iconStatus.style.textAlign = "left";
    iconGridScroller.appendChild(iconStatus);
    let allIconNames = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
    let isLoadingIcons = false;
    let loadedStyle = "";
    let currentIconStyle = "regular";
    const iconClassPrefixByStyle = {
      regular: "ph",
      bold: "ph-bold",
      fill: "ph-fill",
      light: "ph-light",
      thin: "ph-thin",
      duotone: "ph-duotone"
    };
    const makeIconItem = (iconName) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = iconName;
      btn.style.width = "36px";
      btn.style.minWidth = "36px";
      btn.style.height = "36px";
      btn.style.flex = "0 0 auto";
      btn.style.alignSelf = "center";
      btn.style.padding = "0";
      btn.style.appearance = "none";
      btn.style.webkitAppearance = "none";
      btn.style.border = "1px solid #cbd5e1";
      btn.style.borderRadius = "10px";
      btn.style.background = "#ffffff";
      btn.style.color = "#0f172a";
      btn.style.cursor = "pointer";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      const icon = document.createElement("i");
      const styleClass = iconClassPrefixByStyle[currentIconStyle] || "ph";
      icon.className = `${styleClass} ph-${iconName}`;
      icon.style.fontSize = "18px";
      btn.appendChild(icon);
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#f8fafc";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "#ffffff";
      });
      btn.addEventListener("click", () => {
        addPhosphorSvg(iconName, currentIconStyle);
        iconMenu.style.display = "none";
        if (instance.data.bookmarkMenu) instance.data.bookmarkMenu.style.display = "none";
      });
      return btn;
    };
    const renderIconGrid = (filterText = "") => {
      const q = String(filterText || "").trim().toLowerCase();
      iconGrid.innerHTML = "";
      const filtered = q ? allIconNames.filter((name) => name.includes(q)) : allIconNames;
      filtered.forEach((iconName) => iconGrid.appendChild(makeIconItem(iconName)));
      if (isLoadingIcons) {
        iconStatus.textContent = "Loading all icons...";
      } else if (filtered.length === 0) {
        iconStatus.textContent = "No icon found.";
      } else {
        iconStatus.textContent = `${filtered.length} icon${filtered.length > 1 ? "s" : ""}`;
      }
    };
    const ensureAllIconsLoaded = async () => {
      if (isLoadingIcons) return;
      if (loadedStyle === currentIconStyle && allIconNames.length > 0) return;
      isLoadingIcons = true;
      renderIconGrid(iconSearch.value);
      const names = await fetchAllPhosphorIconsByStyle(currentIconStyle);
      allIconNames = Array.isArray(names) && names.length > 0 ? names : [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
      isLoadingIcons = false;
      loadedStyle = currentIconStyle;
      renderIconGrid(iconSearch.value);
    };
    styleSelect.addEventListener("change", () => {
      currentIconStyle = String(styleSelect.value || "regular");
      loadedStyle = "";
      ensureAllIconsLoaded();
    });
    iconSearch.addEventListener("input", () => {
      renderIconGrid(iconSearch.value);
    });
    renderIconGrid("");
    ui.root.appendChild(iconMenu);
    instance.data.iconMenu = iconMenu;
    const BOOKMARK_PANEL_EDGE = 12;
    const bookmarkMenu = document.createElement("div");
    bookmarkMenu.style.position = "absolute";
    bookmarkMenu.style.left = "62px";
    bookmarkMenu.style.display = "none";
    bookmarkMenu.style.flexDirection = "column";
    bookmarkMenu.style.alignItems = "stretch";
    bookmarkMenu.style.gap = "8px";
    bookmarkMenu.style.padding = "10px";
    bookmarkMenu.style.background = "#ffffff";
    bookmarkMenu.style.border = "1px solid #e2e8f0";
    bookmarkMenu.style.borderRadius = "12px";
    bookmarkMenu.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.16)";
    bookmarkMenu.style.zIndex = "25";
    bookmarkMenu.style.width = "198px";
    bookmarkMenu.style.boxSizing = "border-box";
    bookmarkMenu.style.overflow = "hidden";
    const bookmarkSearch = document.createElement("input");
    bookmarkSearch.type = "text";
    bookmarkSearch.placeholder = "Search bookmark...";
    bookmarkSearch.autocomplete = "off";
    bookmarkSearch.spellcheck = false;
    bookmarkSearch.style.height = "32px";
    bookmarkSearch.style.border = "1px solid #cbd5e1";
    bookmarkSearch.style.borderRadius = "8px";
    bookmarkSearch.style.padding = "0 10px";
    bookmarkSearch.style.fontSize = "12px";
    bookmarkSearch.style.outline = "none";
    bookmarkSearch.style.color = "#0f172a";
    bookmarkSearch.style.background = "#ffffff";
    bookmarkSearch.style.boxSizing = "border-box";
    bookmarkSearch.style.width = "100%";
    bookmarkMenu.appendChild(bookmarkSearch);
    const bookmarkScroll = document.createElement("div");
    bookmarkScroll.style.flex = "1";
    bookmarkScroll.style.minHeight = "0";
    bookmarkScroll.style.overflowY = "auto";
    bookmarkScroll.style.overflowX = "hidden";
    bookmarkScroll.style.display = "flex";
    bookmarkScroll.style.flexDirection = "column";
    bookmarkScroll.style.gap = "12px";
    bookmarkScroll.style.paddingRight = "4px";
    bookmarkMenu.appendChild(bookmarkScroll);
    const syncBookmarkMenuPosition = () => {
      const topBarH = ui.topBar ? ui.topBar.offsetHeight : 52;
      bookmarkMenu.style.top = `${topBarH + BOOKMARK_PANEL_EDGE}px`;
      bookmarkMenu.style.bottom = `${BOOKMARK_PANEL_EDGE}px`;
      bookmarkMenu.style.left = "62px";
    };
    const getBookmarkSearchHaystack = (item) => {
      const contributor = String(item && item.contributor != null ? item.contributor : "").trim().toLowerCase();
      const url = String(item && item.image_url ? item.image_url : "").trim();
      let fileName = "";
      try {
        const u = new URL(url, "https://placeholder.local");
        const parts = u.pathname.split("/").filter(Boolean);
        fileName = decodeURIComponent(parts[parts.length - 1] || "").toLowerCase();
      } catch (e) {
        fileName = "";
      }
      return `${contributor} ${fileName} ${url.toLowerCase()}`.trim();
    };
    const renderBookmarksPanel = () => {
      bookmarkScroll.innerHTML = "";
      const list = Array.isArray(instance.data.bookmarksList) ? instance.data.bookmarksList : [];
      const q = String(bookmarkSearch.value || "").trim().toLowerCase();
      const filtered = q ? list.filter((item) => getBookmarkSearchHaystack(item).includes(q)) : list;
      if (list.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "Aucun bookmark";
        empty.style.fontSize = "12px";
        empty.style.color = "#64748b";
        empty.style.padding = "8px 4px";
        empty.style.textAlign = "center";
        bookmarkScroll.appendChild(empty);
        return;
      }
      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "No bookmark found.";
        empty.style.fontSize = "12px";
        empty.style.color = "#64748b";
        empty.style.padding = "8px 4px";
        empty.style.textAlign = "center";
        bookmarkScroll.appendChild(empty);
        return;
      }
      filtered.forEach((item) => {
        const row = document.createElement("button");
        row.type = "button";
        row.style.display = "flex";
        row.style.flexDirection = "column";
        row.style.alignItems = "stretch";
        row.style.width = "100%";
        row.style.flexShrink = "0";
        row.style.padding = "0";
        row.style.border = "1px solid #e2e8f0";
        row.style.borderRadius = "10px";
        row.style.background = "#ffffff";
        row.style.cursor = "pointer";
        row.style.boxSizing = "border-box";
        row.style.overflow = "hidden";
        const img = document.createElement("img");
        img.alt = item.contributor || "";
        img.loading = "lazy";
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.flexShrink = "0";
        img.style.objectFit = "cover";
        img.style.background = "#f1f5f9";
        img.src = item.image_url;
        const footer = document.createElement("div");
        footer.textContent = item.contributor || "\u2014";
        footer.style.flexShrink = "0";
        footer.style.width = "100%";
        footer.style.boxSizing = "border-box";
        footer.style.borderTop = "1px solid #e2e8f0";
        footer.style.background = "#f8fafc";
        footer.style.padding = "8px 10px";
        footer.style.fontSize = "11px";
        footer.style.fontWeight = "500";
        footer.style.color = "#334155";
        footer.style.textAlign = "center";
        footer.style.lineHeight = "1.35";
        footer.style.overflow = "hidden";
        footer.style.textOverflow = "ellipsis";
        footer.style.display = "-webkit-box";
        footer.style.webkitLineClamp = "2";
        footer.style.webkitBoxOrient = "vertical";
        row.appendChild(img);
        row.appendChild(footer);
        row.addEventListener("click", async () => {
          bookmarkMenu.style.display = "none";
          const imageId = await addRasterImageFromUrl(instance, fabricLib, item.image_url, {});
          if (typeof imageId === "string" && imageId.length > 0) {
            instance.publishState("contribution_id", imageId);
            instance.triggerEvent("contribution_added");
          }
        });
        row.addEventListener("mouseenter", () => {
          row.style.background = "#f1f5f9";
          footer.style.background = "#eef2f6";
        });
        row.addEventListener("mouseleave", () => {
          row.style.background = "#ffffff";
          footer.style.background = "#f8fafc";
        });
        bookmarkScroll.appendChild(row);
      });
    };
    bookmarkSearch.addEventListener("input", () => {
      renderBookmarksPanel();
    });
    instance.data.refreshBookmarksPanel = renderBookmarksPanel;
    ui.root.appendChild(bookmarkMenu);
    instance.data.bookmarkMenu = bookmarkMenu;
    const tableMenu = document.createElement("div");
    const TABLE_PANEL_EDGE = BOOKMARK_PANEL_EDGE;
    tableMenu.style.position = "absolute";
    tableMenu.style.left = "62px";
    tableMenu.style.display = "none";
    tableMenu.style.flexDirection = "column";
    tableMenu.style.alignItems = "stretch";
    tableMenu.style.gap = "8px";
    tableMenu.style.padding = "10px";
    tableMenu.style.background = "#ffffff";
    tableMenu.style.border = "1px solid #e2e8f0";
    tableMenu.style.borderRadius = "12px";
    tableMenu.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.16)";
    tableMenu.style.zIndex = "25";
    tableMenu.style.width = "198px";
    tableMenu.style.boxSizing = "border-box";
    tableMenu.style.overflow = "hidden";
    const tableSizeLabel = document.createElement("div");
    tableSizeLabel.style.fontSize = "11px";
    tableSizeLabel.style.color = "#64748b";
    tableSizeLabel.style.padding = "6px 0";
    tableSizeLabel.style.textAlign = "left";
    tableSizeLabel.textContent = "\u2014";
    tableMenu.appendChild(tableSizeLabel);
    const tableGridScroller = document.createElement("div");
    tableGridScroller.style.flex = "1";
    tableGridScroller.style.minHeight = "0";
    tableGridScroller.style.overflowY = "hidden";
    tableGridScroller.style.overflowX = "hidden";
    tableGridScroller.style.display = "flex";
    tableGridScroller.style.flexDirection = "column";
    tableGridScroller.style.paddingRight = "4px";
    tableMenu.appendChild(tableGridScroller);
    const tablePickerGrid = document.createElement("div");
    const GRID_COLS = 10;
    const GRID_ROWS = 15;
    const CELL_GAP_PX = 4;
    const DEFAULT_BG = "#ffffff";
    const DEFAULT_BORDER = "#cbd5e1";
    const ACTIVE_BG = "#eef2ff";
    const ACTIVE_BORDER = "#93c5fd";
    const CELL_SIZE_PX = 14;
    const cellEls = [];
    tablePickerGrid.style.display = "grid";
    tablePickerGrid.style.gap = `${CELL_GAP_PX}px`;
    tablePickerGrid.style.justifyContent = "space-between";
    tablePickerGrid.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${CELL_SIZE_PX}px)`;
    tablePickerGrid.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${CELL_SIZE_PX}px)`;
    tableGridScroller.appendChild(tablePickerGrid);
    const tableGridHeightPx = GRID_ROWS * CELL_SIZE_PX + (GRID_ROWS - 1) * CELL_GAP_PX;
    tableGridScroller.style.height = `${tableGridHeightPx}px`;
    const setAllCellsHoverState = (hoveredIndex) => {
      const hasHover = Number.isFinite(Number(hoveredIndex));
      const idxN = hasHover ? Number(hoveredIndex) : null;
      const hoveredCol = hasHover ? idxN % GRID_COLS : null;
      const hoveredRow = hasHover ? Math.floor(idxN / GRID_COLS) : null;
      cellEls.forEach((el) => {
        const idx = Number(el.dataset.tableIndex || 0);
        const col = idx % GRID_COLS;
        const row = Math.floor(idx / GRID_COLS);
        const active = hasHover && col <= hoveredCol && row <= hoveredRow;
        el.style.background = active ? ACTIVE_BG : DEFAULT_BG;
        el.style.borderColor = active ? ACTIVE_BORDER : DEFAULT_BORDER;
      });
    };
    const syncTableMenuPosition = () => {
      const topBarH = ui.topBar ? ui.topBar.offsetHeight : 52;
      tableMenu.style.top = `${topBarH + TABLE_PANEL_EDGE}px`;
      tableMenu.style.bottom = "auto";
      tableMenu.style.left = "62px";
    };
    for (let r = 1; r <= GRID_ROWS; r++) {
      for (let c = 1; c <= GRID_COLS; c++) {
        const cell = document.createElement("div");
        const index = (r - 1) * GRID_COLS + (c - 1);
        cell.dataset.tableIndex = String(index);
        cell.style.width = `${CELL_SIZE_PX}px`;
        cell.style.height = `${CELL_SIZE_PX}px`;
        cell.style.border = "1px solid transparent";
        cell.style.borderColor = DEFAULT_BORDER;
        cell.style.borderRadius = "3px";
        cell.style.background = DEFAULT_BG;
        cell.style.cursor = "pointer";
        cell.style.boxSizing = "border-box";
        cell.addEventListener("mouseenter", () => {
          tableSizeLabel.textContent = `${c} x ${r}`;
          setAllCellsHoverState(index);
        });
        cell.addEventListener("click", () => {
          tableMenu.style.display = "none";
          addTableGrid(c, r);
        });
        tablePickerGrid.appendChild(cell);
        cellEls.push(cell);
      }
    }
    tablePickerGrid.addEventListener("mouseleave", () => setAllCellsHoverState(null));
    ui.root.appendChild(tableMenu);
    instance.data.tableMenu = tableMenu;
    const closeFloatingMenus = () => {
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      tableMenu.style.display = "none";
    };
    ui.shapeBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      shapeMenu.style.display = shapeMenu.style.display === "none" ? "flex" : "none";
    });
    ui.iconBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      shapeMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      const willOpen = iconMenu.style.display === "none";
      iconMenu.style.display = willOpen ? "flex" : "none";
      if (willOpen) {
        ensureAllIconsLoaded();
        iconSearch.focus();
      }
    });
    ui.tableBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      const willOpen = tableMenu.style.display === "none";
      tableMenu.style.display = willOpen ? "flex" : "none";
      if (willOpen) {
        syncTableMenuPosition();
        setAllCellsHoverState(null);
      } else {
        setAllCellsHoverState(null);
      }
    });
    ui.penBtn.addEventListener("click", (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      exitPanMode();
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      const nextMode = instance.data.toolMode === "draw" ? "select" : "draw";
      setToolMode(nextMode);
    });
    ui.panBtn.addEventListener("click", (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      const nextMode = instance.data.toolMode === "pan" ? "select" : "pan";
      setToolMode(nextMode);
    });
    const imageFileInput = document.createElement("input");
    imageFileInput.type = "file";
    imageFileInput.accept = "image/*";
    imageFileInput.setAttribute("aria-hidden", "true");
    imageFileInput.tabIndex = -1;
    imageFileInput.style.position = "absolute";
    imageFileInput.style.width = "0";
    imageFileInput.style.height = "0";
    imageFileInput.style.opacity = "0";
    imageFileInput.style.pointerEvents = "none";
    ui.root.appendChild(imageFileInput);
    imageFileInput.addEventListener("change", async () => {
      const file = imageFileInput.files && imageFileInput.files[0];
      imageFileInput.value = "";
      try {
        await insertImageFileOnCanvas(instance, fabricLib, context, file, { logTag: "[FabricView image picker]" });
      } finally {
        syncToolButtonHighlightToMode();
      }
    });
    ui.imageBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      imageFileInput.click();
    });
    ui.bookmarkBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      const willOpen = bookmarkMenu.style.display === "none";
      if (willOpen) {
        syncBookmarkMenuPosition();
        renderBookmarksPanel();
        bookmarkMenu.style.display = "flex";
        bookmarkSearch.focus();
      } else {
        bookmarkMenu.style.display = "none";
      }
    });
    if (ui.alignToolbar) {
      ui.alignToolbar.querySelectorAll("button[data-align-mode]").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          const mode = btn.getAttribute("data-align-mode");
          if (!mode) return;
          alignSelectionToDocument(instance, fabricCanvas, mode);
        });
      });
    }
    return { shapeMenu, iconMenu, bookmarkMenu, tableMenu, closeFloatingMenus, renderBookmarksPanel };
  }

  // plugins/fabric/fabric-view/src/zoom.js
  function setupZoomAndNav(app) {
    const { instance, fabricCanvas, ui, setToolMode, exitPanMode, closeFloatingMenus } = app;
    const updateZoomButtons = () => {
      const z = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
      ui.zoomOutBtn.disabled = z <= 0.1;
      ui.zoomInBtn.disabled = z >= 8;
      ui.zoomOutBtn.style.opacity = ui.zoomOutBtn.disabled ? "0.45" : "1";
      ui.zoomInBtn.style.opacity = ui.zoomInBtn.disabled ? "0.45" : "1";
      ui.zoomOutBtn.style.cursor = ui.zoomOutBtn.disabled ? "default" : "pointer";
      ui.zoomInBtn.style.cursor = ui.zoomInBtn.disabled ? "default" : "pointer";
    };
    const applyZoomDelta = (delta) => {
      const current = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
      const next = Math.max(0.1, Math.min(8, current + delta));
      if (next === current) return;
      instance.data.zoomScale = next;
      ensureCanvasSize(instance);
      updateZoomButtons();
    };
    const applyZoomAtViewerPoint = (nextZoomScale, clientX, clientY) => {
      const clampedZoom = Math.max(0.1, Math.min(8, Number(nextZoomScale) || 1));
      const viewport = instance.data.viewport || {};
      const currentScale = Math.max(1e-6, Number(viewport.scale) || 1);
      const currentOffsetX = Number(viewport.offsetX) || 0;
      const currentOffsetY = Number(viewport.offsetY) || 0;
      const boardRect = ui.board.getBoundingClientRect();
      const viewerX = (Number(clientX) || 0) - boardRect.left;
      const viewerY = (Number(clientY) || 0) - boardRect.top;
      const docX = (viewerX - currentOffsetX) / currentScale;
      const docY = (viewerY - currentOffsetY) / currentScale;
      instance.data.zoomScale = clampedZoom;
      const boardW = Math.max(Number(ui.board.clientWidth) || 1, 1);
      const boardH = Math.max(Number(ui.board.clientHeight) || 1, 1);
      const doc = getDocumentSize(instance);
      const margin = Math.max(0, Number(ARTBOARD_VIEWER_MARGIN_PX) || 0);
      const fitAreaWidth = Math.max(1, boardW - margin * 2);
      const fitAreaHeight = Math.max(1, boardH - margin * 2);
      const fit = computeFit(fitAreaWidth, fitAreaHeight, doc.width, doc.height);
      const nextScale = fit.scale * clampedZoom;
      const baseOffsetX = (boardW - doc.width * nextScale) / 2;
      const baseOffsetY = (boardH - doc.height * nextScale) / 2;
      instance.data.panX = viewerX - docX * nextScale - baseOffsetX;
      instance.data.panY = viewerY - docY * nextScale - baseOffsetY;
      ensureCanvasSize(instance);
      updateZoomButtons();
    };
    ui.zoomOutBtn.addEventListener("click", () => {
      exitPanMode();
      closeFloatingMenus();
      applyZoomDelta(-0.1);
    });
    ui.zoomInBtn.addEventListener("click", () => {
      exitPanMode();
      closeFloatingMenus();
      applyZoomDelta(0.1);
    });
    ui.fitBtn.addEventListener("click", () => {
      exitPanMode();
      closeFloatingMenus();
      instance.data.zoomScale = 1;
      instance.data.panX = 0;
      instance.data.panY = 0;
      ensureCanvasSize(instance);
      updateZoomButtons();
    });
    ui.artboardPrevBtn.addEventListener("click", () => {
      if (ui.artboardPrevBtn.disabled) return;
      exitPanMode();
      setToolMode("select");
      closeFloatingMenus();
      const i = instance.data.activeArtboardIndex ?? 0;
      if (i <= 0) return;
      goToArtboard(instance, i - 1).then(() => {
        updateTopBarForSelection(instance);
        publishCanvasJson(instance, { silent: true });
      });
    });
    ui.artboardNextBtn.addEventListener("click", () => {
      if (ui.artboardNextBtn.disabled) return;
      exitPanMode();
      setToolMode("select");
      closeFloatingMenus();
      const i = instance.data.activeArtboardIndex ?? 0;
      if (i >= 2) return;
      goToArtboard(instance, i + 1).then(() => {
        updateTopBarForSelection(instance);
        publishCanvasJson(instance, { silent: true });
      });
    });
    ui.artboardDownloadBtn.addEventListener("click", () => {
      exitPanMode();
      setToolMode("select");
      closeFloatingMenus();
      void triggerFoldedA4PdfDownload(instance);
    });
    updateZoomButtons();
    fabricCanvas.on("mouse:wheel", (event) => {
      const e = event && event.e ? event.e : null;
      if (!e) return;
      e.preventDefault();
      e.stopPropagation();
      const current = Math.max(0.1, Math.min(8, Number(instance.data.zoomScale) || 1));
      const delta = Number(e.deltaY) || 0;
      if (delta === 0) return;
      const factor = delta > 0 ? 0.92 : 1.08;
      const next = Math.max(0.1, Math.min(8, current * factor));
      if (next === current) return;
      applyZoomAtViewerPoint(next, e.clientX, e.clientY);
    });
    return { updateZoomButtons, applyZoomDelta, applyZoomAtViewerPoint };
  }

  // plugins/fabric/fabric-view/src/commands.js
  function finalizeCanvasMutation(instance) {
    const fabricCanvas = instance && instance.data ? instance.data.fabricCanvas : null;
    if (!fabricCanvas) return;
    fabricCanvas.requestRenderAll();
    publishCanvasJson(instance);
    updateTopBarForSelection(instance);
  }
  function applyCommand(instance, command) {
    if (!instance || !instance.data || !command || !command.props) return;
    const fabricCanvas = instance.data.fabricCanvas;
    if (!fabricCanvas) return;
    const targets = Array.isArray(command.targets) ? command.targets : getToolbarStyleTargets(fabricCanvas);
    if (targets.length === 0) return;
    const activeObject = fabricCanvas.getActiveObject();
    const textTargets = [];
    targets.forEach((target) => {
      if (!target || typeof target.set !== "function") return;
      const patch = command.normalizePatch ? command.normalizePatch(target, { ...command.props }) : { ...command.props };
      if (!patch) return;
      target.set(patch);
      target.dirty = true;
      if (isTextLikeObject(target)) {
        if (typeof target.initDimensions === "function") target.initDimensions();
        textTargets.push(target);
      }
      if (typeof target.setCoords === "function") target.setCoords();
      relayoutParentGroups(target);
    });
    if (isFabricGroupObject(activeObject)) {
      activeObject.set("dirty", true);
      if (typeof activeObject.triggerLayout === "function") {
        activeObject.triggerLayout();
      } else if (typeof activeObject.setCoords === "function") {
        activeObject.setCoords();
      }
    }
    finalizeCanvasMutation(instance);
    if (textTargets.length > 0 && (command.props.fontFamily != null || command.props.fontSize != null)) {
      loadWebFontsThenRedraw(fabricCanvas, textTargets);
    }
  }
  function applyTextCommand(instance, targets, props) {
    const textTargets = (Array.isArray(targets) ? targets : []).filter((t) => isTextLikeObject(t));
    if (textTargets.length === 0) return;
    applyCommand(instance, { targets: textTargets, props });
  }
  function applyStyleToSelection(instance, patch) {
    applyCommand(instance, {
      props: patch,
      normalizePatch: (target, nextPatch) => {
        if (nextPatch.stroke != null || nextPatch.strokeWidth != null) {
          nextPatch.strokeUniform = true;
        }
        const nextStrokeColor = typeof nextPatch.stroke === "string" ? nextPatch.stroke : typeof target.stroke === "string" ? target.stroke : "";
        const hasVisibleStrokeColor = !shouldZeroStrokeWidth(nextStrokeColor);
        const currentStrokeWidth = Number.isFinite(Number(target.strokeWidth)) ? Number(target.strokeWidth) : 0;
        if (nextPatch.stroke != null && hasVisibleStrokeColor && nextPatch.strokeWidth == null && currentStrokeWidth <= 0) {
          nextPatch.strokeWidth = 1;
        }
        if (isTextLikeObject(target) && (nextPatch.stroke != null || nextPatch.strokeWidth != null)) {
          const nextStrokeWidth = nextPatch.strokeWidth != null ? Number(nextPatch.strokeWidth) : currentStrokeWidth;
          const wantsTransparentStroke = shouldZeroStrokeWidth(nextStrokeColor);
          if (wantsTransparentStroke) {
            nextPatch.strokeWidth = 0;
          } else if (!Number.isFinite(nextStrokeWidth) || nextStrokeWidth <= 0) {
            nextPatch.strokeWidth = 1;
          }
          if (nextPatch.stroke == null && !wantsTransparentStroke) {
            const currentStroke = typeof target.stroke === "string" ? target.stroke.trim() : "";
            if (!currentStroke || currentStroke === "#00000000" || currentStroke.toLowerCase() === "transparent") {
              nextPatch.stroke = "#000000";
            }
          }
          nextPatch.paintFirst = "stroke";
          nextPatch.strokeLineJoin = "round";
        }
        if (isFabricRasterImage(target) && nextPatch.fill != null) {
          delete nextPatch.fill;
        }
        return nextPatch;
      }
    });
  }

  // plugins/fabric/fabric-view/src/ui/toolbar-inputs.js
  function setupToolbarInputs(app) {
    const { instance, fabricCanvas, fabricLib, ui, applyPenBrush } = app;
    ui.fillControl.setHandlers({
      onPresetSelect: (color) => {
        applyStyleToSelection(instance, { fill: normalizeCanvasColor(color, "#111827") });
      },
      onCustomSelect: (hex) => {
        const color = normalizeCanvasColor(hex, "#111827");
        instance.publishState("new_color", color);
        instance.triggerEvent("new_color_selected");
        applyStyleToSelection(instance, { fill: color });
      }
    });
    ui.strokeControl.setHandlers({
      onPresetSelect: (color) => {
        if (instance.data.toolMode === "draw") {
          instance.data.penColor = normalizeCanvasColor(color, "#111827");
          applyPenBrush();
          updateTopBarForSelection(instance);
          return;
        }
        const target = fabricCanvas.getActiveObject();
        if (!target) return;
        const normalizedStroke = normalizeCanvasColor(color, "#000000");
        const patch = { stroke: normalizedStroke };
        const styleTargets = getToolbarStyleTargets(fabricCanvas);
        const needsTextStrokeDefault = styleTargets.some(
          (t) => isTextLikeObject(t) && Number(t.strokeWidth || 0) <= 0
        );
        if (shouldZeroStrokeWidth(normalizedStroke)) {
          patch.strokeWidth = 0;
          ui.strokeWidthInput.value = "0";
        } else if (needsTextStrokeDefault) {
          patch.strokeWidth = 1;
          ui.strokeWidthInput.value = "1";
        }
        applyStyleToSelection(instance, patch);
      },
      onCustomSelect: (hex) => {
        if (instance.data.toolMode === "draw") {
          const color2 = normalizeCanvasColor(hex, "#111827");
          instance.data.penColor = color2;
          applyPenBrush();
          instance.publishState("new_color", color2);
          instance.triggerEvent("new_color_selected");
          updateTopBarForSelection(instance);
          return;
        }
        const target = fabricCanvas.getActiveObject();
        if (!target) return;
        const color = normalizeCanvasColor(hex, "#000000");
        const patch = { stroke: color };
        const styleTargets = getToolbarStyleTargets(fabricCanvas);
        const needsTextStrokeDefault = styleTargets.some(
          (t) => isTextLikeObject(t) && Number(t.strokeWidth || 0) <= 0
        );
        if (shouldZeroStrokeWidth(color)) {
          patch.strokeWidth = 0;
          ui.strokeWidthInput.value = "0";
        } else if (needsTextStrokeDefault) {
          patch.strokeWidth = 1;
          ui.strokeWidthInput.value = "1";
        }
        instance.publishState("new_color", color);
        instance.triggerEvent("new_color_selected");
        applyStyleToSelection(instance, patch);
      }
    });
    ui.strokeWidthInput.addEventListener("input", () => {
      const strokeWidth = Math.max(0, Math.min(50, Number(ui.strokeWidthInput.value || 0)));
      if (instance.data.toolMode === "draw") {
        instance.data.penWidth = Math.max(1, strokeWidth);
        applyPenBrush();
        updateTopBarForSelection(instance);
        return;
      }
      applyStyleToSelection(instance, { strokeWidth });
    });
    ui.opacityInput.addEventListener("input", () => {
      const pct = Math.max(0, Math.min(100, Number(ui.opacityInput.value || 0)));
      applyStyleToSelection(instance, { opacity: pct / 100 });
    });
    ui.radiusInput.addEventListener("input", () => {
      const active = fabricCanvas.getActiveObject();
      if (!active) return;
      const targets = getToolbarStyleTargets(fabricCanvas);
      if (targets.length === 0) return;
      const radius = Math.max(0, Math.min(200, Number(ui.radiusInput.value || 0)));
      const updated = [];
      targets.forEach((target) => {
        if (isRoundedPolygonShape(target)) {
          const replacement = replaceRoundedPolygon(instance, target, radius, fabricLib);
          if (replacement) {
            replacement.cornerRadiusPx = radius;
            updated.push(replacement);
          }
          return;
        }
        if (isFabricRasterImage(target)) {
          applyImageCornerRadiusPx(target, fabricLib, radius);
          if (typeof target.setCoords === "function") target.setCoords();
          updated.push(target);
          return;
        }
        if (target.type === "rect") {
          applyRectCornerRadiusPx(target, radius);
        } else if (Number.isFinite(Number(target.rx))) {
          target.set({ rx: radius, ry: radius });
        } else {
          return;
        }
        if (typeof target.setCoords === "function") target.setCoords();
        updated.push(target);
      });
      if (updated.length === 0) return;
      updated.forEach((target) => relayoutParentGroups(target));
      if (isSelectionContainer(active) && updated.length > 1) {
        const selection = new fabricLib.ActiveSelection(updated, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(selection);
      } else if (isFabricGroupObject(active)) {
        if (typeof active.triggerLayout === "function") active.triggerLayout();
        fabricCanvas.setActiveObject(active);
      } else if (updated.length === 1) {
        fabricCanvas.setActiveObject(updated[0]);
      }
      finalizeCanvasMutation(instance);
    });
    const applyFontSizeFromInput = (commit) => {
      const targets = getToolbarStyleTargets(fabricCanvas).filter((item) => isTextLikeObject(item));
      if (targets.length === 0) return;
      const raw = Number(ui.fontSizeInput.value);
      if (!Number.isFinite(raw) || raw <= 0) return;
      const fontSize = Math.max(1, Math.min(400, raw));
      if (!commit && fontSize < 8) return;
      applyTextCommand(instance, targets, { fontSize });
    };
    ui.fontSizeInput.addEventListener("input", (event) => applyFontSizeFromInput(!(event && event.isTrusted)));
    ui.fontSizeInput.addEventListener("change", () => applyFontSizeFromInput(true));
    ui.fontFamilySelect.addEventListener("change", () => {
      const nextFamily = ui.fontFamilySelect.value;
      if (!nextFamily) return;
      const targets = getToolbarStyleTargets(fabricCanvas).filter((item) => isTextLikeObject(item));
      applyTextCommand(instance, targets, { fontFamily: nextFamily });
    });
    return {};
  }

  // plugins/fabric/fabric-view/src/events.js
  function wireCanvasEvents(app) {
    const { instance, context, fabricCanvas, fabricLib, ui, shapeMenu, iconMenu, bookmarkMenu, tableMenu } = app;
    if (instance.data._eventsWired === true) return;
    instance.data._eventsWired = true;
    const onSelectionChanged = () => {
      updateTopBarForSelection(instance);
    };
    const onSelectionCleared = () => {
      onSelectionChanged();
      requestAnimationFrame(() => {
        if (!fabricCanvas) return;
        fabricCanvas.getObjects().forEach((obj) => {
          if (!obj || obj.isArtboard || obj.isSafeZone) return;
          if (isFabricGroupObject(obj) || isSelectionContainer(obj)) return;
          if (typeof obj.set === "function") {
            obj.set({ selectable: true, evented: true });
          }
        });
      });
    };
    fabricCanvas.on("selection:created", onSelectionChanged);
    fabricCanvas.on("selection:updated", onSelectionChanged);
    fabricCanvas.on("selection:cleared", onSelectionCleared);
    fabricCanvas.on("mouse:down", (opt) => {
      instance.data._canvasPointerGestureId = (Number(instance.data._canvasPointerGestureId) || 0) + 1;
      instance.data.altKeyAtMouseDown = false;
      instance.data._altDupDownClientX = null;
      instance.data._altDupDownClientY = null;
      if (instance.data.toolMode === "pan" || instance.data.toolMode === "draw") return;
      const t = opt.target;
      if (!t || t.isArtboard || t.isSafeZone) return;
      const active = fabricCanvas.getActiveObject();
      if (!active) return;
      if (!isPartOfActiveObject(active, t)) return;
      instance.data.altKeyAtMouseDown = !!opt.e.altKey;
      if (opt.e && instance.data.altKeyAtMouseDown) {
        instance.data._altDupDownClientX = Number(opt.e.clientX) || 0;
        instance.data._altDupDownClientY = Number(opt.e.clientY) || 0;
      }
    });
    fabricCanvas.on("object:moving", (e) => {
      if (instance.data.toolMode === "pan" || instance.data.toolMode === "draw") return;
      if (!instance.data.altKeyAtMouseDown) return;
      const gid = Number(instance.data._canvasPointerGestureId) || 0;
      if (Number.isFinite(instance.data._altDupClonedGestureId) && instance.data._altDupClonedGestureId === gid) {
        return;
      }
      if (instance.data._altDuplicateDone) return;
      performAltDuplicateDrag(instance, fabricCanvas, e);
    });
    fabricCanvas.on("mouse:down", (event) => {
      if (instance.data.toolMode !== "pan") return;
      const e = event && event.e ? event.e : null;
      if (!e) return;
      instance.data.isPanning = true;
      instance.data.panLastClientX = Number(e.clientX) || 0;
      instance.data.panLastClientY = Number(e.clientY) || 0;
      ui.board.style.cursor = "grabbing";
    });
    fabricCanvas.on("mouse:down", (event) => {
      if (instance.data.toolMode === "pan") return;
      const target = event && event.target ? event.target : null;
      const clickedArtboard = !!(target && target.isArtboard);
      const clickedEmpty = !target || clickedArtboard;
      if (!clickedEmpty) return;
      if (!fabricCanvas.getActiveObject()) return;
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
      updateTopBarForSelection(instance);
    });
    fabricCanvas.on("mouse:move", (event) => {
      if (instance.data.toolMode !== "pan" || !instance.data.isPanning) return;
      const e = event && event.e ? event.e : null;
      if (!e) return;
      const currentX = Number(e.clientX) || 0;
      const currentY = Number(e.clientY) || 0;
      const deltaX = currentX - (Number(instance.data.panLastClientX) || 0);
      const deltaY = currentY - (Number(instance.data.panLastClientY) || 0);
      instance.data.panLastClientX = currentX;
      instance.data.panLastClientY = currentY;
      instance.data.panX = (Number(instance.data.panX) || 0) + deltaX;
      instance.data.panY = (Number(instance.data.panY) || 0) + deltaY;
      ensureCanvasSize(instance);
    });
    fabricCanvas.on("mouse:up", () => {
      if (!instance.data.isPanning) return;
      instance.data.isPanning = false;
      ui.board.style.cursor = instance.data.toolMode === "pan" ? "grab" : "";
    });
    const onWindowPointerUp = () => {
      instance.data.altKeyAtMouseDown = false;
      instance.data._altDuplicateDone = false;
    };
    window.addEventListener("pointerup", onWindowPointerUp, true);
    instance.data._altDupWindowPointerUp = onWindowPointerUp;
    fabricCanvas.on("mouse:up", () => {
      instance.data.altKeyAtMouseDown = false;
      instance.data._altDuplicateDone = false;
    });
    const dragHasFiles = (e) => {
      if (!e || !e.dataTransfer) return false;
      return Array.from(e.dataTransfer.types || []).includes("Files");
    };
    const setDropHighlight = (active) => {
      ui.board.style.outline = active ? "2px dashed #2563eb" : "";
      ui.board.style.outlineOffset = active ? "-2px" : "";
    };
    ui.board.addEventListener("dragover", (e) => {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDropHighlight(true);
    });
    ui.board.addEventListener("dragleave", (e) => {
      if (e.relatedTarget && ui.board.contains(e.relatedTarget)) return;
      setDropHighlight(false);
    });
    ui.board.addEventListener("drop", async (e) => {
      setDropHighlight(false);
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files || []).filter((f) => String(f.type || "").toLowerCase().startsWith("image/"));
      if (!files.length) return;
      const point = typeof fabricCanvas.getScenePoint === "function" ? fabricCanvas.getScenePoint(e) : null;
      const bubbleContext = instance.data && instance.data.bubbleContext || context;
      for (const file of files) {
        await insertImageFileOnCanvas(instance, fabricLib, bubbleContext, file, {
          position: point ? { x: point.x, y: point.y } : void 0,
          logTag: "[FabricView drop]"
        });
      }
    });
    fabricCanvas.on("object:scaling", (event) => {
      const target = event && event.target ? event.target : null;
      const transform = event && event.transform ? event.transform : null;
      if (!target || !isShapeObject(target) || !transform) return;
      applyStrokeUniformDeep(target);
      const original = transform.original && typeof transform.original === "object" ? transform.original : null;
      if (isCornerControl(transform.corner)) {
        const opposite = oppositeOriginForCorner(transform.corner);
        if (!opposite || typeof target.getPointByOrigin !== "function" || typeof target.setPositionByOrigin !== "function") {
          return;
        }
        const anchorPoint = target.getPointByOrigin(opposite.x, opposite.y);
        const sx = Number.isFinite(Number(target.scaleX)) ? Number(target.scaleX) : 1;
        const sy = Number.isFinite(Number(target.scaleY)) ? Number(target.scaleY) : 1;
        const signX = sx < 0 ? -1 : 1;
        const signY = sy < 0 ? -1 : 1;
        const baseX = Number.isFinite(Number(original && original.scaleX)) ? Math.abs(Number(original.scaleX)) : Math.abs(sx);
        const baseY = Number.isFinite(Number(original && original.scaleY)) ? Math.abs(Number(original.scaleY)) : Math.abs(sy);
        const safeBaseX = Math.max(baseX, 1e-6);
        const safeBaseY = Math.max(baseY, 1e-6);
        const factorX = Math.abs(sx) / safeBaseX;
        const factorY = Math.abs(sy) / safeBaseY;
        const uniformFactor = Math.max(factorX, factorY);
        target.set({
          scaleX: signX * safeBaseX * uniformFactor,
          scaleY: signY * safeBaseY * uniformFactor
        });
        target.setPositionByOrigin(anchorPoint, opposite.x, opposite.y);
      }
      if (target.type === "rect") {
        const lockedRadiusPx = original && Number.isFinite(Number(original.cornerRadiusPx)) ? Math.max(0, Number(original.cornerRadiusPx)) : getRectCornerRadiusPx(target);
        applyRectCornerRadiusPx(target, lockedRadiusPx);
      }
      if (isFabricRasterImage(target) && Number.isFinite(Number(target.cornerRadiusPx)) && Number(target.cornerRadiusPx) > 0) {
        const lockedPx = original && Number.isFinite(Number(original.cornerRadiusPx)) ? Math.max(0, Number(original.cornerRadiusPx)) : Math.max(0, Number(target.cornerRadiusPx));
        applyImageCornerRadiusPx(target, fabricLib, lockedPx);
      }
      if (original && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
        const sxFinal = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
        const syFinal = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
        const baseScaleX = Math.max(Math.abs(Number(original.scaleX) || 1), 1e-6);
        const baseScaleY = Math.max(Math.abs(Number(original.scaleY) || 1), 1e-6);
        const baseRadiusPx = Number.isFinite(Number(original.cornerRadiusPx)) ? Math.max(0, Number(original.cornerRadiusPx)) : (() => {
          const baseCorner = Number.isFinite(Number(original.cornerRadius)) ? Number(original.cornerRadius) : Number(target.cornerRadius);
          return Math.max(0, Number(baseCorner) || 0) * Math.min(baseScaleX, baseScaleY);
        })();
        target.cornerRadiusPx = baseRadiusPx;
        target.cornerRadius = Math.max(0, baseRadiusPx / Math.min(sxFinal, syFinal));
      }
      if (typeof target.setCoords === "function") target.setCoords();
    });
    fabricCanvas.on("object:added", (event) => {
      const target = event && event.target ? event.target : null;
      if (target && (target.isArtboard || target.isSafeZone)) return;
      if (target && typeof target.set === "function" && "strokeWidth" in target) {
        target.set({ strokeUniform: true });
      }
      syncGuideLayers(instance);
      schedulePublishCanvasJson(instance);
    });
    fabricCanvas.on("object:modified", (event) => {
      let target = event && event.target ? event.target : null;
      normalizeObjectScale(target);
      if (target && target.type === "rect" && Number.isFinite(Number(target.rx)) && Number.isFinite(Number(target.ry))) {
        const lockedRadiusPx = getRectCornerRadiusPx(target);
        applyRectCornerRadiusPx(target, lockedRadiusPx);
      }
      if (target && isFabricRasterImage(target) && Number.isFinite(Number(target.cornerRadiusPx)) && Number(target.cornerRadiusPx) > 0) {
        applyImageCornerRadiusPx(target, instance.data.fabricLib, Number(target.cornerRadiusPx));
      }
      if (target && isRoundedPolygonShape(target) && Number.isFinite(Number(target.cornerRadius))) {
        if (!Number.isFinite(Number(target.cornerRadiusPx))) {
          const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
          const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
          target.cornerRadiusPx = Math.max(0, Number(target.cornerRadius) || 0) * Math.min(sx, sy);
        }
        const replacement = replaceRoundedPolygon(instance, target, Number(target.cornerRadius), fabricLib);
        if (replacement) {
          replacement.cornerRadiusPx = target.cornerRadiusPx;
          target = replacement;
          fabricCanvas.setActiveObject(replacement);
        }
      }
      if (target && typeof target.setCoords === "function") {
        target.setCoords();
      }
      syncGuideLayers(instance);
      fabricCanvas.requestRenderAll();
      schedulePublishCanvasJson(instance);
      updateTopBarForSelection(instance);
    });
    fabricCanvas.on("object:removed", () => {
      syncGuideLayers(instance);
      schedulePublishCanvasJson(instance);
    });
    fabricCanvas.on("path:created", () => {
      const path = fabricCanvas.getActiveObject();
      if (path && path.type === "path") {
        const points = extractPathPoints(path);
        if (points.length >= 3) {
          const smoothedPathData = buildSmoothFreehandPath(points, 0.45);
          if (smoothedPathData) {
            const smoothed = new fabricLib.Path(smoothedPathData, {
              left: path.left,
              top: path.top,
              angle: path.angle,
              scaleX: path.scaleX,
              scaleY: path.scaleY,
              originX: path.originX,
              originY: path.originY,
              fill: "",
              stroke: path.stroke,
              strokeWidth: path.strokeWidth,
              strokeUniform: true,
              strokeLineCap: "round",
              strokeLineJoin: "round"
            });
            const objects = fabricCanvas.getObjects();
            const index = objects.indexOf(path);
            fabricCanvas.remove(path);
            if (index >= 0) fabricCanvas.insertAt(index, smoothed);
            else fabricCanvas.add(smoothed);
            fabricCanvas.setActiveObject(smoothed);
          }
        } else if (typeof path.set === "function") {
          path.set({
            strokeLineCap: "round",
            strokeLineJoin: "round"
          });
        }
      }
      syncGuideLayers(instance);
      schedulePublishCanvasJson(instance);
      updateTopBarForSelection(instance);
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!target) return;
      const clickedShapeTrigger = ui.shapeBtn.contains(target);
      const clickedMenu = shapeMenu.contains(target);
      const clickedIconTrigger = ui.iconBtn.contains(target);
      const clickedIconMenu = iconMenu.contains(target);
      const clickedBookmarkTrigger = ui.bookmarkBtn.contains(target);
      const clickedBookmarkMenu = bookmarkMenu.contains(target);
      const clickedTableTrigger = ui.tableBtn.contains(target);
      const clickedTableMenu = tableMenu.contains(target);
      if (clickedShapeTrigger || clickedMenu || clickedIconTrigger || clickedIconMenu || clickedBookmarkTrigger || clickedBookmarkMenu || clickedTableTrigger || clickedTableMenu) return;
      shapeMenu.style.display = "none";
      iconMenu.style.display = "none";
      bookmarkMenu.style.display = "none";
      tableMenu.style.display = "none";
    }, true);
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => ensureCanvasSize(instance));
      observer.observe(ui.board);
      instance.data.resizeObserver = observer;
    }
    const onDocumentPaste = (e) => {
      void handleClipboardPasteEvent(e, instance, fabricLib, context);
    };
    document.addEventListener("paste", onDocumentPaste, true);
    instance.data.documentPasteHandler = onDocumentPaste;
    const onDocumentCopy = (e) => {
      if (!e || !fabricCanvas) return;
      if (shouldBlockFabricCopyShortcut(e.target, fabricCanvas)) return;
      if (!fabricCanvas.getActiveObject()) return;
      const targets = getActiveSelectionTargets(fabricCanvas).filter(
        (o) => o && !o.isArtboard && !o.isSafeZone
      );
      const json = buildFabricClipboardJsonString(targets);
      if (!json || !e.clipboardData) return;
      e.preventDefault();
      e.clipboardData.setData("text/plain", json);
    };
    document.addEventListener("copy", onDocumentCopy, true);
    instance.data.documentCopyHandler = onDocumentCopy;
    return {};
  }

  // plugins/fabric/fabric-view/src/app.js
  function initializeFabricView(instance, context) {
    const fabricLib = resolveFabric();
    ensureFabricImageIdSerialization(fabricLib);
    const ui = buildShell();
    ensureFabricViewPdfSpinStyle();
    instance.data.ui = ui;
    instance.data.fabricLib = fabricLib;
    instance.data.bubbleContext = context || null;
    const initialPreset = ARTBOARD_PRESETS[0];
    instance.data.canvasWidth = initialPreset.width;
    instance.data.canvasHeight = initialPreset.height;
    instance.data.viewport = {
      docW: initialPreset.width,
      docH: initialPreset.height,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      zoomScale: 1,
      panX: 0,
      panY: 0
    };
    instance.canvas.append(ui.root);
    if (!fabricLib || typeof fabricLib.Canvas !== "function") {
      const errorBox = document.createElement("div");
      errorBox.textContent = "Fabric.js v6 is not loaded.";
      errorBox.style.position = "absolute";
      errorBox.style.top = "12px";
      errorBox.style.left = "12px";
      errorBox.style.padding = "8px 10px";
      errorBox.style.fontSize = "12px";
      errorBox.style.color = "#991b1b";
      errorBox.style.background = "#fee2e2";
      errorBox.style.border = "1px solid #fecaca";
      errorBox.style.borderRadius = "8px";
      ui.board.appendChild(errorBox);
      return;
    }
    const fabricCanvas = new fabricLib.Canvas(ui.canvasEl, {
      preserveObjectStacking: true,
      selection: true,
      centeredScaling: false,
      centeredRotation: false
    });
    instance.data.fabricCanvas = fabricCanvas;
    if (typeof document !== "undefined" && document.fonts && typeof document.fonts.load === "function") {
      document.fonts.load(`36px ${DEFAULT_TEXT_FONT_FAMILY}`).catch(() => {
      });
    }
    instance.publishState("new_color", "");
    instance.publishState("contribution_id", "");
    instance.publishState("pdf_url", "");
    instance.data.toolMode = "select";
    instance.data.documentTitle = "Document title";
    instance.data.activeArtboardIndex = 0;
    instance.data.pageSnapshots = [null, null, null];
    instance.data._lastPublishedCanvasJson = null;
    instance.data._suppressCanvasJsonPublish = true;
    instance.data.penColor = "#111827";
    instance.data.penWidth = 3;
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    instance.data.isPanning = false;
    instance.data.panLastClientX = 0;
    instance.data.panLastClientY = 0;
    instance.data.altKeyAtMouseDown = false;
    instance.data._altDuplicateDone = false;
    instance.data._canvasPointerGestureId = 0;
    instance.data._altDupClonedGestureId = null;
    instance.data._altDupDownClientX = null;
    instance.data._altDupDownClientY = null;
    instance.data.bookmarksList = [];
    const app = { instance, context, fabricCanvas, fabricLib, ui };
    Object.assign(app, setupTools(app));
    Object.assign(app, setupSelectionOps(app));
    setupContextMenu(app);
    Object.assign(app, setupInserts(app));
    const snapshots = [];
    for (let i = 0; i < 3; i++) {
      instance.data.activeArtboardIndex = i;
      instance.data.zoomScale = 1;
      instance.data.panX = 0;
      instance.data.panY = 0;
      fabricCanvas.clear();
      instance.data.artboardRect = null;
      instance.data.marginGuideLines = null;
      const p = ARTBOARD_PRESETS[i];
      instance.data.canvasWidth = p.width;
      instance.data.canvasHeight = p.height;
      ensureCanvasSize(instance);
      snapshots[i] = fabricCanvas.toJSON();
    }
    instance.data.pageSnapshots = snapshots;
    instance.data.activeArtboardIndex = 0;
    instance.data.zoomScale = 1;
    instance.data.panX = 0;
    instance.data.panY = 0;
    fabricCanvas.clear();
    instance.data.artboardRect = null;
    instance.data.marginGuideLines = null;
    {
      const p = ARTBOARD_PRESETS[0];
      instance.data.canvasWidth = p.width;
      instance.data.canvasHeight = p.height;
    }
    ensureCanvasSize(instance);
    updateTopBarForSelection(instance);
    Object.assign(app, setupMenus(app));
    Object.assign(app, setupZoomAndNav(app));
    setupToolbarInputs(app);
    wireCanvasEvents(app);
    instance.data.ensureCanvasSize = () => ensureCanvasSize(instance);
    instance.data.refreshTopBar = () => updateTopBarForSelection(instance);
    instance.data.loadWrappedCanvasJson = (jsonString) => loadWrappedCanvasJson(instance, jsonString);
    instance.data.createPagePreviews = () => createPagePreviews(instance);
    app.syncToolButtonHighlightToMode();
  }

  // plugins/fabric/fabric-view/src/index.js
  var index_default = initializeFabricView;
  return __toCommonJS(index_exports);
})();
return __pluginInit.default(instance, context);
}
