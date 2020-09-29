/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@jscad/io/json-deserializer/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@jscad/io/json-deserializer/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n## License\n\nCopyright (c) JSCAD Organization https://github.com/jscad\n\nAll code released under MIT license\n*/\n\n// //////////////////////////////////////////\n//\n// JSON (JavaScript Object Notation) is a lightweight data-interchange format\n// See https://www.json.org\n//\n// //////////////////////////////////////////\n\nconst { flatten, toArray } = __webpack_require__(/*! @jscad/array-utils */ \"./node_modules/@jscad/utils/array-utils/index.js\")\n\nconst version = __webpack_require__(/*! ./package.json */ \"./node_modules/@jscad/io/json-deserializer/package.json\").version\n\n/**\n * Deserialize the given JSON notation (string) into either a script or an array of geometry.\n * @param {Object} [options] - options used during deserializing\n * @param {String} [options.filename='json'] - filename of original JSON source\n * @param {String} [options.output='script'] - either 'script' or 'geometry' to set desired output\n * @param {String} [options.version='0.0.0'] - version number to add to the metadata\n * @param {Boolean} [options.addMetadata=true] - toggle injection of metadata at the start of the script\n * @param {String} input - JSON source data\n * @return {[geometry]/String} either an array of objects (geometry) or a string (script)\n */\nconst deserialize = (options, input) => {\n  const defaults = {\n    filename: 'json',\n    output: 'script',\n    version,\n    addMetaData: true\n  }\n  options = Object.assign({}, defaults, options)\n\n  // convert the JSON notation into anonymous object(s)\n  let objects = JSON.parse(input)\n\n  // cleanup the objects\n  objects = flatten(toArray(objects))\n\n  return options.output === 'script' ? translate(options, objects) : objects\n}\n\n//\n// translate the given objects (geometries) into a  JSCAD script\n//\nconst translate = (options, objects) => {\n  const { addMetaData, filename, version } = options\n\n  let script = addMetaData ? `//\n// Produced by JSCAD IO Library : JSON Deserializer (${version})\n// date: ${new Date()}\n// source: ${filename}\n//\n` : ''\n\n  script +=\n`\nconst { geometries } = require('@jscad/modeling')\n\nconst main = () => {\n  const objects = [${translateToList(objects)} ]\n  return objects\n}\n\n${translateToObjects(objects)}\n\nmodule.exports = { main }\n`\n\n  return script\n}\n\nconst translateToList = (objects) => objects.reduce((script, object, index) => script + ` json${index},`, '')\n\nconst translateToObjects = (objects) => objects.reduce((script, object, index) => script + translateToObject(object, index), '')\n\n// translate the given object to JSON notation (AGAIN)\n// NOTE: this implies that the original JSON was correct :)\nconst translateToObject = (object, index) => `const json${index} = ${JSON.stringify(object)}\\n`\n\nconst extension = 'json'\n\nmodule.exports = {\n  deserialize,\n  extension\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/io/json-deserializer/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/io/json-deserializer/package.json":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/io/json-deserializer/package.json ***!
  \***************************************************************/
/*! exports provided: name, version, description, repository, main, scripts, contributors, keywords, license, dependencies, devDependencies, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"name\\\":\\\"@jscad/json-deserializer\\\",\\\"version\\\":\\\"2.0.0-alpha.1\\\",\\\"description\\\":\\\"JSON deserializer for JSCAD project\\\",\\\"repository\\\":\\\"https://github.com/jscad/OpenJSCAD.org\\\",\\\"main\\\":\\\"index.js\\\",\\\"scripts\\\":{\\\"coverage\\\":\\\"nyc --all --reporter=html --reporter=text npm test\\\",\\\"test\\\":\\\"ava 'tests/*.test.js' --verbose --timeout 2m\\\",\\\"release-patch\\\":\\\"git checkout master && npm version patch && git commit -a -m 'chore(dist): built dist/'; git push origin master --tags \\\",\\\"release-minor\\\":\\\"git checkout master && npm version minor && git commit -a -m 'chore(dist): built dist/'; git push origin master --tags \\\",\\\"release-major\\\":\\\"git checkout master && npm version major && git commit -a -m 'chore(dist): built dist/'; git push origin master --tags \\\"},\\\"contributors\\\":[{\\\"name\\\":\\\"z3dev\\\",\\\"url\\\":\\\"http://www.z3d.jp\\\"},{\\\"name\\\":\\\"Mark 'kaosat-dev' Moissette\\\",\\\"url\\\":\\\"http://kaosat.net\\\"}],\\\"keywords\\\":[\\\"openjscad\\\",\\\"jscad\\\",\\\"csg\\\",\\\"import\\\",\\\"deserializer\\\",\\\"json\\\"],\\\"license\\\":\\\"MIT\\\",\\\"dependencies\\\":{\\\"@jscad/array-utils\\\":\\\"2.0.0-alpha.1\\\"},\\\"devDependencies\\\":{\\\"@jscad/modeling\\\":\\\"2.0.0-alpha.1\\\",\\\"ava\\\":\\\"3.10.0\\\"}}\");\n\n//# sourceURL=webpack:///./node_modules/@jscad/io/json-deserializer/package.json?");

/***/ }),

/***/ "./node_modules/@jscad/io/json-serializer/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@jscad/io/json-serializer/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\nJSCAD Object to JSON Notation Serialization\n\n## License\n\nCopyright (c) JSCAD Organization https://github.com/jscad\n\nAll code released under MIT license\n\nNotes:\n1) geom2 conversion to:\n     JSON\n2) geom3 conversion to:\n     JSON\n3) path2 conversion to:\n     JSON\n*/\n\nconst { utils } = __webpack_require__(/*! @jscad/modeling */ \"./node_modules/@jscad/modeling/src/index.js\")\n\n// Replace all typed arrays in geometries with standard Arrays\n// NOTE: 'this' in replacer is the object in which key was found\nconst replacer = (key, value) => {\n  switch (key) {\n    case 'transforms':\n    case 'plane':\n      return Array.from(value)\n    case 'points':\n    case 'vertices':\n      return value.map((v) => Array.from(v))\n    case 'sides':\n      return value.map((s) => [Array.from(s[0]), Array.from(s[1])])\n    default:\n      break\n  }\n  return value\n}\n\n/**\n * Serialize the give objects to JSON.\n * @param {Object} options - options for serialization, REQUIRED\n * @param {Object|Array} objects - objects to serialize as JSON\n * @returns {Array} serialized contents\n */\nconst serialize = (options, ...objects) => {\n  const defaults = {\n    statusCallback: null\n  }\n  options = Object.assign({}, defaults, options)\n\n  objects = utils.flatten(objects)\n\n  options.statusCallback && options.statusCallback({ progress: 0 })\n\n  const notation = JSON.stringify(objects, replacer)\n\n  options.statusCallback && options.statusCallback({ progress: 100 })\n\n  return [notation]\n}\n\nconst mimeType = 'application/json'\n\nmodule.exports = {\n  serialize,\n  mimeType\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/io/json-serializer/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/colorNameToRgb.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/colorNameToRgb.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cssColors = __webpack_require__(/*! ./cssColors */ \"./node_modules/@jscad/modeling/src/colors/cssColors.js\")\n\n/**\n * Converts a CSS color name to RGB color.\n *\n * @param {String} s - the CSS color name\n * @return {Array} the RGB color, or undefined if not found\n * @alias module:modeling/colors.colorNameToRgb\n * @example\n * let mysphere = colorize(colorNameToRgb('lightblue'), sphere())\n */\nconst colorNameToRgb = (s) => cssColors[s.toLowerCase()]\n\nmodule.exports = colorNameToRgb\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/colorNameToRgb.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/colorize.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/colorize.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst colorGeom2 = (color, object) => {\n  const newgeom2 = geom2.create(geom2.toSides(object))\n  newgeom2.color = color\n  return newgeom2\n}\n\nconst colorGeom3 = (color, object) => {\n  const newgeom3 = geom3.create(geom3.toPolygons(object))\n  newgeom3.color = color\n  return newgeom3\n}\n\nconst colorPath2 = (color, object) => {\n  const newpath2 = path2.clone(object)\n  newpath2.color = color\n  return newpath2\n}\n\nconst colorPoly3 = (color, object) => {\n  const newpoly = poly3.clone(object)\n  newpoly.color = color\n  return newpoly\n}\n\n/**\n * Assign the given color to the given objects.\n * Note: The color should only be assigned after performing all operations.\n * @param {Array} color - RGBA color values, where each value is between 0 and 1.0\n * @param {Object|Array} objects - the objects of which to color\n * @return {Object|Array} new geometry, or list of new geometries with an additional attribute 'color'\n * @alias module:modeling/colors.colorize\n *\n * @example\n * let redSphere = colorize([1,0,0], sphere()) // red\n * let greenCircle = colorize([0,1,0,0.8], circle()) // green transparent\n * let blueArc = colorize([0,0,1], arc()) // blue\n * let wildcylinder = colorize(colorNameToRgb('fuchsia'), cylinder()) // CSS color\n */\nconst colorize = (color, ...objects) => {\n  if (!Array.isArray(color)) throw new Error('color must be an array')\n  if (color.length < 3) throw new Error('color must contain R, G and B values')\n  if (color.length === 3) color = [color[0], color[1], color[2], 1.0] // add alpha\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  const results = objects.map((object) => {\n    if (geom2.isA(object)) return colorGeom2(color, object)\n    if (geom3.isA(object)) return colorGeom3(color, object)\n    if (path2.isA(object)) return colorPath2(color, object)\n    if (poly3.isA(object)) return colorPoly3(color, object)\n\n    object.color = color\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = colorize\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/colorize.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/cssColors.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/cssColors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * @alias module:modeling/colors.cssColors\n * @see CSS color table from http://www.w3.org/TR/css3-color/\n */\nconst cssColors = {\n  // basic color keywords\n  black: [0 / 255, 0 / 255, 0 / 255],\n  silver: [192 / 255, 192 / 255, 192 / 255],\n  gray: [128 / 255, 128 / 255, 128 / 255],\n  white: [255 / 255, 255 / 255, 255 / 255],\n  maroon: [128 / 255, 0 / 255, 0 / 255],\n  red: [255 / 255, 0 / 255, 0 / 255],\n  purple: [128 / 255, 0 / 255, 128 / 255],\n  fuchsia: [255 / 255, 0 / 255, 255 / 255],\n  green: [0 / 255, 128 / 255, 0 / 255],\n  lime: [0 / 255, 255 / 255, 0 / 255],\n  olive: [128 / 255, 128 / 255, 0 / 255],\n  yellow: [255 / 255, 255 / 255, 0 / 255],\n  navy: [0 / 255, 0 / 255, 128 / 255],\n  blue: [0 / 255, 0 / 255, 255 / 255],\n  teal: [0 / 255, 128 / 255, 128 / 255],\n  aqua: [0 / 255, 255 / 255, 255 / 255],\n  // extended color keywords\n  aliceblue: [240 / 255, 248 / 255, 255 / 255],\n  antiquewhite: [250 / 255, 235 / 255, 215 / 255],\n  // 'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],\n  aquamarine: [127 / 255, 255 / 255, 212 / 255],\n  azure: [240 / 255, 255 / 255, 255 / 255],\n  beige: [245 / 255, 245 / 255, 220 / 255],\n  bisque: [255 / 255, 228 / 255, 196 / 255],\n  // 'black': [ 0 / 255, 0 / 255, 0 / 255 ],\n  blanchedalmond: [255 / 255, 235 / 255, 205 / 255],\n  // 'blue': [ 0 / 255, 0 / 255, 255 / 255 ],\n  blueviolet: [138 / 255, 43 / 255, 226 / 255],\n  brown: [165 / 255, 42 / 255, 42 / 255],\n  burlywood: [222 / 255, 184 / 255, 135 / 255],\n  cadetblue: [95 / 255, 158 / 255, 160 / 255],\n  chartreuse: [127 / 255, 255 / 255, 0 / 255],\n  chocolate: [210 / 255, 105 / 255, 30 / 255],\n  coral: [255 / 255, 127 / 255, 80 / 255],\n  cornflowerblue: [100 / 255, 149 / 255, 237 / 255],\n  cornsilk: [255 / 255, 248 / 255, 220 / 255],\n  crimson: [220 / 255, 20 / 255, 60 / 255],\n  cyan: [0 / 255, 255 / 255, 255 / 255],\n  darkblue: [0 / 255, 0 / 255, 139 / 255],\n  darkcyan: [0 / 255, 139 / 255, 139 / 255],\n  darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],\n  darkgray: [169 / 255, 169 / 255, 169 / 255],\n  darkgreen: [0 / 255, 100 / 255, 0 / 255],\n  darkgrey: [169 / 255, 169 / 255, 169 / 255],\n  darkkhaki: [189 / 255, 183 / 255, 107 / 255],\n  darkmagenta: [139 / 255, 0 / 255, 139 / 255],\n  darkolivegreen: [85 / 255, 107 / 255, 47 / 255],\n  darkorange: [255 / 255, 140 / 255, 0 / 255],\n  darkorchid: [153 / 255, 50 / 255, 204 / 255],\n  darkred: [139 / 255, 0 / 255, 0 / 255],\n  darksalmon: [233 / 255, 150 / 255, 122 / 255],\n  darkseagreen: [143 / 255, 188 / 255, 143 / 255],\n  darkslateblue: [72 / 255, 61 / 255, 139 / 255],\n  darkslategray: [47 / 255, 79 / 255, 79 / 255],\n  darkslategrey: [47 / 255, 79 / 255, 79 / 255],\n  darkturquoise: [0 / 255, 206 / 255, 209 / 255],\n  darkviolet: [148 / 255, 0 / 255, 211 / 255],\n  deeppink: [255 / 255, 20 / 255, 147 / 255],\n  deepskyblue: [0 / 255, 191 / 255, 255 / 255],\n  dimgray: [105 / 255, 105 / 255, 105 / 255],\n  dimgrey: [105 / 255, 105 / 255, 105 / 255],\n  dodgerblue: [30 / 255, 144 / 255, 255 / 255],\n  firebrick: [178 / 255, 34 / 255, 34 / 255],\n  floralwhite: [255 / 255, 250 / 255, 240 / 255],\n  forestgreen: [34 / 255, 139 / 255, 34 / 255],\n  // 'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],\n  gainsboro: [220 / 255, 220 / 255, 220 / 255],\n  ghostwhite: [248 / 255, 248 / 255, 255 / 255],\n  gold: [255 / 255, 215 / 255, 0 / 255],\n  goldenrod: [218 / 255, 165 / 255, 32 / 255],\n  // 'gray': [ 128 / 255, 128 / 255, 128 / 255 ],\n  // 'green': [ 0 / 255, 128 / 255, 0 / 255 ],\n  greenyellow: [173 / 255, 255 / 255, 47 / 255],\n  grey: [128 / 255, 128 / 255, 128 / 255],\n  honeydew: [240 / 255, 255 / 255, 240 / 255],\n  hotpink: [255 / 255, 105 / 255, 180 / 255],\n  indianred: [205 / 255, 92 / 255, 92 / 255],\n  indigo: [75 / 255, 0 / 255, 130 / 255],\n  ivory: [255 / 255, 255 / 255, 240 / 255],\n  khaki: [240 / 255, 230 / 255, 140 / 255],\n  lavender: [230 / 255, 230 / 255, 250 / 255],\n  lavenderblush: [255 / 255, 240 / 255, 245 / 255],\n  lawngreen: [124 / 255, 252 / 255, 0 / 255],\n  lemonchiffon: [255 / 255, 250 / 255, 205 / 255],\n  lightblue: [173 / 255, 216 / 255, 230 / 255],\n  lightcoral: [240 / 255, 128 / 255, 128 / 255],\n  lightcyan: [224 / 255, 255 / 255, 255 / 255],\n  lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],\n  lightgray: [211 / 255, 211 / 255, 211 / 255],\n  lightgreen: [144 / 255, 238 / 255, 144 / 255],\n  lightgrey: [211 / 255, 211 / 255, 211 / 255],\n  lightpink: [255 / 255, 182 / 255, 193 / 255],\n  lightsalmon: [255 / 255, 160 / 255, 122 / 255],\n  lightseagreen: [32 / 255, 178 / 255, 170 / 255],\n  lightskyblue: [135 / 255, 206 / 255, 250 / 255],\n  lightslategray: [119 / 255, 136 / 255, 153 / 255],\n  lightslategrey: [119 / 255, 136 / 255, 153 / 255],\n  lightsteelblue: [176 / 255, 196 / 255, 222 / 255],\n  lightyellow: [255 / 255, 255 / 255, 224 / 255],\n  // 'lime': [ 0 / 255, 255 / 255, 0 / 255 ],\n  limegreen: [50 / 255, 205 / 255, 50 / 255],\n  linen: [250 / 255, 240 / 255, 230 / 255],\n  magenta: [255 / 255, 0 / 255, 255 / 255],\n  // 'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],\n  mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],\n  mediumblue: [0 / 255, 0 / 255, 205 / 255],\n  mediumorchid: [186 / 255, 85 / 255, 211 / 255],\n  mediumpurple: [147 / 255, 112 / 255, 219 / 255],\n  mediumseagreen: [60 / 255, 179 / 255, 113 / 255],\n  mediumslateblue: [123 / 255, 104 / 255, 238 / 255],\n  mediumspringgreen: [0 / 255, 250 / 255, 154 / 255],\n  mediumturquoise: [72 / 255, 209 / 255, 204 / 255],\n  mediumvioletred: [199 / 255, 21 / 255, 133 / 255],\n  midnightblue: [25 / 255, 25 / 255, 112 / 255],\n  mintcream: [245 / 255, 255 / 255, 250 / 255],\n  mistyrose: [255 / 255, 228 / 255, 225 / 255],\n  moccasin: [255 / 255, 228 / 255, 181 / 255],\n  navajowhite: [255 / 255, 222 / 255, 173 / 255],\n  // 'navy': [ 0 / 255, 0 / 255, 128 / 255 ],\n  oldlace: [253 / 255, 245 / 255, 230 / 255],\n  // 'olive': [ 128 / 255, 128 / 255, 0 / 255 ],\n  olivedrab: [107 / 255, 142 / 255, 35 / 255],\n  orange: [255 / 255, 165 / 255, 0 / 255],\n  orangered: [255 / 255, 69 / 255, 0 / 255],\n  orchid: [218 / 255, 112 / 255, 214 / 255],\n  palegoldenrod: [238 / 255, 232 / 255, 170 / 255],\n  palegreen: [152 / 255, 251 / 255, 152 / 255],\n  paleturquoise: [175 / 255, 238 / 255, 238 / 255],\n  palevioletred: [219 / 255, 112 / 255, 147 / 255],\n  papayawhip: [255 / 255, 239 / 255, 213 / 255],\n  peachpuff: [255 / 255, 218 / 255, 185 / 255],\n  peru: [205 / 255, 133 / 255, 63 / 255],\n  pink: [255 / 255, 192 / 255, 203 / 255],\n  plum: [221 / 255, 160 / 255, 221 / 255],\n  powderblue: [176 / 255, 224 / 255, 230 / 255],\n  // 'purple': [ 128 / 255, 0 / 255, 128 / 255 ],\n  // 'red': [ 255 / 255, 0 / 255, 0 / 255 ],\n  rosybrown: [188 / 255, 143 / 255, 143 / 255],\n  royalblue: [65 / 255, 105 / 255, 225 / 255],\n  saddlebrown: [139 / 255, 69 / 255, 19 / 255],\n  salmon: [250 / 255, 128 / 255, 114 / 255],\n  sandybrown: [244 / 255, 164 / 255, 96 / 255],\n  seagreen: [46 / 255, 139 / 255, 87 / 255],\n  seashell: [255 / 255, 245 / 255, 238 / 255],\n  sienna: [160 / 255, 82 / 255, 45 / 255],\n  // 'silver': [ 192 / 255, 192 / 255, 192 / 255 ],\n  skyblue: [135 / 255, 206 / 255, 235 / 255],\n  slateblue: [106 / 255, 90 / 255, 205 / 255],\n  slategray: [112 / 255, 128 / 255, 144 / 255],\n  slategrey: [112 / 255, 128 / 255, 144 / 255],\n  snow: [255 / 255, 250 / 255, 250 / 255],\n  springgreen: [0 / 255, 255 / 255, 127 / 255],\n  steelblue: [70 / 255, 130 / 255, 180 / 255],\n  tan: [210 / 255, 180 / 255, 140 / 255],\n  // 'teal': [ 0 / 255, 128 / 255, 128 / 255 ],\n  thistle: [216 / 255, 191 / 255, 216 / 255],\n  tomato: [255 / 255, 99 / 255, 71 / 255],\n  turquoise: [64 / 255, 224 / 255, 208 / 255],\n  violet: [238 / 255, 130 / 255, 238 / 255],\n  wheat: [245 / 255, 222 / 255, 179 / 255],\n  // 'white': [ 255 / 255, 255 / 255, 255 / 255 ],\n  whitesmoke: [245 / 255, 245 / 255, 245 / 255],\n  // 'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],\n  yellowgreen: [154 / 255, 205 / 255, 50 / 255]\n}\n\nmodule.exports = cssColors\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/cssColors.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/hexToRgb.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/hexToRgb.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Converts CSS color notations (string of hex values) to RGB values.\n *\n * @see https://www.w3.org/TR/css-color-3/\n * @param {String} notation - color notation\n * @return {Array} RGB color values\n * @alias module:modeling/colors.hexToRgb\n *\n * @example\n * let mysphere = colorize(hexToRgb('#000080'), sphere()) // navy blue\n */\nconst hexToRgb = (notation) => {\n  notation = notation.replace('#', '')\n  if (notation.length < 6) throw new Error('the given notation must contain 3 or more hex values')\n\n  const r = parseInt(notation.substring(0, 2), 16) / 255\n  const g = parseInt(notation.substring(2, 4), 16) / 255\n  const b = parseInt(notation.substring(4, 6), 16) / 255\n  if (notation.length >= 8) {\n    const a = parseInt(notation.substring(6, 8), 16) / 255\n    return [r, g, b, a]\n  }\n  return [r, g, b]\n}\n\nmodule.exports = hexToRgb\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/hexToRgb.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/hslToRgb.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/hslToRgb.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst hueToColorComponent = __webpack_require__(/*! ./hueToColorComponent */ \"./node_modules/@jscad/modeling/src/colors/hueToColorComponent.js\")\n\n/**\n * Converts HSL color values to RGB color values.\n *\n * @see http://en.wikipedia.org/wiki/HSL_color_space.\n * @param {...Number|Array} values - HSL or HSLA color values\n * @return {Array} RGB or RGBA color values\n * @alias module:modeling/colors.hslToRgb\n *\n * @example\n * let mysphere = colorize(hslToRgb([0.9166666666666666, 1, 0.5]), sphere())\n */\nconst hslToRgb = (...values) => {\n  values = flatten(values)\n  if (values.length < 3) throw new Error('values must contain H, S and L values')\n\n  const h = values[0]\n  const s = values[1]\n  const l = values[2]\n\n  let r = l // default is achromatic\n  let g = l\n  let b = l\n\n  if (s !== 0) {\n    const q = l < 0.5 ? l * (1 + s) : l + s - l * s\n    const p = 2 * l - q\n    r = hueToColorComponent(p, q, h + 1 / 3)\n    g = hueToColorComponent(p, q, h)\n    b = hueToColorComponent(p, q, h - 1 / 3)\n  }\n\n  if (values.length > 3) {\n    // add alpha value if provided\n    const a = values[3]\n    return [r, g, b, a]\n  }\n  return [r, g, b]\n}\n\nmodule.exports = hslToRgb\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/hslToRgb.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/hsvToRgb.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/hsvToRgb.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\n/**\n * Converts HSV color values to RGB color values.\n *\n * @see http://en.wikipedia.org/wiki/HSV_color_space.\n * @param {...Number|Array} values - HSV or HSVA color values\n * @return {Array} RGB or RGBA color values\n * @alias module:modeling/colors.hsvToRgb\n *\n * @example\n * let mysphere = colorize(hsvToRgb([0.9166666666666666, 1, 1]), sphere())\n */\nconst hsvToRgb = (...values) => {\n  values = flatten(values)\n  if (values.length < 3) throw new Error('values must contain H, S and V values')\n\n  const h = values[0]\n  const s = values[1]\n  const v = values[2]\n\n  let r = 0\n  let g = 0\n  let b = 0\n\n  const i = Math.floor(h * 6)\n  const f = h * 6 - i\n  const p = v * (1 - s)\n  const q = v * (1 - f * s)\n  const t = v * (1 - (1 - f) * s)\n\n  switch (i % 6) {\n    case 0:\n      r = v\n      g = t\n      b = p\n      break\n    case 1:\n      r = q\n      g = v\n      b = p\n      break\n    case 2:\n      r = p\n      g = v\n      b = t\n      break\n    case 3:\n      r = p\n      g = q\n      b = v\n      break\n    case 4:\n      r = t\n      g = p\n      b = v\n      break\n    case 5:\n      r = v\n      g = p\n      b = q\n      break\n  }\n\n  if (values.length > 3) {\n    // add alpha value if provided\n    const a = values[3]\n    return [r, g, b, a]\n  }\n  return [r, g, b]\n}\n\nmodule.exports = hsvToRgb\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/hsvToRgb.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/hueToColorComponent.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/hueToColorComponent.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert hue values to a color component (ie one of r, g, b)\n * @param  {Number} p\n * @param  {Number} q\n * @param  {Number} t\n * @alias module:modeling/colors.hueToColorComponent\n */\nconst hueToColorComponent = (p, q, t) => {\n  if (t < 0) t += 1\n  if (t > 1) t -= 1\n  if (t < 1 / 6) return p + (q - p) * 6 * t\n  if (t < 1 / 2) return q\n  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6\n  return p\n}\n\nmodule.exports = hueToColorComponent\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/hueToColorComponent.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be assigned a color (RGBA).\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/colors\n * @example\n * const { colorize, hexToRgb } = require('@jscad/modeling').colors\n */\nmodule.exports = {\n  colorize: __webpack_require__(/*! ./colorize */ \"./node_modules/@jscad/modeling/src/colors/colorize.js\"),\n  colorNameToRgb: __webpack_require__(/*! ./colorNameToRgb */ \"./node_modules/@jscad/modeling/src/colors/colorNameToRgb.js\"),\n  cssColors: __webpack_require__(/*! ./cssColors */ \"./node_modules/@jscad/modeling/src/colors/cssColors.js\"),\n  hexToRgb: __webpack_require__(/*! ./hexToRgb */ \"./node_modules/@jscad/modeling/src/colors/hexToRgb.js\"),\n  hslToRgb: __webpack_require__(/*! ./hslToRgb */ \"./node_modules/@jscad/modeling/src/colors/hslToRgb.js\"),\n  hsvToRgb: __webpack_require__(/*! ./hsvToRgb */ \"./node_modules/@jscad/modeling/src/colors/hsvToRgb.js\"),\n  hueToColorComponent: __webpack_require__(/*! ./hueToColorComponent */ \"./node_modules/@jscad/modeling/src/colors/hueToColorComponent.js\"),\n  rgbToHex: __webpack_require__(/*! ./rgbToHex */ \"./node_modules/@jscad/modeling/src/colors/rgbToHex.js\"),\n  rgbToHsl: __webpack_require__(/*! ./rgbToHsl */ \"./node_modules/@jscad/modeling/src/colors/rgbToHsl.js\"),\n  rgbToHsv: __webpack_require__(/*! ./rgbToHsv */ \"./node_modules/@jscad/modeling/src/colors/rgbToHsv.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/rgbToHex.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/rgbToHex.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\n/**\n * Convert the given RGB color values to CSS color notation (string)\n * @see https://www.w3.org/TR/css-color-3/\n * @param {...Number|Array} values - RGB or RGBA color values\n * @return {String} CSS color notation\n * @alias module:modeling/colors.rgbToHex\n */\nconst rgbToHex = (...values) => {\n  values = flatten(values)\n  if (values.length < 3) throw new Error('values must contain R, G and B values')\n\n  const r = values[0] * 255\n  const g = values[1] * 255\n  const b = values[2] * 255\n\n  let s = `#${Number(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).substring(1, 7)}`\n\n  if (values.length > 3) {\n    // convert alpha to opacity\n    s = s + Number(values[3] * 255).toString(16)\n  }\n  return s\n}\n\nmodule.exports = rgbToHex\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/rgbToHex.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/rgbToHsl.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/rgbToHsl.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\n/**\n * Converts an RGB color value to HSL.\n *\n * @see http://en.wikipedia.org/wiki/HSL_color_space.\n * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c\n * @param {...Number|Array} values - RGB or RGBA color values\n * @return {Array} HSL or HSLA color values\n * @alias module:modeling/colors.rgbToHsl\n */\nconst rgbToHsl = (...values) => {\n  values = flatten(values)\n  if (values.length < 3) throw new Error('values must contain R, G and B values')\n\n  const r = values[0]\n  const g = values[1]\n  const b = values[2]\n\n  const max = Math.max(r, g, b)\n  const min = Math.min(r, g, b)\n  let h\n  let s\n  const l = (max + min) / 2\n\n  if (max === min) {\n    h = s = 0 // achromatic\n  } else {\n    const d = max - min\n    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)\n    switch (max) {\n      case r:\n        h = (g - b) / d + (g < b ? 6 : 0)\n        break\n      case g:\n        h = (b - r) / d + 2\n        break\n      case b:\n        h = (r - g) / d + 4\n        break\n    }\n    h /= 6\n  }\n\n  if (values.length > 3) {\n    // add alpha value if provided\n    const a = values[3]\n    return [h, s, l, a]\n  }\n  return [h, s, l]\n}\n\nmodule.exports = rgbToHsl\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/rgbToHsl.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/colors/rgbToHsv.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/colors/rgbToHsv.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\n/**\n * Converts an RGB color value to HSV.\n *\n * @see http://en.wikipedia.org/wiki/HSV_color_space.\n * @param {...Number|Array} values - RGB or RGBA color values\n * @return {Array} HSV or HSVA color values\n * @alias module:modeling/colors.rgbToHsv\n */\nconst rgbToHsv = (...values) => {\n  values = flatten(values)\n  if (values.length < 3) throw new Error('values must contain R, G and B values')\n\n  const r = values[0]\n  const g = values[1]\n  const b = values[2]\n\n  const max = Math.max(r, g, b)\n  const min = Math.min(r, g, b)\n  let h\n  const v = max\n\n  const d = max - min\n  const s = max === 0 ? 0 : d / max\n\n  if (max === min) {\n    h = 0 // achromatic\n  } else {\n    switch (max) {\n      case r:\n        h = (g - b) / d + (g < b ? 6 : 0)\n        break\n      case g:\n        h = (b - r) / d + 2\n        break\n      case b:\n        h = (r - g) / d + 4\n        break\n    }\n    h /= 6\n  }\n\n  if (values.length > 3) {\n    // add alpha if provided\n    const a = values[3]\n    return [h, s, v, a]\n  }\n  return [h, s, v]\n}\n\nmodule.exports = rgbToHsv\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/colors/rgbToHsv.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/create.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Create a new connector.\n * A connector allows two objects to be connected at predefined positions.\n *\n * For example a servo motor and a servo horn can both have a connector called 'shaft'.\n * The horn can be moved and rotated to any position, and then the servo horn\n * is attached to the servo motor at the proper position, such that the two connectors match.\n * Connectors are children of the solid, transform-wise, so transformations are applied\n * to both solid and connector(s).  (parent => child relationship)\n *\n * @property {vec3} point - the position of the connector (relative to its parent)\n * @property {vec3} axis - the direction (unit vector) of the connector\n * @property {vec3} normal - the direction (unit vector) perpendicular to axis, that defines the \"12 o'clock\" orientation of the connector\n * @alias module:modeling/connectors.create\n *\n * @example\n * let myconnector = create()\n */\nconst create = () => ({ point: vec3.create(), axis: vec3.unit([0, 0, 1]), normal: vec3.unit([1, 0, 0]) })\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/fromPointAxisNormal.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/fromPointAxisNormal.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/connectors/create.js\")\n\n/**\n * Create a connector from the given point, axis and normal.\n * @param {vec3} point - the point of the connector, relative to the parent geometry\n * @param {vec3} axis - the axis (directional vector) of the connector\n * @param {vec3} normal - the normal (directional vector) of the connector, perpendicular to the axis\n * @returns {connector} a new connector\n * @alias module:modeling/connectors.fromPointsAxisNormal\n */\nconst fromPointAxisNormal = (point, axis, normal) => {\n  const connector = create()\n  connector.point = vec3.fromArray(point)\n  connector.axis = vec3.unit(axis)\n  connector.normal = vec3.unit(normal)\n  return connector\n}\n\nmodule.exports = fromPointAxisNormal\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/fromPointAxisNormal.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * @module modeling/connectors\n */\nmodule.exports = {\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/connectors/create.js\"),\n  // extends: require('./extends'),\n  fromPointAxisNormal: __webpack_require__(/*! ./fromPointAxisNormal */ \"./node_modules/@jscad/modeling/src/connectors/fromPointAxisNormal.js\"),\n  // normalize: require('./normalize'),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/connectors/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/connectors/transform.js\"),\n  transformationBetween: __webpack_require__(/*! ./transformationBetween */ \"./node_modules/@jscad/modeling/src/connectors/transformationBetween.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/toString.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/toString.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return a string representing the given connector.\n *\n * @param {connector} connector - the connector of reference\n * @returns {string} string representation\n * @alias module:modeling/connectors.toString\n */\nconst toString = (connector) => {\n  const point = connector.point\n  const axis = connector.axis\n  const normal = connector.normal\n  return `connector: point: [${point[0].toFixed(7)}, ${point[1].toFixed(7)}, ${point[2].toFixed(7)}],  axis: [${axis[0].toFixed(7)}, ${axis[1].toFixed(7)}, ${axis[2].toFixed(7)}], normal: [${normal[0].toFixed(7)}, ${normal[1].toFixed(7)}, ${normal[2].toFixed(7)}]`\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/transform.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/transform.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst fromPointAxisNormal = __webpack_require__(/*! ./fromPointAxisNormal */ \"./node_modules/@jscad/modeling/src/connectors/fromPointAxisNormal.js\")\n\n/**\n * Transform the give connector using the given matrix.\n * @param {mat4} matrix - a transform matrix\n * @param {connector} connector - the connector to transform\n * @returns {connector} a new connector\n * @alias module:modeling/connectors.transform\n */\nconst transform = (matrix, connector) => {\n  const newpoint = vec3.transform(matrix, connector.point)\n  const newaxis = vec3.subtract(\n    vec3.transform(matrix, vec3.add(connector.point, connector.axis)),\n    newpoint\n  )\n  const newnormal = vec3.subtract(\n    vec3.transform(matrix, vec3.add(connector.point, connector.normal)),\n    newpoint\n  )\n  return fromPointAxisNormal(newpoint, newaxis, newnormal)\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/connectors/transformationBetween.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/connectors/transformationBetween.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst plane = __webpack_require__(/*! ../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\nconst vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst OrthoNormalBasis = __webpack_require__(/*! ../maths/OrthoNormalBasis */ \"./node_modules/@jscad/modeling/src/maths/OrthoNormalBasis.js\")\n\nconst transform = __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/connectors/transform.js\")\n\n/**\n * Get the transformation matrix that connects the given connectors.\n * @param {Object} options\n * @param {Boolean} [options.mirror=false] - the 'axis' vectors should point in the same direction\n *  true: the 'axis' vectors should point in opposite direction\n * @param {Number} [options.normalRotation=0] - the angle (RADIANS) of rotation between the 'normal' vectors\n * @param {connector} from - connector from which to connect\n * @param {connector} to - connector to which to connected\n * @returns {mat4} - the matrix that transforms (connects) one connector to another\n * @alias module:modeling/connectors.transformationBetween\n */\nconst transformationBetween = (options, from, to) => {\n  const defaults = {\n    mirror: false,\n    normalRotation: 0\n  }\n  // mirror = !!mirror\n  const { mirror, normalRotation } = Object.assign({}, defaults, options)\n\n  // shift to the 0,0 origin\n  let matrix = mat4.fromTranslation(vec3.negate(from.point))\n\n  // align the axis\n  const axesplane = plane.fromPointsRandom(vec3.create(), from.axis, to.axis)\n  const axesbasis = new OrthoNormalBasis(axesplane)\n\n  let angle1 = vec2.angleRadians(axesbasis.to2D(from.axis))\n  let angle2 = vec2.angleRadians(axesbasis.to2D(to.axis))\n\n  let rotation = angle2 - angle1\n  if (mirror) rotation += Math.PI // 180 degrees\n\n  // TODO: understand and explain this\n  matrix = mat4.multiply(matrix, axesbasis.getProjectionMatrix())\n  matrix = mat4.multiply(matrix, mat4.fromZRotation(rotation))\n  matrix = mat4.multiply(matrix, axesbasis.getInverseProjectionMatrix())\n  const usAxesAligned = transform(matrix, from)\n  // Now we have done the transformation for aligning the axes.\n\n  // align the normals\n  const normalsplane = plane.fromNormalAndPoint(to.axis, vec3.create())\n  const normalsbasis = new OrthoNormalBasis(normalsplane)\n\n  angle1 = vec2.angleRadians(normalsbasis.to2D(usAxesAligned.normal))\n  angle2 = vec2.angleRadians(normalsbasis.to2D(to.normal))\n\n  rotation = angle2 - angle1 + normalRotation\n\n  matrix = mat4.multiply(matrix, normalsbasis.getProjectionMatrix())\n  matrix = mat4.multiply(matrix, mat4.fromZRotation(rotation))\n  matrix = mat4.multiply(matrix, normalsbasis.getInverseProjectionMatrix())\n\n  // translate to the destination point\n  matrix = mat4.multiply(matrix, mat4.fromTranslation(to.point))\n\n  return matrix\n}\n\nmodule.exports = transformationBetween\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/connectors/transformationBetween.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/curves/bezier/create.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/curves/bezier/create.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a bezier easing function.\n * @typedef {Object} bezier\n * @property {Array} points - The control points for the bezier curve. The first and last point will also be the start and end of the curve\n * @property {string} pointType - A reference to the type and dimensionality of the points that the curve was created from\n * @property {number} dimensions - The dimensionality of the bezier\n * @property {Array} permutations - A pre-calculation of the bezier algorithm's co-efficients\n * @property {Array} tangentPermutations - A pre-calculation of the bezier algorithm's tangent co-efficients\n *\n * @example\n * const b = bezier.create([0,10]) // a linear progression from 0 to 10\n * const b = bezier.create([0, 0, 10, 10]) // a symmetrical cubic easing curve that starts slowly and ends slowly from 0 to 10\n * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling\n * Usage:\n * let position = bezier.valueAt(t,b) // where 0 < t < 1\n * let tangent = bezier.tangentAt(t,b) // where 0 < t < 1\n *\n */\n\n/**\n * Creates an object representing a bezier easing curve. Can have both an arbitrary number of control points, and an arbitrary number of dimensions.\n *\n * @example\n * const b = bezier.create([0,10]) // a linear progression from 0 to 10\n * const b = bezier.create([0, 0, 10, 10]) // a symmetrical cubic easing curve that starts slowly and ends slowly from 0 to 10\n * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling\n *\n * @param {Array} points An array with at least 2 elements of either all numbers, or all arrays of numbers that are the same size.\n * @returns {bezier} a new bezier data object\n * @alias module:modeling/curves/bezier.create\n */\nconst create = (points) => {\n  if (!Array.isArray(points)) throw new Error('Bezier points must be a valid array/')\n  if (points.length < 2) throw new Error('Bezier points must contain at least 2 values.')\n  const pointType = getPointType(points)\n\n  return {\n    points: points,\n    pointType: pointType,\n    dimensions: pointType === 'float_single' ? 0 : points[0].length,\n    permutations: getPermutations(points.length - 1),\n    tangentPermutations: getPermutations(points.length - 2)\n  }\n}\n\nconst getPointType = function (points) {\n  let firstPointType = null\n  points.forEach(point => {\n    let pType = ''\n    if (Number.isFinite(point)) {\n      pType = 'float_single'\n    } else if (Array.isArray(point)) {\n      point.forEach(val => {\n        if (!Number.isFinite(val)) throw new Error('Bezier point values must all be numbers.')\n      })\n      pType = 'float_' + point.length\n    } else throw new Error('Bezier points must all be numbers or arrays of number.')\n    if (firstPointType == null) {\n      firstPointType = pType\n    } else {\n      if (firstPointType !== pType) {\n        throw new Error('Bezier points must be either all numbers or all arrays of numbers of the same size.')\n      }\n    }\n  })\n  return firstPointType\n}\n\nconst getPermutations = function (c) {\n  const permutations = []\n  for (let i = 0; i <= c; i++) {\n    permutations.push(factorial(c) / (factorial(i) * factorial(c - i)))\n  }\n  return permutations\n}\n\nconst factorial = function (b) {\n  let out = 1\n  for (let i = 2; i <= b; i++) {\n    out *= i\n  }\n  return out\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/curves/bezier/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/curves/bezier/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/curves/bezier/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a bezier easing function.\n * @see {@link bezier} for data structure information.\n * @module modeling/curves/bezier\n */\nmodule.exports = {\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/curves/bezier/create.js\"),\n  valueAt: __webpack_require__(/*! ./valueAt */ \"./node_modules/@jscad/modeling/src/curves/bezier/valueAt.js\"),\n  tangentAt: __webpack_require__(/*! ./tangentAt */ \"./node_modules/@jscad/modeling/src/curves/bezier/tangentAt.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/curves/bezier/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/curves/bezier/tangentAt.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/curves/bezier/tangentAt.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the tangent at a specific point along a bezier easing curve.\n * For multidimensional curves, the tangent is the slope of each dimension at that point.\n * See the bezier_extrudeAlongPath.js example to see this in use.\n *\n * @example\n * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling\n * let tangent = bezier.tangentAt(t,b) // where 0 < t < 1\n *\n * @param {number} t The position that you want the bezier's tangent value at.\n * @param {Object} bezier An array with at least 2 elements of either all numbers, or all arrays of numbers that are the same size.\n * @returns {array | number} the tangent at the position.\n * @alias module:modeling/curves/bezier.tangentAt\n */\nconst tangentAt = (t, bezier) => {\n  if (t < 0 || t > 1) {\n    throw new Error('Bezier tangentAt() input must be between 0 and 1')\n  }\n  if (bezier.pointType === 'float_single') {\n    return bezierTangent(bezier, bezier.points, t)\n  } else {\n    const result = []\n    for (let i = 0; i < bezier.dimensions; i++) {\n      const singleDimensionPoints = []\n      for (let j = 0; j < bezier.points.length; j++) {\n        singleDimensionPoints.push(bezier.points[j][i])\n      }\n      result.push(bezierTangent(bezier, singleDimensionPoints, t))\n    }\n    return result\n  }\n}\n\nconst bezierTangent = function (bezier, p, t) {\n  // from https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-der.html\n  const n = p.length - 1\n  let result = 0\n  for (let i = 0; i < n; i++) {\n    const q = n * (p[i + 1] - p[i])\n    result += bezier.tangentPermutations[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i) * q\n  }\n  return result\n}\n\nmodule.exports = tangentAt\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/curves/bezier/tangentAt.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/curves/bezier/valueAt.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/curves/bezier/valueAt.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the position at a specific point along a bezier easing curve.\n * For multidimensional curves, the tangent is the slope of each dimension at that point.\n * See the bezier_extrudeAlongPath.js example to see this in use.\n * Math and explanation comes from {@link https://www.freecodecamp.org/news/nerding-out-with-bezier-curves-6e3c0bc48e2f/}\n *\n * @example\n * const b = bezier.create([0,0,0], [0,5,10], [10,0,-5], [10,10,10]]) // a cubic 3 dimensional easing curve that can generate position arrays for modelling\n * let position = bezier.valueAt(t,b) // where 0 < t < 1\n *\n * @param {number} t The position that you want the bezier's tangent value at.\n * @param {Object} bezier A bezier curve created with bezier.create().\n * @returns {array | number} the tangent at the position t.\n * @alias module:modeling/curves/bezier.valueAt\n */\nconst valueAt = (t, bezier) => {\n  if (t < 0 || t > 1) {\n    throw new Error('Bezier valueAt() input must be between 0 and 1')\n  }\n  if (bezier.pointType === 'float_single') {\n    return bezierFunction(bezier, bezier.points, t)\n  } else {\n    const result = []\n    for (let i = 0; i < bezier.dimensions; i++) {\n      const singleDimensionPoints = []\n      for (var j = 0; j < bezier.points.length; j++) {\n        singleDimensionPoints.push(bezier.points[j][i])\n      }\n      result.push(bezierFunction(bezier, singleDimensionPoints, t))\n    }\n    return result\n  }\n}\n\nconst bezierFunction = function (bezier, p, t) {\n  const n = p.length - 1\n  let result = 0\n  for (let i = 0; i <= n; i++) {\n    result += bezier.permutations[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * p[i]\n  }\n  return result\n}\n\nmodule.exports = valueAt\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/curves/bezier/valueAt.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/curves/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/curves/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Curves are n-dimensional mathematical constructs that define a path from point 0 to point 1\n * @module modeling/curves\n * @example\n * const { bezier } = require('@jscad/modeling').curves\n\n */\nmodule.exports = {\n  bezier: __webpack_require__(/*! ./bezier */ \"./node_modules/@jscad/modeling/src/curves/bezier/index.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/curves/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/applyTransforms.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/applyTransforms.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\n/*\n * Apply the transforms of the given geometry.\n * NOTE: This function must be called BEFORE exposing any data. See toSides().\n * @param {geom2} geometry - the geometry to transform\n * @returns {geom2} the given geometry\n *\n * @example\n * geometry = applyTransforms(geometry)\n */\nconst applyTransforms = (geometry) => {\n  if (mat4.equals(geometry.transforms, mat4.identity())) return geometry\n\n  // apply transforms to each side\n  geometry.sides = geometry.sides.map((side) => {\n    const p0 = vec2.transform(geometry.transforms, side[0])\n    const p1 = vec2.transform(geometry.transforms, side[1])\n    return [p0, p1]\n  })\n  mat4.identity(geometry.transforms)\n  return geometry\n}\n\nmodule.exports = applyTransforms\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/applyTransforms.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/clone.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/clone.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\")\n\n/**\n * Performs a deep clone of the given geometry.\n * @param {geom2} geometry - the geometry to clone\n * @returns {geom2} new geometry\n * @alias module:modeling/geometries/geom2.clone\n */\nconst clone = (geometry) => {\n  const out = create()\n  out.sides = geometry.sides.map((side) => [vec2.clone(side[0]), vec2.clone(side[1])])\n  out.transforms = mat4.clone(geometry.transforms)\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/create.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\n/**\n * Represents a 2D geometry consisting of a list of sides.\n * @typedef {Object} geom2\n * @property {Array} sides - list of sides, each side containing two points\n * @property {mat4} transforms - transforms to apply to the sides, see transform()\n */\n\n/**\n * Create a new 2D geometry composed of unordered sides (two connected points).\n * @param {Array} [sides] - list of sides where each side is an array of two points\n * @returns {geom2} a new empty geometry\n * @alias module:modeling/geometries/geom2.create\n */\nconst create = (sides) => {\n  if (sides === undefined) {\n    sides = [] // empty contents\n  }\n  return {\n    sides: sides,\n    transforms: mat4.identity()\n  }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/fromCompactBinary.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/fromCompactBinary.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\")\n\n/**\n * Create a new 2D geometry from the given compact binary data.\n * @param {Array} data - compact binary data\n * @returns {geom2} a new geometry\n * @alias module:modeling/geometries/geom2.fromCompactBinary\n */\nconst fromCompactBinary = (data) => {\n  if (data[0] !== 0) throw new Error('invalid compact binary data')\n\n  const created = create()\n\n  created.transforms = mat4.clone(data.slice(1, 17))\n\n  for (let i = 21; i < data.length; i += 4) {\n    const point0 = vec2.fromValues(data[i + 0], data[i + 1])\n    const point1 = vec2.fromValues(data[i + 2], data[i + 3])\n    created.sides.push([point0, point1])\n  }\n  // transfer known properties, i.e. color\n  if (data[17] >= 0) {\n    created.color = [data[17], data[18], data[19], data[20]]\n  }\n  // TODO: how about custom properties or fields ?\n  return created\n}\n\nmodule.exports = fromCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/fromCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/fromPoints.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/fromPoints.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\")\n\n/**\n * Create a new 2D geometry from the given points.\n * The direction (rotation) of the points is not relevant,\n * as the points can define a convex or a concave polygon.\n * The geometry must not self intersect, i.e. the sides cannot cross.\n * @param {Array} points - list of points in 2D space where each point is an array of two values\n * @returns {geom2} a new geometry\n * @alias module:modeling/geometries/geom2.fromPoints\n */\nconst fromPoints = (points) => {\n  if (!Array.isArray(points)) {\n    throw new Error('the given points must be an array')\n  }\n  if (points.length < 3) {\n    throw new Error('the given points must define a closed geometry with three or more points')\n  }\n\n  const sides = []\n  let prevpoint = points[points.length - 1]\n  points.forEach((point) => {\n    sides.push([vec2.fromArray(prevpoint), vec2.fromArray(point)])\n    prevpoint = point\n  })\n  return create(sides)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a 2D geometry consisting of a list of sides.\n * @see {@link geom2} for data structure information.\n * @module modeling/geometries/geom2\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/geom2/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/geom2/fromPoints.js\"),\n  fromCompactBinary: __webpack_require__(/*! ./fromCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/geom2/fromCompactBinary.js\"),\n  isA: __webpack_require__(/*! ./isA */ \"./node_modules/@jscad/modeling/src/geometries/geom2/isA.js\"),\n  reverse: __webpack_require__(/*! ./reverse */ \"./node_modules/@jscad/modeling/src/geometries/geom2/reverse.js\"),\n  toOutlines: __webpack_require__(/*! ./toOutlines */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toOutlines.js\"),\n  toPoints: __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toPoints.js\"),\n  toSides: __webpack_require__(/*! ./toSides */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toString.js\"),\n  toCompactBinary: __webpack_require__(/*! ./toCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toCompactBinary.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/geometries/geom2/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/isA.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/isA.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Determin if the given object is a 2D geometry.\n * @param {Object} object - the object to interogate\n * @returns {Boolean} true, if the object matches a geom2 based object\n * @alias module:modeling/geometries/geom2.isA\n */\nconst isA = (object) => {\n  if (object && typeof object === 'object') {\n    if ('sides' in object && 'transforms' in object) {\n      if (Array.isArray(object.sides) && 'length' in object.transforms) {\n        return true\n      }\n    }\n  }\n  return false\n}\n\nmodule.exports = isA\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/isA.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/reverse.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/reverse.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\")\nconst toSides = __webpack_require__(/*! ./toSides */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js\")\n\n/**\n * Reverses the given geometry so that the sides are flipped in the opposite order.\n * This swaps the left (interior) and right (exterior) edges.\n * @param {geom2} geometry - the geometry to reverse\n * @returns {geom2} the new reversed geometry\n * @alias module:modeling/geometries/geom2.reverse\n *\n * @example\n * let newgeometry = reverse(geometry)\n */\nconst reverse = (geometry) => {\n  const oldsides = toSides(geometry)\n\n  const newsides = oldsides.map((side) => [side[1], side[0]])\n  newsides.reverse() // is this required?\n  return create(newsides)\n}\n\nmodule.exports = reverse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/reverse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/toCompactBinary.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/toCompactBinary.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Produces a compact binary representation from the given geometry.\n * @param {geom2} geometry - the geometry\n * @returns {TypedArray} compact binary representation\n * @alias module:modeling/geometries/geom2.toCompactBinary\n */\nconst toCompactBinary = (geom) => {\n  const sides = geom.sides\n  const transforms = geom.transforms\n  let color = [-1, -1, -1, -1]\n  if (geom.color) color = geom.color\n\n  // FIXME why Float32Array?\n  const compacted = new Float32Array(1 + 16 + 4 + (sides.length * 4)) // type + transforms + color + sides data\n\n  compacted[0] = 0 // type code: 0 => geom2, 1 => geom3 , 2 => path2\n\n  compacted[1] = transforms[0]\n  compacted[2] = transforms[1]\n  compacted[3] = transforms[2]\n  compacted[4] = transforms[3]\n  compacted[5] = transforms[4]\n  compacted[6] = transforms[5]\n  compacted[7] = transforms[6]\n  compacted[8] = transforms[7]\n  compacted[9] = transforms[8]\n  compacted[10] = transforms[9]\n  compacted[11] = transforms[10]\n  compacted[12] = transforms[11]\n  compacted[13] = transforms[12]\n  compacted[14] = transforms[13]\n  compacted[15] = transforms[14]\n  compacted[16] = transforms[15]\n\n  compacted[17] = color[0]\n  compacted[18] = color[1]\n  compacted[19] = color[2]\n  compacted[20] = color[3]\n\n  for (let i = 0; i < sides.length; i++) {\n    const ci = i * 4 + 21\n    const point0 = sides[i][0]\n    const point1 = sides[i][1]\n    compacted[ci + 0] = point0[0]\n    compacted[ci + 1] = point0[1]\n    compacted[ci + 2] = point1[0]\n    compacted[ci + 3] = point1[1]\n  }\n  // TODO: how about custom properties or fields ?\n  return compacted\n}\n\nmodule.exports = toCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/toCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/toOutlines.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/toOutlines.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst toSides = __webpack_require__(/*! ./toSides */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js\")\n\n/*\n * Create a list of edges which SHARE vertices.\n * This allows the edges to be traversed in order.\n */\nconst toEdges = (sides) => {\n  const uniquevertices = []\n  const getUniqueVertex = (vertex) => {\n    const i = uniquevertices.findIndex((v) => vec2.equals(v, vertex))\n    if (i < 0) {\n      uniquevertices.push(vertex)\n      return vertex\n    }\n    return uniquevertices[i]\n  }\n\n  const edges = []\n  sides.forEach((side) => {\n    edges.push([getUniqueVertex(side[0]), getUniqueVertex(side[1])])\n  })\n  return edges\n}\n\n/**\n * Create the outline(s) of the given geometry.\n * @param  {geom2} geometry\n * @returns {Array} an array of outlines, where each outline is an array of ordered points\n * @alias module:modeling/geometries/geom2.toOutlines\n *\n * @example\n * let geometry = subtract(rectangle({size: [5, 5]}), rectangle({size: [3, 3]}))\n * let outlines = toOutlines(geometry) // returns two outlines\n */\nconst toOutlines = (geometry) => {\n  const vertexMap = new Map()\n  const edges = toEdges(toSides(geometry))\n  edges.forEach((edge) => {\n    if (!(vertexMap.has(edge[0]))) {\n      vertexMap.set(edge[0], [])\n    }\n    const sideslist = vertexMap.get(edge[0])\n    sideslist.push(edge)\n  })\n\n  const outlines = []\n  while (true) {\n    let startside\n    for (const [vertex, edges] of vertexMap) {\n      startside = edges.shift()\n      if (!startside) {\n        vertexMap.delete(vertex)\n        continue\n      }\n      break\n    }\n    if (startside === undefined) break // all starting sides have been visited\n\n    const connectedVertexPoints = []\n    const startvertex = startside[0]\n    while (true) {\n      connectedVertexPoints.push(startside[0])\n      const nextvertex = startside[1]\n      if (nextvertex === startvertex) break // the outline has been closed\n      const nextpossiblesides = vertexMap.get(nextvertex)\n      if (!nextpossiblesides) {\n        throw new Error('the given geometry is not closed. verify proper construction')\n      }\n      let nextsideindex = -1\n      if (nextpossiblesides.length === 1) {\n        nextsideindex = 0\n      } else {\n        // more than one side starting at the same vertex\n        let bestangle\n        const startangle = vec2.angleDegrees(vec2.subtract(startside[1], startside[0]))\n        for (let sideindex = 0; sideindex < nextpossiblesides.length; sideindex++) {\n          const nextpossibleside = nextpossiblesides[sideindex]\n          const nextangle = vec2.angleDegrees(vec2.subtract(nextpossibleside[1], nextpossibleside[0]))\n          let angledif = nextangle - startangle\n          if (angledif < -180) angledif += 360\n          if (angledif >= 180) angledif -= 360\n          if ((nextsideindex < 0) || (angledif > bestangle)) {\n            nextsideindex = sideindex\n            bestangle = angledif\n          }\n        }\n      }\n      const nextside = nextpossiblesides[nextsideindex]\n      nextpossiblesides.splice(nextsideindex, 1) // remove side from list\n      if (nextpossiblesides.length === 0) {\n        vertexMap.delete(nextvertex)\n      }\n      startside = nextside\n    } // inner loop\n\n    // due to the logic of fromPoints()\n    // move the first point to the last\n    if (connectedVertexPoints.length > 0) {\n      connectedVertexPoints.push(connectedVertexPoints.shift())\n    }\n    outlines.push(connectedVertexPoints)\n  } // outer loop\n  vertexMap.clear()\n  return outlines\n}\n\nmodule.exports = toOutlines\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/toOutlines.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/toPoints.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/toPoints.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const toSides = __webpack_require__(/*! ./toSides */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js\")\n\n/**\n * Produces an array of points from the given geometry.\n * The returned array should not be modified as the points are shared with the geometry.\n * NOTE: The points returned do NOT define an order. Use toOutlines() for ordered points.\n * @param {geom2} geometry - the geometry\n * @returns {Array} an array of points\n * @alias module:modeling/geometries/geom2.toPoints\n *\n * @example\n * let sharedpoints = toPoints(geometry)\n */\nconst toPoints = (geometry) => {\n  const sides = toSides(geometry)\n  const points = sides.map((side) => side[0])\n  // due to the logic of fromPoints()\n  // move the first point to the last\n  if (points.length > 0) {\n    points.push(points.shift())\n  }\n  return points\n}\n\nmodule.exports = toPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/toPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const applyTransforms = __webpack_require__(/*! ./applyTransforms */ \"./node_modules/@jscad/modeling/src/geometries/geom2/applyTransforms.js\")\n\n/**\n * Produces an array of sides from the given geometry.\n * The returned array should not be modified as the data is shared with the geometry.\n * @param {geom2} geometry - the geometry\n * @returns {Array} an array of sides\n * @alias module:modeling/geometries/geom2.toSides\n *\n * @example\n * let sharedsides = toSides(geometry)\n */\nconst toSides = (geometry) => applyTransforms(geometry).sides\n\nmodule.exports = toSides\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/toString.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/toString.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst toSides = __webpack_require__(/*! ./toSides */ \"./node_modules/@jscad/modeling/src/geometries/geom2/toSides.js\")\n\n/**\n * Create a string representing the contents of the given geometry.\n * @param {geom2} geometry - the geometry\n * @returns {String} a representive string\n * @alias module:modeling/geometries/geom2.toString\n *\n * @example\n * console.out(toString(geometry))\n */\nconst toString = (geometry) => {\n  const sides = toSides(geometry)\n  let result = 'geom2 (' + sides.length + ' sides):\\n[\\n'\n  sides.forEach((side) => {\n    result += '  [' + vec2.toString(side[0]) + ', ' + vec2.toString(side[1]) + ']\\n'\n  })\n  result += ']\\n'\n  return result\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom2/transform.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom2/transform.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom2/create.js\")\n\n/**\n * Transform the given geometry using the given matrix.\n * This is a lazy transform of the sides, as this function only adjusts the transforms.\n * The transforms are applied when accessing the sides via toSides().\n * @param {mat4} matrix - the matrix to transform with\n * @param {geom2} geometry - the geometry to transform\n * @returns {geom2} a new geometry\n * @alias module:modeling/geometries/geom2.transform\n *\n * @example\n * let newgeometry = transform(fromZRotation(degToRad(90)), geometry)\n */\nconst transform = (matrix, geometry) => {\n  const newgeometry = create(geometry.sides) // reuse the sides\n\n  newgeometry.transforms = mat4.multiply(matrix, geometry.transforms)\n  return newgeometry\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom2/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/applyTransforms.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/applyTransforms.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Apply the transforms of the given geometry.\n * NOTE: This function must be called BEFORE exposing any data. See toPolygons.\n * @param {geom3} geometry - the geometry to transform\n * @returns {geom3} the given geometry\n * @example\n * geometry = applyTransforms(geometry)\n */\nconst applyTransforms = (geometry) => {\n  if (mat4.equals(geometry.transforms, mat4.identity())) return geometry\n\n  // apply transforms to each polygon\n  // const isMirror = mat4.isMirroring(geometry.transforms)\n  // TBD if (isMirror) newvertices.reverse()\n  geometry.polygons = geometry.polygons.map((polygon) => poly3.transform(geometry.transforms, polygon))\n  mat4.identity(geometry.transforms)\n  return geometry\n}\n\nmodule.exports = applyTransforms\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/applyTransforms.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/clone.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/clone.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\")\n\n/**\n * Performs a deep clone of the given geometry.\n * @param {geom3} geometry - the geometry to clone\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.clone\n */\nconst clone = (geometry) => {\n  const out = create()\n  out.polygons = geometry.polygons.map((polygon) => poly3.clone(polygon))\n  out.isRetesselated = geometry.isRetesselated\n  out.transforms = mat4.clone(geometry.transforms)\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/create.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\n/**\n * Represents a 3D geometry consisting of a list of polygons.\n * @typedef {Object} geom3\n * @property {Array} polygons - list of polygons, each polygon containing three or more points\n * @property {Boolean} isRetesselated - true if retesselation has been performed\n * @property {mat4} transforms - transforms to apply to the sides, see transform()\n */\n\n/**\n * Create a new 3D geometry composed of polygons.\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.create\n */\nconst create = (polygons) => {\n  if (polygons === undefined) {\n    polygons = [] // empty contents\n  }\n  return {\n    polygons: polygons,\n    isRetesselated: false,\n    transforms: mat4.create()\n  }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/equals.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/equals.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst equals = (first, second) => {\n  if (first.isRetesselated !== second.isRetesselated) {\n    return false\n  }\n  if (!mat4.equals(first.transforms, second.transforms)) {\n    return false\n  }\n  if (first.polygons.length !== second.polygons.length) {\n    return false\n  }\n  for (let i = 0; i < first.polygons.length; i++) {\n    const p1 = first.polygons[i]\n    const p2 = second.polygons[i]\n    if (!poly3.equals(p1, p2)) {\n      return false\n    }\n  }\n\n  return true\n}\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/fromCompactBinary.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/fromCompactBinary.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\")\n\n/**\n * Construct a new 3D geometry from the given compact binary data.\n * @param {TypedArray} data - compact binary data\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.fromCompactBinary\n */\nconst fromCompactBinary = (data) => {\n  if (data[0] !== 1) throw new Error('invalid compact binary data')\n\n  const created = create()\n\n  created.transforms = mat4.clone(data.slice(1, 17))\n\n  created.isRetesselated = !!data[17]\n\n  const numberOfVertices = data[22]\n  let ci = 23\n  let vi = data.length - (numberOfVertices * 3)\n  while (vi < data.length) {\n    const verticesPerPolygon = data[ci]\n    ci++\n\n    const vertices = []\n    for (let i = 0; i < verticesPerPolygon; i++) {\n      vertices.push(vec3.fromValues(data[vi], data[vi + 1], data[vi + 2]))\n      vi += 3\n    }\n    created.polygons.push(poly3.create(vertices))\n  }\n\n  // transfer known properities, i.e. color\n  if (data[18] >= 0) {\n    created.color = [data[18], data[19], data[20], data[21]]\n  }\n  // TODO: how about custom properties or fields ?\n  return created\n}\n\nmodule.exports = fromCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/fromCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/fromPoints.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/fromPoints.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\")\n\n/**\n * Construct a new 3D geometry from a list of points.\n * The list of points should contain sub-arrays, each defining a single polygon of points.\n * In addition, the points should follow the right-hand rule for rotation in order to\n * define an external facing polygon.\n * @param {Array} listofpoints - list of lists, where each list is a set of points to construct a polygon\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.fromPoints\n */\nconst fromPoints = (listofpoints) => {\n  if (!Array.isArray(listofpoints)) {\n    throw new Error('the given points must be an array')\n  }\n\n  const polygons = listofpoints.map((points, index) => {\n    // TODO catch the error, and rethrow with index\n    const polygon = poly3.fromPoints(points)\n    return polygon\n  })\n  const result = create(polygons)\n  return result\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a 3D geometry consisting of a list of polygons.\n * @see {@link geom3} for data structure information.\n * @module modeling/geometries/geom3\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/geom3/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/geometries/geom3/equals.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/geom3/fromPoints.js\"),\n  fromCompactBinary: __webpack_require__(/*! ./fromCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/geom3/fromCompactBinary.js\"),\n  invert: __webpack_require__(/*! ./invert */ \"./node_modules/@jscad/modeling/src/geometries/geom3/invert.js\"),\n  isA: __webpack_require__(/*! ./isA */ \"./node_modules/@jscad/modeling/src/geometries/geom3/isA.js\"),\n  toPoints: __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toPoints.js\"),\n  toPolygons: __webpack_require__(/*! ./toPolygons */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toString.js\"),\n  toCompactBinary: __webpack_require__(/*! ./toCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toCompactBinary.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/geometries/geom3/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/invert.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/invert.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\")\nconst toPolygons = __webpack_require__(/*! ./toPolygons */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js\")\n\n/**\n * Invert the given geometry, transposing solid and empty space.\n * @params {geom3} geometry - the geometry to invert\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.invert\n */\nconst invert = (geometry) => {\n  const polygons = toPolygons(geometry)\n  const newpolygons = polygons.map((polygon) => poly3.invert(polygon))\n  return create(newpolygons)\n}\n\nmodule.exports = invert\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/invert.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/isA.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/isA.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Determin if the given object is a 3D geometry.\n * @param {object} object - the object to interogate\n * @returns {Boolean} true if the object matches a geom3\n * @alias module:modeling/geometries/geom3.isA\n */\nconst isA = (object) => {\n  if (object && typeof object === 'object') {\n    if ('polygons' in object && 'transforms' in object) {\n      if (Array.isArray(object.polygons) && 'length' in object.transforms) {\n        return true\n      }\n    }\n  }\n  return false\n}\n\nmodule.exports = isA\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/isA.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/toCompactBinary.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/toCompactBinary.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Return the given geometry in compact binary representation.\n * @param {geom3} geometry - the geometry\n * @return {TypedArray} compact binary representation\n * @alias module:modeling/geometries/geom3.toCompactBinary\n */\nconst toCompactBinary = (geom) => {\n  const polygons = geom.polygons\n  const transforms = geom.transforms\n\n  const numberOfPolygons = polygons.length\n  const numberOfVertices = polygons.reduce((count, polygon) => count + polygon.vertices.length, 0)\n  let color = [-1, -1, -1, -1]\n  if (geom.color) color = geom.color\n\n  // FIXME why Float32Array?\n  const compacted = new Float32Array(1 + 16 + 1 + 4 + 1 + numberOfPolygons + (numberOfVertices * 3))\n  // type + transforms + isRetesselated + color + numberOfPolygons + numberOfVerticesPerPolygon[] + vertices data[]\n\n  compacted[0] = 1 // type code: 0 => geom2, 1 => geom3 , 2 => path2\n\n  compacted[1] = transforms[0]\n  compacted[2] = transforms[1]\n  compacted[3] = transforms[2]\n  compacted[4] = transforms[3]\n  compacted[5] = transforms[4]\n  compacted[6] = transforms[5]\n  compacted[7] = transforms[6]\n  compacted[8] = transforms[7]\n  compacted[9] = transforms[8]\n  compacted[10] = transforms[9]\n  compacted[11] = transforms[10]\n  compacted[12] = transforms[11]\n  compacted[13] = transforms[12]\n  compacted[14] = transforms[13]\n  compacted[15] = transforms[14]\n  compacted[16] = transforms[15]\n\n  compacted[17] = geom.isRetesselated ? 1 : 0\n\n  compacted[18] = color[0]\n  compacted[19] = color[1]\n  compacted[20] = color[2]\n  compacted[21] = color[3]\n\n  compacted[22] = numberOfVertices\n\n  let ci = 23\n  let vi = ci + numberOfPolygons\n  polygons.forEach((polygon) => {\n    const points = poly3.toPoints(polygon)\n    // record the number of vertices per polygon\n    compacted[ci] = points.length\n    ci++\n    // convert the vertices\n    for (let i = 0; i < points.length; i++) {\n      const point = points[i]\n      compacted[vi + 0] = point[0]\n      compacted[vi + 1] = point[1]\n      compacted[vi + 2] = point[2]\n      vi += 3\n    }\n  })\n  // TODO: how about custom properties or fields ?\n  return compacted\n}\n\nmodule.exports = toCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/toCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/toPoints.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/toPoints.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst toPolygons = __webpack_require__(/*! ./toPolygons */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js\")\n\n/**\n * Return the given geometry as a list of points, after applying transforms.\n * The returned array should not be modified as the points are shared with the geometry.\n * @return {Array} list of points, where each sub-array represents a polygon\n * @alias module:modeling/geometries/geom3.toPoints\n */\nconst toPoints = (geometry) => {\n  const polygons = toPolygons(geometry)\n  const listofpoints = polygons.map((polygon) => poly3.toPoints(polygon))\n  return listofpoints\n}\n\nmodule.exports = toPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/toPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const applyTransforms = __webpack_require__(/*! ./applyTransforms */ \"./node_modules/@jscad/modeling/src/geometries/geom3/applyTransforms.js\")\n\n/**\n * Produces an array of polygons from the given geometry, after applying transforms.\n * The returned array should not be modified as the polygons are shared with the geometry.\n * @param {geom3} geometry - the geometry\n * @returns {Array} an array of polygons\n * @alias module:modeling/geometries/geom3.toPolygons\n *\n * @example\n * let sharedpolygons = toPolygons(geometry)\n */\nconst toPolygons = (geometry) => applyTransforms(geometry).polygons\n\nmodule.exports = toPolygons\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/toString.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/toString.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const poly3 = __webpack_require__(/*! ../poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst toPolygons = __webpack_require__(/*! ./toPolygons */ \"./node_modules/@jscad/modeling/src/geometries/geom3/toPolygons.js\")\n\n/**\n * Create a string representing the contents of the given geometry.\n * @param {geom3} geometry - the geometry\n * @returns {String} a representive string\n * @alias module:modeling/geometries/geom3.toString\n *\n * @example\n * console.out(toString(geometry))\n */\nconst toString = (geometry) => {\n  const polygons = toPolygons(geometry)\n  let result = 'geom3 (' + polygons.length + ' polygons):\\n'\n  polygons.forEach((polygon) => {\n    result += '  ' + poly3.toString(polygon) + '\\n'\n  })\n  return result\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/geom3/transform.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/geom3/transform.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/geom3/create.js\")\n\n/**\n * Transform the given geometry using the given matrix.\n * This is a lazy transform of the polygons, as this function only adjusts the transforms.\n * See applyTransforms() for the actual application of the transforms to the polygons.\n * @param {mat4} matrix - the matrix to transform with\n * @param {geom3} geometry - the geometry to transform\n * @returns {geom3} a new geometry\n * @alias module:modeling/geometries/geom3.transform\n *\n * @example\n * let newgeometry = transform(fromXRotation(degToRad(90)), geometry)\n */\nconst transform = (matrix, geometry) => {\n  const newgeometry = create(geometry.polygons) // reuse the polygons\n  newgeometry.isRetesselated = geometry.isRetesselated\n\n  newgeometry.transforms = mat4.multiply(matrix, geometry.transforms)\n  return newgeometry\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/geom3/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Geometries are objects that represent the contents of primitives or the results of operations.\n * Note: Geometries are consider immutable, so never change the contents directly.\n * @module modeling/geometries\n * @example\n * const { geom2, geom3, path2, poly2, poly3 } = require('@jscad/modeling').geometries\n */\nmodule.exports = {\n  geom2: __webpack_require__(/*! ./geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\"),\n  geom3: __webpack_require__(/*! ./geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\"),\n  path2: __webpack_require__(/*! ./path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\"),\n  poly2: __webpack_require__(/*! ./poly2 */ \"./node_modules/@jscad/modeling/src/geometries/poly2/index.js\"),\n  poly3: __webpack_require__(/*! ./poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/appendArc.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/appendArc.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst fromPoints = __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js\")\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Append a series of points to the given geometry that represent an arc.\n * This implementation follows the SVG specifications.\n * @see http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands\n * @param {Object} options - options for construction\n * @param {vec2} options.endpoint - end point of arc (REQUIRED)\n * @param {vec2} [options.radius=[0,0]] - radius of arc (X and Y)\n * @param {Number} [options.xaxisrotation=0] - rotation (RADIANS) of the X axis of the arc with respect to the X axis of the coordinate system\n * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point\n * @param {Boolean} [options.large=false] - draw an arc longer than PI radians\n * @param {Number} [options.segments=16] - number of segments per full rotation\n * @param {path2} geometry - the path of which to append the arc\n * @returns {path2} a new path with the appended points\n * @alias module:modeling/geometries/path2.appendArc\n *\n * @example\n * let p1 = path2.fromPoints({}, [[27.5,-22.96875]]);\n * p1 = path2.appendPoints([[27.5,-3.28125]], p1);\n * p1 = path2.appendArc({endpoint: [12.5, -22.96875], radius: [15, -19.6875]}, p1);\n */\nconst appendArc = (options, geometry) => {\n  const defaults = {\n    radius: [0, 0], // X and Y radius\n    xaxisrotation: 0,\n    clockwise: false,\n    large: false,\n    segments: 16\n  }\n  let { endpoint, radius, xaxisrotation, clockwise, large, segments } = Object.assign({}, defaults, options)\n\n  // validate the given options\n  if (!Array.isArray(endpoint)) throw new Error('endpoint must be an array of X and Y values')\n  if (endpoint.length < 2) throw new Error('endpoint must contain X and Y values')\n  endpoint = vec2.fromArray(endpoint)\n\n  if (!Array.isArray(radius)) throw new Error('radius must be an array of X and Y values')\n  if (radius.length < 2) throw new Error('radius must contain X and Y values')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  const decimals = 100000\n\n  // validate the given geometry\n  if (geometry.isClosed) {\n    throw new Error('the given path cannot be closed')\n  }\n\n  const points = toPoints(geometry)\n  if (points.length < 1) {\n    throw new Error('the given path must contain one or more points (as the starting point for the arc)')\n  }\n\n  let xradius = radius[0]\n  let yradius = radius[1]\n  const startpoint = points[points.length - 1]\n\n  // round to precision in order to have determinate calculations\n  xradius = Math.round(xradius * decimals) / decimals\n  yradius = Math.round(yradius * decimals) / decimals\n  endpoint = vec2.fromValues(Math.round(endpoint[0] * decimals) / decimals, Math.round(endpoint[1] * decimals) / decimals)\n\n  const sweepFlag = !clockwise\n  let newpoints = []\n  if ((xradius === 0) || (yradius === 0)) {\n    // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:\n    // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop\n    newpoints.push(endpoint)\n  } else {\n    xradius = Math.abs(xradius)\n    yradius = Math.abs(yradius)\n\n    // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :\n    const phi = xaxisrotation\n    const cosphi = Math.cos(phi)\n    const sinphi = Math.sin(phi)\n    const minushalfdistance = vec2.scale(0.5, vec2.subtract(startpoint, endpoint))\n    // F.6.5.1:\n    // round to precision in order to have determinate calculations\n    const x = Math.round((cosphi * minushalfdistance[0] + sinphi * minushalfdistance[1]) * decimals) / decimals\n    const y = Math.round((-sinphi * minushalfdistance[0] + cosphi * minushalfdistance[1]) * decimals) / decimals\n    const startTranslated = vec2.fromValues(x, y)\n    // F.6.6.2:\n    const biglambda = (startTranslated[0] * startTranslated[0]) / (xradius * xradius) + (startTranslated[1] * startTranslated[1]) / (yradius * yradius)\n    if (biglambda > 1.0) {\n      // F.6.6.3:\n      const sqrtbiglambda = Math.sqrt(biglambda)\n      xradius *= sqrtbiglambda\n      yradius *= sqrtbiglambda\n      // round to precision in order to have determinate calculations\n      xradius = Math.round(xradius * decimals) / decimals\n      yradius = Math.round(yradius * decimals) / decimals\n    }\n    // F.6.5.2:\n    let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated[1] * startTranslated[1] - yradius * yradius * startTranslated[0] * startTranslated[0]) / (xradius * xradius * startTranslated[1] * startTranslated[1] + yradius * yradius * startTranslated[0] * startTranslated[0]))\n    if (sweepFlag === large) multiplier1 = -multiplier1\n    let centerTranslated = vec2.fromValues(xradius * startTranslated[1] / yradius, -yradius * startTranslated[0] / xradius)\n    centerTranslated = vec2.scale(multiplier1, centerTranslated)\n    // F.6.5.3:\n    let center = vec2.fromValues(cosphi * centerTranslated[0] - sinphi * centerTranslated[1], sinphi * centerTranslated[0] + cosphi * centerTranslated[1])\n    center = vec2.add(center, vec2.scale(0.5, vec2.add(startpoint, endpoint)))\n\n    // F.6.5.5:\n    const vector1 = vec2.fromValues((startTranslated[0] - centerTranslated[0]) / xradius, (startTranslated[1] - centerTranslated[1]) / yradius)\n    const vector2 = vec2.fromValues((-startTranslated[0] - centerTranslated[0]) / xradius, (-startTranslated[1] - centerTranslated[1]) / yradius)\n    const theta1 = vec2.angleRadians(vector1)\n    const theta2 = vec2.angleRadians(vector2)\n    let deltatheta = theta2 - theta1\n    deltatheta = deltatheta % (2 * Math.PI)\n    if ((!sweepFlag) && (deltatheta > 0)) {\n      deltatheta -= 2 * Math.PI\n    } else if ((sweepFlag) && (deltatheta < 0)) {\n      deltatheta += 2 * Math.PI\n    }\n\n    // Ok, we have the center point and angle range (from theta1, deltatheta radians) so we can create the ellipse\n    let numsteps = Math.ceil(Math.abs(deltatheta) / (2 * Math.PI) * segments) + 1\n    if (numsteps < 1) numsteps = 1\n    for (let step = 1; step <= numsteps; step++) {\n      const theta = theta1 + step / numsteps * deltatheta\n      const costheta = Math.cos(theta)\n      const sintheta = Math.sin(theta)\n      // F.6.3.1:\n      let point = vec2.fromValues(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta)\n      point = vec2.add(point, center)\n      newpoints.push(point)\n    }\n  }\n  newpoints = points.concat(newpoints)\n  const result = fromPoints({}, newpoints)\n  return result\n}\n\nmodule.exports = appendArc\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/appendArc.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/appendBezier.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/appendBezier.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst appendPoints = __webpack_require__(/*! ./appendPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/appendPoints.js\")\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Append a series of points to the given geometry that represent a Bezier curve.\n * The Bézier curve starts at the last point in the given geometry, and ends at the last control point.\n * The other control points are intermediate control points to transition the curve from start to end points.\n * The first control point may be null to ensure a smooth transition occurs. In this case,\n * the second to last point of the given geometry is mirrored into the control points of the Bezier curve.\n * In other words, the trailing gradient of the geometry matches the new gradient of the curve.\n * @param {Object} options - options for construction\n * @param {Array} options.controlPoints - list of control points (2D) for the bezier curve\n * @param {Number} [options.segment=16] - number of segments per 360 rotation\n * @param {path2} geometry - the path of which to appended points\n * @returns {path2} a new path with the appended points\n * @alias module:modeling/geometries/path2.appendBezier\n *\n * @example\n * let p5 = path2.create({}, [[10,-20]])\n * p5 = path2.appendBezier({controlPoints: [[10,-10],[25,-10],[25,-20]]}, p5);\n * p5 = path2.appendBezier({controlPoints: [null, [25,-30],[40,-30],[40,-20]]}, p5)\n */\nconst appendBezier = (options, geometry) => {\n  const defaults = {\n    segments: 16\n  }\n  let { controlPoints, segments } = Object.assign({}, defaults, options)\n\n  // validate the given options\n  if (!Array.isArray(controlPoints)) throw new Error('controlPoints must be an array of one or more points')\n  if (controlPoints.length < 1) throw new Error('controlPoints must be an array of one or more points')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  // validate the given geometry\n  if (geometry.isClosed) {\n    throw new Error('the given geometry cannot be closed')\n  }\n\n  const points = toPoints(geometry)\n  if (points.length < 1) {\n    throw new Error('the given path must contain one or more points (as the starting point for the bezier curve)')\n  }\n\n  // make a copy of the control points\n  controlPoints = controlPoints.slice()\n\n  // special handling of null control point (only first is allowed)\n  const firstControlPoint = controlPoints[0]\n  if (firstControlPoint === null) {\n    if (controlPoints.length < 2) {\n      throw new Error('a null control point must be passed with one more control points')\n    }\n    // special handling of a previous bezier curve\n    let lastBezierControlPoint = points[points.length - 2]\n    if ('lastBezierControlPoint' in geometry) {\n      lastBezierControlPoint = geometry.lastBezierControlPoint\n    }\n    if (!Array.isArray(lastBezierControlPoint)) {\n      throw new Error('the given path must contain TWO or more points if given a null control point')\n    }\n    // replace the first control point with the mirror of the last bezier control point\n    let controlpoint = points[points.length - 1]\n    controlpoint = vec2.scale(2, controlpoint)\n    controlpoint = vec2.subtract(controlpoint, lastBezierControlPoint)\n\n    controlPoints[0] = controlpoint\n  }\n\n  // add a control point for the previous end point\n  controlPoints.unshift(points[points.length - 1])\n\n  const bezierOrder = controlPoints.length - 1\n  const factorials = []\n  let fact = 1\n  for (let i = 0; i <= bezierOrder; ++i) {\n    if (i > 0) fact *= i\n    factorials.push(fact)\n  }\n\n  const binomials = []\n  for (let i = 0; i <= bezierOrder; ++i) {\n    const binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i])\n    binomials.push(binomial)\n  }\n\n  const getPointForT = (t) => {\n    let tk = 1 // = pow(t,k)\n    let oneMinusTNMinusK = Math.pow(1 - t, bezierOrder) // = pow( 1-t, bezierOrder - k)\n    const invOneMinusT = (t !== 1) ? (1 / (1 - t)) : 1\n    const point = vec2.create() // 0, 0, 0\n    for (let k = 0; k <= bezierOrder; ++k) {\n      if (k === bezierOrder) oneMinusTNMinusK = 1\n      const bernsteinCoefficient = binomials[k] * tk * oneMinusTNMinusK\n      const derivativePoint = vec2.scale(bernsteinCoefficient, controlPoints[k])\n      vec2.add(point, point, derivativePoint)\n      tk *= t\n      oneMinusTNMinusK *= invOneMinusT\n    }\n    return point\n  }\n\n  const newpoints = []\n  const newpointsT = []\n  const numsteps = bezierOrder + 1\n  for (let i = 0; i < numsteps; ++i) {\n    const t = i / (numsteps - 1)\n    const point = getPointForT(t)\n    newpoints.push(point)\n    newpointsT.push(t)\n  }\n\n  // subdivide each segment until the angle at each vertex becomes small enough:\n  let subdivideBase = 1\n  const maxangle = Math.PI * 2 / segments\n  const maxsinangle = Math.sin(maxangle)\n  while (subdivideBase < newpoints.length - 1) {\n    const dir1 = vec2.normalize(vec2.subtract(newpoints[subdivideBase], newpoints[subdivideBase - 1]))\n    const dir2 = vec2.normalize(vec2.subtract(newpoints[subdivideBase + 1], newpoints[subdivideBase]))\n    const sinangle = vec2.cross(dir1, dir2) // the sine of the angle\n    if (Math.abs(sinangle[2]) > maxsinangle) {\n      // angle is too big, we need to subdivide\n      const t0 = newpointsT[subdivideBase - 1]\n      const t1 = newpointsT[subdivideBase + 1]\n      const newt0 = t0 + (t1 - t0) * 1 / 3\n      const newt1 = t0 + (t1 - t0) * 2 / 3\n      const point0 = getPointForT(newt0)\n      const point1 = getPointForT(newt1)\n      // remove the point at subdivideBase and replace with 2 new points:\n      newpoints.splice(subdivideBase, 1, point0, point1)\n      newpointsT.splice(subdivideBase, 1, newt0, newt1)\n      // re - evaluate the angles, starting at the previous junction since it has changed:\n      subdivideBase--\n      if (subdivideBase < 1) subdivideBase = 1\n    } else {\n      ++subdivideBase\n    }\n  }\n\n  // append to the new points to the given path\n  // but skip the first new point because it is identical to the last point in the given path\n  newpoints.shift()\n  const result = appendPoints(newpoints, geometry)\n  result.lastBezierControlPoint = controlPoints[controlPoints.length - 2]\n  return result\n}\n\nmodule.exports = appendBezier\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/appendBezier.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/appendPoints.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/appendPoints.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromPoints = __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js\")\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Append the given list of points to the end of the given geometry.\n * @param {Array} points - the points (2D) to concatenate\n * @param {path2} geometry - the given path\n * @returns {path2} a new path with the appended points\n * @alias module:modeling/geometries/path2.appendPoints\n *\n * @example\n * let newpath = concat(fromPoints({}, [[1, 2]]), fromPoints({}, [[3, 4]]))\n */\nconst appendPoints = (points, geometry) => {\n  if (geometry.isClosed) {\n    throw new Error('cannot append points to a closed path')\n  }\n\n  let newpoints = toPoints(geometry)\n  newpoints = newpoints.concat(points)\n\n  return fromPoints({}, newpoints)\n}\n\nmodule.exports = appendPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/appendPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/applyTransforms.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/applyTransforms.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\n/*\n * Apply the transforms of the given geometry.\n * NOTE: This function must be called BEFORE exposing any data. See toPoints.\n * @param {path} geometry - the geometry to transform\n * @returns {path} the given geometry\n * @example\n * geometry = applyTransforms(geometry)\n */\nconst applyTransforms = (geometry) => {\n  if (mat4.equals(geometry.transforms, mat4.identity())) return geometry\n\n  geometry.points = geometry.points.map((point) => vec2.transform(geometry.transforms, point))\n  mat4.identity(geometry.transforms)\n  return geometry\n}\n\nmodule.exports = applyTransforms\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/applyTransforms.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/clone.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/clone.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/path2/create.js\")\n\n/**\n * Performs a deep clone of the give geometry.\n * @param {path2} geometry - the geometry to clone\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.clone\n */\nconst clone = (geometry) => {\n  const out = create()\n  out.points = geometry.points.map((point) => vec2.clone(point))\n  out.isClosed = geometry.isClosed\n  out.transforms = mat4.clone(geometry.transforms)\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/close.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/close.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/path2/clone.js\")\n\n/**\n * Close the given geometry.\n * @param {path2} geometry - the path to close\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.close\n */\nconst close = (geometry) => {\n  if (geometry.isClosed) return geometry\n\n  const cloned = clone(geometry)\n  cloned.isClosed = true\n\n  if (cloned.points.length > 1) {\n    // make sure the paths are formed properly\n    const points = cloned.points\n    const p0 = points[0]\n    let pn = points[points.length - 1]\n    while (vec2.distance(p0, pn) < (EPS * EPS)) {\n      points.pop()\n      if (points.length === 1) break\n      pn = points[points.length - 1]\n    }\n  }\n  return cloned\n}\n\nmodule.exports = close\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/close.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/concat.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/concat.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromPoints = __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js\")\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Concatenate the given paths.\n * A concatenation of zero paths is an empty, open path.\n * A concatenation of one closed path to a series of open paths produces a closed path.\n * A concatenation of a path to a closed path is an error.\n * @param {...path2} paths - the paths to concatenate\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.concat\n *\n * @example\n * let newpath = concat(fromPoints({}, [[1, 2]]), fromPoints({}, [[3, 4]]))\n */\nconst concat = (...paths) => {\n  // Only the last path can be closed, producing a closed path.\n  let isClosed = false\n  for (const path of paths) {\n    if (isClosed) {\n      throw new Error('Cannot concatenate to a closed path')\n    }\n    isClosed = path.isClosed\n  }\n  let newpoints = []\n  paths.forEach((path) => {\n    newpoints = newpoints.concat(toPoints(path))\n  })\n  return fromPoints({ closed: isClosed }, newpoints)\n}\n\nmodule.exports = concat\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/concat.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/create.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\n/**\n * Represents a 2D geometry consisting of a list of ordered points.\n * @typedef {Object} path2\n * @property {Array} points - list of ordered points\n * @property {Boolean} isClosed - true if the path is closed where start and end points are the same\n * @property {mat4} transforms - transforms to apply to the points, see transform()\n */\n\n/**\n * Create an empty, open path.\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.create\n *\n * @example\n * let newpath = create()\n */\nconst create = (points) => {\n  if (points === undefined) {\n    points = []\n  }\n  return {\n    points: points,\n    isClosed: false,\n    transforms: mat4.identity()\n  }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/eachPoint.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/eachPoint.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Calls a function for each point in the geometry.\n * @param {Object} options - options\n * @param {Function} thunk - the function to call\n * @param {path2} geometry - the geometry to traverse\n * @alias module:modeling/geometries/path2.eachPoint\n *\n * @example\n * eachPoint({}, accumulate, geometry)\n */\nconst eachPoint = (options, thunk, path) => {\n  toPoints(path).forEach(thunk)\n}\n\nmodule.exports = eachPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/eachPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/equals.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/equals.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n  * Determine if the given paths are equal.\n  * For closed paths, this includes equality under point order rotation.\n  * @param {path2} a - the first path to compare\n  * @param {path2} b - the second path to compare\n  * @returns {Boolean}\n  * @alias module:modeling/geometries/path2.equals\n  */\nconst equals = (a, b) => {\n  if (a.isClosed !== b.isClosed) {\n    return false\n  }\n  if (a.points.length !== b.points.length) {\n    return false\n  }\n\n  const apoints = toPoints(a)\n  const bpoints = toPoints(b)\n\n  // closed paths might be equal under graph rotation\n  // so try comparison by rotating across all points\n  const length = apoints.length\n  let offset = 0\n  do {\n    let unequal = false\n    for (let i = 0; i < length; i++) {\n      if (!vec2.equals(apoints[i], bpoints[(i + offset) % length])) {\n        unequal = true\n        break\n      }\n    }\n    if (unequal === false) {\n      return true\n    }\n    // unequal open paths should only be compared once, never rotated\n    if (!a.isClosed) {\n      return false\n    }\n  } while (++offset < length)\n  return false\n}\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/fromCompactBinary.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/fromCompactBinary.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/path2/create.js\")\n\n/**\n * Create a new path from the given compact binary data.\n * @param {TypedArray} data - compact binary data\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.fromCompactBinary\n */\nconst fromCompactBinary = (data) => {\n  if (data[0] !== 2) throw new Error('invalid compact binary data')\n\n  const created = create()\n\n  created.transforms = mat4.clone(data.slice(1, 17))\n\n  created.isClosed = !!data[17]\n\n  for (let i = 22; i < data.length; i += 2) {\n    const point = vec2.fromValues(data[i], data[i + 1])\n    created.points.push(point)\n  }\n  // transfer known properties, i.e. color\n  if (data[18] >= 0) {\n    created.color = [data[18], data[19], data[20], data[21]]\n  }\n  // TODO: how about custom properties or fields ?\n  return created\n}\n\nmodule.exports = fromCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/fromCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst close = __webpack_require__(/*! ./close */ \"./node_modules/@jscad/modeling/src/geometries/path2/close.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/path2/create.js\")\n\n/**\n * Create a new path from the given points.\n * The points must be provided an array of points,\n * where each point is an array of two numbers.\n * @param {Object} options - options for construction\n * @param {Boolean} [options.closed=false] - if the path should be open or closed\n * @param {Array} points - array of points (2D) from which to create the path\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.fromPoints\n *\n * @example:\n * my newpath = fromPoints({closed: true}, [[10, 10], [-10, 10]])\n */\nconst fromPoints = (options, points) => {\n  const defaults = { closed: false }\n  let { closed } = Object.assign({}, defaults, options)\n\n  let created = create()\n  created.points = points.map((point) => vec2.fromArray(point))\n\n  // check if first and last points are equal\n  if (created.points.length > 1) {\n    const p0 = created.points[0]\n    const pn = created.points[created.points.length - 1]\n    if (vec2.distance(p0, pn) < (EPS * EPS)) {\n      // and close automatically\n      closed = true\n    }\n  }\n  if (closed === true) created = close(created)\n\n  return created\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a 2D geometry consisting of a list of ordered points.\n * @see {@link path2} for data structure information.\n * @module modeling/geometries/path2\n */\nmodule.exports = {\n  appendArc: __webpack_require__(/*! ./appendArc */ \"./node_modules/@jscad/modeling/src/geometries/path2/appendArc.js\"),\n  appendBezier: __webpack_require__(/*! ./appendBezier */ \"./node_modules/@jscad/modeling/src/geometries/path2/appendBezier.js\"),\n  appendPoints: __webpack_require__(/*! ./appendPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/appendPoints.js\"),\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/path2/clone.js\"),\n  close: __webpack_require__(/*! ./close */ \"./node_modules/@jscad/modeling/src/geometries/path2/close.js\"),\n  concat: __webpack_require__(/*! ./concat */ \"./node_modules/@jscad/modeling/src/geometries/path2/concat.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/path2/create.js\"),\n  eachPoint: __webpack_require__(/*! ./eachPoint */ \"./node_modules/@jscad/modeling/src/geometries/path2/eachPoint.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/geometries/path2/equals.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/fromPoints.js\"),\n  fromCompactBinary: __webpack_require__(/*! ./fromCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/path2/fromCompactBinary.js\"),\n  isA: __webpack_require__(/*! ./isA */ \"./node_modules/@jscad/modeling/src/geometries/path2/isA.js\"),\n  reverse: __webpack_require__(/*! ./reverse */ \"./node_modules/@jscad/modeling/src/geometries/path2/reverse.js\"),\n  toPoints: __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/geometries/path2/toString.js\"),\n  toCompactBinary: __webpack_require__(/*! ./toCompactBinary */ \"./node_modules/@jscad/modeling/src/geometries/path2/toCompactBinary.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/geometries/path2/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/isA.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/isA.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Determin if the given object is a path2 geometry.\n * @param {Object} object - the object to interogate\n * @returns {Boolean} true if the object matches a path2\n * @alias module:modeling/geometries/path2.isA\n */\nconst isA = (object) => {\n  if (object && typeof object === 'object') {\n    // see create for the required attributes and types\n    if ('points' in object && 'transforms' in object && 'isClosed' in object) {\n      // NOTE: transforms should be a TypedArray, which has a read-only length\n      if (Array.isArray(object.points) && 'length' in object.transforms) {\n        return true\n      }\n    }\n  }\n  return false\n}\n\nmodule.exports = isA\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/isA.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/reverse.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/reverse.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/path2/clone.js\")\n\n/**\n * Reverses the path so that the points are in the opposite order.\n * This swaps the left (interior) and right (exterior) edges.\n * @param {path2} geometry - the geometry to reverse\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.reverse\n *\n * @example\n * let newpath = reverse(mypath)\n */\nconst reverse = (path) => {\n  // NOTE: this only updates the order of the points\n  const cloned = clone(path)\n  cloned.points = path.points.slice().reverse()\n  return cloned\n}\n\nmodule.exports = reverse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/reverse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/toCompactBinary.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/toCompactBinary.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Produce a compact binary representation from the given path.\n * @param {path2} geometry - the path\n * @returns {TypedArray} compact binary representation\n * @alias module:modeling/geometries/path2.toCompactBinary\n */\nconst toCompactBinary = (geom) => {\n  const points = geom.points\n  const transforms = geom.transforms\n  let color = [-1, -1, -1, -1]\n  if (geom.color) color = geom.color\n\n  // FIXME why Float32Array?\n  const compacted = new Float32Array(1 + 16 + 1 + 4 + (points.length * 2)) // type + transforms + isClosed + color + points data\n\n  compacted[0] = 2 // type code: 0 => geom2, 1 => geom3 , 2 => path2\n\n  compacted[1] = transforms[0]\n  compacted[2] = transforms[1]\n  compacted[3] = transforms[2]\n  compacted[4] = transforms[3]\n  compacted[5] = transforms[4]\n  compacted[6] = transforms[5]\n  compacted[7] = transforms[6]\n  compacted[8] = transforms[7]\n  compacted[9] = transforms[8]\n  compacted[10] = transforms[9]\n  compacted[11] = transforms[10]\n  compacted[12] = transforms[11]\n  compacted[13] = transforms[12]\n  compacted[14] = transforms[13]\n  compacted[15] = transforms[14]\n  compacted[16] = transforms[15]\n\n  compacted[17] = geom.isClosed ? 1 : 0\n\n  compacted[18] = color[0]\n  compacted[19] = color[1]\n  compacted[20] = color[2]\n  compacted[21] = color[3]\n\n  for (let j = 0; j < points.length; j++) {\n    const ci = j * 2 + 22\n    const point = points[j]\n    compacted[ci] = point[0]\n    compacted[ci + 1] = point[1]\n  }\n  // TODO: how about custom properties or fields ?\n  return compacted\n}\n\nmodule.exports = toCompactBinary\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/toCompactBinary.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const applyTransforms = __webpack_require__(/*! ./applyTransforms */ \"./node_modules/@jscad/modeling/src/geometries/path2/applyTransforms.js\")\n\n/**\n * Produces an array of points from the given geometry.\n * The returned array should not be modified as the data is shared with the geometry.\n * @param {path2} geometry - the geometry\n * @returns {Array} an array of points\n * @alias module:modeling/geometries/path2.toPoints\n *\n * @example\n * let sharedpoints = toPoints(geometry)\n */\nconst toPoints = (geometry) => applyTransforms(geometry).points\n\nmodule.exports = toPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/toString.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/toString.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst toPoints = __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/path2/toPoints.js\")\n\n/**\n * Create a string representing the contents of the given path.\n * @param {path2} geometry - the path\n * @returns {String} a representive string\n * @alias module:modeling/geometries/path2.toString\n *\n * @example\n * console.out(toString(path))\n */\nconst toString = (geometry) => {\n  const points = toPoints(geometry)\n  let result = 'path (' + points.length + ' points, ' + geometry.isClosed + '):\\n[\\n'\n  points.forEach((point) => {\n    result += '  ' + vec2.toString(point) + ',\\n'\n  })\n  result += ']\\n'\n  return result\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/path2/transform.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/path2/transform.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/path2/create.js\")\n\n/**\n * Transform the given geometry using the given matrix.\n * This is a lazy transform of the points, as this function only adjusts the transforms.\n * The transforms are applied when accessing the points via toPoints().\n * @param {mat4} matrix - the matrix to transform with\n * @param {path2} geometry - the geometry to transform\n * @returns {path2} a new path\n * @alias module:modeling/geometries/path2.transform\n *\n * @example\n * let newpath = transform(fromZRotation(Math.PI / 4), path)\n */\nconst transform = (matrix, geometry) => {\n  const newgeometry = create(geometry.points) // reuse the points\n  newgeometry.isClosed = geometry.isClosed\n\n  newgeometry.transforms = mat4.multiply(matrix, geometry.transforms)\n  return newgeometry\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/path2/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly2/arePointsInside.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly2/arePointsInside.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const measureArea = __webpack_require__(/*! ./measureArea */ \"./node_modules/@jscad/modeling/src/geometries/poly2/measureArea.js\")\nconst flip = __webpack_require__(/*! ./flip */ \"./node_modules/@jscad/modeling/src/geometries/poly2/flip.js\")\n\n/**\n * Determine if the given points are inside the given polygon.\n *\n * @param {Array} points - a list of points, where each point is an array with X and Y values\n * @param {poly2} polygon - a 2D polygon\n * @return {Integer} 1 if all points are inside, 0 if some or none are inside\n * @alias module:modeling/geometries/poly2.arePointsInside\n */\nconst arePointsInside = (points, polygon) => {\n  if (points.length === 0) return 0 // nothing to check\n\n  if (measureArea(polygon) < 0) {\n    polygon = flip(polygon) // CCW is required\n  }\n  const vertices = polygon.vertices\n  if (vertices.length === 0) return 0 // nothing can be inside an empty polygon\n\n  const sum = points.reduce((acc, point) => acc + isPointInside(point, vertices), 0)\n  return sum === points.length ? 1 : 0\n}\n\n/*\n * Determine if the given point is inside the polygon.\n *\n * @see http://geomalgorithms.com/a03-_inclusion.html\n * @param {Array} point - an array with X and Y values\n * @param {Array} polygon - a list of points, where each point is an array with X and Y values\n * @return {Integer} 1 if the point is inside, 0 if outside\n */\nconst isPointInside = (point, polygon) => {\n  let wn = 0\n  const n = polygon.length\n  const x = point[0]\n  const y = point[1]\n  for (let i = 0; i < polygon.length; i++) {\n    const p1 = polygon[i]\n    const p2 = polygon[(i + 1) % n]\n    if (x !== p1[0] && y !== p1[1] && x !== p2[0] && y !== p2[1]) { // no overlap of points\n      if (p1[1] <= y) {\n        if (p2[1] > y) { // upward crossing\n          if (isLeft(p1, p2, point) > 0) { // point left of edge\n            wn++\n          }\n        }\n      } else {\n        if (p2[1] <= y) { // downward crossing\n          if (isLeft(p1, p2, point) < 0) { // point right of edge\n            wn--\n          }\n        }\n      }\n    }\n  }\n  return wn\n}\n\nconst isLeft = (p0, p1, p2) => (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1])\n\nmodule.exports = arePointsInside\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly2/arePointsInside.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly2/create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly2/create.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a convex 2D polygon consisting of a list of ordered vertices.\n * @typedef {Object} poly2\n * @property {Array} vertices - list of ordered vertices (2D)\n */\n\n/**\n * Creates a new polygon with initial values.\n *\n * @param {Array} [vertices] - list of vertices (2D)\n * @returns {poly2} a new polygon\n * @alias module:modeling/geometries/poly2.create\n *\n * @example\n * let polygon = create()\n */\nconst create = (vertices) => {\n  if (vertices === undefined || vertices.length < 3) {\n    vertices = [] // empty contents\n  }\n  return { vertices: vertices }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly2/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly2/flip.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly2/flip.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly2/create.js\")\n\n/**\n * Flip the give polygon, rotating the opposite direction.\n *\n * @param {poly2} polygon - the polygon to flip\n * @returns {poly2} a new polygon\n * @alias module:modeling/geometries/poly2.flip\n */\nconst flip = (polygon) => {\n  const vertices = polygon.vertices.slice().reverse()\n  return create(vertices)\n}\n\nmodule.exports = flip\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly2/flip.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly2/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly2/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a 2D polygon consisting of a list of ordered vertices.\n * @see {@link poly2} for data structure information.\n * @module modeling/geometries/poly2\n */\nmodule.exports = {\n  arePointsInside: __webpack_require__(/*! ./arePointsInside */ \"./node_modules/@jscad/modeling/src/geometries/poly2/arePointsInside.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly2/create.js\"),\n  flip: __webpack_require__(/*! ./flip */ \"./node_modules/@jscad/modeling/src/geometries/poly2/flip.js\"),\n  measureArea: __webpack_require__(/*! ./measureArea */ \"./node_modules/@jscad/modeling/src/geometries/poly2/measureArea.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly2/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly2/measureArea.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly2/measureArea.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Measure the area under the given polygon.\n *\n * @param {poly2} polygon - the polygon to measure\n * @return {Number} the area of the polygon\n * @alias module:modeling/geometries/poly2.measureArea\n */\nconst area = __webpack_require__(/*! ../../maths/utils/area */ \"./node_modules/@jscad/modeling/src/maths/utils/area.js\")\n\nconst measureArea = (polygon) => {\n  return area(polygon.vertices)\n}\n\nmodule.exports = measureArea\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly2/measureArea.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/clone.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/clone.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\")\n\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Create a deep clone of the given polygon\n *\n * @param {poly3} [out] - receiving polygon\n * @param {poly3} polygon - polygon to clone\n * @returns {poly3} a new polygon\n * @alias module:modeling/geometries/poly3.clone\n */\nconst clone = (...params) => {\n  let out\n  let poly3\n  if (params.length === 1) {\n    out = create()\n    poly3 = params[0]\n  } else {\n    out = params[0]\n    poly3 = params[1]\n  }\n  // deep clone of vertices\n  out.vertices = poly3.vertices.map((vec) => vec3.clone(vec))\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/create.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/create.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n/**\n * Represents a convex 3D polygon. The vertices used to initialize a polygon must\n * be coplanar and form a convex shape. The vertices do not have to be `vec3`\n * instances but they must behave similarly.\n * @typedef {Object} poly3\n * @property {Array} vertices - list of ordered vertices (3D)\n */\n\n/**\n * Creates a new 3D polygon with initial values.\n *\n * @param {Array} [vertices] - a list of vertices (3D)\n * @returns {poly3} a new polygon\n * @alias module:modeling/geometries/poly3.create\n */\nconst create = (vertices) => {\n  if (vertices === undefined || vertices.length < 3) {\n    vertices = [] // empty contents\n  }\n  return { vertices: vertices }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/equals.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/equals.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst equals = (first, second) => {\n  for (let i = 0; i < first.vertices.length; i++) {\n    const v1 = first.vertices[i]\n    const v2 = second.vertices[i]\n    if (!vec3.equals(v1, v2)) {\n      return false\n    }\n  }\n  return true\n}\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/fromPoints.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/fromPoints.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\")\n\n/**\n * Create a polygon from the given points.\n *\n * @param {Array} points - list of points (3D)\n * @returns {poly3} a new polygon\n * @alias module:modeling/geometries/poly3.fromPoints\n *\n * @example\n * const points = [\n *   [0,  0, 0],\n *   [0, 10, 0],\n *   [0, 10, 10]\n * ]\n * const polygon = fromPoints(points)\n */\nconst fromPoints = (points) => {\n  const vertices = points.map((point) => vec3.clone(point))\n  return create(vertices)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/fromPointsAndPlane.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/fromPointsAndPlane.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\")\n\n/**\n * Create a polygon from the given vertices and plane.\n * NOTE: No checks are performed on the parameters.\n * @param {Array} vertices - list of vertices (3D)\n * @param {plane} plane - plane of the polygon\n * @returns {poly3} a new polygon\n * @alias module:modeling/geometries/poly3.fromPointsAndPlane\n */\nconst fromPointsAndPlane = (vertices, plane) => {\n  const poly = create(vertices)\n  poly.plane = plane // retain the plane for later use\n  return poly\n}\n\nmodule.exports = fromPointsAndPlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/fromPointsAndPlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a convex 3D polygon consisting of a list of vertices.\n * @see {@link poly3} for data structure information.\n * @module modeling/geometries/poly3\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/geometries/poly3/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/geometries/poly3/equals.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/geometries/poly3/fromPoints.js\"),\n  fromPointsAndPlane: __webpack_require__(/*! ./fromPointsAndPlane */ \"./node_modules/@jscad/modeling/src/geometries/poly3/fromPointsAndPlane.js\"),\n  invert: __webpack_require__(/*! ./invert */ \"./node_modules/@jscad/modeling/src/geometries/poly3/invert.js\"),\n  isA: __webpack_require__(/*! ./isA */ \"./node_modules/@jscad/modeling/src/geometries/poly3/isA.js\"),\n  isConvex: __webpack_require__(/*! ./isConvex */ \"./node_modules/@jscad/modeling/src/geometries/poly3/isConvex.js\"),\n  measureArea: __webpack_require__(/*! ./measureArea */ \"./node_modules/@jscad/modeling/src/geometries/poly3/measureArea.js\"),\n  measureBoundingBox: __webpack_require__(/*! ./measureBoundingBox */ \"./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingBox.js\"),\n  measureBoundingSphere: __webpack_require__(/*! ./measureBoundingSphere */ \"./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingSphere.js\"),\n  measureSignedVolume: __webpack_require__(/*! ./measureSignedVolume */ \"./node_modules/@jscad/modeling/src/geometries/poly3/measureSignedVolume.js\"),\n  plane: __webpack_require__(/*! ./plane */ \"./node_modules/@jscad/modeling/src/geometries/poly3/plane.js\"),\n  toPoints: __webpack_require__(/*! ./toPoints */ \"./node_modules/@jscad/modeling/src/geometries/poly3/toPoints.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/geometries/poly3/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/geometries/poly3/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/invert.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/invert.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\")\n\n/**\n * Invert the give polygon to face the opposite direction.\n *\n * @param {poly3} polygon - the polygon to invert\n * @returns {poly3} a new poly3\n * @alias module:modeling/geometries/poly3.invert\n */\nconst invert = (polygon) => {\n  const vertices = polygon.vertices.slice().reverse()\n  return create(vertices)\n}\n\nmodule.exports = invert\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/invert.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/isA.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/isA.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Determin if the given object is a polygon.\n * @param {Object} object - the object to interogate\n * @returns {Boolean} true if the object matches a poly3\n * @alias module:modeling/geometries/poly3.isA\n */\nconst isA = (object) => {\n  if (object && typeof object === 'object') {\n    if ('vertices' in object) {\n      if (Array.isArray(object.vertices)) {\n        return true\n      }\n    }\n  }\n  return false\n}\n\nmodule.exports = isA\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/isA.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/isConvex.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/isConvex.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const plane = __webpack_require__(/*! ../../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Check whether the given polygon is convex.\n * @param {poly3} polygon - the polygon to interogate\n * @returns {Boolean} true if convex\n * @alias module:modeling/geometries/poly3.isConvex\n */\nconst isConvex = (poly3) => areVerticesConvex(poly3.vertices)\n\nconst areVerticesConvex = (vertices) => {\n  const numvertices = vertices.length\n  if (numvertices > 2) {\n    // note: plane ~= normal point\n    const normal = plane.fromPoints(vertices[0], vertices[1], vertices[2])\n    let prevprevpos = vertices[numvertices - 2]\n    let prevpos = vertices[numvertices - 1]\n    for (let i = 0; i < numvertices; i++) {\n      const pos = vertices[i]\n      if (!isConvexPoint(prevprevpos, prevpos, pos, normal)) {\n        return false\n      }\n      prevprevpos = prevpos\n      prevpos = pos\n    }\n  }\n  return true\n}\n\n// calculate whether three points form a convex corner\n//  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)\n//  normal: the normal vector of the plane\nconst isConvexPoint = (prevpoint, point, nextpoint, normal) => {\n  const crossproduct = vec3.cross(\n    vec3.subtract(point, prevpoint),\n    vec3.subtract(nextpoint, point)\n  )\n  const crossdotnormal = vec3.dot(crossproduct, normal)\n  return crossdotnormal >= 0\n}\n\nmodule.exports = isConvex\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/isConvex.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/measureArea.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/measureArea.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Measure the area of the given polygon.\n * @see 2000 softSurfer http://geomalgorithms.com\n * @param {poly3} polygon - the polygon to measure\n * @return {Number} area of the polygon\n * @alias module:modeling/geometries/poly3.measureArea\n */\nconst measureArea = (poly3) => {\n  const n = poly3.vertices.length\n  if (n < 3) {\n    return 0 // degenerate polygon\n  }\n  const vertices = poly3.vertices\n\n  // calculate a real normal\n  const a = vertices[0]\n  const b = vertices[1]\n  const c = vertices[2]\n  const ba = vec3.subtract(b, a)\n  const ca = vec3.subtract(c, a)\n  const normal = vec3.cross(ba, ca)\n\n  // determin direction of projection\n  const ax = Math.abs(normal[0])\n  const ay = Math.abs(normal[1])\n  const az = Math.abs(normal[2])\n  const an = Math.sqrt((ax * ax) + (ay * ay) + (az * az)) // length of normal\n\n  let coord = 3 // ignore Z coordinates\n  if ((ax > ay) && (ax > az)) {\n    coord = 1 // ignore X coordinates\n  } else\n  if (ay > az) {\n    coord = 2 // ignore Y coordinates\n  }\n\n  let area = 0\n  let h = 0\n  let i = 1\n  let j = 2\n  switch (coord) {\n    case 1: // ignore X coordinates\n      // compute area of 2D projection\n      for (i = 1; i < n; i++) {\n        h = i - 1\n        j = (i + 1) % n\n        area += (vertices[i][1] * (vertices[j][2] - vertices[h][2]))\n      }\n      area += (vertices[0][1] * (vertices[1][2] - vertices[n - 1][2]))\n      // scale to get area\n      area *= (an / (2 * normal[0]))\n      break\n\n    case 2: // ignore Y coordinates\n      // compute area of 2D projection\n      for (i = 1; i < n; i++) {\n        h = i - 1\n        j = (i + 1) % n\n        area += (vertices[i][2] * (vertices[j][0] - vertices[h][0]))\n      }\n      area += (vertices[0][2] * (vertices[1][0] - vertices[n - 1][0]))\n      // scale to get area\n      area *= (an / (2 * normal[1]))\n      break\n\n    case 3: // ignore Z coordinates\n    default:\n      // compute area of 2D projection\n      for (i = 1; i < n; i++) {\n        h = i - 1\n        j = (i + 1) % n\n        area += (vertices[i][0] * (vertices[j][1] - vertices[h][1]))\n      }\n      area += (vertices[0][0] * (vertices[1][1] - vertices[n - 1][1]))\n      // scale to get area\n      area *= (an / (2 * normal[2]))\n      break\n  }\n  return area\n}\n\nmodule.exports = measureArea\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/measureArea.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingBox.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingBox.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * @param {poly3} polygon - the polygon to measure\n * @returns {Array} an array of two vectors (3D);  minimum and maximum coordinates\n * @alias module:modeling/geometries/poly3.measureBoundingBox\n */\nconst measureBoundingBox = (poly3) => {\n  const vertices = poly3.vertices\n  const numvertices = vertices.length\n  const min = numvertices === 0 ? vec3.create() : vec3.clone(vertices[0])\n  const max = vec3.clone(min)\n  for (let i = 1; i < numvertices; i++) {\n    vec3.min(min, min, vertices[i])\n    vec3.max(max, max, vertices[i])\n  }\n  return [min, max]\n}\n\nmodule.exports = measureBoundingBox\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingBox.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingSphere.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingSphere.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\nconst measureBoundingBox = __webpack_require__(/*! ./measureBoundingBox */ \"./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingBox.js\")\n\n/**\n * Measure the bounding sphere of the given polygon.\n * @param {poly3} polygon - the polygon to measure\n * @returns {Array} the computed bounding sphere; center point (3D) and radius\n * @alias module:modeling/geometries/poly3.measureBoundingSphere\n */\nconst measureBoundingSphere = (poly3) => {\n  const box = measureBoundingBox(poly3)\n  const center = box[0]\n  vec3.add(center, box[0], box[1])\n  vec3.scale(center, 0.5, center)\n  const radius = vec3.distance(center, box[1])\n  return [center, radius]\n}\n\nmodule.exports = measureBoundingSphere\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/measureBoundingSphere.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/measureSignedVolume.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/measureSignedVolume.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Measure the signed volume of the given polygon, which must be convex.\n * The volume is that formed by the tetrahedon connected to the axis [0,0,0],\n * and will be positive or negative based on the rotation of the vertices.\n * @see http://chenlab.ece.cornell.edu/Publication/Cha/icip01_Cha.pdf\n * @param {poly3} polygon - the polygon to measure\n * @return {Number} volume of the polygon\n * @alias module:modeling/geometries/poly3.measureSignedVolume\n */\nconst measureSignedVolume = (poly3) => {\n  let signedVolume = 0\n  const vertices = poly3.vertices\n  // calculate based on triangluar polygons\n  for (let i = 0; i < vertices.length - 2; i++) {\n    const cross = vec3.cross(vertices[i + 1], vertices[i + 2])\n    signedVolume += vec3.dot(vertices[0], cross)\n  }\n  signedVolume /= 6\n  return signedVolume\n}\n\nmodule.exports = measureSignedVolume\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/measureSignedVolume.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/plane.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/plane.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mplane = __webpack_require__(/*! ../../maths/plane/ */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\n\nconst plane = (polygon) => {\n  if (!polygon.plane) {\n    const vertices = polygon.vertices\n    polygon.plane = mplane.fromPoints(vertices[0], vertices[1], vertices[2])\n  }\n  return polygon.plane\n}\n\nmodule.exports = plane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/plane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/toPoints.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/toPoints.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return the given geometry as a list of points.\n * NOTE: The returned array should not be modified as the points are shared with the geometry.\n * @param {poly3} polygon - the polygon\n * @return {Array} list of points (3D)\n * @alias module:modeling/geometries/poly3.toPoints\n */\nconst toPoints = (geometry) => geometry.vertices\n\nmodule.exports = toPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/toPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/toString.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/toString.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3/ */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * @param {poly3} polygon - the polygon to measure\n * @return {String} the string representation\n * @alias module:modeling/geometries/poly3.toString\n */\nconst toString = (poly3) => {\n  let result = 'poly3: vertices: ['\n  poly3.vertices.forEach((vertex) => {\n    result += `${vec3.toString(vertex)}, `\n  })\n  result += ']'\n  return result\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/geometries/poly3/transform.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/geometries/poly3/transform.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/geometries/poly3/create.js\")\n\n/**\n * Transform the given polygon using the given matrix.\n * @param {mat4} matrix - the matrix to transform with\n * @param {poly3} polygon - the polygon to transform\n * @returns {poly3} a new polygon\n * @alias module:modeling/geometries/poly3.transform\n */\nconst transform = (matrix, poly3) => {\n  const vertices = poly3.vertices.map((vertex) => vec3.transform(matrix, vertex))\n  if (mat4.isMirroring(matrix)) {\n    // reverse the order to preserve the orientation\n    vertices.reverse()\n  }\n  return create(vertices)\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/geometries/poly3/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  colors: __webpack_require__(/*! ./colors */ \"./node_modules/@jscad/modeling/src/colors/index.js\"),\n  connectors: __webpack_require__(/*! ./connectors */ \"./node_modules/@jscad/modeling/src/connectors/index.js\"),\n  curves: __webpack_require__(/*! ./curves */ \"./node_modules/@jscad/modeling/src/curves/index.js\"),\n  geometries: __webpack_require__(/*! ./geometries */ \"./node_modules/@jscad/modeling/src/geometries/index.js\"),\n  maths: __webpack_require__(/*! ./maths */ \"./node_modules/@jscad/modeling/src/maths/index.js\"),\n  measurements: __webpack_require__(/*! ./measurements */ \"./node_modules/@jscad/modeling/src/measurements/index.js\"),\n  primitives: __webpack_require__(/*! ./primitives */ \"./node_modules/@jscad/modeling/src/primitives/index.js\"),\n  text: __webpack_require__(/*! ./text */ \"./node_modules/@jscad/modeling/src/text/index.js\"),\n  utils: __webpack_require__(/*! ./utils */ \"./node_modules/@jscad/modeling/src/utils/index.js\"),\n\n  booleans: __webpack_require__(/*! ./operations/booleans */ \"./node_modules/@jscad/modeling/src/operations/booleans/index.js\"),\n  expansions: __webpack_require__(/*! ./operations/expansions */ \"./node_modules/@jscad/modeling/src/operations/expansions/index.js\"),\n  extrusions: __webpack_require__(/*! ./operations/extrusions */ \"./node_modules/@jscad/modeling/src/operations/extrusions/index.js\"),\n  hulls: __webpack_require__(/*! ./operations/hulls */ \"./node_modules/@jscad/modeling/src/operations/hulls/index.js\"),\n  transforms: __webpack_require__(/*! ./operations/transforms */ \"./node_modules/@jscad/modeling/src/operations/transforms/index.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/OrthoNormalBasis.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/OrthoNormalBasis.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ./mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst line2 = __webpack_require__(/*! ./line2 */ \"./node_modules/@jscad/modeling/src/maths/line2/index.js\")\nconst line3 = __webpack_require__(/*! ./line3 */ \"./node_modules/@jscad/modeling/src/maths/line3/index.js\")\n\nconst plane = __webpack_require__(/*! ./plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\n\nconst vec2 = __webpack_require__(/*! ./vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst vec3 = __webpack_require__(/*! ./vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/*\n * Class OrthoNormalBasis\n * Reprojects points on a 3D plane onto a 2D plane\n * or from a 2D plane back onto the 3D plane\n * @param  {Plane} plane\n * @param  {Vector3D|Vector2D} rightvector\n */\nconst OrthoNormalBasis = function (plane, rightvector) {\n  if (arguments.length < 2) {\n    // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal:\n    rightvector = vec3.orthogonal(plane)\n  } else {\n    rightvector = rightvector\n  }\n  this.v = vec3.unit(vec3.cross(plane, rightvector))\n  this.u = vec3.cross(this.v, plane)\n  this.plane = plane\n  this.planeorigin = vec3.scale(plane[3], plane)\n}\n\n// Get an orthonormal basis for the standard XYZ planes.\n// Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y\n// axis will map to the second.\n// Prepend the axis with a \"-\" to invert the direction of this axis.\n// For example: OrthoNormalBasis.GetCartesian(\"-Y\",\"Z\")\n//   will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and\n//   the 2d Y axis maps to the 3D Z axis.\nOrthoNormalBasis.GetCartesian = function (xaxisid, yaxisid) {\n  const axisid = xaxisid + '/' + yaxisid\n  let planenormal, rightvector\n  if (axisid === 'X/Y') {\n    planenormal = [0, 0, 1]\n    rightvector = [1, 0, 0]\n  } else if (axisid === 'Y/-X') {\n    planenormal = [0, 0, 1]\n    rightvector = [0, 1, 0]\n  } else if (axisid === '-X/-Y') {\n    planenormal = [0, 0, 1]\n    rightvector = [-1, 0, 0]\n  } else if (axisid === '-Y/X') {\n    planenormal = [0, 0, 1]\n    rightvector = [0, -1, 0]\n  } else if (axisid === '-X/Y') {\n    planenormal = [0, 0, -1]\n    rightvector = [-1, 0, 0]\n  } else if (axisid === '-Y/-X') {\n    planenormal = [0, 0, -1]\n    rightvector = [0, -1, 0]\n  } else if (axisid === 'X/-Y') {\n    planenormal = [0, 0, -1]\n    rightvector = [1, 0, 0]\n  } else if (axisid === 'Y/X') {\n    planenormal = [0, 0, -1]\n    rightvector = [0, 1, 0]\n  } else if (axisid === 'X/Z') {\n    planenormal = [0, -1, 0]\n    rightvector = [1, 0, 0]\n  } else if (axisid === 'Z/-X') {\n    planenormal = [0, -1, 0]\n    rightvector = [0, 0, 1]\n  } else if (axisid === '-X/-Z') {\n    planenormal = [0, -1, 0]\n    rightvector = [-1, 0, 0]\n  } else if (axisid === '-Z/X') {\n    planenormal = [0, -1, 0]\n    rightvector = [0, 0, -1]\n  } else if (axisid === '-X/Z') {\n    planenormal = [0, 1, 0]\n    rightvector = [-1, 0, 0]\n  } else if (axisid === '-Z/-X') {\n    planenormal = [0, 1, 0]\n    rightvector = [0, 0, -1]\n  } else if (axisid === 'X/-Z') {\n    planenormal = [0, 1, 0]\n    rightvector = [1, 0, 0]\n  } else if (axisid === 'Z/X') {\n    planenormal = [0, 1, 0]\n    rightvector = [0, 0, 1]\n  } else if (axisid === 'Y/Z') {\n    planenormal = [1, 0, 0]\n    rightvector = [0, 1, 0]\n  } else if (axisid === 'Z/-Y') {\n    planenormal = [1, 0, 0]\n    rightvector = [0, 0, 1]\n  } else if (axisid === '-Y/-Z') {\n    planenormal = [1, 0, 0]\n    rightvector = [0, -1, 0]\n  } else if (axisid === '-Z/Y') {\n    planenormal = [1, 0, 0]\n    rightvector = [0, 0, -1]\n  } else if (axisid === '-Y/Z') {\n    planenormal = [-1, 0, 0]\n    rightvector = [0, -1, 0]\n  } else if (axisid === '-Z/-Y') {\n    planenormal = [-1, 0, 0]\n    rightvector = [0, 0, -1]\n  } else if (axisid === 'Y/-Z') {\n    planenormal = [-1, 0, 0]\n    rightvector = [0, 1, 0]\n  } else if (axisid === 'Z/Y') {\n    planenormal = [-1, 0, 0]\n    rightvector = [0, 0, 1]\n  } else {\n    throw new Error('OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.')\n  }\n  return new OrthoNormalBasis(new Plane(new Vector3D(planenormal), 0), new Vector3D(rightvector))\n}\n\n/*\n// test code for OrthoNormalBasis.GetCartesian()\nOrthoNormalBasis.GetCartesian_Test=function() {\n  let axisnames=[\"X\",\"Y\",\"Z\",\"-X\",\"-Y\",\"-Z\"];\n  let axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];\n  for(let axis1=0; axis1 < 3; axis1++) {\n    for(let axis1inverted=0; axis1inverted < 2; axis1inverted++) {\n      let axis1name=axisnames[axis1+3*axis1inverted];\n      let axis1vector=axisvectors[axis1+3*axis1inverted];\n      for(let axis2=0; axis2 < 3; axis2++) {\n        if(axis2 != axis1) {\n          for(let axis2inverted=0; axis2inverted < 2; axis2inverted++) {\n            let axis2name=axisnames[axis2+3*axis2inverted];\n            let axis2vector=axisvectors[axis2+3*axis2inverted];\n            let orthobasis=OrthoNormalBasis.GetCartesian(axis1name, axis2name);\n            let test1=orthobasis.to3D(new Vector2D([1,0]));\n            let test2=orthobasis.to3D(new Vector2D([0,1]));\n            let expected1=new Vector3D(axis1vector);\n            let expected2=new Vector3D(axis2vector);\n            let d1=test1.distanceTo(expected1);\n            let d2=test2.distanceTo(expected2);\n            if( (d1 > 0.01) || (d2 > 0.01) ) {\n              throw new Error(\"Wrong!\");\n  }}}}}}\n  throw new Error(\"OK\");\n};\n*/\n\n// The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector\nOrthoNormalBasis.Z0Plane = function () {\n  const plane = new Plane(new Vector3D([0, 0, 1]), 0)\n  return new OrthoNormalBasis(plane, new Vector3D([1, 0, 0]))\n}\n\nOrthoNormalBasis.prototype = {\n\n  getProjectionMatrix: function () {\n    return mat4.fromValues(\n      this.u[0], this.v[0], this.plane[0], 0,\n      this.u[1], this.v[1], this.plane[1], 0,\n      this.u[2], this.v[2], this.plane[2], 0,\n      0, 0, -this.plane[3], 1\n    )\n  },\n\n  getInverseProjectionMatrix: function () {\n    const p = vec3.scale(this.plane[3], this.plane)\n    return mat4.fromValues(\n      this.u[0], this.u[1], this.u[2], 0,\n      this.v[0], this.v[1], this.v[2], 0,\n      this.plane[0], this.plane[1], this.plane[2], 0,\n      p[0], p[1], p[2], 1\n    )\n  },\n\n  to2D: function (point) {\n    return vec2.fromValues(vec3.dot(point, this.u), vec3.dot(point, this.v))\n  },\n\n  to3D: function (point) {\n    const v1 = vec3.scale(point[0], this.u)\n    const v2 = vec3.scale(point[1], this.v)\n\n    const v3 = vec3.add(this.planeorigin, v1)\n    const v4 = vec3.add(v3, v2)\n    return v4\n  },\n\n  line3Dto2D: function (line3d) {\n    const a = line3d.point\n    const b = line3d.direction.plus(a)\n    const a2d = this.to2D(a)\n    const b2d = this.to2D(b)\n    return Line2D.fromPoints(a2d, b2d)\n  },\n\n  line2Dto3D: function (line2d) {\n    const a = line2d.origin()\n    const b = line2d.direction().plus(a)\n    const a3d = this.to3D(a)\n    const b3d = this.to3D(b)\n    return Line3D.fromPoints(a3d, b3d)\n  },\n\n  transform: function (matrix4x4) {\n    // todo: this may not work properly in case of mirroring\n    const newplane = this.plane.transform(matrix4x4)\n    const rightpointTransformed = this.u.transform(matrix4x4)\n    const originTransformed = new Vector3D(0, 0, 0).transform(matrix4x4)\n    const newrighthandvector = rightpointTransformed.minus(originTransformed)\n    const newbasis = new OrthoNormalBasis(newplane, newrighthandvector)\n    return newbasis\n  }\n}\n\nmodule.exports = OrthoNormalBasis\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/OrthoNormalBasis.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/constants.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/constants.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * The resolution of space, currently one hundred nanometers.\n * This should be 1 / EPS.\n * @alias module:modeling/maths.spatialResolution\n * @default\n */\nconst spatialResolution = 1e5\n\n/**\n * Epsilon used during determination of near zero distances.\n * This should be 1 / spacialResolution.\n * @default\n * @alias module:modeling/maths.EPS\n */\nconst EPS = 1e-5\n\nmodule.exports = {\n  EPS,\n  spatialResolution\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/constants.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Maths are computational units for fundamental Euclidean geometry. All maths operate upon array data structures.\n * Note: Maths data structues are consider immutable, so never change the contents directly.\n * @see most computations are based upon glMatrix\n * @module modeling/maths\n * @example\n * const { constants, line2, mat4, vec2, vec3 } = require('@jscad/modeling').maths\n\n */\nmodule.exports = {\n  constants: __webpack_require__(/*! ./constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\"),\n  line2: __webpack_require__(/*! ./line2 */ \"./node_modules/@jscad/modeling/src/maths/line2/index.js\"),\n  line3: __webpack_require__(/*! ./line3 */ \"./node_modules/@jscad/modeling/src/maths/line3/index.js\"),\n  mat4: __webpack_require__(/*! ./mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\"),\n  plane: __webpack_require__(/*! ./plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\"),\n  utils: __webpack_require__(/*! ./utils */ \"./node_modules/@jscad/modeling/src/maths/utils/index.js\"),\n  vec2: __webpack_require__(/*! ./vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\"),\n  vec3: __webpack_require__(/*! ./vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\"),\n  vec4: __webpack_require__(/*! ./vec4 */ \"./node_modules/@jscad/modeling/src/maths/vec4/index.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/clone.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/clone.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line2/create.js\")\n\n/**\n * Create a clone of the given 2D line.\n *\n * @param {line2} [out] - receiving line\n * @param {line2} line - line to clone\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.clone\n */\nconst clone = (...params) => {\n  let out\n  let line\n  if (params.length === 1) {\n    out = create()\n    line = params[0]\n  } else {\n    out = params[0]\n    line = params[1]\n  }\n  out[0] = line[0]\n  out[1] = line[1]\n  out[2] = line[2]\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/closestPoint.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/closestPoint.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst direction = __webpack_require__(/*! ./direction */ \"./node_modules/@jscad/modeling/src/maths/line2/direction.js\")\nconst origin = __webpack_require__(/*! ./origin */ \"./node_modules/@jscad/modeling/src/maths/line2/origin.js\")\n\n/**\n * Determine the closest point on the given line to the given point.\n *\n * @param {vec2} point the point of reference\n * @param {line2} line the 2D line for calculations\n * @returns {vec2} closest point\n * @alias module:modeling/maths/line2.closestPoint\n */\nconst closestPoint = (point, line) => {\n  // linear function of AB\n  const a = origin(line)\n  const b = direction(line)\n  const m1 = (b[1] - a[1]) / (b[0] - a[0])\n  const t1 = a[1] - m1 * a[0]\n  // linear function of PC\n  const m2 = -1 / m1 // perpendicular\n  const t2 = point[1] - m2 * point[0]\n  // c.x * m1 + t1 === c.x * m2 + t2\n  const x = (t2 - t1) / (m1 - m2)\n  const y = m1 * x + t1\n\n  const closest = vec2.fromValues(x, y)\n  return closest\n}\n\nmodule.exports = closestPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/closestPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/create.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a unbounded line in 2D space, positioned at a point of origin.\n * A line is parametrized by a normal vector (perpendicular to the line, rotated 90 degrees counter clockwise) and\n * distance from the origin.\n * Equation: A Point (P) is on Line (L) if dot(L.normal, P) == L.distance\n * The contents of the array are a normal [0,1] and a distance [2].\n * @typedef {Array} line2\n */\n\n/**\n * Create a unbounded 2D line, positioned at 0,0, and running along the X axis.\n *\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.create\n */\nconst create = () => [0, 1, 0] // normal and distance\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/direction.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/direction.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\n/**\n * Return the direction of the given line.\n *\n * @param {line2} line - the 2D line for calculations\n * @return {vec2} a vector in the direction of the line\n * @alias module:modeling/maths/line2.direction\n */\nconst direction = (line) => {\n  const vector = vec2.normal(line)\n  vec2.negate(vector, vector)\n  return vector\n}\n\nmodule.exports = direction\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/direction.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/distanceToPoint.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/distanceToPoint.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\n/**\n * Calculate the distance (positive) between the given point and line.\n *\n * @param {vec2} point the point of reference\n * @param {line2} line the 2D line of reference\n * @return {Number} distance between line and point\n * @alias module:modeling/maths/line2.distanceToPoint\n */\nconst distanceToPoint = (point, line) => {\n  let distance = vec2.dot(point, line)\n  distance = Math.abs(distance - line[2])\n  return distance\n}\n\nmodule.exports = distanceToPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/distanceToPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/equals.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/equals.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Compare the given lines for equality.\n *\n * @param {line2} a - the first line to compare\n * @param {line2} b - the second line to compare\n * @return {Boolean} true if lines are equal\n * @alias module:modeling/maths/line2.equals\n */\nconst equals = (line1, line2) => (line1[0] === line2[0]) && (line1[1] === line2[1] && (line1[2] === line2[2]))\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/fromPoints.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/fromPoints.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/line2/fromValues.js\")\n\n/**\n * Create a new line that passes through the given points.\n *\n * @param {vec2} p1 start point of the 2D line\n * @param {vec2} p2 end point of the 2D line\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.fromPoints\n */\nconst fromPoints = (p1, p2) => {\n  const vector = vec2.subtract(p2, p1) // directional vector\n\n  vec2.normal(vector, vector)\n  vec2.normalize(vector, vector) // normalized\n\n  const distance = vec2.dot(p1, vector)\n\n  return fromValues(vector[0], vector[1], distance)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/fromValues.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/fromValues.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line2/create.js\")\n\n/**\n * Creates a new line initialized with the given values.\n *\n * @param {Number} x X coordinate of the unit normal\n * @param {Number} y Y coordinate of the unit normal\n * @param {Number} d distance of the line from [0,0]\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.fromValues\n */\nconst fromValues = (x, y, w) => {\n  const out = create()\n  out[0] = x\n  out[1] = y\n  out[2] = w\n  return out\n}\n\nmodule.exports = fromValues\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/fromValues.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a unbounded line in 2D space, positioned at a point of origin.\n * @see {@link line2} for data structure information.\n * @module modeling/maths/line2\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line2/clone.js\"),\n  closestPoint: __webpack_require__(/*! ./closestPoint */ \"./node_modules/@jscad/modeling/src/maths/line2/closestPoint.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line2/create.js\"),\n  direction: __webpack_require__(/*! ./direction */ \"./node_modules/@jscad/modeling/src/maths/line2/direction.js\"),\n  distanceToPoint: __webpack_require__(/*! ./distanceToPoint */ \"./node_modules/@jscad/modeling/src/maths/line2/distanceToPoint.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/line2/equals.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/maths/line2/fromPoints.js\"),\n  fromValues: __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/line2/fromValues.js\"),\n  intersectPointOfLines: __webpack_require__(/*! ./intersectPointOfLines */ \"./node_modules/@jscad/modeling/src/maths/line2/intersectPointOfLines.js\"),\n  origin: __webpack_require__(/*! ./origin */ \"./node_modules/@jscad/modeling/src/maths/line2/origin.js\"),\n  reverse: __webpack_require__(/*! ./reverse */ \"./node_modules/@jscad/modeling/src/maths/line2/reverse.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/line2/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/line2/transform.js\"),\n  xAtY: __webpack_require__(/*! ./xAtY */ \"./node_modules/@jscad/modeling/src/maths/line2/xAtY.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/intersectPointOfLines.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/intersectPointOfLines.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst { solve2Linear } = __webpack_require__(/*! ../utils */ \"./node_modules/@jscad/modeling/src/maths/utils/index.js\")\n\n/**\n * Return the point of intersection between the given lines.\n *\n * The point will have Infinity values if the lines are paralell.\n * The point will have NaN values if the lines are the same.\n *\n * @param {line2} line1 a 2D line for reference\n * @param {line2} line2 a 2D line for reference\n * @return {vec2} the point of intersection\n * @alias module:modeling/maths/line2.intersectPointOfLines\n */\nconst intersectToLine = (line1, line2) => {\n  const point = solve2Linear(line1[0], line1[1], line2[0], line2[1], line1[2], line2[2])\n  return vec2.clone(point)\n}\n\nmodule.exports = intersectToLine\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/intersectPointOfLines.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/origin.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/origin.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\n/**\n * Return the origin of the given line.\n *\n * @param {line2} line the 2D line of reference\n * @return {vec2} the origin of the line\n * @alias module:modeling/maths/line2.origin\n */\nconst origin = (line) => {\n  const point = vec2.scale(line[2], line)\n  return point\n}\n\nmodule.exports = origin\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/origin.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/reverse.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/reverse.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line2/clone.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line2/create.js\")\nconst fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/line2/fromValues.js\")\n\n/**\n * Create a new line in the opposite direction as the given.\n *\n * @param {line2} [out] - receiving line\n * @param {line2} line the 2D line to reverse\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.reverse\n */\nconst reverse = (...params) => {\n  let out\n  let line\n  if (params.length === 1) {\n    out = create()\n    line = params[0]\n  } else {\n    out = params[0]\n    line = params[1]\n  }\n\n  const normal = vec2.negate(line)\n  const distance = -line[2]\n  return clone(out, fromValues(normal[0], normal[1], distance))\n}\n\nmodule.exports = reverse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/reverse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/toString.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/toString.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return a string representing the given line.\n *\n * @param {line2} line the 2D line of reference\n * @returns {String} string representation\n * @alias module:modeling/maths/line2.toString\n */\nconst toString = (line) => `line2: (${line[0].toFixed(7)}, ${line[1].toFixed(7)}, ${line[2].toFixed(7)})`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/transform.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/transform.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst fromPoints = __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/maths/line2/fromPoints.js\")\nconst origin = __webpack_require__(/*! ./origin */ \"./node_modules/@jscad/modeling/src/maths/line2/origin.js\")\nconst direction = __webpack_require__(/*! ./direction */ \"./node_modules/@jscad/modeling/src/maths/line2/direction.js\")\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line2/clone.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line2/create.js\")\n\n/**\n * Transforms the given 2D line using the given matrix.\n *\n * @param {line2} [out] - receiving line\n * @param {mat4} matrix matrix to transform with\n * @param {line2} line the 2D line to transform\n * @returns {line2} a new unbounded line\n * @alias module:modeling/maths/line2.transform\n */\nconst transform = (...params) => {\n  let out\n  let matrix\n  let line\n  if (params.length === 2) {\n    out = create()\n    matrix = params[0]\n    line = params[1]\n  } else {\n    out = params[0]\n    matrix = params[1]\n    line = params[2]\n  }\n\n  const org = origin(line)\n  const dir = direction(line)\n\n  vec2.transform(org, matrix, org)\n  vec2.transform(dir, matrix, dir)\n\n  return clone(out, fromPoints(org, dir))\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line2/xAtY.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line2/xAtY.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const origin = __webpack_require__(/*! ./origin */ \"./node_modules/@jscad/modeling/src/maths/line2/origin.js\")\n\n/**\n * Determine the X coordinate of the given line at the Y coordinate.\n *\n * The X coordinate will be Infinity if the line is parallel to the X axis.\n *\n * @param {Number} y the Y coordinate on the line\n * @param {line2} line the 2D line of reference\n * @return {Number} the X coordinate on the line\n * @alias module:modeling/maths/line2.xAtY\n */\nconst xAtY = (y, line) => {\n  // px = (distance - normal.y * y) / normal.x\n  let x = (line[2] - (line[1] * y)) / line[0]\n  if (Number.isNaN(x)) {\n    const org = origin(line)\n    x = org[0]\n  }\n  return x\n}\n\nmodule.exports = xAtY\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line2/xAtY.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/clone.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/clone.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line3/create.js\")\n\n/**\n * Create a clone of the given 3D line.\n *\n * @param {line3} [out] - receiving line\n * @param {line3} line - line to clone\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.clone\n */\nconst clone = (...params) => {\n  let out\n  let line\n  if (params.length === 1) {\n    out = create()\n    line = params[0]\n  } else {\n    out = params[0]\n    line = params[1]\n  }\n  vec3.clone(out[0], line[0])\n  vec3.clone(out[1], line[1])\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/closestPoint.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/closestPoint.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Determine the closest point on the given line to the given point.\n *\n * @param {vec3} point - the point of reference\n * @param {line3} line - the line of reference\n * @returns {vec3} a point\n * @alias module:modeling/maths/line3.closestPoint\n */\nconst closestPoint = (point, line) => {\n  const lpoint = line[0]\n  const ldirection = line[1]\n\n  const a = vec3.dot(vec3.subtract(point, lpoint), ldirection)\n  const b = vec3.dot(ldirection, ldirection)\n  const t = a / b\n\n  const closestpoint = vec3.add(lpoint, vec3.scale(t, ldirection))\n  return closestpoint\n}\n\nmodule.exports = closestPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/closestPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/create.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst fromPointAndDirection = __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\")\n\n/**\n * Represents a unbounded line in 3D space, positioned at a point of origin.\n * A line is parametrized by a point of origin and a directional vector.\n * The array contents are two 3D vectors; origin and directional vector.\n * @see https://en.wikipedia.org/wiki/Hesse_normal_form\n * @typedef {Array} line3\n */\n\n/**\n * Create an unbounded 3D line, positioned at 0,0,0 and lying on the X axis.\n *\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.create\n */\nconst create = () => {\n  const point = vec3.create() // 0, 0, 0\n  const direction = vec3.fromValues(0, 0, 1)\n  return fromPointAndDirection(point, direction)\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/direction.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/direction.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return the direction of the given line.\n *\n * @param {line3} line - the line for reference\n * @return {vec3} the relative vector in the direction of the line\n * @alias module:modeling/maths/line3.direction\n */\nconst direction = (line) => line[1]\n\nmodule.exports = direction\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/direction.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/distanceToPoint.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/distanceToPoint.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst closestPoint = __webpack_require__(/*! ./closestPoint */ \"./node_modules/@jscad/modeling/src/maths/line3/closestPoint.js\")\n\n/**\n * Calculate the distance (positive) between the given point and line.\n *\n * @param {vec3} point the point of reference\n * @param {line3} line the line of reference\n * @return {Number} distance between line and point\n * @alias module:modeling/maths/line3.distanceToPoint\n */\nconst distanceToPoint = (point, line) => {\n  const closest = closestPoint(point, line)\n  const distancevector = vec3.subtract(point, closest)\n  const distance = vec3.length(distancevector)\n  return distance\n}\n\nmodule.exports = distanceToPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/distanceToPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/equals.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/equals.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Compare the given 3D lines for equality.\n *\n * @param {line3} a - the first line to compare\n * @param {line3} b - the second line to compare\n * @return {Boolean} true if lines are equal\n * @alias module:modeling/maths/line3.equals\n */\nconst equals = (line1, line2) => {\n  // compare directions (unit vectors)\n  if (!vec3.equals(line1[1], line2[1])) return false\n\n  // compare points\n  if (!vec3.equals(line1[0], line2[0])) return false\n\n  // why would lines with the same slope (direction) and different points be equal?\n  // let distance = distanceToPoint(line1, line2[0])\n  // if (distance > EPS) return false\n\n  return true\n}\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/fromPlanes.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/fromPlanes.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\nconst { solve2Linear } = __webpack_require__(/*! ../utils */ \"./node_modules/@jscad/modeling/src/maths/utils/index.js\")\n\nconst { EPS } = __webpack_require__(/*! ../constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst fromPointAndDirection = __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\")\n\n/**\n * Create a line in 3D space from the intersection of the given planes.\n *\n * @param {plane} a - the first plane of reference\n * @param {plane} b - the second plane of reference\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.fromPlanes\n */\nconst fromPlanes = (plane1, plane2) => {\n  let direction = vec3.cross(plane1, plane2)\n  let length = vec3.length(direction)\n  if (length < EPS) {\n    throw new Error('parallel planes do not intersect')\n  }\n  length = (1.0 / length)\n  direction = vec3.scale(length, direction)\n\n  const absx = Math.abs(direction[0])\n  const absy = Math.abs(direction[1])\n  const absz = Math.abs(direction[2])\n  let origin\n  let r\n  if ((absx >= absy) && (absx >= absz)) {\n    // find a point p for which x is zero\n    r = solve2Linear(plane1[1], plane1[2], plane2[1], plane2[2], plane1[3], plane2[3])\n    origin = vec3.fromValues(0, r[0], r[1])\n  } else if ((absy >= absx) && (absy >= absz)) {\n    // find a point p for which y is zero\n    r = solve2Linear(plane1[0], plane1[2], plane2[0], plane2[2], plane1[3], plane2[3])\n    origin = vec3.fromValues(r[0], 0, r[1])\n  } else {\n    // find a point p for which z is zero\n    r = solve2Linear(plane1[0], plane1[1], plane2[0], plane2[1], plane1[3], plane2[3])\n    origin = vec3.fromValues(r[0], r[1], 0)\n  }\n  return fromPointAndDirection(origin, direction)\n}\n\nmodule.exports = fromPlanes\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/fromPlanes.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Create a line in 3D space from the given point (origin) and direction.\n *\n * The point can be any random point on the line.\n * The direction must be a vector with positive or negative distance from the point.\n * See the logic of fromPoints() for appropriate values.\n *\n * @param {vec3} point start point of the line segment\n * @param {vec3} direction direction of the line segment\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.fromPointAndDirection\n */\nconst fromPointAndDirection = (point, direction) => {\n  const unit = vec3.unit(direction)\n  return [point, unit]\n}\n\nmodule.exports = fromPointAndDirection\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/fromPoints.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/fromPoints.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst fromPointAndDirection = __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\")\n\n/**\n * Creates a new 3D line that passes through the given points.\n *\n * @param {vec3} p1 - start point of the line segment\n * @param {vec3} p2 - end point of the line segment\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.fromPoints\n */\nconst fromPoints = (p1, p2) => {\n  const direction = vec3.subtract(p2, p1)\n  return fromPointAndDirection(p1, direction)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a unbounded line in 3D space, positioned at a point of origin.\n * @see {@link line3} for data structure information.\n * @module modeling/maths/line3\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line3/clone.js\"),\n  closestPoint: __webpack_require__(/*! ./closestPoint */ \"./node_modules/@jscad/modeling/src/maths/line3/closestPoint.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line3/create.js\"),\n  direction: __webpack_require__(/*! ./direction */ \"./node_modules/@jscad/modeling/src/maths/line3/direction.js\"),\n  distanceToPoint: __webpack_require__(/*! ./distanceToPoint */ \"./node_modules/@jscad/modeling/src/maths/line3/distanceToPoint.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/line3/equals.js\"),\n  fromPlanes: __webpack_require__(/*! ./fromPlanes */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPlanes.js\"),\n  fromPointAndDirection: __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPoints.js\"),\n  intersectPointOfLineAndPlane: __webpack_require__(/*! ./intersectPointOfLineAndPlane */ \"./node_modules/@jscad/modeling/src/maths/line3/intersectPointOfLineAndPlane.js\"),\n  origin: __webpack_require__(/*! ./origin */ \"./node_modules/@jscad/modeling/src/maths/line3/origin.js\"),\n  reverse: __webpack_require__(/*! ./reverse */ \"./node_modules/@jscad/modeling/src/maths/line3/reverse.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/line3/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/line3/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/intersectPointOfLineAndPlane.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/intersectPointOfLineAndPlane.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Determine the closest point on the given plane to the given line.\n *\n * The point of intersection will be invalid if the line is parallel to the plane, e.g. NaN.\n *\n * @param {plane} plane - the plane of reference\n * @param {line3} line - the line of reference\n * @returns {vec3} a point on the line\n * @alias module:modeling/maths/line3.intersectPointOfLineAndPlane\n */\nconst intersectToPlane = (plane, line) => {\n  // plane: plane.normal * p = plane.w\n  const pnormal = plane\n  const pw = plane[3]\n\n  const lpoint = line[0]\n  const ldirection = line[1]\n\n  // point: p = line.point + labda * line.direction\n  const labda = (pw - vec3.dot(pnormal, lpoint)) / vec3.dot(pnormal, ldirection)\n\n  const point = vec3.add(lpoint, vec3.scale(labda, ldirection))\n  return point\n}\n\nmodule.exports = intersectToPlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/intersectPointOfLineAndPlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/origin.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/origin.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return the origin of the given line.\n *\n * @param {line3} line - the line of reference\n * @return {vec3} the origin of the line\n * @alias module:modeling/maths/line3.origin\n */\nconst origin = (line) => line[0]\n\nmodule.exports = origin\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/origin.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/reverse.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/reverse.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line3/clone.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line3/create.js\")\nconst fromPointAndDirection = __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\")\n\n/**\n * Create a new line in the opposite direction as the given.\n *\n * @param {line3} [out] - receiving line\n * @param {line3} line - the line to reverse\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.reverse\n */\nconst reverse = (...params) => {\n  let out\n  let line\n  if (params.length === 1) {\n    out = create()\n    line = params[0]\n  } else {\n    out = params[0]\n    line = params[1]\n  }\n\n  const point = vec3.clone(line[0])\n  const direction = vec3.negate(line[1])\n  return clone(out, fromPointAndDirection(point, direction))\n}\n\nmodule.exports = reverse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/reverse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/toString.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/toString.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return a string representing the given line.\n *\n * @param {line3} line - the line of reference\n * @returns {String} string representation\n * @alias module:modeling/maths/line3.toString\n */\nconst toString = (line) => {\n  const point = line[0]\n  const unit = line[1]\n  return `line3: point: (${point[0].toFixed(7)}, ${point[1].toFixed(7)}, ${point[2].toFixed(7)}) unit: (${unit[0].toFixed(7)}, ${unit[1].toFixed(7)}, ${unit[2].toFixed(7)})`\n}\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/line3/transform.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/line3/transform.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/line3/clone.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/line3/create.js\")\nconst fromPointAndDirection = __webpack_require__(/*! ./fromPointAndDirection */ \"./node_modules/@jscad/modeling/src/maths/line3/fromPointAndDirection.js\")\n\n/**\n * Transforms the given 3D line using the given matrix.\n *\n * @param {mat4} matrix - matrix to transform with\n * @param {line3} line - the line to transform\n * @returns {line3} a new unbounded line\n * @alias module:modeling/maths/line3.transform\n */\nconst transform = (...params) => {\n  let out\n  let matrix\n  let line\n  if (params.length === 2) {\n    out = create()\n    matrix = params[0]\n    line = params[1]\n  } else {\n    out = params[0]\n    matrix = params[1]\n    line = params[2]\n  }\n\n  const point = line[0]\n  const direction = line[1]\n  const pointPlusDirection = vec3.add(point, direction)\n\n  const newpoint = vec3.transform(matrix, point)\n  const newPointPlusDirection = vec3.transform(matrix, pointPlusDirection)\n  const newdirection = vec3.subtract(newPointPlusDirection, newpoint)\n\n  return clone(out, fromPointAndDirection(newpoint, newdirection))\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/line3/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/add.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/add.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Adds the two matrices.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {mat4} a - the first operand\n * @param {mat4} b - the second operand\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.add\n */\nconst add = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] + b[0]\n  out[1] = a[1] + b[1]\n  out[2] = a[2] + b[2]\n  out[3] = a[3] + b[3]\n  out[4] = a[4] + b[4]\n  out[5] = a[5] + b[5]\n  out[6] = a[6] + b[6]\n  out[7] = a[7] + b[7]\n  out[8] = a[8] + b[8]\n  out[9] = a[9] + b[9]\n  out[10] = a[10] + b[10]\n  out[11] = a[11] + b[11]\n  out[12] = a[12] + b[12]\n  out[13] = a[13] + b[13]\n  out[14] = a[14] + b[14]\n  out[15] = a[15] + b[15]\n  return out\n}\n\nmodule.exports = add\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/add.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/clone.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/clone.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a clone of the given matrix.\n *\n * @param {mat4} [out] - receiving matrix\n * @param {mat4} matrix - matrix to clone\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.clone\n */\nconst clone = (...params) => {\n  let out, a\n  if (params.length === 1) {\n    out = create()\n    a = params[0]\n  } else {\n    out = params[0]\n    a = params[1]\n  }\n  out[0] = a[0]\n  out[1] = a[1]\n  out[2] = a[2]\n  out[3] = a[3]\n  out[4] = a[4]\n  out[5] = a[5]\n  out[6] = a[6]\n  out[7] = a[7]\n  out[8] = a[8]\n  out[9] = a[9]\n  out[10] = a[10]\n  out[11] = a[11]\n  out[12] = a[12]\n  out[13] = a[13]\n  out[14] = a[14]\n  out[15] = a[15]\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/constants.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/constants.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const EPSILON = 0.000001\n\nmodule.exports = {\n  EPSILON\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/constants.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/create.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a 4x4 matrix which is column-major (when typed out it looks row-major).\n * See fromValues().\n * @typedef {Array} mat4\n */\n\n/**\n * Creates a new identity matrix\n *\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.create\n */\nconst create = () => [\n  1, 0, 0, 0,\n  0, 1, 0, 0,\n  0, 0, 1, 0,\n  0, 0, 0, 1\n]\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/equals.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/equals.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Returns whether or not the matrices have exactly the same elements in the same position.\n *\n * @param {mat4} a - the first matrix\n * @param {mat4} b - the second matrix\n * @returns {Boolean} true if the matrices are equal\n * @alias module:modeling/maths/mat4.equals\n */\nconst equals = (a, b) => (\n  a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&\n  a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&\n  a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&\n  a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15]\n)\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromRotation.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromRotation.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\nconst { EPSILON } = __webpack_require__(/*! ./constants */ \"./node_modules/@jscad/modeling/src/maths/mat4/constants.js\")\n\n/**\n * Creates a matrix from a given angle around a given axis\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotate(dest, dest, rad, axis);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {Number} rad - the angle to rotate the matrix by\n * @param {vec3} axis - the axis to rotate around\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromRotation\n */\nconst fromRotation = (...params) => {\n  let out\n  let rad\n  let axis\n\n  if (params.length === 2) {\n    out = create()\n    rad = params[0]\n    axis = params[1]\n  } else {\n    out = params[0]\n    rad = params[1]\n    axis = params[2]\n  }\n  let [x, y, z] = axis\n  let len = Math.sqrt(x * x + y * y + z * z)\n\n  if (Math.abs(len) < EPSILON) { return null }\n\n  len = 1 / len\n  x *= len\n  y *= len\n  z *= len\n\n  const s = Math.sin(rad)\n  const c = Math.cos(rad)\n  const t = 1 - c\n\n  // Perform rotation-specific matrix multiplication\n  out[0] = x * x * t + c\n  out[1] = y * x * t + z * s\n  out[2] = z * x * t - y * s\n  out[3] = 0\n  out[4] = x * y * t - z * s\n  out[5] = y * y * t + c\n  out[6] = z * y * t + x * s\n  out[7] = 0\n  out[8] = x * z * t + y * s\n  out[9] = y * z * t - x * s\n  out[10] = z * z * t + c\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromRotation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromRotation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromScaling.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromScaling.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a matrix from a vector scaling\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.scale(dest, dest, vec);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {vec3} v - Scaling vector\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromScaling\n */\nconst fromScaling = (...params) => {\n  let out\n  let v\n  if (params.length === 1) {\n    out = create()\n    v = params[0]\n  } else {\n    out = params[0]\n    v = params[1]\n  }\n  out[0] = v[0]\n  out[1] = 0\n  out[2] = 0\n  out[3] = 0\n  out[4] = 0\n  out[5] = v[1]\n  out[6] = 0\n  out[7] = 0\n  out[8] = 0\n  out[9] = 0\n  out[10] = v[2]\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromScaling\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromScaling.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromTaitBryanRotation.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromTaitBryanRotation.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nconst clone = __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/mat4/clone.js\")\n\n/**\n * Creates a matrix from the given Tait–Bryan angles.\n * Tait-Bryan Euler angle convention using active, intrinsic rotations around the axes in the order z-y-x.\n * @see https://en.wikipedia.org/wiki/Euler_angles\n * @param {Number} yaw - Z rotation in radians\n * @param {Number} pitch - Y rotation in radians\n * @param {Number} roll - X rotation in radians\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromTaitBryanRotation\n */\nconst fromTaitBryanRotation = (yaw, pitch, roll) => {\n  // precompute sines and cosines of Euler angles\n  const sy = Math.sin(yaw)\n  const cy = Math.cos(yaw)\n  const sp = Math.sin(pitch)\n  const cp = Math.cos(pitch)\n  const sr = Math.sin(roll)\n  const cr = Math.cos(roll)\n\n  // create and populate rotation matrix\n  // left-hand-rule rotation\n  // const els = [\n  //  cp*cy, sr*sp*cy - cr*sy, sr*sy + cr*sp*cy, 0,\n  //  cp*sy, cr*cy + sr*sp*sy, cr*sp*sy - sr*cy, 0,\n  //  -sp, sr*cp, cr*cp, 0,\n  //  0, 0, 0, 1\n  // ]\n  // right-hand-rule rotation\n  const els = [\n    cp * cy, cp * sy, -sp, 0,\n    sr * sp * cy - cr * sy, cr * cy + sr * sp * sy, sr * cp, 0,\n    sr * sy + cr * sp * cy, cr * sp * sy - sr * cy, cr * cp, 0,\n    0, 0, 0, 1\n  ]\n  return clone(els)\n}\n\nmodule.exports = fromTaitBryanRotation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromTaitBryanRotation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromTranslation.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromTranslation.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a matrix from a vector translation\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.translate(dest, dest, vec);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {vec3} v - Translation vector\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromTranslation\n */\nconst fromTranslation = (...params) => {\n  let out\n  let v\n  if (params.length === 1) {\n    out = create()\n    v = params[0]\n  } else {\n    out = params[0]\n    v = params[1]\n  }\n  out[0] = 1\n  out[1] = 0\n  out[2] = 0\n  out[3] = 0\n  out[4] = 0\n  out[5] = 1\n  out[6] = 0\n  out[7] = 0\n  out[8] = 0\n  out[9] = 0\n  out[10] = 1\n  out[11] = 0\n  out[12] = v[0]\n  out[13] = v[1]\n  out[14] = v[2]\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromTranslation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromTranslation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromValues.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromValues.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Create a matrix with the given values.\n *\n * @param {Number} m00 Component in column 0, row 0 position (index 0)\n * @param {Number} m01 Component in column 0, row 1 position (index 1)\n * @param {Number} m02 Component in column 0, row 2 position (index 2)\n * @param {Number} m03 Component in column 0, row 3 position (index 3)\n * @param {Number} m10 Component in column 1, row 0 position (index 4)\n * @param {Number} m11 Component in column 1, row 1 position (index 5)\n * @param {Number} m12 Component in column 1, row 2 position (index 6)\n * @param {Number} m13 Component in column 1, row 3 position (index 7)\n * @param {Number} m20 Component in column 2, row 0 position (index 8)\n * @param {Number} m21 Component in column 2, row 1 position (index 9)\n * @param {Number} m22 Component in column 2, row 2 position (index 10)\n * @param {Number} m23 Component in column 2, row 3 position (index 11)\n * @param {Number} m30 Component in column 3, row 0 position (index 12)\n * @param {Number} m31 Component in column 3, row 1 position (index 13)\n * @param {Number} m32 Component in column 3, row 2 position (index 14)\n * @param {Number} m33 Component in column 3, row 3 position (index 15)\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromValues\n */\nconst fromValues = (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) => {\n  const out = create()\n  out[0] = m00\n  out[1] = m01\n  out[2] = m02\n  out[3] = m03\n  out[4] = m10\n  out[5] = m11\n  out[6] = m12\n  out[7] = m13\n  out[8] = m20\n  out[9] = m21\n  out[10] = m22\n  out[11] = m23\n  out[12] = m30\n  out[13] = m31\n  out[14] = m32\n  out[15] = m33\n  return out\n}\n\nmodule.exports = fromValues\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromValues.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromXRotation.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromXRotation.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a matrix from the given angle around the X axis.\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateX(dest, dest, rad);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {Number} rad - the angle to rotate the matrix by\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromXRotation\n */\nconst fromXRotation = (...params) => {\n  let out\n  let rad\n  if (params.length === 1) {\n    out = create()\n    rad = params[0]\n  } else {\n    out = params[0]\n    rad = params[1]\n  }\n  const s = Math.sin(rad)\n  const c = Math.cos(rad)\n\n  // Perform axis-specific matrix multiplication\n  out[0] = 1\n  out[1] = 0\n  out[2] = 0\n  out[3] = 0\n  out[4] = 0\n  out[5] = c\n  out[6] = s\n  out[7] = 0\n  out[8] = 0\n  out[9] = -s\n  out[10] = c\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromXRotation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromXRotation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromYRotation.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromYRotation.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a matrix from the given angle around the Y axis.\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateY(dest, dest, rad);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {Number} rad - the angle to rotate the matrix by\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromYRotation\n */\nconst fromYRotation = (...params) => {\n  let out\n  let rad\n  if (params.length === 1) {\n    out = create()\n    rad = params[0]\n  } else {\n    out = params[0]\n    rad = params[1]\n  }\n  const s = Math.sin(rad)\n  const c = Math.cos(rad)\n\n  // Perform axis-specific matrix multiplication\n  out[0] = c\n  out[1] = 0\n  out[2] = -s\n  out[3] = 0\n  out[4] = 0\n  out[5] = 1\n  out[6] = 0\n  out[7] = 0\n  out[8] = s\n  out[9] = 0\n  out[10] = c\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromYRotation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromYRotation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/fromZRotation.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/fromZRotation.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Creates a matrix from the given angle around the Z axis.\n * This is equivalent to (but much faster than):\n *\n *     mat4.identity(dest);\n *     mat4.rotateZ(dest, dest, rad);\n *\n * @param {mat4} [out] - mat4 receiving operation result\n * @param {Number} rad - the angle to rotate the matrix by\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.fromZRotation\n */\nconst fromZRotation = (...params) => {\n  let out\n  let rad\n  if (params.length === 1) {\n    out = create()\n    rad = params[0]\n  } else {\n    out = params[0]\n    rad = params[1]\n  }\n  const s = Math.sin(rad)\n  const c = Math.cos(rad)\n\n  // Perform axis-specific matrix multiplication\n  out[0] = c\n  out[1] = s\n  out[2] = 0\n  out[3] = 0\n  out[4] = -s\n  out[5] = c\n  out[6] = 0\n  out[7] = 0\n  out[8] = 0\n  out[9] = 0\n  out[10] = 1\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = fromZRotation\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/fromZRotation.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/identity.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/identity.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Set a matrix to the identity matrix.\n *\n * @param {mat4} [out] - the receiving matrix\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.identity\n */\nconst identity = (...params) => {\n  let out\n  if (params.length === 1) {\n    out = params[0]\n  } else {\n    out = create()\n  }\n  out[0] = 1\n  out[1] = 0\n  out[2] = 0\n  out[3] = 0\n  out[4] = 0\n  out[5] = 1\n  out[6] = 0\n  out[7] = 0\n  out[8] = 0\n  out[9] = 0\n  out[10] = 1\n  out[11] = 0\n  out[12] = 0\n  out[13] = 0\n  out[14] = 0\n  out[15] = 1\n  return out\n}\n\nmodule.exports = identity\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/identity.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a 4x4 matrix which is column-major (when typed out it looks row-major).\n * @see {@link mat4} for data structure information.\n * @module modeling/maths/mat4\n */\nmodule.exports = {\n  add: __webpack_require__(/*! ./add */ \"./node_modules/@jscad/modeling/src/maths/mat4/add.js\"),\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/mat4/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/mat4/equals.js\"),\n  fromRotation: __webpack_require__(/*! ./fromRotation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromRotation.js\"),\n  fromScaling: __webpack_require__(/*! ./fromScaling */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromScaling.js\"),\n  fromTaitBryanRotation: __webpack_require__(/*! ./fromTaitBryanRotation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromTaitBryanRotation.js\"),\n  fromTranslation: __webpack_require__(/*! ./fromTranslation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromTranslation.js\"),\n  fromValues: __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromValues.js\"),\n  fromXRotation: __webpack_require__(/*! ./fromXRotation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromXRotation.js\"),\n  fromYRotation: __webpack_require__(/*! ./fromYRotation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromYRotation.js\"),\n  fromZRotation: __webpack_require__(/*! ./fromZRotation */ \"./node_modules/@jscad/modeling/src/maths/mat4/fromZRotation.js\"),\n  identity: __webpack_require__(/*! ./identity */ \"./node_modules/@jscad/modeling/src/maths/mat4/identity.js\"),\n  isMirroring: __webpack_require__(/*! ./isMirroring */ \"./node_modules/@jscad/modeling/src/maths/mat4/isMirroring.js\"),\n  mirror: __webpack_require__(/*! ./mirror */ \"./node_modules/@jscad/modeling/src/maths/mat4/mirror.js\"),\n  mirrorByPlane: __webpack_require__(/*! ./mirrorByPlane */ \"./node_modules/@jscad/modeling/src/maths/mat4/mirrorByPlane.js\"),\n  multiply: __webpack_require__(/*! ./multiply */ \"./node_modules/@jscad/modeling/src/maths/mat4/multiply.js\"),\n  rightMultiplyVec2: __webpack_require__(/*! ./rightMultiplyVec2 */ \"./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec2.js\"),\n  rightMultiplyVec3: __webpack_require__(/*! ./rightMultiplyVec3 */ \"./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec3.js\"),\n  rotate: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/maths/mat4/rotate.js\"),\n  rotateX: __webpack_require__(/*! ./rotateX */ \"./node_modules/@jscad/modeling/src/maths/mat4/rotateX.js\"),\n  rotateY: __webpack_require__(/*! ./rotateY */ \"./node_modules/@jscad/modeling/src/maths/mat4/rotateY.js\"),\n  rotateZ: __webpack_require__(/*! ./rotateZ */ \"./node_modules/@jscad/modeling/src/maths/mat4/rotateZ.js\"),\n  scale: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/maths/mat4/scale.js\"),\n  subtract: __webpack_require__(/*! ./subtract */ \"./node_modules/@jscad/modeling/src/maths/mat4/subtract.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/mat4/toString.js\"),\n  translate: __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/maths/mat4/translate.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/isMirroring.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/isMirroring.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cross = __webpack_require__(/*! ../vec3/cross */ \"./node_modules/@jscad/modeling/src/maths/vec3/cross.js\")\nconst dot = __webpack_require__(/*! ../vec3/dot */ \"./node_modules/@jscad/modeling/src/maths/vec3/dot.js\")\n\n/**\n * Determine whether the given matrix is a mirroring transformation.\n *\n * @param {mat4} matrix - the matrix\n * @returns {Boolean} true if matrix is a mirroring transformation\n * @alias module:modeling/maths/mat4.isMirroring\n */\nconst isMirroring = (mat) => {\n  const u = [mat[0], mat[4], mat[8]]\n  const v = [mat[1], mat[5], mat[9]]\n  const w = [mat[2], mat[6], mat[10]]\n\n  // for a true orthogonal, non-mirrored base, u.cross(v) == w\n  // If they have an opposite direction then we are mirroring\n  const mirrorvalue = dot(cross(u, v), w)\n  const ismirror = (mirrorvalue < 0)\n  return ismirror\n}\n\nmodule.exports = isMirroring\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/isMirroring.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/mirror.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/mirror.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/*\n * m the mat4 by the dimensions in the given vec3\n * create an affine matrix for mirroring into an arbitrary plane:\n *\n * @param {mat4} [out] - the receiving matrix (optional)\n * @param {vec3} v - the vec3 to mirror the matrix by\n * @param {mat4} a - the matrix to mirror\n * @returns {mat4} out\n */\nconst mirror = (...params) => {\n  let out\n  let a\n  let v\n  if (params.length === 2) {\n    out = create()\n    v = params[0]\n    a = params[1]\n  } else {\n    out = params[0]\n    v = params[1]\n    a = params[2]\n  }\n\n  const x = v[0]\n  const y = v[1]\n  const z = v[2]\n\n  out[0] = a[0] * x\n  out[1] = a[1] * x\n  out[2] = a[2] * x\n  out[3] = a[3] * x\n  out[4] = a[4] * y\n  out[5] = a[5] * y\n  out[6] = a[6] * y\n  out[7] = a[7] * y\n  out[8] = a[8] * z\n  out[9] = a[9] * z\n  out[10] = a[10] * z\n  out[11] = a[11] * z\n  out[12] = a[12]\n  out[13] = a[13]\n  out[14] = a[14]\n  out[15] = a[15]\n  return out\n}\n\nmodule.exports = mirror\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/mirror.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/mirrorByPlane.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/mirrorByPlane.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Create a matrix for mirroring onto an arbitrary plane.\n *\n * @param {mat4} [out] - receiving matrix\n * @param {vec4} plane - plane of which to mirror the matrix\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.mirrorByPlane\n */\nconst mirrorByPlane = (...params) => {\n  let out\n  let plane\n  if (params.length === 1) {\n    out = create()\n    plane = params[0]\n  } else {\n    out = params[0]\n    plane = params[1]\n  }\n  const [nx, ny, nz, w] = plane\n\n  out[0] = (1.0 - 2.0 * nx * nx)\n  out[1] = (-2.0 * ny * nx)\n  out[2] = (-2.0 * nz * nx)\n  out[3] = 0\n  out[4] = (-2.0 * nx * ny)\n  out[5] = (1.0 - 2.0 * ny * ny)\n  out[6] = (-2.0 * nz * ny)\n  out[7] = 0\n  out[8] = (-2.0 * nx * nz)\n  out[9] = (-2.0 * ny * nz)\n  out[10] = (1.0 - 2.0 * nz * nz)\n  out[11] = 0\n  out[12] = (2.0 * nx * w)\n  out[13] = (2.0 * ny * w)\n  out[14] = (2.0 * nz * w)\n  out[15] = 1\n\n  return out\n}\n\nmodule.exports = mirrorByPlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/mirrorByPlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/multiply.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/multiply.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Multiplies the two matrices.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {mat4} a - the first operand\n * @param {mat4} b - the second operand\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.multiply\n */\nconst multiply = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  const a00 = a[0]\n  const a01 = a[1]\n  const a02 = a[2]\n  const a03 = a[3]\n  const a10 = a[4]\n  const a11 = a[5]\n  const a12 = a[6]\n  const a13 = a[7]\n  const a20 = a[8]\n  const a21 = a[9]\n  const a22 = a[10]\n  const a23 = a[11]\n  const a30 = a[12]\n  const a31 = a[13]\n  const a32 = a[14]\n  const a33 = a[15]\n\n  // Cache only the current line of the second matrix\n  let b0 = b[0]\n  let b1 = b[1]\n  let b2 = b[2]\n  let b3 = b[3]\n  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30\n  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31\n  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32\n  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33\n\n  b0 = b[4]\n  b1 = b[5]\n  b2 = b[6]\n  b3 = b[7]\n  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30\n  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31\n  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32\n  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33\n\n  b0 = b[8]\n  b1 = b[9]\n  b2 = b[10]\n  b3 = b[11]\n  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30\n  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31\n  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32\n  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33\n\n  b0 = b[12]\n  b1 = b[13]\n  b2 = b[14]\n  b3 = b[15]\n  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30\n  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31\n  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32\n  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33\n  return out\n}\n\nmodule.exports = multiply\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/multiply.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec2.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec2.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ../vec2/fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\")\n\n/**\n * Multiply a 2D vector by a matrix (interpreted as 2 row, 1 column).\n * Calculation: result = v*M, where the fourth element is set to 1.\n * @param {vec2} vector - the input vector\n * @param {mat4} matrix - the input matrix\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/mat4.rightMultiplyVec2\n */\nconst rightMultiplyVec2 = (vector, matrix) => {\n  const [v0, v1] = vector\n  const v2 = 0\n  const v3 = 1\n  let x = v0 * matrix[0] + v1 * matrix[1] + v2 * matrix[2] + v3 * matrix[3]\n  let y = v0 * matrix[4] + v1 * matrix[5] + v2 * matrix[6] + v3 * matrix[7]\n  const w = v0 * matrix[12] + v1 * matrix[13] + v2 * matrix[14] + v3 * matrix[15]\n\n  // scale such that fourth element becomes 1:\n  if (w !== 1) {\n    const invw = 1.0 / w\n    x *= invw\n    y *= invw\n  }\n  return fromValues(x, y)\n}\n\nmodule.exports = rightMultiplyVec2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec3.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec3.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ../vec3/fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js\")\n\n/**\n * Multiply a 3D vector by a matrix (interpreted as 3 row, 1 column)\n * Calculation: result = v*M, where the fourth element is set to 1.\n * @param {vec3} vector - the input vector\n * @param {mat4} matrix - the input matrix\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/mat4.rightMultiplyVec3\n */\nconst rightMultiplyVec3 = (vector, matrix) => {\n  const [v0, v1, v2] = vector\n  const v3 = 1\n  let x = v0 * matrix[0] + v1 * matrix[1] + v2 * matrix[2] + v3 * matrix[3]\n  let y = v0 * matrix[4] + v1 * matrix[5] + v2 * matrix[6] + v3 * matrix[7]\n  let z = v0 * matrix[8] + v1 * matrix[9] + v2 * matrix[10] + v3 * matrix[11]\n  const w = v0 * matrix[12] + v1 * matrix[13] + v2 * matrix[14] + v3 * matrix[15]\n\n  // scale such that fourth element becomes 1:\n  if (w !== 1) {\n    const invw = 1.0 / w\n    x *= invw\n    y *= invw\n    z *= invw\n  }\n  return fromValues(x, y, z)\n}\n\nmodule.exports = rightMultiplyVec3\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rightMultiplyVec3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rotate.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rotate.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Rotates a matrix by the given angle about the given axis.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {Number} rad - the angle to rotate the matrix by\n * @param {vec3} axis - the axis to rotate around\n * @param {mat4} matrix - the matrix to rotate\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.rotate\n */\nconst rotate = (...params) => {\n  let out\n  let matrix\n  let rad\n  let axis\n  if (params.length === 3) {\n    out = create()\n    rad = params[0]\n    axis = params[1]\n    matrix = params[2]\n  } else {\n    out = params[0]\n    rad = params[1]\n    axis = params[2]\n    matrix = params[3]\n  }\n\n  let [x, y, z] = axis\n  let len = Math.sqrt(x * x + y * y + z * z)\n\n  if (Math.abs(len) < 0.000001) { return null }\n\n  len = 1 / len\n  x *= len\n  y *= len\n  z *= len\n\n  const s = Math.sin(rad)\n  const c = Math.cos(rad)\n  const t = 1 - c\n\n  const a00 = matrix[0]\n  const a01 = matrix[1]\n  const a02 = matrix[2]\n  const a03 = matrix[3]\n  const a10 = matrix[4]\n  const a11 = matrix[5]\n  const a12 = matrix[6]\n  const a13 = matrix[7]\n  const a20 = matrix[8]\n  const a21 = matrix[9]\n  const a22 = matrix[10]\n  const a23 = matrix[11]\n\n  // Construct the elements of the rotation matrix\n  const b00 = x * x * t + c\n  const b01 = y * x * t + z * s\n  const b02 = z * x * t - y * s\n  const b10 = x * y * t - z * s\n  const b11 = y * y * t + c\n  const b12 = z * y * t + x * s\n  const b20 = x * z * t + y * s\n  const b21 = y * z * t - x * s\n  const b22 = z * z * t + c\n\n  // Perform rotation-specific matrix multiplication\n  out[0] = a00 * b00 + a10 * b01 + a20 * b02\n  out[1] = a01 * b00 + a11 * b01 + a21 * b02\n  out[2] = a02 * b00 + a12 * b01 + a22 * b02\n  out[3] = a03 * b00 + a13 * b01 + a23 * b02\n  out[4] = a00 * b10 + a10 * b11 + a20 * b12\n  out[5] = a01 * b10 + a11 * b11 + a21 * b12\n  out[6] = a02 * b10 + a12 * b11 + a22 * b12\n  out[7] = a03 * b10 + a13 * b11 + a23 * b12\n  out[8] = a00 * b20 + a10 * b21 + a20 * b22\n  out[9] = a01 * b20 + a11 * b21 + a21 * b22\n  out[10] = a02 * b20 + a12 * b21 + a22 * b22\n  out[11] = a03 * b20 + a13 * b21 + a23 * b22\n\n  if (matrix !== out) { // If the source and destination differ, copy the unchanged last row\n    out[12] = matrix[12]\n    out[13] = matrix[13]\n    out[14] = matrix[14]\n    out[15] = matrix[15]\n  }\n  return out\n}\n\nmodule.exports = rotate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rotate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rotateX.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rotateX.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Rotates a matrix by the given angle around the X axis.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {Number} angle - the angle to rotate the matrix by (in radian)\n * @param {mat4} matrix - the matrix to rotate\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.rotateX\n */\nconst rotateX = (...params) => {\n  let out\n  let angle\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    angle = params[0]\n    matrix = params[1]\n  } else {\n    out = params[0]\n    angle = params[1]\n    matrix = params[2]\n  }\n\n  const s = Math.sin(angle)\n  const c = Math.cos(angle)\n  const a10 = matrix[4]\n  const a11 = matrix[5]\n  const a12 = matrix[6]\n  const a13 = matrix[7]\n  const a20 = matrix[8]\n  const a21 = matrix[9]\n  const a22 = matrix[10]\n  const a23 = matrix[11]\n\n  if (matrix !== out) { // If the source and destination differ, copy the unchanged rows\n    out[0] = matrix[0]\n    out[1] = matrix[1]\n    out[2] = matrix[2]\n    out[3] = matrix[3]\n    out[12] = matrix[12]\n    out[13] = matrix[13]\n    out[14] = matrix[14]\n    out[15] = matrix[15]\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[4] = a10 * c + a20 * s\n  out[5] = a11 * c + a21 * s\n  out[6] = a12 * c + a22 * s\n  out[7] = a13 * c + a23 * s\n  out[8] = a20 * c - a10 * s\n  out[9] = a21 * c - a11 * s\n  out[10] = a22 * c - a12 * s\n  out[11] = a23 * c - a13 * s\n  return out\n}\n\nmodule.exports = rotateX\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rotateX.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rotateY.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rotateY.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Rotates a matrix by the given angle around the Y axis.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {Number} angle - the angle to rotate the matrix by (in radian)\n * @param {mat4} matrix - the matrix to rotate\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.rotateY\n */\nconst rotateY = (...params) => {\n  let out\n  let angle\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    angle = params[0]\n    matrix = params[1]\n  } else {\n    out = params[0]\n    angle = params[1]\n    matrix = params[2]\n  }\n  const s = Math.sin(angle)\n  const c = Math.cos(angle)\n  const a00 = matrix[0]\n  const a01 = matrix[1]\n  const a02 = matrix[2]\n  const a03 = matrix[3]\n  const a20 = matrix[8]\n  const a21 = matrix[9]\n  const a22 = matrix[10]\n  const a23 = matrix[11]\n\n  if (matrix !== out) { // If the source and destination differ, copy the unchanged rows\n    out[4] = matrix[4]\n    out[5] = matrix[5]\n    out[6] = matrix[6]\n    out[7] = matrix[7]\n    out[12] = matrix[12]\n    out[13] = matrix[13]\n    out[14] = matrix[14]\n    out[15] = matrix[15]\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[0] = a00 * c - a20 * s\n  out[1] = a01 * c - a21 * s\n  out[2] = a02 * c - a22 * s\n  out[3] = a03 * c - a23 * s\n  out[8] = a00 * s + a20 * c\n  out[9] = a01 * s + a21 * c\n  out[10] = a02 * s + a22 * c\n  out[11] = a03 * s + a23 * c\n  return out\n}\n\nmodule.exports = rotateY\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rotateY.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/rotateZ.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/rotateZ.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Rotates a matrix by the given angle around the Y axis.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {Number} angle - the angle to rotate the matrix by (in radian)\n * @param {mat4} matrix - the matrix to rotate\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.rotateZ\n */\nconst rotateZ = (...params) => {\n  let out\n  let angle\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    angle = params[0]\n    matrix = params[1]\n  } else {\n    out = params[0]\n    angle = params[1]\n    matrix = params[2]\n  }\n  const s = Math.sin(angle)\n  const c = Math.cos(angle)\n  const a00 = matrix[0]\n  const a01 = matrix[1]\n  const a02 = matrix[2]\n  const a03 = matrix[3]\n  const a10 = matrix[4]\n  const a11 = matrix[5]\n  const a12 = matrix[6]\n  const a13 = matrix[7]\n\n  if (matrix !== out) { // If the source and destination differ, copy the unchanged last row\n    out[8] = matrix[8]\n    out[9] = matrix[9]\n    out[10] = matrix[10]\n    out[11] = matrix[11]\n    out[12] = matrix[12]\n    out[13] = matrix[13]\n    out[14] = matrix[14]\n    out[15] = matrix[15]\n  }\n\n  // Perform axis-specific matrix multiplication\n  out[0] = a00 * c + a10 * s\n  out[1] = a01 * c + a11 * s\n  out[2] = a02 * c + a12 * s\n  out[3] = a03 * c + a13 * s\n  out[4] = a10 * c - a00 * s\n  out[5] = a11 * c - a01 * s\n  out[6] = a12 * c - a02 * s\n  out[7] = a13 * c - a03 * s\n  return out\n}\n\nmodule.exports = rotateZ\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/rotateZ.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/scale.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/scale.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Scales the matrix by the given dimensions.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {vec3} dimensions - the dimensions to scale the matrix by\n * @param {mat4} matrix - the matrix to scale\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.scale\n */\nconst scale = (...params) => {\n  let out\n  let vector\n  let matrix\n\n  if (params.length === 2) {\n    out = create()\n    vector = params[0]\n    matrix = params[1]\n  } else {\n    out = params[0]\n    vector = params[1]\n    matrix = params[2]\n  }\n\n  const x = vector[0]\n  const y = vector[1]\n  const z = vector[2]\n\n  out[0] = matrix[0] * x\n  out[1] = matrix[1] * x\n  out[2] = matrix[2] * x\n  out[3] = matrix[3] * x\n  out[4] = matrix[4] * y\n  out[5] = matrix[5] * y\n  out[6] = matrix[6] * y\n  out[7] = matrix[7] * y\n  out[8] = matrix[8] * z\n  out[9] = matrix[9] * z\n  out[10] = matrix[10] * z\n  out[11] = matrix[11] * z\n  out[12] = matrix[12]\n  out[13] = matrix[13]\n  out[14] = matrix[14]\n  out[15] = matrix[15]\n  return out\n}\n\nmodule.exports = scale\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/scale.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/subtract.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/subtract.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Subtracts matrix b from matrix a.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {mat4} a - the first operand\n * @param {mat4} b - the second operand\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.subtract\n */\nconst subtract = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] - b[0]\n  out[1] = a[1] - b[1]\n  out[2] = a[2] - b[2]\n  out[3] = a[3] - b[3]\n  out[4] = a[4] - b[4]\n  out[5] = a[5] - b[5]\n  out[6] = a[6] - b[6]\n  out[7] = a[7] - b[7]\n  out[8] = a[8] - b[8]\n  out[9] = a[9] - b[9]\n  out[10] = a[10] - b[10]\n  out[11] = a[11] - b[11]\n  out[12] = a[12] - b[12]\n  out[13] = a[13] - b[13]\n  out[14] = a[14] - b[14]\n  out[15] = a[15] - b[15]\n  return out\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/subtract.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/toString.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/toString.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Return a string representing the given matrix.\n *\n * @param {mat4} matrix - the matrix of reference\n * @returns {String} string representation\n * @alias module:modeling/maths/mat4.toString\n */\nconst toString = (mat) => `[${mat[0].toFixed(7)}, ${mat[1].toFixed(7)}, ${mat[2].toFixed(7)}, ${mat[3].toFixed(7)}, ${mat[4].toFixed(7)}, ${mat[5].toFixed(7)}, ${mat[6].toFixed(7)}, ${mat[7].toFixed(7)}, ${mat[8].toFixed(7)}, ${mat[9].toFixed(7)}, ${mat[10].toFixed(7)}, ${mat[11].toFixed(7)}, ${mat[12].toFixed(7)}, ${mat[13].toFixed(7)}, ${mat[14].toFixed(7)}, ${mat[15].toFixed(7)}]`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/mat4/translate.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/mat4/translate.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/mat4/create.js\")\n\n/**\n * Translate the matrix by the given offset vector.\n *\n * @param {mat4} [out] - the receiving matrix\n * @param {vec3} offsets - offset vector to translate by\n * @param {mat4} matrix - the matrix to translate\n * @returns {mat4} a new matrix\n * @alias module:modeling/maths/mat4.translate\n */\nconst translate = (...params) => {\n  let out\n  let vector\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    vector = params[0]\n    matrix = params[1]\n  } else {\n    out = params[0]\n    vector = params[1]\n    matrix = params[2]\n  }\n  const x = vector[0]\n  const y = vector[1]\n  const z = vector[2]\n  let a00\n  let a01\n  let a02\n  let a03\n  let a10\n  let a11\n  let a12\n  let a13\n  let a20\n  let a21\n  let a22\n  let a23\n\n  if (matrix === out) {\n  // 0-11 assignments are unnecessary\n    out[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]\n    out[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]\n    out[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]\n    out[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]\n  } else {\n    a00 = matrix[0]; a01 = matrix[1]; a02 = matrix[2]; a03 = matrix[3]\n    a10 = matrix[4]; a11 = matrix[5]; a12 = matrix[6]; a13 = matrix[7]\n    a20 = matrix[8]; a21 = matrix[9]; a22 = matrix[10]; a23 = matrix[11]\n\n    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03\n    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13\n    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23\n\n    out[12] = a00 * x + a10 * y + a20 * z + matrix[12]\n    out[13] = a01 * x + a11 * y + a21 * z + matrix[13]\n    out[14] = a02 * x + a12 * y + a22 * z + matrix[14]\n    out[15] = a03 * x + a13 * y + a23 * z + matrix[15]\n  }\n\n  return out\n}\n\nmodule.exports = translate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/mat4/translate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/equals.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/equals.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Compare the given planes for equality.\n *\n * @param {plane} a - the first plane\n * @param {plane} b - the second plane\n * @return {Boolean} true if planes are equal\n * @alias module:modeling/maths/plane.equals\n */\nconst equals = (a, b) => ((a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2]) && (a[3] === b[3]))\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/flip.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/flip.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ../vec4/create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\")\n\n/**\n * Flip the given plane.\n *\n * @param {plane} [out] - receiving plane\n * @param {plane} plane - plane to flip\n * @return {plane} a new plane\n * @alias module:modeling/maths/plane.flip\n */\nconst flip = (...params) => {\n  let out, vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = -vec[0]\n  out[1] = -vec[1]\n  out[2] = -vec[2]\n  out[3] = -vec[3]\n  return out\n}\n\nmodule.exports = flip\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/flip.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/fromNormalAndPoint.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/fromNormalAndPoint.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\nconst fromValues = __webpack_require__(/*! ../vec4/fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js\")\n\n/**\n * Represents a plane in 3D coordinate space as determined by a normal (perpendicular to the plane)\n * and distance from 0,0,0.\n * The contents of the array are a normal [0,1,2] and a distance [3].\n * @see https://en.wikipedia.org/wiki/Hesse_normal_form\n * @typedef {Array} plane\n */\n\n/**\n * Create a new plane from the given normal and point values.\n * @param {vec3} normal - directional vector\n * @param {vec3} point - origin of plane\n * @returns {plane} a new plane\n * @alias module:modeling/maths/plane.fromNormalAndPoint\n */\nconst fromNormalAndPoint = (normal, point) => {\n  const u = vec3.unit(normal)\n  const w = vec3.dot(point, u)\n\n  return fromValues(u[0], u[1], u[2], w)\n}\n\nmodule.exports = fromNormalAndPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/fromNormalAndPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/fromPoints.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/fromPoints.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\nconst fromValues = __webpack_require__(/*! ../vec4/fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js\")\n\n/**\n * Create a plane from the given points.\n *\n * @param {vec3} a - 3D point\n * @param {vec3} b - 3D point\n * @param {vec3} c - 3D point\n * @returns {plane} a new plane\n * @alias module:modeling/maths/plane.fromPoints\n */\nconst fromPoints = (a, b, c) => {\n  const ba = vec3.subtract(b, a)\n  const ca = vec3.subtract(c, a)\n  vec3.cross(ba, ba, ca)\n  vec3.unit(ba, ba) // normal part\n  const w = vec3.dot(ba, a)\n  return fromValues(ba[0], ba[1], ba[2], w)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/fromPointsRandom.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/fromPointsRandom.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst { fromValues } = __webpack_require__(/*! ../vec4 */ \"./node_modules/@jscad/modeling/src/maths/vec4/index.js\")\n\n/**\n * Create a new plane from the given points like fromPoints,\n * but allow the vectors to be on one point or one line.\n * In such a case, a random plane through the given points is constructed.\n * @param {vec3} a - 3D point\n * @param {vec3} b - 3D point\n * @param {vec3} c - 3D point\n * @returns {plane} a new plane\n * @alias module:modeling/maths/plane.fromPointsRandom\n */\nconst fromPointsRandom = (a, b, c) => {\n  let ba = vec3.subtract(b, a)\n  let ca = vec3.subtract(c, a)\n  if (vec3.length(ba) < EPS) {\n    ba = vec3.orthogonal(ca)\n  }\n  if (vec3.length(ca) < EPS) {\n    ca = vec3.orthogonal(ba)\n  }\n  let normal = vec3.cross(ba, ca)\n  if (vec3.length(normal) < EPS) {\n    // this would mean that ba == ca.negated()\n    ca = vec3.orthogonal(ba)\n    normal = vec3.cross(ba, ca)\n  }\n  normal = vec3.unit(normal)\n  return fromValues(normal[0], normal[1], normal[2], vec3.dot(normal, a))\n}\n\nmodule.exports = fromPointsRandom\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/fromPointsRandom.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a plane in 3D coordinate space as determined by a normal (perpendicular to the plane)\n * and distance from 0,0,0.\n * @see {@link plane} for data structure information.\n * @module modeling/maths/plane\n */\nmodule.exports = {\n  /**\n   * @see [vec4.clone()]{@link module:modeling/maths/vec4.clone}\n   * @function clone\n   */\n  clone: __webpack_require__(/*! ../vec4/clone */ \"./node_modules/@jscad/modeling/src/maths/vec4/clone.js\"),\n  /**\n   * @see [vec4.create()]{@link module:modeling/maths/vec4.create}\n   * @function create\n   */\n  create: __webpack_require__(/*! ../vec4/create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/plane/equals.js\"),\n  flip: __webpack_require__(/*! ./flip */ \"./node_modules/@jscad/modeling/src/maths/plane/flip.js\"),\n  fromNormalAndPoint: __webpack_require__(/*! ./fromNormalAndPoint */ \"./node_modules/@jscad/modeling/src/maths/plane/fromNormalAndPoint.js\"),\n  /**\n   * @see [vec4.fromValues()]{@link module:modeling/maths/vec4.fromValues}\n   * @function fromValues\n   */\n  fromValues: __webpack_require__(/*! ../vec4/fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/maths/plane/fromPoints.js\"),\n  fromPointsRandom: __webpack_require__(/*! ./fromPointsRandom */ \"./node_modules/@jscad/modeling/src/maths/plane/fromPointsRandom.js\"),\n  signedDistanceToPoint: __webpack_require__(/*! ./signedDistanceToPoint */ \"./node_modules/@jscad/modeling/src/maths/plane/signedDistanceToPoint.js\"),\n  /**\n   * @see [vec4.toString()]{@link module:modeling/maths/vec4.toString}\n   * @function toString\n   */\n  toString: __webpack_require__(/*! ../vec4/toString */ \"./node_modules/@jscad/modeling/src/maths/vec4/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/plane/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/signedDistanceToPoint.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/signedDistanceToPoint.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Calculate the distance to the given point.\n * @param {plane} plane - plane of reference\n * @param {vec3} point - point of reference\n * @return {Number} signed distance to point\n * @alias module:modeling/maths/plane.signedDistanceToPoint\n */\nconst signedDistanceToPoint = (plane, vector) => vec3.dot(plane, vector) - plane[3]\n\nmodule.exports = signedDistanceToPoint\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/signedDistanceToPoint.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/plane/transform.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/plane/transform.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec3 = __webpack_require__(/*! ../vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst fromPoints = __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/maths/plane/fromPoints.js\")\nconst flip = __webpack_require__(/*! ./flip */ \"./node_modules/@jscad/modeling/src/maths/plane/flip.js\")\n\n/**\n * Transform the given plane using the given matrix\n * @param {mat4} matrix - the matrix to transform with\n * @param {plane} plane - the plane to transform\n * @return {Array} a new plane\n * @alias module:modeling/maths/plane.transform\n */\nconst transform = (matrix, plane) => {\n  const ismirror = mat4.isMirroring(matrix)\n  // get two vectors in the plane:\n  const r = vec3.orthogonal(plane)\n  const u = vec3.cross(plane, r)\n  const v = vec3.cross(plane, u)\n  // get 3 points in the plane:\n  let point1 = vec3.multiply(plane, [plane[3], plane[3], plane[3]])\n  let point2 = vec3.add(point1, u)\n  let point3 = vec3.add(point1, v)\n  // transform the points:\n  point1 = vec3.transform(matrix, point1)\n  point2 = vec3.transform(matrix, point2)\n  point3 = vec3.transform(matrix, point3)\n  // and create a new plane from the transformed points:\n  let newplane = fromPoints(point1, point2, point3)\n  if (ismirror) {\n    // the transform is mirroring so mirror the plane\n    newplane = flip(newplane)\n  }\n  return newplane\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/plane/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/area.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/area.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n * Calculate the area under the given points\n */\nconst area = (points) => {\n  let area = 0\n  for (let i = 0; i < points.length; i++) {\n    const j = (i + 1) % points.length\n    area += points[i][0] * points[j][1]\n    area -= points[j][0] * points[i][1]\n  }\n  return (area / 2.0)\n}\n\nmodule.exports = area\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/area.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/clamp.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/clamp.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nconst clamp = (value, min, max) => Math.min(Math.max(value, min), max)\n\nmodule.exports = clamp\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/clamp.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  area: __webpack_require__(/*! ./area */ \"./node_modules/@jscad/modeling/src/maths/utils/area.js\"),\n  clamp: __webpack_require__(/*! ./clamp */ \"./node_modules/@jscad/modeling/src/maths/utils/clamp.js\"),\n  interpolateBetween2DPointsForY: __webpack_require__(/*! ./interpolateBetween2DPointsForY */ \"./node_modules/@jscad/modeling/src/maths/utils/interpolateBetween2DPointsForY.js\"),\n  intersect: __webpack_require__(/*! ./intersect */ \"./node_modules/@jscad/modeling/src/maths/utils/intersect.js\"),\n  solve2Linear: __webpack_require__(/*! ./solve2Linear */ \"./node_modules/@jscad/modeling/src/maths/utils/solve2Linear.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/interpolateBetween2DPointsForY.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/interpolateBetween2DPointsForY.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Get the X coordinate of a point with a certain Y coordinate, interpolated between two points.\n * Interpolation is robust even if the points have the same Y coordinate\n * @return {Array} X and Y of interpolated point\n * @alias module:modeling/utils.interpolateBetween2DPointsForY\n */\nconst interpolateBetween2DPointsForY = (point1, point2, y) => {\n  let f1 = y - point1[1]\n  let f2 = point2[1] - point1[1]\n  if (f2 < 0) {\n    f1 = -f1\n    f2 = -f2\n  }\n  let t\n  if (f1 <= 0) {\n    t = 0.0\n  } else if (f1 >= f2) {\n    t = 1.0\n  } else if (f2 < 1e-10) { // FIXME Should this be EPS?\n    t = 0.5\n  } else {\n    t = f1 / f2\n  }\n  const result = point1[0] + t * (point2[0] - point1[0])\n  return result\n}\n\nmodule.exports = interpolateBetween2DPointsForY\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/interpolateBetween2DPointsForY.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/intersect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/intersect.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n * Calculate the intersect point of the two line segments (p1-p2 and p3-p4), end points included.\n * Note: If the line segments do NOT intersect then undefined is returned.\n * @see http://paulbourke.net/geometry/pointlineplane/\n * @param {vec2} p1 - first point of first line segment\n * @param {vec2} p2 - second point of first line segment\n * @param {vec2} p3 - first point of second line segment\n * @param {vec2} p4 - second point of second line segment\n * @returns {vec2} intersection point of the two line segments, or undefined\n */\nconst intersect = (p1, p2, p3, p4) => {\n  // Check if none of the lines are of length 0\n  if ((p1[0] === p2[0] && p1[1] === p2[1]) || (p3[0] === p4[0] && p3[1] === p4[1])) {\n    return undefined\n  }\n\n  const denominator = ((p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]))\n\n  // Lines are parallel\n  if (Math.abs(denominator) < Number.MIN_VALUE) {\n    return undefined\n  }\n\n  const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator\n  const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator\n\n  // is the intersection along the segments\n  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {\n    return undefined\n  }\n\n  // Return the x and y coordinates of the intersection\n  const x = p1[0] + ua * (p2[0] - p1[0])\n  const y = p1[1] + ua * (p2[1] - p1[1])\n\n  return [x, y]\n}\n\nmodule.exports = intersect\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/intersect.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/quantizeForSpace.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/quantizeForSpace.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { spatialResolution } = __webpack_require__(/*! ../constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\n// Quantize values for use in spatial coordinates, and so on.\nconst quantizeForSpace = (value) => (Math.round(value * spatialResolution) / spatialResolution)\n\nmodule.exports = quantizeForSpace\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/quantizeForSpace.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/utils/solve2Linear.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/utils/solve2Linear.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const solve2Linear = (a, b, c, d, u, v) => {\n  const det = a * d - b * c\n  const invdet = 1.0 / det\n  let x = u * d - b * v\n  let y = -u * c + a * v\n  x *= invdet\n  y *= invdet\n  return [x, y]\n}\n\nmodule.exports = solve2Linear\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/utils/solve2Linear.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/abs.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/abs.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Calculates the absolute coordinates of the given vector.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} vec - the vector of reference\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.abs\n */\nconst abs = (...params) => {\n  let out\n  let vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = Math.abs(vec[0])\n  out[1] = Math.abs(vec[1])\n  return out\n}\n\nmodule.exports = abs\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/abs.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/add.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/add.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Adds the coordinates of two vectors (A+B).\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.add\n */\nconst add = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] + b[0]\n  out[1] = a[1] + b[1]\n  return out\n}\n\nmodule.exports = add\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/add.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/angle.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/angle.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./angleRadians */ \"./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js\")\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/angle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/angleDegrees.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/angleDegrees.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const angleRadians = __webpack_require__(/*! ./angleRadians */ \"./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js\")\n\n/**\n * Calculate the angle of the given vector.\n * @param {vec2} vector - the vector of reference\n * @returns {Number} angle in degrees\n * @alias module:modeling/maths/vec2.angleDegrees\n */\nconst angleDegrees = (vector) => angleRadians(vector) * 57.29577951308232\n\nmodule.exports = angleDegrees\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/angleDegrees.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculate the angle of the given vector.\n * @param {vec2} vector - the vector of reference\n * @returns {Number} angle in radians\n * @alias module:modeling/maths/vec2.angleRadians\n */\nconst angleRadians = (vector) => Math.atan2(vector[1], vector[0]) // y=sin, x=cos\n\nmodule.exports = angleRadians\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/canonicalize.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/canonicalize.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\")\nconst quantizeForSpace = __webpack_require__(/*! ../utils/quantizeForSpace */ \"./node_modules/@jscad/modeling/src/maths/utils/quantizeForSpace.js\")\n\nconst canonicalize = (vector) => fromValues(quantizeForSpace(vector[0]),\n  quantizeForSpace(vector[1]))\n\nmodule.exports = canonicalize\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/canonicalize.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/clone.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/clone.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Create a clone of the given vector.\n *\n * @param {vec2} [out] - receiving vector\n * @param {vec2} vec - vector to clone\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.clone\n */\nconst clone = (...params) => {\n  let out\n  let vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = vec[0]\n  out[1] = vec[1]\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/create.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a two dimensional vector.\n * See fromValues().\n * @typedef {Array} vec2\n */\n\n/**\n * Creates a new vector, intialized to [0,0].\n *\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.create\n */\nconst create = () => [0, 0]\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/cross.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/cross.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../vec3/index */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Computes the cross product (3D) of two vectors.\n *\n * @param {vec3} [out] - the receiving vector (3D)\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec3} a new 3D vector\n * @alias module:modeling/maths/vec2.cross\n */\nconst cross = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = vec3.create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = 0\n  out[1] = 0\n  out[2] = a[0] * b[1] - a[1] * b[0]\n  // alternative return vec3.cross(out, vec3.fromVec2(a), vec3.fromVec2(b))\n  return out\n}\n\nmodule.exports = cross\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/cross.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/distance.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/distance.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the distance between two vectors.\n *\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {Number} distance\n * @alias module:modeling/maths/vec2.distance\n */\nconst distance = (a, b) => {\n  const x = b[0] - a[0]\n  const y = b[1] - a[1]\n  return Math.hypot(x, y)\n}\n\nmodule.exports = distance\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/distance.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/divide.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/divide.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Divides the coordinates of two vectors (A/B).\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.divide\n */\nconst divide = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] / b[0]\n  out[1] = a[1] / b[1]\n  return out\n}\n\nmodule.exports = divide\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/divide.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/dot.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/dot.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the dot product of two vectors.\n *\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {Number} dot product\n * @alias module:modeling/maths/vec2.dot\n */\nconst dot = (a, b) => a[0] * b[0] + a[1] * b[1]\n\nmodule.exports = dot\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/dot.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/equals.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/equals.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Compare the given vectors for equality.\n *\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {Boolean} true if a and b are equal\n * @alias module:modeling/maths/vec2.equals\n */\nconst equals = (a, b) => (a[0] === b[0]) && (a[1] === b[1])\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromAngle.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromAngle.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// this is just an alias\nmodule.exports = __webpack_require__(/*! ./fromAngleRadians */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromAngleRadians.js\")\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromAngle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromAngleDegrees.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromAngleDegrees.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\")\n\n/**\n * Create a new vector in the direction of the given angle.\n * @param {Number} angle - angle in degrees\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.fromAngleDegrees\n */\nconst fromAngleDegrees = (degrees) => {\n  const radians = Math.PI * degrees / 180\n  return fromValues(Math.cos(radians), Math.sin(radians))\n}\n\nmodule.exports = fromAngleDegrees\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromAngleDegrees.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromAngleRadians.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromAngleRadians.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\")\n\n/**\n * Create a new vector in the direction of the given angle.\n * @param {Number} angle - angle in radians\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.fromAngleRadians\n */\nconst fromAngleRadians = (radians) => fromValues(Math.cos(radians), Math.sin(radians))\n\nmodule.exports = fromAngleRadians\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromAngleRadians.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Create a new vector initialized with the values in the given array.\n * @param {Array} data - array of numerical values\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.fromArray\n */\nconst fromArray = (data) => {\n  const out = create()\n  out[0] = data[0]\n  out[1] = data[1]\n  return out\n}\n\nmodule.exports = fromArray\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromArray.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromScalar.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromScalar.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\")\n\n/**\n * Create a vector from a single scalar value.\n * @param  {Number} scalar\n * @returns {Vec2} a new vector\n * @alias module:modeling/maths/vec2.fromScalar\n */\nconst fromScalar = (scalar) => fromValues(scalar, scalar)\n\nmodule.exports = fromScalar\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromScalar.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Creates a new vector initialized with the given values.\n *\n * @param {Number} x - X coordinate\n * @param {Number} y - Y coordinate\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.fromValues\n */\nconst fromValues = (x, y) => {\n  const out = create()\n  out[0] = x\n  out[1] = y\n  return out\n}\n\nmodule.exports = fromValues\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a two dimensional vector.\n * @module modeling/maths/vec2\n */\nmodule.exports = {\n  abs: __webpack_require__(/*! ./abs */ \"./node_modules/@jscad/modeling/src/maths/vec2/abs.js\"),\n  add: __webpack_require__(/*! ./add */ \"./node_modules/@jscad/modeling/src/maths/vec2/add.js\"),\n  angle: __webpack_require__(/*! ./angle */ \"./node_modules/@jscad/modeling/src/maths/vec2/angle.js\"),\n  angleDegrees: __webpack_require__(/*! ./angleDegrees */ \"./node_modules/@jscad/modeling/src/maths/vec2/angleDegrees.js\"),\n  angleRadians: __webpack_require__(/*! ./angleRadians */ \"./node_modules/@jscad/modeling/src/maths/vec2/angleRadians.js\"),\n  canonicalize: __webpack_require__(/*! ./canonicalize */ \"./node_modules/@jscad/modeling/src/maths/vec2/canonicalize.js\"),\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/vec2/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\"),\n  cross: __webpack_require__(/*! ./cross */ \"./node_modules/@jscad/modeling/src/maths/vec2/cross.js\"),\n  distance: __webpack_require__(/*! ./distance */ \"./node_modules/@jscad/modeling/src/maths/vec2/distance.js\"),\n  divide: __webpack_require__(/*! ./divide */ \"./node_modules/@jscad/modeling/src/maths/vec2/divide.js\"),\n  dot: __webpack_require__(/*! ./dot */ \"./node_modules/@jscad/modeling/src/maths/vec2/dot.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/vec2/equals.js\"),\n  fromAngle: __webpack_require__(/*! ./fromAngle */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromAngle.js\"),\n  fromAngleDegrees: __webpack_require__(/*! ./fromAngleDegrees */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromAngleDegrees.js\"),\n  fromAngleRadians: __webpack_require__(/*! ./fromAngleRadians */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromAngleRadians.js\"),\n  fromArray: __webpack_require__(/*! ./fromArray */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromArray.js\"),\n  fromScalar: __webpack_require__(/*! ./fromScalar */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromScalar.js\"),\n  fromValues: __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec2/fromValues.js\"),\n  length: __webpack_require__(/*! ./length */ \"./node_modules/@jscad/modeling/src/maths/vec2/length.js\"),\n  lerp: __webpack_require__(/*! ./lerp */ \"./node_modules/@jscad/modeling/src/maths/vec2/lerp.js\"),\n  max: __webpack_require__(/*! ./max */ \"./node_modules/@jscad/modeling/src/maths/vec2/max.js\"),\n  min: __webpack_require__(/*! ./min */ \"./node_modules/@jscad/modeling/src/maths/vec2/min.js\"),\n  multiply: __webpack_require__(/*! ./multiply */ \"./node_modules/@jscad/modeling/src/maths/vec2/multiply.js\"),\n  negate: __webpack_require__(/*! ./negate */ \"./node_modules/@jscad/modeling/src/maths/vec2/negate.js\"),\n  normal: __webpack_require__(/*! ./normal */ \"./node_modules/@jscad/modeling/src/maths/vec2/normal.js\"),\n  normalize: __webpack_require__(/*! ./normalize */ \"./node_modules/@jscad/modeling/src/maths/vec2/normalize.js\"),\n  rotate: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/maths/vec2/rotate.js\"),\n  scale: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/maths/vec2/scale.js\"),\n  squaredDistance: __webpack_require__(/*! ./squaredDistance */ \"./node_modules/@jscad/modeling/src/maths/vec2/squaredDistance.js\"),\n  squaredLength: __webpack_require__(/*! ./squaredLength */ \"./node_modules/@jscad/modeling/src/maths/vec2/squaredLength.js\"),\n  subtract: __webpack_require__(/*! ./subtract */ \"./node_modules/@jscad/modeling/src/maths/vec2/subtract.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/vec2/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/vec2/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/length.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/length.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the length of the given vector.\n *\n * @param {vec2} vector - vector of reference\n * @returns {Number} length\n * @alias module:modeling/maths/vec2.length\n */\nconst length = (a) => {\n  const x = a[0]\n  const y = a[1]\n  return Math.hypot(x, y)\n}\n\nmodule.exports = length\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/length.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/lerp.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/lerp.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Performs a linear interpolation between two vectors.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {Number} t - interpolation amount between the two vectors\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.lerp\n */\nconst lerp = (...params) => {\n  let out\n  let t\n  let a\n  let b\n  if (params.length === 3) {\n    out = create()\n    t = params[0]\n    a = params[1]\n    b = params[2]\n  } else {\n    out = params[0]\n    t = params[1]\n    a = params[2]\n    b = params[3]\n  }\n  const ax = a[0]\n  const ay = a[1]\n  out[0] = ax + t * (b[0] - ax)\n  out[1] = ay + t * (b[1] - ay)\n  return out\n}\n\nmodule.exports = lerp\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/lerp.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/max.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/max.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Returns the maximum coordinates of two vectors.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.max\n */\nconst max = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = Math.max(a[0], b[0])\n  out[1] = Math.max(a[1], b[1])\n  return out\n}\n\nmodule.exports = max\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/max.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/min.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/min.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Returns the minimum coordinates of two vectors.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.min\n */\nconst min = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = Math.min(a[0], b[0])\n  out[1] = Math.min(a[1], b[1])\n  return out\n}\n\nmodule.exports = min\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/min.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/multiply.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/multiply.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Multiplies the coordinates of two vectors (A*B).\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.multiply\n */\nconst multiply = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] * b[0]\n  out[1] = a[1] * b[1]\n  return out\n}\n\nmodule.exports = multiply\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/multiply.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/negate.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/negate.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Negates the coordinates of the given vector.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - vector to negate\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.negate\n */\nconst negate = (...params) => {\n  let out\n  let a\n  if (params.length === 1) {\n    out = create()\n    a = params[0]\n  } else {\n    out = params[0]\n    a = params[1]\n  }\n  out[0] = -a[0]\n  out[1] = -a[1]\n  return out\n}\n\nmodule.exports = negate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/negate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/normal.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/normal.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const rotate = __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/maths/vec2/rotate.js\")\n\n/**\n * Calculates the normal of the given vector.\n * The normal value is the given vector rotated 90 degress.\n *\n * @param {vec2} [out] - receiving vector\n * @param {vec2} vec - given value\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.normal\n */\nconst normal = (...params) => {\n  if (params.length === 1) {\n    const vec = params[0]\n    return rotate((Math.PI / 2), vec)\n  } else {\n    const out = params[0]\n    const vec = params[1]\n    return rotate(out, (Math.PI / 2), vec)\n  }\n}\n\nmodule.exports = normal\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/normal.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/normalize.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/normalize.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Normalize the given vector.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - vector to normalize\n * @returns {vec2} a new (unit) vector\n * @alias module:modeling/maths/vec2.normalize\n */\nconst normalize = (...params) => {\n  let a\n  let out\n  if (params.length === 1) {\n    out = create()\n    a = params[0]\n  } else {\n    out = params[0]\n    a = params[1]\n  }\n  const x = a[0]\n  const y = a[1]\n  let len = x * x + y * y\n  if (len > 0) {\n    len = 1 / Math.sqrt(len)\n  }\n  out[0] = x * len\n  out[1] = y * len\n  return out\n}\n\n// old this.dividedBy(this.length())\n\nmodule.exports = normalize\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/normalize.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/rotate.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/rotate.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Rotates the given vector by the given angle.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {Number} angle - the angle of rotation (radians)\n * @param {vec2} vector - the vector to rotate\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.rotate\n */\nconst rotate = (...params) => {\n  let out\n  let vector\n  let angle\n  if (params.length === 2) {\n    out = create()\n    angle = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    angle = params[1]\n    vector = params[2]\n  }\n\n  const c = Math.cos(angle)\n  const s = Math.sin(angle)\n  const x = vector[0]\n  const y = vector[1]\n\n  out[0] = x * c - y * s\n  out[1] = x * s + y * c\n\n  return out\n}\n\nmodule.exports = rotate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/rotate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/scale.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/scale.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Scales the coordinates of the given vector.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {Number} amount - amount to scale\n * @param {vec2} vector - the vector to scale\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.scale\n */\nconst scale = (...params) => {\n  let out\n  let vector\n  let amount\n  if (params.length === 2) {\n    out = create()\n    amount = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    amount = params[1]\n    vector = params[2]\n  }\n  out[0] = vector[0] * amount\n  out[1] = vector[1] * amount\n  return out\n}\n\nmodule.exports = scale\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/scale.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/squaredDistance.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/squaredDistance.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the squared distance between the given vectors.\n *\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {Number} squared distance\n * @alias module:modeling/maths/vec2.squaredDistance\n */\nconst squaredDistance = (a, b) => {\n  const x = b[0] - a[0]\n  const y = b[1] - a[1]\n  return x * x + y * y\n}\n\nmodule.exports = squaredDistance\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/squaredDistance.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/squaredLength.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/squaredLength.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the squared length of the given vector.\n *\n * @param {vec2} vector - vector of reference\n * @returns {Number} squared length\n * @alias module:modeling/maths/vec2.squaredLength\n */\nconst squaredLength = (a) => {\n  const x = a[0]\n  const y = a[1]\n  return x * x + y * y\n}\n\nmodule.exports = squaredLength\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/squaredLength.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/subtract.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/subtract.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Subtracts the coordinates of two vectors (A-B).\n *\n * @param {vec2} [out] - the receiving vector\n * @param {vec2} a - the first operand\n * @param {vec2} b - the second operand\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.subtract\n */\nconst subtract = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] - b[0]\n  out[1] = a[1] - b[1]\n  return out\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/subtract.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/toString.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/toString.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert the given vector to a representative string.\n * @param {vec2} vector - vector of reference\n * @returns {String} string representation\n * @alias module:modeling/maths/vec2.toString\n */\nconst toString = (vec) => `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}]`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec2/transform.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec2/transform.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec2/create.js\")\n\n/**\n * Transforms the given vector using the given matrix.\n *\n * @param {vec2} [out] - the receiving vector\n * @param {mat4} matrix - matrix to transform with\n * @param {vec2} vector - the vector to transform\n * @returns {vec2} a new vector\n * @alias module:modeling/maths/vec2.transform\n */\nconst transform = (...params) => {\n  let out\n  let matrix\n  let vector\n  if (params.length === 2) {\n    out = create()\n    matrix = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    matrix = params[1]\n    vector = params[2]\n  }\n  const x = vector[0]\n  const y = vector[1]\n  out[0] = matrix[0] * x + matrix[4] * y + matrix[12]\n  out[1] = matrix[1] * x + matrix[5] * y + matrix[13]\n  return out\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec2/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/abs.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/abs.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Calculates the absolute coordinates of the give vector.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} vec - the vector of reference\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.abs\n */\nconst abs = (...params) => {\n  let out\n  let vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = Math.abs(vec[0])\n  out[1] = Math.abs(vec[1])\n  out[2] = Math.abs(vec[2])\n  return out\n}\n\nmodule.exports = abs\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/abs.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/add.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/add.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Adds the coordinates of two vectors (A+B).\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.add\n */\nconst add = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] + b[0]\n  out[1] = a[1] + b[1]\n  out[2] = a[2] + b[2]\n  return out\n}\n\nmodule.exports = add\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/add.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/angle.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/angle.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const dot = __webpack_require__(/*! ./dot */ \"./node_modules/@jscad/modeling/src/maths/vec3/dot.js\")\n\n/**\n * Calculate the angle between two vectors.\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {Number} angle (radians)\n * @alias module:modeling/maths/vec3.angle\n */\nconst angle = (a, b) => {\n  const ax = a[0]\n  const ay = a[1]\n  const az = a[2]\n  const bx = b[0]\n  const by = b[1]\n  const bz = b[2]\n  const mag1 = Math.sqrt(ax * ax + ay * ay + az * az)\n  const mag2 = Math.sqrt(bx * bx + by * by + bz * bz)\n  const mag = mag1 * mag2\n  const cosine = mag && dot(a, b) / mag\n  return Math.acos(Math.min(Math.max(cosine, -1), 1))\n}\n\nmodule.exports = angle\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/angle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/canonicalize.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/canonicalize.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js\")\nconst quantizeForSpace = __webpack_require__(/*! ../utils/quantizeForSpace */ \"./node_modules/@jscad/modeling/src/maths/utils/quantizeForSpace.js\")\n\nconst canonicalize = (vector) => fromValues(quantizeForSpace(vector[0]),\n  quantizeForSpace(vector[1]),\n  vector[2] === undefined ? 0 : quantizeForSpace(vector[2]))\n\nmodule.exports = canonicalize\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/canonicalize.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/clone.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/clone.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Create a clone of the given vector.\n *\n * @param {vec3} [out] - receiving vector\n * @param {vec3} vec - vector to clone\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.clone\n */\nconst clone = (...params) => {\n  let out\n  let vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = vec[0]\n  out[1] = vec[1]\n  out[2] = vec[2]\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/create.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a three dimensional vector.\n * See fromValues().\n * @typedef {Array} vec3\n */\n\n/**\n * Creates a new vector initialized to [0,0,0].\n *\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.create\n */\nconst create = () => [0, 0, 0]\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/cross.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/cross.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Computes the cross product of the given vectors.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.cross\n */\nconst cross = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  const ax = a[0]\n  const ay = a[1]\n  const az = a[2]\n  const bx = b[0]\n  const by = b[1]\n  const bz = b[2]\n\n  out[0] = ay * bz - az * by\n  out[1] = az * bx - ax * bz\n  out[2] = ax * by - ay * bx\n  return out\n}\n\nmodule.exports = cross\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/cross.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/distance.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/distance.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the euclidian distance between the given vectors.\n *\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {Number} distance\n * @alias module:modeling/maths/vec3.distance\n */\nconst distance = (a, b) => {\n  const x = b[0] - a[0]\n  const y = b[1] - a[1]\n  const z = b[2] - a[2]\n  return Math.hypot(x, y, z)\n}\n\nmodule.exports = distance\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/distance.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/divide.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/divide.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Divides the coordinates of two vectors (A/B).\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the dividend vector\n * @param {vec3} b - the divisor vector\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.divide\n */\nconst divide = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] / b[0]\n  out[1] = a[1] / b[1]\n  out[2] = a[2] / b[2]\n  return out\n}\n\nmodule.exports = divide\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/divide.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/dot.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/dot.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the dot product of two vectors.\n *\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {Number} dot product\n * @alias module:modeling/maths/vec3.dot\n */\nconst dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]\n\nmodule.exports = dot\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/dot.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/equals.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/equals.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Compare the given vectors for equality.\n *\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {Boolean} true if a and b are equal\n * @alias module:modeling/maths/vec3.equals\n */\nconst equals = (a, b) => (a[0] === b[0]) && (a[1] === b[1]) && (a[2] === b[2])\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/fromArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/fromArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Creates a new vector initialized with the values in the given array.\n * @param {Array} data - array of numerical values\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.fromArray\n */\nconst fromArray = (data) => {\n  const out = create()\n  out[0] = data[0]\n  out[1] = data[1]\n  out[2] = data[2]\n  return out\n}\n\nmodule.exports = fromArray\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/fromArray.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/fromScalar.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/fromScalar.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js\")\n\n/**\n * Creates a vector from a single scalar value.\n * All components of the resulting vector have the given value.\n * @param {Float} scalar\n * @returns {Vec3} a new vector\n * @alias module:modeling/maths/vec3.fromScalar\n */\nconst fromScalar = (scalar) => fromValues(scalar, scalar, scalar)\n\nmodule.exports = fromScalar\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/fromScalar.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Creates a new vector initialized with the given values.\n *\n * @param {Number} x - X component\n * @param {Number} y - Y component\n * @param {Number} z - Z component\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.fromValues\n */\nconst fromValues = (x, y, z) => {\n  const out = create()\n  out[0] = x\n  out[1] = y\n  out[2] = z\n  return out\n}\n\nmodule.exports = fromValues\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/fromVec2.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/fromVec2.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js\")\n\n/**\n * Create a new vector by extending a 2D vector with a Z value.\n * @param {Array} vector - the vector of values\n * @param {Number} [z=0] - Z value\n * @alias module:modeling/maths/vec3.fromVec2\n */\nconst fromVector2 = (vec2, z = 0) => fromValues(vec2[0], vec2[1], z)\n\nmodule.exports = fromVector2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/fromVec2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a three dimensional vector.\n * @see {@link vec3} for data structure information.\n * @module modeling/maths/vec3\n */\nmodule.exports = {\n  abs: __webpack_require__(/*! ./abs */ \"./node_modules/@jscad/modeling/src/maths/vec3/abs.js\"),\n  add: __webpack_require__(/*! ./add */ \"./node_modules/@jscad/modeling/src/maths/vec3/add.js\"),\n  angle: __webpack_require__(/*! ./angle */ \"./node_modules/@jscad/modeling/src/maths/vec3/angle.js\"),\n  canonicalize: __webpack_require__(/*! ./canonicalize */ \"./node_modules/@jscad/modeling/src/maths/vec3/canonicalize.js\"),\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/vec3/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\"),\n  cross: __webpack_require__(/*! ./cross */ \"./node_modules/@jscad/modeling/src/maths/vec3/cross.js\"),\n  distance: __webpack_require__(/*! ./distance */ \"./node_modules/@jscad/modeling/src/maths/vec3/distance.js\"),\n  divide: __webpack_require__(/*! ./divide */ \"./node_modules/@jscad/modeling/src/maths/vec3/divide.js\"),\n  dot: __webpack_require__(/*! ./dot */ \"./node_modules/@jscad/modeling/src/maths/vec3/dot.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/maths/vec3/equals.js\"),\n  fromArray: __webpack_require__(/*! ./fromArray */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromArray.js\"),\n  fromScalar: __webpack_require__(/*! ./fromScalar */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromScalar.js\"),\n  fromValues: __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromValues.js\"),\n  fromVec2: __webpack_require__(/*! ./fromVec2 */ \"./node_modules/@jscad/modeling/src/maths/vec3/fromVec2.js\"),\n  length: __webpack_require__(/*! ./length */ \"./node_modules/@jscad/modeling/src/maths/vec3/length.js\"),\n  lerp: __webpack_require__(/*! ./lerp */ \"./node_modules/@jscad/modeling/src/maths/vec3/lerp.js\"),\n  max: __webpack_require__(/*! ./max */ \"./node_modules/@jscad/modeling/src/maths/vec3/max.js\"),\n  min: __webpack_require__(/*! ./min */ \"./node_modules/@jscad/modeling/src/maths/vec3/min.js\"),\n  multiply: __webpack_require__(/*! ./multiply */ \"./node_modules/@jscad/modeling/src/maths/vec3/multiply.js\"),\n  negate: __webpack_require__(/*! ./negate */ \"./node_modules/@jscad/modeling/src/maths/vec3/negate.js\"),\n  normalize: __webpack_require__(/*! ./normalize */ \"./node_modules/@jscad/modeling/src/maths/vec3/normalize.js\"),\n  orthogonal: __webpack_require__(/*! ./orthogonal */ \"./node_modules/@jscad/modeling/src/maths/vec3/orthogonal.js\"),\n  rotateX: __webpack_require__(/*! ./rotateX */ \"./node_modules/@jscad/modeling/src/maths/vec3/rotateX.js\"),\n  rotateY: __webpack_require__(/*! ./rotateY */ \"./node_modules/@jscad/modeling/src/maths/vec3/rotateY.js\"),\n  rotateZ: __webpack_require__(/*! ./rotateZ */ \"./node_modules/@jscad/modeling/src/maths/vec3/rotateZ.js\"),\n  scale: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/maths/vec3/scale.js\"),\n  squaredDistance: __webpack_require__(/*! ./squaredDistance */ \"./node_modules/@jscad/modeling/src/maths/vec3/squaredDistance.js\"),\n  squaredLength: __webpack_require__(/*! ./squaredLength */ \"./node_modules/@jscad/modeling/src/maths/vec3/squaredLength.js\"),\n  subtract: __webpack_require__(/*! ./subtract */ \"./node_modules/@jscad/modeling/src/maths/vec3/subtract.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/vec3/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/vec3/transform.js\"),\n  unit: __webpack_require__(/*! ./unit */ \"./node_modules/@jscad/modeling/src/maths/vec3/unit.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/length.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/length.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the length of a vector.\n *\n * @param {vec3} vector - vector to calculate length of\n * @returns {Number} length\n * @alias module:modeling/maths/vec3.length\n */\nconst length = (a) => {\n  const x = a[0]\n  const y = a[1]\n  const z = a[2]\n  return Math.hypot(x, y, z)\n}\n\nmodule.exports = length\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/length.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/lerp.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/lerp.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Performs a linear interpolation between two vectors.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {Number} t - interpolant (0.0 to 1.0) applied between the two inputs\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.lerp\n */\nconst lerp = (...params) => {\n  let out\n  let t\n  let a\n  let b\n  if (params.length === 3) {\n    out = create()\n    t = params[0]\n    a = params[1]\n    b = params[2]\n  } else {\n    out = params[0]\n    t = params[1]\n    a = params[2]\n    b = params[3]\n  }\n  out[0] = a[0] + t * (b[0] - a[0])\n  out[1] = a[1] + t * (b[1] - a[1])\n  out[2] = a[2] + t * (b[2] - a[2])\n  return out\n}\n\nmodule.exports = lerp\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/lerp.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/max.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/max.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Returns the maximum coordinates of the given vectors.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.max\n */\nconst max = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = Math.max(a[0], b[0])\n  out[1] = Math.max(a[1], b[1])\n  out[2] = Math.max(a[2], b[2])\n  return out\n}\n\nmodule.exports = max\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/max.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/min.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/min.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Returns the minimum coordinates of the given vectors.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.min\n */\nconst min = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = Math.min(a[0], b[0])\n  out[1] = Math.min(a[1], b[1])\n  out[2] = Math.min(a[2], b[2])\n  return out\n}\n\nmodule.exports = min\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/min.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/multiply.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/multiply.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Multiplies the coordinates of the given vectors (A*B).\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.multiply\n */\nconst multiply = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] * b[0]\n  out[1] = a[1] * b[1]\n  out[2] = a[2] * b[2]\n  return out\n}\n\nmodule.exports = multiply\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/multiply.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/negate.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/negate.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Negates the coordinates of a vector.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} vector - vector to negate\n * @returns {vec3} a new vectory\n * @alias module:modeling/maths/vec3.negate\n */\nconst negate = (...params) => {\n  let out\n  let a\n  if (params.length === 1) {\n    out = create()\n    a = params[0]\n  } else {\n    out = params[0]\n    a = params[1]\n  }\n  out[0] = -a[0]\n  out[1] = -a[1]\n  out[2] = -a[2]\n  return out\n}\n\nmodule.exports = negate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/negate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/normalize.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/normalize.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Normalize the given vector.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} vector - vector to normalize\n * @returns {vec3} a new (unit) vector\n * @alias module:modeling/maths/vec3.normalize\n */\nconst normalize = (...params) => {\n  let a\n  let out\n  if (params.length === 1) {\n    a = params[0]\n    out = create()\n  } else {\n    out = params[0]\n    a = params[1]\n  }\n  const x = a[0]\n  const y = a[1]\n  const z = a[2]\n  let len = x * x + y * y + z * z\n  if (len > 0) {\n    len = 1 / Math.sqrt(len)\n  }\n  out[0] = x * len\n  out[1] = y * len\n  out[2] = z * len\n  return out\n}\n\nmodule.exports = normalize\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/normalize.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/orthogonal.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/orthogonal.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const abs = __webpack_require__(/*! ./abs */ \"./node_modules/@jscad/modeling/src/maths/vec3/abs.js\")\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Create a vector that is somewhat orthogonal to the given vector.\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} vector - vector of reference\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.orthogonal\n */\nconst orthogonal = (...params) => {\n  let out\n  let vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  abs(out, vec)\n  if ((out[0] <= out[1]) && (out[0] <= out[2])) {\n    out[0] = 1\n    out[1] = 0\n    out[2] = 0\n  } else if ((out[1] <= out[0]) && (out[1] <= out[2])) {\n    out[0] = 0\n    out[1] = 1\n    out[2] = 0\n  } else {\n    out[0] = 0\n    out[1] = 0\n    out[2] = 1\n  }\n  return out\n}\n\nmodule.exports = orthogonal\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/orthogonal.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/rotateX.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/rotateX.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Rotate the given vector around the given origin, X axis only.\n * @param {vec3} [out] - the receiving vector\n * @param {Number} angle - the angle of rotation\n * @param {vec3} origin - the origin of the rotation\n * @param {vec3} vector - the vector to rotate\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.rotateX\n */\nconst rotateX = (...params) => {\n  let out\n  let angle\n  let vector\n  let origin\n  if (params.length === 3) {\n    out = create()\n    angle = params[0]\n    origin = params[1]\n    vector = params[2]\n  } else {\n    out = params[0]\n    angle = params[1]\n    origin = params[2]\n    vector = params[3]\n  }\n  const p = []\n  const r = []\n\n  // translate point to the origin\n  p[0] = vector[0] - origin[0]\n  p[1] = vector[1] - origin[1]\n  p[2] = vector[2] - origin[2]\n\n  // perform rotation\n  r[0] = p[0]\n  r[1] = p[1] * Math.cos(angle) - p[2] * Math.sin(angle)\n  r[2] = p[1] * Math.sin(angle) + p[2] * Math.cos(angle)\n\n  // translate to correct position\n  out[0] = r[0] + origin[0]\n  out[1] = r[1] + origin[1]\n  out[2] = r[2] + origin[2]\n\n  return out\n}\n\nmodule.exports = rotateX\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/rotateX.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/rotateY.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/rotateY.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Rotate the given vector around the given origin, Y axis only.\n * @param {vec3} [out] - the receiving vector\n * @param {Number} angle - the angle of rotation\n * @param {vec3} origin - the origin of the rotation\n * @param {vec3} vector - the vector to rotate\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.rotateY\n */\nconst rotateY = (...params) => {\n  let out\n  let angle\n  let vector\n  let origin\n  if (params.length === 3) {\n    out = create()\n    angle = params[0]\n    origin = params[1]\n    vector = params[2]\n  } else {\n    out = params[0]\n    angle = params[1]\n    origin = params[2]\n    vector = params[3]\n  }\n  const p = []\n  const r = []\n\n  // translate point to the origin\n  p[0] = vector[0] - origin[0]\n  p[1] = vector[1] - origin[1]\n  p[2] = vector[2] - origin[2]\n\n  // perform rotation\n  r[0] = p[2] * Math.sin(angle) + p[0] * Math.cos(angle)\n  r[1] = p[1]\n  r[2] = p[2] * Math.cos(angle) - p[0] * Math.sin(angle)\n\n  // translate to correct position\n  out[0] = r[0] + origin[0]\n  out[1] = r[1] + origin[1]\n  out[2] = r[2] + origin[2]\n\n  return out\n}\n\nmodule.exports = rotateY\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/rotateY.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/rotateZ.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/rotateZ.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Rotate the given vector around the given origin, Z axis only.\n * @param {vec3} [out] - the receiving vector\n * @param {Number} angle - the angle of rotation in radians\n * @param {vec3} origin - the origin of the rotation\n * @param {vec3} vector - the vector to rotate\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.rotateZ\n */\nconst rotateZ = (...params) => {\n  let out\n  let angle\n  let vector\n  let origin\n  if (params.length === 3) {\n    out = create()\n    angle = params[0]\n    origin = params[1]\n    vector = params[2]\n  } else {\n    out = params[0]\n    angle = params[1]\n    origin = params[2]\n    vector = params[3]\n  }\n  const p = []\n  const r = []\n  // Translate point to the origin\n  p[0] = vector[0] - origin[0]\n  p[1] = vector[1] - origin[1]\n\n  // perform rotation\n  r[0] = (p[0] * Math.cos(angle)) - (p[1] * Math.sin(angle))\n  r[1] = (p[0] * Math.sin(angle)) + (p[1] * Math.cos(angle))\n\n  // translate to correct position\n  out[0] = r[0] + origin[0]\n  out[1] = r[1] + origin[1]\n  out[2] = vector[2]\n\n  return out\n}\n\nmodule.exports = rotateZ\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/rotateZ.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/scale.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/scale.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Scales the coordinates of the given vector by a scalar number.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {Number} amount - amount to scale the vector by\n * @param {vec3} vector - the vector to scale\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.scale\n */\nconst scale = (...params) => {\n  let out\n  let vector\n  let amount\n  if (params.length === 2) {\n    out = create()\n    amount = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    amount = params[1]\n    vector = params[2]\n  }\n  out[0] = vector[0] * amount\n  out[1] = vector[1] * amount\n  out[2] = vector[2] * amount\n  return out\n}\n\nmodule.exports = scale\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/scale.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/squaredDistance.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/squaredDistance.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the squared distance between two vectors.\n *\n * @param {vec3} a - the first operand\n * @param {vec3} b - the second operand\n * @returns {Number} squared distance\n * @alias module:modeling/maths/vec3.squaredDistance\n */\nconst squaredDistance = (a, b) => {\n  const x = b[0] - a[0]\n  const y = b[1] - a[1]\n  const z = b[2] - a[2]\n  return x * x + y * y + z * z\n}\n\nmodule.exports = squaredDistance\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/squaredDistance.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/squaredLength.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/squaredLength.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculates the squared length of the given vector.\n *\n * @param {vec3} vector - vector to calculate squared length of\n * @returns {Number} squared length\n * @alias module:modeling/maths/vec3.squaredLength\n */\nconst squaredLength = (a) => {\n  const x = a[0]\n  const y = a[1]\n  const z = a[2]\n  return x * x + y * y + z * z\n}\n\nmodule.exports = squaredLength\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/squaredLength.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/subtract.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/subtract.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Subtracts the coordinates of two vectors (A-B).\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} a - the minuend vector\n * @param {vec3} b - the subtrahend vector\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.subtract\n */\nconst subtract = (...params) => {\n  let out\n  let a\n  let b\n  if (params.length === 2) {\n    out = create()\n    a = params[0]\n    b = params[1]\n  } else {\n    out = params[0]\n    a = params[1]\n    b = params[2]\n  }\n  out[0] = a[0] - b[0]\n  out[1] = a[1] - b[1]\n  out[2] = a[2] - b[2]\n  return out\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/subtract.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/toString.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/toString.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert the given vector to a representative string.\n * @param {vec3} vector - vector of reference\n * @returns {String} string representation\n * @alias module:modeling/maths/vec3.toString\n */\nconst toString = (vec) => `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}, ${vec[2].toFixed(7)}]`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/transform.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/transform.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\n\n/**\n * Transforms the given vector using the given matrix.\n * @param {vec3} [out] - the receiving vector\n * @param {mat4} matrix - the transform matrix\n * @param {vec3} vector - the vector to transform\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.transform\n */\nconst transform = (...params) => {\n  let out\n  let vector\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    matrix = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    matrix = params[1]\n    vector = params[2]\n  }\n\n  const x = vector[0]\n  const y = vector[1]\n  const z = vector[2]\n  let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]\n  w = w || 1.0\n  out[0] = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w\n  out[1] = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w\n  out[2] = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w\n  return out\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec3/unit.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec3/unit.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec3/create.js\")\nconst length = __webpack_require__(/*! ./length */ \"./node_modules/@jscad/modeling/src/maths/vec3/length.js\")\n\n/**\n * Calculates the unit vector of the given vector.\n *\n * @param {vec3} [out] - the receiving vector\n * @param {vec3} vector - the vector for calculations\n * @returns {vec3} a new vector\n * @alias module:modeling/maths/vec3.unit\n */\nconst unit = (...params) => {\n  let out\n  let vector\n  if (params.length === 1) {\n    out = create()\n    vector = params[0]\n  } else {\n    out = params[0]\n    vector = params[1]\n  }\n  const magnitude = length(vector) // calculate the magnitude\n  out[0] = vector[0] / magnitude\n  out[1] = vector[1] / magnitude\n  out[2] = vector[2] / magnitude\n  return out\n}\n\nmodule.exports = unit\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec3/unit.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/clone.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/clone.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\")\n\n/**\n * Create a clone of the given vector.\n *\n * @param {vec4} [out] - receiving vector\n * @param {vec4} vector - vector to clone\n * @returns {vec4} a new vector\n * @alias module:modeling/maths/vec4.clone\n */\nconst clone = (...params) => {\n  let out, vec\n  if (params.length === 1) {\n    out = create()\n    vec = params[0]\n  } else {\n    out = params[0]\n    vec = params[1]\n  }\n  out[0] = vec[0]\n  out[1] = vec[1]\n  out[2] = vec[2]\n  out[3] = vec[3]\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/create.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a four dimensional vector.\n * See fromValues().\n * @typedef {Array} vec4\n */\n\n/**\n * Creates a new vector initialized to [0,0,0,0].\n *\n * @returns {vec4} a new vector\n * @alias module:modeling/maths/vec4.create\n */\nconst create = () => [0, 0, 0, 0]\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/fromScalar.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/fromScalar.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fromValues = __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js\")\n\n/**\n * Create a new vector from the given scalar value.\n *\n * @param  {Number} scalar\n * @returns {vec4} a new vector\n * @alias module:modeling/maths/vec4.fromScalar\n */\nconst fromScalar = (scalar) => fromValues(scalar, scalar, scalar, scalar)\n\nmodule.exports = fromScalar\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/fromScalar.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\")\n\n/**\n * Creates a new vector with the given values.\n *\n * @param {Number} x - X component\n * @param {Number} y - Y component\n * @param {Number} z - Z component\n * @param {Number} w - W component\n * @returns {vec4} a new vector\n * @alias module:modeling/maths/vec4.fromValues\n */\nconst fromValues = (x, y, z, w) => {\n  const out = create()\n  out[0] = x\n  out[1] = y\n  out[2] = z\n  out[3] = w\n  return out\n}\n\nmodule.exports = fromValues\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Represents a four dimensional vector.\n * @see {@link vec4} for data structure information.\n * @module modeling/maths/vec4\n */\nmodule.exports = {\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/maths/vec4/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\"),\n  fromScalar: __webpack_require__(/*! ./fromScalar */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromScalar.js\"),\n  fromValues: __webpack_require__(/*! ./fromValues */ \"./node_modules/@jscad/modeling/src/maths/vec4/fromValues.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/maths/vec4/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/maths/vec4/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/toString.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/toString.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert the given vector to a representative string.\n *\n * @param {vec4} vector - vector to convert\n * @returns {String} representative string\n * @alias module:modeling/maths/vec4.toString\n */\nconst toString = (vec) => `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(9)}, ${vec[3].toFixed(9)})`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/maths/vec4/transform.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/maths/vec4/transform.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/maths/vec4/create.js\")\n\n/**\n * Transform the given vector using the given matrix.\n *\n * @param {vec4} [out] - the receiving vector (optional)\n * @param {mat4} matrix - matrix to transform with\n * @param {vec4} vector - the vector to transform\n * @returns {vec4} a new vector\n * @alias module:modeling/maths/vec4.transform\n */\nconst transform = (...params) => {\n  let out\n  let vector\n  let matrix\n  if (params.length === 2) {\n    out = create()\n    matrix = params[0]\n    vector = params[1]\n  } else {\n    out = params[0]\n    matrix = params[1]\n    vector = params[2]\n  }\n\n  const [x, y, z, w] = vector\n\n  out[0] = Math.fround(matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w)\n  out[1] = Math.fround(matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w)\n  out[2] = Math.fround(matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w)\n  out[3] = Math.fround(matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w)\n  return out\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/maths/vec4/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/measurements/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/measurements/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be measured, e.g. calculate volume, etc.\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/measurements\n * @example\n * const { measureArea, measureBounds, measureVolume } = require('@jscad/modeling').measurements\n */\nmodule.exports = {\n  measureArea: __webpack_require__(/*! ./measureArea */ \"./node_modules/@jscad/modeling/src/measurements/measureArea.js\"),\n  measureBoundingBox: __webpack_require__(/*! ./measureBoundingBox */ \"./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js\"),\n  measureVolume: __webpack_require__(/*! ./measureVolume */ \"./node_modules/@jscad/modeling/src/measurements/measureVolume.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/measurements/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/measurements/measureArea.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/measurements/measureArea.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Measure the area of the given geometry.\n * NOTE: paths are infinitely narrow and do not have an area\n *\n * @param {path2} geometry - geometry to measure\n * @returns {Number} area of the geometry\n */\nconst measureAreaOfPath2 = () => 0\n\n/*\n * Measure the area of the given geometry.\n * For a counter clockwise rotating geometry (about Z) the area is positive, otherwise negative.\n *\n * @see http://paulbourke.net/geometry/polygonmesh/\n * @param {geom2} geometry - 2D geometry to measure\n * @returns {Number} area of the geometry\n */\nconst measureAreaOfGeom2 = (geometry) => {\n  if (geometry.area) return geometry.area\n\n  const sides = geom2.toSides(geometry)\n  const area = sides.reduce((area, side) => area + (side[0][0] * side[1][1] - side[0][1] * side[1][0]), 0)\n  geometry.area = area * 0.5\n  return geometry.area\n}\n\n/*\n * Measure the area of the given geometry.\n *\n * @param {geom3} geometry - 3D geometry to measure\n * @returns {Number} area of the geometry\n */\nconst measureAreaOfGeom3 = (geometry) => {\n  if (geometry.area) return geometry.area\n\n  const polygons = geom3.toPolygons(geometry)\n  geometry.area = polygons.reduce((area, polygon) => area + poly3.measureArea(polygon), 0)\n  return geometry.area\n}\n\n/**\n * Measure the area of the given geometries.\n * @param {...Objects} geometries - the geometries to measure\n * @return {Number|Array} the area, or a list of areas\n * @alias module:modeling/measurements.measureArea\n *\n * @example\n * let area = measureArea(sphere())\n */\nconst measureArea = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  const results = geometries.map((geometry) => {\n    if (path2.isA(geometry)) return measureAreaOfPath2(geometry)\n    if (geom2.isA(geometry)) return measureAreaOfGeom2(geometry)\n    if (geom3.isA(geometry)) return measureAreaOfGeom3(geometry)\n    return 0\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = measureArea\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/measurements/measureArea.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Measure the min and max bounds of the given (path2) geometry.\n * @return {Array[]} the min and max bounds for the geometry\n */\nconst measureBoundingBoxOfPath2 = (geometry) => {\n  if (geometry.boundingBox) return geometry.boundingBox\n\n  const points = path2.toPoints(geometry)\n\n  let minpoint\n  if (points.length === 0) {\n    minpoint = vec2.create()\n  } else {\n    minpoint = vec2.clone(points[0])\n  }\n  let maxpoint = vec2.clone(minpoint)\n\n  points.forEach((point) => {\n    vec2.min(minpoint, minpoint, point)\n    vec2.max(maxpoint, maxpoint, point)\n  })\n  minpoint = [minpoint[0], minpoint[1], 0]\n  maxpoint = [maxpoint[0], maxpoint[1], 0]\n\n  geometry.boundingBox = [minpoint, maxpoint]\n  return geometry.boundingBox\n}\n\n/*\n * Measure the min and max bounds of the given (geom2) geometry.\n * @return {Array[]} the min and max bounds for the geometry\n */\nconst measureBoundingBoxOfGeom2 = (geometry) => {\n  if (geometry.boundingBox) return geometry.boundingBox\n\n  const points = geom2.toPoints(geometry)\n\n  let minpoint\n  if (points.length === 0) {\n    minpoint = vec2.create()\n  } else {\n    minpoint = vec2.clone(points[0])\n  }\n  let maxpoint = vec2.clone(minpoint)\n\n  points.forEach((point) => {\n    vec2.min(minpoint, minpoint, point)\n    vec2.max(maxpoint, maxpoint, point)\n  })\n\n  minpoint = [minpoint[0], minpoint[1], 0]\n  maxpoint = [maxpoint[0], maxpoint[1], 0]\n\n  geometry.boundingBox = [minpoint, maxpoint]\n  return geometry.boundingBox\n}\n\n/*\n * Measure the min and max bounds of the given (geom3) geometry.\n * @return {Array[]} the min and max bounds for the geometry\n */\nconst measureBoundingBoxOfGeom3 = (geometry) => {\n  if (geometry.boundingBox) return geometry.boundingBox\n\n  const polygons = geom3.toPolygons(geometry)\n\n  let minpoint = vec3.create()\n  if (polygons.length > 0) {\n    const points = poly3.toPoints(polygons[0])\n    vec3.clone(minpoint, points[0])\n  }\n  let maxpoint = vec3.clone(minpoint)\n\n  polygons.forEach((polygon) => {\n    poly3.toPoints(polygon).forEach((point) => {\n      vec3.min(minpoint, minpoint, point)\n      vec3.max(maxpoint, maxpoint, point)\n    })\n  })\n\n  minpoint = [minpoint[0], minpoint[1], minpoint[2]]\n  maxpoint = [maxpoint[0], maxpoint[1], maxpoint[2]]\n\n  geometry.boundingBox = [minpoint, maxpoint]\n  return geometry.boundingBox\n}\n\n/**\n * Measure the min and max bounds of the given geometries.\n * @param {...Objects} geometries - the geometries to measure\n * @return {Array} the min and max bounds for each geometry, i.e. [[X,Y,Z],[X,Y,Z]]\n * @alias module:modeling/measurements.measureBoundingBox\n *\n * @example\n * let bounds = measureBoundingBox(sphere())\n */\nconst measureBoundingBox = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  const results = geometries.map((geometry) => {\n    if (path2.isA(geometry)) return measureBoundingBoxOfPath2(geometry)\n    if (geom2.isA(geometry)) return measureBoundingBoxOfGeom2(geometry)\n    if (geom3.isA(geometry)) return measureBoundingBoxOfGeom3(geometry)\n    return [[0, 0, 0], [0, 0, 0]]\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = measureBoundingBox\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst { geom2, geom3, path2 } = __webpack_require__(/*! ../geometries */ \"./node_modules/@jscad/modeling/src/geometries/index.js\")\n\nconst measureBoundingBox = __webpack_require__(/*! ./measureBoundingBox */ \"./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js\")\n\n/*\n * Measure the epsilon of the given (path2) geometry.\n * @return {Float} the epsilon (precision) of the geometry\n */\nconst measureEpsilonOfPath2 = (geometry) => {\n  if (geometry.epsilon) return geometry.epsilon\n\n  const bounds = measureBoundingBox(geometry)\n  const x = bounds[1][0] - bounds[0][0]\n  const y = bounds[1][1] - bounds[0][1]\n\n  geometry.epsilon = (x + y) / 2 * EPS\n  return geometry.epsilon\n}\n\n/*\n * Measure the epsilon of the given (geom2) geometry.\n * @return {Float} the epsilon (precision) of the geometry\n */\nconst measureEpsilonOfGeom2 = (geometry) => {\n  if (geometry.epsilon) return geometry.epsilon\n\n  const bounds = measureBoundingBox(geometry)\n  const x = bounds[1][0] - bounds[0][0]\n  const y = bounds[1][1] - bounds[0][1]\n\n  geometry.epsilon = (x + y) / 2 * EPS\n  return geometry.epsilon\n}\n\n/*\n * Measure the epsilon of the given (geom3) geometry.\n * @return {Float} the epsilon (precision) of the geometry\n */\nconst measureEpsilonOfGeom3 = (geometry) => {\n  if (geometry.epsilon) return geometry.epsilon\n\n  const bounds = measureBoundingBox(geometry)\n  const x = bounds[1][0] - bounds[0][0]\n  const y = bounds[1][1] - bounds[0][1]\n  const z = bounds[1][2] - bounds[0][2]\n\n  geometry.epsilon = (x + y + z) / 3 * EPS\n  return geometry.epsilon\n}\n\n/**\n * Measure the epsilon of the given geometries.\n * Epsilon values are used in various functions to determin minimum distances between points, planes, etc.\n * @param {...Objects} geometries - the geometries to measure\n * @return {Float|Array} the epsilon of each geometry\n * @alias module:modeling/measurements.measureEpsilon\n *\n * @example\n * let epsilon = measureEpsilon(sphere())\n */\nconst measureEpsilon = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  const results = geometries.map((geometry) => {\n    if (path2.isA(geometry)) return measureEpsilonOfPath2(geometry)\n    if (geom2.isA(geometry)) return measureEpsilonOfGeom2(geometry)\n    if (geom3.isA(geometry)) return measureEpsilonOfGeom3(geometry)\n    return 0\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = measureEpsilon\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/measurements/measureVolume.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/measurements/measureVolume.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Measure the volume of the given geometry.\n * NOTE: paths are infinitely narrow and do not have an volume\n *\n * @param {Path2} geometry - geometry to measure\n * @returns {Number} volume of the geometry\n */\nconst measureVolumeOfPath2 = () => 0\n\n/*\n * Measure the volume of the given geometry.\n * NOTE: 2D geometry are infinitely thin and do not have an volume\n *\n * @param {Geom2} geometry - 2D geometry to measure\n * @returns {Number} volume of the geometry\n */\nconst measureVolumeOfGeom2 = () => 0\n\n/*\n * Measure the volume of the given geometry.\n *\n * @param {Geom3} geometry - 3D geometry to measure\n * @returns {Number} volume of the geometry\n */\nconst measureVolumeOfGeom3 = (geometry) => {\n  if (geometry.volume) return geometry.volume\n\n  const polygons = geom3.toPolygons(geometry)\n  geometry.volume = polygons.reduce((volume, polygon) => volume + poly3.measureSignedVolume(polygon), 0)\n  return geometry.volume\n}\n\n/**\n * Measure the volume of the given geometries.\n * @param {...Object} geometries - the geometries to measure\n * @return {Number|Array} the volume, or a list of volumes\n * @alias module:modeling/measurements.measureVolume\n *\n * @example\n * let volume = measureVolume(sphere())\n */\nconst measureVolume = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  const results = geometries.map((geometry) => {\n    if (path2.isA(geometry)) return measureVolumeOfPath2(geometry)\n    if (geom2.isA(geometry)) return measureVolumeOfGeom2(geometry)\n    if (geom3.isA(geometry)) return measureVolumeOfGeom3(geometry)\n    return 0\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = measureVolume\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/measurements/measureVolume.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst fromFakePolygon = (epsilon, polygon) => {\n  // this can happen based on union, seems to be residuals -\n  // return null and handle in caller\n  if (polygon.vertices.length < 4) {\n    return null\n  }\n  const vert1Indices = []\n  const points3D = polygon.vertices.filter((vertex, i) => {\n    if (vertex[2] > 0) {\n      vert1Indices.push(i)\n      return true\n    }\n    return false\n  })\n\n  if (points3D.length !== 2) {\n    throw new Error('Assertion failed: fromFakePolygon: not enough points found') // TBD remove later\n  }\n\n  const points2D = points3D.map((v3) => {\n    const x = Math.round(v3[0] / epsilon) * epsilon + 0 // no more -0\n    const y = Math.round(v3[1] / epsilon) * epsilon + 0 // no more -0\n    return vec2.fromValues(x, y)\n  })\n\n  if (vec2.equals(points2D[0], points2D[1])) return null\n\n  const d = vert1Indices[1] - vert1Indices[0]\n  if (d === 1 || d === 3) {\n    if (d === 1) {\n      points2D.reverse()\n    }\n  } else {\n    throw new Error('Assertion failed: fromFakePolygon: unknown index ordering')\n  }\n  return points2D\n}\n\n/*\n * Convert the given polygons to a list of sides.\n * The polygons must have only z coordinates +1 and -1, as constructed by to3DWalls().\n */\nconst fromFakePolygons = (epsilon, polygons) => {\n  const sides = polygons.map((polygon) => fromFakePolygon(epsilon, polygon)).filter((polygon) => (polygon !== null))\n  return geom2.create(sides)\n}\n\nmodule.exports = fromFakePolygons\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be passed to boolean functions\n * to perform logical operations, e.g. remove a hole from a board.\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/booleans\n * @example\n * const { intersect, subtract, union } = require('@jscad/modeling').booleans\n */\nmodule.exports = {\n  intersect: __webpack_require__(/*! ./intersect */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersect.js\"),\n  subtract: __webpack_require__(/*! ./subtract */ \"./node_modules/@jscad/modeling/src/operations/booleans/subtract.js\"),\n  union: __webpack_require__(/*! ./union */ \"./node_modules/@jscad/modeling/src/operations/booleans/union.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/intersect.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/intersect.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\nconst areAllShapesTheSameType = __webpack_require__(/*! ../../utils/areAllShapesTheSameType */ \"./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst intersectGeom2 = __webpack_require__(/*! ./intersectGeom2 */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom2.js\")\nconst intersectGeom3 = __webpack_require__(/*! ./intersectGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3.js\")\n\n/**\n * Return a new geometry representing space in both the first geometry and\n * all subsequent geometries.\n * The given geometries should be of the same type, either geom2 or geom3.\n *\n * @param {...Object} geometries - list of geometries\n * @returns {geom2|geom3} a new geometry\n * @alias module:modeling/booleans.intersect\n *\n * @example\n * let myshape = intersect(cube({size: [5,5,5]}), cube({size: [5,5,5], center: [5,5,5]}))\n *\n * @example\n * +-------+\n * |       |\n * |   A   |\n * |    +--+----+   =   +--+\n * +----+--+    |       +--+\n *      |   B   |\n *      |       |\n *      +-------+\n */\nconst intersect = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  if (!areAllShapesTheSameType(geometries)) {\n    throw new Error('only intersect of the types are supported')\n  }\n\n  const geometry = geometries[0]\n  // if (path.isA(geometry)) return pathintersect(matrix, geometries)\n  if (geom2.isA(geometry)) return intersectGeom2(geometries)\n  if (geom3.isA(geometry)) return intersectGeom3(geometries)\n  return geometry\n}\n\nmodule.exports = intersect\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/intersect.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom2.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom2.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst measureEpsilon = __webpack_require__(/*! ../../measurements/measureEpsilon */ \"./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js\")\n\nconst fromFakePolygons = __webpack_require__(/*! ./fromFakePolygons */ \"./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js\")\nconst to3DWalls = __webpack_require__(/*! ./to3DWalls */ \"./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js\")\nconst intersectGeom3 = __webpack_require__(/*! ./intersectGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3.js\")\n\n/*\n * Return a new 2D geometry representing space in both the first geometry and\n * in the subsequent geometries. None of the given geometries are modified.\n * @param {...geom2} geometries - list of 2D geometries\n * @returns {geom2} new 2D geometry\n */\nconst intersect = (...geometries) => {\n  geometries = flatten(geometries)\n  const newgeometries = geometries.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry))\n\n  const newgeom3 = intersectGeom3(newgeometries)\n  const epsilon = measureEpsilon(newgeom3)\n\n  return fromFakePolygons(epsilon, geom3.toPolygons(newgeom3))\n}\n\nmodule.exports = intersect\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst retessellate = __webpack_require__(/*! ./retessellate */ \"./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js\")\nconst intersectSub = __webpack_require__(/*! ./intersectGeom3Sub */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3Sub.js\")\n\n/*\n * Return a new 3D geometry representing space in both the first geometry and\n * in the subsequent geometries. None of the given geometries are modified.\n * @param {...geom3} geometries - list of 3D geometries\n * @returns {geom3} new 3D geometry\n */\nconst intersect = (...geometries) => {\n  geometries = flatten(geometries)\n\n  let newgeometry = geometries.shift()\n  geometries.forEach((geometry) => {\n    newgeometry = intersectSub(newgeometry, geometry)\n  })\n\n  newgeometry = retessellate(newgeometry)\n  return newgeometry\n}\n\nmodule.exports = intersect\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3Sub.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3Sub.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst mayOverlap = __webpack_require__(/*! ./mayOverlap */ \"./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js\")\nconst { Tree } = __webpack_require__(/*! ./trees */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js\")\n\n/*\n * Return a new 3D geometry representing the space in both the first geometry and\n * the second geometry. None of the given geometries are modified.\n * @param {geom3} geometry1 - a geometry\n * @param {geom3} geometry2 - a geometry\n * @returns {geom3} new 3D geometry\n */\nconst intersectGeom3Sub = (geometry1, geometry2) => {\n  if (!mayOverlap(geometry1, geometry2)) {\n    return geom3.create() // empty geometry\n  }\n\n  const a = new Tree(geom3.toPolygons(geometry1))\n  const b = new Tree(geom3.toPolygons(geometry2))\n\n  a.invert()\n  b.clipTo(a)\n  b.invert()\n  a.clipTo(b)\n  b.clipTo(a)\n  a.addPolygons(b.allPolygons())\n  a.invert()\n\n  const newpolygons = a.allPolygons()\n  return geom3.create(newpolygons)\n}\n\nmodule.exports = intersectGeom3Sub\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3Sub.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst measureBoundingBox = __webpack_require__(/*! ../../measurements/measureBoundingBox */ \"./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js\")\n\n/*\n * Determine if the given geometries overlap by comparing min and max bounds.\n * NOTE: This is used in union for performace gains.\n * @param {geom3} geometry1 - geometry for comparision\n * @param {geom3} geometry2 - geometry for comparision\n * @returns {boolean} true if the geometries overlap\n */\nconst mayOverlap = (geometry1, geometry2) => {\n  // FIXME accessing the data structure of the geometry should not be allowed\n  if ((geometry1.polygons.length === 0) || (geometry2.polygons.length === 0)) {\n    return false\n  }\n\n  const bounds1 = measureBoundingBox(geometry1)\n  const min1 = bounds1[0]\n  const max1 = bounds1[1]\n\n  const bounds2 = measureBoundingBox(geometry2)\n  const min2 = bounds2[0]\n  const max2 = bounds2[1]\n\n  if ((min2[0] - max1[0]) > EPS) return false\n  if ((min1[0] - max2[0]) > EPS) return false\n  if ((min2[1] - max1[1]) > EPS) return false\n  if ((min1[1] - max2[1]) > EPS) return false\n  if ((min2[2] - max1[2]) > EPS) return false\n  if ((min1[2] - max2[2]) > EPS) return false\n  return true\n}\n\nmodule.exports = mayOverlap\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/reTesselateCoplanarPolygons.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/reTesselateCoplanarPolygons.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst line2 = __webpack_require__(/*! ../../maths/line2 */ \"./node_modules/@jscad/modeling/src/maths/line2/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst OrthoNormalBasis = __webpack_require__(/*! ../../maths/OrthoNormalBasis */ \"./node_modules/@jscad/modeling/src/maths/OrthoNormalBasis.js\")\nconst interpolateBetween2DPointsForY = __webpack_require__(/*! ../../maths/utils/interpolateBetween2DPointsForY */ \"./node_modules/@jscad/modeling/src/maths/utils/interpolateBetween2DPointsForY.js\")\n\nconst { insertSorted, fnNumberSort } = __webpack_require__(/*! ../../utils */ \"./node_modules/@jscad/modeling/src/utils/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Retesselation for a set of COPLANAR polygons.\n * @param {poly3[]} sourcepolygons - list of polygons\n * @returns {poly3[]} new set of polygons\n */\nconst reTesselateCoplanarPolygons = (sourcepolygons) => {\n  if (sourcepolygons.length < 2) return sourcepolygons\n\n  const destpolygons = []\n  const numpolygons = sourcepolygons.length\n  const plane = poly3.plane(sourcepolygons[0])\n  const orthobasis = new OrthoNormalBasis(plane)\n  const polygonvertices2d = [] // array of array of Vector2D\n  const polygontopvertexindexes = [] // array of indexes of topmost vertex per polygon\n  const topy2polygonindexes = {}\n  const ycoordinatetopolygonindexes = {}\n\n  const ycoordinatebins = {}\n\n  // convert all polygon vertices to 2D\n  // Make a list of all encountered y coordinates\n  // And build a map of all polygons that have a vertex at a certain y coordinate:\n  const ycoordinateBinningFactor = 1.0 / EPS * 10\n  for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {\n    const poly3d = sourcepolygons[polygonindex]\n    let vertices2d = []\n    let numvertices = poly3d.vertices.length\n    let minindex = -1\n    if (numvertices > 0) {\n      let miny\n      let maxy\n      for (let i = 0; i < numvertices; i++) {\n        let pos2d = orthobasis.to2D(poly3d.vertices[i])\n        // perform binning of y coordinates: If we have multiple vertices very\n        // close to each other, give them the same y coordinate:\n        const ycoordinatebin = Math.floor(pos2d[1] * ycoordinateBinningFactor)\n        let newy\n        if (ycoordinatebin in ycoordinatebins) {\n          newy = ycoordinatebins[ycoordinatebin]\n        } else if (ycoordinatebin + 1 in ycoordinatebins) {\n          newy = ycoordinatebins[ycoordinatebin + 1]\n        } else if (ycoordinatebin - 1 in ycoordinatebins) {\n          newy = ycoordinatebins[ycoordinatebin - 1]\n        } else {\n          newy = pos2d[1]\n          ycoordinatebins[ycoordinatebin] = pos2d[1]\n        }\n        pos2d = vec2.fromValues(pos2d[0], newy)\n        vertices2d.push(pos2d)\n        const y = pos2d[1]\n        if ((i === 0) || (y < miny)) {\n          miny = y\n          minindex = i\n        }\n        if ((i === 0) || (y > maxy)) {\n          maxy = y\n        }\n        if (!(y in ycoordinatetopolygonindexes)) {\n          ycoordinatetopolygonindexes[y] = {}\n        }\n        ycoordinatetopolygonindexes[y][polygonindex] = true\n      }\n      if (miny >= maxy) {\n        // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:\n        vertices2d = []\n        numvertices = 0\n        minindex = -1\n      } else {\n        if (!(miny in topy2polygonindexes)) {\n          topy2polygonindexes[miny] = []\n        }\n        topy2polygonindexes[miny].push(polygonindex)\n      }\n    } // if(numvertices > 0)\n    // reverse the vertex order:\n    vertices2d.reverse()\n    minindex = numvertices - minindex - 1\n    polygonvertices2d.push(vertices2d)\n    polygontopvertexindexes.push(minindex)\n  }\n  const ycoordinates = []\n  for (const ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate)\n  ycoordinates.sort(fnNumberSort)\n\n  // Now we will iterate over all y coordinates, from lowest to highest y coordinate\n  // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate\n  //   Is sorted so the polygons are in left to right order\n  // Each element in activepolygons has these properties:\n  //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons\n  //                      and polygonvertices2d arrays)\n  //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)\n  //                         that is at or just above the current y coordinate\n  //        rightvertexindex: dito at right hand side of polygon\n  //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate\n  //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate\n  let activepolygons = []\n  let prevoutpolygonrow = []\n  for (let yindex = 0; yindex < ycoordinates.length; yindex++) {\n    const newoutpolygonrow = []\n    const ycoordinateasstring = ycoordinates[yindex]\n    const ycoordinate = Number(ycoordinateasstring)\n\n    // update activepolygons for this y coordinate:\n    // - Remove any polygons that end at this y coordinate\n    // - update leftvertexindex and rightvertexindex (which point to the current vertex index\n    //   at the the left and right side of the polygon\n    // Iterate over all polygons that have a corner at this y coordinate:\n    const polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinateasstring]\n    for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {\n      const activepolygon = activepolygons[activepolygonindex]\n      const polygonindex = activepolygon.polygonindex\n      if (polygonindexeswithcorner[polygonindex]) {\n        // this active polygon has a corner at this y coordinate:\n        const vertices2d = polygonvertices2d[polygonindex]\n        const numvertices = vertices2d.length\n        let newleftvertexindex = activepolygon.leftvertexindex\n        let newrightvertexindex = activepolygon.rightvertexindex\n        // See if we need to increase leftvertexindex or decrease rightvertexindex:\n        while (true) {\n          let nextleftvertexindex = newleftvertexindex + 1\n          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0\n          if (vertices2d[nextleftvertexindex][1] !== ycoordinate) break\n          newleftvertexindex = nextleftvertexindex\n        }\n        let nextrightvertexindex = newrightvertexindex - 1\n        if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1\n        if (vertices2d[nextrightvertexindex][1] === ycoordinate) {\n          newrightvertexindex = nextrightvertexindex\n        }\n        if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {\n          // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex\n          // This means that this is the bottom point of the polygon. We'll remove it:\n          activepolygons.splice(activepolygonindex, 1)\n          --activepolygonindex\n        } else {\n          activepolygon.leftvertexindex = newleftvertexindex\n          activepolygon.rightvertexindex = newrightvertexindex\n          activepolygon.topleft = vertices2d[newleftvertexindex]\n          activepolygon.topright = vertices2d[newrightvertexindex]\n          let nextleftvertexindex = newleftvertexindex + 1\n          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0\n          activepolygon.bottomleft = vertices2d[nextleftvertexindex]\n          let nextrightvertexindex = newrightvertexindex - 1\n          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1\n          activepolygon.bottomright = vertices2d[nextrightvertexindex]\n        }\n      } // if polygon has corner here\n    } // for activepolygonindex\n    let nextycoordinate\n    if (yindex >= ycoordinates.length - 1) {\n      // last row, all polygons must be finished here:\n      activepolygons = []\n      nextycoordinate = null\n    } else { // yindex < ycoordinates.length-1\n      nextycoordinate = Number(ycoordinates[yindex + 1])\n      const middleycoordinate = 0.5 * (ycoordinate + nextycoordinate)\n      // update activepolygons by adding any polygons that start here:\n      const startingpolygonindexes = topy2polygonindexes[ycoordinateasstring]\n      for (const polygonindexKey in startingpolygonindexes) {\n        const polygonindex = startingpolygonindexes[polygonindexKey]\n        const vertices2d = polygonvertices2d[polygonindex]\n        const numvertices = vertices2d.length\n        const topvertexindex = polygontopvertexindexes[polygonindex]\n        // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.\n        // Find the left and right topmost vertices which have the current y coordinate:\n        let topleftvertexindex = topvertexindex\n        while (true) {\n          let i = topleftvertexindex + 1\n          if (i >= numvertices) i = 0\n          if (vertices2d[i][1] !== ycoordinate) break\n          if (i === topvertexindex) break // should not happen, but just to prevent endless loops\n          topleftvertexindex = i\n        }\n        let toprightvertexindex = topvertexindex\n        while (true) {\n          let i = toprightvertexindex - 1\n          if (i < 0) i = numvertices - 1\n          if (vertices2d[i][1] !== ycoordinate) break\n          if (i === topleftvertexindex) break // should not happen, but just to prevent endless loops\n          toprightvertexindex = i\n        }\n        let nextleftvertexindex = topleftvertexindex + 1\n        if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0\n        let nextrightvertexindex = toprightvertexindex - 1\n        if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1\n        const newactivepolygon = {\n          polygonindex: polygonindex,\n          leftvertexindex: topleftvertexindex,\n          rightvertexindex: toprightvertexindex,\n          topleft: vertices2d[topleftvertexindex],\n          topright: vertices2d[toprightvertexindex],\n          bottomleft: vertices2d[nextleftvertexindex],\n          bottomright: vertices2d[nextrightvertexindex]\n        }\n        insertSorted(activepolygons, newactivepolygon, (el1, el2) => {\n          const x1 = interpolateBetween2DPointsForY(el1.topleft, el1.bottomleft, middleycoordinate)\n          const x2 = interpolateBetween2DPointsForY(el2.topleft, el2.bottomleft, middleycoordinate)\n          if (x1 > x2) return 1\n          if (x1 < x2) return -1\n          return 0\n        })\n      } // for(let polygonindex in startingpolygonindexes)\n    } //  yindex < ycoordinates.length-1\n    // if( (yindex === ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )\n    // FIXME : what ???\n\n    // Now activepolygons is up to date\n    // Build the output polygons for the next row in newoutpolygonrow:\n    for (const activepolygonKey in activepolygons) {\n      const activepolygon = activepolygons[activepolygonKey]\n\n      let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate)\n      const topleft = vec2.fromValues(x, ycoordinate)\n      x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate)\n      const topright = vec2.fromValues(x, ycoordinate)\n      x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate)\n      const bottomleft = vec2.fromValues(x, nextycoordinate)\n      x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate)\n      const bottomright = vec2.fromValues(x, nextycoordinate)\n      const outpolygon = {\n        topleft: topleft,\n        topright: topright,\n        bottomleft: bottomleft,\n        bottomright: bottomright,\n        leftline: line2.fromPoints(topleft, bottomleft),\n        rightline: line2.fromPoints(bottomright, topright)\n      }\n      if (newoutpolygonrow.length > 0) {\n        const prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1]\n        const d1 = vec2.distance(outpolygon.topleft, prevoutpolygon.topright)\n        const d2 = vec2.distance(outpolygon.bottomleft, prevoutpolygon.bottomright)\n        if ((d1 < EPS) && (d2 < EPS)) {\n          // we can join this polygon with the one to the left:\n          outpolygon.topleft = prevoutpolygon.topleft\n          outpolygon.leftline = prevoutpolygon.leftline\n          outpolygon.bottomleft = prevoutpolygon.bottomleft\n          newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1)\n        }\n      }\n      newoutpolygonrow.push(outpolygon)\n    } // for(activepolygon in activepolygons)\n    if (yindex > 0) {\n      // try to match the new polygons against the previous row:\n      const prevcontinuedindexes = {}\n      const matchedindexes = {}\n      for (let i = 0; i < newoutpolygonrow.length; i++) {\n        const thispolygon = newoutpolygonrow[i]\n        for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {\n          if (!matchedindexes[ii]) { // not already processed?\n            // We have a match if the sidelines are equal or if the top coordinates\n            // are on the sidelines of the previous polygon\n            const prevpolygon = prevoutpolygonrow[ii]\n            if (vec2.distance(prevpolygon.bottomleft, thispolygon.topleft) < EPS) {\n              if (vec2.distance(prevpolygon.bottomright, thispolygon.topright) < EPS) {\n                // Yes, the top of this polygon matches the bottom of the previous:\n                matchedindexes[ii] = true\n                // Now check if the joined polygon would remain convex:\n                const v1 = line2.direction(thispolygon.leftline)\n                const v2 = line2.direction(prevpolygon.leftline)\n                const d1 = v1[0] - v2[0]\n\n                const v3 = line2.direction(thispolygon.rightline)\n                const v4 = line2.direction(prevpolygon.rightline)\n                const d2 = v3[0] - v4[0]\n\n                const leftlinecontinues = Math.abs(d1) < EPS\n                const rightlinecontinues = Math.abs(d2) < EPS\n                const leftlineisconvex = leftlinecontinues || (d1 >= 0)\n                const rightlineisconvex = rightlinecontinues || (d2 >= 0)\n                if (leftlineisconvex && rightlineisconvex) {\n                  // yes, both sides have convex corners:\n                  // This polygon will continue the previous polygon\n                  thispolygon.outpolygon = prevpolygon.outpolygon\n                  thispolygon.leftlinecontinues = leftlinecontinues\n                  thispolygon.rightlinecontinues = rightlinecontinues\n                  prevcontinuedindexes[ii] = true\n                }\n                break\n              }\n            }\n          } // if(!prevcontinuedindexes[ii])\n        } // for ii\n      } // for i\n      for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {\n        if (!prevcontinuedindexes[ii]) {\n          // polygon ends here\n          // Finish the polygon with the last point(s):\n          const prevpolygon = prevoutpolygonrow[ii]\n          prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright)\n          if (vec2.distance(prevpolygon.bottomright, prevpolygon.bottomleft) > EPS) {\n            // polygon ends with a horizontal line:\n            prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft)\n          }\n          // reverse the left half so we get a counterclockwise circle:\n          prevpolygon.outpolygon.leftpoints.reverse()\n          const points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints)\n          const vertices3d = points2d.map((point2d) => orthobasis.to3D(point2d))\n          const polygon = poly3.fromPointsAndPlane(vertices3d, plane) // TODO support shared\n          destpolygons.push(polygon)\n        }\n      }\n    } // if(yindex > 0)\n    for (let i = 0; i < newoutpolygonrow.length; i++) {\n      const thispolygon = newoutpolygonrow[i]\n      if (!thispolygon.outpolygon) {\n        // polygon starts here:\n        thispolygon.outpolygon = {\n          leftpoints: [],\n          rightpoints: []\n        }\n        thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)\n        if (vec2.distance(thispolygon.topleft, thispolygon.topright) > EPS) {\n          // we have a horizontal line at the top:\n          thispolygon.outpolygon.rightpoints.push(thispolygon.topright)\n        }\n      } else {\n        // continuation of a previous row\n        if (!thispolygon.leftlinecontinues) {\n          thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)\n        }\n        if (!thispolygon.rightlinecontinues) {\n          thispolygon.outpolygon.rightpoints.push(thispolygon.topright)\n        }\n      }\n    }\n    prevoutpolygonrow = newoutpolygonrow\n  } // for yindex\n  return destpolygons\n}\n\nmodule.exports = reTesselateCoplanarPolygons\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/reTesselateCoplanarPolygons.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst reTesselateCoplanarPolygons = __webpack_require__(/*! ./reTesselateCoplanarPolygons */ \"./node_modules/@jscad/modeling/src/operations/booleans/reTesselateCoplanarPolygons.js\")\n\n// Normals are directional vectors with component values from 0 to 1.0, requiring specialized comparision\n// This EPS is derived from a serieas of tests to determine the optimal precision for comparing coplanar polygons,\n// as provided by the sphere primitive at high segmentation\n// This EPS is for 64 bit Number values\nconst NEPS = 1e-13\n\n// Compare two normals (unit vectors) for equality.\nconst aboutEqualNormals = (a, b) => {\n  return (Math.abs(a[0] - b[0]) <= NEPS && Math.abs(a[1] - b[1]) <= NEPS && Math.abs(a[2] - b[2]) <= NEPS)\n}\n\nconst coplanar = (plane1, plane2) => {\n  // expect the same distance from the origin, within tolerance\n  if (Math.abs(plane1[3] - plane2[3]) < 0.00000015) {\n    return aboutEqualNormals(plane1, plane2)\n  }\n  return false\n}\n\n/*\n  After boolean operations all coplanar polygon fragments are joined by a retesselating\n  operation. geom3.reTesselate(geom).\n  Retesselation is done through a linear sweep over the polygon surface.\n  The sweep line passes over the y coordinates of all vertices in the polygon.\n  Polygons are split at each sweep line, and the fragments are joined horizontally and vertically into larger polygons\n  (making sure that we will end up with convex polygons).\n*/\nconst retessellate = (geometry) => {\n  if (geometry.isRetesselated) {\n    return geometry\n  }\n\n  const polygons = geom3.toPolygons(geometry)\n  const polygonsPerPlane = [] // elements: [plane, [poly3...]]\n  polygons.forEach((polygon) => {\n    const mapping = polygonsPerPlane.find((element) => coplanar(element[0], poly3.plane(polygon)))\n    if (mapping) {\n      const polygons = mapping[1]\n      polygons.push(polygon)\n    } else {\n      polygonsPerPlane.push([poly3.plane(polygon), [polygon]])\n    }\n  })\n\n  let destpolygons = []\n  polygonsPerPlane.forEach((mapping) => {\n    const sourcepolygons = mapping[1]\n    const retesselayedpolygons = reTesselateCoplanarPolygons(sourcepolygons)\n    destpolygons = destpolygons.concat(retesselayedpolygons)\n  })\n\n  const result = geom3.create(destpolygons)\n  result.isRetesselated = true\n\n  return result\n}\n\nmodule.exports = retessellate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/subtract.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/subtract.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\nconst areAllShapesTheSameType = __webpack_require__(/*! ../../utils/areAllShapesTheSameType */ \"./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst subtractGeom2 = __webpack_require__(/*! ./subtractGeom2 */ \"./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom2.js\")\nconst subtractGeom3 = __webpack_require__(/*! ./subtractGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3.js\")\n\n/**\n * Return a new geometry representing space in the first geometry but\n * not in all subsequent geometries.\n * The given geometries should be of the same type, either geom2 or geom3.\n *\n * @param {...Object} geometries - list of geometries\n * @returns {geom2|geom3} a new geometry\n * @alias module:modeling/booleans.subtract\n *\n * @example\n * let myshape = subtract(cubiod({size: [5,5,5]}), cubiod({size: [5,5,5], center: [5,5,5]}))\n *\n * @example\n * +-------+            +-------+\n * |       |            |       |\n * |   A   |            |       |\n * |    +--+----+   =   |    +--+\n * +----+--+    |       +----+\n *      |   B   |\n *      |       |\n *      +-------+\n */\nconst subtract = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  if (!areAllShapesTheSameType(geometries)) {\n    throw new Error('only subtract of the types are supported')\n  }\n\n  const geometry = geometries[0]\n  // if (path.isA(geometry)) return pathsubtract(matrix, geometries)\n  if (geom2.isA(geometry)) return subtractGeom2(geometries)\n  if (geom3.isA(geometry)) return subtractGeom3(geometries)\n  return geometry\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/subtract.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom2.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom2.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst measureEpsilon = __webpack_require__(/*! ../../measurements/measureEpsilon */ \"./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js\")\n\nconst fromFakePolygons = __webpack_require__(/*! ./fromFakePolygons */ \"./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js\")\nconst to3DWalls = __webpack_require__(/*! ./to3DWalls */ \"./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js\")\nconst subtractGeom3 = __webpack_require__(/*! ./subtractGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3.js\")\n\n/*\n * Return a new 2D geometry representing space in the first geometry but\n * not in the subsequent geometries. None of the given geometries are modified.\n * @param {...geom2} geometries - list of geometries\n * @returns {geom2} new 2D geometry\n */\nconst subtract = (...geometries) => {\n  geometries = flatten(geometries)\n  const newgeometries = geometries.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry))\n\n  const newgeom3 = subtractGeom3(newgeometries)\n  const epsilon = measureEpsilon(newgeom3)\n\n  return fromFakePolygons(epsilon, geom3.toPolygons(newgeom3))\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst retessellate = __webpack_require__(/*! ./retessellate */ \"./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js\")\nconst subtractSub = __webpack_require__(/*! ./subtractGeom3Sub */ \"./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3Sub.js\")\n\n/*\n * Return a new 3D geometry representing space in this geometry but not in the given geometries.\n * Neither this geometry nor the given geometries are modified.\n * @param {...geom3} geometries - list of geometries\n * @returns {geom3} new 3D geometry\n */\nconst subtract = (...geometries) => {\n  geometries = flatten(geometries)\n\n  let newgeometry = geometries.shift()\n  geometries.forEach((geometry) => {\n    newgeometry = subtractSub(newgeometry, geometry)\n  })\n\n  newgeometry = retessellate(newgeometry)\n  return newgeometry\n}\n\nmodule.exports = subtract\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3Sub.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3Sub.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst mayOverlap = __webpack_require__(/*! ./mayOverlap */ \"./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js\")\nconst { Tree } = __webpack_require__(/*! ./trees */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js\")\n\n/*\n * Return a new 3D geometry representing the space in the first geometry but not\n * in the second geometry. None of the given geometries are modified.\n * @param {geom3} geometry1 - a geometry\n * @param {geom3} geometry2 - a geometry\n * @returns {geom3} new 3D geometry\n */\nconst subtractGeom3Sub = (geometry1, geometry2) => {\n  if (!mayOverlap(geometry1, geometry2)) {\n    return geom3.clone(geometry1)\n  }\n\n  const a = new Tree(geom3.toPolygons(geometry1))\n  const b = new Tree(geom3.toPolygons(geometry2))\n\n  a.invert()\n  a.clipTo(b)\n  b.clipTo(a, true)\n  a.addPolygons(b.allPolygons())\n  a.invert()\n\n  const newpolygons = a.allPolygons()\n  return geom3.create(newpolygons)\n}\n\nmodule.exports = subtractGeom3Sub\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/subtractGeom3Sub.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/*\n * Create a polygon (wall) from the given Z values and side.\n */\nconst to3DWall = (z0, z1, side) => {\n  const points = [\n    vec3.fromVec2(side[0], z0),\n    vec3.fromVec2(side[1], z0),\n    vec3.fromVec2(side[1], z1),\n    vec3.fromVec2(side[0], z1)\n  ]\n  return poly3.fromPoints(points)\n}\n\n/*\n * Create a 3D geometry with walls, as constructed from the given options and geometry.\n *\n * @param {Object} options - options with Z offsets\n * @param {geom2} geometry - geometry used as base of walls\n * @return {geom3} the new geometry\n */\nconst to3DWalls = (options, geometry) => {\n  const sides = geom2.toSides(geometry)\n\n  const polygons = sides.map((side) => to3DWall(options.z0, options.z1, side))\n\n  const result = geom3.create(polygons)\n  return result\n}\n\nmodule.exports = to3DWalls\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/Node.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/Node.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const plane = __webpack_require__(/*! ../../../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\nconst poly3 = __webpack_require__(/*! ../../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n// # class Node\n// Holds a node in a BSP tree. A BSP tree is built from a collection of polygons\n// by picking a polygon to split along.\n// Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in\n// this.polygontreenodes. Those PolygonTreeNodes are children of the owning\n// Tree.polygonTree\n// This is not a leafy BSP tree since there is\n// no distinction between internal and leaf nodes.\nconst Node = function (parent) {\n  this.plane = null\n  this.front = null\n  this.back = null\n  this.polygontreenodes = []\n  this.parent = parent\n}\n\nNode.prototype = {\n  // Convert solid space to empty space and empty space to solid space.\n  invert: function () {\n    const queue = [this]\n    let node\n    for (let i = 0; i < queue.length; i++) {\n      node = queue[i]\n      if (node.plane) node.plane = plane.flip(node.plane)\n      if (node.front) queue.push(node.front)\n      if (node.back) queue.push(node.back)\n      const temp = node.front\n      node.front = node.back\n      node.back = temp\n    }\n  },\n\n  // clip polygontreenodes to our plane\n  // calls remove() for all clipped PolygonTreeNodes\n  clipPolygons: function (polygontreenodes, alsoRemovecoplanarFront) {\n    let current = { node: this, polygontreenodes: polygontreenodes }\n    let node\n    const stack = []\n\n    do {\n      node = current.node\n      polygontreenodes = current.polygontreenodes\n\n      // begin \"function\"\n      if (node.plane) {\n        const backnodes = []\n        const frontnodes = []\n        const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes\n        const plane = node.plane\n        const numpolygontreenodes = polygontreenodes.length\n        for (let i = 0; i < numpolygontreenodes; i++) {\n          const node1 = polygontreenodes[i]\n          if (!node1.isRemoved()) {\n            node1.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes)\n          }\n        }\n\n        if (node.front && (frontnodes.length > 0)) {\n          stack.push({ node: node.front, polygontreenodes: frontnodes })\n        }\n        const numbacknodes = backnodes.length\n        if (node.back && (numbacknodes > 0)) {\n          stack.push({ node: node.back, polygontreenodes: backnodes })\n        } else {\n          // there's nothing behind this plane. Delete the nodes behind this plane:\n          for (let i = 0; i < numbacknodes; i++) {\n            backnodes[i].remove()\n          }\n        }\n      }\n      current = stack.pop()\n    } while (current !== undefined)\n  },\n\n  // Remove all polygons in this BSP tree that are inside the other BSP tree\n  // `tree`.\n  clipTo: function (tree, alsoRemovecoplanarFront) {\n    let node = this\n    const stack = []\n    do {\n      if (node.polygontreenodes.length > 0) {\n        tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront)\n      }\n      if (node.front) stack.push(node.front)\n      if (node.back) stack.push(node.back)\n      node = stack.pop()\n    } while (node !== undefined)\n  },\n\n  addPolygonTreeNodes: function (newpolygontreenodes) {\n    let current = { node: this, polygontreenodes: newpolygontreenodes }\n    const stack = []\n    do {\n      const node = current.node\n      const polygontreenodes = current.polygontreenodes\n\n      if (polygontreenodes.length === 0) {\n        current = stack.pop()\n        continue\n      }\n      if (!node.plane) {\n        let index = 0 // default\n        index = Math.floor(polygontreenodes.length / 2)\n        // index = polygontreenodes.length >> 1\n        // index = Math.floor(Math.random()*polygontreenodes.length)\n        const bestpoly = polygontreenodes[index].getPolygon()\n        node.plane = poly3.plane(bestpoly)\n      }\n      const frontnodes = []\n      const backnodes = []\n\n      for (let i = 0, n = polygontreenodes.length; i < n; ++i) {\n        polygontreenodes[i].splitByPlane(node.plane, node.polygontreenodes, backnodes, frontnodes, backnodes)\n      }\n\n      if (frontnodes.length > 0) {\n        if (!node.front) node.front = new Node(node)\n        stack.push({ node: node.front, polygontreenodes: frontnodes })\n      }\n      if (backnodes.length > 0) {\n        if (!node.back) node.back = new Node(node)\n        stack.push({ node: node.back, polygontreenodes: backnodes })\n      }\n\n      current = stack.pop()\n    } while (current !== undefined)\n  },\n\n  // TODO is this still used?\n  getParentPlaneNormals: function (normals, maxdepth) {\n    if (maxdepth > 0) {\n      if (this.parent) {\n        normals.push(this.parent.plane.normal)\n        this.parent.getParentPlaneNormals(normals, maxdepth - 1)\n      }\n    }\n  }\n}\n\nmodule.exports = Node\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/Node.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/PolygonTreeNode.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/PolygonTreeNode.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst splitPolygonByPlane = __webpack_require__(/*! ./splitPolygonByPlane */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/splitPolygonByPlane.js\")\n\n// # class PolygonTreeNode\n// This class manages hierarchical splits of polygons\n// At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes\n// Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes\n// splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes\n// are created holding the splitted polygon.\n// getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but\n// the two split parts (child nodes) are still intact, then the unsplit polygon is returned.\n// This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,\n//  getPolygons() will return the original unsplit polygon instead of the fragments.\n// remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated\n// since they are no longer intact.\n// constructor creates the root node:\nconst PolygonTreeNode = function () {\n  this.parent = null\n  this.children = []\n  this.polygon = null\n  this.removed = false\n}\n\nPolygonTreeNode.prototype = {\n  // fill the tree with polygons. Should be called on the root node only; child nodes must\n  // always be a derivate (split) of the parent node.\n  addPolygons: function (polygons) {\n    // new polygons can only be added to root node; children can only be splitted polygons\n    if (!this.isRootNode()) {\n      throw new Error('Assertion failed')\n    }\n    const _this = this\n    polygons.forEach((polygon) => {\n      _this.addChild(polygon)\n    })\n  },\n\n  // remove a node\n  // - the siblings become toplevel nodes\n  // - the parent is removed recursively\n  remove: function () {\n    if (!this.removed) {\n      this.removed = true\n\n      // remove ourselves from the parent's children list:\n      const parentschildren = this.parent.children\n      const i = parentschildren.indexOf(this)\n      if (i < 0) throw new Error('Assertion failed')\n      parentschildren.splice(i, 1)\n\n      // invalidate the parent's polygon, and of all parents above it:\n      this.parent.recursivelyInvalidatePolygon()\n    }\n  },\n\n  isRemoved: function () {\n    return this.removed\n  },\n\n  isRootNode: function () {\n    return !this.parent\n  },\n\n  // invert all polygons in the tree. Call on the root node\n  invert: function () {\n    if (!this.isRootNode()) throw new Error('Assertion failed') // can only call this on the root node\n    this.invertSub()\n  },\n\n  getPolygon: function () {\n    if (!this.polygon) throw new Error('Assertion failed') // doesn't have a polygon, which means that it has been broken down\n    return this.polygon\n  },\n\n  getPolygons: function (result) {\n    let children = [this]\n    const queue = [children]\n    let i, j, l, node\n    for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length\n      children = queue[i]\n      for (j = 0, l = children.length; j < l; j++) { // ok to cache length\n        node = children[j]\n        if (node.polygon) {\n          // the polygon hasn't been broken yet. We can ignore the children and return our polygon:\n          result.push(node.polygon)\n        } else {\n          // our polygon has been split up and broken, so gather all subpolygons from the children\n          if (node.children.length > 0) queue.push(node.children)\n        }\n      }\n    }\n  },\n\n  // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array\n  // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays\n  // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,\n  //  and added to both arrays.\n  splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {\n    if (this.children.length) {\n      const queue = [this.children]\n      let i\n      let j\n      let l\n      let node\n      let nodes\n      for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache\n        nodes = queue[i]\n        for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length\n          node = nodes[j]\n          if (node.children.length > 0) {\n            queue.push(node.children)\n          } else {\n            // no children. Split the polygon:\n            node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)\n          }\n        }\n      }\n    } else {\n      this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)\n    }\n  },\n\n  // only to be called for nodes with no children\n  _splitByPlane: function (splane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {\n    const polygon = this.polygon\n    if (polygon) {\n      const bound = poly3.measureBoundingSphere(polygon)\n      const sphereradius = bound[1] + EPS // ensure radius is LARGER then polygon\n      const spherecenter = bound[0]\n      const d = vec3.dot(splane, spherecenter) - splane[3]\n      if (d > sphereradius) {\n        frontnodes.push(this)\n      } else if (d < -sphereradius) {\n        backnodes.push(this)\n      } else {\n        const splitresult = splitPolygonByPlane(splane, polygon)\n        switch (splitresult.type) {\n          case 0:\n            // coplanar front:\n            coplanarfrontnodes.push(this)\n            break\n\n          case 1:\n            // coplanar back:\n            coplanarbacknodes.push(this)\n            break\n\n          case 2:\n            // front:\n            frontnodes.push(this)\n            break\n\n          case 3:\n            // back:\n            backnodes.push(this)\n            break\n\n          case 4:\n            // spanning:\n            if (splitresult.front) {\n              const frontnode = this.addChild(splitresult.front)\n              frontnodes.push(frontnode)\n            }\n            if (splitresult.back) {\n              const backnode = this.addChild(splitresult.back)\n              backnodes.push(backnode)\n            }\n            break\n        }\n      }\n    }\n  },\n\n  // PRIVATE methods from here:\n  // add child to a node\n  // this should be called whenever the polygon is split\n  // a child should be created for every fragment of the split polygon\n  // returns the newly created child\n  addChild: function (polygon) {\n    const newchild = new PolygonTreeNode()\n    newchild.parent = this\n    newchild.polygon = polygon\n    this.children.push(newchild)\n    return newchild\n  },\n\n  invertSub: function () {\n    let children = [this]\n    const queue = [children]\n    let i, j, l, node\n    for (i = 0; i < queue.length; i++) {\n      children = queue[i]\n      for (j = 0, l = children.length; j < l; j++) {\n        node = children[j]\n        if (node.polygon) {\n          node.polygon = poly3.invert(node.polygon)\n        }\n        if (node.children.length > 0) queue.push(node.children)\n      }\n    }\n  },\n\n  recursivelyInvalidatePolygon: function () {\n    let node = this\n    while (node.polygon) {\n      node.polygon = null\n      if (node.parent) {\n        node = node.parent\n      }\n    }\n  },\n\n  clear: function () {\n    let children = [this]\n    const queue = [children]\n    for (let i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length\n      children = queue[i]\n      const l = children.length\n      for (let j = 0; j < l; j++) {\n        const node = children[j]\n        if (node.polygon) {\n          node.polygon = null\n        }\n        if (node.parent) {\n          node.parent = null\n        }\n        if (node.children.length > 0) queue.push(node.children)\n        node.children = []\n      }\n    }\n  },\n\n  toString: function () {\n    let result = ''\n    let children = [this]\n    const queue = [children]\n    let i, j, l, node\n    for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length\n      children = queue[i]\n      const prefix = ' '.repeat(i)\n      for (j = 0, l = children.length; j < l; j++) { // ok to cache length\n        node = children[j]\n        result += `${prefix}PolygonTreeNode (${node.isRootNode()}): ${node.children.length}`\n        if (node.polygon) {\n          result += `\\n ${prefix}poly3\\n`\n        } else {\n          result += '\\n'\n        }\n        if (node.children.length > 0) queue.push(node.children)\n      }\n    }\n    return result\n  }\n}\n\nmodule.exports = PolygonTreeNode\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/PolygonTreeNode.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/Tree.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/Tree.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Node = __webpack_require__(/*! ./Node */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/Node.js\")\nconst PolygonTreeNode = __webpack_require__(/*! ./PolygonTreeNode */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/PolygonTreeNode.js\")\n\n// # class Tree\n// This is the root of a BSP tree\n// We are using this separate class for the root of the tree, to hold the PolygonTreeNode root\n// The actual tree is kept in this.rootnode\nconst Tree = function (polygons) {\n  this.polygonTree = new PolygonTreeNode()\n  this.rootnode = new Node(null)\n  if (polygons) this.addPolygons(polygons)\n}\n\nTree.prototype = {\n  invert: function () {\n    this.polygonTree.invert()\n    this.rootnode.invert()\n  },\n\n  // Remove all polygons in this BSP tree that are inside the other BSP tree\n  // `tree`.\n  clipTo: function (tree, alsoRemovecoplanarFront) {\n    alsoRemovecoplanarFront = !!alsoRemovecoplanarFront\n    this.rootnode.clipTo(tree, alsoRemovecoplanarFront)\n  },\n\n  allPolygons: function () {\n    const result = []\n    this.polygonTree.getPolygons(result)\n    return result\n  },\n\n  addPolygons: function (polygons) {\n    const polygontreenodes = new Array(polygons.length)\n    for (let i = 0; i < polygons.length; i++) {\n      polygontreenodes[i] = this.polygonTree.addChild(polygons[i])\n    }\n    this.rootnode.addPolygonTreeNodes(polygontreenodes)\n  },\n\n  clear: function () {\n    this.polygonTree.clear()\n  },\n\n  toString: function () {\n    const result = 'Tree: ' + this.polygonTree.toString('')\n    return result\n  }\n}\n\nmodule.exports = Tree\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/Tree.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = {\n  Tree: __webpack_require__(/*! ./Tree */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/Tree.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/splitLineSegmentByPlane.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/splitLineSegmentByPlane.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst splitLineSegmentByPlane = (plane, p1, p2) => {\n  const direction = vec3.subtract(p2, p1)\n  let lambda = (plane[3] - vec3.dot(plane, p1)) / vec3.dot(plane, direction)\n  if (Number.isNaN(lambda)) lambda = 0\n  if (lambda > 1) lambda = 1\n  if (lambda < 0) lambda = 0\n\n  vec3.scale(direction, lambda, direction)\n  vec3.add(direction, p1, direction)\n  return direction\n}\n\nmodule.exports = splitLineSegmentByPlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/splitLineSegmentByPlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/trees/splitPolygonByPlane.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/trees/splitPolygonByPlane.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst plane = __webpack_require__(/*! ../../../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\nconst vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst splitLineSegmentByPlane = __webpack_require__(/*! ./splitLineSegmentByPlane */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/splitLineSegmentByPlane.js\")\n\n// Returns object:\n// .type:\n//   0: coplanar-front\n//   1: coplanar-back\n//   2: front\n//   3: back\n//   4: spanning\n// In case the polygon is spanning, returns:\n// .front: a Polygon3 of the front part\n// .back: a Polygon3 of the back part\nconst splitPolygonByPlane = (splane, polygon) => {\n  const result = {\n    type: null,\n    front: null,\n    back: null\n  }\n  // cache in local lets (speedup):\n  const vertices = polygon.vertices\n  const numvertices = vertices.length\n  const pplane = poly3.plane(polygon)\n  if (plane.equals(pplane, splane)) {\n    result.type = 0\n  } else {\n    let hasfront = false\n    let hasback = false\n    const vertexIsBack = []\n    const MINEPS = -EPS\n    for (let i = 0; i < numvertices; i++) {\n      const t = vec3.dot(splane, vertices[i]) - splane[3]\n      const isback = (t < 0)\n      vertexIsBack.push(isback)\n      if (t > EPS) hasfront = true\n      if (t < MINEPS) hasback = true\n    }\n    if ((!hasfront) && (!hasback)) {\n      // all points coplanar\n      const t = vec3.dot(splane, pplane)\n      result.type = (t >= 0) ? 0 : 1\n    } else if (!hasback) {\n      result.type = 2\n    } else if (!hasfront) {\n      result.type = 3\n    } else {\n      // spanning\n      result.type = 4\n      const frontvertices = []\n      const backvertices = []\n      let isback = vertexIsBack[0]\n      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {\n        const vertex = vertices[vertexindex]\n        let nextvertexindex = vertexindex + 1\n        if (nextvertexindex >= numvertices) nextvertexindex = 0\n        const nextisback = vertexIsBack[nextvertexindex]\n        if (isback === nextisback) {\n          // line segment is on one side of the plane:\n          if (isback) {\n            backvertices.push(vertex)\n          } else {\n            frontvertices.push(vertex)\n          }\n        } else {\n          // line segment intersects plane:\n          const point = vertex\n          const nextpoint = vertices[nextvertexindex]\n          const intersectionpoint = splitLineSegmentByPlane(splane, point, nextpoint)\n          if (isback) {\n            backvertices.push(vertex)\n            backvertices.push(intersectionpoint)\n            frontvertices.push(intersectionpoint)\n          } else {\n            frontvertices.push(vertex)\n            frontvertices.push(intersectionpoint)\n            backvertices.push(intersectionpoint)\n          }\n        }\n        isback = nextisback\n      } // for vertexindex\n      // remove duplicate vertices:\n      const EPS_SQUARED = EPS * EPS\n      if (backvertices.length >= 3) {\n        let prevvertex = backvertices[backvertices.length - 1]\n        for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {\n          const vertex = backvertices[vertexindex]\n          if (vec3.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {\n            backvertices.splice(vertexindex, 1)\n            vertexindex--\n          }\n          prevvertex = vertex\n        }\n      }\n      if (frontvertices.length >= 3) {\n        let prevvertex = frontvertices[frontvertices.length - 1]\n        for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {\n          const vertex = frontvertices[vertexindex]\n          if (vec3.squaredDistance(vertex, prevvertex) < EPS_SQUARED) {\n            frontvertices.splice(vertexindex, 1)\n            vertexindex--\n          }\n          prevvertex = vertex\n        }\n      }\n      if (frontvertices.length >= 3) {\n        result.front = poly3.fromPointsAndPlane(frontvertices, pplane)\n      }\n      if (backvertices.length >= 3) {\n        result.back = poly3.fromPointsAndPlane(backvertices, pplane)\n      }\n    }\n  }\n  return result\n}\n\nmodule.exports = splitPolygonByPlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/trees/splitPolygonByPlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/union.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/union.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\nconst areAllShapesTheSameType = __webpack_require__(/*! ../../utils/areAllShapesTheSameType */ \"./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst unionGeom2 = __webpack_require__(/*! ./unionGeom2 */ \"./node_modules/@jscad/modeling/src/operations/booleans/unionGeom2.js\")\nconst unionGeom3 = __webpack_require__(/*! ./unionGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3.js\")\n\n/**\n * Return a new geometry representing the total space in the given geometries.\n * The given geometries should be of the same type, either geom2 or geom3.\n *\n * @param {...Object} geometries - list of geometries\n * @returns {geom2|geom3} a new geometry\n * @alias module:modeling/booleans.union\n *\n * @example\n * let myshape = union(cube({size: [5,5,5]}), cube({size: [5,5,5], center: [5,5,5]}))\n *\n * @example\n * +-------+            +-------+\n * |       |            |       |\n * |   A   |            |       |\n * |    +--+----+   =   |       +----+\n * +----+--+    |       +----+       |\n *      |   B   |            |       |\n *      |       |            |       |\n *      +-------+            +-------+\n */\nconst union = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  if (!areAllShapesTheSameType(geometries)) {\n    throw new Error('only unions of the same type are supported')\n  }\n\n  const geometry = geometries[0]\n  // if (path.isA(geometry)) return pathunion(matrix, geometries)\n  if (geom2.isA(geometry)) return unionGeom2(geometries)\n  if (geom3.isA(geometry)) return unionGeom3(geometries)\n  return geometry\n}\n\nmodule.exports = union\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/union.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/unionGeom2.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/unionGeom2.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst measureEpsilon = __webpack_require__(/*! ../../measurements/measureEpsilon */ \"./node_modules/@jscad/modeling/src/measurements/measureEpsilon.js\")\n\nconst fromFakePolygons = __webpack_require__(/*! ./fromFakePolygons */ \"./node_modules/@jscad/modeling/src/operations/booleans/fromFakePolygons.js\")\nconst to3DWalls = __webpack_require__(/*! ./to3DWalls */ \"./node_modules/@jscad/modeling/src/operations/booleans/to3DWalls.js\")\nconst unionGeom3 = __webpack_require__(/*! ./unionGeom3 */ \"./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3.js\")\n\n/*\n * Return a new 2D geometry representing the total space in the given 2D geometries.\n * @param {...geom2} geometries - list of 2D geometries to union\n * @returns {geom2} new 2D geometry\n */\nconst union = (...geometries) => {\n  geometries = flatten(geometries)\n  const newgeometries = geometries.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry))\n\n  const newgeom3 = unionGeom3(newgeometries)\n  const epsilon = measureEpsilon(newgeom3)\n\n  return fromFakePolygons(epsilon, geom3.toPolygons(newgeom3))\n}\n\nmodule.exports = union\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/unionGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst retessellate = __webpack_require__(/*! ./retessellate */ \"./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js\")\nconst unionSub = __webpack_require__(/*! ./unionGeom3Sub */ \"./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3Sub.js\")\n\n/*\n * Return a new 3D geometry representing the space in the given 3D geometries.\n * @param {...objects} geometries - list of geometries to union\n * @returns {geom3} new 3D geometry\n */\nconst union = (...geometries) => {\n  geometries = flatten(geometries)\n\n  // combine geometries in a way that forms a balanced binary tree pattern\n  let i\n  for (i = 1; i < geometries.length; i += 2) {\n    geometries.push(unionSub(geometries[i - 1], geometries[i]))\n  }\n  let newgeometry = geometries[i - 1]\n  newgeometry = retessellate(newgeometry)\n  return newgeometry\n}\n\nmodule.exports = union\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3Sub.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3Sub.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst mayOverlap = __webpack_require__(/*! ./mayOverlap */ \"./node_modules/@jscad/modeling/src/operations/booleans/mayOverlap.js\")\nconst { Tree } = __webpack_require__(/*! ./trees */ \"./node_modules/@jscad/modeling/src/operations/booleans/trees/index.js\")\n\n/*\n * Return a new 3D geometry representing the space in the given geometries.\n * @param {geom3} geometry1 - geometry to union\n * @param {geom3} geometry2 - geometry to union\n * @returns {goem3} new 3D geometry\n */\nconst unionSub = (geometry1, geometry2) => {\n  if (!mayOverlap(geometry1, geometry2)) {\n    return unionForNonIntersecting(geometry1, geometry2)\n  }\n\n  const a = new Tree(geom3.toPolygons(geometry1))\n  const b = new Tree(geom3.toPolygons(geometry2))\n\n  a.clipTo(b, false)\n  // b.clipTo(a, true); // ERROR: doesn't work\n  b.clipTo(a)\n  b.invert()\n  b.clipTo(a)\n  b.invert()\n\n  const newpolygons = a.allPolygons().concat(b.allPolygons())\n  const result = geom3.create(newpolygons)\n  return result\n}\n\n// Like union, but when we know that the two solids are not intersecting\n// Do not use if you are not completely sure that the solids do not intersect!\nconst unionForNonIntersecting = (geometry1, geometry2) => {\n  let newpolygons = geom3.toPolygons(geometry1)\n  newpolygons = newpolygons.concat(geom3.toPolygons(geometry2))\n  return geom3.create(newpolygons)\n}\n\nmodule.exports = unionSub\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3Sub.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/expand.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/expand.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst expandGeom2 = __webpack_require__(/*! ./expandGeom2 */ \"./node_modules/@jscad/modeling/src/operations/expansions/expandGeom2.js\")\nconst expandGeom3 = __webpack_require__(/*! ./expandGeom3 */ \"./node_modules/@jscad/modeling/src/operations/expansions/expandGeom3.js\")\nconst expandPath2 = __webpack_require__(/*! ./expandPath2 */ \"./node_modules/@jscad/modeling/src/operations/expansions/expandPath2.js\")\n\n/**\n * Expand the given geometry using the given options.\n * Note: Contract is expand using a negative delta.\n * @param {Object} options - options for expand\n * @param {Number} [options.delta=1] - delta (+/-) of expansion\n * @param {String} [options.corners='edge'] - type of corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {...Objects} geometry - the list of geometry to expand\n * @return {Object|Array} new geometry, or list of new geometries\n * @alias module:modeling/expansions.expand\n *\n * @example\n * let newarc = expand({delta: 5, corners: 'edge'}, arc({}))\n * let newsquare = expand({delta: 5, corners: 'chamfer'}, square({size: 30}))\n * let newsphere = expand({delta: 2, corners: 'round'}, cuboid({size: [20, 25, 5]}))\n */\nconst expand = (options, ...objects) => {\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return expandPath2(options, object)\n    if (geom2.isA(object)) return expandGeom2(options, object)\n    if (geom3.isA(object)) return expandGeom3(options, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = expand\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/expand.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/expandGeom2.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/expandGeom2.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst offsetFromPoints = __webpack_require__(/*! ./offsetFromPoints */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js\")\n\n/*\n * Expand the given geometry (geom2) using the given options (if any).\n * @param {Object} options - options for expand\n * @param {Number} [options.delta=1] - delta (+/-) of expansion\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {geom2} geometry - the geometry to expand\n * @returns {geom2} expanded geometry\n */\nconst expandGeom2 = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    corners: 'edge',\n    segments: 16\n  }\n  const { delta, corners, segments } = Object.assign({ }, defaults, options)\n\n  if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {\n    throw new Error('corners must be \"edge\", \"chamfer\", or \"round\"')\n  }\n\n  // convert the geometry to outlines, and generate offsets from each\n  const outlines = geom2.toOutlines(geometry)\n  const newoutlines = outlines.map((outline) => {\n    options = {\n      delta,\n      corners,\n      closed: true,\n      segments\n    }\n    return offsetFromPoints(options, outline)\n  })\n\n  // create a composite geometry from the new outlines\n  const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2.toSides(geom2.fromPoints(newoutline))), [])\n  return geom2.create(allsides)\n}\n\nmodule.exports = expandGeom2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/expandGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/expandGeom3.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/expandGeom3.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst union = __webpack_require__(/*! ../booleans/union */ \"./node_modules/@jscad/modeling/src/operations/booleans/union.js\")\n\nconst expandShell = __webpack_require__(/*! ./expandShell */ \"./node_modules/@jscad/modeling/src/operations/expansions/expandShell.js\")\n\n/*\n * Expand the given geometry (geom3) using the given options (if any).\n * @param {Object} options - options for expand\n * @param {Number} [options.delta=1] - delta (+/-) of expansion\n * @param {String} [options.corners='round'] - type corner to create during of expansion; round\n * @param {Integer} [options.segments=12] - number of segments when creating round corners\n * @param {geom3} geometry - the geometry to expand\n * @returns {geom3} expanded geometry\n */\nconst expandGeom3 = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    corners: 'round',\n    segments: 12\n  }\n  const { delta, corners, segments } = Object.assign({ }, defaults, options)\n\n  if (!(corners === 'round')) {\n    throw new Error('corners must be \"round\" for 3D geometries')\n  }\n\n  const polygons = geom3.toPolygons(geometry)\n  if (polygons.length === 0) throw new Error('the given geometry cannot be empty')\n\n  options = { delta, corners, segments }\n  const expanded = expandShell(options, geometry)\n  return union(geometry, expanded)\n}\n\nmodule.exports = expandGeom3\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/expandGeom3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/expandPath2.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/expandPath2.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const area = __webpack_require__(/*! ../../maths/utils/area */ \"./node_modules/@jscad/modeling/src/maths/utils/area.js\")\n\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst offsetFromPoints = __webpack_require__(/*! ./offsetFromPoints */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js\")\n\nconst createGeometryFromClosedOffsets = (paths) => {\n  let { external, internal } = paths\n  if (area(external) < 0) {\n    external = external.reverse()\n  } else {\n    internal = internal.reverse()\n  }\n  // NOTE: creating path2 from the points ensures proper closure\n  const externalPath = path2.fromPoints({ closed: true }, external)\n  const internalPath = path2.fromPoints({ closed: true }, internal)\n  const externalSides = geom2.toSides(geom2.fromPoints(path2.toPoints(externalPath)))\n  const internalSides = geom2.toSides(geom2.fromPoints(path2.toPoints(internalPath)))\n  externalSides.push(...internalSides)\n  return geom2.create(externalSides)\n}\n\nconst createGeometryFromExpandedOpenPath = (paths, segments, corners, delta) => {\n  const { points, external, internal } = paths\n  const capSegments = Math.floor(segments / 2) // rotation is 180 degrees\n  const e2iCap = []\n  const i2eCap = []\n  if (corners === 'round' && capSegments > 0) {\n    // added round caps to the geometry\n    const step = Math.PI / capSegments\n    const eCorner = points[points.length - 1]\n    const e2iStart = vec2.angle(vec2.subtract(external[external.length - 1], eCorner))\n    const iCorner = points[0]\n    const i2eStart = vec2.angle(vec2.subtract(internal[0], iCorner))\n    for (let i = 1; i < capSegments; i++) {\n      let radians = e2iStart + (step * i)\n      let point = vec2.add(eCorner, vec2.scale(delta, vec2.fromAngleRadians(radians)))\n      e2iCap.push(point)\n\n      radians = i2eStart + (step * i)\n      point = vec2.add(iCorner, vec2.scale(delta, vec2.fromAngleRadians(radians)))\n      i2eCap.push(point)\n    }\n  }\n  const allPoints = []\n  allPoints.push(...external, ...e2iCap, ...internal.reverse(), ...i2eCap)\n  return geom2.fromPoints(allPoints)\n}\n\n/*\n * Expand the given geometry (path2) using the given options (if any).\n * @param {Object} options - options for expand\n * @param {Number} [options.delta=1] - delta (+) of expansion\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {path2} geometry - the geometry to expand\n * @returns {geom2} expanded geometry\n */\nconst expandPath2 = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    corners: 'edge',\n    segments: 16\n  }\n\n  options = Object.assign({ }, defaults, options)\n  const { delta, corners, segments } = options\n\n  if (delta <= 0) throw new Error('the given delta must be positive for paths')\n\n  if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {\n    throw new Error('corners must be \"edge\", \"chamfer\", or \"round\"')\n  }\n\n  const closed = geometry.isClosed\n  const points = path2.toPoints(geometry)\n  if (points.length === 0) throw new Error('the given geometry cannot be empty')\n\n  const paths = {\n    points: points,\n    external: offsetFromPoints({ delta, corners, segments, closed }, points),\n    internal: offsetFromPoints({ delta: -delta, corners, segments, closed }, points)\n  }\n\n  if (geometry.isClosed) {\n    return createGeometryFromClosedOffsets(paths)\n  } else {\n    return createGeometryFromExpandedOpenPath(paths, segments, corners, delta)\n  }\n}\n\nmodule.exports = expandPath2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/expandPath2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/expandShell.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/expandShell.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst fnNumberSort = __webpack_require__(/*! ../../utils/fnNumberSort */ \"./node_modules/@jscad/modeling/src/utils/fnNumberSort.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst sphere = __webpack_require__(/*! ../../primitives/sphere */ \"./node_modules/@jscad/modeling/src/primitives/sphere.js\")\n\nconst retessellate = __webpack_require__(/*! ../booleans/retessellate */ \"./node_modules/@jscad/modeling/src/operations/booleans/retessellate.js\")\nconst unionGeom3Sub = __webpack_require__(/*! ../booleans/unionGeom3Sub */ \"./node_modules/@jscad/modeling/src/operations/booleans/unionGeom3Sub.js\")\n\nconst extrudePolygon = __webpack_require__(/*! ./extrudePolygon */ \"./node_modules/@jscad/modeling/src/operations/expansions/extrudePolygon.js\")\n\nconst { center } = __webpack_require__(/*! ../transforms/center */ \"./node_modules/@jscad/modeling/src/operations/transforms/center.js\")\n\nconst mapPlaneToVertex = (map, vertex, plane) => {\n  const i = map.findIndex((item) => vec3.equals(item[0], vertex))\n  if (i < 0) {\n    const entry = [vertex, [plane]]\n    map.push(entry)\n    return map.length\n  }\n  const planes = map[i][1]\n  planes.push(plane)\n  return i\n}\n\nconst mapPlaneToEdge = (map, edge, plane) => {\n  const i = map.findIndex((item) => (vec3.equals(item[0], edge[0]) && vec3.equals(item[1], edge[1])) || (vec3.equals(item[0], edge[1]) && vec3.equals(item[1], edge[0])))\n  if (i < 0) {\n    const entry = [edge, [plane]]\n    map.push(entry)\n    return map.length\n  }\n  const planes = map[i][1]\n  planes.push(plane)\n  return i\n}\n\nconst addUniqueAngle = (map, angle) => {\n  const i = map.findIndex((item) => item === angle)\n  if (i < 0) {\n    map.push(angle)\n    return map.length\n  }\n  return i\n}\n\n/*\n * Create the expanded shell of the solid:\n * All faces are extruded to 2 times delta\n * Cylinders are constructed around every side\n * Spheres are placed on every vertex\n * the result is a true expansion of the solid\n * @param  {Number} delta\n * @param  {Integer} segments\n */\nconst expandShell = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    segments: 12\n  }\n  const { delta, segments } = Object.assign({ }, defaults, options)\n\n  let result = geom3.create()\n  const vertices2planes = [] // contents: [vertex, [plane, ...]]\n  const edges2planes = [] // contents: [[vertex, vertex], [plane, ...]]\n\n  // loop through the polygons\n  // - extruded the polygon, and add to the composite result\n  // - add the plane to the unique vertice map\n  // - add the plane to the unique edge map\n  const polygons = geom3.toPolygons(geometry)\n  polygons.forEach((polygon) => {\n    const extrudevector = vec3.scale(2 * delta, poly3.plane(polygon))\n    const translatedpolygon = poly3.transform(mat4.fromTranslation(vec3.scale(-0.5, extrudevector)), polygon)\n    const extrudedface = extrudePolygon(extrudevector, translatedpolygon)\n    result = unionGeom3Sub(result, extrudedface)\n\n    const vertices = polygon.vertices\n    for (let i = 0; i < vertices.length; i++) {\n      mapPlaneToVertex(vertices2planes, vertices[i], poly3.plane(polygon))\n      const j = (i + 1) % vertices.length\n      const edge = [vertices[i], vertices[j]]\n      mapPlaneToEdge(edges2planes, edge, poly3.plane(polygon))\n    }\n  })\n\n  // now construct a cylinder on every side\n  // The cylinder is always an approximation of a true cylinder, having polygons\n  // around the sides. We will make sure though that the cylinder will have an edge at every\n  // face that touches this side. This ensures that we will get a smooth fill even\n  // if two edges are at, say, 10 degrees and the segments is low.\n  edges2planes.forEach((item) => {\n    const edge = item[0]\n    const planes = item[1]\n    const startpoint = edge[0]\n    const endpoint = edge[1]\n\n    // our x,y and z vectors:\n    const zbase = vec3.unit(vec3.subtract(endpoint, startpoint))\n    const xbase = planes[0]\n    const ybase = vec3.cross(xbase, zbase)\n\n    // make a list of angles that the cylinder should traverse:\n    let angles = []\n\n    // first of all equally spaced around the cylinder:\n    for (let i = 0; i < segments; i++) {\n      addUniqueAngle(angles, (i * Math.PI * 2 / segments))\n    }\n\n    // and also at every normal of all touching planes:\n    for (let i = 0, iMax = planes.length; i < iMax; i++) {\n      const planenormal = planes[i]\n      const si = vec3.dot(ybase, planenormal)\n      const co = vec3.dot(xbase, planenormal)\n      let angle = Math.atan2(si, co)\n\n      if (angle < 0) angle += Math.PI * 2\n      addUniqueAngle(angles, angle)\n      angle = Math.atan2(-si, -co)\n      if (angle < 0) angle += Math.PI * 2\n      addUniqueAngle(angles, angle)\n    }\n\n    // this will result in some duplicate angles but we will get rid of those later.\n    angles = angles.sort(fnNumberSort)\n\n    // Now construct the cylinder by traversing all angles:\n    const numangles = angles.length\n    let prevp1\n    let prevp2\n    const startfacevertices = []\n    const endfacevertices = []\n    const polygons = []\n    for (let i = -1; i < numangles; i++) {\n      const angle = angles[(i < 0) ? (i + numangles) : i]\n      const si = Math.sin(angle)\n      const co = Math.cos(angle)\n      const p = vec3.add(vec3.scale(co * delta, xbase), vec3.scale(si * delta, ybase))\n      const p1 = vec3.add(startpoint, p)\n      const p2 = vec3.add(endpoint, p)\n      let skip = false\n      if (i >= 0) {\n        if (vec3.distance(p1, prevp1) < EPS) {\n          skip = true\n        }\n      }\n      if (!skip) {\n        if (i >= 0) {\n          startfacevertices.push(p1)\n          endfacevertices.push(p2)\n          const points = [prevp2, p2, p1, prevp1]\n          const polygon = poly3.fromPoints(points)\n          polygons.push(polygon)\n        }\n        prevp1 = p1\n        prevp2 = p2\n      }\n    }\n    endfacevertices.reverse()\n    polygons.push(poly3.fromPoints(startfacevertices))\n    polygons.push(poly3.fromPoints(endfacevertices))\n\n    const cylinder = geom3.create(polygons)\n    result = unionGeom3Sub(result, cylinder)\n  })\n\n  // build spheres at each unique vertex\n  // We will try to set the x and z axis to the normals of 2 planes\n  // This will ensure that our sphere tesselation somewhat matches 2 planes\n  vertices2planes.forEach((item) => {\n    const vertex = item[0]\n    const planes = item[1]\n    // use the first normal to be the x axis of our sphere:\n    const xaxis = planes[0]\n    // and find a suitable z axis. We will use the normal which is most perpendicular to the x axis:\n    let bestzaxis = null\n    let bestzaxisorthogonality = 0\n    for (let i = 1; i < planes.length; i++) {\n      const normal = planes[i]\n      const cross = vec3.cross(xaxis, normal)\n      const crosslength = vec3.length(cross)\n      if (crosslength > 0.05) {\n        if (crosslength > bestzaxisorthogonality) {\n          bestzaxisorthogonality = crosslength\n          bestzaxis = normal\n        }\n      }\n    }\n    if (!bestzaxis) {\n      bestzaxis = vec3.orthogonal(xaxis)\n    }\n    const yaxis = vec3.unit(vec3.cross(xaxis, bestzaxis))\n    const zaxis = vec3.cross(yaxis, xaxis)\n    const corner = center({ center: [vertex[0], vertex[1], vertex[2]] }, sphere({\n      radius: delta,\n      segments: segments,\n      axes: [xaxis, yaxis, zaxis]\n    }))\n    result = unionGeom3Sub(result, corner)\n  })\n  // FIXME ... hack hack hack\n  result.isCanonicalized = true\n  return retessellate(result)\n}\n\nmodule.exports = expandShell\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/expandShell.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/extrudePolygon.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/extrudePolygon.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n// Extrude a polygon in the direction of the offsetvector.\n// Returns (geom3) a new geometry\nconst extrudePolygon = (offsetvector, polygon1) => {\n  const direction = vec3.dot(poly3.plane(polygon1), offsetvector)\n  if (direction > 0) {\n    polygon1 = poly3.invert(polygon1)\n  }\n\n  const newpolygons = [polygon1]\n\n  const polygon2 = poly3.transform(mat4.fromTranslation(offsetvector), polygon1)\n  const numvertices = polygon1.vertices.length\n  for (let i = 0; i < numvertices; i++) {\n    const sidefacepoints = []\n    const nexti = (i < (numvertices - 1)) ? i + 1 : 0\n    sidefacepoints.push(polygon1.vertices[i])\n    sidefacepoints.push(polygon2.vertices[i])\n    sidefacepoints.push(polygon2.vertices[nexti])\n    sidefacepoints.push(polygon1.vertices[nexti])\n    const sidefacepolygon = poly3.fromPoints(sidefacepoints)\n    newpolygons.push(sidefacepolygon)\n  }\n  newpolygons.push(poly3.invert(polygon2))\n\n  return geom3.create(newpolygons)\n}\n\nmodule.exports = extrudePolygon\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/extrudePolygon.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be expanded (or contracted.)\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/expansions\n * @example\n * const { expand, offset } = require('@jscad/modeling').expansions\n */\nmodule.exports = {\n  expand: __webpack_require__(/*! ./expand */ \"./node_modules/@jscad/modeling/src/operations/expansions/expand.js\"),\n  offset: __webpack_require__(/*! ./offset */ \"./node_modules/@jscad/modeling/src/operations/expansions/offset.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/offset.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/offset.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst offsetGeom2 = __webpack_require__(/*! ./offsetGeom2 */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetGeom2.js\")\nconst offsetPath2 = __webpack_require__(/*! ./offsetPath2 */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetPath2.js\")\n\n/**\n * Create offset geometry from the given geometry using the given options.\n * @param {Object} options - options for offset\n * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {...Object} geometry - the list of geometry to offset\n * @return {Object|Array} new geometry, or list of new geometries\n * @alias module:modeling/expansions.offset\n *\n * @example\n * let small = offset({ delta: -4, corners: 'chamfer' }, square({size: 40})) // contract\n */\nconst offset = (options, ...objects) => {\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return offsetPath2(options, object)\n    if (geom2.isA(object)) return offsetGeom2(options, object)\n    // if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = offset\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/offset.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst intersect = __webpack_require__(/*! ../../maths/utils/intersect */ \"./node_modules/@jscad/modeling/src/maths/utils/intersect.js\")\nconst line2 = __webpack_require__(/*! ../../maths/line2 */ \"./node_modules/@jscad/modeling/src/maths/line2/index.js\")\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst area = __webpack_require__(/*! ../../maths/utils/area */ \"./node_modules/@jscad/modeling/src/maths/utils/area.js\")\n\n/*\n * Create a set of offset points from the given points using the given options (if any).\n * @param {Object} options - options for offset\n * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {Integer} [options.closed=false] - is the last point connected back to the first point?\n * @param {Array} points - array of 2D points\n * @returns {Array} new set of offset points, plus points for each rounded corner\n */\nconst offsetFromPoints = (options, points) => {\n  const defaults = {\n    delta: 1,\n    corners: 'edge',\n    closed: false,\n    segments: 16\n  }\n  let { delta, corners, closed, segments } = Object.assign({ }, defaults, options)\n\n  if (Math.abs(delta) < EPS) return points\n\n  let rotation = options.closed ? area(points) : 1.0 // + counter clockwise, - clockwise\n  if (rotation === 0) rotation = 1.0\n\n  // use right hand normal?\n  const orientation = ((rotation > 0) && (delta >= 0)) || ((rotation < 0) && (delta < 0))\n  delta = Math.abs(delta) // sign is no longer required\n\n  let previousSegment = null\n  const newPoints = []\n  const newCorners = []\n  const n = points.length\n  for (let i = 0; i < n; i++) {\n    const j = (i + 1) % n\n    const p0 = points[i]\n    const p1 = points[j]\n    // calculate the unit normal\n    const of = orientation ? vec2.normal(vec2.subtract(p0, p1)) : vec2.normal(vec2.subtract(p1, p0))\n    vec2.normalize(of, of)\n    // calculate the offset vector\n    vec2.scale(of, delta, of)\n    // calculate the new points (edge)\n    const n0 = vec2.add(p0, of)\n    const n1 = vec2.add(p1, of)\n\n    const currentSegment = [n0, n1]\n    if (previousSegment != null) {\n      if (closed || (!closed && j !== 0)) {\n        // check for intersection of new line segments\n        const ip = intersect(previousSegment[0], previousSegment[1], currentSegment[0], currentSegment[1])\n        if (ip) {\n          // adjust the previous points\n          newPoints.pop()\n          // adjust current points\n          currentSegment[0] = ip\n        } else {\n          newCorners.push({ c: p0, s0: previousSegment, s1: currentSegment })\n        }\n      }\n    }\n    previousSegment = [n0, n1]\n\n    if (j === 0 && !closed) continue\n\n    newPoints.push(currentSegment[0])\n    newPoints.push(currentSegment[1])\n  }\n  // complete the closure if required\n  if (closed && previousSegment != null) {\n    // check for intersection of closing line segments\n    const n0 = newPoints[0]\n    const n1 = newPoints[1]\n    const ip = intersect(previousSegment[0], previousSegment[1], n0, n1)\n    if (ip) {\n      // adjust the previous points\n      newPoints[0] = ip\n      newPoints.pop()\n    } else {\n      const p0 = points[0]\n      const cursegment = [n0, n1]\n      newCorners.push({ c: p0, s0: previousSegment, s1: cursegment })\n    }\n  }\n\n  // generate corners if necessary\n\n  if (corners === 'edge') {\n    // create edge corners\n    newCorners.forEach((corner) => {\n      const line0 = line2.fromPoints(corner.s0[0], corner.s0[1])\n      const line1 = line2.fromPoints(corner.s1[0], corner.s1[1])\n      const ip = line2.intersectPointOfLines(line0, line1)\n      const p0 = corner.s0[1]\n      let i = newPoints.findIndex((point) => vec2.equals(p0, point))\n      i = (i + 1) % newPoints.length\n      newPoints.splice(i, 0, ip)\n    })\n  }\n\n  if (corners === 'round') {\n    // create rounded corners\n    let cornersegments = Math.floor(segments / 4)\n    newCorners.forEach((corner) => {\n      // calculate angle of rotation\n      let rotation = vec2.angle(vec2.subtract(corner.s1[0], corner.c))\n      rotation -= vec2.angle(vec2.subtract(corner.s0[1], corner.c))\n      if (orientation && rotation < 0) {\n        rotation = rotation + Math.PI\n        if (rotation < 0) rotation = rotation + Math.PI\n      }\n      if ((!orientation) && rotation > 0) {\n        rotation = rotation - Math.PI\n        if (rotation > 0) rotation = rotation - Math.PI\n      }\n\n      // generate the segments\n      cornersegments = Math.floor(segments * (Math.abs(rotation) / (2 * Math.PI)))\n      const step = rotation / cornersegments\n      const start = vec2.angle(vec2.subtract(corner.s0[1], corner.c))\n      const cornerpoints = []\n      for (let i = 1; i < cornersegments; i++) {\n        const radians = start + (step * i)\n        const point = vec2.add(corner.c, vec2.scale(delta, vec2.fromAngleRadians(radians)))\n        cornerpoints.push(point)\n      }\n      if (cornerpoints.length > 0) {\n        const p0 = corner.s0[1]\n        let i = newPoints.findIndex((point) => vec2.equals(p0, point))\n        i = (i + 1) % newPoints.length\n        newPoints.splice(i, 0, ...cornerpoints)\n      }\n    })\n  }\n  return newPoints\n}\n\nmodule.exports = offsetFromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/offsetGeom2.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/offsetGeom2.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst poly2 = __webpack_require__(/*! ../../geometries/poly2 */ \"./node_modules/@jscad/modeling/src/geometries/poly2/index.js\")\n\nconst offsetFromPoints = __webpack_require__(/*! ./offsetFromPoints */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js\")\n\n/*\n * Create a offset geometry from the given geom2 using the given options (if any).\n * @param {Object} options - options for offset\n * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {geom2} geometry - geometry from which to create the offset\n * @returns {geom2} offset geometry, plus rounded corners\n */\nconst offsetGeom2 = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    corners: 'edge',\n    segments: 0\n  }\n  const { delta, corners, segments } = Object.assign({ }, defaults, options)\n\n  if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {\n    throw new Error('corners must be \"edge\", \"chamfer\", or \"round\"')\n  }\n\n  // convert the geometry to outlines, and generate offsets from each\n  const outlines = geom2.toOutlines(geometry)\n  const newoutlines = outlines.map((outline) => {\n    const level = outlines.reduce((acc, polygon) => acc + poly2.arePointsInside(outline, poly2.create(polygon)), 0)\n    const outside = (level % 2) === 0\n\n    options = {\n      delta: outside ? delta : -delta,\n      corners,\n      closed: true,\n      segments\n    }\n    return offsetFromPoints(options, outline)\n  })\n\n  // create a composite geometry from the new outlines\n  const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom2.toSides(geom2.fromPoints(newoutline))), [])\n  return geom2.create(allsides)\n}\n\nmodule.exports = offsetGeom2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/offsetGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/expansions/offsetPath2.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/expansions/offsetPath2.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst offsetFromPoints = __webpack_require__(/*! ./offsetFromPoints */ \"./node_modules/@jscad/modeling/src/operations/expansions/offsetFromPoints.js\")\n\n/*\n * Create a offset geometry from the given path using the given options (if any).\n * @param {Object} options - options for offset\n * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)\n * @param {String} [options.corners='edge'] - type corner to create during of expansion; edge, chamfer, round\n * @param {Integer} [options.segments=16] - number of segments when creating round corners\n * @param {path2} geometry - geometry from which to create the offset\n * @returns {path2} offset geometry, plus rounded corners\n */\nconst offsetPath2 = (options, geometry) => {\n  const defaults = {\n    delta: 1,\n    corners: 'edge',\n    closed: geometry.isClosed,\n    segments: 16\n  }\n  const { delta, corners, closed, segments } = Object.assign({ }, defaults, options)\n\n  if (!(corners === 'edge' || corners === 'chamfer' || corners === 'round')) {\n    throw new Error('corners must be \"edge\", \"chamfer\", or \"round\"')\n  }\n\n  options = { delta, corners, closed, segments }\n  const newpoints = offsetFromPoints(options, path2.toPoints(geometry))\n  return path2.fromPoints({ closed: closed }, newpoints)\n}\n\nmodule.exports = offsetPath2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/expansions/offsetPath2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst slice = __webpack_require__(/*! ./slice */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js\")\n\nconst extrudeWalls = __webpack_require__(/*! ./extrudeWalls */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeWalls.js\")\n\nconst defaultCallback = (progress, index, base) => {\n  let baseSlice = null\n  if (geom2.isA(base)) baseSlice = slice.fromSides(geom2.toSides(base))\n  if (poly3.isA(base)) baseSlice = slice.fromPoints(poly3.toPoints(base))\n\n  return progress === 0 || progress === 1 ? slice.transform(mat4.fromTranslation([0, 0, progress]), baseSlice) : null\n}\n\n/**\n * Extrude a solid from the slices as returned by the callback function.\n * @see slice\n *\n * @param {Object} options - options for extrude\n * @param {Integer} [options.numberOfSlices=2] the number of slices to be generated by the callback\n * @param {Boolean} [options.isCapped=true] the solid should have caps at both start and end\n * @param {Function} [options.callback] the callback function that generates each slice\n * @param {Object} base - the base object which is used to create slices (see the example for callback information)\n * @return {geom3} the extruded shape\n * @alias module:modeling/extrusions.extrudeFromSlices\n *\n * @example\n * // Parameters:\n * //   progress : the percent complete [0..1]\n * //   index : the index of the current slice [0..numberOfSlices - 1]\n * //   base : the base object as given\n * // Return Value:\n * //   slice or null (to skip)\n * const callback = (progress, index, base) => {\n *   ...\n *   return slice\n * }\n */\nconst extrudeFromSlices = (options, base) => {\n  const defaults = {\n    numberOfSlices: 2,\n    isCapped: true,\n    callback: defaultCallback\n  }\n  const { numberOfSlices, isCapped, callback: generate } = Object.assign({ }, defaults, options)\n\n  if (numberOfSlices < 2) throw new Error('numberOfSlices must be 2 or more')\n\n  const sMax = numberOfSlices - 1\n\n  let startSlice = null\n  let endSlice = null\n  let prevSlice = null\n  let polygons = []\n  for (let s = 0; s < numberOfSlices; s++) {\n    // invoke the callback function to get the next slice\n    // NOTE: callback can return null to skip the slice\n    const currentSlice = generate(s / sMax, s, base)\n\n    if (currentSlice) {\n      if (!slice.isA(currentSlice)) throw new Error('the callback function must return slice objects')\n\n      const edges = slice.toEdges(currentSlice)\n      if (edges.length === 0) throw new Error('the callback function must return slices with one or more edges')\n\n      if (prevSlice) {\n        polygons = polygons.concat(extrudeWalls(prevSlice, currentSlice))\n      }\n\n      // save start and end slices for caps if necessary\n      if (s === 0) startSlice = currentSlice\n      if (s === (numberOfSlices - 1)) endSlice = currentSlice\n\n      prevSlice = currentSlice\n    }\n  }\n\n  if (isCapped) {\n    // create caps at both ends (closed volume)\n    const endPolygons = slice.toPolygons(endSlice)\n    polygons = polygons.concat(endPolygons)\n\n    slice.reverse(startSlice, startSlice)\n    const startPolygons = slice.toPolygons(startSlice)\n    polygons = polygons.concat(startPolygons)\n  } else {\n    // create walls between end and start slices\n    if (!slice.equals(endSlice, startSlice)) {\n      polygons = polygons.concat(extrudeWalls(endSlice, startSlice))\n    }\n  }\n  return geom3.create(polygons)\n}\n\nmodule.exports = extrudeFromSlices\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinear.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinear.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst extrudeLinearGeom2 = __webpack_require__(/*! ./extrudeLinearGeom2 */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js\")\n\n/**\n * Extrude the given geometry in an upward linear direction using the given options.\n * @param {Object} options - options for extrude\n * @param {Array} [options.height=1] the height of the extrusion\n * @param {Number} [options.twistAngle=0] the final rotation (RADIANS) about the origin of the shape (if any)\n * @param {Integer} [options.twistSteps=1] the resolution of the twist about the axis (if any)\n * @param {...Object} geometry - the list of geometry to extrude\n * @return {Object|Array} the extruded geometry, or a list of extruded geometry\n * @alias module:modeling/extrusions.extrudeLinear\n *\n * @example\n * let myshape = extrudeLinear({height: 10}, rectangle({size: [20, 25]}))\n */\nconst extrudeLinear = (options, ...objects) => {\n  const defaults = {\n    height: 1,\n    twistAngle: 0,\n    twistSteps: 1\n  }\n  const { height, twistAngle, twistSteps } = Object.assign({ }, defaults, options)\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  options = { offset: [0, 0, height], twistAngle: twistAngle, twistSteps: twistSteps }\n\n  const results = objects.map((object) => {\n    // if (path.isA(object)) return pathextrude(options, object)\n    if (geom2.isA(object)) return extrudeLinearGeom2(options, object)\n    // if (geom3.isA(object)) return geom3.extrude(options, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = extrudeLinear\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinear.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst slice = __webpack_require__(/*! ./slice */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js\")\n\nconst extrudeFromSlices = __webpack_require__(/*! ./extrudeFromSlices */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js\")\n\n/*\n * Extrude the given geometry using the given options.\n *\n * @param {Object} [options] - options for extrude\n * @param {Array} [options.offset] - the direction of the extrusion as a 3D vector\n * @param {Number} [options.twistAngle] - the final rotation (RADIANS) about the origin\n * @param {Integer} [options.twistSteps] - the number of steps created to produce the twist (if any)\n * @param {geom2} geometry - the geometry to extrude\n * @returns {geom3} the extruded 3D geometry\n*/\nconst extrudeGeom2 = (options, geometry) => {\n  const defaults = {\n    offset: [0, 0, 1],\n    twistAngle: 0,\n    twistSteps: 12\n  }\n  let { offset, twistAngle, twistSteps } = Object.assign({ }, defaults, options)\n\n  if (twistSteps < 1) throw new Error('twistSteps must be 1 or more')\n\n  if (twistAngle === 0) {\n    twistSteps = 1\n  }\n\n  // convert to vector in order to perform transforms\n  const offsetv = vec3.fromArray(offset)\n\n  const baseSides = geom2.toSides(geometry)\n  if (baseSides.length === 0) throw new Error('the given geometry cannot be empty')\n\n  const baseSlice = slice.fromSides(baseSides)\n  if (offsetv[2] < 0) slice.reverse(baseSlice, baseSlice)\n\n  const createTwist = (progress, index, base) => {\n    const Zrotation = index / twistSteps * twistAngle\n    const Zoffset = vec3.scale(index / twistSteps, offsetv)\n    const matrix = mat4.multiply(mat4.fromZRotation(Zrotation), mat4.fromTranslation(Zoffset))\n\n    return slice.transform(matrix, base)\n  }\n\n  options = {\n    numberOfSlices: twistSteps + 1,\n    isCapped: true,\n    callback: createTwist\n  }\n  return extrudeFromSlices(options, baseSlice)\n}\n\nmodule.exports = extrudeGeom2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangular.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangular.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst extrudeRectangularPath2 = __webpack_require__(/*! ./extrudeRectangularPath2 */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularPath2.js\")\nconst extrudeRectangularGeom2 = __webpack_require__(/*! ./extrudeRectangularGeom2 */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularGeom2.js\")\n\n/**\n * Extrude the given geometry by following the outline(s) with a rectangle.\n * @See expand for addition options\n * @param {Object} options - options for extrusion, if any\n * @param {Number} [options.size=1] - size of the rectangle\n * @param {Number} [options.height=1] - height of the extrusion\n * @param {...Object} geometry - the list of geometry to extrude\n * @return {Object|Array} the extruded object, or a list of extruded objects\n * @alias module:modeling/extrusions.extrudeRectangular\n *\n * @example:\n * let mywalls = extrudeRectangular({offset: [0,0,10]}, square())\n */\nconst extrudeRectangular = (options, ...objects) => {\n  const defaults = {\n    size: 1,\n    height: 1\n  }\n  const { size, height } = Object.assign({}, defaults, options)\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  if (size <= 0) throw new Error('size must be positive')\n  if (height <= 0) throw new Error('height must be positive')\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return extrudeRectangularPath2(options, object)\n    if (geom2.isA(object)) return extrudeRectangularGeom2(options, object)\n    // if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = extrudeRectangular\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangular.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularGeom2.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularGeom2.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { area } = __webpack_require__(/*! ../../maths/utils */ \"./node_modules/@jscad/modeling/src/maths/utils/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst expand = __webpack_require__(/*! ../expansions/expand */ \"./node_modules/@jscad/modeling/src/operations/expansions/expand.js\")\n\nconst extrudeLinearGeom2 = __webpack_require__(/*! ./extrudeLinearGeom2 */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js\")\n\n/*\n * Expand and extrude the given geometry (geom2).\n * @see expand for additional options\n * @param {Object} options - options for extrusion, if any\n * @param {Number} [options.size=1] - size of the rectangle\n * @param {Number} [options.height=1] - height of the extrusion\n * @param {geom2} geometry - the geometry to extrude\n * @return {geom3} the extruded geometry\n */\nconst extrudeRectangularGeom2 = (options, geometry) => {\n  const defaults = {\n    size: 1,\n    height: 1\n  }\n  const { size, height } = Object.assign({ }, defaults, options)\n\n  options.delta = size\n  options.offset = [0, 0, height]\n\n  // convert the geometry to outlines\n  const outlines = geom2.toOutlines(geometry)\n  if (outlines.length === 0) throw new Error('the given geometry cannot be empty')\n\n  // expand the outlines\n  const newparts = outlines.map((outline) => {\n    if (area(outline) < 0) outline.reverse() // all outlines must wind counter clockwise\n    return expand(options, path2.fromPoints({ closed: true }, outline))\n  })\n\n  // create a composite geometry\n  const allsides = newparts.reduce((sides, part) => sides.concat(geom2.toSides(part)), [])\n  const newgeometry = geom2.create(allsides)\n\n  return extrudeLinearGeom2(options, newgeometry)\n}\n\nmodule.exports = extrudeRectangularGeom2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularPath2.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularPath2.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst expand = __webpack_require__(/*! ../expansions/expand */ \"./node_modules/@jscad/modeling/src/operations/expansions/expand.js\")\n\nconst extrudeLinearGeom2 = __webpack_require__(/*! ./extrudeLinearGeom2 */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinearGeom2.js\")\n\n/*\n * Expand and extrude the given geometry (path2).\n * @See expand for addition options\n * @param {Object} options - options for extrusion, if any\n * @param {Number} [options.size=1] - size of the rectangle\n * @param {Number} [options.height=1] - height of the extrusion\n * @param {path2} geometry - the geometry to extrude\n * @return {geom3} the extruded geometry\n */\nconst extrudeRectangularPath2 = (options, geometry) => {\n  const defaults = {\n    size: 1,\n    height: 1\n  }\n  const { size, height } = Object.assign({ }, defaults, options)\n\n  options.delta = size\n  options.offset = [0, 0, height]\n\n  const points = path2.toPoints(geometry)\n  if (points.length === 0) throw new Error('the given geometry cannot be empty')\n\n  const newgeometry = expand(options, geometry)\n  return extrudeLinearGeom2(options, newgeometry)\n}\n\nmodule.exports = extrudeRectangularPath2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangularPath2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRotate.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRotate.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst slice = __webpack_require__(/*! ./slice */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js\")\n\nconst extrudeFromSlices = __webpack_require__(/*! ./extrudeFromSlices */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js\")\n\n/**\n * Rotate extrude the given geometry using the given options.\n *\n * @param {Object} options - options for extrusion\n * @param {Float} [options.angle=PI*2] - angle of the extrusion (RADIANS)\n * @param {Float} [options.startAngle=0] - start angle of the extrusion (RADIANS)\n * @param {Float} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :\n * defaults to capping those points to 0 (only supported behaviour for now)\n * @param {Integer} [options.segments=12] - number of segments of the extrusion\n * @param {geom2} geometry - the geometry to extrude\n * @returns {geom3} the extruded geometry\n * @alias module:modeling/extrusions.extrudeRotate\n */\nconst extrudeRotate = (options, geometry) => {\n  const defaults = {\n    segments: 12,\n    startAngle: 0,\n    angle: (Math.PI * 2),\n    overflow: 'cap'\n  }\n  let { segments, startAngle, angle, overflow } = Object.assign({}, defaults, options)\n\n  if (segments < 3) throw new Error('segments must be greater then 3')\n\n  startAngle = Math.abs(startAngle) > (Math.PI * 2) ? startAngle % (Math.PI * 2) : startAngle\n  angle = Math.abs(angle) > (Math.PI * 2) ? angle % (Math.PI * 2) : angle\n\n  let endAngle = startAngle + angle\n  endAngle = Math.abs(endAngle) > (Math.PI * 2) ? endAngle % (Math.PI * 2) : endAngle\n\n  if (endAngle < startAngle) {\n    const x = startAngle\n    startAngle = endAngle\n    endAngle = x\n  }\n  let totalRotation = endAngle - startAngle\n  if (totalRotation <= 0.0) totalRotation = (Math.PI * 2)\n\n  if (Math.abs(totalRotation) < (Math.PI * 2)) {\n    // adjust the segments to achieve the total rotation requested\n    const anglePerSegment = (Math.PI * 2) / segments\n    segments = Math.floor(Math.abs(totalRotation) / anglePerSegment)\n    if (Math.abs(totalRotation) > (segments * anglePerSegment)) segments++\n  }\n\n  // console.log('startAngle: '+startAngle)\n  // console.log('endAngle: '+endAngle)\n  // console.log(totalRotation)\n  // console.log(segments)\n\n  // convert geometry to an array of sides, easier to deal with\n  let shapeSides = geom2.toSides(geometry)\n  if (shapeSides.length === 0) throw new Error('the given geometry cannot be empty')\n\n  // determine if the rotate extrude can be computed in the first place\n  // ie all the points have to be either x > 0 or x < 0\n\n  // generic solution to always have a valid solid, even if points go beyond x/ -x\n  // 1. split points up between all those on the 'left' side of the axis (x<0) & those on the 'righ' (x>0)\n  // 2. for each set of points do the extrusion operation IN OPOSITE DIRECTIONS\n  // 3. union the two resulting solids\n\n  // 1. alt : OR : just cap of points at the axis ?\n\n  const pointsWithNegativeX = shapeSides.filter((s) => (s[0][0] < 0))\n  const pointsWithPositiveX = shapeSides.filter((s) => (s[0][0] >= 0))\n  const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0\n\n  // FIXME actually there are cases where setting X=0 will change the basic shape\n  // - Alternative #1 : don't allow shapes with both negative and positive X values\n  // - Alternative #2 : remove one half of the shape (costly)\n  if (arePointsWithNegAndPosX && overflow === 'cap') {\n    if (pointsWithNegativeX.length > pointsWithPositiveX.length) {\n      shapeSides = shapeSides.map((side) => {\n        let point0 = side[0]\n        let point1 = side[1]\n        point0 = [Math.min(point0[0], 0), point0[1]]\n        point1 = [Math.min(point1[0], 0), point1[1]]\n        return [point0, point1]\n      })\n    } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {\n      shapeSides = shapeSides.map((side) => {\n        let point0 = side[0]\n        let point1 = side[1]\n        point0 = [Math.max(point0[0], 0), point0[1]]\n        point1 = [Math.max(point1[0], 0), point1[1]]\n        return [point0, point1]\n      })\n    }\n    // recreate the geometry from the capped points\n    geometry = geom2.create(shapeSides)\n  }\n\n  const rotationPerSlice = totalRotation / segments\n  const isCapped = Math.abs(totalRotation) < (Math.PI * 2)\n  const baseSlice = slice.fromSides(geom2.toSides(geometry))\n  slice.reverse(baseSlice, baseSlice)\n\n  const createSlice = (progress, index, base) => {\n    const Zrotation = rotationPerSlice * index + startAngle\n    const matrix = mat4.multiply(mat4.fromZRotation(Zrotation), mat4.fromXRotation(Math.PI / 2))\n\n    return slice.transform(matrix, base)\n  }\n\n  options = {\n    numberOfSlices: segments + 1,\n    isCapped: isCapped,\n    callback: createSlice\n  }\n  return extrudeFromSlices(options, baseSlice)\n}\n\nmodule.exports = extrudeRotate\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRotate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/extrudeWalls.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/extrudeWalls.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst slice = __webpack_require__(/*! ./slice */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js\")\n\n// https://en.wikipedia.org/wiki/Greatest_common_divisor#Using_Euclid's_algorithm\nconst gcd = (a, b) => {\n  if (a === b) { return a }\n  if (a < b) { return gcd(b, a) }\n  if (b === 1) { return 1 }\n  if (b === 0) { return a }\n  return gcd(b, a % b)\n}\n\nconst lcm = (a, b) => (a * b) / gcd(a, b)\n\n// Return a set of edges that encloses the same area by splitting\n// the given edges to have newlength total edges.\nconst repartitionEdges = (newlength, edges) => {\n  // NOTE: This implementation splits each edge evenly.\n  const multiple = newlength / edges.length\n  if (multiple === 1) {\n    return edges\n  }\n\n  const divisor = vec3.fromValues(multiple, multiple, multiple)\n\n  const newEdges = []\n  edges.forEach((edge) => {\n    const increment = vec3.divide(vec3.subtract(edge[1], edge[0]), divisor)\n\n    // repartition the edge\n    let prev = edge[0]\n    for (let i = 1; i <= multiple; ++i) {\n      const next = vec3.add(prev, increment)\n      newEdges.push([prev, next])\n      prev = next\n    }\n  })\n  return newEdges\n}\n\nconst extrudeWalls = (slice0, slice1) => {\n  let edges0 = slice.toEdges(slice0)\n  let edges1 = slice.toEdges(slice1)\n\n  if (edges0.length !== edges1.length) {\n    // different shapes, so adjust one or both to the same number of edges\n    const newlength = lcm(edges0.length, edges1.length)\n    if (newlength !== edges0.length) edges0 = repartitionEdges(newlength, edges0)\n    if (newlength !== edges1.length) edges1 = repartitionEdges(newlength, edges1)\n  }\n\n  const walls = []\n  edges0.forEach((edge0, i) => {\n    const edge1 = edges1[i]\n\n    const poly0 = poly3.fromPoints([edge0[0], edge0[1], edge1[1]])\n    const poly1 = poly3.fromPoints([edge0[0], edge1[1], edge1[0]])\n\n    walls.push(poly0, poly1)\n  })\n  return walls\n}\n\nmodule.exports = extrudeWalls\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/extrudeWalls.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All 2D shapes (primitives or the results of operations) can be extruded in various ways.\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/extrusions\n * @example\n * const { extrudeLinear, extrudeRectangular, extrudeRotate } = require('@jscad/modeling').extrusions\n */\nmodule.exports = {\n  extrudeFromSlices: __webpack_require__(/*! ./extrudeFromSlices */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeFromSlices.js\"),\n  extrudeLinear: __webpack_require__(/*! ./extrudeLinear */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeLinear.js\"),\n  extrudeRectangular: __webpack_require__(/*! ./extrudeRectangular */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRectangular.js\"),\n  extrudeRotate: __webpack_require__(/*! ./extrudeRotate */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRotate.js\"),\n  slice: __webpack_require__(/*! ./slice */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/calculatePlane.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/calculatePlane.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const plane = __webpack_require__(/*! ../../../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\nconst vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Calculate the plane of the given slice.\n * NOTE: The slice (and all points) are assumed to be planar from the beginning.\n * @param {slice} slice - the slice\n * @returns {plane} the plane of the slice\n * @alias module:modeling/extrusions/slice.calculatePlane\n *\n * @example\n * let myplane = calculatePlane(slice)\n */\nconst calculatePlane = (slice) => {\n  const edges = slice.edges\n  if (edges.length < 3) throw new Error('slices must have 3 or more edges to calculate a plane')\n\n  // find the midpoint of the slice, which will lie on the plane by definition\n  const midpoint = edges.reduce((point, edge) => vec3.add(point, edge[0]), vec3.create())\n  vec3.scale(midpoint, 1 / edges.length, midpoint)\n\n  // find the farthest edge from the midpoint, which will be on an outside edge\n  let farthestEdge = [[NaN, NaN, NaN], [NaN, NaN, NaN]]\n  let distance = 0\n  edges.forEach((edge) => {\n    const d = vec3.squaredDistance(midpoint, edge[0])\n    if (d > distance) {\n      farthestEdge = edge\n      distance = d\n    }\n  })\n\n  return plane.fromPoints(midpoint, farthestEdge[0], farthestEdge[1])\n}\n\nmodule.exports = calculatePlane\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/calculatePlane.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/clone.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/clone.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\")\n\nconst vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Create a deep clone of the given slice.\n *\n * @param {slice} [out] - receiving slice\n * @param {slice} slice - slice to clone\n * @returns {slice} a new slice\n * @alias module:modeling/extrusions/slice.clone\n */\nconst clone = (...params) => {\n  let out\n  let slice\n  if (params.length === 1) {\n    out = create()\n    slice = params[0]\n  } else {\n    out = params[0]\n    slice = params[1]\n  }\n  // deep clone of edges\n  out.edges = slice.edges.map((edge) => [vec3.clone(edge[0]), vec3.clone(edge[1])])\n  return out\n}\n\nmodule.exports = clone\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/clone.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Represents a 3D geometry consisting of a list of edges.\n * @typedef {Object} slice\n * @property {Array} edges - list of edges, each edge containing two points (3D)\n */\n\n/**\n * Creates a new empty slice.\n *\n * @returns {slice} a new slice\n * @alias module:modeling/extrusions/slice.create\n */\nconst create = (edges) => {\n  if (!edges) {\n    edges = []\n  }\n  return { edges }\n}\n\nmodule.exports = create\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/equals.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/equals.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\n/**\n * Determine if the given slices are equal.\n * @param {slice} a - the first slice to compare\n * @param {slice} b - the second slice to compare\n * @returns {Boolean}\n * @alias module:modeling/extrusions/slice.equals\n */\nconst equals = (a, b) => {\n  const aedges = a.edges\n  const bedges = b.edges\n\n  if (aedges.length !== bedges.length) {\n    return false\n  }\n\n  const isEqual = aedges.reduce((acc, aedge, i) => {\n    const bedge = bedges[i]\n    const d = vec3.squaredDistance(aedge[0], bedge[0])\n    return acc && (d < Number.EPSILON)\n  }, true)\n\n  return isEqual\n}\n\nmodule.exports = equals\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/equals.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromPoints.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromPoints.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\")\n\n/**\n * Create a slice from the given points.\n *\n * @param {Array} points - list of points, where each point is either 2D or 3D\n * @returns {slice} a new slice\n * @alias module:modeling/extrusions/slice.fromPoints\n *\n * @example\n * const points = [\n *   [0,  0],\n *   [0, 10],\n *   [0, 10]\n * ]\n * const slice = fromPoints(points)\n */\nconst fromPoints = (points) => {\n  if (!Array.isArray(points)) throw new Error('the given points must be an array')\n  if (points.length < 3) throw new Error('the given points must contain THREE or more points')\n\n  // create a list of edges from the points\n  const edges = []\n  let prevpoint = points[points.length - 1]\n  points.forEach((point) => {\n    if (point.length === 2) edges.push([vec3.fromVec2(prevpoint), vec3.fromVec2(point)])\n    if (point.length === 3) edges.push([prevpoint, point])\n    prevpoint = point\n  })\n  return create(edges)\n}\n\nmodule.exports = fromPoints\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromPoints.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromSides.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromSides.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\")\n\n/**\n * Create a slice from the given sides (see geom2).\n *\n * @param {Array} sides - list of sides from geom2\n * @returns {slice} a new slice\n * @alias module:modeling/extrusions/slice.fromSides\n *\n * @example\n * const myshape = circle({radius: 10})\n * const slice = fromSides(geom2.toSides(myshape))\n */\nconst fromSides = (sides) => {\n  if (!Array.isArray(sides)) throw new Error('the given sides must be an array')\n\n  // create a list of edges from the sides\n  const edges = []\n  sides.forEach((side) => {\n    edges.push([vec3.fromVec2(side[0]), vec3.fromVec2(side[1])])\n  })\n  return create(edges)\n}\n\nmodule.exports = fromSides\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromSides.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * @module modeling/extrusions/slice\n */\nmodule.exports = {\n  calculatePlane: __webpack_require__(/*! ./calculatePlane */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/calculatePlane.js\"),\n  clone: __webpack_require__(/*! ./clone */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/clone.js\"),\n  create: __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\"),\n  equals: __webpack_require__(/*! ./equals */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/equals.js\"),\n  fromPoints: __webpack_require__(/*! ./fromPoints */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromPoints.js\"),\n  fromSides: __webpack_require__(/*! ./fromSides */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/fromSides.js\"),\n  isA: __webpack_require__(/*! ./isA */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/isA.js\"),\n  reverse: __webpack_require__(/*! ./reverse */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/reverse.js\"),\n  toEdges: __webpack_require__(/*! ./toEdges */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/toEdges.js\"),\n  toPolygons: __webpack_require__(/*! ./toPolygons */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/toPolygons.js\"),\n  toString: __webpack_require__(/*! ./toString */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/toString.js\"),\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/transform.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/isA.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/isA.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Determin if the given object is a slice.\n * @param {slice} object - the object to interogate\n * @returns {Boolean} true if the object matches a slice\n * @alias module:modeling/extrusions/slice.isA\n */\nconst isA = (object) => {\n  if (object && typeof object === 'object') {\n    if ('edges' in object) {\n      if (Array.isArray(object.edges)) {\n        return true\n      }\n    }\n  }\n  return false\n}\n\nmodule.exports = isA\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/isA.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/reverse.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/reverse.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\")\n\n/**\n * Reverse the edges of the given slice.\n *\n * @param {slice} [out] - receiving slice\n * @param {slice} slice - slice to reverse\n * @returns {slice} reverse of the slice\n * @alias module:modeling/extrusions/slice.reverse\n */\nconst reverse = (...params) => {\n  let out\n  let slice\n  if (params.length === 1) {\n    out = create()\n    slice = params[0]\n  } else {\n    out = params[0]\n    slice = params[1]\n  }\n  // reverse the edges\n  out.edges = slice.edges.map((edge) => [edge[1], edge[0]])\n  return out\n}\n\nmodule.exports = reverse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/reverse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/toEdges.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/toEdges.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Produces an array of edges from the given slice.\n * The returned array should not be modified as the data is shared with the slice.\n * @param {slice} slice - the slice\n * @returns {Array} an array of edges, each edge contains an array of two points (3D)\n * @alias module:modeling/extrusions/slice.toEdges\n *\n * @example\n * let sharededges = toEdges(slice)\n */\nconst toEdges = (slice) => slice.edges\n\nmodule.exports = toEdges\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/toEdges.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/toPolygons.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/toPolygons.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst intersectGeom3Sub = __webpack_require__(/*! ../../booleans/intersectGeom3Sub */ \"./node_modules/@jscad/modeling/src/operations/booleans/intersectGeom3Sub.js\")\n\nconst calculatePlane = __webpack_require__(/*! ./calculatePlane */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/calculatePlane.js\")\n\nconst toPolygon3D = (vector, edge) => {\n  const points = [\n    vec3.subtract(edge[0], vector),\n    vec3.subtract(edge[1], vector),\n    vec3.add(edge[1], vector),\n    vec3.add(edge[0], vector)\n  ]\n  return poly3.fromPoints(points)\n}\n\n/**\n * Return a list of polygons which are enclosed by the slice.\n * @param {slice} slice - the slice\n * @return {Array} a list of polygons (3D)\n * @alias module:modeling/extrusions/slice.toPolygons\n */\nconst toPolygons = (slice) => {\n  const splane = calculatePlane(slice)\n\n  // find the midpoint of the slice, which will lie on the plane by definition\n  const edges = slice.edges\n  const midpoint = edges.reduce((point, edge) => vec3.add(point, edge[0]), vec3.create())\n  vec3.scale(midpoint, 1 / edges.length, midpoint)\n\n  // find the farthest edge from the midpoint, which will be on an outside edge\n  let farthestEdge = [[NaN, NaN, NaN], [NaN, NaN, NaN]]\n  let distance = 0\n  edges.forEach((edge) => {\n    const d = vec3.squaredDistance(midpoint, edge[0])\n    if (d > distance) {\n      farthestEdge = edge\n      distance = d\n    }\n  })\n\n  // create one LARGE polygon to encompass the side, i.e. base\n  const direction = vec3.subtract(farthestEdge[0], midpoint)\n  const perpendicular = vec3.cross(splane, direction)\n\n  const p1 = vec3.add(midpoint, direction)\n  vec3.add(p1, p1, direction)\n  const p2 = vec3.add(midpoint, perpendicular)\n  vec3.add(p2, p2, perpendicular)\n  const p3 = vec3.subtract(midpoint, direction)\n  vec3.subtract(p3, p3, direction)\n  const p4 = vec3.subtract(midpoint, perpendicular)\n  vec3.subtract(p4, p4, perpendicular)\n  const poly1 = poly3.fromPoints([p1, p2, p3, p4])\n  const base = geom3.create([poly1])\n\n  const wallPolygons = edges.map((edge) => toPolygon3D(splane, edge))\n  const walls = geom3.create(wallPolygons)\n\n  // make an insection of the base and the walls, creating... a set of polygons!\n  const geometry3 = intersectGeom3Sub(base, walls)\n\n  // return only those polygons from the base\n  let polygons = geom3.toPolygons(geometry3)\n  polygons = polygons.filter((polygon) => {\n    const a = vec3.angle(splane, poly3.plane(polygon))\n    // walls should be PI / 2 radians rotated from the base\n    return Math.abs(a) < (Math.PI / 90)\n  })\n  return polygons\n}\n\nmodule.exports = toPolygons\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/toPolygons.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/toString.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/toString.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst edgesToString = (edges) =>\n  edges.reduce((result, edge) => (\n    result += `[${vec3.toString(edge[0])}, ${vec3.toString(edge[1])}], `\n  ), '')\n\n/**\n * @param {slice} slice - the slice\n * @return {String} the string representation\n * @alias module:modeling/extrusions/slice.toString\n */\nconst toString = (slice) => `[${edgesToString(slice.edges)}]`\n\nmodule.exports = toString\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/toString.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/extrusions/slice/transform.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/extrusions/slice/transform.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../../../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst create = __webpack_require__(/*! ./create */ \"./node_modules/@jscad/modeling/src/operations/extrusions/slice/create.js\")\n\n/**\n * Transform the given slice using the given matrix.\n * @param {mat4} matrix - transform matrix\n * @param {slice} slice - slice to transform\n * @returns {slice} the transformed slice\n * @alias module:modeling/extrusions/slice.transform\n */\nconst transform = (matrix, slice) => {\n  const edges = slice.edges.map((edge) => [vec3.transform(matrix, edge[0]), vec3.transform(matrix, edge[1])])\n  return create(edges)\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/extrusions/slice/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hull.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hull.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\nconst areAllShapesTheSameType = __webpack_require__(/*! ../../utils/areAllShapesTheSameType */ \"./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst hullPath2 = __webpack_require__(/*! ./hullPath2 */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullPath2.js\")\nconst hullGeom2 = __webpack_require__(/*! ./hullGeom2 */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullGeom2.js\")\nconst hullGeom3 = __webpack_require__(/*! ./hullGeom3 */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullGeom3.js\")\n\n/**\n * Create a convex hull of the given geometries.\n * The given geometries should be of the same type, either geom2 or geom3 or path2.\n * @param {...Objects} geometries - list of geometries from which to create a hull\n * @returns {geom2|geom3} new geometry\n * @alias module:modeling/hulls.hull\n *\n * @example\n * let myshape = hull(rectangle({center: [-5,-5]}), ellipse({center: [5,5]}))\n *\n * @example\n * +-------+           +-------+\n * |       |           |        \\\n * |   A   |           |         \\\n * |       |           |          \\\n * +-------+           +           \\\n *                  =   \\           \\\n *       +-------+       \\           +\n *       |       |        \\          |\n *       |   B   |         \\         |\n *       |       |          \\        |\n *       +-------+           +-------+\n */\nconst hull = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n\n  if (!areAllShapesTheSameType(geometries)) {\n    throw new Error('only hulls of the same type are supported')\n  }\n\n  const geometry = geometries[0]\n  if (path2.isA(geometry)) return hullPath2(geometries)\n  if (geom2.isA(geometry)) return hullGeom2(geometries)\n  if (geom3.isA(geometry)) return hullGeom3(geometries)\n\n  // FIXME should this throw an error for unknown geometries?\n  return geometry\n}\n\nmodule.exports = hull\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hull.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hullChain.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hullChain.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst union = __webpack_require__(/*! ../booleans/union */ \"./node_modules/@jscad/modeling/src/operations/booleans/union.js\")\n\nconst hull = __webpack_require__(/*! ./hull */ \"./node_modules/@jscad/modeling/src/operations/hulls/hull.js\")\n\n/**\n * Create a chain of hulled geometries from the given gemetries.\n * Essentially hull A+B, B+C, C+D, etc., then union the results.\n * The given geometries should be of the same type, either geom2 or geom3 or path2.\n *\n * @param {...Objects} geometries - list of geometries from which to create hulls\n * @returns {geom2|geom3} new geometry\n * @alias module:modeling/hulls.hullChain\n *\n * @example\n * let newshape = hullChain(rectangle({center: [-5,-5]}), circle({center: [0,0]}), rectangle({center: [5,5]}))\n *\n * @example\n * +-------+   +-------+     +-------+   +------+\n * |       |   |       |     |        \\ /       |\n * |   A   |   |   C   |     |         |        |\n * |       |   |       |     |                  |\n * +-------+   +-------+     +                  +\n *                       =   \\                 /\n *       +-------+            \\               /\n *       |       |             \\             /\n *       |   B   |              \\           /\n *       |       |               \\         /\n *       +-------+                +-------+\n */\nconst hullChain = (...geometries) => {\n  geometries = flatten(geometries)\n  if (geometries.length < 2) throw new Error('wrong number of arguments')\n\n  const hulls = []\n  for (let i = 1; i < geometries.length; i++) {\n    hulls.push(hull(geometries[i - 1], geometries[i]))\n  }\n  return union(hulls)\n}\n\nmodule.exports = hullChain\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hullChain.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hullGeom2.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hullGeom2.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\nconst hullPoints2 = __webpack_require__(/*! ./hullPoints2 */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullPoints2.js\")\n\n/*\n * Create a convex hull of the given geom2 geometries.\n * @param {...geometries} geometries - list of geom2 geometries\n * @returns {geom2} new geometry\n */\nconst hullGeom2 = (...geometries) => {\n  geometries = flatten(geometries)\n\n  // extract the unique points from the geometries\n  const uniquepoints = []\n  const found = new Map()\n  for (let g = 0; g < geometries.length; g++) {\n    const sides = geom2.toSides(geometries[g])\n    for (let s = 0; s < sides.length; s++) {\n      const side = sides[s]\n      const point = side[0]\n      const id = `${point[0]},${point[1]}`\n      if (found.has(id)) continue\n      uniquepoints.push(point)\n      found.set(id, true)\n    }\n  }\n  found.clear()\n\n  const hullpoints = hullPoints2(uniquepoints)\n\n  // NOTE: more then three points are required to create a new geometry\n  if (hullpoints.length < 3) return geom2.create()\n\n  // assemble a new geometry from the list of points\n  return geom2.fromPoints(hullpoints)\n}\n\nmodule.exports = hullGeom2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hullGeom2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hullGeom3.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hullGeom3.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst quickhull = __webpack_require__(/*! ./quickhull */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/index.js\")\n\n/*\n * Create a convex hull of the given geometries (geom3).\n * @param {...geometries} geometries - list of geom3 geometries\n * @returns {geom3} new geometry\n */\nconst hullGeom3 = (...geometries) => {\n  geometries = flatten(geometries)\n\n  if (geometries.length === 1) return geometries[0]\n\n  // extract the unique vertices from the geometries\n  const uniquevertices = []\n  const found = new Map()\n  for (let g = 0; g < geometries.length; ++g) {\n    const polygons = geom3.toPolygons(geometries[g])\n    for (let p = 0; p < polygons.length; ++p) {\n      const vertices = polygons[p].vertices\n      for (let v = 0; v < vertices.length; ++v) {\n        const id = `${vertices[v]}`\n        if (found.has(id)) continue\n        uniquevertices.push(vertices[v])\n        found.set(id, true)\n      }\n    }\n  }\n  found.clear()\n\n  const faces = quickhull(uniquevertices, { skipTriangulation: true })\n\n  const polygons = faces.map((face) => {\n    const vertices = face.map((index) => uniquevertices[index])\n    return poly3.create(vertices)\n  })\n\n  return geom3.create(polygons)\n}\n\nmodule.exports = hullGeom3\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hullGeom3.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hullPath2.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hullPath2.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst hullPoints2 = __webpack_require__(/*! ./hullPoints2 */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullPoints2.js\")\n\n/*\n * Create a convex hull of the given geometries (path2).\n * @param {...geometries} geometries - list of path2 geometries\n * @returns {path2} new geometry\n */\nconst hullPath2 = (...geometries) => {\n  geometries = flatten(geometries)\n\n  // extract the unique points from the geometries\n  const uniquepoints = []\n  geometries.forEach((geometry) => {\n    const points = path2.toPoints(geometry)\n    points.forEach((point) => {\n      const index = uniquepoints.findIndex((unique) => vec2.equals(unique, point))\n      if (index < 0) uniquepoints.push(point)\n    })\n  })\n\n  const hullpoints = hullPoints2(uniquepoints)\n\n  // assemble a new geometry from the list of points\n  return path2.fromPoints({ closed: true }, hullpoints)\n}\n\nmodule.exports = hullPath2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hullPath2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/hullPoints2.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/hullPoints2.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst angleBetweenPoints = (p0, p1) => Math.atan2((p1[1] - p0[1]), (p1[0] - p0[0]))\n\nconst compareIndex = (index1, index2) => {\n  if (index1.angle < index2.angle) {\n    return -1\n  } else if (index1.angle > index2.angle) {\n    return 1\n  } else {\n    if (index1.distance < index2.distance) {\n      return -1\n    } else if (index1.distance > index2.distance) {\n      return 1\n    }\n  }\n  return 0\n}\n\n// Ported from https://github.com/bkiers/GrahamScan\nconst compute = (points) => {\n  if (points.length < 3) {\n    return points\n  }\n\n  // Find the lowest point\n  let min = 0\n  points.forEach((point, i) => {\n    const minpoint = points[min]\n    if (point[1] === minpoint[1]) {\n      if (point[0] < minpoint[0]) {\n        min = i\n      }\n    } else if (point[1] < minpoint[1]) {\n      min = i\n    }\n  })\n\n  // Calculate angles and distances from the lowest point\n  const al = []\n  let angle = 0.0\n  let dist = 0.0\n  for (let i = 0; i < points.length; i++) {\n    if (i === min) {\n      continue\n    }\n    angle = angleBetweenPoints(points[min], points[i])\n    if (angle < 0) {\n      angle += Math.PI\n    }\n    dist = vec2.squaredDistance(points[min], points[i])\n    al.push({ index: i, angle: angle, distance: dist })\n  }\n\n  al.sort((a, b) => compareIndex(a, b))\n\n  // Wind around the points CCW, removing interior points\n  const stack = new Array(points.length + 1)\n  let j = 2\n  for (let i = 0; i < points.length; i++) {\n    if (i === min) {\n      continue\n    }\n    stack[j] = al[j - 2].index\n    j++\n  }\n  stack[0] = stack[points.length]\n  stack[1] = min\n\n  const ccw = (i1, i2, i3) => (points[i2][0] - points[i1][0]) * (points[i3][1] - points[i1][1]) - (points[i2][1] - points[i1][1]) * (points[i3][0] - points[i1][0])\n\n  let tmp\n  let M = 2\n  for (let i = 3; i <= points.length; i++) {\n    while (ccw(stack[M - 1], stack[M], stack[i]) < 1e-5) {\n      M--\n    }\n    M++\n    tmp = stack[i]\n    stack[i] = stack[M]\n    stack[M] = tmp\n  }\n\n  // Return the indices to the points\n  const indices = new Array(M)\n  for (let i = 0; i < M; i++) {\n    indices[i] = stack[i + 1]\n  }\n  return indices\n}\n\n/*\n * Create a convex hull of the given set of points,  where each point is an array of [x,y].\n * @param {Array} uniquepoints - list of UNIQUE points from which to create a hull\n * @returns {Array} a list of points that form the hull\n */\nconst hullPoints2 = (uniquepoints) => {\n  const indices = compute(uniquepoints)\n\n  let hullpoints = []\n  if (Array.isArray(indices)) {\n    hullpoints = indices.map((index) => uniquepoints[index])\n  }\n  return hullpoints\n}\n\nmodule.exports = hullPoints2\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/hullPoints2.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be passed to hull functions\n * to determine the convex hull of all points.\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/hulls\n * @example\n * const { hull, hullChain } = require('@jscad/modeling').hulls\n */\nmodule.exports = {\n  hull: __webpack_require__(/*! ./hull */ \"./node_modules/@jscad/modeling/src/operations/hulls/hull.js\"),\n  hullChain: __webpack_require__(/*! ./hullChain */ \"./node_modules/@jscad/modeling/src/operations/hulls/hullChain.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Face.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Face.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const add = __webpack_require__(/*! ../../../maths/vec3/add */ \"./node_modules/@jscad/modeling/src/maths/vec3/add.js\")\nconst clone = __webpack_require__(/*! ../../../maths/vec3/clone */ \"./node_modules/@jscad/modeling/src/maths/vec3/clone.js\")\nconst cross = __webpack_require__(/*! ../../../maths/vec3/cross */ \"./node_modules/@jscad/modeling/src/maths/vec3/cross.js\")\nconst dot = __webpack_require__(/*! ../../../maths/vec3/dot */ \"./node_modules/@jscad/modeling/src/maths/vec3/dot.js\")\nconst length = __webpack_require__(/*! ../../../maths/vec3/length */ \"./node_modules/@jscad/modeling/src/maths/vec3/length.js\")\nconst normalize = __webpack_require__(/*! ../../../maths/vec3/normalize */ \"./node_modules/@jscad/modeling/src/maths/vec3/normalize.js\")\nconst scale = __webpack_require__(/*! ../../../maths/vec3/scale */ \"./node_modules/@jscad/modeling/src/maths/vec3/scale.js\")\nconst subtract = __webpack_require__(/*! ../../../maths/vec3/subtract */ \"./node_modules/@jscad/modeling/src/maths/vec3/subtract.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nconst HalfEdge = __webpack_require__(/*! ./HalfEdge */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/HalfEdge.js\")\n\nconst VISIBLE = 0\nconst NON_CONVEX = 1\nconst DELETED = 2\n\nclass Face {\n  constructor () {\n    this.normal = []\n    this.centroid = []\n    // signed distance from face to the origin\n    this.offset = 0\n    // pointer to the a vertex in a double linked list this face can see\n    this.outside = null\n    this.mark = VISIBLE\n    this.edge = null\n    this.nVertices = 0\n  }\n\n  getEdge (i) {\n    if (typeof i !== 'number') {\n      throw Error('requires a number')\n    }\n    let it = this.edge\n    while (i > 0) {\n      it = it.next\n      i -= 1\n    }\n    while (i < 0) {\n      it = it.prev\n      i += 1\n    }\n    return it\n  }\n\n  computeNormal () {\n    const e0 = this.edge\n    const e1 = e0.next\n    let e2 = e1.next\n    const v2 = subtract([], e1.head().point, e0.head().point)\n    const t = []\n    const v1 = []\n\n    this.nVertices = 2\n    this.normal = [0, 0, 0]\n    while (e2 !== e0) {\n      clone(v1, v2)\n      subtract(v2, e2.head().point, e0.head().point)\n      add(this.normal, this.normal, cross(t, v1, v2))\n      e2 = e2.next\n      this.nVertices += 1\n    }\n    this.area = length(this.normal)\n    // normalize the vector, since we've already calculated the area\n    // it's cheaper to scale the vector using this quantity instead of\n    // doing the same operation again\n    this.normal = scale(this.normal, 1 / this.area, this.normal) // TODO review scale parameters\n  }\n\n  computeNormalMinArea (minArea) {\n    this.computeNormal()\n    if (this.area < minArea) {\n      // compute the normal without the longest edge\n      let maxEdge\n      let maxSquaredLength = 0\n      let edge = this.edge\n\n      // find the longest edge (in length) in the chain of edges\n      do {\n        const lengthSquared = edge.lengthSquared()\n        if (lengthSquared > maxSquaredLength) {\n          maxEdge = edge\n          maxSquaredLength = lengthSquared\n        }\n        edge = edge.next\n      } while (edge !== this.edge)\n\n      const p1 = maxEdge.tail().point\n      const p2 = maxEdge.head().point\n      const maxVector = subtract([], p2, p1)\n      const maxLength = Math.sqrt(maxSquaredLength)\n      // maxVector is normalized after this operation\n      scale(maxVector, 1 / maxLength, maxVector) // TODO review scale parameters\n      // compute the projection of maxVector over this face normal\n      const maxProjection = dot(this.normal, maxVector)\n      // subtract the quantity maxEdge adds on the normal\n      scale(maxVector, -maxProjection, maxVector) // TODO review scale parameters\n      add(this.normal, this.normal, maxVector)\n      // renormalize `this.normal`\n      normalize(this.normal, this.normal)\n    }\n  }\n\n  computeCentroid () {\n    this.centroid = [0, 0, 0]\n    let edge = this.edge\n    do {\n      add(this.centroid, this.centroid, edge.head().point)\n      edge = edge.next\n    } while (edge !== this.edge)\n    scale(this.centroid, 1 / this.nVertices, this.centroid)\n  }\n\n  computeNormalAndCentroid (minArea) {\n    if (typeof minArea !== 'undefined') {\n      this.computeNormalMinArea(minArea)\n    } else {\n      this.computeNormal()\n    }\n    this.computeCentroid()\n    this.offset = dot(this.normal, this.centroid)\n  }\n\n  distanceToPlane (point) {\n    return dot(this.normal, point) - this.offset\n  }\n\n  /**\n   * @private\n   *\n   * Connects two edges assuming that prev.head().point === next.tail().point\n   *\n   * @param {HalfEdge} prev\n   * @param {HalfEdge} next\n   */\n  connectHalfEdges (prev, next) {\n    let discardedFace\n    if (prev.opposite.face === next.opposite.face) {\n      // `prev` is remove a redundant edge\n      const oppositeFace = next.opposite.face\n      let oppositeEdge\n      if (prev === this.edge) {\n        this.edge = next\n      }\n      if (oppositeFace.nVertices === 3) {\n        // case:\n        // remove the face on the right\n        //\n        //       /|\\\n        //      / | \\ the face on the right\n        //     /  |  \\ --> opposite edge\n        //    / a |   \\\n        //   *----*----*\n        //  /     b  |  \\\n        //           ▾\n        //      redundant edge\n        //\n        // Note: the opposite edge is actually in the face to the right\n        // of the face to be destroyed\n        oppositeEdge = next.opposite.prev.opposite\n        oppositeFace.mark = DELETED\n        discardedFace = oppositeFace\n      } else {\n        // case:\n        //          t\n        //        *----\n        //       /| <- right face's redundant edge\n        //      / | opposite edge\n        //     /  |  ▴   /\n        //    / a |  |  /\n        //   *----*----*\n        //  /     b  |  \\\n        //           ▾\n        //      redundant edge\n        oppositeEdge = next.opposite.next\n        // make sure that the link `oppositeFace.edge` points correctly even\n        // after the right face redundant edge is removed\n        if (oppositeFace.edge === oppositeEdge.prev) {\n          oppositeFace.edge = oppositeEdge\n        }\n\n        //       /|   /\n        //      / | t/opposite edge\n        //     /  | / ▴  /\n        //    / a |/  | /\n        //   *----*----*\n        //  /     b     \\\n        oppositeEdge.prev = oppositeEdge.prev.prev\n        oppositeEdge.prev.next = oppositeEdge\n      }\n      //       /|\n      //      / |\n      //     /  |\n      //    / a |\n      //   *----*----*\n      //  /     b  ▴  \\\n      //           |\n      //     redundant edge\n      next.prev = prev.prev\n      next.prev.next = next\n\n      //       / \\  \\\n      //      /   \\->\\\n      //     /     \\<-\\ opposite edge\n      //    / a     \\  \\\n      //   *----*----*\n      //  /     b  ^  \\\n      next.setOpposite(oppositeEdge)\n\n      oppositeFace.computeNormalAndCentroid()\n    } else {\n      // trivial case\n      //        *\n      //       /|\\\n      //      / | \\\n      //     /  |--> next\n      //    / a |   \\\n      //   *----*----*\n      //    \\ b |   /\n      //     \\  |--> prev\n      //      \\ | /\n      //       \\|/\n      //        *\n      prev.next = next\n      next.prev = prev\n    }\n    return discardedFace\n  }\n\n  mergeAdjacentFaces (adjacentEdge, discardedFaces) {\n    const oppositeEdge = adjacentEdge.opposite\n    const oppositeFace = oppositeEdge.face\n\n    discardedFaces.push(oppositeFace)\n    oppositeFace.mark = DELETED\n\n    // find the chain of edges whose opposite face is `oppositeFace`\n    //\n    //                ===>\n    //      \\         face         /\n    //       * ---- * ---- * ---- *\n    //      /     opposite face    \\\n    //                <===\n    //\n    let adjacentEdgePrev = adjacentEdge.prev\n    let adjacentEdgeNext = adjacentEdge.next\n    let oppositeEdgePrev = oppositeEdge.prev\n    let oppositeEdgeNext = oppositeEdge.next\n\n    // left edge\n    while (adjacentEdgePrev.opposite.face === oppositeFace) {\n      adjacentEdgePrev = adjacentEdgePrev.prev\n      oppositeEdgeNext = oppositeEdgeNext.next\n    }\n    // right edge\n    while (adjacentEdgeNext.opposite.face === oppositeFace) {\n      adjacentEdgeNext = adjacentEdgeNext.next\n      oppositeEdgePrev = oppositeEdgePrev.prev\n    }\n    // adjacentEdgePrev  \\         face         / adjacentEdgeNext\n    //                    * ---- * ---- * ---- *\n    // oppositeEdgeNext  /     opposite face    \\ oppositeEdgePrev\n\n    // fix the face reference of all the opposite edges that are not part of\n    // the edges whose opposite face is not `face` i.e. all the edges that\n    // `face` and `oppositeFace` do not have in common\n    let edge\n    for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {\n      edge.face = this\n    }\n\n    // make sure that `face.edge` is not one of the edges to be destroyed\n    // Note: it's important for it to be a `next` edge since `prev` edges\n    // might be destroyed on `connectHalfEdges`\n    this.edge = adjacentEdgeNext\n\n    // connect the extremes\n    // Note: it might be possible that after connecting the edges a triangular\n    // face might be redundant\n    let discardedFace\n    discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext)\n    if (discardedFace) {\n      discardedFaces.push(discardedFace)\n    }\n    discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext)\n    if (discardedFace) {\n      discardedFaces.push(discardedFace)\n    }\n\n    this.computeNormalAndCentroid()\n    // TODO: additional consistency checks\n    return discardedFaces\n  }\n\n  collectIndices () {\n    const indices = []\n    let edge = this.edge\n    do {\n      indices.push(edge.head().index)\n      edge = edge.next\n    } while (edge !== this.edge)\n    return indices\n  }\n\n  static createTriangle (v0, v1, v2, minArea = 0) {\n    const face = new Face()\n    const e0 = new HalfEdge(v0, face)\n    const e1 = new HalfEdge(v1, face)\n    const e2 = new HalfEdge(v2, face)\n\n    // join edges\n    e0.next = e2.prev = e1\n    e1.next = e0.prev = e2\n    e2.next = e1.prev = e0\n\n    // main half edge reference\n    face.edge = e0\n    face.computeNormalAndCentroid(minArea)\n    return face\n  }\n}\n\nmodule.exports = {\n  VISIBLE,\n  NON_CONVEX,\n  DELETED,\n  Face\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Face.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/HalfEdge.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/HalfEdge.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const distance = __webpack_require__(/*! ../../../maths/vec3/distance */ \"./node_modules/@jscad/modeling/src/maths/vec3/distance.js\")\nconst squaredDistance = __webpack_require__(/*! ../../../maths/vec3/squaredDistance */ \"./node_modules/@jscad/modeling/src/maths/vec3/squaredDistance.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nclass HalfEdge {\n  constructor (vertex, face) {\n    this.vertex = vertex\n    this.face = face\n    this.next = null\n    this.prev = null\n    this.opposite = null\n  }\n\n  head () {\n    return this.vertex\n  }\n\n  tail () {\n    return this.prev\n      ? this.prev.vertex\n      : null\n  }\n\n  length () {\n    if (this.tail()) {\n      return distance(\n        this.tail().point,\n        this.head().point\n      )\n    }\n    return -1\n  }\n\n  lengthSquared () {\n    if (this.tail()) {\n      return squaredDistance(\n        this.tail().point,\n        this.head().point\n      )\n    }\n    return -1\n  }\n\n  setOpposite (edge) {\n    this.opposite = edge\n    edge.opposite = this\n  }\n}\n\nmodule.exports = HalfEdge\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/HalfEdge.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/QuickHull.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/QuickHull.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const dot = __webpack_require__(/*! ../../../maths/vec3/dot */ \"./node_modules/@jscad/modeling/src/maths/vec3/dot.js\")\n\nconst pointLineDistance = __webpack_require__(/*! ./point-line-distance */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/point-line-distance.js\")\nconst getPlaneNormal = __webpack_require__(/*! ./get-plane-normal */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/get-plane-normal.js\")\n\nconst VertexList = __webpack_require__(/*! ./VertexList */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/VertexList.js\")\nconst Vertex = __webpack_require__(/*! ./Vertex */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Vertex.js\")\nconst { Face, VISIBLE, NON_CONVEX, DELETED } = __webpack_require__(/*! ./Face */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Face.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\n// merge types\n// non convex with respect to the large face\nconst MERGE_NON_CONVEX_WRT_LARGER_FACE = 1\nconst MERGE_NON_CONVEX = 2\n\nclass QuickHull {\n  constructor (points) {\n    if (!Array.isArray(points)) {\n      throw TypeError('input is not a valid array')\n    }\n    if (points.length < 4) {\n      throw Error('cannot build a simplex out of <4 points')\n    }\n\n    this.tolerance = -1\n\n    // buffers\n    this.nFaces = 0\n    this.nPoints = points.length\n\n    this.faces = []\n    this.newFaces = []\n    // helpers\n    //\n    // let `a`, `b` be `Face` instances\n    // let `v` be points wrapped as instance of `Vertex`\n    //\n    //     [v, v, ..., v, v, v, ...]\n    //      ^             ^\n    //      |             |\n    //  a.outside     b.outside\n    //\n    this.claimed = new VertexList()\n    this.unclaimed = new VertexList()\n\n    // vertices of the hull(internal representation of points)\n    this.vertices = []\n    for (let i = 0; i < points.length; i += 1) {\n      this.vertices.push(new Vertex(points[i], i))\n    }\n    this.discardedFaces = []\n    this.vertexPointIndices = []\n  }\n\n  addVertexToFace (vertex, face) {\n    vertex.face = face\n    if (!face.outside) {\n      this.claimed.add(vertex)\n    } else {\n      this.claimed.insertBefore(face.outside, vertex)\n    }\n    face.outside = vertex\n  }\n\n  /**\n   * Removes `vertex` for the `claimed` list of vertices, it also makes sure\n   * that the link from `face` to the first vertex it sees in `claimed` is\n   * linked correctly after the removal\n   *\n   * @param {Vertex} vertex\n   * @param {Face} face\n   */\n  removeVertexFromFace (vertex, face) {\n    if (vertex === face.outside) {\n      // fix face.outside link\n      if (vertex.next && vertex.next.face === face) {\n        // face has at least 2 outside vertices, move the `outside` reference\n        face.outside = vertex.next\n      } else {\n        // vertex was the only outside vertex that face had\n        face.outside = null\n      }\n    }\n    this.claimed.remove(vertex)\n  }\n\n  /**\n   * Removes all the visible vertices that `face` is able to see which are\n   * stored in the `claimed` vertext list\n   *\n   * @param {Face} face\n   * @return {Vertex|undefined} If face had visible vertices returns\n   * `face.outside`, otherwise undefined\n   */\n  removeAllVerticesFromFace (face) {\n    if (face.outside) {\n      // pointer to the last vertex of this face\n      // [..., outside, ..., end, outside, ...]\n      //          |           |      |\n      //          a           a      b\n      let end = face.outside\n      while (end.next && end.next.face === face) {\n        end = end.next\n      }\n      this.claimed.removeChain(face.outside, end)\n      //                            b\n      //                       [ outside, ...]\n      //                            |  removes this link\n      //     [ outside, ..., end ] -┘\n      //          |           |\n      //          a           a\n      end.next = null\n      return face.outside\n    }\n  }\n\n  /**\n   * Removes all the visible vertices that `face` is able to see, additionally\n   * checking the following:\n   *\n   * If `absorbingFace` doesn't exist then all the removed vertices will be\n   * added to the `unclaimed` vertex list\n   *\n   * If `absorbingFace` exists then this method will assign all the vertices of\n   * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`\n   * it's added to the `unclaimed` vertex list\n   *\n   * @param {Face} face\n   * @param {Face} [absorbingFace]\n   */\n  deleteFaceVertices (face, absorbingFace) {\n    const faceVertices = this.removeAllVerticesFromFace(face)\n    if (faceVertices) {\n      if (!absorbingFace) {\n        // mark the vertices to be reassigned to some other face\n        this.unclaimed.addAll(faceVertices)\n      } else {\n        // if there's an absorbing face try to assign as many vertices\n        // as possible to it\n\n        // the reference `vertex.next` might be destroyed on\n        // `this.addVertexToFace` (see VertexList#add), nextVertex is a\n        // reference to it\n        let nextVertex\n        for (let vertex = faceVertices; vertex; vertex = nextVertex) {\n          nextVertex = vertex.next\n          const distance = absorbingFace.distanceToPlane(vertex.point)\n\n          // check if `vertex` is able to see `absorbingFace`\n          if (distance > this.tolerance) {\n            this.addVertexToFace(vertex, absorbingFace)\n          } else {\n            this.unclaimed.add(vertex)\n          }\n        }\n      }\n    }\n  }\n\n  /**\n   * Reassigns as many vertices as possible from the unclaimed list to the new\n   * faces\n   *\n   * @param {Faces[]} newFaces\n   */\n  resolveUnclaimedPoints (newFaces) {\n    // cache next vertex so that if `vertex.next` is destroyed it's still\n    // recoverable\n    let vertexNext = this.unclaimed.first()\n    for (let vertex = vertexNext; vertex; vertex = vertexNext) {\n      vertexNext = vertex.next\n      let maxDistance = this.tolerance\n      let maxFace\n      for (let i = 0; i < newFaces.length; i += 1) {\n        const face = newFaces[i]\n        if (face.mark === VISIBLE) {\n          const dist = face.distanceToPlane(vertex.point)\n          if (dist > maxDistance) {\n            maxDistance = dist\n            maxFace = face\n          }\n          if (maxDistance > 1000 * this.tolerance) {\n            break\n          }\n        }\n      }\n\n      if (maxFace) {\n        this.addVertexToFace(vertex, maxFace)\n      }\n    }\n  }\n\n  /**\n   * Computes the extremes of a tetrahedron which will be the initial hull\n   *\n   * @return {number[]} The min/max vertices in the x,y,z directions\n   */\n  computeExtremes () {\n    const min = []\n    const max = []\n\n    // min vertex on the x,y,z directions\n    const minVertices = []\n    // max vertex on the x,y,z directions\n    const maxVertices = []\n\n    let i, j\n\n    // initially assume that the first vertex is the min/max\n    for (i = 0; i < 3; i += 1) {\n      minVertices[i] = maxVertices[i] = this.vertices[0]\n    }\n    // copy the coordinates of the first vertex to min/max\n    for (i = 0; i < 3; i += 1) {\n      min[i] = max[i] = this.vertices[0].point[i]\n    }\n\n    // compute the min/max vertex on all 6 directions\n    for (i = 1; i < this.vertices.length; i += 1) {\n      const vertex = this.vertices[i]\n      const point = vertex.point\n      // update the min coordinates\n      for (j = 0; j < 3; j += 1) {\n        if (point[j] < min[j]) {\n          min[j] = point[j]\n          minVertices[j] = vertex\n        }\n      }\n      // update the max coordinates\n      for (j = 0; j < 3; j += 1) {\n        if (point[j] > max[j]) {\n          max[j] = point[j]\n          maxVertices[j] = vertex\n        }\n      }\n    }\n\n    // compute epsilon\n    this.tolerance = 3 * Number.EPSILON * (\n      Math.max(Math.abs(min[0]), Math.abs(max[0])) +\n      Math.max(Math.abs(min[1]), Math.abs(max[1])) +\n      Math.max(Math.abs(min[2]), Math.abs(max[2]))\n    )\n    return [minVertices, maxVertices]\n  }\n\n  /**\n   * Compues the initial tetrahedron assigning to its faces all the points that\n   * are candidates to form part of the hull\n   */\n  createInitialSimplex () {\n    const vertices = this.vertices\n    const [min, max] = this.computeExtremes()\n    let v2, v3\n    let i, j\n\n    // Find the two vertices with the greatest 1d separation\n    // (max.x - min.x)\n    // (max.y - min.y)\n    // (max.z - min.z)\n    let maxDistance = 0\n    let indexMax = 0\n    for (i = 0; i < 3; i += 1) {\n      const distance = max[i].point[i] - min[i].point[i]\n      if (distance > maxDistance) {\n        maxDistance = distance\n        indexMax = i\n      }\n    }\n    const v0 = min[indexMax]\n    const v1 = max[indexMax]\n\n    // the next vertex is the one farthest to the line formed by `v0` and `v1`\n    maxDistance = 0\n    for (i = 0; i < this.vertices.length; i += 1) {\n      const vertex = this.vertices[i]\n      if (vertex !== v0 && vertex !== v1) {\n        const distance = pointLineDistance(\n          vertex.point, v0.point, v1.point\n        )\n        if (distance > maxDistance) {\n          maxDistance = distance\n          v2 = vertex\n        }\n      }\n    }\n\n    // the next vertes is the one farthest to the plane `v0`, `v1`, `v2`\n    // normalize((v2 - v1) x (v0 - v1))\n    const normal = getPlaneNormal([], v0.point, v1.point, v2.point)\n    // distance from the origin to the plane\n    const distPO = dot(v0.point, normal)\n    maxDistance = -1\n    for (i = 0; i < this.vertices.length; i += 1) {\n      const vertex = this.vertices[i]\n      if (vertex !== v0 && vertex !== v1 && vertex !== v2) {\n        const distance = Math.abs(dot(normal, vertex.point) - distPO)\n        if (distance > maxDistance) {\n          maxDistance = distance\n          v3 = vertex\n        }\n      }\n    }\n\n    // initial simplex\n    // Taken from http://everything2.com/title/How+to+paint+a+tetrahedron\n    //\n    //                              v2\n    //                             ,|,\n    //                           ,7``\\'VA,\n    //                         ,7`   |, `'VA,\n    //                       ,7`     `\\    `'VA,\n    //                     ,7`        |,      `'VA,\n    //                   ,7`          `\\         `'VA,\n    //                 ,7`             |,           `'VA,\n    //               ,7`               `\\       ,..ooOOTK` v3\n    //             ,7`                  |,.ooOOT''`    AV\n    //           ,7`            ,..ooOOT`\\`           /7\n    //         ,7`      ,..ooOOT''`      |,          AV\n    //        ,T,..ooOOT''`              `\\         /7\n    //     v0 `'TTs.,                     |,       AV\n    //            `'TTs.,                 `\\      /7\n    //                 `'TTs.,             |,    AV\n    //                      `'TTs.,        `\\   /7\n    //                           `'TTs.,    |, AV\n    //                                `'TTs.,\\/7\n    //                                     `'T`\n    //                                       v1\n    //\n    const faces = []\n    if (dot(v3.point, normal) - distPO < 0) {\n      // the face is not able to see the point so `planeNormal`\n      // is pointing outside the tetrahedron\n      faces.push(\n        Face.createTriangle(v0, v1, v2),\n        Face.createTriangle(v3, v1, v0),\n        Face.createTriangle(v3, v2, v1),\n        Face.createTriangle(v3, v0, v2)\n      )\n\n      // set the opposite edge\n      for (i = 0; i < 3; i += 1) {\n        const j = (i + 1) % 3\n        // join face[i] i > 0, with the first face\n        faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j))\n        // join face[i] with face[i + 1], 1 <= i <= 3\n        faces[i + 1].getEdge(1).setOpposite(faces[j + 1].getEdge(0))\n      }\n    } else {\n      // the face is able to see the point so `planeNormal`\n      // is pointing inside the tetrahedron\n      faces.push(\n        Face.createTriangle(v0, v2, v1),\n        Face.createTriangle(v3, v0, v1),\n        Face.createTriangle(v3, v1, v2),\n        Face.createTriangle(v3, v2, v0)\n      )\n\n      // set the opposite edge\n      for (i = 0; i < 3; i += 1) {\n        const j = (i + 1) % 3\n        // join face[i] i > 0, with the first face\n        faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3))\n        // join face[i] with face[i + 1]\n        faces[i + 1].getEdge(0).setOpposite(faces[j + 1].getEdge(1))\n      }\n    }\n\n    // the initial hull is the tetrahedron\n    for (i = 0; i < 4; i += 1) {\n      this.faces.push(faces[i])\n    }\n\n    // initial assignment of vertices to the faces of the tetrahedron\n    for (i = 0; i < vertices.length; i += 1) {\n      const vertex = vertices[i]\n      if (vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3) {\n        maxDistance = this.tolerance\n        let maxFace\n        for (j = 0; j < 4; j += 1) {\n          const distance = faces[j].distanceToPlane(vertex.point)\n          if (distance > maxDistance) {\n            maxDistance = distance\n            maxFace = faces[j]\n          }\n        }\n\n        if (maxFace) {\n          this.addVertexToFace(vertex, maxFace)\n        }\n      }\n    }\n  }\n\n  reindexFaceAndVertices () {\n    // remove inactive faces\n    const activeFaces = []\n    for (let i = 0; i < this.faces.length; i += 1) {\n      const face = this.faces[i]\n      if (face.mark === VISIBLE) {\n        activeFaces.push(face)\n      }\n    }\n    this.faces = activeFaces\n  }\n\n  collectFaces (skipTriangulation) {\n    const faceIndices = []\n    for (let i = 0; i < this.faces.length; i += 1) {\n      if (this.faces[i].mark !== VISIBLE) {\n        throw Error('attempt to include a destroyed face in the hull')\n      }\n      const indices = this.faces[i].collectIndices()\n      if (skipTriangulation) {\n        faceIndices.push(indices)\n      } else {\n        for (let j = 0; j < indices.length - 2; j += 1) {\n          faceIndices.push(\n            [indices[0], indices[j + 1], indices[j + 2]]\n          )\n        }\n      }\n    }\n    return faceIndices\n  }\n\n  /**\n   * Finds the next vertex to make faces with the current hull\n   *\n   * - let `face` be the first face existing in the `claimed` vertex list\n   *  - if `face` doesn't exist then return since there're no vertices left\n   *  - otherwise for each `vertex` that face sees find the one furthest away\n   *  from `face`\n   *\n   * @return {Vertex|undefined} Returns undefined when there're no more\n   * visible vertices\n   */\n  nextVertexToAdd () {\n    if (!this.claimed.isEmpty()) {\n      let eyeVertex, vertex\n      let maxDistance = 0\n      const eyeFace = this.claimed.first().face\n      for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {\n        const distance = eyeFace.distanceToPlane(vertex.point)\n        if (distance > maxDistance) {\n          maxDistance = distance\n          eyeVertex = vertex\n        }\n      }\n      return eyeVertex\n    }\n  }\n\n  /**\n   * Computes a chain of half edges in ccw order called the `horizon`, for an\n   * edge to be part of the horizon it must join a face that can see\n   * `eyePoint` and a face that cannot see `eyePoint`\n   *\n   * @param {number[]} eyePoint - The coordinates of a point\n   * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`\n   * @param {Face} face - The current face being tested\n   * @param {HalfEdge[]} horizon - The edges that form part of the horizon in\n   * ccw order\n   */\n  computeHorizon (eyePoint, crossEdge, face, horizon) {\n    // moves face's vertices to the `unclaimed` vertex list\n    this.deleteFaceVertices(face)\n\n    face.mark = DELETED\n\n    let edge\n    if (!crossEdge) {\n      edge = crossEdge = face.getEdge(0)\n    } else {\n      // start from the next edge since `crossEdge` was already analyzed\n      // (actually `crossEdge.opposite` was the face who called this method\n      // recursively)\n      edge = crossEdge.next\n    }\n\n    // All the faces that are able to see `eyeVertex` are defined as follows\n    //\n    //       v    /\n    //           / <== visible face\n    //          /\n    //         |\n    //         | <== not visible face\n    //\n    //  dot(v, visible face normal) - visible face offset > this.tolerance\n    //\n    do {\n      const oppositeEdge = edge.opposite\n      const oppositeFace = oppositeEdge.face\n      if (oppositeFace.mark === VISIBLE) {\n        if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {\n          this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon)\n        } else {\n          horizon.push(edge)\n        }\n      }\n      edge = edge.next\n    } while (edge !== crossEdge)\n  }\n\n  /**\n   * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and\n   * `horizonEdge.tail` in ccw order\n   *\n   * @param {Vertex} eyeVertex\n   * @param {HalfEdge} horizonEdge\n   * @return {HalfEdge} The half edge whose vertex is the eyeVertex\n   */\n  addAdjoiningFace (eyeVertex, horizonEdge) {\n    // all the half edges are created in ccw order thus the face is always\n    // pointing outside the hull\n    // edges:\n    //\n    //                  eyeVertex.point\n    //                       / \\\n    //                      /   \\\n    //                  1  /     \\  0\n    //                    /       \\\n    //                   /         \\\n    //                  /           \\\n    //          horizon.tail --- horizon.head\n    //                        2\n    //\n    const face = Face.createTriangle(\n      eyeVertex,\n      horizonEdge.tail(),\n      horizonEdge.head()\n    )\n    this.faces.push(face)\n    // join face.getEdge(-1) with the horizon's opposite edge\n    // face.getEdge(-1) = face.getEdge(2)\n    face.getEdge(-1).setOpposite(horizonEdge.opposite)\n    return face.getEdge(0)\n  }\n\n  /**\n   * Adds horizon.length faces to the hull, each face will be 'linked' with the\n   * horizon opposite face and the face on the left/right\n   *\n   * @param {Vertex} eyeVertex\n   * @param {HalfEdge[]} horizon - A chain of half edges in ccw order\n   */\n  addNewFaces (eyeVertex, horizon) {\n    this.newFaces = []\n    let firstSideEdge, previousSideEdge\n    for (let i = 0; i < horizon.length; i += 1) {\n      const horizonEdge = horizon[i]\n      // returns the right side edge\n      const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge)\n      if (!firstSideEdge) {\n        firstSideEdge = sideEdge\n      } else {\n        // joins face.getEdge(1) with previousFace.getEdge(0)\n        sideEdge.next.setOpposite(previousSideEdge)\n      }\n      this.newFaces.push(sideEdge.face)\n      previousSideEdge = sideEdge\n    }\n    firstSideEdge.next.setOpposite(previousSideEdge)\n  }\n\n  /**\n   * Computes the distance from `edge` opposite face's centroid to\n   * `edge.face`\n   *\n   * @param {HalfEdge} edge\n   * @return {number}\n   * - A positive number when the centroid of the opposite face is above the\n   *   face i.e. when the faces are concave\n   * - A negative number when the centroid of the opposite face is below the\n   *   face i.e. when the faces are convex\n   */\n  oppositeFaceDistance (edge) {\n    return edge.face.distanceToPlane(edge.opposite.face.centroid)\n  }\n\n  /**\n   * Merges a face with none/any/all its neighbors according to the strategy\n   * used\n   *\n   * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be\n   * decided based on the face with the larger area, the centroid of the face\n   * with the smaller area will be checked against the one with the larger area\n   * to see if it's in the merge range [tolerance, -tolerance] i.e.\n   *\n   *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance\n   *\n   * Note that the first check (with +tolerance) was done on `computeHorizon`\n   *\n   * If the above is not true then the check is done with respect to the smaller\n   * face i.e.\n   *\n   *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance\n   *\n   * If true then it means that two faces are non convex (concave), even if the\n   * dot(...) - offset value is > 0 (that's the point of doing the merge in the\n   * first place)\n   *\n   * If two faces are concave then the check must also be done on the other face\n   * but this is done in another merge pass, for this to happen the face is\n   * marked in a temporal NON_CONVEX state\n   *\n   * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if\n   * they pass the following conditions\n   *\n   *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance\n   *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance\n   *\n   * @param {Face} face\n   * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or\n   * MERGE_NON_CONVEX\n   */\n  doAdjacentMerge (face, mergeType) {\n    let edge = face.edge\n    let convex = true\n    let it = 0\n    do {\n      if (it >= face.nVertices) {\n        throw Error('merge recursion limit exceeded')\n      }\n      const oppositeFace = edge.opposite.face\n      let merge = false\n\n      // Important notes about the algorithm to merge faces\n      //\n      // - Given a vertex `eyeVertex` that will be added to the hull\n      //   all the faces that cannot see `eyeVertex` are defined as follows\n      //\n      //      dot(v, not visible face normal) - not visible offset < tolerance\n      //\n      // - Two faces can be merged when the centroid of one of these faces\n      // projected to the normal of the other face minus the other face offset\n      // is in the range [tolerance, -tolerance]\n      // - Since `face` (given in the input for this method) has passed the\n      // check above we only have to check the lower bound e.g.\n      //\n      //      dot(v, not visible face normal) - not visible offset > -tolerance\n      //\n      if (mergeType === MERGE_NON_CONVEX) {\n        if (this.oppositeFaceDistance(edge) > -this.tolerance ||\n            this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {\n          merge = true\n        }\n      } else {\n        if (face.area > oppositeFace.area) {\n          if (this.oppositeFaceDistance(edge) > -this.tolerance) {\n            merge = true\n          } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {\n            convex = false\n          }\n        } else {\n          if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {\n            merge = true\n          } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {\n            convex = false\n          }\n        }\n      }\n\n      if (merge) {\n        // when two faces are merged it might be possible that redundant faces\n        // are destroyed, in that case move all the visible vertices from the\n        // destroyed faces to the `unclaimed` vertex list\n        const discardedFaces = face.mergeAdjacentFaces(edge, [])\n        for (let i = 0; i < discardedFaces.length; i += 1) {\n          this.deleteFaceVertices(discardedFaces[i], face)\n        }\n        return true\n      }\n\n      edge = edge.next\n      it += 1\n    } while (edge !== face.edge)\n    if (!convex) {\n      face.mark = NON_CONVEX\n    }\n    return false\n  }\n\n  /**\n   * Adds a vertex to the hull with the following algorithm\n   *\n   * - Compute the `horizon` which is a chain of half edges, for an edge to\n   *   belong to this group it must be the edge connecting a face that can\n   *   see `eyeVertex` and a face which cannot see `eyeVertex`\n   * - All the faces that can see `eyeVertex` have its visible vertices removed\n   *   from the claimed VertexList\n   * - A new set of faces is created with each edge of the `horizon` and\n   *   `eyeVertex`, each face is connected with the opposite horizon face and\n   *   the face on the left/right\n   * - The new faces are merged if possible with the opposite horizon face first\n   *   and then the faces on the right/left\n   * - The vertices removed from all the visible faces are assigned to the new\n   *   faces if possible\n   *\n   * @param {Vertex} eyeVertex\n   */\n  addVertexToHull (eyeVertex) {\n    const horizon = []\n\n    this.unclaimed.clear()\n\n    // remove `eyeVertex` from `eyeVertex.face` so that it can't be added to the\n    // `unclaimed` vertex list\n    this.removeVertexFromFace(eyeVertex, eyeVertex.face)\n    this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon)\n    this.addNewFaces(eyeVertex, horizon)\n\n    // first merge pass\n    // Do the merge with respect to the larger face\n    for (let i = 0; i < this.newFaces.length; i += 1) {\n      const face = this.newFaces[i]\n      if (face.mark === VISIBLE) {\n        while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {}\n      }\n    }\n\n    // second merge pass\n    // Do the merge on non convex faces (a face is marked as non convex in the\n    // first pass)\n    for (let i = 0; i < this.newFaces.length; i += 1) {\n      const face = this.newFaces[i]\n      if (face.mark === NON_CONVEX) {\n        face.mark = VISIBLE\n        while (this.doAdjacentMerge(face, MERGE_NON_CONVEX)) {}\n      }\n    }\n\n    // reassign `unclaimed` vertices to the new faces\n    this.resolveUnclaimedPoints(this.newFaces)\n  }\n\n  build () {\n    let eyeVertex\n    this.createInitialSimplex()\n    while ((eyeVertex = this.nextVertexToAdd())) {\n      this.addVertexToHull(eyeVertex)\n    }\n    this.reindexFaceAndVertices()\n  }\n}\n\nmodule.exports = QuickHull\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/QuickHull.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Vertex.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Vertex.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nclass Vertex {\n  constructor (point, index) {\n    this.point = point\n    // index in the input array\n    this.index = index\n    // vertex is a double linked list node\n    this.next = null\n    this.prev = null\n    // the face that is able to see this point\n    this.face = null\n  }\n}\n\nmodule.exports = Vertex\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/Vertex.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/VertexList.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/VertexList.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nclass VertexList {\n  constructor () {\n    this.head = null\n    this.tail = null\n  }\n\n  clear () {\n    this.head = this.tail = null\n  }\n\n  /**\n   * Inserts a `node` before `target`, it's assumed that\n   * `target` belongs to this doubly linked list\n   *\n   * @param {*} target\n   * @param {*} node\n   */\n  insertBefore (target, node) {\n    node.prev = target.prev\n    node.next = target\n    if (!node.prev) {\n      this.head = node\n    } else {\n      node.prev.next = node\n    }\n    target.prev = node\n  }\n\n  /**\n   * Inserts a `node` after `target`, it's assumed that\n   * `target` belongs to this doubly linked list\n   *\n   * @param {Vertex} target\n   * @param {Vertex} node\n   */\n  insertAfter (target, node) {\n    node.prev = target\n    node.next = target.next\n    if (!node.next) {\n      this.tail = node\n    } else {\n      node.next.prev = node\n    }\n    target.next = node\n  }\n\n  /**\n   * Appends a `node` to the end of this doubly linked list\n   * Note: `node.next` will be unlinked from `node`\n   * Note: if `node` is part of another linked list call `addAll` instead\n   *\n   * @param {*} node\n   */\n  add (node) {\n    if (!this.head) {\n      this.head = node\n    } else {\n      this.tail.next = node\n    }\n    node.prev = this.tail\n    // since node is the new end it doesn't have a next node\n    node.next = null\n    this.tail = node\n  }\n\n  /**\n   * Appends a chain of nodes where `node` is the head,\n   * the difference with `add` is that it correctly sets the position\n   * of the node list `tail` property\n   *\n   * @param {*} node\n   */\n  addAll (node) {\n    if (!this.head) {\n      this.head = node\n    } else {\n      this.tail.next = node\n    }\n    node.prev = this.tail\n\n    // find the end of the list\n    while (node.next) {\n      node = node.next\n    }\n    this.tail = node\n  }\n\n  /**\n   * Deletes a `node` from this linked list, it's assumed that `node` is a\n   * member of this linked list\n   *\n   * @param {*} node\n   */\n  remove (node) {\n    if (!node.prev) {\n      this.head = node.next\n    } else {\n      node.prev.next = node.next\n    }\n\n    if (!node.next) {\n      this.tail = node.prev\n    } else {\n      node.next.prev = node.prev\n    }\n  }\n\n  /**\n   * Removes a chain of nodes whose head is `a` and whose tail is `b`,\n   * it's assumed that `a` and `b` belong to this list and also that `a`\n   * comes before `b` in the linked list\n   *\n   * @param {*} a\n   * @param {*} b\n   */\n  removeChain (a, b) {\n    if (!a.prev) {\n      this.head = b.next\n    } else {\n      a.prev.next = b.next\n    }\n\n    if (!b.next) {\n      this.tail = a.prev\n    } else {\n      b.next.prev = a.prev\n    }\n  }\n\n  first () {\n    return this.head\n  }\n\n  isEmpty () {\n    return !this.head\n  }\n}\n\nmodule.exports = VertexList\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/VertexList.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/get-plane-normal.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/get-plane-normal.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cross = __webpack_require__(/*! ../../../maths/vec3/cross */ \"./node_modules/@jscad/modeling/src/maths/vec3/cross.js\")\nconst normalize = __webpack_require__(/*! ../../../maths/vec3/normalize */ \"./node_modules/@jscad/modeling/src/maths/vec3/normalize.js\")\nconst subtract = __webpack_require__(/*! ../../../maths/vec3/subtract */ \"./node_modules/@jscad/modeling/src/maths/vec3/subtract.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nconst planeNormal = (out, point1, point2, point3) => {\n  const tmp = [0, 0, 0]\n  subtract(out, point1, point2)\n  subtract(tmp, point2, point3)\n  cross(out, out, tmp)\n  return normalize(out, out)\n}\n\nmodule.exports = planeNormal\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/get-plane-normal.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const QuickHull = __webpack_require__(/*! ./QuickHull */ \"./node_modules/@jscad/modeling/src/operations/hulls/quickhull/QuickHull.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nconst runner = (points, options = {}) => {\n  const instance = new QuickHull(points)\n  instance.build()\n  return instance.collectFaces(options.skipTriangulation)\n}\n\nmodule.exports = runner\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/hulls/quickhull/point-line-distance.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/hulls/quickhull/point-line-distance.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cross = __webpack_require__(/*! ../../../maths/vec3/cross */ \"./node_modules/@jscad/modeling/src/maths/vec3/cross.js\")\nconst subtract = __webpack_require__(/*! ../../../maths/vec3/subtract */ \"./node_modules/@jscad/modeling/src/maths/vec3/subtract.js\")\nconst squaredLength = __webpack_require__(/*! ../../../maths/vec3/squaredLength */ \"./node_modules/@jscad/modeling/src/maths/vec3/squaredLength.js\")\n\n/*\n * Original source from quickhull3d (https://github.com/mauriciopoppe/quickhull3d)\n * Copyright (c) 2015 Mauricio Poppe\n *\n * Adapted to JSCAD by Jeff Gay\n */\n\nconst distanceSquared = (p, a, b) => {\n  // == parallelogram solution\n  //\n  //            s\n  //      __a________b__\n  //       /   |    /\n  //      /   h|   /\n  //     /_____|__/\n  //    p\n  //\n  //  s = b - a\n  //  area = s * h\n  //  |ap x s| = s * h\n  //  h = |ap x s| / s\n  //\n  const ab = []\n  const ap = []\n  const cr = []\n  subtract(ab, b, a)\n  subtract(ap, p, a)\n  const area = squaredLength(cross(cr, ap, ab))\n  const s = squaredLength(ab)\n  if (s === 0) {\n    throw Error('a and b are the same point')\n  }\n  return area / s\n}\n\nconst pointLineDistance = (point, a, b) => Math.sqrt(distanceSquared(point, a, b))\n\nmodule.exports = pointLineDistance\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/hulls/quickhull/point-line-distance.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/center.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/center.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\nconst measureBoundingBox = __webpack_require__(/*! ../../measurements/measureBoundingBox */ \"./node_modules/@jscad/modeling/src/measurements/measureBoundingBox.js\")\n\nconst { translate } = __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\")\n\nconst centerGeometry = (options, object) => {\n  const defaults = {\n    axes: [true, true, true],\n    center: [0, 0, 0]\n  }\n  const { axes, center } = Object.assign({}, defaults, options)\n\n  const bounds = measureBoundingBox(object)\n  const offset = [0, 0, 0]\n  if (axes[0]) offset[0] = center[0] - (bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2))\n  if (axes[1]) offset[1] = center[1] - (bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2))\n  if (axes[2]) offset[2] = center[2] - (bounds[0][2] + ((bounds[1][2] - bounds[0][2]) / 2))\n  return translate(offset, object)\n}\n\n/**\n * Center the given geometries using the given options.\n * @param {Object} options - options for centering\n * @param {Array} [options.axes=[true,true,true]] - axis of which to center, true or false\n * @param {Array} [options.center=[0,0,0]] - point of which to center the object upon\n * @param {...Object} geometries - the geometries to center\n * @return {Object|Array} the centered geometry, or a list of centered geometries\n * @alias module:modeling/transforms.center\n *\n * @example\n * let myshape = center({axes: [true,false,false]}, sphere()) // center about the X axis\n */\nconst center = (options, ...geometries) => {\n  const defaults = {\n    axes: [true, true, true],\n    center: [0, 0, 0]\n  // TODO : Add addition 'methods' of centering; midpoint, centeriod\n  }\n  const { axes, center } = Object.assign({}, defaults, options)\n\n  geometries = flatten(geometries)\n  if (geometries.length === 0) throw new Error('wrong number of arguments')\n  if (center.length !== 3) throw new Error('center must be an array of length 3')\n\n  options = {\n    axes: axes,\n    center: center\n  }\n\n  const results = geometries.map((object) => {\n    if (path2.isA(object)) return centerGeometry(options, object)\n    if (geom2.isA(object)) return centerGeometry(options, object)\n    if (geom3.isA(object)) return centerGeometry(options, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nconst centerX = (...objects) => center({ axes: [true, false, false] }, objects)\n\nconst centerY = (...objects) => center({ axes: [false, true, false] }, objects)\n\nconst centerZ = (...objects) => center({ axes: [false, false, true] }, objects)\n\nmodule.exports = {\n  center,\n  centerX,\n  centerY,\n  centerZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/center.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * All shapes (primitives or the results of operations) can be transformed, such as scaled or rotated.\n * In all cases, the function returns the results, and never changes the original shapes.\n * @module modeling/transforms\n * @example\n * const { center, rotateX, translate } = require('@jscad/modeling').transforms\n */\nmodule.exports = {\n  center: __webpack_require__(/*! ./center */ \"./node_modules/@jscad/modeling/src/operations/transforms/center.js\").center,\n  centerX: __webpack_require__(/*! ./center */ \"./node_modules/@jscad/modeling/src/operations/transforms/center.js\").centerX,\n  centerY: __webpack_require__(/*! ./center */ \"./node_modules/@jscad/modeling/src/operations/transforms/center.js\").centerY,\n  centerZ: __webpack_require__(/*! ./center */ \"./node_modules/@jscad/modeling/src/operations/transforms/center.js\").centerZ,\n\n  mirror: __webpack_require__(/*! ./mirror */ \"./node_modules/@jscad/modeling/src/operations/transforms/mirror.js\").mirror,\n  mirrorX: __webpack_require__(/*! ./mirror */ \"./node_modules/@jscad/modeling/src/operations/transforms/mirror.js\").mirrorX,\n  mirrorY: __webpack_require__(/*! ./mirror */ \"./node_modules/@jscad/modeling/src/operations/transforms/mirror.js\").mirrorY,\n  mirrorZ: __webpack_require__(/*! ./mirror */ \"./node_modules/@jscad/modeling/src/operations/transforms/mirror.js\").mirrorZ,\n\n  rotate: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/operations/transforms/rotate.js\").rotate,\n  rotateX: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/operations/transforms/rotate.js\").rotateX,\n  rotateY: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/operations/transforms/rotate.js\").rotateY,\n  rotateZ: __webpack_require__(/*! ./rotate */ \"./node_modules/@jscad/modeling/src/operations/transforms/rotate.js\").rotateZ,\n\n  scale: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/operations/transforms/scale.js\").scale,\n  scaleX: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/operations/transforms/scale.js\").scaleX,\n  scaleY: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/operations/transforms/scale.js\").scaleY,\n  scaleZ: __webpack_require__(/*! ./scale */ \"./node_modules/@jscad/modeling/src/operations/transforms/scale.js\").scaleZ,\n\n  transform: __webpack_require__(/*! ./transform */ \"./node_modules/@jscad/modeling/src/operations/transforms/transform.js\"),\n\n  translate: __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\").translate,\n  translateX: __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\").translateX,\n  translateY: __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\").translateY,\n  translateZ: __webpack_require__(/*! ./translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\").translateZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/mirror.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/mirror.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\nconst plane = __webpack_require__(/*! ../../maths/plane */ \"./node_modules/@jscad/modeling/src/maths/plane/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Mirror the given geometries using the given options.\n * @param {Object} options - options for mirror\n * @param {Array} [options.origin=[0,0,0]] - the origin of the plane\n * @param {Array} [options.normal=[0,0,1]] - the normal vector of the plane\n * @param {...Object} geometries - the geometries to mirror\n * @return {Object|Array} the mirrored geometry, or a list of mirrored geometry\n * @alias module:modeling/transforms.mirror\n *\n * @example\n * let myshape = mirror({normal: [0,0,10]}, cube({center: [0,0,15], radius: [20, 25, 5]}))\n */\nconst mirror = (options, ...objects) => {\n  const defaults = {\n    origin: [0, 0, 0],\n    normal: [0, 0, 1] // Z axis\n  }\n  const { origin, normal } = Object.assign({}, defaults, options)\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  const planeOfMirror = plane.fromNormalAndPoint(normal, origin)\n  // verify the plane, i.e. check that the given normal was valid\n  if (Number.isNaN(planeOfMirror[0])) {\n    throw new Error('the given origin and normal do not define a proper plane')\n  }\n\n  const matrix = mat4.mirrorByPlane(planeOfMirror)\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return path2.transform(matrix, object)\n    if (geom2.isA(object)) return geom2.transform(matrix, object)\n    if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\n/**\n * Mirror the given geometries about the X axis.\n * @param {...Object} geometries - the geometries to mirror\n * @return {Object|Array} the mirrored geometry, or a list of mirrored geometry\n * @alias module:modeling/transforms.mirrorX\n */\nconst mirrorX = (...objects) => mirror({ normal: [1, 0, 0] }, objects)\n\n/**\n * Mirror the given geometries about the Y axis.\n * @param {...Object} geometries - the geometries to mirror\n * @return {Object|Array} the mirrored geometry, or a list of mirrored geometry\n * @alias module:modeling/transforms.mirrorY\n */\nconst mirrorY = (...objects) => mirror({ normal: [0, 1, 0] }, objects)\n\n/**\n * Mirror the given object(s) about the Z axis.\n * @param {...Object} objects - the geometries to mirror\n * @return {Object|Array} the mirrored geometry, or a list of mirrored geometry\n * @alias module:modeling/transforms.mirrorZ\n */\nconst mirrorZ = (...objects) => mirror({ normal: [0, 0, 1] }, objects)\n\nmodule.exports = {\n  mirror,\n  mirrorX,\n  mirrorY,\n  mirrorZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/mirror.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/rotate.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/rotate.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Rotate the given geometries using the given options.\n * @param {Array} angles - angle (RADIANS) of rotations about X, Y, and Z axis\n * @param {...Object} geometries - the geometries to rotate\n * @return {Object|Array} the rotated geometry, or a list of rotated geometries\n * @alias module:modeling/transforms.rotate\n *\n * @example\n * const newsphere = rotate([Math.PI / 4, 0, 0], sphere())\n */\nconst rotate = (angles, ...objects) => {\n  if (!Array.isArray(angles)) throw new Error('angles must be an array')\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  // adjust the angles if necessary\n  angles = angles.slice() // don't modify the original\n  while (angles.length < 3) angles.push(0)\n\n  const yaw = angles[2]\n  const pitch = angles[1]\n  const roll = angles[0]\n\n  const matrix = mat4.fromTaitBryanRotation(yaw, pitch, roll)\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return path2.transform(matrix, object)\n    if (geom2.isA(object)) return geom2.transform(matrix, object)\n    if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\n/**\n * Rotate the given object(s) about the X axis, using the given options.\n * @param {Number} angle - angle (RADIANS) of rotations about X\n * @param {...Object} geometries - the geometries to rotate\n * @return {Object|Array} the rotated geometry, or a list of rotated geometries\n * @alias module:modeling/transforms.rotateX\n */\nconst rotateX = (angle, ...objects) => rotate([angle, 0, 0], objects)\n\n/**\n * Rotate the given object(s) about the Y axis, using the given options.\n * @param {Number} angle - angle (RADIANS) of rotations about Y\n * @param {...Object} geometries - the geometries to rotate\n * @return {Object|Array} the rotated geometry, or a list of rotated geometries\n * @alias module:modeling/transforms.rotateY\n */\nconst rotateY = (angle, ...objects) => rotate([0, angle, 0], objects)\n\n/**\n * Rotate the given object(s) about the Z axis, using the given options.\n * @param {Number} angle - angle (RADIANS) of rotations about Z\n * @param {...Object} geometries - the geometries to rotate\n * @return {Object|Array} the rotated geometry, or a list of rotated geometries\n * @alias module:modeling/transforms.rotateZ\n */\nconst rotateZ = (angle, ...objects) => rotate([0, 0, angle], objects)\n\nmodule.exports = {\n  rotate,\n  rotateX,\n  rotateY,\n  rotateZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/rotate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/scale.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/scale.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Scale the given geometries using the given options.\n * @param {Array} factors - X, Y, Z factors by which to scale the object\n * @param {...Object} geometries - the geometries to scale\n * @return {Object|Array} the scaled geometry, or a list of scaled geometries\n * @alias module:modeling/transforms.scale\n *\n * @example\n * let myshape = scale([5, 0, 10], sphere())\n */\nconst scale = (factors, ...objects) => {\n  if (!Array.isArray(factors)) throw new Error('factors must be an array')\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  // adjust the factors if necessary\n  factors = factors.slice() // don't modify the original\n  while (factors.length < 3) factors.push(1)\n\n  if (factors[0] <= 0 || factors[1] <= 0 || factors[2] <= 0) throw new Error('factors must be positive')\n\n  const matrix = mat4.fromScaling(factors)\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return path2.transform(matrix, object)\n    if (geom2.isA(object)) return geom2.transform(matrix, object)\n    if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\n/**\n * Scale the given geometries about the X axis using the given options.\n * @param {Number} factor - X factor by which to scale the object\n * @param {...Object} geometries - the geometries to scale\n * @return {Object|Array} the scaled geometry, or a list of scaled geometries\n * @alias module:modeling/transforms.scaleX\n */\nconst scaleX = (offset, ...objects) => scale([offset, 1, 1], objects)\n\n/**\n * Scale the given geometries about the Y axis using the given options.\n * @param {Number} factor - Y factor by which to scale the object\n * @param {...Object} geometries - the geometries to scale\n * @return {Object|Array} the scaled geometry, or a list of scaled geometries\n * @alias module:modeling/transforms.scaleY\n */\nconst scaleY = (offset, ...objects) => scale([1, offset, 1], objects)\n\n/**\n * Scale the given geometries about the Z axis using the given options.\n * @param {Number} factor - Z factor by which to scale the object\n * @param {...Object} geometries - the geometries to scale\n * @return {Object|Array} the scaled geometry, or a list of scaled geometries\n * @alias module:modeling/transforms.scaleZ\n */\nconst scaleZ = (offset, ...objects) => scale([1, 1, offset], objects)\n\nmodule.exports = {\n  scale,\n  scaleX,\n  scaleY,\n  scaleZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/scale.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/transform.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/transform.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Transform the given geometries using the given matrix.\n * @param {mat4} matrix - a transformation matrix\n * @param {...Object} geometries - the geometries to transform\n * @return {Object|Array} the transformed geometry, or a list of transformed geometries\n * @alias module:modeling/transforms.transform\n *\n * @example\n * const newsphere = transform(mat4.rotateX(Math.PI/4), sphere())\n */\nconst transform = (matrix, ...objects) => {\n  // TODO how to check that the matrix is REAL?\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return path2.transform(matrix, object)\n    if (geom2.isA(object)) return geom2.transform(matrix, object)\n    if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\nmodule.exports = transform\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/transform.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/operations/transforms/translate.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/operations/transforms/translate.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const flatten = __webpack_require__(/*! ../../utils/flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\")\n\nconst mat4 = __webpack_require__(/*! ../../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Translate the given geometries using the given options.\n * @param {Array} offset - offset (vector) of which to translate the object\n * @param {...Object} geometries - the geometries to translate\n * @return {Object|Array} the translated geometry, or a list of translated geometries\n * @alias module:modeling/transforms.translate\n *\n * @example\n * const newsphere = translate([5, 0, 10], sphere())\n */\nconst translate = (offset, ...objects) => {\n  if (!Array.isArray(offset)) throw new Error('offset must be an array')\n\n  objects = flatten(objects)\n  if (objects.length === 0) throw new Error('wrong number of arguments')\n\n  // adjust the offset if necessary\n  offset = offset.slice() // don't modify the original\n  while (offset.length < 3) offset.push(0)\n\n  const matrix = mat4.fromTranslation(offset)\n\n  const results = objects.map((object) => {\n    if (path2.isA(object)) return path2.transform(matrix, object)\n    if (geom2.isA(object)) return geom2.transform(matrix, object)\n    if (geom3.isA(object)) return geom3.transform(matrix, object)\n    return object\n  })\n  return results.length === 1 ? results[0] : results\n}\n\n/**\n * Translate the given geometries along the X axis using the given options.\n * @param {Number} offset - X offset of which to translate the object\n * @param {...Object} geometries - the geometries to translate\n * @return {Object|Array} the translated geometry, or a list of translated geometries\n * @alias module:modeling/transforms.translateX\n */\nconst translateX = (offset, ...objects) => translate([offset, 0, 0], objects)\n\n/**\n * Translate the given geometries along the Y axis using the given options.\n * @param {Number} offset - Y offset of which to translate the object\n * @param {...Object} geometries - the geometries to translate\n * @return {Object|Array} the translated geometry, or a list of translated geometries\n * @alias module:modeling/transforms.translateY\n */\nconst translateY = (offset, ...objects) => translate([0, offset, 0], objects)\n\n/**\n * Translate the given geometries along the Z axis using the given options.\n * @param {Number} offset - Z offset of which to translate the object\n * @param {...Object} geometries - the geometries to translate\n * @return {Object|Array} the translated geometry, or a list of translated geometries\n * @alias module:modeling/transforms.translateZ\n */\nconst translateZ = (offset, ...objects) => translate([0, 0, offset], objects)\n\nmodule.exports = {\n  translate,\n  translateX,\n  translateY,\n  translateZ\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/operations/transforms/translate.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/arc.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/arc.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Construct an arc in two dimensional space.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of arc\n * @param {Number} [options.radius=1] - radius of arc\n * @param {Number} [options.startAngle=0] - starting angle of the arc, in radians\n * @param {Number} [options.endAngle=Math.PI*2] - ending angle of the arc, in radians\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @param {Boolean} [options.makeTangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent\n * @returns {path2} new 2D path\n * @alias module:modeling/primitives.arc\n */\nconst arc = (options) => {\n  const defaults = {\n    center: [0, 0],\n    radius: 1,\n    startAngle: 0,\n    endAngle: (Math.PI * 2),\n    makeTangent: false,\n    segments: 32\n  }\n  let { center, radius, startAngle, endAngle, makeTangent, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(center)) throw new Error('center must be an array')\n  if (center.length < 2) throw new Error('center must contain X and Y values')\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  if (startAngle < 0 || endAngle < 0) throw new Error('the start and end angles must be positive')\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  startAngle = startAngle % (Math.PI * 2)\n  endAngle = endAngle % (Math.PI * 2)\n\n  let rotation = (Math.PI * 2)\n  if (startAngle < endAngle) {\n    rotation = endAngle - startAngle\n  }\n  if (startAngle > endAngle) {\n    rotation = endAngle + ((Math.PI * 2) - startAngle)\n  }\n\n  const minangle = Math.acos(((radius * radius) + (radius * radius) - (EPS * EPS)) / (2 * radius * radius))\n\n  const centerv = vec2.fromArray(center)\n  let point\n  const pointArray = []\n  if (rotation < minangle) {\n    // there is no rotation, just a single point\n    point = vec2.scale(radius, vec2.fromAngleRadians(startAngle))\n    vec2.add(point, point, centerv)\n    pointArray.push(point)\n  } else {\n    // note: add one additional step to acheive full rotation\n    const numsteps = Math.max(1, Math.floor(segments * (rotation / (Math.PI * 2)))) + 1\n    let edgestepsize = numsteps * 0.5 / rotation // step size for half a degree\n    if (edgestepsize > 0.25) edgestepsize = 0.25\n\n    const totalsteps = makeTangent ? (numsteps + 2) : numsteps\n    for (let i = 0; i <= totalsteps; i++) {\n      let step = i\n      if (makeTangent) {\n        step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize\n        if (step < 0) step = 0\n        if (step > numsteps) step = numsteps\n      }\n      const angle = startAngle + (step * (rotation / numsteps))\n      point = vec2.scale(radius, vec2.fromAngleRadians(angle))\n      vec2.add(point, point, centerv)\n      pointArray.push(point)\n    }\n  }\n  return path2.fromPoints({ close: false }, pointArray)\n}\n\nmodule.exports = arc\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/arc.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/circle.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/circle.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ellipse = __webpack_require__(/*! ./ellipse */ \"./node_modules/@jscad/modeling/src/primitives/ellipse.js\")\n\n/**\n * Construct a circle in two dimensional space where are points are at the same distance from the center.\n * @see [ellipse]{@link module:modeling/primitives.ellipse} for more options\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of circle\n * @param {Number} [options.radius=1] - radius of circle\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.circle\n * @example\n * let myshape = circle({radius: 10})\n */\nconst circle = (options) => {\n  const defaults = {\n    center: [0, 0],\n    radius: 1,\n    segments: 32\n  }\n  let { center, radius, segments } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  radius = [radius, radius]\n\n  return ellipse({ center, radius, segments })\n}\n\nmodule.exports = circle\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/circle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/cube.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/cube.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cuboid = __webpack_require__(/*! ./cuboid */ \"./node_modules/@jscad/modeling/src/primitives/cuboid.js\")\n\n/**\n * Construct an axis-aligned solid cube in three dimensional space with six square faces.\n * @see [cuboid]{@link module:modeling/primitives.cuboid} for more options\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of cube\n * @param {Number} [options.size=2] - dimension of cube\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.cube\n * @example\n * let myshape = cube({size: 10})\n */\nconst cube = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    size: 2\n  }\n  let { center, size } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(size)) throw new Error('size must be a number')\n\n  size = [size, size, size]\n\n  return cuboid({ center, size })\n}\n\nmodule.exports = cube\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/cube.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/cuboid.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/cuboid.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Construct an axis-aligned solid cuboid in three dimensional space.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of cuboid\n * @param {Array} [options.size=[2,2,2]] - dimensions of cuboid; width, depth, height\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.cuboid\n *\n * @example\n * let myshape = cuboid(size: [5, 10, 5]})\n */\nconst cuboid = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    size: [2, 2, 2]\n  }\n  const { center, size } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(center)) throw new Error('center must be an array')\n  if (center.length < 3) throw new Error('center must contain X, Y and Z values')\n\n  if (!Array.isArray(size)) throw new Error('size must be an array')\n  if (size.length < 3) throw new Error('size must contain width, depth and height values')\n\n  const result = geom3.create(\n    // adjust a basic shape to size\n    [\n      [[0, 4, 6, 2], [-1, 0, 0]],\n      [[1, 3, 7, 5], [+1, 0, 0]],\n      [[0, 1, 5, 4], [0, -1, 0]],\n      [[2, 6, 7, 3], [0, +1, 0]],\n      [[0, 2, 3, 1], [0, 0, -1]],\n      [[4, 5, 7, 6], [0, 0, +1]]\n    ].map((info) => {\n      const points = info[0].map((i) => {\n        const pos = [\n          center[0] + (size[0] / 2) * (2 * !!(i & 1) - 1),\n          center[1] + (size[1] / 2) * (2 * !!(i & 2) - 1),\n          center[2] + (size[2] / 2) * (2 * !!(i & 4) - 1)\n        ]\n        return pos\n      })\n      return poly3.fromPoints(points)\n    })\n  )\n  return result\n}\n\nmodule.exports = cuboid\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/cuboid.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/cylinder.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/cylinder.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const cylinderElliptic = __webpack_require__(/*! ./cylinderElliptic */ \"./node_modules/@jscad/modeling/src/primitives/cylinderElliptic.js\")\n\n/**\n * Construct a solid cylinder in three dimensional space.\n * @see [cylinderElliptic]{@link module:modeling/primitives.cylinderElliptic} for more options\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of cylinder\n * @param {Array} [options.height=2] - height of cylinder\n * @param {Number} [options.radius=1] - radius of cylinder (at both start and end)\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom3} new geometry\n * @alias module:modeling/primitives.cylinder\n *\n * @example\n * let myshape = cylinder({\n *     height: 2,\n *     radius: 10\n *   })\n */\nconst cylinder = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    height: 2,\n    radius: 1,\n    segments: 32\n  }\n  const { center, height, radius, segments } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  const newoptions = {\n    center,\n    height,\n    startRadius: [radius, radius],\n    endRadius: [radius, radius],\n    segments\n  }\n\n  return cylinderElliptic(newoptions)\n}\n\nmodule.exports = cylinder\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/cylinder.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/cylinderElliptic.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/cylinderElliptic.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Construct an elliptic cylinder in three dimensional space.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of cylinder\n * @param {Vector3} [options.height=2] - height of cylinder\n * @param {Vector2D} [options.startRadius=[1,1]] - radius of rounded start, must be two dimensional array\n * @param {Number} [options.startAngle=0] - start angle of cylinder, in radians\n * @param {Vector2D} [options.endRadius=[1,1]] - radius of rounded end, must be two dimensional array\n * @param {Number} [options.endAngle=(Math.PI * 2)] - end angle of cylinder, in radians\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom3} new geometry\n * @alias module:modeling/primitives.cylinderElliptic\n *\n * @example\n * let myshape = cylinderElliptic({\n *     height: 2,\n *     startRadius: [10,5],\n *     endRadius: [8,3]\n *   })\n */\nconst cylinderElliptic = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    height: 2,\n    startRadius: [1, 1],\n    startAngle: 0,\n    endRadius: [1, 1],\n    endAngle: (Math.PI * 2),\n    segments: 32\n  }\n  let { center, height, startRadius, startAngle, endRadius, endAngle, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(center)) throw new Error('center must be an array')\n  if (center.length < 3) throw new Error('center must contain X, Y and Z values')\n\n  if (height < (EPS * 2)) throw new Error('height must be larger then zero')\n\n  if ((endRadius[0] <= 0) || (startRadius[0] <= 0) || (endRadius[1] <= 0) || (startRadius[1] <= 0)) {\n    throw new Error('endRadus and startRadius should be positive')\n  }\n  if (startAngle < 0 || endAngle < 0) throw new Error('startAngle and endAngle must be positive')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  startAngle = startAngle % (Math.PI * 2)\n  endAngle = endAngle % (Math.PI * 2)\n\n  let rotation = (Math.PI * 2)\n  if (startAngle < endAngle) {\n    rotation = endAngle - startAngle\n  }\n  if (startAngle > endAngle) {\n    rotation = endAngle + ((Math.PI * 2) - startAngle)\n  }\n\n  const minradius = Math.min(startRadius[0], startRadius[1], endRadius[0], endRadius[1])\n  const minangle = Math.acos(((minradius * minradius) + (minradius * minradius) - (EPS * EPS)) /\n                            (2 * minradius * minradius))\n  if (rotation < minangle) throw new Error('startAngle and endAngle to not define a significant rotation')\n\n  const slices = Math.floor(segments * (rotation / (Math.PI * 2)))\n\n  const start = vec3.fromValues(0, 0, -(height / 2))\n  const end = vec3.fromValues(0, 0, height / 2)\n  const ray = vec3.subtract(end, start)\n\n  const axisZ = vec3.unit(ray)\n  const axisX = vec3.unit(vec3.orthogonal(axisZ))\n  const axisY = vec3.unit(vec3.cross(axisZ, axisX))\n\n  const point = (stack, slice, radius) => {\n    const angle = slice * rotation + startAngle\n    const out = vec3.add(vec3.scale(radius[0] * Math.cos(angle), axisX), vec3.scale(radius[1] * Math.sin(angle), axisY))\n    const pos = vec3.add(vec3.add(vec3.scale(stack, ray), start), out)\n    return pos\n  }\n\n  // adjust the points to center\n  const fromPoints = (...points) => {\n    const newpoints = points.map((point) => vec3.add(point, center))\n    return poly3.fromPoints(newpoints)\n  }\n\n  const polygons = []\n  for (let i = 0; i < slices; i++) {\n    const t0 = i / slices\n    const t1 = (i + 1) / slices\n\n    if (endRadius[0] === startRadius[0] && endRadius[1] === startRadius[1]) {\n      polygons.push(fromPoints(start, point(0, t1, endRadius), point(0, t0, endRadius)))\n      polygons.push(fromPoints(point(0, t1, endRadius), point(1, t1, endRadius), point(1, t0, endRadius), point(0, t0, endRadius)))\n      polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)))\n    } else {\n      if (startRadius[0] > 0) {\n        polygons.push(fromPoints(start, point(0, t1, startRadius), point(0, t0, startRadius)))\n        polygons.push(fromPoints(point(0, t0, startRadius), point(0, t1, startRadius), point(1, t0, endRadius)))\n      }\n      if (endRadius[0] > 0) {\n        polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)))\n        polygons.push(fromPoints(point(1, t0, endRadius), point(0, t1, startRadius), point(1, t1, endRadius)))\n      }\n    }\n  }\n  if (rotation < (Math.PI * 2)) {\n    polygons.push(fromPoints(start, point(0, 0, startRadius), end))\n    polygons.push(fromPoints(point(0, 0, startRadius), point(1, 0, endRadius), end))\n    polygons.push(fromPoints(start, end, point(0, 1, startRadius)))\n    polygons.push(fromPoints(point(0, 1, startRadius), end, point(1, 1, endRadius)))\n  }\n  const result = geom3.create(polygons)\n  return result\n}\n\nmodule.exports = cylinderElliptic\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/cylinderElliptic.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/ellipse.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/ellipse.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\n/**\n * Construct an ellispe in two dimensional space.\n * @see https://en.wikipedia.org/wiki/Ellipse\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of ellipse\n * @param {Array} [options.radius=[1,1]] - radius of ellipse, along X and Y\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.ellipse\n * @example\n * let myshape = ellipse({radius: [5,10]})\n */\nconst ellipse = (options) => {\n  const defaults = {\n    center: [0, 0],\n    radius: [1, 1],\n    segments: 32\n  }\n  const { center, radius, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(center)) throw new Error('center must be an array')\n  if (center.length < 2) throw new Error('center must contain X and Y values')\n\n  if (!Array.isArray(radius)) throw new Error('radius must be an array')\n  if (radius.length < 2) throw new Error('radius must contain X and Y values')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  const centerv = vec2.fromArray(center)\n  const step = 2 * Math.PI / segments // radians\n\n  const points = []\n  for (let i = 0; i < segments; i++) {\n    const point = vec2.fromValues(radius[0] * Math.cos(step * i), radius[1] * Math.sin(step * i))\n    vec2.add(point, centerv, point)\n    points.push(point)\n  }\n  return geom2.fromPoints(points)\n}\n\nmodule.exports = ellipse\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/ellipse.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/ellipsoid.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/ellipsoid.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Construct an ellipsoid in three dimensional space.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of ellipsoid\n * @param {Array} [options.radius=[1,1,1]] - radius of ellipsoid, along X, Y and Z\n * @param {Number} [options.segments=32] - number of segements to create per full rotation\n * @param {Array} [options.axes] -  an array with three vectors for the x, y and z base vectors\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.ellipsoid\n *\n * @example\n * let myshape = ellipsoid({radius: [5, 10, 20]})\n*/\nconst ellipsoid = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    radius: [1, 1, 1],\n    segments: 32,\n    axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]\n  }\n  const { center, radius, segments, axes } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(radius)) throw new Error('radius must be an array')\n  if (radius.length < 3) throw new Error('radius must contain X, Y and Z values')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  const xvector = vec3.scale(radius[0], vec3.unit(axes[0]))\n  const yvector = vec3.scale(radius[1], vec3.unit(axes[1]))\n  const zvector = vec3.scale(radius[2], vec3.unit(axes[2]))\n\n  const qsegments = Math.round(segments / 4)\n  let prevcylinderpoint\n  const polygons = []\n  for (let slice1 = 0; slice1 <= segments; slice1++) {\n    const angle = Math.PI * 2.0 * slice1 / segments\n    const cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))\n    if (slice1 > 0) {\n      let prevcospitch, prevsinpitch\n      for (let slice2 = 0; slice2 <= qsegments; slice2++) {\n        const pitch = 0.5 * Math.PI * slice2 / qsegments\n        const cospitch = Math.cos(pitch)\n        const sinpitch = Math.sin(pitch)\n        if (slice2 > 0) {\n          let points = []\n          let point\n          point = vec3.subtract(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector))\n          points.push(vec3.add(center, point))\n          point = vec3.subtract(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector))\n          points.push(vec3.add(center, point))\n          if (slice2 < qsegments) {\n            point = vec3.subtract(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector))\n            points.push(vec3.add(center, point))\n          }\n          point = vec3.subtract(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector))\n          points.push(vec3.add(center, point))\n\n          polygons.push(poly3.fromPoints(points))\n\n          points = []\n          point = vec3.add(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector))\n          points.push(vec3.add(center, point))\n          point = vec3.add(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector))\n          points.push(vec3.add(center, point))\n          if (slice2 < qsegments) {\n            point = vec3.add(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector))\n            points.push(vec3.add(center, point))\n          }\n          point = vec3.add(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector))\n          points.push(vec3.add(center, point))\n          points.reverse()\n\n          polygons.push(poly3.fromPoints(points))\n        }\n        prevcospitch = cospitch\n        prevsinpitch = sinpitch\n      }\n    }\n    prevcylinderpoint = cylinderpoint\n  }\n  return geom3.create(polygons)\n}\n\nmodule.exports = ellipsoid\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/ellipsoid.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/geodesicSphere.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/geodesicSphere.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mat4 = __webpack_require__(/*! ../maths/mat4 */ \"./node_modules/@jscad/modeling/src/maths/mat4/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\n\nconst polyhedron = __webpack_require__(/*! ./polyhedron */ \"./node_modules/@jscad/modeling/src/primitives/polyhedron.js\")\n\n/**\n * Construct a geodesic sphere based on icosahedron symmetry.\n * @param {Object} [options] - options for construction\n * @param {Number} [options.radius=1] - target radius of sphere\n * @param {Number} [options.frequency=6] - subdivision frequency per face, multiples of 6\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.geodesicSphere\n *\n * @example\n * let myshape = geodesicSphere({radius: 15, frequency: 18})\n */\nconst geodesicSphere = (options) => {\n  const defaults = {\n    radius: 1,\n    frequency: 6\n  }\n  let { radius, frequency } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  // adjust the frequency to base 6\n  frequency = Math.floor(frequency / 6)\n  if (frequency <= 0) frequency = 1\n\n  const ci = [ // hard-coded data of icosahedron (20 faces, all triangles)\n    [0.850651, 0.000000, -0.525731],\n    [0.850651, -0.000000, 0.525731],\n    [-0.850651, -0.000000, 0.525731],\n    [-0.850651, 0.000000, -0.525731],\n    [0.000000, -0.525731, 0.850651],\n    [0.000000, 0.525731, 0.850651],\n    [0.000000, 0.525731, -0.850651],\n    [0.000000, -0.525731, -0.850651],\n    [-0.525731, -0.850651, -0.000000],\n    [0.525731, -0.850651, -0.000000],\n    [0.525731, 0.850651, 0.000000],\n    [-0.525731, 0.850651, 0.000000]]\n\n  const ti = [[0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],\n    [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]]\n\n  const geodesicSubDivide = (p, frequency, offset) => {\n    const p1 = p[0]\n    const p2 = p[1]\n    const p3 = p[2]\n    let n = offset\n    const c = []\n    const f = []\n\n    //           p3\n    //           /\\\n    //          /__\\     frequency = 3\n    //      i  /\\  /\\\n    //        /__\\/__\\       total triangles = 9 (frequency*frequency)\n    //       /\\  /\\  /\\\n    //     0/__\\/__\\/__\\\n    //    p1 0   j      p2\n\n    for (let i = 0; i < frequency; i++) {\n      for (let j = 0; j < frequency - i; j++) {\n        const t0 = i / frequency\n        const t1 = (i + 1) / frequency\n        const s0 = j / (frequency - i)\n        const s1 = (j + 1) / (frequency - i)\n        const s2 = frequency - i - 1 ? j / (frequency - i - 1) : 1\n        const q = []\n\n        q[0] = mix3(mix3(p1, p2, s0), p3, t0)\n        q[1] = mix3(mix3(p1, p2, s1), p3, t0)\n        q[2] = mix3(mix3(p1, p2, s2), p3, t1)\n\n        // -- normalize\n        for (let k = 0; k < 3; k++) {\n          const r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])\n          for (let l = 0; l < 3; l++) {\n            q[k][l] /= r\n          }\n        }\n        c.push(q[0], q[1], q[2])\n        f.push([n, n + 1, n + 2]); n += 3\n\n        if (j < frequency - i - 1) {\n          const s3 = frequency - i - 1 ? (j + 1) / (frequency - i - 1) : 1\n          q[0] = mix3(mix3(p1, p2, s1), p3, t0)\n          q[1] = mix3(mix3(p1, p2, s3), p3, t1)\n          q[2] = mix3(mix3(p1, p2, s2), p3, t1)\n\n          // -- normalize\n          for (let k = 0; k < 3; k++) {\n            const r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])\n            for (let l = 0; l < 3; l++) {\n              q[k][l] /= r\n            }\n          }\n          c.push(q[0], q[1], q[2])\n          f.push([n, n + 1, n + 2]); n += 3\n        }\n      }\n    }\n    return { points: c, triangles: f, offset: n }\n  }\n\n  const mix3 = (a, b, f) => {\n    const _f = 1 - f\n    const c = []\n    for (let i = 0; i < 3; i++) {\n      c[i] = a[i] * _f + b[i] * f\n    }\n    return c\n  }\n\n  let points = []\n  let faces = []\n  let offset = 0\n\n  for (let i = 0; i < ti.length; i++) {\n    const g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], frequency, offset)\n    points = points.concat(g.points)\n    faces = faces.concat(g.triangles)\n    offset = g.offset\n  }\n\n  let geometry = polyhedron({ points: points, faces: faces, orientation: 'inward' })\n  if (radius !== 1) geometry = geom3.transform(mat4.fromScaling([radius, radius, radius]), geometry)\n  return geometry\n}\n\nmodule.exports = geodesicSphere\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/geodesicSphere.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Primitives provide the building blocks for complex parts.\n * Each primitive is a geometrical object that can be described mathematically, and therefore precise.\n * Primitives can be logically combined, transformed, extruded, etc.\n * @module modeling/primitives\n * @example\n * const { cube, ellipse, star } = require('@jscad/modeling').primitives\n */\nmodule.exports = {\n  arc: __webpack_require__(/*! ./arc */ \"./node_modules/@jscad/modeling/src/primitives/arc.js\"),\n  circle: __webpack_require__(/*! ./circle */ \"./node_modules/@jscad/modeling/src/primitives/circle.js\"),\n  cube: __webpack_require__(/*! ./cube */ \"./node_modules/@jscad/modeling/src/primitives/cube.js\"),\n  cuboid: __webpack_require__(/*! ./cuboid */ \"./node_modules/@jscad/modeling/src/primitives/cuboid.js\"),\n  cylinder: __webpack_require__(/*! ./cylinder */ \"./node_modules/@jscad/modeling/src/primitives/cylinder.js\"),\n  cylinderElliptic: __webpack_require__(/*! ./cylinderElliptic */ \"./node_modules/@jscad/modeling/src/primitives/cylinderElliptic.js\"),\n  ellipse: __webpack_require__(/*! ./ellipse */ \"./node_modules/@jscad/modeling/src/primitives/ellipse.js\"),\n  ellipsoid: __webpack_require__(/*! ./ellipsoid */ \"./node_modules/@jscad/modeling/src/primitives/ellipsoid.js\"),\n  geodesicSphere: __webpack_require__(/*! ./geodesicSphere */ \"./node_modules/@jscad/modeling/src/primitives/geodesicSphere.js\"),\n  line: __webpack_require__(/*! ./line */ \"./node_modules/@jscad/modeling/src/primitives/line.js\"),\n  polygon: __webpack_require__(/*! ./polygon */ \"./node_modules/@jscad/modeling/src/primitives/polygon.js\"),\n  polyhedron: __webpack_require__(/*! ./polyhedron */ \"./node_modules/@jscad/modeling/src/primitives/polyhedron.js\"),\n  rectangle: __webpack_require__(/*! ./rectangle */ \"./node_modules/@jscad/modeling/src/primitives/rectangle.js\"),\n  roundedCuboid: __webpack_require__(/*! ./roundedCuboid */ \"./node_modules/@jscad/modeling/src/primitives/roundedCuboid.js\"),\n  roundedCylinder: __webpack_require__(/*! ./roundedCylinder */ \"./node_modules/@jscad/modeling/src/primitives/roundedCylinder.js\"),\n  roundedRectangle: __webpack_require__(/*! ./roundedRectangle */ \"./node_modules/@jscad/modeling/src/primitives/roundedRectangle.js\"),\n  sphere: __webpack_require__(/*! ./sphere */ \"./node_modules/@jscad/modeling/src/primitives/sphere.js\"),\n  square: __webpack_require__(/*! ./square */ \"./node_modules/@jscad/modeling/src/primitives/square.js\"),\n  star: __webpack_require__(/*! ./star */ \"./node_modules/@jscad/modeling/src/primitives/star.js\"),\n  torus: __webpack_require__(/*! ./torus */ \"./node_modules/@jscad/modeling/src/primitives/torus.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/line.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/line.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * Construct a new line in two dimensional space from the given points.\n * The points must be provided as an array, where each element is 2D point.\n * @param {Array} points - array of points from which to create the path\n * @returns {path2} new 2D path\n * @alias module:modeling/primitives.line\n *\n * @example\n * let myshape = line([[10, 10], [-10, 10]])\n */\nconst line = (points) => {\n  if (!Array.isArray(points)) throw new Error('points must be an array')\n\n  return path2.fromPoints({}, points)\n}\n\nmodule.exports = line\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/line.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/polygon.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/polygon.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\n/**\n * Construct a polygon in two dimensional space from a list of points, or a list of points and paths.\n * NOTE: The ordering of points is VERY IMPORTANT.\n * @param {Object} options - options for construction\n * @param {Array} options.points - points of the polygon : either flat or nested array of points\n * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of points index\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.polygon\n *\n * @example\n * let roof = [[10,11], [0,11], [5,20]]\n * let wall = [[0,0], [10,0], [10,10], [0,10]]\n *\n * let poly = polygon({ points: roof })\n * or\n * let poly = polygon({ points: [roof, wall] })\n * or\n * let poly = polygon({ points: roof, paths: [0, 1, 2] })\n * or\n * let poly = polygon({ points: [roof, wall], paths: [[0, 1, 2], [3, 4, 5, 6]] })\n */\nconst polygon = (options) => {\n  const defaults = {\n    points: [],\n    paths: []\n  }\n  const { points, paths } = Object.assign({}, defaults, options)\n\n  if (!(Array.isArray(points) && Array.isArray(paths))) throw new Error('points and paths must be arrays')\n\n  let listofpolys = points\n  if (Array.isArray(points[0])) {\n    if (!Array.isArray(points[0][0])) {\n      // points is an array of something... convert to list\n      listofpolys = [points]\n    }\n  }\n\n  listofpolys.forEach((list, i) => {\n    if (!Array.isArray(list)) throw new Error('list of points ' + i + ' must be an array')\n    if (list.length < 3) throw new Error('list of points ' + i + ' must contain three or more points')\n    list.forEach((point, j) => {\n      if (!Array.isArray(point)) throw new Error('list of points ' + i + ', point ' + j + ' must be an array')\n      if (point.length < 2) throw new Error('list of points ' + i + ', point ' + j + ' must contain by X and Y values')\n    })\n  })\n\n  let listofpaths = paths\n  if (paths.length === 0) {\n    // create a list of paths based on the points\n    let count = 0\n    listofpaths = listofpolys.map((list) => list.map((point) => count++))\n  }\n\n  // flatten the listofpoints for indexed access\n  const allpoints = []\n  listofpolys.forEach((list) => list.forEach((point) => allpoints.push(point)))\n\n  let sides = []\n  listofpaths.forEach((path) => {\n    const setofpoints = path.map((index) => allpoints[index])\n    const geometry = geom2.fromPoints(setofpoints)\n    sides = sides.concat(geom2.toSides(geometry))\n  })\n  return geom2.create(sides)\n}\n\nmodule.exports = polygon\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/polygon.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/polyhedron.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/polyhedron.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Construct a polyhedron in three dimensional space from the given set of points and faces.\n * The faces can define outward or inward facing polygons (orientation).\n * However, each face must define a counter clockwise rotation of points which follows the right hand rule.\n * @param {Object} options - options for construction\n * @param {Array} options.points=[] - list of points in 3D space\n * @param {Array} options.faces=[] - list of faces, where each face is a set of indexes into the points\n * @param {Array} [options.colors=undefined] - list of RGBA colors to apply to each face\n * @param {Array} [options.orientation='outward'] - orientation of faces\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.polyhedron\n *\n * @example\n * let mypoints = [ [10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10] ]\n * let myfaces = [ [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [1, 0, 3], [2, 1, 3] ]\n * let myshape = polyhedron({points: mypoint, faces: myfaces, orientation: 'inward'})\n */\nconst polyhedron = (options) => {\n  const defaults = {\n    points: [],\n    faces: [],\n    colors: undefined,\n    orientation: 'outward'\n  }\n  const { points, faces, colors, orientation } = Object.assign({}, defaults, options)\n\n  if (!(Array.isArray(points) && Array.isArray(faces))) {\n    throw new Error('points and faces must be arrays')\n  }\n  if (points.length < 3) {\n    throw new Error('three or more points are required')\n  }\n  if (faces.length < 1) {\n    throw new Error('one or more faces are required')\n  }\n  if (colors) {\n    if (!Array.isArray(colors)) {\n      throw new Error('colors must be an array')\n    }\n    if (colors.length !== faces.length) {\n      throw new Error('faces and colors must have the same length')\n    }\n  }\n\n  // invert the faces if orientation is inwards, as all internals expect outwarding facing polygons\n  if (orientation !== 'outward') {\n    faces.forEach((face) => face.reverse())\n  }\n\n  const polygons = faces.map((face, findex) => {\n    const polygon = poly3.fromPoints(face.map((pindex) => points[pindex]))\n    if (colors && colors[findex]) polygon.color = colors[findex]\n    return polygon\n  })\n\n  return geom3.create(polygons)\n}\n\nmodule.exports = polyhedron\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/polyhedron.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/rectangle.js":
/*!******************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/rectangle.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\n/**\n * Construct an axis-aligned rectangle in two dimensional space with four sides and four 90-degree angles.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of rectangle\n * @param {Array} [options.size=[2,2]] - dimension of rectangle, width and length\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.rectangle\n *\n * @example\n * let myshape = rectangle({size: [10, 20]})\n */\nconst rectangle = (options) => {\n  const defaults = {\n    center: [0, 0],\n    size: [2, 2]\n  }\n  const { center, size } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(size)) throw new Error('size must be an array')\n  if (size.length < 2) throw new Error('size must contain X and Y values')\n\n  const point = [size[0] / 2, size[1] / 2]\n  const pswap = [point[0], -point[1]]\n\n  const points = [\n    vec2.subtract(center, point),\n    vec2.add(center, pswap),\n    vec2.add(center, point),\n    vec2.subtract(center, pswap)\n  ]\n  return geom2.fromPoints(points)\n}\n\nmodule.exports = rectangle\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/rectangle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/roundedCuboid.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/roundedCuboid.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\nconst vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\nconst createCorners = (center, size, radius, segments, slice, positive) => {\n  const pitch = (Math.PI / 2) * slice / segments\n  const cospitch = Math.cos(pitch)\n  const sinpitch = Math.sin(pitch)\n\n  const layersegments = segments - slice\n  let layerradius = radius * cospitch\n  let layeroffset = size[2] - (radius - (radius * sinpitch))\n  if (!positive) layeroffset = (radius - (radius * sinpitch)) - size[2]\n\n  layerradius = layerradius > EPS ? layerradius : 0\n\n  const corner0 = vec3.add(center, [size[0] - radius, size[1] - radius, layeroffset])\n  const corner1 = vec3.add(center, [radius - size[0], size[1] - radius, layeroffset])\n  const corner2 = vec3.add(center, [radius - size[0], radius - size[1], layeroffset])\n  const corner3 = vec3.add(center, [size[0] - radius, radius - size[1], layeroffset])\n  const corner0Points = []\n  const corner1Points = []\n  const corner2Points = []\n  const corner3Points = []\n  for (let i = 0; i <= layersegments; i++) {\n    const radians = layersegments > 0 ? Math.PI / 2 * i / layersegments : 0\n    const point2d = vec2.fromAngleRadians(radians)\n    const point3d = vec3.fromVec2(vec2.scale(layerradius, point2d))\n    corner0Points.push(vec3.add(corner0, point3d))\n    vec3.rotateZ(point3d, Math.PI / 2, [0, 0, 0], point3d)\n    corner1Points.push(vec3.add(corner1, point3d))\n    vec3.rotateZ(point3d, Math.PI / 2, [0, 0, 0], point3d)\n    corner2Points.push(vec3.add(corner2, point3d))\n    vec3.rotateZ(point3d, Math.PI / 2, [0, 0, 0], point3d)\n    corner3Points.push(vec3.add(corner3, point3d))\n  }\n  if (!positive) {\n    corner0Points.reverse()\n    corner1Points.reverse()\n    corner2Points.reverse()\n    corner3Points.reverse()\n    return [corner3Points, corner2Points, corner1Points, corner0Points]\n  }\n  return [corner0Points, corner1Points, corner2Points, corner3Points]\n}\n\nconst stitchCorners = (previousCorners, currentCorners) => {\n  const polygons = []\n  for (let i = 0; i < previousCorners.length; i++) {\n    const previous = previousCorners[i]\n    const current = currentCorners[i]\n    for (let j = 0; j < (previous.length - 1); j++) {\n      polygons.push(poly3.fromPoints([previous[j], previous[j + 1], current[j]]))\n\n      if (j < (current.length - 1)) {\n        polygons.push(poly3.fromPoints([current[j], previous[j + 1], current[j + 1]]))\n      }\n    }\n  }\n  return polygons\n}\n\nconst stitchWalls = (previousCorners, currentCorners) => {\n  const polygons = []\n  for (let i = 0; i < previousCorners.length; i++) {\n    let previous = previousCorners[i]\n    let current = currentCorners[i]\n    const p0 = previous[previous.length - 1]\n    const c0 = current[current.length - 1]\n\n    const j = (i + 1) % previousCorners.length\n    previous = previousCorners[j]\n    current = currentCorners[j]\n    const p1 = previous[0]\n    const c1 = current[0]\n\n    polygons.push(poly3.fromPoints([p0, p1, c1, c0]))\n  }\n  return polygons\n}\n\nconst stitchSides = (bottomCorners, topCorners) => {\n  // make a copy and reverse the bottom corners\n  bottomCorners = [bottomCorners[3], bottomCorners[2], bottomCorners[1], bottomCorners[0]]\n  bottomCorners = bottomCorners.map((corner) => corner.slice().reverse())\n\n  const bottomPoints = []\n  bottomCorners.forEach((corner) => {\n    corner.forEach((point) => bottomPoints.push(point))\n  })\n\n  const topPoints = []\n  topCorners.forEach((corner) => {\n    corner.forEach((point) => topPoints.push(point))\n  })\n\n  const polygons = []\n  for (let i = 0; i < topPoints.length; i++) {\n    const j = (i + 1) % topPoints.length\n    polygons.push(poly3.fromPoints([bottomPoints[i], bottomPoints[j], topPoints[j], topPoints[i]]))\n  }\n  return polygons\n}\n\n/**\n * Construct an axis-aligned solid cuboid in three dimensions with rounded edges.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of rounded cube\n * @param {Array} [options.size=[2,2,2]] - dimension of rounded cube; width, depth, height\n * @param {Number} [options.roundRadius=0.2] - radius of rounded edges\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.roundedCuboid\n *\n * @example\n * let mycube = roundedCuboid({\n *   size: [10, 20, 10],\n *   roundRadius: 2,\n *   segments: 16,\n * });\n */\nconst roundedCuboid = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    size: [2, 2, 2],\n    roundRadius: 0.2,\n    segments: 32\n  }\n  let { center, size, roundRadius, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(size)) throw new Error('size must be an array')\n  if (size.length < 3) throw new Error('size must contain width, depth and height values')\n\n  if (!Number.isFinite(roundRadius)) throw new Error('roundRadius must be a number')\n\n  size = size.map((v) => v / 2) // convert to radius\n\n  if (roundRadius > (size[0] - EPS) ||\n      roundRadius > (size[1] - EPS) ||\n      roundRadius > (size[2] - EPS)) throw new Error('roundRadius must be smaller then the radius of all dimensions')\n\n  segments = Math.floor(segments / 4)\n  if (segments < 1) throw new Error('segments must be four or more')\n\n  let prevCornersPos = null\n  let prevCornersNeg = null\n  let polygons = []\n  for (let slice = 0; slice <= segments; slice++) {\n    const cornersPos = createCorners(center, size, roundRadius, segments, slice, true)\n    const cornersNeg = createCorners(center, size, roundRadius, segments, slice, false)\n\n    if (slice === 0) {\n      polygons = polygons.concat(stitchSides(cornersNeg, cornersPos))\n    }\n\n    if (prevCornersPos) {\n      polygons = polygons.concat(stitchCorners(prevCornersPos, cornersPos),\n        stitchWalls(prevCornersPos, cornersPos))\n    }\n    if (prevCornersNeg) {\n      polygons = polygons.concat(stitchCorners(prevCornersNeg, cornersNeg),\n        stitchWalls(prevCornersNeg, cornersNeg))\n    }\n\n    if (slice === segments) {\n      // add the top\n      let points = cornersPos.map((corner) => corner[0])\n      polygons.push(poly3.fromPoints(points))\n      // add the bottom\n      points = cornersNeg.map((corner) => corner[0])\n      polygons.push(poly3.fromPoints(points))\n    }\n\n    prevCornersPos = cornersPos\n    prevCornersNeg = cornersNeg\n  }\n\n  return geom3.create(polygons)\n}\n\nmodule.exports = roundedCuboid\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/roundedCuboid.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/roundedCylinder.js":
/*!************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/roundedCylinder.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec3 = __webpack_require__(/*! ../maths/vec3 */ \"./node_modules/@jscad/modeling/src/maths/vec3/index.js\")\n\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst poly3 = __webpack_require__(/*! ../geometries/poly3 */ \"./node_modules/@jscad/modeling/src/geometries/poly3/index.js\")\n\n/**\n * Construct a solid cylinder in three dimensional space with rounded ends.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of cylinder\n * @param {Array} [options.height=2] - height of cylinder\n * @param {Number} [options.radius=1] - radius of cylinder\n * @param {Number} [options.roundRadius=0.2] - radius of rounded edges\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.roundedCylinder\n *\n * @example\n * let myshape = roundedCylinder({\n *   height: 10,\n *   radius: 2,\n *   roundRadius: 0.5\n * })\n */\nconst roundedCylinder = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    height: 2,\n    radius: 1,\n    roundRadius: 0.2,\n    segments: 32\n  }\n  const { center, height, radius, roundRadius, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(center)) throw new Error('center must be an array')\n  if (center.length < 3) throw new Error('center must contain X, Y and Z values')\n\n  if (height < (EPS * 2)) throw new Error('height must be larger then zero')\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  if (roundRadius > (radius - EPS)) throw new Error('roundRadius must be smaller then the radius')\n\n  if (segments < 4) throw new Error('segments must be four or more')\n\n  const start = [0, 0, -(height / 2)]\n  const end = [0, 0, height / 2]\n  const direction = vec3.subtract(end, start)\n  const length = vec3.length(direction)\n\n  if ((2 * roundRadius) > (length - EPS)) throw new Error('the cylinder height must be larger than twice roundRadius')\n\n  let defaultnormal\n  if (Math.abs(direction[0]) > Math.abs(direction[1])) {\n    defaultnormal = vec3.fromValues(0, 1, 0)\n  } else {\n    defaultnormal = vec3.fromValues(1, 0, 0)\n  }\n\n  const zvector = vec3.scale(roundRadius, vec3.unit(direction))\n  const xvector = vec3.scale(radius, vec3.unit(vec3.cross(zvector, defaultnormal)))\n  const yvector = vec3.scale(radius, vec3.unit(vec3.cross(xvector, zvector)))\n\n  vec3.add(start, start, zvector)\n  vec3.subtract(end, end, zvector)\n\n  const qsegments = Math.floor(0.25 * segments)\n\n  // adjust the points to center\n  const fromPoints = (points) => {\n    const newpoints = points.map((point) => vec3.add(point, center))\n    return poly3.fromPoints(newpoints)\n  }\n\n  const polygons = []\n  let prevcylinderpoint\n  for (let slice1 = 0; slice1 <= segments; slice1++) {\n    const angle = Math.PI * 2.0 * slice1 / segments\n    const cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))\n    if (slice1 > 0) {\n      // cylinder wall\n      let points = []\n      points.push(vec3.add(start, cylinderpoint))\n      points.push(vec3.add(start, prevcylinderpoint))\n      points.push(vec3.add(end, prevcylinderpoint))\n      points.push(vec3.add(end, cylinderpoint))\n      polygons.push(fromPoints(points))\n\n      let prevcospitch, prevsinpitch\n      for (let slice2 = 0; slice2 <= qsegments; slice2++) {\n        const pitch = 0.5 * Math.PI * slice2 / qsegments\n        const cospitch = Math.cos(pitch)\n        const sinpitch = Math.sin(pitch)\n        if (slice2 > 0) {\n          // cylinder rounding, start\n          points = []\n          let point\n          point = vec3.add(start, vec3.subtract(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector)))\n          points.push(point)\n          point = vec3.add(start, vec3.subtract(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector)))\n          points.push(point)\n          if (slice2 < qsegments) {\n            point = vec3.add(start, vec3.subtract(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector)))\n            points.push(point)\n          }\n          point = vec3.add(start, vec3.subtract(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector)))\n          points.push(point)\n\n          polygons.push(fromPoints(points))\n\n          // cylinder rounding, end\n          points = []\n          point = vec3.add(end, vec3.add(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector)))\n          points.push(point)\n          point = vec3.add(end, vec3.add(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector)))\n          points.push(point)\n          if (slice2 < qsegments) {\n            point = vec3.add(end, vec3.add(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector)))\n            points.push(point)\n          }\n          point = vec3.add(end, vec3.add(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector)))\n          points.push(point)\n          points.reverse()\n\n          polygons.push(fromPoints(points))\n        }\n        prevcospitch = cospitch\n        prevsinpitch = sinpitch\n      }\n    }\n    prevcylinderpoint = cylinderpoint\n  }\n  const result = geom3.create(polygons)\n  return result\n}\n\nmodule.exports = roundedCylinder\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/roundedCylinder.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/roundedRectangle.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/roundedRectangle.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { EPS } = __webpack_require__(/*! ../maths/constants */ \"./node_modules/@jscad/modeling/src/maths/constants.js\")\n\nconst vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\n/**\n * Construct a rounded rectangle in two dimensional space.\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of rounded rectangle\n * @param {Array} [options.size=[2,2]] - dimension of rounded rectangle; width and length\n * @param {Number} [options.roundRadius=0.2] - round radius of corners\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.roundedRectangle\n *\n * @example\n * let myshape = roundedRectangle({size: [10, 20], roundRadius: 2})\n */\nconst roundedRectangle = (options) => {\n  const defaults = {\n    center: [0, 0],\n    size: [2, 2],\n    roundRadius: 0.2,\n    segments: 32\n  }\n  let { center, size, roundRadius, segments } = Object.assign({}, defaults, options)\n\n  if (!Array.isArray(size)) throw new Error('size must be an array')\n  if (size.length < 2) throw new Error('size must contain width and length values')\n\n  if (!Number.isFinite(roundRadius)) throw new Error('roundRadius must be a number')\n\n  size = size.map((v) => v / 2) // convert to radius\n\n  if (roundRadius > (size[0] - EPS) ||\n      roundRadius > (size[1] - EPS)) throw new Error('roundRadius must be smaller then the radius of all dimensions')\n\n  const cornersegments = Math.floor(segments / 4)\n  if (cornersegments < 1) throw new Error('segments must be four or more')\n\n  // create sets of points that define the corners\n  const corner0 = vec2.add(center, [size[0] - roundRadius, size[1] - roundRadius])\n  const corner1 = vec2.add(center, [roundRadius - size[0], size[1] - roundRadius])\n  const corner2 = vec2.add(center, [roundRadius - size[0], roundRadius - size[1]])\n  const corner3 = vec2.add(center, [size[0] - roundRadius, roundRadius - size[1]])\n  const corner0Points = []\n  const corner1Points = []\n  const corner2Points = []\n  const corner3Points = []\n  for (let i = 0; i <= cornersegments; i++) {\n    const radians = Math.PI / 2 * i / cornersegments\n    const point = vec2.fromAngleRadians(radians)\n    vec2.scale(point, roundRadius, point)\n    corner0Points.push(vec2.add(corner0, point))\n    vec2.rotate(point, Math.PI / 2, point)\n    corner1Points.push(vec2.add(corner1, point))\n    vec2.rotate(point, Math.PI / 2, point)\n    corner2Points.push(vec2.add(corner2, point))\n    vec2.rotate(point, Math.PI / 2, point)\n    corner3Points.push(vec2.add(corner3, point))\n  }\n\n  return geom2.fromPoints(corner0Points.concat(corner1Points, corner2Points, corner3Points))\n}\n\nmodule.exports = roundedRectangle\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/roundedRectangle.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/sphere.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/sphere.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ellipsoid = __webpack_require__(/*! ./ellipsoid */ \"./node_modules/@jscad/modeling/src/primitives/ellipsoid.js\")\n\n/**\n * Construct a sphere in three dimensional space where are points are at the same distance from the center.\n * @see [ellipsoid]{@link module:modeling/primitives.ellipsoid} for more options\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0,0]] - center of sphere\n * @param {Number} [options.radius=1] - radius of sphere\n * @param {Number} [options.segments=32] - number of segments to create per full rotation\n * @param {Array} [options.axes] -  an array with three vectors for the x, y and z base vectors\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.sphere\n *\n * @example\n * let myshape = sphere({radius: 5})\n */\nconst sphere = (options) => {\n  const defaults = {\n    center: [0, 0, 0],\n    radius: 1,\n    segments: 32,\n    axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]\n  }\n  let { center, radius, segments, axes } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(radius)) throw new Error('radius must be a number')\n\n  radius = [radius, radius, radius]\n\n  return ellipsoid({ center, radius, segments, axes })\n}\n\nmodule.exports = sphere\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/sphere.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/square.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/square.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const rectangle = __webpack_require__(/*! ./rectangle */ \"./node_modules/@jscad/modeling/src/primitives/rectangle.js\")\n\n/**\n * Construct an axis-aligned square in two dimensional space with four equal sides and four 90-degree angles.\n * @see [rectangle]{@link module:modeling/primitives.rectangle} for more options\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of square\n * @param {Number} [options.size=2] - dimension of square\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.square\n *\n * @example\n * let myshape = square({size: 10})\n */\nconst square = (options) => {\n  const defaults = {\n    center: [0, 0],\n    size: 2\n  }\n  let { center, size } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(size)) throw new Error('size must be a number')\n\n  size = [size, size]\n\n  return rectangle({ center, size })\n}\n\nmodule.exports = square\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/square.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/star.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/star.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vec2 = __webpack_require__(/*! ../maths/vec2 */ \"./node_modules/@jscad/modeling/src/maths/vec2/index.js\")\n\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\n\n// @see http://www.jdawiseman.com/papers/easymath/surds_star_inner_radius.html\nconst getRadiusRatio = (vertices, density) => {\n  if (vertices > 0 && density > 1 && density < vertices / 2) {\n    return Math.cos(Math.PI * density / vertices) / Math.cos(Math.PI * (density - 1) / vertices)\n  }\n  return 0\n}\n\nconst getPoints = (vertices, radius, startAngle, center) => {\n  const a = (Math.PI * 2) / vertices\n\n  const points = []\n  for (let i = 0; i < vertices; i++) {\n    const point = vec2.fromAngleRadians(a * i + startAngle)\n    vec2.scale(point, radius, point)\n    vec2.add(point, center, point)\n    points.push(point)\n  }\n  return points\n}\n\n/**\n * Construct a star in two dimensional space.\n * @see https://en.wikipedia.org/wiki/Star_polygon\n * @param {Object} [options] - options for construction\n * @param {Array} [options.center=[0,0]] - center of star\n * @param {Number} [options.vertices=5] - number of vertices (P) on the star\n * @param {Number} [options.density=2] - density (Q) of star\n * @param {Number} [options.outerRadius=1] - outer radius of vertices\n * @param {Number} [options.innerRadius=0] - inner radius of vertices, or zero to calculate\n * @param {Number} [options.startAngle=0] - starting angle for first vertice, in radians\n * @returns {geom2} new 2D geometry\n * @alias module:modeling/primitives.star\n *\n * @example\n * let star1 = star({vertices: 8, outerRadius: 10}) // star with 8/2 density\n * let star2 = star({vertices: 12, outerRadius: 40, innerRadius: 20}) // star with given radius\n */\nconst star = (options) => {\n  const defaults = {\n    center: [0, 0],\n    vertices: 5,\n    outerRadius: 1,\n    innerRadius: 0,\n    density: 2,\n    startAngle: 0\n  }\n  let { center, vertices, outerRadius, innerRadius, density, startAngle } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(outerRadius)) throw new Error('outerRadius must be a number')\n  if (!Number.isFinite(innerRadius)) throw new Error('innerRadius must be a number')\n\n  if (startAngle < 0) throw new Error('startAngle must be positive')\n\n  startAngle = startAngle % (Math.PI * 2)\n\n  // force integers\n  vertices = Math.floor(vertices)\n  density = Math.floor(density)\n\n  if (innerRadius === 0) {\n    innerRadius = outerRadius * getRadiusRatio(vertices, density)\n  }\n\n  const centerv = vec2.fromArray(center)\n\n  const outerPoints = getPoints(vertices, outerRadius, startAngle, centerv)\n  const innerPoints = getPoints(vertices, innerRadius, startAngle + Math.PI / vertices, centerv)\n\n  const allPoints = []\n  for (let i = 0; i < vertices; i++) {\n    allPoints.push(outerPoints[i])\n    allPoints.push(innerPoints[i])\n  }\n\n  return geom2.fromPoints(allPoints)\n}\n\nmodule.exports = star\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/star.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/primitives/torus.js":
/*!**************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/primitives/torus.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const extrudeRotate = __webpack_require__(/*! ../operations/extrusions/extrudeRotate */ \"./node_modules/@jscad/modeling/src/operations/extrusions/extrudeRotate.js\")\nconst { rotate } = __webpack_require__(/*! ../operations/transforms/rotate */ \"./node_modules/@jscad/modeling/src/operations/transforms/rotate.js\")\nconst { translate } = __webpack_require__(/*! ../operations/transforms/translate */ \"./node_modules/@jscad/modeling/src/operations/transforms/translate.js\")\n\nconst circle = __webpack_require__(/*! ./circle */ \"./node_modules/@jscad/modeling/src/primitives/circle.js\")\n\n/**\n * Construct a torus by revolving a small circle (inner) about the circumference of a large (outer) circle.\n * @param {Object} [options] - options for construction\n * @param {Float} [options.innerRadius=1] - radius of small (inner) circle\n * @param {Float} [options.outerRadius=4] - radius of large (outer) circle\n * @param {Integer} [options.innerSegments=32] - number of segments to create per rotation\n * @param {Integer} [options.outerSegments=32] - number of segments to create per rotation\n * @param {Integer} [options.innerRotation=0] - rotation of small (inner) circle in radians\n * @param {Float} [options.outerRotation=(PI * 2)] - rotation (outer) of the torus (RADIANS)\n * @param {Float} [options.startAngle=0] - start angle of the torus (RADIANS)\n * @returns {geom3} new 3D geometry\n * @alias module:modeling/primitives.torus\n *\n * @example\n * let myshape = torus({\n *   innerRadius: 10,\n *   outerRadius: 100\n * })\n */\nconst torus = (options) => {\n  const defaults = {\n    innerRadius: 1,\n    innerSegments: 32,\n    outerRadius: 4,\n    outerSegments: 32,\n    innerRotation: 0,\n    startAngle: 0,\n    outerRotation: Math.PI * 2\n  }\n  const { innerRadius, innerSegments, outerRadius, outerSegments, innerRotation, startAngle, outerRotation } = Object.assign({}, defaults, options)\n\n  if (!Number.isFinite(innerRadius)) throw new Error('innerRadius must be a number')\n  if (!Number.isFinite(outerRadius)) throw new Error('outerRadius must be a number')\n\n  if (innerRadius >= outerRadius) throw new Error('inner circle is two large to rotate about the outer circle')\n\n  let innerCircle = translate([outerRadius, 0], circle({ radius: innerRadius, segments: innerSegments }))\n\n  if (innerRotation !== 0) innerCircle = rotate([0, 0, innerRotation], innerCircle)\n\n  options = {\n    startAngle: startAngle,\n    angle: outerRotation,\n    segments: outerSegments\n  }\n  return extrudeRotate(options, innerCircle)\n}\n\nmodule.exports = torus\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/primitives/torus.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/text/fonts/single-line/hershey/simplex.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/text/fonts/single-line/hershey/simplex.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// -- data source from from http://paulbourke.net/dataformats/hershey/\n// -- reduced to save some bytes...\n// { [ascii code]: [width, x, y, ...] } - undefined value as path separator\nmodule.exports = {\n  height: 14,\n  32: [16],\n  33: [10, 5, 21, 5, 7, undefined, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],\n  34: [16, 4, 21, 4, 14, undefined, 12, 21, 12, 14],\n  35: [21, 11, 25, 4, -7, undefined, 17, 25, 10, -7, undefined, 4, 12, 18, 12, undefined, 3, 6, 17, 6],\n  36: [20, 8, 25, 8, -4, undefined, 12, 25, 12, -4, undefined, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],\n  37: [24, 21, 21, 3, 0, undefined, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, undefined, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7],\n  38: [26, 23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2],\n  39: [10, 5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15],\n  40: [14, 11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7],\n  41: [14, 3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7],\n  42: [16, 8, 21, 8, 9, undefined, 3, 18, 13, 12, undefined, 13, 18, 3, 12],\n  43: [26, 13, 18, 13, 0, undefined, 4, 9, 22, 9],\n  44: [10, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],\n  45: [26, 4, 9, 22, 9],\n  46: [10, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],\n  47: [22, 20, 25, 2, -7],\n  48: [20, 9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21],\n  49: [20, 6, 17, 8, 18, 11, 21, 11, 0],\n  50: [20, 4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0],\n  51: [20, 5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],\n  52: [20, 13, 21, 3, 7, 18, 7, undefined, 13, 21, 13, 0],\n  53: [20, 15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],\n  54: [20, 16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7],\n  55: [20, 17, 21, 7, 0, undefined, 3, 21, 17, 21],\n  56: [20, 8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21],\n  57: [20, 16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3],\n  58: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, undefined, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],\n  59: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, undefined, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],\n  60: [24, 20, 18, 4, 9, 20, 0],\n  61: [26, 4, 12, 22, 12, undefined, 4, 6, 22, 6],\n  62: [24, 4, 18, 20, 9, 4, 0],\n  63: [18, 3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, undefined, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2],\n  64: [27, 18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, undefined, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, undefined, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, undefined, 19, 16, 18, 8, 18, 6, 19, 5],\n  65: [18, 9, 21, 1, 0, undefined, 9, 21, 17, 0, undefined, 4, 7, 14, 7],\n  66: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, undefined, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0],\n  67: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5],\n  68: [21, 4, 21, 4, 0, undefined, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0],\n  69: [19, 4, 21, 4, 0, undefined, 4, 21, 17, 21, undefined, 4, 11, 12, 11, undefined, 4, 0, 17, 0],\n  70: [18, 4, 21, 4, 0, undefined, 4, 21, 17, 21, undefined, 4, 11, 12, 11],\n  71: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, undefined, 13, 8, 18, 8],\n  72: [22, 4, 21, 4, 0, undefined, 18, 21, 18, 0, undefined, 4, 11, 18, 11],\n  73: [8, 4, 21, 4, 0],\n  74: [16, 12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7],\n  75: [21, 4, 21, 4, 0, undefined, 18, 21, 4, 7, undefined, 9, 12, 18, 0],\n  76: [17, 4, 21, 4, 0, undefined, 4, 0, 16, 0],\n  77: [24, 4, 21, 4, 0, undefined, 4, 21, 12, 0, undefined, 20, 21, 12, 0, undefined, 20, 21, 20, 0],\n  78: [22, 4, 21, 4, 0, undefined, 4, 21, 18, 0, undefined, 18, 21, 18, 0],\n  79: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21],\n  80: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10],\n  81: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, undefined, 12, 4, 18, -2],\n  82: [21, 4, 21, 4, 0, undefined, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, undefined, 11, 11, 18, 0],\n  83: [20, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],\n  84: [16, 8, 21, 8, 0, undefined, 1, 21, 15, 21],\n  85: [22, 4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21],\n  86: [18, 1, 21, 9, 0, undefined, 17, 21, 9, 0],\n  87: [24, 2, 21, 7, 0, undefined, 12, 21, 7, 0, undefined, 12, 21, 17, 0, undefined, 22, 21, 17, 0],\n  88: [20, 3, 21, 17, 0, undefined, 17, 21, 3, 0],\n  89: [18, 1, 21, 9, 11, 9, 0, undefined, 17, 21, 9, 11],\n  90: [20, 17, 21, 3, 0, undefined, 3, 21, 17, 21, undefined, 3, 0, 17, 0],\n  91: [14, 4, 25, 4, -7, undefined, 5, 25, 5, -7, undefined, 4, 25, 11, 25, undefined, 4, -7, 11, -7],\n  92: [14, 0, 21, 14, -3],\n  93: [14, 9, 25, 9, -7, undefined, 10, 25, 10, -7, undefined, 3, 25, 10, 25, undefined, 3, -7, 10, -7],\n  94: [16, 6, 15, 8, 18, 10, 15, undefined, 3, 12, 8, 17, 13, 12, undefined, 8, 17, 8, 0],\n  95: [16, 0, -2, 16, -2],\n  96: [10, 6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17],\n  97: [19, 15, 14, 15, 0, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  98: [19, 4, 21, 4, 0, undefined, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],\n  99: [18, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  100: [19, 15, 21, 15, 0, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  101: [18, 3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  102: [12, 10, 21, 8, 21, 6, 20, 5, 17, 5, 0, undefined, 2, 14, 9, 14],\n  103: [19, 15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  104: [19, 4, 21, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],\n  105: [8, 3, 21, 4, 20, 5, 21, 4, 22, 3, 21, undefined, 4, 14, 4, 0],\n  106: [10, 5, 21, 6, 20, 7, 21, 6, 22, 5, 21, undefined, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7],\n  107: [17, 4, 21, 4, 0, undefined, 14, 14, 4, 4, undefined, 8, 8, 15, 0],\n  108: [8, 4, 21, 4, 0],\n  109: [30, 4, 14, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, undefined, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0],\n  110: [19, 4, 14, 4, 0, undefined, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],\n  111: [19, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14],\n  112: [19, 4, 14, 4, -7, undefined, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],\n  113: [19, 15, 14, 15, -7, undefined, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],\n  114: [13, 4, 14, 4, 0, undefined, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14],\n  115: [17, 14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3],\n  116: [12, 5, 21, 5, 4, 6, 1, 8, 0, 10, 0, undefined, 2, 14, 9, 14],\n  117: [19, 4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, undefined, 15, 14, 15, 0],\n  118: [16, 2, 14, 8, 0, undefined, 14, 14, 8, 0],\n  119: [22, 3, 14, 7, 0, undefined, 11, 14, 7, 0, undefined, 11, 14, 15, 0, undefined, 19, 14, 15, 0],\n  120: [17, 3, 14, 14, 0, undefined, 14, 14, 3, 0],\n  121: [16, 2, 14, 8, 0, undefined, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7],\n  122: [17, 14, 14, 3, 0, undefined, 3, 14, 14, 14, undefined, 3, 0, 14, 0],\n  123: [14, 9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, undefined, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, undefined, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7],\n  124: [8, 4, 25, 4, -7],\n  125: [14, 5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, undefined, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, undefined, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7],\n  126: [24, 3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, undefined, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/text/fonts/single-line/hershey/simplex.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/text/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/text/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * @module modeling/text\n */\nmodule.exports = {\n  vectorChar: __webpack_require__(/*! ./vectorChar */ \"./node_modules/@jscad/modeling/src/text/vectorChar.js\"),\n  vectorText: __webpack_require__(/*! ./vectorText */ \"./node_modules/@jscad/modeling/src/text/vectorText.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/text/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/text/vectorChar.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/text/vectorChar.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vectorParams = __webpack_require__(/*! ./vectorParams */ \"./node_modules/@jscad/modeling/src/text/vectorParams.js\")\n\n/** Represents a character as segments\n* @typedef {Object} VectorCharObject\n* @property {Float} width - character width\n* @property {Float} height - character height (uppercase)\n* @property {Array} segments - character segments [[[x, y], ...], ...]\n*/\n\n/** Construct a {@link VectorCharObject} from a ascii character whose code is between 31 and 127,\n* if the character is not supported it is replaced by a question mark.\n* @param {Object|String} [options] - options for construction or ascii character\n* @param {Float} [options.xOffset=0] - x offset\n* @param {Float} [options.yOffset=0] - y offset\n* @param {Float} [options.height=21] - font size (uppercase height)\n* @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character\n* @param {String} [options.input='?'] - ascii character (ignored/overwrited if provided as seconds parameter)\n* @param {String} [char='?'] - ascii character\n* @returns {VectorCharObject}\n* @alias module:modeling/text.vectorChar\n*\n* @example\n* let vectorCharObject = vectorChar()\n* or\n* let vectorCharObject = vectorChar('A')\n* or\n* let vectorCharObject = vectorChar({ xOffset: 57 }, 'C')\n* or\n* let vectorCharObject = vectorChar({ xOffset: 78, input: '!' })\n*/\nconst vectorChar = (options, char) => {\n  const {\n    xOffset, yOffset, input, font, height, extrudeOffset\n  } = vectorParams(options, char)\n  let code = input.charCodeAt(0)\n  if (!code || !font[code]) {\n    code = 63 // 63 => ?\n  }\n  const glyph = [].concat(font[code])\n  const ratio = (height - extrudeOffset) / font.height\n  const extrudeYOffset = (extrudeOffset / 2)\n  const width = glyph.shift() * ratio\n  const segments = []\n  let polyline = []\n  for (let i = 0, il = glyph.length; i < il; i += 2) {\n    const gx = ratio * glyph[i] + xOffset\n    const gy = ratio * glyph[i + 1] + yOffset + extrudeYOffset\n    if (glyph[i] !== undefined) {\n      polyline.push([gx, gy])\n      continue\n    }\n    segments.push(polyline)\n    polyline = []\n    i--\n  }\n  if (polyline.length) {\n    segments.push(polyline)\n  }\n  return { width, height, segments }\n}\n\nmodule.exports = vectorChar\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/text/vectorChar.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/text/vectorParams.js":
/*!***************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/text/vectorParams.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const defaultFont = __webpack_require__(/*! ./fonts/single-line/hershey/simplex.js */ \"./node_modules/@jscad/modeling/src/text/fonts/single-line/hershey/simplex.js\")\n\nconst defaultsVectorParams = {\n  xOffset: 0,\n  yOffset: 0,\n  input: '?',\n  align: 'left',\n  font: defaultFont,\n  height: 14, // == old vector_xxx simplex font height\n  lineSpacing: 2.142857142857143, // == 30/14 == old vector_xxx ratio\n  letterSpacing: 1,\n  extrudeOffset: 0\n}\n\n// vectorsXXX parameters handler\nconst vectorParams = (options, input) => {\n  if (!input && typeof options === 'string') {\n    options = { input: options }\n  }\n  options = options || {}\n  const params = Object.assign({}, defaultsVectorParams, options)\n  params.input = input || params.input\n  return params\n}\n\nmodule.exports = vectorParams\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/text/vectorParams.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/text/vectorText.js":
/*!*************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/text/vectorText.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const vectorChar = __webpack_require__(/*! ./vectorChar */ \"./node_modules/@jscad/modeling/src/text/vectorChar.js\")\nconst vectorParams = __webpack_require__(/*! ./vectorParams */ \"./node_modules/@jscad/modeling/src/text/vectorParams.js\")\n\n// translate text line\nconst translateLine = (options, line) => {\n  const { x, y } = Object.assign({ x: 0, y: 0 }, options || {})\n  const segments = line.segments\n  let segment = null\n  let point = null\n  for (let i = 0, il = segments.length; i < il; i++) {\n    segment = segments[i]\n    for (let j = 0, jl = segment.length; j < jl; j++) {\n      point = segment[j]\n      segment[j] = [point[0] + x, point[1] + y]\n    }\n  }\n  return line\n}\n\n/** Represents a character as segments\n* @typedef {Object} VectorCharObject\n* @property {Float} width - character width\n* @property {Float} height - character height (uppercase)\n* @property {Array} segments - character segments [[[x, y], ...], ...]\n*/\n\n/** Construct an array of character segments from a ascii string whose characters code is between 31 and 127,\n* if one character is not supported it is replaced by a question mark.\n* @param {Object|String} [options] - options for construction or ascii string\n* @param {Float} [options.xOffset=0] - x offset\n* @param {Float} [options.yOffset=0] - y offset\n* @param {Float} [options.height=21] - font size (uppercase height)\n* @param {Float} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size\n* @param {Float} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size\n* @param {String} [options.align='left'] - multi-line text alignement: left, center or right\n* @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character\n* @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)\n* @param {String} [text='?'] - ascii string\n* @returns {Array} characters segments [[[x, y], ...], ...]\n* @alias module:modeling/text.vectorText\n*\n* @example\n* let textSegments = vectorText()\n* or\n* let textSegments = vectorText('OpenJSCAD')\n* or\n* let textSegments = vectorText({ yOffset: -50 }, 'OpenJSCAD')\n* or\n* let textSegments = vectorText({ yOffset: -80, input: 'OpenJSCAD' })\n*/\nconst vectorText = (options, text) => {\n  const {\n    xOffset, yOffset, input, font, height, align, extrudeOffset, lineSpacing, letterSpacing\n  } = vectorParams(options, text)\n  let [x, y] = [xOffset, yOffset]\n  let [i, il, char, vect, width, diff] = []\n  let line = { width: 0, segments: [] }\n  const lines = []\n  let output = []\n  let maxWidth = 0\n  const lineStart = x\n  const pushLine = () => {\n    lines.push(line)\n    maxWidth = Math.max(maxWidth, line.width)\n    line = { width: 0, segments: [] }\n  }\n  for (i = 0, il = input.length; i < il; i++) {\n    char = input[i]\n    vect = vectorChar({ xOffset: x, yOffset: y, font, height, extrudeOffset }, char)\n    if (char === '\\n') {\n      x = lineStart\n      y -= vect.height * lineSpacing\n      pushLine()\n      continue\n    }\n    width = vect.width * letterSpacing\n    line.width += width\n    x += width\n    if (char !== ' ') {\n      line.segments = line.segments.concat(vect.segments)\n    }\n  }\n  if (line.segments.length) {\n    pushLine()\n  }\n  for (i = 0, il = lines.length; i < il; i++) {\n    line = lines[i]\n    if (maxWidth > line.width) {\n      diff = maxWidth - line.width\n      if (align === 'right') {\n        line = translateLine({ x: diff }, line)\n      } else if (align === 'center') {\n        line = translateLine({ x: diff / 2 }, line)\n      }\n    }\n    output = output.concat(line.segments)\n  }\n  return output\n}\n\nmodule.exports = vectorText\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/text/vectorText.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// list of supported geometries\nconst geom2 = __webpack_require__(/*! ../geometries/geom2 */ \"./node_modules/@jscad/modeling/src/geometries/geom2/index.js\")\nconst geom3 = __webpack_require__(/*! ../geometries/geom3 */ \"./node_modules/@jscad/modeling/src/geometries/geom3/index.js\")\nconst path2 = __webpack_require__(/*! ../geometries/path2 */ \"./node_modules/@jscad/modeling/src/geometries/path2/index.js\")\n\n/**\n * @param {Array} shapes - list of shapes to compare\n * @returns {Boolean} true if the given shapes are of the same type\n * @alias module:modeling/utils.areAllShapesTheSameType\n */\nconst areAllShapesTheSameType = (shapes) => {\n  let previousType\n  shapes.forEach((shape) => {\n    let currentType = 0\n    if (geom2.isA(shape)) currentType = 1\n    if (geom3.isA(shape)) currentType = 2\n    if (path2.isA(shape)) currentType = 3\n\n    if (previousType && currentType !== previousType) return false\n    previousType = currentType\n  })\n  return true\n}\n\nmodule.exports = areAllShapesTheSameType\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/degToRad.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/degToRad.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert the given angle (degrees) to radians.\n * @param {Number} degrees - angle in degrees\n * @returns {Number} angle in radians\n * @alias module:modeling/utils.degToRad\n */\nconst degToRad = (degrees) => degrees * 0.017453292519943295\n\nmodule.exports = degToRad\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/degToRad.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/flatten.js":
/*!***********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/flatten.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Flatten the given list of arguments into a single flat array.\n * The arguments can be composed of multiple depths of objects and arrays.\n * @param {Array} arr - list of arguments\n * @returns {Array} a flat list of arguments\n * @alias module:modeling/utils.flatten\n */\nconst flatten = (arr) => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])\n\nmodule.exports = flatten\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/flatten.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/fnNumberSort.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/fnNumberSort.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * @alias module:modeling/utils.fnNumberSort\n */\nconst fnNumberSort = (a, b) => a - b\n\nmodule.exports = fnNumberSort\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/fnNumberSort.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Utility functions of various sorts.\n * @module modeling/utils\n * @example\n * const { flatten, insertSorted } = require('@jscad/modeling').utils\n */\nmodule.exports = {\n  areAllShapesTheSameType: __webpack_require__(/*! ./areAllShapesTheSameType */ \"./node_modules/@jscad/modeling/src/utils/areAllShapesTheSameType.js\"),\n  degToRad: __webpack_require__(/*! ./degToRad */ \"./node_modules/@jscad/modeling/src/utils/degToRad.js\"),\n  flatten: __webpack_require__(/*! ./flatten */ \"./node_modules/@jscad/modeling/src/utils/flatten.js\"),\n  fnNumberSort: __webpack_require__(/*! ./fnNumberSort */ \"./node_modules/@jscad/modeling/src/utils/fnNumberSort.js\"),\n  insertSorted: __webpack_require__(/*! ./insertSorted */ \"./node_modules/@jscad/modeling/src/utils/insertSorted.js\"),\n  radiusToSegments: __webpack_require__(/*! ./radiusToSegments */ \"./node_modules/@jscad/modeling/src/utils/radiusToSegments.js\"),\n  radToDeg: __webpack_require__(/*! ./radToDeg */ \"./node_modules/@jscad/modeling/src/utils/radToDeg.js\")\n}\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/index.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/insertSorted.js":
/*!****************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/insertSorted.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * @alias module:modeling/utils.insertSorted\n */\nconst insertSorted = (array, element, comparefunc) => {\n  let leftbound = 0\n  let rightbound = array.length\n  while (rightbound > leftbound) {\n    const testindex = Math.floor((leftbound + rightbound) / 2)\n    const testelement = array[testindex]\n    const compareresult = comparefunc(element, testelement)\n    if (compareresult > 0) { // element > testelement\n      leftbound = testindex + 1\n    } else {\n      rightbound = testindex\n    }\n  }\n  array.splice(leftbound, 0, element)\n}\n\nmodule.exports = insertSorted\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/insertSorted.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/radToDeg.js":
/*!************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/radToDeg.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert the given angle (radians) to degrees.\n * @param {Number} radians - angle in radians\n * @returns {Number} angle in degrees\n * @alias module:modeling/utils.radToDeg\n */\nconst radToDeg = (radians) => radians * 57.29577951308232\n\nmodule.exports = radToDeg\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/radToDeg.js?");

/***/ }),

/***/ "./node_modules/@jscad/modeling/src/utils/radiusToSegments.js":
/*!********************************************************************!*\
  !*** ./node_modules/@jscad/modeling/src/utils/radiusToSegments.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Calculate the number of segments from the given radius based on minimum length or angle.\n * @param {Number} radius - radius of the requested shape\n * @param {Number} minimumLength - minimum length of segments; 0 > length\n * @param {Number} minimumAngle - minimum angle (radians) between segments; 0 > angle < Math.PI * 2\n * @returns {Number} number of segments to complete the radius\n * @alias module:modeling/utils.radiusToSegments\n */\nconst radiusToSegments = (radius, minimumLength, minimumAngle) => {\n  const ss = minimumLength > 0 ? radius * 2 * Math.PI / minimumLength : 0\n  const as = minimumAngle > 0 ? Math.PI * 2 / minimumAngle : 0\n  // minimum segments is four(4) for round primitives\n  return Math.ceil(Math.max(ss, as, 4))\n}\n\nmodule.exports = radiusToSegments\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/modeling/src/utils/radiusToSegments.js?");

/***/ }),

/***/ "./node_modules/@jscad/utils/array-utils/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@jscad/utils/array-utils/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * converts input data to array if it is not already an array\n * @param {Array} array\n */\nconst toArray = (array) => {\n  if (Array.isArray(array)) return array\n  if (array === undefined || array === null) return []\n  return [array]\n}\n\n/**\n * returns the first item of an array, or undefined if the array is empty or undefined\n * @param {Array} array\n */\nconst head = (array) => {\n  if (!Array.isArray(array) || array.length === 0) {\n    return undefined\n  }\n  return array[0]\n}\n\n/**\n * flatten the given argument into a single flat array\n * the argument can be composed of multiple depths of values and arrays\n * @param {Array} array\n */\nconst flatten = (array) => array.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), [])\n\n/**\n * helper function to retrieve the nth element of an array\n * if the array is undefined or empty, returns undefined, otherwise returns the item at the given index\n * @param {Integer} index\n * @param {Array} array\n */\nconst nth = (index, array) => {\n  if (!Array.isArray(array) || array.length < index) {\n    return undefined\n  }\n  return array[index]\n}\n\nmodule.exports = { toArray, head, flatten, nth }\n\n\n//# sourceURL=webpack:///./node_modules/@jscad/utils/array-utils/index.js?");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack:///./node_modules/process/browser.js?");

/***/ }),

/***/ "./node_modules/workerpool/dist/workerpool.js":
/*!****************************************************!*\
  !*** ./node_modules/workerpool/dist/workerpool.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(process, __dirname) {/**\n * workerpool.js\n * https://github.com/josdejong/workerpool\n *\n * Offload tasks to a pool of workers on node.js and in the browser.\n *\n * @version 6.0.0\n * @date    2020-05-13\n *\n * @license\n * Copyright (C) 2014-2020 Jos de Jong <wjosdejong@gmail.com>\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\"); you may not\n * use this file except in compliance with the License. You may obtain a copy\n * of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS, WITHOUT\n * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the\n * License for the specific language governing permissions and limitations under\n * the License.\n */\n\n(function webpackUniversalModuleDefinition(root, factory) {\n\tif(true)\n\t\tmodule.exports = factory();\n\telse {}\n})((typeof self !== 'undefined' ? self : this), function() {\nreturn /******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// define __esModule on exports\n/******/ \t__webpack_require__.r = function(exports) {\n/******/ \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t}\n/******/ \t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t};\n/******/\n/******/ \t// create a fake namespace object\n/******/ \t// mode & 1: value is a module id, require it\n/******/ \t// mode & 2: merge all properties of value into the ns\n/******/ \t// mode & 4: return value when already ns object\n/******/ \t// mode & 8|1: behave like require\n/******/ \t__webpack_require__.t = function(value, mode) {\n/******/ \t\tif(mode & 1) value = __webpack_require__(value);\n/******/ \t\tif(mode & 8) return value;\n/******/ \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n/******/ \t\tvar ns = Object.create(null);\n/******/ \t\t__webpack_require__.r(ns);\n/******/ \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n/******/ \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n/******/ \t\treturn ns;\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 3);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar requireFoolWebpack = __webpack_require__(2);\n\n// source: https://github.com/flexdinesh/browser-or-node\nvar isNode = function (nodeProcess) {\n  return (\n    typeof nodeProcess !== 'undefined' &&\n    nodeProcess.versions != null &&\n    nodeProcess.versions.node != null\n  );\n}\nmodule.exports.isNode = isNode\n\n// determines the JavaScript platform: browser or node\nmodule.exports.platform = typeof process !== 'undefined' && isNode(process)\n  ? 'node'\n  : 'browser';\n\n// determines whether the code is running in main thread or not\n// note that in node.js we have to check both worker_thread and child_process\nvar worker_threads = tryRequireFoolWebpack('worker_threads');\nmodule.exports.isMainThread = module.exports.platform === 'node'\n  ? ((!worker_threads || worker_threads.isMainThread) && !process.connected)\n  : typeof Window !== 'undefined';\n\n// determines the number of cpus available\nmodule.exports.cpus = module.exports.platform === 'browser'\n  ? self.navigator.hardwareConcurrency\n  : requireFoolWebpack('os').cpus().length;\n\nfunction tryRequireFoolWebpack (module) {\n  try {\n    return requireFoolWebpack(module);\n  } catch(err) {\n    return null\n  }\n}\n\n\n/***/ }),\n/* 1 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\n/**\n * Promise\n *\n * Inspired by https://gist.github.com/RubaXa/8501359 from RubaXa <trash@rubaxa.org>\n *\n * @param {Function} handler   Called as handler(resolve: Function, reject: Function)\n * @param {Promise} [parent]   Parent promise for propagation of cancel and timeout\n */\nfunction Promise(handler, parent) {\n  var me = this;\n\n  if (!(this instanceof Promise)) {\n    throw new SyntaxError('Constructor must be called with the new operator');\n  }\n\n  if (typeof handler !== 'function') {\n    throw new SyntaxError('Function parameter handler(resolve, reject) missing');\n  }\n\n  var _onSuccess = [];\n  var _onFail = [];\n\n  // status\n  this.resolved = false;\n  this.rejected = false;\n  this.pending = true;\n\n  /**\n   * Process onSuccess and onFail callbacks: add them to the queue.\n   * Once the promise is resolve, the function _promise is replace.\n   * @param {Function} onSuccess\n   * @param {Function} onFail\n   * @private\n   */\n  var _process = function (onSuccess, onFail) {\n    _onSuccess.push(onSuccess);\n    _onFail.push(onFail);\n  };\n\n  /**\n   * Add an onSuccess callback and optionally an onFail callback to the Promise\n   * @param {Function} onSuccess\n   * @param {Function} [onFail]\n   * @returns {Promise} promise\n   */\n  this.then = function (onSuccess, onFail) {\n    return new Promise(function (resolve, reject) {\n      var s = onSuccess ? _then(onSuccess, resolve, reject) : resolve;\n      var f = onFail    ? _then(onFail,    resolve, reject) : reject;\n\n      _process(s, f);\n    }, me);\n  };\n\n  /**\n   * Resolve the promise\n   * @param {*} result\n   * @type {Function}\n   */\n  var _resolve = function (result) {\n    // update status\n    me.resolved = true;\n    me.rejected = false;\n    me.pending = false;\n\n    _onSuccess.forEach(function (fn) {\n      fn(result);\n    });\n\n    _process = function (onSuccess, onFail) {\n      onSuccess(result);\n    };\n\n    _resolve = _reject = function () { };\n\n    return me;\n  };\n\n  /**\n   * Reject the promise\n   * @param {Error} error\n   * @type {Function}\n   */\n  var _reject = function (error) {\n    // update status\n    me.resolved = false;\n    me.rejected = true;\n    me.pending = false;\n\n    _onFail.forEach(function (fn) {\n      fn(error);\n    });\n\n    _process = function (onSuccess, onFail) {\n      onFail(error);\n    };\n\n    _resolve = _reject = function () { }\n\n    return me;\n  };\n\n  /**\n   * Cancel te promise. This will reject the promise with a CancellationError\n   * @returns {Promise} self\n   */\n  this.cancel = function () {\n    if (parent) {\n      parent.cancel();\n    }\n    else {\n      _reject(new CancellationError());\n    }\n\n    return me;\n  };\n\n  /**\n   * Set a timeout for the promise. If the promise is not resolved within\n   * the time, the promise will be cancelled and a TimeoutError is thrown.\n   * If the promise is resolved in time, the timeout is removed.\n   * @param {number} delay     Delay in milliseconds\n   * @returns {Promise} self\n   */\n  this.timeout = function (delay) {\n    if (parent) {\n      parent.timeout(delay);\n    }\n    else {\n      var timer = setTimeout(function () {\n        _reject(new TimeoutError('Promise timed out after ' + delay + ' ms'));\n      }, delay);\n\n      me.always(function () {\n        clearTimeout(timer);\n      });\n    }\n\n    return me;\n  };\n\n  // attach handler passing the resolve and reject functions\n  handler(function (result) {\n    _resolve(result);\n  }, function (error) {\n    _reject(error);\n  });\n}\n\n/**\n * Execute given callback, then call resolve/reject based on the returned result\n * @param {Function} callback\n * @param {Function} resolve\n * @param {Function} reject\n * @returns {Function}\n * @private\n */\nfunction _then(callback, resolve, reject) {\n  return function (result) {\n    try {\n      var res = callback(result);\n      if (res && typeof res.then === 'function' && typeof res['catch'] === 'function') {\n        // method returned a promise\n        res.then(resolve, reject);\n      }\n      else {\n        resolve(res);\n      }\n    }\n    catch (error) {\n      reject(error);\n    }\n  }\n}\n\n/**\n * Add an onFail callback to the Promise\n * @param {Function} onFail\n * @returns {Promise} promise\n */\nPromise.prototype['catch'] = function (onFail) {\n  return this.then(null, onFail);\n};\n\n// TODO: add support for Promise.catch(Error, callback)\n// TODO: add support for Promise.catch(Error, Error, callback)\n\n/**\n * Execute given callback when the promise either resolves or rejects.\n * @param {Function} fn\n * @returns {Promise} promise\n */\nPromise.prototype.always = function (fn) {\n  return this.then(fn, fn);\n};\n\n/**\n * Create a promise which resolves when all provided promises are resolved,\n * and fails when any of the promises resolves.\n * @param {Promise[]} promises\n * @returns {Promise} promise\n */\nPromise.all = function (promises){\n  return new Promise(function (resolve, reject) {\n    var remaining = promises.length,\n        results = [];\n\n    if (remaining) {\n      promises.forEach(function (p, i) {\n        p.then(function (result) {\n          results[i] = result;\n          remaining--;\n          if (remaining == 0) {\n            resolve(results);\n          }\n        }, function (error) {\n          remaining = 0;\n          reject(error);\n        });\n      });\n    }\n    else {\n      resolve(results);\n    }\n  });\n};\n\n/**\n * Create a promise resolver\n * @returns {{promise: Promise, resolve: Function, reject: Function}} resolver\n */\nPromise.defer = function () {\n  var resolver = {};\n\n  resolver.promise = new Promise(function (resolve, reject) {\n    resolver.resolve = resolve;\n    resolver.reject = reject;\n  });\n\n  return resolver;\n};\n\n/**\n * Create a cancellation error\n * @param {String} [message]\n * @extends Error\n */\nfunction CancellationError(message) {\n  this.message = message || 'promise cancelled';\n  this.stack = (new Error()).stack;\n}\n\nCancellationError.prototype = new Error();\nCancellationError.prototype.constructor = Error;\nCancellationError.prototype.name = 'CancellationError';\n\nPromise.CancellationError = CancellationError;\n\n\n/**\n * Create a timeout error\n * @param {String} [message]\n * @extends Error\n */\nfunction TimeoutError(message) {\n  this.message = message || 'timeout exceeded';\n  this.stack = (new Error()).stack;\n}\n\nTimeoutError.prototype = new Error();\nTimeoutError.prototype.constructor = Error;\nTimeoutError.prototype.name = 'TimeoutError';\n\nPromise.TimeoutError = TimeoutError;\n\n\nmodule.exports = Promise;\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports) {\n\n// source of inspiration: https://github.com/sindresorhus/require-fool-webpack\nvar requireFoolWebpack = eval(\n    'typeof require !== \\'undefined\\' ' +\n    '? require ' +\n    ': function (module) { throw new Error(\\'Module \" + module + \" not found.\\') }'\n);\n\nmodule.exports = requireFoolWebpack;\n\n\n/***/ }),\n/* 3 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar environment = __webpack_require__(0);\n\n/**\n * Create a new worker pool\n * @param {string} [script]\n * @param {WorkerPoolOptions} [options]\n * @returns {Pool} pool\n */\nexports.pool = function pool(script, options) {\n  var Pool = __webpack_require__(4);\n\n  return new Pool(script, options);\n};\n\n/**\n * Create a worker and optionally register a set of methods to the worker.\n * @param {Object} [methods]\n */\nexports.worker = function worker(methods) {\n  var worker = __webpack_require__(8);\n  worker.add(methods);\n};\n\n/**\n * Create a promise.\n * @type {Promise} promise\n */\nexports.Promise = __webpack_require__(1);\n\nexports.platform = environment.platform;\nexports.isMainThread = environment.isMainThread;\nexports.cpus = environment.cpus;\n\n/***/ }),\n/* 4 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar Promise = __webpack_require__(1);\nvar WorkerHandler = __webpack_require__(5);\nvar environment = __webpack_require__(0);\nvar DebugPortAllocator = __webpack_require__(7);\nvar DEBUG_PORT_ALLOCATOR = new DebugPortAllocator();\n/**\n * A pool to manage workers\n * @param {String} [script]   Optional worker script\n * @param {WorkerPoolOptions} [options]  See docs\n * @constructor\n */\nfunction Pool(script, options) {\n  if (typeof script === 'string') {\n    this.script = script || null;\n  }\n  else {\n    this.script = null;\n    options = script;\n  }\n\n  this.workers = [];  // queue with all workers\n  this.tasks = [];    // queue with tasks awaiting execution\n\n  options = options || {};\n\n  this.forkArgs = options.forkArgs || [];\n  this.forkOpts = options.forkOpts || {};\n  this.debugPortStart = (options.debugPortStart || 43210);\n  this.nodeWorker = options.nodeWorker;\n  this.workerType = options.workerType || options.nodeWorker || 'auto'\n  this.maxQueueSize = options.maxQueueSize || Infinity;\n\n  // configuration\n  if (options && 'maxWorkers' in options) {\n    validateMaxWorkers(options.maxWorkers);\n    this.maxWorkers = options.maxWorkers;\n  }\n  else {\n    this.maxWorkers = Math.max((environment.cpus || 4) - 1, 1);\n  }\n\n  if (options && 'minWorkers' in options) {\n    if(options.minWorkers === 'max') {\n      this.minWorkers = this.maxWorkers;\n    } else {\n      validateMinWorkers(options.minWorkers);\n      this.minWorkers = options.minWorkers;\n      this.maxWorkers = Math.max(this.minWorkers, this.maxWorkers);     // in case minWorkers is higher than maxWorkers\n    }\n    this._ensureMinWorkers();\n  }\n\n  this._boundNext = this._next.bind(this);\n\n\n  if (this.workerType === 'thread') {\n    WorkerHandler.ensureWorkerThreads();\n  }\n}\n\n\n/**\n * Execute a function on a worker.\n *\n * Example usage:\n *\n *   var pool = new Pool()\n *\n *   // call a function available on the worker\n *   pool.exec('fibonacci', [6])\n *\n *   // offload a function\n *   function add(a, b) {\n *     return a + b\n *   };\n *   pool.exec(add, [2, 4])\n *       .then(function (result) {\n *         console.log(result); // outputs 6\n *       })\n *       .catch(function(error) {\n *         console.log(error);\n *       });\n *\n * @param {String | Function} method  Function name or function.\n *                                    If `method` is a string, the corresponding\n *                                    method on the worker will be executed\n *                                    If `method` is a Function, the function\n *                                    will be stringified and executed via the\n *                                    workers built-in function `run(fn, args)`.\n * @param {Array} [params]  Function arguments applied when calling the function\n * @return {Promise.<*, Error>} result\n */\nPool.prototype.exec = function (method, params) {\n  // validate type of arguments\n  if (params && !Array.isArray(params)) {\n    throw new TypeError('Array expected as argument \"params\"');\n  }\n\n  if (typeof method === 'string') {\n    var resolver = Promise.defer();\n\n    if (this.tasks.length >= this.maxQueueSize) {\n      throw new Error('Max queue size of ' + this.maxQueueSize + ' reached');\n    }\n\n    // add a new task to the queue\n    var tasks = this.tasks;\n    var task = {\n      method:  method,\n      params:  params,\n      resolver: resolver,\n      timeout: null\n    };\n    tasks.push(task);\n\n    // replace the timeout method of the Promise with our own,\n    // which starts the timer as soon as the task is actually started\n    var originalTimeout = resolver.promise.timeout;\n    resolver.promise.timeout = function timeout (delay) {\n      if (tasks.indexOf(task) !== -1) {\n        // task is still queued -> start the timer later on\n        task.timeout = delay;\n        return resolver.promise;\n      }\n      else {\n        // task is already being executed -> start timer immediately\n        return originalTimeout.call(resolver.promise, delay);\n      }\n    };\n\n    // trigger task execution\n    this._next();\n\n    return resolver.promise;\n  }\n  else if (typeof method === 'function') {\n    // send stringified function and function arguments to worker\n    return this.exec('run', [String(method), params]);\n  }\n  else {\n    throw new TypeError('Function or string expected as argument \"method\"');\n  }\n};\n\n/**\n * Create a proxy for current worker. Returns an object containing all\n * methods available on the worker. The methods always return a promise.\n *\n * @return {Promise.<Object, Error>} proxy\n */\nPool.prototype.proxy = function () {\n  if (arguments.length > 0) {\n    throw new Error('No arguments expected');\n  }\n\n  var pool = this;\n  return this.exec('methods')\n      .then(function (methods) {\n        var proxy = {};\n\n        methods.forEach(function (method) {\n          proxy[method] = function () {\n            return pool.exec(method, Array.prototype.slice.call(arguments));\n          }\n        });\n\n        return proxy;\n      });\n};\n\n/**\n * Creates new array with the results of calling a provided callback function\n * on every element in this array.\n * @param {Array} array\n * @param {function} callback  Function taking two arguments:\n *                             `callback(currentValue, index)`\n * @return {Promise.<Array>} Returns a promise which resolves  with an Array\n *                           containing the results of the callback function\n *                           executed for each of the array elements.\n */\n/* TODO: implement map\nPool.prototype.map = function (array, callback) {\n};\n*/\n\n/**\n * Grab the first task from the queue, find a free worker, and assign the\n * worker to the task.\n * @protected\n */\nPool.prototype._next = function () {\n  if (this.tasks.length > 0) {\n    // there are tasks in the queue\n\n    // find an available worker\n    var worker = this._getWorker();\n    if (worker) {\n      // get the first task from the queue\n      var me = this;\n      var task = this.tasks.shift();\n\n      // check if the task is still pending (and not cancelled -> promise rejected)\n      if (task.resolver.promise.pending) {\n        // send the request to the worker\n        var promise = worker.exec(task.method, task.params, task.resolver)\n          .then(me._boundNext)\n          .catch(function () {\n            // if the worker crashed and terminated, remove it from the pool\n            if (worker.terminated) {\n              me._removeWorker(worker);\n              // If minWorkers set, spin up new workers to replace the crashed ones\n              me._ensureMinWorkers();\n            }\n            me._next(); // trigger next task in the queue\n          });\n\n        // start queued timer now\n        if (typeof task.timeout === 'number') {\n          promise.timeout(task.timeout);\n        }\n      } else {\n        // The task taken was already complete (either rejected or resolved), so just trigger next task in the queue\n        me._next();\n      }\n    }\n  }\n};\n\n/**\n * Get an available worker. If no worker is available and the maximum number\n * of workers isn't yet reached, a new worker will be created and returned.\n * If no worker is available and the maximum number of workers is reached,\n * null will be returned.\n *\n * @return {WorkerHandler | null} worker\n * @private\n */\nPool.prototype._getWorker = function() {\n  // find a non-busy worker\n  var workers = this.workers;\n  for (var i = 0; i < workers.length; i++) {\n    var worker = workers[i];\n    if (worker.busy() === false) {\n      return worker;\n    }\n  }\n\n  if (workers.length < this.maxWorkers) {\n    // create a new worker\n    worker = this._createWorkerHandler();\n    workers.push(worker);\n    return worker;\n  }\n\n  return null;\n};\n\n/**\n * Remove a worker from the pool. For example after a worker terminated for\n * whatever reason\n * @param {WorkerHandler} worker\n * @protected\n */\nPool.prototype._removeWorker = function(worker) {\n  DEBUG_PORT_ALLOCATOR.releasePort(worker.debugPort)\n  // terminate the worker (if not already terminated)\n  worker.terminate();\n  this._removeWorkerFromList(worker);\n};\n\n/**\n * Remove a worker from the pool list.\n * @param {WorkerHandler} worker\n * @protected\n */\nPool.prototype._removeWorkerFromList = function(worker) {\n  // remove from the list with workers\n  var index = this.workers.indexOf(worker);\n  if (index !== -1) {\n    this.workers.splice(index, 1);\n  }\n};\n\n/**\n * Close all active workers. Tasks currently being executed will be finished first.\n * @param {boolean} [force=false]   If false (default), the workers are terminated\n *                                  after finishing all tasks currently in\n *                                  progress. If true, the workers will be\n *                                  terminated immediately.\n * @param {number} [timeout]        If provided and non-zero, worker termination promise will be rejected\n *                                  after timeout if worker process has not been terminated.\n * @return {Promise.<void, Error>}\n */\nPool.prototype.terminate = function (force, timeout) {\n  // cancel any pending tasks\n  this.tasks.forEach(function (task) {\n    task.resolver.reject(new Error('Pool terminated'));\n  });\n  this.tasks.length = 0;\n\n  var f = function (worker) {\n    this._removeWorkerFromList(worker);\n  };\n  var removeWorker = f.bind(this);\n\n  var promises = [];\n  var workers = this.workers.slice();\n  workers.forEach(function (worker) {\n    var termPromise = worker.terminateAndNotify(force, timeout)\n      .then(removeWorker);\n    promises.push(termPromise);\n  });\n  return Promise.all(promises);\n};\n\n/**\n * Retrieve statistics on tasks and workers.\n * @return {{totalWorkers: number, busyWorkers: number, idleWorkers: number, pendingTasks: number, activeTasks: number}} Returns an object with statistics\n */\nPool.prototype.stats = function () {\n  var totalWorkers = this.workers.length;\n  var busyWorkers = this.workers.filter(function (worker) {\n    return worker.busy();\n  }).length;\n\n  return {\n    totalWorkers:  totalWorkers,\n    busyWorkers:   busyWorkers,\n    idleWorkers:   totalWorkers - busyWorkers,\n\n    pendingTasks:  this.tasks.length,\n    activeTasks:   busyWorkers\n  };\n};\n\n/**\n * Ensures that a minimum of minWorkers is up and running\n * @protected\n */\nPool.prototype._ensureMinWorkers = function() {\n  if (this.minWorkers) {\n    for(var i = this.workers.length; i < this.minWorkers; i++) {\n      this.workers.push(this._createWorkerHandler());\n    }\n  }\n};\n\n/**\n * Helper function to create a new WorkerHandler and pass all options.\n * @return {WorkerHandler}\n * @private\n */\nPool.prototype._createWorkerHandler = function () {\n  return new WorkerHandler(this.script, {\n    forkArgs: this.forkArgs,\n    forkOpts: this.forkOpts,\n    debugPort: DEBUG_PORT_ALLOCATOR.nextAvailableStartingAt(this.debugPortStart),\n    workerType: this.workerType\n  });\n}\n\n/**\n * Ensure that the maxWorkers option is an integer >= 1\n * @param {*} maxWorkers\n * @returns {boolean} returns true maxWorkers has a valid value\n */\nfunction validateMaxWorkers(maxWorkers) {\n  if (!isNumber(maxWorkers) || !isInteger(maxWorkers) || maxWorkers < 1) {\n    throw new TypeError('Option maxWorkers must be an integer number >= 1');\n  }\n}\n\n/**\n * Ensure that the minWorkers option is an integer >= 0\n * @param {*} minWorkers\n * @returns {boolean} returns true when minWorkers has a valid value\n */\nfunction validateMinWorkers(minWorkers) {\n  if (!isNumber(minWorkers) || !isInteger(minWorkers) || minWorkers < 0) {\n    throw new TypeError('Option minWorkers must be an integer number >= 0');\n  }\n}\n\n/**\n * Test whether a variable is a number\n * @param {*} value\n * @returns {boolean} returns true when value is a number\n */\nfunction isNumber(value) {\n  return typeof value === 'number';\n}\n\n/**\n * Test whether a number is an integer\n * @param {number} value\n * @returns {boolean} Returns true if value is an integer\n */\nfunction isInteger(value) {\n  return Math.round(value) == value;\n}\n\nmodule.exports = Pool;\n\n\n/***/ }),\n/* 5 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\nvar Promise = __webpack_require__(1);\nvar environment = __webpack_require__(0);\nvar requireFoolWebpack = __webpack_require__(2);\n\nfunction ensureWorkerThreads() {\n  var WorkerThreads = tryRequireWorkerThreads()\n  if (!WorkerThreads) {\n    throw new Error('WorkerPool: workerType = \\'thread\\' is not supported, Node >= 11.7.0 required')\n  }\n\n  return WorkerThreads;\n}\n\n// check whether Worker is supported by the browser\nfunction ensureWebWorker() {\n  // Workaround for a bug in PhantomJS (Or QtWebkit): https://github.com/ariya/phantomjs/issues/14534\n  if (typeof Worker !== 'function' && (typeof Worker !== 'object' || typeof Worker.prototype.constructor !== 'function')) {\n    throw new Error('WorkerPool: Web Workers not supported');\n  }\n}\n\nfunction tryRequireWorkerThreads() {\n  try {\n    return requireFoolWebpack('worker_threads');\n  } catch(error) {\n    if (typeof error === 'object' && error !== null && error.code === 'MODULE_NOT_FOUND') {\n      // no worker_threads available (old version of node.js)\n      return null;\n    } else {\n      throw error;\n    }\n  }\n}\n\n// get the default worker script\nfunction getDefaultWorker() {\n  if (environment.platform === 'browser') {\n    // test whether the browser supports all features that we need\n    if (typeof Blob === 'undefined') {\n      throw new Error('Blob not supported by the browser');\n    }\n    if (!window.URL || typeof window.URL.createObjectURL !== 'function') {\n      throw new Error('URL.createObjectURL not supported by the browser');\n    }\n\n    // use embedded worker.js\n    var blob = new Blob([__webpack_require__(6)], {type: 'text/javascript'});\n    return window.URL.createObjectURL(blob);\n  }\n  else {\n    // use external worker.js in current directory\n    return __dirname + '/worker.js';\n  }\n}\n\nfunction setupWorker(script, options) {\n  if (options.workerType === 'web') { // browser only\n    ensureWebWorker();\n    return setupBrowserWorker(script, Worker);\n  } else if (options.workerType === 'thread') { // node.js only\n    WorkerThreads = ensureWorkerThreads();\n    return setupWorkerThreadWorker(script, WorkerThreads);\n  } else if (options.workerType === 'process' || !options.workerType) { // node.js only\n    return setupProcessWorker(script, resolveForkOptions(options), requireFoolWebpack('child_process'));\n  } else { // options.workerType === 'auto' or undefined\n    if (environment.platform === 'browser') {\n      ensureWebWorker();\n      return setupBrowserWorker(script, Worker);\n    }\n    else { // environment.platform === 'node'\n      var WorkerThreads = tryRequireWorkerThreads();\n      if (WorkerThreads) {\n        return setupWorkerThreadWorker(script, WorkerThreads);\n      } else {\n        return setupProcessWorker(script, resolveForkOptions(options), requireFoolWebpack('child_process'));\n      }\n    }\n  }\n}\n\nfunction setupBrowserWorker(script, Worker) {\n  // create the web worker\n  var worker = new Worker(script);\n\n  worker.isBrowserWorker = true;\n  // add node.js API to the web worker\n  worker.on = function (event, callback) {\n    this.addEventListener(event, function (message) {\n      callback(message.data);\n    });\n  };\n  worker.send = function (message) {\n    this.postMessage(message);\n  };\n  return worker;\n}\n\nfunction setupWorkerThreadWorker(script, WorkerThreads) {\n  var worker = new WorkerThreads.Worker(script, {\n    stdout: false, // automatically pipe worker.STDOUT to process.STDOUT\n    stderr: false  // automatically pipe worker.STDERR to process.STDERR\n  });\n  worker.isWorkerThread = true;\n  // make the worker mimic a child_process\n  worker.send = function(message) {\n    this.postMessage(message);\n  };\n\n  worker.kill = function() {\n    this.terminate();\n  };\n\n  worker.disconnect = function() {\n    this.terminate();\n  };\n\n  return worker;\n}\n\nfunction setupProcessWorker(script, options, child_process) {\n  // no WorkerThreads, fallback to sub-process based workers\n  var worker = child_process.fork(\n    script,\n    options.forkArgs,\n    options.forkOpts\n  );\n\n  worker.isChildProcess = true;\n  return worker;\n}\n\n// add debug flags to child processes if the node inspector is active\nfunction resolveForkOptions(opts) {\n  opts = opts || {};\n\n  var processExecArgv = process.execArgv.join(' ');\n  var inspectorActive = processExecArgv.indexOf('--inspect') !== -1;\n  var debugBrk = processExecArgv.indexOf('--debug-brk') !== -1;\n\n  var execArgv = [];\n  if (inspectorActive) {\n    execArgv.push('--inspect=' + opts.debugPort);\n\n    if (debugBrk) {\n      execArgv.push('--debug-brk');\n    }\n  }\n\n  process.execArgv.forEach(function(arg) {\n    if (arg.indexOf('--max-old-space-size') > -1) {\n      execArgv.push(arg)\n    }\n  })\n\n  return Object.assign({}, opts, {\n    forkArgs: opts.forkArgs,\n    forkOpts: Object.assign({}, opts.forkOpts, {\n      execArgv: (opts.forkOpts && opts.forkOpts.execArgv || [])\n      .concat(execArgv)\n    })\n  });\n}\n\n/**\n * Converts a serialized error to Error\n * @param {Object} obj Error that has been serialized and parsed to object\n * @return {Error} The equivalent Error.\n */\nfunction objectToError (obj) {\n  var temp = new Error('')\n  var props = Object.keys(obj)\n\n  for (var i = 0; i < props.length; i++) {\n    temp[props[i]] = obj[props[i]]\n  }\n\n  return temp\n}\n\n/**\n * A WorkerHandler controls a single worker. This worker can be a child process\n * on node.js or a WebWorker in a browser environment.\n * @param {String} [script] If no script is provided, a default worker with a\n *                          function run will be created.\n * @param {WorkerPoolOptions} _options See docs\n * @constructor\n */\nfunction WorkerHandler(script, _options) {\n  var me = this;\n  var options = _options || {};\n\n  this.script = script || getDefaultWorker();\n  this.worker = setupWorker(this.script, options);\n  this.debugPort = options.debugPort;\n\n  // The ready message is only sent if the worker.add method is called (And the default script is not used)\n  if (!script) {\n    this.worker.ready = true;\n  }\n\n  // queue for requests that are received before the worker is ready\n  this.requestQueue = [];\n  this.worker.on('message', function (response) {\n    if (typeof response === 'string' && response === 'ready') {\n      me.worker.ready = true;\n      dispatchQueuedRequests();\n    } else {\n      // find the task from the processing queue, and run the tasks callback\n      var id = response.id;\n      var task = me.processing[id];\n      if (task !== undefined) {\n        // remove the task from the queue\n        delete me.processing[id];\n\n        // test if we need to terminate\n        if (me.terminating === true) {\n          // complete worker termination if all tasks are finished\n          me.terminate();\n        }\n\n        // resolve the task's promise\n        if (response.error) {\n          task.resolver.reject(objectToError(response.error));\n        }\n        else {\n          task.resolver.resolve(response.result);\n        }\n      }\n    }\n  });\n\n  // reject all running tasks on worker error\n  function onError(error) {\n    me.terminated = true;\n    if (me.terminating && me.terminationHandler) {\n      me.terminationHandler(me);\n    }\n    me.terminating = false;\n\n    for (var id in me.processing) {\n      if (me.processing[id] !== undefined) {\n        me.processing[id].resolver.reject(error);\n      }\n    }\n    me.processing = Object.create(null);\n  }\n\n  // send all queued requests to worker\n  function dispatchQueuedRequests()\n  {\n    me.requestQueue.forEach(me.worker.send.bind(me.worker));\n    me.requestQueue = [];\n  }\n\n  var worker = this.worker;\n  // listen for worker messages error and exit\n  this.worker.on('error', onError);\n  this.worker.on('exit', function (exitCode, signalCode) {\n    var message = 'Workerpool Worker terminated Unexpectedly\\n';\n\n    message += '    exitCode: `' + exitCode + '`\\n';\n    message += '    signalCode: `' + signalCode + '`\\n';\n\n    message += '    workerpool.script: `' +  me.script + '`\\n';\n    message += '    spawnArgs: `' +  worker.spawnargs + '`\\n';\n    message += '    spawnfile: `' + worker.spawnfile + '`\\n'\n\n    message += '    stdout: `' + worker.stdout + '`\\n'\n    message += '    stderr: `' + worker.stderr + '`\\n'\n\n    onError(new Error(message));\n  });\n\n  this.processing = Object.create(null); // queue with tasks currently in progress\n\n  this.terminating = false;\n  this.terminated = false;\n  this.terminationHandler = null;\n  this.lastId = 0;\n}\n\n/**\n * Get a list with methods available on the worker.\n * @return {Promise.<String[], Error>} methods\n */\nWorkerHandler.prototype.methods = function () {\n  return this.exec('methods');\n};\n\n/**\n * Execute a method with given parameters on the worker\n * @param {String} method\n * @param {Array} [params]\n * @param {{resolve: Function, reject: Function}} [resolver]\n * @return {Promise.<*, Error>} result\n */\nWorkerHandler.prototype.exec = function(method, params, resolver) {\n  if (!resolver) {\n    resolver = Promise.defer();\n  }\n\n  // generate a unique id for the task\n  var id = ++this.lastId;\n\n  // register a new task as being in progress\n  this.processing[id] = {\n    id: id,\n    resolver: resolver\n  };\n\n  // build a JSON-RPC request\n  var request = {\n    id: id,\n    method: method,\n    params: params\n  };\n\n  if (this.terminated) {\n    resolver.reject(new Error('Worker is terminated'));\n  } else if (this.worker.ready) {\n    // send the request to the worker\n    this.worker.send(request);\n  } else {\n    this.requestQueue.push(request);\n  }\n\n  // on cancellation, force the worker to terminate\n  var me = this;\n  resolver.promise\n    .catch(function (error) {\n      if (error instanceof Promise.CancellationError || error instanceof Promise.TimeoutError) {\n        // remove this task from the queue. It is already rejected (hence this\n        // catch event), and else it will be rejected again when terminating\n        delete me.processing[id];\n\n        // terminate worker\n        me.terminate(true);\n      } else {\n        throw error;\n      }\n    });\n\n  return resolver.promise;\n};\n\n/**\n * Test whether the worker is working or not\n * @return {boolean} Returns true if the worker is busy\n */\nWorkerHandler.prototype.busy = function () {\n  return Object.keys(this.processing).length > 0;\n};\n\n/**\n * Terminate the worker.\n * @param {boolean} [force=false]   If false (default), the worker is terminated\n *                                  after finishing all tasks currently in\n *                                  progress. If true, the worker will be\n *                                  terminated immediately.\n * @param {function} [callback=null] If provided, will be called when process terminates.\n */\nWorkerHandler.prototype.terminate = function (force, callback) {\n  if (force) {\n    // cancel all tasks in progress\n    for (var id in this.processing) {\n      if (this.processing[id] !== undefined) {\n        this.processing[id].resolver.reject(new Error('Worker terminated'));\n      }\n    }\n    this.processing = Object.create(null);\n  }\n\n  if (typeof callback === 'function') {\n    this.terminationHandler = callback;\n  }\n  if (!this.busy()) {\n    // all tasks are finished. kill the worker\n    if (this.worker) {\n      if (typeof this.worker.kill === 'function') {\n        this.worker.kill();  // child process\n      }\n      else if (typeof this.worker.terminate === 'function') {\n        this.worker.terminate(); // web worker\n      }\n      else {\n        throw new Error('Failed to terminate worker');\n      }\n      this.worker = null;\n    }\n    this.terminating = false;\n    this.terminated = true;\n    if (this.terminationHandler) {\n      this.terminationHandler(this);\n    }\n  }\n  else {\n    // we can't terminate immediately, there are still tasks being executed\n    this.terminating = true;\n  }\n};\n\n/**\n * Terminate the worker, returning a Promise that resolves when the termination has been done.\n * @param {boolean} [force=false]   If false (default), the worker is terminated\n *                                  after finishing all tasks currently in\n *                                  progress. If true, the worker will be\n *                                  terminated immediately.\n * @param {number} [timeout]        If provided and non-zero, worker termination promise will be rejected\n *                                  after timeout if worker process has not been terminated.\n * @return {Promise.<WorkerHandler, Error>}\n */\nWorkerHandler.prototype.terminateAndNotify = function (force, timeout) {\n  var resolver = Promise.defer();\n  if (timeout) {\n    resolver.promise.timeout = timeout;\n  }\n  this.terminate(force, function(worker) {\n    resolver.resolve(worker);\n  });\n  return resolver.promise;\n};\n\nmodule.exports = WorkerHandler;\nmodule.exports._tryRequireWorkerThreads = tryRequireWorkerThreads;\nmodule.exports._setupProcessWorker = setupProcessWorker;\nmodule.exports._setupBrowserWorker = setupBrowserWorker;\nmodule.exports._setupWorkerThreadWorker = setupWorkerThreadWorker;\nmodule.exports.ensureWorkerThreads = ensureWorkerThreads;\n\n\n/***/ }),\n/* 6 */\n/***/ (function(module, exports) {\n\n/**\n * embeddedWorker.js contains an embedded version of worker.js.\n * This file is automatically generated,\n * changes made in this file will be overwritten.\n */\nmodule.exports = \"!function(o){var n={};function t(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return o[e].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=o,t.c=n,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},t.r=function(e){\\\"undefined\\\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\\\"Module\\\"}),Object.defineProperty(e,\\\"__esModule\\\",{value:!0})},t.t=function(r,e){if(1&e&&(r=t(r)),8&e)return r;if(4&e&&\\\"object\\\"==typeof r&&r&&r.__esModule)return r;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,\\\"default\\\",{enumerable:!0,value:r}),2&e&&\\\"string\\\"!=typeof r)for(var n in r)t.d(o,n,function(e){return r[e]}.bind(null,n));return o},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,\\\"a\\\",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p=\\\"\\\",t(t.s=0)}([function(module,exports,__webpack_require__){var requireFoolWebpack=eval(\\\"typeof require !== 'undefined' ? require : function (module) { throw new Error('Module \\\\\\\" + module + \\\\\\\" not found.') }\\\"),worker={},WorkerThreads,parentPort;if(\\\"undefined\\\"!=typeof self&&\\\"function\\\"==typeof postMessage&&\\\"function\\\"==typeof addEventListener)worker.on=function(e,r){addEventListener(e,function(e){r(e.data)})},worker.send=function(e){postMessage(e)};else{if(\\\"undefined\\\"==typeof process)throw new Error(\\\"Script must be executed as a worker\\\");try{WorkerThreads=requireFoolWebpack(\\\"worker_threads\\\")}catch(e){if(\\\"object\\\"!=typeof e||null===e||\\\"MODULE_NOT_FOUND\\\"!==e.code)throw e}WorkerThreads&&null!==WorkerThreads.parentPort?(parentPort=WorkerThreads.parentPort,worker.send=parentPort.postMessage.bind(parentPort),worker.on=parentPort.on.bind(parentPort)):(worker.on=process.on.bind(process),worker.send=process.send.bind(process),worker.on(\\\"disconnect\\\",function(){process.exit(1)}))}function convertError(o){return Object.getOwnPropertyNames(o).reduce(function(e,r){return Object.defineProperty(e,r,{value:o[r],enumerable:!0})},{})}function isPromise(e){return e&&\\\"function\\\"==typeof e.then&&\\\"function\\\"==typeof e.catch}worker.methods={},worker.methods.run=function run(fn,args){var f=eval(\\\"(\\\"+fn+\\\")\\\");return f.apply(f,args)},worker.methods.methods=function(){return Object.keys(worker.methods)},worker.on(\\\"message\\\",function(r){try{var e=worker.methods[r.method];if(!e)throw new Error('Unknown method \\\"'+r.method+'\\\"');var o=e.apply(e,r.params);isPromise(o)?o.then(function(e){worker.send({id:r.id,result:e,error:null})}).catch(function(e){worker.send({id:r.id,result:null,error:convertError(e)})}):worker.send({id:r.id,result:o,error:null})}catch(e){worker.send({id:r.id,result:null,error:convertError(e)})}}),worker.register=function(e){if(e)for(var r in e)e.hasOwnProperty(r)&&(worker.methods[r]=e[r]);worker.send(\\\"ready\\\")},exports.add=worker.register}]);\";\n\n\n/***/ }),\n/* 7 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\nvar MAX_PORTS = 65535;\nmodule.exports = DebugPortAllocator;\nfunction DebugPortAllocator() {\n  this.ports = Object.create(null);\n  this.length = 0;\n}\n\nDebugPortAllocator.prototype.nextAvailableStartingAt = function(starting) {\n  while (this.ports[starting] === true) {\n    starting++;\n  }\n\n  if (starting >= MAX_PORTS) {\n    throw new Error('WorkerPool debug port limit reached: ' + starting + '>= ' + MAX_PORTS );\n  }\n\n  this.ports[starting] = true;\n  this.length++;\n  return starting;\n};\n\nDebugPortAllocator.prototype.releasePort = function(port) {\n  delete this.ports[port];\n  this.length--;\n};\n\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/**\n * worker must be started as a child process or a web worker.\n * It listens for RPC messages from the parent process.\n */\n\n// source of inspiration: https://github.com/sindresorhus/require-fool-webpack\nvar requireFoolWebpack = eval(\n    'typeof require !== \\'undefined\\'' +\n    ' ? require' +\n    ' : function (module) { throw new Error(\\'Module \" + module + \" not found.\\') }'\n);\n\n// create a worker API for sending and receiving messages which works both on\n// node.js and in the browser\nvar worker = {};\nif (typeof self !== 'undefined' && typeof postMessage === 'function' && typeof addEventListener === 'function') {\n  // worker in the browser\n  worker.on = function (event, callback) {\n    addEventListener(event, function (message) {\n      callback(message.data);\n    })\n  };\n  worker.send = function (message) {\n    postMessage(message);\n  };\n}\nelse if (typeof process !== 'undefined') {\n  // node.js\n\n  var WorkerThreads;\n  try {\n    WorkerThreads = requireFoolWebpack('worker_threads');\n  } catch(error) {\n    if (typeof error === 'object' && error !== null && error.code === 'MODULE_NOT_FOUND') {\n      // no worker_threads, fallback to sub-process based workers\n    } else {\n      throw error;\n    }\n  }\n\n  if (WorkerThreads &&\n    /* if there is a parentPort, we are in a WorkerThread */\n    WorkerThreads.parentPort !== null) {\n    var parentPort  = WorkerThreads.parentPort;\n    worker.send = parentPort.postMessage.bind(parentPort);\n    worker.on = parentPort.on.bind(parentPort);\n  } else {\n    worker.on = process.on.bind(process);\n    worker.send = process.send.bind(process);\n    // register disconnect handler only for subprocess worker to exit when parent is killed unexpectedly\n    worker.on('disconnect', function () {\n      process.exit(1);\n    });\n  }\n}\nelse {\n  throw new Error('Script must be executed as a worker');\n}\n\nfunction convertError(error) {\n  return Object.getOwnPropertyNames(error).reduce(function(product, name) {\n    return Object.defineProperty(product, name, {\n\tvalue: error[name],\n\tenumerable: true\n    });\n  }, {});\n}\n\n/**\n * Test whether a value is a Promise via duck typing.\n * @param {*} value\n * @returns {boolean} Returns true when given value is an object\n *                    having functions `then` and `catch`.\n */\nfunction isPromise(value) {\n  return value && (typeof value.then === 'function') && (typeof value.catch === 'function');\n}\n\n// functions available externally\nworker.methods = {};\n\n/**\n * Execute a function with provided arguments\n * @param {String} fn     Stringified function\n * @param {Array} [args]  Function arguments\n * @returns {*}\n */\nworker.methods.run = function run(fn, args) {\n  var f = eval('(' + fn + ')');\n  return f.apply(f, args);\n};\n\n/**\n * Get a list with methods available on this worker\n * @return {String[]} methods\n */\nworker.methods.methods = function methods() {\n  return Object.keys(worker.methods);\n};\n\nworker.on('message', function (request) {\n  try {\n    var method = worker.methods[request.method];\n\n    if (method) {\n      // execute the function\n      var result = method.apply(method, request.params);\n\n      if (isPromise(result)) {\n        // promise returned, resolve this and then return\n        result\n            .then(function (result) {\n              worker.send({\n                id: request.id,\n                result: result,\n                error: null\n              });\n            })\n            .catch(function (err) {\n              worker.send({\n                id: request.id,\n                result: null,\n                error: convertError(err)\n              });\n            });\n      }\n      else {\n        // immediate result\n        worker.send({\n          id: request.id,\n          result: result,\n          error: null\n        });\n      }\n    }\n    else {\n      throw new Error('Unknown method \"' + request.method + '\"');\n    }\n  }\n  catch (err) {\n    worker.send({\n      id: request.id,\n      result: null,\n      error: convertError(err)\n    });\n  }\n});\n\n/**\n * Register methods to the worker\n * @param {Object} methods\n */\nworker.register = function (methods) {\n\n  if (methods) {\n    for (var name in methods) {\n      if (methods.hasOwnProperty(name)) {\n        worker.methods[name] = methods[name];\n      }\n    }\n  }\n\n  worker.send('ready');\n\n};\n\nif (true) {\n  exports.add = worker.register;\n}\n\n\n/***/ })\n/******/ ]);\n});\n//# sourceMappingURL=workerpool.js.map\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ \"./node_modules/process/browser.js\"), \"/\"))\n\n//# sourceURL=webpack:///./node_modules/workerpool/dist/workerpool.js?");

/***/ }),

/***/ "./src/worker.js":
/*!***********************!*\
  !*** ./src/worker.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var jscad = __webpack_require__(/*! @jscad/modeling */ \"./node_modules/@jscad/modeling/src/index.js\");\n\nvar jsonDeSerializer = __webpack_require__(/*! @jscad/io/json-deserializer */ \"./node_modules/@jscad/io/json-deserializer/index.js\");\n\nvar jsonSerializer = __webpack_require__(/*! @jscad/io/json-serializer */ \"./node_modules/@jscad/io/json-serializer/index.js\");\n\nvar workerpool = __webpack_require__(/*! workerpool */ \"./node_modules/workerpool/dist/workerpool.js\");\n\nvar color = jscad.color,\n    connectors = jscad.connectors,\n    geometry = jscad.geometry,\n    math = jscad.math,\n    primitives = jscad.primitives,\n    text = jscad.text,\n    utils = jscad.utils,\n    booleans = jscad.booleans,\n    expansions = jscad.expansions,\n    extrusions = jscad.extrusions,\n    hulls = jscad.hulls,\n    measurements = jscad.measurements,\n    transforms = jscad.transforms;\n\nvar _require$primitives = __webpack_require__(/*! @jscad/modeling */ \"./node_modules/@jscad/modeling/src/index.js\").primitives,\n    cuboid = _require$primitives.cuboid,\n    sphere = _require$primitives.sphere,\n    cylinder = _require$primitives.cylinder,\n    circle = _require$primitives.circle,\n    star = _require$primitives.star,\n    rectangle = _require$primitives.rectangle;\n\nvar translate = transforms.translate,\n    rotate = transforms.rotate,\n    scale = transforms.scale;\n\nvar colorize = __webpack_require__(/*! @jscad/modeling */ \"./node_modules/@jscad/modeling/src/index.js\").colors.colorize;\n\nvar _require$extrusions = __webpack_require__(/*! @jscad/modeling */ \"./node_modules/@jscad/modeling/src/index.js\").extrusions,\n    extrudeLinear = _require$extrusions.extrudeLinear,\n    extrudeRectangular = _require$extrusions.extrudeRectangular,\n    extrudeRotate = _require$extrusions.extrudeRotate;\n/*const main = () => {\n  return [\n    // rotate([0, 0, 0], cylinder({ radius: 0.1 })),\n    cylinder({ radius: 0.5 }),\n    translate([0, 5, 0], cylinder({ size: 2.5 })),\n    circle({ diameter: 10, segments: 64 }),\n    circle({ radius: 10, segments: 64 }),\n    cuboid(),\n    sphere(),\n    translate([10, 5, 0], [jscad.primitives.cylinder({ radius: 0.5, segments: 64 })]),\n    rotate([0, 10, 2], cylinder({ radius: 0.1 })),\n    jscad.primitives.arc(),\n    jscad.primitives.ellipse(),\n    rotate([0, 10, 2], star())\n  ]\n}*/\n\n\nfunction circ(values) {\n  var myCircle = colorize([1, 0, 0, 0.75], circle({\n    radius: values[0]\n  }));\n  var serializedCircle = jsonSerializer.serialize({}, myCircle);\n  return serializedCircle;\n}\n\nfunction rect(values) {\n  var myCube = rectangle({\n    size: values\n  });\n  var serializedCube = jsonSerializer.serialize({}, myCube);\n  console.log(serializedCube);\n  return serializedCube;\n}\n\nfunction trans(values) {\n  var geometry = values[0]; //var deserializedGeometry = jsonDeSerializer.deserialize({output: 'geometry'}, jsonGeometry)\n\n  var translatedObj = translate([values[1], values[2], values[3]], geometry); //translate([10, 5, 0], [jscad.primitives.cylinder({ radius: 0.5, segments: 64 })])\n\n  var serializedResult = jsonSerializer.serialize({}, translatedObj);\n  return serializedResult;\n}\n\nfunction extr(values) {\n  var geometry = values[0]; //var deserializedGeometry = jsonDeSerializer.deserialize({output: 'geometry'}, jsonGeometry)\n\n  var extrudedObj = extrudeLinear({\n    height: values[1]\n  }, geometry); //translate([10, 5, 0], [jscad.primitives.cylinder({ radius: 0.5, segments: 64 })])\n\n  var serializedResult = jsonSerializer.serialize({}, extrudedObj);\n  return serializedResult;\n} // create a worker and register public functions\n\n\nworkerpool.worker({\n  circle: circ,\n  translate: trans,\n  rectangle: rect,\n  extrude: extr\n});\n\n//# sourceURL=webpack:///./src/worker.js?");

/***/ })

/******/ });