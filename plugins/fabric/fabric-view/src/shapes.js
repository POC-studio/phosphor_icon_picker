import { isFabricRasterImage, walkFabricObjectsDepthFirst } from './objects.js';


function getRectCornerRadiusPx(target) {
  if (!target || target.type !== 'rect') return 0;
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
  if (!target || target.type !== 'rect') return;
  const safeRadiusPx = Math.max(0, Number(radiusPx) || 0);
  const sx = Math.max(Math.abs(Number(target.scaleX) || 1), 1e-6);
  const sy = Math.max(Math.abs(Number(target.scaleY) || 1), 1e-6);
  target.set({
    cornerRadiusPx: safeRadiusPx,
    rx: safeRadiusPx / sx,
    ry: safeRadiusPx / sy,
  });
}


/**
 * Coins arrondis pour fabric.Image : clipPath Rect, rayon visuel constant (px) comme pour les rects.
 */
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
    if (typeof target.setCoords === 'function') target.setCoords();
    return;
  }
  const rLocal = Math.min(safePx / s, w / 2, h / 2);
  const clip = new fabricLib.Rect({
    width: w,
    height: h,
    rx: rLocal,
    ry: rLocal,
    originX: 'center',
    originY: 'center',
    left: 0,
    top: 0,
    absolutePositioned: false,
  });
  target.set({ clipPath: clip });
  if (typeof target.setCoords === 'function') target.setCoords();
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
      y: Math.sin(angle) * radius,
    });
    angle += step;
  }
  return points;
}


function createRegularPolygonPoints(sides, radius) {
  const points = [];
  const step = (Math.PI * 2) / sides;
  let angle = -Math.PI / 2;
  for (let i = 0; i < sides; i++) {
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
    angle += step;
  }
  return points;
}


function buildRoundedPolygonPath(points, radius) {
  if (!Array.isArray(points) || points.length < 3) return '';
  const safeRadius = Math.max(0, Number(radius) || 0);
  if (safeRadius <= 0) {
    return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
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
      len2 * 0.45,
    );

    const p1x = curr.x + n1x * tangentDist;
    const p1y = curr.y + n1y * tangentDist;
    const p2x = curr.x + n2x * tangentDist;
    const p2y = curr.y + n2y * tangentDist;

    if (commands.length === 0) commands.push(`M ${p1x} ${p1y}`);
    else commands.push(`L ${p1x} ${p1y}`);
    commands.push(`Q ${curr.x} ${curr.y} ${p2x} ${p2y}`);
  }
  commands.push('Z');
  return commands.join(' ');
}


function extractPathPoints(pathObject) {
  if (!pathObject || !Array.isArray(pathObject.path)) return [];
  const points = [];
  for (const cmd of pathObject.path) {
    if (!Array.isArray(cmd) || cmd.length < 3) continue;
    const op = String(cmd[0] || '').toUpperCase();
    if (op === 'M' || op === 'L') {
      points.push({ x: Number(cmd[1]), y: Number(cmd[2]) });
    } else if (op === 'Q' && cmd.length >= 5) {
      points.push({ x: Number(cmd[3]), y: Number(cmd[4]) });
    } else if (op === 'C' && cmd.length >= 7) {
      points.push({ x: Number(cmd[5]), y: Number(cmd[6]) });
    }
  }
  return points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
}


function buildSmoothFreehandPath(points, smoothing = 0.22) {
  if (!Array.isArray(points) || points.length === 0) return '';
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
  const basePoints = Array.isArray(target.shapePoints) && target.shapePoints.length >= 3
    ? target.shapePoints
    : (Array.isArray(target.points) ? target.points.map((p) => ({ x: p.x, y: p.y })) : null);
  if (!basePoints || basePoints.length < 3) return null;

  const pathData = buildRoundedPolygonPath(basePoints, radius);
  if (!pathData) return null;

  const replacement = new fabricLib.Path(pathData, {
    left: target.left,
    top: target.top,
    angle: target.angle,
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    originX: target.originX || 'center',
    originY: target.originY || 'center',
    fill: target.fill,
    stroke: target.stroke,
    strokeWidth: target.strokeWidth,
    strokeUniform: true,
    shapeKind: target.shapeKind,
    shapePoints: basePoints,
    cornerRadius: Math.max(0, Number(radius) || 0),
    cornerRadiusPx: Number.isFinite(Number(target.cornerRadiusPx))
      ? Math.max(0, Number(target.cornerRadiusPx))
      : Math.max(0, Number(radius) || 0) * Math.min(Math.abs(Number(target.scaleX) || 1), Math.abs(Number(target.scaleY) || 1)),
  });

  const objects = canvas.getObjects();
  const index = objects.indexOf(target);
  canvas.remove(target);
  if (index >= 0) canvas.insertAt(index, replacement);
  else canvas.add(replacement);
  return replacement;
}

export {
  getRectCornerRadiusPx,
  applyRectCornerRadiusPx,
  applyImageCornerRadiusPx,
  syncImageCornerRadiusClipsOnCanvas,
  createStarPoints,
  createRegularPolygonPoints,
  buildRoundedPolygonPath,
  extractPathPoints,
  buildSmoothFreehandPath,
  replaceRoundedPolygon,
};
