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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = closest;
/* harmony export (immutable) */ __webpack_exports__["d"] = nodeListToArray;
/* harmony export (immutable) */ __webpack_exports__["c"] = findElements;
/* harmony export (immutable) */ __webpack_exports__["b"] = filterArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classy__ = __webpack_require__(2);


// ┌─────┐
// │ DOM │
// └─────┘
// Handles dom nodes

// returns closest element up the DOM tree matching a given class
function closest (className, context) {
  var current;
  for (current = context; current; current = current.parentNode) {
    if (current.nodeType === 1 && __WEBPACK_IMPORTED_MODULE_0__classy__["c" /* has */](current, className)) {
      break;
    }
  }
  return current;
}

// turn a domNodeList into an array
function nodeListToArray (domNodeList) {
  if (Array.isArray(domNodeList)) {
    return domNodeList;
  } else {
    return Array.prototype.slice.call(domNodeList);
  }
}

// Finds all the elements inside a node, or the document and returns them as an array
function findElements (query, domNode) {
  var context = domNode || document;
  var elements = context.querySelectorAll(query);
  return nodeListToArray(elements);
}

function filterArray (value, array) {
  var results = array.filter(function (item) {
    var val = value.toLowerCase();
    var t = item.innerHTML.toLowerCase();
    return t.indexOf(val) !== -1;
  });
  return results;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }

    listener._ = callback;
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
          liveEvents.push(evts[i]);
        }
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];
    return this;
  }
};

var bus = new E();
/* harmony default export */ __webpack_exports__["a"] = (bus);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = has;
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony export (immutable) */ __webpack_exports__["d"] = remove;
/* harmony export (immutable) */ __webpack_exports__["f"] = toggle;
/* harmony export (immutable) */ __webpack_exports__["e"] = removeActive;
/* harmony export (immutable) */ __webpack_exports__["b"] = addActive;
/* harmony export (immutable) */ __webpack_exports__["g"] = toggleActive;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(0);
// Cool Helpers


// ┌────────────────────┐
// │ Class Manipulation │
// └────────────────────┘

// check if an element has a specific class
function has (domNode, className) {
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(domNode.getAttribute('class'));
}

// add one or more classes to an element
function add (domNode, classes) {
  classes.split(' ').forEach(function (c) {
    if (!has(domNode, c)) {
      var existingClass = domNode.getAttribute('class') || '';
      domNode.setAttribute('class', existingClass + ' ' + c);
    }
  });
}

// remove one or more classes from an element
function remove (domNode, classes) {
  classes.split(' ').forEach(function (c) {
    var removedClass = domNode.getAttribute('class').replace(new RegExp('(\\s|^)' + c + '(\\s|$)', 'g'), '$2');
    if (has(domNode, c)) {
      domNode.setAttribute('class', removedClass);
    }
  });
}

// if domNode has the class, remove it, else add it
function toggle (domNode, className) {
  if (has(domNode, className)) {
    remove(domNode, className);
  } else {
    add(domNode, className);
  }
}

// remove 'is-active' class from every element in an array
function removeActive (array) {
  array = __WEBPACK_IMPORTED_MODULE_0__dom__["d" /* nodeListToArray */](array);
  array.forEach(function (item) {
    remove(item, 'is-active');
  });
}

// add 'is-active' class from every element in an array
function addActive (array) {
  array = __WEBPACK_IMPORTED_MODULE_0__dom__["d" /* nodeListToArray */](array);
  array.forEach(function (item) {
    add(item, 'is-active');
  });
}

// remove 'is-active' class from every element in an array, add to one element
function toggleActive (array, el) {
  removeActive(array);
  add(el, 'is-active');
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return boundEvents; });
/* harmony export (immutable) */ __webpack_exports__["c"] = click;
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony export (immutable) */ __webpack_exports__["e"] = remove;
/* harmony export (immutable) */ __webpack_exports__["g"] = target;
/* harmony export (immutable) */ __webpack_exports__["d"] = preventDefault;
/* harmony export (immutable) */ __webpack_exports__["f"] = stopPropagation;
/* harmony export (immutable) */ __webpack_exports__["h"] = throttle;
// ┌──────────────────────┐
// │ DOM Event Management │
// └──────────────────────┘

var boundEvents = {
  dropdowns: [],
  accordions: []
};



// returns standard interaction event, later will add touch support
function click () {
  return 'click';
}

// add a callback function to an event on a DOM node
function add (domNode, e, fn) {
  if (domNode.addEventListener) {
    return domNode.addEventListener(e, fn, false);
  } else if (domNode.attachEvent) {
    return domNode.attachEvent('on' + e, fn);
  }
}

// remove a specific function binding from a DOM node event
function remove (domNode, e, fn) {
  if (domNode.removeEventListener) {
    return domNode.removeEventListener(e, fn, false);
  } else if (domNode.detachEvent) {
    return domNode.detachEvent('on' + e, fn);
  }
}

// get the target element of an event
function target (e) {
  return e.target || e.srcElement;
}

// prevent default behavior of an event
function preventDefault (e) {
  if (e.preventDefault) {
    return e.preventDefault();
  } else if (e.returnValue) {
    e.returnValue = false;
  }
}

// stop and event from bubbling up the DOM tree
function stopPropagation (e) {
  e = e || window.event;
  if (e.stopPropagation) {
    return e.stopPropagation();
  }
  if (e.cancelBubble) {
    e.cancelBubble = true;
  }
}

// return a function that will only execute
// once it is NOT called for delay milliseconds
function throttle (fn, time, context) {
  var lock, args, wrapperFn, later;

  later = function () {
    // reset lock and call if queued
    lock = false;
    if (args) {
      wrapperFn.apply(context, args);
      args = false;
    }
  };

  wrapperFn = function () {
    if (lock) {
      // called too soon, queue to call later
      args = arguments;
    } else {
      // call and lock until later
      fn.apply(context, arguments);
      setTimeout(later, time);
      lock = true;
    }
  };

  return wrapperFn;
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = toggleHidden;
/* harmony export (immutable) */ __webpack_exports__["a"] = hide;
/* harmony export (immutable) */ __webpack_exports__["b"] = show;
/* harmony export (immutable) */ __webpack_exports__["c"] = toggleExpanded;
// ┌────────────────┐
// │ Aria Adjusters │
// └────────────────┘
// utilities to help manage aria properties

// toggles `aria-hidden` on a domNode
function toggleHidden (array) {
  array.forEach(function (node) {
    if (!node) {
      return;
    }
    var hidden = node.getAttribute('aria-hidden');
    if (hidden !== 'true') {
      node.setAttribute('aria-hidden', true);
    } else {
      node.removeAttribute('aria-hidden');
    }
  });
}

// adds `aria-hidden` on a domNode
function hide (array) {
  array.forEach(function (node) {
    if (!node) {
      return;
    }
    node.setAttribute('aria-hidden', true);
  });
}

// removes `aria-hidden` on a domNode
function show (array) {
  array.forEach(function (node) {
    if (!node) {
      return;
    }
    node.removeAttribute('aria-hidden');
  });
}

function toggleExpanded (domNode) {
  if (!domNode) {
    return;
  }
  var isExpanded = domNode.getAttribute('aria-expanded');
  if (isExpanded) {
    domNode.removeAttribute('aria-expanded');
  } else {
    domNode.setAttribute('aria-expanded', 'true');
  }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var validator = new RegExp('^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$', 'i');

function gen (count) {
  var out = '';
  for (var i = 0; i < count; i++) {
    out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return out;
}

function Guid (guid) {
  if (!guid) throw new TypeError('Invalid argument `value` has no value.');
  this.value = Guid.EMPTY;
  if (guid && guid instanceof Guid) {
    this.value = guid.toString();
  } else if (guid && Object.prototype.toString.call(guid) === '[object String]' && Guid.isGuid(guid)) {
    this.value = guid;
  }
  this.equals = function (other) {
    return Guid.isGuid(other) && this.value === other;
  };
  this.isEmpty = function () {
    return this.value === Guid.EMPTY;
  };
  this.toString = function () {
    return this.value;
  };
  this.toJSON = function () {
    return this.value;
  };
}

Guid.EMPTY = '00000000-0000-0000-0000-000000000000';
Guid.isGuid = function (value) {
  return value && (value instanceof Guid || validator.test(value.toString()));
};
Guid.create = function () {
  return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join('-'));
};
Guid.raw = function () {
  return [gen(2), gen(1), gen(1), gen(1), gen(3)].join('-');
};

/* harmony default export */ __webpack_exports__["a"] = (Guid);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(7);

var _jquery2 = _interopRequireDefault(_jquery);

var _calciteWeb = __webpack_require__(8);

var calcite = _interopRequireWildcard(_calciteWeb);

var _temp = __webpack_require__(19);

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {

    dojo.require("esri/arcgis/utils");
    dojo.require("esri/geometry/Extent");
    dojo.require("esri/symbols/SimpleLineSymbol");
    dojo.require("esri/graphic");
    dojo.require("esri/layers/graphics");
    dojo.require("esri/layers/MapImageLayer");
    dojo.require("esri/layers/MapImage");

    dojo.ready(dojoOnReadyHandler);

    function dojoOnReadyHandler() {

        // app config data
        var WEB_MAP_ID = "0a5a934c55594e209d1e6f5cde00bae2";
        var MAP_CONTAINER_ID = 'mapDiv';

        var LANDCOVER_MAP_IMAGE_LAYER_ID = 'landcoverMapImageLayer';
        var AREA_SELECT_GRAPHIC_LAYER_ID = 'areaSelectGraphicLayer';

        // app variables
        var landcoverApp = null;

        // cache DOM nodes
        var $body = (0, _jquery2.default)('body');

        // initiate user interface utils
        var initUserinterfaceUtils = function () {
            calcite.init();
        }();

        // initiate app
        var initApp = function () {
            landcoverApp = new LandcoverApp();
            landcoverApp.startup();
        }();

        function LandcoverApp() {

            this.map = null;

            this.symbolForSquareAreaReferenceGraphic = null;
            this.symbolForSquareAreaHighlightGraphic = null;

            this.startup = function () {
                var _this = this;

                esri.arcgis.utils.createMap(WEB_MAP_ID, MAP_CONTAINER_ID).then(function (response) {
                    // console.log(response);
                    var map = response.map;
                    _this._setMap(map);
                    _this._setMapEventHandlers(map);
                    _this._initAreaSelectGraphicLayer(map);
                    _this._initMapImageLayerForLandcover(map);
                });
            };

            this._setMap = function (map) {
                this.map = map;
            };

            this._initAreaSelectGraphicLayer = function (map) {
                var areaSelectGraphicLayer = new esri.layers.GraphicsLayer({
                    id: AREA_SELECT_GRAPHIC_LAYER_ID
                });
                map.addLayer(areaSelectGraphicLayer);
            };

            this._initMapImageLayerForLandcover = function (map) {
                var mapImageLayer = new esri.layers.MapImageLayer({
                    'id': LANDCOVER_MAP_IMAGE_LAYER_ID
                });
                map.addLayer(mapImageLayer);
            };

            this._addImageToLandcoverMapImageLayer = function (imageURL, extent) {
                var mapImage = new esri.layers.MapImage({
                    'extent': extent,
                    'href': imageURL
                });
                var mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.removeAllImages();
                mapImageLayer.addImage(mapImage);
            };

            this._setMapEventHandlers = function (map) {
                var _this2 = this;

                map.on('click', function (evt) {
                    _this2._mapOnClickHandler(evt);
                });
                map.on('mouse-move', function (evt) {
                    _this2._mapOnMousemoveHandler(evt);
                });
            };

            // show area select highlight layer on click
            this._mapOnClickHandler = function (evt) {
                //console.log(evt);
                var areaSelectHighlightGraphic = this._getSquareAreaGraphic(evt);
                this._addGraphicToAreaSelectLayer(areaSelectHighlightGraphic);
                this._getLandcoverImgForSelectedArea(evt.mapPoint);
            };

            // show area select reference layer on mousemove
            this._mapOnMousemoveHandler = function (evt) {
                // console.log(evt);
                var sqAreaReferenceGraphic = this._getSquareAreaGraphic(evt);
                this.map.graphics.clear();
                this.map.graphics.add(sqAreaReferenceGraphic);
            };

            this._getLandcoverImgForSelectedArea = function (mapPoint) {
                var sqExtent = this._getSquareExtentByMapPoint(mapPoint);
                this._addImageToLandcoverMapImageLayer(_temp2.default, sqExtent);
            };

            // highlight the user selected area
            this._addGraphicToAreaSelectLayer = function (graphic) {
                var areaSelectGraphicLayer = this.map.getLayer(AREA_SELECT_GRAPHIC_LAYER_ID);
                areaSelectGraphicLayer.clear();
                areaSelectGraphicLayer.add(graphic);
            };

            this._getSquareAreaGraphic = function (evt) {
                // console.log(evt);
                var sqExtent = this._getSquareExtentByMapPoint(evt.mapPoint);
                var symbol = this._getSymbolForSquareAreaGraphicByEventType(evt.type);
                var areaSelectGraphic = new esri.Graphic(sqExtent, symbol);
                return areaSelectGraphic;
            };

            this._getSymbolForSquareAreaGraphicByEventType = function (eventType) {
                var FILL_COLOR_FOR_REF_GRAPHIC = [50, 50, 50, 100];
                var OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC = [255, 0, 0, 200];

                this.symbolForSquareAreaReferenceGraphic = !this.symbolForSquareAreaReferenceGraphic ? this._getSimpleFillSymbol(FILL_COLOR_FOR_REF_GRAPHIC) : this.symbolForSquareAreaReferenceGraphic;
                this.symbolForSquareAreaHighlightGraphic = !this.symbolForSquareAreaHighlightGraphic ? this._getSimpleFillSymbol(null, OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC) : this.symbolForSquareAreaHighlightGraphic;
                var symbolByEventType = eventType === 'click' ? this.symbolForSquareAreaHighlightGraphic : this.symbolForSquareAreaReferenceGraphic;
                return symbolByEventType;
            };

            this._getSquareExtentByMapPoint = function (mapPoint) {
                var SIDE_LENGTH_HALF = 192;
                var extent = new esri.geometry.Extent({
                    "xmin": mapPoint.x - SIDE_LENGTH_HALF,
                    "ymin": mapPoint.y - SIDE_LENGTH_HALF,
                    "xmax": mapPoint.x + SIDE_LENGTH_HALF,
                    "ymax": mapPoint.y + SIDE_LENGTH_HALF,
                    "spatialReference": this.map.spatialReference
                });
                return extent;
            };

            this._getSimpleFillSymbol = function () {
                var fillColorRGBA = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0, 0];
                var outlineColorRGBA = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0, 0];

                var symbol = new esri.symbol.SimpleFillSymbol({
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": fillColorRGBA,
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": outlineColorRGBA,
                        "width": 1
                    }
                });
                return symbol;
            };
        }
    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "click", function() { return click; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addEvent", function() { return addEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeEvent", function() { return removeEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventTarget", function() { return eventTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "preventDefault", function() { return preventDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stopPropagation", function() { return stopPropagation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasClass", function() { return hasClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addClass", function() { return addClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeClass", function() { return removeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleClass", function() { return toggleClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeActive", function() { return removeActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addActive", function() { return addActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleActive", function() { return toggleActive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleAriaHidden", function() { return toggleAriaHidden; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleAriaExpanded", function() { return toggleAriaExpanded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closest", function() { return closest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nodeListToArray", function() { return nodeListToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findElements", function() { return findElements; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return extend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_js_helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_js_helpers_aria__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_js_helpers_clipboard__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_js_patterns_accordion__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__lib_js_patterns_dropdown__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__lib_js_patterns_drawers__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__lib_js_patterns_filter_dropdown__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__lib_js_patterns_modal__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__lib_js_patterns_search__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__lib_js_patterns_select_nav__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__lib_js_patterns_sticky__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__lib_js_patterns_tabs__ = __webpack_require__(18);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bus", function() { return __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "accordion", function() { return __WEBPACK_IMPORTED_MODULE_6__lib_js_patterns_accordion__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "dropdown", function() { return __WEBPACK_IMPORTED_MODULE_7__lib_js_patterns_dropdown__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "drawer", function() { return __WEBPACK_IMPORTED_MODULE_8__lib_js_patterns_drawers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "filterDropdown", function() { return __WEBPACK_IMPORTED_MODULE_9__lib_js_patterns_filter_dropdown__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "modal", function() { return __WEBPACK_IMPORTED_MODULE_10__lib_js_patterns_modal__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "search", function() { return __WEBPACK_IMPORTED_MODULE_11__lib_js_patterns_search__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "selectNav", function() { return __WEBPACK_IMPORTED_MODULE_12__lib_js_patterns_select_nav__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sticky", function() { return __WEBPACK_IMPORTED_MODULE_13__lib_js_patterns_sticky__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "tabs", function() { return __WEBPACK_IMPORTED_MODULE_14__lib_js_patterns_tabs__["a"]; });
// ┌─────────┐
// │ Helpers │
// └─────────┘
// utilities for working with dom, and removing browser inconsistencies
// with support back to IE9+






// ┌─────┐
// │ Bus │
// └─────┘
// all event passing takes place over a bus
// this is just an instance of tinyEmitter


// ┌─────────────────┐
// │ Import Patterns │
// └─────────────────┘
// import all interactive patterns










// ┌──────────────────────┐
// │ Emit Keyboard Events │
// └──────────────────────┘
// emit presses of escape and return keys
__WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["a" /* add */](document, 'keyup', translateKeypress);
function translateKeypress (e) {
  if (e.keyCode === 27) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:escape');
  } else if (e.keyCode === 13) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:return');
  } else if (e.keyCode === 32) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:space');
  } else if (e.keyCode === 38) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:arrow:up');
  } else if (e.keyCode === 40) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:arrow:down');
  } else if (e.keyCode === 37) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:arrow:left');
  } else if (e.keyCode === 39) {
    __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('keyboard:arrow:right');
  }
}

// ┌────────────────────┐
// │ Emit Scroll Events │
// └────────────────────┘
// throttled for performance
__WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["a" /* add */](window, 'scroll', __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["h" /* throttle */](isScrolling, 100));
function isScrolling () {
  __WEBPACK_IMPORTED_MODULE_5__lib_js_helpers_bus__["a" /* default */].emit('scrolling:at', window.pageYOffset);
}

// ┌────────────────────┐
// │ Initialize Calcite │
// └────────────────────┘
// start up Calcite and attach all the patterns
// optionally pass an array of patterns you'd like to watch
var patterns = [
  __WEBPACK_IMPORTED_MODULE_6__lib_js_patterns_accordion__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_4__lib_js_helpers_clipboard__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_7__lib_js_patterns_dropdown__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_8__lib_js_patterns_drawers__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_9__lib_js_patterns_filter_dropdown__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_10__lib_js_patterns_modal__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_11__lib_js_patterns_search__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_12__lib_js_patterns_select_nav__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_13__lib_js_patterns_sticky__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_14__lib_js_patterns_tabs__["a" /* default */]
];

function init () {
  patterns.forEach(function (pattern) {
    pattern();
  });
}

function extend (plugin) {
  // Object Assign Polyfill
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }
  for (var key in plugin) {
    patterns.push(plugin[key]);
  }
  Object.assign(this, plugin);
}

// ┌────────────┐
// │ Public API │
// └────────────┘
// define all public api methods
var version = '1.0.0';
var click = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["c" /* click */];
var addEvent = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["a" /* add */];
var removeEvent = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["e" /* remove */];
var eventTarget = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["g" /* target */];
var preventDefault = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["d" /* preventDefault */];
var stopPropagation = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["f" /* stopPropagation */];
var throttle = __WEBPACK_IMPORTED_MODULE_3__lib_js_helpers_event__["h" /* throttle */];
var hasClass = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["c" /* has */];
var addClass = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["a" /* add */];
var removeClass = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["d" /* remove */];
var toggleClass = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["f" /* toggle */];
var removeActive = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["e" /* removeActive */];
var addActive = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["b" /* addActive */];
var toggleActive = __WEBPACK_IMPORTED_MODULE_1__lib_js_helpers_classy__["g" /* toggleActive */];
var toggleAriaHidden = __WEBPACK_IMPORTED_MODULE_2__lib_js_helpers_aria__["d" /* toggleHidden */];
var toggleAriaExpanded = __WEBPACK_IMPORTED_MODULE_2__lib_js_helpers_aria__["c" /* toggleExpanded */];
var closest = __WEBPACK_IMPORTED_MODULE_0__lib_js_helpers_dom__["a" /* closest */];
var nodeListToArray = __WEBPACK_IMPORTED_MODULE_0__lib_js_helpers_dom__["d" /* nodeListToArray */];
var findElements = __WEBPACK_IMPORTED_MODULE_0__lib_js_helpers_dom__["c" /* findElements */];




/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = clipboard;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_bus__ = __webpack_require__(1);
// Cool Helpers




function clipboard () {
  var copyBtns = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-copy-to-clipboard');
  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].on('clipboard:bind', bindButtons);

  function bindButtons (options) {
    if (!options) {
      copyBtns.forEach(function (btn) {
        __WEBPACK_IMPORTED_MODULE_1__helpers_event__["a" /* add */](btn, 'click', copy);
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_1__helpers_event__["a" /* add */](options.node, 'click', copy);
    }
  }

  function copy (e) {
    e.preventDefault();
    var target = e.target.getAttribute('data-clipboard-target');
    document.querySelector(target).select();
    document.execCommand('copy');
  }

  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].emit('clipboard:bind');
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = accordion;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_aria__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_bus__ = __webpack_require__(1);
// Cool Helpers






// ┌───────────┐
// │ Accordion │
// └───────────┘
// collapsible accordion list
// Listens to a 'accordion:bind' Obj.node = DOMNode
// Emits and listens on the 'accordion:open' channel. Obj.node = DOMNode
// Emits and listens to on the 'accorion:close' channel. Obj.node = DOMNode
// Emitting a modal id toggle that modals state.
// Emitting false or null closes all modals.

function toggleClick (e) {
  __WEBPACK_IMPORTED_MODULE_3__helpers_event__["f" /* stopPropagation */](e);
  var parent = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('accordion-section', __WEBPACK_IMPORTED_MODULE_3__helpers_event__["g" /* target */](e));
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('accordion:toggle', {node: parent});
}

function handleToggle (options) {
  __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](options.node, 'is-active');
  __WEBPACK_IMPORTED_MODULE_2__helpers_aria__["c" /* toggleExpanded */](options.node);
}

function checkKeyCode (e) {
  if (e.keyCode === 13 && __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](__WEBPACK_IMPORTED_MODULE_3__helpers_event__["g" /* target */](e), 'accordion-title')) {
    toggleClick(e);
  }
}

function bindAccordions (options) {
  var accordions = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-accordion');
  if (!options) {
    accordions.forEach(function (accordion) {
      setUpAccordion(accordion);
    });
  } else {
    setUpAccordion(options.node);
  }
}

function setUpAccordion (accordion) {
  accordion.setAttribute('aria-live', 'polite');
  accordion.setAttribute('role', 'tablist');
  __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["d" /* nodeListToArray */](accordion.children).forEach(function (section) {
    var sectionTitle = section.querySelector('.accordion-title');
    sectionTitle.setAttribute('role', 'tab');
    sectionTitle.setAttribute('tabindex', '0');
    if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](section, 'is-active')) {
      section.setAttribute('aria-expanded', 'true');
    }
    // check if the event was already added
    var eventExists = false;
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["b" /* boundEvents */].accordions.forEach(function (e) {
      if (e.target === sectionTitle && e.event === __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */]() && e.fn === toggleClick) {
        eventExists = true;
      }
    });
    if (!eventExists) {
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["b" /* boundEvents */].accordions.push({target: sectionTitle, event: __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), fn: toggleClick});
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["b" /* boundEvents */].accordions.push({target: section, event: 'keyup', fn: checkKeyCode});
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](sectionTitle, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), toggleClick);
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](section, 'keyup', checkKeyCode);
    }
  });
}

function addListeners () {
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('accordion:bind', bindAccordions);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('accordion:toggle', handleToggle);
  listenersAdded = true;
}

var listenersAdded = false;

function accordion () {
  // only add the listeners if they haven't been added already
  if (!listenersAdded) {
    addListeners();
  }
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('accordion:bind');
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = dropdown;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_bus__ = __webpack_require__(1);
// Cool Helpers





// ┌──────────┐
// │ Dropdown │
// └──────────┘
// show and hide dropdown menus
function closeAllDropdowns (options) {
  __WEBPACK_IMPORTED_MODULE_2__helpers_event__["e" /* remove */](document.body, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), closeAllDropdowns);
  __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-dropdown').forEach(function (dropdown) {
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](dropdown, 'is-active');
  });
  __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-dropdown-toggle').forEach(function (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
  });
  __WEBPACK_IMPORTED_MODULE_2__helpers_event__["e" /* remove */](document, 'keydown', seizeArrows);
}

function toggleDropdown (options) {
  if (!options) return;
  var isOpen = __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](options.node, 'is-active');
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('dropdown:close');
  if (!isOpen) {
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](options.node, 'is-active');
    if (options.target) {
      options.target.setAttribute('aria-expanded', 'true');
    }
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](document, 'keydown', seizeArrows);
  }
  if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](options.node, 'is-active')) {
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](document.body, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), closeAllDropdowns);
  }
}

function seizeArrows (e) {
  if (e.keyCode === 40 | e.keyCode === 38) {
    e.preventDefault();
  }
}

function bindDropdowns (options) {
  // attach the new events
  var toggles = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-dropdown-toggle');
  toggles.forEach(function (toggle) {
    // check if the event was already added
    var eventExists = false;
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["b" /* boundEvents */].dropdowns.forEach(function (e) {
      if (e.target === toggle && e.event === __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */]() && e.fn === toggleClick) {
        eventExists = true;
      }
    });
    if (!eventExists) {
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["b" /* boundEvents */].dropdowns.push({target: toggle, event: __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), fn: toggleClick});
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](toggle, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), toggleClick);
    }
  });
}

function dropdownIsOpen () {
  var dropdown = document.querySelector('.js-dropdown.is-active');
  if (dropdown) {
    return dropdown;
  } else {
    return false;
  }
}

function dropownFocusOn (options) {
  var activeLink = document.activeElement;
  let current = options.links.indexOf(activeLink);
  if (current === -1) {
    if (options.forward) {
      current = 0;
    } else {
      current = options.links.length - 1;
    }
  } else {
    if (options.forward) {
      current += 1;
      if (current === options.links.length) {
        current = 0;
      }
    } else {
      current -= 1;
      if (current === -1) {
        current = options.links.length - 1;
      }
    }
  }
  options.links[current].focus();
}

function arrowDown () {
  var dropdown = dropdownIsOpen();
  if (dropdown) {
    var links = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.dropdown-link', dropdown);
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('dropdown:focus', {links: links, forward: true});
  }
}

function arrowUp () {
  var dropdown = dropdownIsOpen();
  if (dropdown) {
    var links = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.dropdown-link', dropdown);
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('dropdown:focus', {links: links, forward: false});
  }
}

function toggleClick (e) {
  __WEBPACK_IMPORTED_MODULE_2__helpers_event__["d" /* preventDefault */](e);
  __WEBPACK_IMPORTED_MODULE_2__helpers_event__["f" /* stopPropagation */](e);
  var dropdown = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('js-dropdown', e.target);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('dropdown:toggle', {node: dropdown, target: e.target});
}

function addListeners () {
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('dropdown:toggle', toggleDropdown);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('dropdown:close', closeAllDropdowns);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('keyboard:escape', closeAllDropdowns);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('keyboard:arrow:down', arrowDown);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('keyboard:arrow:up', arrowUp);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('dropdown:focus', dropownFocusOn);
  listenersAdded = true;
}

var listenersAdded = false;

function dropdown () {
  // only add the listeners if they haven't been added already
  if (!listenersAdded) {
    addListeners();
  }
  bindDropdowns();
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_aria__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_bus__ = __webpack_require__(1);
// Cool Helpers






// ┌────────┐
// │ Drawer │
// └────────┘
// show and hide drawers
function drawer () {
  var wrapper = document.querySelector('.wrapper');
  var footer = document.querySelector('.footer');
  var toggles = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-drawer-toggle');
  var drawers = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-drawer');
  var lastOn;

  // Bus events
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('drawer:open', openDrawer);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('keyboard:escape', closeDrawer);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('drawer:close', closeDrawer);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('drawer:bind', bindDrawers);

  function openDrawer (options) {
    __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('drawer:close');
    var drawer = document.querySelector(`.js-drawer[data-drawer="${options.id}"]`);
    var right = __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](drawer, 'drawer-right');
    var left = __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](drawer, 'drawer-left');

    drawer.setAttribute('tabindex', 0);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](drawer, 'is-active');

    if (right) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](wrapper, 'drawer-right-is-active');
    } else if (left) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](wrapper, 'drawer-left-is-active');
    }

    __WEBPACK_IMPORTED_MODULE_2__helpers_aria__["a" /* hide */]([wrapper, footer]);
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](drawer, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), closeClick);
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](document, 'focusin', fenceDrawer);
  }

  function closeDrawer (options) {
    if (!options) {
      drawers.forEach(function (drawer) {
        drawer.removeAttribute('tabindex');
        __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](drawer, 'is-active');
      });
    } else {
      var drawer = document.querySelector(`.js-drawer[data-drawer="${options.id}"]`);
      drawer.removeAttribute('tabindex');
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](drawer, 'is-active');
    }
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](wrapper, 'drawer-left-is-active');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](wrapper, 'drawer-right-is-active');
    __WEBPACK_IMPORTED_MODULE_2__helpers_aria__["b" /* show */]([wrapper, footer]);
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["e" /* remove */](document, 'focusin', fenceDrawer);
    if (lastOn) lastOn.focus();
  }

  function fenceDrawer (e) {
    if (!__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('js-drawer', e.target)) {
      drawers.forEach(function (drawer) {
        if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](drawer, 'is-active')) {
          drawer.focus();
        }
      });
    }
  }

  function bindDrawers (options) {
    if (!options) {
      toggles.forEach(function (toggle) {
        __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](toggle, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), toggleClick);
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](options.node, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), toggleClick);
    }
  }

  function closeClick (e) {
    if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](e.target, 'js-drawer')) {
      __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('drawer:close');
    }
  }

  function toggleClick (e) {
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["d" /* preventDefault */](e);
    var drawerId = e.target.getAttribute('data-drawer');
    __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('drawer:open', {id: drawerId});
  }

  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('drawer:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (drawer);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_bus__ = __webpack_require__(1);
// Cool Helpers





// ┌─────────────────┐
// │ Filter Dropdown │
// └─────────────────┘
// Select one or many from a searchable list

function filterDropdown () {
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:bind', bindFilterDropdowns);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:select', toggleItem);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:select', emitActive);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:select:remove', removeItem);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:active', drawActive);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:active:clear', clearActive);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:toggle', toggleDropdown);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:open', openList);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('filterDropdown:close', closeList);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('keyboard:escape', closeList);

  function bindFilterDropdowns () {
    var dropdowns = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-filter-dropdown');
    dropdowns.forEach(function (dropdown) {
      var dropdownId = dropdown.getAttribute('data-filter-dropdown');
      var input = dropdown.querySelector('.filter-dropdown-input');
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](input, 'focus', inputFocus);

      var opens = dropdown.querySelectorAll('.js-filter-dropdown-open');
      for (let i = 0; i < opens.length; i++) {
        var open = opens[i];
        open.setAttribute('data-id', dropdownId);
        __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](open, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), toggleClick);
      }
      var closes = dropdown.querySelectorAll('.js-filter-dropdown-close');
      for (let i = 0; i < closes.length; i++) {
        var close = closes[i];
        close.setAttribute('data-id', dropdownId);
        __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](close, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), toggleClick);
      }

      var items = dropdown.querySelectorAll('.filter-dropdown-link');
      for (let i = 0; i < items.length; i++) {
        var item = items[i];
        item.setAttribute('data-item-id', i);
        __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](item, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), itemClick);
      }

      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](input, 'keyup', function (e) {
        var itemsArray = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["d" /* nodeListToArray */](items);
        itemsArray.forEach(function (item) {
          __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](item, 'hide');
        });

        __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["b" /* filterArray */](input.value, itemsArray).forEach(function (item) {
          __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](item, 'hide');
        });
      });
    });
  }

  function getOptions (e) {
    var parent = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('js-filter-dropdown', e.target);
    return {
      parent: parent,
      id: parent.getAttribute('data-filter-dropdown'),
      item: e.target
    };
  }

  function inputFocus (e) {
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["f" /* stopPropagation */](e);
    var options = getOptions(e);
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:input:focus', options);
  }

  function itemClick (e) {
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["d" /* preventDefault */](e);
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["f" /* stopPropagation */](e);
    var options = getOptions(e);
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:select', options);
  }

  function toggleClick (e) {
    e.preventDefault();
    var options = getOptions(e);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](e.target, 'is-active');
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:toggle', options);
  }

  function toggleDropdown (options) {
    var list = options.parent.querySelector('.filter-dropdown-list');
    if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](list, 'is-active')) {
      __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:close', options);
    } else {
      __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:open', options);
    }
  }

  function toggleItem (options) {
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](options.item, 'is-active');
  }

  function removeItem (options) {
    var activeItems = options.parent.querySelectorAll('.filter-dropdown-link.is-active');
    var toRemove = activeItems[options.i];
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](toRemove, 'is-active');

    var newActiveItems = options.parent.querySelectorAll('.filter-dropdown-link.is-active');

    var emit = {
      parent: options.parent,
      id: options.id,
      active: newActiveItems
    };
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:active', emit);
  }

  function openList (options) {
    closeList();
    var list = options.parent.querySelector('.filter-dropdown-list');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](list, 'is-active');

    var closes = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-filter-dropdown-close', options.parent);
    var opens = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-filter-dropdown-open', options.parent);
    opens.forEach(el => __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](el, 'is-active'));
    closes.forEach(el => __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](el, 'is-active'));
  }

  function closeList (e) {
    var lists = document.querySelectorAll('.filter-dropdown-list');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["e" /* removeActive */](lists);

    var opens = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-filter-dropdown-open');
    var closes = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-filter-dropdown-close');
    opens.forEach(el => __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](el, 'is-active'));
    closes.forEach(el => __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](el, 'is-active'));
  }

  function emitActive (options) {
    var activeItems = options.parent.querySelectorAll('.filter-dropdown-link.is-active');
    var emit = {
      parent: options.parent,
      id: options.id,
      active: activeItems
    };
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:active', emit);
  }

  function drawActive (options) {
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:active:clear', options);

    var placeholder = options.parent.querySelector('.js-flilter-dropdown-no-filters');
    if (options.active.length > 0) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](placeholder, 'hide');
    } else {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](placeholder, 'hide');
    }

    for (let i = 0; i < options.active.length; i++) {
      var item = options.active[i];
      var template = `<span class="filter-dropdown-active">
        ${item.innerHTML}
        <a class="filter-dropdown-remove" href="#" data-item-id='${i}'>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32" class="svg-icon"><path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z"/></svg>
        </a>
      </span>`;
      options.parent.insertAdjacentHTML('beforeend', template);
      var removeLink = options.parent.querySelector(`.filter-dropdown-remove[data-item-id="${i}"]`);
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](removeLink, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), removeClick);
    }
  }

  function removeClick (e) {
    e.preventDefault();
    var options = getOptions(e);
    options.i = e.target.getAttribute('data-item-id');
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:select:remove', options);
  }

  function clearActive (options) {
    var current = options.parent.querySelectorAll('.filter-dropdown-active');
    for (let i = 0; i < current.length; i++) {
      options.parent.removeChild(current[i]);
    }
  }

  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('filterDropdown:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (filterDropdown);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_aria__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_bus__ = __webpack_require__(1);
// Cool Helpers






// ┌───────┐
// │ Modal │
// └───────┘
// show and hide modal dialogues
// Listens to a 'modal:bind' optionally takes a node
// Emits and listens on the 'modal:open' channel. Takes a data-modal attr
// Emits and listens to on the 'modal:close' channel. Optionally takes a data-modal
// Emitting a modal id toggle that modals state.
// Emitting false or null closes all modals.

function modal () {
  // Cool nodes
  var html = document.documentElement;
  var wrapper = document.querySelector('.wrapper');
  var footer = document.querySelector('.footer');
  var toggles = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-modal-toggle');
  var modals = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-modal');

  // Bus events
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('modal:open', openModal);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('keyboard:escape', closeModal);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('modal:close', closeModal);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('modal:bind', bindModals);

  function dependentNodes () {
    var nodes = [];
    if (wrapper) {
      nodes.push(wrapper);
    }
    if (footer) {
      nodes.push(footer);
    }
    return nodes;
  }

  function openModal (modalId) {
    __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('modal:close');
    if (!modalId) return;
    var modal = document.querySelector(`.js-modal[data-modal="${modalId}"]`);
    modal.removeAttribute('tabindex');
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](document, 'focusin', fenceModal);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](modal, 'is-active');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](html, 'drawer-no-overflow');
    __WEBPACK_IMPORTED_MODULE_2__helpers_aria__["a" /* hide */](dependentNodes());
    modal.focus();
  }

  function closeModal (modalId) {
    if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](html, 'drawer-no-overflow')) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](html, 'drawer-no-overflow');
    }
    if (!modalId) return __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["e" /* removeActive */](modals);
    var modal = document.querySelector(`.js-modal[data-modal="${modalId}"]`);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](modal, 'is-active');
    modal.setAttribute('tabindex', 0);
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["e" /* remove */](document, 'focusin', fenceModal);
    __WEBPACK_IMPORTED_MODULE_2__helpers_aria__["b" /* show */](dependentNodes());
  }

  function bindModals (node) {
    if (!node) {
      toggles.forEach(function (toggle) {
        __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](toggle, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), toggleClick);
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_3__helpers_event__["a" /* add */](node, __WEBPACK_IMPORTED_MODULE_3__helpers_event__["c" /* click */](), toggleClick);
    }
  }

  function fenceModal (e) {
    if (!__WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('js-modal', e.target)) {
      modals.forEach(function (modal) {
        if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](modal, 'is-active')) {
          modal.focus();
        }
      });
    }
  }

  function toggleClick (e) {
    __WEBPACK_IMPORTED_MODULE_3__helpers_event__["d" /* preventDefault */](e);
    var modalId = e.target.dataset.modal;
    __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('modal:open', modalId);
  }

  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('modal:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (modal);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_bus__ = __webpack_require__(1);
// Cool Helpers





// ┌────────┐
// │ Search │
// └────────┘
// Expanding search bar that lives in the top nav.
function search () {
  var toggles = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-search-toggle');
  var overlay = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-search')[0];

  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('search:bind', bindSearches);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('search:toggle', toggleSearch);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('keyboard:escape', closeSearch);
  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].on('search:focus', focusSearch);

  function bindSearches (node) {
    if (!node) {
      toggles.forEach(function (toggle) {
        __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](toggle, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), toggleClick);
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](node, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), toggleClick);
    }
  }

  function toggleSearch (node) {
    var openIcon = node.querySelector('.js-search-icon');
    var closeIcon = node.querySelector('.js-close-icon');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](openIcon, 'hide');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](closeIcon, 'hide');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](overlay, 'is-active');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["f" /* toggle */](document.body, 'overflow-hidden');
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('search:focus');
  }

  function focusSearch () {
    let input = document.querySelector('.js-search-input');
    input.focus();
  }

  function closeSearch () {
    if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](overlay, 'is-active')) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](overlay, 'is-active');
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](document.body, 'overflow-hidden');
      let toggleNodes = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["d" /* nodeListToArray */](toggles);
      toggleNodes.forEach(toggleSearch);
      let input = document.querySelector('.js-search-input');
      if (input) {
        input.blur();
      }
    }
  }

  function toggleClick (e) {
    __WEBPACK_IMPORTED_MODULE_2__helpers_event__["d" /* preventDefault */](e);
    __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('search:toggle', e.target);
  }

  __WEBPACK_IMPORTED_MODULE_3__helpers_bus__["a" /* default */].emit('search:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (search);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_bus__ = __webpack_require__(1);




function selectNav () {
  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].on('selectnav:bind', bindSelects);

  var selects = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-select-nav');

  function bindSelects () {
    selects.forEach(function (select) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_event__["a" /* add */](select, 'change', selectPage);
    });
  }

  function selectPage (e) {
    window.location.assign(e.currentTarget.value);
  }

  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].emit('selectnav:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (selectNav);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_bus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_guid__ = __webpack_require__(5);
// Cool Helpers




// ┌────────┐
// │ Sticky │
// └────────┘
// sticks things to the window

function sticky () {
  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].on('scrolling:at', scrollHandler);
  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].on('sticky:stick', stickItem);
  __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].on('sticky:unstick', unstickItem);

  var elements = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-sticky');
  var stickies = elements.map(function (el) {
    var offset = el.offsetTop;
    var dataTop = el.getAttribute('data-top') || 0;
    el.style.top = dataTop + 'px';
    var hasId = el.getAttribute('data-sticky-id');
    if (!hasId) createShim(el);
    return {
      top: offset - parseInt(dataTop, 0),
      element: el
    };
  });

  function createShim (el) {
    var guid = __WEBPACK_IMPORTED_MODULE_3__helpers_guid__["a" /* default */].raw();
    el.setAttribute('data-sticky-id', guid);
    var parent = el.parentNode;
    var shim = el.cloneNode('deep');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](shim, 'js-shim');
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](shim, 'js-sticky');
    shim.setAttribute('data-sticky-id', guid);
    shim.style.visibility = 'hidden';
    shim.style.display = 'none';
    parent.insertBefore(shim, el);
  }

  function stickItem (item) {
    var id = item.element.getAttribute('data-sticky-id');
    var shim = document.querySelector(`.js-shim[data-sticky-id="${id}"]`);
    if (id && shim) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["a" /* add */](item.element, 'is-sticky');
      shim.style.display = '';
    }
  }

  function unstickItem (item) {
    var id = item.element.getAttribute('data-sticky-id');
    var shim = document.querySelector(`.js-shim[data-sticky-id="${id}"]`);
    if (id && shim) {
      __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["d" /* remove */](item.element, 'is-sticky');
      shim.style.display = 'none';
    }
  }

  function scrollHandler (pageYOffset) {
    stickies.forEach(function (item) {
      var referenceElement = item.element;
      if (__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](item.element, 'is-sticky')) {
        var id = item.element.getAttribute('data-sticky-id');
        referenceElement = document.querySelector(`.js-shim[data-sticky-id="${id}"]`);
      }

      if (referenceElement) {
        var dataTop = referenceElement.getAttribute('data-top') || 0;
        item.top = referenceElement.offsetTop - parseInt(dataTop, 0);
      }

      if (item.top < pageYOffset) {
        __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].emit('sticky:stick', item);
      } else {
        __WEBPACK_IMPORTED_MODULE_2__helpers_bus__["a" /* default */].emit('sticky:unstick', item);
      }
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (sticky);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_dom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_classy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_event__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_guid__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_bus__ = __webpack_require__(1);
// Cool Helpers






// ┌──────┐
// │ Tabs │
// └──────┘
// tabbed content pane
function tabs () {
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('tabs:bind', bindTabs);
  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].on('tabs:active', setTab);

  function bindTabs () {
    var tabs = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-tab');
    var tabGroups = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-tab-group');
    var tabSections = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["c" /* findElements */]('.js-tab-section');

    // set max width for each tab
    tabGroups.forEach(function (tab) {
      tab.setAttribute('aria-live', 'polite');
      groupId(tab);
      tab.children[0].setAttribute('role', 'tablist');
      var tabsInGroup = tab.querySelectorAll('.js-tab');
      var percent = 100 / tabsInGroup.length;
      for (var i = 0; i < tabsInGroup.length; i++) {
        tabsInGroup[i].style.maxWidth = percent + '%';
      }
    });

    tabs.forEach(function (tab) {
      tab.setAttribute('aria-expanded', 'false');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '0');
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](tab, __WEBPACK_IMPORTED_MODULE_2__helpers_event__["c" /* click */](), clickTab);
      __WEBPACK_IMPORTED_MODULE_2__helpers_event__["a" /* add */](tab, 'keyup', enterTab);
    });

    tabSections.forEach(function (section) {
      section.setAttribute('role', 'tabpanel');
      var isOpen = __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](section, 'is-active');
      if (isOpen) {
        section.setAttribute('aria-expanded', true);
      } else {
        section.setAttribute('aria-expanded', false);
      }
    });
  }

  function groupId (tab) {
    var hasId = tab.getAttribute('data-tab');
    if (hasId) {
      return hasId;
    } else {
      var id = __WEBPACK_IMPORTED_MODULE_3__helpers_guid__["a" /* default */].raw();
      tab.setAttribute('data-tab', id);
      return id;
    }
  }

  function setTab (options) {
    var group = options.parent;
    var tabs = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["d" /* nodeListToArray */](group.querySelectorAll('.js-tab'));
    var activeTab = options.active;

    var sections = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["d" /* nodeListToArray */](group.querySelectorAll('.js-tab-section'));
    var index = tabs.indexOf(activeTab);
    var activeSection = sections[index];

    tabs.forEach(function (t) {
      t.setAttribute('aria-expanded', false);
    });
    activeTab.setAttribute('aria-expanded', true);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["g" /* toggleActive */](tabs, activeTab);

    sections.forEach(function (s) {
      s.setAttribute('aria-expanded', false);
    });
    activeSection.setAttribute('aria-expanded', true);
    __WEBPACK_IMPORTED_MODULE_1__helpers_classy__["g" /* toggleActive */](sections, activeSection);
  }

  function getOptions (e) {
    var tab = e.target;
    if (!__WEBPACK_IMPORTED_MODULE_1__helpers_classy__["c" /* has */](tab, 'tab-title')) {
      tab = e.currentTarget;
    }
    var group = __WEBPACK_IMPORTED_MODULE_0__helpers_dom__["a" /* closest */]('js-tab-group', tab);
    var id = groupId(group);
    return {
      parent: group,
      id: id,
      active: tab
    };
  }

  function clickTab (e) {
    e.preventDefault();
    var options = getOptions(e);
    __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('tabs:active', options);
  }

  function enterTab (e) {
    var options = getOptions(e);
    if (e.keycode === 13) {
      __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('tabs:active', options);
    }
  }

  __WEBPACK_IMPORTED_MODULE_4__helpers_bus__["a" /* default */].emit('tabs:bind');
}

/* harmony default export */ __webpack_exports__["a"] = (tabs);


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ })
/******/ ]);