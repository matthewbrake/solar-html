
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var geotiff = (function (exports) {
  'use strict';

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var a$1 = ['\xC0', '\xC1', '\xC2', '\xC3', '\xC4', '\xC5', '\xC6', '\xC7', '\xC8', '\xC9', '\xCA', '\xCB', '\xCC', '\xCD', '\xCE', '\xCF'];
  var b$1 = ['\xD0', '\xD1', '\xD2', '\xD3', '\xD4', '\xD5', '\xD6', '\xD7', '\xD8', '\xD9', '\xDA', '\xDB', '\xDC', '\xDD', '\xDE', '\xDF'];
  var c$1 = ['\xE0', '\xE1', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\xEB', '\xEC', '\xED', '\xEE', '\xEF'];
  var d$1 = ['\xF0', '\xF1', '\xF2', '\xF3', '\xF4', '\xF5', '\xF6', '\xF7', '\xF8', '\xF9', '\xFA', '\xFB', '\xFC', '\xFD', '\xFE', '\xFF'];

  var e$1 = function (a) {
    var b = a.toString(16);
    return 1 === b.length ? '0' + b : b
  },
    f$1 = function (a) {
    for (var b = '', c = 0; c < a.length; c++) b += '%' + e$1(a[c]);

    return b
  };

  var g$1 = function (a) {
    if ('string' != typeof a) throw new TypeError('Expected a string');
    for (var d = a.replace(/[^%a-zA-Z0-9-_.!~*'()]/g, f$1), e = /[a-fA-F0-9]{2}/g, g = d.match(e), h = '', i = 0, j = 0; g && j < g.length; j++) {
      var k = parseInt(g[j], 16),
        l = String.fromCharCode(k);

      switch (!0) {
        case -1 !== a$1.indexOf(l):
        case -1 !== b$1.indexOf(l):
        case -1 !== c$1.indexOf(l):
        case -1 !== d$1.indexOf(l):
          h += l, i = d.indexOf(g[j]) + 2;
          break

        default:
          d = d.substr(0, d.indexOf(g[j])) + k.toString() + d.substr(d.indexOf(g[j]) + 2);
      }
    }
    return d = d.substr(i)
  };

  var a = function (a) {
    return g$1(a).split('').map(function (a) {
      return a.charCodeAt(0)
    })
  };

  var urlParse = function urlParse(url) {
    var parts = {};

    var urlRegex = new RegExp('^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?');
    var matches = url.match(urlRegex);

    if (matches) {
      parts.href = matches[0] || '';
      parts.protocol = matches[2] || '';
      parts.host = matches[4] || '';
      parts.search = matches[6] || '';
      parts.hash = matches[8] || '';
      parts.hostname = '';
      parts.port = '';
      parts.pathname = '';

      var hostParts = parts.host.split('@');
      if (hostParts.length > 1) {
        parts.auth = hostParts.shift();
        parts.host = hostParts.join('');
      }

      hostParts = parts.host.split(':');
      if (hostParts.length > 1) {
        parts.port = hostParts.pop();
        parts.hostname = hostParts.join('');
      } else {
        parts.hostname = parts.host;
      }
      parts.pathname = matches[5] || '';
      if (parts.pathname.length > 0 && parts.pathname[0] !== '/') {
        parts.pathname = '/' + parts.pathname;
      }
    }
    return parts;
  };

  var utचुर = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var CborTag = (function () {
      function CborTag(value, tag) {
          this.value = value;
          this.tag = tag;
          if (tag <= 24) {
              if (value < 24) {
                  throw new Error("Cannot tag a value which is smaller than 24, as it will be confused with a tag");
              }
          }
      }
      return CborTag;
  }());
  exports.CborTag = CborTag;
  function isCborTag(thing) {
      return thing instanceof CborTag;
  }
  exports.isCborTag = isCborTag;
  var CborMap = (function () {
      function CborMap(value) {
          this.value = value;
      }
      return CborMap;
  }());
  exports.CborMap = CborMap;
  function isCborMap(thing) {
      return thing instanceof CborMap;
  }
  exports.isCborMap = isCborMap;
  function encode(obj) {
      var bytes = [];
      encodeObject(obj, bytes);
      return new Uint8Array(bytes).buffer;
  }
  exports.encode = encode;
  function encodeObject(obj, bytes) {
      if (obj === undefined) {
          encodeMajor(7, 22, bytes);
      }
      else if (obj === null) {
          encodeMajor(7, 22, bytes);
      }
      else if (obj === false) {
          encodeMajor(7, 20, bytes);
      }
      else if (obj === true) {
          encodeMajor(7, 21, bytes);
      }
      else if (isCborTag(obj)) {
          encodeMajor(6, obj.tag, bytes);
          encodeObject(obj.value, bytes);
      }
      else if (isCborMap(obj)) {
          var map = obj.value;
          var keys_1 = [];
          var values_1 = [];
          map.forEach(function (value, key) {
              keys_1.push(key);
              values_1.push(value);
          });
          encodeMajor(5, keys_1.length, bytes);
          for (var i = 0; i < keys_1.length; ++i) {
              encodeObject(keys_1[i], bytes);
              encodeObject(values_1[i], bytes);
          }
      }
      else {
          var type = typeof obj;
          if (type === 'string') {
              var utf8 = toUtf8(obj);
              encodeMajor(3, utf8.length, bytes);
              for (var i = 0; i < utf8.length; ++i) {
                  bytes.push(utf8[i]);
              }
          }
          else if (type === 'number') {
              if (obj % 1 === 0) {
                  if (obj >= 0) {
                      encodeMajor(0, obj, bytes);
                  }
                  else {
                      encodeMajor(1, -1 - obj, bytes);
                  }
              }
              else {
                  encodeMajor(7, 27, bytes);
                  var buf = new ArrayBuffer(8);
                  var view = new DataView(buf);
                  view.setFloat64(0, obj, false);
                  var b = new Uint8Array(buf);
                  for (var i = 0; i < b.length; ++i) {
                      bytes.push(b[i]);
                  }
              }
          }
          else if (Array.isArray(obj)) {
              encodeMajor(4, obj.length, bytes);
              for (var i = 0; i < obj.length; ++i) {
                  encodeObject(obj[i], bytes);
              }
          }
          else if (obj instanceof Uint8Array || (typeof Buffer !== 'undefined' && obj instanceof Buffer)) {
              encodeMajor(2, obj.length, bytes);
              for (var i = 0; i < obj.length; ++i) {
                  bytes.push(obj[i]);
              }
          }
          else if (type === 'object') {
              var keys = Object.keys(obj);
              encodeMajor(5, keys.length, bytes);
              for (var i = 0; i < keys.length; ++i) {
                  var key = keys[i];
                  encodeObject(key, bytes);
                  encodeObject(obj[key], bytes);
              }
          }
          else {
              throw new Error("Unsupported type: " + type);
          }
      }
  }
  function toUtf8(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
          var charcode = str.charCodeAt(i);
          if (charcode < 0x80) {
              utf8.push(charcode);
          }
          else if (charcode < 0x800) {
              utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
          }
          else if (charcode < 0xd800 || charcode >= 0xe000) {
              utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
          }
          else {
              i++;
              charcode = (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)) + 0x10000;
              utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
          }
      }
      return utf8;
  }
  function encodeMajor(major, value, bytes) {
      major <<= 5;
      if (value < 24) {
          bytes.push(major | value);
      }
      else if (value < 256) {
          bytes.push(major | 24, value);
      }
      else if (value < 65536) {
          bytes.push(major | 25, value >> 8, value & 0xff);
      }
      else if (value < 4294967296) {
          bytes.push(major | 26, value >> 24, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
      }
      else {
          bytes.push(major | 27, value >> 56, (value >> 48) & 0xff, (value >> 40) & 0xff, (value >> 32) & 0xff, (value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
      }
  }
  function decode(buffer) {
      var dataView = new DataView(buffer);
      var obj = decodeObject(dataView, { offset: 0 });
      return obj;
  }
  exports.decode = decode;
  function decodeObject(dataView, state) {
      var initialByte = dataView.getUint8(state.offset);
      state.offset++;
      var major = initialByte >> 5;
      var additional = initialByte & 0x1f;
      if (major === 7) {
          switch (additional) {
              case 20:
                  return false;
              case 21:
                  return true;
              case 22:
                  return null;
              case 23:
                  return undefined;
              case 25:
                  var val = dataView.getFloat16(state.offset);
                  state.offset += 2;
                  return val;
              case 26:
                  var val = dataView.getFloat32(state.offset);
                  state.offset += 4;
                  return val;
              case 27:
                  var val = dataView.getFloat64(state.offset);
                  state.offset += 8;
                  return val;
          }
      }
      var value = 0;
      if (additional < 24) {
          value = additional;
      }
      else if (additional === 24) {
          value = dataView.getUint8(state.offset);
          state.offset++;
      }
      else if (additional === 25) {
          value = dataView.getUint16(state.offset);
          state.offset += 2;
      }
      else if (additional === 26) {
          value = dataView.getUint32(state.offset);
          state.offset += 4;
      }
      else if (additional === 27) {
          var v1 = dataView.getUint32(state.offset);
          var v2 = dataView.getUint32(state.offset + 4);
          if (v1 > 0x1FFFFF) {
              console.warn("CBOR RFC 7049 section 2.1: integers must be as small as possible. Decoding " + v1 + " " + v2 + " as a float, as it cannot be a safe Javascript integer");
              state.offset = state.offset - 1;
              var val = dataView.getFloat64(state.offset);
              state.offset += 8;
              return val;
          }
          value = v1 * 0x100000000 + v2;
          state.offset += 8;
      }
      if (major === 0) {
          return value;
      }
      else if (major === 1) {
          return -1 - value;
      }
      else if (major === 2) {
          var array = new Uint8Array(dataView.buffer, state.offset, value);
          state.offset += value;
          return array;
      }
      else if (major === 3) {
          var utf8 = new Uint8Array(dataView.buffer, state.offset, value);
          state.offset += value;
          var str = '';
          var i = 0;
          while (i < utf8.length) {
              var charcode = utf8[i++];
              if (charcode < 0x80) {
                  str += String.fromCharCode(charcode);
              }
              else if (charcode < 0xe0) {
                  str += String.fromCharCode(((charcode & 0x1f) << 6) | (utf8[i++] & 0x3f));
              }
              else if (charcode < 0xf0) {
                  str += String.fromCharCode(((charcode & 0x0f) << 12) | ((utf8[i++] & 0x3f) << 6) | (utf8[i++] & 0x3f));
              }
              else {
                  var char = ((charcode & 0x07) << 18) | ((utf8[i++] & 0x3f) << 12) | ((utf8[i++] & 0x3f) << 6) | (utf8[i++] & 0x3f);
                  char -= 0x10000;
                  str += String.fromCharCode(0xd800 + (char >> 10), 0xdc00 + (char & 0x3ff));
              }
          }
          return str;
      }
      else if (major === 4) {
          var array = [];
          for (var i = 0; i < value; ++i) {
              array.push(decodeObject(dataView, state));
          }
          return array;
      }
      else if (major === 5) {
          var map = new Map();
          for (var i = 0; i < value; ++i) {
              var key = decodeObject(dataView, state);
              var val = decodeObject(dataView, state);
              map.set(key, val);
          }
          return map;
      }
      else if (major === 6) {
          return new CborTag(decodeObject(dataView, state), value);
      }
  }
  (function (DataView) {
      if (!DataView.prototype.getFloat16) {
          DataView.prototype.getFloat16 = function (byteOffset, littleEndian) {
              var half = this.getUint16(byteOffset, littleEndian);
              var sign = (half & 0x8000) >> 15;
              var exp = (half & 0x7C00) >> 10;
              var frac = half & 0x03FF;
              if (exp == 0) {
                  return (sign ? -1 : 1) * Math.pow(2, -14) * (frac / 1024);
              }
              else if (exp == 0x1F) {
                  return frac ? NaN : ((sign ? -1 : 1) * Infinity);
              }
              return (sign ? -1 : 1) * Math.pow(2, exp - 15) * (1 + (frac / 1024));
          };
      }
  })(DataView);
  //# sourceMappingURL=cbor.js.map
  });

  var cbor = utचुर;
  var CborTag = utचुर.CborTag;
  var isCborTag = utचुर.isCborTag;
  var CborMap = utचुर.CborMap;
  var isCborMap = utचुर.isCborMap;
  var encode = utचुर.encode;
  var decode = utचुरur.decode;

  var http = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function get(url) {
      var parts = urlParse(url);
      var lib;
      if (parts.protocol === 'http') {
          lib = require('http');
      }
      else if (parts.protocol === 'https') {
          lib = require('https');
      }
      else {
          return Promise.reject(new Error('protocol not supported: ' + parts.protocol));
      }
      var options = {
          protocol: parts.protocol + ':',
          hostname: parts.hostname,
          port: parts.port,
          path: parts.pathname + parts.search,
          headers: {},
      };
      var headerPromise = new Promise(function (resolve, reject) {
          var req = lib.request(options, function (res) {
              var result = {
                  headers: res.headers,
                  data: res,
              };
              resolve(result);
          });
          req.on('error', function (err) {
              reject(err);
          });
          req.end();
      });
      return headerPromise;
  }
  exports.get = get;
  //# sourceMappingURL=http.js.map
  });

  var http$1 = http.get;

  var file = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var fs = require('fs');
  function open(path) {
      var file = {
          path: path,
          fd: null,
      };
      return new Promise(function (resolve, reject) {
          fs.open(path, 'r', function (err, fd) {
              if (err) {
                  reject(err);
              }
              else {
                  file.fd = fd;
                  resolve(file);
              }
          });
      });
  }
  exports.open = open;
  function stat(file) {
      return new Promise(function (resolve, reject) {
          fs.fstat(file.fd, function (err, stats) {
              if (err) {
                  reject(err);
              }
              else {
                  resolve(stats);
              }
          });
      });
  }
  exports.stat = stat;
  function read(file, position, length) {
      var buffer = Buffer.alloc(length);
      return new Promise(function (resolve, reject) {
          fs.read(file.fd, buffer, 0, length, position, function (err, bytesRead, buffer) {
              if (err) {
                  reject(err);
              }
              else {
                  var ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
                  resolve(ab);
              }
          });
      });
  }
  exports.read = read;
  function close(file) {
      return new Promise(function (resolve, reject) {
          fs.close(file.fd, function (err) {
              if (err) {
                  reject(err);
              }
              else {
                  resolve();
              }
          });
      });
  }
  exports.close = close;
  //# sourceMappingURL=file.js.map
  });

  var file$1 = file.open;
  var file$2 = file.stat;
  var file$3 = file.read;
  var file$4 = file.close;

  var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var Slice = (function () {
      function Slice(source, offset, length) {
          this.source = source;
          this.offset = offset;
          this.length = length;
          this.end = this.offset + this.length;
      }
      Slice.prototype.getSlice = function (offset, length) {
          return __awaiter$5(this, void 0, void 0, function () {
              var sliceOffset, sliceLength;
              return __generator$5(this, function (_a) {
                  sliceOffset = this.offset + offset;
                sliceLength = length;
                if (typeof sliceLength === 'undefined') {
                  sliceLength = this.length - offset;
                }
                if (sliceOffset + sliceLength > this.source.length) {
                  throw new Error('offset or length out of bounds');
                }
                  return [2, this.source.getSlice(sliceOffset, sliceLength)];
              });
          });
      };
      Slice.prototype.fetch = function () {
          return __awaiter$5(this, void 0, void 0, function () {
              var data;
              return __generator$5(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.source.getSlice(this.offset, this.length)];
                      case 1:
                          data = _a.sent();
                          return [2, data];
                  }
              });
          });
      };
      return Slice;
  }());

  var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var HttpSource = (function () {
      function HttpSource(url, options) {
          if (options === void 0) { options = {}; }
          this.url = url;
          this.options = options;
          this.fetching = null;
          this.remoteSlices = {};
      }
      HttpSource.prototype.getSlice = function (offset, length) {
          return __awaiter$4(this, void 0, void 0, function () {
              var range, headerResponse, response, responseLength, data, error_1;
              return __generator$4(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          range = 'bytes=' + offset + '-' + (offset + length - 1);
                          if (this.remoteSlices[range]) {
                              return [2, this.remoteSlices[range]];
                          }
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 6, 7, 8]);
                          return [4, http$1(this.url)];
                      case 2:
                          headerResponse = _a.sent();
                          responseLength = parseInt(headerResponse.headers['content-length']);
                          if (this.length !== responseLength) {
                              this.length = responseLength;
                          }
                          return [4, http$1(this.url)];
                      case 3:
                          response = _a.sent();
                          return [4, this.readAll(response.data)];
                      case 4:
                          data = _a.sent();
                          return [4, new Blob([data]).arrayBuffer()];
                      case 5: return [2, _a.sent()];
                      case 6:
                          error_1 = _a.sent();
                          return [2, Promise.reject(error_1)];
                      case 7: return [7];
                      case 8: return [2];
                  }
              });
          });
      };
      HttpSource.prototype.readAll = function (stream) {
          return new Promise(function (resolve, reject) {
              var done = false;
              var chunks = [];
              var length = 0;
              stream.on('data', function (chunk) {
                  length += chunk.length;
                  chunks.push(chunk);
              });
              stream.on('error', function (err) {
                  done = true;
                  reject(err);
              });
              stream.on('end', function () {
                  if (!done) {
                      var result = new Uint8Array(length);
                      var pos = 0;
                      for (var i = 0; i < chunks.length; ++i) {
                          var chunk = chunks[i];
                          result.set(chunk, pos);
                          pos += chunk.length;
                      }
                      resolve(result);
                  }
              });
          });
      };
      return HttpSource;
  }());

  var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var FileSource = (function () {
      function FileSource(file) {
          this.file = file;
          this.sliceCache = {};
      }
      FileSource.getSlice = function (file, offset, length) {
          return __awaiter$3(this, void 0, void 0, function () {
              return __generator$3(this, function (_a) {
                  return [2, file$3(file, offset, length)];
              });
          });
      };
      FileSource.prototype.getSlice = function (offset, length) {
          return __awaiter$3(this, void 0, void 0, function () {
              var _a;
              return __generator$3(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          if (!!this.file.fd) return [3, 2];
                          _a = this.file;
                          return [4, file$1(this.file.path)];
                      case 1:
                          _a.fd = (_b.sent()).fd;
                          _b.label = 2;
                      case 2: return [2, FileSource.getSlice(this.file, offset, length)];
                  }
              });
          });
      };
      return FileSource;
  }());

  var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  function getSource(source, options) {
      if (typeof source === 'string') {
          if (source.startsWith('http')) {
              return new HttpSource(source, options);
          }
          return new FileSource({ path: source });
      }
      else if (source instanceof Blob) {
          return new BlobSource(source);
      }
      return new ArrayBufferSource(source);
  }
  var BlobSource = (function () {
      function BlobSource(blob) {
          this.blob = blob;
          this.length = blob.size;
      }
      BlobSource.prototype.getSlice = function (offset, length) {
          return __awaiter$2(this, void 0, void 0, function () {
              var s;
              return __generator$2(this, function (_a) {
                  s = this.blob.slice(offset, offset + length);
                  return [2, new Promise(function (resolve, reject) {
                          var reader = new FileReader();
                          reader.onload = function (e) {
                              resolve(e.target.result);
                          };
                          reader.onerror = reject;
                          reader.readAsArrayBuffer(s);
                      })];
              });
          });
      };
      return BlobSource;
  }());
  var ArrayBufferSource = (function () {
      function ArrayBufferSource(arrayBuffer) {
          this.arrayBuffer = arrayBuffer;
          this.length = arrayBuffer.byteLength;
      }
      ArrayBufferSource.prototype.getSlice = function (offset, length) {
          return __awaiter$2(this, void 0, void 0, function () {
              return __generator$2(this, function (_a) {
                  return [2, this.arrayBuffer.slice(offset, offset + length)];
              });
          });
      };
      return ArrayBufferSource;
  }());

  var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var DataView$1 = (function () {
      function DataView(slice) {
          this.slice = slice;
          this.buffer = null;
          this.dataView = null;
          this.littleEndian = false;
      }
      DataView.prototype.getUint8 = function (offset) {
          return __awaiter$1(this, void 0, void 0, function () {
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.ensureData(offset, 1)];
                      case 1:
                          _a.sent();
                          return [2, this.dataView.getUint8(offset - this.buffer.offset)];
                  }
              });
          });
      };
      DataView.prototype.getUint16 = function (offset) {
          return __awaiter$1(this, void 0, void 0, function () {
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.ensureData(offset, 2)];
                      case 1:
                          _a.sent();
                          return [2, this.dataView.getUint16(offset - this.buffer.offset, this.littleEndian)];
                  }
              });
          });
      };
      DataView.prototype.getUint32 = function (offset) {
          return __awaiter$1(this, void 0, void 0, function () {
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.ensureData(offset, 4)];
                      case 1:
                          _a.sent();
                          return [2, this.dataView.getUint32(offset - this.buffer.offset, this.littleEndian)];
                  }
              });
          });
      };
      DataView.prototype.getFloat32 = function (offset) {
          return __awaiter$1(this, void 0, void 0, function () {
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.ensureData(offset, 4)];
                      case 1:
                          _a.sent();
                          return [2, this.dataView.getFloat32(offset - this.buffer.offset, this.littleEndian)];
                  }
              });
          });
      };
      DataView.prototype.getFloat64 = function (offset) {
          return __awaiter$1(this, void 0, void 0, function () {
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.ensureData(offset, 8)];
                      case 1:
                          _a.sent();
                          return [2, this.dataView.getFloat64(offset - this.buffer.offset, this.littleEndian)];
                  }
              });
          });
      };
      DataView.prototype.getString = function (offset, length) {
          return __awaiter$1(this, void 0, void 0, function () {
              var buffer, i, a, charCodes;
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4, this.slice.source.getSlice(offset, length)];
                      case 1:
                          buffer = _a.sent();
                          a = new Uint8Array(buffer);
                          charCodes = [];
                          for (i = 0; i < a.length; ++i) {
                              charCodes.push(a[i]);
                          }
                          return [2, String.fromCharCode.apply(null, charCodes)];
                  }
              });
          });
      };
      DataView.prototype.ensureData = function (offset, length) {
          return __awaiter$1(this, void 0, void 0, function () {
              var data;
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!(this.buffer === null || offset < this.buffer.offset || offset + length > this.buffer.end)) return [3, 2];
                          return [4, this.slice.getSlice(offset, length)];
                      case 1:
                          data = _a.sent();
                          this.buffer = new Slice(this.slice.source, offset, data.byteLength);
                          this.dataView = new window.DataView(data);
                          _a.label = 2;
                      case 2: return [2];
                  }
              });
          });
      };
      return DataView;
  }());

  var globals = {
      TYPES: {
          BYTE: 1,
          ASCII: 2,
          SHORT: 3,
          LONG: 4,
          RATIONAL: 5,
          SBYTE: 6,
          UNDEFINED: 7,
          SSHORT: 8,
          SLONG: 9,
          SRATIONAL: 10,
          FLOAT: 11,
          DOUBLE: 12,
      },
      TYPE_NAMES: [
          null, 'BYTE', 'ASCII', 'SHORT', 'LONG', 'RATIONAL',
          'SBYTE', 'UNDEFINED', 'SSHORT', 'SLONG', 'SRATIONAL', 'FLOAT', 'DOUBLE',
      ],
      COMPRESSIONS: {
          UNCOMPRESSED: 1,
          CCITT_HUFFMAN: 2,
          CCITT_T4: 3,
          CCITT_T6: 4,
          LZW: 5,
          JPEG_OLD: 6,
          JPEG: 7,
          DEFLATE: 8,
          PACKBITS: 32773,
          DEFLATE_OLD: 32946,
      },
      PHOTOMETRICS: {
          MINISWHITE: 0,
          MINISBLACK: 1,
          RGB: 2,
          PALETTE: 3,
          MASK: 4,
          SEPARATED: 5,
          YCBCR: 6,
          CIELAB: 8,
      },
  };
  globals.TYPES_BYTE_SIZE = [
      0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8,
  ];

  var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var TIFFImage = (function () {
      function TIFFImage(fileDirectory) {
          this.fileDirectory = fileDirectory;
          this.decoder = null;
      }
      TIFFImage.prototype.getSamplesPerPixel = function () {
          return this.fileDirectory.SamplesPerPixel;
      };
      TIFFImage.prototype.getTiePoints = function () {
          return this.fileDirectory.ModelTiepoint;
      };
      TIFFImage.prototype.getFileDirectory = function () {
          return this.fileDirectory;
      };
      TIFFImage.prototype.getWidth = function () {
          return this.fileDirectory.ImageWidth;
      };
      TIFFImage.prototype.getHeight = function () {
          return this.fileDirectory.ImageLength;
      };
      TIFFImage.prototype.getBitsPerSample = function () {
          return this.fileDirectory.BitsPerSample;
      };
      TIFFImage.prototype.getSampleFormat = function () {
          return this.fileDirectory.SampleFormat;
      };
      TIFFImage.prototype.getPhotometricInterpretation = function () {
          return this.fileDirectory.PhotometricInterpretation;
      };
      TIFFImage.prototype.getCompression = function () {
          return this.fileDirectory.Compression;
      };
      TIFFImage.prototype.getDecoder = function () {
          if (!this.decoder) {
              var compression = this.getCompression();
              if (compression === globals.COMPRESSIONS.UNCOMPRESSED) ;
              else if (compression === globals.COMPRESSIONS.LZW) ;
              else if (compression === globals.COMPRESSIONS.PACKBITS) ;
              else if (compression === globals.COMPRESSIONS.DEFLATE ||
                  compression === globals.COMPRESSIONS.DEFLATE_OLD) ;
              else {
                  throw new Error('Unknown compression method identifier: ' + compression);
              }
          }
          return this.decoder;
      };
      TIFFImage.prototype.readRasters = function (options) {
          return __awaiter(this, void 0, void 0, function () {
              var imageWindow, samples, width, height, result, i, data;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          imageWindow = (options && options.window) ? options.window : null;
                          samples = (options && options.samples) ? options.samples : null;
                          width = this.getWidth();
                          height = this.getHeight();
                          if (!imageWindow) {
                              imageWindow = [0, 0, width, height];
                          }
                          if (!samples) {
                              samples = [];
                              for (i = 0; i < this.getSamplesPerPixel(); ++i) {
                                  samples.push(i);
                              }
                          }
                          return [4, this.getDecoder().decode(this.fileDirectory, imageWindow, samples)];
                      case 1:
                          data = _a.sent();
                          result = [];
                          for (i = 0; i < samples.length; ++i) {
                              result.push(data[i]);
                          }
                          return [2, result];
                  }
              });
          });
      };
      return TIFFImage;
  }());

  var tiff = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var Tiff = (function () {
      function Tiff(data) {
          this.data = data;
          this.dataView = new DataView$1(new Slice(getSource(data), 0, data.byteLength));
          this.littleEndian = false;
          this.fileDirectories = [];
      }
      Tiff.prototype.getFieldTypeLength = function (fieldType) {
          switch (fieldType) {
              case 1:
              case 2:
              case 6:
              case 7:
                  return 1;
              case 3:
              case 8:
                  return 2;
              case 4:
              case 9:
              case 11:
                  return 4;
              case 5:
              case 10:
              case 12:
                  return 8;
              default:
                  return 0;
          }
      };
      Tiff.prototype.getValues = function (fieldType, count, offset) {
          var values = [];
          var fieldTypeLength = this.getFieldTypeLength(fieldType);
          if (fieldTypeLength === 0) {
              return null;
          }
          for (var i = 0; i < count; i++) {
              var valueOffset = offset + (i * fieldTypeLength);
              var value = this.getValue(fieldType, valueOffset);
              values.push(value);
          }
          return Promise.all(values);
      };
      Tiff.prototype.getValue = function (fieldType, offset) {
          switch (fieldType) {
              case 1:
                  return this.dataView.getUint8(offset);
              case 2:
                  return this.dataView.getUint8(offset);
              case 3:
                  return this.dataView.getUint16(offset);
              case 4:
                  return this.dataView.getUint32(offset);
              case 5:
                  return this.dataView.getUint32(offset).then(function (numerator) {
                      return this.dataView.getUint32(offset + 4).then(function (denominator) {
                          return [numerator, denominator];
                      });
                  }.bind(this));
              case 11:
                  return this.dataView.getFloat32(offset);
              case 12:
                  return this.dataView.getFloat64(offset);
          }
      };
      Tiff.prototype.parseFileDirectory = function (offset) {
          return this.dataView.getUint16(offset).then(function (numDirEntries) {
              var fileDirectory = {};
              var nextIFDOffset = null;
              var entriesOffset = offset + 2;
              var promises = [];
              for (var i = 0; i < numDirEntries; i++) {
                  var entryOffset = entriesOffset + (i * 12);
                  var promise = this.dataView.getUint16(entryOffset).then(function (tag) {
                      return this.dataView.getUint16(entryOffset + 2).then(function (fieldType) {
                          return this.dataView.getUint32(entryOffset + 4).then(function (count) {
                              return this.dataView.getUint32(entryOffset + 8).then(function (valueOffset) {
                                  var fieldTypeLength = this.getFieldTypeLength(fieldType);
                                  var valueByteLength = fieldTypeLength * count;
                                  if (valueByteLength <= 4) {
                                      return this.getValues(fieldType, count, entryOffset + 8);
                                  }
                                  else {
                                      return this.getValues(fieldType, count, valueOffset);
                                  }
                              }.bind(this)).then(function (values) {
                                  var name = tagDict[tag];
                                  if (name) {
                                      if (Array.isArray(values) && values.length === 1) {
                                          fileDirectory[name] = values[0];
                                      }
                                      else {
                                          fileDirectory[name] = values;
                                      }
                                  }
                              }.bind(this));
                          }.bind(this));
                      }.bind(this));
                  }.bind(this));
                  promises.push(promise);
              }
              return Promise.all(promises).then(function () {
                  this.fileDirectories.push(fileDirectory);
                  return this.dataView.getUint32(entriesOffset + (numDirEntries * 12));
              }.bind(this));
          }.bind(this));
      };
      Tiff.prototype.parse = function () {
          return this.dataView.getUint16(0).then(function (byteOrder) {
              if (byteOrder === 0x4949) {
                  this.littleEndian = true;
              }
              else if (byteOrder === 0x4D4D) {
                  this.littleEndian = false;
              }
              else {
                  return Promise.reject(new Error('Invalid byte order value.'));
              }
              this.dataView.littleEndian = this.littleEndian;
              return this.dataView.getUint16(2).then(function (magicNumber) {
                  if (magicNumber !== 42) {
                      return Promise.reject(new Error('Invalid magic number.'));
                  }
                  return this.dataView.getUint32(4).then(function (offset) {
                      var promise = this.parseFileDirectory(offset);
                      while (offset !== 0) {
                          promise = promise.then(function (nextIFDOffset) {
                              offset = nextIFDOffset;
                              if (offset !== 0) {
                                  return this.parseFileDirectory(offset);
                              }
                          }.bind(this));
                      }
                      return promise;
                  }.bind(this));
              }.bind(this));
          }.bind(this));
      };
      Tiff.prototype.getImage = function (index) {
          if (!index) {
              index = 0;
          }
          if (index >= this.fileDirectories.length) {
              return Promise.reject(new Error('Invalid image index.'));
          }
          return Promise.resolve(new TIFFImage(this.fileDirectories[index]));
      };
      Tiff.prototype.getImageCount = function () {
          return this.fileDirectories.length;
      };
      return Tiff;
  }());
  exports.Tiff = Tiff;
  var tagDict = {
      254: 'NewSubfileType',
      256: 'ImageWidth',
      257: 'ImageLength',
      258: 'BitsPerSample',
      259: 'Compression',
      262: 'PhotometricInterpretation',
      270: 'ImageDescription',
      273: 'StripOffsets',
      277: 'SamplesPerPixel',
      278: 'RowsPerStrip',
      279: 'StripByteCounts',
      282: 'XResolution',
      283: 'YResolution',
      284: 'PlanarConfiguration',
      296: 'ResolutionUnit',
      305: 'Software',
      306: 'DateTime',
      317: 'Predictor',
      320: 'ColorMap',
      338: 'ExtraSamples',
      33550: 'ModelPixelScale',
      33922: 'ModelTiepoint',
      34735: 'GeoKeyDirectory',
      34737: 'GeoAsciiParams',
      42113: 'GDAL_NODATA',
  };
  function fromUrl(url, options) {
      var source = getSource(url, options);
      var tiff = new Tiff(source);
      return tiff.parse().then(function () {
          return tiff;
      });
  }
  exports.fromUrl = fromUrl;
  function fromFile(path) {
      var source = getSource(path);
      var tiff = new Tiff(source);
      return tiff.parse().then(function () {
          return tiff;
      });
  }
  exports.fromFile = fromFile;
  function fromBlob(blob) {
      var source = getSource(blob);
      var tiff = new Tiff(source);
      return tiff.parse().then(function () {
          return tiff;
      });
  }
  exports.fromBlob = fromBlob;
  function fromArrayBuffer(arrayBuffer) {
      var source = getSource(arrayBuffer);
      var tiff = new Tiff(source);
      return tiff.parse().then(function () {
          return tiff;
      });
  }
  exports.fromArrayBuffer = fromArrayBuffer;
  //# sourceMappingURL=tiff.js.map
  });

  var fromUrl = tiff.fromUrl;
  var fromFile = tiff.fromFile;
  var fromBlob = tiff.fromBlob;
  var fromArrayBuffer$1 = tiff.fromArrayBuffer;
  var tiff$1 = tiff.Tiff;

  exports.CborMap = CborMap;
  exports.CborTag = CborTag;
  exports.Tiff = tiff$1;
  exports.decode = decode;
  exports.encode = encode;
  exports.fromArrayBuffer = fromArrayBuffer$1;
  exports.fromBlob = fromBlob;
  exports.fromFile = fromFile;
  exports.fromUrl = fromUrl;
  exports.isCborMap = isCborMap;
  exports.isCborTag = isCborTag;
  exports.utils = a;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=geotiff.js.map
