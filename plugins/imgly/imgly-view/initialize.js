/* GENERATED FILE - ne pas éditer. Source : imgly-view/src/ (npm run build:plugins) */
export default function(instance, context) {
var __pluginInit = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a, prop, b2[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b2) => __defProps(a, __getOwnPropDescs(b2));
  var __esm = (fn, res, err2) => function __init() {
    if (err2) throw err2[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e2) {
      throw err2 = [e2], e2;
    }
  };
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
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // plugins/imgly/imgly-view/src/booklet-layout.js
  function getSafetyMarginsForPageNumber(pageNumber) {
    const m = SAFETY_MARGIN_MM;
    const isEven = pageNumber % 2 === 0;
    return {
      top: m,
      bottom: m,
      left: isEven ? m : 0,
      right: isEven ? 0 : m
    };
  }
  function clampSheetCount(value) {
    const n = Number.parseInt(String(value != null ? value : ""), 10);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.min(n, MAX_SHEET_COUNT);
  }
  function getSpreadCount(sheetCount) {
    return 2 * clampSheetCount(sheetCount) - 1;
  }
  function getTotalPageCount(sheetCount) {
    return 4 * clampSheetCount(sheetCount);
  }
  function spreadRowY(spreadIndex) {
    return (spreadIndex + 1) * ROW_STEP_MM;
  }
  function buildBookletPageLayout(sheetCount) {
    const sheets = clampSheetCount(sheetCount);
    const spreadCount = getSpreadCount(sheets);
    const totalPages = getTotalPageCount(sheets);
    const layout = [];
    layout.push({
      key: "cover",
      name: "Page 1",
      width: HALF_A4_WIDTH_MM,
      height: PAGE_HEIGHT_MM,
      x: HALF_A4_WIDTH_MM,
      y: 0
    });
    for (let s = 0; s < spreadCount; s += 1) {
      const rowY = spreadRowY(s);
      const leftPageNum = 2 + s * 2;
      const rightPageNum = leftPageNum + 1;
      layout.push({
        key: `page${leftPageNum}`,
        name: `Page ${leftPageNum}`,
        width: HALF_A4_WIDTH_MM,
        height: PAGE_HEIGHT_MM,
        x: 0,
        y: rowY
      });
      layout.push({
        key: `page${rightPageNum}`,
        name: `Page ${rightPageNum}`,
        width: HALF_A4_WIDTH_MM,
        height: PAGE_HEIGHT_MM,
        x: HALF_A4_WIDTH_MM,
        y: rowY
      });
    }
    layout.push({
      key: "back",
      name: `Page ${totalPages}`,
      width: HALF_A4_WIDTH_MM,
      height: PAGE_HEIGHT_MM,
      x: 0,
      y: (spreadCount + 1) * ROW_STEP_MM
    });
    return layout;
  }
  var HALF_A4_WIDTH_MM, PAGE_HEIGHT_MM, BOOKLET_ROW_GAP_MM, MAX_SHEET_COUNT, BOOKLET_SCENE_LAYOUT, SAFETY_MARGIN_MM, ROW_STEP_MM;
  var init_booklet_layout = __esm({
    "plugins/imgly/imgly-view/src/booklet-layout.js"() {
      HALF_A4_WIDTH_MM = 148.5;
      PAGE_HEIGHT_MM = 210;
      BOOKLET_ROW_GAP_MM = 28;
      MAX_SHEET_COUNT = 20;
      BOOKLET_SCENE_LAYOUT = "Free";
      SAFETY_MARGIN_MM = 5;
      ROW_STEP_MM = PAGE_HEIGHT_MM + BOOKLET_ROW_GAP_MM;
    }
  });

  // plugins/imgly/imgly-view/src/safety-margins.js
  function isSafetyMarginGuideBlock(engine, blockId) {
    if (!(engine == null ? void 0 : engine.block) || blockId == null) return false;
    try {
      const value = engine.block.getMetadata(blockId, SAFETY_MARGIN_GUIDE_METADATA_KEY);
      return typeof value === "string" && value.length > 0;
    } catch (e2) {
      return false;
    }
  }
  function disableNativePageMargins(engine, pageId) {
    try {
      engine.block.setBool(pageId, "page/marginEnabled", false);
    } catch (e2) {
    }
  }
  function removeSafetyMarginGuidesFromPage(engine, pageId) {
    if (!(engine == null ? void 0 : engine.block) || pageId == null) return;
    let children = [];
    try {
      children = engine.block.getChildren(pageId) || [];
    } catch (e2) {
      return;
    }
    for (const childId of children) {
      if (!isSafetyMarginGuideBlock(engine, childId)) continue;
      try {
        engine.block.destroy(childId);
      } catch (e2) {
      }
    }
  }
  function createGuideStrip(engine, pageId, spec) {
    const block = engine.block.create("graphic");
    const shape = engine.block.createShape("rect");
    engine.block.setShape(block, shape);
    const fill = engine.block.createFill("color");
    engine.block.setColor(fill, "fill/color/value", GUIDE_FILL);
    engine.block.setFill(block, fill);
    engine.block.setWidthMode(block, "Absolute");
    engine.block.setHeightMode(block, "Absolute");
    engine.block.setPositionXMode(block, "Absolute");
    engine.block.setPositionYMode(block, "Absolute");
    engine.block.setWidth(block, spec.width);
    engine.block.setHeight(block, spec.height);
    engine.block.setPositionX(block, spec.x);
    engine.block.setPositionY(block, spec.y);
    engine.block.appendChild(pageId, block);
    engine.block.setBool(block, "alwaysOnBottom", true);
    engine.block.setBool(block, "selectionEnabled", false);
    engine.block.setBool(block, "transformLocked", true);
    engine.block.setIncludedInExport(block, false);
    engine.block.setMetadata(block, SAFETY_MARGIN_GUIDE_METADATA_KEY, spec.side);
  }
  function applyInnerSafetyMarginGuides(engine, pageId, pageNumber) {
    if (!(engine == null ? void 0 : engine.block) || pageId == null) return;
    disableNativePageMargins(engine, pageId);
    removeSafetyMarginGuidesFromPage(engine, pageId);
    const pageW = engine.block.getWidth(pageId) || HALF_A4_WIDTH_MM;
    const pageH = engine.block.getHeight(pageId) || PAGE_HEIGHT_MM;
    const margins = getSafetyMarginsForPageNumber(pageNumber);
    if (margins.top > 0) {
      createGuideStrip(engine, pageId, {
        side: "top",
        x: 0,
        y: 0,
        width: pageW,
        height: margins.top
      });
    }
    if (margins.bottom > 0) {
      createGuideStrip(engine, pageId, {
        side: "bottom",
        x: 0,
        y: pageH - margins.bottom,
        width: pageW,
        height: margins.bottom
      });
    }
    if (margins.left > 0) {
      createGuideStrip(engine, pageId, {
        side: "left",
        x: 0,
        y: 0,
        width: margins.left,
        height: pageH
      });
    }
    if (margins.right > 0) {
      createGuideStrip(engine, pageId, {
        side: "right",
        x: pageW - margins.right,
        y: 0,
        width: margins.right,
        height: pageH
      });
    }
  }
  function syncInnerSafetyMarginGuides(engine, layout) {
    if (!(engine == null ? void 0 : engine.block) || !Array.isArray(layout) || layout.length === 0) return;
    const pageIds = engine.block.findByType("page") || [];
    if (pageIds.length !== layout.length) return;
    pageIds.forEach((pageId, index) => {
      applyInnerSafetyMarginGuides(engine, pageId, index + 1);
    });
  }
  var SAFETY_MARGIN_GUIDE_METADATA_KEY, GUIDE_FILL;
  var init_safety_margins = __esm({
    "plugins/imgly/imgly-view/src/safety-margins.js"() {
      init_booklet_layout();
      SAFETY_MARGIN_GUIDE_METADATA_KEY = "imgly.safetyMarginGuide";
      GUIDE_FILL = { r: 0.45, g: 0.45, b: 0.45, a: 0.14 };
    }
  });

  // plugins/imgly/imgly-view/src/export-lock.js
  function configureEditorRoleForHiddenExportToggle(engine) {
    if (!(engine == null ? void 0 : engine.editor)) return;
    engine.editor.setRole("Adopter");
    if (typeof engine.editor.findAllScopes !== "function") return;
    for (const scope of engine.editor.findAllScopes()) {
      try {
        engine.editor.setGlobalScope(scope, "Allow");
      } catch (e2) {
      }
    }
  }
  function ensureAllBlocksIncludedInExport(engine) {
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findAll !== "function") return;
    for (const blockId of engine.block.findAll()) {
      try {
        if (isSafetyMarginGuideBlock(engine, blockId)) continue;
        if (typeof engine.block.isIncludedInExport === "function" && engine.block.isIncludedInExport(blockId)) {
          continue;
        }
        if (typeof engine.block.setIncludedInExport === "function") {
          engine.block.setIncludedInExport(blockId, true);
        }
      } catch (e2) {
      }
    }
  }
  function hidePageCanvasBorder(engine, pageId) {
    if (!(engine == null ? void 0 : engine.block) || pageId == null) return;
    try {
      if (typeof engine.block.supportsStroke === "function" && engine.block.supportsStroke(pageId)) {
        engine.block.setStrokeEnabled(pageId, false);
      }
      if (typeof engine.block.setFloat === "function") {
        engine.block.setFloat(pageId, "stroke/width", 0);
      }
      if (typeof engine.block.setBool === "function") {
        engine.block.setBool(pageId, "stroke/enabled", false);
      }
      if (typeof engine.block.supportsFill === "function" && engine.block.supportsFill(pageId)) {
        engine.block.setFillEnabled(pageId, true);
      }
    } catch (e2) {
    }
  }
  function readPageExportVisualState(engine, pageId) {
    const state = {};
    try {
      if (typeof engine.block.isStrokeEnabled === "function") {
        state.strokeEnabled = engine.block.isStrokeEnabled(pageId);
      }
      if (typeof engine.block.isFillEnabled === "function") {
        state.fillEnabled = engine.block.isFillEnabled(pageId);
      }
    } catch (e2) {
    }
    return state;
  }
  function restorePageExportVisualState(engine, pageId, state) {
    try {
      if (state.strokeEnabled !== void 0 && typeof engine.block.setStrokeEnabled === "function") {
        engine.block.setStrokeEnabled(pageId, state.strokeEnabled);
      }
      if (state.fillEnabled !== void 0 && typeof engine.block.setFillEnabled === "function") {
        engine.block.setFillEnabled(pageId, state.fillEnabled);
      }
    } catch (e2) {
    }
  }
  function withPageHiddenForExport(engine, pageId, exportFn) {
    return __async(this, null, function* () {
      const previous = readPageExportVisualState(engine, pageId);
      try {
        hidePageCanvasBorder(engine, pageId);
        if (typeof engine.block.setFillEnabled === "function") {
          engine.block.setFillEnabled(pageId, false);
        }
        return yield exportFn();
      } finally {
        restorePageExportVisualState(engine, pageId, previous);
        hidePageCanvasBorder(engine, pageId);
      }
    });
  }
  function hideAllPageCanvasBorders(engine) {
    var _a2;
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findByType !== "function") return;
    if ((_a2 = engine.editor) == null ? void 0 : _a2.setSetting) {
      try {
        engine.editor.setSetting("page/innerBorderColor", TRANSPARENT_COLOR);
        engine.editor.setSetting("page/outerBorderColor", TRANSPARENT_COLOR);
      } catch (e2) {
      }
    }
    const pageIds = engine.block.findByType("page") || [];
    for (const pageId of pageIds) {
      hidePageCanvasBorder(engine, pageId);
    }
  }
  function lockPageDeletion(engine) {
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findByType !== "function") return;
    const pageIds = engine.block.findByType("page") || [];
    for (const pageId of pageIds) {
      try {
        engine.block.setScopeEnabled(pageId, "lifecycle/destroy", false);
      } catch (e2) {
      }
    }
  }
  function lockPageSelection(engine) {
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findByType !== "function") return;
    const pageIds = engine.block.findByType("page") || [];
    for (const pageId of pageIds) {
      try {
        engine.block.setBool(pageId, "selectionEnabled", false);
      } catch (e2) {
      }
    }
  }
  function setupExportLock(engine) {
    configureEditorRoleForHiddenExportToggle(engine);
    hideAllPageCanvasBorders(engine);
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
  }
  var TRANSPARENT_COLOR;
  var init_export_lock = __esm({
    "plugins/imgly/imgly-view/src/export-lock.js"() {
      init_safety_margins();
      TRANSPARENT_COLOR = { r: 0, g: 0, b: 0, a: 0 };
    }
  });

  // node_modules/fflate/esm/browser.js
  function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
  }
  function strToU8(str, latin1) {
    if (latin1) {
      var ar_1 = new u8(str.length);
      for (var i2 = 0; i2 < str.length; ++i2)
        ar_1[i2] = str.charCodeAt(i2);
      return ar_1;
    }
    if (te)
      return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function(v2) {
      ar[ai++] = v2;
    };
    for (var i2 = 0; i2 < l; ++i2) {
      if (ai + 5 > ar.length) {
        var n = new u8(ai + 8 + (l - i2 << 1));
        n.set(ar);
        ar = n;
      }
      var c = str.charCodeAt(i2);
      if (c < 128 || latin1)
        w(c);
      else if (c < 2048)
        w(192 | c >> 6), w(128 | c & 63);
      else if (c > 55295 && c < 57344)
        c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
      else
        w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
    }
    return slc(ar, 0, ai);
  }
  function zipSync(data, opts) {
    if (!opts)
      opts = {};
    var r = {};
    var files = [];
    fltn(data, "", r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
      var _a2 = r[fn], file = _a2[0], p2 = _a2[1];
      var compression = p2.level == 0 ? 0 : 8;
      var f = strToU8(fn), s = f.length;
      var com = p2.comment, m = com && strToU8(com), ms = m && m.length;
      var exl = exfl(p2.extra);
      if (s > 65535)
        err(11);
      var d2 = compression ? deflateSync(file, p2) : file, l = d2.length;
      var c = crc();
      c.p(file);
      files.push(mrg(p2, {
        size: file.length,
        crc: c.d(),
        c: d2,
        f,
        m,
        u: s != fn.length || m && com.length != ms,
        o,
        compression
      }));
      o += 30 + s + exl + l;
      tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i2 = 0; i2 < files.length; ++i2) {
      var f = files[i2];
      wzh(out, f.o, f, f.f, f.u, f.c.length);
      var badd = 30 + f.f.length + exfl(f.extra);
      out.set(f.c, f.o + badd);
      wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
  }
  var u8, u16, i32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, revfd, rev, x, i, hMap, flt, i, i, i, i, fdt, i, flm, fdm, shft, slc, ec, err, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, deo, et, dflt, crct, crc, dopt, mrg, wbytes, fltn, te, td, tds, exfl, wzh, wzf;
  var init_browser = __esm({
    "node_modules/fflate/esm/browser.js"() {
      u8 = Uint8Array;
      u16 = Uint16Array;
      i32 = Int32Array;
      fleb = new u8([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0,
        /* unused */
        0,
        0,
        /* impossible */
        0
      ]);
      fdeb = new u8([
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        /* unused */
        0,
        0
      ]);
      clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
      freb = function(eb, start) {
        var b2 = new u16(31);
        for (var i2 = 0; i2 < 31; ++i2) {
          b2[i2] = start += 1 << eb[i2 - 1];
        }
        var r = new i32(b2[30]);
        for (var i2 = 1; i2 < 30; ++i2) {
          for (var j2 = b2[i2]; j2 < b2[i2 + 1]; ++j2) {
            r[j2] = j2 - b2[i2] << 5 | i2;
          }
        }
        return { b: b2, r };
      };
      _a = freb(fleb, 2);
      fl = _a.b;
      revfl = _a.r;
      fl[28] = 258, revfl[258] = 28;
      _b = freb(fdeb, 0);
      fd = _b.b;
      revfd = _b.r;
      rev = new u16(32768);
      for (i = 0; i < 32768; ++i) {
        x = (i & 43690) >> 1 | (i & 21845) << 1;
        x = (x & 52428) >> 2 | (x & 13107) << 2;
        x = (x & 61680) >> 4 | (x & 3855) << 4;
        rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
      }
      hMap = (function(cd, mb, r) {
        var s = cd.length;
        var i2 = 0;
        var l = new u16(mb);
        for (; i2 < s; ++i2) {
          if (cd[i2])
            ++l[cd[i2] - 1];
        }
        var le = new u16(mb);
        for (i2 = 1; i2 < mb; ++i2) {
          le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
        }
        var co;
        if (r) {
          co = new u16(1 << mb);
          var rvb = 15 - mb;
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              var sv = i2 << 4 | cd[i2];
              var r_1 = mb - cd[i2];
              var v2 = le[cd[i2] - 1]++ << r_1;
              for (var m = v2 | (1 << r_1) - 1; v2 <= m; ++v2) {
                co[rev[v2] >> rvb] = sv;
              }
            }
          }
        } else {
          co = new u16(s);
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
            }
          }
        }
        return co;
      });
      flt = new u8(288);
      for (i = 0; i < 144; ++i)
        flt[i] = 8;
      for (i = 144; i < 256; ++i)
        flt[i] = 9;
      for (i = 256; i < 280; ++i)
        flt[i] = 7;
      for (i = 280; i < 288; ++i)
        flt[i] = 8;
      fdt = new u8(32);
      for (i = 0; i < 32; ++i)
        fdt[i] = 5;
      flm = /* @__PURE__ */ hMap(flt, 9, 0);
      fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
      shft = function(p2) {
        return (p2 + 7) / 8 | 0;
      };
      slc = function(v2, s, e2) {
        if (s == null || s < 0)
          s = 0;
        if (e2 == null || e2 > v2.length)
          e2 = v2.length;
        return new u8(v2.subarray(s, e2));
      };
      ec = [
        "unexpected EOF",
        "invalid block type",
        "invalid length/literal",
        "invalid distance",
        "stream finished",
        "no stream handler",
        ,
        // determined by compression function
        "no callback",
        "invalid UTF-8 data",
        "extra field too long",
        "date not in range 1980-2099",
        "filename too long",
        "stream finishing",
        "invalid zip data"
        // determined by unknown compression method
      ];
      err = function(ind, msg, nt) {
        var e2 = new Error(msg || ec[ind]);
        e2.code = ind;
        if (Error.captureStackTrace)
          Error.captureStackTrace(e2, err);
        if (!nt)
          throw e2;
        return e2;
      };
      wbits = function(d2, p2, v2) {
        v2 <<= p2 & 7;
        var o = p2 / 8 | 0;
        d2[o] |= v2;
        d2[o + 1] |= v2 >> 8;
      };
      wbits16 = function(d2, p2, v2) {
        v2 <<= p2 & 7;
        var o = p2 / 8 | 0;
        d2[o] |= v2;
        d2[o + 1] |= v2 >> 8;
        d2[o + 2] |= v2 >> 16;
      };
      hTree = function(d2, mb) {
        var t = [];
        for (var i2 = 0; i2 < d2.length; ++i2) {
          if (d2[i2])
            t.push({ s: i2, f: d2[i2] });
        }
        var s = t.length;
        var t2 = t.slice();
        if (!s)
          return { t: et, l: 0 };
        if (s == 1) {
          var v2 = new u8(t[0].s + 1);
          v2[t[0].s] = 1;
          return { t: v2, l: 1 };
        }
        t.sort(function(a, b2) {
          return a.f - b2.f;
        });
        t.push({ s: -1, f: 25001 });
        var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
        t[0] = { s: -1, f: l.f + r.f, l, r };
        while (i1 != s - 1) {
          l = t[t[i0].f < t[i22].f ? i0++ : i22++];
          r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
          t[i1++] = { s: -1, f: l.f + r.f, l, r };
        }
        var maxSym = t2[0].s;
        for (var i2 = 1; i2 < s; ++i2) {
          if (t2[i2].s > maxSym)
            maxSym = t2[i2].s;
        }
        var tr = new u16(maxSym + 1);
        var mbt = ln(t[i1 - 1], tr, 0);
        if (mbt > mb) {
          var i2 = 0, dt = 0;
          var lft = mbt - mb, cst = 1 << lft;
          t2.sort(function(a, b2) {
            return tr[b2.s] - tr[a.s] || a.f - b2.f;
          });
          for (; i2 < s; ++i2) {
            var i2_1 = t2[i2].s;
            if (tr[i2_1] > mb) {
              dt += cst - (1 << mbt - tr[i2_1]);
              tr[i2_1] = mb;
            } else
              break;
          }
          dt >>= lft;
          while (dt > 0) {
            var i2_2 = t2[i2].s;
            if (tr[i2_2] < mb)
              dt -= 1 << mb - tr[i2_2]++ - 1;
            else
              ++i2;
          }
          for (; i2 >= 0 && dt; --i2) {
            var i2_3 = t2[i2].s;
            if (tr[i2_3] == mb) {
              --tr[i2_3];
              ++dt;
            }
          }
          mbt = mb;
        }
        return { t: new u8(tr), l: mbt };
      };
      ln = function(n, l, d2) {
        return n.s == -1 ? Math.max(ln(n.l, l, d2 + 1), ln(n.r, l, d2 + 1)) : l[n.s] = d2;
      };
      lc = function(c) {
        var s = c.length;
        while (s && !c[--s])
          ;
        var cl = new u16(++s);
        var cli = 0, cln = c[0], cls = 1;
        var w = function(v2) {
          cl[cli++] = v2;
        };
        for (var i2 = 1; i2 <= s; ++i2) {
          if (c[i2] == cln && i2 != s)
            ++cls;
          else {
            if (!cln && cls > 2) {
              for (; cls > 138; cls -= 138)
                w(32754);
              if (cls > 2) {
                w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
                cls = 0;
              }
            } else if (cls > 3) {
              w(cln), --cls;
              for (; cls > 6; cls -= 6)
                w(8304);
              if (cls > 2)
                w(cls - 3 << 5 | 8208), cls = 0;
            }
            while (cls--)
              w(cln);
            cls = 1;
            cln = c[i2];
          }
        }
        return { c: cl.subarray(0, cli), n: s };
      };
      clen = function(cf, cl) {
        var l = 0;
        for (var i2 = 0; i2 < cl.length; ++i2)
          l += cf[i2] * cl[i2];
        return l;
      };
      wfblk = function(out, pos, dat) {
        var s = dat.length;
        var o = shft(pos + 2);
        out[o] = s & 255;
        out[o + 1] = s >> 8;
        out[o + 2] = out[o] ^ 255;
        out[o + 3] = out[o + 1] ^ 255;
        for (var i2 = 0; i2 < s; ++i2)
          out[o + i2 + 4] = dat[i2];
        return (o + 4 + s) * 8;
      };
      wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
        wbits(out, p2++, final);
        ++lf[256];
        var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
        var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
        var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
        var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
        var lcfreq = new u16(19);
        for (var i2 = 0; i2 < lclt.length; ++i2)
          ++lcfreq[lclt[i2] & 31];
        for (var i2 = 0; i2 < lcdt.length; ++i2)
          ++lcfreq[lcdt[i2] & 31];
        var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
        var nlcc = 19;
        for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
        var flen = bl + 5 << 3;
        var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
        var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
        if (bs >= 0 && flen <= ftlen && flen <= dtlen)
          return wfblk(out, p2, dat.subarray(bs, bs + bl));
        var lm, ll, dm, dl;
        wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2;
        if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p2, nlc - 257);
          wbits(out, p2 + 5, ndc - 1);
          wbits(out, p2 + 10, nlcc - 4);
          p2 += 14;
          for (var i2 = 0; i2 < nlcc; ++i2)
            wbits(out, p2 + 3 * i2, lct[clim[i2]]);
          p2 += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i2 = 0; i2 < clct.length; ++i2) {
              var len = clct[i2] & 31;
              wbits(out, p2, llm[len]), p2 += lct[len];
              if (len > 15)
                wbits(out, p2, clct[i2] >> 5 & 127), p2 += clct[i2] >> 12;
            }
          }
        } else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
        }
        for (var i2 = 0; i2 < li; ++i2) {
          var sym = syms[i2];
          if (sym > 255) {
            var len = sym >> 18 & 31;
            wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257];
            if (len > 7)
              wbits(out, p2, sym >> 23 & 31), p2 += fleb[len];
            var dst = sym & 31;
            wbits16(out, p2, dm[dst]), p2 += dl[dst];
            if (dst > 3)
              wbits16(out, p2, sym >> 5 & 8191), p2 += fdeb[dst];
          } else {
            wbits16(out, p2, lm[sym]), p2 += ll[sym];
          }
        }
        wbits16(out, p2, lm[256]);
        return p2 + ll[256];
      };
      deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
      et = /* @__PURE__ */ new u8(0);
      dflt = function(dat, lvl, plvl, pre, post, st) {
        var s = st.z || dat.length;
        var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
        var w = o.subarray(pre, o.length - post);
        var lst = st.l;
        var pos = (st.r || 0) & 7;
        if (lvl) {
          if (pos)
            w[0] = st.r >> 3;
          var opt = deo[lvl - 1];
          var n = opt >> 13, c = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function(i3) {
            return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
          };
          var syms = new i32(25e3);
          var lf = new u16(288), df = new u16(32);
          var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
          for (; i2 + 2 < s; ++i2) {
            var hv = hsh(i2);
            var imod = i2 & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            if (wi <= i2) {
              var rem = s - i2;
              if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
                pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
                li = lc_1 = eb = 0, bs = i2;
                for (var j2 = 0; j2 < 286; ++j2)
                  lf[j2] = 0;
                for (var j2 = 0; j2 < 30; ++j2)
                  df[j2] = 0;
              }
              var l = 2, d2 = 0, ch_1 = c, dif = imod - pimod & 32767;
              if (rem > 2 && hv == hsh(i2 - dif)) {
                var maxn = Math.min(n, rem) - 1;
                var maxd = Math.min(32767, i2);
                var ml = Math.min(258, rem);
                while (dif <= maxd && --ch_1 && imod != pimod) {
                  if (dat[i2 + l] == dat[i2 + l - dif]) {
                    var nl = 0;
                    for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                      ;
                    if (nl > l) {
                      l = nl, d2 = dif;
                      if (nl > maxn)
                        break;
                      var mmd = Math.min(dif, nl - 2);
                      var md = 0;
                      for (var j2 = 0; j2 < mmd; ++j2) {
                        var ti = i2 - dif + j2 & 32767;
                        var pti = prev[ti];
                        var cd = ti - pti & 32767;
                        if (cd > md)
                          md = cd, pimod = ti;
                      }
                    }
                  }
                  imod = pimod, pimod = prev[imod];
                  dif += imod - pimod & 32767;
                }
              }
              if (d2) {
                syms[li++] = 268435456 | revfl[l] << 18 | revfd[d2];
                var lin = revfl[l] & 31, din = revfd[d2] & 31;
                eb += fleb[lin] + fdeb[din];
                ++lf[257 + lin];
                ++df[din];
                wi = i2 + l;
                ++lc_1;
              } else {
                syms[li++] = dat[i2];
                ++lf[dat[i2]];
              }
            }
          }
          for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
            syms[li++] = dat[i2];
            ++lf[dat[i2]];
          }
          pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
          if (!lst) {
            st.r = pos & 7 | w[pos / 8 | 0] << 3;
            pos -= 7;
            st.h = head, st.p = prev, st.i = i2, st.w = wi;
          }
        } else {
          for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
            var e2 = i2 + 65535;
            if (e2 >= s) {
              w[pos / 8 | 0] = lst;
              e2 = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i2, e2));
          }
          st.i = s;
        }
        return slc(o, 0, pre + shft(pos) + post);
      };
      crct = /* @__PURE__ */ (function() {
        var t = new Int32Array(256);
        for (var i2 = 0; i2 < 256; ++i2) {
          var c = i2, k = 9;
          while (--k)
            c = (c & 1 && -306674912) ^ c >>> 1;
          t[i2] = c;
        }
        return t;
      })();
      crc = function() {
        var c = -1;
        return {
          p: function(d2) {
            var cr = c;
            for (var i2 = 0; i2 < d2.length; ++i2)
              cr = crct[cr & 255 ^ d2[i2]] ^ cr >>> 8;
            c = cr;
          },
          d: function() {
            return ~c;
          }
        };
      };
      dopt = function(dat, opt, pre, post, st) {
        if (!st) {
          st = { l: 1 };
          if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
          }
        }
        return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
      };
      mrg = function(a, b2) {
        var o = {};
        for (var k in a)
          o[k] = a[k];
        for (var k in b2)
          o[k] = b2[k];
        return o;
      };
      wbytes = function(d2, b2, v2) {
        for (; v2; ++b2)
          d2[b2] = v2, v2 >>>= 8;
      };
      fltn = function(d2, p2, t, o) {
        for (var k in d2) {
          var val = d2[k], n = p2 + k, op = o;
          if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
          if (ArrayBuffer.isView(val))
            t[n] = [val, op];
          else {
            t[n += "/"] = [new u8(0), op];
            fltn(val, n, t, o);
          }
        }
      };
      te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
      td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
      tds = 0;
      try {
        td.decode(et, { stream: true });
        tds = 1;
      } catch (e2) {
      }
      exfl = function(ex) {
        var le = 0;
        if (ex) {
          for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
              err(9);
            le += l + 4;
          }
        }
        return le;
      };
      wzh = function(d2, b2, f, fn, u2, c, ce, co) {
        var fl2 = fn.length, ex = f.extra, col = co && co.length;
        var exl = exfl(ex);
        wbytes(d2, b2, ce != null ? 33639248 : 67324752), b2 += 4;
        if (ce != null)
          d2[b2++] = 20, d2[b2++] = f.os;
        d2[b2] = 20, b2 += 2;
        d2[b2++] = f.flag << 1 | (c < 0 && 8), d2[b2++] = u2 && 8;
        d2[b2++] = f.compression & 255, d2[b2++] = f.compression >> 8;
        var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
        if (y < 0 || y > 119)
          err(10);
        wbytes(d2, b2, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b2 += 4;
        if (c != -1) {
          wbytes(d2, b2, f.crc);
          wbytes(d2, b2 + 4, c < 0 ? -c - 2 : c);
          wbytes(d2, b2 + 8, f.size);
        }
        wbytes(d2, b2 + 12, fl2);
        wbytes(d2, b2 + 14, exl), b2 += 16;
        if (ce != null) {
          wbytes(d2, b2, col);
          wbytes(d2, b2 + 6, f.attrs);
          wbytes(d2, b2 + 10, ce), b2 += 14;
        }
        d2.set(fn, b2);
        b2 += fl2;
        if (exl) {
          for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d2, b2, +k);
            wbytes(d2, b2 + 2, l);
            d2.set(exf, b2 + 4), b2 += 4 + l;
          }
        }
        if (col)
          d2.set(co, b2), b2 += col;
        return b2;
      };
      wzf = function(o, b2, c, d2, e2) {
        wbytes(o, b2, 101010256);
        wbytes(o, b2 + 8, c);
        wbytes(o, b2 + 10, c);
        wbytes(o, b2 + 12, d2);
        wbytes(o, b2 + 16, e2);
      };
    }
  });

  // plugins/imgly/imgly-view/src/bubble-upload.js
  function normalizeBubbleUploadUrl(err2, url) {
    if (err2) return "";
    if (typeof url !== "string") return "";
    let trimmed = url.trim();
    if (!trimmed) return "";
    if (/^\/\//.test(trimmed)) trimmed = `https:${trimmed}`;
    if (/^https?:\/\//i.test(trimmed) || /^blob:/i.test(trimmed)) return trimmed;
    return trimmed;
  }
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl !== "string" || dataUrl.indexOf(",") < 0) {
          reject(new Error("Invalid data URL from blob"));
          return;
        }
        resolve(dataUrl.split(",")[1]);
      };
      reader.onerror = () => reject(reader.error || new Error("FileReader failed"));
      reader.readAsDataURL(blob);
    });
  }
  function fileToBase64(file) {
    return blobToBase64(file);
  }
  function uploadBase64(context, fileName, base64) {
    if (!context || typeof context.uploadContent !== "function" || !base64) {
      return Promise.resolve("");
    }
    return new Promise((resolve) => {
      try {
        context.uploadContent(fileName, base64, (err2, url) => {
          resolve(normalizeBubbleUploadUrl(err2, url));
        });
      } catch (e2) {
        console.error("IMG.LY View: uploadContent failed", e2);
        resolve("");
      }
    });
  }
  function uploadBlob(context, fileName, blob) {
    if (!blob) return Promise.resolve("");
    return blobToBase64(blob).then((base64) => uploadBase64(context, fileName, base64)).catch((err2) => {
      console.error("IMG.LY View: blobToBase64 failed", err2);
      return "";
    });
  }
  function safeUploadFileName(file) {
    const raw = file && typeof file.name === "string" ? file.name.trim() : "";
    const safe = raw.replace(/[^\w.-]/g, "_");
    if (safe) return safe;
    const ext = file && typeof file.type === "string" && file.type.includes("/") ? file.type.split("/").pop() : "bin";
    return `upload-${Date.now()}.${ext}`;
  }
  function uploadFileToBubble(instance, file, onProgress) {
    return __async(this, null, function* () {
      var _a2, _b2, _c;
      const context = ((_a2 = instance == null ? void 0 : instance.data) == null ? void 0 : _a2.bubbleContext) || null;
      const cesdk = ((_b2 = instance == null ? void 0 : instance.data) == null ? void 0 : _b2.cesdk) || null;
      if (!file) {
        throw new Error("No file to upload");
      }
      if (typeof onProgress === "function") {
        try {
          onProgress(0);
        } catch (e2) {
        }
      }
      const fileName = safeUploadFileName(file);
      if (context && typeof context.uploadContent === "function") {
        const base64 = yield fileToBase64(file);
        const url = yield uploadBase64(context, fileName, base64);
        if (url) {
          if (typeof onProgress === "function") {
            try {
              onProgress(1);
            } catch (e2) {
            }
          }
          if (((_c = file.type) == null ? void 0 : _c.startsWith("image/")) && (instance == null ? void 0 : instance.publishState) && (instance == null ? void 0 : instance.triggerEvent)) {
            instance.publishState("image_uploaded_url", url);
            instance.triggerEvent("image_uploaded");
          }
          return {
            id: `bubble-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            meta: {
              uri: url,
              thumbUri: url,
              mimeType: file.type || "application/octet-stream"
            }
          };
        }
        console.warn("IMG.LY View: uploadContent sans URL utilisable pour", fileName);
      }
      if ((cesdk == null ? void 0 : cesdk.utils) && typeof cesdk.utils.localUpload === "function") {
        console.warn("IMG.LY View: repli localUpload (sandbox / pas de context Bubble)");
        return cesdk.utils.localUpload(file, { context: { source: "user-upload" } });
      }
      throw new Error("Upload indisponible (context Bubble ou CE.SDK manquant)");
    });
  }
  var init_bubble_upload = __esm({
    "plugins/imgly/imgly-view/src/bubble-upload.js"() {
    }
  });

  // plugins/imgly/imgly-view/src/constants.js
  var PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS, SCENE_PUBLISH_DEBOUNCE_MS;
  var init_constants = __esm({
    "plugins/imgly/imgly-view/src/constants.js"() {
      PAGE_PREVIEWS_DEBOUNCE_MS = 1500;
      PAGE_PREVIEWS_COOLDOWN_MS = 3e4;
      SCENE_PUBLISH_DEBOUNCE_MS = 400;
    }
  });

  // plugins/imgly/imgly-view/src/shims/pdf-lib.js
  var lib, PDFDocument, PageSizes, concatTransformationMatrix, popGraphicsState, pushGraphicsState;
  var init_pdf_lib = __esm({
    "plugins/imgly/imgly-view/src/shims/pdf-lib.js"() {
      lib = typeof PDFLib !== "undefined" ? PDFLib : {};
      PDFDocument = lib.PDFDocument;
      PageSizes = lib.PageSizes;
      concatTransformationMatrix = lib.concatTransformationMatrix;
      popGraphicsState = lib.popGraphicsState;
      pushGraphicsState = lib.pushGraphicsState;
    }
  });

  // plugins/imgly/imgly-view/src/printer-margins.js
  var PRINTER_MARGIN_MM, A4_WIDTH_MM, A4_HEIGHT_MM;
  var init_printer_margins = __esm({
    "plugins/imgly/imgly-view/src/printer-margins.js"() {
      PRINTER_MARGIN_MM = {
        top: 3,
        bottom: 5,
        left: 3.5,
        right: 3.5
      };
      A4_WIDTH_MM = 210;
      A4_HEIGHT_MM = 297;
    }
  });

  // plugins/imgly/imgly-view/src/pdf-imposition.js
  function buildImpositionPairs(totalPages) {
    if (totalPages % 4 !== 0) {
      throw new Error(`Nombre de pages invalide pour imposition: ${totalPages}`);
    }
    const numSheets = totalPages / 4;
    const pairs = [];
    for (let s = 0; s < numSheets; s += 1) {
      pairs.push([totalPages - 2 * s, 1 + 2 * s]);
      pairs.push([2 + 2 * s, totalPages - 1 - 2 * s]);
    }
    return pairs;
  }
  function mmToPt(mm) {
    return mm * 72 / 25.4;
  }
  function blobToArrayBuffer(blob) {
    if (blob instanceof ArrayBuffer) return blob;
    if (blob == null ? void 0 : blob.arrayBuffer) return blob.arrayBuffer();
    return blob;
  }
  function logUnexpectedPageSize(widthPt, heightPt) {
    const expectedW = mmToPt(HALF_A4_WIDTH_MM);
    const expectedH = mmToPt(PAGE_HEIGHT_MM);
    const tolerance = 2;
    if (Math.abs(widthPt - expectedW) > tolerance || Math.abs(heightPt - expectedH) > tolerance) {
      console.warn(
        "IMG.LY View: taille PDF page inattendue",
        { widthPt, heightPt, expectedW, expectedH }
      );
    }
  }
  function drawImposedSpread(outPage, leftEmbedded, rightEmbedded, flip180) {
    const a4W = mmToPt(A4_WIDTH_MM);
    const a4H = mmToPt(A4_HEIGHT_MM);
    const halfW = mmToPt(HALF_A4_WIDTH_MM);
    logUnexpectedPageSize(leftEmbedded.width, leftEmbedded.height);
    logUnexpectedPageSize(rightEmbedded.width, rightEmbedded.height);
    outPage.pushOperators(pushGraphicsState());
    if (flip180 && PDF_DUPLEX_FLIP_INSIDE_PAGE) {
      outPage.pushOperators(
        concatTransformationMatrix(-1, 0, 0, -1, a4W, a4H)
      );
    }
    if (PDF_ROTATE_CLOCKWISE) {
      outPage.pushOperators(
        concatTransformationMatrix(0, 1, -1, 0, a4W, 0)
      );
    } else {
      outPage.pushOperators(
        concatTransformationMatrix(0, -1, 1, 0, 0, a4H)
      );
    }
    outPage.drawPage(leftEmbedded, { x: 0, y: 0 });
    outPage.drawPage(rightEmbedded, { x: halfW, y: 0 });
    outPage.pushOperators(popGraphicsState());
  }
  function composeImposedPdf(pagePdfBytesList, pairs) {
    return __async(this, null, function* () {
      const outputDoc = yield PDFDocument.create();
      for (let i2 = 0; i2 < pairs.length; i2 += 1) {
        const [leftNum, rightNum] = pairs[i2];
        const leftBytes = pagePdfBytesList[leftNum - 1];
        const rightBytes = pagePdfBytesList[rightNum - 1];
        if (!leftBytes || !rightBytes) {
          throw new Error(`PDF manquant pour la paire [${leftNum}|${rightNum}]`);
        }
        const leftDoc = yield PDFDocument.load(yield blobToArrayBuffer(leftBytes));
        const rightDoc = yield PDFDocument.load(yield blobToArrayBuffer(rightBytes));
        const [leftEmbedded] = yield outputDoc.embedPdf(leftDoc);
        const [rightEmbedded] = yield outputDoc.embedPdf(rightDoc);
        const outPage = outputDoc.addPage(PageSizes.A4);
        drawImposedSpread(outPage, leftEmbedded, rightEmbedded, i2 % 2 === 1);
      }
      const bytes = yield outputDoc.save();
      return new Blob([bytes], { type: "application/pdf" });
    });
  }
  function exportPagePdf(engine, pageId) {
    return __async(this, null, function* () {
      if (!(engine == null ? void 0 : engine.block) || pageId == null) return null;
      const blob = yield withPageHiddenForExport(engine, pageId, () => engine.block.export(pageId, {
        mimeType: "application/pdf",
        exportPdfWithHighCompatibility: true
      }));
      if (!blob) return null;
      return blobToArrayBuffer(blob);
    });
  }
  function buildFoldedA4Pdf(engine, pageIds) {
    return __async(this, null, function* () {
      const totalPages = pageIds.length;
      if (totalPages % 4 !== 0) {
        throw new Error(`Imposition: ${totalPages} pages (attendu multiple de 4)`);
      }
      const pagePdfBytes = yield Promise.all(pageIds.map((id) => exportPagePdf(engine, id)));
      if (pagePdfBytes.some((bytes) => !bytes)) {
        throw new Error("Export PDF CE.SDK incomplet (page manquante)");
      }
      const pairs = buildImpositionPairs(totalPages);
      return composeImposedPdf(pagePdfBytes, pairs);
    });
  }
  function buildSequentialPdf(engine, pageIds) {
    return __async(this, null, function* () {
      if (!pageIds.length) {
        throw new Error("Export PDF s\xE9quentiel : aucune page");
      }
      const pagePdfBytes = yield Promise.all(pageIds.map((id) => exportPagePdf(engine, id)));
      if (pagePdfBytes.some((bytes) => !bytes)) {
        throw new Error("Export PDF CE.SDK incomplet (page manquante)");
      }
      const outputDoc = yield PDFDocument.create();
      for (const bytes of pagePdfBytes) {
        const srcDoc = yield PDFDocument.load(yield blobToArrayBuffer(bytes));
        const [embedded] = yield outputDoc.embedPdf(srcDoc);
        const page = outputDoc.addPage([embedded.width, embedded.height]);
        page.drawPage(embedded, { x: 0, y: 0 });
      }
      const outBytes = yield outputDoc.save();
      return new Blob([outBytes], { type: "application/pdf" });
    });
  }
  function trimImposedPdfForPrinter(imposedPdfBlob) {
    return __async(this, null, function* () {
      const doc = yield PDFDocument.load(yield blobToArrayBuffer(imposedPdfBlob));
      const { left, bottom, right, top } = PRINTER_MARGIN_MM;
      const trimW = mmToPt(A4_WIDTH_MM - left - right);
      const trimH = mmToPt(A4_HEIGHT_MM - top - bottom);
      const cropX = mmToPt(left);
      const cropY = mmToPt(bottom);
      for (const page of doc.getPages()) {
        page.setMediaBox(cropX, cropY, trimW, trimH);
        page.setCropBox(cropX, cropY, trimW, trimH);
      }
      const bytes = yield doc.save();
      return new Blob([bytes], { type: "application/pdf" });
    });
  }
  var PDF_ROTATE_CLOCKWISE, PDF_DUPLEX_FLIP_INSIDE_PAGE;
  var init_pdf_imposition = __esm({
    "plugins/imgly/imgly-view/src/pdf-imposition.js"() {
      init_pdf_lib();
      init_booklet_layout();
      init_export_lock();
      init_printer_margins();
      PDF_ROTATE_CLOCKWISE = false;
      PDF_DUPLEX_FLIP_INSIDE_PAGE = true;
    }
  });

  // plugins/imgly/imgly-view/src/margin-warning.js
  function readGlobalBounds(engine, blockId) {
    try {
      const width = engine.block.getGlobalBoundingBoxWidth(blockId);
      const height = engine.block.getGlobalBoundingBoxHeight(blockId);
      if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
      if (width < MIN_CONTENT_SIZE_MM || height < MIN_CONTENT_SIZE_MM) return null;
      return {
        x: engine.block.getGlobalBoundingBoxX(blockId),
        y: engine.block.getGlobalBoundingBoxY(blockId),
        width,
        height
      };
    } catch (e2) {
      return null;
    }
  }
  function boundsViolateSafeZone(bounds, safe) {
    const right = bounds.x + bounds.width;
    const bottom = bounds.y + bounds.height;
    return bounds.x < safe.left - BOUNDS_EPSILON_MM || bounds.y < safe.top - BOUNDS_EPSILON_MM || right > safe.right + BOUNDS_EPSILON_MM || bottom > safe.bottom + BOUNDS_EPSILON_MM;
  }
  function getPageSafeZoneGlobal(engine, pageId, pageNumber) {
    const pageW = engine.block.getWidth(pageId) || HALF_A4_WIDTH_MM;
    const pageH = engine.block.getHeight(pageId) || PAGE_HEIGHT_MM;
    const margins = getSafetyMarginsForPageNumber(pageNumber);
    const pageX = engine.block.getGlobalBoundingBoxX(pageId);
    const pageY = engine.block.getGlobalBoundingBoxY(pageId);
    return {
      left: pageX + margins.left,
      top: pageY + margins.top,
      right: pageX + pageW - margins.right,
      bottom: pageY + pageH - margins.bottom
    };
  }
  function shouldSkipBlockType(engine, blockId) {
    try {
      const type = engine.block.getType(blockId);
      return type === "page" || type === "camera";
    } catch (e2) {
      return true;
    }
  }
  function pageHasMarginViolation(engine, pageId, safe) {
    function walk(blockId) {
      if (isSafetyMarginGuideBlock(engine, blockId)) return false;
      if (shouldSkipBlockType(engine, blockId)) return false;
      const bounds = readGlobalBounds(engine, blockId);
      if (bounds && boundsViolateSafeZone(bounds, safe)) {
        return true;
      }
      let children2 = [];
      try {
        children2 = engine.block.getChildren(blockId) || [];
      } catch (e2) {
        return false;
      }
      for (const childId of children2) {
        if (walk(childId)) return true;
      }
      return false;
    }
    let children = [];
    try {
      children = engine.block.getChildren(pageId) || [];
    } catch (e2) {
      return false;
    }
    for (const childId of children) {
      if (walk(childId)) return true;
    }
    return false;
  }
  function scanMarginViolations(engine) {
    if (!(engine == null ? void 0 : engine.block)) return false;
    const pageIds = engine.block.findByType("page") || [];
    for (let index = 0; index < pageIds.length; index += 1) {
      const pageId = pageIds[index];
      const safe = getPageSafeZoneGlobal(engine, pageId, index + 1);
      if (pageHasMarginViolation(engine, pageId, safe)) {
        return true;
      }
    }
    return false;
  }
  function setMarginsWarning(instance, value) {
    if (!(instance == null ? void 0 : instance.publishState)) return;
    instance.publishState("margins_warning", value === true);
  }
  function publishMarginsWarningFromScan(instance) {
    var _a2;
    const engine = (_a2 = instance == null ? void 0 : instance.data) == null ? void 0 : _a2.engine;
    if (!engine) {
      setMarginsWarning(instance, false);
      return false;
    }
    try {
      const hasViolation = scanMarginViolations(engine);
      setMarginsWarning(instance, hasViolation);
      return hasViolation;
    } catch (err2) {
      console.error("IMG.LY View: scan marges", err2);
      setMarginsWarning(instance, false);
      return false;
    }
  }
  var BOUNDS_EPSILON_MM, MIN_CONTENT_SIZE_MM;
  var init_margin_warning = __esm({
    "plugins/imgly/imgly-view/src/margin-warning.js"() {
      init_booklet_layout();
      init_safety_margins();
      BOUNDS_EPSILON_MM = 0.05;
      MIN_CONTENT_SIZE_MM = 0.01;
    }
  });

  // plugins/imgly/imgly-view/src/scene.js
  function applyBookletPagePositions(engine, layout) {
    if (!(engine == null ? void 0 : engine.block) || !Array.isArray(layout) || layout.length === 0) return;
    const pageIds = getPageIds(engine);
    if (pageIds.length !== layout.length) return;
    pageIds.forEach((pageId, index) => {
      const spec = layout[index];
      if (!spec) return;
      try {
        engine.block.setWidthMode(pageId, "Absolute");
        engine.block.setHeightMode(pageId, "Absolute");
        engine.block.setPositionXMode(pageId, "Absolute");
        engine.block.setPositionYMode(pageId, "Absolute");
        engine.block.setWidth(pageId, spec.width);
        engine.block.setHeight(pageId, spec.height);
        engine.block.setPositionX(pageId, spec.x);
        engine.block.setPositionY(pageId, spec.y);
      } catch (e2) {
      }
    });
  }
  function ensureBookletGuides(engine, layout) {
    if (!Array.isArray(layout) || layout.length === 0) return;
    const pageIds = getPageIds(engine);
    if (pageIds.length !== layout.length) return;
    pageIds.forEach((pageId, index) => {
      const spec = layout[index];
      try {
        engine.block.setClipped(pageId, true);
      } catch (e2) {
      }
      hidePageCanvasBorder(engine, pageId);
      if (spec == null ? void 0 : spec.name) {
        try {
          engine.block.setName(pageId, spec.name);
        } catch (e2) {
        }
      }
    });
    syncInnerSafetyMarginGuides(engine, layout);
  }
  function getPageIds(engine) {
    if (!engine || !engine.block || typeof engine.block.findByType !== "function") return [];
    return engine.block.findByType("page") || [];
  }
  function getPageParent(engine) {
    const scene = engine.scene.get();
    if (scene == null) return null;
    const stacks = engine.block.findByType("stack") || [];
    return stacks.length > 0 ? stacks[0] : scene;
  }
  function createBookletPage(engine, parent, spec) {
    const page = engine.block.create("page");
    engine.block.setWidthMode(page, "Absolute");
    engine.block.setHeightMode(page, "Absolute");
    engine.block.setPositionXMode(page, "Absolute");
    engine.block.setPositionYMode(page, "Absolute");
    engine.block.setWidth(page, spec.width);
    engine.block.setHeight(page, spec.height);
    engine.block.setPositionX(page, spec.x);
    engine.block.setPositionY(page, spec.y);
    engine.block.setClipped(page, true);
    engine.block.setBool(page, "selectionEnabled", false);
    engine.block.setScopeEnabled(page, "lifecycle/destroy", false);
    hidePageCanvasBorder(engine, page);
    if (spec.name) {
      engine.block.setName(page, spec.name);
    }
    engine.block.appendChild(parent, page);
    return page;
  }
  function ensureBookletSceneLayout(engine, layout) {
    if (!(engine == null ? void 0 : engine.scene) || typeof engine.scene.setLayout !== "function") return;
    if (!Array.isArray(layout) || layout.length === 0) return;
    if (getPageIds(engine).length !== layout.length) return;
    try {
      if (engine.scene.getLayout() !== BOOKLET_SCENE_LAYOUT) {
        for (const pageId of getPageIds(engine)) {
          try {
            engine.block.setBool(pageId, "transformLocked", false);
          } catch (e2) {
          }
        }
        engine.scene.setLayout(BOOKLET_SCENE_LAYOUT);
      }
      applyBookletPagePositions(engine, layout);
    } catch (err2) {
      console.warn("IMG.LY View: ensureBookletSceneLayout failed", err2);
    }
  }
  function syncPageCountToLayout(engine, layout) {
    if (!(engine == null ? void 0 : engine.block) || !Array.isArray(layout) || layout.length === 0) {
      return { changed: false };
    }
    const pageIds = getPageIds(engine);
    const expected = layout.length;
    if (pageIds.length === expected) {
      return { changed: false };
    }
    if (pageIds.length > expected) {
      for (const pageId of pageIds.slice(expected)) {
        try {
          engine.block.setScopeEnabled(pageId, "lifecycle/destroy", true);
          engine.block.destroy(pageId);
        } catch (e2) {
        }
      }
    } else {
      const parent = getPageParent(engine);
      if (parent == null) return { changed: false };
      for (let i2 = pageIds.length; i2 < expected; i2 += 1) {
        const spec = layout[i2];
        if (!spec) continue;
        createBookletPage(engine, parent, spec);
      }
    }
    return { changed: true };
  }
  function finalizeBookletScene(instance, layout) {
    return __async(this, null, function* () {
      const engine = instance.data.engine;
      if (!engine) return { changed: false };
      const { changed } = syncPageCountToLayout(engine, layout);
      instance.data.pageIds = getPageIds(engine);
      ensureBookletSceneLayout(engine, layout);
      ensureBookletGuides(engine, layout);
      hideAllPageCanvasBorders(engine);
      ensureAllBlocksIncludedInExport(engine);
      lockPageDeletion(engine);
      lockPageSelection(engine);
      if (changed) {
        const { publishSceneJson: publishSceneJson2 } = yield Promise.resolve().then(() => (init_exports(), exports_exports));
        yield publishSceneJson2(instance, { force: true, skipPreviews: true });
      } else if (typeof engine.scene.saveToString === "function") {
        try {
          const sceneString = yield engine.scene.saveToString();
          if (typeof sceneString === "string" && sceneString.length > 0) {
            instance.data._lastPublishedCanvasJson = sceneString;
          }
        } catch (e2) {
        }
      }
      return { changed };
    });
  }
  function fitSceneInView(cesdk) {
    if (!cesdk || !cesdk.actions || typeof cesdk.actions.run !== "function") {
      return Promise.resolve();
    }
    return Promise.resolve(
      cesdk.actions.run("zoom.toPage", { page: "first", autoFit: true })
    ).catch((err2) => {
      console.error("IMG.LY View: zoom.toPage failed", err2);
    });
  }
  function createBookletScene(_cesdk, engine, sheetCount) {
    return __async(this, null, function* () {
      if (!engine || !engine.scene || !engine.block) return [];
      const layout = buildBookletPageLayout(sheetCount);
      engine.scene.create(BOOKLET_SCENE_LAYOUT);
      if (typeof engine.scene.setDesignUnit === "function") {
        engine.scene.setDesignUnit("Millimeter");
      }
      if (typeof engine.scene.setMode === "function") {
        engine.scene.setMode("Design");
      }
      const scene = engine.scene.get();
      if (scene == null) return [];
      engine.block.setFloat(scene, "scene/dpi", 300);
      engine.block.setFloat(scene, "scene/pageDimensions/width", layout[0].width);
      engine.block.setFloat(scene, "scene/pageDimensions/height", layout[0].height);
      for (const pageId of getPageIds(engine)) {
        try {
          engine.block.destroy(pageId);
        } catch (e2) {
        }
      }
      const parent = getPageParent(engine);
      if (parent == null) return [];
      for (const spec of layout) {
        createBookletPage(engine, parent, spec);
      }
      ensureBookletSceneLayout(engine, layout);
      ensureBookletGuides(engine, layout);
      hideAllPageCanvasBorders(engine);
      ensureAllBlocksIncludedInExport(engine);
      lockPageDeletion(engine);
      lockPageSelection(engine);
      return getPageIds(engine);
    });
  }
  function syncScenePageCount(instance) {
    return __async(this, null, function* () {
      var _a2;
      const engine = instance.data.engine;
      if (!engine) return false;
      const layout = buildBookletPageLayout((_a2 = instance.data.sheetCount) != null ? _a2 : 1);
      instance.data._suppressCanvasJsonPublish = true;
      instance.data._suppressUnsavedChanges = true;
      try {
        yield finalizeBookletScene(instance, layout);
        yield fitSceneInView(instance.data.cesdk);
        const { setUnsavedChanges: setUnsavedChanges2 } = yield Promise.resolve().then(() => (init_exports(), exports_exports));
        setUnsavedChanges2(instance, false);
        return true;
      } catch (err2) {
        console.error("IMG.LY View: syncScenePageCount failed", err2);
        return false;
      } finally {
        instance.data._suppressUnsavedChanges = false;
      }
    });
  }
  function loadSceneFromString(instance, sceneString) {
    return __async(this, null, function* () {
      var _a2;
      const engine = instance.data.engine;
      if (!engine || !engine.scene || typeof engine.scene.loadFromString !== "function") {
        return false;
      }
      if (typeof sceneString !== "string" || sceneString.trim().length === 0) {
        return false;
      }
      const layout = buildBookletPageLayout((_a2 = instance.data.sheetCount) != null ? _a2 : 1);
      instance.data._suppressCanvasJsonPublish = true;
      instance.data._suppressUnsavedChanges = true;
      try {
        yield engine.scene.loadFromString(sceneString.trim());
        yield finalizeBookletScene(instance, layout);
        yield fitSceneInView(instance.data.cesdk);
        const { setUnsavedChanges: setUnsavedChanges2 } = yield Promise.resolve().then(() => (init_exports(), exports_exports));
        setUnsavedChanges2(instance, false);
        return true;
      } catch (err2) {
        console.error("IMG.LY View: loadFromString failed", err2);
        return false;
      } finally {
        instance.data._suppressUnsavedChanges = false;
      }
    });
  }
  var init_scene = __esm({
    "plugins/imgly/imgly-view/src/scene.js"() {
      init_booklet_layout();
      init_export_lock();
      init_safety_margins();
    }
  });

  // plugins/imgly/imgly-view/src/exports.js
  var exports_exports = {};
  __export(exports_exports, {
    createPagePreviews: () => createPagePreviews,
    publishSceneJson: () => publishSceneJson,
    schedulePagePreviews: () => schedulePagePreviews,
    scheduleScenePublish: () => scheduleScenePublish,
    setUnsavedChanges: () => setUnsavedChanges,
    triggerPdfExport: () => triggerPdfExport,
    triggerPreviewsZipDownload: () => triggerPreviewsZipDownload,
    triggerSaveDocument: () => triggerSaveDocument,
    wireHistoryListener: () => wireHistoryListener
  });
  function sanitizeFileBase(title) {
    const raw = typeof title === "string" ? title.trim() : "";
    const safe = raw.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "");
    return safe || "document";
  }
  function downloadBlob(blob, fileName) {
    if (!blob || typeof document === "undefined") return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "document.pdf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  function setUnsavedChanges(instance, value) {
    if (!(instance == null ? void 0 : instance.publishState)) return;
    instance.publishState("unsaved_changes", value === true);
  }
  function publishSceneJson(instance, options) {
    const engine = instance.data.engine;
    const force = options && options.force === true;
    const skipPreviews = options && options.skipPreviews === true;
    if (!engine || !engine.scene || typeof engine.scene.saveToString !== "function") {
      return Promise.resolve(false);
    }
    if (!force && instance.data._suppressCanvasJsonPublish === true) return Promise.resolve(false);
    return engine.scene.saveToString().then((sceneString) => {
      if (typeof sceneString !== "string" || sceneString.length === 0) return false;
      if (!force && sceneString === instance.data._lastPublishedCanvasJson) return false;
      instance.data._lastPublishedCanvasJson = sceneString;
      instance.publishState("canvas_json", sceneString);
      instance.triggerEvent("json_changed");
      if (!skipPreviews) {
        schedulePagePreviews(instance);
      }
      return true;
    }).catch((err2) => {
      console.error("IMG.LY View: saveToString failed", err2);
      return false;
    });
  }
  function scheduleScenePublish(instance) {
    if (!instance || !instance.data) return;
    if (instance.data._suppressCanvasJsonPublish === true) return;
    if (instance.data._scheduleScenePublishTimer) {
      clearTimeout(instance.data._scheduleScenePublishTimer);
    }
    instance.data._scheduleScenePublishTimer = setTimeout(() => {
      instance.data._scheduleScenePublishTimer = null;
      publishSceneJson(instance);
    }, SCENE_PUBLISH_DEBOUNCE_MS);
  }
  function schedulePagePreviews(instance) {
    if (!instance || !instance.data) return;
    if (instance.data._suppressCanvasJsonPublish === true) return;
    const d2 = instance.data;
    const sinceLast = Date.now() - (d2._lastPagePreviewsAt || 0);
    const delay = sinceLast < PAGE_PREVIEWS_COOLDOWN_MS ? Math.max(PAGE_PREVIEWS_DEBOUNCE_MS, PAGE_PREVIEWS_COOLDOWN_MS - sinceLast) : PAGE_PREVIEWS_DEBOUNCE_MS;
    if (d2._schedulePagePreviewsTimer) {
      clearTimeout(d2._schedulePagePreviewsTimer);
    }
    d2._schedulePagePreviewsTimer = setTimeout(() => {
      d2._schedulePagePreviewsTimer = null;
      if (typeof d2.createPagePreviews === "function") {
        d2.createPagePreviews();
      }
    }, delay);
  }
  function resolveExportPageIds(instance) {
    const engine = instance.data.engine;
    if (!(engine == null ? void 0 : engine.block)) return [];
    let pageIds = getPageIds(engine);
    if (!pageIds.length) {
      pageIds = instance.data.pageIds || [];
    }
    return pageIds;
  }
  function exportAllPagePreviewPngs(engine, pageIds, base) {
    return __async(this, null, function* () {
      ensureAllBlocksIncludedInExport(engine);
      hideAllPageCanvasBorders(engine);
      const exports = [];
      for (let index = 0; index < pageIds.length; index += 1) {
        try {
          const blob = yield engine.block.export(pageIds[index], {
            mimeType: "image/png",
            targetWidth: 500
          });
          const safeName = `${base}-preview-${String(index + 1).padStart(2, "0")}.png`.replace(/[^\w.-]/g, "_");
          exports.push({ name: safeName, blob });
        } catch (err2) {
          console.error("IMG.LY View: page preview export failed", err2);
        }
      }
      return exports;
    });
  }
  function createPagePreviews(instance) {
    const engine = instance.data.engine;
    const context = instance.data.bubbleContext || null;
    if (!engine || !engine.block) return Promise.resolve([]);
    const pageIds = resolveExportPageIds(instance);
    if (!pageIds.length) return Promise.resolve([]);
    const base = sanitizeFileBase(instance.data.documentTitle);
    const runId = (instance.data._pagePreviewsRunId || 0) + 1;
    instance.data._pagePreviewsRunId = runId;
    instance.data._lastPagePreviewsAt = Date.now();
    return exportAllPagePreviewPngs(engine, pageIds, base).then((items) => {
      const exportOne = (item) => uploadBlob(context, item.name, item.blob).catch((err2) => {
        console.error("IMG.LY View: page preview upload failed", err2);
        return "";
      });
      return Promise.all(items.map(exportOne));
    }).then((uploaded) => {
      if (instance.data._pagePreviewsRunId !== runId) return uploaded;
      instance.data._lastPreviewedSceneKey = instance.data._lastPublishedCanvasJson || "";
      const urls = uploaded.filter((u2) => typeof u2 === "string" && u2.length > 0);
      instance.publishState("page_previews", urls);
      if (urls.length > 0) {
        instance.triggerEvent("page_previews_ready");
      } else {
        console.warn("IMG.LY View: previews upload\xE9es sans URL exploitable \u2014 page_previews_ready non d\xE9clench\xE9");
      }
      return urls;
    }).catch((err2) => {
      console.error("IMG.LY View: create_page_previews", err2);
      return [];
    });
  }
  function syncSceneBeforePdfExport(instance) {
    return __async(this, null, function* () {
      const engine = instance.data.engine;
      if (!(engine == null ? void 0 : engine.scene) || typeof engine.scene.saveToString !== "function") return;
      try {
        yield engine.scene.saveToString();
      } catch (err2) {
        console.error("IMG.LY View: pre-PDF saveToString failed", err2);
      }
    });
  }
  function triggerSaveDocument(instance) {
    return __async(this, null, function* () {
      if (!instance || !instance.data) return false;
      if (instance.data._saveInProgress === true) return false;
      instance.data._saveInProgress = true;
      try {
        publishMarginsWarningFromScan(instance);
        yield publishSceneJson(instance, { force: true, skipPreviews: true });
        yield createPagePreviews(instance);
        yield triggerPdfExport(instance, { download: false, generateTrimmed: true });
        setUnsavedChanges(instance, false);
        instance.triggerEvent("document_saved");
        return true;
      } catch (err2) {
        console.error("IMG.LY View: enregistrement document", err2);
        return false;
      } finally {
        instance.data._saveInProgress = false;
      }
    });
  }
  function triggerPreviewsZipDownload(instance) {
    return __async(this, null, function* () {
      const engine = instance.data.engine;
      if (!(engine == null ? void 0 : engine.block)) return "";
      const pageIds = resolveExportPageIds(instance);
      if (!pageIds.length) return "";
      const base = sanitizeFileBase(instance.data.documentTitle);
      const safeZipName = `${base}-previews.zip`.replace(/[^\w.-]/g, "_") || "previews.zip";
      try {
        const items = yield exportAllPagePreviewPngs(engine, pageIds, base);
        if (!items.length) return "";
        const zipEntries = {};
        for (const item of items) {
          zipEntries[item.name] = new Uint8Array(yield item.blob.arrayBuffer());
        }
        const zipped = zipSync(zipEntries);
        downloadBlob(new Blob([zipped], { type: "application/zip" }), safeZipName);
        return "downloaded";
      } catch (err2) {
        console.error("IMG.LY View: previews ZIP export failed", err2);
        return "";
      }
    });
  }
  function triggerPdfExport(instance, options) {
    return __async(this, null, function* () {
      const download = !options || options.download !== false;
      const generateTrimmed = (options == null ? void 0 : options.generateTrimmed) === true;
      const mode = (options == null ? void 0 : options.mode) === "sequential" ? "sequential" : "imposed";
      const engine = instance.data.engine;
      const context = instance.data.bubbleContext || null;
      if (!(engine == null ? void 0 : engine.block)) return "";
      let pageIds = getPageIds(engine);
      if (!pageIds.length) {
        pageIds = instance.data.pageIds || [];
      }
      if (!pageIds.length) return "";
      if (mode === "imposed" && pageIds.length % 4 !== 0) {
        console.error("IMG.LY View: PDF export aborted \u2014 page count must be a multiple of 4:", pageIds.length);
        return "";
      }
      ensureAllBlocksIncludedInExport(engine);
      hideAllPageCanvasBorders(engine);
      yield syncSceneBeforePdfExport(instance);
      if (typeof engine.block.forceLoadResources === "function") {
        try {
          yield engine.block.forceLoadResources(pageIds);
        } catch (err2) {
          console.warn("IMG.LY View: forceLoadResources avant export PDF", err2);
        }
      }
      const base = sanitizeFileBase(instance.data.documentTitle);
      const safePdfName = (base + (mode === "sequential" ? ".pdf" : "-impression.pdf")).replace(/[^\w.-]/g, "_") || "document.pdf";
      try {
        const blob = mode === "sequential" ? yield buildSequentialPdf(engine, pageIds) : yield buildFoldedA4Pdf(engine, pageIds);
        const url = yield uploadBlob(context, safePdfName, blob);
        if (mode === "imposed" && typeof url === "string" && url.length > 0) {
          instance.publishState("pdf_url", url);
          instance.triggerEvent("pdf_ready");
        } else if (mode === "imposed" && blob && blob.size > 0) {
          console.warn("IMG.LY View: PDF upload\xE9 dans Bubble mais URL non re\xE7ue \u2014 pdf_ready non d\xE9clench\xE9");
        }
        if (generateTrimmed && mode === "imposed" && blob && blob.size > 0) {
          try {
            const trimmedBlob = yield trimImposedPdfForPrinter(blob);
            const safeTrimmedName = (base + "-trimed-impression.pdf").replace(/[^\w.-]/g, "_") || "document-trimed-impression.pdf";
            const trimmedUrl = yield uploadBlob(context, safeTrimmedName, trimmedBlob);
            if (typeof trimmedUrl === "string" && trimmedUrl.length > 0) {
              instance.publishState("trimed_pdf_url", trimmedUrl);
              instance.triggerEvent("trimed_pdf_ready");
            } else {
              console.warn("IMG.LY View: PDF trim\xE9 upload\xE9 dans Bubble mais URL non re\xE7ue \u2014 trimed_pdf_ready non d\xE9clench\xE9");
            }
          } catch (err2) {
            console.warn("IMG.LY View: \xE9chec g\xE9n\xE9ration/upload PDF trim\xE9 (pdf_url inchang\xE9)", err2);
          }
        }
        if (download) {
          downloadBlob(blob, safePdfName);
        }
        return url || (download ? "downloaded" : "");
      } catch (err2) {
        console.error("IMG.LY View: PDF export failed", err2);
        return "";
      }
    });
  }
  function wireHistoryListener(instance) {
    const engine = instance.data.engine;
    if (!engine || !engine.editor || typeof engine.editor.onHistoryUpdated !== "function") return;
    if (typeof instance.data._unsubscribeHistory === "function") {
      instance.data._unsubscribeHistory();
    }
    instance.data._unsubscribeHistory = engine.editor.onHistoryUpdated(() => {
      if (instance.data._suppressUnsavedChanges === true) return;
      if (instance.data._saveInProgress === true) return;
      setUnsavedChanges(instance, true);
      ensureAllBlocksIncludedInExport(engine);
      lockPageDeletion(engine);
      lockPageSelection(engine);
    });
  }
  var init_exports = __esm({
    "plugins/imgly/imgly-view/src/exports.js"() {
      init_browser();
      init_bubble_upload();
      init_constants();
      init_export_lock();
      init_pdf_imposition();
      init_margin_warning();
      init_scene();
    }
  });

  // plugins/imgly/imgly-view/src/index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });

  // plugins/imgly/imgly-view/src/shims/cesdk-js.js
  function resolveCreativeEditorSDK() {
    const sdk = typeof globalThis.CreativeEditorSDK !== "undefined" ? globalThis.CreativeEditorSDK : null;
    if (sdk && typeof sdk.create === "function") return sdk;
    return null;
  }
  var cesdkLazy = new Proxy(
    {},
    {
      get(_target, prop) {
        const sdk = resolveCreativeEditorSDK();
        if (!sdk) return void 0;
        const value = sdk[prop];
        return typeof value === "function" ? value.bind(sdk) : value;
      }
    }
  );
  var cesdk_js_default = cesdkLazy;

  // plugins/imgly/imgly-view/src/app.js
  init_booklet_layout();

  // plugins/imgly/imgly-view/src/cesdk-content-base-url.js
  var PRODUCTION_CESDK_CONTENT_BASE_URL = "https://poc-studio.github.io/phosphor_icon_picker/public/cesdk-assets/";
  function getCesdkContentBaseURL() {
    if (typeof window !== "undefined") {
      const { hostname, origin } = window.location;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `${origin}/cesdk-assets/`;
      }
    }
    return PRODUCTION_CESDK_CONTENT_BASE_URL;
  }

  // node_modules/@cesdk/cesdk-js/plugins/index.js
  var e = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-blur-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.blur": ["ly.img.blur"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.blur";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var d = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-color-palette-asset-source");
      __publicField(this, "version", "1.61");
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.color.palette": ["ly.img.colors"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.color.palette";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var u = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-crop-presets-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.crop.presets": ["ly.img.cropPresets"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.crop.presets";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var p = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-effects-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.effect": ["ly.img.effect"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.effect";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var b = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-filters-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.filter": ["ly.img.filter"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.filter";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var E = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-sticker-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.sticker": ["ly.img.sticker"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.sticker";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var v = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-text-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.text": ["ly.img.text"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.text";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var U = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-text-component-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.text.components": ["ly.img.text"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.text.components";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var C = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-typeface-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.typeface": ["ly.img.typefaces"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.typeface";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };
  var j = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-vectorshape-asset-source");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      this.config = e2;
    }
    getAssetLibraryEntries(e2) {
      var _a2;
      if ((_a2 = this.config.assetLibraryEntries) == null ? void 0 : _a2[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.vector.shape": ["ly.img.vector.shape", "ly.img.shape.replace"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i2 = new Set(e2.asset.findAllSources()), o = "ly.img.vector.shape";
        if (!i2.has(o)) {
          const s2 = `${r}${o}/content.json`;
          yield e2.asset.addLocalAssetSourceFromJSONURI(s2, { matcher: this.config.include });
        }
        if (this.addedAssetSourceIds.push(o), s) {
          s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
          const t2 = this.getAssetLibraryEntries(o);
          for (const e3 of t2) s.ui.updateAssetLibraryEntry(e3, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, o])] });
        }
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = this.getAssetLibraryEntries(t);
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [];
    }
  };

  // plugins/imgly/imgly-view/src/design-editor/actions.ts
  function setupActions(cesdk) {
    cesdk.actions.register("importScene", (_0) => __async(null, [_0], function* ({ format = "scene" }) {
      if (format === "scene") {
        const scene = yield cesdk.utils.loadFile({
          accept: ".scene",
          returnType: "text"
        });
        yield cesdk.engine.scene.loadFromString(scene);
      } else {
        const blobURL = yield cesdk.utils.loadFile({
          accept: ".zip",
          returnType: "objectURL"
        });
        try {
          yield cesdk.engine.scene.loadFromArchiveURL(blobURL);
        } finally {
          URL.revokeObjectURL(blobURL);
        }
      }
      yield cesdk.actions.run("zoom.toPage", { page: "first" });
    }));
  }

  // plugins/imgly/imgly-view/src/design-editor/features.ts
  var PAGE_BLOCK_TYPE = "//ly.img.ubq/page";
  function isPageBlockSelected(engine) {
    return engine.block.findAllSelected().some(
      (blockId) => engine.block.getType(blockId) === PAGE_BLOCK_TYPE
    );
  }
  function hideWhenPageSelected({
    isPreviousEnable,
    engine
  }) {
    if (!isPreviousEnable()) return false;
    return !isPageBlockSelected(engine);
  }
  var PAGE_APPEARANCE_FEATURES = [
    "ly.img.fill",
    "ly.img.fill.*",
    "ly.img.stroke",
    "ly.img.stroke.*",
    "ly.img.shadow",
    "ly.img.shadow.*",
    "ly.img.crop",
    "ly.img.crop.*",
    "ly.img.opacity",
    "ly.img.blendMode",
    "ly.img.filter",
    "ly.img.adjustment",
    "ly.img.effect",
    "ly.img.blur"
  ];
  var PAGE_UI_FEATURES = [
    "ly.img.duplicate",
    "ly.img.canvas.menu",
    "ly.img.inspector.bar",
    "ly.img.inspector.toggle",
    "ly.img.inspector",
    "ly.img.group",
    "ly.img.replace",
    "ly.img.transform",
    "ly.img.placeholder",
    "ly.img.position",
    "ly.img.combine",
    "ly.img.shape.options"
  ];
  function setupFeatures(cesdk) {
    cesdk.feature.enable([
      // ============================================================================
      // NAVIGATION FEATURES
      // Configure the top navigation bar visibility and controls
      // ============================================================================
      // #region Navigation Features
      "ly.img.navigation",
      // 'ly.img.navigation.bar', /* Navigation Bar visibility */
      // 'ly.img.navigation.back', /* "Back" button */
      // 'ly.img.navigation.close', /* "Close" button */
      // 'ly.img.navigation.undoRedo', /* "Undo" and "Redo" buttons */
      // 'ly.img.navigation.zoom', /* Zoom controls */
      // 'ly.img.navigation.actions', /* Actions dropdown */
      // 'ly.img.navigation.documentSettings', /* Document settings button */
      // #endregion
      // ============================================================================
      // TEXT FEATURES
      // Configure text editing capabilities
      // ============================================================================
      // #region Text Features
      "ly.img.text",
      // 'ly.img.text.edit', /* Edit button in Canvas Menu */
      // 'ly.img.text.typeface', /* Typeface dropdown */
      // 'ly.img.text.fontSize', /* Font Size input */
      // 'ly.img.text.fontStyle', /* Bold and Italic toggles */
      // 'ly.img.text.decoration', /* Underline and Strikethrough toggles */
      // 'ly.img.text.alignment', /* Text Horizontal Alignment */
      // 'ly.img.text.list', /* List style (bullets/numbered) */
      // 'ly.img.text.list.unordered', /* Bulleted list */
      // 'ly.img.text.list.ordered', /* Numbered list */
      // 'ly.img.text.advanced', /* Advanced text controls */
      // 'ly.img.text.background', /* Text background controls */
      // 'ly.img.text.background.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
      // 'ly.img.text.background.picker.opacity', /* Alpha/opacity slider */
      // 'ly.img.text.background.library', /* Swatch library */
      // #endregion
      // ============================================================================
      // CROP FEATURES
      // Configure image and block cropping capabilities
      // ============================================================================
      // #region Crop Features
      "ly.img.crop",
      // 'ly.img.crop.size', /* Crop size controls */
      // 'ly.img.crop.rotation', /* Crop rotation controls */
      // 'ly.img.crop.flip', /* Crop flip controls */
      // 'ly.img.crop.fillMode', /* Crop fill mode controls */
      // 'ly.img.crop.fillAlignment', /* Crop fill alignment controls */
      // 'ly.img.crop.scale', /* Crop scale controls */
      // 'ly.img.crop.position', /* Crop position controls */
      // 'ly.img.crop.panel.autoOpen', /* Auto-open crop panel on crop mode */
      // #endregion
      // ============================================================================
      // TRANSFORM FEATURES
      // Configure block position, size, and rotation controls
      // ============================================================================
      // #region Transform Features
      "ly.img.transform",
      // 'ly.img.transform.position', /* X and Y position controls */
      // 'ly.img.transform.size', /* Width and height controls */
      // 'ly.img.transform.rotation', /* Rotation controls */
      // 'ly.img.transform.flip', /* Flip controls */
      // #endregion
      // ============================================================================
      // EFFECTS FEATURES
      // Configure visual effects and adjustments
      // ============================================================================
      // #region Effects Features
      "ly.img.filter",
      "ly.img.adjustment",
      "ly.img.effect",
      "ly.img.blur",
      "ly.img.shadow",
      // 'ly.img.shadow.color', /* Shadow color picker */
      // 'ly.img.shadow.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
      // 'ly.img.shadow.color.picker.opacity', /* Alpha/opacity slider */
      // 'ly.img.shadow.color.library', /* Swatch library */
      // 'ly.img.shadow.offset', /* Shadow angle and distance */
      // 'ly.img.shadow.blur', /* Shadow blur radius */
      "ly.img.cutout",
      // #endregion
      // ============================================================================
      // CANVAS FEATURES
      // Configure the canvas area and context menu
      // ============================================================================
      // #region Canvas Features
      "ly.img.canvas",
      // 'ly.img.canvas.bar', /* Canvas Bar visibility */
      // 'ly.img.canvas.menu', /* Canvas Menu visibility */
      // #endregion
      // ============================================================================
      // INSPECTOR FEATURES
      // Configure the inspector panel and toolbar
      // ============================================================================
      // #region Inspector Features
      "ly.img.inspector",
      "ly.img.inspector.bar",
      "ly.img.inspector.toggle",
      // #endregion
      // ============================================================================
      // GENERAL EDITING FEATURES
      // Configure common editing operations
      // ============================================================================
      // #region General Editing Features
      "ly.img.delete",
      "ly.img.duplicate",
      "ly.img.group",
      // 'ly.img.group.create', /* Group multiple blocks */
      // 'ly.img.group.ungroup', /* Dissolve group */
      // 'ly.img.group.enter', /* Enter group for editing */
      // 'ly.img.group.select', /* Select parent group */
      "ly.img.replace",
      // 'ly.img.replace.fill', /* Replace image/video fill content */
      // 'ly.img.replace.shape', /* Replace block shape */
      // 'ly.img.replace.audio', /* Replace audio block content */
      // #endregion
      // ============================================================================
      // PAGE FEATURES
      // Configure multi-page functionality
      // ============================================================================
      // #region Page Features
      "ly.img.page",
      // 'ly.img.page.move', /* Move Up/Down/Left/Right buttons */
      // 'ly.img.page.add', /* Add Page button in Canvas Bar */
      // 'ly.img.page.resize', /* Resize button and page formats */
      // 'ly.img.page.settings', /* Read-only page dimensions, unit, and resolution */
      // 'ly.img.page.bleedMargin', /* Bleed margin controls */
      // 'ly.img.page.clipContent', /* Clip content on/off toggle */
      // #endregion
      // ============================================================================
      // SCENE FEATURES
      // Configure scene layout options
      // ============================================================================
      // #region Scene Features
      // Layout vertical imposé côté scène — pas de toggle horizontal/vertical/free.
      // 'ly.img.scene.layout',
      // #endregion
      // ============================================================================
      // STYLING FEATURES
      // Configure block appearance options
      // ============================================================================
      // #region Styling Features
      // 'ly.img.fill' /* Fill button and Fill Panel */,
      "ly.img.fill.color",
      // 'ly.img.fill.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
      // 'ly.img.fill.color.picker.gradient', /* Gradient mode selector and stops editor */
      // 'ly.img.fill.color.picker.opacity', /* Alpha/opacity slider */
      // 'ly.img.fill.color.library', /* Swatch library */
      "ly.img.fill.image",
      // 'ly.img.fill.video', /* Video fill, trim, volume, speed */
      "ly.img.stroke",
      // 'ly.img.stroke.color', /* Stroke color picker */
      // 'ly.img.stroke.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
      // 'ly.img.stroke.color.picker.opacity', /* Alpha/opacity slider */
      // 'ly.img.stroke.color.library', /* Swatch library */
      // 'ly.img.stroke.width', /* Stroke width input */
      // 'ly.img.stroke.style', /* Stroke style (dash) selector */
      // 'ly.img.stroke.position', /* Inner/center/outer selector */
      // 'ly.img.stroke.cornerGeometry', /* Corner join geometry */
      // 'ly.img.stroke.cap', /* Stroke end caps (start/end) */
      // 'ly.img.stroke.dash', /* Custom dash pattern controls */
      "ly.img.opacity",
      "ly.img.blendMode",
      "ly.img.shape.options",
      // 'ly.img.shape.edit', /* Edit Path button in Shape Options (advanced editors only) */
      // 'ly.img.vectorEdit', /* Vector edit controls (parent) */
      // 'ly.img.vectorEdit.moveMode', /* Move/select mode toggle */
      // 'ly.img.vectorEdit.addMode', /* Add node mode toggle */
      // 'ly.img.vectorEdit.deleteMode', /* Delete node mode toggle */
      // 'ly.img.vectorEdit.bendMode', /* Bend mode toggle */
      // 'ly.img.vectorEdit.mirrorMode', /* Handle mirror mode dropdown */
      // 'ly.img.vectorEdit.done', /* Exit vector edit button */
      // 'ly.img.shape.options.cornerRadius', /* Corner radius (rect/polygon) */
      // 'ly.img.shape.options.points', /* Star point count */
      // 'ly.img.shape.options.innerDiameter', /* Star inner diameter */
      // 'ly.img.shape.options.sides', /* Polygon side count */
      // 'ly.img.shape.options.lineWidth', /* Line stroke width */
      "ly.img.combine",
      // 'ly.img.combine.union', /* Union boolean operation */
      // 'ly.img.combine.subtract', /* Subtract boolean operation */
      // 'ly.img.combine.intersect', /* Intersect boolean operation */
      // 'ly.img.combine.exclude', /* Exclude/XOR boolean operation */
      "ly.img.position",
      // 'ly.img.position.arrange', /* Bring forward/backward/front/back */
      // 'ly.img.position.align', /* Align left/right/center/top/bottom */
      // 'ly.img.position.distribute', /* Distribute vertically/horizontally */
      "ly.img.trim",
      // #endregion
      // ============================================================================
      // NOTIFICATION FEATURES
      // Configure user feedback notifications
      // ============================================================================
      // #region Notification Features
      "ly.img.notifications",
      // 'ly.img.notifications.undo', /* Undo notifications */
      // 'ly.img.notifications.redo', /* Redo notifications */
      // #endregion
      // ============================================================================
      // DOCK AND LIBRARY FEATURES
      // Configure the asset dock and library panels
      // ============================================================================
      // #region Dock and Library Features
      "ly.img.dock",
      "ly.img.library.panel"
      /* Asset Library panel */
      // #endregion
      // ============================================================================
      // PLACEHOLDER FEATURES
      // Uncomment to enable template placeholder functionality
      // ============================================================================
      // #region Placeholder Features
      // 'ly.img.placeholder', /* Placeholder button in Canvas Menu */
      // 'ly.img.placeholder.general', /* General section (opacity, blend, etc.) */
      // 'ly.img.placeholder.general.opacity', /* Opacity option */
      // 'ly.img.placeholder.general.blendMode', /* Blend Mode option */
      // 'ly.img.placeholder.general.duplicate', /* Duplicate option */
      // 'ly.img.placeholder.general.delete', /* Delete option */
      // 'ly.img.placeholder.arrange', /* Arrange section */
      // 'ly.img.placeholder.arrange.move', /* Move option */
      // 'ly.img.placeholder.arrange.resize', /* Resize option */
      // 'ly.img.placeholder.arrange.rotate', /* Rotate option */
      // 'ly.img.placeholder.arrange.flip', /* Flip option */
      // 'ly.img.placeholder.fill', /* Fill section */
      // 'ly.img.placeholder.fill.change', /* Change Fill option */
      // 'ly.img.placeholder.fill.changeType', /* Change Fill Type option */
      // 'ly.img.placeholder.fill.actAsPlaceholder', /* Act as Placeholder option */
      // 'ly.img.placeholder.fill.crop', /* Crop option */
      // 'ly.img.placeholder.shape', /* Shape section */
      // 'ly.img.placeholder.shape.change', /* Change Shape option */
      // 'ly.img.placeholder.stroke', /* Stroke section */
      // 'ly.img.placeholder.stroke.change', /* Change Stroke option */
      // 'ly.img.placeholder.text', /* Text section */
      // 'ly.img.placeholder.text.edit', /* Edit Text option */
      // 'ly.img.placeholder.text.actAsPlaceholder', /* Act as Placeholder option */
      // 'ly.img.placeholder.text.character', /* Character option */
      // 'ly.img.placeholder.appearance', /* Appearance section */
      // 'ly.img.placeholder.appearance.adjustments', /* Adjustments option */
      // 'ly.img.placeholder.appearance.filter', /* Filter option */
      // 'ly.img.placeholder.appearance.effect', /* Effect option */
      // 'ly.img.placeholder.appearance.blur', /* Blur option */
      // 'ly.img.placeholder.appearance.shadow', /* Shadow option */
      // 'ly.img.placeholder.appearance.animations', /* Animations option */
      // 'ly.img.preview', /* Preview button (Creator role only) */
      // #endregion
      // ============================================================================
      // VIDEO FEATURES
      // Uncomment to enable video editing functionality
      // ============================================================================
      // #region Video Features
      // 'ly.img.video.timeline', /* Video Timeline visibility */
      // 'ly.img.video.timeline.ruler', /* Timeline ruler/time scale */
      // 'ly.img.video.timeline.clips', /* Clips track in timeline */
      // 'ly.img.video.timeline.overlays', /* Overlays track in timeline */
      // 'ly.img.video.timeline.audio', /* Audio track in timeline */
      // 'ly.img.video.timeline.addClip', /* Add clips to timeline */
      // 'ly.img.video.timeline.controls', /* Base video control UI */
      // 'ly.img.video.timeline.controls.toggle', /* Timeline collapse/expand toggle */
      // 'ly.img.video.timeline.controls.background', /* Background color controls */
      // 'ly.img.video.timeline.controls.playback', /* Play/pause and timestamp */
      // 'ly.img.video.timeline.controls.loop', /* Loop toggle */
      // 'ly.img.video.timeline.controls.split', /* Split clip control */
      // 'ly.img.video.timeline.controls.timelineZoom', /* Timeline zoom controls */
      // 'ly.img.video.caption', /* Video captions */
      // 'ly.img.volume', /* Volume control (video mode) */
      // 'ly.img.playbackSpeed', /* Playback speed control */
      // 'ly.img.animations', /* Animations button (video mode) */
      // #endregion
      // ============================================================================
      // DEVELOPMENT FEATURES
      // Uncomment for development and debugging
      // ============================================================================
      // #region Development Features
      // 'ly.img.settings', /* Quick settings menu for development */
      // #endregion
      // ============================================================================
      // GRID & RULERS
      // Uncomment to enable rulers and grid overlay
      // ============================================================================
      // 'ly.img.rulers', /* Grid overlay, snap-to-grid, and canvas rulers */
    ]);
    cesdk.feature.disable([
      "ly.img.navigation.actions",
      "ly.img.page.resize",
      "ly.img.page.settings",
      "ly.img.page.add",
      "ly.img.page.move",
      "ly.img.page.clipContent",
      "ly.img.page.bleedMargin",
      "ly.img.scene.layout",
      "ly.img.scene.layout.horizontal",
      "ly.img.scene.layout.vertical",
      "ly.img.scene.layout.free"
    ]);
    const hideOnPage = [
      ...PAGE_APPEARANCE_FEATURES,
      ...PAGE_UI_FEATURES,
      "ly.img.delete"
    ];
    for (const featureId of hideOnPage) {
      cesdk.feature.set(featureId, hideWhenPageSelected);
    }
  }

  // plugins/imgly/imgly-view/src/i18n/fr.json
  var fr_default = {
    "action.block.delete": "$t(common.delete)",
    "action.block.delete_plural": "$t(common.delete) ({{count}})",
    "action.block.duplicate": "$t(common.duplicate)",
    "action.block.lock": "$t(common.lock)",
    "action.block.unlock": "$t(common.unlock)",
    "action.editText": "$t(common.edit)",
    "action.position": "$t(common.position)",
    "action.strokeStyle.change": "$t(property.strokeStyle.description)",
    "common.axis.x": "X",
    "common.axis.y": "Y",
    "common.cmyk": "CMYK",
    "common.dpi": "DPI",
    "common.rotateAndFlip": "$t(common.rotation) & $t(property.flip)",
    "common.rotation.inUnit": "$t(common.rotation) in degrees",
    "common.srgb": "RGB",
    "component.assetSettings.opacity": "$t(common.opacity)",
    "component.audio.trim.play": "$t(common.play)",
    "component.audio.trim.play.description": "$t(common.play) trimmed audio",
    "component.contentFill": "$t(common.fill)",
    "component.contentFill.color": "$t(common.color)",
    "component.contentFill.image": "$t(common.image)",
    "component.contentFill.video": "$t(common.video)",
    "component.fileOperation.save": "$t(common.save)",
    "component.inspectorPositionSelect": "$t(common.position)",
    "component.librarySettings.templateLibrary": "$t(component.templateLibrary)",
    "component.placeholder.arrange": "$t(common.arrange)",
    "component.placeholder.create": "$t(common.placeholder)",
    "component.placeholder.fill": "$t(common.fill)",
    "component.placeholder.settingsMenu": "$t(common.placeholder) settings menu",
    "component.roleSelect": "$t(common.role)",
    "component.themeSelect.dialog.description": "$t(component.themeSelect.dialog)",
    "component.timeline.pause.description": "$t(common.pause) complete video",
    "component.timeline.play.description": "$t(common.play) complete video",
    "component.topbar.back": "$t(common.back)",
    "component.topbar.close": "$t(common.close)",
    "component.undo.redo": "$t(common.redo)",
    "component.undo.undo": "$t(common.undo)",
    "component.video.trim.play": "$t(common.play)",
    "component.video.trim.play.description": "$t(common.play) trimmed video",
    "element.transform.resize": "$t(action.block.resize)",
    "element.transform.rotate": "$t(action.block.rotate)",
    "input.caption.delete": "$t(common.delete)",
    "input.caption.deleteAll": "$t(common.delete) all",
    "input.page.titleTemplate": "$t(common.page) {{number}}",
    "input.text.advanced": "$t(common.advanced)",
    "input.transform": "$t(common.position) & $t(common.size)",
    "inspector.view.placeholder": "$t(common.placeholder)",
    "libraries.ly.img.page.presets.x.label": "X",
    "libraries.ly.img.templates.premium.confirmation.abort": "$t(common.cancel)",
    "libraries.ly.img.templates.confirmation.abort": "$t(common.cancel)",
    "notification.redo": "$t(common.redo)",
    "notification.undo": "$t(common.undo)",
    "property.crop.transform": "$t(block.image)",
    "property.fill.solid.color": "$t(property.fill)",
    "property.lutFilter.k1": "K1",
    "property.lutFilter.k6": "K6",
    "property.strokePosition": "$t(common.position)",
    "property.strokePositionAndCornerGeometry": "$t(property.strokePosition) & $t(property.strokeCornerGeometry)",
    "action.align": "Aligner",
    "action.align.bottom": "Bas",
    "action.align.bottom.description": "Aligner le bas",
    "action.align.elements": "Aligner les \xE9l\xE9ments",
    "action.align.horizontalCenter": "Centre",
    "action.align.horizontalCenter.description": "Alignement au centre (horizontal)",
    "action.align.left": "Gauche",
    "action.align.left.description": "Aligner \xE0 gauche",
    "action.align.right": "Droite",
    "action.align.right.description": "Aligner \xE0 droite",
    "action.align.toPage": "Aligner sur la page",
    "action.align.top": "Haut",
    "action.align.top.description": "Aligner en haut",
    "action.align.verticalCenter": "Milieu",
    "action.align.verticalCenter.description": "Aligner le centre (vertical)",
    "action.arrange": "D\xE9placer",
    "action.arrange.alwaysOnBottom": "Correction \xE0 l'arri\xE8re",
    "action.arrange.alwaysOnTop": "Corriger au premier plan",
    "action.arrange.bringForward": "Avant",
    "action.arrange.moveLeft": "D\xE9placer vers la gauche",
    "action.arrange.moveRight": "D\xE9placer vers la droite",
    "action.arrange.sendBackward": "Reculer",
    "action.arrange.toBack": "Pour revenir en arri\xE8re",
    "action.arrange.toFront": "Au premier plan",
    "action.audio.delete": "Supprimer l'audio",
    "action.audio.duplicate": "Dupliquer l'audio",
    "action.audio.replace": "Remplacer l'audio",
    "action.backgroundClip.add": "Ajouter un clip d'arri\xE8re-plan",
    "action.block.add": "Ajouter un \xE9l\xE9ment",
    "action.block.copy": "Copier l'\xE9l\xE9ment",
    "action.block.flipX": "Inverser l'\xE9l\xE9ment (horizontal)",
    "action.block.flipY": "Inverser l'\xE9l\xE9ment (vertical)",
    "action.block.lock.description": "\xC9l\xE9ment de verrouillage",
    "action.block.move": "D\xE9placer l'\xE9l\xE9ment",
    "action.block.paste": "Coller l'\xE9l\xE9ment",
    "action.block.rename": "Renommer l'\xE9l\xE9ment",
    "action.block.resize": "Redimensionner l'\xE9l\xE9ment",
    "action.block.rotate": "Faire pivoter l'\xE9l\xE9ment",
    "action.block.toggleVisibility": "(Un)masquer l'\xE9l\xE9ment",
    "action.block.unlock.description": "D\xE9verrouiller l'\xE9l\xE9ment",
    "action.clip.add": "Ajouter un clip",
    "action.closeInspector": "Fermer l'inspecteur",
    "action.continue": "Continuer",
    "action.convertToCMYK": "Convertir en CMJN",
    "action.crop.contentFillMode": "Modifier le mode de remplissage du contenu",
    "action.crop.exit": "Quitter le mode de recadrage",
    "action.crop.mirrorX": "Image miroir horizontalement",
    "action.crop.mirrorY": "Miroir l'image verticalement",
    "action.crop.reset": "R\xE9initialiser les param\xE8tres de recadrage",
    "action.crop.turn": "Tournez l'image de 90 \xB0 dans le sens inverse des aiguilles d'une montre",
    "action.crop.turnAndMirror": "Tourner et miroir",
    "action.cutoutOffset.change": "Changer $t(input.cutoutOffset)",
    "action.cutoutSmoothing.change": "Changer $t(input.cutoutSmoothing)",
    "action.cutoutType.change": "Modifier $t(input.cutoutType)",
    "action.distribute": "Distribuer",
    "action.distribute.horizontally": "Horizontalement",
    "action.distribute.horizontally.description": "Distribuer horizontalement",
    "action.distribute.vertically": "Vertically",
    "action.distribute.vertically.description": "Distribute vertically",
    "action.dontShowOnStartup": "Ne pas afficher au d\xE9marrage",
    "action.effect.add": "Appliquer l'effet",
    "action.effect.remove": "Supprimer l'effet",
    "action.enterGroup": "Entrer le groupe",
    "action.fillType.change": "Modifier le type de remplissage",
    "action.filter.add": "Appliquer le filtre",
    "action.filter.remove": "Supprimer le filtre",
    "action.gradient.addStop": "Ajouter un nouvel arr\xEAt \xE0 {{position}}\xA0%",
    "action.gradient.removeStop": "Supprimer la couleur",
    "action.group": "Groupe",
    "action.image.blur": "Appliquer le flou",
    "action.image.crop": "Recadrer l'image",
    "action.image.effect": "Appliquer l'effet",
    "action.image.filter": "Appliquer le filtre",
    "action.image.inpainting": "Inpaint",
    "action.image.matting": "Supprimer l'arri\xE8re-plan",
    "action.image.matting.staging": "Supprimer l'arri\xE8re-plan (mise en sc\xE8ne)",
    "action.image.replace": "Remplacer l'image",
    "action.image.smartCrop": "Recadrage intelligent",
    "action.image.smartImage": "Fonctionnalit\xE9s intelligentes",
    "action.image.smartImage.description": "Actions des fonctionnalit\xE9s intelligentes",
    "action.image.superResolution": "Super-R\xE9solution",
    "action.loop.disable": "D\xE9sactiver la boucle",
    "action.loop.enable": "Activer la boucle",
    "action.mute": "Muet",
    "action.page.add": "Ajouter une page",
    "action.page.changeFormat": "Modifier le format de la page",
    "action.page.delete": "Supprimer la page",
    "action.pageMove.down": "D\xE9placer vers le bas",
    "action.pageMove.down.description": "D\xE9placer la page vers le bas",
    "action.pageMove.left": "D\xE9placer vers la gauche",
    "action.pageMove.left.description": "D\xE9placer la page vers la gauche",
    "action.pageMove.right": "D\xE9placer vers la droite",
    "action.pageMove.right.description": "D\xE9placer la page vers la droite",
    "action.pageMove.up": "Monter",
    "action.pageMove.up.description": "Remonter la page",
    "action.placeholder.change": "Modifier les contraintes $t(common.placeholder)",
    "action.placeholder.create": "Cr\xE9er $t(common.placeholder)",
    "action.placeholder.remove": "Supprimer $t(common.placeholder)",
    "action.property.reset": "R\xE9initialiser les propri\xE9t\xE9s de l'\xE9l\xE9ment par d\xE9faut",
    "action.property.update": "Mettre \xE0 jour la propri\xE9t\xE9 de l'\xE9l\xE9ment",
    "action.resize": "Redimensionner",
    "action.scene.load": "Charger la sc\xE8ne",
    "action.scene.new": "Nouvelle sc\xE8ne",
    "action.selectGroup": "S\xE9lectionner un groupe",
    "action.setAsClip": "D\xE9finir comme clip",
    "action.setAsOverlay": "D\xE9finir comme superposition",
    "action.shadow.angle.change": "Modifier l'angle de l'ombre",
    "action.shadow.angle.rotate": "Faire pivoter l'ombre de 45\xA0degr\xE9s dans le sens des aiguilles d'une montre",
    "action.shadow.blur.change": "Modifier le flou de l'ombre",
    "action.shadow.color.change": "Changer la couleur de l'ombre",
    "action.shadow.distance.change": "Modifier la distance de l'ombre",
    "action.shape.replace": "Remplacer la forme",
    "action.showInspector": "Afficher l'inspecteur",
    "action.showOnStartup": "Rappelez-moi encore au d\xE9marrage",
    "action.splitClip": "Partager le clip",
    "action.splitClip.description": "Partager le clip \xE0 l'heure actuelle",
    "action.strokeCornerGeometry.change": "Change stroke joins",
    "action.strokePosition.change": "Change stroke position",
    "action.text.autoHeight": "Activer la hauteur automatique",
    "action.text.autoHeight.automatic": "La hauteur de cadre automatique a \xE9t\xE9 activ\xE9e",
    "action.text.autoHeight.notification": "Comportement du cadre d\xE9fini sur Hauteur automatique",
    "action.text.autoSize": "Activer la taille automatique",
    "action.text.autoSize.automatic": "La taille d'image automatique a \xE9t\xE9 activ\xE9e",
    "action.text.autoSize.notification": "Comportement du cadre d\xE9fini sur Taille automatique",
    "action.text.change": "Modifier le texte",
    "action.text.changeCase": "Modifier la casse du texte",
    "action.text.fixedFrame": "Activer le cadre fixe",
    "action.text.fixedFrame.automatic": "La hauteur du cadre a \xE9t\xE9 d\xE9finie sur fixe",
    "action.text.fixedFrame.notification": "Comportement du cadre d\xE9fini sur Taille fixe",
    "action.ungroup": "Dissocier",
    "action.unmute": "R\xE9activer le son",
    "action.vectorEdit.editPath": "Modifier le chemin",
    "action.vectorEdit.exit": "Quitter l'\xE9dition vectorielle",
    "action.vectorPath.addMode": "Ajouter",
    "action.vectorPath.addMode.tooltip": "Ajouter des points d'ancrage \xE0 un segment de chemin",
    "action.vectorPath.addNode": "Ajouter un point d'ancrage",
    "action.vectorPath.bendMode": "Plier",
    "action.vectorPath.bendMode.tooltip": "Faites glisser les segments ou cliquez et faites glisser les ancres pour les plier",
    "action.vectorPath.deleteMode": "Supprimer",
    "action.vectorPath.deleteMode.tooltip": "Cliquez pour supprimer les points d'ancrage ou les poign\xE9es",
    "action.vectorPath.deleteNode": "Supprimer le point d'ancrage",
    "action.vectorPath.moveMode": "D\xE9placer",
    "action.vectorPath.moveMode.tooltip": "S\xE9lectionner et d\xE9placer les points d'ancrage et les poign\xE9es",
    "action.video.replace": "Remplacer la vid\xE9o",
    "block.audio": "Audio",
    "block.caption": "L\xE9gende",
    "block.cutout": "D\xE9coupe",
    "block.ellipse": "Ellipse",
    "block.graphic": "Graphique",
    "block.group": "Groupe",
    "block.image": "Image",
    "block.line": "Ligne",
    "block.page": "Page",
    "block.polygon": "Polygone",
    "block.rect": "Rectangle",
    "block.scene": "Document",
    "block.shape": "Forme",
    "block.star": "\xC9toile",
    "block.sticker": "Autocollant",
    "block.text": "Texte",
    "block.vector_path": "Chemin",
    "block.video": "Vid\xE9o",
    "color.aqua": "Aqua",
    "color.black": "Black",
    "color.blue": "Bleu",
    "color.cyan": "Cyan",
    "color.green": "Vert",
    "color.magenta": "Magenta",
    "color.orange": "Orange",
    "color.purple": "Violet",
    "color.red": "Rouge",
    "color.transparent": "Transparent",
    "color.yellow": "Yellow",
    "common.add": "Ajouter",
    "common.advanced": "Avanc\xE9",
    "common.altKey": "Alt",
    "common.arrange": "Organiser",
    "common.back": "Retour",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.color": "Couleur",
    "common.colorValue": "Valeur de couleur",
    "common.confirm": "Confirmer",
    "common.controlKey": "Ctrl",
    "common.custom": "Personnalis\xE9",
    "common.defaultDuration": "Dur\xE9e de la page par d\xE9faut",
    "common.defaultDuration.inUnit": "Dur\xE9e de la page par d\xE9faut en secondes",
    "common.delete": "Supprimer",
    "common.done": "Termin\xE9",
    "common.download": "T\xE9l\xE9charger",
    "common.duplicate": "Dupliquer",
    "common.edit": "Modifier",
    "common.editColor": "Modifier la couleur",
    "common.export": "Exporter",
    "common.fill": "Remplir",
    "common.formats": "Formats",
    "common.height": "Hauteur",
    "common.height.inUnit": "Hauteur en {{unit}}",
    "common.hue": "Teinte",
    "common.image": "Image",
    "common.inch": "Pouces",
    "common.load": "Charger",
    "common.lock": "Verrouiller",
    "common.millimeter": "Millim\xE8tre",
    "common.mixed": "Mixte",
    "common.mode.design": "Conception",
    "common.mode.preview": "Aper\xE7u",
    "common.mode.template": "Mod\xE8le",
    "common.more": "Plus",
    "common.nearestColorName": "Nom de la couleur la plus proche",
    "common.off": "D\xE9sactiv\xE9",
    "common.on": "Activ\xE9",
    "common.opacity": "Opacit\xE9",
    "common.page": "Page",
    "common.pause": "Pause",
    "common.pixel": "Pixel",
    "common.pixelScale": "\xC9chelle de pixels",
    "common.placeholder": "Espace r\xE9serv\xE9",
    "common.play": "Jouer",
    "common.position": "Position",
    "common.presets": "Pr\xE9r\xE9glages",
    "common.properties": "Propri\xE9t\xE9s",
    "common.property": "Propri\xE9t\xE9",
    "common.redo": "R\xE9tablir",
    "common.reloadPage": "Recharger la page",
    "common.replace": "Remplacer",
    "common.reset": "R\xE9initialiser",
    "common.resolution": "R\xE9solution",
    "common.role": "R\xF4le",
    "common.role.adopter": "Adopteur",
    "common.role.creator": "Cr\xE9ateur",
    "common.role.presenter": "Pr\xE9sentateur",
    "common.role.viewer": "Visionneuse",
    "common.rotation": "Rotation",
    "common.save": "Enregistrer",
    "common.select": "S\xE9lectionner",
    "common.shiftKey": "Maj",
    "common.size": "Taille",
    "common.spotColor": "Couleur d'accompagnement",
    "common.style": "Style",
    "common.tint": "Teinte",
    "common.transform": "Transformer",
    "common.trim": "D\xE9couper",
    "common.undo": "Annuler",
    "common.unit": "Unit\xE9",
    "common.unit.description": "Unit\xE9 de mesure",
    "common.unlock": "D\xE9verrouiller",
    "common.video": "Vid\xE9o",
    "common.width": "Largeur",
    "common.width.inUnit": "Largeur en {{unit}}",
    "component.alignAndArrange": "D\xE9placer et aligner",
    "component.assetPanelAutoCloseSettings": "Apr\xE8s l'insertion",
    "component.assetPanelAutoCloseSettings.false": "Garder ouvert",
    "component.assetPanelAutoCloseSettings.false.description": "Gardez le panneau de la biblioth\xE8que d'actifs ouvert apr\xE8s l'insertion d'un actif",
    "component.assetPanelAutoCloseSettings.true": "Fermer",
    "component.assetPanelAutoCloseSettings.true.description": "Fermez le panneau de la biblioth\xE8que d'actifs apr\xE8s l'insertion d'un actif",
    "component.assetPanelFloatingSettings": "Comportement",
    "component.assetPanelFloatingSettings.fixed": "Corrig\xE9",
    "component.assetPanelFloatingSettings.fixed.description": "La biblioth\xE8que d'insertion est fix\xE9e c\xF4te \xE0 c\xF4te avec le canevas",
    "component.assetPanelFloatingSettings.floating": "Flottant",
    "component.assetPanelFloatingSettings.floating.description": "La biblioth\xE8que d'insertion flotte sur le canevas",
    "component.assetSettings": "Actifs",
    "component.assetSettings.adjustments": "Ajustements",
    "component.assetSettings.blur": "Flou",
    "component.assetSettings.crop": "Recadrer",
    "component.assetSettings.effects": "Effets",
    "component.assetSettings.filters": "Filtres",
    "component.assetSettings.text.advanced": "Texte avanc\xE9",
    "component.assetSettings.text.color": "Couleur du texte",
    "component.assetSettings.transform": "Transformer",
    "component.audio.properties": "Propri\xE9t\xE9s audio",
    "component.audio.source": "Original",
    "component.audio.trim": "D\xE9couper l'audio",
    "component.audio.trim.description": "Ajuster le d\xE9coupage audio",
    "component.audio.trim.duration": "Dur\xE9e de d\xE9coupage",
    "component.audio.trim.duration.description": "D\xE9finir la dur\xE9e audio coup\xE9e",
    "component.canvas": "Canevas de l'\xE9diteur",
    "component.canvas.openLibrary": "Ajouter des \xE9l\xE9ments",
    "component.canvas.state.error": "Le moteur de l'\xE9diteur n'a pas pu \xEAtre charg\xE9",
    "component.canvas.state.unsupported": "Le navigateur n'est pas pris en charge",
    "component.caption": "L\xE9gendes",
    "component.caption.more": "Options de l\xE9gende",
    "component.colorPicker.colorItem": "\xC9l\xE9ment de couleur {{index}}",
    "component.colorPicker.colorItem.description": "Cliquez pour utiliser cette couleur ({{color}})",
    "component.colorPicker.colorItem.hexInput": "Hex",
    "component.colorPicker.colorItem.transparent": "\xC9l\xE9ment de couleur {{index}}, Nom de la couleur\xA0: transparent",
    "component.colorPicker.convertColorMode": "Convertir en {{colorMode}}",
    "component.colorPicker.description": "Changer la couleur",
    "component.colorPicker.differentColorMode": "This element uses {{currentMode}} colors, but the editor is set to {{expectedMode}}. Convert it to {{expectedMode}} to enable editing.",
    "component.colorPicker.hsl.description": "{{componentName}}, $t(common.nearestColorName)\xA0: {{nearestColorName}}\xA0; $t(common.colorValue)\xA0: teinte\xA0: {{hue}}\xB0, saturation\xA0: {{saturation}}%, luminosit\xE9\xA0: {{lightness}}%",
    "component.colorPicker.hueGradient": "S\xE9lection du d\xE9grad\xE9 de teinte",
    "component.colorSchemeSelect.accent": "Couleur d'accentuation",
    "component.colorSchemeSelect.accent.description": "Modifier la couleur d'accentuation",
    "component.colorSchemeSelect.active": "Couleur active",
    "component.colorSchemeSelect.active.description": "Modifier la couleur active",
    "component.colorSchemeSelect.background": "Couleur d'arri\xE8re-plan",
    "component.colorSchemeSelect.background.description": "Changer la couleur d'arri\xE8re-plan",
    "component.contentFill.color.description": "Modifier la couleur de remplissage",
    "component.contentFill.description": "Modifier $t(common.fill)",
    "component.contentFill.options": "Options de type de remplissage",
    "component.contentFill.options.description": "Modifier le type de remplissage",
    "component.cutout": "Param\xE8tres",
    "component.dockIconSizeSelect": "Mise \xE0 l'\xE9chelle de l'ic\xF4ne du Dock",
    "component.dockIconSizeSelect.large": "Grand",
    "component.dockIconSizeSelect.large.description": "S\xE9lectionnez la grande mise \xE0 l'\xE9chelle de l'ic\xF4ne du Dock",
    "component.dockIconSizeSelect.normal": "Normal",
    "component.dockIconSizeSelect.normal.description": "S\xE9lectionnez la mise \xE0 l'\xE9chelle normale de l'ic\xF4ne du dock",
    "component.dockLabelVisibilityToggle": "\xC9tiquettes du Dock",
    "component.dockLabelVisibilityToggle.hide": "Masquer",
    "component.dockLabelVisibilityToggle.hide.description": "Masquer les \xE9tiquettes des boutons du dock",
    "component.dockLabelVisibilityToggle.show": "Afficher",
    "component.dockLabelVisibilityToggle.show.description": "Afficher les \xE9tiquettes des boutons du dock",
    "component.eyeDropper.button.tooltip": "Choisissez la couleur sur l'\xE9cran",
    "component.fileOperation.archiveScene": "Exporter l'archive",
    "component.fileOperation.exportImage": "Exporter des images",
    "component.fileOperation.exportPDF": "Exporter le PDF",
    "component.fileOperation.exportScene": "Exporter la conception",
    "component.fileOperation.exportVideo": "Exporter la vid\xE9o",
    "component.fileOperation.importArchive": "Importer l'archive",
    "component.fileOperation.importScene": "Importer la conception",
    "component.fileOperation.more": "Afficher plus d'options",
    "component.fileOperation.share": "Partager en tant que mod\xE8le",
    "component.inspectorBar": "Barre d'inspecteur",
    "component.inspectorPanelFloatingSettings": "Comportement",
    "component.inspectorPanelFloatingSettings.fixed": "Corrig\xE9",
    "component.inspectorPanelFloatingSettings.fixed.description": "L'inspecteur est fix\xE9 c\xF4te \xE0 c\xF4te avec le canevas",
    "component.inspectorPanelFloatingSettings.floating": "Flottant",
    "component.inspectorPanelFloatingSettings.floating.description": "L'inspecteur flotte sur le canevas",
    "component.inspectorPositionSelect.left": "Gauche",
    "component.inspectorPositionSelect.left.description": "S\xE9lectionnez l'inspecteur qui sera sur le c\xF4t\xE9 gauche",
    "component.inspectorPositionSelect.right": "Droite",
    "component.inspectorPositionSelect.right.description": "S\xE9lectionnez l'inspecteur pour qu'il soit sur le c\xF4t\xE9 droit",
    "component.languageSelect": "Language",
    "component.languageSelect.description": "Select language",
    "component.library": "Biblioth\xE8que",
    "component.library.addFile": "Ajouter un fichier",
    "component.library.breadcrumbRoot": "Tous",
    "component.library.clearSearch": "Effacer la recherche",
    "component.library.elements": "\xC9l\xE9ments",
    "component.library.enterSection": "Entrer la section",
    "component.library.error": "Impossible de se connecter \xE0 la source de l'actif",
    "component.library.loading": "Chargement\u2026",
    "component.library.noItems": "Aucun \xE9l\xE9ment",
    "component.library.noMoreItems": "Plus d'\xE9l\xE9ments",
    "component.library.removeAssetConfirmation": "Voulez-vous supprimer d\xE9finitivement cet actif\xA0?",
    "component.library.removeAssetConfirmation.description": "Cette action ne peut pas \xEAtre annul\xE9e.",
    "component.library.searchPlaceholder": "Rechercher\u2026",
    "component.librarySettings": "Biblioth\xE8ques",
    "component.librarySettings.elementLibrary": "Biblioth\xE8que d'\xE9l\xE9ments",
    "component.librarySettings.imageLibrary": "Biblioth\xE8que d'images",
    "component.librarySettings.textLibrary": "Biblioth\xE8que de textes",
    "component.librarySettings.uploadLibrary": "T\xE9l\xE9charger la biblioth\xE8que",
    "component.pageResize.label": "Redimensionner",
    "component.pageResizePanel.apply": "Appliquer",
    "component.pageResizePanel.label": "Redimensionner",
    "component.pageResizePanel.labelAllPages": "Redimensionner toutes les pages",
    "component.pageResizePanel.labelSinglePage": "Redimensionner la page",
    "component.pageSettings": "Page",
    "component.pageSettings.format": "Format des pages",
    "component.pageSettings.manage": "G\xE9rer les pages",
    "component.pageTitleAppendPageNameToggle": "Nom",
    "component.pageTitleAppendPageNameToggle.hide": "Masquer",
    "component.pageTitleAppendPageNameToggle.hide.description": "Ne pas afficher le nom de la page dans le titre",
    "component.pageTitleAppendPageNameToggle.show": "Afficher",
    "component.pageTitleAppendPageNameToggle.show.description": "Afficher le nom de la page dans le titre",
    "component.pageTitleDefaultTitleVisibilityToggle": "Titre",
    "component.pageTitleDefaultTitleVisibilityToggle.hide": "Masquer",
    "component.pageTitleDefaultTitleVisibilityToggle.hide.description": "Masquer le titre de la page",
    "component.pageTitleDefaultTitleVisibilityToggle.show": "Afficher",
    "component.pageTitleDefaultTitleVisibilityToggle.show.description": "Afficher le titre de la page",
    "component.pageTitleShowOnSinglePageToggle": "\xC9tiquette sur une seule page",
    "component.pageTitleShowOnSinglePageToggle.hide": "Non",
    "component.pageTitleShowOnSinglePageToggle.hide.description": "Masquer le titre de la page lorsqu'une seule page est donn\xE9e",
    "component.pageTitleShowOnSinglePageToggle.show": "Oui",
    "component.pageTitleShowOnSinglePageToggle.show.description": "Afficher le titre de la page lorsqu'une seule page est donn\xE9e",
    "component.pageTitleVisibilityToggle": "\xC9tiquette",
    "component.pageTitleVisibilityToggle.hide": "Masquer",
    "component.pageTitleVisibilityToggle.hide.description": "Masquer l'\xE9tiquette de la page",
    "component.pageTitleVisibilityToggle.show": "Afficher",
    "component.pageTitleVisibilityToggle.show.description": "Afficher le libell\xE9 de la page",
    "component.placeholder.appearance": "Appearance",
    "component.placeholder.appearance.description": "Enable all appearance options",
    "component.placeholder.arrange.description": "Activer toutes les options d'organisation",
    "component.placeholder.audio": "Audio",
    "component.placeholder.audio.description": "Activer toutes les options audio",
    "component.placeholder.disableAll": "D\xE9sactiver tout",
    "component.placeholder.enableAll": "Activer tout",
    "component.placeholder.fill.description": "Activer toutes les options de remplissage",
    "component.placeholder.general": "G\xE9n\xE9ral",
    "component.placeholder.general.description": "Activer toutes les options g\xE9n\xE9rales",
    "component.placeholder.settings": "Modifier les param\xE8tres de $t(common.placeholder)",
    "component.placeholder.shape": "Forme",
    "component.placeholder.shape.description": "Activer toutes les options de forme",
    "component.placeholder.stroke": "Coup",
    "component.placeholder.stroke.description": "Activer toutes les options de trait",
    "component.placeholder.text": "Texte",
    "component.placeholder.text.description": "Activer toutes les options de texte",
    "component.propertyPopover.header": "Propri\xE9t\xE9s",
    "component.replacePanelAutoCloseSettings": "Apr\xE8s le remplacement",
    "component.replacePanelAutoCloseSettings.false": "Garder ouvert",
    "component.replacePanelAutoCloseSettings.false.description": "Gardez le panneau de la biblioth\xE8que d'actifs ouvert apr\xE8s le remplacement d'un actif",
    "component.replacePanelAutoCloseSettings.true": "Fermer",
    "component.replacePanelAutoCloseSettings.true.description": "Fermez le panneau de la biblioth\xE8que d'actifs apr\xE8s le remplacement d'un actif",
    "component.replacePanelFloatingSettings": "Comportement",
    "component.replacePanelFloatingSettings.fixed": "Corrig\xE9",
    "component.replacePanelFloatingSettings.fixed.description": "La biblioth\xE8que de remplacement est fix\xE9e c\xF4te \xE0 c\xF4te avec le canevas",
    "component.replacePanelFloatingSettings.floating": "Flottant",
    "component.replacePanelFloatingSettings.floating.description": "La biblioth\xE8que de remplacement flotte sur le canevas",
    "component.roleSelect.description": "S\xE9lectionnez $t(common.role)",
    "component.scalingSelect": "Mise \xE0 l'\xE9chelle de l'interface utilisateur",
    "component.scalingSelect.large": "Grand",
    "component.scalingSelect.large.description": "S\xE9lectionner une grande mise \xE0 l'\xE9chelle",
    "component.scalingSelect.modern": "Moderne",
    "component.scalingSelect.modern.description": "S\xE9lectionnez la mise \xE0 l'\xE9chelle moderne",
    "component.scalingSelect.normal": "Normal",
    "component.scalingSelect.normal.description": "S\xE9lectionnez la mise \xE0 l'\xE9chelle normale",
    "component.settings.toggle": "Personnaliser l'\xE9diteur",
    "component.settings.toggle.description": "Ouvrir les param\xE8tres pour personnaliser l'\xE9diteur",
    "component.settingsPanel.appearance": "Appearance",
    "component.settingsPanel.assetPanel": "Panneau Biblioth\xE8que",
    "component.settingsPanel.dock": "Dock",
    "component.settingsPanel.documentation": "Documentation",
    "component.settingsPanel.features": "Fonctionnalit\xE9s",
    "component.settingsPanel.general": "G\xE9n\xE9ral",
    "component.settingsPanel.header": "Personnaliser l'\xE9diteur",
    "component.settingsPanel.inspectorPanel": "Panneau d'inspecteur",
    "component.settingsPanel.page": "Page",
    "component.settingsPanel.pageLabel": "\xC9tiquette de page",
    "component.settingsPanel.replacePanel": "Remplacer le panneau",
    "component.settingsPanel.singlePageMode": "Mode page unique",
    "component.settingsPanel.singlePageVisibilitySelect": "Page active",
    "component.themeSelect": "Th\xE8me",
    "component.themeSelect.dark": "Sombre",
    "component.themeSelect.dark.description": "S\xE9lectionnez un th\xE8me sombre",
    "component.themeSelect.dialog": "Propri\xE9t\xE9s personnalis\xE9es CSS g\xE9n\xE9r\xE9es",
    "component.themeSelect.generate": "G\xE9n\xE9rer du CSS",
    "component.themeSelect.light": "Lumi\xE8re",
    "component.themeSelect.light.description": "S\xE9lectionnez le th\xE8me de la lumi\xE8re",
    "component.themeSelect.system": "Syst\xE8me",
    "component.themeSelect.system.description": "Utiliser la pr\xE9f\xE9rence de th\xE8me syst\xE8me",
    "component.timeline.audio.options.description": "Options des \xE9l\xE9ments audio",
    "component.timeline.collapse": "R\xE9duire la chronologie",
    "component.timeline.expand": "D\xE9velopper la chronologie",
    "component.timeline.label": "Chronologie",
    "component.timeline.resize.dynamicHeight.description": "Double-cliquez pour la hauteur dynamique",
    "component.timeline.scale.down": "R\xE9duire",
    "component.timeline.scale.down.description": "R\xE9duire l'\xE9chelle de la chronologie",
    "component.timeline.scale.fit": "Ajuster la vue",
    "component.timeline.scale.fit.description": "Ajuster la vid\xE9o \xE0 la chronologie",
    "component.timeline.scale.label": "\xC9chelle de la chronologie",
    "component.timeline.scale.up": "Agrandir",
    "component.timeline.scale.up.description": "Agrandir l'\xE9chelle de la chronologie",
    "component.timeline.video.options.description": "Options des \xE9l\xE9ments vid\xE9o",
    "component.video.decodeWarning.description": "Votre navigateur ne prend pas en charge les fonctionnalit\xE9s d'\xE9dition vid\xE9o. L'importation, la lecture et l'\xE9dition vid\xE9o n\xE9cessitent l'API WebCodecs, qui n'est pas disponible dans ce navigateur.\n\nVeuillez utiliser Chrome ou Edge sous Windows ou macOS pour une prise en charge vid\xE9o compl\xE8te.",
    "component.video.decodeWarning.title": "Vid\xE9o non prise en charge",
    "component.video.encodeWarning.description": "Votre navigateur ne prend pas en charge les codecs vid\xE9o requis pour l'exportation. Cette limitation affecte tous les navigateurs sous Linux et Firefox sur n'importe quel syst\xE8me d'exploitation.\n\nVous pouvez continuer \xE0 modifier et \xE0 enregistrer votre projet. Pour exporter des vid\xE9os, veuillez utiliser Chrome ou Edge sous Windows ou macOS.",
    "component.video.encodeWarning.dismiss": "Compris",
    "component.video.encodeWarning.title": "Exportation vid\xE9o indisponible",
    "component.video.properties": "Propri\xE9t\xE9s vid\xE9o",
    "component.video.source": "Original",
    "component.video.trim": "D\xE9couper la vid\xE9o",
    "component.video.trim.description": "Ajuster le d\xE9coupage vid\xE9o",
    "component.video.trim.duration": "Dur\xE9e de d\xE9coupage",
    "component.video.trim.duration.description": "D\xE9finir la dur\xE9e de la vid\xE9o d\xE9coup\xE9e",
    "component.video.unsupported": "Vid\xE9o non prise en charge",
    "component.video.unsupported.description": "<p>Nous ne prenons pas en charge le montage vid\xE9o pour votre navigateur actuel pour le moment.</p><p>Bien que nous nous efforcions de prendre en charge tous les principaux navigateurs, veuillez utiliser un navigateur pris en charge comme le dernier Google Chrome ou Microsoft Edge.</p>",
    "component.viewSelect": "Vue",
    "component.viewSelect.advanced": "Avanc\xE9",
    "component.viewSelect.advanced.description": "Toujours afficher l'inspecteur",
    "component.viewSelect.default": "Par d\xE9faut",
    "component.viewSelect.default.description": "Masquer l'inspecteur si possible",
    "component.welcome.text": "<p>Bienvenue dans CE.SDK.</p><p>Faites preuve de cr\xE9ativit\xE9 en ajoutant une <strong>image</strong>, un <strong>texte</strong> ou un <strong>\xE9l\xE9ment</strong> \xE0 partir de la biblioth\xE8que d'\xE9l\xE9ments.</p>",
    "component.zoom.autoFit": "Page d'ajustement automatique",
    "component.zoom.fitPage": "Ajuster la page",
    "component.zoom.fitSelection": "Ajuster la s\xE9lection",
    "component.zoom.in": "Zoom avant",
    "component.zoom.label.auto": "Auto",
    "component.zoom.options": "Voir plus d'options de zoom",
    "component.zoom.out": "Zoom arri\xE8re",
    "component.zoom.shortcut": "ou appuyez sur {{shortcut}}",
    "component.zoom.to": "{{percentage}}% Zoom",
    "dialog.export.abort.message": "Vous devrez red\xE9marrer l'exportation car elle ne peut pas s'ex\xE9cuter en arri\xE8re-plan.",
    "dialog.export.abort.title": "Voulez-vous annuler l'exportation\xA0?",
    "dialog.export.action": "Annuler l'exportation",
    "dialog.export.error.message.1": "Nous n'avons pas pu pr\xE9parer votre export en raison de ressources insuffisantes.",
    "dialog.export.error.message.2": "Veuillez r\xE9essayer plus tard ou envisagez de r\xE9duire la r\xE9solution de la sc\xE8ne.",
    "dialog.export.error.title": "Quelque chose s'est mal pass\xE9",
    "dialog.export.message": "Pour que l'exportation r\xE9ussisse, veuillez ne pas quitter ou fermer cet onglet de navigateur.",
    "dialog.export.success.message": "Vous pouvez fermer cette bo\xEEte de dialogue.",
    "dialog.export.success.title": "Exportation termin\xE9e",
    "dialog.export.title": "Exportation en cours",
    "document.pageSettings": "Param\xE8tres de la page",
    "document.title": "Document",
    "editor.scope.canvas": "Toile",
    "editor.scope.global": "CE.SDK",
    "editor.scope.videoTimeline": "Chronologie vid\xE9o",
    "error.applyAsset": "Erreur lors de l'application de l'actif",
    "error.applyAsset.description": "Nous avons rencontr\xE9 une erreur lors de la tentative d'application de l'\xE9l\xE9ment",
    "error.booleanOperation.effectlessDifference": "La soustraction donnera une forme inchang\xE9e",
    "error.booleanOperation.effectlessDifference.description": "Assurez-vous que tous les \xE9l\xE9ments s\xE9lectionn\xE9s se chevauchent ou effectuez des actions \xE9tape par \xE9tape avec deux \xE9l\xE9ments \xE0 la fois.",
    "error.booleanOperation.effectlessUnion": "L'union donnera une forme inchang\xE9e",
    "error.booleanOperation.effectlessUnion.description": "Assurez-vous que les autres \xE9l\xE9ments ne se trouvent pas totalement dans la forme la plus basse.",
    "error.booleanOperation.emptyShape": "L'op\xE9ration entra\xEEnera une forme vide",
    "error.booleanOperation.emptyShape.description": "Assurez-vous que tous les \xE9l\xE9ments s\xE9lectionn\xE9s se chevauchent ou effectuez des actions \xE9tape par \xE9tape avec deux \xE9l\xE9ments \xE0 la fois.",
    "error.cta.generic": "Erreur",
    "error.cta.generic.description": "L'action a rencontr\xE9 une erreur inconnue. Veuillez r\xE9essayer.",
    "error.generic": "Erreur inconnue",
    "error.generic.description": "L'application a rencontr\xE9 une erreur inconnue. Veuillez essayer de recharger la page",
    "error.replaceAsset": "Erreur lors du remplacement de l'actif",
    "error.replaceAsset.description": "Nous avons rencontr\xE9 une erreur lors de la tentative de remplacement de l'actif",
    "error.upload": "Impossible de t\xE9l\xE9charger le fichier",
    "error.upload.description": "Le fichier n'a pas pu \xEAtre t\xE9l\xE9charg\xE9",
    "error.upload.sizeExceeded": "Le fichier d\xE9passe la taille maximale de {{limit}}x{{limit}}",
    "input.adjustments": "Ajustements",
    "input.adjustments.basic": "Basique",
    "input.adjustments.refinements": "Affinements",
    "input.adjustments.tooltip": "Modifier les ajustements",
    "input.alwaysOnBottom": "Fix\xE9 \xE0 l'arri\xE8re",
    "input.alwaysOnTop": "Fix\xE9 \xE0 l'avant",
    "input.animations": "Animations",
    "input.animations.description": "Choisir des animations",
    "input.appearance": "Appearance",
    "input.appearance.tooltip": "Change appearance",
    "input.aspectLock": "Verrouiller les proportions",
    "input.aspectLock.description": "Basculer le verrouillage des proportions",
    "input.audio.duration.description": "Dur\xE9e audio",
    "input.audio.duration.reset": "R\xE9initialiser la dur\xE9e audio",
    "input.audio.mute": "Sourdine audio",
    "input.bleedMargin.select": "S\xE9lectionner les marges perdues",
    "input.blur": "Flou",
    "input.blur.tooltip": "Modifier le flou",
    "input.booleanoperations": "Combiner",
    "input.booleanoperations.exclude": "Exclure",
    "input.booleanoperations.intersect": "Intersect",
    "input.booleanoperations.subtract": "Soustraire",
    "input.booleanoperations.union": "Union",
    "input.canvas": "Toile",
    "input.caption": "L\xE9gende",
    "input.caption.add": "Ajouter une nouvelle ligne",
    "input.caption.addAfter": "Ajouter apr\xE8s",
    "input.caption.content": "Contenu",
    "input.caption.create": "Cr\xE9er manuellement",
    "input.caption.edit": "Modifier les l\xE9gendes",
    "input.caption.file": "Importer un fichier",
    "input.caption.hideTimings": "Masquer les horaires",
    "input.caption.import": "Ajouter des l\xE9gendes",
    "input.caption.import.description": "Nous prenons actuellement en charge les fichiers .srt et .vtt",
    "input.caption.import.error.message": "Nous n'avons pas pu importer vos sous-titres. Veuillez v\xE9rifier le fichier et r\xE9essayer.",
    "input.caption.import.error.title": "\xC9chec de l'importation de la l\xE9gende",
    "input.caption.in": "Heure de d\xE9but",
    "input.caption.inputLabel": "Contenu et style",
    "input.caption.mergePrevious": "Fusionner avec le pr\xE9c\xE9dent",
    "input.caption.more": "Options de ligne",
    "input.caption.out": "Heure de fin",
    "input.caption.panel.title.create": "Ajouter des l\xE9gendes",
    "input.caption.panel.title.edit": "L\xE9gendes",
    "input.caption.panel.title.style": "L\xE9gendes",
    "input.caption.showTimings": "Afficher les horaires",
    "input.caption.style": "Style",
    "input.character": "Caract\xE8re",
    "input.clipContent": "Contenu du clip",
    "input.clipContent.off.description": "D\xE9sactiver le contenu du clip",
    "input.clipContent.on.description": "Activer le contenu du clip",
    "input.clipLines": "D\xE9coupage",
    "input.clipLines.off.description": "D\xE9sactiver le d\xE9coupage",
    "input.clipLines.on.description": "Activer le d\xE9coupage",
    "input.colorMode": "Mode",
    "input.colorMode.description": "Choisissez le mode couleur",
    "input.cutoutOffset": "D\xE9calage",
    "input.cutoutSmoothing": "Lissage",
    "input.cutoutType": "Type",
    "input.cutoutType.dashed": "Perfor\xE9",
    "input.cutoutType.solid": "Couper",
    "input.duration": "Dur\xE9e",
    "input.duration.description": "Dur\xE9e en secondes",
    "input.effect": "Effet",
    "input.effect.tooltip": "Modifier l'effet",
    "input.export": "Exporter",
    "input.filter": "Filtre",
    "input.filter.tooltip": "Modifier le filtre",
    "input.fontSelect": "Style de police s\xE9lectionn\xE9\xA0: {{font}}",
    "input.fontSelect.fallback": "Standard",
    "input.fontSize.select": "S\xE9lectionnez la taille de la police",
    "input.fontSize.selectMax": "S\xE9lectionnez la plus grande taille de police",
    "input.fontSize.selectMin": "S\xE9lectionnez la plus petite taille de police",
    "input.fontStyle.toggle": "Basculer le style {{style}}",
    "input.gradient.activateColorStop": "Appuyez sur espace pour activer",
    "input.gradient.addStop": "Ajouter un arr\xEAt de couleur",
    "input.gradient.colorPosition": "Position de la couleur",
    "input.gradient.colorStop": "Arr\xEAt de couleur",
    "input.gradient.colorStop.active": "Arr\xEAt de couleur actif",
    "input.gradient.colorStop.description": "{{stopType}} {{index}} sur {{total}} \xE0 {{position}}\xA0%. $t(common.nearestColorName) : {{colorName}}, $t(common.colorValue) : {{colorValue}}.{{action}}",
    "input.gradient.deleteStop": "Supprimer l'arr\xEAt de couleur actuel",
    "input.gradient.flip": "Inverser le d\xE9grad\xE9",
    "input.gradient.gradientAngle": "Angle de d\xE9grad\xE9",
    "input.gradient.rotate": "Tourner le d\xE9grad\xE9 de 45\xB0",
    "input.grid": "Grille",
    "input.grid.color": "Couleur de la grille",
    "input.grid.height": "Hauteur de la grille",
    "input.grid.show": "Afficher la grille",
    "input.grid.snap": "Aligner sur la grille",
    "input.grid.width": "Largeur de la grille",
    "input.gridAndRulers": "Grille et r\xE8gles",
    "input.insertVariable": "Ins\xE9rer une variable",
    "input.keyShortcut": "Pour ouvrir '{{input}}', appuyez sur '{{keyShortcut}}'",
    "input.layer": "Couche",
    "input.layerFixing.bottom": "Fix\xE9 \xE0 l'arri\xE8re",
    "input.layerFixing.description": "Contr\xF4lez si cet \xE9l\xE9ment s'affiche toujours au-dessus ou \xE0 l'arri\xE8re",
    "input.layerFixing.none": "Non corrig\xE9",
    "input.layerFixing.top": "Fix\xE9 \xE0 l'avant",
    "input.multiSelection.notice": `"La modification de plusieurs \xE9l\xE9ments \xE0 la fois n'est pas encore prise en charge"`,
    "input.multiSelection.title": "\xC9l\xE9ments multiples ({{count}})",
    "input.opacity": "Opacit\xE9",
    "input.opacity.options": "Modifier l'opacit\xE9",
    "input.options": "Options",
    "input.options.description": "Plus d'options",
    "input.pageSize": "Taille de la page",
    "input.pages": "Pages",
    "input.preset": "Taille de la page",
    "input.preset.description": "Pr\xE9configuration du format de page",
    "input.preset.tooltip": "S\xE9lectionnez $t(input.preset)",
    "input.propertyToggle.disable": "D\xE9sactiver {{property}}",
    "input.propertyToggle.enable": "Activer {{property}}",
    "input.propertyToggle.hidden": "Masqu\xE9",
    "input.propertyToggle.visible": "Visible",
    "input.rename": "Renommer {{designElementName}}",
    "input.resolution.select": "S\xE9lectionnez {{qui}}",
    "input.rulers": "R\xE8gles",
    "input.rulers.show": "Afficher les r\xE8gles",
    "input.selection": "S\xE9lection",
    "input.shadow.angle": "Angle",
    "input.shadow.angle.description": "Angle de l'ombre",
    "input.shadow.blur": "Flou",
    "input.shadow.blur.description": "Flou d'ombre",
    "input.shadow.description": "Modifier les propri\xE9t\xE9s de l'ombre",
    "input.shadow.distance": "Distance",
    "input.shadow.distance.description": "Distance de l'ombre",
    "input.shadow.label": "Ombre",
    "input.shadow.valueLabel": "Ombre port\xE9e",
    "input.shape": "Forme",
    "input.shape.options": "Options de forme",
    "input.showInExport": "Afficher lors de l'exportation",
    "input.sliderInput.toggleNumberInput": "Afficher la saisie directe de la valeur",
    "input.speed.duration.toggle.tooltip": "Afficher/masquer la dur\xE9e",
    "input.speed.duration.tooltip": "Ajuster la dur\xE9e. La vitesse s\u2019aligne automatiquement.",
    "input.speed.tooltip": "Ajuster la vitesse de lecture",
    "input.stroke": "Coup",
    "input.style": "Style",
    "input.text.advanced.description": "Hauteur, espacement, alignement et dimensionnement des lignes",
    "input.text.placeholder": "\xC9crire quelque chose",
    "input.time.end": "Heure Fin",
    "input.time.start": "Heure de d\xE9but",
    "input.transform.description": "Ajuster la position et la taille",
    "input.typefaceSelect.description": "Police de police s\xE9lectionn\xE9e\xA0: {{fontFamily}}",
    "input.typefaceSelect.noResults": "Aucune police correspondante trouv\xE9e",
    "input.typefaceSelect.search": "Rechercher des polices...",
    "input.typefaceSelect.tooltip": "Changer la police",
    "input.unit.tooltip": "S\xE9lectionnez $t(common.unit)",
    "input.uploadAudio": "T\xE9l\xE9chargement audio...",
    "input.uploadFiles": "T\xE9l\xE9chargement de fichiers...",
    "input.uploadImage": "T\xE9l\xE9chargement de l'image...",
    "input.uploadVideo": "T\xE9l\xE9chargement de la vid\xE9o...",
    "input.video": "Vid\xE9o",
    "input.video.duration.description": "Dur\xE9e de la vid\xE9o",
    "input.video.duration.reset": "R\xE9initialiser la dur\xE9e de la vid\xE9o",
    "inspector.view.design": "Conception",
    "libraries.ly.img.animations.ly.img.animations.in.label": "Dans Animations",
    "libraries.ly.img.animations.ly.img.animations.label": "Animations",
    "libraries.ly.img.animations.ly.img.animations.loop.label": "Animations en boucle",
    "libraries.ly.img.animations.ly.img.animations.out.label": "Animations sortantes",
    "libraries.ly.img.audio.label": "Audio",
    "libraries.ly.img.audio.upload.label": "T\xE9l\xE9chargements audio",
    "libraries.ly.img.color.palette.label": "Couleurs par d\xE9faut",
    "libraries.ly.img.colors.documentColors.label": "Couleurs des documents",
    "libraries.ly.img.crop.presets.label": "Rapport d'aspect",
    "libraries.ly.img.image.label": "Images",
    "libraries.ly.img.image.upload.label": "T\xE9l\xE9chargements d'images",
    "libraries.ly.img.local.label": "Local",
    "libraries.ly.img.page.presets.facebook.label": "Facebook",
    "libraries.ly.img.page.presets.hd-video.label": "Vid\xE9o HD",
    "libraries.ly.img.page.presets.instagram.label": "Instagram",
    "libraries.ly.img.page.presets.iso-standard-print.label": "Impression standard ISO",
    "libraries.ly.img.page.presets.label": "Redimensionner",
    "libraries.ly.img.page.presets.linkedIn.label": "LinkedIn",
    "libraries.ly.img.page.presets.north-american-print.label": "Impression nord-am\xE9ricaine",
    "libraries.ly.img.page.presets.other-print.label": "Autre impression",
    "libraries.ly.img.page.presets.pinterest.label": "Pinterest",
    "libraries.ly.img.page.presets.tiktok.label": "TikTok",
    "libraries.ly.img.page.presets.youtube.label": "YouTube",
    "libraries.ly.img.scene.colors.label": "Couleurs du document",
    "libraries.ly.img.sticker.3Dstickers.label": "Grain 3D",
    "libraries.ly.img.sticker.craft.label": "Artisanat",
    "libraries.ly.img.sticker.doodle.label": "Doodle",
    "libraries.ly.img.sticker.emoji.label": "Emoji",
    "libraries.ly.img.sticker.emoticons.label": "\xC9motic\xF4ne",
    "libraries.ly.img.sticker.florals.label": "Floraux",
    "libraries.ly.img.sticker.hand.label": "Mains",
    "libraries.ly.img.sticker.journal.label": "Journal",
    "libraries.ly.img.sticker.label": "Autocollants",
    "libraries.ly.img.sticker.marker.label": "Marqueurs",
    "libraries.ly.img.sticker.sketches.label": "Croquis",
    "libraries.ly.img.templates.premium.confirmation.body": "Votre contenu, comme les images et le texte, ne peut pas \xEAtre adopt\xE9 et tout le contenu sera rejet\xE9.",
    "libraries.ly.img.templates.premium.confirmation.confirm": "Oui, ignorer les modifications",
    "libraries.ly.img.templates.premium.confirmation.headline": "Remplacer la conception actuelle\xA0?",
    "libraries.ly.img.templates.premium.e-commerce.label": "Commerce \xE9lectronique",
    "libraries.ly.img.templates.premium.event.label": "\xC9v\xE9nement",
    "libraries.ly.img.templates.premium.label": "Mod\xE8les Premium",
    "libraries.ly.img.templates.premium.personal.label": "Personnel",
    "libraries.ly.img.templates.premium.professional.label": "Professionnel",
    "libraries.ly.img.templates.premium.socials.label": "R\xE9seaux sociaux",
    "libraries.ly.img.templates.confirmation.body": "Votre contenu, comme les images et le texte, ne peut pas \xEAtre adopt\xE9 et tout le contenu sera rejet\xE9.",
    "libraries.ly.img.templates.confirmation.confirm": "Oui, ignorer les modifications",
    "libraries.ly.img.templates.confirmation.headline": "Remplacer la conception actuelle\xA0?",
    "libraries.ly.img.templates.e-commerce.label": "Commerce \xE9lectronique",
    "libraries.ly.img.templates.event.label": "\xC9v\xE9nement",
    "libraries.ly.img.templates.label": "Mod\xE8les",
    "libraries.ly.img.templates.personal.label": "Personnel",
    "libraries.ly.img.templates.professional.label": "Professionnel",
    "libraries.ly.img.templates.socials.label": "R\xE9seaux sociaux",
    "libraries.ly.img.text.components.label": "Conceptions de texte",
    "libraries.ly.img.text.headline.label": "Titre",
    "libraries.ly.img.text.label": "Texte",
    "libraries.ly.img.text.paragraph.label": "Paragraphe",
    "libraries.ly.img.text.title.label": "Titre",
    "libraries.ly.img.textAnimations.ly.img.animations.in.label": "Dans Animations",
    "libraries.ly.img.textAnimations.ly.img.animations.label": "Animations",
    "libraries.ly.img.textAnimations.ly.img.animations.loop.label": "Animations en boucle",
    "libraries.ly.img.textAnimations.ly.img.animations.out.label": "Animations sortantes",
    "libraries.ly.img.upload.label": "T\xE9l\xE9chargements",
    "libraries.ly.img.vector.shape.abstract-filled.label": "R\xE9sum\xE9",
    "libraries.ly.img.vector.shape.abstract-gradient.label": "D\xE9grad\xE9 abstrait",
    "libraries.ly.img.vector.shape.abstract-image.label": "Image abstraite",
    "libraries.ly.img.vector.shape.abstract-outline.label": "Contour abstrait",
    "libraries.ly.img.vector.shape.filled.label": "Rempli",
    "libraries.ly.img.vector.shape.gradient.label": "D\xE9grad\xE9",
    "libraries.ly.img.vector.shape.image.label": "Image",
    "libraries.ly.img.vector.shape.label": "Formes",
    "libraries.ly.img.vector.shape.outline.label": "Contour",
    "libraries.ly.img.video.label": "Vid\xE9os",
    "libraries.ly.img.video.upload.label": "Mise en ligne de vid\xE9os",
    "libraries.unsplash.label": "Unsplash",
    "meta.currentLanguage": "anglais",
    "notification.speed.clampedDuration": "Vitesse limit\xE9e. Dur\xE9e ajust\xE9e \xE0 la valeur r\xE9alisable.",
    "notification.speed.noAudioAtSpeed": "Pas de son \xE0 cette vitesse",
    "preset.document.american-legal": "Juridique",
    "preset.document.american-letter": "Lettre",
    "preset.document.business-card": "Carte de visite",
    "preset.document.custom": "Personnalis\xE9",
    "preset.document.din-a0": "DIN A0",
    "preset.document.din-a1": "DIN A1",
    "preset.document.din-a2": "DIN A2",
    "preset.document.din-a3": "DIN A3",
    "preset.document.din-a4": "DIN A4",
    "preset.document.din-a5": "DIN A5",
    "preset.document.din-a6": "DIN A6",
    "preset.document.din-a65": "DIN A6/5",
    "preset.document.din-b5": "DIN B5",
    "preset.document.format2k": "Vid\xE9o 2k 1080P 1:1.77",
    "preset.document.format4k": "4K (Ultra HD) 4K / 2160p 16:9",
    "preset.document.fullhd": "Full HD (FHD) 1080p 16:9",
    "preset.document.hd": "HD (haute d\xE9finition) 720p 16:9",
    "preset.document.instagram-photo": "Photo Instagram",
    "preset.document.instagram-profile": "Profil Instagram",
    "preset.document.instagram-story": "Histoire Instagram",
    "preset.document.qhd": "QHD (Quad HD) 1440p 16:9",
    "preset.document.social-feed": "Flux social",
    "preset.document.social-story": "Histoire / Bobine",
    "preset.document.square": "Carr\xE9",
    "preset.document.twitter-header": "En-t\xEAte X",
    "preset.document.twitter-image": "X Image",
    "preset.document.twitter-profile": "Profil X",
    "preset.template.blank_1": "Vide",
    "preset.template.business_card_1": "Carte de visite",
    "preset.template.collage_1": "Collage",
    "preset.template.instagram_photo_1": "Photo Instagram",
    "preset.template.instagram_story_1": "Histoire Instagram",
    "preset.template.postcard_1": "Carte postale 1",
    "preset.template.postcard_2": "Carte postale 2",
    "preset.template.poster_1": "Affiche",
    "preset.template.presentation_4": "Pr\xE9sentation",
    "property.adjustments.blacks": "Noirs",
    "property.adjustments.brightness": "Luminosit\xE9",
    "property.adjustments.clarity": "Clart\xE9",
    "property.adjustments.contrast": "Contraste",
    "property.adjustments.exposure": "Exposition",
    "property.adjustments.gamma": "Gamma",
    "property.adjustments.highlights": "Points forts",
    "property.adjustments.saturation": "Saturation",
    "property.adjustments.shadows": "Ombres",
    "property.adjustments.sharpness": "Nettet\xE9",
    "property.adjustments.temperature": "Temp\xE9rature",
    "property.adjustments.whites": "Blancs",
    "property.animation.baseline": "Ligne de base",
    "property.animation.baseline.direction": "Direction",
    "property.animation.baseline.direction.Down": "Descendre",
    "property.animation.baseline.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.baseline.direction.Right": "D\xE9placer vers la droite",
    "property.animation.baseline.direction.Up": "Monter",
    "property.animation.block_swipe_text": "Bloquer le balayage",
    "property.animation.block_swipe_text.direction": "Direction",
    "property.animation.block_swipe_text.direction.Down": "Descendre",
    "property.animation.block_swipe_text.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.block_swipe_text.direction.Right": "D\xE9placer vers la droite",
    "property.animation.block_swipe_text.direction.Up": "Monter",
    "property.animation.block_swipe_text.useTextColor": "Utiliser la couleur du texte",
    "property.animation.blur": "Flou",
    "property.animation.blur.fade": "Fondu",
    "property.animation.blur.intensity": "Intensit\xE9",
    "property.animation.blur_loop": "Flou",
    "property.animation.blur_loop.intensity": "Intensit\xE9",
    "property.animation.breathing_loop": "Respiration",
    "property.animation.breathing_loop.intensity": "Intensit\xE9",
    "property.animation.crop_zoom": "Recadrer le zoom",
    "property.animation.crop_zoom.fade": "Fondu",
    "property.animation.crop_zoom.scale": "\xC9chelle",
    "property.animation.fade": "Fondu",
    "property.animation.fade_loop": "Fondu",
    "property.animation.grow": "Croissance",
    "property.animation.grow.direction": "Direction",
    "property.animation.grow.direction.All": "Tous",
    "property.animation.grow.direction.BottomLeft": "En bas \xE0 gauche",
    "property.animation.grow.direction.BottomRight": "En bas \xE0 droite",
    "property.animation.grow.direction.Horizontal": "Horizontal",
    "property.animation.grow.direction.TopLeft": "En haut \xE0 gauche",
    "property.animation.grow.direction.TopRight": "En haut \xE0 droite",
    "property.animation.grow.direction.Vertical": "Vertical",
    "property.animation.grow.scaleFactor": "Facteur d'\xE9chelle",
    "property.animation.jump_loop": "Sauter",
    "property.animation.jump_loop.direction": "Direction",
    "property.animation.jump_loop.direction.Down": "Descendre",
    "property.animation.jump_loop.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.jump_loop.direction.Right": "D\xE9placer vers la droite",
    "property.animation.jump_loop.direction.Up": "Monter",
    "property.animation.jump_loop.intensity": "Intensit\xE9",
    "property.animation.ken_burns": "Effet Ken Burns",
    "property.animation.ken_burns.cropScale": "\xC9chelle de recadrage",
    "property.animation.ken_burns.direction": "Direction",
    "property.animation.ken_burns.direction.Down": "Descendre",
    "property.animation.ken_burns.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.ken_burns.direction.Right": "D\xE9placer vers la droite",
    "property.animation.ken_burns.direction.Up": "Monter",
    "property.animation.ken_burns.fade": "Fondu",
    "property.animation.ken_burns.travelDistanceRatio": "Distance",
    "property.animation.ken_burns.zoomIntensity": "Intensit\xE9 du zoom",
    "property.animation.merge_text": "Fusionner",
    "property.animation.merge_text.direction": "Direction",
    "property.animation.merge_text.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.merge_text.direction.Right": "D\xE9placer vers la droite",
    "property.animation.merge_text.intensity": "Intensit\xE9",
    "property.animation.none": "Aucun",
    "property.animation.pan": "Panoramique",
    "property.animation.pan.direction": "Direction",
    "property.animation.pan.direction.Down": "Descendre",
    "property.animation.pan.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.pan.direction.Right": "D\xE9placer vers la droite",
    "property.animation.pan.direction.Up": "Monter",
    "property.animation.pan.distance": "Distance",
    "property.animation.pan.fade": "Fondu",
    "property.animation.pop": "Pop",
    "property.animation.pulsating_loop": "Pulsation",
    "property.animation.pulsating_loop.intensity": "Intensit\xE9",
    "property.animation.scale_loop": "\xC9chelle",
    "property.animation.scale_loop.direction": "Direction",
    "property.animation.scale_loop.direction.All": "Tous",
    "property.animation.scale_loop.direction.BottomLeft": "En bas \xE0 gauche",
    "property.animation.scale_loop.direction.BottomRight": "En bas \xE0 droite",
    "property.animation.scale_loop.direction.Horizontal": "Horizontal",
    "property.animation.scale_loop.direction.TopLeft": "En haut \xE0 gauche",
    "property.animation.scale_loop.direction.TopRight": "En haut \xE0 droite",
    "property.animation.scale_loop.direction.Vertical": "Vertical",
    "property.animation.scale_loop.easingDuration": "Dur\xE9e d'assouplissement",
    "property.animation.scale_loop.endScale": "\xC9chelle de fin",
    "property.animation.scale_loop.holdDuration": "Dur\xE9e de conservation",
    "property.animation.scale_loop.startDelay": "D\xE9lai de d\xE9marrage",
    "property.animation.scale_loop.startScale": "D\xE9marrer l'\xE9chelle",
    "property.animation.slide": "Diapositive",
    "property.animation.slide.direction": "Direction",
    "property.animation.slide.direction.Down": "Descendre",
    "property.animation.slide.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.slide.direction.Right": "D\xE9placer vers la droite",
    "property.animation.slide.direction.Up": "Monter",
    "property.animation.slide.distance": "Distance",
    "property.animation.slide.fade": "Fondu",
    "property.animation.spin": "Tourner",
    "property.animation.spin.direction": "Direction",
    "property.animation.spin.direction.Clockwise": "Dans le sens des aiguilles d'une montre",
    "property.animation.spin.direction.CounterClockwise": "Dans le sens inverse des aiguilles d'une montre",
    "property.animation.spin.fade": "Fondu",
    "property.animation.spin.intensity": "Intensit\xE9",
    "property.animation.spin_loop": "Tourner",
    "property.animation.spin_loop.direction": "Direction",
    "property.animation.spin_loop.direction.Clockwise": "Dans le sens des aiguilles d'une montre",
    "property.animation.spin_loop.direction.CounterClockwise": "Dans le sens inverse des aiguilles d'une montre",
    "property.animation.spread_text": "Diffusion",
    "property.animation.spread_text.fade": "Fondu",
    "property.animation.spread_text.intensity": "Intensit\xE9",
    "property.animation.squeeze_loop": "Presser",
    "property.animation.sway_loop": "Balancement",
    "property.animation.sway_loop.intensity": "Intensit\xE9",
    "property.animation.typewriter_text": "Machine \xE0 \xE9crire",
    "property.animation.typewriter_text.writingStyle": "Style d'\xE9criture",
    "property.animation.typewriter_text.writingStyle.Character": "Caract\xE8re",
    "property.animation.typewriter_text.writingStyle.Word": "Mot",
    "property.animation.wipe": "Effacer",
    "property.animation.wipe.direction": "Direction",
    "property.animation.wipe.direction.Down": "Descendre",
    "property.animation.wipe.direction.Left": "D\xE9placer vers la gauche",
    "property.animation.wipe.direction.Right": "D\xE9placer vers la droite",
    "property.animation.wipe.direction.Up": "Monter",
    "property.animation.zoom": "Zoom",
    "property.animation.zoom.fade": "Fondu",
    "property.animationEasing": "Assouplissement",
    "property.animationEasing.EaseInBack": "Rebondir",
    "property.animationEasing.EaseInOutBack": "Rebond double",
    "property.animationEasing.EaseInOutQuint": "Lisse naturel",
    "property.animationEasing.EaseInOutSpring": "Remuez double",
    "property.animationEasing.EaseInQuint": "Acc\xE9l\xE9ration douce",
    "property.animationEasing.EaseInSpring": "S'\xE9loigner",
    "property.animationEasing.EaseOutBack": "Rebondir",
    "property.animationEasing.EaseOutQuint": "Ralentissement en douceur",
    "property.animationEasing.EaseOutSpring": "Se tortiller",
    "property.animationEasing.Linear": "Lin\xE9aire",
    "property.autoSize": "Comportement du cadre",
    "property.autoSize.autoHeight.description": "Ajuster automatiquement la hauteur du bloc de texte",
    "property.autoSize.autoSize.description": "Ajuster automatiquement la largeur et la hauteur du cadre de texte",
    "property.autoSize.fixedFrame.description": "Maintenir le cadre du texte",
    "property.backgroundColor.color": "Arri\xE8re-plan",
    "property.backgroundColor.description": "Changer la couleur d'arri\xE8re-plan",
    "property.bleedMargin": "Marge \xE0 fond perdu",
    "property.blendMode": "Mode de fusion",
    "property.blendMode.Color": "Couleur",
    "property.blendMode.ColorBurn": "Gravure de couleur",
    "property.blendMode.ColorDodge": "Esquive couleur",
    "property.blendMode.Darken": "Assombrir",
    "property.blendMode.DarkenColor": "Assombrir la couleur",
    "property.blendMode.Difference": "Diff\xE9rence",
    "property.blendMode.Divide": "Diviser",
    "property.blendMode.Exclusion": "Exclusion",
    "property.blendMode.HardLight": "Lumi\xE8re dure",
    "property.blendMode.HardMix": "M\xE9lange dur",
    "property.blendMode.Hue": "Teinte",
    "property.blendMode.Lighten": "\xC9claircir",
    "property.blendMode.LightenColor": "\xC9claircir la couleur",
    "property.blendMode.LinearBurn": "Gravure lin\xE9aire",
    "property.blendMode.LinearDodge": "Esquive lin\xE9aire",
    "property.blendMode.LinearLight": "Lumi\xE8re lin\xE9aire",
    "property.blendMode.Luminosity": "Luminosit\xE9",
    "property.blendMode.Multiply": "Multiplier",
    "property.blendMode.Normal": "Normal",
    "property.blendMode.Overlay": "Superposition",
    "property.blendMode.PassThrough": "Pass Through",
    "property.blendMode.PinLight": "\xC9pingle lumineuse",
    "property.blendMode.Saturation": "Saturation",
    "property.blendMode.Screen": "\xC9cran",
    "property.blendMode.SoftLight": "Lumi\xE8re douce",
    "property.blendMode.Subtract": "Soustraire",
    "property.blendMode.VividLight": "Lumi\xE8re vive",
    "property.blendMode.description": "Mode de fusion s\xE9lectionn\xE9\xA0: {{mode}}",
    "property.blendMode.tooltip": "Modifier le mode de fusion",
    "property.blur.extrudeBlur": "Extruder le flou",
    "property.blur.extrudeBlur.amount": "Intensit\xE9",
    "property.blur.linearBlur": "Flou lin\xE9aire",
    "property.blur.linearBlur.blurRadius": "Intensit\xE9",
    "property.blur.linearBlur.x1": "Point 1 - X",
    "property.blur.linearBlur.x2": "Point 2 - X",
    "property.blur.linearBlur.y1": "Point 1 - Y",
    "property.blur.linearBlur.y2": "Point 2 - Y",
    "property.blur.mirroredBlur": "Flou en miroir",
    "property.blur.mirroredBlur.blurRadius": "Intensit\xE9",
    "property.blur.mirroredBlur.gradientSize": "Taille du d\xE9grad\xE9",
    "property.blur.mirroredBlur.size": "Taille de la zone non floue",
    "property.blur.mirroredBlur.x1": "Point 1 - X",
    "property.blur.mirroredBlur.x2": "Point 2 - X",
    "property.blur.mirroredBlur.y1": "Point 1 - Oui",
    "property.blur.mirroredBlur.y2": "Point 2 - Y",
    "property.blur.radialBlur": "Flou radial",
    "property.blur.radialBlur.blurRadius": "Intensit\xE9",
    "property.blur.radialBlur.gradientRadius": "Taille du d\xE9grad\xE9",
    "property.blur.radialBlur.radius": "Taille de la zone non floue",
    "property.blur.radialBlur.x": "Point - X",
    "property.blur.radialBlur.y": "Point - Y",
    "property.blur.uniformBlur": "Flou gaussien",
    "property.blur.uniformBlur.intensity": "Intensit\xE9",
    "property.caption.scale": "\xC9chelle",
    "property.color": "Couleur",
    "property.color.description": "Changer la couleur",
    "property.cornerRadius": "Coins arrondis",
    "property.crop": "Recadrer",
    "property.crop.contentFillMode": "Mode de remplissage",
    "property.crop.contentFillMode.contain": "Ajuster",
    "property.crop.contentFillMode.cover": "Couverture",
    "property.crop.contentFillMode.crop": "Recadrer",
    "property.crop.contentFillMode.description": "Modifier le mode de remplissage",
    "property.crop.offset": "{{axis}} D\xE9calage",
    "property.crop.offset.description": "D\xE9calage de recadrage sur l'axe {{axis}} dans {{unit}}",
    "property.crop.scale": "\xC9chelle",
    "property.crop.scale.description": "Redimensionner proportionnellement les dimensions de l'image",
    "property.crop.size": "Zone de recadrage",
    "property.crop.size.description": "{{dimension}} du cadre de recadrage dans {{unit}}",
    "property.crop.straighten": "Redresser",
    "property.crop.tooltip": "Modifier les propri\xE9t\xE9s du recadrage",
    "property.decoration": "D\xE9coration",
    "property.dropShadow.color": "Couleur de l'ombre",
    "property.duoToneFilterIntensity": "Intensit\xE9",
    "property.duotoneFilter.breezy": "Breezy",
    "property.duotoneFilter.clash": "Clash",
    "property.duotoneFilter.deepblue": "Bleu profond",
    "property.duotoneFilter.desert": "D\xE9sert",
    "property.duotoneFilter.frog": "Grenouille",
    "property.duotoneFilter.peach": "P\xEAche",
    "property.duotoneFilter.plum": "Prune",
    "property.duotoneFilter.sunset": "Coucher de soleil",
    "property.effect.crossCut": "Coupe crois\xE9e",
    "property.effect.crossCut.offset": "D\xE9calage horizontal",
    "property.effect.crossCut.slices": "Coupes horizontales",
    "property.effect.crossCut.speedV": "D\xE9calage vertical",
    "property.effect.crossCut.time": "Variation",
    "property.effect.dotPattern": "Motif de points",
    "property.effect.dotPattern.blur": "Flou global",
    "property.effect.dotPattern.dots": "Nombre de points",
    "property.effect.dotPattern.size": "Taille des points",
    "property.effect.extrudeBlur": "Extruder le flou",
    "property.effect.extrudeBlur.amount": "Intensit\xE9",
    "property.effect.glow": "Lueur",
    "property.effect.glow.amount": "Intensit\xE9",
    "property.effect.glow.darkness": "Assombrissement",
    "property.effect.glow.size": "Fleur",
    "property.effect.greenScreen": "\xC9cran vert",
    "property.effect.greenScreen.colorMatch": "Correspondance des couleurs",
    "property.effect.greenScreen.fromColor": "Couleur source",
    "property.effect.greenScreen.fromColor.description": "Modifier $t(property.effect.greenScreen.fromColor)",
    "property.effect.greenScreen.smoothness": "Douceur",
    "property.effect.greenScreen.spill": "D\xE9versement",
    "property.effect.halfTone": "Demi-ton",
    "property.effect.halfTone.angle": "Angle du motif",
    "property.effect.halfTone.scale": "\xC9chelle du motif",
    "property.effect.joggle.amount": "Gravit\xE9",
    "property.effect.joggle.time": "Variation",
    "property.effect.linocut": "Linogravure",
    "property.effect.linocut.scale": "\xC9chelle du motif",
    "property.effect.liquid": "Liquide",
    "property.effect.liquid.amount": "Intensit\xE9",
    "property.effect.liquid.scale": "\xC9chelle",
    "property.effect.liquid.speed": "Sensibilit\xE9",
    "property.effect.liquid.time": "Variation",
    "property.effect.mirror": "Miroir",
    "property.effect.mirror.side": "C\xF4t\xE9 miroir",
    "property.effect.outliner": "Outliner",
    "property.effect.outliner.amount": "Intensit\xE9",
    "property.effect.outliner.passthrough": "M\xE9lange",
    "property.effect.pixelize": "Pixeliser",
    "property.effect.pixelize.horizontalPixelSize": "Nombre horizontal",
    "property.effect.pixelize.verticalPixelSize": "Nombre vertical",
    "property.effect.posterize": "Post\xE9riser",
    "property.effect.posterize.levels": "Nombre de niveaux",
    "property.effect.psychedelic.amount": "Intensit\xE9",
    "property.effect.psychedelic.offset": "D\xE9calage diagonal",
    "property.effect.psychedelic.time": "Variation",
    "property.effect.radialPixel": "Pixel radial",
    "property.effect.radialPixel.radius": "Rayon par ligne",
    "property.effect.radialPixel.segments": "Taille par ligne",
    "property.effect.radiate.centerBrightness": "Luminosit\xE9 au centre",
    "property.effect.radiate.colorize": "Saturation",
    "property.effect.radiate.powerCurve": "Intensit\xE9",
    "property.effect.recolor": "Recolorer",
    "property.effect.recolor.brightnessMatch": "Correspondance de luminosit\xE9",
    "property.effect.recolor.colorMatch": "Correspondance des couleurs",
    "property.effect.recolor.fromColor": "Couleur source",
    "property.effect.recolor.fromColor.description": "Modifier $t(property.effect.recolor.fromColor)",
    "property.effect.recolor.smoothness": "Douceur",
    "property.effect.recolor.toColor": "Couleur cible",
    "property.effect.recolor.toColor.description": "Modifier $t(property.effect.recolor.toColor)",
    "property.effect.scanlines.count": "Hauteur de la ligne",
    "property.effect.scanlines.linesAmount": "Intensit\xE9 des lignes",
    "property.effect.scanlines.noiseAmount": "Bruit appliqu\xE9",
    "property.effect.scanlines.time": "Variation",
    "property.effect.separate.amount": "D\xE9calage",
    "property.effect.separate.time": "Variation",
    "property.effect.sharpie": "Sharpie",
    "property.effect.shifter": "Shifter",
    "property.effect.shifter.amount": "Distance",
    "property.effect.shifter.angle": "D\xE9placement de la direction",
    "property.effect.tiltShift": "Tiltshift",
    "property.effect.tiltShift.amount": "Intensit\xE9",
    "property.effect.tiltShift.position": "Position",
    "property.effect.tvGlitch": "Glitch TV",
    "property.effect.tvGlitch.distortion": "Distorsion grossi\xE8re",
    "property.effect.tvGlitch.distortion2": "Distorsion fine",
    "property.effect.tvGlitch.rollSpeed": "D\xE9calage vertical",
    "property.effect.tvGlitch.speed": "Variance",
    "property.effect.tvGlitch.time": "Variation",
    "property.effect.vignette": "Vignette",
    "property.effect.vignette.darkness": "Couleur",
    "property.effect.vignette.offset": "Taille",
    "property.effect.waves.size": "Taille du motif",
    "property.effect.waves.speed": "Sensibilit\xE9",
    "property.effect.waves.strength": "Intensit\xE9",
    "property.effect.waves.time": "Variation",
    "property.fill": "Remplir",
    "property.fill.description": "Modifier le remplissage",
    "property.fillType": "Type de remplissage",
    "property.fillType.gradient": "D\xE9grad\xE9",
    "property.fillType.gradient.description": "Utiliser un remplissage d\xE9grad\xE9",
    "property.fillType.solid": "Solide",
    "property.fillType.solid.description": "Utiliser une couleur de remplissage unie",
    "property.flip": "Retourner",
    "property.flip.x": "Retourner horizontalement",
    "property.flip.y": "Retourner verticalement",
    "property.gradientType.conical": "D\xE9grad\xE9 angulaire",
    "property.gradientType.conical.description": "Utiliser un remplissage d\xE9grad\xE9 angulaire",
    "property.gradientType.linear": "D\xE9grad\xE9 lin\xE9aire",
    "property.gradientType.linear.description": "Utiliser un remplissage d\xE9grad\xE9 lin\xE9aire",
    "property.gradientType.radial": "D\xE9grad\xE9 radial",
    "property.gradientType.radial.description": "Utiliser un remplissage d\xE9grad\xE9 radial",
    "property.innerDiameter": "Diam\xE8tre int\xE9rieur",
    "property.layout": "Mise en page",
    "property.layout.free": "Organisez les pages librement",
    "property.layout.horizontal": "Organiser les pages horizontalement",
    "property.layout.vertical": "Organiser les pages verticalement",
    "property.letterSpacing": "Espacement des lettres",
    "property.lineHeight": "Hauteur de la ligne",
    "property.lineWidth": "Largeur de ligne",
    "property.lineWidth.description": "Modifier la largeur de ligne",
    "property.listStyle": "Style de liste",
    "property.listStyle.none": "Aucune liste",
    "property.listStyle.ordered": "Liste num\xE9rot\xE9e",
    "property.listStyle.unordered": "Liste \xE0 puces",
    "property.lutFilter.ad1920": "1920 apr\xE8s JC",
    "property.lutFilter.ancient": "Ancient",
    "property.lutFilter.bleached": "Kalmen",
    "property.lutFilter.bleachedblue": "Joran",
    "property.lutFilter.blues": "Polaroid",
    "property.lutFilter.blueshadows": "Z\xE9phyr",
    "property.lutFilter.breeze": "Levante",
    "property.lutFilter.celsius": "Enfer",
    "property.lutFilter.chest": "Ch\xE2taigne",
    "property.lutFilter.classic": "Classique",
    "property.lutFilter.colorful": "Color\xE9",
    "property.lutFilter.cool": "Snappy",
    "property.lutFilter.cottoncandy": "Bonbons",
    "property.lutFilter.creamy": "Cr\xE9meux",
    "property.lutFilter.eighties": "Feu faible",
    "property.lutFilter.elder": "Colla",
    "property.lutFilter.evening": "Lever du soleil",
    "property.lutFilter.fall": "Mousse",
    "property.lutFilter.fixie": "Fixie",
    "property.lutFilter.food": "Alimentation",
    "property.lutFilter.fridge": "R\xE9frig\xE9rateur",
    "property.lutFilter.front": "Ensoleill\xE9 ann\xE9es 70",
    "property.lutFilter.glam": "Glam",
    "property.lutFilter.gobblin": "Gobelin",
    "property.lutFilter.greyed": "Gris",
    "property.lutFilter.highcarb": "Haute teneur en glucides",
    "property.lutFilter.highcontrast": "Hicon",
    "property.lutFilter.k2": "Noir mat",
    "property.lutFilter.kdynamic": "Galet",
    "property.lutFilter.keen": "Vif",
    "property.lutFilter.lenin": "Citron",
    "property.lutFilter.litho": "Litho",
    "property.lutFilter.lomo": "Lomo",
    "property.lutFilter.lomo100": "Lomo 100",
    "property.lutFilter.lucid": "Lucide",
    "property.lutFilter.mellow": "Doux",
    "property.lutFilter.neat": "Soign\xE9",
    "property.lutFilter.nogreen": "Citrouille",
    "property.lutFilter.orchid": "Solanus",
    "property.lutFilter.pale": "P\xE2le",
    "property.lutFilter.pitched": "Pitch\xE9",
    "property.lutFilter.plate": "alt\xE9r\xE9",
    "property.lutFilter.pola669": "\xC9cart vert",
    "property.lutFilter.polasx": "Pola SX",
    "property.lutFilter.pro400": "Pro 400",
    "property.lutFilter.quozi": "Quozi",
    "property.lutFilter.sepiahigh": "S\xE9pia",
    "property.lutFilter.settled": "Install\xE9",
    "property.lutFilter.seventies": "Ann\xE9es 70",
    "property.lutFilter.sin": "Trucs difficiles",
    "property.lutFilter.soft": "Soft",
    "property.lutFilter.steel": "Acier",
    "property.lutFilter.summer": "\xC9t\xE9",
    "property.lutFilter.sunset": "Or",
    "property.lutFilter.tender": "Appel d'offres",
    "property.lutFilter.texas": "Oldtimer",
    "property.lutFilter.twilight": "Cr\xE9puscule",
    "property.lutFilter.winter": "Softy",
    "property.lutFilter.x400": "Poussi\xE9reux",
    "property.lutFilterIntensity": "Intensit\xE9",
    "property.opacity": "Opacit\xE9",
    "property.orientation": "Orientation",
    "property.orientation.description": "D\xE9finir l'orientation de la page sur {{orientation}}",
    "property.orientation.flip": "Inverser l'orientation",
    "property.orientation.landscape": "Paysage",
    "property.orientation.portrait": "Portrait",
    "property.orientation.select.label": "S\xE9lectionner",
    "property.orientation.square": "Carr\xE9",
    "property.outlineColor": "Contour",
    "property.outlineWidth": "Largeur du contour",
    "property.paragraphSpacing": "Espacement des paragraphes",
    "property.placeholderBehavior.description": "Agir en tant qu'espace r\xE9serv\xE9",
    "property.placeholderBehavior.graphic.tooltip": "Affiche l'apparence de l'espace r\xE9serv\xE9 et active le comportement de clic pour remplacer les images et les vid\xE9os.",
    "property.placeholderBehavior.text.tooltip": "Affiche l'apparence de l'espace r\xE9serv\xE9 et active le comportement de clic pour remplacer le texte",
    "property.playback.duration": "Dur\xE9e",
    "property.points": "Points",
    "property.position": "{{axis}} $t(common.position)",
    "property.position.description": "Position sur l'axe {{axis}} dans {{unit}}",
    "property.sides": "C\xF4t\xE9s",
    "property.speed": "Vitesse",
    "property.speed.duration": "Dur\xE9e",
    "property.strokeColor": "Stroke",
    "property.strokeColor.description": "Change stroke color",
    "property.strokeCornerGeometry": "Join",
    "property.strokeCornerGeometry.bevel": "Bevel",
    "property.strokeCornerGeometry.description": "Change stroke join style",
    "property.strokeCornerGeometry.miter": "Miter",
    "property.strokeCornerGeometry.round": "Round",
    "property.strokePosition.center": "Center",
    "property.strokePosition.description": "Change stroke position",
    "property.strokePosition.inner": "Inside",
    "property.strokePosition.outer": "Outside",
    "property.strokePositionAndCornerGeometry.description": "Change stroke position and join style",
    "property.strokeStyle": "Style",
    "property.strokeStyle.dashed": "Dashed",
    "property.strokeStyle.dashedRound": "Dashed Round",
    "property.strokeStyle.description": "Change stroke style",
    "property.strokeStyle.dotted": "Dotted",
    "property.strokeStyle.longDashed": "Long Dashed",
    "property.strokeStyle.longDashedRound": "Long Dashed Round",
    "property.strokeStyle.solid": "Solid",
    "property.strokeWidth": "Width",
    "property.strokeWidth.description": "Change stroke width",
    "property.textAlignment.horizontal": "Alignement horizontal",
    "property.textAlignment.horizontal.autoDetect": "Orientation de la langue de correspondance",
    "property.textAlignment.horizontal.center": "Aligner le texte au centre",
    "property.textAlignment.horizontal.description": "Modifier l'alignement horizontal",
    "property.textAlignment.horizontal.left": "Aligner le texte \xE0 gauche",
    "property.textAlignment.horizontal.right": "Aligner le texte \xE0 droite",
    "property.textAlignment.vertical": "Alignement vertical",
    "property.textAlignment.vertical.bottom": "Aligner le texte vers le bas",
    "property.textAlignment.vertical.center": "Aligner le texte au centre",
    "property.textAlignment.vertical.top": "Aligner le texte vers le haut",
    "property.textBackground": "Arri\xE8re-plan",
    "property.textBackground.cornerRadius": "Coins arrondis",
    "property.textBackground.description": "Modifier l'arri\xE8re-plan du texte",
    "property.textBackground.horizontalPadding": "Remplissage horizontal",
    "property.textBackground.horizontalPadding.description": "Modifier le remplissage horizontal",
    "property.textBackground.options.description": "Plus d'options d'arri\xE8re-plan du texte",
    "property.textBackground.padding": "Remplissage",
    "property.textBackground.padding.description": "Modifier le remplissage",
    "property.textBackground.verticalPadding": "Remplissage vertical",
    "property.textBackground.verticalPadding.description": "Modifier le remplissage vertical",
    "property.textCase": "Cas des lettres",
    "property.textCase.lowercase": "minuscule",
    "property.textCase.normal": "Tel que saisi",
    "property.textCase.titlecase": "Cas majuscule",
    "property.textCase.uppercase": "MAJUSCULE",
    "property.textWritingStyle": "Style d'\xE9criture",
    "property.textWritingStyle.Block": "Bloc",
    "property.textWritingStyle.Character": "Caract\xE8re",
    "property.textWritingStyle.Line": "Ligne",
    "property.textWritingStyle.Word": "Mot",
    "property.vector": "Vector",
    "property.vectorPath.mirrorMode.angleAndLength": "Angle et longueur du miroir",
    "property.vectorPath.mirrorMode.angleOnly": "Angle du miroir",
    "property.vectorPath.mirrorMode.none": "Aucune mise en miroir",
    "property.vectorPath.mirrorMode.tooltip": "Contr\xF4ler la fa\xE7on dont g\xE8re le miroir autour d'un point d'ancrage",
    "property.volume": "Volume",
    "scope.appearance.adjustments": "Allow to Change Adjustments",
    "scope.appearance.adjustments.tooltip": "Allows users to adjust brightness, contrast, saturation, and other image enhancement properties",
    "scope.appearance.animations": "Allow to Change Animations",
    "scope.appearance.animations.tooltip": "Allows users to add or modify animations and transitions",
    "scope.appearance.blur": "Allow to Change Blur",
    "scope.appearance.blur.tooltip": "Allows users to apply or adjust blur effects",
    "scope.appearance.effect": "Allow to Change Effect",
    "scope.appearance.effect.tooltip": "Allows users to apply or modify visual effects",
    "scope.appearance.filter": "Allow to Change Filter",
    "scope.appearance.filter.tooltip": "Allows users to apply or change color filters and presets",
    "scope.appearance.shadow": "Allow to Change Shadow",
    "scope.appearance.shadow.tooltip": "Allows users to add or modify drop shadows and shadow effects",
    "scope.audio.change": "Autoriser le remplacement de l'audio",
    "scope.audio.change.tooltip": "Permet aux utilisateurs de remplacer la piste audio",
    "scope.editor.select": "Autoriser la s\xE9lection",
    "scope.fill.change": "Autoriser le remplacement du contenu de remplissage",
    "scope.fill.change.graphic": "Autoriser le remplacement du contenu de remplissage",
    "scope.fill.change.graphic.tooltip": "Permet aux utilisateurs de remplacer le contenu de remplissage (images, vid\xE9os, couleurs, etc.)",
    "scope.fill.change.text": "Autoriser la modification de la couleur du texte",
    "scope.fill.change.text.tooltip": "Permet aux utilisateurs de modifier la couleur du texte",
    "scope.fill.change.tooltip": "Permet aux utilisateurs de remplacer le contenu de remplissage (images, vid\xE9os, couleurs, etc.)",
    "scope.fill.changeType": "Autoriser la modification du type de remplissage",
    "scope.fill.changeType.tooltip": "Permet aux utilisateurs de basculer entre diff\xE9rents types de remplissage (couleur, image, vid\xE9o)",
    "scope.layer.blendMode": "Autoriser \xE0 modifier le mode de fusion",
    "scope.layer.blendMode.tooltip": "Permet aux utilisateurs de modifier la fa\xE7on dont ce calque se m\xE9lange avec les calques situ\xE9s en dessous",
    "scope.layer.crop": "Autoriser le recadrage",
    "scope.layer.crop.tooltip": "Permet aux utilisateurs de recadrer et d'ajuster la zone visible du contenu",
    "scope.layer.flip": "Autoriser le retournement",
    "scope.layer.flip.tooltip": "Permet aux utilisateurs de retourner l'\xE9l\xE9ment horizontalement ou verticalement",
    "scope.layer.move": "Autoriser le d\xE9placement",
    "scope.layer.move.tooltip": "Permet aux utilisateurs de modifier la position de l'\xE9l\xE9ment",
    "scope.layer.opacity": "Autoriser la modification de l'opacit\xE9",
    "scope.layer.opacity.tooltip": "Permet aux utilisateurs d'ajuster la transparence de l'\xE9l\xE9ment",
    "scope.layer.resize": "Autoriser la mise \xE0 l'\xE9chelle",
    "scope.layer.resize.allPages": "Autoriser le redimensionnement de toutes les pages",
    "scope.layer.resize.tooltip": "Permet aux utilisateurs de modifier la taille de l'\xE9l\xE9ment",
    "scope.layer.rotate": "Autoriser la rotation",
    "scope.layer.rotate.tooltip": "Permet aux utilisateurs de faire pivoter l'\xE9l\xE9ment selon n'importe quel angle",
    "scope.lifecycle.destroy": "Autoriser la suppression",
    "scope.lifecycle.destroy.tooltip": "Permet aux utilisateurs de supprimer l'\xE9l\xE9ment de la conception",
    "scope.lifecycle.duplicate": "Autoriser la duplication",
    "scope.lifecycle.duplicate.tooltip": "Permet aux utilisateurs de cr\xE9er des copies de l'\xE9l\xE9ment",
    "scope.shape.change": "Autoriser \xE0 changer de forme",
    "scope.shape.change.tooltip": "Permet aux utilisateurs de modifier les options de forme pour les formes de rectangle, de polygone, d'\xE9toile et de ligne.",
    "scope.stroke.change": "Allow to Change Stroke",
    "scope.stroke.change.tooltip": "Allows users to modify stroke properties (width, color, style)",
    "scope.text.character": "Autoriser \xE0 styliser le texte",
    "scope.text.character.tooltip": "Permet aux utilisateurs de modifier la police, la taille, la couleur et d'autres propri\xE9t\xE9s du texte",
    "scope.text.edit": "Autoriser la modification du texte",
    "scope.text.edit.placeholder.tooltip": "Permet aux utilisateurs de remplacer le contenu du texte par leur propre texte",
    "scope.text.edit.tooltip": "Permet aux utilisateurs de modifier le contenu du texte",
    "settings.feature.combine": "Combiner",
    "settings.feature.combine.exclude": "Exclure",
    "settings.feature.combine.intersect": "Intersect",
    "settings.feature.combine.subtract": "Soustraire",
    "settings.feature.combine.union": "Union",
    "settings.feature.crop": "Recadrer",
    "settings.feature.crop.fillMode": "Mode de remplissage",
    "settings.feature.crop.flip": "Recadrage",
    "settings.feature.crop.panel.autoOpen": "Panneau de recadrage \xE0 ouverture automatique",
    "settings.feature.crop.position": "Position de recadrage",
    "settings.feature.crop.rotation": "Rotation des recadrages",
    "settings.feature.crop.scale": "\xC9chelle de recadrage",
    "settings.feature.crop.size": "Taille du recadrage",
    "settings.feature.effects.adjustments": "Ajustements",
    "settings.feature.effects.blur": "Flou",
    "settings.feature.effects.cutout": "D\xE9coupe",
    "settings.feature.effects.effects": "Effets",
    "settings.feature.effects.filters": "Filtres",
    "settings.feature.fill": "Remplir",
    "settings.feature.fill.color": "Remplissage de couleur",
    "settings.feature.fill.image": "Remplissage d'image",
    "settings.feature.fill.video": "Remplissage vid\xE9o",
    "settings.feature.general.animations": "Animations",
    "settings.feature.general.blendMode": "Mode de fusion",
    "settings.feature.general.delete": "Supprimer",
    "settings.feature.general.duplicate": "Dupliquer",
    "settings.feature.general.opacity": "Opacit\xE9",
    "settings.feature.general.preview": "Aper\xE7u",
    "settings.feature.group.combine": "Combiner",
    "settings.feature.group.crop": "Recadrer",
    "settings.feature.group.effects": "Effets",
    "settings.feature.group.fill": "Remplir",
    "settings.feature.group.general": "G\xE9n\xE9ral",
    "settings.feature.group.group": "Groupe",
    "settings.feature.group.media": "M\xE9dias",
    "settings.feature.group.navigation": "Navigation",
    "settings.feature.group.notifications": "Notifications",
    "settings.feature.group.page": "Page",
    "settings.feature.group.panels": "Panneaux et interface utilisateur",
    "settings.feature.group.placeholder": "Espace r\xE9serv\xE9",
    "settings.feature.group.position": "Position",
    "settings.feature.group.replace": "Remplacer",
    "settings.feature.group.scene": "Sc\xE8ne",
    "settings.feature.group.shadow": "Ombre",
    "settings.feature.group.shape": "Forme",
    "settings.feature.group.stroke": "Coup",
    "settings.feature.group.text": "Texte",
    "settings.feature.group.transform": "Transformer",
    "settings.feature.group.vectorEdit": "Modification vectorielle",
    "settings.feature.group.video": "Vid\xE9o",
    "settings.feature.group_feature": "Groupe",
    "settings.feature.group_feature.create": "Cr\xE9er un groupe",
    "settings.feature.group_feature.enter": "Entrer le groupe",
    "settings.feature.group_feature.select": "S\xE9lectionner un groupe",
    "settings.feature.group_feature.ungroup": "Dissocier",
    "settings.feature.header": "Fonctionnalit\xE9s",
    "settings.feature.manage": "G\xE9rer les fonctionnalit\xE9s",
    "settings.feature.search": "Fonctionnalit\xE9s de recherche...",
    "settings.feature.media.playbackSpeed": "Vitesse de lecture",
    "settings.feature.media.trim": "D\xE9couper",
    "settings.feature.media.volume": "Volume",
    "settings.feature.navigation": "Navigation",
    "settings.feature.navigation.actions": "Boutons d'action",
    "settings.feature.navigation.back": "Bouton Retour",
    "settings.feature.navigation.bar": "Barre de navigation",
    "settings.feature.navigation.close": "Bouton Fermer",
    "settings.feature.navigation.undoRedo": "Annuler / R\xE9tablir",
    "settings.feature.navigation.zoom": "Contr\xF4les du zoom",
    "settings.feature.notifications": "Notifications",
    "settings.feature.notifications.redo": "R\xE9tablir la notification",
    "settings.feature.notifications.undo": "Annuler la notification",
    "settings.feature.page": "Page",
    "settings.feature.page.add": "Ajouter une page",
    "settings.feature.page.bleedMargin": "Marge \xE0 fond perdu",
    "settings.feature.page.clipContent": "Contenu du clip",
    "settings.feature.page.move": "D\xE9placer la page",
    "settings.feature.page.resize": "Redimensionner la page",
    "settings.feature.page.settings": "Param\xE8tres de la page",
    "settings.feature.panels.canvas": "Toile",
    "settings.feature.panels.canvasBar": "Barre de toile",
    "settings.feature.panels.canvasMenu": "Menu Toile",
    "settings.feature.panels.dock": "Dock",
    "settings.feature.panels.inspector": "Inspecteur",
    "settings.feature.panels.inspectorBar": "Barre d'inspecteur",
    "settings.feature.panels.inspectorToggle": "Inspecteur Toggle",
    "settings.feature.panels.library": "Biblioth\xE8que d'actifs",
    "settings.feature.panels.rulers": "R\xE8gles",
    "settings.feature.panels.settings": "Param\xE8tres",
    "settings.feature.placeholder": "Espace r\xE9serv\xE9",
    "settings.feature.placeholder.appearance": "Appearance",
    "settings.feature.placeholder.appearance.adjustments": "Adjustments",
    "settings.feature.placeholder.appearance.animations": "Animations",
    "settings.feature.placeholder.appearance.blur": "Blur",
    "settings.feature.placeholder.appearance.effect": "Effect",
    "settings.feature.placeholder.appearance.filter": "Filter",
    "settings.feature.placeholder.appearance.shadow": "Shadow",
    "settings.feature.placeholder.arrange": "Organiser",
    "settings.feature.placeholder.arrange.flip": "Retourner",
    "settings.feature.placeholder.arrange.move": "D\xE9placer",
    "settings.feature.placeholder.arrange.resize": "Redimensionner",
    "settings.feature.placeholder.arrange.rotate": "Rotation",
    "settings.feature.placeholder.audio": "Audio",
    "settings.feature.placeholder.audio.change": "Modifier l'audio",
    "settings.feature.placeholder.fill": "Remplir",
    "settings.feature.placeholder.fill.actAsPlaceholder": "Agir comme espace r\xE9serv\xE9",
    "settings.feature.placeholder.fill.change": "Modifier le remplissage",
    "settings.feature.placeholder.fill.changeType": "Modifier le type de remplissage",
    "settings.feature.placeholder.fill.crop": "Recadrer",
    "settings.feature.placeholder.general": "G\xE9n\xE9ral",
    "settings.feature.placeholder.general.blendMode": "Mode de fusion",
    "settings.feature.placeholder.general.delete": "Supprimer",
    "settings.feature.placeholder.general.duplicate": "Dupliquer",
    "settings.feature.placeholder.general.opacity": "Opacit\xE9",
    "settings.feature.placeholder.shape": "Forme",
    "settings.feature.placeholder.shape.change": "Changer la forme",
    "settings.feature.placeholder.stroke": "Coup",
    "settings.feature.placeholder.stroke.change": "Modifier le trait",
    "settings.feature.placeholder.text": "Texte",
    "settings.feature.placeholder.text.actAsPlaceholder": "Agir comme espace r\xE9serv\xE9",
    "settings.feature.placeholder.text.character": "Caract\xE8re",
    "settings.feature.placeholder.text.edit": "Modifier le texte",
    "settings.feature.position": "Position",
    "settings.feature.position.align": "Aligner",
    "settings.feature.position.arrange": "Organiser",
    "settings.feature.position.distribute": "Distribuer",
    "settings.feature.replace": "Remplacer",
    "settings.feature.replace.audio": "Remplacer l'audio",
    "settings.feature.replace.fill": "Remplacer le remplissage",
    "settings.feature.replace.shape": "Remplacer la forme",
    "settings.feature.scene.layout": "Disposition de la sc\xE8ne",
    "settings.feature.scene.layout.free": "Mise en page gratuite",
    "settings.feature.scene.layout.horizontal": "Disposition horizontale",
    "settings.feature.scene.layout.vertical": "Disposition verticale",
    "settings.feature.shadow": "Ombre",
    "settings.feature.shadow.blur": "Flou d'ombre",
    "settings.feature.shadow.color": "Couleur de l'ombre",
    "settings.feature.shadow.offset": "D\xE9calage de l'ombre",
    "settings.feature.shape.edit": "Modifier la forme",
    "settings.feature.shape.options": "Options de forme",
    "settings.feature.shape.options.cornerRadius": "Rayon de coin",
    "settings.feature.shape.options.innerDiameter": "Diam\xE8tre int\xE9rieur",
    "settings.feature.shape.options.lineWidth": "Largeur de ligne",
    "settings.feature.shape.options.points": "Points",
    "settings.feature.shape.options.sides": "C\xF4t\xE9s",
    "settings.feature.stroke": "Coup",
    "settings.feature.stroke.color": "Stroke Color",
    "settings.feature.stroke.cornerGeometry": "Corner Geometry",
    "settings.feature.stroke.position": "Position de course",
    "settings.feature.stroke.style": "Stroke Style",
    "settings.feature.stroke.width": "Stroke Width",
    "settings.feature.text": "Texte",
    "settings.feature.text.advanced": "Avanc\xE9",
    "settings.feature.text.alignment": "Alignement",
    "settings.feature.text.background": "Arri\xE8re-plan",
    "settings.feature.text.decoration": "D\xE9coration",
    "settings.feature.text.edit": "Modifier le texte",
    "settings.feature.text.fontSize": "Taille de la police",
    "settings.feature.text.fontStyle": "Style de police",
    "settings.feature.text.list": "Listes",
    "settings.feature.text.list.ordered": "Liste ordonn\xE9e",
    "settings.feature.text.list.unordered": "Liste non ordonn\xE9e",
    "settings.feature.text.typeface": "Police de caract\xE8res",
    "settings.feature.transform": "Transformer",
    "settings.feature.transform.flip": "Retourner",
    "settings.feature.transform.position": "Position",
    "settings.feature.transform.rotation": "Rotation",
    "settings.feature.transform.size": "Taille",
    "settings.feature.vectorEdit": "Modification vectorielle",
    "settings.feature.vectorEdit.addMode": "Mode d'ajout",
    "settings.feature.vectorEdit.bendMode": "Mode de pliage",
    "settings.feature.vectorEdit.deleteMode": "Mode Supprimer",
    "settings.feature.vectorEdit.done": "Termin\xE9",
    "settings.feature.vectorEdit.mirrorMode": "Mode miroir",
    "settings.feature.vectorEdit.moveMode": "Mode de d\xE9placement",
    "settings.feature.video": "Vid\xE9o",
    "settings.feature.video.addClip": "Ajouter un clip",
    "settings.feature.video.audio": "Audio",
    "settings.feature.video.caption": "L\xE9gende",
    "settings.feature.video.clips": "Clips",
    "settings.feature.video.controls": "Contr\xF4les",
    "settings.feature.video.controls.background": "Arri\xE8re-plan",
    "settings.feature.video.controls.loop": "Boucle",
    "settings.feature.video.controls.playback": "Lecture",
    "settings.feature.video.controls.split": "Partager",
    "settings.feature.video.controls.timelineZoom": "Zoom sur la chronologie",
    "settings.feature.video.controls.toggle": "Basculer les contr\xF4les",
    "settings.feature.video.overlays": "Superpositions",
    "settings.feature.video.timeline": "Chronologie",
    "settings.feature.video.timeline.ruler": "R\xE8gle de chronologie",
    "typography.autoSize": "Taille automatique",
    "typography.autoSize.abbreviation": "Auto",
    "typography.bold": "Bold",
    "typography.italic": "Italic",
    "typography.normal": "Normal",
    "typography.size": "Taille",
    "typography.sizeRange": "Plage de tailles",
    "typography.strikethrough": "Strikethrough",
    "typography.style": "Style",
    "typography.typeface": "Font",
    "typography.typeface.mixed.description": "Plusieurs polices de caract\xE8res sont s\xE9lectionn\xE9es",
    "typography.underline": "Soulign\xE9",
    "typography.weight.100": "Mince",
    "typography.weight.200": "Extra l\xE9ger",
    "typography.weight.300": "Lumi\xE8re",
    "typography.weight.400": "R\xE9gulier",
    "typography.weight.500": "Moyen",
    "typography.weight.600": "Semi-gras",
    "typography.weight.700": "Gras",
    "typography.weight.800": "Extra gras",
    "typography.weight.900": "Noir",
    "variables.address.label": "Adresse",
    "variables.city.label": "Ville",
    "variables.company_name.label": "Soci\xE9t\xE9",
    "variables.first_name.label": "Pr\xE9nom",
    "variables.last_name.label": "Nom de famille",
    "warning.invalidType": "Type invalide\xA0: le type de fichier n'est pas autoris\xE9"
  };

  // plugins/imgly/imgly-view/src/design-editor/i18n.ts
  var FR_OVERRIDES = {
    "common.undo": "Annuler",
    "common.redo": "R\xE9tablir",
    "component.library.elements": "\xC9l\xE9ments",
    "libraries.ly.img.templates.label": "Mod\xE8les",
    "libraries.ly.img.upload.label": "Importations",
    "libraries.ly.img.image.upload.label": "Images import\xE9es",
    "panel.imgly.bookmarks.label": "Contributions",
    "panel.imgly.bookmarks.panel": "Contributions",
    "panel.imgly.bookmarks.search": "Rechercher\u2026",
    "panel.imgly.bookmarks.empty": "Aucune contribution",
    "panel.imgly.bookmarks.noResults": "Aucun r\xE9sultat",
    "panel.imgly.bookmarks.add": "Ajouter",
    "panel.imgly.icons.label": "Ic\xF4nes",
    "panel.imgly.icons.panel": "Ic\xF4nes",
    "panel.imgly.icons.style": "Style",
    "panel.imgly.icons.style.regular": "Regular",
    "panel.imgly.icons.style.bold": "Bold",
    "panel.imgly.icons.style.fill": "Fill",
    "panel.imgly.icons.style.light": "Light",
    "panel.imgly.icons.style.duotone": "Duotone",
    "libraries.imgly.phosphor.label": "Ic\xF4nes Phosphor",
    "panel.imgly.team.images.panel": "Images",
    "panel.imgly.team.images.label": "Images",
    "panel.imgly.teamImages.upload": "Uploader une image",
    "panel.imgly.teamImages.empty": "Aucun \xE9l\xE9ment",
    "panel.imgly.teamImages.add": "Ajouter au canvas"
  };
  function setupTranslations(cesdk) {
    cesdk.i18n.setTranslations({
      fr: __spreadValues(__spreadValues({}, fr_default), FR_OVERRIDES)
    });
    cesdk.i18n.setLocale("fr");
  }
  function ensureFrenchLocale(cesdk) {
    if (cesdk.i18n.getLocale() !== "fr") {
      cesdk.i18n.setLocale("fr");
    }
  }

  // plugins/imgly/imgly-view/src/design-editor/settings.ts
  function setupSettings(engine) {
    engine.editor.setSetting("doubleClickToCropEnabled", true);
    engine.editor.setSetting("doubleClickSelectionMode", "Hierarchical");
    engine.editor.setSetting("page/allowCropInteraction", false);
    engine.editor.setSetting("page/allowMoveInteraction", false);
    engine.editor.setSetting("page/allowRotateInteraction", false);
    engine.editor.setSetting("page/allowResizeInteraction", false);
    engine.editor.setSetting("page/dimOutOfPageAreas", true);
    engine.editor.setSetting("page/moveChildrenWhenCroppingFill", false);
    engine.editor.setSetting("page/selectWhenNoBlocksSelected", false);
    engine.editor.setSetting("page/title/show", true);
    engine.editor.setSetting("page/title/showOnSinglePage", true);
    engine.editor.setSetting("page/title/showPageTitleTemplate", true);
    engine.editor.setSetting("page/title/appendPageName", false);
    engine.editor.setSetting("page/title/canEdit", false);
    engine.editor.setSetting("page/title/separator", "-");
    engine.editor.setSetting("blockAnimations/enabled", false);
    engine.editor.setSetting("placeholderControls/showOverlay", true);
    engine.editor.setSetting("placeholderControls/showButton", true);
    engine.editor.setSetting("colorPicker/colorMode", "Any");
    engine.editor.setSetting("page/innerBorderColor", {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    });
    engine.editor.setSetting("page/outerBorderColor", {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    });
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/canvas.ts
  function setupCanvas(cesdk) {
    cesdk.ui.setComponentOrder(
      {
        in: "ly.img.canvas.bar",
        at: "bottom"
        /* Position: 'top' | 'bottom' */
      },
      [
        "ly.img.settings.canvasBar",
        "ly.img.spacer"
      ]
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.canvas.menu", when: { editMode: "Transform" } },
      [
        // ============================
        // Group Navigation
        // ============================
        "ly.img.group.enter.canvasMenu",
        "ly.img.group.select.canvasMenu",
        // ============================
        // Content Editing
        // ============================
        "ly.img.text.edit.canvasMenu",
        "ly.img.replace.canvasMenu",
        "ly.img.separator",
        // ============================
        // Layer Ordering
        // ============================
        "ly.img.bringForward.canvasMenu",
        "ly.img.sendBackward.canvasMenu",
        "ly.img.separator",
        // ============================
        // Common Operations
        // ============================
        "ly.img.duplicate.canvasMenu",
        "ly.img.delete.canvasMenu",
        "ly.img.separator",
        "ly.img.options.canvasMenu"
      ]
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.canvas.menu", when: { editMode: "Vector" } },
      []
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.canvas.menu", when: { editMode: "Text" } },
      [
        "ly.img.text.color.canvasMenu",
        "ly.img.separator",
        "ly.img.text.bold.canvasMenu",
        "ly.img.text.italic.canvasMenu",
        "ly.img.text.underline.canvasMenu",
        "ly.img.text.strikethrough.canvasMenu",
        "ly.img.separator",
        "ly.img.text.list.unordered.canvasMenu",
        "ly.img.text.list.ordered.canvasMenu",
        "ly.img.separator",
        "ly.img.text.variables.canvasMenu"
      ]
    );
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/components.ts
  function setupComponents(cesdk) {
    void cesdk;
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/dock.ts
  function setupDock(cesdk) {
    cesdk.engine.editor.setSetting("dock/hideLabels", true);
    cesdk.engine.editor.setSetting("dock/iconSize", "large");
    cesdk.ui.setComponentOrder({ in: "ly.img.dock" }, [
      {
        id: "ly.img.assetLibrary.dock",
        key: "ly.img.text",
        icon: "@imgly/Text",
        label: "libraries.ly.img.text.label",
        entries: ["ly.img.text"]
      },
      {
        id: "ly.img.assetLibrary.dock",
        key: "ly.img.vector.shape",
        icon: "@imgly/Shapes",
        label: "libraries.ly.img.vector.shape.label",
        entries: ["ly.img.vector.shape"]
      },
      {
        id: "ly.img.assetLibrary.dock",
        key: "ly.img.sticker",
        icon: "@imgly/Sticker",
        label: "libraries.ly.img.sticker.label",
        entries: ["ly.img.sticker"]
      },
      {
        id: "ly.img.assetLibrary.dock",
        key: "ly.img.image",
        icon: "@imgly/Image",
        label: "libraries.ly.img.image.label",
        entries: ["ly.img.image"]
      }
    ]);
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/inspectorBar.ts
  function setupInspectorBar(cesdk) {
    cesdk.ui.setComponentOrder(
      { in: "ly.img.inspector.bar", when: { editMode: "Transform" } },
      [
        "ly.img.spacer",
        // ============================
        // Media Controls
        // ============================
        "ly.img.video.caption.inspectorBar",
        // ============================
        // Shape Controls
        // ============================
        "ly.img.shape.options.inspectorBar",
        "ly.img.cutout.type.inspectorBar",
        "ly.img.cutout.offset.inspectorBar",
        "ly.img.cutout.smoothing.inspectorBar",
        // ============================
        // Group Management
        // ============================
        "ly.img.group.create.inspectorBar",
        "ly.img.group.ungroup.inspectorBar",
        "ly.img.audio.replace.inspectorBar",
        "ly.img.separator",
        // ============================
        // Text Formatting
        // ============================
        "ly.img.text.typeFace.inspectorBar",
        "ly.img.text.style.inspectorBar",
        "ly.img.text.bold.inspectorBar",
        "ly.img.text.italic.inspectorBar",
        "ly.img.text.fontSize.inspectorBar",
        "ly.img.text.alignHorizontal.inspectorBar",
        "ly.img.text.advanced.inspectorBar",
        "ly.img.combine.inspectorBar",
        "ly.img.separator",
        // ============================
        // Appearance
        // ============================
        "ly.img.fill.inspectorBar",
        "ly.img.trim.inspectorBar",
        "ly.img.volume.inspectorBar",
        "ly.img.crop.inspectorBar",
        "ly.img.separator",
        "ly.img.stroke.inspectorBar",
        "ly.img.separator",
        "ly.img.text.background.inspectorBar",
        "ly.img.separator",
        // ============================
        // Animations
        // ============================
        "ly.img.animations.inspectorBar",
        "ly.img.separator",
        // ============================
        // Effects
        // ============================
        {
          id: "ly.img.appearance.inspectorBar",
          children: [
            "ly.img.adjustment.inspectorBar",
            "ly.img.filter.inspectorBar",
            "ly.img.effect.inspectorBar",
            "ly.img.blur.inspectorBar"
          ]
        },
        "ly.img.separator",
        "ly.img.shadow.inspectorBar",
        "ly.img.separator",
        // ============================
        // Properties
        // ============================
        "ly.img.opacityOptions.inspectorBar",
        "ly.img.separator",
        "ly.img.position.inspectorBar",
        "ly.img.spacer",
        "ly.img.separator",
        "ly.img.inspectorToggle.inspectorBar"
      ]
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.inspector.bar", when: { editMode: "Trim" } },
      ["ly.img.trimControls.inspectorBar"]
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.inspector.bar", when: { editMode: "Crop" } },
      ["ly.img.cropControls.inspectorBar"]
    );
    cesdk.ui.setComponentOrder(
      { in: "ly.img.inspector.bar", when: { editMode: "Vector" } },
      [
        "ly.img.vectorEdit.moveMode.inspectorBar",
        "ly.img.vectorEdit.addMode.inspectorBar",
        "ly.img.vectorEdit.deleteMode.inspectorBar",
        "ly.img.separator",
        "ly.img.vectorEdit.bendMode.inspectorBar",
        "ly.img.vectorEdit.mirrorMode.inspectorBar",
        "ly.img.separator",
        "ly.img.vectorEdit.done.inspectorBar"
      ]
    );
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/navigationBar.ts
  function setupNavigationBar(cesdk) {
    cesdk.ui.setComponentOrder({ in: "ly.img.navigation.bar" }, [
      // ============================
      // Left Section - Document Settings & History
      // ============================
      "imgly.bubble.documentTitle.navigationBar",
      "ly.img.undoRedo.navigationBar",
      // ============================
      // Center Section
      // ============================
      "ly.img.spacer",
      "ly.img.spacer",
      // ============================
      // Right Section - Actions
      // ============================
      "ly.img.zoom.navigationBar",
      "ly.img.preview.navigationBar",
      "imgly.bubble.save.navigationBar"
    ]);
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/panel.ts
  function setupPanels(cesdk) {
    cesdk.ui.setPanelPosition("//ly.img.panel/inspector", "left");
    cesdk.ui.setPanelFloating("//ly.img.panel/inspector", false);
    cesdk.ui.setPanelPosition("//ly.img.panel/assets", "left");
    cesdk.ui.setPanelFloating("//ly.img.panel/assets", false);
  }

  // plugins/imgly/imgly-view/src/design-editor/ui/index.ts
  function setupUI(cesdk) {
    setupPanels(cesdk);
    setupComponents(cesdk);
    setupNavigationBar(cesdk);
    setupCanvas(cesdk);
    setupInspectorBar(cesdk);
    setupDock(cesdk);
  }

  // plugins/imgly/imgly-view/src/design-editor/plugin.ts
  init_export_lock();
  var DesignEditorConfig = class {
    constructor() {
      /**
       * Unique identifier for this plugin.
       * Used to identify the plugin in the CE.SDK plugin registry.
       */
      __publicField(this, "name", "cesdk-design-editor");
      /**
       * Plugin version - matches the CE.SDK version for compatibility.
       */
      __publicField(this, "version", cesdk_js_default.version);
    }
    /**
     * Initialize the design editor configuration.
     *
     * This method is called when the plugin is added to CE.SDK via addPlugin().
     * It sets up all features, UI components, translations, and settings.
     *
     * @param ctx - The editor plugin context containing cesdk and engine instances
     */
    initialize(_0) {
      return __async(this, arguments, function* ({ cesdk, engine }) {
        if (cesdk) {
          cesdk.resetEditor();
          setupFeatures(cesdk);
          setupUI(cesdk);
          setupActions(cesdk);
          setupTranslations(cesdk);
          setupSettings(engine);
          setupExportLock(engine);
          cesdk.reapplyLegacyUserConfiguration();
        }
      });
    }
  };

  // plugins/imgly/imgly-view/src/init-design-editor.ts
  function initDesignEditor(_0, _1) {
    return __async(this, arguments, function* (cesdk, { contentBaseURL }) {
      const localAssets = { baseURL: contentBaseURL };
      yield cesdk.addPlugin(new DesignEditorConfig());
      yield cesdk.addPlugin(new e(localAssets));
      yield cesdk.addPlugin(new d(localAssets));
      yield cesdk.addPlugin(new u(localAssets));
      yield cesdk.addPlugin(new p(localAssets));
      yield cesdk.addPlugin(new b(localAssets));
      yield cesdk.addPlugin(new E(localAssets));
      yield cesdk.addPlugin(new v(localAssets));
      yield cesdk.addPlugin(new U(localAssets));
      yield cesdk.addPlugin(new C(localAssets));
      yield cesdk.addPlugin(new j(localAssets));
    });
  }

  // plugins/imgly/imgly-view/src/app.js
  init_exports();
  init_margin_warning();

  // plugins/imgly/imgly-view/src/page-insert.js
  function resolveTargetPageId(engine) {
    var _a2, _b2, _c;
    if (!(engine == null ? void 0 : engine.scene)) return null;
    const fromCurrent = engine.scene.getCurrentPage();
    if (fromCurrent != null) return fromCurrent;
    const fromViewport = (_a2 = engine.scene.findNearestToViewPortCenterByType("page")[0]) != null ? _a2 : engine.scene.findNearestToViewPortCenterByType("//ly.img.ubq/page")[0];
    if (fromViewport != null) return fromViewport;
    const pages = ((_c = (_b2 = engine.block) == null ? void 0 : _b2.findByType) == null ? void 0 : _c.call(_b2, "page")) || [];
    return pages.length > 0 ? pages[0] : null;
  }
  var DEFAULT_VECTOR_FILL = {
    r: 15 / 255,
    g: 23 / 255,
    b: 42 / 255,
    a: 1
  };
  function fitBlockOnPage(engine, blockId, pageId) {
    const pageW = engine.block.getWidth(pageId);
    const pageH = engine.block.getHeight(pageId);
    const imgW = engine.block.getWidth(blockId);
    const imgH = engine.block.getHeight(blockId);
    if (!(pageW > 0 && pageH > 0 && imgW > 0 && imgH > 0)) return;
    const scale = Math.min(pageW * 0.85 / imgW, pageH * 0.85 / imgH, 1);
    engine.block.setWidth(blockId, imgW * scale);
    engine.block.setHeight(blockId, imgH * scale);
    engine.block.alignHorizontally([blockId], "Center");
    engine.block.alignVertically([blockId], "Center");
  }
  function colorsEqual(a, b2) {
    if (!a || !b2) return false;
    const eps = 2e-3;
    return Math.abs(a.r - b2.r) < eps && Math.abs(a.g - b2.g) < eps && Math.abs(a.b - b2.b) < eps && Math.abs(a.a - b2.a) < eps;
  }
  function getPathLayerStyle(pathLayer, defaultFillColor) {
    return {
      fillColor: pathLayer.fillColor || defaultFillColor,
      opacity: typeof pathLayer.opacity === "number" ? pathLayer.opacity : 1
    };
  }
  function mergeCompatiblePathLayers(paths, defaultFillColor) {
    if (paths.length <= 1) return paths;
    const styles = paths.map((pathLayer) => getPathLayerStyle(pathLayer, defaultFillColor));
    const reference = styles[0];
    const canMerge = styles.every(
      (style) => colorsEqual(style.fillColor, reference.fillColor) && Math.abs(style.opacity - reference.opacity) < 2e-3
    );
    if (!canMerge) return paths;
    return [{
      d: paths.map((pathLayer) => pathLayer.d.trim()).filter(Boolean).join(" "),
      opacity: reference.opacity,
      fillColor: paths[0].fillColor
    }];
  }
  function createVectorPathGraphic(engine, pathLayer, coordWidth, coordHeight, fillColor) {
    const graphic = engine.block.create("graphic");
    const shape = engine.block.createShape("vector_path");
    engine.block.setShape(graphic, shape);
    engine.block.setString(shape, "shape/vector_path/path", pathLayer.d);
    engine.block.setFloat(shape, "shape/vector_path/width", coordWidth);
    engine.block.setFloat(shape, "shape/vector_path/height", coordHeight);
    engine.block.setWidth(graphic, coordWidth);
    engine.block.setHeight(graphic, coordHeight);
    const opacity = typeof pathLayer.opacity === "number" ? pathLayer.opacity : 1;
    const fill = engine.block.createFill("color");
    engine.block.setColor(fill, "fill/color/value", {
      r: fillColor.r,
      g: fillColor.g,
      b: fillColor.b,
      a: fillColor.a * opacity
    });
    engine.block.setFill(graphic, fill);
    return graphic;
  }
  function insertVectorGraphicOnCurrentPage(engine, options) {
    return __async(this, null, function* () {
      var _a2;
      if (!engine || !((_a2 = options == null ? void 0 : options.paths) == null ? void 0 : _a2.length)) return null;
      const pageId = resolveTargetPageId(engine);
      if (pageId == null) {
        console.error("IMG.LY View: aucune page pour ins\xE9rer le vecteur");
        return null;
      }
      try {
        if (typeof engine.scene.zoomToBlock === "function") {
          yield engine.scene.zoomToBlock(pageId);
        }
      } catch (e2) {
      }
      const fillColor = options.fillColor || DEFAULT_VECTOR_FILL;
      const coordWidth = options.width > 0 ? options.width : 256;
      const coordHeight = options.height > 0 ? options.height : 256;
      const pathLayers = mergeCompatiblePathLayers(options.paths, fillColor);
      const childIds = [];
      try {
        for (const pathLayer of pathLayers) {
          const graphicId = createVectorPathGraphic(
            engine,
            pathLayer,
            coordWidth,
            coordHeight,
            pathLayer.fillColor || fillColor
          );
          engine.block.appendChild(pageId, graphicId);
          childIds.push(graphicId);
        }
        if (childIds.length > 1) {
          engine.block.alignHorizontally(childIds, "Center");
          engine.block.alignVertically(childIds, "Center");
        }
        let blockId = childIds[0];
        if (childIds.length > 1 && typeof engine.block.group === "function") {
          if (engine.block.isGroupable(childIds)) {
            blockId = engine.block.group(childIds);
          }
        }
        fitBlockOnPage(engine, blockId, pageId);
        if (typeof engine.block.select === "function") {
          engine.block.select(blockId);
        }
        return blockId;
      } catch (err2) {
        console.error("IMG.LY View: insertion vectorielle \xE9chou\xE9e", err2);
        return null;
      }
    });
  }
  function insertImageOnCurrentPage(engine, imageUrl) {
    return __async(this, null, function* () {
      if (!engine || !imageUrl) return null;
      const pageId = resolveTargetPageId(engine);
      if (pageId == null) {
        console.error("IMG.LY View: aucune page pour ins\xE9rer l\u2019image");
        return null;
      }
      try {
        if (typeof engine.scene.zoomToBlock === "function") {
          yield engine.scene.zoomToBlock(pageId);
        }
      } catch (e2) {
      }
      let blockId;
      try {
        blockId = yield engine.block.addImage(imageUrl);
      } catch (err2) {
        console.error("IMG.LY View: addImage failed", imageUrl, err2);
        return null;
      }
      try {
        fitBlockOnPage(engine, blockId, pageId);
        if (typeof engine.block.select === "function") {
          engine.block.select(blockId);
        }
      } catch (err2) {
        console.warn("IMG.LY View: redimensionnement image", err2);
      }
      return blockId;
    });
  }

  // plugins/imgly/imgly-view/src/bookmarks.js
  var BOOKMARKS_PANEL_ID = "imgly.bookmarks.panel";
  function parseBookmarksJson(raw) {
    let bookmarksItems = null;
    if (raw && typeof raw === "object" && Array.isArray(raw.bookmarks)) {
      bookmarksItems = raw.bookmarks;
    } else if (typeof raw === "string" && raw.trim().length > 0) {
      try {
        const parsed = JSON.parse(raw.trim());
        if (parsed && Array.isArray(parsed.bookmarks)) {
          bookmarksItems = parsed.bookmarks;
        }
      } catch (e2) {
        bookmarksItems = null;
      }
    }
    if (!bookmarksItems) return null;
    return bookmarksItems.map((item) => {
      const url = item && item.image_url != null ? String(item.image_url).trim() : "";
      const contributor = item && item.contributor != null ? String(item.contributor).trim() : "";
      return { image_url: url, contributor };
    }).filter((item) => item.image_url.length > 0);
  }
  function getBookmarkSearchHaystack(item) {
    const contributor = String(item && item.contributor != null ? item.contributor : "").trim().toLowerCase();
    const url = String(item && item.image_url ? item.image_url : "").trim();
    let fileName = "";
    try {
      const u2 = new URL(url, "https://placeholder.local");
      const parts = u2.pathname.split("/").filter(Boolean);
      fileName = decodeURIComponent(parts[parts.length - 1] || "").toLowerCase();
    } catch (e2) {
      fileName = "";
    }
    return `${contributor} ${fileName} ${url.toLowerCase()}`.trim();
  }
  function filterBookmarks(list, query) {
    const items = Array.isArray(list) ? list : [];
    const q = String(query || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => getBookmarkSearchHaystack(item).includes(q));
  }
  function insertContributionImage(engine, cesdk, instance, item) {
    return __async(this, null, function* () {
      if (!engine || !item || !item.image_url) return;
      const blockId = yield insertImageOnCurrentPage(engine, item.image_url);
      if (blockId == null) return;
      const contributionId = typeof engine.block.getUUID === "function" ? String(engine.block.getUUID(blockId) || blockId) : String(blockId);
      instance.publishState("contribution_id", contributionId);
      instance.triggerEvent("contribution_added");
      if (cesdk == null ? void 0 : cesdk.ui) {
        cesdk.ui.closePanel(BOOKMARKS_PANEL_ID);
      }
    });
  }
  function applyBookmarksFromProperties(instance, rawBookmarks, clearIfEmpty = true) {
    const parsed = parseBookmarksJson(rawBookmarks);
    if (parsed) {
      instance.data.bookmarksList = parsed;
    } else if (clearIfEmpty && (rawBookmarks == null || rawBookmarks === "")) {
      instance.data.bookmarksList = [];
    }
    if (typeof instance.data.refreshBookmarksPanel === "function") {
      instance.data.refreshBookmarksPanel();
    }
  }

  // plugins/imgly/imgly-view/src/team-images.js
  function parseImagesJson(raw) {
    let urls = null;
    if (Array.isArray(raw)) {
      urls = raw;
    } else if (raw && typeof raw === "object" && Array.isArray(raw.images)) {
      urls = raw.images;
    } else if (typeof raw === "string" && raw.trim().length > 0) {
      try {
        const parsed = JSON.parse(raw.trim());
        if (Array.isArray(parsed)) {
          urls = parsed;
        } else if (parsed && Array.isArray(parsed.images)) {
          urls = parsed.images;
        }
      } catch (e2) {
        return null;
      }
    }
    if (!urls) return null;
    const seen = /* @__PURE__ */ new Set();
    return urls.map((entry) => entry != null ? String(entry).trim() : "").filter((url) => {
      if (url.length === 0 || !/^https?:\/\//i.test(url)) return false;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }
  function applyImagesFromProperties(instance, rawImagesJson, clearIfEmpty = true) {
    if (!(instance == null ? void 0 : instance.data)) return;
    const parsed = parseImagesJson(rawImagesJson);
    const canonical = parsed ? JSON.stringify(parsed) : "";
    if (parsed) {
      if (canonical === instance.data._lastAppliedImagesJson) return;
      instance.data._lastAppliedImagesJson = canonical;
      instance.data.teamImageUrls = parsed;
    } else if (clearIfEmpty && (rawImagesJson == null || rawImagesJson === "")) {
      if (instance.data._lastAppliedImagesJson === "") return;
      instance.data._lastAppliedImagesJson = "";
      instance.data.teamImageUrls = [];
    } else {
      return;
    }
    if (instance.data.cesdkReady && typeof instance.data.refreshTeamImagesPanel === "function") {
      instance.data.refreshTeamImagesPanel();
    }
  }

  // plugins/imgly/imgly-view/src/setup-bubble-export.js
  init_bubble_upload();
  var BUBBLE_SAVE_NAV_ID = "imgly.bubble.save.navigationBar";
  var EXPORT_NAV_IDS_TO_REMOVE = [
    "ly.img.actions.navigationBar",
    "ly.img.save.navigationBar",
    "ly.img.saveScene.navigationBar",
    "ly.img.exportImage.navigationBar",
    "ly.img.exportScene.navigationBar",
    "ly.img.exportArchive.navigationBar",
    "ly.img.importScene.navigationBar",
    "ly.img.importArchive.navigationBar",
    "ly.img.exportVideo.navigationBar",
    "ly.img.shareScene.navigationBar",
    "ly.img.download.navigationBar",
    "ly.img.export.navigationBar",
    "ly.img.exportPDF.navigationBar"
  ];
  function setupBubbleUpload(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.actions) || !instance) return;
    cesdk.actions.register("uploadFile", (file, onProgress) => uploadFileToBubble(instance, file, onProgress));
  }
  function setupBubblePdfExport(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    const runSaveDocument = () => __async(null, null, function* () {
      if (typeof instance.data.triggerSaveDocument !== "function") {
        console.error("IMG.LY View: enregistrement indisponible (\xE9diteur non pr\xEAt)");
        return;
      }
      try {
        yield instance.data.triggerSaveDocument();
      } catch (err2) {
        console.error("IMG.LY View: enregistrement document", err2);
      }
    });
    const runPdfDownload = (mode) => __async(null, null, function* () {
      if (typeof instance.data.triggerPdfExport !== "function") {
        console.error("IMG.LY View: export PDF indisponible (\xE9diteur non pr\xEAt)");
        return;
      }
      try {
        yield instance.data.triggerPdfExport({ mode, download: true });
      } catch (err2) {
        console.error("IMG.LY View: t\xE9l\xE9chargement PDF", err2);
      }
    });
    const runPreviewsZipDownload = () => __async(null, null, function* () {
      if (typeof instance.data.triggerPreviewsZipDownload !== "function") {
        console.error("IMG.LY View: export ZIP previews indisponible (\xE9diteur non pr\xEAt)");
        return;
      }
      try {
        yield instance.data.triggerPreviewsZipDownload();
      } catch (err2) {
        console.error("IMG.LY View: t\xE9l\xE9chargement ZIP previews", err2);
      }
    });
    cesdk.ui.registerComponent(BUBBLE_SAVE_NAV_ID, ({ builder, state }) => {
      const loading = state("loading", false);
      builder.ButtonGroup("save-button-group", {
        children: () => {
          builder.Button("save-document", {
            color: "accent",
            variant: "regular",
            label: "Enregistrer",
            icon: "@imgly/Save",
            isLoading: loading.value,
            isDisabled: loading.value,
            onClick: () => __async(null, null, function* () {
              if (loading.value) return;
              loading.setValue(true);
              try {
                yield runSaveDocument();
              } finally {
                loading.setValue(false);
              }
            })
          });
          builder.Dropdown("save-pdf-dropdown", {
            color: "accent",
            variant: "regular",
            tooltip: "T\xE9l\xE9charger",
            showIndicator: true,
            isDisabled: loading.value,
            children: ({ close }) => {
              builder.Button("download-pdf-print", {
                label: "PDF pour impression",
                icon: "@imgly/Download",
                onClick: () => __async(null, null, function* () {
                  close();
                  if (loading.value) return;
                  loading.setValue(true);
                  try {
                    yield runPdfDownload("imposed");
                  } finally {
                    loading.setValue(false);
                  }
                })
              });
              builder.Button("download-pdf-standard", {
                label: "PDF standard",
                icon: "@imgly/Download",
                onClick: () => __async(null, null, function* () {
                  close();
                  if (loading.value) return;
                  loading.setValue(true);
                  try {
                    yield runPdfDownload("sequential");
                  } finally {
                    loading.setValue(false);
                  }
                })
              });
              builder.Button("download-previews-zip", {
                label: "Images (zip)",
                icon: "@imgly/Download",
                onClick: () => __async(null, null, function* () {
                  close();
                  if (loading.value) return;
                  loading.setValue(true);
                  try {
                    yield runPreviewsZipDownload();
                  } finally {
                    loading.setValue(false);
                  }
                })
              });
            }
          });
        }
      });
    });
    cesdk.actions.register("saveDocument", runSaveDocument);
    const runImposedPdfExport = () => __async(null, null, function* () {
      yield runPdfDownload("imposed");
    });
    cesdk.actions.register("exportImposedPdf", runImposedPdfExport);
    cesdk.actions.register("exportDesign", (exportOptions) => __async(null, null, function* () {
      if ((exportOptions == null ? void 0 : exportOptions.mimeType) === "application/pdf") {
        yield runImposedPdfExport();
      }
    }));
    for (const id of EXPORT_NAV_IDS_TO_REMOVE) {
      cesdk.ui.removeOrderComponent({ in: "ly.img.navigation.bar", match: id });
    }
  }

  // plugins/imgly/imgly-view/src/navigation-title.js
  var BUBBLE_DOCUMENT_TITLE_NAV_ID = "imgly.bubble.documentTitle.navigationBar";
  function readDocumentTitle(instance) {
    const raw = typeof instance.data.documentTitle === "string" ? instance.data.documentTitle.trim() : "";
    return raw;
  }
  function syncNavigationDocumentTitle(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    cesdk.ui.updateOrderComponent(
      { in: "ly.img.navigation.bar", match: BUBBLE_DOCUMENT_TITLE_NAV_ID },
      { content: readDocumentTitle(instance) }
    );
  }
  function setupNavigationDocumentTitle(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    cesdk.ui.registerComponent(BUBBLE_DOCUMENT_TITLE_NAV_ID, ({ builder, payload }) => {
      const payloadContent = typeof (payload == null ? void 0 : payload.content) === "string" ? payload.content.trim() : "";
      const content = payloadContent || readDocumentTitle(instance);
      if (!content) return;
      builder.Heading("bubble-document-title", { content });
    });
    cesdk.ui.removeOrderComponent({
      in: "ly.img.navigation.bar",
      match: "ly.img.documentSettings.navigationBar"
    });
    syncNavigationDocumentTitle(cesdk, instance);
  }

  // plugins/imgly/imgly-view/src/setup-bookmarks.js
  var DOCK_ID = "imgly.bookmarks.dock";
  var BOOKMARK_ICON = "@imgly.bookmarks/Bookmark";
  var BOOKMARK_ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="@imgly.bookmarks/Bookmark" viewBox="0 0 24 24" fill="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</svg>`;
  function selectBookmarkItem(engine, cesdk, instance, item) {
    return insertContributionImage(engine, cesdk, instance, item);
  }
  function setupBookmarks(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    cesdk.ui.addIconSet("@imgly.bookmarks", BOOKMARK_ICON_SPRITE);
    let refreshPanel = null;
    cesdk.ui.registerComponent(DOCK_ID, ({ builder, payload }) => {
      var _a2;
      const icon = (_a2 = payload == null ? void 0 : payload.icon) != null ? _a2 : BOOKMARK_ICON;
      const isOpen = cesdk.ui.isPanelOpen(BOOKMARKS_PANEL_ID);
      builder.Button("open-bookmarks", {
        tooltip: "panel.imgly.bookmarks.label",
        icon,
        isSelected: isOpen,
        onClick: () => {
          if (cesdk.ui.isPanelOpen(BOOKMARKS_PANEL_ID)) {
            cesdk.ui.closePanel(BOOKMARKS_PANEL_ID);
          } else {
            cesdk.ui.openPanel(BOOKMARKS_PANEL_ID);
          }
        }
      });
    });
    cesdk.ui.registerPanel(BOOKMARKS_PANEL_ID, ({ builder, state, engine }) => {
      const queryState = state("query", "");
      const versionState = state("version", 0);
      refreshPanel = () => {
        versionState.setValue(versionState.value + 1);
      };
      builder.Section("bookmarks-search", {
        children: () => {
          builder.TextInput("bookmarks-search-input", {
            inputLabel: "panel.imgly.bookmarks.search",
            value: queryState.value,
            setValue: (value) => queryState.setValue(value),
            requireConfirm: false
          });
        }
      });
      builder.Section("bookmarks-list", {
        children: () => {
          void versionState.value;
          const list = Array.isArray(instance.data.bookmarksList) ? instance.data.bookmarksList : [];
          const filtered = filterBookmarks(list, queryState.value);
          if (list.length === 0) {
            builder.Text("bookmarks-empty", {
              content: cesdk.i18n.translate("panel.imgly.bookmarks.empty")
            });
            return;
          }
          if (filtered.length === 0) {
            builder.Text("bookmarks-no-results", {
              content: cesdk.i18n.translate("panel.imgly.bookmarks.noResults")
            });
            return;
          }
          filtered.forEach((item, index) => {
            const onSelect = () => __async(null, null, function* () {
              try {
                yield selectBookmarkItem(engine, cesdk, instance, item);
              } catch (err2) {
                console.error("IMG.LY View: insertion contribution", err2);
              }
            });
            builder.Section(`bookmark-item-${index}`, {
              children: () => {
                builder.MediaPreview(`bookmark-preview-${index}`, {
                  size: "medium",
                  preview: {
                    type: "image",
                    uri: item.image_url,
                    fillType: "cover"
                  },
                  action: {
                    icon: "@imgly/Plus",
                    tooltip: item.contributor || "panel.imgly.bookmarks.add",
                    onClick: onSelect
                  }
                });
              }
            });
          });
        }
      });
    });
    cesdk.ui.setPanelPosition(BOOKMARKS_PANEL_ID, "left");
    cesdk.ui.setPanelFloating(BOOKMARKS_PANEL_ID, false);
    cesdk.ui.insertOrderComponent(
      { in: "ly.img.dock", position: "end" },
      {
        id: DOCK_ID,
        key: "imgly.bookmarks",
        icon: BOOKMARK_ICON
      }
    );
    instance.data.refreshBookmarksPanel = () => {
      if (typeof refreshPanel === "function") {
        refreshPanel();
      }
    };
  }

  // plugins/imgly/imgly-view/src/phosphor-icons.js
  var PHOSPHOR_VERSION = "2.1.1";
  var PHOSPHOR_STYLES = ["regular", "bold", "fill", "light", "duotone"];
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
  var namesCacheByStyle = /* @__PURE__ */ new Map();
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
  function normalizePhosphorStyle(style) {
    return PHOSPHOR_STYLES.includes(style) ? style : "regular";
  }
  function getPhosphorIconUrl(iconName, style) {
    const safeStyle = normalizePhosphorStyle(style);
    const fileName = getStyleAssetFileName(iconName, safeStyle);
    if (!fileName) return "";
    return `https://unpkg.com/@phosphor-icons/core@${PHOSPHOR_VERSION}/assets/${safeStyle}/${fileName}`;
  }
  function filterIconNames(names, query) {
    const list = Array.isArray(names) ? names : [];
    const q = String(query || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((name) => String(name).toLowerCase().includes(q));
  }
  function fetchAllPhosphorIconsByStyle(style) {
    return __async(this, null, function* () {
      const safeStyle = normalizePhosphorStyle(style);
      if (namesCacheByStyle.has(safeStyle)) {
        return namesCacheByStyle.get(safeStyle);
      }
      const fallback = [...PHOSPHOR_REGULAR_ICONS_FALLBACK];
      let result = fallback;
      try {
        const response = yield fetch(
          `https://data.jsdelivr.com/v1/package/npm/@phosphor-icons/core@${PHOSPHOR_VERSION}`,
          { method: "GET", headers: { accept: "application/json" } }
        );
        if (response.ok) {
          const payload = yield response.json();
          const roots = Array.isArray(payload == null ? void 0 : payload.files) ? payload.files : [];
          if (roots.length > 0) {
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
            const parsed = Array.from(iconSet).filter(Boolean).sort((a, b2) => a.localeCompare(b2));
            if (parsed.length > 0) result = parsed;
          }
        }
      } catch (e2) {
      }
      namesCacheByStyle.set(safeStyle, result);
      return result;
    });
  }
  function buildPhosphorAssetId(iconName, style) {
    const safeStyle = normalizePhosphorStyle(style);
    return `${safeStyle}/${iconName}`;
  }
  function parsePhosphorAssetId(assetId) {
    if (typeof assetId !== "string") return { style: "regular", iconName: "" };
    const slash = assetId.indexOf("/");
    if (slash === -1) return { style: "regular", iconName: assetId };
    return {
      style: normalizePhosphorStyle(assetId.slice(0, slash)),
      iconName: assetId.slice(slash + 1)
    };
  }
  function buildPhosphorAsset(iconName, style, locale = "fr") {
    const safeStyle = normalizePhosphorStyle(style);
    const url = getPhosphorIconUrl(iconName, safeStyle);
    return {
      id: buildPhosphorAssetId(iconName, safeStyle),
      label: iconName,
      locale,
      meta: {
        uri: url,
        thumbUri: url,
        mimeType: "image/svg+xml",
        blockType: "//ly.img.ubq/graphic",
        shapeType: "//ly.img.ubq/shape/vector_path"
      }
    };
  }

  // plugins/imgly/imgly-view/src/phosphor-svg.js
  function parseHexColor(hex) {
    const normalized = hex.replace("#", "").trim();
    if (normalized.length === 3) {
      return {
        r: parseInt(normalized[0] + normalized[0], 16) / 255,
        g: parseInt(normalized[1] + normalized[1], 16) / 255,
        b: parseInt(normalized[2] + normalized[2], 16) / 255,
        a: 1
      };
    }
    if (normalized.length >= 6) {
      return {
        r: parseInt(normalized.slice(0, 2), 16) / 255,
        g: parseInt(normalized.slice(2, 4), 16) / 255,
        b: parseInt(normalized.slice(4, 6), 16) / 255,
        a: 1
      };
    }
    return null;
  }
  var NON_RENDERED_ANCESTORS = "defs, mask, clippath, symbol, metadata";
  function isRenderableSvgNode(node) {
    return !node.closest(NON_RENDERED_ANCESTORS);
  }
  function parseSvgClassFillRules(svg) {
    const rules = /* @__PURE__ */ new Map();
    for (const styleEl of svg.querySelectorAll("style")) {
      const text = styleEl.textContent || "";
      const re = /\.([a-zA-Z0-9_-]+)\s*\{[^}]*\bfill\s*:\s*(#[0-9a-fA-F]{3,8})/gi;
      let match = re.exec(text);
      while (match) {
        const color = parseHexColor(match[2]);
        if (color) rules.set(match[1], color);
        match = re.exec(text);
      }
    }
    return rules;
  }
  function parsePathFillColor(node, classRules) {
    const fill = node.getAttribute("fill");
    if (fill && fill !== "none") {
      if (fill.startsWith("#")) {
        return parseHexColor(fill);
      }
    }
    const inlineStyle = node.getAttribute("style");
    if (inlineStyle) {
      const match = inlineStyle.match(/\bfill\s*:\s*(#[0-9a-fA-F]{3,8})/i);
      if (match) {
        return parseHexColor(match[1]);
      }
    }
    const className = node.getAttribute("class");
    if (className && classRules) {
      for (const name of className.split(/\s+/)) {
        if (classRules.has(name)) {
          return classRules.get(name);
        }
      }
    }
    return null;
  }
  function parseSvgMarkup(svgText) {
    var _a2;
    if (typeof svgText !== "string" || !svgText.trim()) return null;
    if (typeof DOMParser === "undefined") return null;
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return null;
    let width = 256;
    let height = 256;
    const viewBox = svg.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        width = parts[2];
        height = parts[3];
      }
    } else {
      const w = parseFloat(svg.getAttribute("width") || "");
      const h = parseFloat(svg.getAttribute("height") || "");
      if (w > 0) width = w;
      if (h > 0) height = h;
    }
    const classRules = parseSvgClassFillRules(svg);
    const paths = Array.from(svg.querySelectorAll("path")).filter(isRenderableSvgNode).map((node) => {
      const d2 = node.getAttribute("d");
      if (!d2) return null;
      let opacity = 1;
      if (node.hasAttribute("opacity")) {
        const parsed = parseFloat(node.getAttribute("opacity") || "");
        if (!Number.isNaN(parsed)) opacity = parsed;
      }
      const fillColor2 = parsePathFillColor(node, classRules);
      return { d: d2, opacity, fillColor: fillColor2 || void 0 };
    }).filter(Boolean);
    if (paths.length === 0) return null;
    const fillColor = (_a2 = paths.find((path) => path.fillColor)) == null ? void 0 : _a2.fillColor;
    return { width, height, paths, fillColor };
  }
  function fetchSvgMarkup(url) {
    return __async(this, null, function* () {
      const response = yield fetch(url);
      if (!response.ok) {
        throw new Error(`SVG fetch failed (${response.status}): ${url}`);
      }
      const text = yield response.text();
      const parsed = parseSvgMarkup(text);
      if (!parsed) {
        throw new Error(`SVG parse failed: ${url}`);
      }
      return parsed;
    });
  }
  var fetchPhosphorSvgData = fetchSvgMarkup;

  // plugins/imgly/imgly-view/src/phosphor-icon-insert.js
  var ICONS_PANEL_ID = "imgly.icons.panel";
  function insertPhosphorIcon(engine, cesdk, instance, iconName, style) {
    return __async(this, null, function* () {
      var _a2;
      if (!engine || !iconName) return;
      const safeStyle = normalizePhosphorStyle(style || ((_a2 = instance == null ? void 0 : instance.data) == null ? void 0 : _a2.phosphorIconStyle));
      const url = getPhosphorIconUrl(iconName, safeStyle);
      if (!url) return;
      let svgData;
      try {
        svgData = yield fetchPhosphorSvgData(url);
      } catch (err2) {
        console.error("IMG.LY View: chargement SVG Phosphor", url, err2);
        return;
      }
      const blockId = yield insertVectorGraphicOnCurrentPage(engine, {
        paths: svgData.paths,
        width: svgData.width,
        height: svgData.height
      });
      if (blockId == null) return;
      try {
        engine.block.setMetadata(blockId, "phosphorIconName", iconName);
        engine.block.setMetadata(blockId, "phosphorIconStyle", safeStyle);
      } catch (e2) {
      }
      if (cesdk == null ? void 0 : cesdk.ui) {
        cesdk.ui.closePanel(ICONS_PANEL_ID);
      }
    });
  }

  // plugins/imgly/imgly-view/src/setup-icons.js
  var SOURCE_ID = "imgly.phosphor";
  var LIBRARY_ENTRY_ID = "imgly.phosphor";
  var DOCK_ID2 = "imgly.icons.dock";
  var PHOSPHOR_ICON = "@imgly.phosphor/Icons";
  var ASSETS_PER_PAGE = 60;
  var PHOSPHOR_STYLE_OPTIONS = PHOSPHOR_STYLES.map((style) => ({
    id: style,
    label: `panel.imgly.icons.style.${style}`
  }));
  function getPhosphorStyleOption(styleId) {
    var _a2;
    const safeStyle = normalizePhosphorStyle(styleId);
    return (_a2 = PHOSPHOR_STYLE_OPTIONS.find((option) => option.id === safeStyle)) != null ? _a2 : PHOSPHOR_STYLE_OPTIONS[0];
  }
  var PHOSPHOR_ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="@imgly.phosphor/Icons" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8.5 14.5c1.2 1.8 5.8 1.8 7 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
</svg>`;
  function getIconNamesForStyle(instance, style) {
    return __async(this, null, function* () {
      const safeStyle = normalizePhosphorStyle(style);
      if (!instance.data.phosphorIconNamesByStyle) {
        instance.data.phosphorIconNamesByStyle = {};
      }
      if (Array.isArray(instance.data.phosphorIconNamesByStyle[safeStyle])) {
        return instance.data.phosphorIconNamesByStyle[safeStyle];
      }
      const names = yield fetchAllPhosphorIconsByStyle(safeStyle);
      instance.data.phosphorIconNamesByStyle[safeStyle] = names;
      return names;
    });
  }
  function setupIcons(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    instance.data.phosphorIconStyle = instance.data.phosphorIconStyle || "regular";
    instance.data.phosphorIconNamesByStyle = instance.data.phosphorIconNamesByStyle || {};
    cesdk.ui.addIconSet("@imgly.phosphor", PHOSPHOR_ICON_SPRITE);
    cesdk.ui.addAssetLibraryEntry({
      id: LIBRARY_ENTRY_ID,
      sourceIds: [SOURCE_ID],
      title: "libraries.imgly.phosphor.label",
      icon: PHOSPHOR_ICON,
      gridColumns: 4,
      gridItemHeight: "square",
      previewLength: 3,
      cardLabel: () => ""
    });
    const engine = cesdk.engine;
    engine.asset.addSource({
      id: SOURCE_ID,
      findAssets: (queryData) => __async(null, null, function* () {
        const style = normalizePhosphorStyle(instance.data.phosphorIconStyle);
        const locale = (queryData == null ? void 0 : queryData.locale) || cesdk.i18n.getLocale() || "fr";
        const page = Math.max(0, Number(queryData == null ? void 0 : queryData.page) || 0);
        const perPage = Math.max(1, Number(queryData == null ? void 0 : queryData.perPage) || ASSETS_PER_PAGE);
        const allNames = yield getIconNamesForStyle(instance, style);
        const filtered = filterIconNames(allNames, queryData == null ? void 0 : queryData.query);
        const start = page * perPage;
        const slice = filtered.slice(start, start + perPage);
        const assets = slice.map((iconName) => buildPhosphorAsset(iconName, style, locale));
        const nextStart = start + perPage;
        return {
          assets,
          currentPage: page,
          nextPage: nextStart < filtered.length ? page + 1 : void 0,
          total: filtered.length
        };
      }),
      fetchAsset: (assetId, params) => __async(null, null, function* () {
        const parsed = parsePhosphorAssetId(assetId);
        const style = normalizePhosphorStyle(parsed.style || instance.data.phosphorIconStyle);
        const locale = (params == null ? void 0 : params.locale) || cesdk.i18n.getLocale() || "fr";
        const asset = buildPhosphorAsset(parsed.iconName || assetId, style, locale);
        return __spreadProps(__spreadValues({}, asset), {
          context: { sourceId: SOURCE_ID },
          active: false
        });
      }),
      applyAsset: (asset) => __async(null, null, function* () {
        const parsed = parsePhosphorAssetId(asset == null ? void 0 : asset.id);
        if (!parsed.iconName) return void 0;
        const style = normalizePhosphorStyle(parsed.style || instance.data.phosphorIconStyle);
        yield insertPhosphorIcon(engine, cesdk, instance, parsed.iconName, style);
        return void 0;
      })
    });
    cesdk.ui.registerComponent(DOCK_ID2, ({ builder, payload }) => {
      var _a2;
      const icon = (_a2 = payload == null ? void 0 : payload.icon) != null ? _a2 : PHOSPHOR_ICON;
      const isOpen = cesdk.ui.isPanelOpen(ICONS_PANEL_ID);
      builder.Button("open-icons", {
        tooltip: "panel.imgly.icons.label",
        icon,
        isSelected: isOpen,
        onClick: () => {
          if (cesdk.ui.isPanelOpen(ICONS_PANEL_ID)) {
            cesdk.ui.closePanel(ICONS_PANEL_ID);
          } else {
            cesdk.ui.openPanel(ICONS_PANEL_ID);
          }
        }
      });
    });
    cesdk.ui.registerPanel(ICONS_PANEL_ID, ({ builder, state }) => {
      const styleState = state("phosphor-style", getPhosphorStyleOption(instance.data.phosphorIconStyle));
      const versionState = state("phosphor-version", 0);
      builder.Section("phosphor-style-section", {
        children: () => {
          var _a2;
          const selectedStyle = getPhosphorStyleOption(
            typeof styleState.value === "object" && ((_a2 = styleState.value) == null ? void 0 : _a2.id) ? styleState.value.id : instance.data.phosphorIconStyle
          );
          builder.Select("phosphor-style", {
            inputLabel: "panel.imgly.icons.style",
            value: selectedStyle,
            setValue: (option) => {
              const nextStyle = normalizePhosphorStyle(option == null ? void 0 : option.id);
              styleState.setValue(getPhosphorStyleOption(nextStyle));
              instance.data.phosphorIconStyle = nextStyle;
              versionState.setValue(versionState.value + 1);
              engine.asset.assetSourceContentsChanged(SOURCE_ID);
            },
            values: PHOSPHOR_STYLE_OPTIONS
          });
        }
      });
      builder.Section("phosphor-library-section", {
        children: () => {
          void versionState.value;
          void styleState.value;
          builder.Library("phosphor-library", {
            entries: [LIBRARY_ENTRY_ID],
            searchable: true
          });
        }
      });
    });
    cesdk.ui.setPanelPosition(ICONS_PANEL_ID, "left");
    cesdk.ui.setPanelFloating(ICONS_PANEL_ID, false);
    cesdk.ui.insertOrderComponent(
      { in: "ly.img.dock", before: "imgly.bookmarks.dock" },
      {
        id: DOCK_ID2,
        key: "imgly.icons",
        icon: PHOSPHOR_ICON
      }
    );
  }

  // plugins/imgly/imgly-view/src/setup-journal-stickers.js
  var STICKER_SOURCE_ID = "ly.img.sticker";
  function resolveStickerAssetUri(templateUri) {
    if (!templateUri) return "";
    if (/^https?:\/\//i.test(templateUri)) return templateUri;
    return templateUri.replace("{{base_url}}/", getCesdkContentBaseURL());
  }
  function isJournalStickerAsset(asset) {
    if (!asset) return false;
    if (Array.isArray(asset.groups) && asset.groups.includes("journal")) return true;
    return String(asset.id || "").startsWith("ly.img.sticker.journal.");
  }
  function applyJournalStickerAsset(engine, cesdk, asset) {
    return __async(this, null, function* () {
      var _a2;
      const svgUrl = resolveStickerAssetUri((_a2 = asset == null ? void 0 : asset.meta) == null ? void 0 : _a2.uri);
      if (!svgUrl) return void 0;
      const svgData = yield fetchSvgMarkup(svgUrl);
      yield insertVectorGraphicOnCurrentPage(engine, {
        paths: svgData.paths,
        width: svgData.width,
        height: svgData.height,
        fillColor: svgData.fillColor || DEFAULT_VECTOR_FILL
      });
      if (cesdk == null ? void 0 : cesdk.ui) {
        cesdk.ui.closePanel("ly.img.assetLibrary");
      }
      return void 0;
    });
  }
  function prepareJournalAssetForSource(asset) {
    var _a2, _b2;
    return __spreadProps(__spreadValues({}, asset), {
      meta: __spreadProps(__spreadValues({}, asset.meta), {
        uri: resolveStickerAssetUri((_a2 = asset.meta) == null ? void 0 : _a2.uri),
        thumbUri: resolveStickerAssetUri((_b2 = asset.meta) == null ? void 0 : _b2.thumbUri)
      })
    });
  }
  function loadJournalStickerAssets() {
    return __async(this, null, function* () {
      const manifestUrl = `${getCesdkContentBaseURL()}ly.img.sticker/journal.content.json`;
      const response = yield fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(`Journal stickers manifest failed (${response.status}): ${manifestUrl}`);
      }
      const payload = yield response.json();
      return Array.isArray(payload.assets) ? payload.assets : [];
    });
  }
  function patchStickerApplyForJournal(engine, cesdk) {
    if (engine.asset.__journalApplyPatched) return;
    const originalApply = engine.asset.apply.bind(engine.asset);
    engine.asset.apply = (sourceId, assetResult, options) => __async(null, null, function* () {
      if (sourceId === STICKER_SOURCE_ID && isJournalStickerAsset(assetResult)) {
        return applyJournalStickerAsset(engine, cesdk, assetResult);
      }
      return originalApply(sourceId, assetResult, options);
    });
    engine.asset.__journalApplyPatched = true;
  }
  function setupJournalStickers(cesdk) {
    return __async(this, null, function* () {
      var _a2;
      if (!((_a2 = cesdk == null ? void 0 : cesdk.engine) == null ? void 0 : _a2.asset)) return;
      const engine = cesdk.engine;
      if (!engine.asset.findAllSources().includes(STICKER_SOURCE_ID)) {
        console.warn("IMG.LY View: source ly.img.sticker introuvable");
        return;
      }
      let journalAssets = [];
      try {
        journalAssets = yield loadJournalStickerAssets();
      } catch (err2) {
        console.warn("IMG.LY View: journal stickers non charg\xE9s", err2);
        return;
      }
      if (journalAssets.length === 0) return;
      for (const asset of journalAssets) {
        engine.asset.addAssetToSource(STICKER_SOURCE_ID, prepareJournalAssetForSource(asset));
      }
      patchStickerApplyForJournal(engine, cesdk);
      engine.asset.assetSourceContentsChanged(STICKER_SOURCE_ID);
    });
  }

  // plugins/imgly/imgly-view/src/setup-team-images.js
  init_bubble_upload();
  var TEAM_IMAGES_PANEL_ID = "imgly.team.images.panel";
  var DOCK_ID3 = "imgly.team.images.dock";
  var IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml,image/bmp,image/gif";
  function setupTeamImages(cesdk, instance) {
    if (!(cesdk == null ? void 0 : cesdk.ui) || !(instance == null ? void 0 : instance.data)) return;
    let refreshPanel = null;
    cesdk.ui.registerComponent(DOCK_ID3, ({ builder, payload }) => {
      var _a2;
      const icon = (_a2 = payload == null ? void 0 : payload.icon) != null ? _a2 : "@imgly/Image";
      const isOpen = cesdk.ui.isPanelOpen(TEAM_IMAGES_PANEL_ID);
      builder.Button("open-team-images", {
        tooltip: "libraries.ly.img.image.label",
        icon,
        isSelected: isOpen,
        onClick: () => {
          if (cesdk.ui.isPanelOpen(TEAM_IMAGES_PANEL_ID)) {
            cesdk.ui.closePanel(TEAM_IMAGES_PANEL_ID);
          } else {
            cesdk.ui.openPanel(TEAM_IMAGES_PANEL_ID);
          }
        }
      });
    });
    cesdk.ui.registerPanel(TEAM_IMAGES_PANEL_ID, ({ builder, state, engine }) => {
      const versionState = state("version", 0);
      refreshPanel = () => {
        versionState.setValue(versionState.value + 1);
      };
      builder.Section("team-images-upload", {
        children: () => {
          builder.Button("upload-image", {
            label: "panel.imgly.teamImages.upload",
            icon: "@imgly/Upload",
            onClick: () => __async(null, null, function* () {
              try {
                const file = yield cesdk.utils.loadFile({
                  accept: IMAGE_ACCEPT,
                  returnType: "File"
                });
                if (!file) return;
                yield uploadFileToBubble(instance, file, void 0);
              } catch (err2) {
                console.error("IMG.LY View: upload image", err2);
              }
            })
          });
        }
      });
      builder.Section("team-images-list", {
        children: () => {
          void versionState.value;
          const urls = Array.isArray(instance.data.teamImageUrls) ? instance.data.teamImageUrls : [];
          if (urls.length === 0) {
            builder.Text("team-images-empty", {
              content: cesdk.i18n.translate("panel.imgly.teamImages.empty")
            });
            return;
          }
          urls.forEach((url, index) => {
            builder.Section(`team-image-${index}`, {
              children: () => {
                builder.MediaPreview(`team-image-preview-${index}`, {
                  size: "medium",
                  preview: {
                    type: "image",
                    uri: url,
                    fillType: "cover"
                  },
                  action: {
                    icon: "@imgly/Plus",
                    tooltip: "panel.imgly.teamImages.add",
                    onClick: () => __async(null, null, function* () {
                      try {
                        yield insertImageOnCurrentPage(engine, url);
                        cesdk.ui.closePanel(TEAM_IMAGES_PANEL_ID);
                      } catch (err2) {
                        console.error("IMG.LY View: insertion image \xE9quipe", err2);
                      }
                    })
                  }
                });
              }
            });
          });
        }
      });
    });
    cesdk.ui.setPanelPosition(TEAM_IMAGES_PANEL_ID, "left");
    cesdk.ui.setPanelFloating(TEAM_IMAGES_PANEL_ID, false);
    const dockOrder = cesdk.ui.getComponentOrder({ in: "ly.img.dock" });
    const nextDockOrder = dockOrder.map((item) => {
      if (item.key === "ly.img.image") {
        return {
          id: DOCK_ID3,
          key: "imgly.team.images",
          icon: "@imgly/Image",
          label: "libraries.ly.img.image.label"
        };
      }
      return item;
    });
    cesdk.ui.setComponentOrder({ in: "ly.img.dock" }, nextDockOrder);
    instance.data.refreshTeamImagesPanel = () => {
      if (typeof refreshPanel === "function") {
        refreshPanel();
      }
    };
  }

  // plugins/imgly/imgly-view/src/app.js
  init_scene();
  function getHostElement(instance) {
    if (!instance || !instance.canvas) return null;
    if (typeof instance.canvas[0] !== "undefined") return instance.canvas[0];
    return instance.canvas;
  }
  function showBootError(host, message) {
    if (!host) return;
    host.innerHTML = "";
    const box = document.createElement("div");
    box.textContent = message;
    box.style.cssText = "position:absolute;top:12px;left:12px;right:12px;padding:10px 12px;font-size:12px;color:#991b1b;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;z-index:2;";
    host.appendChild(box);
  }
  function parseSheetCountFromProperties(properties) {
    if (!properties) return 1;
    return clampSheetCount(properties.pages);
  }
  function resolveImglyLicense(context) {
    var _a2;
    if (!context || !context.keys) return "";
    const raw = (_a2 = context.keys.IMGLY_key) != null ? _a2 : context.keys["IMGLY_key"];
    if (typeof raw !== "string") return "";
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : "";
  }
  function recreateBookletScene(instance) {
    return __async(this, null, function* () {
      const cesdk = instance.data.cesdk;
      const engine = instance.data.engine;
      if (!cesdk || !engine) return;
      instance.data._suppressCanvasJsonPublish = true;
      instance.data._suppressUnsavedChanges = true;
      try {
        instance.data.pageIds = yield createBookletScene(cesdk, engine, instance.data.sheetCount);
        instance.data._lastPublishedCanvasJson = null;
        yield fitSceneInView(cesdk);
        setUnsavedChanges(instance, false);
      } finally {
        instance.data._suppressUnsavedChanges = false;
      }
    });
  }
  function applyPropertiesUpdate(instance, properties, context) {
    if (!properties) return;
    instance.data.bubbleContext = context || instance.data.bubbleContext || null;
    applyBookmarksFromProperties(instance, properties.bookmarks_json);
    applyImagesFromProperties(instance, properties.images_json);
    const nextTitle = typeof properties.document_title === "string" ? properties.document_title : "";
    const titleChanged = nextTitle !== instance.data.documentTitle;
    instance.data.documentTitle = nextTitle;
    if (titleChanged && instance.data.cesdk) {
      syncNavigationDocumentTitle(instance.data.cesdk, instance);
    }
    const nextSheetCount = parseSheetCountFromProperties(properties);
    const sheetCountChanged = nextSheetCount !== instance.data.sheetCount;
    instance.data.sheetCount = nextSheetCount;
    const incomingCanvasJson = properties.canvas_json;
    const hasBubbleCanvasJson = typeof incomingCanvasJson === "string" && incomingCanvasJson.length > 0;
    if (hasBubbleCanvasJson) {
      if (incomingCanvasJson !== instance.data._lastPublishedCanvasJson) {
        void loadSceneFromString(instance, incomingCanvasJson);
      } else if (sheetCountChanged && instance.data.cesdkReady) {
        void syncScenePageCount(instance);
      }
      return;
    }
    const initialJson = properties.initial_json;
    if (typeof initialJson === "string" && initialJson.trim().length > 0 && !instance.data._hydratedFromInitialJsonProperty) {
      instance.data._hydratedFromInitialJsonProperty = true;
      void loadSceneFromString(instance, initialJson);
      return;
    }
    if (sheetCountChanged && instance.data.cesdkReady) {
      void recreateBookletScene(instance);
    }
  }
  function waitForCreativeEditorSDK(timeoutMs = 15e3) {
    return __async(this, null, function* () {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (cesdk_js_default && typeof cesdk_js_default.create === "function") {
          return cesdk_js_default;
        }
        yield new Promise((resolve) => setTimeout(resolve, 50));
      }
      return null;
    });
  }
  function initImglyEditor(instance, context, properties) {
    return __async(this, null, function* () {
      const host = getHostElement(instance);
      if (!host) return;
      const sdk = yield waitForCreativeEditorSDK();
      if (!sdk) {
        showBootError(
          host,
          "CE.SDK non charg\xE9 \u2014 v\xE9rifiez que le shared header du plugin (scripts CDN) est bien coll\xE9 dans Bubble."
        );
        return;
      }
      if (instance.data.cesdk && typeof instance.data.cesdk.dispose === "function") {
        try {
          instance.data.cesdk.dispose();
        } catch (e2) {
        }
      }
      host.innerHTML = "";
      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.overflow = "hidden";
      container.style.position = "relative";
      host.appendChild(container);
      const license = resolveImglyLicense(context);
      const assetsBaseURL = getCesdkContentBaseURL();
      const pendingProps = instance.data._pendingProperties;
      const sheetCount = parseSheetCountFromProperties(pendingProps || properties);
      try {
        const createOptions = {
          baseURL: assetsBaseURL,
          role: "Adopter"
        };
        if (license) {
          createOptions.license = license;
        }
        const cesdk = yield sdk.create(container, createOptions);
        instance.data.cesdk = cesdk;
        instance.data.engine = cesdk.engine;
        instance.data.bubbleContext = context || null;
        instance.data.sheetCount = sheetCount;
        if (typeof cesdk.disableNoSceneWarning === "function") {
          cesdk.disableNoSceneWarning();
        }
        instance.data.documentTitle = "";
        instance.data._lastPublishedCanvasJson = null;
        instance.data._suppressCanvasJsonPublish = true;
        instance.data._hydratedFromInitialJsonProperty = false;
        instance.data.bookmarksList = [];
        instance.data.teamImageUrls = [];
        instance.data._lastAppliedImagesJson = "";
        instance.publishState("contribution_id", "");
        instance.publishState("pdf_url", "");
        instance.publishState("trimed_pdf_url", "");
        instance.publishState("image_uploaded_url", "");
        setUnsavedChanges(instance, false);
        setMarginsWarning(instance, false);
        yield initDesignEditor(cesdk, { contentBaseURL: assetsBaseURL });
        ensureFrenchLocale(cesdk);
        instance.data.pageIds = yield createBookletScene(cesdk, cesdk.engine, sheetCount);
        yield fitSceneInView(cesdk);
        setTimeout(() => {
          void fitSceneInView(cesdk);
        }, 300);
        wireHistoryListener(instance);
        instance.data.createPagePreviews = () => createPagePreviews(instance);
        instance.data.triggerPdfExport = (options) => triggerPdfExport(instance, options);
        instance.data.triggerPreviewsZipDownload = () => triggerPreviewsZipDownload(instance);
        instance.data.triggerSaveDocument = () => triggerSaveDocument(instance);
        setupBubbleUpload(cesdk, instance);
        setupBubblePdfExport(cesdk, instance);
        setupNavigationDocumentTitle(cesdk, instance);
        setupBookmarks(cesdk, instance);
        setupIcons(cesdk, instance);
        setupTeamImages(cesdk, instance);
        yield setupJournalStickers(cesdk);
        instance.data.loadSceneFromString = (sceneString) => loadSceneFromString(instance, sceneString);
        instance.data.applyPropertiesUpdate = (props, ctx) => {
          applyPropertiesUpdate(instance, props, ctx);
        };
        instance.data.cesdkReady = true;
        const pending = instance.data._pendingProperties;
        applyPropertiesUpdate(instance, pending || properties || {}, context);
      } catch (err2) {
        console.error("IMG.LY View: init failed", err2);
        const detail = err2 && err2.message ? String(err2.message) : "";
        showBootError(host, detail ? "\xC9chec du chargement CE.SDK \u2014 " + detail : "\xC9chec du chargement CE.SDK \u2014 v\xE9rifiez la connexion r\xE9seau ou la licence.");
      }
    });
  }
  function initializeImglyView(instance, context) {
    instance.data.cesdkReady = false;
    instance.data._pendingProperties = null;
    void initImglyEditor(instance, context, null);
  }

  // plugins/imgly/imgly-view/src/index.js
  var index_default = initializeImglyView;
  return __toCommonJS(index_exports);
})();
return __pluginInit.default(instance, context);
}
