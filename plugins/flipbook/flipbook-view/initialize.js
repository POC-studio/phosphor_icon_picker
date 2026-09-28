/* GENERATED FILE - ne pas éditer. Source : flipbook-view/src/ (npm run build:plugins) */
export default function(instance, context) {
function __bootPlugin() {

var __pluginInit = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // global-externals:three
  var require_three = __commonJS({
    "global-externals:three"(exports, module) {
      var g2 = globalThis["THREE"];
      if (!g2) throw new Error("THREE n\u2019est pas charg\xE9. Ajoute le script dans shared.html.");
      module.exports = g2;
    }
  });

  // node_modules/three.modifiers/dist/modifiers.min.js
  var require_modifiers_min = __commonJS({
    "node_modules/three.modifiers/dist/modifiers.min.js"(exports, module) {
      !(function(t, e) {
        if ("object" == typeof exports && "object" == typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
          var i = e();
          for (var o in i) ("object" == typeof exports ? exports : t)[o] = i[o];
        }
      })("undefined" != typeof self ? self : exports, function() {
        return (function(t) {
          function e(o) {
            if (i[o]) return i[o].exports;
            var n2 = i[o] = { i: o, l: false, exports: {} };
            return t[o].call(n2.exports, n2, n2.exports, e), n2.l = true, n2.exports;
          }
          var i = {};
          return e.m = t, e.c = i, e.d = function(t2, i2, o) {
            e.o(t2, i2) || Object.defineProperty(t2, i2, { configurable: false, enumerable: true, get: o });
          }, e.n = function(t2) {
            var i2 = t2 && t2.__esModule ? function() {
              return t2.default;
            } : function() {
              return t2;
            };
            return e.d(i2, "a", i2), i2;
          }, e.o = function(t2, e2) {
            return Object.prototype.hasOwnProperty.call(t2, e2);
          }, e.p = "", e(e.s = 7);
        })([function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Modifier = void 0;
          var o = (function() {
            function t2() {
            }
            return t2.prototype.setModifiable = function(t3) {
              this.mod = t3;
            }, t2.prototype.getVertices = function() {
              return this.mod.getVertices();
            }, t2.prototype.destroy = function() {
              this.mod = null;
            }, t2;
          })();
          e.Modifier = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Vector3 = void 0;
          var o = (function() {
            function t2(t3, e2, i2) {
              void 0 === t3 && (t3 = 0), void 0 === e2 && (e2 = 0), void 0 === i2 && (i2 = 0), this.x = t3, this.y = e2, this.z = i2;
            }
            return t2.prototype.clone = function() {
              return new t2(this.x, this.y, this.z);
            }, t2.prototype.equals = function(t3) {
              return this.x == t3.x && this.y == t3.y && this.z == t3.z;
            }, t2.prototype.zero = function() {
              this.x = this.y = this.z = 0;
            }, t2.prototype.negate = function() {
              return new t2(-this.x, -this.y, -this.z);
            }, t2.prototype.add = function(e2) {
              return new t2(this.x + e2.x, this.y + e2.y, this.z + e2.z);
            }, t2.prototype.subtract = function(e2) {
              return new t2(this.x - e2.x, this.y - e2.y, this.z - e2.z);
            }, t2.prototype.multiplyScalar = function(e2) {
              return new t2(this.x * e2, this.y * e2, this.z * e2);
            }, t2.prototype.multiply = function(e2) {
              return new t2(this.x * e2.x, this.y * e2.y, this.z * e2.z);
            }, t2.prototype.divide = function(e2) {
              var i2 = 1 / e2;
              return new t2(this.x * i2, this.y * i2, this.z * i2);
            }, t2.prototype.normalize = function() {
              var t3 = this.x * this.x + this.y * this.y + this.z * this.z;
              if (t3 > 0) {
                var e2 = 1 / Math.sqrt(t3);
                this.x *= e2, this.y *= e2, this.z *= e2;
              }
            }, Object.defineProperty(t2.prototype, "magnitude", { get: function() {
              return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            }, set: function(t3) {
              this.normalize(), this.x *= t3, this.y *= t3, this.z *= t3;
            }, enumerable: false, configurable: true }), t2.prototype.fromBufferAttribute = function(t3, e2) {
              return this.x = t3.getX(e2), this.y = t3.getY(e2), this.z = t3.getZ(e2), this;
            }, t2.prototype.toString = function() {
              return "[" + this.x + " , " + this.y + " , " + this.z + "]";
            }, t2.sum = function(t3, e2) {
              return t3.add(e2);
            }, t2.dot = function(t3, e2) {
              return t3.x * e2.x + t3.y * e2.y + t3.z * e2.z;
            }, t2.cross = function(e2, i2) {
              return new t2(e2.y * i2.z - e2.z * i2.y, e2.z * i2.x - e2.x * i2.z, e2.x * i2.y - e2.y * i2.x);
            }, t2.distance = function(t3, e2) {
              var i2 = t3.x - e2.x, o2 = t3.y - e2.y, n2 = t3.z - e2.z;
              return Math.sqrt(i2 * i2 + o2 * o2 + n2 * n2);
            }, t2.ZERO = new t2(0, 0, 0), t2;
          })();
          e.Vector3 = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.ModConstant = void 0;
          var o = (function() {
            function t2() {
            }
            return t2.NONE = 0, t2.X = 1, t2.Y = 2, t2.Z = 4, t2.LEFT = -1, t2.RIGHT = 1, t2;
          })();
          e.ModConstant = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.TMath = void 0;
          var o = (function() {
            function t2() {
            }
            return t2.normalize = function(e2, i2, o2) {
              var n2 = i2 - e2;
              return 0 == n2 ? 1 : t2.trim(0, 1, (o2 - e2) / i2);
            }, t2.toRange = function(t3, e2, i2) {
              var o2 = e2 - t3;
              return 0 == o2 ? 0 : t3 + (e2 - t3) * i2;
            }, t2.inInRange = function(t3, e2, i2, o2) {
              return void 0 === o2 && (o2 = false), o2 ? i2 >= t3 && i2 <= e2 : i2 > t3 && i2 < e2;
            }, t2.sign = function(t3, e2) {
              return void 0 === e2 && (e2 = 0), 0 == t3 ? e2 : t3 > 0 ? 1 : -1;
            }, t2.trim = function(t3, e2, i2) {
              return Math.min(e2, Math.max(t3, i2));
            }, t2.wrap = function(t3, e2, i2) {
              return i2 < t3 ? i2 + (e2 - t3) : i2 >= e2 ? i2 - (e2 - t3) : i2;
            }, t2.degToRad = function(t3) {
              return t3 / 180 * Math.PI;
            }, t2.radToDeg = function(t3) {
              return t3 / Math.PI * 180;
            }, t2.presicion = function(t3, e2) {
              var i2 = Math.pow(10, e2);
              return Math.round(t3 * i2) / i2;
            }, t2.uceil = function(t3) {
              return t3 < 0 ? Math.floor(t3) : Math.ceil(t3);
            }, t2.mappedKey = function(t3) {
              var e2 = Math.pow(10, 4);
              return Math.round(t3.x * e2) + "_" + Math.round(t3.y * e2) + "_" + Math.round(t3.z * e2);
            }, t2.PI = 3.1415, t2;
          })();
          e.TMath = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Matrix4 = void 0;
          var o = (function() {
            function t2(t3, e2, i2, o2, n2, r, s, c2, u2, a, h2, f, p, l, y2, d2) {
              void 0 === t3 && (t3 = 1), void 0 === e2 && (e2 = 0), void 0 === i2 && (i2 = 0), void 0 === o2 && (o2 = 0), void 0 === n2 && (n2 = 0), void 0 === r && (r = 1), void 0 === s && (s = 0), void 0 === c2 && (c2 = 0), void 0 === u2 && (u2 = 0), void 0 === a && (a = 0), void 0 === h2 && (h2 = 1), void 0 === f && (f = 0), void 0 === p && (p = 0), void 0 === l && (l = 0), void 0 === y2 && (y2 = 0), void 0 === d2 && (d2 = 1), this.n11 = t3, this.n12 = e2, this.n13 = i2, this.n14 = o2, this.n21 = n2, this.n22 = r, this.n23 = s, this.n24 = c2, this.n31 = u2, this.n32 = a, this.n33 = h2, this.n34 = f, this.n41 = p, this.n42 = l, this.n43 = y2, this.n44 = d2;
            }
            return t2.translationMatrix = function(e2, i2, o2) {
              var n2 = new t2();
              return n2.n14 = e2, n2.n24 = i2, n2.n34 = o2, n2;
            }, t2.scaleMatrix = function(e2, i2, o2) {
              var n2 = new t2();
              return n2.n11 = e2, n2.n22 = i2, n2.n33 = o2, n2;
            }, t2.rotationMatrix = function(e2, i2, o2, n2, r) {
              void 0 === r && (r = null);
              var s;
              s = r || new t2();
              var c2 = Math.cos(n2), u2 = Math.sin(n2), a = 1 - c2, h2 = e2 * i2 * a, f = i2 * o2 * a, p = e2 * o2 * a, l = u2 * o2, y2 = u2 * i2, d2 = u2 * e2;
              return s.n11 = c2 + e2 * e2 * a, s.n12 = -l + h2, s.n13 = y2 + p, s.n14 = 0, s.n21 = l + h2, s.n22 = c2 + i2 * i2 * a, s.n23 = -d2 + f, s.n24 = 0, s.n31 = -y2 + p, s.n32 = d2 + f, s.n33 = c2 + o2 * o2 * a, s.n34 = 0, s;
            }, t2.prototype.calculateMultiply = function(t3, e2) {
              var i2 = t3.n11, o2 = e2.n11, n2 = t3.n21, r = e2.n21, s = t3.n31, c2 = e2.n31, u2 = t3.n12, a = e2.n12, h2 = t3.n22, f = e2.n22, p = t3.n32, l = e2.n32, y2 = t3.n13, d2 = e2.n13, _ = t3.n23, v2 = e2.n23, b = t3.n33, m2 = e2.n33, g2 = t3.n14, x = e2.n14, M = t3.n24, O = e2.n24, P = t3.n34, w2 = e2.n34;
              this.n11 = i2 * o2 + u2 * r + y2 * c2, this.n12 = i2 * a + u2 * f + y2 * l, this.n13 = i2 * d2 + u2 * v2 + y2 * m2, this.n14 = i2 * x + u2 * O + y2 * w2 + g2, this.n21 = n2 * o2 + h2 * r + _ * c2, this.n22 = n2 * a + h2 * f + _ * l, this.n23 = n2 * d2 + h2 * v2 + _ * m2, this.n24 = n2 * x + h2 * O + _ * w2 + M, this.n31 = s * o2 + p * r + b * c2, this.n32 = s * a + p * f + b * l, this.n33 = s * d2 + p * v2 + b * m2, this.n34 = s * x + p * O + b * w2 + P;
            }, t2.multiply = function(e2, i2) {
              var o2 = new t2();
              return o2.calculateMultiply(e2, i2), o2;
            }, t2.multiplyVector = function(t3, e2) {
              var i2 = e2.x, o2 = e2.y, n2 = e2.z;
              e2.x = i2 * t3.n11 + o2 * t3.n12 + n2 * t3.n13 + t3.n14, e2.y = i2 * t3.n21 + o2 * t3.n22 + n2 * t3.n23 + t3.n24, e2.z = i2 * t3.n31 + o2 * t3.n32 + n2 * t3.n33 + t3.n34;
            }, t2;
          })();
          e.Matrix4 = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Vector2 = void 0;
          var o = (function() {
            function t2(t3, e2) {
              this.x = t3, this.y = e2;
            }
            return t2.prototype.clone = function() {
              return new t2(this.x, this.y);
            }, t2.prototype.equals = function(t3) {
              return this.x == t3.x && this.y == t3.y;
            }, t2.prototype.zero = function() {
              this.x = this.y;
            }, t2.prototype.negate = function() {
              return new t2(-this.x, -this.y);
            }, t2.prototype.add = function(e2) {
              return new t2(this.x + e2.x, this.y + e2.y);
            }, t2.prototype.subtract = function(e2) {
              return new t2(this.x - e2.x, this.y - e2.y);
            }, t2.prototype.multiplyScalar = function(e2) {
              return new t2(this.x * e2, this.y * e2);
            }, t2.prototype.multiply = function(e2) {
              return new t2(this.x * e2.x, this.y * e2.y);
            }, t2.prototype.divide = function(e2) {
              var i2 = 1 / e2;
              return new t2(this.x * i2, this.y * i2);
            }, t2.prototype.normalize = function() {
              var t3 = this.x * this.x + this.y * this.y;
              if (t3 > 0) {
                var e2 = 1 / Math.sqrt(t3);
                this.x *= e2, this.y *= e2;
              }
            }, Object.defineProperty(t2.prototype, "magnitude", { get: function() {
              return Math.sqrt(this.x * this.x + this.y * this.y);
            }, set: function(t3) {
              this.normalize(), this.x *= t3, this.y *= t3;
            }, enumerable: false, configurable: true }), t2.prototype.toString = function() {
              return "[" + this.x + " , " + this.y + "]";
            }, t2.sum = function(t3, e2) {
              return t3.add(e2);
            }, t2.dot = function(t3, e2) {
              return t3.x * e2.x + t3.y * e2.y;
            }, t2.distance = function(t3, e2) {
              var i2 = t3.x - e2.x, o2 = t3.y - e2.y;
              return Math.sqrt(i2 * i2 + o2 * o2);
            }, t2.ZERO = new t2(0, 0), t2;
          })();
          e.Vector2 = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Range = void 0;
          var o = i(3), n2 = (function() {
            function t2(t3, e2) {
              void 0 === t3 && (t3 = 0), void 0 === e2 && (e2 = 1), this._start = t3, this._end = e2;
            }
            return Object.defineProperty(t2.prototype, "start", { get: function() {
              return this._start;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "end", { get: function() {
              return this._end;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "size", { get: function() {
              return this._end - this._start;
            }, enumerable: false, configurable: true }), t2.prototype.move = function(t3) {
              this._start += t3, this._end += t3;
            }, t2.prototype.isIn = function(t3) {
              return t3 >= this._start && t3 <= this._end;
            }, t2.prototype.normalize = function(t3) {
              return o.TMath.normalize(this._start, this._end, t3);
            }, t2.prototype.toRange = function(t3) {
              return o.TMath.toRange(this._start, this._end, t3);
            }, t2.prototype.trim = function(t3) {
              return o.TMath.trim(this._start, this._end, t3);
            }, t2.prototype.interpolate = function(t3, e2) {
              return this.toRange(e2.normalize(t3));
            }, t2.prototype.toString = function() {
              return "[" + this.start + " - " + this.end + "]";
            }, t2;
          })();
          e.Range = n2;
        }, function(t, e, i) {
          t.exports = i(8);
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__createBinding || (Object.create ? function(t2, e2, i2, o2) {
            void 0 === o2 && (o2 = i2), Object.defineProperty(t2, o2, { enumerable: true, get: function() {
              return e2[i2];
            } });
          } : function(t2, e2, i2, o2) {
            void 0 === o2 && (o2 = i2), t2[o2] = e2[i2];
          }), n2 = this && this.__exportStar || function(t2, e2) {
            for (var i2 in t2) "default" === i2 || Object.prototype.hasOwnProperty.call(e2, i2) || o(e2, t2, i2);
          };
          Object.defineProperty(e, "__esModule", { value: true }), n2(i(9), e), n2(i(16), e), n2(i(6), e), n2(i(5), e), n2(i(1), e), n2(i(3), e), n2(i(2), e), n2(i(17), e), n2(i(19), e), n2(i(20), e), n2(i(21), e), n2(i(25), e), n2(i(26), e), n2(i(27), e), n2(i(28), e), n2(i(29), e), n2(i(30), e), n2(i(31), e);
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.ModifierStack = void 0;
          var o = i(10), n2 = (function() {
            function t2(t3) {
              this.baseMesh = new o.ThreeMesh(), this.baseMesh.setMesh(t3), this.baseMesh.analyzeGeometry(), this.stack = [];
            }
            return Object.defineProperty(t2.prototype, "indexUpdate", { set: function(t3) {
              this.baseMesh.indexUpdate = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "boundUpdate", { set: function(t3) {
              this.baseMesh.boundUpdate = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "uvsAndColorUpdate", { set: function(t3) {
              this.baseMesh.uvsAndColorUpdate = t3;
            }, enumerable: false, configurable: true }), t2.prototype.addModifier = function(t3) {
              t3.setModifiable(this.baseMesh), this.stack.push(t3);
            }, t2.prototype.removeModifier = function(t3) {
              var e2 = this.stack.indexOf(t3);
              e2 > -1 && this.stack.splice(e2, 1);
            }, t2.prototype.apply = function() {
              this.baseMesh.resetGeometry();
              for (var t3 = 0; t3 < this.stack.length; t3++) this.stack[t3].apply();
              this.baseMesh.postApply();
            }, t2.prototype.collapse = function() {
              this.apply(), this.baseMesh.collapseGeometry(), this.stack.length = 0;
            }, t2.prototype.reset = function() {
              this.baseMesh.resetGeometry();
            }, t2.prototype.clear = function() {
              this.stack.length = 0;
            }, t2.prototype.destroy = function() {
              this.baseMesh.destroy();
              for (var t3 = 0; t3 < this.stack.length; t3++) this.stack[t3].destroy();
              this.clear();
            }, t2;
          })();
          e.ModifierStack = n2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.ThreeMesh = void 0;
          var n2 = i(11), r = i(13), s = i(14), c2 = i(3), u2 = i(1), a = i(15), h2 = (function(t2) {
            function e2() {
              var e3 = null !== t2 && t2.apply(this, arguments) || this;
              return e3.verticesMap = new a.TMap(), e3.uvsAndColorUpdate = false, e3;
            }
            return o(e2, t2), e2.prototype.setMesh = function(t3) {
              this.mesh = t3, this.setVertices(), this.setFaces(), this.mergeVertices(), this.mergeFaces();
            }, e2.prototype.setVertices = function() {
              for (var t3 = this.getAttr("position"), e3 = 0; e3 < t3.count; e3++) {
                var i2 = new n2.ThreeVertex(), o2 = new u2.Vector3().fromBufferAttribute(t3, e3);
                i2.setVertex(o2), this.vertices.push(i2);
              }
            }, e2.prototype.setFaces = function() {
              var t3 = this.getAttr("index"), e3 = this.getAttr("position");
              if (null !== t3) for (var i2 = 0; i2 < t3.count; i2 += 3) {
                var o2 = new s.FaceProxy(), n3 = t3.getX(i2), r2 = t3.getX(i2 + 1), c3 = t3.getX(i2 + 2), u3 = this.vertices[n3], a2 = this.vertices[r2], h3 = this.vertices[c3];
                o2.addVertices(u3, a2, h3), this.faces.push(o2);
              }
              else for (var i2 = 0; i2 < e3.count; i2 += 3) {
                var o2 = new s.FaceProxy(), n3 = i2, r2 = i2 + 1, c3 = i2 + 2, u3 = this.vertices[n3], a2 = this.vertices[r2], h3 = this.vertices[c3];
                o2.addVertices(u3, a2, h3), this.faces.push(o2);
              }
            }, e2.prototype.mergeVertices = function() {
              for (var t3 = [], e3 = this.verticesMap, i2 = 0; i2 < this.vertices.length; i2++) {
                var o2 = this.vertices[i2], n3 = c2.TMath.mappedKey(o2);
                if (e3.includeByValue(n3)) {
                  var r2 = e3.getToByValue(n3);
                  e3.add(r2, i2, n3);
                } else {
                  var r2 = t3.length;
                  o2.only = true, t3.push(o2), e3.add(r2, i2, n3);
                }
              }
              this.vertices = t3;
            }, e2.prototype.mergeFaces = function() {
              for (var t3 = [], e3 = 0, i2 = this.faces.length; e3 < i2; e3++) {
                var o2 = this.faces[e3], n3 = c2.TMath.mappedKey(o2.a), r2 = c2.TMath.mappedKey(o2.b), s2 = c2.TMath.mappedKey(o2.c), u3 = this.verticesMap.getToByValue(n3), a2 = this.verticesMap.getToByValue(r2), h3 = this.verticesMap.getToByValue(s2);
                o2.a = this.vertices[u3], o2.b = this.vertices[a2], o2.c = this.vertices[h3];
                for (var f = [u3, a2, h3], p = 0; p < 3; p++) if (f[p] === f[(p + 1) % 3]) {
                  t3.push(e3);
                  break;
                }
              }
              for (var e3 = t3.length - 1; e3 >= 0; e3--) {
                var l = t3[e3];
                this.faces.splice(l, 1);
              }
            }, e2.prototype.postApply = function() {
              this.updatePosition(), this.updateIndex(), this.computeBounding(), this.updateUvsAndColor();
            }, e2.prototype.updateUvsAndColor = function() {
              if (this.uvsAndColorUpdate) {
                var t3 = this.getAttr("color");
                t3 && (t3.needsUpdate = true);
                var e3 = this.getAttr("uv");
                e3 && (e3.needsUpdate = true);
              }
            }, e2.prototype.computeBounding = function() {
              if (this.boundUpdate) {
                var t3 = this.mesh.geometry;
                t3.computeBoundingBox(), t3.computeBoundingSphere();
              }
            }, e2.prototype.updatePosition = function() {
              var t3, e3, i2, o2, n3, r2 = this.getAttr("position"), s2 = this.vertices.length;
              for (i2 = 0; i2 < s2; i2++) for (e3 = this.vertices[i2], t3 = this.verticesMap.getFromByTo(i2), o2 = 0; o2 < t3.length; o2++) n3 = t3[o2], r2.setX(n3, e3.x), r2.setY(n3, e3.y), r2.setZ(n3, e3.z);
              r2.needsUpdate = true;
            }, e2.prototype.updateIndex = function() {
              if (this.indexUpdate) {
                var t3 = this.getAttr("index");
                t3 && (t3.needsUpdate = true);
              }
            }, e2.prototype.getAttr = function(t3) {
              var e3 = this.mesh.geometry;
              return "index" === t3 ? e3.getIndex() : e3.getAttribute(t3);
            }, e2.prototype.updateMeshPosition = function(t3) {
              this.mesh.position.x += t3.x, this.mesh.position.y += t3.y, this.mesh.position.z += t3.z;
            }, e2.prototype.destroy = function() {
              t2.prototype.destroy.call(this), this.verticesMap.destroy(), this.verticesMap = null, this.mesh = null;
            }, e2;
          })(r.MeshProxy);
          e.ThreeMesh = h2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.ThreeVertex = void 0;
          var n2 = i(12), r = (function(t2) {
            function e2() {
              var e3 = t2.call(this) || this;
              return e3.only = false, e3;
            }
            return o(e2, t2), e2.prototype.setVertex = function(t3) {
              this.vertor = t3, this.ox = this.vertor.x, this.oy = this.vertor.y, this.oz = this.vertor.z;
            }, Object.defineProperty(e2.prototype, "x", { get: function() {
              return this.vertor.x;
            }, set: function(t3) {
              this.vertor.x = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "y", { get: function() {
              return this.vertor.y;
            }, set: function(t3) {
              this.vertor.y = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "z", { get: function() {
              return this.vertor.z;
            }, set: function(t3) {
              this.vertor.z = t3;
            }, enumerable: false, configurable: true }), e2.prototype.toString = function() {
              return t2.prototype.toString.call(this) + " only:" + this.only;
            }, e2;
          })(n2.VertexProxy);
          e.ThreeVertex = r;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.VertexProxy = void 0;
          var o = i(1), n2 = i(2), r = (function() {
            function t2() {
              this.id = "";
            }
            return t2.prototype.setVertex = function(t3) {
            }, t2.prototype.setRatios = function(t3, e2, i2) {
              this._ratioX = t3, this._ratioY = e2, this._ratioZ = i2;
            }, t2.prototype.setOriginalPosition = function(t3, e2, i2) {
              this.ox = t3, this.oy = e2, this.oz = i2;
            }, Object.defineProperty(t2.prototype, "x", { get: function() {
              return 0;
            }, set: function(t3) {
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "y", { get: function() {
              return 0;
            }, set: function(t3) {
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "z", { get: function() {
              return 0;
            }, set: function(t3) {
            }, enumerable: false, configurable: true }), t2.prototype.getValue = function(t3) {
              switch (t3) {
                case n2.ModConstant.X:
                  return this.x;
                case n2.ModConstant.Y:
                  return this.y;
                case n2.ModConstant.Z:
                  return this.z;
              }
              return 0;
            }, t2.prototype.setValue = function(t3, e2) {
              switch (t3) {
                case n2.ModConstant.X:
                  this.x = e2;
                  break;
                case n2.ModConstant.Y:
                  this.y = e2;
                  break;
                case n2.ModConstant.Z:
                  this.z = e2;
              }
            }, Object.defineProperty(t2.prototype, "ratioX", { get: function() {
              return this._ratioX;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "ratioY", { get: function() {
              return this._ratioY;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "ratioZ", { get: function() {
              return this._ratioZ;
            }, enumerable: false, configurable: true }), t2.prototype.getRatio = function(t3) {
              switch (t3) {
                case n2.ModConstant.X:
                  return this._ratioX;
                case n2.ModConstant.Y:
                  return this._ratioY;
                case n2.ModConstant.Z:
                  return this._ratioZ;
              }
              return -1;
            }, Object.defineProperty(t2.prototype, "originalX", { get: function() {
              return this.ox;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "originalY", { get: function() {
              return this.oy;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "originalZ", { get: function() {
              return this.oz;
            }, enumerable: false, configurable: true }), t2.prototype.getOriginalValue = function(t3) {
              switch (t3) {
                case n2.ModConstant.X:
                  return this.ox;
                case n2.ModConstant.Y:
                  return this.oy;
                case n2.ModConstant.Z:
                  return this.oz;
              }
              return 0;
            }, t2.prototype.reset = function() {
              this.x = this.ox, this.y = this.oy, this.z = this.oz;
            }, t2.prototype.collapse = function() {
              this.ox = this.x, this.oy = this.y, this.oz = this.z;
            }, Object.defineProperty(t2.prototype, "vector", { get: function() {
              return new o.Vector3(this.x, this.y, this.z);
            }, set: function(t3) {
              this.x = t3.x, this.y = t3.y, this.z = t3.z;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "ratioVector", { get: function() {
              return new o.Vector3(this.ratioX, this.ratioY, this.ratioZ);
            }, enumerable: false, configurable: true }), t2.prototype.toString = function() {
              return "Vertex id:" + this.id + " xyz:" + this.x + " " + this.y + " " + this.z;
            }, t2;
          })();
          e.VertexProxy = r;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.MeshProxy = void 0;
          var o = i(2), n2 = (function() {
            function t2() {
              this.boundUpdate = false, this.indexUpdate = false, this.uvsAndColorUpdate = false, this.vertices = [], this.faces = [];
            }
            return t2.prototype.setMesh = function(t3) {
            }, t2.prototype.updateMeshPosition = function(t3) {
            }, t2.prototype.getVertices = function() {
              return this.vertices;
            }, t2.prototype.getFaces = function() {
              return this.faces;
            }, t2.prototype.analyzeGeometry = function() {
              for (var t3, e2 = this.getVertices().length, i2 = 0; i2 < e2; i2++) t3 = this.getVertices()[i2], 0 == i2 ? (this._minX = this._maxX = t3.x, this._minY = this._maxY = t3.y, this._minZ = this._maxZ = t3.z) : (this._minX = Math.min(this._minX, t3.x), this._minY = Math.min(this._minY, t3.y), this._minZ = Math.min(this._minZ, t3.z), this._maxX = Math.max(this._maxX, t3.x), this._maxY = Math.max(this._maxY, t3.y), this._maxZ = Math.max(this._maxZ, t3.z)), t3.setOriginalPosition(t3.x, t3.y, t3.z);
              this._width = this._maxX - this._minX, this._height = this._maxY - this._minY, this._depth = this._maxZ - this._minZ;
              var n3 = Math.max(this._width, Math.max(this._height, this._depth)), r = Math.min(this._width, Math.min(this._height, this._depth));
              n3 == this._width && r == this._height ? (this._minAxis = o.ModConstant.Y, this._midAxis = o.ModConstant.Z, this._maxAxis = o.ModConstant.X) : n3 == this._width && r == this._depth ? (this._minAxis = o.ModConstant.Z, this._midAxis = o.ModConstant.Y, this._maxAxis = o.ModConstant.X) : n3 == this._height && r == this._width ? (this._minAxis = o.ModConstant.X, this._midAxis = o.ModConstant.Z, this._maxAxis = o.ModConstant.Y) : n3 == this._height && r == this._depth ? (this._minAxis = o.ModConstant.Z, this._midAxis = o.ModConstant.X, this._maxAxis = o.ModConstant.Y) : n3 == this._depth && r == this._width ? (this._minAxis = o.ModConstant.X, this._midAxis = o.ModConstant.Y, this._maxAxis = o.ModConstant.Z) : n3 == this._depth && r == this._height && (this._minAxis = o.ModConstant.Y, this._midAxis = o.ModConstant.X, this._maxAxis = o.ModConstant.Z);
              for (var i2 = 0; i2 < e2; i2++) t3 = this.getVertices()[i2], t3.setRatios((t3.x - this._minX) / this._width, (t3.y - this._minY) / this._height, (t3.z - this._minZ) / this._depth);
            }, t2.prototype.resetGeometry = function() {
              for (var t3 = this.getVertices().length, e2 = 0; e2 < t3; e2++) {
                this.getVertices()[e2].reset();
              }
            }, t2.prototype.collapseGeometry = function() {
              for (var t3 = this.getVertices().length, e2 = 0; e2 < t3; e2++) {
                this.getVertices()[e2].collapse();
              }
              this.analyzeGeometry();
            }, Object.defineProperty(t2.prototype, "minX", { get: function() {
              return this._minX;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "minY", { get: function() {
              return this._minY;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "minZ", { get: function() {
              return this._minZ;
            }, enumerable: false, configurable: true }), t2.prototype.getMin = function(t3) {
              switch (t3) {
                case o.ModConstant.X:
                  return this._minX;
                case o.ModConstant.Y:
                  return this._minY;
                case o.ModConstant.Z:
                  return this._minZ;
              }
              return -1;
            }, Object.defineProperty(t2.prototype, "maxX", { get: function() {
              return this._maxX;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "maxY", { get: function() {
              return this._maxY;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "maxZ", { get: function() {
              return this._maxZ;
            }, enumerable: false, configurable: true }), t2.prototype.getMax = function(t3) {
              switch (t3) {
                case o.ModConstant.X:
                  return this._maxX;
                case o.ModConstant.Y:
                  return this._maxY;
                case o.ModConstant.Z:
                  return this._maxZ;
              }
              return -1;
            }, Object.defineProperty(t2.prototype, "maxAxis", { get: function() {
              return this._maxAxis;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "midAxis", { get: function() {
              return this._midAxis;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "minAxis", { get: function() {
              return this._minAxis;
            }, enumerable: false, configurable: true }), t2.prototype.getSize = function(t3) {
              switch (t3) {
                case o.ModConstant.X:
                  return this._width;
                case o.ModConstant.Y:
                  return this._height;
                case o.ModConstant.Z:
                  return this._depth;
              }
              return -1;
            }, Object.defineProperty(t2.prototype, "width", { get: function() {
              return this._width;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "height", { get: function() {
              return this._height;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "depth", { get: function() {
              return this._depth;
            }, enumerable: false, configurable: true }), t2.prototype.postApply = function() {
            }, t2.prototype.destroy = function() {
              this.vertices.length = 0, this.faces.length = 0;
            }, t2;
          })();
          e.MeshProxy = n2;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.FaceProxy = void 0;
          var o = (function() {
            function t2() {
              this._vertices = [];
            }
            return Object.defineProperty(t2.prototype, "a", { get: function() {
              return this._vertices[0];
            }, set: function(t3) {
              this._vertices[0] = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "b", { get: function() {
              return this._vertices[1];
            }, set: function(t3) {
              this._vertices[1] = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "c", { get: function() {
              return this._vertices[2];
            }, set: function(t3) {
              this._vertices[2] = t3;
            }, enumerable: false, configurable: true }), t2.prototype.addVertex = function(t3) {
              this._vertices.push(t3);
            }, t2.prototype.addVertices = function() {
              for (var t3 = [], e2 = 0; e2 < arguments.length; e2++) t3[e2] = arguments[e2];
              for (var i2 = 0; i2 < t3.length; i2++) this.addVertex(t3[i2]);
            }, t2.prototype.addABC = function() {
              for (var t3 = [], e2 = 0; e2 < arguments.length; e2++) t3[e2] = arguments[e2];
              for (var i2 = 0; i2 < t3.length; i2++) this.addVertex(t3[i2]);
            }, Object.defineProperty(t2.prototype, "vertices", { get: function() {
              return this._vertices;
            }, enumerable: false, configurable: true }), t2.prototype.toString = function() {
              for (var t3 = "", e2 = 0; e2 < this._vertices.length; e2++) t3 += e2 + ":" + this._vertices[e2] + " ";
              return t3;
            }, t2;
          })();
          e.FaceProxy = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.TMap = void 0;
          var o = (function() {
            function t2() {
              this.from = [];
            }
            return t2.prototype.push = function(t3) {
              this.from.push(t3);
            }, t2;
          })(), n2 = (function() {
            function t2() {
              this._map = {};
            }
            return t2.prototype.add = function(t3, e2, i2) {
              var n3 = "t_" + t3;
              this._map[n3] || (this._map[n3] = new o()), this._map[n3].push(e2), this._map[n3].to = t3, this._map[n3].value = i2;
            }, t2.prototype.getToByValue = function(t3) {
              var e2 = this.getItemByValue(t3);
              return e2 ? e2.to : -1;
            }, t2.prototype.getFromByTo = function(t3) {
              var e2 = this.getItemByTo(t3);
              return e2 ? e2.from : null;
            }, t2.prototype.includeByValue = function(t3) {
              return !!this.getItemByValue(t3);
            }, t2.prototype.getItemByValue = function(t3) {
              for (var e2 in this._map) {
                var i2 = this._map[e2];
                if (i2.value === t3) return i2;
              }
              return null;
            }, t2.prototype.getItemByTo = function(t3) {
              var e2 = "t_" + t3;
              return this._map[e2];
            }, t2.prototype.destroy = function() {
              for (var t3 in this._map) delete this._map[t3];
            }, t2;
          })();
          e.TMap = n2;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Phase = void 0;
          var o = (function() {
            function t2(t3) {
              void 0 === t3 && (t3 = 0), this.v = t3;
            }
            return Object.defineProperty(t2.prototype, "value", { get: function() {
              return this.v;
            }, set: function(t3) {
              this.v = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "phasedValue", { get: function() {
              return Math.sin(this.v);
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "absPhasedValue", { get: function() {
              return Math.abs(this.phasedValue);
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "normValue", { get: function() {
              return (this.phasedValue + 1) / 2;
            }, enumerable: false, configurable: true }), t2;
          })();
          e.Phase = o;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Bend = void 0;
          var n2 = i(2), r = i(0), s = i(5), c2 = i(18), u2 = (function(t2) {
            function e2(e3, i2, o2) {
              void 0 === e3 && (e3 = 0), void 0 === i2 && (i2 = 0.5), void 0 === o2 && (o2 = 0);
              var r2 = t2.call(this) || this;
              return r2._constraint = n2.ModConstant.NONE, r2.switchAxes = false, r2._force = e3, r2._offset = i2, r2.angle = o2, r2;
            }
            return o(e2, t2), e2.prototype.setModifiable = function(e3) {
              t2.prototype.setModifiable.call(this, e3), this.max = this.switchAxes ? e3.midAxis : e3.maxAxis, this.min = e3.minAxis, this.mid = this.switchAxes ? e3.maxAxis : e3.midAxis, this.width = e3.getSize(this.max), this.height = e3.getSize(this.mid), this.origin = e3.getMin(this.max), this._diagAngle = Math.atan(this.width / this.height);
            }, Object.defineProperty(e2.prototype, "force", { get: function() {
              return this._force;
            }, set: function(t3) {
              this._force = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "constraint", { get: function() {
              return this._constraint;
            }, set: function(t3) {
              this._constraint = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "offset", { get: function() {
              return this._offset;
            }, set: function(t3) {
              this._offset = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "diagAngle", { get: function() {
              return this._diagAngle;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "angle", { get: function() {
              return this._angle;
            }, set: function(t3) {
              this._angle = t3, this.m1 = new c2.Matrix(1, 0, 0, 1), this.m1.rotate(this._angle), this.m2 = new c2.Matrix(1, 0, 0, 1), this.m2.rotate(-this._angle);
            }, enumerable: false, configurable: true }), e2.prototype.apply = function() {
              if (0 != this.force) for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = this.origin + this.width * this.offset, o2 = this.width / Math.PI / this.force, r2 = 2 * Math.PI * (this.width / (o2 * Math.PI * 2)), c3 = 0; c3 < e3; c3++) {
                var u3 = t3[c3], a = u3.getValue(this.max), h2 = u3.getValue(this.mid), f = u3.getValue(this.min), p = this.m1.transformPoint(new s.Vector2(a, h2));
                a = p.x, h2 = p.y;
                var l = (a - this.origin) / this.width;
                if (this.constraint == n2.ModConstant.LEFT && l <= this.offset || this.constraint == n2.ModConstant.RIGHT && l >= this.offset) ;
                else {
                  var y2 = Math.PI / 2 - r2 * this.offset + r2 * l, d2 = Math.sin(y2) * (o2 + f), _ = Math.cos(y2) * (o2 + f);
                  f = d2 - o2, a = i2 - _;
                }
                var v2 = this.m2.transformPoint(new s.Vector2(a, h2));
                a = v2.x, h2 = v2.y, u3.setValue(this.max, a), u3.setValue(this.mid, h2), u3.setValue(this.min, f);
              }
            }, e2;
          })(r.Modifier);
          e.Bend = u2;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Matrix = void 0;
          var o = i(5), n2 = (function() {
            function t2(t3, e2, i2, o2) {
              this.m = [t3, e2, i2, o2];
            }
            return t2.prototype.dispose = function() {
              return this.m.length = 0, this;
            }, t2.prototype.reset = function() {
              return this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, this;
            }, t2.prototype.rotate = function(t3) {
              var e2 = Math.cos(t3), i2 = Math.sin(t3);
              return this.m[0] = e2, this.m[1] = -i2, this.m[2] = i2, this.m[3] = e2, this;
            }, t2.prototype.scale = function(t3, e2) {
              return this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, void 0 !== t3 && (this.m[0] = t3, this.m[3] = t3), void 0 !== e2 && (this.m[3] = e2), this;
            }, t2.prototype.multiply = function(e2) {
              return t2.mult(this, e2);
            }, t2.prototype.transformPoint = function(e2) {
              var i2 = t2.transform(this, [e2.x, e2.y]);
              return new o.Vector2(i2[0], i2[1]);
            }, t2.prototype.transformPointSelf = function(e2) {
              var i2 = t2.transform(this, [e2.x, e2.y]);
              return e2.x = i2[0], e2.y = i2[1], e2;
            }, t2.prototype.clone = function() {
              var e2 = this.m;
              return new t2(e2[0], e2[1], e2[2], e2[3]);
            }, t2.transform = function(t3, e2) {
              var i2 = t3.m, o2 = e2[0], n3 = e2[1];
              return e2[0] = i2[0] * o2 + i2[1] * n3, e2[1] = i2[2] * o2 + i2[3] * n3, e2;
            }, t2.mult = function(t3, e2) {
              var i2 = t3.m, o2 = e2.m, n3 = i2[0], r = i2[1], s = i2[2], c2 = i2[3];
              return i2[0] = n3 * o2[0] + r * o2[2], i2[1] = n3 * o2[1] + r * o2[3], i2[2] = s * o2[0] + c2 * o2[2], i2[3] = s * o2[1] + c2 * o2[3], t3;
            }, t2;
          })();
          e.Matrix = n2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Bloat = void 0;
          var n2 = i(1), r = i(0), s = (function(t2) {
            function e2() {
              var e3 = null !== t2 && t2.apply(this, arguments) || this;
              return e3._center = n2.Vector3.ZERO, e3._r = 0, e3._a = 0.01, e3._u = n2.Vector3.ZERO, e3;
            }
            return o(e2, t2), Object.defineProperty(e2.prototype, "center", { get: function() {
              return this._center;
            }, set: function(t3) {
              this._center = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "radius", { get: function() {
              return this._r;
            }, set: function(t3) {
              this._r = Math.max(0, t3);
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "a", { get: function() {
              return this._a;
            }, set: function(t3) {
              this._a = Math.max(0, t3);
            }, enumerable: false, configurable: true }), e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = 0, i2 = t3; e3 < i2.length; e3++) {
                var o2 = i2[e3], n3 = o2;
                this._u.x = n3.x - this._center.x, this._u.y = n3.y - this._center.y, this._u.z = n3.z - this._center.z, this._u.magnitude += this._r * Math.exp(-this._u.magnitude * this._a), n3.x = this._u.x + this._center.x, n3.y = this._u.y + this._center.y, n3.z = this._u.z + this._center.z;
              }
            }, e2;
          })(r.Modifier);
          e.Bloat = s;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Break = void 0;
          var n2 = i(6), r = i(1), s = i(4), c2 = i(0), u2 = (function(t2) {
            function e2(e3, i2) {
              void 0 === e3 && (e3 = 0), void 0 === i2 && (i2 = 0);
              var o2 = t2.call(this) || this;
              return o2.bv = new r.Vector3(0, 1, 0), o2.range = new n2.Range(0, 1), o2.angle = i2, o2._offset = e3, o2;
            }
            return o(e2, t2), e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = new r.Vector3(0, 0, -(this.mod.minZ + this.mod.depth * this.offset)), o2 = 0; o2 < e3; o2++) {
                var n3 = t3[o2], c3 = n3.vector;
                if (c3 = c3.add(i2), c3.z >= 0 && this.range.isIn(n3.ratioY)) {
                  var u3 = this.angle, a = s.Matrix4.rotationMatrix(this.bv.x, this.bv.y, this.bv.z, u3);
                  s.Matrix4.multiplyVector(a, c3);
                }
                var h2 = i2.negate();
                c3 = c3.add(h2), n3.x = c3.x, n3.y = c3.y, n3.z = c3.z;
              }
            }, Object.defineProperty(e2.prototype, "offset", { get: function() {
              return this._offset;
            }, set: function(t3) {
              this._offset = t3;
            }, enumerable: false, configurable: true }), e2;
          })(c2.Modifier);
          e.Break = u2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Cloth = void 0;
          var n2 = i(2), r = i(22), s = i(0), c2 = i(23), u2 = i(24), a = (function(t2) {
            function e2(e3, i2) {
              void 0 === e3 && (e3 = 1), void 0 === i2 && (i2 = 0);
              var o2 = t2.call(this) || this;
              return o2._forceX = 0, o2._forceY = 0, o2._forceZ = 0, o2._dic = new r.Dictionary(), o2._rigidity = e3, o2.friction = i2, o2;
            }
            return o(e2, t2), e2.prototype.setBounds = function(t3, e3, i2, o2, n3, r2) {
              void 0 === t3 && (t3 = Number.NEGATIVE_INFINITY), void 0 === e3 && (e3 = Number.POSITIVE_INFINITY), void 0 === i2 && (i2 = Number.NEGATIVE_INFINITY), void 0 === o2 && (o2 = Number.POSITIVE_INFINITY), void 0 === n3 && (n3 = Number.NEGATIVE_INFINITY), void 0 === r2 && (r2 = Number.POSITIVE_INFINITY), this._useBounds = true, this._boundsMinX = t3, this._boundsMaxX = e3, this._boundsMinY = i2, this._boundsMaxY = o2, this._boundsMinZ = n3, this._boundsMaxZ = r2;
            }, e2.prototype.clearBounds = function() {
              this._useBounds = false;
            }, Object.defineProperty(e2.prototype, "verletVertices", { get: function() {
              return this._vertices;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "friction", { get: function() {
              return 100 * (this._friction - 1);
            }, set: function(t3) {
              t3 < 0 && (t3 = 0), this._friction = t3 / 100 + 1;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "rigidity", { get: function() {
              return this._rigidity;
            }, set: function(t3) {
              var e3, i2, o2 = this._connections.length;
              for (t3 > 1 ? t3 = 1 : t3 < 0 && (t3 = 0), this._rigidity = t3, e3 = 0.5 * t3; i2 = this._connections[--o2]; ) i2.rigidity = e3;
            }, enumerable: false, configurable: true }), e2.prototype.setForce = function(t3, e3, i2) {
              this._forceX = t3, this._forceY = e3, this._forceZ = i2;
            }, Object.defineProperty(e2.prototype, "forceX", { get: function() {
              return this._forceX;
            }, set: function(t3) {
              this._forceX = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "forceY", { get: function() {
              return this._forceY;
            }, set: function(t3) {
              this._forceY = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "forceZ", { get: function() {
              return this._forceZ;
            }, set: function(t3) {
              this._forceZ = t3;
            }, enumerable: false, configurable: true }), e2.prototype.unlockAll = function() {
              for (var t3, e3 = this._vertices.length; t3 = this._vertices[--e3]; ) t3.mobileX = true, t3.mobileY = true, t3.mobileZ = true;
            }, e2.prototype.lockXMin = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.minX, "x", t3, e3);
            }, e2.prototype.lockXMax = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.maxX, "x", t3, e3);
            }, e2.prototype.lockYMin = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.minY, "y", t3, e3);
            }, e2.prototype.lockYMax = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.maxY, "y", t3, e3);
            }, e2.prototype.lockZMin = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.minZ, "z", t3, e3);
            }, e2.prototype.lockZMax = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 7), this.lockSet(this.mod.maxZ, "z", t3, e3);
            }, e2.prototype.lockSet = function(t3, e3, i2, o2) {
              void 0 === i2 && (i2 = 0), void 0 === o2 && (o2 = 7);
              for (var r2, s2 = this._vertices.length; r2 = this._vertices[--s2]; ) Math.abs(r2[e3] - t3) <= i2 && (o2 & n2.ModConstant.X && (r2.mobileX = false), o2 & n2.ModConstant.Y && (r2.mobileY = false), o2 & n2.ModConstant.Z && (r2.mobileZ = false));
            }, e2.prototype.setModifiable = function(e3) {
              t2.prototype.setModifiable.call(this, e3), this.initVerletVertices(), this.initVerletConnections(), this.rigidity = this._rigidity;
            }, e2.prototype.apply = function() {
              var t3, e3, i2;
              for (t3 = this._connections.length; e3 = this._connections[--t3]; ) e3.update();
              for (t3 = this._vertices.length; i2 = this._vertices[--t3]; ) i2.mobileX && (i2.x += this._forceX), i2.mobileY && (i2.y += this._forceY), i2.mobileZ && (i2.z += this._forceZ), i2.velocityX /= this._friction, i2.velocityY /= this._friction, i2.velocityZ /= this._friction, this._useBounds && (i2.x < this._boundsMinX ? i2.x = this._boundsMinX : i2.x > this._boundsMaxX && (i2.x = this._boundsMaxX), i2.y < this._boundsMinY ? i2.y = this._boundsMinY : i2.y > this._boundsMaxY && (i2.y = this._boundsMaxY), i2.z < this._boundsMinZ ? i2.z = this._boundsMinZ : i2.z > this._boundsMaxZ && (i2.z = this._boundsMaxZ)), i2.update();
            }, e2.prototype.initVerletVertices = function() {
              var t3, e3 = this.mod.getVertices(), i2 = e3.length;
              for (this._vertices = []; t3 = e3[--i2]; ) {
                var o2 = new u2.VerletVertex(t3);
                this._vertices.push(o2), this._dic.setVal(t3, o2);
              }
            }, e2.prototype.initVerletConnections = function() {
              var t3, e3, i2, o2 = this.mod.getFaces(), n3 = o2.length;
              this._connections = [];
              for (var r2 = 0; r2 < n3; r2++) {
                t3 = o2[r2], e3 = t3.vertices, i2 = e3.length;
                for (var s2 = 0; s2 < i2 - 1; s2++) this.createConnection(this._dic.getVal(e3[s2]), this._dic.getVal(e3[s2 + 1])), s2 > 1 && this.createConnection(this._dic.getVal(e3[0]), this._dic.getVal(e3[s2]));
                this.createConnection(this._dic.getVal(e3[i2 - 1]), this._dic.getVal(e3[0]));
              }
            }, e2.prototype.createConnection = function(t3, e3) {
              if (t3 && e3) {
                var i2 = t3.distanceTo(e3), o2 = new c2.VerletConnection(t3, e3, i2, this._rigidity);
                this._connections.push(o2);
              }
            }, e2;
          })(s.Modifier);
          e.Cloth = a;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.Dictionary = void 0;
          var o = (function() {
            function t2() {
              this.dic = {};
            }
            return t2.prototype.setVal = function(t3, e2) {
              var i2 = this.getKey(t3);
              this.dic[i2] = e2;
            }, t2.prototype.getVal = function(t3) {
              var e2 = this.getKey(t3);
              return this.dic[e2];
            }, t2.prototype.getKey = function(t3) {
              if ("object" == typeof t3) {
                if (t3.id) return t3.id;
                var e2 = "d_" + Math.floor(Math.random() * Math.pow(10, 10));
                return t3.id = e2, e2;
              }
              return t3 + "";
            }, t2;
          })();
          e.Dictionary = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.VerletConnection = void 0;
          var o = (function() {
            function t2(t3, e2, i2, o2) {
              void 0 === o2 && (o2 = 0.5), this._rigidity = 0.5, this._v1 = t3, this._v2 = e2, this._strictDistance = i2, this._rigidity = o2;
            }
            return Object.defineProperty(t2.prototype, "rigidity", { get: function() {
              return this._rigidity;
            }, set: function(t3) {
              this._rigidity = t3;
            }, enumerable: false, configurable: true }), t2.prototype.update = function() {
              var t3, e2, i2, o2, n2 = this._v1.x, r = this._v2.x, s = this._v1.y, c2 = this._v2.y, u2 = this._v1.z, a = this._v2.z, h2 = r - n2, f = c2 - s, p = a - u2, l = Math.sqrt(h2 * h2 + f * f + p * p);
              l != this._strictDistance && (t3 = (this._strictDistance - l) / l * this._rigidity, e2 = t3 * h2, i2 = t3 * f, o2 = t3 * p, this._v1.mobileX && this._v2.mobileX || (e2 *= 2), this._v1.mobileY && this._v2.mobileY || (i2 *= 2), this._v1.mobileZ && this._v2.mobileZ || (o2 *= 2), this._v1.mobileX && (this._v1.x -= e2), this._v1.mobileY && (this._v1.y -= i2), this._v1.mobileZ && (this._v1.z -= o2), this._v2.mobileX && (this._v2.x += e2), this._v2.mobileY && (this._v2.y += i2), this._v2.mobileZ && (this._v2.z += o2));
            }, t2;
          })();
          e.VerletConnection = o;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.VerletVertex = void 0;
          var o = (function() {
            function t2(t3) {
              this.mobileX = true, this.mobileY = true, this.mobileZ = true, this._v = t3, this.setPosition(this._v.x, this._v.y, this._v.z);
            }
            return t2.prototype.setPosition = function(t3, e2, i2) {
              this._x = this._oldX = t3, this._y = this._oldY = e2, this._z = this._oldZ = i2, this._v.x = t3, this._v.y = e2, this._v.z = i2;
            }, t2.prototype.update = function() {
              var t3, e2, i2;
              this.mobileX && (t3 = this.x, this.x += this.velocityX, this._oldX = t3), this.mobileY && (e2 = this.y, this.y += this.velocityY, this._oldY = e2), this.mobileZ && (i2 = this.z, this.z += this.velocityZ, this._oldZ = i2);
            }, Object.defineProperty(t2.prototype, "x", { get: function() {
              return this._x;
            }, set: function(t3) {
              this._x = t3, this.mobileX || (this._oldX = t3), this._v.x = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "y", { get: function() {
              return this._y;
            }, set: function(t3) {
              this._y = t3, this.mobileY || (this._oldY = t3), this._v.y = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "z", { get: function() {
              return this._z;
            }, set: function(t3) {
              this._z = t3, this.mobileZ || (this._oldZ = t3), this._v.z = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "velocityX", { get: function() {
              return this._x - this._oldX;
            }, set: function(t3) {
              this._oldX = this._x - t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "velocityY", { get: function() {
              return this._y - this._oldY;
            }, set: function(t3) {
              this._oldY = this._y - t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(t2.prototype, "velocityZ", { get: function() {
              return this._z - this._oldZ;
            }, set: function(t3) {
              this._oldZ = this._z - t3;
            }, enumerable: false, configurable: true }), t2.prototype.distanceTo = function(t3) {
              return Math.sqrt((this.x - t3.x) * (this.x - t3.x) + (this.y - t3.y) * (this.y - t3.y) + (this.z - t3.z) * (this.z - t3.z));
            }, t2;
          })();
          e.VerletVertex = o;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Noise = void 0;
          var n2 = i(2), r = i(0), s = (function(t2) {
            function e2(e3) {
              void 0 === e3 && (e3 = 0);
              var i2 = t2.call(this) || this;
              return i2.axc = n2.ModConstant.NONE, i2.start = 0, i2.end = 0, i2.frc = e3, i2;
            }
            return o(e2, t2), Object.defineProperty(e2.prototype, "force", { get: function() {
              return this.frc;
            }, set: function(t3) {
              this.frc = t3;
            }, enumerable: false, configurable: true }), e2.prototype.constraintAxes = function(t3) {
              this.axc = t3;
            }, e2.prototype.setFalloff = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 1), this.start = t3, this.end = e3;
            }, e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = 0; i2 < e3; i2++) {
                var o2 = t3[i2], n3 = Math.random() * this.force - this.force / 2, r2 = o2.getRatio(this.mod.maxAxis);
                this.start < this.end ? (r2 < this.start && (r2 = 0), r2 > this.end && (r2 = 1)) : this.start > this.end ? (r2 = 1 - r2, r2 > this.start && (r2 = 0), r2 < this.end && (r2 = 1)) : r2 = 1, 1 & this.axc || (o2.x += n3 * r2), this.axc >> 1 & 1 || (o2.y += n3 * r2), this.axc >> 2 & 1 || (o2.z += n3 * r2);
              }
            }, e2;
          })(r.Modifier);
          e.Noise = s;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Pivot = void 0;
          var n2 = i(1), r = i(0), s = (function(t2) {
            function e2(e3, i2, o2) {
              void 0 === e3 && (e3 = 0), void 0 === i2 && (i2 = 0), void 0 === o2 && (o2 = 0);
              var r2 = t2.call(this) || this;
              return r2.pivot = new n2.Vector3(e3, i2, o2), r2;
            }
            return o(e2, t2), e2.prototype.setMeshCenter = function() {
              var t3 = -(this.mod.minX + this.mod.width / 2), e3 = -(this.mod.minY + this.mod.height / 2), i2 = -(this.mod.minZ + this.mod.depth / 2);
              this.pivot = new n2.Vector3(t3, e3, i2);
            }, e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = 0; i2 < e3; i2++) {
                var o2 = t3[i2];
                o2.vector = o2.vector.add(this.pivot);
              }
              var n3 = this.pivot.clone();
              this.mod.updateMeshPosition(n3.negate());
            }, e2;
          })(r.Modifier);
          e.Pivot = s;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Skew = void 0;
          var n2 = i(3), r = i(2), s = i(0), c2 = (function(t2) {
            function e2(e3) {
              void 0 === e3 && (e3 = 0);
              var i2 = t2.call(this) || this;
              return i2._offset = 0.5, i2._constraint = r.ModConstant.NONE, i2._power = 1, i2._falloff = 1, i2._inverseFalloff = false, i2._oneSide = false, i2._swapAxes = false, i2._force = e3, i2;
            }
            return o(e2, t2), e2.prototype.setModifiable = function(e3) {
              t2.prototype.setModifiable.call(this, e3), this._skewAxis = this._skewAxis || e3.maxAxis;
            }, e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = 0; i2 < e3; i2++) {
                var o2 = t3[i2];
                if (!(this._constraint == r.ModConstant.LEFT && o2.getRatio(this._skewAxis) <= this._offset) && !(this._constraint == r.ModConstant.RIGHT && o2.getRatio(this._skewAxis) > this._offset)) {
                  var s2 = o2.getRatio(this._skewAxis) - this._offset;
                  this._oneSide && (s2 = Math.abs(s2));
                  var c3 = o2.getRatio(this.displaceAxis);
                  this._inverseFalloff && (c3 = 1 - c3);
                  var u2 = this._falloff + c3 * (1 - this._falloff), a = Math.pow(Math.abs(s2), this._power) * n2.TMath.sign(s2, 1), h2 = o2.getValue(this.displaceAxis) + this.force * a * u2;
                  o2.setValue(this.displaceAxis, h2);
                }
              }
            }, Object.defineProperty(e2.prototype, "displaceAxis", { get: function() {
              switch (this._skewAxis) {
                case r.ModConstant.X:
                  return this._swapAxes ? r.ModConstant.Z : r.ModConstant.Y;
                case r.ModConstant.Y:
                  return this._swapAxes ? r.ModConstant.Z : r.ModConstant.X;
                case r.ModConstant.Z:
                  return this._swapAxes ? r.ModConstant.Y : r.ModConstant.X;
                default:
                  return 0;
              }
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "force", { get: function() {
              return this._force;
            }, set: function(t3) {
              this._force = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "constraint", { get: function() {
              return this._constraint;
            }, set: function(t3) {
              this._constraint = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "offset", { get: function() {
              return this._offset;
            }, set: function(t3) {
              this._offset = n2.TMath.trim(0, 1, t3);
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "power", { get: function() {
              return this._power;
            }, set: function(t3) {
              this._power = Math.max(1, t3);
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "falloff", { get: function() {
              return this._falloff;
            }, set: function(t3) {
              this._falloff = n2.TMath.trim(0, 1, t3);
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "oneSide", { get: function() {
              return this._oneSide;
            }, set: function(t3) {
              this._oneSide = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "skewAxis", { get: function() {
              return this._skewAxis;
            }, set: function(t3) {
              this._skewAxis = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "swapAxes", { get: function() {
              return this._swapAxes;
            }, set: function(t3) {
              this._swapAxes = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "inverseFalloff", { get: function() {
              return this._inverseFalloff;
            }, set: function(t3) {
              this._inverseFalloff = t3;
            }, enumerable: false, configurable: true }), e2;
          })(s.Modifier);
          e.Skew = c2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Taper = void 0;
          var n2 = i(4), r = i(1), s = i(0), c2 = (function(t2) {
            function e2(e3) {
              var i2 = t2.call(this) || this;
              return i2.start = 0, i2.end = 1, i2._vector = new r.Vector3(1, 0, 1), i2._vector2 = new r.Vector3(0, 1, 0), i2.frc = e3, i2.pow = 1, i2;
            }
            return o(e2, t2), e2.prototype.setFalloff = function(t3, e3) {
              void 0 === t3 && (t3 = 0), void 0 === e3 && (e3 = 1), this.start = t3, this.end = e3;
            }, Object.defineProperty(e2.prototype, "force", { get: function() {
              return this.frc;
            }, set: function(t3) {
              this.frc = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "power", { get: function() {
              return this.pow;
            }, set: function(t3) {
              this.pow = t3;
            }, enumerable: false, configurable: true }), e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = 0; i2 < e3; i2++) {
                var o2 = t3[i2], r2 = o2.ratioVector.multiply(this._vector2), s2 = this.frc * Math.pow(r2.magnitude, this.pow), c3 = n2.Matrix4.scaleMatrix(1 + s2 * this._vector.x, 1 + s2 * this._vector.y, 1 + s2 * this._vector.z), u2 = o2.vector;
                n2.Matrix4.multiplyVector(c3, u2), o2.vector = u2;
              }
            }, e2;
          })(s.Modifier);
          e.Taper = c2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Twist = void 0;
          var n2 = i(4), r = i(1), s = i(0), c2 = (function(t2) {
            function e2(e3) {
              void 0 === e3 && (e3 = 0);
              var i2 = t2.call(this) || this;
              return i2._vector = new r.Vector3(0, 1, 0), i2.center = r.Vector3.ZERO, i2._angle = e3, i2;
            }
            return o(e2, t2), Object.defineProperty(e2.prototype, "angle", { get: function() {
              return this._angle;
            }, set: function(t3) {
              this._angle = t3;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "vector", { get: function() {
              return this._vector;
            }, set: function(t3) {
              this._vector = t3;
            }, enumerable: false, configurable: true }), e2.prototype.apply = function() {
              this._vector.normalize();
              for (var t3 = new r.Vector3(this.mod.maxX / 2, this.mod.maxY / 2, this.mod.maxZ / 2), e3 = -r.Vector3.dot(this._vector, this.center), i2 = 0; i2 < this.mod.getVertices().length; i2++) {
                var o2 = this.mod.getVertices()[i2], n3 = r.Vector3.dot(new r.Vector3(o2.x, o2.y, o2.z), this._vector) + e3;
                this.twistPoint(o2, n3 / t3.magnitude * this._angle);
              }
            }, e2.prototype.twistPoint = function(t3, e3) {
              var i2 = n2.Matrix4.translationMatrix(t3.x, t3.y, t3.z);
              i2 = n2.Matrix4.multiply(n2.Matrix4.rotationMatrix(this._vector.x, this._vector.y, this._vector.z, e3), i2), t3.x = i2.n14, t3.y = i2.n24, t3.z = i2.n34;
            }, e2;
          })(s.Modifier);
          e.Twist = c2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.Wheel = void 0;
          var n2 = i(4), r = i(1), s = i(0), c2 = (function(t2) {
            function e2() {
              var e3 = t2.call(this) || this;
              return e3.steerVector = new r.Vector3(0, 1, 0), e3.rollVector = new r.Vector3(0, 0, 1), e3.speed = 0, e3.turn = 0, e3.roll = 0, e3;
            }
            return o(e2, t2), e2.prototype.setModifiable = function(e3) {
              t2.prototype.setModifiable.call(this, e3), this._radius = e3.width / 2;
            }, e2.prototype.apply = function() {
              this.roll += this.speed;
              var t3, e3, i2 = this.mod.getVertices(), o2 = i2.length;
              if (0 != this.turn) {
                e3 = n2.Matrix4.rotationMatrix(this.steerVector.x, this.steerVector.y, this.steerVector.z, this.turn);
                var r2 = this.rollVector.clone();
                n2.Matrix4.multiplyVector(e3, r2), t3 = n2.Matrix4.rotationMatrix(r2.x, r2.y, r2.z, this.roll);
              } else t3 = n2.Matrix4.rotationMatrix(this.rollVector.x, this.rollVector.y, this.rollVector.z, this.roll);
              for (var s2 = 0; s2 < o2; s2++) {
                var c3 = i2[s2], u2 = c3.vector.clone();
                0 != this.turn && n2.Matrix4.multiplyVector(e3, u2), n2.Matrix4.multiplyVector(t3, u2), c3.x = u2.x, c3.y = u2.y, c3.z = u2.z;
              }
            }, Object.defineProperty(e2.prototype, "step", { get: function() {
              return this._radius * this.speed / Math.PI;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "perimeter", { get: function() {
              return 2 * this._radius * Math.PI;
            }, enumerable: false, configurable: true }), Object.defineProperty(e2.prototype, "radius", { get: function() {
              return this._radius;
            }, enumerable: false, configurable: true }), e2;
          })(s.Modifier);
          e.Wheel = c2;
        }, function(t, e, i) {
          "use strict";
          var o = this && this.__extends || /* @__PURE__ */ (function() {
            var t2 = function(e2, i2) {
              return (t2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, e3) {
                t3.__proto__ = e3;
              } || function(t3, e3) {
                for (var i3 in e3) Object.prototype.hasOwnProperty.call(e3, i3) && (t3[i3] = e3[i3]);
              })(e2, i2);
            };
            return function(e2, i2) {
              function o2() {
                this.constructor = e2;
              }
              if ("function" != typeof i2 && null !== i2) throw new TypeError("Class extends value " + String(i2) + " is not a constructor or null");
              t2(e2, i2), e2.prototype = null === i2 ? Object.create(i2) : (o2.prototype = i2.prototype, new o2());
            };
          })();
          Object.defineProperty(e, "__esModule", { value: true }), e.UserDefined = void 0;
          var n2 = i(0), r = i(32), s = (function(t2) {
            function e2() {
              var e3 = t2.call(this) || this;
              return e3.eventEmitter = new r.EventEmitter(), e3;
            }
            return o(e2, t2), e2.prototype.apply = function() {
              for (var t3 = this.mod.getVertices(), e3 = t3.length, i2 = 0; i2 < e3; i2++) {
                var o2 = t3[i2];
                this.renderVector && this.renderVector(o2, i2, e3);
              }
              this.dispatchEvent("CHANGE");
            }, e2.prototype.addEventListener = function(t3, e3) {
              this.eventEmitter.on(t3, e3);
            }, e2.prototype.dispatchEvent = function(t3) {
              return this.eventEmitter.emit(t3);
            }, e2.prototype.hasEventListener = function(t3) {
              return this.eventEmitter.has(t3);
            }, e2.prototype.removeEventListener = function(t3, e3) {
              this.eventEmitter.off(t3, e3);
            }, e2;
          })(n2.Modifier);
          e.UserDefined = s;
        }, function(t, e, i) {
          "use strict";
          Object.defineProperty(e, "__esModule", { value: true }), e.EventEmitter = void 0;
          var o = (function() {
            function t2() {
            }
            return t2.prototype.on = function(t3, e2) {
              return n2 || (n2 = {}), n2[t3] || (n2[t3] = []), n2[t3].push(e2), e2;
            }, t2.prototype.emit = function(t3) {
              for (var e2 = [], i2 = 1; i2 < arguments.length; i2++) e2[i2 - 1] = arguments[i2];
              var o2 = false;
              if (t3 && n2) {
                var r = n2[t3];
                if (!r) return o2;
                r = r.slice();
                var s = r.length, c2 = Array.prototype.slice.call(arguments);
                for (c2.shift(); s--; ) {
                  var u2 = r[s];
                  o2 = o2 || u2.apply(null, c2);
                }
              }
              return !!o2;
            }, t2.prototype.one = function(t3, e2) {
              var i2 = this, o2 = Array.prototype.slice.call(arguments, 2), n3 = function() {
                i2.off(t3, n3), e2.apply(null, o2);
              };
              this.on(t3, n3);
            }, t2.prototype.has = function(t3) {
              return !(!n2 || !n2[t3]);
            }, t2.prototype.off = function(t3, e2) {
              if (n2 && n2[t3]) {
                for (var i2 = n2[t3], o2 = 0, r = i2.length; o2 < r; o2++) if (i2[o2].toString() == e2.toString()) {
                  1 == r ? delete n2[t3] : i2.splice(o2, 1);
                  break;
                }
              }
            }, t2.prototype.offAll = function(t3) {
              t3 ? n2 && delete n2[t3] : n2 = null;
            }, t2;
          })();
          e.EventEmitter = o;
          var n2;
        }]);
      });
    }
  });

  // plugins/flipbook/flipbook-view/src/index.js
  var index_exports = {};
  __export(index_exports, {
    default: () => initializeFlipbook,
    getDisplayedPage: () => getDisplayedPage
  });

  // node_modules/quick_flipbook/dist/flipbook.mjs
  var h = __toESM(require_three(), 1);

  // node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
  var import_three = __toESM(require_three(), 1);
  function mergeGeometries(geometries, useGroups = false) {
    const isIndexed = geometries[0].index !== null;
    const attributesUsed = new Set(Object.keys(geometries[0].attributes));
    const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
    const attributes = {};
    const morphAttributes = {};
    const morphTargetsRelative = geometries[0].morphTargetsRelative;
    const mergedGeometry = new import_three.BufferGeometry();
    let offset = 0;
    for (let i = 0; i < geometries.length; ++i) {
      const geometry = geometries[i];
      let attributesCount = 0;
      if (isIndexed !== (geometry.index !== null)) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
        return null;
      }
      for (const name in geometry.attributes) {
        if (!attributesUsed.has(name)) {
          console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
          return null;
        }
        if (attributes[name] === void 0) attributes[name] = [];
        attributes[name].push(geometry.attributes[name]);
        attributesCount++;
      }
      if (attributesCount !== attributesUsed.size) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes.");
        return null;
      }
      if (morphTargetsRelative !== geometry.morphTargetsRelative) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries.");
        return null;
      }
      for (const name in geometry.morphAttributes) {
        if (!morphAttributesUsed.has(name)) {
          console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries.");
          return null;
        }
        if (morphAttributes[name] === void 0) morphAttributes[name] = [];
        morphAttributes[name].push(geometry.morphAttributes[name]);
      }
      if (useGroups) {
        let count;
        if (isIndexed) {
          count = geometry.index.count;
        } else if (geometry.attributes.position !== void 0) {
          count = geometry.attributes.position.count;
        } else {
          console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute");
          return null;
        }
        mergedGeometry.addGroup(offset, count, i);
        offset += count;
      }
    }
    if (isIndexed) {
      let indexOffset = 0;
      const mergedIndex = [];
      for (let i = 0; i < geometries.length; ++i) {
        const index = geometries[i].index;
        for (let j = 0; j < index.count; ++j) {
          mergedIndex.push(index.getX(j) + indexOffset);
        }
        indexOffset += geometries[i].attributes.position.count;
      }
      mergedGeometry.setIndex(mergedIndex);
    }
    for (const name in attributes) {
      const mergedAttribute = mergeAttributes(attributes[name]);
      if (!mergedAttribute) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " attribute.");
        return null;
      }
      mergedGeometry.setAttribute(name, mergedAttribute);
    }
    for (const name in morphAttributes) {
      const numMorphTargets = morphAttributes[name][0].length;
      if (numMorphTargets === 0) continue;
      mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
      mergedGeometry.morphAttributes[name] = [];
      for (let i = 0; i < numMorphTargets; ++i) {
        const morphAttributesToMerge = [];
        for (let j = 0; j < morphAttributes[name].length; ++j) {
          morphAttributesToMerge.push(morphAttributes[name][j][i]);
        }
        const mergedMorphAttribute = mergeAttributes(morphAttributesToMerge);
        if (!mergedMorphAttribute) {
          console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " morphAttribute.");
          return null;
        }
        mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
      }
    }
    return mergedGeometry;
  }
  function mergeAttributes(attributes) {
    let TypedArray;
    let itemSize;
    let normalized;
    let gpuType = -1;
    let arrayLength = 0;
    for (let i = 0; i < attributes.length; ++i) {
      const attribute = attributes[i];
      if (TypedArray === void 0) TypedArray = attribute.array.constructor;
      if (TypedArray !== attribute.array.constructor) {
        console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.");
        return null;
      }
      if (itemSize === void 0) itemSize = attribute.itemSize;
      if (itemSize !== attribute.itemSize) {
        console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.");
        return null;
      }
      if (normalized === void 0) normalized = attribute.normalized;
      if (normalized !== attribute.normalized) {
        console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.");
        return null;
      }
      if (gpuType === -1) gpuType = attribute.gpuType;
      if (gpuType !== attribute.gpuType) {
        console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.");
        return null;
      }
      arrayLength += attribute.count * itemSize;
    }
    const array = new TypedArray(arrayLength);
    const result = new import_three.BufferAttribute(array, itemSize, normalized);
    let offset = 0;
    for (let i = 0; i < attributes.length; ++i) {
      const attribute = attributes[i];
      if (attribute.isInterleavedBufferAttribute) {
        const tupleOffset = offset / itemSize;
        for (let j = 0, l = attribute.count; j < l; j++) {
          for (let c2 = 0; c2 < itemSize; c2++) {
            const value = attribute.getComponent(j, c2);
            result.setComponent(j + tupleOffset, c2, value);
          }
        }
      } else {
        array.set(attribute.array, offset);
      }
      offset += attribute.count * itemSize;
    }
    if (gpuType !== void 0) {
      result.gpuType = gpuType;
    }
    return result;
  }

  // node_modules/quick_flipbook/dist/flipbook.mjs
  var n = __toESM(require_modifiers_min(), 1);
  var import_three2 = __toESM(require_modifiers_min(), 1);
  var w = class extends import_three2.UserDefined {
    /** 
     * @param elevationAxis Axis to use as elevation dimension
     * @param alongAxis Axis to use as the "plane" (perpendicular to elevation ideally)
     * @param effectRange from 0 to 1, along the "along axis" what portion wil be subjected to this effect. 
     * @param effectMid from 0 to 1, at what point we stop climbing up and start going down again?
     * @param elevationHeight how "high" we elevate the vertices along the elevationAxis?
     */
    constructor(t = import_three2.ModConstant.Y, e = import_three2.ModConstant.X, s = 0.5, i = 0.5, r = 0.5) {
      super(), this.elevationAxis = t, this.alongAxis = e, this.effectRange = s, this.effectMid = i, this.elevationHeight = r, this.intensity = 1, this.renderVector = this._renderVector;
    }
    _renderVector(t, e, s) {
      let i = t.getRatio(this.alongAxis), r = t.getValue(this.elevationAxis);
      if (i <= this.effectRange) {
        i /= this.effectRange;
        let a = 0;
        i < this.effectMid ? (i = i / this.effectMid, a = Math.sqrt(1 - Math.pow(i, 2) + i * 2 - 1)) : (i = (i - this.effectMid) / (1 - this.effectMid), a = (Math.cos(i * Math.PI) - -1) / 2), t.setValue(this.elevationAxis, r + a * this.elevationHeight * this.intensity);
      }
    }
  };
  var d = (o) => {
    for (var t = o.attributes.uv, e = 0; e < t.count; e++) {
      var s = t.getX(e), i = t.getY(e);
      t.setXY(e, 1 - s, i);
    }
    return o;
  };
  var g = new h.MeshStandardMaterial({ color: "#ffffff" });
  var v = class extends h.Mesh {
    constructor(t = 10) {
      super();
      let e = new h.Mesh(
        mergeGeometries(
          [
            d(new h.PlaneGeometry(1, 1, t, t)),
            d(new h.PlaneGeometry(1, 1, t, t).rotateY(Math.PI))
          ],
          true
          // allow groups
        ),
        [
          g,
          g
        ]
      );
      e.castShadow = true, e.receiveShadow = true, e.rotateX(Math.PI / 2), e.position.x = 0.5, this.scale.z = -1, this.add(e), this.page = e, this.modifiers = new n.ModifierStack(e), this.bend = new n.Bend(0, 0, 0), this.bend.constraint = n.ModConstant.LEFT, this.twist = new n.Twist(0), this.twist.vector = new n.Vector3(2, 0, 0), this.twist.center = new n.Vector3(-0.5, 0, 0), this.pageCurve = new w(
        n.ModConstant.Z,
        n.ModConstant.X,
        0.812,
        0.325,
        0.054
      ), this.modifiers.addModifier(this.pageCurve), this.modifiers.addModifier(this.bend), this.modifiers.addModifier(this.twist);
    }
    /**
     * Sets the material for a page's face.
     * @param newMaterial New material for this page's face.
     * @param index 0 or 1
     */
    setPageMaterial(t, e) {
      this.page.material[e] = t;
    }
    /**
     * Sets the internal progress of the flip of this page. 0 = no flip. 1 = fully flipped to the otehr side.
     * @param progress a number from 0 to 1
     * @param direction either -1 or 1 to know to which side we are flipping (this is used to invert the bending of the page to the correct side on flip)
     * @param pageCurveIntensity Intensity of the page curve modifier effect
     */
    flip(t, e, s = 1) {
      this.rotation.z = Math.PI * t, this.bend.force = Math.min(-Math.sin(this.rotation.z) / 2, -1e-4) * e, this.twist.angle = Math.sin(this.rotation.z) / 10, this.pageCurve.intensity = (-1 + 2 * t) * (-Math.sin(this.rotation.z) + 1) * s, this.modifiers.apply();
    }
    /**
     * call dispose on the material of this face.
     */
    disposeMaterial(t) {
      const e = this.page.material[t];
      e !== g && e.dispose();
    }
    /**
     * Just sets all materials to "no texture"
     */
    reset() {
      this.setPageMaterial(g, 0), this.setPageMaterial(g, 1);
    }
    dispose(t = false) {
      t && (this.disposeMaterial(0), this.disposeMaterial(1)), this.page.geometry.dispose(), this.modifiers.destroy();
    }
  };
  var u = /* @__PURE__ */ (function() {
    var o;
    return () => {
      if (!o) {
        const t = document.createElement("canvas");
        t.width = 256, t.height = 256;
        const e = t.getContext("2d"), s = e.createLinearGradient(0, 0, t.width, 0);
        s.addColorStop(0, "black"), s.addColorStop(0.1, "white"), e.fillStyle = s, e.fillRect(0, 0, t.width, t.height), o = new h.CanvasTexture(t), t.remove();
      }
      return o;
    };
  })();
  var y = class extends h.Mesh {
    constructor(t) {
      super(), this.pages = [], this.pool = [], this._url2Loader = /* @__PURE__ */ new Map(), this._currentProgress = 0, this._flipDuration = (t == null ? void 0 : t.flipDuration) || 1, this._ySpacing = (t == null ? void 0 : t.yBetweenPages) || 1e-3, this._pageSubdivisions = (t == null ? void 0 : t.pageSubdivisions) || 20, this.currentPage = 0;
    }
    [Symbol.iterator]() {
      let t = 0;
      return {
        next: () => t < this.pages.length ? { value: this.pages[t++], done: false } : { value: null, done: true }
      };
    }
    /** 
     * Initialize the book. Pass in the URLs to the images to use for each page.
     * The order in which they will be loaded is one page (2 images per page) at a time.
     * After one page is loaded, the next will start loading. While one page is loading the rest are in perpetual inactive state (nothing loading) 
      
     * @param pagesSources Array with the "source" to use as the page texture, either a material or a url to load an image from.
     */
    setPages(t) {
      for (t.length % 2 !== 0 && t.push(""); this.pages.length; ) {
        let s = this.pages.pop();
        s.reset(), this.pool.push(s), this.remove(s);
      }
      let e = Promise.resolve();
      for (let s = 0; s < t.length; s += 2) {
        const i = t[s], r = t[s + 1];
        let a = this.pool.pop();
        a || (a = new v(this._pageSubdivisions)), this.add(a), a.position.y = -this._ySpacing * this.pages.length, this.pages.push(a), a.name = `Page#${this.pages.length}`, e = e.then(this.loadPages(i, r, a));
      }
      this.currentPage > this.pages.length * 2 - 1 && (this._currentPage = this.pages.length * 2 - 1, this._currentProgress = this.pages.length), this.flipPages();
    }
    /**
     * Returns the total number of pages.
     * **Do not confuse with the number of sheets of paper**
     */
    get totalPages() {
      return this.pages.length * 2;
    }
    /**
     * Loads the 2 faces of a page at the same time...
     */
    loadPages(t, e, s) {
      return () => Promise.all([
        this.loadPage(t, 1, s),
        this.loadPage(e, 0, s)
      ]);
    }
    /**
     * Loads a page's face. If it is a Material it just puts that, if it is a string it will try to load it using the TextureLoader
     */
    loadPage(t, e, s) {
      if (!t || t === "") {
        const r = new h.MeshStandardMaterial({
          color: "white",
          roughness: 0.2,
          aoMapIntensity: 0.7,
          aoMap: e == 1 ? u() : null
        });
        return s.setPageMaterial(r, e), Promise.resolve();
      }
      if (t instanceof h.Material)
        return s.setPageMaterial(t, e), Promise.resolve();
      if (t instanceof h.Texture)
        return s.setPageMaterial(this.textureToMaterial(t, e), e), Promise.resolve();
      const i = t;
      return this._url2Loader.has(i) || this._url2Loader.set(i, new Promise((r, a) => {
        new h.TextureLoader().load(
          t,
          (l) => {
            r(this.textureToMaterial(l, e));
          },
          void 0,
          (l) => {
            r(null);
          }
        );
      })), this._url2Loader.get(i).then((r) => {
        s.setPageMaterial(r, e);
      });
    }
    textureToMaterial(t, e) {
      return t.magFilter = h.LinearFilter, t.minFilter = h.LinearFilter, t.generateMipmaps = false, t.colorSpace = h.SRGBColorSpace, new h.MeshStandardMaterial({
        color: "white",
        map: t,
        roughness: 0.2,
        aoMapIntensity: 0.7,
        aoMap: e == 1 ? u() : null,
        toneMapped: false
      });
    }
    /**
     * The current "page" (as you would read on a book, the page number...)
     */
    get currentPage() {
      return this._currentPage;
    }
    set currentPage(t) {
      let e = Math.ceil(t / 2), s = e - this._currentProgress;
      this._stepSize = s / this._flipDuration, this._flipDirection = this._stepSize > 0 ? 1 : -1, this._currentPage = Math.ceil(t), this._goalProgress = e, this.flipPages();
    }
    /**
     * Each page has a progress that goes form 0 to 1. 
     * Here, the progress of a book goes form 0 to `Total Pages` (but in this case, by "page" we mean paper, a paper has 2 pages, the fornt and back page...)
     * and the decimal portion is the progress of the flip of that page. 
     * If you have 3 pages, for example, to send the user to the last page's back side, you have to call .progress = 3 (which is almost equivalent to 2.9999... )
     * 
     * expects a number from `0` to `book.totalPages/2`
     */
    get progress() {
      return this._currentProgress;
    }
    set progress(t) {
      let e = this._currentProgress;
      this._currentProgress = Math.max(0, Math.min(t, this.pages.length)), this._currentPage = Math.floor(this._currentProgress * 2), this._stepSize = 0, this._flipDirection = this._currentProgress > e ? 1 : -1, this.flipPages();
    }
    /**
     * Call this to animate this book every frame.
     * @param delta seconds since last frame render
     */
    animate(t) {
      this._stepSize != 0 && (this._currentProgress += this._stepSize * t, (this._stepSize > 0 && this._currentProgress > this._goalProgress || this._stepSize < 0 && this._currentProgress < this._goalProgress) && (this._currentProgress = this._goalProgress, this._stepSize = 0), this.flipPages());
    }
    /**
     * It will flip all the pages until this page is facing at the user.
     * @param page Page of interest
     */
    flipPage(t) {
      var e = this.pages.indexOf(t);
      if (e < 0)
        throw new ReferenceError("I don't own that page! Not mine!");
      const s = e * 2, i = s + 1;
      this.currentPage = this._currentPage <= s ? i : s;
    }
    /**
     * Send the book to the next page
     */
    nextPage() {
      this.currentPage = Math.min(Math.ceil(this.currentPage / 2) + 1, this.pages.length) * 2;
    }
    /**
     * Send the book to the previous page
     */
    previousPage() {
      this.currentPage = Math.max(Math.ceil(this.currentPage / 2) - 1, 0) * 2;
    }
    /**
     * Goes one by one and calculate the progress of each FlipPage based on the progress of the book.
     */
    flipPages() {
      const t = this.pages.length;
      let e = this._currentProgress % 1, s = Math.floor(this._currentProgress);
      for (let r = 0; r < t; r++) {
        const a = this.pages[r], l = s < r ? 0 : s > r ? 1 : e, P = l < 0.5 ? 0 : (l - 0.5) / 0.5, f = -this._ySpacing * (t - r), p = -this._ySpacing * r, M = this._currentProgress < 1 ? e : this._currentProgress >= t ? 0 : this._currentProgress >= t - 1 ? 1 - e : 1;
        a.flip(l, this._flipDirection, M), a.position.y = p + P * (f - p);
      }
      const i = s == 0 ? -0.5 + 0.5 * e : s == t - 1 ? 0.5 * e : s == t ? 0.5 : 0;
      this.position.x = i * this.scale.x;
    }
    /**
     * Will dispose the book, the pages and all the materials used. Also the internal cache.
     */
    dispose() {
      for (; this.pages.length; ) {
        let t = this.pages.pop();
        this.remove(t);
      }
      for (; this.pool.length; )
        this.pool.pop().dispose(true);
      this._url2Loader.forEach((t) => t.then((e) => e.dispose())), this._url2Loader.clear();
    }
  };

  // plugins/flipbook/flipbook-view/src/index.js
  var THREE3 = __toESM(require_three(), 1);

  // plugins/flipbook/flipbook-view/src/scene.js
  var THREE = __toESM(require_three(), 1);
  var A5_PAGE_RATIO = 148 / 210;
  var BOOK_LIFT = 0.1;
  var DEFAULT_FOV = 20;
  var DEFAULT_ZOOM = 1.25;
  var BOOK_OPEN_WIDTH = A5_PAGE_RATIO * 2;
  var BOOK_PAGE_HEIGHT = 1;
  var WIDTH_FILL = 0.82;
  var HEIGHT_FILL = 0.76 / 1.2;
  function heightForWidth(width) {
    const w2 = Math.max(1, Number(width) || 1);
    return Math.max(
      1,
      Math.round(w2 * BOOK_PAGE_HEIGHT * WIDTH_FILL / (BOOK_OPEN_WIDTH * HEIGHT_FILL))
    );
  }
  function clampNumber(value, min, max, fallback) {
    const n2 = Number(value);
    if (!Number.isFinite(n2)) return fallback;
    return Math.min(max, Math.max(min, n2));
  }
  function createShadowFloor() {
    const material = new THREE.ShadowMaterial({
      color: 0,
      opacity: 0.28,
      transparent: true,
      depthWrite: false
    });
    if ("toneMapped" in material) material.toneMapped = false;
    const geometry = new THREE.PlaneGeometry(6, 6);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0;
    mesh.receiveShadow = true;
    mesh.renderOrder = -1;
    mesh.raycast = () => {
    };
    return {
      mesh,
      dispose() {
        geometry.dispose();
        material.dispose();
      }
    };
  }
  function createScene(host) {
    const container = document.createElement("div");
    container.style.cssText = "position:relative;width:100%;height:100%;overflow:visible;box-sizing:border-box;background:transparent;isolation:isolate;";
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;background:transparent;position:relative;z-index:0;";
    container.appendChild(canvas);
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, 1, 0.2, 24);
    const timer = new THREE.Timer();
    timer.connect(document);
    const ambient = new THREE.AmbientLight(16777215, 2.05);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(16777215, 0.4);
    key.position.set(0, 8, -0.9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -5e-4;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 5;
    key.shadow.camera.near = 0.4;
    key.shadow.camera.far = 10;
    key.shadow.camera.left = -2.8;
    key.shadow.camera.right = 2.8;
    key.shadow.camera.top = 2.8;
    key.shadow.camera.bottom = -2.8;
    key.shadow.camera.up.set(0, 0, -1);
    key.target.position.set(0, BOOK_LIFT, 0);
    scene.add(key);
    scene.add(key.target);
    const fill = new THREE.HemisphereLight(16777215, 15262940, 0.55);
    scene.add(fill);
    const shadowFloor = createShadowFloor();
    scene.add(shadowFloor.mesh);
    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        powerPreference: "high-performance"
      });
      renderer.setClearColor(0, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      if ("outputColorSpace" in renderer) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
    } catch (err) {
      renderer = null;
      const errorBox = document.createElement("div");
      errorBox.textContent = "WebGL is not available.";
      errorBox.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7f1d1d;font:13px/1.4 system-ui,sans-serif;padding:16px;text-align:center;";
      container.appendChild(errorBox);
      console.warn("Flipbook: WebGL init failed", err);
    }
    if (host) host.appendChild(container);
    let rafId = 0;
    let tickFn = null;
    function getSize() {
      const w2 = Math.max(1, container.clientWidth || host?.clientWidth || 320);
      const h2 = Math.max(1, container.clientHeight || host?.clientHeight || 240);
      return { w: w2, h: h2 };
    }
    let cameraFov = DEFAULT_FOV;
    let cameraZoom = DEFAULT_ZOOM;
    function setCameraRig(opts = {}) {
      if (opts.fov !== void 0) {
        cameraFov = clampNumber(opts.fov, 8, 80, cameraFov);
      }
      if (opts.zoom !== void 0) {
        cameraZoom = clampNumber(opts.zoom, 0.3, 3, cameraZoom);
      }
      fitCamera();
    }
    function fitCamera() {
      const { w: w2, h: h2 } = getSize();
      const aspect = w2 / h2;
      camera.aspect = aspect;
      camera.fov = cameraFov;
      const vFov = camera.fov * Math.PI / 180;
      const dist = BOOK_OPEN_WIDTH / WIDTH_FILL / 2 / Math.max(aspect, 0.05) / Math.tan(vFov / 2);
      camera.position.set(0, dist, 0);
      camera.up.set(0, 0, -1);
      camera.lookAt(0, BOOK_LIFT, 0);
      camera.near = 0.02;
      camera.far = Math.max(40, dist * 14);
      camera.updateProjectionMatrix();
      key.position.set(0, dist + 1.4, -0.9);
      key.target.position.set(0, BOOK_LIFT, 0);
      key.target.updateMatrixWorld();
      key.shadow.camera.up.set(0, 0, -1);
      key.shadow.camera.near = 0.2;
      key.shadow.camera.far = dist + 6;
      key.shadow.camera.updateProjectionMatrix();
    }
    function resize() {
      if (!renderer) return;
      const { w: w2, h: h2 } = getSize();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w2, h2, false);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    }
    function loop(timestamp) {
      rafId = requestAnimationFrame(loop);
      if (!renderer) return;
      if (!canvas.isConnected) return;
      timer.update(timestamp);
      const delta = timer.getDelta();
      if (typeof tickFn === "function") tickFn(delta);
      renderer.render(scene, camera);
    }
    function startLoop(tick) {
      tickFn = tick;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }
    function stopLoop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      tickFn = null;
    }
    function dispose() {
      stopLoop();
      timer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry && typeof obj.geometry.dispose === "function") obj.geometry.dispose();
      });
      shadowFloor.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (container.parentNode) container.parentNode.removeChild(container);
    }
    resize();
    fitCamera();
    return {
      container,
      canvas,
      renderer,
      scene,
      camera,
      timer,
      fitCamera,
      setCameraRig,
      resize,
      startLoop,
      stopLoop,
      dispose
    };
  }

  // plugins/flipbook/flipbook-view/src/interaction.js
  var THREE2 = __toESM(require_three(), 1);
  function findFlipPage(book, object) {
    let node = object;
    while (node) {
      if (node.parent === book) return node;
      node = node.parent;
    }
    return null;
  }
  function attachClickToFlip(instance, canvas, camera) {
    const raycaster = new THREE2.Raycaster();
    const pointer = new THREE2.Vector2();
    function pointerFromEvent(event) {
      const book = instance.data.book;
      const rect = canvas.getBoundingClientRect();
      if (!book || !rect.width || !rect.height) return null;
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(book, true);
      if (!hits.length) return null;
      return findFlipPage(book, hits[0].object);
    }
    function onPointerMove(event) {
      const page = pointerFromEvent(event);
      canvas.style.cursor = page ? "pointer" : "default";
    }
    function onPointerLeave() {
      canvas.style.cursor = "default";
    }
    function onPointerUp(event) {
      const book = instance.data.book;
      if (!book || typeof book.flipPage !== "function") return;
      const page = pointerFromEvent(event);
      if (!page) return;
      try {
        book.flipPage(page);
      } catch (err) {
        console.warn("Flipbook: flipPage failed", err);
      }
    }
    canvas.style.cursor = "default";
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerup", onPointerUp);
    instance.data._clickHandler = onPointerUp;
    instance.data._moveHandler = onPointerMove;
    instance.data._leaveHandler = onPointerLeave;
  }

  // plugins/flipbook/flipbook-view/src/loader.js
  var STYLE_ID = "flipbook-loader-styles";
  var HIDE_MS = 240;
  function injectStyles() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    .flipbook-loader {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      background: transparent;
      transform: translateZ(0);
      opacity: 0;
      pointer-events: none;
      transition: opacity ${HIDE_MS}ms ease;
    }
    .flipbook-loader.is-visible {
      opacity: 1;
      pointer-events: auto;
      cursor: wait;
    }
    .flipbook-loader-book {
      width: 108px;
      height: 78px;
      perspective: 560px;
    }
    .flipbook-loader-spread {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transform: rotateX(16deg);
    }
    .flipbook-loader-leaf {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(180deg, #fffdf8 0%, #f2e6d0 100%);
      border: 1px solid rgba(74, 52, 32, 0.28);
      box-shadow: 0 12px 22px rgba(42, 28, 14, 0.18);
    }
    .flipbook-loader-leaf.is-left {
      left: 0;
      border-radius: 2px 0 0 2px;
      box-shadow: inset -6px 0 10px rgba(90, 68, 44, 0.08);
    }
    .flipbook-loader-leaf.is-right {
      right: 0;
      border-radius: 0 2px 2px 0;
    }
    .flipbook-loader-flip {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      transform-origin: left center;
      transform-style: preserve-3d;
      animation: flipbook-loader-flip 1.2s cubic-bezier(0.42, 0.02, 0.52, 0.98) infinite;
    }
    .flipbook-loader-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border: 1px solid rgba(74, 52, 32, 0.28);
      border-radius: 0 2px 2px 0;
    }
    .flipbook-loader-face.is-front {
      background:
        linear-gradient(90deg, rgba(90, 68, 44, 0.08), transparent 10%),
        linear-gradient(180deg, #fffdf8 0%, #f3e8d6 100%);
    }
    .flipbook-loader-face.is-back {
      transform: rotateY(180deg);
      background:
        linear-gradient(270deg, rgba(90, 68, 44, 0.08), transparent 10%),
        linear-gradient(180deg, #f6ecdc 0%, #e7d7c0 100%);
    }
    .flipbook-loader-label {
      font-family: 'Iowan Old Style', Palatino, 'Palatino Linotype', 'Times New Roman', serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #4a3728;
    }
    @keyframes flipbook-loader-flip {
      0% { transform: rotateY(0deg); }
      42% { transform: rotateY(-180deg); }
      58% { transform: rotateY(-180deg); }
      100% { transform: rotateY(0deg); }
    }
  `;
    document.head.appendChild(style);
  }
  function createLoader(container) {
    injectStyles();
    const overlay = document.createElement("div");
    overlay.className = "flipbook-loader";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = '<div class="flipbook-loader-book" aria-hidden="true"><div class="flipbook-loader-spread"><div class="flipbook-loader-leaf is-left"></div><div class="flipbook-loader-leaf is-right"></div><div class="flipbook-loader-flip"><div class="flipbook-loader-face is-front"></div><div class="flipbook-loader-face is-back"></div></div></div></div><div class="flipbook-loader-label">Chargement des pages\u2026</div>';
    container.appendChild(overlay);
    function show() {
      overlay.setAttribute("aria-hidden", "false");
      overlay.setAttribute("aria-busy", "true");
      void overlay.offsetHeight;
      overlay.classList.add("is-visible");
    }
    function hide() {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-busy", "false");
      overlay.setAttribute("aria-hidden", "true");
    }
    function dispose() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    return { show, hide, dispose };
  }

  // plugins/flipbook/flipbook-view/src/bubble-list.js
  function isBubbleNotReady(err) {
    return err && typeof err === "object" && /** @type {{ message?: string }} */
    err.message === "not ready";
  }
  function isBubbleList(value) {
    if (!value || typeof value !== "object" || typeof value.get !== "function") return false;
    if (typeof value.listProperties === "function") return false;
    if (value.list_api === false || value.single_api === true) return false;
    return true;
  }
  function resolveBubbleListLength(list) {
    if (!list || typeof list !== "object") return 0;
    const raw = (
      /** @type {{ length?: unknown }} */
      list.length
    );
    if (typeof raw === "number") return Math.max(0, raw);
    if (typeof raw === "function") {
      try {
        const value = raw.call(list);
        if (typeof value === "number") return Math.max(0, value);
      } catch (err) {
        if (isBubbleNotReady(err)) throw err;
      }
    }
    return 0;
  }
  function toArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }
  function materializeBubbleList(list) {
    if (!isBubbleList(list)) return null;
    const len = resolveBubbleListLength(list);
    if (len > 0) {
      let from = 0;
      const entries = [];
      while (from < len) {
        const count = Math.min(100, len - from);
        const batch = list.get(from, count);
        const chunk = toArray(batch);
        if (chunk.length === 0) break;
        entries.push(...chunk);
        from += chunk.length;
        if (chunk.length < count) break;
      }
      return entries;
    }
    for (const count of [100, 99]) {
      try {
        const batch = list.get(0, count);
        const chunk = toArray(batch);
        if (chunk.length > 0) return chunk;
      } catch (err) {
        if (isBubbleNotReady(err)) throw err;
      }
    }
    return [];
  }

  // plugins/flipbook/flipbook-view/src/image-fetch.js
  var globalLoadableCache = /* @__PURE__ */ new Map();
  async function fetchImageAsBlobUrl(url) {
    const response = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Image fetch HTTP ${response.status}`);
    }
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error("Image fetch: empty blob");
    }
    return URL.createObjectURL(blob);
  }
  async function resolveImageUriForEngine(instance, imageUrl) {
    const url = String(imageUrl || "").trim();
    if (!url) return url;
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    const cacheKey = url;
    const instanceCache = instance?.data?.bubbleImageDataUriCache;
    if (instanceCache instanceof Map && instanceCache.has(cacheKey)) {
      return instanceCache.get(cacheKey);
    }
    if (globalLoadableCache.has(cacheKey)) {
      return globalLoadableCache.get(cacheKey);
    }
    let loadableUri = url;
    try {
      loadableUri = await fetchImageAsBlobUrl(url);
    } catch (directErr) {
      console.warn("Flipbook: fetch CORS \xE9chou\xE9, URL brute", url, directErr);
      loadableUri = url;
    }
    if (instance?.data) {
      if (!(instance.data.bubbleImageDataUriCache instanceof Map)) {
        instance.data.bubbleImageDataUriCache = /* @__PURE__ */ new Map();
      }
      instance.data.bubbleImageDataUriCache.set(cacheKey, loadableUri);
    }
    globalLoadableCache.set(cacheKey, loadableUri);
    return loadableUri;
  }

  // plugins/flipbook/flipbook-view/src/pages.js
  var MAX_FACES = 40;
  var MAX_TEXTURE_SIZE = 1024;
  var BLANK_BOOK_PAGES = ["", "", "", ""];
  var IMAGE_FIELD_CANDIDATES = [
    "saved_to_s3",
    "saved_to_aws",
    "image",
    "Image",
    "file",
    "photo",
    "picture",
    "image_url",
    "url",
    "upload",
    "fichier",
    "value"
  ];
  function normalizeUrlString(value) {
    if (value == null) return "";
    let trimmed = String(value).trim();
    if (!trimmed || trimmed === "[object Object]") return "";
    if (/^\/\//.test(trimmed)) trimmed = `https:${trimmed}`;
    if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith("data:") && !trimmed.startsWith("blob:")) {
      if (/^[\w.-]+\.[\w.-]+/.test(trimmed)) trimmed = `https://${trimmed}`;
    }
    return trimmed;
  }
  function bubbleThingToImageUrl(thing) {
    if (!thing || typeof thing !== "object" || typeof thing.get !== "function") return "";
    if (typeof thing.listProperties !== "function") return "";
    for (const name of IMAGE_FIELD_CANDIDATES) {
      try {
        const val = thing.get(name);
        const url = entryToImageUrl(val);
        if (url) return url;
      } catch (err) {
        if (isBubbleNotReady(err)) throw err;
      }
    }
    let props = null;
    try {
      props = thing.listProperties();
    } catch (err) {
      if (isBubbleNotReady(err)) throw err;
    }
    if (Array.isArray(props)) {
      for (const prop of props) {
        if (typeof prop !== "string") continue;
        try {
          const val = thing.get(prop);
          const url = entryToImageUrl(val);
          if (url) return url;
        } catch (err) {
          if (isBubbleNotReady(err)) throw err;
        }
      }
    }
    return "";
  }
  function entryToImageUrl(entry) {
    if (entry == null) return "";
    if (typeof entry === "string") {
      return normalizeUrlString(entry);
    }
    if (typeof entry !== "object") {
      return normalizeUrlString(entry);
    }
    if (typeof entry.listProperties === "function") {
      const fromThing = bubbleThingToImageUrl(entry);
      if (fromThing) return fromThing;
    }
    if (typeof entry.get === "function") {
      for (const name of IMAGE_FIELD_CANDIDATES) {
        try {
          const val = entry.get(name);
          const url = entryToImageUrl(val);
          if (url) return url;
        } catch (err) {
          if (isBubbleNotReady(err)) throw err;
        }
      }
    }
    const obj = (
      /** @type {Record<string, unknown>} */
      entry
    );
    for (const key of IMAGE_FIELD_CANDIDATES) {
      if (typeof obj[key] === "string" && obj[key].trim()) {
        return normalizeUrlString(obj[key]);
      }
    }
    return "";
  }
  function parsePageImages(raw) {
    if (raw == null || raw === "") return [];
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return [];
      if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
        const url = entryToImageUrl(trimmed);
        return url ? [url] : [];
      }
      try {
        return parsePageImages(JSON.parse(trimmed));
      } catch {
        return [];
      }
    }
    const listEntries = materializeBubbleList(raw);
    if (listEntries != null) {
      return listEntries.map(entryToImageUrl).filter(Boolean);
    }
    if (Array.isArray(raw)) {
      return raw.map(entryToImageUrl).filter(Boolean);
    }
    if (typeof raw === "object") {
      const obj = (
        /** @type {Record<string, unknown>} */
        raw
      );
      if (Array.isArray(obj.pages)) {
        return obj.pages.map(entryToImageUrl).filter(Boolean);
      }
      if (Array.isArray(obj.images)) {
        return obj.images.map(entryToImageUrl).filter(Boolean);
      }
      const single = entryToImageUrl(raw);
      if (single) return [single];
    }
    return [];
  }
  function padAndCapPages(urls) {
    const sliced = (Array.isArray(urls) ? urls : []).slice(0, MAX_FACES);
    if (sliced.length === 0) return BLANK_BOOK_PAGES.slice();
    if (sliced.length % 2 !== 0) sliced.push("");
    return sliced;
  }
  function hashPageUrls(urls) {
    return (urls || []).join("\0");
  }
  function loadHtmlImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = url;
    });
  }
  function paintPageOnWhite(image) {
    const srcW = image.naturalWidth || image.width;
    const srcH = image.naturalHeight || image.height;
    if (!srcW || !srcH) return null;
    const longest = Math.max(srcW, srcH);
    const scale = longest > MAX_TEXTURE_SIZE ? MAX_TEXTURE_SIZE / longest : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(srcW * scale));
    canvas.height = Math.max(1, Math.round(srcH * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  async function preparePageSource(instance, url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    const loadable = await resolveImageUriForEngine(instance, raw);
    if (!loadable) return "";
    try {
      const image = await loadHtmlImage(loadable);
      const canvas = paintPageOnWhite(image);
      if (!canvas) return loadable;
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((out) => {
          if (out) resolve(out);
          else reject(new Error("toBlob failed"));
        }, "image/jpeg", 0.92);
      });
      return URL.createObjectURL(blob);
    } catch {
      return loadable;
    }
  }
  async function materializePageSources(instance, rawImages) {
    const parsed = padAndCapPages(parsePageImages(rawImages));
    const hash = hashPageUrls(parsed);
    const urls = await Promise.all(parsed.map((url) => preparePageSource(instance, url)));
    return { urls, hash };
  }

  // plugins/flipbook/flipbook-view/src/index.js
  var FLIP_DURATION = 0.5;
  function getDisplayedPage(book) {
    if (!book || typeof book.totalPages !== "number") return 0;
    const total = book.totalPages;
    if (total <= 0) return 0;
    const sheets = total / 2;
    const progress = book.progress;
    if (progress <= 0.02) return 1;
    if (progress >= sheets - 0.02) return total;
    return Math.floor(progress) * 2 + 1;
  }
  function goToUserPage(book, page1Indexed) {
    const total = book.totalPages || 0;
    if (total <= 0) return;
    const page = Math.max(1, Math.min(total, Math.round(Number(page1Indexed) || 1)));
    const sheetProgress = Math.ceil((page - 1) / 2);
    book.progress = sheetProgress;
  }
  function waitForBookMaps(book, urls, timeoutMs = 8e3) {
    const needed = (urls || []).filter((url) => url && String(url).trim()).length;
    if (!book || needed === 0) return Promise.resolve();
    return new Promise((resolve) => {
      const started = performance.now();
      const tick = () => {
        let ready = 0;
        for (const sheet of book) {
          if (!sheet || !sheet.page) continue;
          const mats = Array.isArray(sheet.page.material) ? sheet.page.material : [sheet.page.material];
          for (const mat of mats) {
            if (mat && mat.map && mat.map.image) ready += 1;
          }
        }
        if (ready >= needed || performance.now() - started > timeoutMs) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      tick();
    });
  }
  function initializeFlipbook(instance, context) {
    const host = instance.canvas && instance.canvas[0] ? instance.canvas[0] : instance.canvas;
    const sceneApi = createScene(host);
    instance.data.bubbleContext = context || null;
    instance.data.sceneApi = sceneApi;
    instance.data.book = null;
    instance.data.lastPagesHash = null;
    instance.data.pagesGeneration = 0;
    instance.data.publishedPage = null;
    instance.data._lastProgress = 0;
    instance.data._wasProgressing = false;
    instance.data.bubbleImageDataUriCache = /* @__PURE__ */ new Map();
    const loader = createLoader(sceneApi.container);
    instance.data.loader = loader;
    loader.show();
    sceneApi.canvas.style.cursor = "default";
    attachClickToFlip(instance, sceneApi.canvas, sceneApi.camera);
    function getHostEl() {
      return instance.canvas && instance.canvas[0] ? instance.canvas[0] : instance.canvas;
    }
    function syncElementHeight() {
      const hostEl = getHostEl();
      if (!hostEl || typeof hostEl.clientWidth !== "number") return;
      const width = Math.max(1, hostEl.clientWidth || 320);
      const height = heightForWidth(width);
      const widthChanged = instance.data._layoutWidth !== width;
      const heightChanged = instance.data._layoutHeight !== height;
      if (!widthChanged && !heightChanged) return;
      instance.data._layoutWidth = width;
      instance.data._layoutHeight = height;
      if (instance.canvas && typeof instance.canvas.css === "function") {
        instance.canvas.css({
          height: `${height}px`,
          overflow: "visible"
        });
      } else {
        hostEl.style.height = `${height}px`;
      }
      if (typeof instance.setHeight === "function") {
        instance.setHeight(height);
      }
      sceneApi.resize();
      sceneApi.fitCamera();
    }
    instance.data._layoutWidth = 0;
    instance.data._layoutHeight = 0;
    syncElementHeight();
    const roTarget = getHostEl() || sceneApi.container;
    const resizeObserver = new ResizeObserver(() => {
      syncElementHeight();
    });
    resizeObserver.observe(roTarget);
    instance.data.resizeObserver = resizeObserver;
    function publishPages() {
      const book = instance.data.book;
      const total = book && typeof book.totalPages === "number" ? book.totalPages : 0;
      instance.publishState("total_pages", total);
      const page = getDisplayedPage(book);
      instance.data.publishedPage = page;
      instance.publishState("current_page", page);
    }
    function recreateBook() {
      const prev = instance.data.book;
      let keepProgress = 0;
      if (prev) {
        keepProgress = prev.progress || 0;
        sceneApi.scene.remove(prev);
        if (typeof prev.dispose === "function") prev.dispose();
      }
      const book = new y({
        flipDuration: FLIP_DURATION,
        yBetweenPages: 4e-3,
        pageSubdivisions: 20
      });
      book.scale.x = A5_PAGE_RATIO;
      book.position.y = BOOK_LIFT;
      sceneApi.scene.add(book);
      instance.data.book = book;
      if (keepProgress > 0) book.progress = keepProgress;
      return book;
    }
    function softenPageMaterials(book) {
      const aniso = sceneApi.renderer ? Math.min(8, sceneApi.renderer.capabilities.getMaxAnisotropy()) : 1;
      for (const page of book) {
        if (!page || !page.page) continue;
        page.page.castShadow = true;
        page.page.receiveShadow = false;
        const mats = Array.isArray(page.page.material) ? page.page.material : [page.page.material];
        for (const mat of mats) {
          if (!mat) continue;
          if (mat.map) {
            mat.map.generateMipmaps = true;
            mat.map.minFilter = THREE3.LinearMipmapLinearFilter;
            mat.map.magFilter = THREE3.LinearFilter;
            mat.map.anisotropy = aniso;
            mat.map.needsUpdate = true;
          }
          if (typeof mat.aoMapIntensity === "number") {
            mat.aoMapIntensity = 0.08;
          }
          if (typeof mat.roughness === "number") mat.roughness = 0.92;
          if (typeof mat.metalness === "number") mat.metalness = 0;
          if ("envMapIntensity" in mat) mat.envMapIntensity = 0;
        }
      }
    }
    function applyPages(urls) {
      const book = instance.data.book;
      if (!book || typeof book.setPages !== "function") return;
      book.setPages(urls);
      publishPages();
      softenPageMaterials(book);
      setTimeout(() => softenPageMaterials(book), 250);
      setTimeout(() => softenPageMaterials(book), 900);
    }
    instance.data.nextPage = function nextPage() {
      const book = instance.data.book;
      if (book && typeof book.nextPage === "function") book.nextPage();
    };
    instance.data.previousPage = function previousPage() {
      const book = instance.data.book;
      if (book && typeof book.previousPage === "function") book.previousPage();
    };
    instance.data.goToPage = function goToPage(page) {
      const book = instance.data.book;
      if (!book) return;
      goToUserPage(book, page);
    };
    function loadPages(rawImages) {
      const parsed = padAndCapPages(parsePageImages(rawImages));
      const hash = hashPageUrls(parsed);
      if (hash === instance.data.lastPagesHash && instance.data.book) return;
      instance.data.pagesGeneration += 1;
      const gen = instance.data.pagesGeneration;
      const hasImages = parsed.some((url) => Boolean(url));
      if (hasImages) loader.show();
      else loader.hide();
      materializePageSources(instance, rawImages).then(async (result) => {
        if (gen !== instance.data.pagesGeneration) return;
        if (!instance.data.book) recreateBook();
        instance.data.lastPagesHash = result.hash;
        applyPages(result.urls);
        await waitForBookMaps(instance.data.book, result.urls);
        if (gen !== instance.data.pagesGeneration) return;
        loader.hide();
      }).catch((err) => {
        console.warn("Flipbook: chargement des pages", err);
        if (gen === instance.data.pagesGeneration) loader.hide();
      });
    }
    instance.data.applyProperties = function applyProperties(properties) {
      if (!properties) return;
      loadPages(properties.pages);
    };
    recreateBook();
    sceneApi.startLoop((delta) => {
      const book = instance.data.book;
      if (!book) return;
      book.animate(delta);
      const page = getDisplayedPage(book);
      if (page !== instance.data.publishedPage) {
        instance.data.publishedPage = page;
        instance.publishState("current_page", page);
      }
      const progressing = Math.abs(book.progress - instance.data._lastProgress) > 1e-4;
      if (instance.data._wasProgressing && !progressing) {
        instance.triggerEvent("page_changed");
      }
      instance.data._wasProgressing = progressing;
      instance.data._lastProgress = book.progress;
    });
    instance.publishState("current_page", 1);
    instance.publishState("total_pages", 0);
  }
  return __toCommonJS(index_exports);
})();
return __pluginInit.default(instance, context);
}
function __startPlugin() {
  if (globalThis["THREE"]) return __bootPlugin();
  return import("https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js").then(function (mod) { globalThis["THREE"] = mod; return __bootPlugin(); });
}
return __startPlugin();
}
