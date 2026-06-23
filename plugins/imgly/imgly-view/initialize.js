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
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // plugins/imgly/imgly-view/src/index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });

  // plugins/imgly/imgly-view/src/shims/cesdk-js.js
  var sdk = typeof CreativeEditorSDK !== "undefined" ? CreativeEditorSDK : null;
  var cesdk_js_default = sdk;

  // plugins/imgly/imgly-view/src/booklet-layout.js
  var HALF_A4_WIDTH_MM = 148.5;
  var PAGE_HEIGHT_MM = 210;
  var BOOKLET_ROW_GAP_MM = 28;
  var MAX_SHEET_COUNT = 20;
  var BOOKLET_SCENE_LAYOUT = "Free";
  var ROW_STEP_MM = PAGE_HEIGHT_MM + BOOKLET_ROW_GAP_MM;
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

  // plugins/imgly/imgly-view/src/cesdk-content-base-url.js
  var PRODUCTION_CESDK_CONTENT_BASE_URL = "https://poc-studio.github.io/phosphor_icon_picker/cesdk-assets/";
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.blur": ["ly.img.blur"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.blur";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.color.palette": ["ly.img.colors"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.color.palette";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.crop.presets": ["ly.img.cropPresets"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.crop.presets";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.effect": ["ly.img.effect"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.effect";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.filter": ["ly.img.filter"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.filter";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.sticker": ["ly.img.sticker"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.sticker";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.text": ["ly.img.text"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.text";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.text.components": ["ly.img.text"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.text.components";
        if (!i.has(o)) {
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.typeface": ["ly.img.typefaces"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.typeface";
        if (!i.has(o)) {
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
  var T = [{ id: "ly.img.image.upload", mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/bmp", "image/gif"], assetLibraryEntries: ["ly.img.image", "ly.img.upload"] }, { id: "ly.img.video.upload", mimeTypes: ["application/json", "video/mp4", "video/quicktime", "video/webm", "video/matroska", "image/gif"], assetLibraryEntries: ["ly.img.video", "ly.img.upload"] }, { id: "ly.img.audio.upload", mimeTypes: ["audio/mpeg", "audio/mp3", "audio/x-m4a", "audio/wav"], assetLibraryEntries: ["ly.img.audio", "ly.img.upload"] }];
  var F = class {
    constructor(e2 = {}) {
      __publicField(this, "name", "cesdk-upload-asset-sources");
      __publicField(this, "version", cesdk_js_default.version);
      __publicField(this, "addedAssetSourceIds", []);
      __publicField(this, "addedLibraryEntryMappings", /* @__PURE__ */ new Map());
      this.config = e2;
    }
    isExplicitMode() {
      var _a, _b;
      return (_b = (_a = this.config.include) == null ? void 0 : _a.some(((e2) => "string" == typeof e2))) != null ? _b : false;
    }
    getExplicitIncludes() {
      return this.config.include ? new Set(this.config.include.filter(((e2) => "string" == typeof e2))) : /* @__PURE__ */ new Set();
    }
    getCustomizations() {
      return this.config.include ? this.config.include.filter(((e2) => "object" == typeof e2)) : [];
    }
    getAssetLibraryEntries(e2) {
      return e2 ? Array.isArray(e2) ? e2 : [e2] : [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = new Set(e2.asset.findAllSources()), r = this.isExplicitMode(), i = this.getExplicitIncludes(), o = this.getCustomizations(), n = /* @__PURE__ */ new Map();
        if (r) for (const e3 of T) i.has(e3.id) && n.set(e3.id, e3);
        else for (const e3 of T) n.set(e3.id, e3);
        for (const e3 of o) {
          const s2 = n.get(e3.id);
          s2 ? n.set(e3.id, __spreadValues(__spreadValues({}, s2), e3)) : n.set(e3.id, e3);
        }
        const a = Array.from(n.values());
        for (const r2 of a) {
          const { id: i2, mimeTypes: o2, assetLibraryEntries: n2 } = r2;
          if (!t.has(i2) && (e2.asset.addLocalSource(i2, o2), this.addedAssetSourceIds.push(i2), s)) {
            const e3 = this.getAssetLibraryEntries(n2);
            this.addedLibraryEntryMappings.set(i2, e3);
            for (const t2 of e3) s.ui.updateAssetLibraryEntry(t2, { sourceIds: ({ currentIds: e4 }) => [.../* @__PURE__ */ new Set([...e4, i2])] });
          }
        }
        s && s.onReset((() => this.cleanup({ engine: e2, cesdk: s })));
      });
    }
    cleanup({ engine: e2, cesdk: s }) {
      var _a;
      for (const t of this.addedAssetSourceIds) {
        if (s) {
          const e3 = (_a = this.addedLibraryEntryMappings.get(t)) != null ? _a : [];
          for (const r of e3) s.ui.updateAssetLibraryEntry(r, { sourceIds: ({ currentIds: e4 }) => e4.filter(((e5) => e5 !== t)) });
        }
        try {
          e2.asset.removeSource(t);
        } catch (e3) {
          console.warn("Unable to remove source with id: ", t);
        }
      }
      this.addedAssetSourceIds = [], this.addedLibraryEntryMappings.clear();
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
      var _a;
      if ((_a = this.config.assetLibraryEntries) == null ? void 0 : _a[e2]) {
        const s = this.config.assetLibraryEntries[e2];
        return Array.isArray(s) ? s : [s];
      }
      return { "ly.img.vector.shape": ["ly.img.vector.shape", "ly.img.shape.replace"] }[e2] || [];
    }
    initialize(_0) {
      return __async(this, arguments, function* ({ engine: e2, cesdk: s }) {
        const t = this.config.baseURL || (s == null ? void 0 : s.getBaseURL()) || e2.editor.getSetting("basePath");
        if (!t) throw new Error("Cannot determine baseURL");
        const r = t.replace(/\/*$/, "/"), i = new Set(e2.asset.findAllSources()), o = "ly.img.vector.shape";
        if (!i.has(o)) {
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
    "libraries.imgly.phosphor.label": "Ic\xF4nes Phosphor"
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
    engine.editor.setSetting("page/title/appendPageName", true);
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
        entries: ["ly.img.image.upload"]
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
      "ly.img.exportPDF.navigationBar",
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

  // plugins/imgly/imgly-view/src/export-lock.js
  var EXPORT_UI_STYLE_ID = "imgly-hide-show-in-export";
  var TRANSPARENT_COLOR = { r: 0, g: 0, b: 0, a: 0 };
  function hideShowInExportUI() {
    if (typeof document === "undefined" || document.getElementById(EXPORT_UI_STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = EXPORT_UI_STYLE_ID;
    style.textContent = `
    .UBQ_Section-module__block:has([name="exportable"]),
    .UBQ_Section-module__block:has([data-cy="exportable"]) {
      display: none !important;
    }
  `;
    document.head.appendChild(style);
  }
  function ensureAllBlocksIncludedInExport(engine) {
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findAll !== "function") return;
    for (const blockId of engine.block.findAll()) {
      try {
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
    var _a;
    if (!(engine == null ? void 0 : engine.block) || typeof engine.block.findByType !== "function") return;
    if ((_a = engine.editor) == null ? void 0 : _a.setSetting) {
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
    hideShowInExportUI();
    hideAllPageCanvasBorders(engine);
    ensureAllBlocksIncludedInExport(engine);
    lockPageDeletion(engine);
    lockPageSelection(engine);
  }

  // plugins/imgly/imgly-view/src/design-editor/plugin.ts
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
      yield cesdk.addPlugin(new DesignEditorConfig());
      yield cesdk.addPlugin(new e());
      yield cesdk.addPlugin(new d());
      yield cesdk.addPlugin(new u());
      yield cesdk.addPlugin(
        new F({
          include: ["ly.img.image.upload"]
        })
      );
      yield cesdk.addPlugin(new p());
      yield cesdk.addPlugin(new b());
      yield cesdk.addPlugin(
        new E({
          baseURL: contentBaseURL
        })
      );
      yield cesdk.addPlugin(new v());
      yield cesdk.addPlugin(new U());
      yield cesdk.addPlugin(new C());
      yield cesdk.addPlugin(new j());
    });
  }

  // plugins/imgly/imgly-view/src/bubble-upload.js
  function normalizeBubbleUploadUrl(err, url) {
    if (err) return "";
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
        context.uploadContent(fileName, base64, (err, url) => {
          resolve(normalizeBubbleUploadUrl(err, url));
        });
      } catch (e2) {
        console.error("IMG.LY View: uploadContent failed", e2);
        resolve("");
      }
    });
  }
  function uploadBlob(context, fileName, blob) {
    if (!blob) return Promise.resolve("");
    return blobToBase64(blob).then((base64) => uploadBase64(context, fileName, base64)).catch((err) => {
      console.error("IMG.LY View: blobToBase64 failed", err);
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
      var _a, _b;
      const context = ((_a = instance == null ? void 0 : instance.data) == null ? void 0 : _a.bubbleContext) || null;
      const cesdk = ((_b = instance == null ? void 0 : instance.data) == null ? void 0 : _b.cesdk) || null;
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

  // plugins/imgly/imgly-view/src/constants.js
  var PAGE_PREVIEWS_DEBOUNCE_MS = 1500;
  var PAGE_PREVIEWS_COOLDOWN_MS = 3e4;

  // plugins/imgly/imgly-view/src/shims/pdf-lib.js
  var lib = typeof PDFLib !== "undefined" ? PDFLib : {};
  var PDFDocument = lib.PDFDocument;
  var PageSizes = lib.PageSizes;
  var concatTransformationMatrix = lib.concatTransformationMatrix;
  var popGraphicsState = lib.popGraphicsState;
  var pushGraphicsState = lib.pushGraphicsState;

  // plugins/imgly/imgly-view/src/pdf-imposition.js
  var PDF_ROTATE_CLOCKWISE = false;
  var PDF_DUPLEX_FLIP_INSIDE_PAGE = true;
  var A4_WIDTH_MM = 210;
  var A4_HEIGHT_MM = 297;
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
      for (let i = 0; i < pairs.length; i += 1) {
        const [leftNum, rightNum] = pairs[i];
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
        drawImposedSpread(outPage, leftEmbedded, rightEmbedded, i % 2 === 1);
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
    } catch (err) {
      console.warn("IMG.LY View: ensureBookletSceneLayout failed", err);
    }
  }
  function fitSceneInView(cesdk) {
    if (!cesdk || !cesdk.actions || typeof cesdk.actions.run !== "function") {
      return Promise.resolve();
    }
    return Promise.resolve(
      cesdk.actions.run("zoom.toPage", { page: "first", autoFit: true })
    ).catch((err) => {
      console.error("IMG.LY View: zoom.toPage failed", err);
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
  function loadSceneFromString(instance, sceneString) {
    return __async(this, null, function* () {
      var _a;
      const engine = instance.data.engine;
      if (!engine || !engine.scene || typeof engine.scene.loadFromString !== "function") {
        return false;
      }
      if (typeof sceneString !== "string" || sceneString.trim().length === 0) {
        return false;
      }
      const layout = buildBookletPageLayout((_a = instance.data.sheetCount) != null ? _a : 1);
      instance.data._suppressCanvasJsonPublish = true;
      try {
        yield engine.scene.loadFromString(sceneString.trim());
        instance.data.pageIds = getPageIds(engine);
        instance.data._lastPublishedCanvasJson = sceneString.trim();
        ensureBookletSceneLayout(engine, layout);
        ensureBookletGuides(engine, layout);
        hideAllPageCanvasBorders(engine);
        ensureAllBlocksIncludedInExport(engine);
        lockPageDeletion(engine);
        lockPageSelection(engine);
        yield fitSceneInView(instance.data.cesdk);
        return true;
      } catch (err) {
        console.error("IMG.LY View: loadFromString failed", err);
        return false;
      }
    });
  }

  // plugins/imgly/imgly-view/src/exports.js
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
    }).catch((err) => {
      console.error("IMG.LY View: saveToString failed", err);
      return false;
    });
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
  function createPagePreviews(instance) {
    const engine = instance.data.engine;
    const context = instance.data.bubbleContext || null;
    if (!engine || !engine.block) return Promise.resolve([]);
    let pageIds = getPageIds(engine);
    if (!pageIds.length) {
      pageIds = instance.data.pageIds || [];
    }
    if (!pageIds.length) return Promise.resolve([]);
    const base = sanitizeFileBase(instance.data.documentTitle);
    const runId = (instance.data._pagePreviewsRunId || 0) + 1;
    instance.data._pagePreviewsRunId = runId;
    instance.data._lastPagePreviewsAt = Date.now();
    const exportOne = (pageId, index) => engine.block.export(pageId, {
      mimeType: "image/png",
      targetWidth: 500
    }).then((blob) => {
      const safeName = (base + "-preview-" + (index + 1) + ".png").replace(/[^\w.-]/g, "_");
      return uploadBlob(context, safeName, blob);
    }).catch((err) => {
      console.error("IMG.LY View: page preview export failed", err);
      return "";
    });
    return Promise.all(pageIds.map(exportOne)).then((uploaded) => {
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
    }).catch((err) => {
      console.error("IMG.LY View: create_page_previews", err);
      return [];
    });
  }
  function syncSceneBeforePdfExport(instance) {
    return __async(this, null, function* () {
      const engine = instance.data.engine;
      if (!(engine == null ? void 0 : engine.scene) || typeof engine.scene.saveToString !== "function") return;
      try {
        yield engine.scene.saveToString();
      } catch (err) {
        console.error("IMG.LY View: pre-PDF saveToString failed", err);
      }
    });
  }
  function triggerSaveDocument(instance) {
    return __async(this, null, function* () {
      if (!instance || !instance.data) return false;
      if (instance.data._saveInProgress === true) return false;
      instance.data._saveInProgress = true;
      try {
        yield publishSceneJson(instance, { force: true, skipPreviews: true });
        yield createPagePreviews(instance);
        yield triggerPdfExport(instance, { download: false });
        instance.triggerEvent("document_saved");
        return true;
      } catch (err) {
        console.error("IMG.LY View: enregistrement document", err);
        return false;
      } finally {
        instance.data._saveInProgress = false;
      }
    });
  }
  function triggerPdfExport(instance, options) {
    return __async(this, null, function* () {
      const download = !options || options.download !== false;
      const engine = instance.data.engine;
      const context = instance.data.bubbleContext || null;
      if (!(engine == null ? void 0 : engine.block)) return "";
      let pageIds = getPageIds(engine);
      if (!pageIds.length) {
        pageIds = instance.data.pageIds || [];
      }
      if (!pageIds.length) return "";
      if (pageIds.length % 4 !== 0) {
        console.error("IMG.LY View: PDF export aborted \u2014 page count must be a multiple of 4:", pageIds.length);
        return "";
      }
      ensureAllBlocksIncludedInExport(engine);
      hideAllPageCanvasBorders(engine);
      yield syncSceneBeforePdfExport(instance);
      if (typeof engine.block.forceLoadResources === "function") {
        try {
          yield engine.block.forceLoadResources(pageIds);
        } catch (err) {
          console.warn("IMG.LY View: forceLoadResources avant export PDF", err);
        }
      }
      const base = sanitizeFileBase(instance.data.documentTitle);
      const safePdfName = (base + ".pdf").replace(/[^\w.-]/g, "_") || "document.pdf";
      try {
        const blob = yield buildFoldedA4Pdf(engine, pageIds);
        const url = yield uploadBlob(context, safePdfName, blob);
        if (typeof url === "string" && url.length > 0) {
          instance.publishState("pdf_url", url);
          instance.triggerEvent("pdf_ready");
        } else if (blob && blob.size > 0) {
          console.warn("IMG.LY View: PDF upload\xE9 dans Bubble mais URL non re\xE7ue \u2014 pdf_ready non d\xE9clench\xE9");
        }
        if (download) {
          downloadBlob(blob, safePdfName);
        }
        return url || (download ? "downloaded" : "");
      } catch (err) {
        console.error("IMG.LY View: PDF export failed", err);
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
    instance.data._unsubscribeHistory = engine.editor.onHistoryUpdated((kind) => {
      if (kind === "Activated") return;
      ensureAllBlocksIncludedInExport(engine);
      lockPageDeletion(engine);
      lockPageSelection(engine);
    });
  }

  // plugins/imgly/imgly-view/src/page-insert.js
  function resolveTargetPageId(engine) {
    var _a, _b, _c;
    if (!(engine == null ? void 0 : engine.scene)) return null;
    const fromCurrent = engine.scene.getCurrentPage();
    if (fromCurrent != null) return fromCurrent;
    const fromViewport = (_a = engine.scene.findNearestToViewPortCenterByType("page")[0]) != null ? _a : engine.scene.findNearestToViewPortCenterByType("//ly.img.ubq/page")[0];
    if (fromViewport != null) return fromViewport;
    const pages = ((_c = (_b = engine.block) == null ? void 0 : _b.findByType) == null ? void 0 : _c.call(_b, "page")) || [];
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
      var _a;
      if (!engine || !((_a = options == null ? void 0 : options.paths) == null ? void 0 : _a.length)) return null;
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
      const childIds = [];
      try {
        for (const pathLayer of options.paths) {
          const graphicId = createVectorPathGraphic(
            engine,
            pathLayer,
            coordWidth,
            coordHeight,
            fillColor
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
      } catch (err) {
        console.error("IMG.LY View: insertion vectorielle \xE9chou\xE9e", err);
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
      } catch (err) {
        console.error("IMG.LY View: addImage failed", imageUrl, err);
        return null;
      }
      try {
        fitBlockOnPage(engine, blockId, pageId);
        if (typeof engine.block.select === "function") {
          engine.block.select(blockId);
        }
      } catch (err) {
        console.warn("IMG.LY View: redimensionnement image", err);
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

  // plugins/imgly/imgly-view/src/setup-bubble-export.js
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
    "ly.img.export.navigationBar"
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
      } catch (err) {
        console.error("IMG.LY View: enregistrement document", err);
      }
    });
    cesdk.ui.registerComponent(BUBBLE_SAVE_NAV_ID, ({ builder, state }) => {
      const loading = state("loading", false);
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
    });
    cesdk.actions.register("saveDocument", runSaveDocument);
    const runPdfExport = () => __async(null, null, function* () {
      if (typeof instance.data.triggerPdfExport !== "function") {
        console.error("IMG.LY View: export PDF indisponible (\xE9diteur non pr\xEAt)");
        return;
      }
      try {
        yield instance.data.triggerPdfExport();
      } catch (err) {
        console.error("IMG.LY View: export PDF impos\xE9", err);
      }
    });
    cesdk.actions.register("exportImposedPdf", runPdfExport);
    cesdk.actions.register("exportDesign", (exportOptions) => __async(null, null, function* () {
      if ((exportOptions == null ? void 0 : exportOptions.mimeType) === "application/pdf") {
        yield runPdfExport();
      }
    }));
    for (const id of EXPORT_NAV_IDS_TO_REMOVE) {
      cesdk.ui.removeOrderComponent({ in: "ly.img.navigation.bar", match: id });
    }
    cesdk.ui.updateOrderComponent(
      { in: "ly.img.navigation.bar", match: "ly.img.exportPDF.navigationBar" },
      {
        onClick: runPdfExport,
        label: "Exporter le PDF",
        icon: "@imgly/Download"
      }
    );
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
      var _a;
      const icon = (_a = payload == null ? void 0 : payload.icon) != null ? _a : BOOKMARK_ICON;
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
              } catch (err) {
                console.error("IMG.LY View: insertion contribution", err);
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
  function parsePhosphorSvgMarkup(svgText) {
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
    const paths = Array.from(svg.querySelectorAll("path")).map((node) => {
      const d2 = node.getAttribute("d");
      if (!d2) return null;
      let opacity = 1;
      if (node.hasAttribute("opacity")) {
        const parsed = parseFloat(node.getAttribute("opacity") || "");
        if (!Number.isNaN(parsed)) opacity = parsed;
      }
      return { d: d2, opacity };
    }).filter(Boolean);
    if (paths.length === 0) return null;
    return { width, height, paths };
  }
  function fetchPhosphorSvgData(url) {
    return __async(this, null, function* () {
      const response = yield fetch(url);
      if (!response.ok) {
        throw new Error(`Phosphor SVG fetch failed (${response.status}): ${url}`);
      }
      const text = yield response.text();
      const parsed = parsePhosphorSvgMarkup(text);
      if (!parsed) {
        throw new Error(`Phosphor SVG parse failed: ${url}`);
      }
      return parsed;
    });
  }

  // plugins/imgly/imgly-view/src/phosphor-icon-insert.js
  var ICONS_PANEL_ID = "imgly.icons.panel";
  function insertPhosphorIcon(engine, cesdk, instance, iconName, style) {
    return __async(this, null, function* () {
      var _a;
      if (!engine || !iconName) return;
      const safeStyle = normalizePhosphorStyle(style || ((_a = instance == null ? void 0 : instance.data) == null ? void 0 : _a.phosphorIconStyle));
      const url = getPhosphorIconUrl(iconName, safeStyle);
      if (!url) return;
      let svgData;
      try {
        svgData = yield fetchPhosphorSvgData(url);
      } catch (err) {
        console.error("IMG.LY View: chargement SVG Phosphor", url, err);
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
    var _a;
    const safeStyle = normalizePhosphorStyle(styleId);
    return (_a = PHOSPHOR_STYLE_OPTIONS.find((option) => option.id === safeStyle)) != null ? _a : PHOSPHOR_STYLE_OPTIONS[0];
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
      var _a;
      const icon = (_a = payload == null ? void 0 : payload.icon) != null ? _a : PHOSPHOR_ICON;
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
          var _a;
          const selectedStyle = getPhosphorStyleOption(
            typeof styleState.value === "object" && ((_a = styleState.value) == null ? void 0 : _a.id) ? styleState.value.id : instance.data.phosphorIconStyle
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

  // plugins/imgly/imgly-view/src/app.js
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
  function recreateBookletScene(instance) {
    return __async(this, null, function* () {
      const cesdk = instance.data.cesdk;
      const engine = instance.data.engine;
      if (!cesdk || !engine) return;
      instance.data._suppressCanvasJsonPublish = true;
      instance.data.pageIds = yield createBookletScene(cesdk, engine, instance.data.sheetCount);
      instance.data._lastPublishedCanvasJson = null;
      yield fitSceneInView(cesdk);
    });
  }
  function applyPropertiesUpdate(instance, properties, context) {
    if (!properties) return;
    instance.data.bubbleContext = context || instance.data.bubbleContext || null;
    applyBookmarksFromProperties(instance, properties.bookmarks_json);
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
  function initImglyEditor(instance, context, properties) {
    return __async(this, null, function* () {
      const host = getHostElement(instance);
      if (!host) return;
      if (!cesdk_js_default || typeof cesdk_js_default.create !== "function") {
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
      const license = "";
      const engineBaseURL = `https://cdn.img.ly/packages/imgly/cesdk-js/${cesdk_js_default.version}/assets/`;
      const contentBaseURL = getCesdkContentBaseURL();
      const pendingProps = instance.data._pendingProperties;
      const sheetCount = parseSheetCountFromProperties(pendingProps || properties);
      try {
        const cesdk = yield cesdk_js_default.create(container, {
          license,
          baseURL: engineBaseURL
        });
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
        instance.publishState("contribution_id", "");
        instance.publishState("pdf_url", "");
        yield initDesignEditor(cesdk, { contentBaseURL });
        ensureFrenchLocale(cesdk);
        instance.data.pageIds = yield createBookletScene(cesdk, cesdk.engine, sheetCount);
        yield fitSceneInView(cesdk);
        setTimeout(() => {
          void fitSceneInView(cesdk);
        }, 300);
        wireHistoryListener(instance);
        instance.data.createPagePreviews = () => createPagePreviews(instance);
        instance.data.triggerPdfExport = () => triggerPdfExport(instance);
        instance.data.triggerSaveDocument = () => triggerSaveDocument(instance);
        setupBubbleUpload(cesdk, instance);
        setupBubblePdfExport(cesdk, instance);
        setupNavigationDocumentTitle(cesdk, instance);
        setupBookmarks(cesdk, instance);
        setupIcons(cesdk, instance);
        instance.data.loadSceneFromString = (sceneString) => loadSceneFromString(instance, sceneString);
        instance.data.applyPropertiesUpdate = (props, ctx) => {
          applyPropertiesUpdate(instance, props, ctx);
        };
        instance.data.cesdkReady = true;
        const pending = instance.data._pendingProperties;
        applyPropertiesUpdate(instance, pending || properties || {}, context);
      } catch (err) {
        console.error("IMG.LY View: init failed", err);
        const detail = err && err.message ? String(err.message) : "";
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
