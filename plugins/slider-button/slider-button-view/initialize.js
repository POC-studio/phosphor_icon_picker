export default function (instance, context) {
  if (!document.getElementById('phosphor-script')) {
    const script = document.createElement('script');
    script.id = 'phosphor-script';
    script.src = 'https://unpkg.com/@phosphor-icons/web';
    document.head.appendChild(script);
  }

  const EPS = 3;

  const root = document.createElement('div');
  root.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;';

  const track = document.createElement('div');
  track.style.cssText =
    'position:relative;width:100%;height:100%;box-sizing:border-box;border-radius:9999px;overflow:hidden;';

  const labelEl = document.createElement('div');
  labelEl.style.cssText =
    'position:absolute;inset:0;box-sizing:border-box;width:100%;display:flex;align-items:center;justify-content:center;padding:0 10px;text-align:center;font-size:14px;font-weight:500;color:rgba(55,65,81,0.9);pointer-events:none;z-index:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

  const knob = document.createElement('div');
  knob.setAttribute('role', 'slider');
  knob.setAttribute('aria-valuemin', '0');
  knob.setAttribute('aria-valuemax', '100');
  knob.setAttribute('aria-valuenow', '0');
  knob.style.cssText =
    'position:absolute;left:0;top:50%;aspect-ratio:1/1;width:36px;height:36px;min-width:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;cursor:grab;z-index:2;box-shadow:0 1px 3px rgba(0,0,0,0.12);touch-action:none;user-select:none;';

  const iconEl = document.createElement('i');
  iconEl.className = 'ph ph-arrow-right';
  iconEl.style.cssText = 'font-size:1.25em;color:#fff;line-height:1;';
  knob.appendChild(iconEl);

  track.appendChild(labelEl);
  track.appendChild(knob);
  root.appendChild(track);
  instance.canvas.append(root);

  function hexToRgba(hex, alpha) {
    let h = String(hex || '#000000').replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
    const num = parseInt(h, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  instance.data.root = root;
  instance.data.track = track;
  instance.data.labelEl = labelEl;
  instance.data.knob = knob;
  instance.data.iconEl = iconEl;
  instance.data.completed = false;
  instance.data.knobOffset = 0;
  instance.data.holdTimerId = null;
  instance.data.dragging = false;
  instance.data.activePointerId = null;
  instance.data.startX = 0;
  instance.data.startOffset = 0;
  instance.data.defaultColor = '#ef4444';
  instance.data.successColor = '#22c55e';
  instance.data.holdDurationMs = 500;

  function getMaxOffset() {
    const w = track.clientWidth;
    const knobW = knob.offsetWidth || 36;
    return Math.max(0, w - knobW);
  }

  function applyKnobTransform(offsetPx) {
    const max = getMaxOffset();
    const x = Math.max(0, Math.min(max, offsetPx));
    instance.data.knobOffset = x;
    knob.style.transform = 'translateY(-50%) translateX(' + x + 'px)';
    knob.setAttribute('aria-valuenow', max > 0 ? Math.round((x / max) * 100) : 0);
  }

  function clearHoldTimer() {
    if (instance.data.holdTimerId != null) {
      clearTimeout(instance.data.holdTimerId);
      instance.data.holdTimerId = null;
    }
  }

  function scheduleHoldCompletion() {
    clearHoldTimer();
    const ms = Math.max(0, parseInt(instance.data.holdDurationMs, 10) || 500);
    instance.data.holdTimerId = setTimeout(function () {
      instance.data.holdTimerId = null;
      if (
        instance.data.completed ||
        !instance.data.dragging ||
        instance.data.knobOffset < getMaxOffset() - EPS
      ) {
        return;
      }
      completeSuccess();
    }, ms);
  }

  function applyDefaultTrackStyle(color) {
    const c = color || instance.data.defaultColor;
    track.style.background = 'linear-gradient(90deg,' + hexToRgba(c, 0.14) + ' 0%, rgba(255,255,255,0.06) 100%)';
    knob.style.background = c;
  }

  function completeSuccess() {
    if (instance.data.completed) return;
    instance.data.completed = true;
    clearHoldTimer();
    const ok = instance.data.successColor;
    track.style.background = 'linear-gradient(90deg,' + hexToRgba(ok, 0.18) + ' 0%, rgba(255,255,255,0.06) 100%)';
    knob.style.background = ok;
    iconEl.className = 'ph ph-check';
    applyKnobTransform(getMaxOffset());
    knob.style.cursor = 'default';
    instance.triggerEvent('button_slided');
  }

  function onPointerMove(ev) {
    if (!instance.data.dragging || instance.data.completed) return;
    if (ev.pointerId !== instance.data.activePointerId) return;
    const max = getMaxOffset();
    const dx = ev.clientX - instance.data.startX;
    let next = instance.data.startOffset + dx;
    next = Math.max(0, Math.min(max, next));
    applyKnobTransform(next);
    if (next < max - EPS) {
      clearHoldTimer();
    } else if (!instance.data.holdTimerId) {
      scheduleHoldCompletion();
    }
  }

  function onPointerEnd(ev) {
    if (ev.pointerId !== instance.data.activePointerId) return;
    const done = instance.data.completed;
    instance.data.dragging = false;
    instance.data.activePointerId = null;
    clearHoldTimer();
    try {
      knob.releasePointerCapture(ev.pointerId);
    } catch (e) {
      /* ignore */
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerEnd);
    window.removeEventListener('pointercancel', onPointerEnd);
    if (done) {
      knob.style.cursor = 'default';
      return;
    }
    knob.style.cursor = 'grab';
    applyKnobTransform(0);
  }

  knob.addEventListener('pointerdown', function (ev) {
    if (instance.data.completed) return;
    ev.preventDefault();
    instance.data.dragging = true;
    instance.data.activePointerId = ev.pointerId;
    instance.data.startX = ev.clientX;
    instance.data.startOffset = instance.data.knobOffset;
    clearHoldTimer();
    knob.style.cursor = 'grabbing';
    try {
      knob.setPointerCapture(ev.pointerId);
    } catch (e) {
      /* ignore */
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
  });

  const ro = new ResizeObserver(function () {
    if (instance.data.completed) return;
    const max = getMaxOffset();
    if (instance.data.knobOffset > max) {
      applyKnobTransform(max);
    }
    const h = track.clientHeight;
    const iconSize = Math.max(14, Math.round(h * 0.38));
    iconEl.style.fontSize = iconSize + 'px';
  });
  ro.observe(track);

  instance.data.resizeObserver = ro;
  instance.data.applyDefaultTrackStyle = applyDefaultTrackStyle;
  instance.data.applyKnobTransform = applyKnobTransform;
  instance.data.getMaxOffset = getMaxOffset;
  instance.data.clearHoldTimer = clearHoldTimer;

  applyDefaultTrackStyle(instance.data.defaultColor);
  applyKnobTransform(0);
}
