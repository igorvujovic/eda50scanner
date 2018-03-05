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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*
	Ractive.js v0.8.14
	Tue May 23 2017 18:45:38 GMT+0000 (UTC) - commit 9cf380262b870f4fd676e2fd42accf8be9a22c5b

	http://ractivejs.org
	http://twitter.com/RactiveJS

	Released under the MIT License.
*/


(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	((function() { var current = global.Ractive; var next = factory(); next.noConflict = function() { global.Ractive = current; return next; }; return global.Ractive = next; })());
}(this, function () { 'use strict';

	var defaults = {
		// render placement:
		el:                     void 0,
		append:				    false,

		// template:
		template:               null,

		// parse:
		delimiters:             [ '{{', '}}' ],
		tripleDelimiters:       [ '{{{', '}}}' ],
		staticDelimiters:       [ '[[', ']]' ],
		staticTripleDelimiters: [ '[[[', ']]]' ],
		csp: 					true,
		interpolate:            false,
		preserveWhitespace:     false,
		sanitize:               false,
		stripComments:          true,
		contextLines:           0,

		// data & binding:
		data:                   {},
		computed:               {},
		magic:                  false,
		modifyArrays:           false,
		adapt:                  [],
		isolated:               false,
		twoway:                 true,
		lazy:                   false,

		// transitions:
		noIntro:                false,
		transitionsEnabled:     true,
		complete:               void 0,

		// css:
		css:                    null,
		noCssTransform:         false
	};

	// These are a subset of the easing equations found at
	// https://raw.github.com/danro/easing-js - license info
	// follows:

	// --------------------------------------------------
	// easing.js v0.5.4
	// Generic set of easing functions with AMD support
	// https://github.com/danro/easing-js
	// This code may be freely distributed under the MIT license
	// http://danro.mit-license.org/
	// --------------------------------------------------
	// All functions adapted from Thomas Fuchs & Jeremy Kahn
	// Easing Equations (c) 2003 Robert Penner, BSD license
	// https://raw.github.com/danro/easing-js/master/LICENSE
	// --------------------------------------------------

	// In that library, the functions named easeIn, easeOut, and
	// easeInOut below are named easeInCubic, easeOutCubic, and
	// (you guessed it) easeInOutCubic.
	//
	// You can add additional easing functions to this list, and they
	// will be globally available.


	var easing = {
		linear: function ( pos ) { return pos; },
		easeIn: function ( pos ) { return Math.pow( pos, 3 ); },
		easeOut: function ( pos ) { return ( Math.pow( ( pos - 1 ), 3 ) + 1 ); },
		easeInOut: function ( pos ) {
			if ( ( pos /= 0.5 ) < 1 ) { return ( 0.5 * Math.pow( pos, 3 ) ); }
			return ( 0.5 * ( Math.pow( ( pos - 2 ), 3 ) + 2 ) );
		}
	};

	var legacy = null;

	/*global console, navigator */

	var win = typeof window !== 'undefined' ? window : null;
	var doc = win ? document : null;

	var isClient = !!doc;
	var isJsdom = ( typeof navigator !== 'undefined' && /jsDom/.test( navigator.appName ) );
	var hasConsole = ( typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function' );

	var magicSupported;
	try {
		Object.defineProperty({}, 'test', { value: 0 });
		magicSupported = true;
	} catch ( e ) {
		magicSupported = false;
	}

	var svg = doc ?
		doc.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' ) :
		false;

	var vendors = [ 'o', 'ms', 'moz', 'webkit' ];

	var html   = 'http://www.w3.org/1999/xhtml';
	var mathml = 'http://www.w3.org/1998/Math/MathML';
	var svg$1    = 'http://www.w3.org/2000/svg';
	var xlink  = 'http://www.w3.org/1999/xlink';
	var xml    = 'http://www.w3.org/XML/1998/namespace';
	var xmlns  = 'http://www.w3.org/2000/xmlns';

	var namespaces = { html: html, mathml: mathml, svg: svg$1, xlink: xlink, xml: xml, xmlns: xmlns };

	var createElement;
	var matches;
	var div;
	var methodNames;
	var unprefixed;
	var prefixed;
	var i;
	var j;
	var makeFunction;
	// Test for SVG support
	if ( !svg ) {
		createElement = function ( type, ns, extend ) {
			if ( ns && ns !== html ) {
				throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information';
			}

			return extend ?
				doc.createElement( type, extend ) :
				doc.createElement( type );
		};
	} else {
		createElement = function ( type, ns, extend ) {
			if ( !ns || ns === html ) {
				return extend ?
					doc.createElement( type, extend ) :
					doc.createElement( type );
			}

			return extend ?
				doc.createElementNS( ns, type, extend ) :
				doc.createElementNS( ns, type );
		};
	}

	function createDocumentFragment () {
		return doc.createDocumentFragment();
	}

	function getElement ( input ) {
		var output;

		if ( !input || typeof input === 'boolean' ) { return; }

		if ( !win || !doc || !input ) {
			return null;
		}

		// We already have a DOM node - no work to do. (Duck typing alert!)
		if ( input.nodeType ) {
			return input;
		}

		// Get node from string
		if ( typeof input === 'string' ) {
			// try ID first
			output = doc.getElementById( input );

			// then as selector, if possible
			if ( !output && doc.querySelector ) {
				output = doc.querySelector( input );
			}

			// did it work?
			if ( output && output.nodeType ) {
				return output;
			}
		}

		// If we've been given a collection (jQuery, Zepto etc), extract the first item
		if ( input[0] && input[0].nodeType ) {
			return input[0];
		}

		return null;
	}

	if ( !isClient ) {
		matches = null;
	} else {
		div = createElement( 'div' );
		methodNames = [ 'matches', 'matchesSelector' ];

		makeFunction = function ( methodName ) {
			return function ( node, selector ) {
				return node[ methodName ]( selector );
			};
		};

		i = methodNames.length;

		while ( i-- && !matches ) {
			unprefixed = methodNames[i];

			if ( div[ unprefixed ] ) {
				matches = makeFunction( unprefixed );
			} else {
				j = vendors.length;
				while ( j-- ) {
					prefixed = vendors[i] + unprefixed.substr( 0, 1 ).toUpperCase() + unprefixed.substring( 1 );

					if ( div[ prefixed ] ) {
						matches = makeFunction( prefixed );
						break;
					}
				}
			}
		}

		// IE8...
		if ( !matches ) {
			matches = function ( node, selector ) {
				var nodes, parentNode, i;

				parentNode = node.parentNode;

				if ( !parentNode ) {
					// empty dummy <div>
					div.innerHTML = '';

					parentNode = div;
					node = node.cloneNode();

					div.appendChild( node );
				}

				nodes = parentNode.querySelectorAll( selector );

				i = nodes.length;
				while ( i-- ) {
					if ( nodes[i] === node ) {
						return true;
					}
				}

				return false;
			};
		}
	}

	function detachNode ( node ) {
		if ( node && typeof node.parentNode !== 'unknown' && node.parentNode ) {
			node.parentNode.removeChild( node );
		}

		return node;
	}

	function safeToStringValue ( value ) {
		return ( value == null || !value.toString ) ? '' : '' + value;
	}

	function safeAttributeString ( string ) {
		return safeToStringValue( string )
			.replace( /&/g, '&amp;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#39;' );
	}

	var decamel = /[A-Z]/g;
	function decamelize ( string ) {
		return string.replace( decamel, function ( s ) { return ("-" + (s.toLowerCase())); } );
	}

	var create;
	var defineProperty;
	var defineProperties;
	try {
		Object.defineProperty({}, 'test', { get: function() {}, set: function() {} });

		if ( doc ) {
			Object.defineProperty( createElement( 'div' ), 'test', { value: 0 });
		}

		defineProperty = Object.defineProperty;
	} catch ( err ) {
		// Object.defineProperty doesn't exist, or we're in IE8 where you can
		// only use it with DOM objects (what were you smoking, MSFT?)
		defineProperty = function ( obj, prop, desc ) {
			if ( desc.get ) obj[ prop ] = desc.get();
			else obj[ prop ] = desc.value;
		};
	}

	try {
		try {
			Object.defineProperties({}, { test: { value: 0 } });
		} catch ( err ) {
			// TODO how do we account for this? noMagic = true;
			throw err;
		}

		if ( doc ) {
			Object.defineProperties( createElement( 'div' ), { test: { value: 0 } });
		}

		defineProperties = Object.defineProperties;
	} catch ( err ) {
		defineProperties = function ( obj, props ) {
			var prop;

			for ( prop in props ) {
				if ( props.hasOwnProperty( prop ) ) {
					defineProperty( obj, prop, props[ prop ] );
				}
			}
		};
	}

	try {
		Object.create( null );

		create = Object.create;
	} catch ( err ) {
		// sigh
		create = (function () {
			var F = function () {};

			return function ( proto, props ) {
				var obj;

				if ( proto === null ) {
					return {};
				}

				F.prototype = proto;
				obj = new F();

				if ( props ) {
					Object.defineProperties( obj, props );
				}

				return obj;
			};
		}());
	}

	function extendObj ( target ) {
		var sources = [], len = arguments.length - 1;
		while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

		var prop;

		sources.forEach( function ( source ) {
			for ( prop in source ) {
				if ( hasOwn.call( source, prop ) ) {
					target[ prop ] = source[ prop ];
				}
			}
		});

		return target;
	}

	function fillGaps ( target ) {
		var sources = [], len = arguments.length - 1;
		while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

		sources.forEach( function ( s ) {
			for ( var key in s ) {
				if ( hasOwn.call( s, key ) && !( key in target ) ) {
					target[ key ] = s[ key ];
				}
			}
		});

		return target;
	}

	var hasOwn = Object.prototype.hasOwnProperty;

	var toString = Object.prototype.toString;
	// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
	function isArray ( thing ) {
		return toString.call( thing ) === '[object Array]';
	}

	function isEqual ( a, b ) {
		if ( a === null && b === null ) {
			return true;
		}

		if ( typeof a === 'object' || typeof b === 'object' ) {
			return false;
		}

		return a === b;
	}

	// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
	function isNumeric ( thing ) {
		return !isNaN( parseFloat( thing ) ) && isFinite( thing );
	}

	function isObject ( thing ) {
		return ( thing && toString.call( thing ) === '[object Object]' );
	}

	function noop () {}

	var alreadyWarned = {};
	var log;
	var printWarning;
	var welcome;
	if ( hasConsole ) {
		var welcomeIntro = [
			("%cRactive.js %c0.8.14 %cin debug mode, %cmore..."),
			'color: rgb(114, 157, 52); font-weight: normal;',
			'color: rgb(85, 85, 85); font-weight: normal;',
			'color: rgb(85, 85, 85); font-weight: normal;',
			'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;'
		];
		var welcomeMessage = "You're running Ractive 0.8.14 in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://docs.ractivejs.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n";

		welcome = function () {
			if ( Ractive.WELCOME_MESSAGE === false ) {
				welcome = noop;
				return;
			}
			var message = 'WELCOME_MESSAGE' in Ractive ? Ractive.WELCOME_MESSAGE : welcomeMessage;
			var hasGroup = !!console.groupCollapsed;
			if ( hasGroup ) console.groupCollapsed.apply( console, welcomeIntro );
			console.log( message );
			if ( hasGroup ) {
				console.groupEnd( welcomeIntro );
			}

			welcome = noop;
		};

		printWarning = function ( message, args ) {
			welcome();

			// extract information about the instance this message pertains to, if applicable
			if ( typeof args[ args.length - 1 ] === 'object' ) {
				var options = args.pop();
				var ractive = options ? options.ractive : null;

				if ( ractive ) {
					// if this is an instance of a component that we know the name of, add
					// it to the message
					var name;
					if ( ractive.component && ( name = ractive.component.name ) ) {
						message = "<" + name + "> " + message;
					}

					var node;
					if ( node = ( options.node || ( ractive.fragment && ractive.fragment.rendered && ractive.find( '*' ) ) ) ) {
						args.push( node );
					}
				}
			}

			console.warn.apply( console, [ '%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' ].concat( args ) );
		};

		log = function () {
			console.log.apply( console, arguments );
		};
	} else {
		printWarning = log = welcome = noop;
	}

	function format ( message, args ) {
		return message.replace( /%s/g, function () { return args.shift(); } );
	}

	function fatal ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );
		throw new Error( message );
	}

	function logIfDebug () {
		if ( Ractive.DEBUG ) {
			log.apply( null, arguments );
		}
	}

	function warn ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );
		printWarning( message, args );
	}

	function warnOnce ( message ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		message = format( message, args );

		if ( alreadyWarned[ message ] ) {
			return;
		}

		alreadyWarned[ message ] = true;
		printWarning( message, args );
	}

	function warnIfDebug () {
		if ( Ractive.DEBUG ) {
			warn.apply( null, arguments );
		}
	}

	function warnOnceIfDebug () {
		if ( Ractive.DEBUG ) {
			warnOnce.apply( null, arguments );
		}
	}

	// Error messages that are used (or could be) in multiple places
	var badArguments = 'Bad arguments';
	var noRegistryFunctionReturn = 'A function was specified for "%s" %s, but no %s was returned';
	var missingPlugin = function ( name, type ) { return ("Missing \"" + name + "\" " + type + " plugin. You may need to download a plugin via http://docs.ractivejs.org/latest/plugins#" + type + "s"); };

	function findInViewHierarchy ( registryName, ractive, name ) {
		var instance = findInstance( registryName, ractive, name );
		return instance ? instance[ registryName ][ name ] : null;
	}

	function findInstance ( registryName, ractive, name ) {
		while ( ractive ) {
			if ( name in ractive[ registryName ] ) {
				return ractive;
			}

			if ( ractive.isolated ) {
				return null;
			}

			ractive = ractive.parent;
		}
	}

	function interpolate ( from, to, ractive, type ) {
		if ( from === to ) return null;

		if ( type ) {
			var interpol = findInViewHierarchy( 'interpolators', ractive, type );
			if ( interpol ) return interpol( from, to ) || null;

			fatal( missingPlugin( type, 'interpolator' ) );
		}

		return interpolators.number( from, to ) ||
		       interpolators.array( from, to ) ||
		       interpolators.object( from, to ) ||
		       null;
	}

	function snap ( to ) {
		return function () { return to; };
	}

	var interpolators = {
		number: function ( from, to ) {
			var delta;

			if ( !isNumeric( from ) || !isNumeric( to ) ) {
				return null;
			}

			from = +from;
			to = +to;

			delta = to - from;

			if ( !delta ) {
				return function () { return from; };
			}

			return function ( t ) {
				return from + ( t * delta );
			};
		},

		array: function ( from, to ) {
			var intermediate, interpolators, len, i;

			if ( !isArray( from ) || !isArray( to ) ) {
				return null;
			}

			intermediate = [];
			interpolators = [];

			i = len = Math.min( from.length, to.length );
			while ( i-- ) {
				interpolators[i] = interpolate( from[i], to[i] );
			}

			// surplus values - don't interpolate, but don't exclude them either
			for ( i=len; i<from.length; i+=1 ) {
				intermediate[i] = from[i];
			}

			for ( i=len; i<to.length; i+=1 ) {
				intermediate[i] = to[i];
			}

			return function ( t ) {
				var i = len;

				while ( i-- ) {
					intermediate[i] = interpolators[i]( t );
				}

				return intermediate;
			};
		},

		object: function ( from, to ) {
			var properties, len, interpolators, intermediate, prop;

			if ( !isObject( from ) || !isObject( to ) ) {
				return null;
			}

			properties = [];
			intermediate = {};
			interpolators = {};

			for ( prop in from ) {
				if ( hasOwn.call( from, prop ) ) {
					if ( hasOwn.call( to, prop ) ) {
						properties.push( prop );
						interpolators[ prop ] = interpolate( from[ prop ], to[ prop ] ) || snap( to[ prop ] );
					}

					else {
						intermediate[ prop ] = from[ prop ];
					}
				}
			}

			for ( prop in to ) {
				if ( hasOwn.call( to, prop ) && !hasOwn.call( from, prop ) ) {
					intermediate[ prop ] = to[ prop ];
				}
			}

			len = properties.length;

			return function ( t ) {
				var i = len, prop;

				while ( i-- ) {
					prop = properties[i];

					intermediate[ prop ] = interpolators[ prop ]( t );
				}

				return intermediate;
			};
		}
	};

	// TODO: deprecate in future release
	var deprecations = {
		construct: {
			deprecated: 'beforeInit',
			replacement: 'onconstruct'
		},
		render: {
			deprecated: 'init',
			message: 'The "init" method has been deprecated ' +
				'and will likely be removed in a future release. ' +
				'You can either use the "oninit" method which will fire ' +
				'only once prior to, and regardless of, any eventual ractive ' +
				'instance being rendered, or if you need to access the ' +
				'rendered DOM, use "onrender" instead. ' +
				'See http://docs.ractivejs.org/latest/migrating for more information.'
		},
		complete: {
			deprecated: 'complete',
			replacement: 'oncomplete'
		}
	};

	var Hook = function Hook ( event ) {
		this.event = event;
		this.method = 'on' + event;
		this.deprecate = deprecations[ event ];
	};

	Hook.prototype.call = function call ( method, ractive, arg ) {
		if ( ractive[ method ] ) {
			arg ? ractive[ method ]( arg ) : ractive[ method ]();
			return true;
		}
	};

	Hook.prototype.fire = function fire ( ractive, arg ) {
		this.call( this.method, ractive, arg );

		// handle deprecations
		if ( !ractive[ this.method ] && this.deprecate && this.call( this.deprecate.deprecated, ractive, arg ) ) {
			if ( this.deprecate.message ) {
				warnIfDebug( this.deprecate.message );
			} else {
				warnIfDebug( 'The method "%s" has been deprecated in favor of "%s" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.', this.deprecate.deprecated, this.deprecate.replacement );
			}
		}

		// TODO should probably use internal method, in case ractive.fire was overwritten
		arg ? ractive.fire( this.event, arg ) : ractive.fire( this.event );
	};

	function addToArray ( array, value ) {
		var index = array.indexOf( value );

		if ( index === -1 ) {
			array.push( value );
		}
	}

	function arrayContains ( array, value ) {
		for ( var i = 0, c = array.length; i < c; i++ ) {
			if ( array[i] == value ) {
				return true;
			}
		}

		return false;
	}

	function arrayContentsMatch ( a, b ) {
		var i;

		if ( !isArray( a ) || !isArray( b ) ) {
			return false;
		}

		if ( a.length !== b.length ) {
			return false;
		}

		i = a.length;
		while ( i-- ) {
			if ( a[i] !== b[i] ) {
				return false;
			}
		}

		return true;
	}

	function ensureArray ( x ) {
		if ( typeof x === 'string' ) {
			return [ x ];
		}

		if ( x === undefined ) {
			return [];
		}

		return x;
	}

	function lastItem ( array ) {
		return array[ array.length - 1 ];
	}

	function removeFromArray ( array, member ) {
		if ( !array ) {
			return;
		}

		var index = array.indexOf( member );

		if ( index !== -1 ) {
			array.splice( index, 1 );
		}
	}

	function toArray ( arrayLike ) {
		var array = [], i = arrayLike.length;
		while ( i-- ) {
			array[i] = arrayLike[i];
		}

		return array;
	}

	var _Promise;
	var PENDING = {};
	var FULFILLED = {};
	var REJECTED = {};
	if ( typeof Promise === 'function' ) {
		// use native Promise
		_Promise = Promise;
	} else {
		_Promise = function ( callback ) {
			var fulfilledHandlers = [],
				rejectedHandlers = [],
				state = PENDING,

				result,
				dispatchHandlers,
				makeResolver,
				fulfil,
				reject,

				promise;

			makeResolver = function ( newState ) {
				return function ( value ) {
					if ( state !== PENDING ) {
						return;
					}

					result = value;
					state = newState;

					dispatchHandlers = makeDispatcher( ( state === FULFILLED ? fulfilledHandlers : rejectedHandlers ), result );

					// dispatch onFulfilled and onRejected handlers asynchronously
					wait( dispatchHandlers );
				};
			};

			fulfil = makeResolver( FULFILLED );
			reject = makeResolver( REJECTED );

			try {
				callback( fulfil, reject );
			} catch ( err ) {
				reject( err );
			}

			promise = {
				// `then()` returns a Promise - 2.2.7
				then: function ( onFulfilled, onRejected ) {
					var promise2 = new _Promise( function ( fulfil, reject ) {

						var processResolutionHandler = function ( handler, handlers, forward ) {

							// 2.2.1.1
							if ( typeof handler === 'function' ) {
								handlers.push( function ( p1result ) {
									var x;

									try {
										x = handler( p1result );
										resolve( promise2, x, fulfil, reject );
									} catch ( err ) {
										reject( err );
									}
								});
							} else {
								// Forward the result of promise1 to promise2, if resolution handlers
								// are not given
								handlers.push( forward );
							}
						};

						// 2.2
						processResolutionHandler( onFulfilled, fulfilledHandlers, fulfil );
						processResolutionHandler( onRejected, rejectedHandlers, reject );

						if ( state !== PENDING ) {
							// If the promise has resolved already, dispatch the appropriate handlers asynchronously
							wait( dispatchHandlers );
						}

					});

					return promise2;
				}
			};

			promise[ 'catch' ] = function ( onRejected ) {
				return this.then( null, onRejected );
			};

			return promise;
		};

		_Promise.all = function ( promises ) {
			return new _Promise( function ( fulfil, reject ) {
				var result = [], pending, i, processPromise;

				if ( !promises.length ) {
					fulfil( result );
					return;
				}

				processPromise = function ( promise, i ) {
					if ( promise && typeof promise.then === 'function' ) {
						promise.then( function ( value ) {
							result[i] = value;
							--pending || fulfil( result );
						}, reject );
					}

					else {
						result[i] = promise;
						--pending || fulfil( result );
					}
				};

				pending = i = promises.length;
				while ( i-- ) {
					processPromise( promises[i], i );
				}
			});
		};

		_Promise.resolve = function ( value ) {
			return new _Promise( function ( fulfil ) {
				fulfil( value );
			});
		};

		_Promise.reject = function ( reason ) {
			return new _Promise( function ( fulfil, reject ) {
				reject( reason );
			});
		};
	}

	var Promise$1 = _Promise;

	// TODO use MutationObservers or something to simulate setImmediate
	function wait ( callback ) {
		setTimeout( callback, 0 );
	}

	function makeDispatcher ( handlers, result ) {
		return function () {
			var handler;

			while ( handler = handlers.shift() ) {
				handler( result );
			}
		};
	}

	function resolve ( promise, x, fulfil, reject ) {
		// Promise Resolution Procedure
		var then;

		// 2.3.1
		if ( x === promise ) {
			throw new TypeError( 'A promise\'s fulfillment handler cannot return the same promise' );
		}

		// 2.3.2
		if ( x instanceof _Promise ) {
			x.then( fulfil, reject );
		}

		// 2.3.3
		else if ( x && ( typeof x === 'object' || typeof x === 'function' ) ) {
			try {
				then = x.then; // 2.3.3.1
			} catch ( e ) {
				reject( e ); // 2.3.3.2
				return;
			}

			// 2.3.3.3
			if ( typeof then === 'function' ) {
				var called, resolvePromise, rejectPromise;

				resolvePromise = function ( y ) {
					if ( called ) {
						return;
					}
					called = true;
					resolve( promise, y, fulfil, reject );
				};

				rejectPromise = function ( r ) {
					if ( called ) {
						return;
					}
					called = true;
					reject( r );
				};

				try {
					then.call( x, resolvePromise, rejectPromise );
				} catch ( e ) {
					if ( !called ) { // 2.3.3.3.4.1
						reject( e ); // 2.3.3.3.4.2
						called = true;
						return;
					}
				}
			}

			else {
				fulfil( x );
			}
		}

		else {
			fulfil( x );
		}
	}

	var TransitionManager = function TransitionManager ( callback, parent ) {
		this.callback = callback;
		this.parent = parent;

		this.intros = [];
		this.outros = [];

		this.children = [];
		this.totalChildren = this.outroChildren = 0;

		this.detachQueue = [];
		this.outrosComplete = false;

		if ( parent ) {
			parent.addChild( this );
		}
	};

	TransitionManager.prototype.add = function add ( transition ) {
		var list = transition.isIntro ? this.intros : this.outros;
		list.push( transition );
	};

	TransitionManager.prototype.addChild = function addChild ( child ) {
		this.children.push( child );

		this.totalChildren += 1;
		this.outroChildren += 1;
	};

	TransitionManager.prototype.decrementOutros = function decrementOutros () {
		this.outroChildren -= 1;
		check( this );
	};

	TransitionManager.prototype.decrementTotal = function decrementTotal () {
		this.totalChildren -= 1;
		check( this );
	};

	TransitionManager.prototype.detachNodes = function detachNodes () {
		this.detachQueue.forEach( detach );
		this.children.forEach( _detachNodes );
		this.detachQueue = [];
	};

	TransitionManager.prototype.ready = function ready () {
		detachImmediate( this );
	};

	TransitionManager.prototype.remove = function remove ( transition ) {
		var list = transition.isIntro ? this.intros : this.outros;
		removeFromArray( list, transition );
		check( this );
	};

	TransitionManager.prototype.start = function start () {
		this.children.forEach( function ( c ) { return c.start(); } );
		this.intros.concat( this.outros ).forEach( function ( t ) { return t.start(); } );
		this.ready = true;
		check( this );
	};

	function detach ( element ) {
		element.detach();
	}

	function _detachNodes ( tm ) { // _ to avoid transpiler quirk
		tm.detachNodes();
	}

	function check ( tm ) {
		if ( !tm.ready || tm.outros.length || tm.outroChildren ) return;

		// If all outros are complete, and we haven't already done this,
		// we notify the parent if there is one, otherwise
		// start detaching nodes
		if ( !tm.outrosComplete ) {
			tm.outrosComplete = true;

			if ( tm.parent && !tm.parent.outrosComplete ) {
				tm.parent.decrementOutros( tm );
			} else {
				tm.detachNodes();
			}
		}

		// Once everything is done, we can notify parent transition
		// manager and call the callback
		if ( !tm.intros.length && !tm.totalChildren ) {
			if ( typeof tm.callback === 'function' ) {
				tm.callback();
			}

			if ( tm.parent && !tm.notifiedTotal ) {
				tm.notifiedTotal = true;
				tm.parent.decrementTotal();
			}
		}
	}

	// check through the detach queue to see if a node is up or downstream from a
	// transition and if not, go ahead and detach it
	function detachImmediate ( manager ) {
		var queue = manager.detachQueue;
		var outros = collectAllOutros( manager );

		var i = queue.length, j = 0, node, trans;
		start: while ( i-- ) {
			node = queue[i].node;
			j = outros.length;
			while ( j-- ) {
				trans = outros[j].element.node;
				// check to see if the node is, contains, or is contained by the transitioning node
				if ( trans === node || trans.contains( node ) || node.contains( trans ) ) continue start;
			}

			// no match, we can drop it
			queue[i].detach();
			queue.splice( i, 1 );
		}
	}

	function collectAllOutros ( manager, list ) {
		if ( !list ) {
			list = [];
			var parent = manager;
			while ( parent.parent ) parent = parent.parent;
			return collectAllOutros( parent, list );
		} else {
			var i = manager.children.length;
			while ( i-- ) {
				list = collectAllOutros( manager.children[i], list );
			}
			list = list.concat( manager.outros );
			return list;
		}
	}

	var changeHook = new Hook( 'change' );

	var batch;

	var runloop = {
		start: function ( instance, returnPromise ) {
			var promise, fulfilPromise;

			if ( returnPromise ) {
				promise = new Promise$1( function ( f ) { return ( fulfilPromise = f ); } );
			}

			batch = {
				previousBatch: batch,
				transitionManager: new TransitionManager( fulfilPromise, batch && batch.transitionManager ),
				fragments: [],
				tasks: [],
				immediateObservers: [],
				deferredObservers: [],
				ractives: [],
				instance: instance
			};

			return promise;
		},

		end: function () {
			flushChanges();

			if ( !batch.previousBatch ) batch.transitionManager.start();

			batch = batch.previousBatch;
		},

		addFragment: function ( fragment ) {
			addToArray( batch.fragments, fragment );
		},

		// TODO: come up with a better way to handle fragments that trigger their own update
		addFragmentToRoot: function ( fragment ) {
			if ( !batch ) return;

			var b = batch;
			while ( b.previousBatch ) {
				b = b.previousBatch;
			}

			addToArray( b.fragments, fragment );
		},

		addInstance: function ( instance ) {
			if ( batch ) addToArray( batch.ractives, instance );
		},

		addObserver: function ( observer, defer ) {
			addToArray( defer ? batch.deferredObservers : batch.immediateObservers, observer );
		},

		registerTransition: function ( transition ) {
			transition._manager = batch.transitionManager;
			batch.transitionManager.add( transition );
		},

		// synchronise node detachments with transition ends
		detachWhenReady: function ( thing ) {
			batch.transitionManager.detachQueue.push( thing );
		},

		scheduleTask: function ( task, postRender ) {
			var _batch;

			if ( !batch ) {
				task();
			} else {
				_batch = batch;
				while ( postRender && _batch.previousBatch ) {
					// this can't happen until the DOM has been fully updated
					// otherwise in some situations (with components inside elements)
					// transitions and decorators will initialise prematurely
					_batch = _batch.previousBatch;
				}

				_batch.tasks.push( task );
			}
		}
	};

	function dispatch ( observer ) {
		observer.dispatch();
	}

	function flushChanges () {
		var which = batch.immediateObservers;
		batch.immediateObservers = [];
		which.forEach( dispatch );

		// Now that changes have been fully propagated, we can update the DOM
		// and complete other tasks
		var i = batch.fragments.length;
		var fragment;

		which = batch.fragments;
		batch.fragments = [];
		var ractives = batch.ractives;
		batch.ractives = [];

		while ( i-- ) {
			fragment = which[i];

			// TODO deprecate this. It's annoying and serves no useful function
			var ractive = fragment.ractive;
			if ( Object.keys( ractive.viewmodel.changes ).length ) {
				changeHook.fire( ractive, ractive.viewmodel.changes );
			}
			ractive.viewmodel.changes = {};
			removeFromArray( ractives, ractive );

			fragment.update();
		}

		i = ractives.length;
		while ( i-- ) {
			var ractive$1 = ractives[i];
			changeHook.fire( ractive$1, ractive$1.viewmodel.changes );
			ractive$1.viewmodel.changes = {};
		}

		batch.transitionManager.ready();

		which = batch.deferredObservers;
		batch.deferredObservers = [];
		which.forEach( dispatch );

		var tasks = batch.tasks;
		batch.tasks = [];

		for ( i = 0; i < tasks.length; i += 1 ) {
			tasks[i]();
		}

		// If updating the view caused some model blowback - e.g. a triple
		// containing <option> elements caused the binding on the <select>
		// to update - then we start over
		if ( batch.fragments.length || batch.immediateObservers.length || batch.deferredObservers.length || batch.ractives.length || batch.tasks.length ) return flushChanges();
	}

	var refPattern = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
	var splitPattern = /([^\\](?:\\\\)*)\./;
	var escapeKeyPattern = /\\|\./g;
	var unescapeKeyPattern = /((?:\\)+)\1|\\(\.)/g;

	function escapeKey ( key ) {
		if ( typeof key === 'string' ) {
			return key.replace( escapeKeyPattern, '\\$&' );
		}

		return key;
	}

	function normalise ( ref ) {
		return ref ? ref.replace( refPattern, '.$1' ) : '';
	}

	function splitKeypathI ( keypath ) {
		var result = [],
			match;

		keypath = normalise( keypath );

		while ( match = splitPattern.exec( keypath ) ) {
			var index = match.index + match[1].length;
			result.push( keypath.substr( 0, index ) );
			keypath = keypath.substr( index + 1 );
		}

		result.push(keypath);

		return result;
	}

	function unescapeKey ( key ) {
		if ( typeof key === 'string' ) {
			return key.replace( unescapeKeyPattern, '$1$2' );
		}

		return key;
	}

	var fnBind = Function.prototype.bind;

	function bind ( fn, context ) {
		if ( !/this/.test( fn.toString() ) ) return fn;

		var bound = fnBind.call( fn, context );
		for ( var prop in fn ) bound[ prop ] = fn[ prop ];

		return bound;
	}

	function set ( ractive, pairs ) {
		var promise = runloop.start( ractive, true );

		var i = pairs.length;
		while ( i-- ) {
			var ref = pairs[i], model = ref[0], value = ref[1];
			if ( typeof value === 'function' ) value = bind( value, ractive );
			model.set( value );
		}

		runloop.end();

		return promise;
	}

	var star = /\*/;
	function gather ( ractive, keypath, base ) {
		if ( base === void 0 ) base = ractive.viewmodel;

		if ( star.test( keypath ) ) {
			return base.findMatches( splitKeypathI( keypath ) );
		} else {
			return [ base.joinAll( splitKeypathI( keypath ) ) ];
		}
	}

	function build ( ractive, keypath, value ) {
		var sets = [];

		// set multiple keypaths in one go
		if ( isObject( keypath ) ) {
			var loop = function ( k ) {
				if ( keypath.hasOwnProperty( k ) ) {
					sets.push.apply( sets, gather( ractive, k ).map( function ( m ) { return [ m, keypath[k] ]; } ) );
				}
			};

			for ( var k in keypath ) loop( k );

		}
		// set a single keypath
		else {
			sets.push.apply( sets, gather( ractive, keypath ).map( function ( m ) { return [ m, value ]; } ) );
		}

		return sets;
	}

	var errorMessage = 'Cannot add to a non-numeric value';

	function add ( ractive, keypath, d ) {
		if ( typeof keypath !== 'string' || !isNumeric( d ) ) {
			throw new Error( 'Bad arguments' );
		}

		var sets = build( ractive, keypath, d );

		return set( ractive, sets.map( function ( pair ) {
			var model = pair[0], add = pair[1], value = model.get();
			if ( !isNumeric( add ) || !isNumeric( value ) ) throw new Error( errorMessage );
			return [ model, value + add ];
		}));
	}

	function Ractive$add ( keypath, d ) {
		return add( this, keypath, ( d === undefined ? 1 : +d ) );
	}

	var noAnimation = Promise$1.resolve();
	defineProperty( noAnimation, 'stop', { value: noop });

	var linear = easing.linear;

	function getOptions ( options, instance ) {
		options = options || {};

		var easing;
		if ( options.easing ) {
			easing = typeof options.easing === 'function' ?
				options.easing :
				instance.easing[ options.easing ];
		}

		return {
			easing: easing || linear,
			duration: 'duration' in options ? options.duration : 400,
			complete: options.complete || noop,
			step: options.step || noop
		};
	}

	function protoAnimate ( ractive, model, to, options ) {
		options = getOptions( options, ractive );
		var from = model.get();

		// don't bother animating values that stay the same
		if ( isEqual( from, to ) ) {
			options.complete( options.to );
			return noAnimation; // TODO should this have .then and .catch methods?
		}

		var interpolator = interpolate( from, to, ractive, options.interpolator );

		// if we can't interpolate the value, set it immediately
		if ( !interpolator ) {
			runloop.start();
			model.set( to );
			runloop.end();

			return noAnimation;
		}

		return model.animate( from, to, options, interpolator );
	}

	function Ractive$animate ( keypath, to, options ) {
		if ( typeof keypath === 'object' ) {
			var keys = Object.keys( keypath );

			throw new Error( ("ractive.animate(...) no longer supports objects. Instead of ractive.animate({\n  " + (keys.map( function ( key ) { return ("'" + key + "': " + (keypath[ key ])); } ).join( '\n  ' )) + "\n}, {...}), do\n\n" + (keys.map( function ( key ) { return ("ractive.animate('" + key + "', " + (keypath[ key ]) + ", {...});"); } ).join( '\n' )) + "\n") );
		}


		return protoAnimate( this, this.viewmodel.joinAll( splitKeypathI( keypath ) ), to, options );
	}

	var detachHook = new Hook( 'detach' );

	function Ractive$detach () {
		if ( this.isDetached ) {
			return this.el;
		}

		if ( this.el ) {
			removeFromArray( this.el.__ractive_instances__, this );
		}

		this.el = this.fragment.detach();
		this.isDetached = true;

		detachHook.fire( this );
		return this.el;
	}

	function Ractive$find ( selector ) {
		if ( !this.el ) throw new Error( ("Cannot call ractive.find('" + selector + "') unless instance is rendered to the DOM") );

		return this.fragment.find( selector );
	}

	function sortByDocumentPosition ( node, otherNode ) {
		if ( node.compareDocumentPosition ) {
			var bitmask = node.compareDocumentPosition( otherNode );
			return ( bitmask & 2 ) ? 1 : -1;
		}

		// In old IE, we can piggy back on the mechanism for
		// comparing component positions
		return sortByItemPosition( node, otherNode );
	}

	function sortByItemPosition ( a, b ) {
		var ancestryA = getAncestry( a.component || a._ractive.proxy );
		var ancestryB = getAncestry( b.component || b._ractive.proxy );

		var oldestA = lastItem( ancestryA );
		var oldestB = lastItem( ancestryB );
		var mutualAncestor;

		// remove items from the end of both ancestries as long as they are identical
		// - the final one removed is the closest mutual ancestor
		while ( oldestA && ( oldestA === oldestB ) ) {
			ancestryA.pop();
			ancestryB.pop();

			mutualAncestor = oldestA;

			oldestA = lastItem( ancestryA );
			oldestB = lastItem( ancestryB );
		}

		// now that we have the mutual ancestor, we can find which is earliest
		oldestA = oldestA.component || oldestA;
		oldestB = oldestB.component || oldestB;

		var fragmentA = oldestA.parentFragment;
		var fragmentB = oldestB.parentFragment;

		// if both items share a parent fragment, our job is easy
		if ( fragmentA === fragmentB ) {
			var indexA = fragmentA.items.indexOf( oldestA );
			var indexB = fragmentB.items.indexOf( oldestB );

			// if it's the same index, it means one contains the other,
			// so we see which has the longest ancestry
			return ( indexA - indexB ) || ancestryA.length - ancestryB.length;
		}

		// if mutual ancestor is a section, we first test to see which section
		// fragment comes first
		var fragments = mutualAncestor.iterations;
		if ( fragments ) {
			var indexA$1 = fragments.indexOf( fragmentA );
			var indexB$1 = fragments.indexOf( fragmentB );

			return ( indexA$1 - indexB$1 ) || ancestryA.length - ancestryB.length;
		}

		throw new Error( 'An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/ractivejs/ractive/issues - thanks!' );
	}

	function getParent ( item ) {
		var parentFragment = item.parentFragment;

		if ( parentFragment ) return parentFragment.owner;

		if ( item.component && ( parentFragment = item.component.parentFragment ) ) {
			return parentFragment.owner;
		}
	}

	function getAncestry ( item ) {
		var ancestry = [ item ];
		var ancestor = getParent( item );

		while ( ancestor ) {
			ancestry.push( ancestor );
			ancestor = getParent( ancestor );
		}

		return ancestry;
	}


	var Query = function Query ( ractive, selector, live, isComponentQuery ) {
		this.ractive = ractive;
		this.selector = selector;
		this.live = live;
		this.isComponentQuery = isComponentQuery;

		this.result = [];

		this.dirty = true;
	};

	Query.prototype.add = function add ( item ) {
		this.result.push( item );
		this.makeDirty();
	};

	Query.prototype.cancel = function cancel () {
		var liveQueries = this._root[ this.isComponentQuery ? 'liveComponentQueries' : 'liveQueries' ];
		var selector = this.selector;

		var index = liveQueries.indexOf( selector );

		if ( index !== -1 ) {
			liveQueries.splice( index, 1 );
			liveQueries[ selector ] = null;
		}
	};

	Query.prototype.init = function init () {
		this.dirty = false;
	};

	Query.prototype.makeDirty = function makeDirty () {
		var this$1 = this;

			if ( !this.dirty ) {
			this.dirty = true;

			// Once the DOM has been updated, ensure the query
			// is correctly ordered
			runloop.scheduleTask( function () { return this$1.update(); } );
		}
	};

	Query.prototype.remove = function remove ( nodeOrComponent ) {
		var index = this.result.indexOf( this.isComponentQuery ? nodeOrComponent.instance : nodeOrComponent );
		if ( index !== -1 ) this.result.splice( index, 1 );
	};

	Query.prototype.update = function update () {
		this.result.sort( this.isComponentQuery ? sortByItemPosition : sortByDocumentPosition );
		this.dirty = false;
	};

	Query.prototype.test = function test ( item ) {
		return this.isComponentQuery ?
			( !this.selector || item.name === this.selector ) :
			( item ? matches( item, this.selector ) : null );
	};

	function Ractive$findAll ( selector, options ) {
		if ( !this.el ) throw new Error( ("Cannot call ractive.findAll('" + selector + "', ...) unless instance is rendered to the DOM") );

		options = options || {};
		var liveQueries = this._liveQueries;

		// Shortcut: if we're maintaining a live query with this
		// selector, we don't need to traverse the parallel DOM
		var query = liveQueries[ selector ];
		if ( query ) {
			// Either return the exact same query, or (if not live) a snapshot
			return ( options && options.live ) ? query : query.slice();
		}

		query = new Query( this, selector, !!options.live, false );

		// Add this to the list of live queries Ractive needs to maintain,
		// if applicable
		if ( query.live ) {
			liveQueries.push( selector );
			liveQueries[ '_' + selector ] = query;
		}

		this.fragment.findAll( selector, query );

		query.init();
		return query.result;
	}

	function Ractive$findAllComponents ( selector, options ) {
		options = options || {};
		var liveQueries = this._liveComponentQueries;

		// Shortcut: if we're maintaining a live query with this
		// selector, we don't need to traverse the parallel DOM
		var query = liveQueries[ selector ];
		if ( query ) {
			// Either return the exact same query, or (if not live) a snapshot
			return ( options && options.live ) ? query : query.slice();
		}

		query = new Query( this, selector, !!options.live, true );

		// Add this to the list of live queries Ractive needs to maintain,
		// if applicable
		if ( query.live ) {
			liveQueries.push( selector );
			liveQueries[ '_' + selector ] = query;
		}

		this.fragment.findAllComponents( selector, query );

		query.init();
		return query.result;
	}

	function Ractive$findComponent ( selector ) {
		return this.fragment.findComponent( selector );
	}

	function Ractive$findContainer ( selector ) {
		if ( this.container ) {
			if ( this.container.component && this.container.component.name === selector ) {
				return this.container;
			} else {
				return this.container.findContainer( selector );
			}
		}

		return null;
	}

	function Ractive$findParent ( selector ) {

		if ( this.parent ) {
			if ( this.parent.component && this.parent.component.name === selector ) {
				return this.parent;
			} else {
				return this.parent.findParent ( selector );
			}
		}

		return null;
	}

	function enqueue ( ractive, event ) {
		if ( ractive.event ) {
			ractive._eventQueue.push( ractive.event );
		}

		ractive.event = event;
	}

	function dequeue ( ractive ) {
		if ( ractive._eventQueue.length ) {
			ractive.event = ractive._eventQueue.pop();
		} else {
			ractive.event = null;
		}
	}

	var starMaps = {};

	// This function takes a keypath such as 'foo.bar.baz', and returns
	// all the variants of that keypath that include a wildcard in place
	// of a key, such as 'foo.bar.*', 'foo.*.baz', 'foo.*.*' and so on.
	// These are then checked against the dependants map (ractive.viewmodel.depsMap)
	// to see if any pattern observers are downstream of one or more of
	// these wildcard keypaths (e.g. 'foo.bar.*.status')
	function getPotentialWildcardMatches ( keypath ) {
		var keys, starMap, mapper, i, result, wildcardKeypath;

		keys = splitKeypathI( keypath );
		if( !( starMap = starMaps[ keys.length ]) ) {
			starMap = getStarMap( keys.length );
		}

		result = [];

		mapper = function ( star, i ) {
			return star ? '*' : keys[i];
		};

		i = starMap.length;
		while ( i-- ) {
			wildcardKeypath = starMap[i].map( mapper ).join( '.' );

			if ( !result.hasOwnProperty( wildcardKeypath ) ) {
				result.push( wildcardKeypath );
				result[ wildcardKeypath ] = true;
			}
		}

		return result;
	}

	// This function returns all the possible true/false combinations for
	// a given number - e.g. for two, the possible combinations are
	// [ true, true ], [ true, false ], [ false, true ], [ false, false ].
	// It does so by getting all the binary values between 0 and e.g. 11
	function getStarMap ( num ) {
		var ones = '', max, binary, starMap, mapper, i, j, l, map;

		if ( !starMaps[ num ] ) {
			starMap = [];

			while ( ones.length < num ) {
				ones += 1;
			}

			max = parseInt( ones, 2 );

			mapper = function ( digit ) {
				return digit === '1';
			};

			for ( i = 0; i <= max; i += 1 ) {
				binary = i.toString( 2 );
				while ( binary.length < num ) {
					binary = '0' + binary;
				}

				map = [];
				l = binary.length;
				for (j = 0; j < l; j++) {
					map.push( mapper( binary[j] ) );
				}
				starMap[i] = map;
			}

			starMaps[ num ] = starMap;
		}

		return starMaps[ num ];
	}

	var wildcardCache = {};

	function fireEvent ( ractive, eventName, options ) {
		if ( options === void 0 ) options = {};

		if ( !eventName ) { return; }

		if ( !options.event ) {
			options.event = {
				name: eventName,
				// until event not included as argument default
				_noArg: true
			};
		} else {
			options.event.name = eventName;
		}

		var eventNames = getWildcardNames( eventName );

		return fireEventAs( ractive, eventNames, options.event, options.args, true );
	}

	function getWildcardNames ( eventName ) {
		if ( wildcardCache.hasOwnProperty( eventName ) ) {
			return wildcardCache[ eventName ];
		} else {
			return wildcardCache[ eventName ] = getPotentialWildcardMatches( eventName );
		}
	}

	function fireEventAs  ( ractive, eventNames, event, args, initialFire ) {

		if ( initialFire === void 0 ) initialFire = false;

		var subscribers, i, bubble = true;

		enqueue( ractive, event );

		for ( i = eventNames.length; i >= 0; i-- ) {
			subscribers = ractive._subs[ eventNames[ i ] ];

			if ( subscribers ) {
				bubble = notifySubscribers( ractive, subscribers, event, args ) && bubble;
			}
		}

		dequeue( ractive );

		if ( ractive.parent && bubble ) {

			if ( initialFire && ractive.component ) {
				var fullName = ractive.component.name + '.' + eventNames[ eventNames.length-1 ];
				eventNames = getWildcardNames( fullName );

				if( event && !event.component ) {
					event.component = ractive;
				}
			}

			bubble = fireEventAs( ractive.parent, eventNames, event, args );
		}

		return bubble;
	}

	function notifySubscribers ( ractive, subscribers, event, args ) {
		var originalEvent = null, stopEvent = false;

		if ( event && !event._noArg ) {
			args = [ event ].concat( args );
		}

		// subscribers can be modified inflight, e.g. "once" functionality
		// so we need to copy to make sure everyone gets called
		subscribers = subscribers.slice();

		for ( var i = 0, len = subscribers.length; i < len; i += 1 ) {
			if ( !subscribers[ i ].off && subscribers[ i ].callback.apply( ractive, args ) === false ) {
				stopEvent = true;
			}
		}

		if ( event && !event._noArg && stopEvent && ( originalEvent = event.original ) ) {
			originalEvent.preventDefault && originalEvent.preventDefault();
			originalEvent.stopPropagation && originalEvent.stopPropagation();
		}

		return !stopEvent;
	}

	function Ractive$fire ( eventName ) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		return fireEvent( this, eventName, { args: args });
	}

	function badReference ( key ) {
		throw new Error( ("An index or key reference (" + key + ") cannot have child properties") );
	}

	function resolveAmbiguousReference ( fragment, ref ) {
		var localViewmodel = fragment.findContext().root;
		var keys = splitKeypathI( ref );
		var key = keys[0];

		var hasContextChain;
		var crossedComponentBoundary;
		var aliases;

		while ( fragment ) {
			// repeated fragments
			if ( fragment.isIteration ) {
				if ( key === fragment.parent.keyRef ) {
					if ( keys.length > 1 ) badReference( key );
					return fragment.context.getKeyModel( fragment.key );
				}

				if ( key === fragment.parent.indexRef ) {
					if ( keys.length > 1 ) badReference( key );
					return fragment.context.getKeyModel( fragment.index );
				}
			}

			// alias node or iteration
			if ( ( ( aliases = fragment.owner.aliases ) || ( aliases = fragment.aliases ) ) && aliases.hasOwnProperty( key ) ) {
				var model = aliases[ key ];

				if ( keys.length === 1 ) return model;
				else if ( typeof model.joinAll === 'function' ) {
					return model.joinAll( keys.slice( 1 ) );
				}
			}

			if ( fragment.context ) {
				// TODO better encapsulate the component check
				if ( !fragment.isRoot || fragment.ractive.component ) hasContextChain = true;

				if ( fragment.context.has( key ) ) {
					if ( crossedComponentBoundary ) {
						return localViewmodel.createLink( key, fragment.context.joinKey( keys.shift() ), key ).joinAll( keys );
					}

					return fragment.context.joinAll( keys );
				}
			}

			if ( fragment.componentParent && !fragment.ractive.isolated ) {
				// ascend through component boundary
				fragment = fragment.componentParent;
				crossedComponentBoundary = true;
			} else {
				fragment = fragment.parent;
			}
		}

		if ( !hasContextChain ) {
			return localViewmodel.joinAll( keys );
		}
	}

	var stack = [];
	var captureGroup;

	function startCapturing () {
		stack.push( captureGroup = [] );
	}

	function stopCapturing () {
		var dependencies = stack.pop();
		captureGroup = stack[ stack.length - 1 ];
		return dependencies;
	}

	function capture ( model ) {
		if ( captureGroup ) {
			captureGroup.push( model );
		}
	}

	var KeyModel = function KeyModel ( key, parent ) {
		this.value = key;
		this.isReadonly = this.isKey = true;
		this.deps = [];
		this.links = [];
		this.parent = parent;
	};

	KeyModel.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) capture( this );
		return unescapeKey( this.value );
	};

	KeyModel.prototype.getKeypath = function getKeypath () {
		return unescapeKey( this.value );
	};

	KeyModel.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			var i = this.deps.length;
		while ( i-- ) this$1.deps[i].rebinding( next, previous, false );

		i = this.links.length;
		while ( i-- ) this$1.links[i].rebinding( next, previous, false );
	};

	KeyModel.prototype.register = function register ( dependant ) {
		this.deps.push( dependant );
	};

	KeyModel.prototype.registerLink = function registerLink ( link ) {
		addToArray( this.links, link );
	};

	KeyModel.prototype.unregister = function unregister ( dependant ) {
		removeFromArray( this.deps, dependant );
	};

	KeyModel.prototype.unregisterLink = function unregisterLink ( link ) {
		removeFromArray( this.links, link );
	};

	KeyModel.prototype.reference = noop;
	KeyModel.prototype.unreference = noop;

	function bind$1               ( x ) { x.bind(); }
	function cancel             ( x ) { x.cancel(); }
	function handleChange       ( x ) { x.handleChange(); }
	function mark               ( x ) { x.mark(); }
	function marked             ( x ) { x.marked(); }
	function markedAll          ( x ) { x.markedAll(); }
	function notifiedUpstream   ( x ) { x.notifiedUpstream(); }
	function render             ( x ) { x.render(); }
	function teardown           ( x ) { x.teardown(); }
	function unbind             ( x ) { x.unbind(); }
	function unrender           ( x ) { x.unrender(); }
	function unrenderAndDestroy ( x ) { x.unrender( true ); }
	function update             ( x ) { x.update(); }
	function toString$1           ( x ) { return x.toString(); }
	function toEscapedString    ( x ) { return x.toString( true ); }

	var KeypathModel = function KeypathModel ( parent, ractive ) {
		this.parent = parent;
		this.ractive = ractive;
		this.value = ractive ? parent.getKeypath( ractive ) : parent.getKeypath();
		this.deps = [];
		this.children = {};
		this.isReadonly = this.isKeypath = true;
	};

	KeypathModel.prototype.get = function get ( shouldCapture ) {
		if ( shouldCapture ) capture( this );
		return this.value;
	};

	KeypathModel.prototype.getChild = function getChild ( ractive ) {
		if ( !( ractive._guid in this.children ) ) {
			var model = new KeypathModel( this.parent, ractive );
			this.children[ ractive._guid ] = model;
			model.owner = this;
		}
		return this.children[ ractive._guid ];
	};

	KeypathModel.prototype.getKeypath = function getKeypath () {
		return this.value;
	};

	KeypathModel.prototype.handleChange = function handleChange$1 () {
		var this$1 = this;

			var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].handleChange();
		}

		this.deps.forEach( handleChange );
	};

	KeypathModel.prototype.rebindChildren = function rebindChildren ( next ) {
		var this$1 = this;

			var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			var child = this$1.children[keys[i]];
			child.value = next.getKeypath( child.ractive );
			child.handleChange();
		}
	};

	KeypathModel.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			var model = next ? next.getKeypathModel( this.ractive ) : undefined;

		var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].rebinding( next, previous, false );
		}

		i = this.deps.length;
		while ( i-- ) {
			this$1.deps[i].rebinding( model, this$1, false );
		}
	};

	KeypathModel.prototype.register = function register ( dep ) {
		this.deps.push( dep );
	};

	KeypathModel.prototype.removeChild = function removeChild( model ) {
		if ( model.ractive ) delete this.children[ model.ractive._guid ];
	};

	KeypathModel.prototype.teardown = function teardown () {
		var this$1 = this;

			if ( this.owner ) this.owner.removeChild( this );

		var keys = Object.keys( this.children );
		var i = keys.length;
		while ( i-- ) {
			this$1.children[ keys[i] ].teardown();
		}
	};

	KeypathModel.prototype.unregister = function unregister ( dep ) {
		removeFromArray( this.deps, dep );
		if ( !this.deps.length ) this.teardown();
	};

	KeypathModel.prototype.reference = noop;
	KeypathModel.prototype.unreference = noop;

	var hasProp = Object.prototype.hasOwnProperty;

	var shuffleTasks = { early: [], mark: [] };
	var registerQueue = { early: [], mark: [] };

	var ModelBase = function ModelBase ( parent ) {
		this.deps = [];

		this.children = [];
		this.childByKey = {};
		this.links = [];

		this.keyModels = {};

		this.unresolved = [];
		this.unresolvedByKey = {};

		this.bindings = [];
		this.patternObservers = [];

		if ( parent ) {
			this.parent = parent;
			this.root = parent.root;
		}
	};

	ModelBase.prototype.addUnresolved = function addUnresolved ( key, resolver ) {
		if ( !this.unresolvedByKey[ key ] ) {
			this.unresolved.push( key );
			this.unresolvedByKey[ key ] = [];
		}

		this.unresolvedByKey[ key ].push( resolver );
	};

	ModelBase.prototype.addShuffleTask = function addShuffleTask ( task, stage ) { if ( stage === void 0 ) stage = 'early';

		shuffleTasks[stage].push( task ); };
	ModelBase.prototype.addShuffleRegister = function addShuffleRegister ( item, stage ) { if ( stage === void 0 ) stage = 'early';

		registerQueue[stage].push({ model: this, item: item }); };

	ModelBase.prototype.clearUnresolveds = function clearUnresolveds ( specificKey ) {
		var this$1 = this;

			var i = this.unresolved.length;

		while ( i-- ) {
			var key = this$1.unresolved[i];

			if ( specificKey && key !== specificKey ) continue;

			var resolvers = this$1.unresolvedByKey[ key ];
			var hasKey = this$1.has( key );

			var j = resolvers.length;
			while ( j-- ) {
				if ( hasKey ) resolvers[j].attemptResolution();
				if ( resolvers[j].resolved ) resolvers.splice( j, 1 );
			}

			if ( !resolvers.length ) {
				this$1.unresolved.splice( i, 1 );
				this$1.unresolvedByKey[ key ] = null;
			}
		}
	};

	ModelBase.prototype.findMatches = function findMatches ( keys ) {
		var len = keys.length;

		var existingMatches = [ this ];
		var matches;
		var i;

		var loop = function (  ) {
			var key = keys[i];

			if ( key === '*' ) {
				matches = [];
				existingMatches.forEach( function ( model ) {
					matches.push.apply( matches, model.getValueChildren( model.get() ) );
				});
			} else {
				matches = existingMatches.map( function ( model ) { return model.joinKey( key ); } );
			}

			existingMatches = matches;
		};

			for ( i = 0; i < len; i += 1 ) loop(  );

		return matches;
	};

	ModelBase.prototype.getKeyModel = function getKeyModel ( key, skip ) {
		if ( key !== undefined && !skip ) return this.parent.getKeyModel( key, true );

		if ( !( key in this.keyModels ) ) this.keyModels[ key ] = new KeyModel( escapeKey( key ), this );

		return this.keyModels[ key ];
	};

	ModelBase.prototype.getKeypath = function getKeypath ( ractive ) {
		if ( ractive !== this.ractive && this._link ) return this._link.target.getKeypath( ractive );

		if ( !this.keypath ) {
			this.keypath = this.parent.isRoot ? this.key : ("" + (this.parent.getKeypath( ractive )) + "." + (escapeKey( this.key )));
		}

		return this.keypath;
	};

	ModelBase.prototype.getValueChildren = function getValueChildren ( value ) {
		var this$1 = this;

			var children;
		if ( isArray( value ) ) {
			children = [];
			if ( 'length' in this && this.length !== value.length ) {
				children.push( this.joinKey( 'length' ) );
			}
			value.forEach( function ( m, i ) {
				children.push( this$1.joinKey( i ) );
			});
		}

		else if ( isObject( value ) || typeof value === 'function' ) {
			children = Object.keys( value ).map( function ( key ) { return this$1.joinKey( key ); } );
		}

		else if ( value != null ) {
			return [];
		}

		return children;
	};

	ModelBase.prototype.getVirtual = function getVirtual ( shouldCapture ) {
		var this$1 = this;

			var value = this.get( shouldCapture, { virtual: false } );
		if ( isObject( value ) ) {
			var result = isArray( value ) ? [] : {};

			var keys = Object.keys( value );
			var i = keys.length;
			while ( i-- ) {
				var child = this$1.childByKey[ keys[i] ];
				if ( !child ) result[ keys[i] ] = value[ keys[i] ];
				else if ( child._link ) result[ keys[i] ] = child._link.getVirtual();
				else result[ keys[i] ] = child.getVirtual();
			}

			i = this.children.length;
			while ( i-- ) {
				var child$1 = this$1.children[i];
				if ( !( child$1.key in result ) && child$1._link ) {
					result[ child$1.key ] = child$1._link.getVirtual();
				}
			}

			return result;
		} else return value;
	};

	ModelBase.prototype.has = function has ( key ) {
		if ( this._link ) return this._link.has( key );

		var value = this.get();
		if ( !value ) return false;

		key = unescapeKey( key );
		if ( hasProp.call( value, key ) ) return true;

		// We climb up the constructor chain to find if one of them contains the key
		var constructor = value.constructor;
		while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
			if ( hasProp.call( constructor.prototype, key ) ) return true;
			constructor = constructor.constructor;
		}

		return false;
	};

	ModelBase.prototype.joinAll = function joinAll ( keys, opts ) {
		var model = this;
		for ( var i = 0; i < keys.length; i += 1 ) {
			if ( opts && opts.lastLink === false && i + 1 === keys.length && model.childByKey[keys[i]] && model.childByKey[keys[i]]._link ) return model.childByKey[keys[i]];
			model = model.joinKey( keys[i], opts );
		}

		return model;
	};

	ModelBase.prototype.notifyUpstream = function notifyUpstream () {
		var parent = this.parent, path = [ this.key ];
		while ( parent ) {
			if ( parent.patternObservers.length ) parent.patternObservers.forEach( function ( o ) { return o.notify( path.slice() ); } );
			path.unshift( parent.key );
			parent.links.forEach( notifiedUpstream );
			parent.deps.forEach( handleChange );
			parent = parent.parent;
		}
	};

	ModelBase.prototype.rebinding = function rebinding ( next, previous, safe ) {
		// tell the deps to move to the new target
		var this$1 = this;

			var i = this.deps.length;
		while ( i-- ) {
			if ( this$1.deps[i].rebinding ) this$1.deps[i].rebinding( next, previous, safe );
		}

		i = this.links.length;
		while ( i-- ) {
			var link = this$1.links[i];
			// only relink the root of the link tree
			if ( link.owner._link ) link.relinking( next, true, safe );
		}

		i = this.children.length;
		while ( i-- ) {
			var child = this$1.children[i];
			child.rebinding( next ? next.joinKey( child.key ) : undefined, child, safe );
		}

		i = this.unresolved.length;
		while ( i-- ) {
			var unresolved = this$1.unresolvedByKey[ this$1.unresolved[i] ];
			var c = unresolved.length;
			while ( c-- ) {
				unresolved[c].rebinding( next, previous );
			}
		}

		if ( this.keypathModel ) this.keypathModel.rebinding( next, previous, false );

		i = this.bindings.length;
		while ( i-- ) {
			this$1.bindings[i].rebinding( next, previous, safe );
		}
	};

	ModelBase.prototype.reference = function reference () {
		'refs' in this ? this.refs++ : this.refs = 1;
	};

	ModelBase.prototype.register = function register ( dep ) {
		this.deps.push( dep );
	};

	ModelBase.prototype.registerChange = function registerChange ( key, value ) {
		if ( !this.isRoot ) {
			this.root.registerChange( key, value );
		} else {
			this.changes[ key ] = value;
			runloop.addInstance( this.root.ractive );
		}
	};

	ModelBase.prototype.registerLink = function registerLink ( link ) {
		addToArray( this.links, link );
	};

	ModelBase.prototype.registerPatternObserver = function registerPatternObserver ( observer ) {
		this.patternObservers.push( observer );
		this.register( observer );
	};

	ModelBase.prototype.registerTwowayBinding = function registerTwowayBinding ( binding ) {
		this.bindings.push( binding );
	};

	ModelBase.prototype.removeUnresolved = function removeUnresolved ( key, resolver ) {
		var resolvers = this.unresolvedByKey[ key ];

		if ( resolvers ) {
			removeFromArray( resolvers, resolver );
		}
	};

	ModelBase.prototype.shuffled = function shuffled () {
		var this$1 = this;

			var i = this.children.length;
		while ( i-- ) {
			this$1.children[i].shuffled();
		}
		if ( this.wrapper ) {
			this.wrapper.teardown();
			this.wrapper = null;
			this.rewrap = true;
		}
	};

	ModelBase.prototype.unreference = function unreference () {
		if ( 'refs' in this ) this.refs--;
	};

	ModelBase.prototype.unregister = function unregister ( dep ) {
		removeFromArray( this.deps, dep );
	};

	ModelBase.prototype.unregisterLink = function unregisterLink ( link ) {
		removeFromArray( this.links, link );
	};

	ModelBase.prototype.unregisterPatternObserver = function unregisterPatternObserver ( observer ) {
		removeFromArray( this.patternObservers, observer );
		this.unregister( observer );
	};

	ModelBase.prototype.unregisterTwowayBinding = function unregisterTwowayBinding ( binding ) {
		removeFromArray( this.bindings, binding );
	};

	ModelBase.prototype.updateFromBindings = function updateFromBindings$1 ( cascade ) {
		var this$1 = this;

			var i = this.bindings.length;
		while ( i-- ) {
			var value = this$1.bindings[i].getValue();
			if ( value !== this$1.value ) this$1.set( value );
		}

		// check for one-way bindings if there are no two-ways
		if ( !this.bindings.length ) {
			var oneway = findBoundValue( this.deps );
			if ( oneway && oneway.value !== this.value ) this.set( oneway.value );
		}

		if ( cascade ) {
			this.children.forEach( updateFromBindings );
			this.links.forEach( updateFromBindings );
			if ( this._link ) this._link.updateFromBindings( cascade );
		}
	};

	function updateFromBindings ( model ) {
		model.updateFromBindings( true );
	}

	function findBoundValue( list ) {
		var i = list.length;
		while ( i-- ) {
			if ( list[i].bound ) {
				var owner = list[i].owner;
				if ( owner ) {
					var value = owner.name === 'checked' ?
						owner.node.checked :
						owner.node.value;
					return { value: value };
				}
			}
		}
	}

	function fireShuffleTasks ( stage ) {
		if ( !stage ) {
			fireShuffleTasks( 'early' );
			fireShuffleTasks( 'mark' );
		} else {
			var tasks = shuffleTasks[stage];
			shuffleTasks[stage] = [];
			var i = tasks.length;
			while ( i-- ) tasks[i]();

			var register = registerQueue[stage];
			registerQueue[stage] = [];
			i = register.length;
			while ( i-- ) register[i].model.register( register[i].item );
		}
	}

	KeyModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
	KeyModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;
	KeypathModel.prototype.addShuffleTask = ModelBase.prototype.addShuffleTask;
	KeypathModel.prototype.addShuffleRegister = ModelBase.prototype.addShuffleRegister;

	// this is the dry method of checking to see if a rebind applies to
	// a particular keypath because in some cases, a dep may be bound
	// directly to a particular keypath e.g. foo.bars.0.baz and need
	// to avoid getting kicked to foo.bars.1.baz if foo.bars is unshifted
	function rebindMatch ( template, next, previous ) {
		var keypath = template.r || template;

		// no valid keypath, go with next
		if ( !keypath || typeof keypath !== 'string' ) return next;

		// completely contextual ref, go with next
		if ( keypath === '.' || keypath[0] === '@' || (next || previous).isKey || (next || previous).isKeypath ) return next;

		var parts = keypath.split( '/' );
		var keys = splitKeypathI( parts[ parts.length - 1 ] );

		// check the keypath against the model keypath to see if it matches
		var model = next || previous;
		var i = keys.length;
		var match = true, shuffling = false;

		while ( model && i-- ) {
			if ( model.shuffling ) shuffling = true;
			// non-strict comparison to account for indices in keypaths
			if ( keys[i] != model.key ) match = false;
			model = model.parent;
		}

		// next is undefined, but keypath is shuffling and previous matches
		if ( !next && match && shuffling ) return previous;
		// next is defined, but doesn't match the keypath
		else if ( next && !match && shuffling ) return previous;
		else return next;
	}

	var LinkModel = (function (ModelBase) {
		function LinkModel ( parent, owner, target, key ) {
			ModelBase.call( this, parent );

			this.owner = owner;
			this.target = target;
			this.key = key === undefined ? owner.key : key;
			if ( owner.isLink ) this.sourcePath = "" + (owner.sourcePath) + "." + (this.key);

			target.registerLink( this );

			this.isReadonly = parent.isReadonly;

			this.isLink = true;
		}

		LinkModel.prototype = Object.create( ModelBase && ModelBase.prototype );
		LinkModel.prototype.constructor = LinkModel;

		LinkModel.prototype.animate = function animate ( from, to, options, interpolator ) {
			return this.target.animate( from, to, options, interpolator );
		};

		LinkModel.prototype.applyValue = function applyValue ( value ) {
			this.target.applyValue( value );
		};

		LinkModel.prototype.get = function get ( shouldCapture, opts ) {
			if ( shouldCapture ) {
				capture( this );

				// may need to tell the target to unwrap
				opts = opts || {};
				opts.unwrap = true;
			}

			return this.target.get( false, opts );
		};

		LinkModel.prototype.getKeypath = function getKeypath ( ractive ) {
			if ( ractive && ractive !== this.root.ractive ) return this.target.getKeypath( ractive );

			return ModelBase.prototype.getKeypath.call( this, ractive );
		};

		LinkModel.prototype.getKeypathModel = function getKeypathModel ( ractive ) {
			if ( !this.keypathModel ) this.keypathModel = new KeypathModel( this );
			if ( ractive && ractive !== this.root.ractive ) return this.keypathModel.getChild( ractive );
			return this.keypathModel;
		};

		LinkModel.prototype.handleChange = function handleChange$1 () {
			this.deps.forEach( handleChange );
			this.links.forEach( handleChange );
			this.notifyUpstream();
		};

		LinkModel.prototype.joinKey = function joinKey ( key ) {
			// TODO: handle nested links
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new LinkModel( this, this, this.target.joinKey( key ), key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		LinkModel.prototype.mark = function mark () {
			this.target.mark();
		};

		LinkModel.prototype.marked = function marked$1 () {
			this.links.forEach( marked );

			this.deps.forEach( handleChange );
			this.clearUnresolveds();
		};

		LinkModel.prototype.markedAll = function markedAll$1 () {
			this.children.forEach( markedAll );
			this.marked();
		};

		LinkModel.prototype.notifiedUpstream = function notifiedUpstream$1 () {
			this.links.forEach( notifiedUpstream );
			this.deps.forEach( handleChange );
		};

		LinkModel.prototype.relinked = function relinked () {
			this.target.registerLink( this );
			this.children.forEach( function ( c ) { return c.relinked(); } );
		};

		LinkModel.prototype.relinking = function relinking ( target, root, safe ) {
			var this$1 = this;

			if ( root && this.sourcePath ) target = rebindMatch( this.sourcePath, target, this.target );
			if ( !target || this.target === target ) return;

			this.target.unregisterLink( this );
			if ( this.keypathModel ) this.keypathModel.rebindChildren( target );

			this.target = target;
			this.children.forEach( function ( c ) {
				c.relinking( target.joinKey( c.key ), false, safe );
			});

			if ( root ) this.addShuffleTask( function () {
				this$1.relinked();
				if ( !safe ) this$1.notifyUpstream();
			});
		};

		LinkModel.prototype.set = function set ( value ) {
			this.target.set( value );
		};

		LinkModel.prototype.shuffle = function shuffle ( newIndices ) {
			// watch for extra shuffles caused by a shuffle in a downstream link
			var this$1 = this;

			if ( this.shuffling ) return;

			// let the real model handle firing off shuffles
			if ( !this.target.shuffling ) {
				this.target.shuffle( newIndices );
			} else {
				this.shuffling = true;

				var i = newIndices.length;
				while ( i-- ) {
					var idx = newIndices[ i ];
					// nothing is actually changing, so move in the index and roll on
					if ( i === idx ) {
						continue;
					}

					// rebind the children on i to idx
					if ( i in this$1.childByKey ) this$1.childByKey[ i ].rebinding( !~idx ? undefined : this$1.joinKey( idx ), this$1.childByKey[ i ], true );

					if ( !~idx && this$1.keyModels[ i ] ) {
						this$1.keyModels[i].rebinding( undefined, this$1.keyModels[i], false );
					} else if ( ~idx && this$1.keyModels[ i ] ) {
						if ( !this$1.keyModels[ idx ] ) this$1.childByKey[ idx ].getKeyModel( idx );
						this$1.keyModels[i].rebinding( this$1.keyModels[ idx ], this$1.keyModels[i], false );
					}
				}

				var upstream = this.source().length !== this.source().value.length;

				this.links.forEach( function ( l ) { return l.shuffle( newIndices ); } );

				i = this.deps.length;
				while ( i-- ) {
					if ( this$1.deps[i].shuffle ) this$1.deps[i].shuffle( newIndices );
				}

				this.marked();

				if ( upstream ) this.notifyUpstream();

				this.shuffling = false;
			}

		};

		LinkModel.prototype.source = function source () {
			if ( this.target.source ) return this.target.source();
			else return this.target;
		};

		LinkModel.prototype.teardown = function teardown$1 () {
			if ( this._link ) this._link.teardown();
			this.target.unregisterLink( this );
			this.children.forEach( teardown );
		};

		return LinkModel;
	}(ModelBase));

	ModelBase.prototype.link = function link ( model, keypath ) {
		var lnk = this._link || new LinkModel( this.parent, this, model, this.key );
		lnk.sourcePath = keypath;
		if ( this._link ) this._link.relinking( model, true, false );
		this.rebinding( lnk, this, false );
		fireShuffleTasks();

		var unresolved = !this._link;
		this._link = lnk;
		if ( unresolved ) this.parent.clearUnresolveds();
		lnk.markedAll();
		return lnk;
	};

	ModelBase.prototype.unlink = function unlink () {
		if ( this._link ) {
			var ln = this._link;
			this._link = undefined;
			ln.rebinding( this, this._link );
			fireShuffleTasks();
			ln.teardown();
		}
	};

	var requestAnimationFrame;

	// If window doesn't exist, we don't need requestAnimationFrame
	if ( !win ) {
		requestAnimationFrame = null;
	} else {
		// https://gist.github.com/paulirish/1579671
		(function(vendors, lastTime, win) {

			var x, setTimeout;

			if ( win.requestAnimationFrame ) {
				return;
			}

			for ( x = 0; x < vendors.length && !win.requestAnimationFrame; ++x ) {
				win.requestAnimationFrame = win[vendors[x]+'RequestAnimationFrame'];
			}

			if ( !win.requestAnimationFrame ) {
				setTimeout = win.setTimeout;

				win.requestAnimationFrame = function(callback) {
					var currTime, timeToCall, id;

					currTime = Date.now();
					timeToCall = Math.max( 0, 16 - (currTime - lastTime ) );
					id = setTimeout( function() { callback(currTime + timeToCall); }, timeToCall );

					lastTime = currTime + timeToCall;
					return id;
				};
			}

		}( vendors, 0, win ));

		requestAnimationFrame = win.requestAnimationFrame;
	}

	var rAF = requestAnimationFrame;

	var getTime = ( win && win.performance && typeof win.performance.now === 'function' ) ?
		function () { return win.performance.now(); } :
		function () { return Date.now(); };

	// TODO what happens if a transition is aborted?

	var tickers = [];
	var running = false;

	function tick () {
		runloop.start();

		var now = getTime();

		var i;
		var ticker;

		for ( i = 0; i < tickers.length; i += 1 ) {
			ticker = tickers[i];

			if ( !ticker.tick( now ) ) {
				// ticker is complete, remove it from the stack, and decrement i so we don't miss one
				tickers.splice( i--, 1 );
			}
		}

		runloop.end();

		if ( tickers.length ) {
			rAF( tick );
		} else {
			running = false;
		}
	}

	var Ticker = function Ticker ( options ) {
		this.duration = options.duration;
		this.step = options.step;
		this.complete = options.complete;
		this.easing = options.easing;

		this.start = getTime();
		this.end = this.start + this.duration;

		this.running = true;

		tickers.push( this );
		if ( !running ) rAF( tick );
	};

	Ticker.prototype.tick = function tick$1 ( now ) {
		if ( !this.running ) return false;

		if ( now > this.end ) {
			if ( this.step ) this.step( 1 );
			if ( this.complete ) this.complete( 1 );

			return false;
		}

		var elapsed = now - this.start;
		var eased = this.easing( elapsed / this.duration );

		if ( this.step ) this.step( eased );

		return true;
	};

	Ticker.prototype.stop = function stop () {
		if ( this.abort ) this.abort();
		this.running = false;
	};

	var prefixers = {};

	// TODO this is legacy. sooner we can replace the old adaptor API the better
	function prefixKeypath ( obj, prefix ) {
		var prefixed = {}, key;

		if ( !prefix ) {
			return obj;
		}

		prefix += '.';

		for ( key in obj ) {
			if ( obj.hasOwnProperty( key ) ) {
				prefixed[ prefix + key ] = obj[ key ];
			}
		}

		return prefixed;
	}

	function getPrefixer ( rootKeypath ) {
		var rootDot;

		if ( !prefixers[ rootKeypath ] ) {
			rootDot = rootKeypath ? rootKeypath + '.' : '';

			prefixers[ rootKeypath ] = function ( relativeKeypath, value ) {
				var obj;

				if ( typeof relativeKeypath === 'string' ) {
					obj = {};
					obj[ rootDot + relativeKeypath ] = value;
					return obj;
				}

				if ( typeof relativeKeypath === 'object' ) {
					// 'relativeKeypath' is in fact a hash, not a keypath
					return rootDot ? prefixKeypath( relativeKeypath, rootKeypath ) : relativeKeypath;
				}
			};
		}

		return prefixers[ rootKeypath ];
	}

	var Model = (function (ModelBase) {
		function Model ( parent, key ) {
			ModelBase.call( this, parent );

			this.ticker = null;

			if ( parent ) {
				this.key = unescapeKey( key );
				this.isReadonly = parent.isReadonly;

				if ( parent.value ) {
					this.value = parent.value[ this.key ];
					if ( isArray( this.value ) ) this.length = this.value.length;
					this.adapt();
				}
			}
		}

		Model.prototype = Object.create( ModelBase && ModelBase.prototype );
		Model.prototype.constructor = Model;

		Model.prototype.adapt = function adapt () {
			var this$1 = this;

			var adaptors = this.root.adaptors;
			var len = adaptors.length;

			this.rewrap = false;

			// Exit early if no adaptors
			if ( len === 0 ) return;

			var value = this.wrapper ? ( 'newWrapperValue' in this ? this.newWrapperValue : this.wrapperValue ) : this.value;

			// TODO remove this legacy nonsense
			var ractive = this.root.ractive;
			var keypath = this.getKeypath();

			// tear previous adaptor down if present
			if ( this.wrapper ) {
				var shouldTeardown = this.wrapperValue === value ? false : !this.wrapper.reset || this.wrapper.reset( value ) === false;

				if ( shouldTeardown ) {
					this.wrapper.teardown();
					this.wrapper = null;

					// don't branch for undefined values
					if ( this.value !== undefined ) {
						var parentValue = this.parent.value || this.parent.createBranch( this.key );
						if ( parentValue[ this.key ] !== value ) parentValue[ this.key ] = value;
					}
				} else {
					delete this.newWrapperValue;
					this.wrapperValue = value;
					this.value = this.wrapper.get();
					return;
				}
			}

			var i;

			for ( i = 0; i < len; i += 1 ) {
				var adaptor = adaptors[i];
				if ( adaptor.filter( value, keypath, ractive ) ) {
					this$1.wrapper = adaptor.wrap( ractive, value, keypath, getPrefixer( keypath ) );
					this$1.wrapperValue = value;
					this$1.wrapper.__model = this$1; // massive temporary hack to enable array adaptor

					this$1.value = this$1.wrapper.get();

					break;
				}
			}
		};

		Model.prototype.animate = function animate ( from, to, options, interpolator ) {
			var this$1 = this;

			if ( this.ticker ) this.ticker.stop();

			var fulfilPromise;
			var promise = new Promise$1( function ( fulfil ) { return fulfilPromise = fulfil; } );

			this.ticker = new Ticker({
				duration: options.duration,
				easing: options.easing,
				step: function ( t ) {
					var value = interpolator( t );
					this$1.applyValue( value );
					if ( options.step ) options.step( t, value );
				},
				complete: function () {
					this$1.applyValue( to );
					if ( options.complete ) options.complete( to );

					this$1.ticker = null;
					fulfilPromise();
				}
			});

			promise.stop = this.ticker.stop;
			return promise;
		};

		Model.prototype.applyValue = function applyValue ( value ) {
			if ( isEqual( value, this.value ) ) return;

			// TODO deprecate this nonsense
			this.registerChange( this.getKeypath(), value );

			if ( this.parent.wrapper && this.parent.wrapper.set ) {
				this.parent.wrapper.set( this.key, value );
				this.parent.value = this.parent.wrapper.get();

				this.value = this.parent.value[ this.key ];
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			} else if ( this.wrapper ) {
				this.newWrapperValue = value;
				this.adapt();
			} else {
				var parentValue = this.parent.value || this.parent.createBranch( this.key );
				parentValue[ this.key ] = value;

				this.value = value;
				this.adapt();
			}

			this.parent.clearUnresolveds();
			this.clearUnresolveds();

			// keep track of array stuff
			if ( isArray( value ) ) {
				this.length = value.length;
				this.isArray = true;
			} else {
				this.isArray = false;
			}

			// notify dependants
			this.links.forEach( handleChange );
			this.children.forEach( mark );
			this.deps.forEach( handleChange );

			this.notifyUpstream();

			if ( this.parent.isArray ) {
				if ( this.key === 'length' ) this.parent.length = value;
				else this.parent.joinKey( 'length' ).mark();
			}
		};

		Model.prototype.createBranch = function createBranch ( key ) {
			var branch = isNumeric( key ) ? [] : {};
			this.set( branch );

			return branch;
		};

		Model.prototype.get = function get ( shouldCapture, opts ) {
			if ( this._link ) return this._link.get( shouldCapture, opts );
			if ( shouldCapture ) capture( this );
			// if capturing, this value needs to be unwrapped because it's for external use
			if ( opts && opts.virtual ) return this.getVirtual( false );
			return ( shouldCapture || ( opts && opts.unwrap ) ) && this.wrapper ? this.wrapperValue : this.value;
		};

		Model.prototype.getKeypathModel = function getKeypathModel ( ractive ) {
			if ( !this.keypathModel ) this.keypathModel = new KeypathModel( this );
			return this.keypathModel;
		};

		Model.prototype.joinKey = function joinKey ( key, opts ) {
			if ( this._link ) {
				if ( opts && !opts.lastLink === false && ( key === undefined || key === '' ) ) return this;
				return this._link.joinKey( key );
			}

			if ( key === undefined || key === '' ) return this;


			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new Model( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			if ( this.childByKey[ key ]._link ) return this.childByKey[ key ]._link;
			return this.childByKey[ key ];
		};

		Model.prototype.mark = function mark$1 () {
			if ( this._link ) return this._link.mark();

			var value = this.retrieve();

			if ( !isEqual( value, this.value ) ) {
				var old = this.value;
				this.value = value;

				// make sure the wrapper stays in sync
				if ( old !== value || this.rewrap ) {
					if ( this.wrapper ) this.newWrapperValue = value;
					this.adapt();
				}

				// keep track of array stuff
				if ( isArray( value ) ) {
					this.length = value.length;
					this.isArray = true;
				} else {
					this.isArray = false;
				}

				this.children.forEach( mark );
				this.links.forEach( marked );

				this.deps.forEach( handleChange );
				this.clearUnresolveds();
			}
		};

		Model.prototype.merge = function merge ( array, comparator ) {
			var oldArray = this.value, newArray = array;
			if ( oldArray === newArray ) oldArray = recreateArray( this );
			if ( comparator ) {
				oldArray = oldArray.map( comparator );
				newArray = newArray.map( comparator );
			}

			var oldLength = oldArray.length;

			var usedIndices = {};
			var firstUnusedIndex = 0;

			var newIndices = oldArray.map( function ( item ) {
				var index;
				var start = firstUnusedIndex;

				do {
					index = newArray.indexOf( item, start );

					if ( index === -1 ) {
						return -1;
					}

					start = index + 1;
				} while ( ( usedIndices[ index ] === true ) && start < oldLength );

				// keep track of the first unused index, so we don't search
				// the whole of newArray for each item in oldArray unnecessarily
				if ( index === firstUnusedIndex ) {
					firstUnusedIndex += 1;
				}
				// allow next instance of next "equal" to be found item
				usedIndices[ index ] = true;
				return index;
			});

			this.parent.value[ this.key ] = array;
			this.shuffle( newIndices );
		};

		Model.prototype.retrieve = function retrieve () {
			return this.parent.value ? this.parent.value[ this.key ] : undefined;
		};

		Model.prototype.set = function set ( value ) {
			if ( this.ticker ) this.ticker.stop();
			this.applyValue( value );
		};

		Model.prototype.shuffle = function shuffle ( newIndices ) {
			var this$1 = this;

			this.shuffling = true;
			var i = newIndices.length;
			while ( i-- ) {
				var idx = newIndices[ i ];
				// nothing is actually changing, so move in the index and roll on
				if ( i === idx ) {
					continue;
				}

				// rebind the children on i to idx
				if ( i in this$1.childByKey ) this$1.childByKey[ i ].rebinding( !~idx ? undefined : this$1.joinKey( idx ), this$1.childByKey[ i ], true );

				if ( !~idx && this$1.keyModels[ i ] ) {
					this$1.keyModels[i].rebinding( undefined, this$1.keyModels[i], false );
				} else if ( ~idx && this$1.keyModels[ i ] ) {
					if ( !this$1.keyModels[ idx ] ) this$1.childByKey[ idx ].getKeyModel( idx );
					this$1.keyModels[i].rebinding( this$1.keyModels[ idx ], this$1.keyModels[i], false );
				}
			}

			var upstream = this.length !== this.value.length;

			this.links.forEach( function ( l ) { return l.shuffle( newIndices ); } );
			fireShuffleTasks( 'early' );

			i = this.deps.length;
			while ( i-- ) {
				if ( this$1.deps[i].shuffle ) this$1.deps[i].shuffle( newIndices );
			}

			this.mark();
			fireShuffleTasks( 'mark' );

			if ( upstream ) this.notifyUpstream();
			this.shuffling = false;
		};

		Model.prototype.teardown = function teardown$1 () {
			if ( this._link ) this._link.teardown();
			this.children.forEach( teardown );
			if ( this.wrapper ) this.wrapper.teardown();
			if ( this.keypathModel ) this.keypathModel.teardown();
		};

		return Model;
	}(ModelBase));

	function recreateArray( model ) {
		var array = [];

		for ( var i = 0; i < model.length; i++ ) {
			array[ i ] = (model.childByKey[i] || {}).value;
		}

		return array;
	}

	var GlobalModel = (function (Model) {
		function GlobalModel ( ) {
			Model.call( this, null, '@global' );
			this.value = typeof global !== 'undefined' ? global : window;
			this.isRoot = true;
			this.root = this;
			this.adaptors = [];
		}

		GlobalModel.prototype = Object.create( Model && Model.prototype );
		GlobalModel.prototype.constructor = GlobalModel;

		GlobalModel.prototype.getKeypath = function getKeypath() {
			return '@global';
		};

		// global model doesn't contribute changes events because it has no instance
		GlobalModel.prototype.registerChange = function registerChange () {};

		return GlobalModel;
	}(Model));

	var GlobalModel$1 = new GlobalModel();

	var keypathExpr = /^@[^\(]+\(([^\)]+)\)/;

	function resolveReference ( fragment, ref ) {
		var context = fragment.findContext();

		// special references
		// TODO does `this` become `.` at parse time?
		if ( ref === '.' || ref === 'this' ) return context;
		if ( ref.indexOf( '@keypath' ) === 0 ) {
			var match = keypathExpr.exec( ref );
			if ( match && match[1] ) {
				var model = resolveReference( fragment, match[1] );
				if ( model ) return model.getKeypathModel();
			}
			return context.getKeypathModel();
		}
		if ( ref.indexOf( '@rootpath' ) === 0 ) {
			// check to see if this is an empty component root
			while ( context.isRoot && context.ractive.component ) {
				context = context.ractive.component.parentFragment.findContext();
			}

			var match$1 = keypathExpr.exec( ref );
			if ( match$1 && match$1[1] ) {
				var model$1 = resolveReference( fragment, match$1[1] );
				if ( model$1 ) return model$1.getKeypathModel( fragment.ractive.root );
			}
			return context.getKeypathModel( fragment.ractive.root );
		}
		if ( ref === '@index' || ref === '@key' ) {
			var repeater = fragment.findRepeatingFragment();
			// make sure the found fragment is actually an iteration
			if ( !repeater.isIteration ) return;
			return repeater.context.getKeyModel( repeater[ ref[1] === 'i' ? 'index' : 'key' ] );
		}
		if ( ref === '@this' ) {
			return fragment.ractive.viewmodel.getRactiveModel();
		}
		if ( ref === '@global' ) {
			return GlobalModel$1;
		}

		// ancestor references
		if ( ref[0] === '~' ) return fragment.ractive.viewmodel.joinAll( splitKeypathI( ref.slice( 2 ) ) );
		if ( ref[0] === '.' ) {
			var parts = ref.split( '/' );

			while ( parts[0] === '.' || parts[0] === '..' ) {
				var part = parts.shift();

				if ( part === '..' ) {
					context = context.parent;
				}
			}

			ref = parts.join( '/' );

			// special case - `{{.foo}}` means the same as `{{./foo}}`
			if ( ref[0] === '.' ) ref = ref.slice( 1 );
			return context.joinAll( splitKeypathI( ref ) );
		}

		return resolveAmbiguousReference( fragment, ref );
	}

	function Ractive$get ( keypath, opts ) {
		if ( typeof keypath !== 'string' ) return this.viewmodel.get( true, keypath );

		var keys = splitKeypathI( keypath );
		var key = keys[0];

		var model;

		if ( !this.viewmodel.has( key ) ) {
			// if this is an inline component, we may need to create
			// an implicit mapping
			if ( this.component && !this.isolated ) {
				model = resolveReference( this.component.parentFragment, key );

				if ( model ) {
					this.viewmodel.map( key, model );
				}
			}
		}

		model = this.viewmodel.joinAll( keys );
		return model.get( true, opts );
	}

	function gatherRefs( fragment ) {
		var key = {}, index = {};

		// walk up the template gather refs as we go
		while ( fragment ) {
			if ( fragment.parent && ( fragment.parent.indexRef || fragment.parent.keyRef ) ) {
				var ref = fragment.parent.indexRef;
				if ( ref && !( ref in index ) ) index[ref] = fragment.index;
				ref = fragment.parent.keyRef;
				if ( ref && !( ref in key ) ) key[ref] = fragment.key;
			}

			if ( fragment.componentParent && !fragment.ractive.isolated ) {
				fragment = fragment.componentParent;
			} else {
				fragment = fragment.parent;
			}
		}

		return { key: key, index: index };
	}

	// This function takes an array, the name of a mutator method, and the
	// arguments to call that mutator method with, and returns an array that
	// maps the old indices to their new indices.

	// So if you had something like this...
	//
	//     array = [ 'a', 'b', 'c', 'd' ];
	//     array.push( 'e' );
	//
	// ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
	// have changed. If you then did this...
	//
	//     array.unshift( 'z' );
	//
	// ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
	// one higher to make room for the 'z'. If you removed an item, the new index
	// would be -1...
	//
	//     array.splice( 2, 2 );
	//
	// ...this would result in [ 0, 1, -1, -1, 2, 3 ].
	//
	// This information is used to enable fast, non-destructive shuffling of list
	// sections when you do e.g. `ractive.splice( 'items', 2, 2 );

	function getNewIndices ( length, methodName, args ) {
		var spliceArguments, newIndices = [], removeStart, removeEnd, balance, i;

		spliceArguments = getSpliceEquivalent( length, methodName, args );

		if ( !spliceArguments ) {
			return null; // TODO support reverse and sort?
		}

		balance = ( spliceArguments.length - 2 ) - spliceArguments[1];

		removeStart = Math.min( length, spliceArguments[0] );
		removeEnd = removeStart + spliceArguments[1];
		newIndices.startIndex = removeStart;

		for ( i = 0; i < removeStart; i += 1 ) {
			newIndices.push( i );
		}

		for ( ; i < removeEnd; i += 1 ) {
			newIndices.push( -1 );
		}

		for ( ; i < length; i += 1 ) {
			newIndices.push( i + balance );
		}

		// there is a net shift for the rest of the array starting with index + balance
		if ( balance !== 0 ) {
			newIndices.touchedFrom = spliceArguments[0];
		} else {
			newIndices.touchedFrom = length;
		}

		return newIndices;
	}


	// The pop, push, shift an unshift methods can all be represented
	// as an equivalent splice
	function getSpliceEquivalent ( length, methodName, args ) {
		switch ( methodName ) {
			case 'splice':
				if ( args[0] !== undefined && args[0] < 0 ) {
					args[0] = length + Math.max( args[0], -length );
				}

				if ( args[0] === undefined ) args[0] = 0;

				while ( args.length < 2 ) {
					args.push( length - args[0] );
				}

				if ( typeof args[1] !== 'number' ) {
					args[1] = length - args[0];
				}

				// ensure we only remove elements that exist
				args[1] = Math.min( args[1], length - args[0] );

				return args;

			case 'sort':
			case 'reverse':
				return null;

			case 'pop':
				if ( length ) {
					return [ length - 1, 1 ];
				}
				return [ 0, 0 ];

			case 'push':
				return [ length, 0 ].concat( args );

			case 'shift':
				return [ 0, length ? 1 : 0 ];

			case 'unshift':
				return [ 0, 0 ].concat( args );
		}
	}

	var arrayProto = Array.prototype;

	function makeArrayMethod ( methodName ) {
		function path ( keypath ) {
			var args = [], len = arguments.length - 1;
			while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

			return model( this.viewmodel.joinAll( splitKeypathI( keypath ) ), args );
		}

		function model ( mdl, args ) {
			var array = mdl.get();

			if ( !isArray( array ) ) {
				if ( array === undefined ) {
					array = [];
					var result$1 = arrayProto[ methodName ].apply( array, args );
					var promise$1 = runloop.start( this, true ).then( function () { return result$1; } );
					mdl.set( array );
					runloop.end();
					return promise$1;
				} else {
					throw new Error( ("shuffle array method " + methodName + " called on non-array at " + (mdl.getKeypath())) );
				}
			}

			var newIndices = getNewIndices( array.length, methodName, args );
			var result = arrayProto[ methodName ].apply( array, args );

			var promise = runloop.start( this, true ).then( function () { return result; } );
			promise.result = result;

			if ( newIndices ) {
				mdl.shuffle( newIndices );
			} else {
				mdl.set( result );
			}

			runloop.end();

			return promise;
		}

		return { path: path, model: model };
	}

	var comparators = {};

	function getComparator ( option ) {
		if ( !option ) return null; // use existing arrays
		if ( option === true ) return JSON.stringify;
		if ( typeof option === 'function' ) return option;

		if ( typeof option === 'string' ) {
			return comparators[ option ] || ( comparators[ option ] = function ( thing ) { return thing[ option ]; } );
		}

		throw new Error( 'If supplied, options.compare must be a string, function, or `true`' ); // TODO link to docs
	}

	function merge$1 ( ractive, model, array, options ) {
		var promise = runloop.start( ractive, true );
		var value = model.get();

		if ( !isArray( value ) || !isArray( array ) ) {
			throw new Error( 'You cannot merge an array with a non-array' );
		}

		var comparator = getComparator( options && options.compare );
		model.merge( array, comparator );

		runloop.end();
		return promise;
	}

	function thisRactive$merge ( keypath, array, options ) {
		return merge$1( this, this.viewmodel.joinAll( splitKeypathI( keypath ) ), array, options );
	}

	var updateHook = new Hook( 'update' );

	function update$2 ( ractive, model ) {
		// if the parent is wrapped, the adaptor will need to be updated before
		// updating on this keypath
		if ( model.parent && model.parent.wrapper ) {
			model.parent.adapt();
		}

		var promise = runloop.start( ractive, true );

		model.mark();
		model.registerChange( model.getKeypath(), model.get() );

		if ( !model.isRoot ) {
			// there may be unresolved refs that are now resolvable up the context tree
			var parent = model.parent, key = model.key;
			while ( parent && !parent.isRoot ) {
				if ( parent.clearUnresolveds ) parent.clearUnresolveds( key );
				key = parent.key;
				parent = parent.parent;
			}
		}

		// notify upstream of changes
		model.notifyUpstream();

		runloop.end();

		updateHook.fire( ractive, model );

		return promise;
	}

	function Ractive$update ( keypath ) {
		if ( keypath ) keypath = splitKeypathI( keypath );

		return update$2( this, keypath ? this.viewmodel.joinAll( keypath ) : this.viewmodel );
	}

	var modelPush = makeArrayMethod( 'push' ).model;
	var modelPop = makeArrayMethod( 'pop' ).model;
	var modelShift = makeArrayMethod( 'shift' ).model;
	var modelUnshift = makeArrayMethod( 'unshift' ).model;
	var modelSort = makeArrayMethod( 'sort' ).model;
	var modelSplice = makeArrayMethod( 'splice' ).model;
	var modelReverse = makeArrayMethod( 'reverse' ).model;

	// TODO: at some point perhaps this could support relative * keypaths?
	function build$1 ( el, keypath, value ) {
		var sets = [];

		// set multiple keypaths in one go
		if ( isObject( keypath ) ) {
			for ( var k in keypath ) {
				if ( keypath.hasOwnProperty( k ) ) {
					sets.push( [ findModel( el, k ).model, keypath[k] ] );
				}
			}

		}
		// set a single keypath
		else {
			sets.push( [ findModel( el, keypath ).model, value ] );
		}

		return sets;
	}

	// get relative keypaths and values
	function get ( keypath ) {
		if ( !keypath ) return this._element.parentFragment.findContext().get( true );

		var model = resolveReference( this._element.parentFragment, keypath );

		return model ? model.get( true ) : undefined;
	}

	function resolve$1 ( path, ractive ) {
		var ref = findModel( this, path ), model = ref.model, instance = ref.instance;
		return model ? model.getKeypath( ractive || instance ) : path;
	}

	function findModel ( el, path ) {
		var frag = el._element.parentFragment;

		if ( typeof path !== 'string' ) {
			return { model: frag.findContext(), instance: path };
		}

		return { model: resolveReference( frag, path ), instance: frag.ractive };
	}

	// the usual mutation suspects
	function add$1 ( keypath, value ) {
		if ( value === undefined ) value = 1;
		if ( !isNumeric( value ) ) throw new Error( 'Bad arguments' );
		return set( this.ractive, build$1( this, keypath, value ).map( function ( pair ) {
			var model = pair[0], val = pair[1], value = model.get();
			if ( !isNumeric( val ) || !isNumeric( value ) ) throw new Error( 'Cannot add non-numeric value' );
			return [ model, value + val ];
		}) );
	}

	function animate ( keypath, value, options ) {
		var model = findModel( this, keypath ).model;
		return protoAnimate( this.ractive, model, value, options );
	}

	function link ( source, dest ) {
		var there = findModel( this, source ).model, here = findModel( this, dest ).model;
		var promise = runloop.start( this.ractive, true );
		here.link( there, source );
		runloop.end();
		return promise;
	}

	function merge ( keypath, array, options ) {
		return merge$1( this.ractive, findModel( this, keypath ).model, array, options );
	}

	function pop ( keypath ) {
		return modelPop( findModel( this, keypath ).model, [] );
	}

	function push ( keypath ) {
		var values = [], len = arguments.length - 1;
		while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

		return modelPush( findModel( this, keypath ).model, values );
	}

	function reverse ( keypath ) {
		return modelReverse( findModel( this, keypath ).model, [] );
	}

	function set$1 ( keypath, value ) {
		return set( this.ractive, build$1( this, keypath, value ) );
	}

	function shift ( keypath ) {
		return modelShift( findModel( this, keypath ).model, [] );
	}

	function splice ( keypath, index, drop ) {
		var add = [], len = arguments.length - 3;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 3 ];

		add.unshift( index, drop );
		return modelSplice( findModel( this, keypath ).model, add );
	}

	function sort ( keypath ) {
		return modelSort( findModel( this, keypath ).model, [] );
	}

	function subtract ( keypath, value ) {
		if ( value === undefined ) value = 1;
		if ( !isNumeric( value ) ) throw new Error( 'Bad arguments' );
		return set( this.ractive, build$1( this, keypath, value ).map( function ( pair ) {
			var model = pair[0], val = pair[1], value = model.get();
			if ( !isNumeric( val ) || !isNumeric( value ) ) throw new Error( 'Cannot add non-numeric value' );
			return [ model, value - val ];
		}) );
	}

	function toggle ( keypath ) {
		var ref = findModel( this, keypath ), model = ref.model;
		return set( this.ractive, [ [ model, !model.get() ] ] );
	}

	function unlink ( dest ) {
		var here = findModel( this, dest ).model;
		var promise = runloop.start( this.ractive, true );
		if ( here.owner && here.owner._link ) here.owner.unlink();
		runloop.end();
		return promise;
	}

	function unshift ( keypath ) {
		var add = [], len = arguments.length - 1;
		while ( len-- > 0 ) add[ len ] = arguments[ len + 1 ];

		return modelUnshift( findModel( this, keypath ).model, add );
	}

	function update$1 ( keypath ) {
		return update$2( this.ractive, findModel( this, keypath ).model );
	}

	function updateModel ( keypath, cascade ) {
		var ref = findModel( this, keypath ), model = ref.model;
		var promise = runloop.start( this.ractive, true );
		model.updateFromBindings( cascade );
		runloop.end();
		return promise;
	}

	// two-way binding related helpers
	function isBound () {
		var ref = getBindingModel( this ), model = ref.model;
		return !!model;
	}

	function getBindingPath ( ractive ) {
		var ref = getBindingModel( this ), model = ref.model, instance = ref.instance;
		if ( model ) return model.getKeypath( ractive || instance );
	}

	function getBinding () {
		var ref = getBindingModel( this ), model = ref.model;
		if ( model ) return model.get( true );
	}

	function getBindingModel ( ctx ) {
		var el = ctx._element;
		return { model: el.binding && el.binding.model, instance: el.parentFragment.ractive };
	}

	function setBinding ( value ) {
		var ref = getBindingModel( this ), model = ref.model;
		return set( this.ractive, [ [ model, value ] ] );
	}

	// deprecated getters
	function keypath () {
		warnOnceIfDebug( ("Object property keypath is deprecated, please use resolve() instead.") );
		return this.resolve();
	}

	function rootpath () {
		warnOnceIfDebug( ("Object property rootpath is deprecated, please use resolve( ractive.root ) instead.") );
		return this.resolve( this.ractive.root );
	}

	function context () {
		warnOnceIfDebug( ("Object property context is deprecated, please use get() instead.") );
		return this.get();
	}

	function index () {
		warnOnceIfDebug( ("Object property index is deprecated, you can use get( \"indexName\" ) instead.") );
		return gatherRefs( this._element.parentFragment ).index;
	}

	function key () {
		warnOnceIfDebug( ("Object property key is deprecated, you can use get( \"keyName\" ) instead.") );
		return gatherRefs( this._element.parentFragment ).key;
	}

	function addHelpers ( obj, element ) {
		defineProperties( obj, {
			_element: { value: element },
			ractive: { value: element.parentFragment.ractive },
			resolve: { value: resolve$1 },
			get: { value: get },

			add: { value: add$1 },
			animate: { value: animate },
			link: { value: link },
			merge: { value: merge },
			pop: { value: pop },
			push: { value: push },
			reverse: { value: reverse },
			set: { value: set$1 },
			shift: { value: shift },
			sort: { value: sort },
			splice: { value: splice },
			subtract: { value: subtract },
			toggle: { value: toggle },
			unlink: { value: unlink },
			unshift: { value: unshift },
			update: { value: update$1 },
			updateModel: { value: updateModel },

			isBound: { value: isBound },
			getBindingPath: { value: getBindingPath },
			getBinding: { value: getBinding },
			setBinding: { value: setBinding },

			keypath: { get: keypath },
			rootpath: { get: rootpath },
			context: { get: context },
			index: { get: index },
			key: { get: key }
		});

		return obj;
	}

	var query = doc && doc.querySelector;

	function staticInfo( node ) {
		if ( typeof node === 'string' && query ) {
			node = query.call( document, node );
		}

		if ( !node || !node._ractive ) return undefined;

		var storage = node._ractive;

		return addHelpers( {}, storage.proxy );
	}

	function getNodeInfo( node ) {
		if ( typeof node === 'string' ) {
			node = this.find( node );
		}

		return staticInfo( node );
	}

	var insertHook = new Hook( 'insert' );

	function Ractive$insert ( target, anchor ) {
		if ( !this.fragment.rendered ) {
			// TODO create, and link to, documentation explaining this
			throw new Error( 'The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.' );
		}

		target = getElement( target );
		anchor = getElement( anchor ) || null;

		if ( !target ) {
			throw new Error( 'You must specify a valid target to insert into' );
		}

		target.insertBefore( this.detach(), anchor );
		this.el = target;

		( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( this );
		this.isDetached = false;

		fireInsertHook( this );
	}

	function fireInsertHook( ractive ) {
		insertHook.fire( ractive );

		ractive.findAllComponents('*').forEach( function ( child ) {
			fireInsertHook( child.instance );
		});
	}

	function link$1( there, here ) {
		if ( here === there || (there + '.').indexOf( here + '.' ) === 0 || (here + '.').indexOf( there + '.' ) === 0 ) {
			throw new Error( 'A keypath cannot be linked to itself.' );
		}

		var promise = runloop.start();
		var model;

		// may need to allow a mapping to resolve implicitly
		var sourcePath = splitKeypathI( there );
		if ( !this.viewmodel.has( sourcePath[0] ) && this.component ) {
			model = resolveReference( this.component.parentFragment, sourcePath[0] );
			model = model.joinAll( sourcePath.slice( 1 ) );
		}

		this.viewmodel.joinAll( splitKeypathI( here ) ).link( model || this.viewmodel.joinAll( sourcePath ), there );

		runloop.end();

		return promise;
	}

	var ReferenceResolver = function ReferenceResolver ( fragment, reference, callback ) {
		var this$1 = this;

			this.fragment = fragment;
		this.reference = normalise( reference );
		this.callback = callback;

		this.keys = splitKeypathI( reference );
		this.resolved = false;

		this.contexts = [];

		// TODO the consumer should take care of addUnresolved
		// we attach to all the contexts between here and the root
		// - whenever their values change, they can quickly
		// check to see if we can resolve
		while ( fragment ) {
			if ( fragment.context ) {
				fragment.context.addUnresolved( this$1.keys[0], this$1 );
				this$1.contexts.push( fragment.context );
			}

			fragment = fragment.componentParent || fragment.parent;
		}
	};

	ReferenceResolver.prototype.attemptResolution = function attemptResolution () {
		if ( this.resolved ) return;

		var model = resolveAmbiguousReference( this.fragment, this.reference );

		if ( model ) {
			this.resolved = true;
			this.callback( model );
		}
	};

	ReferenceResolver.prototype.forceResolution = function forceResolution () {
		if ( this.resolved ) return;

		var model = this.fragment.findContext().joinAll( this.keys );
		this.callback( model );
		this.resolved = true;
	};

	ReferenceResolver.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( previous ) previous.removeUnresolved( this.keys[0], this );

		this.next = next;
		if ( next ) runloop.scheduleTask( function () {
			if ( next === this$1.next ) {
				next.addUnresolved( this$1.keys[0], this$1 );
				this$1.next = null;
			}
		});
	};

	ReferenceResolver.prototype.unbind = function unbind () {
		var this$1 = this;

			if ( this.fragment ) removeFromArray( this.fragment.unresolved, this );

		if ( this.resolved ) return;

		this.contexts.forEach( function ( c ) { return c.removeUnresolved( this$1.keys[0], this$1 ); } );
	};

	function observe ( keypath, callback, options ) {
		var this$1 = this;

		if ( this.torndown ) return { cancel: function() {} };

		var observers = [];
		var map;

		if ( isObject( keypath ) ) {
			map = keypath;
			options = callback || {};

			Object.keys( map ).forEach( function ( keypath ) {
				var callback = map[ keypath ];

				var keypaths = keypath.split( ' ' );
				if ( keypaths.length > 1 ) keypaths = keypaths.filter( function ( k ) { return k; } );

				keypaths.forEach( function ( keypath ) {
					observers.push( createObserver( this$1, keypath, callback, options ) );
				});
			});
		}

		else {
			var keypaths;

			if ( typeof keypath === 'function' ) {
				options = callback;
				callback = keypath;
				keypaths = [ '' ];
			} else {
				keypaths = keypath.split( ' ' );
			}

			if ( keypaths.length > 1 ) keypaths = keypaths.filter( function ( k ) { return k; } );

			keypaths.forEach( function ( keypath ) {
				observers.push( createObserver( this$1, keypath, callback, options || {} ) );
			});
		}

		// add observers to the Ractive instance, so they can be
		// cancelled on ractive.teardown()
		this._observers.push.apply( this._observers, observers );

		return {
			cancel: function () {
				observers.forEach( function ( observer ) {
					removeFromArray ( this$1._observers, observer );
					observer.cancel();
				} );
			}
		};
	}

	function createObserver ( ractive, keypath, callback, options ) {
		var viewmodel = ractive.viewmodel;

		var keys = splitKeypathI( keypath );
		var wildcardIndex = keys.indexOf( '*' );
		options.keypath = keypath;

		// normal keypath - no wildcards
		if ( !~wildcardIndex ) {
			var key = keys[0];
			var model;

			// if not the root model itself, check if viewmodel has key.
			if ( key !== '' && !viewmodel.has( key ) ) {
				// if this is an inline component, we may need to create an implicit mapping
				if ( ractive.component && !ractive.isolated ) {
					model = resolveReference( ractive.component.parentFragment, key );
					if ( model ) {
						viewmodel.map( key, model );
						model = viewmodel.joinAll( keys );
					}
				}
			} else {
				model = viewmodel.joinAll( keys );
			}

			return new Observer( ractive, model, callback, options );
		}

		// pattern observers - more complex case
		var baseModel = wildcardIndex === 0 ?
			viewmodel :
			viewmodel.joinAll( keys.slice( 0, wildcardIndex ) );

		return new PatternObserver( ractive, baseModel, keys.splice( wildcardIndex ), callback, options );
	}

	var Observer = function Observer ( ractive, model, callback, options ) {
		var this$1 = this;

			this.context = options.context || ractive;
		this.callback = callback;
		this.ractive = ractive;

		if ( model ) this.resolved( model );
		else {
			this.keypath = options.keypath;
			this.resolver = new ReferenceResolver( ractive.fragment, options.keypath, function ( model ) {
				this$1.resolved( model );
			});
		}

		if ( options.init !== false ) {
			this.dirty = true;
			this.dispatch();
		} else {
			this.oldValue = this.newValue;
		}

		this.defer = options.defer;
		this.once = options.once;
		this.strict = options.strict;

		this.dirty = false;
	};

	Observer.prototype.cancel = function cancel () {
		this.cancelled = true;
		if ( this.model ) {
			this.model.unregister( this );
		} else {
			this.resolver.unbind();
		}
	};

	Observer.prototype.dispatch = function dispatch () {
		if ( !this.cancelled ) {
			this.callback.call( this.context, this.newValue, this.oldValue, this.keypath );
			this.oldValue = this.model ? this.model.get() : this.newValue;
			this.dirty = false;
		}
	};

	Observer.prototype.handleChange = function handleChange () {
		var this$1 = this;

			if ( !this.dirty ) {
			var newValue = this.model.get();
			if ( isEqual( newValue, this.oldValue ) ) return;

			this.newValue = newValue;

			if ( this.strict && this.newValue === this.oldValue ) return;

			runloop.addObserver( this, this.defer );
			this.dirty = true;

			if ( this.once ) runloop.scheduleTask( function () { return this$1.cancel(); } );
		}
	};

	Observer.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			next = rebindMatch( this.keypath, next, previous );
		// TODO: set up a resolver if next is undefined?
		if ( next === this.model ) return false;

		if ( this.model ) this.model.unregister( this );
		if ( next ) next.addShuffleTask( function () { return this$1.resolved( next ); } );
	};

	Observer.prototype.resolved = function resolved ( model ) {
		this.model = model;
		this.keypath = model.getKeypath( this.ractive );

		this.oldValue = undefined;
		this.newValue = model.get();

		model.register( this );
	};

	var PatternObserver = function PatternObserver ( ractive, baseModel, keys, callback, options ) {
		var this$1 = this;

			this.context = options.context || ractive;
		this.ractive = ractive;
		this.baseModel = baseModel;
		this.keys = keys;
		this.callback = callback;

		var pattern = keys.join( '\\.' ).replace( /\*/g, '(.+)' );
		var baseKeypath = baseModel.getKeypath( ractive );
		this.pattern = new RegExp( ("^" + (baseKeypath ? baseKeypath + '\\.' : '') + "" + pattern + "$") );

		this.oldValues = {};
		this.newValues = {};

		this.defer = options.defer;
		this.once = options.once;
		this.strict = options.strict;

		this.dirty = false;
		this.changed = [];
		this.partial = false;

		var models = baseModel.findMatches( this.keys );

		models.forEach( function ( model ) {
			this$1.newValues[ model.getKeypath( this$1.ractive ) ] = model.get();
		});

		if ( options.init !== false ) {
			this.dispatch();
		} else {
			this.oldValues = this.newValues;
		}

		baseModel.registerPatternObserver( this );
	};

	PatternObserver.prototype.cancel = function cancel () {
		this.baseModel.unregisterPatternObserver( this );
	};

	PatternObserver.prototype.dispatch = function dispatch () {
		var this$1 = this;

			var newValues = this.newValues;
		this.newValues = {};
		Object.keys( newValues ).forEach( function ( keypath ) {
			if ( this$1.newKeys && !this$1.newKeys[ keypath ] ) return;

			var newValue = newValues[ keypath ];
			var oldValue = this$1.oldValues[ keypath ];

			if ( this$1.strict && newValue === oldValue ) return;
			if ( isEqual( newValue, oldValue ) ) return;

			var args = [ newValue, oldValue, keypath ];
			if ( keypath ) {
				var wildcards = this$1.pattern.exec( keypath );
				if ( wildcards ) {
					args = args.concat( wildcards.slice( 1 ) );
				}
			}

			this$1.callback.apply( this$1.context, args );
		});

		if ( this.partial ) {
			for ( var k in newValues ) {
				this.oldValues[k] = newValues[k];
			}
		} else {
			this.oldValues = newValues;
		}

		this.newKeys = null;
		this.dirty = false;
	};

	PatternObserver.prototype.notify = function notify ( key ) {
		this.changed.push( key );
	};

	PatternObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			if ( !isArray( this.baseModel.value ) ) return;

		var base = this.baseModel.getKeypath( this.ractive );
		var max = this.baseModel.value.length;
		var suffix = this.keys.length > 1 ? '.' + this.keys.slice( 1 ).join( '.' ) : '';

		this.newKeys = {};
		for ( var i = 0; i < newIndices.length; i++ ) {
			if ( newIndices[ i ] === -1 || newIndices[ i ] === i ) continue;
			this$1.newKeys[ ("" + base + "." + i + "" + suffix) ] = true;
		}

		for ( var i$1 = newIndices.touchedFrom; i$1 < max; i$1++ ) {
			this$1.newKeys[ ("" + base + "." + i$1 + "" + suffix) ] = true;
		}
	};

	PatternObserver.prototype.handleChange = function handleChange () {
		var this$1 = this;

			if ( !this.dirty || this.changed.length ) {
			if ( !this.dirty ) this.newValues = {};

			// handle case where previously extant keypath no longer exists -
			// observer should still fire, with undefined as new value
			// TODO huh. according to the test suite that's not the case...
			// NOTE: I don't think this will work with partial updates
			// Object.keys( this.oldValues ).forEach( keypath => {
			// this.newValues[ keypath ] = undefined;
			// });

			if ( !this.changed.length ) {
				this.baseModel.findMatches( this.keys ).forEach( function ( model ) {
					var keypath = model.getKeypath( this$1.ractive );
					this$1.newValues[ keypath ] = model.get();
				});
				this.partial = false;
			} else {
				var count = 0;
				var ok = this.baseModel.isRoot ?
					this.changed.map( function ( keys ) { return keys.map( escapeKey ).join( '.' ); } ) :
					this.changed.map( function ( keys ) { return this$1.baseModel.getKeypath( this$1.ractive ) + '.' + keys.map( escapeKey ).join( '.' ); } );

				this.baseModel.findMatches( this.keys ).forEach( function ( model ) {
					var keypath = model.getKeypath( this$1.ractive );
					var check = function ( k ) {
						return ( k.indexOf( keypath ) === 0 && ( k.length === keypath.length || k[ keypath.length ] === '.' ) ) ||
								   ( keypath.indexOf( k ) === 0 && ( k.length === keypath.length || keypath[ k.length ] === '.' ) );
					};

					// is this model on a changed keypath?
					if ( ok.filter( check ).length ) {
						count++;
						this$1.newValues[ keypath ] = model.get();
					}
				});

				// no valid change triggered, so bail to avoid breakage
				if ( !count ) return;

				this.partial = true;
			}

			runloop.addObserver( this, this.defer );
			this.dirty = true;
			this.changed.length = 0;

			if ( this.once ) this.cancel();
		}
	};

	function observeList ( keypath, callback, options ) {
		if ( typeof keypath !== 'string' ) {
			throw new Error( 'ractive.observeList() must be passed a string as its first argument' );
		}

		var model = this.viewmodel.joinAll( splitKeypathI( keypath ) );
		var observer = new ListObserver( this, model, callback, options || {} );

		// add observer to the Ractive instance, so it can be
		// cancelled on ractive.teardown()
		this._observers.push( observer );

		return {
			cancel: function () {
				observer.cancel();
			}
		};
	}

	function negativeOne () {
		return -1;
	}

	var ListObserver = function ListObserver ( context, model, callback, options ) {
		this.context = context;
		this.model = model;
		this.keypath = model.getKeypath();
		this.callback = callback;

		this.pending = null;

		model.register( this );

		if ( options.init !== false ) {
			this.sliced = [];
			this.shuffle([]);
			this.handleChange();
		} else {
			this.sliced = this.slice();
		}
	};

	ListObserver.prototype.handleChange = function handleChange () {
		if ( this.pending ) {
			// post-shuffle
			this.callback( this.pending );
			this.pending = null;
		}

		else {
			// entire array changed
			this.shuffle( this.sliced.map( negativeOne ) );
			this.handleChange();
		}
	};

	ListObserver.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			var newValue = this.slice();

		var inserted = [];
		var deleted = [];
		var start;

		var hadIndex = {};

		newIndices.forEach( function ( newIndex, oldIndex ) {
			hadIndex[ newIndex ] = true;

			if ( newIndex !== oldIndex && start === undefined ) {
				start = oldIndex;
			}

			if ( newIndex === -1 ) {
				deleted.push( this$1.sliced[ oldIndex ] );
			}
		});

		if ( start === undefined ) start = newIndices.length;

		var len = newValue.length;
		for ( var i = 0; i < len; i += 1 ) {
			if ( !hadIndex[i] ) inserted.push( newValue[i] );
		}

		this.pending = { inserted: inserted, deleted: deleted, start: start };
		this.sliced = newValue;
	};

	ListObserver.prototype.slice = function slice () {
		var value = this.model.get();
		return isArray( value ) ? value.slice() : [];
	};

	var onceOptions = { init: false, once: true };

	function observeOnce ( keypath, callback, options ) {
		if ( isObject( keypath ) || typeof keypath === 'function' ) {
			options = extendObj( callback || {}, onceOptions );
			return this.observe( keypath, options );
		}

		options = extendObj( options || {}, onceOptions );
		return this.observe( keypath, callback, options );
	}

	function trim ( str ) { return str.trim(); };

	function notEmptyString ( str ) { return str !== ''; };

	function Ractive$off ( eventName, callback ) {
		// if no arguments specified, remove all callbacks
		var this$1 = this;

		if ( !eventName ) {
			// TODO use this code instead, once the following issue has been resolved
			// in PhantomJS (tests are unpassable otherwise!)
			// https://github.com/ariya/phantomjs/issues/11856
			// defineProperty( this, '_subs', { value: create( null ), configurable: true });
			for ( eventName in this._subs ) {
				delete this._subs[ eventName ];
			}
		}

		else {
			// Handle multiple space-separated event names
			var eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );

			eventNames.forEach( function ( eventName ) {
				var subscribers = this$1._subs[ eventName ];

				// If we have subscribers for this event...
				if ( subscribers ) {
					// ...if a callback was specified, only remove that
					if ( callback ) {
						// flag this callback as off so that any in-flight firings don't call
						// a cancelled handler - this is _slightly_ hacky
						var i = subscribers.length;
						while ( i-- ) {
							if ( subscribers[i].callback === callback ) {
								subscribers[i].off = true;
								subscribers.splice( i, 1 );
							}
						}
					}

					// ...otherwise remove all callbacks
					else {
						this$1._subs[ eventName ] = [];
					}
				}
			});
		}

		return this;
	}

	function Ractive$on ( eventName, callback ) {
		// allow multiple listeners to be bound in one go
		var this$1 = this;

		if ( typeof eventName === 'object' ) {
			var listeners = [];
			var n;

			for ( n in eventName ) {
				if ( eventName.hasOwnProperty( n ) ) {
					listeners.push( this.on( n, eventName[ n ] ) );
				}
			}

			return {
				cancel: function () { listeners.forEach( function ( l ) { return l.cancel(); } ); }
			};
		}

		// Handle multiple space-separated event names
		var eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );

		eventNames.forEach( function ( eventName ) {
			( this$1._subs[ eventName ] || ( this$1._subs[ eventName ] = [] ) ).push( { callback: callback } );
		});

		return {
			cancel: function () { return eventNames.forEach( function ( n ) { return this$1.off( n, callback ); } ); }
		};
	}

	function Ractive$once ( eventName, handler ) {
		var listener = this.on( eventName, function () {
			handler.apply( this, arguments );
			listener.cancel();
		});

		// so we can still do listener.cancel() manually
		return listener;
	}

	var pop$1 = makeArrayMethod( 'pop' ).path;

	var push$1 = makeArrayMethod( 'push' ).path;

	var PREFIX = '/* Ractive.js component styles */';

	// Holds current definitions of styles.
	var styleDefinitions = [];

	// Flag to tell if we need to update the CSS
	var isDirty = false;

	// These only make sense on the browser. See additional setup below.
	var styleElement = null;
	var useCssText = null;

	function addCSS( styleDefinition ) {
		styleDefinitions.push( styleDefinition );
		isDirty = true;
	}

	function applyCSS() {

		// Apply only seems to make sense when we're in the DOM. Server-side renders
		// can call toCSS to get the updated CSS.
		if ( !doc || !isDirty ) return;

		if ( useCssText ) {
			styleElement.styleSheet.cssText = getCSS( null );
		} else {
			styleElement.innerHTML = getCSS( null );
		}

		isDirty = false;
	}

	function getCSS( cssIds ) {

		var filteredStyleDefinitions = cssIds ? styleDefinitions.filter( function ( style ) { return ~cssIds.indexOf( style.id ); } ) : styleDefinitions;

		return filteredStyleDefinitions.reduce( function ( styles, style ) { return ("" + styles + "\n\n/* {" + (style.id) + "} */\n" + (style.styles)); }, PREFIX );

	}

	// If we're on the browser, additional setup needed.
	if ( doc && ( !styleElement || !styleElement.parentNode ) ) {

		styleElement = doc.createElement( 'style' );
		styleElement.type = 'text/css';

		doc.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );

		useCssText = !!styleElement.styleSheet;
	}

	var renderHook = new Hook( 'render' );
	var completeHook = new Hook( 'complete' );

	function render$1 ( ractive, target, anchor, occupants ) {
		// if `noIntro` is `true`, temporarily disable transitions
		var transitionsEnabled = ractive.transitionsEnabled;
		if ( ractive.noIntro ) ractive.transitionsEnabled = false;

		var promise = runloop.start( ractive, true );
		runloop.scheduleTask( function () { return renderHook.fire( ractive ); }, true );

		if ( ractive.fragment.rendered ) {
			throw new Error( 'You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first' );
		}

		anchor = getElement( anchor ) || ractive.anchor;

		ractive.el = target;
		ractive.anchor = anchor;

		// ensure encapsulated CSS is up-to-date
		if ( ractive.cssId ) applyCSS();

		if ( target ) {
			( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( ractive );

			if ( anchor ) {
				var docFrag = doc.createDocumentFragment();
				ractive.fragment.render( docFrag );
				target.insertBefore( docFrag, anchor );
			} else {
				ractive.fragment.render( target, occupants );
			}
		}

		runloop.end();
		ractive.transitionsEnabled = transitionsEnabled;

		return promise.then( function () { return completeHook.fire( ractive ); } );
	}

	function Ractive$render ( target, anchor ) {
		if ( this.torndown ) {
			warnIfDebug( 'ractive.render() was called on a Ractive instance that was already torn down' );
			return Promise.resolve();
		}

		target = getElement( target ) || this.el;

		if ( !this.append && target ) {
			// Teardown any existing instances *before* trying to set up the new one -
			// avoids certain weird bugs
			var others = target.__ractive_instances__;
			if ( others ) others.forEach( teardown );

			// make sure we are the only occupants
			if ( !this.enhance ) {
				target.innerHTML = ''; // TODO is this quicker than removeChild? Initial research inconclusive
			}
		}

		var occupants = this.enhance ? toArray( target.childNodes ) : null;
		var promise = render$1( this, target, anchor, occupants );

		if ( occupants ) {
			while ( occupants.length ) target.removeChild( occupants.pop() );
		}

		return promise;
	}

	var adaptConfigurator = {
		extend: function ( Parent, proto, options ) {
			proto.adapt = combine( proto.adapt, ensureArray( options.adapt ) );
		},

		init: function () {}
	};

	function combine ( a, b ) {
		var c = a.slice();
		var i = b.length;

		while ( i-- ) {
			if ( !~c.indexOf( b[i] ) ) {
				c.push( b[i] );
			}
		}

		return c;
	}

	var remove = /\/\*(?:[\s\S]*?)\*\//g;
	var escape = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\2).)*\2/gi;
	var value = /\0(\d+)/g;

	// Removes comments and strings from the given CSS to make it easier to parse.
	// Callback receives the cleaned CSS and a function which can be used to put
	// the removed strings back in place after parsing is done.
	function cleanCss ( css, callback, additionalReplaceRules ) {
		if ( additionalReplaceRules === void 0 ) additionalReplaceRules = [];

		var values = [];
		var reconstruct = function ( css ) { return css.replace( value, function ( match, n ) { return values[ n ]; } ); };
		css = css.replace( escape, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); }).replace( remove, '' );

		additionalReplaceRules.forEach( function ( pattern ) {
			css = css.replace( pattern, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); } );
		});

		return callback( css, reconstruct );
	}

	var selectorsPattern = /(?:^|\}|\{)\s*([^\{\}\0]+)\s*(?=\{)/g;
	var keyframesDeclarationPattern = /@keyframes\s+[^\{\}]+\s*\{(?:[^{}]+|\{[^{}]+})*}/gi;
	var selectorUnitPattern = /((?:(?:\[[^\]]+\])|(?:[^\s\+\>~:]))+)((?:::?[^\s\+\>\~\(:]+(?:\([^\)]+\))?)*\s*[\s\+\>\~]?)\s*/g;
	var excludePattern = /^(?:@|\d+%)/;
	var dataRvcGuidPattern = /\[data-ractive-css~="\{[a-z0-9-]+\}"]/g;

	function trim$1 ( str ) {
		return str.trim();
	}

	function extractString ( unit ) {
		return unit.str;
	}

	function transformSelector ( selector, parent ) {
		var selectorUnits = [];
		var match;

		while ( match = selectorUnitPattern.exec( selector ) ) {
			selectorUnits.push({
				str: match[0],
				base: match[1],
				modifiers: match[2]
			});
		}

		// For each simple selector within the selector, we need to create a version
		// that a) combines with the id, and b) is inside the id
		var base = selectorUnits.map( extractString );

		var transformed = [];
		var i = selectorUnits.length;

		while ( i-- ) {
			var appended = base.slice();

			// Pseudo-selectors should go after the attribute selector
			var unit = selectorUnits[i];
			appended[i] = unit.base + parent + unit.modifiers || '';

			var prepended = base.slice();
			prepended[i] = parent + ' ' + prepended[i];

			transformed.push( appended.join( ' ' ), prepended.join( ' ' ) );
		}

		return transformed.join( ', ' );
	}

	function transformCss ( css, id ) {
		var dataAttr = "[data-ractive-css~=\"{" + id + "}\"]";

		var transformed;

		if ( dataRvcGuidPattern.test( css ) ) {
			transformed = css.replace( dataRvcGuidPattern, dataAttr );
		} else {
			transformed = cleanCss( css, function ( css, reconstruct ) {
				css = css.replace( selectorsPattern, function ( match, $1 ) {
					// don't transform at-rules and keyframe declarations
					if ( excludePattern.test( $1 ) ) return match;

					var selectors = $1.split( ',' ).map( trim$1 );
					var transformed = selectors
						.map( function ( selector ) { return transformSelector( selector, dataAttr ); } )
						.join( ', ' ) + ' ';

					return match.replace( $1, transformed );
				});

				return reconstruct( css );
			}, [ keyframesDeclarationPattern ]);
		}

		return transformed;
	}

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	function uuid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	var cssConfigurator = {
		name: 'css',

		// Called when creating a new component definition
		extend: function ( Parent, proto, options ) {
			if ( !options.css ) return;

			var id = uuid();
			var styles = options.noCssTransform ? options.css : transformCss( options.css, id );

			proto.cssId = id;

			addCSS( { id: id, styles: styles } );

		},

		// Called when creating a new component instance
		init: function ( Parent, target, options ) {
			if ( !options.css ) return;

			warnIfDebug( ("\nThe css option is currently not supported on a per-instance basis and will be discarded. Instead, we recommend instantiating from a component definition with a css option.\n\nconst Component = Ractive.extend({\n\t...\n\tcss: '/* your css */',\n\t...\n});\n\nconst componentInstance = new Component({ ... })\n\t\t") );
		}

	};

	function validate ( data ) {
		// Warn if userOptions.data is a non-POJO
		if ( data && data.constructor !== Object ) {
			if ( typeof data === 'function' ) {
				// TODO do we need to support this in the new Ractive() case?
			} else if ( typeof data !== 'object' ) {
				fatal( ("data option must be an object or a function, `" + data + "` is not valid") );
			} else {
				warnIfDebug( 'If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged' );
			}
		}
	}

	var dataConfigurator = {
		name: 'data',

		extend: function ( Parent, proto, options ) {
			var key;
			var value;

			// check for non-primitives, which could cause mutation-related bugs
			if ( options.data && isObject( options.data ) ) {
				for ( key in options.data ) {
					value = options.data[ key ];

					if ( value && typeof value === 'object' ) {
						if ( isObject( value ) || isArray( value ) ) {
							warnIfDebug( ("Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }") );
						}
					}
				}
			}

			proto.data = combine$1( proto.data, options.data );
		},

		init: function ( Parent, ractive, options ) {
			var result = combine$1( Parent.prototype.data, options.data );

			if ( typeof result === 'function' ) result = result.call( ractive );

			// bind functions to the ractive instance at the top level,
			// unless it's a non-POJO (in which case alarm bells should ring)
			if ( result && result.constructor === Object ) {
				for ( var prop in result ) {
					if ( typeof result[ prop ] === 'function' ) result[ prop ] = bind( result[ prop ], ractive );
				}
			}

			return result || {};
		},

		reset: function ( ractive ) {
			var result = this.init( ractive.constructor, ractive, ractive.viewmodel );
			ractive.viewmodel.root.set( result );
			return true;
		}
	};

	function combine$1 ( parentValue, childValue ) {
		validate( childValue );

		var parentIsFn = typeof parentValue === 'function';
		var childIsFn = typeof childValue === 'function';

		// Very important, otherwise child instance can become
		// the default data object on Ractive or a component.
		// then ractive.set() ends up setting on the prototype!
		if ( !childValue && !parentIsFn ) {
			childValue = {};
		}

		// Fast path, where we just need to copy properties from
		// parent to child
		if ( !parentIsFn && !childIsFn ) {
			return fromProperties( childValue, parentValue );
		}

		return function () {
			var child = childIsFn ? callDataFunction( childValue, this ) : childValue;
			var parent = parentIsFn ? callDataFunction( parentValue, this ) : parentValue;

			return fromProperties( child, parent );
		};
	}

	function callDataFunction ( fn, context ) {
		var data = fn.call( context );

		if ( !data ) return;

		if ( typeof data !== 'object' ) {
			fatal( 'Data function must return an object' );
		}

		if ( data.constructor !== Object ) {
			warnOnceIfDebug( 'Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged' );
		}

		return data;
	}

	function fromProperties ( primary, secondary ) {
		if ( primary && secondary ) {
			for ( var key in secondary ) {
				if ( !( key in primary ) ) {
					primary[ key ] = secondary[ key ];
				}
			}

			return primary;
		}

		return primary || secondary;
	}

	var TEMPLATE_VERSION = 4;

	var pattern = /\$\{([^\}]+)\}/g;

	function fromExpression ( body, length ) {
		if ( length === void 0 ) length = 0;

		var args = new Array( length );

		while ( length-- ) {
			args[length] = "_" + length;
		}

		// Functions created directly with new Function() look like this:
		//     function anonymous (_0 /**/) { return _0*2 }
		//
		// With this workaround, we get a little more compact:
		//     function (_0){return _0*2}
		return new Function( [], ("return function (" + (args.join(',')) + "){return(" + body + ");};") )();
	}

	function fromComputationString ( str, bindTo ) {
		var hasThis;

		var functionBody = 'return (' + str.replace( pattern, function ( match, keypath ) {
			hasThis = true;
			return ("__ractive.get(\"" + keypath + "\")");
		}) + ');';

		if ( hasThis ) functionBody = "var __ractive = this; " + functionBody;
		var fn = new Function( functionBody );
		return hasThis ? fn.bind( bindTo ) : fn;
	}

	var functions = create( null );

	function getFunction ( str, i ) {
		if ( functions[ str ] ) return functions[ str ];
		return functions[ str ] = createFunction( str, i );
	}

	function addFunctions( template ) {
		if ( !template ) return;

		var exp = template.e;

		if ( !exp ) return;

		Object.keys( exp ).forEach( function ( str ) {
			if ( functions[ str ] ) return;
			functions[ str ] = exp[ str ];
		});
	}

	var Parser;
	var ParseError;
	var leadingWhitespace = /^\s+/;
	ParseError = function ( message ) {
		this.name = 'ParseError';
		this.message = message;
		try {
			throw new Error(message);
		} catch (e) {
			this.stack = e.stack;
		}
	};

	ParseError.prototype = Error.prototype;

	Parser = function ( str, options ) {
		var this$1 = this;

		var items, item, lineStart = 0;

		this.str = str;
		this.options = options || {};
		this.pos = 0;

		this.lines = this.str.split( '\n' );
		this.lineEnds = this.lines.map( function ( line ) {
			var lineEnd = lineStart + line.length + 1; // +1 for the newline

			lineStart = lineEnd;
			return lineEnd;
		}, 0 );

		// Custom init logic
		if ( this.init ) this.init( str, options );

		items = [];

		while ( ( this$1.pos < this$1.str.length ) && ( item = this$1.read() ) ) {
			items.push( item );
		}

		this.leftover = this.remaining();
		this.result = this.postProcess ? this.postProcess( items, options ) : items;
	};

	Parser.prototype = {
		read: function ( converters ) {
			var this$1 = this;

			var pos, i, len, item;

			if ( !converters ) converters = this.converters;

			pos = this.pos;

			len = converters.length;
			for ( i = 0; i < len; i += 1 ) {
				this$1.pos = pos; // reset for each attempt

				if ( item = converters[i]( this$1 ) ) {
					return item;
				}
			}

			return null;
		},

		getContextMessage: function ( pos, message ) {
			var ref = this.getLinePos( pos ), lineNum = ref[0], columnNum = ref[1];
			if ( this.options.contextLines === -1 ) {
				return [ lineNum, columnNum, ("" + message + " at line " + lineNum + " character " + columnNum) ];
			}

			var line = this.lines[ lineNum - 1 ];

			var contextUp = '';
			var contextDown = '';
			if ( this.options.contextLines ) {
				var start = lineNum - 1 - this.options.contextLines < 0 ? 0 : lineNum - 1 - this.options.contextLines;
				contextUp = this.lines.slice( start, lineNum - 1 - start ).join( '\n' ).replace( /\t/g, '  ' );
				contextDown = this.lines.slice( lineNum, lineNum + this.options.contextLines ).join( '\n' ).replace( /\t/g, '  ' );
				if ( contextUp ) {
					contextUp += '\n';
				}
				if ( contextDown ) {
					contextDown = '\n' + contextDown;
				}
			}

			var numTabs = 0;
			var annotation = contextUp + line.replace( /\t/g, function ( match, char ) {
				if ( char < columnNum ) {
					numTabs += 1;
				}

				return '  ';
			}) + '\n' + new Array( columnNum + numTabs ).join( ' ' ) + '^----' + contextDown;

			return [ lineNum, columnNum, ("" + message + " at line " + lineNum + " character " + columnNum + ":\n" + annotation) ];
		},

		getLinePos: function ( char ) {
			var this$1 = this;

			var lineNum = 0, lineStart = 0, columnNum;

			while ( char >= this$1.lineEnds[ lineNum ] ) {
				lineStart = this$1.lineEnds[ lineNum ];
				lineNum += 1;
			}

			columnNum = char - lineStart;
			return [ lineNum + 1, columnNum + 1, char ]; // line/col should be one-based, not zero-based!
		},

		error: function ( message ) {
			var ref = this.getContextMessage( this.pos, message ), lineNum = ref[0], columnNum = ref[1], msg = ref[2];

			var error = new ParseError( msg );

			error.line = lineNum;
			error.character = columnNum;
			error.shortMessage = message;

			throw error;
		},

		matchString: function ( string ) {
			if ( this.str.substr( this.pos, string.length ) === string ) {
				this.pos += string.length;
				return string;
			}
		},

		matchPattern: function ( pattern ) {
			var match;

			if ( match = pattern.exec( this.remaining() ) ) {
				this.pos += match[0].length;
				return match[1] || match[0];
			}
		},

		allowWhitespace: function () {
			this.matchPattern( leadingWhitespace );
		},

		remaining: function () {
			return this.str.substring( this.pos );
		},

		nextChar: function () {
			return this.str.charAt( this.pos );
		}
	};

	Parser.extend = function ( proto ) {
		var Parent = this, Child, key;

		Child = function ( str, options ) {
			Parser.call( this, str, options );
		};

		Child.prototype = create( Parent.prototype );

		for ( key in proto ) {
			if ( hasOwn.call( proto, key ) ) {
				Child.prototype[ key ] = proto[ key ];
			}
		}

		Child.extend = Parser.extend;
		return Child;
	};

	var Parser$1 = Parser;

	var TEXT              = 1;
	var INTERPOLATOR      = 2;
	var TRIPLE            = 3;
	var SECTION           = 4;
	var INVERTED          = 5;
	var CLOSING           = 6;
	var ELEMENT           = 7;
	var PARTIAL           = 8;
	var COMMENT           = 9;
	var DELIMCHANGE       = 10;
	var ATTRIBUTE         = 13;
	var CLOSING_TAG       = 14;
	var COMPONENT         = 15;
	var YIELDER           = 16;
	var INLINE_PARTIAL    = 17;
	var DOCTYPE           = 18;
	var ALIAS             = 19;

	var NUMBER_LITERAL    = 20;
	var STRING_LITERAL    = 21;
	var ARRAY_LITERAL     = 22;
	var OBJECT_LITERAL    = 23;
	var BOOLEAN_LITERAL   = 24;
	var REGEXP_LITERAL    = 25;

	var GLOBAL            = 26;
	var KEY_VALUE_PAIR    = 27;


	var REFERENCE         = 30;
	var REFINEMENT        = 31;
	var MEMBER            = 32;
	var PREFIX_OPERATOR   = 33;
	var BRACKETED         = 34;
	var CONDITIONAL       = 35;
	var INFIX_OPERATOR    = 36;

	var INVOCATION        = 40;

	var SECTION_IF        = 50;
	var SECTION_UNLESS    = 51;
	var SECTION_EACH      = 52;
	var SECTION_WITH      = 53;
	var SECTION_IF_WITH   = 54;

	var ELSE              = 60;
	var ELSEIF            = 61;

	var EVENT             = 70;
	var DECORATOR         = 71;
	var TRANSITION        = 72;
	var BINDING_FLAG      = 73;

	var delimiterChangePattern = /^[^\s=]+/;
	var whitespacePattern = /^\s+/;
	function readDelimiterChange ( parser ) {
		var start, opening, closing;

		if ( !parser.matchString( '=' ) ) {
			return null;
		}

		start = parser.pos;

		// allow whitespace before new opening delimiter
		parser.allowWhitespace();

		opening = parser.matchPattern( delimiterChangePattern );
		if ( !opening ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace (in fact, it's necessary...)
		if ( !parser.matchPattern( whitespacePattern ) ) {
			return null;
		}

		closing = parser.matchPattern( delimiterChangePattern );
		if ( !closing ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace before closing '='
		parser.allowWhitespace();

		if ( !parser.matchString( '=' ) ) {
			parser.pos = start;
			return null;
		}

		return [ opening, closing ];
	}

	var regexpPattern = /^(\/(?:[^\n\r\u2028\u2029/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/;

	function readNumberLiteral ( parser ) {
		var result;

		if ( result = parser.matchPattern( regexpPattern ) ) {
			return {
				t: REGEXP_LITERAL,
				v: result
			};
		}

		return null;
	}

	var pattern$1 = /[-/\\^$*+?.()|[\]{}]/g;

	function escapeRegExp ( str ) {
		return str.replace( pattern$1, '\\$&' );
	}

	var regExpCache = {};

	function getLowestIndex ( haystack, needles ) {
		return haystack.search( regExpCache[needles.join()] || ( regExpCache[needles.join()] = new RegExp( needles.map( escapeRegExp ).join( '|' ) ) ) );
	}

	// https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
	var booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
	var voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;

	var htmlEntities = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, 'int': 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830	};
	var controlCharacters = [ 8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376 ];
	var entityPattern = new RegExp( '&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys( htmlEntities ).join( '|' ) + '));?', 'g' );
	var codePointSupport = typeof String.fromCodePoint === 'function';
	var codeToChar = codePointSupport ? String.fromCodePoint : String.fromCharCode;

	function decodeCharacterReferences ( html ) {
		return html.replace( entityPattern, function ( match, entity ) {
			var code;

			// Handle named entities
			if ( entity[0] !== '#' ) {
				code = htmlEntities[ entity ];
			} else if ( entity[1] === 'x' ) {
				code = parseInt( entity.substring( 2 ), 16 );
			} else {
				code = parseInt( entity.substring( 1 ), 10 );
			}

			if ( !code ) {
				return match;
			}

			return codeToChar( validateCode( code ) );
		});
	}

	var lessThan = /</g;
	var greaterThan = />/g;
	var amp = /&/g;
	var invalid = 65533;

	function escapeHtml ( str ) {
		return str
			.replace( amp, '&amp;' )
			.replace( lessThan, '&lt;' )
			.replace( greaterThan, '&gt;' );
	}

	// some code points are verboten. If we were inserting HTML, the browser would replace the illegal
	// code points with alternatives in some cases - since we're bypassing that mechanism, we need
	// to replace them ourselves
	//
	// Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
	function validateCode ( code ) {
		if ( !code ) {
			return invalid;
		}

		// line feed becomes generic whitespace
		if ( code === 10 ) {
			return 32;
		}

		// ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
		if ( code < 128 ) {
			return code;
		}

		// code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
		// to correct the mistake or we'll end up with missing € signs and so on
		if ( code <= 159 ) {
			return controlCharacters[ code - 128 ];
		}

		// basic multilingual plane
		if ( code < 55296 ) {
			return code;
		}

		// UTF-16 surrogate halves
		if ( code <= 57343 ) {
			return invalid;
		}

		// rest of the basic multilingual plane
		if ( code <= 65535 ) {
			return code;
		} else if ( !codePointSupport ) {
			return invalid;
		}

		// supplementary multilingual plane 0x10000 - 0x1ffff
		if ( code >= 65536 && code <= 131071 ) {
			return code;
		}

		// supplementary ideographic plane 0x20000 - 0x2ffff
		if ( code >= 131072 && code <= 196607 ) {
			return code;
		}

		return invalid;
	}

	var expectedExpression = 'Expected a JavaScript expression';
	var expectedParen = 'Expected closing paren';

	// bulletproof number regex from https://gist.github.com/Rich-Harris/7544330
	var numberPattern = /^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;

	function readNumberLiteral$1 ( parser ) {
		var result;

		if ( result = parser.matchPattern( numberPattern ) ) {
			return {
				t: NUMBER_LITERAL,
				v: result
			};
		}

		return null;
	}

	function readBooleanLiteral ( parser ) {
		var remaining = parser.remaining();

		if ( remaining.substr( 0, 4 ) === 'true' ) {
			parser.pos += 4;
			return {
				t: BOOLEAN_LITERAL,
				v: 'true'
			};
		}

		if ( remaining.substr( 0, 5 ) === 'false' ) {
			parser.pos += 5;
			return {
				t: BOOLEAN_LITERAL,
				v: 'false'
			};
		}

		return null;
	}

	var stringMiddlePattern;
	var escapeSequencePattern;
	var lineContinuationPattern;
	// Match one or more characters until: ", ', \, or EOL/EOF.
	// EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
	stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;

	// Match one escape sequence, including the backslash.
	escapeSequencePattern = /^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;

	// Match one ES5 line continuation (backslash + line terminator).
	lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;

	// Helper for defining getDoubleQuotedString and getSingleQuotedString.
	function makeQuotedStringMatcher ( okQuote ) {
		return function ( parser ) {
			var literal = '"';
			var done = false;
			var next;

			while ( !done ) {
				next = ( parser.matchPattern( stringMiddlePattern ) || parser.matchPattern( escapeSequencePattern ) ||
					parser.matchString( okQuote ) );
				if ( next ) {
					if ( next === ("\"") ) {
						literal += "\\\"";
					} else if ( next === ("\\'") ) {
						literal += "'";
					} else {
						literal += next;
					}
				} else {
					next = parser.matchPattern( lineContinuationPattern );
					if ( next ) {
						// convert \(newline-like) into a \u escape, which is allowed in JSON
						literal += '\\u' + ( '000' + next.charCodeAt(1).toString(16) ).slice( -4 );
					} else {
						done = true;
					}
				}
			}

			literal += '"';

			// use JSON.parse to interpret escapes
			return JSON.parse( literal );
		};
	}

	var getSingleQuotedString = makeQuotedStringMatcher( ("\"") );
	var getDoubleQuotedString = makeQuotedStringMatcher( ("'") );

	function readStringLiteral ( parser ) {
		var start, string;

		start = parser.pos;

		if ( parser.matchString( '"' ) ) {
			string = getDoubleQuotedString( parser );

			if ( !parser.matchString( '"' ) ) {
				parser.pos = start;
				return null;
			}

			return {
				t: STRING_LITERAL,
				v: string
			};
		}

		if ( parser.matchString( ("'") ) ) {
			string = getSingleQuotedString( parser );

			if ( !parser.matchString( ("'") ) ) {
				parser.pos = start;
				return null;
			}

			return {
				t: STRING_LITERAL,
				v: string
			};
		}

		return null;
	}

	var namePattern = /^[a-zA-Z_$][a-zA-Z_$0-9]*/;

	var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

	// http://mathiasbynens.be/notes/javascript-properties
	// can be any name, string literal, or number literal
	function readKey ( parser ) {
		var token;

		if ( token = readStringLiteral( parser ) ) {
			return identifier.test( token.v ) ? token.v : '"' + token.v.replace( /"/g, '\\"' ) + '"';
		}

		if ( token = readNumberLiteral$1( parser ) ) {
			return token.v;
		}

		if ( token = parser.matchPattern( namePattern ) ) {
			return token;
		}

		return null;
	}

	function readKeyValuePair ( parser ) {
		var start, key, value;

		start = parser.pos;

		// allow whitespace between '{' and key
		parser.allowWhitespace();

		var refKey = parser.nextChar() !== '\'' && parser.nextChar() !== '"';

		key = readKey( parser );
		if ( key === null ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace between key and ':'
		parser.allowWhitespace();

		// es2015 shorthand property
		if ( refKey && ( parser.nextChar() === ',' || parser.nextChar() === '}' ) ) {
			if ( !namePattern.test( key ) ) {
				parser.error( ("Expected a valid reference, but found '" + key + "' instead.") );
			}

			return {
				t: KEY_VALUE_PAIR,
				k: key,
				v: {
					t: REFERENCE,
					n: key
				}
			};
		}

		// next character must be ':'
		if ( !parser.matchString( ':' ) ) {
			parser.pos = start;
			return null;
		}

		// allow whitespace between ':' and value
		parser.allowWhitespace();

		// next expression must be a, well... expression
		value = readExpression( parser );
		if ( value === null ) {
			parser.pos = start;
			return null;
		}

		return {
			t: KEY_VALUE_PAIR,
			k: key,
			v: value
		};
	}

	function readKeyValuePairs ( parser ) {
		var start, pairs, pair, keyValuePairs;

		start = parser.pos;

		pair = readKeyValuePair( parser );
		if ( pair === null ) {
			return null;
		}

		pairs = [ pair ];

		if ( parser.matchString( ',' ) ) {
			keyValuePairs = readKeyValuePairs( parser );

			if ( !keyValuePairs ) {
				parser.pos = start;
				return null;
			}

			return pairs.concat( keyValuePairs );
		}

		return pairs;
	}

	function readObjectLiteral ( parser ) {
		var start, keyValuePairs;

		start = parser.pos;

		// allow whitespace
		parser.allowWhitespace();

		if ( !parser.matchString( '{' ) ) {
			parser.pos = start;
			return null;
		}

		keyValuePairs = readKeyValuePairs( parser );

		// allow whitespace between final value and '}'
		parser.allowWhitespace();

		if ( !parser.matchString( '}' ) ) {
			parser.pos = start;
			return null;
		}

		return {
			t: OBJECT_LITERAL,
			m: keyValuePairs
		};
	}

	function readExpressionList ( parser ) {
		parser.allowWhitespace();

		var expr = readExpression( parser );

		if ( expr === null ) return null;

		var expressions = [ expr ];

		// allow whitespace between expression and ','
		parser.allowWhitespace();

		if ( parser.matchString( ',' ) ) {
			var next = readExpressionList( parser );
			if ( next === null ) parser.error( expectedExpression );

			expressions.push.apply( expressions, next );
		}

		return expressions;
	}

	function readArrayLiteral ( parser ) {
		var start, expressionList;

		start = parser.pos;

		// allow whitespace before '['
		parser.allowWhitespace();

		if ( !parser.matchString( '[' ) ) {
			parser.pos = start;
			return null;
		}

		expressionList = readExpressionList( parser );

		if ( !parser.matchString( ']' ) ) {
			parser.pos = start;
			return null;
		}

		return {
			t: ARRAY_LITERAL,
			m: expressionList
		};
	}

	function readLiteral ( parser ) {
		return readNumberLiteral$1( parser )  ||
		       readBooleanLiteral( parser ) ||
		       readStringLiteral( parser )  ||
		       readObjectLiteral( parser )  ||
		       readArrayLiteral( parser )   ||
		       readNumberLiteral( parser );
	}

	var prefixPattern = /^(?:~\/|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/;
	var globals;
	var keywords;
	// if a reference is a browser global, we don't deference it later, so it needs special treatment
	globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null|Object|Number|String|Boolean)\b/;

	// keywords are not valid references, with the exception of `this`
	keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;

	var legalReference = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:\.(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	var relaxedName = /^[a-zA-Z_$][-\/a-zA-Z_$0-9]*/;
	var specials = /^@(?:keypath|rootpath|index|key|this|global)/;
	var specialCall = /^\s*\(/;
	var spreadPattern = /^\s*\.{3}/;

	function readReference ( parser ) {
		var startPos, prefix, name, global, reference, fullLength, lastDotIndex, spread;

		startPos = parser.pos;

		name = parser.matchPattern( specials );

		if ( name === '@keypath' || name === '@rootpath' ) {
			if ( parser.matchPattern( specialCall ) ) {
				var ref = readReference( parser );
				if ( !ref ) parser.error( ("Expected a valid reference for a keypath expression") );

				parser.allowWhitespace();

				if ( !parser.matchString( ')' ) ) parser.error( ("Unclosed keypath expression") );
				name += "(" + (ref.n) + ")";
			}
		}

		spread = !name && parser.spreadArgs && parser.matchPattern( spreadPattern );

		if ( !name ) {
			prefix = parser.matchPattern( prefixPattern ) || '';
			name = ( !prefix && parser.relaxedNames && parser.matchPattern( relaxedName ) ) ||
			       parser.matchPattern( legalReference );

			if ( !name && prefix === '.' ) {
				prefix = '';
				name = '.';
			} else if ( !name && prefix ) {
				name = prefix;
				prefix = '';
			}
		}

		if ( !name ) {
			return null;
		}

		// bug out if it's a keyword (exception for ancestor/restricted refs - see https://github.com/ractivejs/ractive/issues/1497)
		if ( !prefix && !parser.relaxedNames && keywords.test( name ) ) {
			parser.pos = startPos;
			return null;
		}

		// if this is a browser global, stop here
		if ( !prefix && globals.test( name ) ) {
			global = globals.exec( name )[0];
			parser.pos = startPos + global.length;

			return {
				t: GLOBAL,
				v: ( spread ? '...' : '' ) + global
			};
		}

		fullLength = ( spread ? 3 : 0 ) + ( prefix || '' ).length + name.length;
		reference = ( prefix || '' ) + normalise( name );

		if ( parser.matchString( '(' ) ) {
			// if this is a method invocation (as opposed to a function) we need
			// to strip the method name from the reference combo, else the context
			// will be wrong
			// but only if the reference was actually a member and not a refinement
			lastDotIndex = reference.lastIndexOf( '.' );
			if ( lastDotIndex !== -1 && name[ name.length - 1 ] !== ']' ) {
				var refLength = reference.length;
				reference = reference.substr( 0, lastDotIndex );
				parser.pos = startPos + (fullLength - ( refLength - lastDotIndex ) );
			} else {
				parser.pos -= 1;
			}
		}

		return {
			t: REFERENCE,
			n: ( spread ? '...' : '' ) + reference.replace( /^this\./, './' ).replace( /^this$/, '.' )
		};
	}

	function readBracketedExpression ( parser ) {
		if ( !parser.matchString( '(' ) ) return null;

		parser.allowWhitespace();

		var expr = readExpression( parser );

		if ( !expr ) parser.error( expectedExpression );

		parser.allowWhitespace();

		if ( !parser.matchString( ')' ) ) parser.error( expectedParen );

		return {
			t: BRACKETED,
			x: expr
		};
	}

	function readPrimary ( parser ) {
		return readLiteral( parser )
			|| readReference( parser )
			|| readBracketedExpression( parser );
	}

	function readRefinement ( parser ) {
		// some things call for strict refinement (partial names), meaning no space between reference and refinement
		if ( !parser.strictRefinement ) {
			parser.allowWhitespace();
		}

		// "." name
		if ( parser.matchString( '.' ) ) {
			parser.allowWhitespace();

			var name = parser.matchPattern( namePattern );
			if ( name ) {
				return {
					t: REFINEMENT,
					n: name
				};
			}

			parser.error( 'Expected a property name' );
		}

		// "[" expression "]"
		if ( parser.matchString( '[' ) ) {
			parser.allowWhitespace();

			var expr = readExpression( parser );
			if ( !expr ) parser.error( expectedExpression );

			parser.allowWhitespace();

			if ( !parser.matchString( ']' ) ) parser.error( ("Expected ']'") );

			return {
				t: REFINEMENT,
				x: expr
			};
		}

		return null;
	}

	function readMemberOrInvocation ( parser ) {
		var expression = readPrimary( parser );

		if ( !expression ) return null;

		while ( expression ) {
			var refinement = readRefinement( parser );
			if ( refinement ) {
				expression = {
					t: MEMBER,
					x: expression,
					r: refinement
				};
			}

			else if ( parser.matchString( '(' ) ) {
				parser.allowWhitespace();
				var start = parser.spreadArgs;
				parser.spreadArgs = true;
				var expressionList = readExpressionList( parser );
				parser.spreadArgs = start;

				parser.allowWhitespace();

				if ( !parser.matchString( ')' ) ) {
					parser.error( expectedParen );
				}

				expression = {
					t: INVOCATION,
					x: expression
				};

				if ( expressionList ) expression.o = expressionList;
			}

			else {
				break;
			}
		}

		return expression;
	}

	var readTypeOf;
	var makePrefixSequenceMatcher;
	makePrefixSequenceMatcher = function ( symbol, fallthrough ) {
		return function ( parser ) {
			var expression;

			if ( expression = fallthrough( parser ) ) {
				return expression;
			}

			if ( !parser.matchString( symbol ) ) {
				return null;
			}

			parser.allowWhitespace();

			expression = readExpression( parser );
			if ( !expression ) {
				parser.error( expectedExpression );
			}

			return {
				s: symbol,
				o: expression,
				t: PREFIX_OPERATOR
			};
		};
	};

	// create all prefix sequence matchers, return readTypeOf
	(function() {
		var i, len, matcher, prefixOperators, fallthrough;

		prefixOperators = '! ~ + - typeof'.split( ' ' );

		fallthrough = readMemberOrInvocation;
		for ( i = 0, len = prefixOperators.length; i < len; i += 1 ) {
			matcher = makePrefixSequenceMatcher( prefixOperators[i], fallthrough );
			fallthrough = matcher;
		}

		// typeof operator is higher precedence than multiplication, so provides the
		// fallthrough for the multiplication sequence matcher we're about to create
		// (we're skipping void and delete)
		readTypeOf = fallthrough;
	}());

	var readTypeof = readTypeOf;

	var readLogicalOr;
	var makeInfixSequenceMatcher;
	makeInfixSequenceMatcher = function ( symbol, fallthrough ) {
		return function ( parser ) {
			var start, left, right;

			left = fallthrough( parser );
			if ( !left ) {
				return null;
			}

			// Loop to handle left-recursion in a case like `a * b * c` and produce
			// left association, i.e. `(a * b) * c`.  The matcher can't call itself
			// to parse `left` because that would be infinite regress.
			while ( true ) {
				start = parser.pos;

				parser.allowWhitespace();

				if ( !parser.matchString( symbol ) ) {
					parser.pos = start;
					return left;
				}

				// special case - in operator must not be followed by [a-zA-Z_$0-9]
				if ( symbol === 'in' && /[a-zA-Z_$0-9]/.test( parser.remaining().charAt( 0 ) ) ) {
					parser.pos = start;
					return left;
				}

				parser.allowWhitespace();

				// right operand must also consist of only higher-precedence operators
				right = fallthrough( parser );
				if ( !right ) {
					parser.pos = start;
					return left;
				}

				left = {
					t: INFIX_OPERATOR,
					s: symbol,
					o: [ left, right ]
				};

				// Loop back around.  If we don't see another occurrence of the symbol,
				// we'll return left.
			}
		};
	};

	// create all infix sequence matchers, and return readLogicalOr
	(function() {
		var i, len, matcher, infixOperators, fallthrough;

		// All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
		// Each sequence matcher will initially fall through to its higher precedence
		// neighbour, and only attempt to match if one of the higher precedence operators
		// (or, ultimately, a literal, reference, or bracketed expression) already matched
		infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split( ' ' );

		// A typeof operator is higher precedence than multiplication
		fallthrough = readTypeof;
		for ( i = 0, len = infixOperators.length; i < len; i += 1 ) {
			matcher = makeInfixSequenceMatcher( infixOperators[i], fallthrough );
			fallthrough = matcher;
		}

		// Logical OR is the fallthrough for the conditional matcher
		readLogicalOr = fallthrough;
	}());

	var readLogicalOr$1 = readLogicalOr;

	// The conditional operator is the lowest precedence operator, so we start here
	function getConditional ( parser ) {
		var start, expression, ifTrue, ifFalse;

		expression = readLogicalOr$1( parser );
		if ( !expression ) {
			return null;
		}

		start = parser.pos;

		parser.allowWhitespace();

		if ( !parser.matchString( '?' ) ) {
			parser.pos = start;
			return expression;
		}

		parser.allowWhitespace();

		ifTrue = readExpression( parser );
		if ( !ifTrue ) {
			parser.error( expectedExpression );
		}

		parser.allowWhitespace();

		if ( !parser.matchString( ':' ) ) {
			parser.error( 'Expected ":"' );
		}

		parser.allowWhitespace();

		ifFalse = readExpression( parser );
		if ( !ifFalse ) {
			parser.error( expectedExpression );
		}

		return {
			t: CONDITIONAL,
			o: [ expression, ifTrue, ifFalse ]
		};
	}

	function readExpression ( parser ) {
		// The conditional operator is the lowest precedence operator (except yield,
		// assignment operators, and commas, none of which are supported), so we
		// start there. If it doesn't match, it 'falls through' to progressively
		// higher precedence operators, until it eventually matches (or fails to
		// match) a 'primary' - a literal or a reference. This way, the abstract syntax
		// tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
		return getConditional( parser );
	}

	function flattenExpression ( expression ) {
		var refs, count = 0, stringified;

		extractRefs( expression, refs = [] );
		stringified = stringify( expression );

		refs = refs.map( function ( r ) { return r.indexOf( '...' ) === 0 ? r.substr( 3 ) : r; } );

		return {
			r: refs,
			s: getVars(stringified)
		};

		function getVars(expr) {
			var vars = [];
			for ( var i = count - 1; i >= 0; i-- ) {
				vars.push( ("spread$" + i) );
			}
			return vars.length ? ("(function(){var " + (vars.join(',')) + ";return(" + expr + ");})()") : expr;
		}

		function stringify ( node ) {
			switch ( node.t ) {
				case BOOLEAN_LITERAL:
				case GLOBAL:
				case NUMBER_LITERAL:
				case REGEXP_LITERAL:
					return node.v;

				case STRING_LITERAL:
					return JSON.stringify( String( node.v ) );

				case ARRAY_LITERAL:
					return '[' + ( node.m ? node.m.map( stringify ).join( ',' ) : '' ) + ']';

				case OBJECT_LITERAL:
					return '{' + ( node.m ? node.m.map( stringify ).join( ',' ) : '' ) + '}';

				case KEY_VALUE_PAIR:
					return node.k + ':' + stringify( node.v );

				case PREFIX_OPERATOR:
					return ( node.s === 'typeof' ? 'typeof ' : node.s ) + stringify( node.o );

				case INFIX_OPERATOR:
					return stringify( node.o[0] ) + ( node.s.substr( 0, 2 ) === 'in' ? ' ' + node.s + ' ' : node.s ) + stringify( node.o[1] );

				case INVOCATION:
					if ( node.spread ) {
						var id = count++;
						return ("(spread$" + id + " = " + (stringify(node.x)) + ").apply(spread$" + id + ", [].concat(" + (node.o ? node.o.map( function ( a ) { return a.n && a.n.indexOf( '...' ) === 0 ? stringify( a ) : '[' + stringify(a) + ']'; } ).join( ',' ) : '') + ") )");
					} else {
						return stringify( node.x ) + '(' + ( node.o ? node.o.map( stringify ).join( ',' ) : '' ) + ')';
					}

				case BRACKETED:
					return '(' + stringify( node.x ) + ')';

				case MEMBER:
					return stringify( node.x ) + stringify( node.r );

				case REFINEMENT:
					return ( node.n ? '.' + node.n : '[' + stringify( node.x ) + ']' );

				case CONDITIONAL:
					return stringify( node.o[0] ) + '?' + stringify( node.o[1] ) + ':' + stringify( node.o[2] );

				case REFERENCE:
					return '_' + refs.indexOf( node.n );

				default:
					throw new Error( 'Expected legal JavaScript' );
			}
		}
	}

	// TODO maybe refactor this?
	function extractRefs ( node, refs ) {
		var i, list;

		if ( node.t === REFERENCE ) {
			if ( refs.indexOf( node.n ) === -1 ) {
				refs.unshift( node.n );
			}
		}

		list = node.o || node.m;
		if ( list ) {
			if ( isObject( list ) ) {
				extractRefs( list, refs );
			} else {
				i = list.length;
				while ( i-- ) {
					if ( list[i].n && list[i].n.indexOf('...') === 0 ) {
						node.spread = true;
					}
					extractRefs( list[i], refs );
				}
			}
		}

		if ( node.x ) {
			extractRefs( node.x, refs );
		}

		if ( node.r ) {
			extractRefs( node.r, refs );
		}

		if ( node.v ) {
			extractRefs( node.v, refs );
		}
	}

	// simple JSON parser, without the restrictions of JSON parse
	// (i.e. having to double-quote keys).
	//
	// If passed a hash of values as the second argument, ${placeholders}
	// will be replaced with those values

	var specials$1 = {
		'true': true,
		'false': false,
		'null': null,
		undefined: undefined
	};

	var specialsPattern = new RegExp( '^(?:' + Object.keys( specials$1 ).join( '|' ) + ')' );
	var numberPattern$1 = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
	var placeholderPattern = /\$\{([^\}]+)\}/g;
	var placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
	var onlyWhitespace = /^\s*$/;

	var JsonParser = Parser$1.extend({
		init: function ( str, options ) {
			this.values = options.values;
			this.allowWhitespace();
		},

		postProcess: function ( result ) {
			if ( result.length !== 1 || !onlyWhitespace.test( this.leftover ) ) {
				return null;
			}

			return { value: result[0].v };
		},

		converters: [
			function getPlaceholder ( parser ) {
				if ( !parser.values ) return null;

				var placeholder = parser.matchPattern( placeholderAtStartPattern );

				if ( placeholder && ( parser.values.hasOwnProperty( placeholder ) ) ) {
					return { v: parser.values[ placeholder ] };
				}
			},

			function getSpecial ( parser ) {
				var special = parser.matchPattern( specialsPattern );
				if ( special ) return { v: specials$1[ special ] };
			},

			function getNumber ( parser ) {
				var number = parser.matchPattern( numberPattern$1 );
				if ( number ) return { v: +number };
			},

			function getString ( parser ) {
				var stringLiteral = readStringLiteral( parser );
				var values = parser.values;

				if ( stringLiteral && values ) {
					return {
						v: stringLiteral.v.replace( placeholderPattern, function ( match, $1 ) { return ( $1 in values ? values[ $1 ] : $1 ); } )
					};
				}

				return stringLiteral;
			},

			function getObject ( parser ) {
				if ( !parser.matchString( '{' ) ) return null;

				var result = {};

				parser.allowWhitespace();

				if ( parser.matchString( '}' ) ) {
					return { v: result };
				}

				var pair;
				while ( pair = getKeyValuePair( parser ) ) {
					result[ pair.key ] = pair.value;

					parser.allowWhitespace();

					if ( parser.matchString( '}' ) ) {
						return { v: result };
					}

					if ( !parser.matchString( ',' ) ) {
						return null;
					}
				}

				return null;
			},

			function getArray ( parser ) {
				if ( !parser.matchString( '[' ) ) return null;

				var result = [];

				parser.allowWhitespace();

				if ( parser.matchString( ']' ) ) {
					return { v: result };
				}

				var valueToken;
				while ( valueToken = parser.read() ) {
					result.push( valueToken.v );

					parser.allowWhitespace();

					if ( parser.matchString( ']' ) ) {
						return { v: result };
					}

					if ( !parser.matchString( ',' ) ) {
						return null;
					}

					parser.allowWhitespace();
				}

				return null;
			}
		]
	});

	function getKeyValuePair ( parser ) {
		parser.allowWhitespace();

		var key = readKey( parser );

		if ( !key ) return null;

		var pair = { key: key };

		parser.allowWhitespace();
		if ( !parser.matchString( ':' ) ) {
			return null;
		}
		parser.allowWhitespace();

		var valueToken = parser.read();

		if ( !valueToken ) return null;

		pair.value = valueToken.v;
		return pair;
	}

	function parseJSON ( str, values ) {
		var parser = new JsonParser( str, { values: values });
		return parser.result;
	}

	var methodCallPattern = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\(.*\)\s*$/;
	var ExpressionParser;
	var blank = /^\s*$/;

	ExpressionParser = Parser$1.extend({
		converters: [ readExpression ],
		spreadArgs: true
	});

	// TODO clean this up, it's shocking
	function processDirective ( tokens, parentParser, type ) {
		var result,
			match,
			token,
			colonIndex,
			directiveName,
			directiveArgs,
			parsed;

		if ( typeof tokens === 'string' ) {
			var pos = parentParser.pos - tokens.length;
			if ( type === DECORATOR || type === TRANSITION ) {
				var parser = new ExpressionParser( ("[" + tokens + "]") );
				return { a: flattenExpression( parser.result[0] ) };
			}

			if ( type === EVENT && ( match = methodCallPattern.exec( tokens ) ) ) {
				warnIfDebug( parentParser.getContextMessage( pos, ("Unqualified method events are deprecated. Prefix methods with '@this.' to call methods on the current Ractive instance.") )[2] );
				tokens = "@this." + (match[1]) + "" + (tokens.substr(match[1].length));
			}

			if ( type === EVENT && ~tokens.indexOf( '(' ) ) {
				var parser$1 = new ExpressionParser( '[' + tokens + ']' );
				if ( parser$1.result && parser$1.result[0] ) {
					if ( parser$1.remaining().length ) {
						parentParser.pos = pos + tokens.length - parser$1.remaining().length;
						parentParser.error( ("Invalid input after event expression '" + (parser$1.remaining()) + "'") );
					}
					return { x: flattenExpression( parser$1.result[0] ) };
				}

				if ( tokens.indexOf( ':' ) > tokens.indexOf( '(' ) || !~tokens.indexOf( ':' ) ) {
					parentParser.pos = pos;
					parentParser.error( ("Invalid input in event expression '" + tokens + "'") );
				}

			}

			if ( tokens.indexOf( ':' ) === -1 ) {
				return tokens.trim();
			}

			tokens = [ tokens ];
		}

		result = {};

		directiveName = [];
		directiveArgs = [];

		if ( tokens ) {
			while ( tokens.length ) {
				token = tokens.shift();

				if ( typeof token === 'string' ) {
					// ignore empty space
					if ( blank.test( token ) ) continue;

					colonIndex = token.indexOf( ':' );

					if ( colonIndex === -1 ) {
						directiveName.push( token );
					} else {
						// is the colon the first character?
						if ( colonIndex ) {
							// no
							directiveName.push( token.substr( 0, colonIndex ) );
						}

						// if there is anything after the colon in this token, treat
						// it as the first token of the directiveArgs fragment
						if ( token.length > colonIndex + 1 ) {
							directiveArgs[0] = token.substring( colonIndex + 1 );
						}

						break;
					}
				}

				else {
					directiveName.push( token );
				}
			}

			directiveArgs = directiveArgs.concat( tokens );
		}

		if ( !directiveName.length ) {
			result = '';
		} else if ( directiveArgs.length || typeof directiveName !== 'string' ) {
			result = {
				// TODO is this really necessary? just use the array
				n: ( directiveName.length === 1 && typeof directiveName[0] === 'string' ? directiveName[0] : directiveName )
			};

			if ( directiveArgs.length === 1 && typeof directiveArgs[0] === 'string' ) {
				parsed = parseJSON( '[' + directiveArgs[0] + ']' );
				result.a = parsed ? parsed.value : [ directiveArgs[0].trim() ];
			}

			else {
				result.d = directiveArgs;
			}
		} else {
			result = directiveName;
		}

		if ( directiveArgs.length && type ) {
			warnIfDebug( parentParser.getContextMessage( parentParser.pos, ("Proxy events with arguments are deprecated. You can fire events with arguments using \"@this.fire('eventName', arg1, arg2, ...)\".") )[2] );
		}

		return result;
	}

	var attributeNamePattern = /^[^\s"'>\/=]+/;
	var onPattern = /^on/;
	var proxyEventPattern = /^on-([a-zA-Z\\*\\.$_][a-zA-Z\\*\\.$_0-9\-]+)$/;
	var reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|unrender|detach|insert)$/;
	var decoratorPattern = /^as-([a-z-A-Z][-a-zA-Z_0-9]*)$/;
	var transitionPattern = /^([a-zA-Z](?:(?!-in-out)[-a-zA-Z_0-9])*)-(in|out|in-out)$/;
	var directives = {
					   'intro-outro': { t: TRANSITION, v: 't0' },
					   intro: { t: TRANSITION, v: 't1' },
					   outro: { t: TRANSITION, v: 't2' },
					   lazy: { t: BINDING_FLAG, v: 'l' },
					   twoway: { t: BINDING_FLAG, v: 't' },
					   decorator: { t: DECORATOR }
					 };
	var unquotedAttributeValueTextPattern = /^[^\s"'=<>\/`]+/;
	function readAttribute ( parser ) {
		var attr, name, value, i, nearest, idx;

		parser.allowWhitespace();

		name = parser.matchPattern( attributeNamePattern );
		if ( !name ) {
			return null;
		}

		// check for accidental delimiter consumption e.g. <tag bool{{>attrs}} />
		nearest = name.length;
		for ( i = 0; i < parser.tags.length; i++ ) {
			if ( ~( idx = name.indexOf( parser.tags[ i ].open ) ) ) {
				if ( idx < nearest ) nearest = idx;
			}
		}
		if ( nearest < name.length ) {
			parser.pos -= name.length - nearest;
			name = name.substr( 0, nearest );
			if ( !name ) return null;
			else return { n: name };
		}

		attr = { n: name };

		value = readAttributeValue( parser );
		if ( value != null ) { // not null/undefined
			attr.f = value;
		}

		return attr;
	}

	function readAttributeValue ( parser ) {
		var start, valueStart, startDepth, value;

		start = parser.pos;

		// next character must be `=`, `/`, `>` or whitespace
		if ( !/[=\/>\s]/.test( parser.nextChar() ) ) {
			parser.error( 'Expected `=`, `/`, `>` or whitespace' );
		}

		parser.allowWhitespace();

		if ( !parser.matchString( '=' ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		valueStart = parser.pos;
		startDepth = parser.sectionDepth;

		value = readQuotedAttributeValue( parser, ("'") ) ||
				readQuotedAttributeValue( parser, ("\"") ) ||
				readUnquotedAttributeValue( parser );

		if ( value === null ) {
			parser.error( 'Expected valid attribute value' );
		}

		if ( parser.sectionDepth !== startDepth ) {
			parser.pos = valueStart;
			parser.error( 'An attribute value must contain as many opening section tags as closing section tags' );
		}

		if ( !value.length ) {
			return '';
		}

		if ( value.length === 1 && typeof value[0] === 'string' ) {
			return decodeCharacterReferences( value[0] );
		}

		return value;
	}

	function readUnquotedAttributeValueToken ( parser ) {
		var start, text, haystack, needles, index;

		start = parser.pos;

		text = parser.matchPattern( unquotedAttributeValueTextPattern );

		if ( !text ) {
			return null;
		}

		haystack = text;
		needles = parser.tags.map( function ( t ) { return t.open; } ); // TODO refactor... we do this in readText.js as well

		if ( ( index = getLowestIndex( haystack, needles ) ) !== -1 ) {
			text = text.substr( 0, index );
			parser.pos = start + text.length;
		}

		return text;
	}

	function readUnquotedAttributeValue ( parser ) {
		var tokens, token;

		parser.inAttribute = true;

		tokens = [];

		token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
		while ( token ) {
			tokens.push( token );
			token = readMustache( parser ) || readUnquotedAttributeValueToken( parser );
		}

		if ( !tokens.length ) {
			return null;
		}

		parser.inAttribute = false;
		return tokens;
	}

	function readQuotedAttributeValue ( parser, quoteMark ) {
		var start, tokens, token;

		start = parser.pos;

		if ( !parser.matchString( quoteMark ) ) {
			return null;
		}

		parser.inAttribute = quoteMark;

		tokens = [];

		token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
		while ( token !== null ) {
			tokens.push( token );
			token = readMustache( parser ) || readQuotedStringToken( parser, quoteMark );
		}

		if ( !parser.matchString( quoteMark ) ) {
			parser.pos = start;
			return null;
		}

		parser.inAttribute = false;

		return tokens;
	}

	function readQuotedStringToken ( parser, quoteMark ) {
		var haystack = parser.remaining();

		var needles = parser.tags.map( function ( t ) { return t.open; } ); // TODO refactor... we do this in readText.js as well
		needles.push( quoteMark );

		var index = getLowestIndex( haystack, needles );

		if ( index === -1 ) {
			parser.error( 'Quoted attribute value must have a closing quote' );
		}

		if ( !index ) {
			return null;
		}

		parser.pos += index;
		return haystack.substr( 0, index );
	}

	function readAttributeOrDirective ( parser ) {
			var match,
				attribute,
			    directive;

			attribute = readAttribute( parser );

			if ( !attribute ) return null;

			// intro, outro, decorator
			if ( directive = directives[ attribute.n ] ) {
				attribute.t = directive.t;
				if ( directive.v ) attribute.v = directive.v;
				delete attribute.n; // no name necessary

				if ( directive.t === TRANSITION || directive.t === DECORATOR ) attribute.f = processDirective( attribute.f, parser );

				if ( directive.t === TRANSITION ) {
					warnOnceIfDebug( ("" + (directive.v === 't0' ? 'intro-outro' : directive.v === 't1' ? 'intro' : 'outro') + " is deprecated. To specify tranisitions, use the transition name suffixed with '-in', '-out', or '-in-out' as an attribute. Arguments can be specified in the attribute value as a simple list of expressions without mustaches.") );
				} else if ( directive.t === DECORATOR ) {
					warnOnceIfDebug( ("decorator is deprecated. To specify decorators, use the decorator name prefixed with 'as-' as an attribute. Arguments can be specified in the attribute value as a simple list of expressions without mustaches.") );
				}
			}

			// decorators
			else if ( match = decoratorPattern.exec( attribute.n ) ) {
				delete attribute.n;
				attribute.t = DECORATOR;
				attribute.f = processDirective( attribute.f, parser, DECORATOR );
				if ( typeof attribute.f === 'object' ) attribute.f.n = match[1];
				else attribute.f = match[1];
			}

			// transitions
			else if ( match = transitionPattern.exec( attribute.n ) ) {
				delete attribute.n;
				attribute.t = TRANSITION;
				attribute.f = processDirective( attribute.f, parser, TRANSITION );
				if ( typeof attribute.f === 'object' ) attribute.f.n = match[1];
				else attribute.f = match[1];
				attribute.v = match[2] === 'in-out' ? 't0' : match[2] === 'in' ? 't1' : 't2';
			}

			// on-click etc
			else if ( match = proxyEventPattern.exec( attribute.n ) ) {
				attribute.n = match[1];
				attribute.t = EVENT;
				attribute.f = processDirective( attribute.f, parser, EVENT );

				if ( reservedEventNames.test( attribute.f.n || attribute.f ) ) {
					parser.pos -= ( attribute.f.n || attribute.f ).length;
					parser.error( 'Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, detach, insert)' );
				}
			}

			else {
				if ( parser.sanitizeEventAttributes && onPattern.test( attribute.n ) ) {
					return { exclude: true };
				} else {
					attribute.f = attribute.f || ( attribute.f === '' ? '' : 0 );
					attribute.t = ATTRIBUTE;
				}
			}

			return attribute;
	}

	var delimiterChangeToken = { t: DELIMCHANGE, exclude: true };

	function readMustache ( parser ) {
		var mustache, i;

		// If we're inside a <script> or <style> tag, and we're not
		// interpolating, bug out
		if ( parser.interpolate[ parser.inside ] === false ) {
			return null;
		}

		for ( i = 0; i < parser.tags.length; i += 1 ) {
			if ( mustache = readMustacheOfType( parser, parser.tags[i] ) ) {
				return mustache;
			}
		}

		if ( parser.inTag && !parser.inAttribute ) {
			mustache = readAttributeOrDirective( parser );
			if ( mustache ) {
				parser.allowWhitespace();
				return mustache;
			}
		}
	}

	function readMustacheOfType ( parser, tag ) {
		var start, mustache, reader, i;

		start = parser.pos;

		if ( parser.matchString( '\\' + tag.open ) ) {
			if ( start === 0 || parser.str[ start - 1 ] !== '\\' ) {
				return tag.open;
			}
		} else if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		// delimiter change?
		if ( mustache = readDelimiterChange( parser ) ) {
			// find closing delimiter or abort...
			if ( !parser.matchString( tag.close ) ) {
				return null;
			}

			// ...then make the switch
			tag.open = mustache[0];
			tag.close = mustache[1];
			parser.sortMustacheTags();

			return delimiterChangeToken;
		}

		parser.allowWhitespace();

		// illegal section closer
		if ( parser.matchString( '/' ) ) {
			parser.pos -= 1;
			var rewind = parser.pos;
			if ( !readNumberLiteral( parser ) ) {
				parser.pos = rewind - ( tag.close.length );
				if ( parser.inAttribute ) {
					parser.pos = start;
					return null;
				} else {
					parser.error( 'Attempted to close a section that wasn\'t open' );
				}
			} else {
				parser.pos = rewind;
			}
		}

		for ( i = 0; i < tag.readers.length; i += 1 ) {
			reader = tag.readers[i];

			if ( mustache = reader( parser, tag ) ) {
				if ( tag.isStatic ) {
					mustache.s = true; // TODO make this `1` instead - more compact
				}

				if ( parser.includeLinePositions ) {
					mustache.p = parser.getLinePos( start );
				}

				return mustache;
			}
		}

		parser.pos = start;
		return null;
	}

	function refineExpression ( expression, mustache ) {
		var referenceExpression;

		if ( expression ) {
			while ( expression.t === BRACKETED && expression.x ) {
				expression = expression.x;
			}

			if ( expression.t === REFERENCE ) {
				mustache.r = expression.n;
			} else {
				if ( referenceExpression = getReferenceExpression( expression ) ) {
					mustache.rx = referenceExpression;
				} else {
					mustache.x = flattenExpression( expression );
				}
			}

			return mustache;
		}
	}

	// TODO refactor this! it's bewildering
	function getReferenceExpression ( expression ) {
		var members = [], refinement;

		while ( expression.t === MEMBER && expression.r.t === REFINEMENT ) {
			refinement = expression.r;

			if ( refinement.x ) {
				if ( refinement.x.t === REFERENCE ) {
					members.unshift( refinement.x );
				} else {
					members.unshift( flattenExpression( refinement.x ) );
				}
			} else {
				members.unshift( refinement.n );
			}

			expression = expression.x;
		}

		if ( expression.t !== REFERENCE ) {
			return null;
		}

		return {
			r: expression.n,
			m: members
		};
	}

	function readTriple ( parser, tag ) {
		var expression = readExpression( parser ), triple;

		if ( !expression ) {
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		triple = { t: TRIPLE };
		refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

		return triple;
	}

	function readUnescaped ( parser, tag ) {
		var expression, triple;

		if ( !parser.matchString( '&' ) ) {
			return null;
		}

		parser.allowWhitespace();

		expression = readExpression( parser );

		if ( !expression ) {
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		triple = { t: TRIPLE };
		refineExpression( expression, triple ); // TODO handle this differently - it's mysterious

		return triple;
	}

	var legalAlias = /^(?:[a-zA-Z$_0-9]|\\\.)+(?:(?:(?:[a-zA-Z$_0-9]|\\\.)+)|(?:\[[0-9]+\]))*/;
	var asRE = /^as/i;

	function readAliases( parser ) {
		var aliases = [], alias, start = parser.pos;

		parser.allowWhitespace();

		alias = readAlias( parser );

		if ( alias ) {
			alias.x = refineExpression( alias.x, {} );
			aliases.push( alias );

			parser.allowWhitespace();

			while ( parser.matchString(',') ) {
				alias = readAlias( parser );

				if ( !alias ) {
					parser.error( 'Expected another alias.' );
				}

				alias.x = refineExpression( alias.x, {} );
				aliases.push( alias );

				parser.allowWhitespace();
			}

			return aliases;
		}

		parser.pos = start;
		return null;
	}

	function readAlias( parser ) {
		var expr, alias, start = parser.pos;

		parser.allowWhitespace();

		expr = readExpression( parser, [] );

		if ( !expr ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		if ( !parser.matchPattern( asRE ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		alias = parser.matchPattern( legalAlias );

		if ( !alias ) {
			parser.error( 'Expected a legal alias name.' );
		}

		return { n: alias, x: expr };
	}

	function readPartial ( parser, tag ) {
		if ( !parser.matchString( '>' ) ) return null;

		parser.allowWhitespace();

		// Partial names can include hyphens, so we can't use readExpression
		// blindly. Instead, we use the `relaxedNames` flag to indicate that
		// `foo-bar` should be read as a single name, rather than 'subtract
		// bar from foo'
		parser.relaxedNames = parser.strictRefinement = true;
		var expression = readExpression( parser );
		parser.relaxedNames = parser.strictRefinement = false;

		if ( !expression ) return null;

		var partial = { t: PARTIAL };
		refineExpression( expression, partial ); // TODO...

		parser.allowWhitespace();

		// check for alias context e.g. `{{>foo bar as bat, bip as bop}}` then
		// turn it into `{{#with bar as bat, bip as bop}}{{>foo}}{{/with}}`
		var aliases = readAliases( parser );
		if ( aliases ) {
			partial = {
				t: ALIAS,
				z: aliases,
				f: [ partial ]
			};
		}

		// otherwise check for literal context e.g. `{{>foo bar}}` then
		// turn it into `{{#with bar}}{{>foo}}{{/with}}`
		else {
			var context = readExpression( parser );
			if ( context) {
				partial = {
					t: SECTION,
					n: SECTION_WITH,
					f: [ partial ]
				};

				refineExpression( context, partial );
			}
		}

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return partial;
	}

	function readComment ( parser, tag ) {
		var index;

		if ( !parser.matchString( '!' ) ) {
			return null;
		}

		index = parser.remaining().indexOf( tag.close );

		if ( index !== -1 ) {
			parser.pos += index + tag.close.length;
			return { t: COMMENT };
		}
	}

	function readExpressionOrReference ( parser, expectedFollowers ) {
		var start, expression, i;

		start = parser.pos;
		expression = readExpression( parser );

		if ( !expression ) {
			// valid reference but invalid expression e.g. `{{new}}`?
			var ref = parser.matchPattern( /^(\w+)/ );
			if ( ref ) {
				return {
					t: REFERENCE,
					n: ref
				};
			}

			return null;
		}

		for ( i = 0; i < expectedFollowers.length; i += 1 ) {
			if ( parser.remaining().substr( 0, expectedFollowers[i].length ) === expectedFollowers[i] ) {
				return expression;
			}
		}

		parser.pos = start;
		return readReference( parser );
	}

	function readInterpolator ( parser, tag ) {
		var start, expression, interpolator, err;

		start = parser.pos;

		// TODO would be good for perf if we could do away with the try-catch
		try {
			expression = readExpressionOrReference( parser, [ tag.close ]);
		} catch ( e ) {
			err = e;
		}

		if ( !expression ) {
			if ( parser.str.charAt( start ) === '!' ) {
				// special case - comment
				parser.pos = start;
				return null;
			}

			if ( err ) {
				throw err;
			}
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "' after reference") );

			if ( !expression ) {
				// special case - comment
				if ( parser.nextChar() === '!' ) {
					return null;
				}

				parser.error( ("Expected expression or legal reference") );
			}
		}

		interpolator = { t: INTERPOLATOR };
		refineExpression( expression, interpolator ); // TODO handle this differently - it's mysterious

		return interpolator;
	}

	var yieldPattern = /^yield\s*/;

	function readYielder ( parser, tag ) {
		if ( !parser.matchPattern( yieldPattern ) ) return null;

		var name = parser.matchPattern( /^[a-zA-Z_$][a-zA-Z_$0-9\-]*/ );

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("expected legal partial name") );
		}

		var yielder = { t: YIELDER };
		if ( name ) yielder.n = name;

		return yielder;
	}

	function readClosing ( parser, tag ) {
		var start, remaining, index, closing;

		start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		parser.allowWhitespace();

		if ( !parser.matchString( '/' ) ) {
			parser.pos = start;
			return null;
		}

		parser.allowWhitespace();

		remaining = parser.remaining();
		index = remaining.indexOf( tag.close );

		if ( index !== -1 ) {
			closing = {
				t: CLOSING,
				r: remaining.substr( 0, index ).split( ' ' )[0]
			};

			parser.pos += index;

			if ( !parser.matchString( tag.close ) ) {
				parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
			}

			return closing;
		}

		parser.pos = start;
		return null;
	}

	var elsePattern = /^\s*else\s*/;

	function readElse ( parser, tag ) {
		var start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		if ( !parser.matchPattern( elsePattern ) ) {
			parser.pos = start;
			return null;
		}

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return {
			t: ELSE
		};
	}

	var elsePattern$1 = /^\s*elseif\s+/;

	function readElseIf ( parser, tag ) {
		var start = parser.pos;

		if ( !parser.matchString( tag.open ) ) {
			return null;
		}

		if ( !parser.matchPattern( elsePattern$1 ) ) {
			parser.pos = start;
			return null;
		}

		var expression = readExpression( parser );

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		return {
			t: ELSEIF,
			x: expression
		};
	}

	var handlebarsBlockCodes = {
		'each':    SECTION_EACH,
		'if':      SECTION_IF,
		'with':    SECTION_IF_WITH,
		'unless':  SECTION_UNLESS
	};

	var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	var keyIndexRefPattern = /^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/;
	var handlebarsBlockPattern = new RegExp( '^(' + Object.keys( handlebarsBlockCodes ).join( '|' ) + ')\\b' );
	function readSection ( parser, tag ) {
		var start, expression, section, child, children, hasElse, block, unlessBlock, conditions, closed, i, expectedClose, aliasOnly = false;

		start = parser.pos;

		if ( parser.matchString( '^' ) ) {
			section = { t: SECTION, f: [], n: SECTION_UNLESS };
		} else if ( parser.matchString( '#' ) ) {
			section = { t: SECTION, f: [] };

			if ( parser.matchString( 'partial' ) ) {
				parser.pos = start - parser.standardDelimiters[0].length;
				parser.error( 'Partial definitions can only be at the top level of the template, or immediately inside components' );
			}

			if ( block = parser.matchPattern( handlebarsBlockPattern ) ) {
				expectedClose = block;
				section.n = handlebarsBlockCodes[ block ];
			}
		} else {
			return null;
		}

		parser.allowWhitespace();

		if ( block === 'with' ) {
			var aliases = readAliases( parser );
			if ( aliases ) {
				aliasOnly = true;
				section.z = aliases;
				section.t = ALIAS;
			}
		} else if ( block === 'each' ) {
			var alias = readAlias( parser );
			if ( alias ) {
				section.z = [ { n: alias.n, x: { r: '.' } } ];
				expression = alias.x;
			}
		}

		if ( !aliasOnly ) {
			if ( !expression ) expression = readExpression( parser );

			if ( !expression ) {
				parser.error( 'Expected expression' );
			}

			// optional index and key references
			if ( i = parser.matchPattern( indexRefPattern ) ) {
				var extra;

				if ( extra = parser.matchPattern( keyIndexRefPattern ) ) {
					section.i = i + ',' + extra;
				} else {
					section.i = i;
				}
			}
		}

		parser.allowWhitespace();

		if ( !parser.matchString( tag.close ) ) {
			parser.error( ("Expected closing delimiter '" + (tag.close) + "'") );
		}

		parser.sectionDepth += 1;
		children = section.f;

		conditions = [];

		var pos;
		do {
			pos = parser.pos;
			if ( child = readClosing( parser, tag ) ) {
				if ( expectedClose && child.r !== expectedClose ) {
					parser.pos = pos;
					parser.error( ("Expected " + (tag.open) + "/" + expectedClose + "" + (tag.close)) );
				}

				parser.sectionDepth -= 1;
				closed = true;
			}

			else if ( !aliasOnly && ( child = readElseIf( parser, tag ) ) ) {
				if ( section.n === SECTION_UNLESS ) {
					parser.error( '{{else}} not allowed in {{#unless}}' );
				}

				if ( hasElse ) {
					parser.error( 'illegal {{elseif...}} after {{else}}' );
				}

				if ( !unlessBlock ) {
					unlessBlock = [];
				}

				var mustache = {
					t: SECTION,
					n: SECTION_IF,
					f: children = []
				};
				refineExpression( child.x, mustache );

				unlessBlock.push( mustache );
			}

			else if ( !aliasOnly && ( child = readElse( parser, tag ) ) ) {
				if ( section.n === SECTION_UNLESS ) {
					parser.error( '{{else}} not allowed in {{#unless}}' );
				}

				if ( hasElse ) {
					parser.error( 'there can only be one {{else}} block, at the end of a section' );
				}

				hasElse = true;

				// use an unless block if there's no elseif
				if ( !unlessBlock ) {
					unlessBlock = [];
				}

				unlessBlock.push({
					t: SECTION,
					n: SECTION_UNLESS,
					f: children = []
				});
			}

			else {
				child = parser.read( READERS );

				if ( !child ) {
					break;
				}

				children.push( child );
			}
		} while ( !closed );

		if ( unlessBlock ) {
			section.l = unlessBlock;
		}

		if ( !aliasOnly ) {
			refineExpression( expression, section );
		}

		// TODO if a section is empty it should be discarded. Don't do
		// that here though - we need to clean everything up first, as
		// it may contain removeable whitespace. As a temporary measure,
		// to pass the existing tests, remove empty `f` arrays
		if ( !section.f.length ) {
			delete section.f;
		}

		return section;
	}

	var OPEN_COMMENT = '<!--';
	var CLOSE_COMMENT = '-->';
	function readHtmlComment ( parser ) {
		var start, content, remaining, endIndex, comment;

		start = parser.pos;

		if ( parser.textOnlyMode || !parser.matchString( OPEN_COMMENT ) ) {
			return null;
		}

		remaining = parser.remaining();
		endIndex = remaining.indexOf( CLOSE_COMMENT );

		if ( endIndex === -1 ) {
			parser.error( 'Illegal HTML - expected closing comment sequence (\'-->\')' );
		}

		content = remaining.substr( 0, endIndex );
		parser.pos += endIndex + 3;

		comment = {
			t: COMMENT,
			c: content
		};

		if ( parser.includeLinePositions ) {
			comment.p = parser.getLinePos( start );
		}

		return comment;
	}

	var leadingLinebreak = /^[ \t\f\r\n]*\r?\n/;
	var trailingLinebreak = /\r?\n[ \t\f\r\n]*$/;
	function stripStandalones ( items ) {
		var i, current, backOne, backTwo, lastSectionItem;

		for ( i=1; i<items.length; i+=1 ) {
			current = items[i];
			backOne = items[i-1];
			backTwo = items[i-2];

			// if we're at the end of a [text][comment][text] sequence...
			if ( isString( current ) && isComment( backOne ) && isString( backTwo ) ) {

				// ... and the comment is a standalone (i.e. line breaks either side)...
				if ( trailingLinebreak.test( backTwo ) && leadingLinebreak.test( current ) ) {

					// ... then we want to remove the whitespace after the first line break
					items[i-2] = backTwo.replace( trailingLinebreak, '\n' );

					// and the leading line break of the second text token
					items[i] = current.replace( leadingLinebreak, '' );
				}
			}

			// if the current item is a section, and it is preceded by a linebreak, and
			// its first item is a linebreak...
			if ( isSection( current ) && isString( backOne ) ) {
				if ( trailingLinebreak.test( backOne ) && isString( current.f[0] ) && leadingLinebreak.test( current.f[0] ) ) {
					items[i-1] = backOne.replace( trailingLinebreak, '\n' );
					current.f[0] = current.f[0].replace( leadingLinebreak, '' );
				}
			}

			// if the last item was a section, and it is followed by a linebreak, and
			// its last item is a linebreak...
			if ( isString( current ) && isSection( backOne ) ) {
				lastSectionItem = lastItem( backOne.f );

				if ( isString( lastSectionItem ) && trailingLinebreak.test( lastSectionItem ) && leadingLinebreak.test( current ) ) {
					backOne.f[ backOne.f.length - 1 ] = lastSectionItem.replace( trailingLinebreak, '\n' );
					items[i] = current.replace( leadingLinebreak, '' );
				}
			}
		}

		return items;
	}

	function isString ( item ) {
		return typeof item === 'string';
	}

	function isComment ( item ) {
		return item.t === COMMENT || item.t === DELIMCHANGE;
	}

	function isSection ( item ) {
		return ( item.t === SECTION || item.t === INVERTED ) && item.f;
	}

	function trimWhitespace ( items, leadingPattern, trailingPattern ) {
		var item;

		if ( leadingPattern ) {
			item = items[0];
			if ( typeof item === 'string' ) {
				item = item.replace( leadingPattern, '' );

				if ( !item ) {
					items.shift();
				} else {
					items[0] = item;
				}
			}
		}

		if ( trailingPattern ) {
			item = lastItem( items );
			if ( typeof item === 'string' ) {
				item = item.replace( trailingPattern, '' );

				if ( !item ) {
					items.pop();
				} else {
					items[ items.length - 1 ] = item;
				}
			}
		}
	}

	var contiguousWhitespace = /[ \t\f\r\n]+/g;
	var preserveWhitespaceElements = /^(?:pre|script|style|textarea)$/i;
	var leadingWhitespace$1 = /^[ \t\f\r\n]+/;
	var trailingWhitespace = /[ \t\f\r\n]+$/;
	var leadingNewLine = /^(?:\r\n|\r|\n)/;
	var trailingNewLine = /(?:\r\n|\r|\n)$/;

	function cleanup ( items, stripComments, preserveWhitespace, removeLeadingWhitespace, removeTrailingWhitespace ) {
		if ( typeof items === 'string' ) return;

		var i,
			item,
			previousItem,
			nextItem,
			preserveWhitespaceInsideFragment,
			removeLeadingWhitespaceInsideFragment,
			removeTrailingWhitespaceInsideFragment,
			key;

		// First pass - remove standalones and comments etc
		stripStandalones( items );

		i = items.length;
		while ( i-- ) {
			item = items[i];

			// Remove delimiter changes, unsafe elements etc
			if ( item.exclude ) {
				items.splice( i, 1 );
			}

			// Remove comments, unless we want to keep them
			else if ( stripComments && item.t === COMMENT ) {
				items.splice( i, 1 );
			}
		}

		// If necessary, remove leading and trailing whitespace
		trimWhitespace( items, removeLeadingWhitespace ? leadingWhitespace$1 : null, removeTrailingWhitespace ? trailingWhitespace : null );

		i = items.length;
		while ( i-- ) {
			item = items[i];

			// Recurse
			if ( item.f ) {
				var isPreserveWhitespaceElement = item.t === ELEMENT && preserveWhitespaceElements.test( item.e );
				preserveWhitespaceInsideFragment = preserveWhitespace || isPreserveWhitespaceElement;

				if ( !preserveWhitespace && isPreserveWhitespaceElement ) {
					trimWhitespace( item.f, leadingNewLine, trailingNewLine );
				}

				if ( !preserveWhitespaceInsideFragment ) {
					previousItem = items[ i - 1 ];
					nextItem = items[ i + 1 ];

					// if the previous item was a text item with trailing whitespace,
					// remove leading whitespace inside the fragment
					if ( !previousItem || ( typeof previousItem === 'string' && trailingWhitespace.test( previousItem ) ) ) {
						removeLeadingWhitespaceInsideFragment = true;
					}

					// and vice versa
					if ( !nextItem || ( typeof nextItem === 'string' && leadingWhitespace$1.test( nextItem ) ) ) {
						removeTrailingWhitespaceInsideFragment = true;
					}
				}

				cleanup( item.f, stripComments, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );

				// clean up name templates (events, decorators, etc)
				if ( isArray( item.f.n ) ) {
					cleanup( item.f.n, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespace );
				}

				// clean up arg templates (events, decorators, etc)
				if ( isArray( item.f.d ) ) {
					cleanup( item.f.d, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespace );
				}
			}

			// Split if-else blocks into two (an if, and an unless)
			if ( item.l ) {
				cleanup( item.l, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );

				item.l.forEach( function ( s ) { return s.l = 1; } );
				item.l.unshift( i + 1, 0 );
				items.splice.apply( items, item.l );
				delete item.l; // TODO would be nice if there was a way around this
			}

			// Clean up element attributes
			if ( item.a ) {
				for ( key in item.a ) {
					if ( item.a.hasOwnProperty( key ) && typeof item.a[ key ] !== 'string' ) {
						cleanup( item.a[ key ], stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
					}
				}
			}
			// Clean up conditional attributes
			if ( item.m ) {
				cleanup( item.m, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment );
				if ( item.m.length < 1 ) delete item.m;
			}
		}

		// final pass - fuse text nodes together
		i = items.length;
		while ( i-- ) {
			if ( typeof items[i] === 'string' ) {
				if ( typeof items[i+1] === 'string' ) {
					items[i] = items[i] + items[i+1];
					items.splice( i + 1, 1 );
				}

				if ( !preserveWhitespace ) {
					items[i] = items[i].replace( contiguousWhitespace, ' ' );
				}

				if ( items[i] === '' ) {
					items.splice( i, 1 );
				}
			}
		}
	}

	var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;

	function readClosingTag ( parser ) {
		var start, tag;

		start = parser.pos;

		// are we looking at a closing tag?
		if ( !parser.matchString( '</' ) ) {
			return null;
		}

		if ( tag = parser.matchPattern( closingTagPattern ) ) {
			if ( parser.inside && tag !== parser.inside ) {
				parser.pos = start;
				return null;
			}

			return {
				t: CLOSING_TAG,
				e: tag
			};
		}

		// We have an illegal closing tag, report it
		parser.pos -= 2;
		parser.error( 'Illegal closing tag' );
	}

	var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
	var validTagNameFollower = /^[\s\n\/>]/;
	var exclude = { exclude: true };
	var disallowedContents;
	// based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
	disallowedContents = {
		li: [ 'li' ],
		dt: [ 'dt', 'dd' ],
		dd: [ 'dt', 'dd' ],
		p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split( ' ' ),
		rt: [ 'rt', 'rp' ],
		rp: [ 'rt', 'rp' ],
		optgroup: [ 'optgroup' ],
		option: [ 'option', 'optgroup' ],
		thead: [ 'tbody', 'tfoot' ],
		tbody: [ 'tbody', 'tfoot' ],
		tfoot: [ 'tbody' ],
		tr: [ 'tr', 'tbody' ],
		td: [ 'td', 'th', 'tr' ],
		th: [ 'td', 'th', 'tr' ]
	};

	function readElement ( parser ) {
		var start,
			element,
			attribute,
			selfClosing,
			children,
			partials,
			hasPartials,
			child,
			closed,
			pos,
			remaining,
			closingTag;

		start = parser.pos;

		if ( parser.inside || parser.inAttribute || parser.textOnlyMode ) {
			return null;
		}

		if ( !parser.matchString( '<' ) ) {
			return null;
		}

		// if this is a closing tag, abort straight away
		if ( parser.nextChar() === '/' ) {
			return null;
		}

		element = {};
		if ( parser.includeLinePositions ) {
			element.p = parser.getLinePos( start );
		}

		if ( parser.matchString( '!' ) ) {
			element.t = DOCTYPE;
			if ( !parser.matchPattern( /^doctype/i ) ) {
				parser.error( 'Expected DOCTYPE declaration' );
			}

			element.a = parser.matchPattern( /^(.+?)>/ );
			return element;
		}

		element.t = ELEMENT;

		// element name
		element.e = parser.matchPattern( tagNamePattern );
		if ( !element.e ) {
			return null;
		}

		// next character must be whitespace, closing solidus or '>'
		if ( !validTagNameFollower.test( parser.nextChar() ) ) {
			parser.error( 'Illegal tag name' );
		}

		parser.allowWhitespace();

		parser.inTag = true;

		// directives and attributes
		while ( attribute = readMustache( parser ) ) {
			if ( attribute !== false ) {
				if ( !element.m ) element.m = [];
				element.m.push( attribute );
			}

			parser.allowWhitespace();
		}

		parser.inTag = false;

		// allow whitespace before closing solidus
		parser.allowWhitespace();

		// self-closing solidus?
		if ( parser.matchString( '/' ) ) {
			selfClosing = true;
		}

		// closing angle bracket
		if ( !parser.matchString( '>' ) ) {
			return null;
		}

		var lowerCaseName = element.e.toLowerCase();
		var preserveWhitespace = parser.preserveWhitespace;

		if ( !selfClosing && !voidElementNames.test( element.e ) ) {
			parser.elementStack.push( lowerCaseName );

			// Special case - if we open a script element, further tags should
			// be ignored unless they're a closing script element
			if ( lowerCaseName === 'script' || lowerCaseName === 'style' || lowerCaseName === 'textarea' ) {
				parser.inside = lowerCaseName;
			}

			children = [];
			partials = create( null );

			do {
				pos = parser.pos;
				remaining = parser.remaining();

				if ( !remaining ) {
					parser.error( ("Missing end " + (parser.elementStack.length > 1 ? 'tags' : 'tag') + " (" + (parser.elementStack.reverse().map( function ( x ) { return ("</" + x + ">"); } ).join( '' )) + ")") );
				}

				// if for example we're in an <li> element, and we see another
				// <li> tag, close the first so they become siblings
				if ( !canContain( lowerCaseName, remaining ) ) {
					closed = true;
				}

				// closing tag
				else if ( closingTag = readClosingTag( parser ) ) {
					closed = true;

					var closingTagName = closingTag.e.toLowerCase();

					// if this *isn't* the closing tag for the current element...
					if ( closingTagName !== lowerCaseName ) {
						// rewind parser
						parser.pos = pos;

						// if it doesn't close a parent tag, error
						if ( !~parser.elementStack.indexOf( closingTagName ) ) {
							var errorMessage = 'Unexpected closing tag';

							// add additional help for void elements, since component names
							// might clash with them
							if ( voidElementNames.test( closingTagName ) ) {
								errorMessage += " (<" + closingTagName + "> is a void element - it cannot contain children)";
							}

							parser.error( errorMessage );
						}
					}
				}

				// implicit close by closing section tag. TODO clean this up
				else if ( child = readClosing( parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] } ) ) {
					closed = true;
					parser.pos = pos;
				}

				else {
					if ( child = parser.read( PARTIAL_READERS ) ) {
						if ( partials[ child.n ] ) {
							parser.pos = pos;
							parser.error( 'Duplicate partial definition' );
						}

						cleanup( child.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

						partials[ child.n ] = child.f;
						hasPartials = true;
					}

					else {
						if ( child = parser.read( READERS ) ) {
							children.push( child );
						} else {
							closed = true;
						}
					}
				}
			} while ( !closed );

			if ( children.length ) {
				element.f = children;
			}

			if ( hasPartials ) {
				element.p = partials;
			}

			parser.elementStack.pop();
		}

		parser.inside = null;

		if ( parser.sanitizeElements && parser.sanitizeElements.indexOf( lowerCaseName ) !== -1 ) {
			return exclude;
		}

		return element;
	}

	function canContain ( name, remaining ) {
		var match, disallowed;

		match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec( remaining );
		disallowed = disallowedContents[ name ];

		if ( !match || !disallowed ) {
			return true;
		}

		return !~disallowed.indexOf( match[1].toLowerCase() );
	}

	function readText ( parser ) {
		var index, remaining, disallowed, barrier;

		remaining = parser.remaining();

		if ( parser.textOnlyMode ) {
			disallowed = parser.tags.map( function ( t ) { return t.open; } );
			disallowed = disallowed.concat( parser.tags.map( function ( t ) { return '\\' + t.open; } ) );

			index = getLowestIndex( remaining, disallowed );
		} else {
			barrier = parser.inside ? '</' + parser.inside : '<';

			if ( parser.inside && !parser.interpolate[ parser.inside ] ) {
				index = remaining.indexOf( barrier );
			} else {
				disallowed = parser.tags.map( function ( t ) { return t.open; } );
				disallowed = disallowed.concat( parser.tags.map( function ( t ) { return '\\' + t.open; } ) );

				// http://developers.whatwg.org/syntax.html#syntax-attributes
				if ( parser.inAttribute === true ) {
					// we're inside an unquoted attribute value
					disallowed.push( ("\""), ("'"), ("="), ("<"), (">"), '`' );
				} else if ( parser.inAttribute ) {
					// quoted attribute value
					disallowed.push( parser.inAttribute );
				} else {
					disallowed.push( barrier );
				}

				index = getLowestIndex( remaining, disallowed );
			}
		}

		if ( !index ) {
			return null;
		}

		if ( index === -1 ) {
			index = remaining.length;
		}

		parser.pos += index;

		if ( ( parser.inside && parser.inside !== 'textarea' ) || parser.textOnlyMode ) {
			return remaining.substr( 0, index );
		} else {
			return decodeCharacterReferences( remaining.substr( 0, index ) );
		}
	}

	var startPattern = /^<!--\s*/;
	var namePattern$1 = /s*>\s*([a-zA-Z_$][-a-zA-Z_$0-9]*)\s*/;
	var finishPattern = /\s*-->/;

	function readPartialDefinitionComment ( parser ) {
		var start = parser.pos;
		var open = parser.standardDelimiters[0];
		var close = parser.standardDelimiters[1];

		if ( !parser.matchPattern( startPattern ) || !parser.matchString( open ) ) {
			parser.pos = start;
			return null;
		}

		var name = parser.matchPattern( namePattern$1 );

		warnOnceIfDebug( ("Inline partial comments are deprecated.\nUse this...\n  {{#partial " + name + "}} ... {{/partial}}\n\n...instead of this:\n  <!-- {{>" + name + "}} --> ... <!-- {{/" + name + "}} -->'") );

		// make sure the rest of the comment is in the correct place
		if ( !parser.matchString( close ) || !parser.matchPattern( finishPattern ) ) {
			parser.pos = start;
			return null;
		}

		var content = [];
		var closed;

		var endPattern = new RegExp('^<!--\\s*' + escapeRegExp( open ) + '\\s*\\/\\s*' + name + '\\s*' + escapeRegExp( close ) + '\\s*-->');

		do {
			if ( parser.matchPattern( endPattern ) ) {
				closed = true;
			}

			else {
				var child = parser.read( READERS );
				if ( !child ) {
					parser.error( ("expected closing comment ('<!-- " + open + "/" + name + "" + close + " -->')") );
				}

				content.push( child );
			}
		} while ( !closed );

		return {
			t: INLINE_PARTIAL,
			f: content,
			n: name
		};
	}

	var partialDefinitionSectionPattern = /^\s*#\s*partial\s+/;

	function readPartialDefinitionSection ( parser ) {
		var start, name, content, child, closed;

		start = parser.pos;

		var delimiters = parser.standardDelimiters;

		if ( !parser.matchString( delimiters[0] ) ) {
			return null;
		}

		if ( !parser.matchPattern( partialDefinitionSectionPattern ) ) {
			parser.pos = start;
			return null;
		}

		name = parser.matchPattern( /^[a-zA-Z_$][a-zA-Z_$0-9\-\/]*/ );

		if ( !name ) {
			parser.error( 'expected legal partial name' );
		}

		parser.allowWhitespace();
		if ( !parser.matchString( delimiters[1] ) ) {
			parser.error( ("Expected closing delimiter '" + (delimiters[1]) + "'") );
		}

		content = [];

		do {
			// TODO clean this up
			if ( child = readClosing( parser, { open: parser.standardDelimiters[0], close: parser.standardDelimiters[1] }) ) {
				if ( !child.r === 'partial' ) {
					parser.error( ("Expected " + (delimiters[0]) + "/partial" + (delimiters[1])) );
				}

				closed = true;
			}

			else {
				child = parser.read( READERS );

				if ( !child ) {
					parser.error( ("Expected " + (delimiters[0]) + "/partial" + (delimiters[1])) );
				}

				content.push( child );
			}
		} while ( !closed );

		return {
			t: INLINE_PARTIAL,
			n: name,
			f: content
		};
	}

	function readTemplate ( parser ) {
		var fragment = [];
		var partials = create( null );
		var hasPartials = false;

		var preserveWhitespace = parser.preserveWhitespace;

		while ( parser.pos < parser.str.length ) {
			var pos = parser.pos, item, partial;

			if ( partial = parser.read( PARTIAL_READERS ) ) {
				if ( partials[ partial.n ] ) {
					parser.pos = pos;
					parser.error( 'Duplicated partial definition' );
				}

				cleanup( partial.f, parser.stripComments, preserveWhitespace, !preserveWhitespace, !preserveWhitespace );

				partials[ partial.n ] = partial.f;
				hasPartials = true;
			} else if ( item = parser.read( READERS ) ) {
				fragment.push( item );
			} else  {
				parser.error( 'Unexpected template content' );
			}
		}

		var result = {
			v: TEMPLATE_VERSION,
			t: fragment
		};

		if ( hasPartials ) {
			result.p = partials;
		}

		return result;
	}

	function insertExpressions ( obj, expr ) {

		Object.keys( obj ).forEach( function ( key ) {
			if  ( isExpression( key, obj ) ) return addTo( obj, expr );

			var ref = obj[ key ];
			if ( hasChildren( ref ) ) insertExpressions( ref, expr );
	 	});
	}

	function isExpression( key, obj ) {
		return key === 's' && isArray( obj.r );
	}

	function addTo( obj, expr ) {
		var s = obj.s, r = obj.r;
		if ( !expr[ s ] ) expr[ s ] = fromExpression( s, r.length );
	}

	function hasChildren( ref ) {
		return isArray( ref ) || isObject( ref );
	}

	// See https://github.com/ractivejs/template-spec for information
	// about the Ractive template specification

	var STANDARD_READERS = [ readPartial, readUnescaped, readSection, readYielder, readInterpolator, readComment ];
	var TRIPLE_READERS = [ readTriple ];
	var STATIC_READERS = [ readUnescaped, readSection, readInterpolator ]; // TODO does it make sense to have a static section?

	var StandardParser;

	function parse ( template, options ) {
		return new StandardParser( template, options || {} ).result;
	}

	parse.computedStrings = function( computed ) {
		if ( !computed ) return [];

		Object.keys( computed ).forEach( function ( key ) {
			var value = computed[ key ];
			if ( typeof value === 'string' ) {
				computed[ key ] = fromComputationString( value );
			}
		});
	};


	var READERS = [ readMustache, readHtmlComment, readElement, readText ];
	var PARTIAL_READERS = [ readPartialDefinitionComment, readPartialDefinitionSection ];

	StandardParser = Parser$1.extend({
		init: function ( str, options ) {
			var tripleDelimiters = options.tripleDelimiters || [ '{{{', '}}}' ],
				staticDelimiters = options.staticDelimiters || [ '[[', ']]' ],
				staticTripleDelimiters = options.staticTripleDelimiters || [ '[[[', ']]]' ];

			this.standardDelimiters = options.delimiters || [ '{{', '}}' ];

			this.tags = [
				{ isStatic: false, isTriple: false, open: this.standardDelimiters[0], close: this.standardDelimiters[1], readers: STANDARD_READERS },
				{ isStatic: false, isTriple: true,  open: tripleDelimiters[0],        close: tripleDelimiters[1],        readers: TRIPLE_READERS },
				{ isStatic: true,  isTriple: false, open: staticDelimiters[0],        close: staticDelimiters[1],        readers: STATIC_READERS },
				{ isStatic: true,  isTriple: true,  open: staticTripleDelimiters[0],  close: staticTripleDelimiters[1],  readers: TRIPLE_READERS }
			];

			this.contextLines = options.contextLines || 0;

			this.sortMustacheTags();

			this.sectionDepth = 0;
			this.elementStack = [];

			this.interpolate = {
				script: !options.interpolate || options.interpolate.script !== false,
				style: !options.interpolate || options.interpolate.style !== false,
				textarea: true
			};

			if ( options.sanitize === true ) {
				options.sanitize = {
					// blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
					elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split( ' ' ),
					eventAttributes: true
				};
			}

			this.stripComments = options.stripComments !== false;
			this.preserveWhitespace = options.preserveWhitespace;
			this.sanitizeElements = options.sanitize && options.sanitize.elements;
			this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
			this.includeLinePositions = options.includeLinePositions;
			this.textOnlyMode = options.textOnlyMode;
			this.csp = options.csp;
		},

		postProcess: function ( result ) {
			// special case - empty string
			if ( !result.length ) {
				return { t: [], v: TEMPLATE_VERSION };
			}

			if ( this.sectionDepth > 0 ) {
				this.error( 'A section was left open' );
			}

			cleanup( result[0].t, this.stripComments, this.preserveWhitespace, !this.preserveWhitespace, !this.preserveWhitespace );

			if ( this.csp !== false ) {
				var expr = {};
				insertExpressions( result[0].t, expr );
				if ( Object.keys( expr ).length ) result[0].e = expr;
			}

			return result[0];
		},

		converters: [
			readTemplate
		],

		sortMustacheTags: function () {
			// Sort in order of descending opening delimiter length (longer first),
			// to protect against opening delimiters being substrings of each other
			this.tags.sort( function ( a, b ) {
				return b.open.length - a.open.length;
			});
		}
	});

	var parseOptions = [
		'delimiters',
		'tripleDelimiters',
		'staticDelimiters',
		'staticTripleDelimiters',
		'csp',
		'interpolate',
		'preserveWhitespace',
		'sanitize',
		'stripComments',
		'contextLines'
	];

	var TEMPLATE_INSTRUCTIONS = "Either preparse or use a ractive runtime source that includes the parser. ";

	var COMPUTATION_INSTRUCTIONS = "Either use:\n\n\tRactive.parse.computedStrings( component.computed )\n\nat build time to pre-convert the strings to functions, or use functions instead of strings in computed properties.";


	function throwNoParse ( method, error, instructions ) {
		if ( !method ) {
			fatal( ("Missing Ractive.parse - cannot parse " + error + ". " + instructions) );
		}
	}

	function createFunction ( body, length ) {
		throwNoParse( fromExpression, 'new expression function', TEMPLATE_INSTRUCTIONS );
		return fromExpression( body, length );
	}

	function createFunctionFromString ( str, bindTo ) {
		throwNoParse( fromComputationString, 'compution string "${str}"', COMPUTATION_INSTRUCTIONS );
		return fromComputationString( str, bindTo );
	}

	var parser = {

		fromId: function ( id, options ) {
			if ( !doc ) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Cannot retrieve template #" + id + " as Ractive is not running in a browser.") );
			}

			if ( id ) id = id.replace( /^#/, '' );

			var template;

			if ( !( template = doc.getElementById( id ) )) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Could not find template element with id #" + id) );
			}

			if ( template.tagName.toUpperCase() !== 'SCRIPT' ) {
				if ( options && options.noThrow ) { return; }
				throw new Error( ("Template element with id #" + id + ", must be a <script> element") );
			}

			return ( 'textContent' in template ? template.textContent : template.innerHTML );

		},

		isParsed: function ( template) {
			return !( typeof template === 'string' );
		},

		getParseOptions: function ( ractive ) {
			// Could be Ractive or a Component
			if ( ractive.defaults ) { ractive = ractive.defaults; }

			return parseOptions.reduce( function ( val, key ) {
				val[ key ] = ractive[ key ];
				return val;
			}, {});
		},

		parse: function ( template, options ) {
			throwNoParse( parse, 'template', TEMPLATE_INSTRUCTIONS );
			var parsed = parse( template, options );
			addFunctions( parsed );
			return parsed;
		},

		parseFor: function( template, ractive ) {
			return this.parse( template, this.getParseOptions( ractive ) );
		}
	};

	var templateConfigurator = {
		name: 'template',

		extend: function ( Parent, proto, options ) {
			// only assign if exists
			if ( 'template' in options ) {
				var template = options.template;

				if ( typeof template === 'function' ) {
					proto.template = template;
				} else {
					proto.template = parseTemplate( template, proto );
				}
			}
		},

		init: function ( Parent, ractive, options ) {
			// TODO because of prototypal inheritance, we might just be able to use
			// ractive.template, and not bother passing through the Parent object.
			// At present that breaks the test mocks' expectations
			var template = 'template' in options ? options.template : Parent.prototype.template;
			template = template || { v: TEMPLATE_VERSION, t: [] };

			if ( typeof template === 'function' ) {
				var fn = template;
				template = getDynamicTemplate( ractive, fn );

				ractive._config.template = {
					fn: fn,
					result: template
				};
			}

			template = parseTemplate( template, ractive );

			// TODO the naming of this is confusing - ractive.template refers to [...],
			// but Component.prototype.template refers to {v:1,t:[],p:[]}...
			// it's unnecessary, because the developer never needs to access
			// ractive.template
			ractive.template = template.t;

			if ( template.p ) {
				extendPartials( ractive.partials, template.p );
			}
		},

		reset: function ( ractive ) {
			var result = resetValue( ractive );

			if ( result ) {
				var parsed = parseTemplate( result, ractive );

				ractive.template = parsed.t;
				extendPartials( ractive.partials, parsed.p, true );

				return true;
			}
		}
	};

	function resetValue ( ractive ) {
		var initial = ractive._config.template;

		// If this isn't a dynamic template, there's nothing to do
		if ( !initial || !initial.fn ) {
			return;
		}

		var result = getDynamicTemplate( ractive, initial.fn );

		// TODO deep equality check to prevent unnecessary re-rendering
		// in the case of already-parsed templates
		if ( result !== initial.result ) {
			initial.result = result;
			return result;
		}
	}

	function getDynamicTemplate ( ractive, fn ) {
		return fn.call( ractive, {
			fromId: parser.fromId,
			isParsed: parser.isParsed,
			parse: function ( template, options ) {
				if ( options === void 0 ) options = parser.getParseOptions( ractive );

				return parser.parse( template, options );
			}
		});
	}

	function parseTemplate ( template, ractive ) {
		if ( typeof template === 'string' ) {
			// parse will validate and add expression functions
			template = parseAsString( template, ractive );
		}
		else {
			// need to validate and add exp for already parsed template
			validate$1( template );
			addFunctions( template );
		}

		return template;
	}

	function parseAsString ( template, ractive ) {
		// ID of an element containing the template?
		if ( template[0] === '#' ) {
			template = parser.fromId( template );
		}

		return parser.parseFor( template, ractive );
	}

	function validate$1( template ) {

		// Check that the template even exists
		if ( template == undefined ) {
			throw new Error( ("The template cannot be " + template + ".") );
		}

		// Check the parsed template has a version at all
		else if ( typeof template.v !== 'number' ) {
			throw new Error( 'The template parser was passed a non-string template, but the template doesn\'t have a version.  Make sure you\'re passing in the template you think you are.' );
		}

		// Check we're using the correct version
		else if ( template.v !== TEMPLATE_VERSION ) {
			throw new Error( ("Mismatched template version (expected " + TEMPLATE_VERSION + ", got " + (template.v) + ") Please ensure you are using the latest version of Ractive.js in your build process as well as in your app") );
		}
	}

	function extendPartials ( existingPartials, newPartials, overwrite ) {
		if ( !newPartials ) return;

		// TODO there's an ambiguity here - we need to overwrite in the `reset()`
		// case, but not initially...

		for ( var key in newPartials ) {
			if ( overwrite || !existingPartials.hasOwnProperty( key ) ) {
				existingPartials[ key ] = newPartials[ key ];
			}
		}
	}

	var registryNames = [
		'adaptors',
		'components',
		'computed',
		'decorators',
		'easing',
		'events',
		'interpolators',
		'partials',
		'transitions'
	];

	var Registry = function Registry ( name, useDefaults ) {
		this.name = name;
		this.useDefaults = useDefaults;
	};

	Registry.prototype.extend = function extend ( Parent, proto, options ) {
		this.configure(
			this.useDefaults ? Parent.defaults : Parent,
			this.useDefaults ? proto : proto.constructor,
			options );
	};

	Registry.prototype.init = function init () {
		// noop
	};

	Registry.prototype.configure = function configure ( Parent, target, options ) {
		var name = this.name;
		var option = options[ name ];

		var registry = create( Parent[name] );

		for ( var key in option ) {
			registry[ key ] = option[ key ];
		}

		target[ name ] = registry;
	};

	Registry.prototype.reset = function reset ( ractive ) {
		var registry = ractive[ this.name ];
		var changed = false;

		Object.keys( registry ).forEach( function ( key ) {
			var item = registry[ key ];
				
			if ( item._fn ) {
				if ( item._fn.isOwner ) {
					registry[key] = item._fn;
				} else {
					delete registry[key];
				}
				changed = true;
			}
		});

		return changed;
	};

	var registries = registryNames.map( function ( name ) { return new Registry( name, name === 'computed' ); } );

	function wrap ( parent, name, method ) {
		if ( !/_super/.test( method ) ) return method;

		function wrapper () {
			var superMethod = getSuperMethod( wrapper._parent, name );
			var hasSuper = '_super' in this;
			var oldSuper = this._super;

			this._super = superMethod;

			var result = method.apply( this, arguments );

			if ( hasSuper ) {
				this._super = oldSuper;
			} else {
				delete this._super;
			}

			return result;
		}

		wrapper._parent = parent;
		wrapper._method = method;

		return wrapper;
	}

	function getSuperMethod ( parent, name ) {
		if ( name in parent ) {
			var value = parent[ name ];

			return typeof value === 'function' ?
				value :
				function () { return value; };
		}

		return noop;
	}

	function getMessage( deprecated, correct, isError ) {
		return "options." + deprecated + " has been deprecated in favour of options." + correct + "."
			+ ( isError ? (" You cannot specify both options, please use options." + correct + ".") : '' );
	}

	function deprecateOption ( options, deprecatedOption, correct ) {
		if ( deprecatedOption in options ) {
			if( !( correct in options ) ) {
				warnIfDebug( getMessage( deprecatedOption, correct ) );
				options[ correct ] = options[ deprecatedOption ];
			} else {
				throw new Error( getMessage( deprecatedOption, correct, true ) );
			}
		}
	}

	function deprecate ( options ) {
		deprecateOption( options, 'beforeInit', 'onconstruct' );
		deprecateOption( options, 'init', 'onrender' );
		deprecateOption( options, 'complete', 'oncomplete' );
		deprecateOption( options, 'eventDefinitions', 'events' );

		// Using extend with Component instead of options,
		// like Human.extend( Spider ) means adaptors as a registry
		// gets copied to options. So we have to check if actually an array
		if ( isArray( options.adaptors ) ) {
			deprecateOption( options, 'adaptors', 'adapt' );
		}
	}

	var custom = {
		adapt: adaptConfigurator,
		css: cssConfigurator,
		data: dataConfigurator,
		template: templateConfigurator
	};

	var defaultKeys = Object.keys( defaults );

	var isStandardKey = makeObj( defaultKeys.filter( function ( key ) { return !custom[ key ]; } ) );

	// blacklisted keys that we don't double extend
	var isBlacklisted = makeObj( defaultKeys.concat( registries.map( function ( r ) { return r.name; } ) ) );

	var order = [].concat(
		defaultKeys.filter( function ( key ) { return !registries[ key ] && !custom[ key ]; } ),
		registries,
		//custom.data,
		custom.template,
		custom.css
	);

	var config = {
		extend: function ( Parent, proto, options ) { return configure( 'extend', Parent, proto, options ); },

		init: function ( Parent, ractive, options ) { return configure( 'init', Parent, ractive, options ); },

		reset: function ( ractive ) {
			return order.filter( function ( c ) {
				return c.reset && c.reset( ractive );
			}).map( function ( c ) { return c.name; } );
		},

		// this defines the order. TODO this isn't used anywhere in the codebase,
		// only in the test suite - should get rid of it
		order: order
	};

	function configure ( method, Parent, target, options ) {
		deprecate( options );

		for ( var key in options ) {
			if ( isStandardKey.hasOwnProperty( key ) ) {
				var value = options[ key ];

				// warn the developer if they passed a function and ignore its value

				// NOTE: we allow some functions on "el" because we duck type element lists
				// and some libraries or ef'ed-up virtual browsers (phantomJS) return a
				// function object as the result of querySelector methods
				if ( key !== 'el' && typeof value === 'function' ) {
					warnIfDebug( ("" + key + " is a Ractive option that does not expect a function and will be ignored"),
						method === 'init' ? target : null );
				}
				else {
					target[ key ] = value;
				}
			}
		}

		// disallow combination of `append` and `enhance`
		if ( options.append && options.enhance ) {
			throw new Error( 'Cannot use append and enhance at the same time' );
		}

		registries.forEach( function ( registry ) {
			registry[ method ]( Parent, target, options );
		});

		adaptConfigurator[ method ]( Parent, target, options );
		templateConfigurator[ method ]( Parent, target, options );
		cssConfigurator[ method ]( Parent, target, options );

		extendOtherMethods( Parent.prototype, target, options );
	}

	function extendOtherMethods ( parent, target, options ) {
		for ( var key in options ) {
			if ( !isBlacklisted[ key ] && options.hasOwnProperty( key ) ) {
				var member = options[ key ];

				// if this is a method that overwrites a method, wrap it:
				if ( typeof member === 'function' ) {
					member = wrap( parent, key, member );
				}

				target[ key ] = member;
			}
		}
	}

	function makeObj ( array ) {
		var obj = {};
		array.forEach( function ( x ) { return obj[x] = true; } );
		return obj;
	}

	var shouldRerender = [ 'template', 'partials', 'components', 'decorators', 'events' ];

	var completeHook$1 = new Hook( 'complete' );
	var resetHook = new Hook( 'reset' );
	var renderHook$1 = new Hook( 'render' );
	var unrenderHook = new Hook( 'unrender' );

	function Ractive$reset ( data ) {
		data = data || {};

		if ( typeof data !== 'object' ) {
			throw new Error( 'The reset method takes either no arguments, or an object containing new data' );
		}

		// TEMP need to tidy this up
		data = dataConfigurator.init( this.constructor, this, { data: data });

		var promise = runloop.start( this, true );

		// If the root object is wrapped, try and use the wrapper's reset value
		var wrapper = this.viewmodel.wrapper;
		if ( wrapper && wrapper.reset ) {
			if ( wrapper.reset( data ) === false ) {
				// reset was rejected, we need to replace the object
				this.viewmodel.set( data );
			}
		} else {
			this.viewmodel.set( data );
		}

		// reset config items and track if need to rerender
		var changes = config.reset( this );
		var rerender;

		var i = changes.length;
		while ( i-- ) {
			if ( shouldRerender.indexOf( changes[i] ) > -1 ) {
				rerender = true;
				break;
			}
		}

		if ( rerender ) {
			unrenderHook.fire( this );
			this.fragment.resetTemplate( this.template );
			renderHook$1.fire( this );
			completeHook$1.fire( this );
		}

		runloop.end();

		resetHook.fire( this, data );

		return promise;
	}

	function collect( source, name, attr, dest ) {
		source.forEach( function ( item ) {
			// queue to rerender if the item is a partial and the current name matches
			if ( item.type === PARTIAL && ( item.refName ===  name || item.name === name ) ) {
				item.inAttribute = attr;
				dest.push( item );
				return; // go no further
			}

			// if it has a fragment, process its items
			if ( item.fragment ) {
				collect( item.fragment.iterations || item.fragment.items, name, attr, dest );
			}

			// or if it is itself a fragment, process its items
			else if ( isArray( item.items ) ) {
				collect( item.items, name, attr, dest );
			}

			// or if it is a component, step in and process its items
			else if ( item.type === COMPONENT && item.instance ) {
				// ...unless the partial is shadowed
				if ( item.instance.partials[ name ] ) return;
				collect( item.instance.fragment.items, name, attr, dest );
			}

			// if the item is an element, process its attributes too
			if ( item.type === ELEMENT ) {
				if ( isArray( item.attributes ) ) {
					collect( item.attributes, name, true, dest );
				}
			}
		});
	}

	function forceResetTemplate ( partial ) {
		partial.forceResetTemplate();
	}

	function resetPartial ( name, partial ) {
		var collection = [];
		collect( this.fragment.items, name, false, collection );

		var promise = runloop.start( this, true );

		this.partials[ name ] = partial;
		collection.forEach( forceResetTemplate );

		runloop.end();

		return promise;
	}

	var Item = function Item ( options ) {
		this.parentFragment = options.parentFragment;
		this.ractive = options.parentFragment.ractive;

		this.template = options.template;
		this.index = options.index;
		this.type = options.template.t;

		this.dirty = false;
	};

	Item.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.parentFragment.bubble();
		}
	};

	Item.prototype.destroyed = function destroyed () {
		if ( this.fragment ) this.fragment.destroyed();
	};

	Item.prototype.find = function find () {
		return null;
	};

	Item.prototype.findAll = function findAll () {
		// noop
	};

	Item.prototype.findComponent = function findComponent () {
		return null;
	};

	Item.prototype.findAllComponents = function findAllComponents () {
		// noop;
	};

	Item.prototype.findNextNode = function findNextNode () {
		return this.parentFragment.findNextNode( this );
	};

	Item.prototype.shuffled = function shuffled () {
		if ( this.fragment ) this.fragment.shuffled();
	};

	Item.prototype.valueOf = function valueOf () {
		return this.toString();
	};

	var ComputationChild = (function (Model) {
		function ComputationChild () {
			Model.apply(this, arguments);
		}

		ComputationChild.prototype = Object.create( Model && Model.prototype );
		ComputationChild.prototype.constructor = ComputationChild;

		ComputationChild.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			var parentValue = this.parent.get();
			return parentValue ? parentValue[ this.key ] : undefined;
		};

		ComputationChild.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );
			this.clearUnresolveds(); // TODO is this necessary?
		};

		ComputationChild.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		return ComputationChild;
	}(Model));

	function createResolver ( proxy, ref, index ) {
		var resolver = proxy.fragment.resolve( ref, function ( model ) {
			removeFromArray( proxy.resolvers, resolver );
			proxy.models[ index ] = model;
			proxy.bubble();
		});

		proxy.resolvers.push( resolver );
	}

	var ExpressionProxy = (function (Model) {
		function ExpressionProxy ( fragment, template ) {
			var this$1 = this;

			Model.call( this, fragment.ractive.viewmodel, null );

			this.fragment = fragment;
			this.template = template;

			this.isReadonly = true;
			this.dirty = true;

			this.fn = getFunction( template.s, template.r.length );

			this.resolvers = [];
			this.models = this.template.r.map( function ( ref, index ) {
				var model = resolveReference( this$1.fragment, ref );

				if ( !model ) {
					createResolver( this$1, ref, index );
				}

				return model;
			});
			this.dependencies = [];

			this.shuffle = undefined;

			this.bubble();
		}

		ExpressionProxy.prototype = Object.create( Model && Model.prototype );
		ExpressionProxy.prototype.constructor = ExpressionProxy;

		ExpressionProxy.prototype.bubble = function bubble ( actuallyChanged ) {
			// refresh the keypath
			if ( actuallyChanged === void 0 ) actuallyChanged = true;

			if ( this.registered ) delete this.root.expressions[ this.keypath ];
			this.keypath = undefined;

			if ( actuallyChanged ) {
				this.dirty = true;
				this.handleChange();
			}
		};

		ExpressionProxy.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			if ( this.dirty ) {
				this.dirty = false;
				this.value = this.getValue();
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			}

			return shouldCapture && this.wrapper ? this.wrapperValue : this.value;
		};

		ExpressionProxy.prototype.getKeypath = function getKeypath () {
			var this$1 = this;

			if ( !this.template ) return '@undefined';
			if ( !this.keypath ) {
				this.keypath = '@' + this.template.s.replace( /_(\d+)/g, function ( match, i ) {
					if ( i >= this$1.models.length ) return match;

					var model = this$1.models[i];
					return model ? model.getKeypath() : '@undefined';
				});

				this.root.expressions[ this.keypath ] = this;
				this.registered = true;
			}

			return this.keypath;
		};

		ExpressionProxy.prototype.getValue = function getValue () {
			var this$1 = this;

			startCapturing();
			var result;

			try {
				var params = this.models.map( function ( m ) { return m ? m.get( true ) : undefined; } );
				result = this.fn.apply( this.fragment.ractive, params );
			} catch ( err ) {
				warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );
			}

			var dependencies = stopCapturing();
			// remove missing deps
			this.dependencies.filter( function ( d ) { return !~dependencies.indexOf( d ); } ).forEach( function ( d ) {
				d.unregister( this$1 );
				removeFromArray( this$1.dependencies, d );
			});
			// register new deps
			dependencies.filter( function ( d ) { return !~this$1.dependencies.indexOf( d ); } ).forEach( function ( d ) {
				d.register( this$1 );
				this$1.dependencies.push( d );
			});

			return result;
		};

		ExpressionProxy.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );

			this.clearUnresolveds();
		};

		ExpressionProxy.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ExpressionProxy.prototype.mark = function mark () {
			this.handleChange();
		};

		ExpressionProxy.prototype.rebinding = function rebinding ( next, previous, safe ) {
			var idx = this.models.indexOf( previous );

			if ( ~idx ) {
				next = rebindMatch( this.template.r[idx], next, previous );
				if ( next !== previous ) {
					previous.unregister( this );
					this.models.splice( idx, 1, next );
					// TODO: set up a resolver if there is no next?
					if ( next ) next.addShuffleRegister( this, 'mark' );
				}
			}
			this.bubble( !safe );
		};

		ExpressionProxy.prototype.retrieve = function retrieve () {
			return this.get();
		};

		ExpressionProxy.prototype.teardown = function teardown () {
			var this$1 = this;

			this.unbind();
			this.fragment = undefined;
			if ( this.dependencies ) this.dependencies.forEach( function ( d ) { return d.unregister( this$1 ); } );
			Model.prototype.teardown.call(this);
		};

		ExpressionProxy.prototype.unreference = function unreference () {
			Model.prototype.unreference.call(this);
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ExpressionProxy.prototype.unregister = function unregister( dep ) {
			Model.prototype.unregister.call( this, dep );
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ExpressionProxy.prototype.unbind = function unbind$1 () {
			this.resolvers.forEach( unbind );
		};

		return ExpressionProxy;
	}(Model));

	var ReferenceExpressionChild = (function (Model) {
		function ReferenceExpressionChild ( parent, key ) {
			Model.call ( this, parent, key );
		}

		ReferenceExpressionChild.prototype = Object.create( Model && Model.prototype );
		ReferenceExpressionChild.prototype.constructor = ReferenceExpressionChild;

		ReferenceExpressionChild.prototype.applyValue = function applyValue ( value ) {
			if ( isEqual( value, this.value ) ) return;

			var parent = this.parent, keys = [ this.key ];
			while ( parent ) {
				if ( parent.base ) {
					var target = parent.model.joinAll( keys );
					target.applyValue( value );
					break;
				}

				keys.unshift( parent.key );

				parent = parent.parent;
			}
		};

		ReferenceExpressionChild.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ReferenceExpressionChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ReferenceExpressionChild.prototype.retrieve = function retrieve () {
			var parent = this.parent.get();
			return parent && parent[ this.key ];
		};

		return ReferenceExpressionChild;
	}(Model));

	var ReferenceExpressionProxy = (function (Model) {
		function ReferenceExpressionProxy ( fragment, template ) {
			var this$1 = this;

			Model.call( this, null, null );
			this.dirty = true;
			this.root = fragment.ractive.viewmodel;
			this.template = template;

			this.resolvers = [];

			this.base = resolve$2( fragment, template );
			var baseResolver;

			if ( !this.base ) {
				baseResolver = fragment.resolve( template.r, function ( model ) {
					this$1.base = model;
					this$1.bubble();

					removeFromArray( this$1.resolvers, baseResolver );
				});

				this.resolvers.push( baseResolver );
			}

			var intermediary = this.intermediary = {
				handleChange: function () { return this$1.handleChange(); },
				rebinding: function ( next, previous ) {
					if ( previous === this$1.base ) {
						next = rebindMatch( template, next, previous );
						if ( next !== this$1.base ) {
							this$1.base.unregister( intermediary );
							this$1.base = next;
							// TODO: if there is no next, set up a resolver?
						}
					} else {
						var idx = this$1.members.indexOf( previous );
						if ( ~idx ) {
							// only direct references will rebind... expressions handle themselves
							next = rebindMatch( template.m[idx].n, next, previous );
							if ( next !== this$1.members[idx] ) {
								this$1.members.splice( idx, 1, next );
								// TODO: if there is no next, set up a resolver?
							}
						}
					}

					if ( next !== previous ) previous.unregister( intermediary );
					if ( next ) next.addShuffleTask( function () { return next.register( intermediary ); } );

					this$1.bubble();
				}
			};

			this.members = template.m.map( function ( template, i ) {
				if ( typeof template === 'string' ) {
					return { get: function () { return template; } };
				}

				var model;
				var resolver;

				if ( template.t === REFERENCE ) {
					model = resolveReference( fragment, template.n );

					if ( model ) {
						model.register( intermediary );
					} else {
						resolver = fragment.resolve( template.n, function ( model ) {
							this$1.members[i] = model;

							model.register( intermediary );
							this$1.handleChange();

							removeFromArray( this$1.resolvers, resolver );
						});

						this$1.resolvers.push( resolver );
					}

					return model;
				}

				model = new ExpressionProxy( fragment, template );
				model.register( intermediary );
				return model;
			});

			this.isUnresolved = true;
			this.bubble();
		}

		ReferenceExpressionProxy.prototype = Object.create( Model && Model.prototype );
		ReferenceExpressionProxy.prototype.constructor = ReferenceExpressionProxy;

		ReferenceExpressionProxy.prototype.bubble = function bubble () {
			if ( !this.base ) return;
			if ( !this.dirty ) this.handleChange();
		};

		ReferenceExpressionProxy.prototype.forceResolution = function forceResolution () {
			this.resolvers.forEach( function ( resolver ) { return resolver.forceResolution(); } );
			this.dirty = true;
			this.bubble();
		};

		ReferenceExpressionProxy.prototype.get = function get ( shouldCapture ) {
			var this$1 = this;

			if ( this.dirty ) {
				this.bubble();

				var i = this.members.length, resolved = true;
				while ( resolved && i-- ) {
					if ( !this$1.members[i] ) resolved = false;
				}

				if ( this.base && resolved ) {
					var keys = this.members.map( function ( m ) { return escapeKey( String( m.get() ) ); } );
					var model = this.base.joinAll( keys );

					if ( model !== this.model ) {
						if ( this.model ) {
							this.model.unregister( this );
							this.model.unregisterTwowayBinding( this );
						}

						this.model = model;
						this.parent = model.parent;
						this.model.register( this );
						this.model.registerTwowayBinding( this );

						if ( this.keypathModel ) this.keypathModel.handleChange();
					}
				}

				this.value = this.model ? this.model.get( shouldCapture ) : undefined;
				this.dirty = false;
				this.mark();
				return this.value;
			} else {
				return this.model ? this.model.get( shouldCapture ) : undefined;
			}
		};

		// indirect two-way bindings
		ReferenceExpressionProxy.prototype.getValue = function getValue () {
			var this$1 = this;

			this.value = this.model ? this.model.get() : undefined;

			var i = this.bindings.length;
			while ( i-- ) {
				var value = this$1.bindings[i].getValue();
				if ( value !== this$1.value ) return value;
			}

			// check one-way bindings
			var oneway = findBoundValue( this.deps );
			if ( oneway ) return oneway.value;

			return this.value;
		};

		ReferenceExpressionProxy.prototype.getKeypath = function getKeypath () {
			return this.model ? this.model.getKeypath() : '@undefined';
		};

		ReferenceExpressionProxy.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;
			this.mark();
		};

		ReferenceExpressionProxy.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ReferenceExpressionChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		ReferenceExpressionProxy.prototype.mark = function mark$1 () {
			if ( this.dirty ) {
				this.deps.forEach( handleChange );
			}

			this.links.forEach( marked );
			this.children.forEach( mark );
			this.clearUnresolveds();
		};

		ReferenceExpressionProxy.prototype.retrieve = function retrieve () {
			return this.value;
		};

		ReferenceExpressionProxy.prototype.rebinding = function rebinding () { }; // NOOP

		ReferenceExpressionProxy.prototype.set = function set ( value ) {
			if ( !this.model ) throw new Error( 'Unresolved reference expression. This should not happen!' );
			this.model.set( value );
		};

		ReferenceExpressionProxy.prototype.teardown = function teardown () {
			var this$1 = this;

			this.resolvers.forEach( unbind );

			if ( this.model ) {
				this.model.unregister( this );
				this.model.unregisterTwowayBinding( this );
			}
			if ( this.members ) {
				this.members.forEach( function ( m ) { return m && m.unregister && m.unregister( this$1 ); } );
			}
		};

		ReferenceExpressionProxy.prototype.unreference = function unreference () {
			Model.prototype.unreference.call(this);
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		ReferenceExpressionProxy.prototype.unregister = function unregister( dep ) {
			Model.prototype.unregister.call( this, dep );
			if ( !this.deps.length && !this.refs ) this.teardown();
		};

		return ReferenceExpressionProxy;
	}(Model));

	function resolve$2 ( fragment, template ) {
		if ( template.r ) {
			return resolveReference( fragment, template.r );
		}

		else if ( template.x ) {
			return new ExpressionProxy( fragment, template.x );
		}

		else if ( template.rx ) {
			return new ReferenceExpressionProxy( fragment, template.rx );
		}
	}

	function resolveAliases( section ) {
		if ( section.template.z ) {
			section.aliases = {};

			var refs = section.template.z;
			for ( var i = 0; i < refs.length; i++ ) {
				section.aliases[ refs[i].n ] = resolve$2( section.parentFragment, refs[i].x );
			}
		}

		for ( var k in section.aliases ) {
			section.aliases[k].reference();
		}
	}

	var Alias = (function (Item) {
		function Alias ( options ) {
			Item.call( this, options );

			this.fragment = null;
		}

		Alias.prototype = Object.create( Item && Item.prototype );
		Alias.prototype.constructor = Alias;

		Alias.prototype.bind = function bind () {
			resolveAliases( this );

			this.fragment = new Fragment({
				owner: this,
				template: this.template.f
			}).bind();
		};

		Alias.prototype.detach = function detach () {
			return this.fragment ? this.fragment.detach() : createDocumentFragment();
		};

		Alias.prototype.find = function find ( selector ) {
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Alias.prototype.findAll = function findAll ( selector, query ) {
			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Alias.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Alias.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Alias.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment && this.fragment.firstNode( skipParent );
		};

		Alias.prototype.rebinding = function rebinding () {
			var this$1 = this;

			if ( this.locked ) return;
			this.locked = true;
			runloop.scheduleTask( function () {
				this$1.locked = false;
				resolveAliases( this$1 );
			});
		};

		Alias.prototype.render = function render ( target ) {
			this.rendered = true;
			if ( this.fragment ) this.fragment.render( target );
		};

		Alias.prototype.toString = function toString ( escape ) {
			return this.fragment ? this.fragment.toString( escape ) : '';
		};

		Alias.prototype.unbind = function unbind () {
			this.aliases = {};

			for ( var k in this.fragment.aliases ) {
				this.aliases[k].unreference();
			}

			if ( this.fragment ) this.fragment.unbind();
		};

		Alias.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && this.fragment ) this.fragment.unrender( shouldDestroy );
			this.rendered = false;
		};

		Alias.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				this.fragment.update();
			}
		};

		return Alias;
	}(Item));

	function findElement( start, orComponent, name ) {
		if ( orComponent === void 0 ) orComponent = true;

		while ( start && ( start.type !== ELEMENT || ( name && start.name !== name ) ) && ( !orComponent || start.type !== COMPONENT ) ) {
			// start is a fragment - look at the owner
			if ( start.owner ) start = start.owner;
			// start is a component or yielder - look at the container
			else if ( start.component ) start = start.containerFragment || start.component.parentFragment;
			// start is an item - look at the parent
			else if ( start.parent ) start = start.parent;
			// start is an item without a parent - look at the parent fragment
			else if ( start.parentFragment ) start = start.parentFragment;

			else start = undefined;
		}

		return start;
	}

	var space = /\s+/;
	var remove$1 = /\/\*(?:[\s\S]*?)\*\//g;
	var escape$1 = /url\(\s*(['"])(?:\\[\s\S]|(?!\1).)*\1\s*\)|url\((?:\\[\s\S]|[^)])*\)|(['"])(?:\\[\s\S]|(?!\1).)*\2/gi;
	var value$1 = /\0(\d+)/g;

	function readStyle ( css ) {
		var values = [];

		if ( typeof css !== 'string' ) return {};

		return css.replace( escape$1, function ( match ) { return ("\u0000" + (values.push( match ) - 1)); })
			.replace( remove$1, '' )
			.split( ';' )
			.filter( function ( rule ) { return !!rule.trim(); } )
			.map( function ( rule ) { return rule.replace( value$1, function ( match, n ) { return values[ n ]; } ); } )
			.reduce(function ( rules, rule ) {
				var i = rule.indexOf(':');
				var name = rule.substr( 0, i ).trim();
				rules[ name ] = rule.substr( i + 1 ).trim();
				return rules;
			}, {});
	}

	function readClass ( str ) {
		var list = str.split( space );

		// remove any empty entries
		var i = list.length;
		while ( i-- ) {
			if ( !list[i] ) list.splice( i, 1 );
		}

		return list;
	}

	var textTypes = [ undefined, 'text', 'search', 'url', 'email', 'hidden', 'password', 'search', 'reset', 'submit' ];

	function getUpdateDelegate ( attribute ) {
		var element = attribute.element, name = attribute.name;

		if ( name === 'id' ) return updateId;

		if ( name === 'value' ) {
			if ( attribute.interpolator ) attribute.interpolator.bound = true;

			// special case - selects
			if ( element.name === 'select' && name === 'value' ) {
				return element.getAttribute( 'multiple' ) ? updateMultipleSelectValue : updateSelectValue;
			}

			if ( element.name === 'textarea' ) return updateStringValue;

			// special case - contenteditable
			if ( element.getAttribute( 'contenteditable' ) != null ) return updateContentEditableValue;

			// special case - <input>
			if ( element.name === 'input' ) {
				var type = element.getAttribute( 'type' );

				// type='file' value='{{fileList}}'>
				if ( type === 'file' ) return noop; // read-only

				// type='radio' name='{{twoway}}'
				if ( type === 'radio' && element.binding && element.binding.attribute.name === 'name' ) return updateRadioValue;

				if ( ~textTypes.indexOf( type ) ) return updateStringValue;
			}

			return updateValue;
		}

		var node = element.node;

		// special case - <input type='radio' name='{{twoway}}' value='foo'>
		if ( attribute.isTwoway && name === 'name' ) {
			if ( node.type === 'radio' ) return updateRadioName;
			if ( node.type === 'checkbox' ) return updateCheckboxName;
		}

		if ( name === 'style' ) return updateStyleAttribute;

		if ( name.indexOf( 'style-' ) === 0 ) return updateInlineStyle;

		// special case - class names. IE fucks things up, again
		if ( name === 'class' && ( !node.namespaceURI || node.namespaceURI === html ) ) return updateClassName;

		if ( name.indexOf( 'class-' ) === 0 ) return updateInlineClass;

		if ( attribute.isBoolean ) {
			var type$1 = element.getAttribute( 'type' );
			if ( attribute.interpolator && name === 'checked' && ( type$1 === 'checkbox' || type$1 === 'radio' ) ) attribute.interpolator.bound = true;
			return updateBoolean;
		}

		if ( attribute.namespace && attribute.namespace !== attribute.node.namespaceURI ) return updateNamespacedAttribute;

		return updateAttribute;
	}

	function updateId ( reset ) {
		var ref = this, node = ref.node;
		var value = this.getValue();

		// remove the mapping to this node if it hasn't already been replaced
		if ( this.ractive.nodes[ node.id ] === node ) delete this.ractive.nodes[ node.id ];
		if ( reset ) return node.removeAttribute( 'id' );

		this.ractive.nodes[ value ] = node;

		node.id = value;
	}

	function updateMultipleSelectValue ( reset ) {
		var value = this.getValue();

		if ( !isArray( value ) ) value = [ value ];

		var options = this.node.options;
		var i = options.length;

		if ( reset ) {
			while ( i-- ) options[i].selected = false;
		} else {
			while ( i-- ) {
				var option = options[i];
				var optionValue = option._ractive ?
					option._ractive.value :
					option.value; // options inserted via a triple don't have _ractive

				option.selected = arrayContains( value, optionValue );
			}
		}
	}

	function updateSelectValue ( reset ) {
		var value = this.getValue();

		if ( !this.locked ) { // TODO is locked still a thing?
			this.node._ractive.value = value;

			var options = this.node.options;
			var i = options.length;
			var wasSelected = false;

			if ( reset ) {
				while ( i-- ) options[i].selected = false;
			} else {
				while ( i-- ) {
					var option = options[i];
					var optionValue = option._ractive ?
						option._ractive.value :
						option.value; // options inserted via a triple don't have _ractive
					if ( option.disabled && option.selected ) wasSelected = true;

					if ( optionValue == value ) { // double equals as we may be comparing numbers with strings
						option.selected = true;
						return;
					}
				}
			}

			if ( !wasSelected ) this.node.selectedIndex = -1;
		}
	}


	function updateContentEditableValue ( reset ) {
		var value = this.getValue();

		if ( !this.locked ) {
			if ( reset ) this.node.innerHTML = '';
			else this.node.innerHTML = value === undefined ? '' : value;
		}
	}

	function updateRadioValue ( reset ) {
		var node = this.node;
		var wasChecked = node.checked;

		var value = this.getValue();

		if ( reset ) return node.checked = false;

		//node.value = this.element.getAttribute( 'value' );
		node.value = this.node._ractive.value = value;
		node.checked = value === this.element.getAttribute( 'name' );

		// This is a special case - if the input was checked, and the value
		// changed so that it's no longer checked, the twoway binding is
		// most likely out of date. To fix it we have to jump through some
		// hoops... this is a little kludgy but it works
		if ( wasChecked && !node.checked && this.element.binding && this.element.binding.rendered ) {
			this.element.binding.group.model.set( this.element.binding.group.getValue() );
		}
	}

	function updateValue ( reset ) {
		if ( !this.locked ) {
			if ( reset ) {
				this.node.removeAttribute( 'value' );
				this.node.value = this.node._ractive.value = null;
				return;
			}

			var value = this.getValue();

			this.node.value = this.node._ractive.value = value;
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}

	function updateStringValue ( reset ) {
		if ( !this.locked ) {
			if ( reset ) {
				this.node._ractive.value = '';
				this.node.removeAttribute( 'value' );
				return;
			}

			var value = this.getValue();

			this.node._ractive.value = value;

			this.node.value = safeToStringValue( value );
			this.node.setAttribute( 'value', safeToStringValue( value ) );
		}
	}

	function updateRadioName ( reset ) {
		if ( reset ) this.node.checked = false;
		else this.node.checked = ( this.getValue() == this.node._ractive.value );
	}

	function updateCheckboxName ( reset ) {
		var ref = this, element = ref.element, node = ref.node;
		var binding = element.binding;

		var value = this.getValue();
		var valueAttribute = element.getAttribute( 'value' );

		if ( reset ) {
			// TODO: WAT?
		}

		if ( !isArray( value ) ) {
			binding.isChecked = node.checked = ( value == valueAttribute );
		} else {
			var i = value.length;
			while ( i-- ) {
				if ( valueAttribute == value[i] ) {
					binding.isChecked = node.checked = true;
					return;
				}
			}
			binding.isChecked = node.checked = false;
		}
	}

	function updateStyleAttribute ( reset ) {
		var props = reset ? {} : readStyle( this.getValue() || '' );
		var style = this.node.style;
		var keys = Object.keys( props );
		var prev = this.previous || [];

		var i = 0;
		while ( i < keys.length ) {
			if ( keys[i] in style ) {
				var safe = props[ keys[i] ].replace( '!important', '' );
				style.setProperty( keys[i], safe, safe.length !== props[ keys[i] ].length ? 'important' : '' );
			}
			i++;
		}

		// remove now-missing attrs
		i = prev.length;
		while ( i-- ) {
			if ( !~keys.indexOf( prev[i] ) && prev[i] in style ) style.setProperty( prev[i], '', '' );
		}

		this.previous = keys;
	}

	function updateInlineStyle ( reset ) {
		if ( !this.style ) {
			this.style = decamelize( this.name.substr( 6 ) );
		}

		var value = reset ? '' : safeToStringValue( this.getValue() );
		var safe = value.replace( '!important', '' );
		this.node.style.setProperty( this.style, safe, safe.length !== value.length ? 'important' : '' );
	}

	function updateClassName ( reset ) {
		var value = reset ? [] : readClass( safeToStringValue( this.getValue() ) );

		// watch for weirdo svg elements
		var cls = this.node.className;
		cls = cls.baseVal !== undefined ? cls.baseVal : cls;

		var attr = readClass( cls );
		var prev = this.previous || attr.slice( 0 );

		var className = value.concat( attr.filter( function ( c ) { return !~prev.indexOf( c ); } ) ).join( ' ' );

		if ( className !== cls ) {
			if ( typeof this.node.className !== 'string' ) {
				this.node.className.baseVal = className;
			} else {
				this.node.className = className;
			}
		}

		this.previous = value;
	}

	function updateInlineClass ( reset ) {
		var name = this.name.substr( 6 );

		// watch for weirdo svg elements
		var cls = this.node.className;
		cls = cls.baseVal !== undefined ? cls.baseVal : cls;

		var attr = readClass( cls );
		var value = reset ? false : this.getValue();

		if ( !this.inlineClass ) this.inlineClass = name;

		if ( value && !~attr.indexOf( name ) ) attr.push( name );
		else if ( !value && ~attr.indexOf( name ) ) attr.splice( attr.indexOf( name ), 1 );

		if ( typeof this.node.className !== 'string' ) {
			this.node.className.baseVal = attr.join( ' ' );
		} else {
			this.node.className = attr.join( ' ' );
		}
	}

	function updateBoolean ( reset ) {
		// with two-way binding, only update if the change wasn't initiated by the user
		// otherwise the cursor will often be sent to the wrong place
		if ( !this.locked ) {
			if ( reset ) {
				if ( this.useProperty ) this.node[ this.propertyName ] = false;
				this.node.removeAttribute( this.propertyName );
				return;
			}

			if ( this.useProperty ) {
				this.node[ this.propertyName ] = this.getValue();
			} else {
				if ( this.getValue() ) {
					this.node.setAttribute( this.propertyName, '' );
				} else {
					this.node.removeAttribute( this.propertyName );
				}
			}
		}
	}

	function updateAttribute ( reset ) {
		if ( reset ) this.node.removeAttribute( this.name );
		else this.node.setAttribute( this.name, safeToStringValue( this.getString() ) );
	}

	function updateNamespacedAttribute ( reset ) {
		if ( reset ) this.node.removeAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ) );
		else this.node.setAttributeNS( this.namespace, this.name.slice( this.name.indexOf( ':' ) + 1 ), safeToStringValue( this.getString() ) );
	}

	var propertyNames = {
		'accept-charset': 'acceptCharset',
		accesskey: 'accessKey',
		bgcolor: 'bgColor',
		'class': 'className',
		codebase: 'codeBase',
		colspan: 'colSpan',
		contenteditable: 'contentEditable',
		datetime: 'dateTime',
		dirname: 'dirName',
		'for': 'htmlFor',
		'http-equiv': 'httpEquiv',
		ismap: 'isMap',
		maxlength: 'maxLength',
		novalidate: 'noValidate',
		pubdate: 'pubDate',
		readonly: 'readOnly',
		rowspan: 'rowSpan',
		tabindex: 'tabIndex',
		usemap: 'useMap'
	};

	function lookupNamespace ( node, prefix ) {
		var qualified = "xmlns:" + prefix;

		while ( node ) {
			if ( node.hasAttribute && node.hasAttribute( qualified ) ) return node.getAttribute( qualified );
			node = node.parentNode;
		}

		return namespaces[ prefix ];
	}

	var attribute = false;
	function inAttribute () { return attribute; }

	var Attribute = (function (Item) {
		function Attribute ( options ) {
			Item.call( this, options );

			this.name = options.template.n;
			this.namespace = null;

			this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
			this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
			this.parentFragment = options.parentFragment; // shared
			this.ractive = this.parentFragment.ractive;

			this.rendered = false;
			this.updateDelegate = null;
			this.fragment = null;

			this.element.attributeByName[ this.name ] = this;

			if ( !isArray( options.template.f ) ) {
				this.value = options.template.f;
				if ( this.value === 0 ) {
					this.value = '';
				}
			} else {
				this.fragment = new Fragment({
					owner: this,
					template: options.template.f
				});
			}

			this.interpolator = this.fragment &&
				this.fragment.items.length === 1 &&
				this.fragment.items[0].type === INTERPOLATOR &&
				this.fragment.items[0];

			if ( this.interpolator ) this.interpolator.owner = this;
		}

		Attribute.prototype = Object.create( Item && Item.prototype );
		Attribute.prototype.constructor = Attribute;

		Attribute.prototype.bind = function bind () {
			if ( this.fragment ) {
				this.fragment.bind();
			}
		};

		Attribute.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.parentFragment.bubble();
				this.element.bubble();
				this.dirty = true;
			}
		};

		Attribute.prototype.destroyed = function destroyed () {
			this.updateDelegate( true );
		};

		Attribute.prototype.getString = function getString () {
			attribute = true;
			var value = this.fragment ?
				this.fragment.toString() :
				this.value != null ? '' + this.value : '';
			attribute = false;
			return value;
		};

		// TODO could getValue ever be called for a static attribute,
		// or can we assume that this.fragment exists?
		Attribute.prototype.getValue = function getValue () {
			attribute = true;
			var value = this.fragment ? this.fragment.valueOf() : booleanAttributes.test( this.name ) ? true : this.value;
			attribute = false;
			return value;
		};

		Attribute.prototype.render = function render () {
			var node = this.element.node;
			this.node = node;

			// should we use direct property access, or setAttribute?
			if ( !node.namespaceURI || node.namespaceURI === namespaces.html ) {
				this.propertyName = propertyNames[ this.name ] || this.name;

				if ( node[ this.propertyName ] !== undefined ) {
					this.useProperty = true;
				}

				// is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
				// node.selected = true rather than node.setAttribute( 'selected', '' )
				if ( booleanAttributes.test( this.name ) || this.isTwoway ) {
					this.isBoolean = true;
				}

				if ( this.propertyName === 'value' ) {
					node._ractive.value = this.value;
				}
			}

			if ( node.namespaceURI ) {
				var index = this.name.indexOf( ':' );
				if ( index !== -1 ) {
					this.namespace = lookupNamespace( node, this.name.slice( 0, index ) );
				} else {
					this.namespace = node.namespaceURI;
				}
			}

			this.rendered = true;
			this.updateDelegate = getUpdateDelegate( this );
			this.updateDelegate();
		};

		Attribute.prototype.toString = function toString () {
			attribute = true;

			var value = this.getValue();

			// Special case - select and textarea values (should not be stringified)
			if ( this.name === 'value' && ( this.element.getAttribute( 'contenteditable' ) !== undefined || ( this.element.name === 'select' || this.element.name === 'textarea' ) ) ) {
				return;
			}

			// Special case – bound radio `name` attributes
			if ( this.name === 'name' && this.element.name === 'input' && this.interpolator && this.element.getAttribute( 'type' ) === 'radio' ) {
				return ("name=\"{{" + (this.interpolator.model.getKeypath()) + "}}\"");
			}

			// Special case - style and class attributes and directives
			if ( this.owner === this.element && ( this.name === 'style' || this.name === 'class' || this.style || this.inlineClass ) ) {
				return;
			}

			if ( !this.rendered && this.owner === this.element && ( !this.name.indexOf( 'style-' ) || !this.name.indexOf( 'class-' ) ) ) {
				if ( !this.name.indexOf( 'style-' ) ) {
					this.style = decamelize( this.name.substr( 6 ) );
				} else {
					this.inlineClass = this.name.substr( 6 );
				}

				return;
			}

			if ( booleanAttributes.test( this.name ) ) return value ? this.name : '';
			if ( value == null ) return '';

			var str = safeAttributeString( this.getString() );
			attribute = false;

			return str ?
				("" + (this.name) + "=\"" + str + "\"") :
				this.name;
		};

		Attribute.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();
		};

		Attribute.prototype.unrender = function unrender () {
			this.updateDelegate( true );

			this.rendered = false;
		};

		Attribute.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.fragment ) this.fragment.update();
				if ( this.rendered ) this.updateDelegate();
				if ( this.isTwoway && !this.locked ) {
					this.interpolator.twowayBinding.lastVal( true, this.interpolator.model.get() );
				}
			}
		};

		return Attribute;
	}(Item));

	var BindingFlag = (function (Item) {
		function BindingFlag ( options ) {
			Item.call( this, options );

			this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
			this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
			this.flag = options.template.v === 'l' ? 'lazy' : 'twoway';

			if ( this.element.type === ELEMENT ) {
				if ( isArray( options.template.f ) ) {
					this.fragment = new Fragment({
						owner: this,
						template: options.template.f
					});
				}

				this.interpolator = this.fragment &&
									this.fragment.items.length === 1 &&
									this.fragment.items[0].type === INTERPOLATOR &&
									this.fragment.items[0];
			}
		}

		BindingFlag.prototype = Object.create( Item && Item.prototype );
		BindingFlag.prototype.constructor = BindingFlag;

		BindingFlag.prototype.bind = function bind () {
			if ( this.fragment ) this.fragment.bind();
			set$2( this, this.getValue(), true );
		};

		BindingFlag.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.element.bubble();
				this.dirty = true;
			}
		};

		BindingFlag.prototype.getValue = function getValue () {
			if ( this.fragment ) return this.fragment.valueOf();
			else if ( 'value' in this ) return this.value;
			else if ( 'f' in this.template ) return this.template.f;
			else return true;
		};

		BindingFlag.prototype.render = function render () {
			set$2( this, this.getValue(), true );
		};

		BindingFlag.prototype.toString = function toString () { return ''; };

		BindingFlag.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();

			delete this.element[ this.flag ];
		};

		BindingFlag.prototype.unrender = function unrender () {
			if ( this.element.rendered ) this.element.recreateTwowayBinding();
		};

		BindingFlag.prototype.update = function update () {
			if ( this.dirty ) {
				if ( this.fragment ) this.fragment.update();
				set$2( this, this.getValue(), true );
			}
		};

		return BindingFlag;
	}(Item));

	function set$2 ( flag, value, update ) {
		if ( value === 0 ) {
			flag.value = true;
		} else if ( value === 'true' ) {
			flag.value = true;
		} else if ( value === 'false' || value === '0' ) {
			flag.value = false;
		} else {
			flag.value = value;
		}

		var current = flag.element[ flag.flag ];
		flag.element[ flag.flag ] = flag.value;
		if ( update && !flag.element.attributes.binding && current !== flag.value ) {
			flag.element.recreateTwowayBinding();
		}

		return flag.value;
	}

	var div$1 = doc ? createElement( 'div' ) : null;

	var attributes = false;
	function inAttributes() { return attributes; }
	function doInAttributes( fn ) {
		attributes = true;
		fn();
		attributes = false;
	}

	var ConditionalAttribute = (function (Item) {
		function ConditionalAttribute ( options ) {
			Item.call( this, options );

			this.attributes = [];

			this.owner = options.owner;

			this.fragment = new Fragment({
				ractive: this.ractive,
				owner: this,
				template: this.template
			});
			// this fragment can't participate in node-y things
			this.fragment.findNextNode = noop;

			this.dirty = false;
		}

		ConditionalAttribute.prototype = Object.create( Item && Item.prototype );
		ConditionalAttribute.prototype.constructor = ConditionalAttribute;

		ConditionalAttribute.prototype.bind = function bind () {
			this.fragment.bind();
		};

		ConditionalAttribute.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.dirty = true;
				this.owner.bubble();
			}
		};

		ConditionalAttribute.prototype.render = function render () {
			this.node = this.owner.node;
			if ( this.node ) {
				this.isSvg = this.node.namespaceURI === svg$1;
			}

			attributes = true;
			if ( !this.rendered ) this.fragment.render();
			attributes = false;

			this.rendered = true;
			this.dirty = true; // TODO this seems hacky, but necessary for tests to pass in browser AND node.js
			this.update();
		};

		ConditionalAttribute.prototype.toString = function toString () {
			return this.fragment.toString();
		};

		ConditionalAttribute.prototype.unbind = function unbind () {
			this.fragment.unbind();
		};

		ConditionalAttribute.prototype.unrender = function unrender () {
			this.rendered = false;
			this.fragment.unrender();
		};

		ConditionalAttribute.prototype.update = function update () {
			var this$1 = this;

			var str;
			var attrs;

			if ( this.dirty ) {
				this.dirty = false;

				attributes = true;
				this.fragment.update();
				attributes = false;

				if ( this.rendered && this.node ) {
					str = this.fragment.toString();
					attrs = parseAttributes( str, this.isSvg );

					// any attributes that previously existed but no longer do
					// must be removed
					this.attributes.filter( function ( a ) { return notIn( attrs, a ); } ).forEach( function ( a ) {
						this$1.node.removeAttribute( a.name );
					});

					attrs.forEach( function ( a ) {
						this$1.node.setAttribute( a.name, a.value );
					});

					this.attributes = attrs;
				}
			}
		};

		return ConditionalAttribute;
	}(Item));

	function parseAttributes ( str, isSvg ) {
		var tagName = isSvg ? 'svg' : 'div';
		return str
			? (div$1.innerHTML = "<" + tagName + " " + str + "></" + tagName + ">") &&
				toArray(div$1.childNodes[0].attributes)
			: [];
	}

	function notIn ( haystack, needle ) {
		var i = haystack.length;

		while ( i-- ) {
			if ( haystack[i].name === needle.name ) {
				return false;
			}
		}

		return true;
	}

	function processWrapper ( wrapper, array, methodName, newIndices ) {
		var __model = wrapper.__model;

		if ( newIndices ) {
			__model.shuffle( newIndices );
		} else {
			// If this is a sort or reverse, we just do root.set()...
			// TODO use merge logic?
			//root.viewmodel.mark( keypath );
		}
	}

	var mutatorMethods = [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ];
	var patchedArrayProto = [];

	mutatorMethods.forEach( function ( methodName ) {
		var method = function () {
			var this$1 = this;
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

			var newIndices = getNewIndices( this.length, methodName, args );

			// lock any magic array wrappers, so that things don't get fudged
			this._ractive.wrappers.forEach( function ( r ) { if ( r.magic ) r.magic.locked = true; } );

			// apply the underlying method
			var result = Array.prototype[ methodName ].apply( this, arguments );

			// trigger changes
			runloop.start();

			this._ractive.setting = true;
			var i = this._ractive.wrappers.length;
			while ( i-- ) {
				processWrapper( this$1._ractive.wrappers[i], this$1, methodName, newIndices );
			}

			runloop.end();

			this._ractive.setting = false;

			// unlock the magic arrays... magic... bah
			this._ractive.wrappers.forEach( function ( r ) { if ( r.magic ) r.magic.locked = false; } );

			return result;
		};

		defineProperty( patchedArrayProto, methodName, {
			value: method,
			configurable: true
		});
	});

	var patchArrayMethods;
	var unpatchArrayMethods;

	// can we use prototype chain injection?
	// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection
	if ( ({}).__proto__ ) {
		// yes, we can
		patchArrayMethods = function ( array ) { return array.__proto__ = patchedArrayProto; };
		unpatchArrayMethods = function ( array ) { return array.__proto__ = Array.prototype; };
	}

	else {
		// no, we can't
		patchArrayMethods = function ( array ) {
			var i = mutatorMethods.length;
			while ( i-- ) {
				var methodName = mutatorMethods[i];
				defineProperty( array, methodName, {
					value: patchedArrayProto[ methodName ],
					configurable: true
				});
			}
		};

		unpatchArrayMethods = function ( array ) {
			var i = mutatorMethods.length;
			while ( i-- ) {
				delete array[ mutatorMethods[i] ];
			}
		};
	}

	patchArrayMethods.unpatch = unpatchArrayMethods; // TODO export separately?
	var patch = patchArrayMethods;

	var errorMessage$1 = 'Something went wrong in a rather interesting way';

	var arrayAdaptor = {
		filter: function ( object ) {
			// wrap the array if a) b) it's an array, and b) either it hasn't been wrapped already,
			// or the array didn't trigger the get() itself
			return isArray( object ) && ( !object._ractive || !object._ractive.setting );
		},
		wrap: function ( ractive, array, keypath ) {
			return new ArrayWrapper( ractive, array, keypath );
		}
	};

	var ArrayWrapper = function ArrayWrapper ( ractive, array ) {
		this.root = ractive;
		this.value = array;
		this.__model = null; // filled in later

		// if this array hasn't already been ractified, ractify it
		if ( !array._ractive ) {
			// define a non-enumerable _ractive property to store the wrappers
			defineProperty( array, '_ractive', {
				value: {
					wrappers: [],
					instances: [],
					setting: false
				},
				configurable: true
			});

			patch( array );
		}

		// store the ractive instance, so we can handle transitions later
		if ( !array._ractive.instances[ ractive._guid ] ) {
			array._ractive.instances[ ractive._guid ] = 0;
			array._ractive.instances.push( ractive );
		}

		array._ractive.instances[ ractive._guid ] += 1;
		array._ractive.wrappers.push( this );
	};

	ArrayWrapper.prototype.get = function get () {
		return this.value;
	};

	ArrayWrapper.prototype.reset = function reset ( value ) {
		return this.value === value;
	};

	ArrayWrapper.prototype.teardown = function teardown () {
		var array, storage, wrappers, instances, index;

		array = this.value;
		storage = array._ractive;
		wrappers = storage.wrappers;
		instances = storage.instances;

		// if teardown() was invoked because we're clearing the cache as a result of
		// a change that the array itself triggered, we can save ourselves the teardown
		// and immediate setup
		if ( storage.setting ) {
			return false; // so that we don't remove it from cached wrappers
		}

		index = wrappers.indexOf( this );
		if ( index === -1 ) {
			throw new Error( errorMessage$1 );
		}

		wrappers.splice( index, 1 );

		// if nothing else depends on this array, we can revert it to its
		// natural state
		if ( !wrappers.length ) {
			delete array._ractive;
			patch.unpatch( this.value );
		}

		else {
			// remove ractive instance if possible
			instances[ this.root._guid ] -= 1;
			if ( !instances[ this.root._guid ] ) {
				index = instances.indexOf( this.root );

				if ( index === -1 ) {
					throw new Error( errorMessage$1 );
				}

				instances.splice( index, 1 );
			}
		}
	};

	var magicAdaptor;

	try {
		Object.defineProperty({}, 'test', { get: function() {}, set: function() {} });

		magicAdaptor = {
			filter: function ( value ) {
				return value && typeof value === 'object';
			},
			wrap: function ( ractive, value, keypath ) {
				return new MagicWrapper( ractive, value, keypath );
			}
		};
	} catch ( err ) {
		magicAdaptor = false;
	}

	var magicAdaptor$1 = magicAdaptor;

	function createOrWrapDescriptor ( originalDescriptor, ractive, keypath, wrapper ) {
		if ( originalDescriptor.set && originalDescriptor.set.__magic ) {
			originalDescriptor.set.__magic.dependants.push({ ractive: ractive, keypath: keypath });
			return originalDescriptor;
		}

		var setting;

		var dependants = [{ ractive: ractive, keypath: keypath }];

		var descriptor = {
			get: function () {
				return 'value' in originalDescriptor ? originalDescriptor.value : originalDescriptor.get.call( this );
			},
			set: function (value) {
				if ( setting ) return;

				if ( 'value' in originalDescriptor ) {
					originalDescriptor.value = value;
				} else {
					originalDescriptor.set.call( this, value );
				}

				if ( wrapper.locked ) return;
				setting = true;
				dependants.forEach( function (ref) {
					var ractive = ref.ractive;
					var keypath = ref.keypath;

					ractive.set( keypath, value );
				});
				setting = false;
			},
			enumerable: true
		};

		descriptor.set.__magic = { dependants: dependants, originalDescriptor: originalDescriptor };

		return descriptor;
	}

	function revert ( descriptor, ractive, keypath ) {
		if ( !descriptor.set || !descriptor.set.__magic ) return true;

		var dependants = descriptor.set.__magic;
		var i = dependants.length;
		while ( i-- ) {
			var dependant = dependants[i];
			if ( dependant.ractive === ractive && dependant.keypath === keypath ) {
				dependants.splice( i, 1 );
				return false;
			}
		}
	}

	var MagicWrapper = function MagicWrapper ( ractive, value, keypath ) {
		var this$1 = this;

			this.ractive = ractive;
		this.value = value;
		this.keypath = keypath;

		this.originalDescriptors = {};

		// wrap all properties with getters
		Object.keys( value ).forEach( function ( key ) {
			var originalDescriptor = Object.getOwnPropertyDescriptor( this$1.value, key );
			this$1.originalDescriptors[ key ] = originalDescriptor;

			var childKeypath = keypath ? ("" + keypath + "." + (escapeKey( key ))) : escapeKey( key );

			var descriptor = createOrWrapDescriptor( originalDescriptor, ractive, childKeypath, this$1 );



			Object.defineProperty( this$1.value, key, descriptor );
		});
	};

	MagicWrapper.prototype.get = function get () {
		return this.value;
	};

	MagicWrapper.prototype.reset = function reset ( value ) {
		return this.value === value;
	};

	MagicWrapper.prototype.set = function set ( key, value ) {
		this.value[ key ] = value;
	};

	MagicWrapper.prototype.teardown = function teardown () {
		var this$1 = this;

			Object.keys( this.value ).forEach( function ( key ) {
			var descriptor = Object.getOwnPropertyDescriptor( this$1.value, key );
			if ( !descriptor.set || !descriptor.set.__magic ) return;

			revert( descriptor );

			if ( descriptor.set.__magic.dependants.length === 1 ) {
				Object.defineProperty( this$1.value, key, descriptor.set.__magic.originalDescriptor );
			}
		});
	};

	var MagicArrayWrapper = function MagicArrayWrapper ( ractive, array, keypath ) {
		this.value = array;

		this.magic = true;

		this.magicWrapper = magicAdaptor$1.wrap( ractive, array, keypath );
		this.arrayWrapper = arrayAdaptor.wrap( ractive, array, keypath );
		this.arrayWrapper.magic = this.magicWrapper;

		// ugh, this really is a terrible hack
		Object.defineProperty( this, '__model', {
			get: function () {
				return this.arrayWrapper.__model;
			},
			set: function ( model ) {
				this.arrayWrapper.__model = model;
			}
		});
	};

	MagicArrayWrapper.prototype.get = function get () {
		return this.value;
	};

	MagicArrayWrapper.prototype.teardown = function teardown () {
		this.arrayWrapper.teardown();
		this.magicWrapper.teardown();
	};

	MagicArrayWrapper.prototype.reset = function reset ( value ) {
		return this.arrayWrapper.reset( value ) && this.magicWrapper.reset( value );
	};

	var magicArrayAdaptor = {
		filter: function ( object, keypath, ractive ) {
			return magicAdaptor$1.filter( object, keypath, ractive ) && arrayAdaptor.filter( object );
		},

		wrap: function ( ractive, array, keypath ) {
			return new MagicArrayWrapper( ractive, array, keypath );
		}
	};

	// TODO this is probably a bit anal, maybe we should leave it out
	function prettify ( fnBody ) {
		var lines = fnBody
			.replace( /^\t+/gm, function ( tabs ) { return tabs.split( '\t' ).join( '  ' ); } )
			.split( '\n' );

		var minIndent = lines.length < 2 ? 0 :
			lines.slice( 1 ).reduce( function ( prev, line ) {
				return Math.min( prev, /^\s*/.exec( line )[0].length );
			}, Infinity );

		return lines.map( function ( line, i ) {
			return '    ' + ( i ? line.substring( minIndent ) : line );
		}).join( '\n' );
	}

	// Ditto. This function truncates the stack to only include app code
	function truncateStack ( stack ) {
		if ( !stack ) return '';

		var lines = stack.split( '\n' );
		var name = Computation.name + '.getValue';

		var truncated = [];

		var len = lines.length;
		for ( var i = 1; i < len; i += 1 ) {
			var line = lines[i];

			if ( ~line.indexOf( name ) ) {
				return truncated.join( '\n' );
			} else {
				truncated.push( line );
			}
		}
	}

	var Computation = (function (Model) {
		function Computation ( viewmodel, signature, key ) {
			Model.call( this, null, null );

			this.root = this.parent = viewmodel;
			this.signature = signature;

			this.key = key; // not actually used, but helps with debugging
			this.isExpression = key && key[0] === '@';

			this.isReadonly = !this.signature.setter;

			this.context = viewmodel.computationContext;

			this.dependencies = [];

			this.children = [];
			this.childByKey = {};

			this.deps = [];

			this.dirty = true;

			// TODO: is there a less hackish way to do this?
			this.shuffle = undefined;
		}

		Computation.prototype = Object.create( Model && Model.prototype );
		Computation.prototype.constructor = Computation;

		Computation.prototype.get = function get ( shouldCapture ) {
			if ( shouldCapture ) capture( this );

			if ( this.dirty ) {
				this.dirty = false;
				this.value = this.getValue();
				if ( this.wrapper ) this.newWrapperValue = this.value;
				this.adapt();
			}

			// if capturing, this value needs to be unwrapped because it's for external use
			return shouldCapture && this.wrapper ? this.wrapperValue : this.value;
		};

		Computation.prototype.getValue = function getValue () {
			startCapturing();
			var result;

			try {
				result = this.signature.getter.call( this.context );
			} catch ( err ) {
				warnIfDebug( ("Failed to compute " + (this.getKeypath()) + ": " + (err.message || err)) );

				// TODO this is all well and good in Chrome, but...
				// ...also, should encapsulate this stuff better, and only
				// show it if Ractive.DEBUG
				if ( hasConsole ) {
					if ( console.groupCollapsed ) console.groupCollapsed( '%cshow details', 'color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;' );
					var functionBody = prettify( this.signature.getterString );
					var stack = this.signature.getterUseStack ? '\n\n' + truncateStack( err.stack ) : '';
					console.error( ("" + (err.name) + ": " + (err.message) + "\n\n" + functionBody + "" + stack) );
					if ( console.groupCollapsed ) console.groupEnd();
				}
			}

			var dependencies = stopCapturing();
			this.setDependencies( dependencies );

			// if not the first computation and the value is not the same,
			// register the change for change events
			if ( 'value' in this && result !== this.value ) {
				this.registerChange( this.getKeypath(), result );
			}

			return result;
		};

		Computation.prototype.handleChange = function handleChange$1 () {
			this.dirty = true;

			this.links.forEach( marked );
			this.deps.forEach( handleChange );
			this.children.forEach( handleChange );
			this.clearUnresolveds(); // TODO same question as on Model - necessary for primitives?
		};

		Computation.prototype.joinKey = function joinKey ( key ) {
			if ( key === undefined || key === '' ) return this;

			if ( !this.childByKey.hasOwnProperty( key ) ) {
				var child = new ComputationChild( this, key );
				this.children.push( child );
				this.childByKey[ key ] = child;
			}

			return this.childByKey[ key ];
		};

		Computation.prototype.mark = function mark () {
			this.handleChange();
		};

		Computation.prototype.rebinding = function rebinding ( next, previous ) {
			// computations will grab all of their deps again automagically
			if ( next !== previous ) this.handleChange();
		};

		Computation.prototype.set = function set ( value ) {
			if ( !this.signature.setter ) {
				throw new Error( ("Cannot set read-only computed value '" + (this.key) + "'") );
			}

			this.signature.setter( value );
			this.mark();
		};

		Computation.prototype.setDependencies = function setDependencies ( dependencies ) {
			// unregister any soft dependencies we no longer have
			var this$1 = this;

			var i = this.dependencies.length;
			while ( i-- ) {
				var model = this$1.dependencies[i];
				if ( !~dependencies.indexOf( model ) ) model.unregister( this$1 );
			}

			// and add any new ones
			i = dependencies.length;
			while ( i-- ) {
				var model$1 = dependencies[i];
				if ( !~this$1.dependencies.indexOf( model$1 ) ) model$1.register( this$1 );
			}

			this.dependencies = dependencies;
		};

		Computation.prototype.teardown = function teardown () {
			var this$1 = this;

			var i = this.dependencies.length;
			while ( i-- ) {
				if ( this$1.dependencies[i] ) this$1.dependencies[i].unregister( this$1 );
			}
			if ( this.root.computations[this.key] === this ) delete this.root.computations[this.key];
			Model.prototype.teardown.call(this);
		};

		Computation.prototype.unregister = function unregister ( dependent ) {
			Model.prototype.unregister.call( this, dependent );
			// tear down expressions with no deps, because they will be replaced when needed
			if ( this.isExpression && this.deps.length === 0 ) this.teardown();
		};

		return Computation;
	}(Model));

	var RactiveModel = (function (Model) {
		function RactiveModel ( ractive ) {
			Model.call( this, null, '' );
			this.value = ractive;
			this.isRoot = true;
			this.root = this;
			this.adaptors = [];
			this.ractive = ractive;
			this.changes = {};
		}

		RactiveModel.prototype = Object.create( Model && Model.prototype );
		RactiveModel.prototype.constructor = RactiveModel;

		RactiveModel.prototype.getKeypath = function getKeypath() {
			return '@this';
		};

		return RactiveModel;
	}(Model));

	var hasProp$1 = Object.prototype.hasOwnProperty;

	var RootModel = (function (Model) {
		function RootModel ( options ) {
			Model.call( this, null, null );

			// TODO deprecate this
			this.changes = {};

			this.isRoot = true;
			this.root = this;
			this.ractive = options.ractive; // TODO sever this link

			this.value = options.data;
			this.adaptors = options.adapt;
			this.adapt();

			this.computationContext = options.ractive;
			this.computations = {};

			// TODO this is only for deprecation of using expression keypaths
			this.expressions = {};
		}

		RootModel.prototype = Object.create( Model && Model.prototype );
		RootModel.prototype.constructor = RootModel;

		RootModel.prototype.applyChanges = function applyChanges () {
			this._changeHash = {};
			this.flush();

			return this._changeHash;
		};

		RootModel.prototype.compute = function compute ( key, signature ) {
			var computation = new Computation( this, signature, key );
			this.computations[ escapeKey( key ) ] = computation;

			return computation;
		};

		RootModel.prototype.createLink = function createLink ( keypath, target, targetPath ) {
			var this$1 = this;

			var keys = splitKeypathI( keypath );

			var model = this;
			while ( keys.length ) {
				var key = keys.shift();
				model = this$1.childByKey[ key ] || this$1.joinKey( key );
			}

			return model.link( target, targetPath );
		};

		RootModel.prototype.get = function get ( shouldCapture, options ) {
			var this$1 = this;

			if ( shouldCapture ) capture( this );

			if ( !options || options.virtual !== false ) {
				var result = this.getVirtual();
				var keys = Object.keys( this.computations );
				var i = keys.length;
				while ( i-- ) {
					var computation = this$1.computations[ keys[i] ];
					// exclude template expressions
					if ( !computation.isExpression ) {
						result[ keys[i] ] = computation.get();
					}
				}

				return result;
			} else {
				return this.value;
			}
		};

		RootModel.prototype.getKeypath = function getKeypath () {
			return '';
		};

		RootModel.prototype.getRactiveModel = function getRactiveModel() {
			return this.ractiveModel || ( this.ractiveModel = new RactiveModel( this.ractive ) );
		};

		RootModel.prototype.getValueChildren = function getValueChildren () {
			var children = Model.prototype.getValueChildren.call( this, this.value );

			this.children.forEach( function ( child ) {
				if ( child._link ) {
					var idx = children.indexOf( child );
					if ( ~idx ) children.splice( idx, 1, child._link );
					else children.push( child._link );
				}
			});

			for ( var k in this.computations ) {
				children.push( this.computations[k] );
			}

			return children;
		};

		RootModel.prototype.handleChange = function handleChange$1 () {
			this.deps.forEach( handleChange );
		};

		RootModel.prototype.has = function has ( key ) {
			var value = this.value;
			var unescapedKey = unescapeKey( key );

			if ( hasProp$1.call( value, unescapedKey ) ) return true;

			// mappings/links and computations
			if ( key in this.computations || this.childByKey[unescapedKey] && this.childByKey[unescapedKey]._link ) return true;
			// TODO remove this after deprecation is done
			if ( key in this.expressions ) return true;

			// We climb up the constructor chain to find if one of them contains the unescapedKey
			var constructor = value.constructor;
			while ( constructor !== Function && constructor !== Array && constructor !== Object ) {
				if ( hasProp$1.call( constructor.prototype, unescapedKey ) ) return true;
				constructor = constructor.constructor;
			}

			return false;
		};

		RootModel.prototype.joinKey = function joinKey ( key, opts ) {
			if ( key === '@global' ) return GlobalModel$1;
			if ( key === '@this' ) return this.getRactiveModel();

			if ( this.expressions.hasOwnProperty( key ) ) {
				warnIfDebug( ("Accessing expression keypaths (" + (key.substr(1)) + ") from the instance is deprecated. You can used a getNodeInfo or event object to access keypaths with expression context.") );
				return this.expressions[ key ];
			}

			return this.computations.hasOwnProperty( key ) ? this.computations[ key ] :
			       Model.prototype.joinKey.call( this, key, opts );
		};

		RootModel.prototype.map = function map ( localKey, origin ) {
			var local = this.joinKey( localKey );
			local.link( origin );
		};

		RootModel.prototype.rebinding = function rebinding () {
		};

		RootModel.prototype.set = function set ( value ) {
			// TODO wrapping root node is a baaaad idea. We should prevent this
			var wrapper = this.wrapper;
			if ( wrapper ) {
				var shouldTeardown = !wrapper.reset || wrapper.reset( value ) === false;

				if ( shouldTeardown ) {
					wrapper.teardown();
					this.wrapper = null;
					this.value = value;
					this.adapt();
				}
			} else {
				this.value = value;
				this.adapt();
			}

			this.deps.forEach( handleChange );
			this.children.forEach( mark );
			this.clearUnresolveds(); // TODO do we need to do this with primitive values? if not, what about e.g. unresolved `length` property of null -> string?
		};

		RootModel.prototype.retrieve = function retrieve () {
			return this.wrapper ? this.wrapper.get() : this.value;
		};

		RootModel.prototype.teardown = function teardown () {
			Model.prototype.teardown.call(this);
			for ( var k in this.computations ) {
				this.computations[ k ].teardown();
			}
		};

		RootModel.prototype.update = function update () {
			// noop
		};

		return RootModel;
	}(Model));

	function getComputationSignature ( ractive, key, signature ) {
		var getter;
		var setter;

		// useful for debugging
		var getterString;
		var getterUseStack;
		var setterString;

		if ( typeof signature === 'function' ) {
			getter = bind( signature, ractive );
			getterString = signature.toString();
			getterUseStack = true;
		}

		if ( typeof signature === 'string' ) {
			getter = createFunctionFromString( signature, ractive );
			getterString = signature;
		}

		if ( typeof signature === 'object' ) {
			if ( typeof signature.get === 'string' ) {
				getter = createFunctionFromString( signature.get, ractive );
				getterString = signature.get;
			} else if ( typeof signature.get === 'function' ) {
				getter = bind( signature.get, ractive );
				getterString = signature.get.toString();
				getterUseStack = true;
			} else {
				fatal( '`%s` computation must have a `get()` method', key );
			}

			if ( typeof signature.set === 'function' ) {
				setter = bind( signature.set, ractive );
				setterString = signature.set.toString();
			}
		}

		return {
			getter: getter,
			setter: setter,
			getterString: getterString,
			setterString: setterString,
			getterUseStack: getterUseStack
		};
	}

	var constructHook = new Hook( 'construct' );

	var registryNames$1 = [
		'adaptors',
		'components',
		'decorators',
		'easing',
		'events',
		'interpolators',
		'partials',
		'transitions'
	];

	var uid = 0;

	function construct ( ractive, options ) {
		if ( Ractive.DEBUG ) welcome();

		initialiseProperties( ractive );

		// TODO remove this, eventually
		defineProperty( ractive, 'data', { get: deprecateRactiveData });

		// TODO don't allow `onconstruct` with `new Ractive()`, there's no need for it
		constructHook.fire( ractive, options );

		// Add registries
		registryNames$1.forEach( function ( name ) {
			ractive[ name ] = extendObj( create( ractive.constructor[ name ] || null ), options[ name ] );
		});

		// Create a viewmodel
		var viewmodel = new RootModel({
			adapt: getAdaptors( ractive, ractive.adapt, options ),
			data: dataConfigurator.init( ractive.constructor, ractive, options ),
			ractive: ractive
		});

		ractive.viewmodel = viewmodel;

		// Add computed properties
		var computed = extendObj( create( ractive.constructor.prototype.computed ), options.computed );

		for ( var key in computed ) {
			var signature = getComputationSignature( ractive, key, computed[ key ] );
			viewmodel.compute( key, signature );
		}
	}

	function combine$2 ( arrays ) {
		var res = [];
		var args = res.concat.apply( res, arrays );

		var i = args.length;
		while ( i-- ) {
			if ( !~res.indexOf( args[i] ) ) {
				res.unshift( args[i] );
			}
		}

		return res;
	}

	function getAdaptors ( ractive, protoAdapt, options ) {
		protoAdapt = protoAdapt.map( lookup );
		var adapt = ensureArray( options.adapt ).map( lookup );

		var builtins = [];
		var srcs = [ protoAdapt, adapt ];
		if ( ractive.parent && !ractive.isolated ) {
			srcs.push( ractive.parent.viewmodel.adaptors );
		}
		srcs.push( builtins );

		var magic = 'magic' in options ? options.magic : ractive.magic;
		var modifyArrays = 'modifyArrays' in options ? options.modifyArrays : ractive.modifyArrays;

		if ( magic ) {
			if ( !magicSupported ) {
				throw new Error( 'Getters and setters (magic mode) are not supported in this browser' );
			}

			if ( modifyArrays ) {
				builtins.push( magicArrayAdaptor );
			}

			builtins.push( magicAdaptor$1 );
		}

		if ( modifyArrays ) {
			builtins.push( arrayAdaptor );
		}

		return combine$2( srcs );


		function lookup ( adaptor ) {
			if ( typeof adaptor === 'string' ) {
				adaptor = findInViewHierarchy( 'adaptors', ractive, adaptor );

				if ( !adaptor ) {
					fatal( missingPlugin( adaptor, 'adaptor' ) );
				}
			}

			return adaptor;
		}
	}

	function initialiseProperties ( ractive ) {
		// Generate a unique identifier, for places where you'd use a weak map if it
		// existed
		ractive._guid = 'r-' + uid++;

		// events
		ractive._subs = create( null );

		// storage for item configuration from instantiation to reset,
		// like dynamic functions or original values
		ractive._config = {};

		// nodes registry
		ractive.nodes = {};

		// events
		ractive.event = null;
		ractive._eventQueue = [];

		// live queries
		ractive._liveQueries = [];
		ractive._liveComponentQueries = [];

		// observers
		ractive._observers = [];

		if(!ractive.component){
			ractive.root = ractive;
			ractive.parent = ractive.container = null; // TODO container still applicable?
		}

	}

	function deprecateRactiveData () {
		throw new Error( 'Using `ractive.data` is no longer supported - you must use the `ractive.get()` API instead' );
	}

	function getChildQueue ( queue, ractive ) {
		return queue[ ractive._guid ] || ( queue[ ractive._guid ] = [] );
	}

	function fire ( hookQueue, ractive ) {
		var childQueue = getChildQueue( hookQueue.queue, ractive );

		hookQueue.hook.fire( ractive );

		// queue is "live" because components can end up being
		// added while hooks fire on parents that modify data values.
		while ( childQueue.length ) {
			fire( hookQueue, childQueue.shift() );
		}

		delete hookQueue.queue[ ractive._guid ];
	}

	var HookQueue = function HookQueue ( event ) {
		this.hook = new Hook( event );
		this.inProcess = {};
		this.queue = {};
	};

	HookQueue.prototype.begin = function begin ( ractive ) {
		this.inProcess[ ractive._guid ] = true;
	};

	HookQueue.prototype.end = function end ( ractive ) {
		var parent = ractive.parent;

		// If this is *isn't* a child of a component that's in process,
		// it should call methods or fire at this point
		if ( !parent || !this.inProcess[ parent._guid ] ) {
			fire( this, ractive );
		}
		// elsewise, handoff to parent to fire when ready
		else {
			getChildQueue( this.queue, parent ).push( ractive );
		}

		delete this.inProcess[ ractive._guid ];
	};

	var configHook = new Hook( 'config' );
	var initHook = new HookQueue( 'init' );

	function initialise ( ractive, userOptions, options ) {
		Object.keys( ractive.viewmodel.computations ).forEach( function ( key ) {
			var computation = ractive.viewmodel.computations[ key ];

			if ( ractive.viewmodel.value.hasOwnProperty( key ) ) {
				computation.set( ractive.viewmodel.value[ key ] );
			}
		});

		// init config from Parent and options
		config.init( ractive.constructor, ractive, userOptions );

		configHook.fire( ractive );
		initHook.begin( ractive );

		var fragment;

		// Render virtual DOM
		if ( ractive.template ) {
			var cssIds;

			if ( options.cssIds || ractive.cssId ) {
				cssIds = options.cssIds ? options.cssIds.slice() : [];

				if ( ractive.cssId ) {
					cssIds.push( ractive.cssId );
				}
			}

			ractive.fragment = fragment = new Fragment({
				owner: ractive,
				template: ractive.template,
				cssIds: cssIds
			}).bind( ractive.viewmodel );
		}

		initHook.end( ractive );

		if ( fragment ) {
			// render automatically ( if `el` is specified )
			var el = getElement( ractive.el );
			if ( el ) {
				var promise = ractive.render( el, ractive.append );

				if ( Ractive.DEBUG_PROMISES ) {
					promise['catch']( function ( err ) {
						warnOnceIfDebug( 'Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;' );
						warnIfDebug( 'An error happened during rendering', { ractive: ractive });
						logIfDebug( err );

						throw err;
					});
				}
			}
		}
	}

	var DOMEvent = function DOMEvent ( name, owner ) {
		if ( name.indexOf( '*' ) !== -1 ) {
			fatal( ("Only component proxy-events may contain \"*\" wildcards, <" + (owner.name) + " on-" + name + "=\"...\"/> is not valid") );
		}

		this.name = name;
		this.owner = owner;
		this.node = null;
		this.handler = null;
	};

	DOMEvent.prototype.listen = function listen ( directive ) {
		var node = this.node = this.owner.node;
		var name = this.name;

		if ( !( ("on" + name) in node ) ) {
			warnOnce( missingPlugin( name, 'events' ) );
			}

			node.addEventListener( name, this.handler = function( event ) {
			directive.fire({
					node: node,
				original: event
				});
			}, false );
	};

	DOMEvent.prototype.unlisten = function unlisten () {
		if ( this.handler ) this.node.removeEventListener( this.name, this.handler, false );
	};

	var CustomEvent = function CustomEvent ( eventPlugin, owner ) {
		this.eventPlugin = eventPlugin;
		this.owner = owner;
		this.handler = null;
	};

	CustomEvent.prototype.listen = function listen ( directive ) {
		var node = this.owner.node;

		this.handler = this.eventPlugin( node, function ( event ) {
			if ( event === void 0 ) event = {};

				event.node = event.node || node;
			directive.fire( event );
		});
	};

	CustomEvent.prototype.unlisten = function unlisten () {
		this.handler.teardown();
	};

	var RactiveEvent = function RactiveEvent ( ractive, name ) {
		this.ractive = ractive;
		this.name = name;
		this.handler = null;
	};

	RactiveEvent.prototype.listen = function listen ( directive ) {
		var ractive = this.ractive;

		this.handler = ractive.on( this.name, function () {
			var event;

			// semi-weak test, but what else? tag the event obj ._isEvent ?
			if ( arguments.length && arguments[0] && arguments[0].node ) {
				event = Array.prototype.shift.call( arguments );
				event.component = ractive;
			}

			var args = Array.prototype.slice.call( arguments );
			directive.fire( event, args );

			// cancel bubbling
			return false;
		});
	};

	RactiveEvent.prototype.unlisten = function unlisten () {
		this.handler.cancel();
	};

	var specialPattern = /^(event|arguments)(\..+)?$/;
	var dollarArgsPattern = /^\$(\d+)(\..+)?$/;

	var EventDirective = function EventDirective ( options ) {
		var this$1 = this;

			this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.template = options.template;
		this.parentFragment = options.parentFragment;
		this.ractive = options.parentFragment.ractive;

		this.events = [];

		if ( this.element.type === COMPONENT ) {
			this.template.n.split( '-' ).forEach( function ( n ) {
				this$1.events.push( new RactiveEvent( this$1.element.instance, n ) );
			});
		} else {
			this.template.n.split( '-' ).forEach( function ( n ) {
				var fn = findInViewHierarchy( 'events', this$1.ractive, n );
				// we need to pass in "this" in order to get
				// access to node when it is created.
				this$1.events.push(fn ? new CustomEvent( fn, this$1.element ) : new DOMEvent( n, this$1.element ));
			});
		}

		this.context = null;

		// method calls
		this.resolvers = null;
		this.models = null;

		// handler directive
		this.action = null;
		this.args = null;
	};

	EventDirective.prototype.bind = function bind () {
		var this$1 = this;

			this.context = this.parentFragment.findContext();

		var template = this.template.f;

		if ( template.x ) {
			this.fn = getFunction( template.x.s, template.x.r.length );
			this.resolvers = [];
			this.models = template.x.r.map( function ( ref, i ) {
				var specialMatch = specialPattern.exec( ref );
				if ( specialMatch ) {
					// on-click="foo(event.node)"
					return {
						special: specialMatch[1],
						keys: specialMatch[2] ? splitKeypathI( specialMatch[2].substr(1) ) : []
					};
				}

				var dollarMatch = dollarArgsPattern.exec( ref );
				if ( dollarMatch ) {
					// on-click="foo($1)"
					return {
						special: 'arguments',
						keys: [ dollarMatch[1] - 1 ].concat( dollarMatch[2] ? splitKeypathI( dollarMatch[2].substr( 1 ) ) : [] )
					};
				}

				var resolver;

				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
		}

		else {
			// TODO deprecate this style of directive
			this.action = typeof template === 'string' ? // on-click='foo'
				template :
				typeof template.n === 'string' ? // on-click='{{dynamic}}'
					template.n :
					new Fragment({
						owner: this,
						template: template.n
					});

			this.args = template.a ? // static arguments
				( typeof template.a === 'string' ? [ template.a ] : template.a ) :
				template.d ? // dynamic arguments
					new Fragment({
						owner: this,
						template: template.d
					}) :
					[]; // no arguments
		}

		if ( this.action && typeof this.action !== 'string' ) this.action.bind();
		if ( this.args && template.d ) this.args.bind();
	};

	EventDirective.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.owner.bubble();
		}
	};

	EventDirective.prototype.destroyed = function destroyed () {
		this.events.forEach( function ( e ) { return e.unlisten(); } );
	};

	EventDirective.prototype.fire = function fire ( event, passedArgs ) {

		// augment event object
		if ( passedArgs === void 0 ) passedArgs = [];

			if ( event && !event.hasOwnProperty( '_element' ) ) {
			   addHelpers( event, this.owner );
		}

		if ( this.fn ) {
			var values = [];

			if ( event ) passedArgs.unshift( event );

			if ( this.models ) {
				this.models.forEach( function ( model ) {
					if ( !model ) return values.push( undefined );

					if ( model.special ) {
						var obj = model.special === 'event' ? event : passedArgs;
						var keys = model.keys.slice();

						while ( keys.length ) obj = obj[ keys.shift() ];
						return values.push( obj );
					}

					if ( model.wrapper ) {
						return values.push( model.wrapperValue );
					}

					values.push( model.get() );
				});
			}

			// make event available as `this.event`
			var ractive = this.ractive;
			var oldEvent = ractive.event;

			ractive.event = event;
			var result = this.fn.apply( ractive, values ).pop();

			// Auto prevent and stop if return is explicitly false
			if ( result === false ) {
				var original = event ? event.original : undefined;
				if ( original ) {
					original.preventDefault && original.preventDefault();
					original.stopPropagation && original.stopPropagation();
				} else {
					warnOnceIfDebug( ("handler '" + (this.template.n) + "' returned false, but there is no event available to cancel") );
				}
			}

			ractive.event = oldEvent;
		}

		else {
			var action = this.action.toString();
			var args = this.template.f.d ? this.args.getArgsList() : this.args;

			if ( passedArgs.length ) args = args.concat( passedArgs );

			if ( event ) event.name = action;

			fireEvent( this.ractive, action, {
				event: event,
				args: args
			});
		}
	};

	EventDirective.prototype.handleChange = function handleChange () {};

	EventDirective.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( !this.models ) return;
		var idx = this.models.indexOf( previous );

		if ( ~idx ) {
			this.models.splice( idx, 1, next );
			previous.unregister( this );
			if ( next ) next.addShuffleTask( function () { return next.register( this$1 ); } );
		}
	};

	EventDirective.prototype.render = function render () {
		// render events after everything else, so they fire after bindings
		var this$1 = this;

			runloop.scheduleTask( function () { return this$1.events.forEach( function ( e ) { return e.listen( this$1 ); }, true ); } );
	};

	EventDirective.prototype.toString = function toString() { return ''; };

	EventDirective.prototype.unbind = function unbind$1 () {
		var this$1 = this;

			var template = this.template.f;

		if ( template.x ) {
			if ( this.resolvers ) this.resolvers.forEach( unbind );
			this.resolvers = [];

			if ( this.models ) this.models.forEach( function ( m ) {
				if ( m && m.unregister ) m.unregister( this$1 );
			});
			this.models = null;
		}

		else {
			// TODO this is brittle and non-explicit, fix it
			if ( this.action && this.action.unbind ) this.action.unbind();
			if ( this.args && this.args.unbind ) this.args.unbind();
		}
	};

	EventDirective.prototype.unrender = function unrender () {
		this.events.forEach( function ( e ) { return e.unlisten(); } );
	};

	EventDirective.prototype.update = function update () {
		if ( this.method || !this.dirty ) return; // nothing to do

		this.dirty = false;

		// ugh legacy
		if ( this.action && this.action.update ) this.action.update();
		if ( this.args && this.args.update ) this.args.update();
	};

	// TODO it's unfortunate that this has to run every time a
	// component is rendered... is there a better way?
	function updateLiveQueries ( component ) {
		// Does this need to be added to any live queries?
		var instance = component.ractive;

		do {
			var liveQueries = instance._liveComponentQueries;

			var i = liveQueries.length;
			while ( i-- ) {
				var name = liveQueries[i];
				var query = liveQueries[ ("_" + name) ];

				if ( query.test( component ) ) {
					query.add( component.instance );
					// keep register of applicable selectors, for when we teardown
					component.liveQueries.push( query );
				}
			}
		} while ( instance = instance.parent );
	}

	function removeFromLiveComponentQueries ( component ) {
		var instance = component.ractive;

		while ( instance ) {
			var query = instance._liveComponentQueries[ ("_" + (component.name)) ];
			if ( query ) query.remove( component );

			instance = instance.parent;
		}
	}

	function makeDirty ( query ) {
		query.makeDirty();
	}

	var teardownHook = new Hook( 'teardown' );

	var Component = (function (Item) {
		function Component ( options, ComponentConstructor ) {
			var this$1 = this;

			Item.call( this, options );
			this.type = COMPONENT; // override ELEMENT from super

			var instance = create( ComponentConstructor.prototype );

			this.instance = instance;
			this.name = options.template.e;
			this.parentFragment = options.parentFragment;

			this.liveQueries = [];

			if ( instance.el ) {
				warnIfDebug( ("The <" + (this.name) + "> component has a default 'el' property; it has been disregarded") );
			}

			var partials = options.template.p || {};
			if ( !( 'content' in partials ) ) partials.content = options.template.f || [];
			this._partials = partials; // TEMP

			this.yielders = {};

			// find container
			var fragment = options.parentFragment;
			var container;
			while ( fragment ) {
				if ( fragment.owner.type === YIELDER ) {
					container = fragment.owner.container;
					break;
				}

				fragment = fragment.parent;
			}

			// add component-instance-specific properties
			instance.parent = this.parentFragment.ractive;
			instance.container = container || null;
			instance.root = instance.parent.root;
			instance.component = this;

			construct( this.instance, { partials: partials });

			// for hackability, this could be an open option
			// for any ractive instance, but for now, just
			// for components and just for ractive...
			instance._inlinePartials = partials;

			this.attributeByName = {};

			this.attributes = [];
			var leftovers = [];
			( this.template.m || [] ).forEach( function ( template ) {
				switch ( template.t ) {
					case ATTRIBUTE:
					case EVENT:
					case TRANSITION:
						this$1.attributes.push( createItem({
							owner: this$1,
							parentFragment: this$1.parentFragment,
							template: template
						}) );
						break;

					case BINDING_FLAG:
					case DECORATOR:
						break;

					default:
						leftovers.push( template );
						break;
				}
			});

			this.attributes.push( new ConditionalAttribute({
				owner: this,
				parentFragment: this.parentFragment,
				template: leftovers
			}) );

			this.eventHandlers = [];
			if ( this.template.v ) this.setupEvents();
		}

		Component.prototype = Object.create( Item && Item.prototype );
		Component.prototype.constructor = Component;

		Component.prototype.bind = function bind$1$$ () {
			this.attributes.forEach( bind$1 );

			initialise( this.instance, {
				partials: this._partials
			}, {
				cssIds: this.parentFragment.cssIds
			});

			this.eventHandlers.forEach( bind$1 );

			this.bound = true;
		};

		Component.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.dirty = true;
				this.parentFragment.bubble();
			}
		};

		Component.prototype.checkYielders = function checkYielders () {
			var this$1 = this;

			Object.keys( this.yielders ).forEach( function ( name ) {
				if ( this$1.yielders[ name ].length > 1 ) {
					runloop.end();
					throw new Error( ("A component template can only have one {{yield" + (name ? ' ' + name : '') + "}} declaration at a time") );
				}
			});
		};

		Component.prototype.destroyed = function destroyed () {
			if ( this.instance.fragment ) this.instance.fragment.destroyed();
		};

		Component.prototype.detach = function detach () {
			return this.instance.fragment.detach();
		};

		Component.prototype.find = function find ( selector ) {
			return this.instance.fragment.find( selector );
		};

		Component.prototype.findAll = function findAll ( selector, query ) {
			this.instance.fragment.findAll( selector, query );
		};

		Component.prototype.findComponent = function findComponent ( name ) {
			if ( !name || this.name === name ) return this.instance;

			if ( this.instance.fragment ) {
				return this.instance.fragment.findComponent( name );
			}
		};

		Component.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( query.test( this ) ) {
				query.add( this.instance );

				if ( query.live ) {
					this.liveQueries.push( query );
				}
			}

			this.instance.fragment.findAllComponents( name, query );
		};

		Component.prototype.firstNode = function firstNode ( skipParent ) {
			return this.instance.fragment.firstNode( skipParent );
		};

		Component.prototype.render = function render$1$$ ( target, occupants ) {
			render$1( this.instance, target, null, occupants );

			this.checkYielders();
			this.attributes.forEach( render );
			this.eventHandlers.forEach( render );
			updateLiveQueries( this );

			this.rendered = true;
		};

		Component.prototype.setupEvents = function setupEvents () {
			var this$1 = this;

			var handlers = this.eventHandlers;

			Object.keys( this.template.v ).forEach( function ( key ) {
				var eventNames = key.split( '-' );
				var template = this$1.template.v[ key ];

				eventNames.forEach( function ( eventName ) {
					var event = new RactiveEvent( this$1.instance, eventName );
					handlers.push( new EventDirective( this$1, event, template ) );
				});
			});
		};

		Component.prototype.shuffled = function shuffled () {
			this.liveQueries.forEach( makeDirty );
			Item.prototype.shuffled.call(this);
		};

		Component.prototype.toString = function toString () {
			return this.instance.toHTML();
		};

		Component.prototype.unbind = function unbind$1 () {
			this.bound = false;

			this.attributes.forEach( unbind );

			var instance = this.instance;
			instance.viewmodel.teardown();
			instance.fragment.unbind();
			instance._observers.forEach( cancel );

			removeFromLiveComponentQueries( this );

			if ( instance.el && instance.el.__ractive_instances__ ) {
				removeFromArray( instance.el.__ractive_instances__, instance );
			}

			teardownHook.fire( instance );
		};

		Component.prototype.unrender = function unrender$1 ( shouldDestroy ) {
			var this$1 = this;

			this.rendered = false;

			this.shouldDestroy = shouldDestroy;
			this.instance.unrender();
			this.attributes.forEach( unrender );
			this.eventHandlers.forEach( unrender );
			this.liveQueries.forEach( function ( query ) { return query.remove( this$1.instance ); } );
		};

		Component.prototype.update = function update$1 () {
			this.dirty = false;
			this.instance.fragment.update();
			this.checkYielders();
			this.attributes.forEach( update );
			this.eventHandlers.forEach( update );
		};

		return Component;
	}(Item));

	var missingDecorator = {
		update: noop,
		teardown: noop
	};

	var Decorator = function Decorator ( options ) {
		this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.parentFragment = this.owner.parentFragment;
		this.ractive = this.owner.ractive;
		var template = this.template = options.template;

		this.dynamicName = typeof template.f.n === 'object';
		this.dynamicArgs = !!template.f.d;

		if ( this.dynamicName ) {
			this.nameFragment = new Fragment({
				owner: this,
				template: template.f.n
			});
		} else {
			this.name = template.f.n || template.f;
		}

		if ( this.dynamicArgs ) {
			this.argsFragment = new Fragment({
				owner: this,
				template: template.f.d
			});
		} else {
			if ( template.f.a && template.f.a.s ) {
				this.args = [];
			} else {
				this.args = template.f.a || [];
			}
		}

		this.node = null;
		this.intermediary = null;

		this.element.decorators.push( this );
	};

	Decorator.prototype.bind = function bind () {
		var this$1 = this;

			if ( this.dynamicName ) {
			this.nameFragment.bind();
			this.name = this.nameFragment.toString();
		}

		if ( this.dynamicArgs ) this.argsFragment.bind();

		// TODO: dry this up once deprecation is done
		if ( this.template.f.a && this.template.f.a.s ) {
			this.resolvers = [];
			this.models = this.template.f.a.r.map( function ( ref, i ) {
				var resolver;
				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
			this.argsFn = getFunction( this.template.f.a.s, this.template.f.a.r.length );
		}
	};

	Decorator.prototype.bubble = function bubble () {
		if ( !this.dirty ) {
			this.dirty = true;
			this.owner.bubble();
		}
	};

	Decorator.prototype.destroyed = function destroyed () {
		if ( this.intermediary ) this.intermediary.teardown();
		this.shouldDestroy = true;
	};

	Decorator.prototype.handleChange = function handleChange () { this.bubble(); };

	Decorator.prototype.rebinding = function rebinding ( next, previous, safe ) {
		var idx = this.models.indexOf( previous );
		if ( !~idx ) return;

		next = rebindMatch( this.template.f.a.r[ idx ], next, previous );
		if ( next === previous ) return;

		previous.unregister( this );
		this.models.splice( idx, 1, next );
		if ( next ) next.addShuffleRegister( this, 'mark' );

		if ( !safe ) this.bubble();
	};

	Decorator.prototype.render = function render () {
		var this$1 = this;

			runloop.scheduleTask( function () {
			var fn = findInViewHierarchy( 'decorators', this$1.ractive, this$1.name );

			if ( !fn ) {
				warnOnce( missingPlugin( this$1.name, 'decorator' ) );
				this$1.intermediary = missingDecorator;
				return;
			}

			this$1.node = this$1.element.node;

			var args;
			if ( this$1.argsFn ) {
				args = this$1.models.map( function ( model ) {
					if ( !model ) return undefined;

					return model.get();
				});
				args = this$1.argsFn.apply( this$1.ractive, args );
			} else {
				args = this$1.dynamicArgs ? this$1.argsFragment.getArgsList() : this$1.args;
			}

			this$1.intermediary = fn.apply( this$1.ractive, [ this$1.node ].concat( args ) );

			if ( !this$1.intermediary || !this$1.intermediary.teardown ) {
				throw new Error( ("The '" + (this$1.name) + "' decorator must return an object with a teardown method") );
			}

			// watch out for decorators that cause their host element to be unrendered
			if ( this$1.shouldDestroy ) this$1.destroyed();
		}, true );
		this.rendered = true;
	};

	Decorator.prototype.toString = function toString () { return ''; };

	Decorator.prototype.unbind = function unbind$1 () {
		var this$1 = this;

			if ( this.dynamicName ) this.nameFragment.unbind();
		if ( this.dynamicArgs ) this.argsFragment.unbind();
		if ( this.resolvers ) this.resolvers.forEach( unbind );
		if ( this.models ) this.models.forEach( function ( m ) {
			if ( m ) m.unregister( this$1 );
		});
	};

	Decorator.prototype.unrender = function unrender ( shouldDestroy ) {
		if ( ( !shouldDestroy || this.element.rendered ) && this.intermediary ) this.intermediary.teardown();
		this.rendered = false;
	};

	Decorator.prototype.update = function update () {
		if ( !this.dirty ) return;

		this.dirty = false;

		var nameChanged = false;

		if ( this.dynamicName && this.nameFragment.dirty ) {
			var name = this.nameFragment.toString();
			nameChanged = name !== this.name;
			this.name = name;
		}

		if ( this.intermediary ) {
			if ( nameChanged || !this.intermediary.update ) {
				this.unrender();
				this.render();
			}
			else {
				if ( this.dynamicArgs ) {
					if ( this.argsFragment.dirty ) {
						var args = this.argsFragment.getArgsList();
						this.intermediary.update.apply( this.ractive, args );
					}
				}
				else if ( this.argsFn ) {
					var args$1 = this.models.map( function ( model ) {
						if ( !model ) return undefined;

						return model.get();
					});
					this.intermediary.update.apply( this.ractive, this.argsFn.apply( this.ractive, args$1 ) );
				}
				else {
					this.intermediary.update.apply( this.ractive, this.args );
				}
			}
		}

		// need to run these for unrender/render cases
		// so can't just be in conditional if above

		if ( this.dynamicName && this.nameFragment.dirty ) {
			this.nameFragment.update();
		}

		if ( this.dynamicArgs && this.argsFragment.dirty ) {
			this.argsFragment.update();
		}
	};

	var Doctype = (function (Item) {
		function Doctype () {
			Item.apply(this, arguments);
		}

		Doctype.prototype = Object.create( Item && Item.prototype );
		Doctype.prototype.constructor = Doctype;

		Doctype.prototype.bind = function bind () {
			// noop
		};

		Doctype.prototype.render = function render () {
			// noop
		};

		Doctype.prototype.teardown = function teardown () {
			// noop
		};

		Doctype.prototype.toString = function toString () {
			return '<!DOCTYPE' + this.template.a + '>';
		};

		Doctype.prototype.unbind = function unbind () {
			// noop
		};

		Doctype.prototype.unrender = function unrender () {
			// noop
		};

		Doctype.prototype.update = function update () {
			// noop
		};

		return Doctype;
	}(Item));

	function updateLiveQueries$1 ( element ) {
		// Does this need to be added to any live queries?
		var node = element.node;
		var instance = element.ractive;

		do {
			var liveQueries = instance._liveQueries;

			var i = liveQueries.length;
			while ( i-- ) {
				var selector = liveQueries[i];
				var query = liveQueries[ ("_" + selector) ];

				if ( query.test( node ) ) {
					query.add( node );
					// keep register of applicable selectors, for when we teardown
					element.liveQueries.push( query );
				}
			}
		} while ( instance = instance.parent );
	}

	function warnAboutAmbiguity ( description, ractive ) {
		warnOnceIfDebug( ("The " + description + " being used for two-way binding is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity"), { ractive: ractive });
	}

	var Binding = function Binding ( element, name ) {
		if ( name === void 0 ) name = 'value';

			this.element = element;
		this.ractive = element.ractive;
		this.attribute = element.attributeByName[ name ];

		var interpolator = this.attribute.interpolator;
		interpolator.twowayBinding = this;

		var model = interpolator.model;

		// not bound?
		if ( !model ) {
			// try to force resolution
			interpolator.resolver.forceResolution();
			model = interpolator.model;

			warnAboutAmbiguity( ("'" + (interpolator.template.r) + "' reference"), this.ractive );
			}

			else if ( model.isUnresolved ) {
				// reference expressions (e.g. foo[bar])
				model.forceResolution();
				warnAboutAmbiguity( 'expression', this.ractive );
		}

		// TODO include index/key/keypath refs as read-only
		else if ( model.isReadonly ) {
			var keypath = model.getKeypath().replace( /^@/, '' );
			warnOnceIfDebug( ("Cannot use two-way binding on <" + (element.name) + "> element: " + keypath + " is read-only. To suppress this warning use <" + (element.name) + " twoway='false'...>"), { ractive: this.ractive });
			return false;
		}

		this.attribute.isTwoway = true;
		this.model = model;

		// initialise value, if it's undefined
		var value = model.get();
		this.wasUndefined = value === undefined;

		if ( value === undefined && this.getInitialValue ) {
			value = this.getInitialValue();
			model.set( value );
		}
		this.lastVal( true, value );

		var parentForm = findElement( this.element, false, 'form' );
		if ( parentForm ) {
			this.resetValue = value;
			parentForm.formBindings.push( this );
		}
	};

	Binding.prototype.bind = function bind () {
		this.model.registerTwowayBinding( this );
	};

	Binding.prototype.handleChange = function handleChange () {
		var this$1 = this;

			var value = this.getValue();
		if ( this.lastVal() === value ) return;

		runloop.start( this.root );
		this.attribute.locked = true;
		this.model.set( value );
		this.lastVal( true, value );

		// if the value changes before observers fire, unlock to be updatable cause something weird and potentially freezy is up
		if ( this.model.get() !== value ) this.attribute.locked = false;
		else runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );

		runloop.end();
	};

	Binding.prototype.lastVal = function lastVal ( setting, value ) {
		if ( setting ) this.lastValue = value;
		else return this.lastValue;
	};

	Binding.prototype.rebinding = function rebinding ( next, previous ) {
		var this$1 = this;

			if ( this.model && this.model === previous ) previous.unregisterTwowayBinding( this );
		if ( next ) {
			this.model = next;
			runloop.scheduleTask( function () { return next.registerTwowayBinding( this$1 ); } );
		}
	};

	Binding.prototype.render = function render () {
		this.node = this.element.node;
		this.node._ractive.binding = this;
		this.rendered = true; // TODO is this used anywhere?
	};

		Binding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.value );
	};

	Binding.prototype.unbind = function unbind () {
		this.model.unregisterTwowayBinding( this );
	};

	Binding.prototype.unrender = function unrender () {
			// noop?
		};

	// This is the handler for DOM events that would lead to a change in the model
	// (i.e. change, sometimes, input, and occasionally click and keyup)
	function handleDomEvent () {
		this._ractive.binding.handleChange();
	}

	var CheckboxBinding = (function (Binding) {
		function CheckboxBinding ( element ) {
			Binding.call( this, element, 'checked' );
		}

		CheckboxBinding.prototype = Object.create( Binding && Binding.prototype );
		CheckboxBinding.prototype.constructor = CheckboxBinding;

		CheckboxBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.node.attachEvent ) {
				this.node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		CheckboxBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
			this.node.removeEventListener( 'click', handleDomEvent, false );
		};

		CheckboxBinding.prototype.getInitialValue = function getInitialValue () {
			return !!this.element.getAttribute( 'checked' );
		};

		CheckboxBinding.prototype.getValue = function getValue () {
			return this.node.checked;
		};

		CheckboxBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.checked );
		};

		return CheckboxBinding;
	}(Binding));

	function getBindingGroup ( group, model, getValue ) {
		var hash = "" + group + "-bindingGroup";
		return model[hash] || ( model[ hash ] = new BindingGroup( hash, model, getValue ) );
	}

	var BindingGroup = function BindingGroup ( hash, model, getValue ) {
		var this$1 = this;

			this.model = model;
		this.hash = hash;
		this.getValue = function () {
			this$1.value = getValue.call(this$1);
			return this$1.value;
		};

		this.bindings = [];
	};

	BindingGroup.prototype.add = function add ( binding ) {
		this.bindings.push( binding );
	};

	BindingGroup.prototype.bind = function bind () {
		this.value = this.model.get();
		this.model.registerTwowayBinding( this );
		this.bound = true;
	};

		BindingGroup.prototype.remove = function remove ( binding ) {
		removeFromArray( this.bindings, binding );
		if ( !this.bindings.length ) {
			this.unbind();
		}
	};

	BindingGroup.prototype.unbind = function unbind () {
		this.model.unregisterTwowayBinding( this );
		this.bound = false;
		delete this.model[this.hash];
	};

	BindingGroup.prototype.rebinding = Binding.prototype.rebinding;

	var push$2 = [].push;

	function getValue() {
		var all = this.bindings.filter(function ( b ) { return b.node && b.node.checked; }).map(function ( b ) { return b.element.getAttribute( 'value' ); });
		var res = [];
		all.forEach(function ( v ) { if ( !arrayContains( res, v ) ) res.push( v ); });
		return res;
	}

	var CheckboxNameBinding = (function (Binding) {
		function CheckboxNameBinding ( element ) {
			Binding.call( this, element, 'name' );

			this.checkboxName = true; // so that ractive.updateModel() knows what to do with this

			// Each input has a reference to an array containing it and its
			// group, as two-way binding depends on being able to ascertain
			// the status of all inputs within the group
			this.group = getBindingGroup( 'checkboxes', this.model, getValue );
			this.group.add( this );

			if ( this.noInitialValue ) {
				this.group.noInitialValue = true;
			}

			// If no initial value was set, and this input is checked, we
			// update the model
			if ( this.group.noInitialValue && this.element.getAttribute( 'checked' ) ) {
				var existingValue = this.model.get();
				var bindingValue = this.element.getAttribute( 'value' );

				if ( !arrayContains( existingValue, bindingValue ) ) {
					push$2.call( existingValue, bindingValue ); // to avoid triggering runloop with array adaptor
				}
			}
		}

		CheckboxNameBinding.prototype = Object.create( Binding && Binding.prototype );
		CheckboxNameBinding.prototype.constructor = CheckboxNameBinding;

		CheckboxNameBinding.prototype.bind = function bind () {
			if ( !this.group.bound ) {
				this.group.bind();
			}
		};

		CheckboxNameBinding.prototype.changed = function changed () {
			var wasChecked = !!this.isChecked;
			this.isChecked = this.node.checked;
			return this.isChecked === wasChecked;
		};

		CheckboxNameBinding.prototype.getInitialValue = function getInitialValue () {
			// This only gets called once per group (of inputs that
			// share a name), because it only gets called if there
			// isn't an initial value. By the same token, we can make
			// a note of that fact that there was no initial value,
			// and populate it using any `checked` attributes that
			// exist (which users should avoid, but which we should
			// support anyway to avoid breaking expectations)
			this.noInitialValue = true; // TODO are noInitialValue and wasUndefined the same thing?
			return [];
		};

		CheckboxNameBinding.prototype.getValue = function getValue$1 () {
			return this.group.value;
		};

		CheckboxNameBinding.prototype.handleChange = function handleChange () {
			this.isChecked = this.element.node.checked;
			this.group.value = this.model.get();
			var value = this.element.getAttribute( 'value' );
			if ( this.isChecked && !arrayContains( this.group.value, value ) ) {
				this.group.value.push( value );
			} else if ( !this.isChecked && arrayContains( this.group.value, value ) ) {
				removeFromArray( this.group.value, value );
			}
			// make sure super knows there's a change
			this.lastValue = null;
			Binding.prototype.handleChange.call(this);
		};

		CheckboxNameBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			var existingValue = this.model.get();
			var bindingValue = this.element.getAttribute( 'value' );

			if ( isArray( existingValue ) ) {
				this.isChecked = arrayContains( existingValue, bindingValue );
			} else {
				this.isChecked = existingValue == bindingValue;
			}

			node.name = '{{' + this.model.getKeypath() + '}}';
			node.checked = this.isChecked;

			node.addEventListener( 'change', handleDomEvent, false );

			// in case of IE emergency, bind to click event as well
			if ( node.attachEvent ) {
				node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		CheckboxNameBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.group.bindings.forEach( function ( binding ) { return binding.wasUndefined = true; } );

			if ( node.checked ) {
				var valueSoFar = this.group.getValue();
				valueSoFar.push( this.element.getAttribute( 'value' ) );

				this.group.model.set( valueSoFar );
			}
		};

		CheckboxNameBinding.prototype.unbind = function unbind () {
			this.group.remove( this );
		};

		CheckboxNameBinding.prototype.unrender = function unrender () {
			var node = this.element.node;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'click', handleDomEvent, false );
		};

		return CheckboxNameBinding;
	}(Binding));

	var ContentEditableBinding = (function (Binding) {
		function ContentEditableBinding () {
			Binding.apply(this, arguments);
		}

		ContentEditableBinding.prototype = Object.create( Binding && Binding.prototype );
		ContentEditableBinding.prototype.constructor = ContentEditableBinding;

		ContentEditableBinding.prototype.getInitialValue = function getInitialValue () {
			return this.element.fragment ? this.element.fragment.toString() : '';
		};

		ContentEditableBinding.prototype.getValue = function getValue () {
			return this.element.node.innerHTML;
		};

		ContentEditableBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			node.addEventListener( 'change', handleDomEvent, false );
			node.addEventListener( 'blur', handleDomEvent, false );

			if ( !this.ractive.lazy ) {
				node.addEventListener( 'input', handleDomEvent, false );

				if ( node.attachEvent ) {
					node.addEventListener( 'keyup', handleDomEvent, false );
				}
			}
		};

		ContentEditableBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.innerHTML );
		};

		ContentEditableBinding.prototype.unrender = function unrender () {
			var node = this.node;

			node.removeEventListener( 'blur', handleDomEvent, false );
			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'input', handleDomEvent, false );
			node.removeEventListener( 'keyup', handleDomEvent, false );
		};

		return ContentEditableBinding;
	}(Binding));

	function handleBlur () {
		handleDomEvent.call( this );

		var value = this._ractive.binding.model.get();
		this.value = value == undefined ? '' : value;
	}

	function handleDelay ( delay ) {
		var timeout;

		return function () {
			var this$1 = this;

			if ( timeout ) clearTimeout( timeout );

			timeout = setTimeout( function () {
				var binding = this$1._ractive.binding;
				if ( binding.rendered ) handleDomEvent.call( this$1 );
				timeout = null;
			}, delay );
		};
	}

	var GenericBinding = (function (Binding) {
		function GenericBinding () {
			Binding.apply(this, arguments);
		}

		GenericBinding.prototype = Object.create( Binding && Binding.prototype );
		GenericBinding.prototype.constructor = GenericBinding;

		GenericBinding.prototype.getInitialValue = function getInitialValue () {
			return '';
		};

		GenericBinding.prototype.getValue = function getValue () {
			return this.node.value;
		};

		GenericBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			// any lazy setting for this element overrides the root
			// if the value is a number, it's a timeout
			var lazy = this.ractive.lazy;
			var timeout = false;

			if ( 'lazy' in this.element ) {
				lazy = this.element.lazy;
			}

			if ( isNumeric( lazy ) ) {
				timeout = +lazy;
				lazy = false;
			}

			this.handler = timeout ? handleDelay( timeout ) : handleDomEvent;

			var node = this.node;

			node.addEventListener( 'change', handleDomEvent, false );

			if ( !lazy ) {
				node.addEventListener( 'input', this.handler, false );

				if ( node.attachEvent ) {
					node.addEventListener( 'keyup', this.handler, false );
				}
			}

			node.addEventListener( 'blur', handleBlur, false );
		};

		GenericBinding.prototype.unrender = function unrender () {
			var node = this.element.node;
			this.rendered = false;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'input', this.handler, false );
			node.removeEventListener( 'keyup', this.handler, false );
			node.removeEventListener( 'blur', handleBlur, false );
		};

		return GenericBinding;
	}(Binding));

	var FileBinding = (function (GenericBinding) {
		function FileBinding () {
			GenericBinding.apply(this, arguments);
		}

		FileBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
		FileBinding.prototype.constructor = FileBinding;

		FileBinding.prototype.getInitialValue = function getInitialValue () {
			return undefined;
		};

		FileBinding.prototype.getValue = function getValue () {
			return this.node.files;
		};

		FileBinding.prototype.render = function render () {
			this.element.lazy = false;
			GenericBinding.prototype.render.call(this);
		};

		FileBinding.prototype.setFromNode = function setFromNode( node ) {
			this.model.set( node.files );
		};

		return FileBinding;
	}(GenericBinding));

	function getSelectedOptions ( select ) {
	    return select.selectedOptions
			? toArray( select.selectedOptions )
			: select.options
				? toArray( select.options ).filter( function ( option ) { return option.selected; } )
				: [];
	}

	var MultipleSelectBinding = (function (Binding) {
		function MultipleSelectBinding () {
			Binding.apply(this, arguments);
		}

		MultipleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
		MultipleSelectBinding.prototype.constructor = MultipleSelectBinding;

		MultipleSelectBinding.prototype.forceUpdate = function forceUpdate () {
			var this$1 = this;

			var value = this.getValue();

			if ( value !== undefined ) {
				this.attribute.locked = true;
				runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );
				this.model.set( value );
			}
		};

		MultipleSelectBinding.prototype.getInitialValue = function getInitialValue () {
			return this.element.options
				.filter( function ( option ) { return option.getAttribute( 'selected' ); } )
				.map( function ( option ) { return option.getAttribute( 'value' ); } );
		};

		MultipleSelectBinding.prototype.getValue = function getValue () {
			var options = this.element.node.options;
			var len = options.length;

			var selectedValues = [];

			for ( var i = 0; i < len; i += 1 ) {
				var option = options[i];

				if ( option.selected ) {
					var optionValue = option._ractive ? option._ractive.value : option.value;
					selectedValues.push( optionValue );
				}
			}

			return selectedValues;
		};

		MultipleSelectBinding.prototype.handleChange = function handleChange () {
			var attribute = this.attribute;
			var previousValue = attribute.getValue();

			var value = this.getValue();

			if ( previousValue === undefined || !arrayContentsMatch( value, previousValue ) ) {
				Binding.prototype.handleChange.call(this);
			}

			return this;
		};

		MultipleSelectBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.model.get() === undefined ) {
				// get value from DOM, if possible
				this.handleChange();
			}
		};

		MultipleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
			var selectedOptions = getSelectedOptions( node );
			var i = selectedOptions.length;
			var result = new Array( i );

			while ( i-- ) {
				var option = selectedOptions[i];
				result[i] = option._ractive ? option._ractive.value : option.value;
			}

			this.model.set( result );
		};

		MultipleSelectBinding.prototype.setValue = function setValue () {
			throw new Error( 'TODO not implemented yet' );
		};

		MultipleSelectBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
		};

		MultipleSelectBinding.prototype.updateModel = function updateModel () {
			if ( this.attribute.value === undefined || !this.attribute.value.length ) {
				this.keypath.set( this.initialValue );
			}
		};

		return MultipleSelectBinding;
	}(Binding));

	var NumericBinding = (function (GenericBinding) {
		function NumericBinding () {
			GenericBinding.apply(this, arguments);
		}

		NumericBinding.prototype = Object.create( GenericBinding && GenericBinding.prototype );
		NumericBinding.prototype.constructor = NumericBinding;

		NumericBinding.prototype.getInitialValue = function getInitialValue () {
			return undefined;
		};

		NumericBinding.prototype.getValue = function getValue () {
			var value = parseFloat( this.node.value );
			return isNaN( value ) ? undefined : value;
		};

		NumericBinding.prototype.setFromNode = function setFromNode( node ) {
			var value = parseFloat( node.value );
			if ( !isNaN( value ) ) this.model.set( value );
		};

		return NumericBinding;
	}(GenericBinding));

	var siblings = {};

	function getSiblings ( hash ) {
		return siblings[ hash ] || ( siblings[ hash ] = [] );
	}

	var RadioBinding = (function (Binding) {
		function RadioBinding ( element ) {
			Binding.call( this, element, 'checked' );

			this.siblings = getSiblings( this.ractive._guid + this.element.getAttribute( 'name' ) );
			this.siblings.push( this );
		}

		RadioBinding.prototype = Object.create( Binding && Binding.prototype );
		RadioBinding.prototype.constructor = RadioBinding;

		RadioBinding.prototype.getValue = function getValue () {
			return this.node.checked;
		};

		RadioBinding.prototype.handleChange = function handleChange () {
			runloop.start( this.root );

			this.siblings.forEach( function ( binding ) {
				binding.model.set( binding.getValue() );
			});

			runloop.end();
		};

		RadioBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			this.node.addEventListener( 'change', handleDomEvent, false );

			if ( this.node.attachEvent ) {
				this.node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		RadioBinding.prototype.setFromNode = function setFromNode ( node ) {
			this.model.set( node.checked );
		};

		RadioBinding.prototype.unbind = function unbind () {
			removeFromArray( this.siblings, this );
		};

		RadioBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
			this.node.removeEventListener( 'click', handleDomEvent, false );
		};

		return RadioBinding;
	}(Binding));

	function getValue$1() {
		var checked = this.bindings.filter( function ( b ) { return b.node.checked; } );
		if ( checked.length > 0 ) {
			return checked[0].element.getAttribute( 'value' );
		}
	}

	var RadioNameBinding = (function (Binding) {
		function RadioNameBinding ( element ) {
			Binding.call( this, element, 'name' );

			this.group = getBindingGroup( 'radioname', this.model, getValue$1 );
			this.group.add( this );

			if ( element.checked ) {
				this.group.value = this.getValue();
			}
		}

		RadioNameBinding.prototype = Object.create( Binding && Binding.prototype );
		RadioNameBinding.prototype.constructor = RadioNameBinding;

		RadioNameBinding.prototype.bind = function bind () {
			var this$1 = this;

			if ( !this.group.bound ) {
				this.group.bind();
			}

			// update name keypath when necessary
			this.nameAttributeBinding = {
				handleChange: function () { return this$1.node.name = "{{" + (this$1.model.getKeypath()) + "}}"; },
				rebinding: noop
			};

			this.model.getKeypathModel().register( this.nameAttributeBinding );
		};

		RadioNameBinding.prototype.getInitialValue = function getInitialValue () {
			if ( this.element.getAttribute( 'checked' ) ) {
				return this.element.getAttribute( 'value' );
			}
		};

		RadioNameBinding.prototype.getValue = function getValue$1 () {
			return this.element.getAttribute( 'value' );
		};

		RadioNameBinding.prototype.handleChange = function handleChange () {
			// If this <input> is the one that's checked, then the value of its
			// `name` model gets set to its value
			if ( this.node.checked ) {
				this.group.value = this.getValue();
				Binding.prototype.handleChange.call(this);
			}
		};

		RadioNameBinding.prototype.lastVal = function lastVal ( setting, value ) {
			if ( !this.group ) return;
			if ( setting ) this.group.lastValue = value;
			else return this.group.lastValue;
		};

		RadioNameBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);

			var node = this.node;

			node.name = "{{" + (this.model.getKeypath()) + "}}";
			node.checked = this.model.get() == this.element.getAttribute( 'value' );

			node.addEventListener( 'change', handleDomEvent, false );

			if ( node.attachEvent ) {
				node.addEventListener( 'click', handleDomEvent, false );
			}
		};

		RadioNameBinding.prototype.setFromNode = function setFromNode ( node ) {
			if ( node.checked ) {
				this.group.model.set( this.element.getAttribute( 'value' ) );
			}
		};

		RadioNameBinding.prototype.unbind = function unbind () {
			this.group.remove( this );

			this.model.getKeypathModel().unregister( this.nameAttributeBinding );
		};

		RadioNameBinding.prototype.unrender = function unrender () {
			var node = this.node;

			node.removeEventListener( 'change', handleDomEvent, false );
			node.removeEventListener( 'click', handleDomEvent, false );
		};

		return RadioNameBinding;
	}(Binding));

	var SingleSelectBinding = (function (Binding) {
		function SingleSelectBinding () {
			Binding.apply(this, arguments);
		}

		SingleSelectBinding.prototype = Object.create( Binding && Binding.prototype );
		SingleSelectBinding.prototype.constructor = SingleSelectBinding;

		SingleSelectBinding.prototype.forceUpdate = function forceUpdate () {
			var this$1 = this;

			var value = this.getValue();

			if ( value !== undefined ) {
				this.attribute.locked = true;
				runloop.scheduleTask( function () { return this$1.attribute.locked = false; } );
				this.model.set( value );
			}
		};

		SingleSelectBinding.prototype.getInitialValue = function getInitialValue () {
			if ( this.element.getAttribute( 'value' ) !== undefined ) {
				return;
			}

			var options = this.element.options;
			var len = options.length;

			if ( !len ) return;

			var value;
			var optionWasSelected;
			var i = len;

			// take the final selected option...
			while ( i-- ) {
				var option = options[i];

				if ( option.getAttribute( 'selected' ) ) {
					if ( !option.getAttribute( 'disabled' ) ) {
						value = option.getAttribute( 'value' );
					}

					optionWasSelected = true;
					break;
				}
			}

			// or the first non-disabled option, if none are selected
			if ( !optionWasSelected ) {
				while ( ++i < len ) {
					if ( !options[i].getAttribute( 'disabled' ) ) {
						value = options[i].getAttribute( 'value' );
						break;
					}
				}
			}

			// This is an optimisation (aka hack) that allows us to forgo some
			// other more expensive work
			// TODO does it still work? seems at odds with new architecture
			if ( value !== undefined ) {
				this.element.attributeByName.value.value = value;
			}

			return value;
		};

		SingleSelectBinding.prototype.getValue = function getValue () {
			var options = this.node.options;
			var len = options.length;

			var i;
			for ( i = 0; i < len; i += 1 ) {
				var option = options[i];

				if ( options[i].selected && !options[i].disabled ) {
					return option._ractive ? option._ractive.value : option.value;
				}
			}
		};

		SingleSelectBinding.prototype.render = function render () {
			Binding.prototype.render.call(this);
			this.node.addEventListener( 'change', handleDomEvent, false );
		};

		SingleSelectBinding.prototype.setFromNode = function setFromNode ( node ) {
			var option = getSelectedOptions( node )[0];
			this.model.set( option._ractive ? option._ractive.value : option.value );
		};

		// TODO this method is an anomaly... is it necessary?
		SingleSelectBinding.prototype.setValue = function setValue ( value ) {
			this.model.set( value );
		};

		SingleSelectBinding.prototype.unrender = function unrender () {
			this.node.removeEventListener( 'change', handleDomEvent, false );
		};

		return SingleSelectBinding;
	}(Binding));

	function isBindable ( attribute ) {
		return attribute &&
			   attribute.template.f &&
		       attribute.template.f.length === 1 &&
		       attribute.template.f[0].t === INTERPOLATOR &&
		       !attribute.template.f[0].s;
	}

	function selectBinding ( element ) {
		var attributes = element.attributeByName;

		// contenteditable - bind if the contenteditable attribute is true
		// or is bindable and may thus become true...
		if ( element.getAttribute( 'contenteditable' ) || isBindable( attributes.contenteditable ) ) {
			// ...and this element also has a value attribute to bind
			return isBindable( attributes.value ) ? ContentEditableBinding : null;
		}

		// <input>
		if ( element.name === 'input' ) {
			var type = element.getAttribute( 'type' );

			if ( type === 'radio' || type === 'checkbox' ) {
				var bindName = isBindable( attributes.name );
				var bindChecked = isBindable( attributes.checked );

				// for radios we can either bind the name attribute, or the checked attribute - not both
				if ( bindName && bindChecked ) {
					if ( type === 'radio' ) {
						warnIfDebug( 'A radio input can have two-way binding on its name attribute, or its checked attribute - not both', { ractive: element.root });
					} else {
						// A checkbox with bindings for both name and checked - see https://github.com/ractivejs/ractive/issues/1749
						return CheckboxBinding;
					}
				}

				if ( bindName ) {
					return type === 'radio' ? RadioNameBinding : CheckboxNameBinding;
				}

				if ( bindChecked ) {
					return type === 'radio' ? RadioBinding : CheckboxBinding;
				}
			}

			if ( type === 'file' && isBindable( attributes.value ) ) {
				return FileBinding;
			}

			if ( isBindable( attributes.value ) ) {
				return ( type === 'number' || type === 'range' ) ? NumericBinding : GenericBinding;
			}

			return null;
		}

		// <select>
		if ( element.name === 'select' && isBindable( attributes.value ) ) {
			return element.getAttribute( 'multiple' ) ? MultipleSelectBinding : SingleSelectBinding;
		}

		// <textarea>
		if ( element.name === 'textarea' && isBindable( attributes.value ) ) {
			return GenericBinding;
		}
	}

	function makeDirty$1 ( query ) {
		query.makeDirty();
	}

	var endsWithSemi = /;\s*$/;

	var Element = (function (Item) {
		function Element ( options ) {
			var this$1 = this;

			Item.call( this, options );

			this.liveQueries = []; // TODO rare case. can we handle differently?

			this.name = options.template.e.toLowerCase();
			this.isVoid = voidElementNames.test( this.name );

			// find parent element
			this.parent = findElement( this.parentFragment, false );

			if ( this.parent && this.parent.name === 'option' ) {
				throw new Error( ("An <option> element cannot contain other elements (encountered <" + (this.name) + ">)") );
			}

			this.decorators = [];

			// create attributes
			this.attributeByName = {};

			this.attributes = [];
			var leftovers = [];
			( this.template.m || [] ).forEach( function ( template ) {
				switch ( template.t ) {
					case ATTRIBUTE:
					case BINDING_FLAG:
					case DECORATOR:
					case EVENT:
					case TRANSITION:
						this$1.attributes.push( createItem({
							owner: this$1,
							parentFragment: this$1.parentFragment,
							template: template
						}) );
						break;

					default:
						leftovers.push( template );
						break;
				}
			});

			if ( leftovers.length ) {
				this.attributes.push( new ConditionalAttribute({
					owner: this,
					parentFragment: this.parentFragment,
					template: leftovers
				}) );
			}

			var i = this.attributes.length;
			while ( i-- ) {
				var attr = this$1.attributes[ i ];
				if ( attr.name === 'type' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'max' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'min' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'class' ) this$1.attributes.unshift( this$1.attributes.splice( i, 1 )[ 0 ] );
				else if ( attr.name === 'value' ) {
					this$1.attributes.push( this$1.attributes.splice( i, 1 )[ 0 ] );
				}
			}

			// create children
			if ( options.template.f && !options.deferContent ) {
				this.fragment = new Fragment({
					template: options.template.f,
					owner: this,
					cssIds: null
				});
			}

			this.binding = null; // filled in later
		}

		Element.prototype = Object.create( Item && Item.prototype );
		Element.prototype.constructor = Element;

		Element.prototype.bind = function bind$1$$ () {
			this.attributes.binding = true;
			this.attributes.forEach( bind$1 );
			this.attributes.binding = false;

			if ( this.fragment ) this.fragment.bind();

			// create two-way binding if necessary
			if ( !this.binding ) this.recreateTwowayBinding();
		};

		Element.prototype.createTwowayBinding = function createTwowayBinding () {
			var shouldBind = 'twoway' in this ? this.twoway : this.ractive.twoway;

			if ( !shouldBind ) return null;

			var Binding = selectBinding( this );

			if ( !Binding ) return null;

			var binding = new Binding( this );

			return binding && binding.model ?
				binding :
				null;
		};

		Element.prototype.destroyed = function destroyed () {
			this.attributes.forEach( function ( a ) { return a.destroyed(); } );
			if ( this.fragment ) this.fragment.destroyed();
		};

		Element.prototype.detach = function detach () {
			// if this element is no longer rendered, the transitions are complete and the attributes can be torn down
			if ( !this.rendered ) this.destroyed();

			return detachNode( this.node );
		};

		Element.prototype.find = function find ( selector ) {
			if ( this.node && matches( this.node, selector ) ) return this.node;
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Element.prototype.findAll = function findAll ( selector, query ) {
			// Add this node to the query, if applicable, and register the
			// query on this element
			var matches = query.test( this.node );
			if ( matches ) {
				query.add( this.node );
				if ( query.live ) this.liveQueries.push( query );
			}

			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Element.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Element.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Element.prototype.findNextNode = function findNextNode () {
			return null;
		};

		Element.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Element.prototype.getAttribute = function getAttribute ( name ) {
			var attribute = this.attributeByName[ name ];
			return attribute ? attribute.getValue() : undefined;
		};

		Element.prototype.recreateTwowayBinding = function recreateTwowayBinding () {
			if ( this.binding ) {
				this.binding.unbind();
				this.binding.unrender();
			}

			if ( this.binding = this.createTwowayBinding() ) {
				this.binding.bind();
				if ( this.rendered ) this.binding.render();
			}
		};

		Element.prototype.render = function render$1 ( target, occupants ) {
			// TODO determine correct namespace
			var this$1 = this;

			this.namespace = getNamespace( this );

			var node;
			var existing = false;

			if ( occupants ) {
				var n;
				while ( ( n = occupants.shift() ) ) {
					if ( n.nodeName.toUpperCase() === this$1.template.e.toUpperCase() && n.namespaceURI === this$1.namespace ) {
						this$1.node = node = n;
						existing = true;
						break;
					} else {
						detachNode( n );
					}
				}
			}

			if ( !node ) {
				node = createElement( this.template.e, this.namespace, this.getAttribute( 'is' ) );
				this.node = node;
			}

			defineProperty( node, '_ractive', {
				value: {
					proxy: this
				}
			});

			// Is this a top-level node of a component? If so, we may need to add
			// a data-ractive-css attribute, for CSS encapsulation
			if ( this.parentFragment.cssIds ) {
				node.setAttribute( 'data-ractive-css', this.parentFragment.cssIds.map( function ( x ) { return ("{" + x + "}"); } ).join( ' ' ) );
			}

			if ( existing && this.foundNode ) this.foundNode( node );

			if ( this.fragment ) {
				var children = existing ? toArray( node.childNodes ) : undefined;

				this.fragment.render( node, children );

				// clean up leftover children
				if ( children ) {
					children.forEach( detachNode );
				}
			}

			if ( existing ) {
				// store initial values for two-way binding
				if ( this.binding && this.binding.wasUndefined ) this.binding.setFromNode( node );
				// remove unused attributes
				var i = node.attributes.length;
				while ( i-- ) {
					var name = node.attributes[i].name;
					if ( !( name in this$1.attributeByName ) ) node.removeAttribute( name );
				}
			}

			this.attributes.forEach( render );

			if ( this.binding ) this.binding.render();

			updateLiveQueries$1( this );

			if ( this._introTransition && this.ractive.transitionsEnabled ) {
				this._introTransition.isIntro = true;
				runloop.registerTransition( this._introTransition );
			}

			if ( !existing ) {
				target.appendChild( node );
			}

			this.rendered = true;
		};

		Element.prototype.shuffled = function shuffled () {
			this.liveQueries.forEach( makeDirty$1 );
			Item.prototype.shuffled.call(this);
		};

		Element.prototype.toString = function toString () {
			var tagName = this.template.e;

			var attrs = this.attributes.map( stringifyAttribute ).join( '' );

			// Special case - selected options
			if ( this.name === 'option' && this.isSelected() ) {
				attrs += ' selected';
			}

			// Special case - two-way radio name bindings
			if ( this.name === 'input' && inputIsCheckedRadio( this ) ) {
				attrs += ' checked';
			}

			// Special case style and class attributes and directives
			var style, cls;
			this.attributes.forEach( function ( attr ) {
				if ( attr.name === 'class' ) {
					cls = ( cls || '' ) + ( cls ? ' ' : '' ) + safeAttributeString( attr.getString() );
				} else if ( attr.name === 'style' ) {
					style = ( style || '' ) + ( style ? ' ' : '' ) + safeAttributeString( attr.getString() );
					if ( style && !endsWithSemi.test( style ) ) style += ';';
				} else if ( attr.style ) {
					style = ( style || '' ) + ( style ? ' ' : '' ) +  "" + (attr.style) + ": " + (safeAttributeString( attr.getString() )) + ";";
				} else if ( attr.inlineClass && attr.getValue() ) {
					cls = ( cls || '' ) + ( cls ? ' ' : '' ) + attr.inlineClass;
				}
			});
			// put classes first, then inline style
			if ( style !== undefined ) attrs = ' style' + ( style ? ("=\"" + style + "\"") : '' ) + attrs;
			if ( cls !== undefined ) attrs = ' class' + (cls ? ("=\"" + cls + "\"") : '') + attrs;

			var str = "<" + tagName + "" + attrs + ">";

			if ( this.isVoid ) return str;

			// Special case - textarea
			if ( this.name === 'textarea' && this.getAttribute( 'value' ) !== undefined ) {
				str += escapeHtml( this.getAttribute( 'value' ) );
			}

			// Special case - contenteditable
			else if ( this.getAttribute( 'contenteditable' ) !== undefined ) {
				str += ( this.getAttribute( 'value' ) || '' );
			}

			if ( this.fragment ) {
				str += this.fragment.toString( !/^(?:script|style)$/i.test( this.template.e ) ); // escape text unless script/style
			}

			str += "</" + tagName + ">";
			return str;
		};

		Element.prototype.unbind = function unbind$1 () {
			this.attributes.unbinding = true;
			this.attributes.forEach( unbind );
			this.attributes.unbinding = false;

			if ( this.binding ) this.binding.unbind();
			if ( this.fragment ) this.fragment.unbind();
		};

		Element.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( !this.rendered ) return;
			this.rendered = false;

			// unrendering before intro completed? complete it now
			// TODO should be an API for aborting transitions
			var transition = this._introTransition;
			if ( transition && transition.complete ) transition.complete();

			// Detach as soon as we can
			if ( this.name === 'option' ) {
				// <option> elements detach immediately, so that
				// their parent <select> element syncs correctly, and
				// since option elements can't have transitions anyway
				this.detach();
			} else if ( shouldDestroy ) {
				runloop.detachWhenReady( this );
			}

			if ( this.fragment ) this.fragment.unrender();

			if ( this.binding ) this.binding.unrender();

			// outro transition
			if ( this._outroTransition && this.ractive.transitionsEnabled ) {
				this._outroTransition.isIntro = false;
				runloop.registerTransition( this._outroTransition );
			}

			removeFromLiveQueries( this );
			// TODO forms are a special case
		};

		Element.prototype.update = function update$1 () {
			if ( this.dirty ) {
				this.dirty = false;

				this.attributes.forEach( update );

				if ( this.fragment ) this.fragment.update();
			}
		};

		return Element;
	}(Item));

	function inputIsCheckedRadio ( element ) {
		var attributes = element.attributeByName;

		var typeAttribute  = attributes.type;
		var valueAttribute = attributes.value;
		var nameAttribute  = attributes.name;

		if ( !typeAttribute || ( typeAttribute.value !== 'radio' ) || !valueAttribute || !nameAttribute.interpolator ) {
			return;
		}

		if ( valueAttribute.getValue() === nameAttribute.interpolator.model.get() ) {
			return true;
		}
	}

	function stringifyAttribute ( attribute ) {
		var str = attribute.toString();
		return str ? ' ' + str : '';
	}

	function removeFromLiveQueries ( element ) {
		var i = element.liveQueries.length;
		while ( i-- ) {
			var query = element.liveQueries[i];
			query.remove( element.node );
		}
	}

	function getNamespace ( element ) {
		// Use specified namespace...
		var xmlns = element.getAttribute( 'xmlns' );
		if ( xmlns ) return xmlns;

		// ...or SVG namespace, if this is an <svg> element
		if ( element.name === 'svg' ) return svg$1;

		var parent = element.parent;

		if ( parent ) {
			// ...or HTML, if the parent is a <foreignObject>
			if ( parent.name === 'foreignobject' ) return html;

			// ...or inherit from the parent node
			return parent.node.namespaceURI;
		}

		return element.ractive.el.namespaceURI;
	}

	var Form = (function (Element) {
		function Form ( options ) {
			Element.call( this, options );
			this.formBindings = [];
		}

		Form.prototype = Object.create( Element && Element.prototype );
		Form.prototype.constructor = Form;

		Form.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.node.addEventListener( 'reset', handleReset, false );
		};

		Form.prototype.unrender = function unrender ( shouldDestroy ) {
			this.node.removeEventListener( 'reset', handleReset, false );
			Element.prototype.unrender.call( this, shouldDestroy );
		};

		return Form;
	}(Element));

	function handleReset () {
		var element = this._ractive.proxy;

		runloop.start();
		element.formBindings.forEach( updateModel$1 );
		runloop.end();
	}

	function updateModel$1 ( binding ) {
		binding.model.set( binding.resetValue );
	}

	var Mustache = (function (Item) {
		function Mustache ( options ) {
			Item.call( this, options );

			this.parentFragment = options.parentFragment;
			this.template = options.template;
			this.index = options.index;
			if ( options.owner ) this.parent = options.owner;

			this.isStatic = !!options.template.s;

			this.model = null;
			this.dirty = false;
		}

		Mustache.prototype = Object.create( Item && Item.prototype );
		Mustache.prototype.constructor = Mustache;

		Mustache.prototype.bind = function bind () {
			// try to find a model for this view
			var this$1 = this;

			var model = resolve$2( this.parentFragment, this.template );
			var value = model ? model.get() : undefined;

			if ( this.isStatic ) {
				this.model = { get: function () { return value; } };
				return;
			}

			if ( model ) {
				model.register( this );
				this.model = model;
			} else if ( this.template.r ) {
				this.resolver = this.parentFragment.resolve( this.template.r, function ( model ) {
					this$1.model = model;
					model.register( this$1 );

					this$1.handleChange();
					this$1.resolver = null;
				});
			}
		};

		Mustache.prototype.handleChange = function handleChange () {
			this.bubble();
		};

		Mustache.prototype.rebinding = function rebinding ( next, previous, safe ) {
			next = rebindMatch( this.template, next, previous );
			if ( this['static'] ) return false;
			if ( next === this.model ) return false;

			if ( this.model ) {
				this.model.unregister( this );
			}
			if ( next ) next.addShuffleRegister( this, 'mark' );
			this.model = next;
			if ( !safe ) this.handleChange();
			return true;
		};

		Mustache.prototype.unbind = function unbind () {
			if ( !this.isStatic ) {
				this.model && this.model.unregister( this );
				this.model = undefined;
				this.resolver && this.resolver.unbind();
			}
		};

		return Mustache;
	}(Item));

	var Interpolator = (function (Mustache) {
		function Interpolator () {
			Mustache.apply(this, arguments);
		}

		Interpolator.prototype = Object.create( Mustache && Mustache.prototype );
		Interpolator.prototype.constructor = Interpolator;

		Interpolator.prototype.bubble = function bubble () {
			if ( this.owner ) this.owner.bubble();
			Mustache.prototype.bubble.call(this);
		};

		Interpolator.prototype.detach = function detach () {
			return detachNode( this.node );
		};

		Interpolator.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Interpolator.prototype.getString = function getString () {
			return this.model ? safeToStringValue( this.model.get() ) : '';
		};

		Interpolator.prototype.render = function render ( target, occupants ) {
			if ( inAttributes() ) return;
			var value = this.getString();

			this.rendered = true;

			if ( occupants ) {
				var n = occupants[0];
				if ( n && n.nodeType === 3 ) {
					occupants.shift();
					if ( n.nodeValue !== value ) {
						n.nodeValue = value;
					}
				} else {
					n = this.node = doc.createTextNode( value );
					if ( occupants[0] ) {
						target.insertBefore( n, occupants[0] );
					} else {
						target.appendChild( n );
					}
				}

				this.node = n;
			} else {
				this.node = doc.createTextNode( value );
				target.appendChild( this.node );
			}
		};

		Interpolator.prototype.toString = function toString ( escape ) {
			var string = this.getString();
			return escape ? escapeHtml( string ) : string;
		};

		Interpolator.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( shouldDestroy ) this.detach();
			this.rendered = false;
		};

		Interpolator.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.rendered ) {
					this.node.data = this.getString();
				}
			}
		};

		Interpolator.prototype.valueOf = function valueOf () {
			return this.model ? this.model.get() : undefined;
		};

		return Interpolator;
	}(Mustache));

	var Input = (function (Element) {
		function Input () {
			Element.apply(this, arguments);
		}

		Input.prototype = Object.create( Element && Element.prototype );
		Input.prototype.constructor = Input;

		Input.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.node.defaultValue = this.node.value;
		};

		return Input;
	}(Element));

	var Mapping = (function (Item) {
		function Mapping ( options ) {
			Item.call( this, options );

			this.name = options.template.n;

			this.owner = options.owner || options.parentFragment.owner || options.element || findElement( options.parentFragment );
			this.element = options.element || (this.owner.attributeByName ? this.owner : findElement( options.parentFragment ) );
			this.parentFragment = this.element.parentFragment; // shared
			this.ractive = this.parentFragment.ractive;

			this.fragment = null;

			this.element.attributeByName[ this.name ] = this;

			this.value = options.template.f;
		}

		Mapping.prototype = Object.create( Item && Item.prototype );
		Mapping.prototype.constructor = Mapping;

		Mapping.prototype.bind = function bind () {
			if ( this.fragment ) {
				this.fragment.bind();
			}

			var template = this.template.f;
			var viewmodel = this.element.instance.viewmodel;

			if ( template === 0 ) {
				// empty attributes are `true`
				viewmodel.joinKey( this.name ).set( true );
			}

			else if ( typeof template === 'string' ) {
				var parsed = parseJSON( template );
				viewmodel.joinKey( this.name ).set( parsed ? parsed.value : template );
			}

			else if ( isArray( template ) ) {
				createMapping( this, true );
			}
		};

		Mapping.prototype.render = function render () {};

		Mapping.prototype.unbind = function unbind () {
			if ( this.fragment ) this.fragment.unbind();
			if ( this.model ) this.model.unregister( this );
			if ( this.boundFragment ) this.boundFragment.unbind();

			if ( this.element.bound ) {
				if ( this.link.target === this.model ) this.link.owner.unlink();
			}
		};

		Mapping.prototype.unrender = function unrender () {};

		Mapping.prototype.update = function update () {
			if ( this.dirty ) {
				this.dirty = false;
				if ( this.fragment ) this.fragment.update();
				if ( this.boundFragment ) this.boundFragment.update();
				if ( this.rendered ) this.updateDelegate();
			}
		};

		return Mapping;
	}(Item));

	function createMapping ( item ) {
		var template = item.template.f;
		var viewmodel = item.element.instance.viewmodel;
		var childData = viewmodel.value;

		if ( template.length === 1 && template[0].t === INTERPOLATOR ) {
			item.model = resolve$2( item.parentFragment, template[0] );

			if ( !item.model ) {
				warnOnceIfDebug( ("The " + (item.name) + "='{{" + (template[0].r) + "}}' mapping is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity"), { ractive: item.element.instance }); // TODO add docs page explaining item
				item.parentFragment.ractive.get( item.name ); // side-effect: create mappings as necessary
				item.model = item.parentFragment.findContext().joinKey( item.name );
			}

			item.link = viewmodel.createLink( item.name, item.model, template[0].r );

			if ( item.model.get() === undefined && !item.model.isReadonly && item.name in childData ) {
				item.model.set( childData[ item.name ] );
			}
		}

		else {
			item.boundFragment = new Fragment({
				owner: item,
				template: template
			}).bind();

			item.model = viewmodel.joinKey( item.name );
			item.model.set( item.boundFragment.valueOf() );

			// item is a *bit* of a hack
			item.boundFragment.bubble = function () {
				Fragment.prototype.bubble.call( item.boundFragment );
				// defer this to avoid mucking around model deps if there happens to be an expression involved
				runloop.scheduleTask(function () {
					item.boundFragment.update();
					item.model.set( item.boundFragment.valueOf() );
				});
			};
		}
	}

	var Option = (function (Element) {
		function Option ( options ) {
			var template = options.template;
			if ( !template.a ) template.a = {};

			// If the value attribute is missing, use the element's content,
			// as long as it isn't disabled
			if ( template.a.value === undefined && !( 'disabled' in template.a ) ) {
				template.a.value = template.f || '';
			}

			Element.call( this, options );

			this.select = findElement( this.parent || this.parentFragment, false, 'select' );
		}

		Option.prototype = Object.create( Element && Element.prototype );
		Option.prototype.constructor = Option;

		Option.prototype.bind = function bind () {
			if ( !this.select ) {
				Element.prototype.bind.call(this);
				return;
			}

			// If the select has a value, it overrides the `selected` attribute on
			// this option - so we delete the attribute
			var selectedAttribute = this.attributeByName.selected;
			if ( selectedAttribute && this.select.getAttribute( 'value' ) !== undefined ) {
				var index = this.attributes.indexOf( selectedAttribute );
				this.attributes.splice( index, 1 );
				delete this.attributeByName.selected;
			}

			Element.prototype.bind.call(this);
			this.select.options.push( this );
		};

		Option.prototype.bubble = function bubble () {
			// if we're using content as value, may need to update here
			var value = this.getAttribute( 'value' );
			if ( this.node && this.node.value !== value ) {
				this.node._ractive.value = value;
			}
			Element.prototype.bubble.call(this);
		};

		Option.prototype.getAttribute = function getAttribute ( name ) {
			var attribute = this.attributeByName[ name ];
			return attribute ? attribute.getValue() : name === 'value' && this.fragment ? this.fragment.valueOf() : undefined;
		};

		Option.prototype.isSelected = function isSelected () {
			var optionValue = this.getAttribute( 'value' );

			if ( optionValue === undefined || !this.select ) {
				return false;
			}

			var selectValue = this.select.getAttribute( 'value' );

			if ( selectValue == optionValue ) {
				return true;
			}

			if ( this.select.getAttribute( 'multiple' ) && isArray( selectValue ) ) {
				var i = selectValue.length;
				while ( i-- ) {
					if ( selectValue[i] == optionValue ) {
						return true;
					}
				}
			}
		};

		Option.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );

			if ( !this.attributeByName.value ) {
				this.node._ractive.value = this.getAttribute( 'value' );
			}
		};

		Option.prototype.unbind = function unbind () {
			Element.prototype.unbind.call(this);

			if ( this.select ) {
				removeFromArray( this.select.options, this );
			}
		};

		return Option;
	}(Element));

	function getPartialTemplate ( ractive, name, parentFragment ) {
		// If the partial in instance or view heirarchy instances, great
		var partial = getPartialFromRegistry( ractive, name, parentFragment || {} );
		if ( partial ) return partial;

		// Does it exist on the page as a script tag?
		partial = parser.fromId( name, { noThrow: true } );
		if ( partial ) {
			// parse and register to this ractive instance
			var parsed = parser.parseFor( partial, ractive );

			// register extra partials on the ractive instance if they don't already exist
			if ( parsed.p ) fillGaps( ractive.partials, parsed.p );

			// register (and return main partial if there are others in the template)
			return ractive.partials[ name ] = parsed.t;
		}
	}

	function getPartialFromRegistry ( ractive, name, parentFragment ) {
		// if there was an instance up-hierarchy, cool
		var partial = findParentPartial( name, parentFragment.owner );
		if ( partial ) return partial;

		// find first instance in the ractive or view hierarchy that has this partial
		var instance = findInstance( 'partials', ractive, name );

		if ( !instance ) { return; }

		partial = instance.partials[ name ];

		// partial is a function?
		var fn;
		if ( typeof partial === 'function' ) {
			fn = partial.bind( instance );
			fn.isOwner = instance.partials.hasOwnProperty(name);
			partial = fn.call( ractive, parser );
		}

		if ( !partial && partial !== '' ) {
			warnIfDebug( noRegistryFunctionReturn, name, 'partial', 'partial', { ractive: ractive });
			return;
		}

		// If this was added manually to the registry,
		// but hasn't been parsed, parse it now
		if ( !parser.isParsed( partial ) ) {
			// use the parseOptions of the ractive instance on which it was found
			var parsed = parser.parseFor( partial, instance );

			// Partials cannot contain nested partials!
			// TODO add a test for this
			if ( parsed.p ) {
				warnIfDebug( 'Partials ({{>%s}}) cannot contain nested inline partials', name, { ractive: ractive });
			}

			// if fn, use instance to store result, otherwise needs to go
			// in the correct point in prototype chain on instance or constructor
			var target = fn ? instance : findOwner( instance, name );

			// may be a template with partials, which need to be registered and main template extracted
			target.partials[ name ] = partial = parsed.t;
		}

		// store for reset
		if ( fn ) partial._fn = fn;

		return partial.v ? partial.t : partial;
	}

	function findOwner ( ractive, key ) {
		return ractive.partials.hasOwnProperty( key )
			? ractive
			: findConstructor( ractive.constructor, key);
	}

	function findConstructor ( constructor, key ) {
		if ( !constructor ) { return; }
		return constructor.partials.hasOwnProperty( key )
			? constructor
			: findConstructor( constructor._Parent, key );
	}

	function findParentPartial( name, parent ) {
		if ( parent ) {
			if ( parent.template && parent.template.p && parent.template.p[name] ) {
				return parent.template.p[name];
			} else if ( parent.parentFragment && parent.parentFragment.owner ) {
				return findParentPartial( name, parent.parentFragment.owner );
			}
		}
	}

	var Partial = (function (Mustache) {
		function Partial () {
			Mustache.apply(this, arguments);
		}

		Partial.prototype = Object.create( Mustache && Mustache.prototype );
		Partial.prototype.constructor = Partial;

		Partial.prototype.bind = function bind () {
			// keep track of the reference name for future resets
			this.refName = this.template.r;

			// name matches take priority over expressions
			var template = this.refName ? getPartialTemplate( this.ractive, this.refName, this.parentFragment ) || null : null;
			var templateObj;

			if ( template ) {
				this.named = true;
				this.setTemplate( this.template.r, template );
			}

			if ( !template ) {
				Mustache.prototype.bind.call(this);
				if ( this.model && ( templateObj = this.model.get() ) && typeof templateObj === 'object' && ( typeof templateObj.template === 'string' || isArray( templateObj.t ) ) ) {
					if ( templateObj.template ) {
						this.source = templateObj.template;
						templateObj = parsePartial( this.template.r, templateObj.template, this.ractive );
					} else {
						this.source = templateObj.t;
					}
					this.setTemplate( this.template.r, templateObj.t );
				} else if ( ( !this.model || typeof this.model.get() !== 'string' ) && this.refName ) {
					this.setTemplate( this.refName, template );
				} else {
					this.setTemplate( this.model.get() );
				}
			}

			this.fragment = new Fragment({
				owner: this,
				template: this.partialTemplate
			}).bind();
		};

		Partial.prototype.detach = function detach () {
			return this.fragment.detach();
		};

		Partial.prototype.find = function find ( selector ) {
			return this.fragment.find( selector );
		};

		Partial.prototype.findAll = function findAll ( selector, query ) {
			this.fragment.findAll( selector, query );
		};

		Partial.prototype.findComponent = function findComponent ( name ) {
			return this.fragment.findComponent( name );
		};

		Partial.prototype.findAllComponents = function findAllComponents ( name, query ) {
			this.fragment.findAllComponents( name, query );
		};

		Partial.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment.firstNode( skipParent );
		};

		Partial.prototype.forceResetTemplate = function forceResetTemplate () {
			var this$1 = this;

			this.partialTemplate = undefined;

			// on reset, check for the reference name first
			if ( this.refName ) {
				this.partialTemplate = getPartialTemplate( this.ractive, this.refName, this.parentFragment );
			}

			// then look for the resolved name
			if ( !this.partialTemplate ) {
				this.partialTemplate = getPartialTemplate( this.ractive, this.name, this.parentFragment );
			}

			if ( !this.partialTemplate ) {
				warnOnceIfDebug( ("Could not find template for partial '" + (this.name) + "'") );
				this.partialTemplate = [];
			}

			if ( this.inAttribute ) {
				doInAttributes( function () { return this$1.fragment.resetTemplate( this$1.partialTemplate ); } );
			} else {
				this.fragment.resetTemplate( this.partialTemplate );
			}

			this.bubble();
		};

		Partial.prototype.render = function render ( target, occupants ) {
			this.fragment.render( target, occupants );
		};

		Partial.prototype.setTemplate = function setTemplate ( name, template ) {
			this.name = name;

			if ( !template && template !== null ) template = getPartialTemplate( this.ractive, name, this.parentFragment );

			if ( !template ) {
				warnOnceIfDebug( ("Could not find template for partial '" + name + "'") );
			}

			this.partialTemplate = template || [];
		};

		Partial.prototype.toString = function toString ( escape ) {
			return this.fragment.toString( escape );
		};

		Partial.prototype.unbind = function unbind () {
			Mustache.prototype.unbind.call(this);
			this.fragment.unbind();
		};

		Partial.prototype.unrender = function unrender ( shouldDestroy ) {
			this.fragment.unrender( shouldDestroy );
		};

		Partial.prototype.update = function update () {
			var template;

			if ( this.dirty ) {
				this.dirty = false;

				if ( !this.named ) {
					if ( this.model ) {
						template = this.model.get();
					}

					if ( template && typeof template === 'string' && template !== this.name ) {
						this.setTemplate( template );
						this.fragment.resetTemplate( this.partialTemplate );
					} else if ( template && typeof template === 'object' && ( typeof template.template === 'string' || isArray( template.t ) ) ) {
						if ( template.t !== this.source && template.template !== this.source ) {
							if ( template.template ) {
								this.source = template.template;
								template = parsePartial( this.name, template.template, this.ractive );
							} else {
								this.source = template.t;
							}
							this.setTemplate( this.name, template.t );
							this.fragment.resetTemplate( this.partialTemplate );
						}
					}
				}

				this.fragment.update();
			}
		};

		return Partial;
	}(Mustache));

	function parsePartial( name, partial, ractive ) {
		var parsed;

		try {
			parsed = parser.parse( partial, parser.getParseOptions( ractive ) );
		} catch (e) {
			warnIfDebug( ("Could not parse partial from expression '" + name + "'\n" + (e.message)) );
		}

		return parsed || { t: [] };
	}

	var RepeatedFragment = function RepeatedFragment ( options ) {
		this.parent = options.owner.parentFragment;

		// bit of a hack, so reference resolution works without another
		// layer of indirection
		this.parentFragment = this;
		this.owner = options.owner;
		this.ractive = this.parent.ractive;

		// encapsulated styles should be inherited until they get applied by an element
		this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

		this.context = null;
		this.rendered = false;
		this.iterations = [];

		this.template = options.template;

		this.indexRef = options.indexRef;
		this.keyRef = options.keyRef;

		this.pendingNewIndices = null;
		this.previousIterations = null;

		// track array versus object so updates of type rest
		this.isArray = false;
	};

	RepeatedFragment.prototype.bind = function bind ( context ) {
		var this$1 = this;

			this.context = context;
		var value = context.get();

		// {{#each array}}...
		if ( this.isArray = isArray( value ) ) {
			// we can't use map, because of sparse arrays
			this.iterations = [];
			var max = value.length;
			for ( var i = 0; i < max; i += 1 ) {
				this$1.iterations[i] = this$1.createIteration( i, i );
			}
		}

		// {{#each object}}...
		else if ( isObject( value ) ) {
			this.isArray = false;

			// TODO this is a dreadful hack. There must be a neater way
			if ( this.indexRef ) {
				var refs = this.indexRef.split( ',' );
				this.keyRef = refs[0];
				this.indexRef = refs[1];
			}

			this.iterations = Object.keys( value ).map( function ( key, index ) {
				return this$1.createIteration( key, index );
			});
		}

		return this;
	};

	RepeatedFragment.prototype.bubble = function bubble () {
		this.owner.bubble();
	};

	RepeatedFragment.prototype.createIteration = function createIteration ( key, index ) {
		var fragment = new Fragment({
			owner: this,
			template: this.template
		});

		// TODO this is a bit hacky
		fragment.key = key;
		fragment.index = index;
		fragment.isIteration = true;

		var model = this.context.joinKey( key );

		// set up an iteration alias if there is one
		if ( this.owner.template.z ) {
			fragment.aliases = {};
			fragment.aliases[ this.owner.template.z[0].n ] = model;
		}

		return fragment.bind( model );
	};

	RepeatedFragment.prototype.destroyed = function destroyed () {
		this.iterations.forEach( function ( i ) { return i.destroyed(); } );
	};

	RepeatedFragment.prototype.detach = function detach () {
		var docFrag = createDocumentFragment();
		this.iterations.forEach( function ( fragment ) { return docFrag.appendChild( fragment.detach() ); } );
		return docFrag;
	};

	RepeatedFragment.prototype.find = function find ( selector ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.iterations[i].find( selector );
			if ( found ) return found;
		}
	};

	RepeatedFragment.prototype.findAll = function findAll ( selector, query ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			this$1.iterations[i].findAll( selector, query );
		}
	};

	RepeatedFragment.prototype.findComponent = function findComponent ( name ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.iterations[i].findComponent( name );
			if ( found ) return found;
		}
	};

	RepeatedFragment.prototype.findAllComponents = function findAllComponents ( name, query ) {
		var this$1 = this;

			var len = this.iterations.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			this$1.iterations[i].findAllComponents( name, query );
		}
	};

	RepeatedFragment.prototype.findNextNode = function findNextNode ( iteration ) {
		var this$1 = this;

			if ( iteration.index < this.iterations.length - 1 ) {
			for ( var i = iteration.index + 1; i < this$1.iterations.length; i++ ) {
				var node = this$1.iterations[ i ].firstNode( true );
				if ( node ) return node;
			}
		}

		return this.owner.findNextNode();
	};

	RepeatedFragment.prototype.firstNode = function firstNode ( skipParent ) {
		return this.iterations[0] ? this.iterations[0].firstNode( skipParent ) : null;
	};

	RepeatedFragment.prototype.rebinding = function rebinding ( next ) {
		var this$1 = this;

			this.context = next;
		this.iterations.forEach( function ( fragment ) {
			var model = next ? next.joinKey( fragment.key || fragment.index ) : undefined;
			fragment.context = model;
			if ( this$1.owner.template.z ) {
				fragment.aliases = {};
				fragment.aliases[ this$1.owner.template.z[0].n ] = model;
			}
		});
	};

	RepeatedFragment.prototype.render = function render ( target, occupants ) {
		// TODO use docFrag.cloneNode...

		if ( this.iterations ) {
			this.iterations.forEach( function ( fragment ) { return fragment.render( target, occupants ); } );
		}

		this.rendered = true;
	};

	RepeatedFragment.prototype.shuffle = function shuffle ( newIndices ) {
		var this$1 = this;

			if ( !this.pendingNewIndices ) this.previousIterations = this.iterations.slice();

		if ( !this.pendingNewIndices ) this.pendingNewIndices = [];

		this.pendingNewIndices.push( newIndices );

		var iterations = [];

		newIndices.forEach( function ( newIndex, oldIndex ) {
			if ( newIndex === -1 ) return;

			var fragment = this$1.iterations[ oldIndex ];
			iterations[ newIndex ] = fragment;

			if ( newIndex !== oldIndex && fragment ) fragment.dirty = true;
		});

		this.iterations = iterations;

		this.bubble();
	};

	RepeatedFragment.prototype.shuffled = function shuffled () {
		this.iterations.forEach( function ( i ) { return i.shuffled(); } );
	};

	RepeatedFragment.prototype.toString = function toString$1$$ ( escape ) {
		return this.iterations ?
			this.iterations.map( escape ? toEscapedString : toString$1 ).join( '' ) :
			'';
	};

	RepeatedFragment.prototype.unbind = function unbind$1 () {
		this.iterations.forEach( unbind );
		return this;
	};

	RepeatedFragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
		this.iterations.forEach( shouldDestroy ? unrenderAndDestroy : unrender );
		if ( this.pendingNewIndices && this.previousIterations ) {
			this.previousIterations.forEach( function ( fragment ) {
				if ( fragment.rendered ) shouldDestroy ? unrenderAndDestroy( fragment ) : unrender( fragment );
			});
		}
		this.rendered = false;
	};

	// TODO smart update
	RepeatedFragment.prototype.update = function update$1 () {
		// skip dirty check, since this is basically just a facade

		var this$1 = this;

			if ( this.pendingNewIndices ) {
			this.updatePostShuffle();
			return;
		}

		if ( this.updating ) return;
		this.updating = true;

		var value = this.context.get(),
				  wasArray = this.isArray;

		var toRemove;
		var oldKeys;
		var reset = true;
		var i;

		if ( this.isArray = isArray( value ) ) {
			if ( wasArray ) {
				reset = false;
				if ( this.iterations.length > value.length ) {
					toRemove = this.iterations.splice( value.length );
				}
			}
		} else if ( isObject( value ) && !wasArray ) {
			reset = false;
			toRemove = [];
			oldKeys = {};
			i = this.iterations.length;

			while ( i-- ) {
				var fragment$1 = this$1.iterations[i];
				if ( fragment$1.key in value ) {
					oldKeys[ fragment$1.key ] = true;
				} else {
					this$1.iterations.splice( i, 1 );
					toRemove.push( fragment$1 );
				}
			}
		}

		if ( reset ) {
			toRemove = this.iterations;
			this.iterations = [];
		}

		if ( toRemove ) {
			toRemove.forEach( function ( fragment ) {
				fragment.unbind();
				fragment.unrender( true );
			});
		}

		// update the remaining ones
		this.iterations.forEach( update );

		// add new iterations
		var newLength = isArray( value ) ?
			value.length :
			isObject( value ) ?
				Object.keys( value ).length :
				0;

		var docFrag;
		var fragment;

		if ( newLength > this.iterations.length ) {
			docFrag = this.rendered ? createDocumentFragment() : null;
			i = this.iterations.length;

			if ( isArray( value ) ) {
				while ( i < value.length ) {
					fragment = this$1.createIteration( i, i );

					this$1.iterations.push( fragment );
					if ( this$1.rendered ) fragment.render( docFrag );

					i += 1;
				}
			}

			else if ( isObject( value ) ) {
				// TODO this is a dreadful hack. There must be a neater way
				if ( this.indexRef && !this.keyRef ) {
					var refs = this.indexRef.split( ',' );
					this.keyRef = refs[0];
					this.indexRef = refs[1];
				}

				Object.keys( value ).forEach( function ( key ) {
					if ( !oldKeys || !( key in oldKeys ) ) {
						fragment = this$1.createIteration( key, i );

						this$1.iterations.push( fragment );
						if ( this$1.rendered ) fragment.render( docFrag );

						i += 1;
					}
				});
			}

			if ( this.rendered ) {
				var parentNode = this.parent.findParentNode();
				var anchor = this.parent.findNextNode( this.owner );

				parentNode.insertBefore( docFrag, anchor );
			}
		}

		this.updating = false;
	};

	RepeatedFragment.prototype.updatePostShuffle = function updatePostShuffle () {
		var this$1 = this;

			var newIndices = this.pendingNewIndices[ 0 ];

		// map first shuffle through
		this.pendingNewIndices.slice( 1 ).forEach( function ( indices ) {
			newIndices.forEach( function ( newIndex, oldIndex ) {
				newIndices[ oldIndex ] = indices[ newIndex ];
			});
		});

		// This algorithm (for detaching incorrectly-ordered fragments from the DOM and
		// storing them in a document fragment for later reinsertion) seems a bit hokey,
		// but it seems to work for now
		var len = this.context.get().length, oldLen = this.previousIterations.length;
		var i;
		var removed = {};

		newIndices.forEach( function ( newIndex, oldIndex ) {
			var fragment = this$1.previousIterations[ oldIndex ];
			this$1.previousIterations[ oldIndex ] = null;

			if ( newIndex === -1 ) {
				removed[ oldIndex ] = fragment;
			} else if ( fragment.index !== newIndex ) {
				var model = this$1.context.joinKey( newIndex );
				fragment.index = fragment.key = newIndex;
				fragment.context = model;
				if ( this$1.owner.template.z ) {
					fragment.aliases = {};
					fragment.aliases[ this$1.owner.template.z[0].n ] = model;
				}
			}
		});

		// if the array was spliced outside of ractive, sometimes there are leftover fragments not in the newIndices
		this.previousIterations.forEach( function ( frag, i ) {
			if ( frag ) removed[ i ] = frag;
		});

		// create new/move existing iterations
		var docFrag = this.rendered ? createDocumentFragment() : null;
		var parentNode = this.rendered ? this.parent.findParentNode() : null;

		var contiguous = 'startIndex' in newIndices;
		i = contiguous ? newIndices.startIndex : 0;

		for ( i; i < len; i++ ) {
			var frag = this$1.iterations[i];

			if ( frag && contiguous ) {
				// attach any built-up iterations
				if ( this$1.rendered ) {
					if ( removed[i] ) docFrag.appendChild( removed[i].detach() );
					if ( docFrag.childNodes.length  ) parentNode.insertBefore( docFrag, frag.firstNode() );
				}
				continue;
			}

			if ( !frag ) this$1.iterations[i] = this$1.createIteration( i, i );

			if ( this$1.rendered ) {
				if ( removed[i] ) docFrag.appendChild( removed[i].detach() );

				if ( frag ) docFrag.appendChild( frag.detach() );
				else {
					this$1.iterations[i].render( docFrag );
				}
			}
		}

		// append any leftovers
		if ( this.rendered ) {
			for ( i = len; i < oldLen; i++ ) {
				if ( removed[i] ) docFrag.appendChild( removed[i].detach() );
			}

			if ( docFrag.childNodes.length ) {
				parentNode.insertBefore( docFrag, this.owner.findNextNode() );
			}
		}

		// trigger removal on old nodes
		Object.keys( removed ).forEach( function ( k ) { return removed[k].unbind().unrender( true ); } );

		this.iterations.forEach( update );

		this.pendingNewIndices = null;

		this.shuffled();
	};

	function isEmpty ( value ) {
		return !value ||
		       ( isArray( value ) && value.length === 0 ) ||
			   ( isObject( value ) && Object.keys( value ).length === 0 );
	}

	function getType ( value, hasIndexRef ) {
		if ( hasIndexRef || isArray( value ) ) return SECTION_EACH;
		if ( isObject( value ) || typeof value === 'function' ) return SECTION_IF_WITH;
		if ( value === undefined ) return null;
		return SECTION_IF;
	}

	var Section = (function (Mustache) {
		function Section ( options ) {
			Mustache.call( this, options );

			this.sectionType = options.template.n || null;
			this.templateSectionType = this.sectionType;
			this.subordinate = options.template.l === 1;
			this.fragment = null;
		}

		Section.prototype = Object.create( Mustache && Mustache.prototype );
		Section.prototype.constructor = Section;

		Section.prototype.bind = function bind () {
			Mustache.prototype.bind.call(this);

			if ( this.subordinate ) {
				this.sibling = this.parentFragment.items[ this.parentFragment.items.indexOf( this ) - 1 ];
				this.sibling.nextSibling = this;
			}

			// if we managed to bind, we need to create children
			if ( this.model ) {
				this.dirty = true;
				this.update();
			} else if ( this.sectionType && this.sectionType === SECTION_UNLESS && ( !this.sibling || !this.sibling.isTruthy() ) ) {
				this.fragment = new Fragment({
					owner: this,
					template: this.template.f
				}).bind();
			}
		};

		Section.prototype.detach = function detach () {
			return this.fragment ? this.fragment.detach() : createDocumentFragment();
		};

		Section.prototype.find = function find ( selector ) {
			if ( this.fragment ) {
				return this.fragment.find( selector );
			}
		};

		Section.prototype.findAll = function findAll ( selector, query ) {
			if ( this.fragment ) {
				this.fragment.findAll( selector, query );
			}
		};

		Section.prototype.findComponent = function findComponent ( name ) {
			if ( this.fragment ) {
				return this.fragment.findComponent( name );
			}
		};

		Section.prototype.findAllComponents = function findAllComponents ( name, query ) {
			if ( this.fragment ) {
				this.fragment.findAllComponents( name, query );
			}
		};

		Section.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment && this.fragment.firstNode( skipParent );
		};

		Section.prototype.isTruthy = function isTruthy () {
			if ( this.subordinate && this.sibling.isTruthy() ) return true;
			var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
			return !!value && ( this.templateSectionType === SECTION_IF_WITH || !isEmpty( value ) );
		};

		Section.prototype.rebinding = function rebinding ( next, previous, safe ) {
			if ( Mustache.prototype.rebinding.call( this, next, previous, safe ) ) {
				if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
					this.fragment.rebinding( next, previous );
				}
			}
		};

		Section.prototype.render = function render ( target, occupants ) {
			this.rendered = true;
			if ( this.fragment ) this.fragment.render( target, occupants );
		};

		Section.prototype.shuffle = function shuffle ( newIndices ) {
			if ( this.fragment && this.sectionType === SECTION_EACH ) {
				this.fragment.shuffle( newIndices );
			}
		};

		Section.prototype.toString = function toString ( escape ) {
			return this.fragment ? this.fragment.toString( escape ) : '';
		};

		Section.prototype.unbind = function unbind () {
			Mustache.prototype.unbind.call(this);
			if ( this.fragment ) this.fragment.unbind();
		};

		Section.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && this.fragment ) this.fragment.unrender( shouldDestroy );
			this.rendered = false;
		};

		Section.prototype.update = function update () {
			if ( !this.dirty ) return;

			if ( this.fragment && this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ) {
				this.fragment.context = this.model;
			}

			if ( !this.model && this.sectionType !== SECTION_UNLESS ) return;

			this.dirty = false;

			var value = !this.model ? undefined : this.model.isRoot ? this.model.value : this.model.get();
			var siblingFalsey = !this.subordinate || !this.sibling.isTruthy();
			var lastType = this.sectionType;

			// watch for switching section types
			if ( this.sectionType === null || this.templateSectionType === null ) this.sectionType = getType( value, this.template.i );
			if ( lastType && lastType !== this.sectionType && this.fragment ) {
				if ( this.rendered ) {
					this.fragment.unbind().unrender( true );
				}

				this.fragment = null;
			}

			var newFragment;

			var fragmentShouldExist = this.sectionType === SECTION_EACH || // each always gets a fragment, which may have no iterations
			                            this.sectionType === SECTION_WITH || // with (partial context) always gets a fragment
			                            ( siblingFalsey && ( this.sectionType === SECTION_UNLESS ? !this.isTruthy() : this.isTruthy() ) ); // if, unless, and if-with depend on siblings and the condition

			if ( fragmentShouldExist ) {
				if ( this.fragment ) {
					this.fragment.update();
				} else {
					if ( this.sectionType === SECTION_EACH ) {
						newFragment = new RepeatedFragment({
							owner: this,
							template: this.template.f,
							indexRef: this.template.i
						}).bind( this.model );
					} else {
		 				// only with and if-with provide context - if and unless do not
						var context = this.sectionType !== SECTION_IF && this.sectionType !== SECTION_UNLESS ? this.model : null;
						newFragment = new Fragment({
							owner: this,
							template: this.template.f
						}).bind( context );
					}
				}
			} else {
				if ( this.fragment ) {
					this.fragment.unbind();
					if ( this.rendered ) this.fragment.unrender( true );
				}

				this.fragment = null;
			}

			if ( newFragment ) {
				if ( this.rendered ) {
					var parentNode = this.parentFragment.findParentNode();
					var anchor = this.parentFragment.findNextNode( this );

					if ( anchor ) {
						var docFrag = createDocumentFragment();
						newFragment.render( docFrag );

						// we use anchor.parentNode, not parentNode, because the sibling
						// may be temporarily detached as a result of a shuffle
						anchor.parentNode.insertBefore( docFrag, anchor );
					} else {
						newFragment.render( parentNode );
					}
				}

				this.fragment = newFragment;
			}

			if ( this.nextSibling ) {
				this.nextSibling.dirty = true;
				this.nextSibling.update();
			}
		};

		return Section;
	}(Mustache));

	function valueContains ( selectValue, optionValue ) {
		var i = selectValue.length;
		while ( i-- ) {
			if ( selectValue[i] == optionValue ) return true;
		}
	}

	var Select = (function (Element) {
		function Select ( options ) {
			Element.call( this, options );
			this.options = [];
		}

		Select.prototype = Object.create( Element && Element.prototype );
		Select.prototype.constructor = Select;

		Select.prototype.foundNode = function foundNode ( node ) {
			if ( this.binding ) {
				var selectedOptions = getSelectedOptions( node );

				if ( selectedOptions.length > 0 ) {
					this.selectedOptions = selectedOptions;
				}
			}
		};

		Select.prototype.render = function render ( target, occupants ) {
			Element.prototype.render.call( this, target, occupants );
			this.sync();

			var node = this.node;

			var i = node.options.length;
			while ( i-- ) {
				node.options[i].defaultSelected = node.options[i].selected;
			}

			this.rendered = true;
		};

		Select.prototype.sync = function sync () {
			var this$1 = this;

			var selectNode = this.node;

			if ( !selectNode ) return;

			var options = toArray( selectNode.options );

			if ( this.selectedOptions ) {
				options.forEach( function ( o ) {
					if ( this$1.selectedOptions.indexOf( o ) >= 0 ) o.selected = true;
					else o.selected = false;
				});
				this.binding.setFromNode( selectNode );
				delete this.selectedOptions;
				return;
			}

			var selectValue = this.getAttribute( 'value' );
			var isMultiple = this.getAttribute( 'multiple' );
			var array = isMultiple && isArray( selectValue );

			// If the <select> has a specified value, that should override
			// these options
			if ( selectValue !== undefined ) {
				var optionWasSelected;

				options.forEach( function ( o ) {
					var optionValue = o._ractive ? o._ractive.value : o.value;
					var shouldSelect = isMultiple ? array && valueContains( selectValue, optionValue ) : selectValue == optionValue;

					if ( shouldSelect ) {
						optionWasSelected = true;
					}

					o.selected = shouldSelect;
				});

				if ( !optionWasSelected && !isMultiple ) {
					if ( this.binding ) {
						this.binding.forceUpdate();
					}
				}
			}

			// Otherwise the value should be initialised according to which
			// <option> element is selected, if twoway binding is in effect
			else if ( this.binding ) {
				this.binding.forceUpdate();
			}
		};

		Select.prototype.update = function update () {
			var dirty = this.dirty;
			Element.prototype.update.call(this);
			if ( dirty ) {
				this.sync();
			}
		};

		return Select;
	}(Element));

	var Textarea = (function (Input) {
		function Textarea( options ) {
			var template = options.template;

			options.deferContent = true;

			Input.call( this, options );

			// check for single interpolator binding
			if ( !this.attributeByName.value ) {
				if ( template.f && isBindable( { template: template } ) ) {
					this.attributes.push( createItem( {
						owner: this,
						template: { t: ATTRIBUTE, f: template.f, n: 'value' },
						parentFragment: this.parentFragment
					} ) );
				} else {
					this.fragment = new Fragment({ owner: this, cssIds: null, template: template.f });
				}
			}
		}

		Textarea.prototype = Object.create( Input && Input.prototype );
		Textarea.prototype.constructor = Textarea;

		Textarea.prototype.bubble = function bubble () {
			var this$1 = this;

			if ( !this.dirty ) {
				this.dirty = true;

				if ( this.rendered && !this.binding && this.fragment ) {
					runloop.scheduleTask( function () {
						this$1.dirty = false;
						this$1.node.value = this$1.fragment.toString();
					});
				}

				this.parentFragment.bubble(); // default behaviour
			}
		};

		return Textarea;
	}(Input));

	var Text = (function (Item) {
		function Text ( options ) {
			Item.call( this, options );
			this.type = TEXT;
		}

		Text.prototype = Object.create( Item && Item.prototype );
		Text.prototype.constructor = Text;

		Text.prototype.bind = function bind () {
			// noop
		};

		Text.prototype.detach = function detach () {
			return detachNode( this.node );
		};

		Text.prototype.firstNode = function firstNode () {
			return this.node;
		};

		Text.prototype.render = function render ( target, occupants ) {
			if ( inAttributes() ) return;
			this.rendered = true;

			if ( occupants ) {
				var n = occupants[0];
				if ( n && n.nodeType === 3 ) {
					occupants.shift();
					if ( n.nodeValue !== this.template ) {
						n.nodeValue = this.template;
					}
				} else {
					n = this.node = doc.createTextNode( this.template );
					if ( occupants[0] ) {
						target.insertBefore( n, occupants[0] );
					} else {
						target.appendChild( n );
					}
				}

				this.node = n;
			} else {
				this.node = doc.createTextNode( this.template );
				target.appendChild( this.node );
			}
		};

		Text.prototype.toString = function toString ( escape ) {
			return escape ? escapeHtml( this.template ) : this.template;
		};

		Text.prototype.unbind = function unbind () {
			// noop
		};

		Text.prototype.unrender = function unrender ( shouldDestroy ) {
			if ( this.rendered && shouldDestroy ) this.detach();
			this.rendered = false;
		};

		Text.prototype.update = function update () {
			// noop
		};

		Text.prototype.valueOf = function valueOf () {
			return this.template;
		};

		return Text;
	}(Item));

	function camelCase ( hyphenatedStr ) {
		return hyphenatedStr.replace( /-([a-zA-Z])/g, function ( match, $1 ) {
			return $1.toUpperCase();
		});
	}

	var prefix;

	if ( !isClient ) {
		prefix = null;
	} else {
		var prefixCache = {};
		var testStyle = createElement( 'div' ).style;

		prefix = function ( prop ) {
			prop = camelCase( prop );

			if ( !prefixCache[ prop ] ) {
				if ( testStyle[ prop ] !== undefined ) {
					prefixCache[ prop ] = prop;
				}

				else {
					// test vendors...
					var capped = prop.charAt( 0 ).toUpperCase() + prop.substring( 1 );

					var i = vendors.length;
					while ( i-- ) {
						var vendor = vendors[i];
						if ( testStyle[ vendor + capped ] !== undefined ) {
							prefixCache[ prop ] = vendor + capped;
							break;
						}
					}
				}
			}

			return prefixCache[ prop ];
		};
	}

	var prefix$1 = prefix;

	var visible;
	var hidden = 'hidden';

	if ( doc ) {
		var prefix$2;

		if ( hidden in doc ) {
			prefix$2 = '';
		} else {
			var i$1 = vendors.length;
			while ( i$1-- ) {
				var vendor = vendors[i$1];
				hidden = vendor + 'Hidden';

				if ( hidden in doc ) {
					prefix$2 = vendor;
					break;
				}
			}
		}

		if ( prefix$2 !== undefined ) {
			doc.addEventListener( prefix$2 + 'visibilitychange', onChange );
			onChange();
		} else {
			// gah, we're in an old browser
			if ( 'onfocusout' in doc ) {
				doc.addEventListener( 'focusout', onHide );
				doc.addEventListener( 'focusin', onShow );
			}

			else {
				win.addEventListener( 'pagehide', onHide );
				win.addEventListener( 'blur', onHide );

				win.addEventListener( 'pageshow', onShow );
				win.addEventListener( 'focus', onShow );
			}

			visible = true; // until proven otherwise. Not ideal but hey
		}
	}

	function onChange () {
		visible = !doc[ hidden ];
	}

	function onHide () {
		visible = false;
	}

	function onShow () {
		visible = true;
	}

	var unprefixPattern = new RegExp( '^-(?:' + vendors.join( '|' ) + ')-' );

	function unprefix ( prop ) {
		return prop.replace( unprefixPattern, '' );
	}

	var vendorPattern = new RegExp( '^(?:' + vendors.join( '|' ) + ')([A-Z])' );

	function hyphenate ( str ) {
		if ( !str ) return ''; // edge case

		if ( vendorPattern.test( str ) ) str = '-' + str;

		return str.replace( /[A-Z]/g, function ( match ) { return '-' + match.toLowerCase(); } );
	}

	var createTransitions;

	if ( !isClient ) {
		createTransitions = null;
	} else {
		var testStyle$1 = createElement( 'div' ).style;
		var linear$1 = function ( x ) { return x; };

		var canUseCssTransitions = {};
		var cannotUseCssTransitions = {};

		// determine some facts about our environment
		var TRANSITION$1;
		var TRANSITIONEND;
		var CSS_TRANSITIONS_ENABLED;
		var TRANSITION_DURATION;
		var TRANSITION_PROPERTY;
		var TRANSITION_TIMING_FUNCTION;

		if ( testStyle$1.transition !== undefined ) {
			TRANSITION$1 = 'transition';
			TRANSITIONEND = 'transitionend';
			CSS_TRANSITIONS_ENABLED = true;
		} else if ( testStyle$1.webkitTransition !== undefined ) {
			TRANSITION$1 = 'webkitTransition';
			TRANSITIONEND = 'webkitTransitionEnd';
			CSS_TRANSITIONS_ENABLED = true;
		} else {
			CSS_TRANSITIONS_ENABLED = false;
		}

		if ( TRANSITION$1 ) {
			TRANSITION_DURATION = TRANSITION$1 + 'Duration';
			TRANSITION_PROPERTY = TRANSITION$1 + 'Property';
			TRANSITION_TIMING_FUNCTION = TRANSITION$1 + 'TimingFunction';
		}

		createTransitions = function ( t, to, options, changedProperties, resolve ) {

			// Wait a beat (otherwise the target styles will be applied immediately)
			// TODO use a fastdom-style mechanism?
			setTimeout( function () {
				var jsTransitionsComplete;
				var cssTransitionsComplete;
				var cssTimeout;

				function transitionDone () { clearTimeout( cssTimeout ); }

				function checkComplete () {
					if ( jsTransitionsComplete && cssTransitionsComplete ) {
						t.unregisterCompleteHandler( transitionDone );
						// will changes to events and fire have an unexpected consequence here?
						t.ractive.fire( t.name + ':end', t.node, t.isIntro );
						resolve();
					}
				}

				// this is used to keep track of which elements can use CSS to animate
				// which properties
				var hashPrefix = ( t.node.namespaceURI || '' ) + t.node.tagName;

				// need to reset transition properties
				var style = t.node.style;
				var previous = {
					property: style[ TRANSITION_PROPERTY ],
					timing: style[ TRANSITION_TIMING_FUNCTION ],
					duration: style[ TRANSITION_DURATION ]
				};

				style[ TRANSITION_PROPERTY ] = changedProperties.map( prefix$1 ).map( hyphenate ).join( ',' );
				style[ TRANSITION_TIMING_FUNCTION ] = hyphenate( options.easing || 'linear' );
				style[ TRANSITION_DURATION ] = ( options.duration / 1000 ) + 's';

				function transitionEndHandler ( event ) {
					var index = changedProperties.indexOf( camelCase( unprefix( event.propertyName ) ) );

					if ( index !== -1 ) {
						changedProperties.splice( index, 1 );
					}

					if ( changedProperties.length ) {
						// still transitioning...
						return;
					}

					clearTimeout( cssTimeout );
					cssTransitionsDone();
				}

				function cssTransitionsDone () {
					style[ TRANSITION_PROPERTY ] = previous.property;
					style[ TRANSITION_TIMING_FUNCTION ] = previous.duration;
					style[ TRANSITION_DURATION ] = previous.timing;

					t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );

					cssTransitionsComplete = true;
					checkComplete();
				}

				t.node.addEventListener( TRANSITIONEND, transitionEndHandler, false );

				// safety net in case transitionend never fires
				cssTimeout = setTimeout( function () {
					changedProperties = [];
					cssTransitionsDone();
				}, options.duration + ( options.delay || 0 ) + 50 );
				t.registerCompleteHandler( transitionDone );

				setTimeout( function () {
					var i = changedProperties.length;
					var hash;
					var originalValue;
					var index;
					var propertiesToTransitionInJs = [];
					var prop;
					var suffix;
					var interpolator;

					while ( i-- ) {
						prop = changedProperties[i];
						hash = hashPrefix + prop;

						if ( CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[ hash ] ) {
							style[ prefix$1( prop ) ] = to[ prop ];

							// If we're not sure if CSS transitions are supported for
							// this tag/property combo, find out now
							if ( !canUseCssTransitions[ hash ] ) {
								originalValue = t.getStyle( prop );

								// if this property is transitionable in this browser,
								// the current style will be different from the target style
								canUseCssTransitions[ hash ] = ( t.getStyle( prop ) != to[ prop ] );
								cannotUseCssTransitions[ hash ] = !canUseCssTransitions[ hash ];

								// Reset, if we're going to use timers after all
								if ( cannotUseCssTransitions[ hash ] ) {
									style[ prefix$1( prop ) ] = originalValue;
								}
							}
						}

						if ( !CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[ hash ] ) {
							// we need to fall back to timer-based stuff
							if ( originalValue === undefined ) {
								originalValue = t.getStyle( prop );
							}

							// need to remove this from changedProperties, otherwise transitionEndHandler
							// will get confused
							index = changedProperties.indexOf( prop );
							if ( index === -1 ) {
								warnIfDebug( 'Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!', { node: t.node });
							} else {
								changedProperties.splice( index, 1 );
							}

							// TODO Determine whether this property is animatable at all

							suffix = /[^\d]*$/.exec( to[ prop ] )[0];
							interpolator = interpolate( parseFloat( originalValue ), parseFloat( to[ prop ] ) ) || ( function () { return to[ prop ]; } );

							// ...then kick off a timer-based transition
							propertiesToTransitionInJs.push({
								name: prefix$1( prop ),
								interpolator: interpolator,
								suffix: suffix
							});
						}
					}

					// javascript transitions
					if ( propertiesToTransitionInJs.length ) {
						var easing;

						if ( typeof options.easing === 'string' ) {
							easing = t.ractive.easing[ options.easing ];

							if ( !easing ) {
								warnOnceIfDebug( missingPlugin( options.easing, 'easing' ) );
								easing = linear$1;
							}
						} else if ( typeof options.easing === 'function' ) {
							easing = options.easing;
						} else {
							easing = linear$1;
						}

						new Ticker({
							duration: options.duration,
							easing: easing,
							step: function ( pos ) {
								var i = propertiesToTransitionInJs.length;
								while ( i-- ) {
									var prop = propertiesToTransitionInJs[i];
									t.node.style[ prop.name ] = prop.interpolator( pos ) + prop.suffix;
								}
							},
							complete: function () {
								jsTransitionsComplete = true;
								checkComplete();
							}
						});
					} else {
						jsTransitionsComplete = true;
					}

					if ( !changedProperties.length ) {
						// We need to cancel the transitionEndHandler, and deal with
						// the fact that it will never fire
						t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );
						cssTransitionsComplete = true;
						checkComplete();
					}
				}, 0 );
			}, options.delay || 0 );
		};
	}

	var createTransitions$1 = createTransitions;

	function resetStyle ( node, style ) {
		if ( style ) {
			node.setAttribute( 'style', style );
		} else {
			// Next line is necessary, to remove empty style attribute!
			// See http://stackoverflow.com/a/7167553
			node.getAttribute( 'style' );
			node.removeAttribute( 'style' );
		}
	}

	var getComputedStyle = win && ( win.getComputedStyle || legacy.getComputedStyle );
	var resolved = Promise$1.resolve();

	var names = {
		t0: 'intro-outro',
		t1: 'intro',
		t2: 'outro'
	};

	var Transition = function Transition ( options ) {
		this.owner = options.owner || options.parentFragment.owner || findElement( options.parentFragment );
		this.element = this.owner.attributeByName ? this.owner : findElement( options.parentFragment );
		this.ractive = this.owner.ractive;
		this.template = options.template;
		this.parentFragment = options.parentFragment;
		this.options = options;
		this.onComplete = [];
	};

	Transition.prototype.animateStyle = function animateStyle ( style, value, options ) {
		var this$1 = this;

			if ( arguments.length === 4 ) {
			throw new Error( 't.animateStyle() returns a promise - use .then() instead of passing a callback' );
		}

		// Special case - page isn't visible. Don't animate anything, because
		// that way you'll never get CSS transitionend events
		if ( !visible ) {
			this.setStyle( style, value );
			return resolved;
		}

		var to;

		if ( typeof style === 'string' ) {
			to = {};
			to[ style ] = value;
		} else {
			to = style;

			// shuffle arguments
			options = value;
		}

		// As of 0.3.9, transition authors should supply an `option` object with
		// `duration` and `easing` properties (and optional `delay`), plus a
		// callback function that gets called after the animation completes

		// TODO remove this check in a future version
		if ( !options ) {
			warnOnceIfDebug( 'The "%s" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340', this.name );
			options = this;
		}

		return new Promise$1( function ( fulfil ) {
			// Edge case - if duration is zero, set style synchronously and complete
			if ( !options.duration ) {
				this$1.setStyle( to );
				fulfil();
				return;
			}

			// Get a list of the properties we're animating
			var propertyNames = Object.keys( to );
			var changedProperties = [];

			// Store the current styles
			var computedStyle = getComputedStyle( this$1.node );

			var i = propertyNames.length;
			while ( i-- ) {
				var prop = propertyNames[i];
				var current = computedStyle[ prefix$1( prop ) ];

				if ( current === '0px' ) current = 0;

				// we need to know if we're actually changing anything
				if ( current != to[ prop ] ) { // use != instead of !==, so we can compare strings with numbers
					changedProperties.push( prop );

					// make the computed style explicit, so we can animate where
					// e.g. height='auto'
					this$1.node.style[ prefix$1( prop ) ] = current;
				}
			}

			// If we're not actually changing anything, the transitionend event
			// will never fire! So we complete early
			if ( !changedProperties.length ) {
				fulfil();
				return;
			}

			createTransitions$1( this$1, to, options, changedProperties, fulfil );
		});
	};

	Transition.prototype.bind = function bind () {
		var this$1 = this;

			var options = this.options;
		var type = options.template && options.template.v;
		if ( type ) {
			if ( type === 't0' || type === 't1' ) this.element._introTransition = this;
			if ( type === 't0' || type === 't2' ) this.element._outroTransition = this;
			this.eventName = names[ type ];
		}

		var ractive = this.owner.ractive;

		if ( options.name ) {
			this.name = options.name;
		} else {
			var name = options.template.f;
			if ( typeof name.n === 'string' ) name = name.n;

			if ( typeof name !== 'string' ) {
				var fragment = new Fragment({
					owner: this.owner,
					template: name.n
				}).bind(); // TODO need a way to capture values without bind()

				name = fragment.toString();
				fragment.unbind();

				if ( name === '' ) {
					// empty string okay, just no transition
					return;
				}
			}

			this.name = name;
		}

		if ( options.params ) {
			this.params = options.params;
		} else {
			if ( options.template.f.a && !options.template.f.a.s ) {
				this.params = options.template.f.a;
			}

			else if ( options.template.f.d ) {
				// TODO is there a way to interpret dynamic arguments without all the
				// 'dependency thrashing'?
				var fragment$1 = new Fragment({
					owner: this.owner,
					template: options.template.f.d
				}).bind();

				this.params = fragment$1.getArgsList();
				fragment$1.unbind();
			}
		}

		if ( typeof this.name === 'function' ) {
			this._fn = this.name;
			this.name = this._fn.name;
		} else {
			this._fn = findInViewHierarchy( 'transitions', ractive, this.name );
		}

		if ( !this._fn ) {
			warnOnceIfDebug( missingPlugin( this.name, 'transition' ), { ractive: ractive });
		}

		// TODO: dry up after deprecation is done
		if ( options.template && this.template.f.a && this.template.f.a.s ) {
			this.resolvers = [];
			this.models = this.template.f.a.r.map( function ( ref, i ) {
				var resolver;
				var model = resolveReference( this$1.parentFragment, ref );
				if ( !model ) {
					resolver = this$1.parentFragment.resolve( ref, function ( model ) {
						this$1.models[i] = model;
						removeFromArray( this$1.resolvers, resolver );
						model.register( this$1 );
					});

					this$1.resolvers.push( resolver );
				} else model.register( this$1 );

				return model;
			});
			this.argsFn = getFunction( this.template.f.a.s, this.template.f.a.r.length );
		}
	};

	Transition.prototype.destroyed = function destroyed () {};

	Transition.prototype.getStyle = function getStyle ( props ) {
		var computedStyle = getComputedStyle( this.node );

		if ( typeof props === 'string' ) {
			var value = computedStyle[ prefix$1( props ) ];
			return value === '0px' ? 0 : value;
		}

		if ( !isArray( props ) ) {
			throw new Error( 'Transition$getStyle must be passed a string, or an array of strings representing CSS properties' );
		}

		var styles = {};

		var i = props.length;
		while ( i-- ) {
			var prop = props[i];
			var value$1 = computedStyle[ prefix$1( prop ) ];

			if ( value$1 === '0px' ) value$1 = 0;
			styles[ prop ] = value$1;
		}

		return styles;
	};

	Transition.prototype.handleChange = function handleChange () {};

	Transition.prototype.processParams = function processParams ( params, defaults ) {
		if ( typeof params === 'number' ) {
			params = { duration: params };
		}

		else if ( typeof params === 'string' ) {
			if ( params === 'slow' ) {
				params = { duration: 600 };
			} else if ( params === 'fast' ) {
				params = { duration: 200 };
			} else {
				params = { duration: 400 };
			}
		} else if ( !params ) {
			params = {};
		}

		return extendObj( {}, defaults, params );
	};

	Transition.prototype.rebinding = function rebinding ( next, previous ) {
		var idx = this.models.indexOf( previous );
		if ( !~idx ) return;

		next = rebindMatch( this.template.f.a.r[ idx ], next, previous );
		if ( next === previous ) return;

		previous.unregister( this );
		this.models.splice( idx, 1, next );
		if ( next ) next.addShuffleRegister( this, 'mark' );
	};

	Transition.prototype.registerCompleteHandler = function registerCompleteHandler ( fn ) {
		addToArray( this.onComplete, fn );
	};

	Transition.prototype.render = function render () {};

	Transition.prototype.setStyle = function setStyle ( style, value ) {
		if ( typeof style === 'string' ) {
			this.node.style[ prefix$1( style ) ] = value;
		}

		else {
			var prop;
			for ( prop in style ) {
				if ( style.hasOwnProperty( prop ) ) {
					this.node.style[ prefix$1( prop ) ] = style[ prop ];
				}
			}
		}

		return this;
	};

	Transition.prototype.start = function start () {
		var this$1 = this;

			var node = this.node = this.element.node;
		var originalStyle = node.getAttribute( 'style' );

		var completed;
		var args = this.params;

		// create t.complete() - we don't want this on the prototype,
		// because we don't want `this` silliness when passing it as
		// an argument
		this.complete = function ( noReset ) {
			if ( completed ) {
				return;
			}

			this$1.onComplete.forEach( function ( fn ) { return fn(); } );
			if ( !noReset && this$1.isIntro ) {
				resetStyle( node, originalStyle);
			}

			this$1._manager.remove( this$1 );

			completed = true;
		};

		// If the transition function doesn't exist, abort
		if ( !this._fn ) {
			this.complete();
			return;
		}

		// get expression args if supplied
		if ( this.argsFn ) {
			var values = this.models.map( function ( model ) {
				if ( !model ) return undefined;

				return model.get();
			});
			args = this.argsFn.apply( this.ractive, values );
		}

		var promise = this._fn.apply( this.ractive, [ this ].concat( args ) );
		if ( promise ) promise.then( this.complete );
	};

	Transition.prototype.toString = function toString () { return ''; };

	Transition.prototype.unbind = function unbind$1 () {
		if ( this.resolvers ) this.resolvers.forEach( unbind );
		if ( !this.element.attributes.unbinding ) {
			var type = this.options && this.options.template && this.options.template.v;
			if ( type === 't0' || type === 't1' ) this.element._introTransition = null;
			if ( type === 't0' || type === 't2' ) this.element._outroTransition = null;
		}
	};

	Transition.prototype.unregisterCompleteHandler = function unregisterCompleteHandler ( fn ) {
		removeFromArray( this.onComplete, fn );
	};

	Transition.prototype.unrender = function unrender () {};

	Transition.prototype.update = function update () {};

	var elementCache = {};

	var ieBug;
	var ieBlacklist;

	try {
		createElement( 'table' ).innerHTML = 'foo';
	} catch ( err ) {
		ieBug = true;

		ieBlacklist = {
			TABLE:  [ '<table class="x">', '</table>' ],
			THEAD:  [ '<table><thead class="x">', '</thead></table>' ],
			TBODY:  [ '<table><tbody class="x">', '</tbody></table>' ],
			TR:     [ '<table><tr class="x">', '</tr></table>' ],
			SELECT: [ '<select class="x">', '</select>' ]
		};
	}

	function insertHtml ( html, node, docFrag ) {
		var nodes = [];

		// render 0 and false
		if ( html == null || html === '' ) return nodes;

		var container;
		var wrapper;
		var selectedOption;

		if ( ieBug && ( wrapper = ieBlacklist[ node.tagName ] ) ) {
			container = element( 'DIV' );
			container.innerHTML = wrapper[0] + html + wrapper[1];
			container = container.querySelector( '.x' );

			if ( container.tagName === 'SELECT' ) {
				selectedOption = container.options[ container.selectedIndex ];
			}
		}

		else if ( node.namespaceURI === svg$1 ) {
			container = element( 'DIV' );
			container.innerHTML = '<svg class="x">' + html + '</svg>';
			container = container.querySelector( '.x' );
		}

		else if ( node.tagName === 'TEXTAREA' ) {
			container = createElement( 'div' );

			if ( typeof container.textContent !== 'undefined' ) {
				container.textContent = html;
			} else {
				container.innerHTML = html;
			}
		}

		else {
			container = element( node.tagName );
			container.innerHTML = html;

			if ( container.tagName === 'SELECT' ) {
				selectedOption = container.options[ container.selectedIndex ];
			}
		}

		var child;
		while ( child = container.firstChild ) {
			nodes.push( child );
			docFrag.appendChild( child );
		}

		// This is really annoying. Extracting <option> nodes from the
		// temporary container <select> causes the remaining ones to
		// become selected. So now we have to deselect them. IE8, you
		// amaze me. You really do
		// ...and now Chrome too
		var i;
		if ( node.tagName === 'SELECT' ) {
			i = nodes.length;
			while ( i-- ) {
				if ( nodes[i] !== selectedOption ) {
					nodes[i].selected = false;
				}
			}
		}

		return nodes;
	}

	function element ( tagName ) {
		return elementCache[ tagName ] || ( elementCache[ tagName ] = createElement( tagName ) );
	}

	var Triple = (function (Mustache) {
		function Triple ( options ) {
			Mustache.call( this, options );
		}

		Triple.prototype = Object.create( Mustache && Mustache.prototype );
		Triple.prototype.constructor = Triple;

		Triple.prototype.detach = function detach () {
			var docFrag = createDocumentFragment();
			this.nodes.forEach( function ( node ) { return docFrag.appendChild( node ); } );
			return docFrag;
		};

		Triple.prototype.find = function find ( selector ) {
			var this$1 = this;

			var len = this.nodes.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var node = this$1.nodes[i];

				if ( node.nodeType !== 1 ) continue;

				if ( matches( node, selector ) ) return node;

				var queryResult = node.querySelector( selector );
				if ( queryResult ) return queryResult;
			}

			return null;
		};

		Triple.prototype.findAll = function findAll ( selector, query ) {
			var this$1 = this;

			var len = this.nodes.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var node = this$1.nodes[i];

				if ( node.nodeType !== 1 ) continue;

				if ( query.test( node ) ) query.add( node );

				var queryAllResult = node.querySelectorAll( selector );
				if ( queryAllResult ) {
					var numNodes = queryAllResult.length;
					var j;

					for ( j = 0; j < numNodes; j += 1 ) {
						query.add( queryAllResult[j] );
					}
				}
			}
		};

		Triple.prototype.findComponent = function findComponent () {
			return null;
		};

		Triple.prototype.firstNode = function firstNode () {
			return this.nodes[0];
		};

		Triple.prototype.render = function render ( target ) {
			var html = this.model ? this.model.get() : '';
			this.nodes = insertHtml( html, this.parentFragment.findParentNode(), target );
			this.rendered = true;
		};

		Triple.prototype.toString = function toString () {
			var value = this.model && this.model.get();
			value = value != null ? '' + value : '';

			return inAttribute() ? decodeCharacterReferences( value ) : value;
		};

		Triple.prototype.unrender = function unrender () {
			if ( this.nodes ) this.nodes.forEach( function ( node ) { return detachNode( node ); } );
			this.rendered = false;
		};

		Triple.prototype.update = function update () {
			if ( this.rendered && this.dirty ) {
				this.dirty = false;

				this.unrender();
				var docFrag = createDocumentFragment();
				this.render( docFrag );

				var parentNode = this.parentFragment.findParentNode();
				var anchor = this.parentFragment.findNextNode( this );

				parentNode.insertBefore( docFrag, anchor );
			} else {
				// make sure to reset the dirty flag even if not rendered
				this.dirty = false;
			}
		};

		return Triple;
	}(Mustache));

	var Yielder = (function (Item) {
		function Yielder ( options ) {
			Item.call( this, options );

			this.container = options.parentFragment.ractive;
			this.component = this.container.component;

			this.containerFragment = options.parentFragment;
			this.parentFragment = this.component.parentFragment;

			// {{yield}} is equivalent to {{yield content}}
			this.name = options.template.n || '';
		}

		Yielder.prototype = Object.create( Item && Item.prototype );
		Yielder.prototype.constructor = Yielder;

		Yielder.prototype.bind = function bind () {
			var name = this.name;

			( this.component.yielders[ name ] || ( this.component.yielders[ name ] = [] ) ).push( this );

			// TODO don't parse here
			var template = this.container._inlinePartials[ name || 'content' ];

			if ( typeof template === 'string' ) {
				template = parse( template ).t;
			}

			if ( !template ) {
				warnIfDebug( ("Could not find template for partial \"" + name + "\""), { ractive: this.ractive });
				template = [];
			}

			this.fragment = new Fragment({
				owner: this,
				ractive: this.container.parent,
				template: template
			}).bind();
		};

		Yielder.prototype.bubble = function bubble () {
			if ( !this.dirty ) {
				this.containerFragment.bubble();
				this.dirty = true;
			}
		};

		Yielder.prototype.detach = function detach () {
			return this.fragment.detach();
		};

		Yielder.prototype.find = function find ( selector ) {
			return this.fragment.find( selector );
		};

		Yielder.prototype.findAll = function findAll ( selector, queryResult ) {
			this.fragment.findAll( selector, queryResult );
		};

		Yielder.prototype.findComponent = function findComponent ( name ) {
			return this.fragment.findComponent( name );
		};

		Yielder.prototype.findAllComponents = function findAllComponents ( name, queryResult ) {
			this.fragment.findAllComponents( name, queryResult );
		};

		Yielder.prototype.findNextNode = function findNextNode() {
			return this.containerFragment.findNextNode( this );
		};

		Yielder.prototype.firstNode = function firstNode ( skipParent ) {
			return this.fragment.firstNode( skipParent );
		};

		Yielder.prototype.render = function render ( target, occupants ) {
			return this.fragment.render( target, occupants );
		};

		Yielder.prototype.setTemplate = function setTemplate ( name ) {
			var template = this.parentFragment.ractive.partials[ name ];

			if ( typeof template === 'string' ) {
				template = parse( template ).t;
			}

			this.partialTemplate = template || []; // TODO warn on missing partial
		};

		Yielder.prototype.toString = function toString ( escape ) {
			return this.fragment.toString( escape );
		};

		Yielder.prototype.unbind = function unbind () {
			this.fragment.unbind();
			removeFromArray( this.component.yielders[ this.name ], this );
		};

		Yielder.prototype.unrender = function unrender ( shouldDestroy ) {
			this.fragment.unrender( shouldDestroy );
		};

		Yielder.prototype.update = function update () {
			this.dirty = false;
			this.fragment.update();
		};

		return Yielder;
	}(Item));

	// finds the component constructor in the registry or view hierarchy registries
	function getComponentConstructor ( ractive, name ) {
		var instance = findInstance( 'components', ractive, name );
		var Component;

		if ( instance ) {
			Component = instance.components[ name ];

			// best test we have for not Ractive.extend
			if ( !Component._Parent ) {
				// function option, execute and store for reset
				var fn = Component.bind( instance );
				fn.isOwner = instance.components.hasOwnProperty( name );
				Component = fn();

				if ( !Component ) {
					warnIfDebug( noRegistryFunctionReturn, name, 'component', 'component', { ractive: ractive });
					return;
				}

				if ( typeof Component === 'string' ) {
					// allow string lookup
					Component = getComponentConstructor( ractive, Component );
				}

				Component._fn = fn;
				instance.components[ name ] = Component;
			}
		}

		return Component;
	}

	var constructors = {};
	constructors[ ALIAS ] = Alias;
	constructors[ DOCTYPE ] = Doctype;
	constructors[ INTERPOLATOR ] = Interpolator;
	constructors[ PARTIAL ] = Partial;
	constructors[ SECTION ] = Section;
	constructors[ TRIPLE ] = Triple;
	constructors[ YIELDER ] = Yielder;

	constructors[ ATTRIBUTE ] = Attribute;
	constructors[ BINDING_FLAG ] = BindingFlag;
	constructors[ DECORATOR ] = Decorator;
	constructors[ EVENT ] = EventDirective;
	constructors[ TRANSITION ] = Transition;

	var specialElements = {
		doctype: Doctype,
		form: Form,
		input: Input,
		option: Option,
		select: Select,
		textarea: Textarea
	};

	function createItem ( options ) {
		if ( typeof options.template === 'string' ) {
			return new Text( options );
		}

		if ( options.template.t === ELEMENT ) {
			// could be component or element
			var ComponentConstructor = getComponentConstructor( options.parentFragment.ractive, options.template.e );
			if ( ComponentConstructor ) {
				return new Component( options, ComponentConstructor );
			}

			var tagName = options.template.e.toLowerCase();

			var ElementConstructor = specialElements[ tagName ] || Element;
			return new ElementConstructor( options );
		}

		var Item;

		// component mappings are a special case of attribute
		if ( options.template.t === ATTRIBUTE ) {
			var el = options.owner;
			if ( !el || ( el.type !== COMPONENT && el.type !== ELEMENT ) ) {
				el = findElement( options.parentFragment );
			}
			options.element = el;

			Item = el.type === COMPONENT ? Mapping : Attribute;
		} else {
			Item = constructors[ options.template.t ];
		}

		if ( !Item ) throw new Error( ("Unrecognised item type " + (options.template.t)) );

		return new Item( options );
	}

	// TODO all this code needs to die
	function processItems ( items, values, guid, counter ) {
		if ( counter === void 0 ) counter = 0;

		return items.map( function ( item ) {
			if ( item.type === TEXT ) {
				return item.template;
			}

			if ( item.fragment ) {
				if ( item.fragment.iterations ) {
					return item.fragment.iterations.map( function ( fragment ) {
						return processItems( fragment.items, values, guid, counter );
					}).join( '' );
				} else {
					return processItems( item.fragment.items, values, guid, counter );
				}
			}

			var placeholderId = "" + guid + "-" + (counter++);
			var model = item.model || item.newModel;

			values[ placeholderId ] = model ?
				model.wrapper ?
					model.wrapperValue :
					model.get() :
				undefined;

			return '${' + placeholderId + '}';
		}).join( '' );
	}

	function unrenderAndDestroy$1 ( item ) {
		item.unrender( true );
	}

	var Fragment = function Fragment ( options ) {
		this.owner = options.owner; // The item that owns this fragment - an element, section, partial, or attribute

		this.isRoot = !options.owner.parentFragment;
		this.parent = this.isRoot ? null : this.owner.parentFragment;
		this.ractive = options.ractive || ( this.isRoot ? options.owner : this.parent.ractive );

		this.componentParent = ( this.isRoot && this.ractive.component ) ? this.ractive.component.parentFragment : null;

		this.context = null;
		this.rendered = false;

		// encapsulated styles should be inherited until they get applied by an element
		this.cssIds = 'cssIds' in options ? options.cssIds : ( this.parent ? this.parent.cssIds : null );

		this.resolvers = [];

		this.dirty = false;
		this.dirtyArgs = this.dirtyValue = true; // TODO getArgsList is nonsense - should deprecate legacy directives style

		this.template = options.template || [];
		this.createItems();
	};

	Fragment.prototype.bind = function bind$1$$ ( context ) {
		this.context = context;
		this.items.forEach( bind$1 );
		this.bound = true;

		// in rare cases, a forced resolution (or similar) will cause the
		// fragment to be dirty before it's even finished binding. In those
		// cases we update immediately
		if ( this.dirty ) this.update();

		return this;
	};

	Fragment.prototype.bubble = function bubble () {
		this.dirtyArgs = this.dirtyValue = true;

		if ( !this.dirty ) {
			this.dirty = true;

			if ( this.isRoot ) { // TODO encapsulate 'is component root, but not overall root' check?
				if ( this.ractive.component ) {
					this.ractive.component.bubble();
				} else if ( this.bound ) {
					runloop.addFragment( this );
				}
			} else {
				this.owner.bubble();
			}
		}
	};

	Fragment.prototype.createItems = function createItems () {
		// this is a hot code path
		var this$1 = this;

			var max = this.template.length;
		this.items = [];
		for ( var i = 0; i < max; i++ ) {
			this$1.items[i] = createItem({ parentFragment: this$1, template: this$1.template[i], index: i });
		}
	};

	Fragment.prototype.destroyed = function destroyed () {
		this.items.forEach( function ( i ) { return i.destroyed(); } );
	};

	Fragment.prototype.detach = function detach () {
		var docFrag = createDocumentFragment();
		this.items.forEach( function ( item ) { return docFrag.appendChild( item.detach() ); } );
		return docFrag;
	};

	Fragment.prototype.find = function find ( selector ) {
		var this$1 = this;

			var len = this.items.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.items[i].find( selector );
			if ( found ) return found;
		}
	};

	Fragment.prototype.findAll = function findAll ( selector, query ) {
		var this$1 = this;

			if ( this.items ) {
			var len = this.items.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var item = this$1.items[i];

				if ( item.findAll ) {
					item.findAll( selector, query );
				}
			}
		}

		return query;
	};

	Fragment.prototype.findComponent = function findComponent ( name ) {
		var this$1 = this;

			var len = this.items.length;
		var i;

		for ( i = 0; i < len; i += 1 ) {
			var found = this$1.items[i].findComponent( name );
			if ( found ) return found;
		}
	};

	Fragment.prototype.findAllComponents = function findAllComponents ( name, query ) {
		var this$1 = this;

			if ( this.items ) {
			var len = this.items.length;
			var i;

			for ( i = 0; i < len; i += 1 ) {
				var item = this$1.items[i];

				if ( item.findAllComponents ) {
					item.findAllComponents( name, query );
				}
			}
		}

		return query;
	};

	Fragment.prototype.findContext = function findContext () {
		var fragment = this;
		while ( fragment && !fragment.context ) fragment = fragment.parent;
		if ( !fragment ) return this.ractive.viewmodel;
		else return fragment.context;
	};

	Fragment.prototype.findNextNode = function findNextNode ( item ) {
		// search for the next node going forward
		var this$1 = this;

			if ( item ) {
			for ( var i = item.index + 1; i < this$1.items.length; i++ ) {
				if ( !this$1.items[ i ] ) continue;

				var node = this$1.items[ i ].firstNode( true );
				if ( node ) return node;
			}
		}

		// if this is the root fragment, and there are no more items,
		// it means we're at the end...
		if ( this.isRoot ) {
			if ( this.ractive.component ) {
				return this.ractive.component.parentFragment.findNextNode( this.ractive.component );
			}

			// TODO possible edge case with other content
			// appended to this.ractive.el?
			return null;
		}

		if ( this.parent ) return this.owner.findNextNode( this ); // the argument is in case the parent is a RepeatedFragment
	};

	Fragment.prototype.findParentNode = function findParentNode () {
		var fragment = this;

		do {
			if ( fragment.owner.type === ELEMENT ) {
				return fragment.owner.node;
			}

			if ( fragment.isRoot && !fragment.ractive.component ) { // TODO encapsulate check
				return fragment.ractive.el;
			}

			if ( fragment.owner.type === YIELDER ) {
				fragment = fragment.owner.containerFragment;
			} else {
				fragment = fragment.componentParent || fragment.parent; // TODO ugh
			}
		} while ( fragment );

		throw new Error( 'Could not find parent node' ); // TODO link to issue tracker
	};

	Fragment.prototype.findRepeatingFragment = function findRepeatingFragment () {
		var fragment = this;
		// TODO better check than fragment.parent.iterations
		while ( ( fragment.parent || fragment.componentParent ) && !fragment.isIteration ) {
			fragment = fragment.parent || fragment.componentParent;
		}

		return fragment;
	};

	Fragment.prototype.firstNode = function firstNode ( skipParent ) {
		var this$1 = this;

			var node;
		for ( var i = 0; i < this$1.items.length; i++ ) {
			node = this$1.items[i].firstNode( true );

			if ( node ) {
				return node;
			}
		}

		if ( skipParent ) return null;

		return this.parent.findNextNode( this.owner );
	};

	// TODO ideally, this would be deprecated in favour of an
	// expression-like approach
	Fragment.prototype.getArgsList = function getArgsList () {
		if ( this.dirtyArgs ) {
			var values = {};
			var source = processItems( this.items, values, this.ractive._guid );
			var parsed = parseJSON( '[' + source + ']', values );

			this.argsList = parsed ?
				parsed.value :
				[ this.toString() ];

			this.dirtyArgs = false;
		}

		return this.argsList;
	};

	Fragment.prototype.rebinding = function rebinding ( next ) {
		this.context = next;
	};

	Fragment.prototype.render = function render ( target, occupants ) {
		if ( this.rendered ) throw new Error( 'Fragment is already rendered!' );
		this.rendered = true;

		this.items.forEach( function ( item ) { return item.render( target, occupants ); } );
	};

	Fragment.prototype.resetTemplate = function resetTemplate ( template ) {
		var wasBound = this.bound;
		var wasRendered = this.rendered;

		// TODO ensure transitions are disabled globally during reset

		if ( wasBound ) {
			if ( wasRendered ) this.unrender( true );
			this.unbind();
		}

		this.template = template;
		this.createItems();

		if ( wasBound ) {
			this.bind( this.context );

			if ( wasRendered ) {
				var parentNode = this.findParentNode();
				var anchor = this.findNextNode();

				if ( anchor ) {
					var docFrag = createDocumentFragment();
					this.render( docFrag );
					parentNode.insertBefore( docFrag, anchor );
				} else {
					this.render( parentNode );
				}
			}
		}
	};

	Fragment.prototype.resolve = function resolve ( template, callback ) {
		if ( !this.context && this.parent.resolve ) {
			return this.parent.resolve( template, callback );
		}

		var resolver = new ReferenceResolver( this, template, callback );
		this.resolvers.push( resolver );

		return resolver; // so we can e.g. force resolution
	};

	Fragment.prototype.shuffled = function shuffled () {
		this.items.forEach( function ( i ) { return i.shuffled(); } );
	};

	Fragment.prototype.toHtml = function toHtml () {
		return this.toString();
	};

	Fragment.prototype.toString = function toString$1$$ ( escape ) {
		return this.items.map( escape ? toEscapedString : toString$1 ).join( '' );
	};

	Fragment.prototype.unbind = function unbind$1 () {
		this.items.forEach( unbind );
		this.resolvers.forEach( unbind );
		this.bound = false;

		return this;
	};

	Fragment.prototype.unrender = function unrender$1 ( shouldDestroy ) {
		this.items.forEach( shouldDestroy ? unrenderAndDestroy$1 : unrender );
		this.rendered = false;
	};

	Fragment.prototype.update = function update$1 () {
		if ( this.dirty ) {
			if ( !this.updating ) {
				this.dirty = false;
				this.updating = true;
				this.items.forEach( update );
				this.updating = false;
			} else if ( this.isRoot ) {
				runloop.addFragmentToRoot( this );
			}
		}
	};

	Fragment.prototype.valueOf = function valueOf () {
		if ( this.items.length === 1 ) {
			return this.items[0].valueOf();
		}

		if ( this.dirtyValue ) {
			var values = {};
			var source = processItems( this.items, values, this.ractive._guid );
			var parsed = parseJSON( source, values );

			this.value = parsed ?
				parsed.value :
				this.toString();

			this.dirtyValue = false;
		}

		return this.value;
	};

	// TODO should resetTemplate be asynchronous? i.e. should it be a case
	// of outro, update template, intro? I reckon probably not, since that
	// could be achieved with unrender-resetTemplate-render. Also, it should
	// conceptually be similar to resetPartial, which couldn't be async

	function Ractive$resetTemplate ( template ) {
		templateConfigurator.init( null, this, { template: template });

		var transitionsEnabled = this.transitionsEnabled;
		this.transitionsEnabled = false;

		// Is this is a component, we need to set the `shouldDestroy`
		// flag, otherwise it will assume by default that a parent node
		// will be detached, and therefore it doesn't need to bother
		// detaching its own nodes
		var component = this.component;
		if ( component ) component.shouldDestroy = true;
		this.unrender();
		if ( component ) component.shouldDestroy = false;

		// remove existing fragment and create new one
		this.fragment.unbind().unrender( true );

		this.fragment = new Fragment({
			template: this.template,
			root: this,
			owner: this
		});

		var docFrag = createDocumentFragment();
		this.fragment.bind( this.viewmodel ).render( docFrag );

		// if this is a component, its el may not be valid, so find a
		// target based on the component container
		if ( component ) {
			this.fragment.findParentNode().insertBefore( docFrag, component.findNextNode() );
		} else {
			this.el.insertBefore( docFrag, this.anchor );
		}

		this.transitionsEnabled = transitionsEnabled;
	}

	var reverse$1 = makeArrayMethod( 'reverse' ).path;

	function Ractive$set ( keypath, value ) {
		var ractive = this;

		return set( ractive, build( ractive, keypath, value ) );
	}

	var shift$1 = makeArrayMethod( 'shift' ).path;

	var sort$1 = makeArrayMethod( 'sort' ).path;

	var splice$1 = makeArrayMethod( 'splice' ).path;

	function Ractive$subtract ( keypath, d ) {
		return add( this, keypath, ( d === undefined ? -1 : -d ) );
	}

	var teardownHook$1 = new Hook( 'teardown' );

	// Teardown. This goes through the root fragment and all its children, removing observers
	// and generally cleaning up after itself

	function Ractive$teardown () {
		if ( this.torndown ) {
			warnIfDebug( 'ractive.teardown() was called on a Ractive instance that was already torn down' );
			return Promise$1.resolve();
		}

		this.torndown = true;
		this.fragment.unbind();
		this.viewmodel.teardown();

		this._observers.forEach( cancel );

		if ( this.fragment.rendered && this.el.__ractive_instances__ ) {
			removeFromArray( this.el.__ractive_instances__, this );
		}

		this.shouldDestroy = true;
		var promise = ( this.fragment.rendered ? this.unrender() : Promise$1.resolve() );

		teardownHook$1.fire( this );

		return promise;
	}

	function Ractive$toggle ( keypath ) {
		if ( typeof keypath !== 'string' ) {
			throw new TypeError( badArguments );
		}

		return set( this, gather( this, keypath ).map( function ( m ) { return [ m, !m.get() ]; } ) );
	}

	function Ractive$toCSS() {
		var cssIds = [ this.cssId ].concat( this.findAllComponents().map( function ( c ) { return c.cssId; } ) );
		var uniqueCssIds = Object.keys(cssIds.reduce( function ( ids, id ) { return (ids[id] = true, ids); }, {}));
		return getCSS( uniqueCssIds );
	}

	function Ractive$toHTML () {
		return this.fragment.toString( true );
	}

	function toText () {
		return this.fragment.toString( false );
	}

	function Ractive$transition ( name, node, params ) {

		if ( node instanceof HTMLElement ) {
			// good to go
		}
		else if ( isObject( node ) ) {
			// omitted, use event node
			params = node;
		}

		// if we allow query selector, then it won't work
		// simple params like "fast"

		// else if ( typeof node === 'string' ) {
		// 	// query selector
		// 	node = this.find( node )
		// }

		node = node || this.event.node;

		if ( !node || !node._ractive ) {
			fatal( ("No node was supplied for transition " + name) );
		}

		params = params || {};
		var owner = node._ractive.proxy;
		var transition = new Transition({ owner: owner, parentFragment: owner.parentFragment, name: name, params: params });
		transition.bind();

		var promise = runloop.start( this, true );
		runloop.registerTransition( transition );
		runloop.end();

		promise.then( function () { return transition.unbind(); } );
		return promise;
	}

	function unlink$1( here ) {
		var promise = runloop.start();
		this.viewmodel.joinAll( splitKeypathI( here ), { lastLink: false } ).unlink();
		runloop.end();
		return promise;
	}

	var unrenderHook$1 = new Hook( 'unrender' );

	function Ractive$unrender () {
		if ( !this.fragment.rendered ) {
			warnIfDebug( 'ractive.unrender() was called on a Ractive instance that was not rendered' );
			return Promise$1.resolve();
		}

		var promise = runloop.start( this, true );

		// If this is a component, and the component isn't marked for destruction,
		// don't detach nodes from the DOM unnecessarily
		var shouldDestroy = !this.component || this.component.shouldDestroy || this.shouldDestroy;
		this.fragment.unrender( shouldDestroy );

		removeFromArray( this.el.__ractive_instances__, this );

		unrenderHook$1.fire( this );

		runloop.end();
		return promise;
	}

	var unshift$1 = makeArrayMethod( 'unshift' ).path;

	function Ractive$updateModel ( keypath, cascade ) {
		var promise = runloop.start( this, true );

		if ( !keypath ) {
			this.viewmodel.updateFromBindings( true );
		} else {
			this.viewmodel.joinAll( splitKeypathI( keypath ) ).updateFromBindings( cascade !== false );
		}

		runloop.end();

		return promise;
	}

	var proto = {
		add: Ractive$add,
		animate: Ractive$animate,
		detach: Ractive$detach,
		find: Ractive$find,
		findAll: Ractive$findAll,
		findAllComponents: Ractive$findAllComponents,
		findComponent: Ractive$findComponent,
		findContainer: Ractive$findContainer,
		findParent: Ractive$findParent,
		fire: Ractive$fire,
		get: Ractive$get,
		getNodeInfo: getNodeInfo,
		insert: Ractive$insert,
		link: link$1,
		merge: thisRactive$merge,
		observe: observe,
		observeList: observeList,
		observeOnce: observeOnce,
		// TODO reinstate these
		// observeListOnce,
		off: Ractive$off,
		on: Ractive$on,
		once: Ractive$once,
		pop: pop$1,
		push: push$1,
		render: Ractive$render,
		reset: Ractive$reset,
		resetPartial: resetPartial,
		resetTemplate: Ractive$resetTemplate,
		reverse: reverse$1,
		set: Ractive$set,
		shift: shift$1,
		sort: sort$1,
		splice: splice$1,
		subtract: Ractive$subtract,
		teardown: Ractive$teardown,
		toggle: Ractive$toggle,
		toCSS: Ractive$toCSS,
		toCss: Ractive$toCSS,
		toHTML: Ractive$toHTML,
		toHtml: Ractive$toHTML,
		toText: toText,
		transition: Ractive$transition,
		unlink: unlink$1,
		unrender: Ractive$unrender,
		unshift: unshift$1,
		update: Ractive$update,
		updateModel: Ractive$updateModel
	};

	function wrap$1 ( method, superMethod, force ) {

		if ( force || needsSuper( method, superMethod ) )  {

			return function () {

				var hasSuper = ( '_super' in this ), _super = this._super, result;

				this._super = superMethod;

				result = method.apply( this, arguments );

				if ( hasSuper ) {
					this._super = _super;
				}

				return result;
			};
		}

		else {
			return method;
		}
	}

	function needsSuper ( method, superMethod ) {
		return typeof superMethod === 'function' && /_super/.test( method );
	}

	function unwrap ( Child ) {
		var options = {};

		while ( Child ) {
			addRegistries( Child, options );
			addOtherOptions( Child, options );

			if ( Child._Parent !== Ractive ) {
				Child = Child._Parent;
			} else {
				Child = false;
			}
		}

		return options;
	}

	function addRegistries ( Child, options ) {
		registries.forEach( function ( r ) {
			addRegistry(
				r.useDefaults ? Child.prototype : Child,
				options, r.name );
		});
	}

	function addRegistry ( target, options, name ) {
		var registry, keys = Object.keys( target[ name ] );

		if ( !keys.length ) { return; }

		if ( !( registry = options[ name ] ) ) {
			registry = options[ name ] = {};
		}

		keys
			.filter( function ( key ) { return !( key in registry ); } )
			.forEach( function ( key ) { return registry[ key ] = target[ name ][ key ]; } );
	}

	function addOtherOptions ( Child, options ) {
		Object.keys( Child.prototype ).forEach( function ( key ) {
			if ( key === 'computed' ) { return; }

			var value = Child.prototype[ key ];

			if ( !( key in options ) ) {
				options[ key ] = value._method ? value._method : value;
			}

			// is it a wrapped function?
			else if ( typeof options[ key ] === 'function'
					&& typeof value === 'function'
					&& options[ key ]._method ) {

				var result, needsSuper = value._method;

				if ( needsSuper ) { value = value._method; }

				// rewrap bound directly to parent fn
				result = wrap$1( options[ key ]._method, value );

				if ( needsSuper ) { result._method = result; }

				options[ key ] = result;
			}
		});
	}

	function extend () {
		var options = [], len = arguments.length;
		while ( len-- ) options[ len ] = arguments[ len ];

		if( !options.length ) {
			return extendOne( this );
		} else {
			return options.reduce( extendOne, this );
		}
	}

	function extendOne ( Parent, options ) {
		if ( options === void 0 ) options = {};

		var Child, proto;

		// if we're extending with another Ractive instance...
		//
		//   var Human = Ractive.extend(...), Spider = Ractive.extend(...);
		//   var Spiderman = Human.extend( Spider );
		//
		// ...inherit prototype methods and default options as well
		if ( options.prototype instanceof Ractive ) {
			options = unwrap( options );
		}

		Child = function ( options ) {
			if ( !( this instanceof Child ) ) return new Child( options );

			construct( this, options || {} );
			initialise( this, options || {}, {} );
		};

		proto = create( Parent.prototype );
		proto.constructor = Child;

		// Static properties
		defineProperties( Child, {
			// alias prototype as defaults
			defaults: { value: proto },

			// extendable
			extend: { value: extend, writable: true, configurable: true },

			// Parent - for IE8, can't use Object.getPrototypeOf
			_Parent: { value: Parent }
		});

		// extend configuration
		config.extend( Parent, proto, options );

		dataConfigurator.extend( Parent, proto, options );

		if ( options.computed ) {
			proto.computed = extendObj( create( Parent.prototype.computed ), options.computed );
		}

		Child.prototype = proto;

		return Child;
	}

	function joinKeys () {
		var keys = [], len = arguments.length;
		while ( len-- ) keys[ len ] = arguments[ len ];

		return keys.map( escapeKey ).join( '.' );
	}

	function splitKeypath ( keypath ) {
		return splitKeypathI( keypath ).map( unescapeKey );
	}

	// Ractive.js makes liberal use of things like Array.prototype.indexOf. In
	// older browsers, these are made available via a shim - here, we do a quick
	// pre-flight check to make sure that either a) we're not in a shit browser,
	// or b) we're using a Ractive-legacy.js build
	var FUNCTION = 'function';

	if (
		typeof Date.now !== FUNCTION                 ||
		typeof String.prototype.trim !== FUNCTION    ||
		typeof Object.keys !== FUNCTION              ||
		typeof Array.prototype.indexOf !== FUNCTION  ||
		typeof Array.prototype.forEach !== FUNCTION  ||
		typeof Array.prototype.map !== FUNCTION      ||
		typeof Array.prototype.filter !== FUNCTION   ||
		( win && typeof win.addEventListener !== FUNCTION )
	) {
		throw new Error( 'It looks like you\'re attempting to use Ractive.js in an older browser. You\'ll need to use one of the \'legacy builds\' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.' );
	}

	function Ractive ( options ) {
		if ( !( this instanceof Ractive ) ) return new Ractive( options );

		construct( this, options || {} );
		initialise( this, options || {}, {} );
	}

	extendObj( Ractive.prototype, proto, defaults );
	Ractive.prototype.constructor = Ractive;

	// alias prototype as `defaults`
	Ractive.defaults = Ractive.prototype;

	// static properties
	defineProperties( Ractive, {

		// debug flag
		DEBUG:          { writable: true, value: true },
		DEBUG_PROMISES: { writable: true, value: true },

		// static methods:
		extend:         { value: extend },
		escapeKey:      { value: escapeKey },
		getNodeInfo:    { value: staticInfo },
		joinKeys:       { value: joinKeys },
		parse:          { value: parse },
		splitKeypath:   { value: splitKeypath },
		unescapeKey:    { value: unescapeKey },
		getCSS:         { value: getCSS },

		// namespaced constructors
		Promise:        { value: Promise$1 },

		// support
		enhance:        { writable: true, value: false },
		svg:            { value: svg },
		magic:          { value: magicSupported },

		// version
		VERSION:        { value: '0.8.14' },

		// plugins
		adaptors:       { writable: true, value: {} },
		components:     { writable: true, value: {} },
		decorators:     { writable: true, value: {} },
		easing:         { writable: true, value: easing },
		events:         { writable: true, value: {} },
		interpolators:  { writable: true, value: interpolators },
		partials:       { writable: true, value: {} },
		transitions:    { writable: true, value: {} }
	});

	return Ractive;

}));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Ractive  = __webpack_require__(0);
window.Papa = __webpack_require__(3);
window.FileSaver = __webpack_require__(4);
//import Ractive from 'ractive';

//Ractive.defaults.isolated=true;
Ractive.prototype.unset = function(keypath){
    var lastDot = keypath.lastIndexOf( '.' ),
        parent = keypath.substr( 0, lastDot ),
        property = keypath.substring( lastDot + 1 );

    this.set(keypath);
    delete this.get(parent)[property];
    return this.update(keypath);
}

console.log('ke')
window.alertify = __webpack_require__(7)
__webpack_require__(8)
alertify.defaults = {
    notifier:{
        // auto-dismiss wait time (in seconds)  
        delay:5,
        // default position
        position:'top-right',
        // adds a close button to notifier messages
        closeButton: false
    }
};

alertify.notify('Šifra je vec očitana', 'warning', 3);

ion.sound({
    sounds: [ { name: "vecpostoji" }, { name: "no" } ],
    volume: 0.5,
    path: "/",
    preload: true
});

Ractive.components.Root                    =  __webpack_require__(9);

var ractive = new Ractive.components.Root({
    el: 'body',
    append: false,
    data:function() {
        return {
            isMobile: isMobile.any
            , scancode:''
            , scanhistoryarr:[]
            , scanhistoryfromserver:[]
            , filename:''
            , cards:{} // : { '0800':{title:"0800", arr:[...]} }
            , keyz:[]
        }
    }
});

if (document.getElementById("scancode"))  document.getElementById("scancode").autofocus = true; 
/*
setInterval(function(){
    if (document.getElementById("scancode")) document.getElementById("scancode").focus(); 
},3000)
*/

window.sifarnik = {};
window.scanhistorykv = {}; 
window.scanhistory = []; 

//  S O C K E T S 
window.socket = io.connect();
socket.on('sifarnik', function (data) {
    sifarnik = data;
    console.log('sifarnik');
    //socket.emit('my other event', { my: 'data' });
});

socket.on('scan', function (scan) {
    console.log('scan', scan);
    ractive.set('scanhistoryfromserver', scan);
    ractive.set('scanhistoryarr', scan);
    for (var i=0; i<scan.length;i++)
        scanhistorykv[ scan[i][3] ] = true
});

socket.on('addscan', function (addscan) {
    console.log('addscan', addscan);
    ractive.splice('scanhistoryfromserver', 0,0,addscan);
});

socket.on('save2server', function () {
    console.log('save2server');
    ractive.fire('save2disk');
});

socket.on('clearscan', function () {
    console.log('clearscan from sock');
    ractive.set('scanhistoryfromserver', []);       
    ractive.set('scanhistoryarr', []);   
    scanhistorykv = {}          
});

/*
document.onkeypress = function (e) {
    console.log('onkeypress',e)
    if (e.key!='Unidentified') ractive.push('keyz', e.key)
}
document.addEventListener("paste", function(e){
    console.log('paste',e)
    ractive.push('keyz', 'PASTE')
});
*/

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Papa Parse
	v4.3.7
	https://github.com/mholt/PapaParse
	License: MIT
*/
(function(root, factory)
{
	if (true)
	{
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module === 'object' && typeof exports !== 'undefined')
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{
		// Browser globals (root is window)
		root.Papa = factory();
	}
}(this, function()
{
	'use strict';

	var global = (function () {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

		// When running tests none of the above have been defined
		return {};
	})();


	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		}
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		var dynamicTyping = _config.dynamicTyping || false;
		if (isFunction(dynamicTyping)) {
			_config.dynamicTypingFunction = dynamicTyping;
			// Will be filled on first row call
			dynamicTyping = {};
		}
		_config.dynamicTyping = dynamicTyping;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = '';
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				return;

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				this._config.complete(this._completeResults, this._input);

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);
			// Headers can only be set when once the request state is OPENED
			if (this._config.downloadRequestHeaders)
			{
				var headers = this._config.downloadRequestHeaders;

				for (var headerName in headers)
				{
					xhr.setRequestHeader(headerName, headers[headerName]);
				}
			}

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		}

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		}

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		}

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
					return -1;
					}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		}

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		}

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		}

		this._chunkError = function()
		{
			this._sendError(reader.error.message);
		}

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		}
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		}
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		}

		this._nextChunk = function()
		{
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		}

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error.message);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			this._finished = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;	// Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(isFunction(_config.delimiter))
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function ()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length === 1 && _results.data[i][0] === '')
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
					_fields.push(_results.data[i][j]);
			_results.data.splice(0, 1);
		}

		function shouldApplyDynamicTyping(field) {
			// Cache function values to avoid calling it for each row
			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
			}
			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true
		}

		function parseDynamic(field, value)
		{
			if (shouldApplyDynamicTyping(field))
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else
					return tryParseFloat(value);
			}
			return value;
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				for (var j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;
			return _results;
		}

		function guessDelimiter(input, newline, skipEmptyLines)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					if (skipEmptyLines && preview.data[j].length === 1 && preview.data[j][0].length === 0) {
						emptyLinesCount++
						continue
					}
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= (preview.data.length - emptyLinesCount);

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		/** Allows for no quoteChar by setting quoteChar to undefined in config */
		if (config.quoteChar === undefined){
			var quoteChar = '"';
		} else {
			var quoteChar = config.quoteChar;
		}

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw 'Comment character same as delimiter';
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw 'Input must be a string';

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = isFunction(step);

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

						//No other quotes are found - no other delimiters
						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						// Closing quote at EOF
						if (quoteSearch === inputLen-1)
						{
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] === quoteChar)
						{
							quoteSearch++;
							continue;
						}

						// Closing quote followed by delimiter
						if (input[quoteSearch+1] === delim)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						// Closing quote followed by newline
						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}


						// Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
						errors.push({
							type: 'Quotes',
							code: 'InvalidQuotes',
							message: 'Trailing quote on quoted field is malformed',
							row: data.length,	// row has yet to be inserted
							index: cursor
						});

						quoteSearch++;
						continue;

					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(5) !== null) && (__webpack_require__(6) !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * alertifyjs 1.11.0 http://alertifyjs.com
 * AlertifyJS is a javascript framework for developing pretty browser dialogs and notifications.
 * Copyright 2017 Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com) 
 * Licensed under GPL 3 <https://opensource.org/licenses/gpl-3.0>*/
( function ( window ) {
    'use strict';
    
    /**
     * Keys enum
     * @type {Object}
     */
    var keys = {
        ENTER: 13,
        ESC: 27,
        F1: 112,
        F12: 123,
        LEFT: 37,
        RIGHT: 39
    };
    /**
     * Default options 
     * @type {Object}
     */
    var defaults = {
        autoReset:true,
        basic:false,
        closable:true,
        closableByDimmer:true,
        frameless:false,
        maintainFocus:true, //global default not per instance, applies to all dialogs
        maximizable:true,
        modal:true,
        movable:true,
        moveBounded:false,
        overflow:true,
        padding: true,
        pinnable:true,
        pinned:true,
        preventBodyShift:false, //global default not per instance, applies to all dialogs
        resizable:true,
        startMaximized:false,
        transition:'pulse',
        notifier:{
            delay:5,
            position:'bottom-right',
            closeButton:false
        },
        glossary:{
            title:'AlertifyJS',
            ok: 'OK',
            cancel: 'Cancel',
            acccpt: 'Accept',
            deny: 'Deny',
            confirm: 'Confirm',
            decline: 'Decline',
            close: 'Close',
            maximize: 'Maximize',
            restore: 'Restore',
        },
        theme:{
            input:'ajs-input',
            ok:'ajs-ok',
            cancel:'ajs-cancel',
        }
    };
    
    //holds open dialogs instances
    var openDialogs = [];

    /**
     * [Helper]  Adds the specified class(es) to the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be added to the class attribute of the element.
     * 
     * @return {undefined}
     */
    function addClass(element,classNames){
        element.className += ' ' + classNames;
    }
    
    /**
     * [Helper]  Removes the specified class(es) from the element.
     *
     * @element {node}      The element
     * @className {string}  One or more space-separated classes to be removed from the class attribute of the element.
     * 
     * @return {undefined}
     */
    function removeClass(element, classNames) {
        var original = element.className.split(' ');
        var toBeRemoved = classNames.split(' ');
        for (var x = 0; x < toBeRemoved.length; x += 1) {
            var index = original.indexOf(toBeRemoved[x]);
            if (index > -1){
                original.splice(index,1);
            }
        }
        element.className = original.join(' ');
    }

    /**
     * [Helper]  Checks if the document is RTL
     *
     * @return {Boolean} True if the document is RTL, false otherwise.
     */
    function isRightToLeft(){
        return window.getComputedStyle(document.body).direction === 'rtl';
    }
    /**
     * [Helper]  Get the document current scrollTop
     *
     * @return {Number} current document scrollTop value
     */
    function getScrollTop(){
        return ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);
    }

    /**
     * [Helper]  Get the document current scrollLeft
     *
     * @return {Number} current document scrollLeft value
     */
    function getScrollLeft(){
        return ((document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft);
    }

    /**
    * Helper: clear contents
    *
    */
    function clearContents(element){
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
    /**
     * Extends a given prototype by merging properties from base into sub.
     *
     * @sub {Object} sub The prototype being overwritten.
     * @base {Object} base The prototype being written.
     *
     * @return {Object} The extended prototype.
     */
    function copy(src) {
        if(null === src){
            return src;
        }
        var cpy;
        if(Array.isArray(src)){
            cpy = [];
            for(var x=0;x<src.length;x+=1){
                cpy.push(copy(src[x]));
            }
            return cpy;
        }
      
        if(src instanceof Date){
            return new Date(src.getTime());
        }
      
        if(src instanceof RegExp){
            cpy = new RegExp(src.source);
            cpy.global = src.global;
            cpy.ignoreCase = src.ignoreCase;
            cpy.multiline = src.multiline;
            cpy.lastIndex = src.lastIndex;
            return cpy;
        }
        
        if(typeof src === 'object'){
            cpy = {};
            // copy dialog pototype over definition.
            for (var prop in src) {
                if (src.hasOwnProperty(prop)) {
                    cpy[prop] = copy(src[prop]);
                }
            }
            return cpy;
        }
        return src;
    }
    /**
      * Helper: destruct the dialog
      *
      */
    function destruct(instance, initialize){
        //delete the dom and it's references.
        var root = instance.elements.root;
        root.parentNode.removeChild(root);
        delete instance.elements;
        //copy back initial settings.
        instance.settings = copy(instance.__settings);
        //re-reference init function.
        instance.__init = initialize;
        //delete __internal variable to allow re-initialization.
        delete instance.__internal;
    }

    /**
     * Use a closure to return proper event listener method. Try to use
     * `addEventListener` by default but fallback to `attachEvent` for
     * unsupported browser. The closure simply ensures that the test doesn't
     * happen every time the method is called.
     *
     * @param    {Node}     el    Node element
     * @param    {String}   event Event type
     * @param    {Function} fn    Callback of event
     * @return   {Function}
     */
    var on = (function () {
        if (document.addEventListener) {
            return function (el, event, fn, useCapture) {
                el.addEventListener(event, fn, useCapture === true);
            };
        } else if (document.attachEvent) {
            return function (el, event, fn) {
                el.attachEvent('on' + event, fn);
            };
        }
    }());

    /**
     * Use a closure to return proper event listener method. Try to use
     * `removeEventListener` by default but fallback to `detachEvent` for
     * unsupported browser. The closure simply ensures that the test doesn't
     * happen every time the method is called.
     *
     * @param    {Node}     el    Node element
     * @param    {String}   event Event type
     * @param    {Function} fn    Callback of event
     * @return   {Function}
     */
    var off = (function () {
        if (document.removeEventListener) {
            return function (el, event, fn, useCapture) {
                el.removeEventListener(event, fn, useCapture === true);
            };
        } else if (document.detachEvent) {
            return function (el, event, fn) {
                el.detachEvent('on' + event, fn);
            };
        }
    }());

    /**
     * Prevent default event from firing
     *
     * @param  {Event} event Event object
     * @return {undefined}

    function prevent ( event ) {
        if ( event ) {
            if ( event.preventDefault ) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
    */
    var transition = (function () {
        var t, type;
        var supported = false;
        var transitions = {
            'animation'        : 'animationend',
            'OAnimation'       : 'oAnimationEnd oanimationend',
            'msAnimation'      : 'MSAnimationEnd',
            'MozAnimation'     : 'animationend',
            'WebkitAnimation'  : 'webkitAnimationEnd'
        };

        for (t in transitions) {
            if (document.documentElement.style[t] !== undefined) {
                type = transitions[t];
                supported = true;
                break;
            }
        }

        return {
            type: type,
            supported: supported
        };
    }());

    /**
    * Creates event handler delegate that sends the instance as last argument.
    * 
    * @return {Function}    a function wrapper which sends the instance as last argument.
    */
    function delegate(context, method) {
        return function () {
            if (arguments.length > 0) {
                var args = [];
                for (var x = 0; x < arguments.length; x += 1) {
                    args.push(arguments[x]);
                }
                args.push(context);
                return method.apply(context, args);
            }
            return method.apply(context, [null, context]);
        };
    }
    /**
    * Helper for creating a dialog close event.
    * 
    * @return {object}
    */
    function createCloseEvent(index, button) {
        return {
            index: index,
            button: button,
            cancel: false
        };
    }
    /**
    * Helper for dispatching events.
    *
    * @param  {string} evenType The type of the event to disptach.
    * @param  {object} instance The dialog instance disptaching the event.
    *
    * @return   {any}   The result of the invoked function.
    */
    function dispatchEvent(eventType, instance) {
        if ( typeof instance.get(eventType) === 'function' ) {
            return instance.get(eventType).call(instance);
        }
    }


    /**
     * Super class for all dialogs
     *
     * @return {Object}		base dialog prototype
     */
    var dialog = (function () {
        var //holds the list of used keys.
            usedKeys = [],
            //dummy variable, used to trigger dom reflow.
            reflow = null,
            //condition for detecting safari
            isSafari = window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') < 0,
            //dialog building blocks
            templates = {
                dimmer:'<div class="ajs-dimmer"></div>',
                /*tab index required to fire click event before body focus*/
                modal: '<div class="ajs-modal" tabindex="0"></div>',
                dialog: '<div class="ajs-dialog" tabindex="0"></div>',
                reset: '<button class="ajs-reset"></button>',
                commands: '<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',
                header: '<div class="ajs-header"></div>',
                body: '<div class="ajs-body"></div>',
                content: '<div class="ajs-content"></div>',
                footer: '<div class="ajs-footer"></div>',
                buttons: { primary: '<div class="ajs-primary ajs-buttons"></div>', auxiliary: '<div class="ajs-auxiliary ajs-buttons"></div>' },
                button: '<button class="ajs-button"></button>',
                resizeHandle: '<div class="ajs-handle"></div>',
            },
            //common class names
            classes = {
                animationIn: 'ajs-in',
                animationOut: 'ajs-out',
                base: 'alertify',
                basic:'ajs-basic',
                capture: 'ajs-capture',
                closable:'ajs-closable',
                fixed: 'ajs-fixed',
                frameless:'ajs-frameless',
                hidden: 'ajs-hidden',
                maximize: 'ajs-maximize',
                maximized: 'ajs-maximized',
                maximizable:'ajs-maximizable',
                modeless: 'ajs-modeless',
                movable: 'ajs-movable',
                noSelection: 'ajs-no-selection',
                noOverflow: 'ajs-no-overflow',
                noPadding:'ajs-no-padding',
                pin:'ajs-pin',
                pinnable:'ajs-pinnable',
                prefix: 'ajs-',
                resizable: 'ajs-resizable',
                restore: 'ajs-restore',
                shake:'ajs-shake',
                unpinned:'ajs-unpinned',
            };

        /**
         * Helper: initializes the dialog instance
         * 
         * @return	{Number}	The total count of currently open modals.
         */
        function initialize(instance){
            
            if(!instance.__internal){

                //no need to expose init after this.
                delete instance.__init;
              
                //keep a copy of initial dialog settings
                if(!instance.__settings){
                    instance.__settings = copy(instance.settings);
                }
                //in case the script was included before body.
                //after first dialog gets initialized, it won't be null anymore!
                if(null === reflow){
                    // set tabindex attribute on body element this allows script to give it
                    // focus after the dialog is closed
                    document.body.setAttribute( 'tabindex', '0' );
                }

                //get dialog buttons/focus setup
                var setup;
                if(typeof instance.setup === 'function'){
                    setup = instance.setup();
                    setup.options = setup.options  || {};
                    setup.focus = setup.focus  || {};
                }else{
                    setup = {
                        buttons:[],
                        focus:{
                            element:null,
                            select:false
                        },
                        options:{
                        }
                    };
                }
                
                //initialize hooks object.
                if(typeof instance.hooks !== 'object'){
                    instance.hooks = {};
                }

                //copy buttons defintion
                var buttonsDefinition = [];
                if(Array.isArray(setup.buttons)){
                    for(var b=0;b<setup.buttons.length;b+=1){
                        var ref  = setup.buttons[b],
                            cpy = {};
                        for (var i in ref) {
                            if (ref.hasOwnProperty(i)) {
                                cpy[i] = ref[i];
                            }
                        }
                        buttonsDefinition.push(cpy);
                    }
                }

                var internal = instance.__internal = {
                    /**
                     * Flag holding the open state of the dialog
                     * 
                     * @type {Boolean}
                     */
                    isOpen:false,
                    /**
                     * Active element is the element that will receive focus after
                     * closing the dialog. It defaults as the body tag, but gets updated
                     * to the last focused element before the dialog was opened.
                     *
                     * @type {Node}
                     */
                    activeElement:document.body,
                    timerIn:undefined,
                    timerOut:undefined,
                    buttons: buttonsDefinition,
                    focus: setup.focus,
                    options: {
                        title: undefined,
                        modal: undefined,
                        basic:undefined,
                        frameless:undefined,
                        pinned: undefined,
                        movable: undefined,
                        moveBounded:undefined,
                        resizable: undefined,
                        autoReset: undefined,
                        closable: undefined,
                        closableByDimmer: undefined,
                        maximizable: undefined,
                        startMaximized: undefined,
                        pinnable: undefined,
                        transition: undefined,
                        padding:undefined,
                        overflow:undefined,
                        onshow:undefined,
                        onclosing:undefined,
                        onclose:undefined,
                        onfocus:undefined,
                        onmove:undefined,
                        onmoved:undefined,
                        onresize:undefined,
                        onresized:undefined,
                        onmaximize:undefined,
                        onmaximized:undefined,
                        onrestore:undefined,
                        onrestored:undefined
                    },
                    resetHandler:undefined,
                    beginMoveHandler:undefined,
                    beginResizeHandler:undefined,
                    bringToFrontHandler:undefined,
                    modalClickHandler:undefined,
                    buttonsClickHandler:undefined,
                    commandsClickHandler:undefined,
                    transitionInHandler:undefined,
                    transitionOutHandler:undefined,
                    destroy:undefined
                };

                var elements = {};
                //root node
                elements.root = document.createElement('div');
                
                elements.root.className = classes.base + ' ' + classes.hidden + ' ';

                elements.root.innerHTML = templates.dimmer + templates.modal;
                
                //dimmer
                elements.dimmer = elements.root.firstChild;

                //dialog
                elements.modal = elements.root.lastChild;
                elements.modal.innerHTML = templates.dialog;
                elements.dialog = elements.modal.firstChild;
                elements.dialog.innerHTML = templates.reset + templates.commands + templates.header + templates.body + templates.footer + templates.resizeHandle + templates.reset;

                //reset links
                elements.reset = [];
                elements.reset.push(elements.dialog.firstChild);
                elements.reset.push(elements.dialog.lastChild);
                
                //commands
                elements.commands = {};
                elements.commands.container = elements.reset[0].nextSibling;
                elements.commands.pin = elements.commands.container.firstChild;
                elements.commands.maximize = elements.commands.pin.nextSibling;
                elements.commands.close = elements.commands.maximize.nextSibling;
                
                //header
                elements.header = elements.commands.container.nextSibling;

                //body
                elements.body = elements.header.nextSibling;
                elements.body.innerHTML = templates.content;
                elements.content = elements.body.firstChild;

                //footer
                elements.footer = elements.body.nextSibling;
                elements.footer.innerHTML = templates.buttons.auxiliary + templates.buttons.primary;
                
                //resize handle
                elements.resizeHandle = elements.footer.nextSibling;

                //buttons
                elements.buttons = {};
                elements.buttons.auxiliary = elements.footer.firstChild;
                elements.buttons.primary = elements.buttons.auxiliary.nextSibling;
                elements.buttons.primary.innerHTML = templates.button;
                elements.buttonTemplate = elements.buttons.primary.firstChild;
                //remove button template
                elements.buttons.primary.removeChild(elements.buttonTemplate);
                               
                for(var x=0; x < instance.__internal.buttons.length; x+=1) {
                    var button = instance.__internal.buttons[x];
                    
                    // add to the list of used keys.
                    if(usedKeys.indexOf(button.key) < 0){
                        usedKeys.push(button.key);
                    }

                    button.element = elements.buttonTemplate.cloneNode();
                    button.element.innerHTML = button.text;
                    if(typeof button.className === 'string' &&  button.className !== ''){
                        addClass(button.element, button.className);
                    }
                    for(var key in button.attrs){
                        if(key !== 'className' && button.attrs.hasOwnProperty(key)){
                            button.element.setAttribute(key, button.attrs[key]);
                        }
                    }
                    if(button.scope === 'auxiliary'){
                        elements.buttons.auxiliary.appendChild(button.element);
                    }else{
                        elements.buttons.primary.appendChild(button.element);
                    }
                }
                //make elements pubic
                instance.elements = elements;
                
                //save event handlers delegates
                internal.resetHandler = delegate(instance, onReset);
                internal.beginMoveHandler = delegate(instance, beginMove);
                internal.beginResizeHandler = delegate(instance, beginResize);
                internal.bringToFrontHandler = delegate(instance, bringToFront);
                internal.modalClickHandler = delegate(instance, modalClickHandler);
                internal.buttonsClickHandler = delegate(instance, buttonsClickHandler);
                internal.commandsClickHandler = delegate(instance, commandsClickHandler);
                internal.transitionInHandler = delegate(instance, handleTransitionInEvent);
                internal.transitionOutHandler = delegate(instance, handleTransitionOutEvent);

                //settings
                for(var opKey in internal.options){
                    if(setup.options[opKey] !== undefined){
                        // if found in user options
                        instance.set(opKey, setup.options[opKey]);
                    }else if(alertify.defaults.hasOwnProperty(opKey)) {
                        // else if found in defaults options
                        instance.set(opKey, alertify.defaults[opKey]);
                    }else if(opKey === 'title' ) {
                        // else if title key, use alertify.defaults.glossary
                        instance.set(opKey, alertify.defaults.glossary[opKey]);
                    }
                }

                // allow dom customization
                if(typeof instance.build === 'function'){
                    instance.build();
                }
            }
            
            //add to the end of the DOM tree.
            document.body.appendChild(instance.elements.root);
        }

        /**
         * Helper: maintains scroll position
         *
         */
        var scrollX, scrollY;
        function saveScrollPosition(){
            scrollX = getScrollLeft();
            scrollY = getScrollTop();
        }
        function restoreScrollPosition(){
            window.scrollTo(scrollX, scrollY);
        }

        /**
         * Helper: adds/removes no-overflow class from body
         *
         */
        function ensureNoOverflow(){
            var requiresNoOverflow = 0;
            for(var x=0;x<openDialogs.length;x+=1){
                var instance = openDialogs[x];
                if(instance.isModal() || instance.isMaximized()){
                    requiresNoOverflow+=1;
                }
            }
            if(requiresNoOverflow === 0 && document.body.className.indexOf(classes.noOverflow) >= 0){
                //last open modal or last maximized one
                removeClass(document.body, classes.noOverflow);
                preventBodyShift(false);
            }else if(requiresNoOverflow > 0 && document.body.className.indexOf(classes.noOverflow) < 0){
                //first open modal or first maximized one
                preventBodyShift(true);
                addClass(document.body, classes.noOverflow);
            }
        }
        var top = '', topScroll = 0;
        /**
         * Helper: prevents body shift.
         *
         */
        function preventBodyShift(add){
            if(alertify.defaults.preventBodyShift && document.documentElement.scrollHeight > document.documentElement.clientHeight){
                if(add ){//&& openDialogs[openDialogs.length-1].elements.dialog.clientHeight <= document.documentElement.clientHeight){
                    topScroll = scrollY;
                    top = window.getComputedStyle(document.body).top;
                    addClass(document.body, classes.fixed);
                    document.body.style.top = -scrollY + 'px';
                } else {
                    scrollY = topScroll;
                    document.body.style.top = top;
                    removeClass(document.body, classes.fixed);
                    restoreScrollPosition();
                }
            }
        }
		
        /**
         * Sets the name of the transition used to show/hide the dialog
         * 
         * @param {Object} instance The dilog instance.
         *
         */
        function updateTransition(instance, value, oldValue){
            if(typeof oldValue === 'string'){
                removeClass(instance.elements.root,classes.prefix +  oldValue);
            }
            addClass(instance.elements.root, classes.prefix + value);
            reflow = instance.elements.root.offsetWidth;
        }
		
        /**
         * Toggles the dialog display mode
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateDisplayMode(instance){
            if(instance.get('modal')){

                //make modal
                removeClass(instance.elements.root, classes.modeless);

                //only if open
                if(instance.isOpen()){
                    unbindModelessEvents(instance);

                    //in case a pinned modless dialog was made modal while open.
                    updateAbsPositionFix(instance);

                    ensureNoOverflow();
                }
            }else{
                //make modelss
                addClass(instance.elements.root, classes.modeless);

                //only if open
                if(instance.isOpen()){
                    bindModelessEvents(instance);

                    //in case pin/unpin was called while a modal is open
                    updateAbsPositionFix(instance);

                    ensureNoOverflow();
                }
            }
        }

        /**
         * Toggles the dialog basic view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateBasicMode(instance){
            if (instance.get('basic')) {
                // add class
                addClass(instance.elements.root, classes.basic);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.basic);
            }
        }

        /**
         * Toggles the dialog frameless view mode 
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function updateFramelessMode(instance){
            if (instance.get('frameless')) {
                // add class
                addClass(instance.elements.root, classes.frameless);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.frameless);
            }
        }
		
        /**
         * Helper: Brings the modeless dialog to front, attached to modeless dialogs.
         *
         * @param {Event} event Focus event
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bringToFront(event, instance){
            
            // Do not bring to front if preceeded by an open modal
            var index = openDialogs.indexOf(instance);
            for(var x=index+1;x<openDialogs.length;x+=1){
                if(openDialogs[x].isModal()){
                    return;
                }
            }
			
            // Bring to front by making it the last child.
            if(document.body.lastChild !== instance.elements.root){
                document.body.appendChild(instance.elements.root);
                //also make sure its at the end of the list
                openDialogs.splice(openDialogs.indexOf(instance),1);
                openDialogs.push(instance);
                setFocus(instance);
            }
			
            return false;
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {String} option The updated option name.
         *
         * @return	{undefined}	
         */
        function optionUpdated(instance, option, oldValue, newValue){
            switch(option){
            case 'title':
                instance.setHeader(newValue);
                break;
            case 'modal':
                updateDisplayMode(instance);
                break;
            case 'basic':
                updateBasicMode(instance);
                break;
            case 'frameless':
                updateFramelessMode(instance);
                break;
            case 'pinned':
                updatePinned(instance);
                break;
            case 'closable':
                updateClosable(instance);
                break;
            case 'maximizable':
                updateMaximizable(instance);
                break;
            case 'pinnable':
                updatePinnable(instance);
                break;
            case 'movable':
                updateMovable(instance);
                break;
            case 'resizable':
                updateResizable(instance);
                break;
            case 'transition':
                updateTransition(instance,newValue, oldValue);
                break;
            case 'padding':
                if(newValue){
                    removeClass(instance.elements.root, classes.noPadding);
                }else if(instance.elements.root.className.indexOf(classes.noPadding) < 0){
                    addClass(instance.elements.root, classes.noPadding);
                }
                break;
            case 'overflow':
                if(newValue){
                    removeClass(instance.elements.root, classes.noOverflow);
                }else if(instance.elements.root.className.indexOf(classes.noOverflow) < 0){
                    addClass(instance.elements.root, classes.noOverflow);
                }
                break;
            case 'transition':
                updateTransition(instance,newValue, oldValue);
                break;
            }

            // internal on option updated event
            if(typeof instance.hooks.onupdate === 'function'){
                instance.hooks.onupdate.call(instance, option, oldValue, newValue);
            }
        }
		
        /**
         * Helper: reflects dialogs options updates
         *
         * @param {Object} instance The dilog instance.
         * @param {Object} obj The object to set/get a value on/from.
         * @param {Function} callback The callback function to call if the key was found.
         * @param {String|Object} key A string specifying a propery name or a collection of key value pairs.
         * @param {Object} value Optional, the value associated with the key (in case it was a string).
         * @param {String} option The updated option name.
         *
         * @return	{Object} result object 
         *	The result objects has an 'op' property, indicating of this is a SET or GET operation.
         *		GET: 
         *		- found: a flag indicating if the key was found or not.
         *		- value: the property value.
         *		SET:
         *		- items: a list of key value pairs of the properties being set.
         *				each contains:
         *					- found: a flag indicating if the key was found or not.
         *					- key: the property key.
         *					- value: the property value.
         */
        function update(instance, obj, callback, key, value){
            var result = {op:undefined, items: [] };
            if(typeof value === 'undefined' && typeof key === 'string') {
                //get
                result.op = 'get';
                if(obj.hasOwnProperty(key)){
                    result.found = true;
                    result.value = obj[key];
                }else{
                    result.found = false;
                    result.value = undefined;
                }
            }
            else
            {
                var old;
                //set
                result.op = 'set';
                if(typeof key === 'object'){
                    //set multiple
                    var args = key;
                    for (var prop in args) {
                        if (obj.hasOwnProperty(prop)) {
                            if(obj[prop] !== args[prop]){
                                old = obj[prop];
                                obj[prop] = args[prop];
                                callback.call(instance,prop, old, args[prop]);
                            }
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':true});
                        }else{
                            result.items.push({ 'key': prop, 'value': args[prop], 'found':false});
                        }
                    }
                } else if (typeof key === 'string'){
                    //set single
                    if (obj.hasOwnProperty(key)) {
                        if(obj[key] !== value){
                            old  = obj[key];
                            obj[key] = value;
                            callback.call(instance,key, old, value);
                        }
                        result.items.push({'key': key, 'value': value , 'found':true});

                    }else{
                        result.items.push({'key': key, 'value': value , 'found':false});
                    }
                } else {
                    //invalid params
                    throw new Error('args must be a string or object');
                }
            }
            return result;
        }


        /**
         * Triggers a close event.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function triggerClose(instance) {
            var found;
            triggerCallback(instance, function (button) {
                return found = (button.invokeOnClose === true);
            });
            //none of the buttons registered as onclose callback
            //close the dialog
            if (!found && instance.isOpen()) {
                instance.close();
            }
        }

        /**
         * Dialogs commands event handler, attached to the dialog commands element.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function commandsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            switch (target) {
            case instance.elements.commands.pin:
                if (!instance.isPinned()) {
                    pin(instance);
                } else {
                    unpin(instance);
                }
                break;
            case instance.elements.commands.maximize:
                if (!instance.isMaximized()) {
                    maximize(instance);
                } else {
                    restore(instance);
                }
                break;
            case instance.elements.commands.close:
                triggerClose(instance);
                break;
            }
            return false;
        }

        /**
         * Helper: pins the modeless dialog.
         *
         * @param {Object} instance	The dialog instance.
         * 
         * @return {undefined}
         */
        function pin(instance) {
            //pin the dialog
            instance.set('pinned', true);
        }

        /**
         * Helper: unpins the modeless dialog.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function unpin(instance) {
            //unpin the dialog 
            instance.set('pinned', false);
        }


        /**
         * Helper: enlarges the dialog to fill the entire screen.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function maximize(instance) {
            // allow custom `onmaximize` method
            dispatchEvent('onmaximize', instance);
            //maximize the dialog 
            addClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
            // allow custom `onmaximized` method
            dispatchEvent('onmaximized', instance);
        }

        /**
         * Helper: returns the dialog to its former size.
         *
         * @param {Object} instance	The dilog instance.
         * 
         * @return {undefined}
         */
        function restore(instance) {
            // allow custom `onrestore` method
            dispatchEvent('onrestore', instance);
            //maximize the dialog 
            removeClass(instance.elements.root, classes.maximized);
            if (instance.isOpen()) {
                ensureNoOverflow();
            }
            // allow custom `onrestored` method
            dispatchEvent('onrestored', instance);
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updatePinnable(instance) {
            if (instance.get('pinnable')) {
                // add class
                addClass(instance.elements.root, classes.pinnable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.pinnable);
            }
        }

        /**
         * Helper: Fixes the absolutly positioned modal div position.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function addAbsPositionFix(instance) {
            var scrollLeft = getScrollLeft();
            instance.elements.modal.style.marginTop = getScrollTop() + 'px';
            instance.elements.modal.style.marginLeft = scrollLeft + 'px';
            instance.elements.modal.style.marginRight = (-scrollLeft) + 'px';
        }

        /**
         * Helper: Removes the absolutly positioned modal div position fix.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function removeAbsPositionFix(instance) {
            var marginTop = parseInt(instance.elements.modal.style.marginTop, 10);
            var marginLeft = parseInt(instance.elements.modal.style.marginLeft, 10);
            instance.elements.modal.style.marginTop = '';
            instance.elements.modal.style.marginLeft = '';
            instance.elements.modal.style.marginRight = '';

            if (instance.isOpen()) {
                var top = 0,
                    left = 0
                ;
                if (instance.elements.dialog.style.top !== '') {
                    top = parseInt(instance.elements.dialog.style.top, 10);
                }
                instance.elements.dialog.style.top = (top + (marginTop - getScrollTop())) + 'px';

                if (instance.elements.dialog.style.left !== '') {
                    left = parseInt(instance.elements.dialog.style.left, 10);
                }
                instance.elements.dialog.style.left = (left + (marginLeft - getScrollLeft())) + 'px';
            }
        }
        /**
         * Helper: Adds/Removes the absolutly positioned modal div position fix based on its pinned setting.
         *
         * @param {Object} instance The dialog instance.
         *
         * @return {undefined}
         */
        function updateAbsPositionFix(instance) {
            // if modeless and unpinned add fix
            if (!instance.get('modal') && !instance.get('pinned')) {
                addAbsPositionFix(instance);
            } else {
                removeAbsPositionFix(instance);
            }
        }
        /**
         * Toggles the dialog position lock | modeless only.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to make it modal, false otherwise.
         *
         * @return {undefined}
         */
        function updatePinned(instance) {
            if (instance.get('pinned')) {
                removeClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen()) {
                    removeAbsPositionFix(instance);
                }
            } else {
                addClass(instance.elements.root, classes.unpinned);
                if (instance.isOpen() && !instance.isModal()) {
                    addAbsPositionFix(instance);
                }
            }
        }

        /**
         * Show or hide the maximize box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMaximizable(instance) {
            if (instance.get('maximizable')) {
                // add class
                addClass(instance.elements.root, classes.maximizable);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.maximizable);
            }
        }

        /**
         * Show or hide the close box.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateClosable(instance) {
            if (instance.get('closable')) {
                // add class
                addClass(instance.elements.root, classes.closable);
                bindClosableEvents(instance);
            } else {
                // remove class
                removeClass(instance.elements.root, classes.closable);
                unbindClosableEvents(instance);
            }
        }

        // flag to cancel click event if already handled by end resize event (the mousedown, mousemove, mouseup sequence fires a click event.).
        var cancelClick = false;

        /**
         * Helper: closes the modal dialog when clicking the modal
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function modalClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            if (!cancelClick && target === instance.elements.modal && instance.get('closableByDimmer') === true) {
                triggerClose(instance);
            }
            cancelClick = false;
            return false;
        }

        // flag to cancel keyup event if already handled by click event (pressing Enter on a focusted button).
        var cancelKeyup = false;
        /** 
         * Helper: triggers a button callback
         *
         * @param {Object}		The dilog instance.
         * @param {Function}	Callback to check which button triggered the event.
         *
         * @return {undefined}
         */
        function triggerCallback(instance, check) {
            for (var idx = 0; idx < instance.__internal.buttons.length; idx += 1) {
                var button = instance.__internal.buttons[idx];
                if (!button.element.disabled && check(button)) {
                    var closeEvent = createCloseEvent(idx, button);
                    if (typeof instance.callback === 'function') {
                        instance.callback.apply(instance, [closeEvent]);
                    }
                    //close the dialog only if not canceled.
                    if (closeEvent.cancel === false) {
                        instance.close();
                    }
                    break;
                }
            }
        }

        /**
         * Clicks event handler, attached to the dialog footer.
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function buttonsClickHandler(event, instance) {
            var target = event.srcElement || event.target;
            triggerCallback(instance, function (button) {
                // if this button caused the click, cancel keyup event
                return button.element === target && (cancelKeyup = true);
            });
        }

        /**
         * Keyup event handler, attached to the document.body
         *
         * @param {Event}		DOM event object.
         * @param {Object}		The dilog instance.
         * 
         * @return {undefined}
         */
        function keyupHandler(event) {
            //hitting enter while button has focus will trigger keyup too.
            //ignore if handled by clickHandler
            if (cancelKeyup) {
                cancelKeyup = false;
                return;
            }
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (instance.__internal.buttons.length === 0 && keyCode === keys.ESC && instance.get('closable') === true) {
                triggerClose(instance);
                return false;
            }else if (usedKeys.indexOf(keyCode) > -1) {
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }
        /**
        * Keydown event handler, attached to the document.body
        *
        * @param {Event}		DOM event object.
        * @param {Object}		The dilog instance.
        * 
        * @return {undefined}
        */
        function keydownHandler(event) {
            var instance = openDialogs[openDialogs.length - 1];
            var keyCode = event.keyCode;
            if (keyCode === keys.LEFT || keyCode === keys.RIGHT) {
                var buttons = instance.__internal.buttons;
                for (var x = 0; x < buttons.length; x += 1) {
                    if (document.activeElement === buttons[x].element) {
                        switch (keyCode) {
                        case keys.LEFT:
                            buttons[(x || buttons.length) - 1].element.focus();
                            return;
                        case keys.RIGHT:
                            buttons[(x + 1) % buttons.length].element.focus();
                            return;
                        }
                    }
                }
            }else if (keyCode < keys.F12 + 1 && keyCode > keys.F1 - 1 && usedKeys.indexOf(keyCode) > -1) {
                event.preventDefault();
                event.stopPropagation();
                triggerCallback(instance, function (button) {
                    return button.key === keyCode;
                });
                return false;
            }
        }


        /**
         * Sets focus to proper dialog element
         *
         * @param {Object} instance The dilog instance.
         * @param {Node} [resetTarget=undefined] DOM element to reset focus to.
         *
         * @return {undefined}
         */
        function setFocus(instance, resetTarget) {
            // reset target has already been determined.
            if (resetTarget) {
                resetTarget.focus();
            } else {
                // current instance focus settings
                var focus = instance.__internal.focus;
                // the focus element.
                var element = focus.element;

                switch (typeof focus.element) {
                // a number means a button index
                case 'number':
                    if (instance.__internal.buttons.length > focus.element) {
                        //in basic view, skip focusing the buttons.
                        if (instance.get('basic') === true) {
                            element = instance.elements.reset[0];
                        } else {
                            element = instance.__internal.buttons[focus.element].element;
                        }
                    }
                    break;
                // a string means querySelector to select from dialog body contents.
                case 'string':
                    element = instance.elements.body.querySelector(focus.element);
                    break;
                // a function should return the focus element.
                case 'function':
                    element = focus.element.call(instance);
                    break;
                }
                
                // if no focus element, default to first reset element.
                if ((typeof element === 'undefined' || element === null) && instance.__internal.buttons.length === 0) {
                    element = instance.elements.reset[0];
                }
                // focus
                if (element && element.focus) {
                    element.focus();
                    // if selectable
                    if (focus.select && element.select) {
                        element.select();
                    }
                }
            }
        }

        /**
         * Focus event handler, attached to document.body and dialogs own reset links.
         * handles the focus for modal dialogs only.
         *
         * @param {Event} event DOM focus event object.
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function onReset(event, instance) {

            // should work on last modal if triggered from document.body 
            if (!instance) {
                for (var x = openDialogs.length - 1; x > -1; x -= 1) {
                    if (openDialogs[x].isModal()) {
                        instance = openDialogs[x];
                        break;
                    }
                }
            }
            // if modal
            if (instance && instance.isModal()) {
                // determine reset target to enable forward/backward tab cycle.
                var resetTarget, target = event.srcElement || event.target;
                var lastResetElement = target === instance.elements.reset[1] || (instance.__internal.buttons.length === 0 && target === document.body);

                // if last reset link, then go to maximize or close
                if (lastResetElement) {
                    if (instance.get('maximizable')) {
                        resetTarget = instance.elements.commands.maximize;
                    } else if (instance.get('closable')) {
                        resetTarget = instance.elements.commands.close;
                    }
                }
                // if no reset target found, try finding the best button
                if (resetTarget === undefined) {
                    if (typeof instance.__internal.focus.element === 'number') {
                        // button focus element, go to first available button
                        if (target === instance.elements.reset[0]) {
                            resetTarget = instance.elements.buttons.auxiliary.firstChild || instance.elements.buttons.primary.firstChild;
                        } else if (lastResetElement) {
                            //restart the cycle by going to first reset link
                            resetTarget = instance.elements.reset[0];
                        }
                    } else {
                        // will reach here when tapping backwards, so go to last child
                        // The focus element SHOULD NOT be a button (logically!).
                        if (target === instance.elements.reset[0]) {
                            resetTarget = instance.elements.buttons.primary.lastChild || instance.elements.buttons.auxiliary.lastChild;
                        }
                    }
                }
                // focus
                setFocus(instance, resetTarget);
            }
        }
        /**
         * Transition in transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionInEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerIn);

            // once transition is complete, set focus
            setFocus(instance);

            //restore scroll to prevent document jump
            restoreScrollPosition();

            // allow handling key up after transition ended.
            cancelKeyup = false;

            // allow custom `onfocus` method
            dispatchEvent('onfocus', instance);

            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            removeClass(instance.elements.root, classes.animationIn);
        }

        /**
         * Transition out transitionend event handler. 
         *
         * @param {Event}		TransitionEnd event object.
         * @param {Object}		The dilog instance.
         *
         * @return {undefined}
         */
        function handleTransitionOutEvent(event, instance) {
            // clear the timer
            clearTimeout(instance.__internal.timerOut);
            // unbind the event
            off(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // reset move updates
            resetMove(instance);
            // reset resize updates
            resetResize(instance);

            // restore if maximized
            if (instance.isMaximized() && !instance.get('startMaximized')) {
                restore(instance);
            }

            // return focus to the last active element
            if (alertify.defaults.maintainFocus && instance.__internal.activeElement) {
                instance.__internal.activeElement.focus();
                instance.__internal.activeElement = null;
            }
            
            //destory the instance
            if (typeof instance.__internal.destroy === 'function') {
                instance.__internal.destroy.apply(instance);
            }
        }
        /* Controls moving a dialog around */
        //holde the current moving instance
        var movable = null,
            //holds the current X offset when move starts
            offsetX = 0,
            //holds the current Y offset when move starts
            offsetY = 0,
            xProp = 'pageX',
            yProp = 'pageY',
            bounds = null,
            refreshTop = false,
            moveDelegate = null
        ;

        /**
         * Helper: sets the element top/left coordinates
         *
         * @param {Event} event	DOM event object.
         * @param {Node} element The element being moved.
         * 
         * @return {undefined}
         */
        function moveElement(event, element) {
            var left = (event[xProp] - offsetX),
                top  = (event[yProp] - offsetY);

            if(refreshTop){
                top -= document.body.scrollTop;
            }
           
            element.style.left = left + 'px';
            element.style.top = top + 'px';
           
        }
        /**
         * Helper: sets the element top/left coordinates within screen bounds
         *
         * @param {Event} event	DOM event object.
         * @param {Node} element The element being moved.
         * 
         * @return {undefined}
         */
        function moveElementBounded(event, element) {
            var left = (event[xProp] - offsetX),
                top  = (event[yProp] - offsetY);

            if(refreshTop){
                top -= document.body.scrollTop;
            }
            
            element.style.left = Math.min(bounds.maxLeft, Math.max(bounds.minLeft, left)) + 'px';
            if(refreshTop){
                element.style.top = Math.min(bounds.maxTop, Math.max(bounds.minTop, top)) + 'px';
            }else{
                element.style.top = Math.max(bounds.minTop, top) + 'px';
            }
        }
            

        /**
         * Triggers the start of a move event, attached to the header element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginMove(event, instance) {
            if (resizable === null && !instance.isMaximized() && instance.get('movable')) {
                var eventSrc, left=0, top=0;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                    xProp = 'clientX';
                    yProp = 'clientY';
                } else if (event.button === 0) {
                    eventSrc = event;
                }

                if (eventSrc) {

                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);

                    if (element.style.left) {
                        left = parseInt(element.style.left, 10);
                    }

                    if (element.style.top) {
                        top = parseInt(element.style.top, 10);
                    }
                    
                    offsetX = eventSrc[xProp] - left;
                    offsetY = eventSrc[yProp] - top;

                    if(instance.isModal()){
                        offsetY += instance.elements.modal.scrollTop;
                    }else if(instance.isPinned()){
                        offsetY -= document.body.scrollTop;
                    }
                    
                    if(instance.get('moveBounded')){
                        var current = element,
                            offsetLeft = -left,
                            offsetTop = -top;
                        
                        //calc offset
                        do {
                            offsetLeft += current.offsetLeft;
                            offsetTop += current.offsetTop;
                        } while (current = current.offsetParent);
                        
                        bounds = {
                            maxLeft : offsetLeft,
                            minLeft : -offsetLeft,
                            maxTop  : document.documentElement.clientHeight - element.clientHeight - offsetTop,
                            minTop  : -offsetTop
                        };
                        moveDelegate = moveElementBounded;
                    }else{
                        bounds = null;
                        moveDelegate = moveElement;
                    }
                    
                    // allow custom `onmove` method
                    dispatchEvent('onmove', instance);

                    refreshTop = !instance.isModal() && instance.isPinned();
                    movable = instance;
                    moveDelegate(eventSrc, element);
                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual move handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function move(event) {
            if (movable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    moveDelegate(eventSrc, movable.elements.dialog);
                }
            }
        }

        /**
         * Triggers the end of a move event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endMove() {
            if (movable) {
                var instance = movable;
                movable = bounds = null;
                removeClass(document.body, classes.noSelection);
                removeClass(instance.elements.dialog, classes.capture);
                // allow custom `onmoved` method
                dispatchEvent('onmoved', instance);
            }
        }

        /**
         * Resets any changes made by moving the element to its original state,
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetMove(instance) {
            movable = null;
            var element = instance.elements.dialog;
            element.style.left = element.style.top = '';
        }

        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateMovable(instance) {
            if (instance.get('movable')) {
                // add class
                addClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    bindMovableEvents(instance);
                }
            } else {

                //reset
                resetMove(instance);
                // remove class
                removeClass(instance.elements.root, classes.movable);
                if (instance.isOpen()) {
                    unbindMovableEvents(instance);
                }
            }
        }

        /* Controls moving a dialog around */
        //holde the current instance being resized		
        var resizable = null,
            //holds the staring left offset when resize starts.
            startingLeft = Number.Nan,
            //holds the staring width when resize starts.
            startingWidth = 0,
            //holds the initial width when resized for the first time.
            minWidth = 0,
            //holds the offset of the resize handle.
            handleOffset = 0
        ;

        /**
         * Helper: sets the element width/height and updates left coordinate if neccessary.
         *
         * @param {Event} event	DOM mousemove event object.
         * @param {Node} element The element being moved.
         * @param {Boolean} pinned A flag indicating if the element being resized is pinned to the screen.
         * 
         * @return {undefined}
         */
        function resizeElement(event, element, pageRelative) {

            //calculate offsets from 0,0
            var current = element;
            var offsetLeft = 0;
            var offsetTop = 0;
            do {
                offsetLeft += current.offsetLeft;
                offsetTop += current.offsetTop;
            } while (current = current.offsetParent);

            // determine X,Y coordinates.
            var X, Y;
            if (pageRelative === true) {
                X = event.pageX;
                Y = event.pageY;
            } else {
                X = event.clientX;
                Y = event.clientY;
            }
            // rtl handling
            var isRTL = isRightToLeft();
            if (isRTL) {
                // reverse X 
                X = document.body.offsetWidth - X;
                // if has a starting left, calculate offsetRight
                if (!isNaN(startingLeft)) {
                    offsetLeft = document.body.offsetWidth - offsetLeft - element.offsetWidth;
                }
            }

            // set width/height
            element.style.height = (Y - offsetTop + handleOffset) + 'px';
            element.style.width = (X - offsetLeft + handleOffset) + 'px';

            // if the element being resized has a starting left, maintain it.
            // the dialog is centered, divide by half the offset to maintain the margins.
            if (!isNaN(startingLeft)) {
                var diff = Math.abs(element.offsetWidth - startingWidth) * 0.5;
                if (isRTL) {
                    //negate the diff, why?
                    //when growing it should decrease left
                    //when shrinking it should increase left
                    diff *= -1;
                }
                if (element.offsetWidth > startingWidth) {
                    //growing
                    element.style.left = (startingLeft + diff) + 'px';
                } else if (element.offsetWidth >= minWidth) {
                    //shrinking
                    element.style.left = (startingLeft - diff) + 'px';
                }
            }
        }

        /**
         * Triggers the start of a resize event, attached to the resize handle element mouse down event.
         * Adds no-selection class to the body, disabling selection while moving.
         *
         * @param {Event} event	DOM event object.
         * @param {Object} instance The dilog instance.
         * 
         * @return {Boolean} false
         */
        function beginResize(event, instance) {
            if (!instance.isMaximized()) {
                var eventSrc;
                if (event.type === 'touchstart') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    // allow custom `onresize` method
                    dispatchEvent('onresize', instance);
                    
                    resizable = instance;
                    handleOffset = instance.elements.resizeHandle.offsetHeight / 2;
                    var element = instance.elements.dialog;
                    addClass(element, classes.capture);
                    startingLeft = parseInt(element.style.left, 10);
                    element.style.height = element.offsetHeight + 'px';
                    element.style.minHeight = instance.elements.header.offsetHeight + instance.elements.footer.offsetHeight + 'px';
                    element.style.width = (startingWidth = element.offsetWidth) + 'px';

                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    addClass(document.body, classes.noSelection);
                    return false;
                }
            }
        }

        /**
         * The actual resize handler,  attached to document.body mousemove event.
         *
         * @param {Event} event	DOM event object.
         * 
         * @return {undefined}
         */
        function resize(event) {
            if (resizable) {
                var eventSrc;
                if (event.type === 'touchmove') {
                    event.preventDefault();
                    eventSrc = event.targetTouches[0];
                } else if (event.button === 0) {
                    eventSrc = event;
                }
                if (eventSrc) {
                    resizeElement(eventSrc, resizable.elements.dialog, !resizable.get('modal') && !resizable.get('pinned'));
                }
            }
        }

        /**
         * Triggers the end of a resize event,  attached to document.body mouseup event.
         * Removes no-selection class from document.body, allowing selection.
         *
         * @return {undefined}
         */
        function endResize() {
            if (resizable) {
                var instance = resizable;
                resizable = null;
                removeClass(document.body, classes.noSelection);
                removeClass(instance.elements.dialog, classes.capture);
                cancelClick = true;
                // allow custom `onresized` method
                dispatchEvent('onresized', instance);
            }
        }

        /**
         * Resets any changes made by resizing the element to its original state.
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function resetResize(instance) {
            resizable = null;
            var element = instance.elements.dialog;
            if (element.style.maxWidth === 'none') {
                //clear inline styles.
                element.style.maxWidth = element.style.minWidth = element.style.width = element.style.height = element.style.minHeight = element.style.left = '';
                //reset variables.
                startingLeft = Number.Nan;
                startingWidth = minWidth = handleOffset = 0;
            }
        }


        /**
         * Updates the dialog move behavior.
         *
         * @param {Object} instance The dilog instance.
         * @param {Boolean} on True to add the behavior, removes it otherwise.
         *
         * @return {undefined}
         */
        function updateResizable(instance) {
            if (instance.get('resizable')) {
                // add class
                addClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    bindResizableEvents(instance);
                }
            } else {
                //reset
                resetResize(instance);
                // remove class
                removeClass(instance.elements.root, classes.resizable);
                if (instance.isOpen()) {
                    unbindResizableEvents(instance);
                }
            }
        }

        /**
         * Reset move/resize on window resize.
         *
         * @param {Event} event	window resize event object.
         *
         * @return {undefined}
         */
        function windowResize(/*event*/) {
            for (var x = 0; x < openDialogs.length; x += 1) {
                var instance = openDialogs[x];
                if (instance.get('autoReset')) {
                    resetMove(instance);
                    resetResize(instance);
                }
            }
        }
        /**
         * Bind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindEvents(instance) {
            // if first dialog, hook global handlers
            if (openDialogs.length === 1) {
                //global
                on(window, 'resize', windowResize);
                on(document.body, 'keyup', keyupHandler);
                on(document.body, 'keydown', keydownHandler);
                on(document.body, 'focus', onReset);

                //move
                on(document.documentElement, 'mousemove', move);
                on(document.documentElement, 'touchmove', move);
                on(document.documentElement, 'mouseup', endMove);
                on(document.documentElement, 'touchend', endMove);
                //resize
                on(document.documentElement, 'mousemove', resize);
                on(document.documentElement, 'touchmove', resize);
                on(document.documentElement, 'mouseup', endResize);
                on(document.documentElement, 'touchend', endResize);
            }

            // common events
            on(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            on(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            on(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
            on(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

            //prevent handling key up when dialog is being opened by a key stroke.
            cancelKeyup = true;
            // hook in transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionInHandler);

            // modelss only events
            if (!instance.get('modal')) {
                bindModelessEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                bindResizableEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                bindMovableEvents(instance);
            }
        }

        /**
         * Unbind dialogs events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindEvents(instance) {
            // if last dialog, remove global handlers
            if (openDialogs.length === 1) {
                //global
                off(window, 'resize', windowResize);
                off(document.body, 'keyup', keyupHandler);
                off(document.body, 'keydown', keydownHandler);
                off(document.body, 'focus', onReset);
                //move
                off(document.documentElement, 'mousemove', move);
                off(document.documentElement, 'mouseup', endMove);
                //resize
                off(document.documentElement, 'mousemove', resize);
                off(document.documentElement, 'mouseup', endResize);
            }

            // common events
            off(instance.elements.commands.container, 'click', instance.__internal.commandsClickHandler);
            off(instance.elements.footer, 'click', instance.__internal.buttonsClickHandler);
            off(instance.elements.reset[0], 'focus', instance.__internal.resetHandler);
            off(instance.elements.reset[1], 'focus', instance.__internal.resetHandler);

            // hook out transition handler
            on(instance.elements.dialog, transition.type, instance.__internal.transitionOutHandler);

            // modelss only events
            if (!instance.get('modal')) {
                unbindModelessEvents(instance);
            }

            // movable
            if (instance.get('movable')) {
                unbindMovableEvents(instance);
            }

            // resizable
            if (instance.get('resizable')) {
                unbindResizableEvents(instance);
            }

        }

        /**
         * Bind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindModelessEvents(instance) {
            on(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }

        /**
         * Unbind modeless specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindModelessEvents(instance) {
            off(instance.elements.dialog, 'focus', instance.__internal.bringToFrontHandler, true);
        }



        /**
         * Bind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindMovableEvents(instance) {
            on(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            on(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
        }

        /**
         * Unbind movable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindMovableEvents(instance) {
            off(instance.elements.header, 'mousedown', instance.__internal.beginMoveHandler);
            off(instance.elements.header, 'touchstart', instance.__internal.beginMoveHandler);
        }



        /**
         * Bind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindResizableEvents(instance) {
            on(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            on(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
        }

        /**
         * Unbind resizable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindResizableEvents(instance) {
            off(instance.elements.resizeHandle, 'mousedown', instance.__internal.beginResizeHandler);
            off(instance.elements.resizeHandle, 'touchstart', instance.__internal.beginResizeHandler);
        }

        /**
         * Bind closable events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function bindClosableEvents(instance) {
            on(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }

        /**
         * Unbind closable specific events
         *
         * @param {Object} instance The dilog instance.
         *
         * @return {undefined}
         */
        function unbindClosableEvents(instance) {
            off(instance.elements.modal, 'click', instance.__internal.modalClickHandler);
        }
        // dialog API
        return {
            __init:initialize,
            /**
             * Check if dialog is currently open
             *
             * @return {Boolean}
             */
            isOpen: function () {
                return this.__internal.isOpen;
            },
            isModal: function (){
                return this.elements.root.className.indexOf(classes.modeless) < 0;
            },
            isMaximized:function(){
                return this.elements.root.className.indexOf(classes.maximized) > -1;
            },
            isPinned:function(){
                return this.elements.root.className.indexOf(classes.unpinned) < 0;
            },
            maximize:function(){
                if(!this.isMaximized()){
                    maximize(this);
                }
                return this;
            },
            restore:function(){
                if(this.isMaximized()){
                    restore(this);
                }
                return this;
            },
            pin:function(){
                if(!this.isPinned()){
                    pin(this);
                }
                return this;
            },
            unpin:function(){
                if(this.isPinned()){
                    unpin(this);
                }
                return this;
            },
            bringToFront:function(){
                bringToFront(null, this);
                return this;
            },
            /**
             * Move the dialog to a specific x/y coordinates
             *
             * @param {Number} x    The new dialog x coordinate in pixels.
             * @param {Number} y    The new dialog y coordinate in pixels.
             *
             * @return {Object} The dialog instance.
             */
            moveTo:function(x,y){
                if(!isNaN(x) && !isNaN(y)){
                    // allow custom `onmove` method
                    dispatchEvent('onmove', this);
                    
                    var element = this.elements.dialog,
                        current = element,
                        offsetLeft = 0,
                        offsetTop = 0;
                    
                    //subtract existing left,top
                    if (element.style.left) {
                        offsetLeft -= parseInt(element.style.left, 10);
                    }
                    if (element.style.top) {
                        offsetTop -= parseInt(element.style.top, 10);
                    }
                    //calc offset
                    do {
                        offsetLeft += current.offsetLeft;
                        offsetTop += current.offsetTop;
                    } while (current = current.offsetParent);

                    //calc left, top
                    var left = (x - offsetLeft);
                    var top  = (y - offsetTop);

                    //// rtl handling
                    if (isRightToLeft()) {
                        left *= -1;
                    }

                    element.style.left = left + 'px';
                    element.style.top = top + 'px';
                    
                    // allow custom `onmoved` method
                    dispatchEvent('onmoved', this);
                }
                return this;
            },
            /**
             * Resize the dialog to a specific width/height (the dialog must be 'resizable').
             * The dialog can be resized to:
             *  A minimum width equal to the initial display width
             *  A minimum height equal to the sum of header/footer heights.
             *
             *
             * @param {Number or String} width    The new dialog width in pixels or in percent.
             * @param {Number or String} height   The new dialog height in pixels or in percent.
             *
             * @return {Object} The dialog instance.
             */
            resizeTo:function(width,height){
                var w = parseFloat(width),
                    h = parseFloat(height),
                    regex = /(\d*\.\d+|\d+)%/
                ;

                if(!isNaN(w) && !isNaN(h) && this.get('resizable') === true){
                    
                    // allow custom `onresize` method
                    dispatchEvent('onresize', this);
                    
                    if(('' + width).match(regex)){
                        w = w / 100 * document.documentElement.clientWidth ;
                    }

                    if(('' + height).match(regex)){
                        h = h / 100 * document.documentElement.clientHeight;
                    }

                    var element = this.elements.dialog;
                    if (element.style.maxWidth !== 'none') {
                        element.style.minWidth = (minWidth = element.offsetWidth) + 'px';
                    }
                    element.style.maxWidth = 'none';
                    element.style.minHeight = this.elements.header.offsetHeight + this.elements.footer.offsetHeight + 'px';
                    element.style.width = w + 'px';
                    element.style.height = h + 'px';
                    
                    // allow custom `onresized` method
                    dispatchEvent('onresized', this);
                }
                return this;
            },
            /**
             * Gets or Sets dialog settings/options 
             *
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Object} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting : function (key, value) {
                var self = this;
                var result = update(this, this.__internal.options, function(k,o,n){ optionUpdated(self,k,o,n); }, key, value);
                if(result.op === 'get'){
                    if(result.found){
                        return result.value;
                    }else if(typeof this.settings !== 'undefined'){
                        return update(this, this.settings, this.settingUpdated || function(){}, key, value).value;
                    }else{
                        return undefined;
                    }
                }else if(result.op === 'set'){
                    if(result.items.length > 0){
                        var callback = this.settingUpdated || function(){};
                        for(var x=0;x<result.items.length;x+=1){
                            var item = result.items[x];
                            if(!item.found && typeof this.settings !== 'undefined'){
                                update(this, this.settings, callback, item.key, item.value);
                            }
                        }
                    }
                    return this;
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set:function(key, value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get:function(key){
                return this.setting(key);
            },
            /**
            * Sets dialog header
            * @content {string or element}
            *
            * @return {undefined}
            */
            setHeader:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.header);
                    this.elements.header.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.header.firstChild !== content){
                    clearContents(this.elements.header);
                    this.elements.header.appendChild(content);
                }
                return this;
            },
            /**
            * Sets dialog contents
            * @content {string or element}
            *
            * @return {undefined}
            */
            setContent:function(content){
                if(typeof content === 'string'){
                    clearContents(this.elements.content);
                    this.elements.content.innerHTML = content;
                }else if (content instanceof window.HTMLElement && this.elements.content.firstChild !== content){
                    clearContents(this.elements.content);
                    this.elements.content.appendChild(content);
                }
                return this;
            },
            /**
             * Show the dialog as modal
             *
             * @return {Object} the dialog instance.
             */
            showModal: function(className){
                return this.show(true, className);
            },
            /**
             * Show the dialog
             *
             * @return {Object} the dialog instance.
             */
            show: function (modal, className) {
                
                // ensure initialization
                initialize(this);

                if ( !this.__internal.isOpen ) {

                    // add to open dialogs
                    this.__internal.isOpen = true;
                    openDialogs.push(this);

                    // save last focused element
                    if(alertify.defaults.maintainFocus){
                        this.__internal.activeElement = document.activeElement;
                    }

                    //allow custom dom manipulation updates before showing the dialog.
                    if(typeof this.prepare === 'function'){
                        this.prepare();
                    }

                    bindEvents(this);

                    if(modal !== undefined){
                        this.set('modal', modal);
                    }

                    //save scroll to prevent document jump
                    saveScrollPosition();

                    ensureNoOverflow();

                    // allow custom dialog class on show
                    if(typeof className === 'string' && className !== ''){
                        this.__internal.className = className;
                        addClass(this.elements.root, className);
                    }

                    // maximize if start maximized
                    if ( this.get('startMaximized')) {
                        this.maximize();
                    }else if(this.isMaximized()){
                        restore(this);
                    }

                    updateAbsPositionFix(this);

                    removeClass(this.elements.root, classes.animationOut);
                    addClass(this.elements.root, classes.animationIn);

                    // set 1s fallback in case transition event doesn't fire
                    clearTimeout( this.__internal.timerIn);
                    this.__internal.timerIn = setTimeout( this.__internal.transitionInHandler, transition.supported ? 1000 : 100 );

                    if(isSafari){
                        // force desktop safari reflow
                        var root = this.elements.root;
                        root.style.display  = 'none';
                        setTimeout(function(){root.style.display  = 'block';}, 0);
                    }

                    //reflow
                    reflow = this.elements.root.offsetWidth;
                  
                    // show dialog
                    removeClass(this.elements.root, classes.hidden);

                    // internal on show event
                    if(typeof this.hooks.onshow === 'function'){
                        this.hooks.onshow.call(this);
                    }

                    // allow custom `onshow` method
                    dispatchEvent('onshow', this);

                }else{
                    // reset move updates
                    resetMove(this);
                    // reset resize updates
                    resetResize(this);
                    // shake the dialog to indicate its already open
                    addClass(this.elements.dialog, classes.shake);
                    var self = this;
                    setTimeout(function(){
                        removeClass(self.elements.dialog, classes.shake);
                    },200);
                }
                return this;
            },
            /**
             * Close the dialog
             *
             * @return {Object} The dialog instance
             */
            close: function () {
                if (this.__internal.isOpen ) {
                    // custom `onclosing` event
                    if(dispatchEvent('onclosing', this) !== false){

                        unbindEvents(this);

                        removeClass(this.elements.root, classes.animationIn);
                        addClass(this.elements.root, classes.animationOut);

                        // set 1s fallback in case transition event doesn't fire
                        clearTimeout( this.__internal.timerOut );
                        this.__internal.timerOut = setTimeout( this.__internal.transitionOutHandler, transition.supported ? 1000 : 100 );
                        // hide dialog
                        addClass(this.elements.root, classes.hidden);
                        //reflow
                        reflow = this.elements.modal.offsetWidth;

                        // remove custom dialog class on hide
                        if (typeof this.__internal.className !== 'undefined' && this.__internal.className !== '') {
                            removeClass(this.elements.root, this.__internal.className);
                        }

                        // internal on close event
                        if(typeof this.hooks.onclose === 'function'){
                            this.hooks.onclose.call(this);
                        }

                        // allow custom `onclose` method
                        dispatchEvent('onclose', this);

                        //remove from open dialogs
                        openDialogs.splice(openDialogs.indexOf(this),1);
                        this.__internal.isOpen = false;

                        ensureNoOverflow();
                    }

                }
                return this;
            },
            /**
             * Close all open dialogs except this.
             *
             * @return {undefined}
             */
            closeOthers:function(){
                alertify.closeAll(this);
                return this;
            },
            /**
             * Destroys this dialog instance
             *
             * @return {undefined}
             */
            destroy:function(){
                if (this.__internal.isOpen ) {
                    //mark dialog for destruction, this will be called on tranistionOut event.
                    this.__internal.destroy = function(){
                        destruct(this, initialize);
                    };
                    //close the dialog to unbind all events.
                    this.close();
                }else{
                    destruct(this, initialize);
                }
                return this;
            },
        };
	} () );
    var notifier = (function () {
        var reflow,
            element,
            openInstances = [],
            classes = {
                base: 'alertify-notifier',
                message: 'ajs-message',
                top: 'ajs-top',
                right: 'ajs-right',
                bottom: 'ajs-bottom',
                left: 'ajs-left',
                center: 'ajs-center',
                visible: 'ajs-visible',
                hidden: 'ajs-hidden',
                close: 'ajs-close'
            };
        /**
         * Helper: initializes the notifier instance
         *
         */
        function initialize(instance) {

            if (!instance.__internal) {
                instance.__internal = {
                    position: alertify.defaults.notifier.position,
                    delay: alertify.defaults.notifier.delay,
                };

                element = document.createElement('DIV');

                updatePosition(instance);
            }

            //add to DOM tree.
            if (element.parentNode !== document.body) {
                document.body.appendChild(element);
            }
        }

        function pushInstance(instance) {
            instance.__internal.pushed = true;
            openInstances.push(instance);
        }
        function popInstance(instance) {
            openInstances.splice(openInstances.indexOf(instance), 1);
            instance.__internal.pushed = false;
        }
        /**
         * Helper: update the notifier instance position
         *
         */
        function updatePosition(instance) {
            element.className = classes.base;
            switch (instance.__internal.position) {
            case 'top-right':
                addClass(element, classes.top + ' ' + classes.right);
                break;
            case 'top-left':
                addClass(element, classes.top + ' ' + classes.left);
                break;
            case 'top-center':
                addClass(element, classes.top + ' ' + classes.center);
                break;
            case 'bottom-left':
                addClass(element, classes.bottom + ' ' + classes.left);
                break;
            case 'bottom-center':
                addClass(element, classes.bottom + ' ' + classes.center);
                break;

            default:
            case 'bottom-right':
                addClass(element, classes.bottom + ' ' + classes.right);
                break;
            }
        }

        /**
        * creates a new notification message
        *
        * @param  {DOMElement} message	The notifier message element
        * @param  {Number} wait   Time (in ms) to wait before the message is dismissed, a value of 0 means keep open till clicked.
        * @param  {Function} callback A callback function to be invoked when the message is dismissed.
        *
        * @return {undefined}
        */
        function create(div, callback) {

            function clickDelegate(event, instance) {
                if(!instance.__internal.closeButton || event.target.getAttribute('data-close') === 'true'){
                    instance.dismiss(true);
                }
            }

            function transitionDone(event, instance) {
                // unbind event
                off(instance.element, transition.type, transitionDone);
                // remove the message
                element.removeChild(instance.element);
            }

            function initialize(instance) {
                if (!instance.__internal) {
                    instance.__internal = {
                        pushed: false,
                        delay : undefined,
                        timer: undefined,
                        clickHandler: undefined,
                        transitionEndHandler: undefined,
                        transitionTimeout: undefined
                    };
                    instance.__internal.clickHandler = delegate(instance, clickDelegate);
                    instance.__internal.transitionEndHandler = delegate(instance, transitionDone);
                }
                return instance;
            }
            function clearTimers(instance) {
                clearTimeout(instance.__internal.timer);
                clearTimeout(instance.__internal.transitionTimeout);
            }
            return initialize({
                /* notification DOM element*/
                element: div,
                /*
                 * Pushes a notification message
                 * @param {string or DOMElement} content The notification message content
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 *
                 */
                push: function (_content, _wait) {
                    if (!this.__internal.pushed) {

                        pushInstance(this);
                        clearTimers(this);

                        var content, wait;
                        switch (arguments.length) {
                        case 0:
                            wait = this.__internal.delay;
                            break;
                        case 1:
                            if (typeof (_content) === 'number') {
                                wait = _content;
                            } else {
                                content = _content;
                                wait = this.__internal.delay;
                            }
                            break;
                        case 2:
                            content = _content;
                            wait = _wait;
                            break;
                        }
                        this.__internal.closeButton = alertify.defaults.notifier.closeButton;
                        // set contents
                        if (typeof content !== 'undefined') {
                            this.setContent(content);
                        }
                        // append or insert
                        if (notifier.__internal.position.indexOf('top') < 0) {
                            element.appendChild(this.element);
                        } else {
                            element.insertBefore(this.element, element.firstChild);
                        }
                        reflow = this.element.offsetWidth;
                        addClass(this.element, classes.visible);
                        // attach click event
                        on(this.element, 'click', this.__internal.clickHandler);
                        return this.delay(wait);
                    }
                    return this;
                },
                /*
                 * {Function} callback function to be invoked before dismissing the notification message.
                 * Remarks: A return value === 'false' will cancel the dismissal
                 *
                 */
                ondismiss: function () { },
                /*
                 * {Function} callback function to be invoked when the message is dismissed.
                 *
                 */
                callback: callback,
                /*
                 * Dismisses the notification message
                 * @param {Boolean} clicked A flag indicating if the dismissal was caused by a click.
                 *
                 */
                dismiss: function (clicked) {
                    if (this.__internal.pushed) {
                        clearTimers(this);
                        if (!(typeof this.ondismiss === 'function' && this.ondismiss.call(this) === false)) {
                            //detach click event
                            off(this.element, 'click', this.__internal.clickHandler);
                            // ensure element exists
                            if (typeof this.element !== 'undefined' && this.element.parentNode === element) {
                                //transition end or fallback
                                this.__internal.transitionTimeout = setTimeout(this.__internal.transitionEndHandler, transition.supported ? 1000 : 100);
                                removeClass(this.element, classes.visible);

                                // custom callback on dismiss
                                if (typeof this.callback === 'function') {
                                    this.callback.call(this, clicked);
                                }
                            }
                            popInstance(this);
                        }
                    }
                    return this;
                },
                /*
                 * Delays the notification message dismissal
                 * @param {Number} wait The time (in seconds) to wait before the message is dismissed, a value of 0 means keep open till clicked.
                 *
                 */
                delay: function (wait) {
                    clearTimers(this);
                    this.__internal.delay = typeof wait !== 'undefined' && !isNaN(+wait) ? +wait : notifier.__internal.delay;
                    if (this.__internal.delay > 0) {
                        var  self = this;
                        this.__internal.timer = setTimeout(function () { self.dismiss(); }, this.__internal.delay * 1000);
                    }
                    return this;
                },
                /*
                 * Sets the notification message contents
                 * @param {string or DOMElement} content The notification message content
                 *
                 */
                setContent: function (content) {
                    if (typeof content === 'string') {
                        clearContents(this.element);
                        this.element.innerHTML = content;
                    } else if (content instanceof window.HTMLElement && this.element.firstChild !== content) {
                        clearContents(this.element);
                        this.element.appendChild(content);
                    }
                    if(this.__internal.closeButton){
                        var close = document.createElement('span');
                        addClass(close, classes.close);
                        close.setAttribute('data-close', true);
                        this.element.appendChild(close);
                    }
                    return this;
                },
                /*
                 * Dismisses all open notifications except this.
                 *
                 */
                dismissOthers: function () {
                    notifier.dismissAll(this);
                    return this;
                }
            });
        }

        //notifier api
        return {
            /**
             * Gets or Sets notifier settings.
             *
             * @param {string} key The setting name
             * @param {Variant} value The setting value.
             *
             * @return {Object}	if the called as a setter, return the notifier instance.
             */
            setting: function (key, value) {
                //ensure init
                initialize(this);

                if (typeof value === 'undefined') {
                    //get
                    return this.__internal[key];
                } else {
                    //set
                    switch (key) {
                    case 'position':
                        this.__internal.position = value;
                        updatePosition(this);
                        break;
                    case 'delay':
                        this.__internal.delay = value;
                        break;
                    }
                }
                return this;
            },
            /**
             * [Alias] Sets dialog settings/options
             */
            set:function(key,value){
                this.setting(key,value);
                return this;
            },
            /**
             * [Alias] Gets dialog settings/options
             */
            get:function(key){
                return this.setting(key);
            },
            /**
             * Creates a new notification message
             *
             * @param {string} type The type of notification message (simply a CSS class name 'ajs-{type}' to be added).
             * @param {Function} callback  A callback function to be invoked when the message is dismissed.
             *
             * @return {undefined}
             */
            create: function (type, callback) {
                //ensure notifier init
                initialize(this);
                //create new notification message
                var div = document.createElement('div');
                div.className = classes.message + ((typeof type === 'string' && type !== '') ? ' ajs-' + type : '');
                return create(div, callback);
            },
            /**
             * Dismisses all open notifications.
             *
             * @param {Object} excpet [optional] The notification object to exclude from dismissal.
             *
             */
            dismissAll: function (except) {
                var clone = openInstances.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var  instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.dismiss();
                    }
                }
            }
        };
    })();

    /**
     * Alertify public API
     * This contains everything that is exposed through the alertify object.
     *
     * @return {Object}
     */
    function Alertify() {

        // holds a references of created dialogs
        var dialogs = {};

        /**
         * Extends a given prototype by merging properties from base into sub.
         *
         * @sub {Object} sub The prototype being overwritten.
         * @base {Object} base The prototype being written.
         *
         * @return {Object} The extended prototype.
         */
        function extend(sub, base) {
            // copy dialog pototype over definition.
            for (var prop in base) {
                if (base.hasOwnProperty(prop)) {
                    sub[prop] = base[prop];
                }
            }
            return sub;
        }


        /**
        * Helper: returns a dialog instance from saved dialogs.
        * and initializes the dialog if its not already initialized.
        *
        * @name {String} name The dialog name.
        *
        * @return {Object} The dialog instance.
        */
        function get_dialog(name) {
            var dialog = dialogs[name].dialog;
            //initialize the dialog if its not already initialized.
            if (dialog && typeof dialog.__init === 'function') {
                dialog.__init(dialog);
            }
            return dialog;
        }

        /**
         * Helper:  registers a new dialog definition.
         *
         * @name {String} name The dialog name.
         * @Factory {Function} Factory a function resposible for creating dialog prototype.
         * @transient {Boolean} transient True to create a new dialog instance each time the dialog is invoked, false otherwise.
         * @base {String} base the name of another dialog to inherit from.
         *
         * @return {Object} The dialog definition.
         */
        function register(name, Factory, transient, base) {
            var definition = {
                dialog: null,
                factory: Factory
            };

            //if this is based on an existing dialog, create a new definition
            //by applying the new protoype over the existing one.
            if (base !== undefined) {
                definition.factory = function () {
                    return extend(new dialogs[base].factory(), new Factory());
                };
            }

            if (!transient) {
                //create a new definition based on dialog
                definition.dialog = extend(new definition.factory(), dialog);
            }
            return dialogs[name] = definition;
        }

        return {
            /**
             * Alertify defaults
             * 
             * @type {Object}
             */
            defaults: defaults,
            /**
             * Dialogs factory 
             *
             * @param {string}      Dialog name.
             * @param {Function}    A Dialog factory function.
             * @param {Boolean}     Indicates whether to create a singleton or transient dialog.
             * @param {String}      The name of the base type to inherit from.
             */
            dialog: function (name, Factory, transient, base) {

                // get request, create a new instance and return it.
                if (typeof Factory !== 'function') {
                    return get_dialog(name);
                }

                if (this.hasOwnProperty(name)) {
                    throw new Error('alertify.dialog: name already exists');
                }

                // register the dialog
                var definition = register(name, Factory, transient, base);

                if (transient) {

                    // make it public
                    this[name] = function () {
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var instance = extend(new definition.factory(), dialog);
                            //ensure init
                            if (instance && typeof instance.__init === 'function') {
                                instance.__init(instance);
                            }
                            instance['main'].apply(instance, arguments);
                            return instance['show'].apply(instance);
                        }
                    };
                } else {
                    // make it public
                    this[name] = function () {
                        //ensure init
                        if (definition.dialog && typeof definition.dialog.__init === 'function') {
                            definition.dialog.__init(definition.dialog);
                        }
                        //if passed with no params, consider it a get request
                        if (arguments.length === 0) {
                            return definition.dialog;
                        } else {
                            var dialog = definition.dialog;
                            dialog['main'].apply(definition.dialog, arguments);
                            return dialog['show'].apply(definition.dialog);
                        }
                    };
                }
            },
            /**
             * Close all open dialogs.
             *
             * @param {Object} excpet [optional] The dialog object to exclude from closing.
             *
             * @return {undefined}
             */
            closeAll: function (except) {
                var clone = openDialogs.slice(0);
                for (var x = 0; x < clone.length; x += 1) {
                    var instance = clone[x];
                    if (except === undefined || except !== instance) {
                        instance.close();
                    }
                }
            },
            /**
             * Gets or Sets dialog settings/options. if the dialog is transient, this call does nothing.
             *
             * @param {string} name The dialog name.
             * @param {String|Object} key A string specifying a propery name or a collection of key/value pairs.
             * @param {Variant} value Optional, the value associated with the key (in case it was a string).
             *
             * @return {undefined}
             */
            setting: function (name, key, value) {

                if (name === 'notifier') {
                    return notifier.setting(key, value);
                }

                var dialog = get_dialog(name);
                if (dialog) {
                    return dialog.setting(key, value);
                }
            },
            /**
             * [Alias] Sets dialog settings/options 
             */
            set: function(name,key,value){
                return this.setting(name, key,value);
            },
            /**
             * [Alias] Gets dialog settings/options 
             */
            get: function(name, key){
                return this.setting(name, key);
            },
            /**
             * Creates a new notification message.
             * If a type is passed, a class name "ajs-{type}" will be added.
             * This allows for custom look and feel for various types of notifications.
             *
             * @param  {String | DOMElement}    [message=undefined]		Message text
             * @param  {String}                 [type='']				Type of log message
             * @param  {String}                 [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}               [callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            notify: function (message, type, wait, callback) {
                return notifier.create(type, callback).push(message, wait);
            },
            /**
             * Creates a new notification message.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            message: function (message, wait, callback) {
                return notifier.create(null, callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'success'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            success: function (message, wait, callback) {
                return notifier.create('success', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'error'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            error: function (message, wait, callback) {
                return notifier.create('error', callback).push(message, wait);
            },
            /**
             * Creates a new notification message of type 'warning'.
             *
             * @param  {String}		[message=undefined]		Message text
             * @param  {String}     [wait='']				Time (in seconds) to wait before auto-close
             * @param  {Function}	[callback=undefined]	A callback function to be invoked when the log is closed.
             *
             * @return {Object} Notification object.
             */
            warning: function (message, wait, callback) {
                return notifier.create('warning', callback).push(message, wait);
            },
            /**
             * Dismisses all open notifications
             *
             * @return {undefined}
             */
            dismissAll: function () {
                notifier.dismissAll();
            }
        };
    }
    var alertify = new Alertify();

    /**
    * Alert dialog definition
    *
    * invoked by:
    *	alertify.alert(message);
    *	alertify.alert(title, message);
    *	alertify.alert(message, onok);
    *	alertify.alert(title, message, onok);
     */
    alertify.dialog('alert', function () {
        return {
            main: function (_title, _message, _onok) {
                var title, message, onok;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    if (typeof _message === 'function') {
                        message = _title;
                        onok = _message;
                    } else {
                        title = _title;
                        message = _message;
                    }
                    break;
                case 3:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.ok,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                // nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: undefined,
                onok: undefined,
                label: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'label':
                    if (this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue;
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                if (typeof this.get('onok') === 'function') {
                    var returnValue = this.get('onok').call(this, closeEvent);
                    if (typeof returnValue !== 'undefined') {
                        closeEvent.cancel = !returnValue;
                    }
                }
            }
        };
    });
    /**
     * Confirm dialog object
     *
     *	alertify.confirm(message);
     *	alertify.confirm(message, onok);
     *	alertify.confirm(message, onok, oncancel);
     *	alertify.confirm(title, message, onok, oncancel);
     */
    alertify.dialog('confirm', function () {

        var autoConfirm = {
            timer: null,
            index: null,
            text: null,
            duration: null,
            task: function (event, self) {
                if (self.isOpen()) {
                    self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text + ' (&#8207;' + autoConfirm.duration + '&#8207;) ';
                    autoConfirm.duration -= 1;
                    if (autoConfirm.duration === -1) {
                        clearAutoConfirm(self);
                        var button = self.__internal.buttons[autoConfirm.index];
                        var closeEvent = createCloseEvent(autoConfirm.index, button);

                        if (typeof self.callback === 'function') {
                            self.callback.apply(self, [closeEvent]);
                        }
                        //close the dialog.
                        if (closeEvent.close !== false) {
                            self.close();
                        }
                    }
                } else {
                    clearAutoConfirm(self);
                }
            }
        };

        function clearAutoConfirm(self) {
            if (autoConfirm.timer !== null) {
                clearInterval(autoConfirm.timer);
                autoConfirm.timer = null;
                self.__internal.buttons[autoConfirm.index].element.innerHTML = autoConfirm.text;
            }
        }

        function startAutoConfirm(self, index, duration) {
            clearAutoConfirm(self);
            autoConfirm.duration = duration;
            autoConfirm.index = index;
            autoConfirm.text = self.__internal.buttons[index].element.innerHTML;
            autoConfirm.timer = setInterval(delegate(self, autoConfirm.task), 1000);
            autoConfirm.task(null, self);
        }


        return {
            main: function (_title, _message, _onok, _oncancel) {
                var title, message, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    onok = _message;
                    break;
                case 3:
                    message = _title;
                    onok = _message;
                    oncancel = _onok;
                    break;
                case 4:
                    title = _title;
                    message = _message;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: 0,
                        select: false
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                //nothing
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                this.setContent(message);
            },
            settings: {
                message: null,
                labels: null,
                onok: null,
                oncancel: null,
                defaultFocus: null,
                reverseButtons: null,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'labels':
                    if ('ok' in newValue && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].text = newValue.ok;
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if ('cancel' in newValue && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].text = newValue.cancel;
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                case 'defaultFocus':
                    this.__internal.focus.element = newValue === 'ok' ? 0 : 1;
                    break;
                }
            },
            callback: function (closeEvent) {
                clearAutoConfirm(this);
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                }
            },
            autoOk: function (duration) {
                startAutoConfirm(this, 0, duration);
                return this;
            },
            autoCancel: function (duration) {
                startAutoConfirm(this, 1, duration);
                return this;
            }
        };
    });
    /**
     * Prompt dialog object
     *
     * invoked by:
     *	alertify.prompt(message);
     *	alertify.prompt(message, value);
     *	alertify.prompt(message, value, onok);
     *	alertify.prompt(message, value, onok, oncancel);
     *	alertify.prompt(title, message, value, onok, oncancel);
     */
    alertify.dialog('prompt', function () {
        var input = document.createElement('INPUT');
        var p = document.createElement('P');
        return {
            main: function (_title, _message, _value, _onok, _oncancel) {
                var title, message, value, onok, oncancel;
                switch (arguments.length) {
                case 1:
                    message = _title;
                    break;
                case 2:
                    message = _title;
                    value = _message;
                    break;
                case 3:
                    message = _title;
                    value = _message;
                    onok = _value;
                    break;
                case 4:
                    message = _title;
                    value = _message;
                    onok = _value;
                    oncancel = _onok;
                    break;
                case 5:
                    title = _title;
                    message = _message;
                    value = _value;
                    onok = _onok;
                    oncancel = _oncancel;
                    break;
                }
                this.set('title', title);
                this.set('message', message);
                this.set('value', value);
                this.set('onok', onok);
                this.set('oncancel', oncancel);
                return this;
            },
            setup: function () {
                return {
                    buttons: [
                        {
                            text: alertify.defaults.glossary.ok,
                            key: keys.ENTER,
                            className: alertify.defaults.theme.ok,
                        },
                        {
                            text: alertify.defaults.glossary.cancel,
                            key: keys.ESC,
                            invokeOnClose: true,
                            className: alertify.defaults.theme.cancel,
                        }
                    ],
                    focus: {
                        element: input,
                        select: true
                    },
                    options: {
                        maximizable: false,
                        resizable: false
                    }
                };
            },
            build: function () {
                input.className = alertify.defaults.theme.input;
                input.setAttribute('type', 'text');
                input.value = this.get('value');
                this.elements.content.appendChild(p);
                this.elements.content.appendChild(input);
            },
            prepare: function () {
                //nothing
            },
            setMessage: function (message) {
                if (typeof message === 'string') {
                    clearContents(p);
                    p.innerHTML = message;
                } else if (message instanceof window.HTMLElement && p.firstChild !== message) {
                    clearContents(p);
                    p.appendChild(message);
                }
            },
            settings: {
                message: undefined,
                labels: undefined,
                onok: undefined,
                oncancel: undefined,
                value: '',
                type:'text',
                reverseButtons: undefined,
            },
            settingUpdated: function (key, oldValue, newValue) {
                switch (key) {
                case 'message':
                    this.setMessage(newValue);
                    break;
                case 'value':
                    input.value = newValue;
                    break;
                case 'type':
                    switch (newValue) {
                    case 'text':
                    case 'color':
                    case 'date':
                    case 'datetime-local':
                    case 'email':
                    case 'month':
                    case 'number':
                    case 'password':
                    case 'search':
                    case 'tel':
                    case 'time':
                    case 'week':
                        input.type = newValue;
                        break;
                    default:
                        input.type = 'text';
                        break;
                    }
                    break;
                case 'labels':
                    if (newValue.ok && this.__internal.buttons[0].element) {
                        this.__internal.buttons[0].element.innerHTML = newValue.ok;
                    }
                    if (newValue.cancel && this.__internal.buttons[1].element) {
                        this.__internal.buttons[1].element.innerHTML = newValue.cancel;
                    }
                    break;
                case 'reverseButtons':
                    if (newValue === true) {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element);
                    } else {
                        this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);
                    }
                    break;
                }
            },
            callback: function (closeEvent) {
                var returnValue;
                switch (closeEvent.index) {
                case 0:
                    this.settings.value = input.value;
                    if (typeof this.get('onok') === 'function') {
                        returnValue = this.get('onok').call(this, closeEvent, this.settings.value);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    break;
                case 1:
                    if (typeof this.get('oncancel') === 'function') {
                        returnValue = this.get('oncancel').call(this, closeEvent);
                        if (typeof returnValue !== 'undefined') {
                            closeEvent.cancel = !returnValue;
                        }
                    }
                    if(!closeEvent.cancel){
                        input.value = this.settings.value;
                    }
                    break;
                }
            }
        };
    });

    // CommonJS
    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = alertify;
    // AMD
    } else if ( true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return alertify;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    // window
    } else if ( !window.alertify ) {
        window.alertify = alertify;
    }

} ( typeof window !== 'undefined' ? window : this ) );


/***/ }),
/* 8 */
/***/ (function(module, exports) {

﻿/**
 * Ion.Sound
 * version 3.0.7 Build 89
 * © Denis Ineshin, 2016
 *
 * Project page:    http://ionden.com/a/plugins/ion.sound/en.html
 * GitHub page:     https://github.com/IonDen/ion.sound
 *
 * Released under MIT licence:
 * http://ionden.com/a/plugins/licence-en.html
 */

;(function (window, navigator, $, undefined) {
    "use strict";

    window.ion = window.ion || {};

    if (ion.sound) {
        return;
    }

    var warn = function (text) {
        if (!text) text = "undefined";

        if (window.console) {
            if (console.warn && typeof console.warn === "function") {
                console.warn(text);
            } else if (console.log && typeof console.log === "function") {
                console.log(text);
            }

            var d = $ && $("#debug");
            if (d && d.length) {
                var a = d.html();
                d.html(a + text + '<br/>');
            }
        }
    };

    var extend = function (parent, child) {
        var prop;
        child = child || {};

        for (prop in parent) {
            if (parent.hasOwnProperty(prop)) {
                child[prop] = parent[prop];
            }
        }

        return child;
    };



    /**
     * DISABLE for unsupported browsers
     */

    if (typeof Audio !== "function" && typeof Audio !== "object") {
        var func = function () {
            warn("HTML5 Audio is not supported in this browser");
        };
        ion.sound = func;
        ion.sound.play = func;
        ion.sound.stop = func;
        ion.sound.pause = func;
        ion.sound.preload = func;
        ion.sound.destroy = func;
        func();
        return;
    }



    /**
     * CORE
     * - creating sounds collection
     * - public methods
     */

    var is_iOS = /iPad|iPhone|iPod/.test(navigator.appVersion),
        sounds_num = 0,
        settings = {},
        sounds = {},
        i;



    if (!settings.supported && is_iOS) {
        settings.supported = ["mp3", "mp4", "aac"];
    } else if (!settings.supported) {
        settings.supported = ["mp3", "ogg", "mp4", "aac", "wav"];
    }

    var createSound = function (obj) {
        var name = obj.alias || obj.name;

        if (!sounds[name]) {
            sounds[name] = new Sound(obj);
            sounds[name].init();
        }
    };

    ion.sound = function (options) {
        extend(options, settings);

        settings.path = settings.path || "";
        settings.volume = settings.volume || 1;
        settings.preload = settings.preload || false;
        settings.multiplay = settings.multiplay || false;
        settings.loop = settings.loop || false;
        settings.sprite = settings.sprite || null;
        settings.scope = settings.scope || null;
        settings.ready_callback = settings.ready_callback || null;
        settings.ended_callback = settings.ended_callback || null;

        sounds_num = settings.sounds.length;

        if (!sounds_num) {
            warn("No sound-files provided!");
            return;
        }

        for (i = 0; i < sounds_num; i++) {
            createSound(settings.sounds[i]);
        }
    };

    ion.sound.VERSION = "3.0.7";

    ion.sound._method = function (method, name, options) {
        if (name) {
            sounds[name] && sounds[name][method](options);
        } else {
            for (i in sounds) {
                if (!sounds.hasOwnProperty(i) || !sounds[i]) {
                    continue;
                }

                sounds[i][method](options);
            }
        }
    };

    ion.sound.preload = function (name, options) {
        options = options || {};
        extend({preload: true}, options);

        ion.sound._method("init", name, options);
    };

    ion.sound.destroy = function (name) {
        ion.sound._method("destroy", name);

        if (name) {
            sounds[name] = null;
        } else {
            for (i in sounds) {
                if (!sounds.hasOwnProperty(i)) {
                    continue;
                }
                if (sounds[i]) {
                    sounds[i] = null;
                }
            }
        }
    };

    ion.sound.play = function (name, options) {
        ion.sound._method("play", name, options);
    };

    ion.sound.stop = function (name, options) {
        ion.sound._method("stop", name, options);
    };

    ion.sound.pause = function (name, options) {
        ion.sound._method("pause", name, options);
    };

    ion.sound.volume = function (name, options) {
        ion.sound._method("volume", name, options);
    };

    if ($) {
        $.ionSound = ion.sound;
    }



    /**
     * Web Audio API core
     * - for most advanced browsers
     */

    var AudioContext = window.AudioContext || window.webkitAudioContext,
        audio;

    if (AudioContext) {
        audio = new AudioContext();
    }


    var Sound = function (options) {
        this.options = extend(settings);
        delete this.options.sounds;
        extend(options, this.options);

        this.request = null;
        this.streams = {};
        this.result = {};
        this.ext = 0;
        this.url = "";

        this.loaded = false;
        this.decoded = false;
        this.no_file = false;
        this.autoplay = false;
    };

    Sound.prototype = {
        init: function (options) {
            if (options) {
                extend(options, this.options);
            }

            if (this.options.preload) {
                this.load();
            }
        },

        destroy: function () {
            var stream;

            for (i in this.streams) {
                stream = this.streams[i];

                if (stream) {
                    stream.destroy();
                    stream = null;
                }
            }
            this.streams = {};
            this.result = null;
            this.options.buffer = null;
            this.options = null;

            if (this.request) {
                this.request.removeEventListener("load", this.ready.bind(this), false);
                this.request.removeEventListener("error", this.error.bind(this), false);
                this.request.abort();
                this.request = null;
            }
        },

        createUrl: function () {
            var no_cache = new Date().valueOf();
            this.url = this.options.path + encodeURIComponent(this.options.name) + "." + this.options.supported[this.ext] + "?" + no_cache;
        },

        load: function () {
            if (this.no_file) {
                warn("No sources for \"" + this.options.name + "\" sound :(");
                return;
            }

            if (this.request) {
                return;
            }

            this.createUrl();

            this.request = new XMLHttpRequest();
            this.request.open("GET", this.url, true);
            this.request.responseType = "arraybuffer";
            this.request.addEventListener("load", this.ready.bind(this), false);
            this.request.addEventListener("error", this.error.bind(this), false);

            this.request.send();
        },

        reload: function () {
            this.ext++;

            if (this.options.supported[this.ext]) {
                this.load();
            } else {
                this.no_file = true;
                warn("No sources for \"" + this.options.name + "\" sound :(");
            }
        },

        ready: function (data) {
            this.result = data.target;

            if (this.result.readyState !== 4) {
                this.reload();
                return;
            }

            if (this.result.status !== 200 && this.result.status !== 0) {
                warn(this.url + " was not found on server!");
                this.reload();
                return;
            }

            this.request.removeEventListener("load", this.ready.bind(this), false);
            this.request.removeEventListener("error", this.error.bind(this), false);
            this.request = null;
            this.loaded = true;
            //warn("Loaded: " + this.options.name + "." + settings.supported[this.ext]);

            this.decode();
        },

        decode: function () {
            if (!audio) {
                return;
            }

            audio.decodeAudioData(this.result.response, this.setBuffer.bind(this), this.error.bind(this));
        },

        setBuffer: function (buffer) {
            this.options.buffer = buffer;
            this.decoded = true;
            //warn("Decoded: " + this.options.name + "." + settings.supported[this.ext]);

            var config = {
                name: this.options.name,
                alias: this.options.alias,
                ext: this.options.supported[this.ext],
                duration: this.options.buffer.duration
            };

            if (this.options.ready_callback && typeof this.options.ready_callback === "function") {
                this.options.ready_callback.call(this.options.scope, config);
            }

            if (this.options.sprite) {

                for (i in this.options.sprite) {
                    this.options.start = this.options.sprite[i][0];
                    this.options.end = this.options.sprite[i][1];
                    this.streams[i] = new Stream(this.options, i);
                }

            } else {

                this.streams[0] = new Stream(this.options);

            }

            if (this.autoplay) {
                this.autoplay = false;
                this.play();
            }
        },

        error: function () {
            this.reload();
        },

        play: function (options) {
            delete this.options.part;

            if (options) {
                extend(options, this.options);
            }

            if (!this.loaded) {
                this.autoplay = true;
                this.load();

                return;
            }

            if (this.no_file || !this.decoded) {
                return;
            }

            if (this.options.sprite) {
                if (this.options.part) {
                    this.streams[this.options.part].play(this.options);
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].play(this.options);
                    }
                }
            } else {
                this.streams[0].play(this.options);
            }
        },

        stop: function (options) {
            if (this.options.sprite) {

                if (options) {
                    this.streams[options.part].stop();
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].stop();
                    }
                }

            } else {
                this.streams[0].stop();
            }
        },

        pause: function (options) {
            if (this.options.sprite) {

                if (options) {
                    this.streams[options.part].pause();
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].pause();
                    }
                }

            } else {
                this.streams[0].pause();
            }
        },

        volume: function (options) {
            var stream;

            if (options) {
                extend(options, this.options);
            } else {
                return;
            }

            if (this.options.sprite) {
                if (this.options.part) {
                    stream = this.streams[this.options.part];
                    stream && stream.setVolume(this.options);
                } else {
                    for (i in this.options.sprite) {
                        stream = this.streams[i];
                        stream && stream.setVolume(this.options);
                    }
                }
            } else {
                stream = this.streams[0];
                stream && stream.setVolume(this.options);
            }
        }
    };



    var Stream = function (options, sprite_part) {
        this.alias = options.alias;
        this.name = options.name;
        this.sprite_part = sprite_part;

        this.buffer = options.buffer;
        this.start = options.start || 0;
        this.end = options.end || this.buffer.duration;
        this.multiplay = options.multiplay || false;
        this.volume = options.volume || 1;
        this.scope = options.scope;
        this.ended_callback = options.ended_callback;

        this.setLoop(options);

        this.source = null;
        this.gain = null;
        this.playing = false;
        this.paused = false;

        this.time_started = 0;
        this.time_ended = 0;
        this.time_played = 0;
        this.time_offset = 0;
    };

    Stream.prototype = {
        destroy: function () {
            this.stop();

            this.buffer = null;
            this.source = null;

            this.gain && this.gain.disconnect();
            this.source && this.source.disconnect();
            this.gain = null;
            this.source = null;
        },

        setLoop: function (options) {
            if (options.loop === true) {
                this.loop = 9999999;
            } else if (typeof options.loop === "number") {
                this.loop = +options.loop - 1;
            } else {
                this.loop = false;
            }
        },

        update: function (options) {
            this.setLoop(options);
            if ("volume" in options) {
                this.volume = options.volume;
            }
        },

        play: function (options) {
            if (options) {
                this.update(options);
            }

            if (!this.multiplay && this.playing) {
                return;
            }

            this.gain = audio.createGain();
            this.source = audio.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.gain);
            this.gain.connect(audio.destination);
            this.gain.gain.value = this.volume;

            this.source.onended = this.ended.bind(this);

            this._play();
        },

        _play: function () {
            var start,
                end;

            if (this.paused) {
                start = this.start + this.time_offset;
                end = this.end - this.time_offset;
            } else {
                start = this.start;
                end = this.end;
            }

            if (end <= 0) {
                this.clear();
                return;
            }

            if (typeof this.source.start === "function") {
                this.source.start(0, start, end);
            } else {
                this.source.noteOn(0, start, end);
            }

            this.playing = true;
            this.paused = false;
            this.time_started = new Date().valueOf();
        },

        stop: function () {
            if (this.playing && this.source) {
                if (typeof this.source.stop === "function") {
                    this.source.stop(0);
                } else {
                    this.source.noteOff(0);
                }
            }

            this.clear();
        },

        pause: function () {
            if (this.paused) {
                this.play();
                return;
            }

            if (!this.playing) {
                return;
            }

            this.source && this.source.stop(0);
            this.paused = true;
        },

        ended: function () {
            this.playing = false;
            this.time_ended = new Date().valueOf();
            this.time_played = (this.time_ended - this.time_started) / 1000;
            this.time_offset += this.time_played;

            if (this.time_offset >= this.end || this.end - this.time_offset < 0.015) {
                this._ended();
                this.clear();

                if (this.loop) {
                    this.loop--;
                    this.play();
                }
            }
        },

        _ended: function () {
            var config = {
                name: this.name,
                alias: this.alias,
                part: this.sprite_part,
                start: this.start,
                duration: this.end
            };

            if (this.ended_callback && typeof this.ended_callback === "function") {
                this.ended_callback.call(this.scope, config);
            }
        },

        clear: function () {
            this.time_played = 0;
            this.time_offset = 0;
            this.paused = false;
            this.playing = false;
        },

        setVolume: function (options) {
            this.volume = options.volume;

            if (this.gain) {
                this.gain.gain.value = this.volume;
            }
        }
    };

    if (audio) {
        return;
    }



    /**
     * Fallback for HTML5 audio
     * - for not so modern browsers
     */

    var checkSupport = function () {
        var sound = new Audio(),
            can_play_mp3 = sound.canPlayType('audio/mpeg'),
            can_play_ogg = sound.canPlayType('audio/ogg'),
            can_play_aac = sound.canPlayType('audio/mp4; codecs="mp4a.40.2"'),
            item, i;

        for (i = 0; i < settings.supported.length; i++) {
            item = settings.supported[i];

            if (!can_play_mp3 && item === "mp3") {
                settings.supported.splice(i, 1);
            }

            if (!can_play_ogg && item === "ogg") {
                settings.supported.splice(i, 1);
            }

            if (!can_play_aac && item === "aac") {
                settings.supported.splice(i, 1);
            }

            if (!can_play_aac && item === "mp4") {
                settings.supported.splice(i, 1);
            }
        }

        sound = null;
    };
    checkSupport();



    Sound.prototype = {
        init: function (options) {
            if (options) {
                extend(options, this.options);
            }

            this.inited = true;

            if (this.options.preload) {
                this.load();
            }
        },

        destroy: function () {
            var stream;

            for (i in this.streams) {
                stream = this.streams[i];

                if (stream) {
                    stream.destroy();
                    stream = null;
                }
            }
            this.streams = {};
            this.loaded = false;
            this.inited = false;
        },

        load: function () {
            var part;

            this.options.preload = true;
            this.options._ready = this.ready;
            this.options._scope = this;

            if (this.options.sprite) {

                for (i in this.options.sprite) {
                    part = this.options.sprite[i];

                    this.options.start = part[0];
                    this.options.end = part[1];

                    this.streams[i] = new Stream(this.options, i);
                }

            } else {

                this.streams[0] = new Stream(this.options);

            }
        },

        ready: function (duration) {
            if (this.loaded) {
                return;
            }

            this.loaded = true;

            var config = {
                name: this.options.name,
                alias: this.options.alias,
                ext: this.options.supported[this.ext],
                duration: duration
            };

            if (this.options.ready_callback && typeof this.options.ready_callback === "function") {
                this.options.ready_callback.call(this.options.scope, config);
            }

            if (this.autoplay) {
                this.autoplay = false;
                this.play();
            }
        },

        play: function (options) {
            if (!this.inited) {
                return;
            }

            delete this.options.part;

            if (options) {
                extend(options, this.options);
            }

            console.log(1);
            if (!this.loaded) {
                if (!this.options.preload) {
                    this.autoplay = true;
                    this.load();
                } else {
                    this.autoplay = true;
                }

                return;
            }

            if (this.options.sprite) {
                if (this.options.part) {
                    this.streams[this.options.part].play(this.options);
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].play(this.options);
                    }
                }
            } else {
                this.streams[0].play(this.options);
            }
        },

        stop: function (options) {
            if (!this.inited) {
                return;
            }

            if (this.options.sprite) {

                if (options) {
                    this.streams[options.part].stop();
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].stop();
                    }
                }

            } else {
                this.streams[0].stop();
            }
        },

        pause: function (options) {
            if (!this.inited) {
                return;
            }

            if (this.options.sprite) {

                if (options) {
                    this.streams[options.part].pause();
                } else {
                    for (i in this.options.sprite) {
                        this.streams[i].pause();
                    }
                }

            } else {
                this.streams[0].pause();
            }
        },

        volume: function (options) {
            var stream;

            if (options) {
                extend(options, this.options);
            } else {
                return;
            }

            if (this.options.sprite) {
                if (this.options.part) {
                    stream = this.streams[this.options.part];
                    stream && stream.setVolume(this.options);
                } else {
                    for (i in this.options.sprite) {
                        stream = this.streams[i];
                        stream && stream.setVolume(this.options);
                    }
                }
            } else {
                stream = this.streams[0];
                stream && stream.setVolume(this.options);
            }
        }
    };



    Stream = function (options, sprite_part) {
        this.name = options.name;
        this.alias = options.alias;
        this.sprite_part = sprite_part;

        this.multiplay = options.multiplay;
        this.volume = options.volume;
        this.preload = options.preload;
        this.path = settings.path;
        this.start = options.start || 0;
        this.end = options.end || 0;
        this.scope = options.scope;
        this.ended_callback = options.ended_callback;

        this._scope = options._scope;
        this._ready = options._ready;

        this.setLoop(options);

        this.sound = null;
        this.url = null;
        this.loaded = false;

        this.start_time = 0;
        this.paused_time = 0;
        this.played_time = 0;

        this.init();
    };

    Stream.prototype = {
        init: function () {
            this.sound = new Audio();
            this.sound.volume = this.volume;

            this.createUrl();

            this.sound.addEventListener("ended", this.ended.bind(this), false);
            this.sound.addEventListener("canplaythrough", this.can_play_through.bind(this), false);
            this.sound.addEventListener("timeupdate", this._update.bind(this), false);

            this.load();
        },

        destroy: function () {
            this.stop();

            this.sound.removeEventListener("ended", this.ended.bind(this), false);
            this.sound.removeEventListener("canplaythrough", this.can_play_through.bind(this), false);
            this.sound.removeEventListener("timeupdate", this._update.bind(this), false);

            this.sound = null;
            this.loaded = false;
        },

        createUrl: function () {
            var rand = new Date().valueOf();
            this.url = this.path + encodeURIComponent(this.name) + "." + settings.supported[0] + "?" + rand;
        },

        can_play_through: function () {
            if (this.preload) {
                this.ready();
            }
        },

        load: function () {
            this.sound.src = this.url;
            this.sound.preload = this.preload ? "auto" : "none";
            if (this.preload) {
                this.sound.load();
            }
        },

        setLoop: function (options) {
            if (options.loop === true) {
                this.loop = 9999999;
            } else if (typeof options.loop === "number") {
                this.loop = +options.loop - 1;
            } else {
                this.loop = false;
            }
        },

        update: function (options) {
            this.setLoop(options);

            if ("volume" in options) {
                this.volume = options.volume;
            }
        },

        ready: function () {
            if (this.loaded || !this.sound) {
                return;
            }

            this.loaded = true;
            this._ready.call(this._scope, this.sound.duration);

            if (!this.end) {
                this.end = this.sound.duration;
            }
        },

        play: function (options) {
            if (options) {
                this.update(options);
            }

            if (!this.multiplay && this.playing) {
                return;
            }

            this._play();
        },

        _play: function () {
            if (this.paused) {
                this.paused = false;
            } else {
                try {
                    this.sound.currentTime = this.start;
                } catch (e) {}
            }

            this.playing = true;
            this.start_time = new Date().valueOf();
            this.sound.volume = this.volume;
            this.sound.play();
        },

        stop: function () {
            if (!this.playing) {
                return;
            }

            this.playing = false;
            this.paused = false;
            this.sound.pause();
            this.clear();

            try {
                this.sound.currentTime = this.start;
            } catch (e) {}
        },

        pause: function () {
            if (this.paused) {
                this._play();
            } else {
                this.playing = false;
                this.paused = true;
                this.sound.pause();
                this.paused_time = new Date().valueOf();
                this.played_time += this.paused_time - this.start_time;
            }
        },

        _update: function () {
            if (!this.start_time) {
                return;
            }

            var current_time = new Date().valueOf(),
                played_time = current_time - this.start_time,
                played = (this.played_time + played_time) / 1000;

            if (played >= this.end) {
                if (this.playing) {
                    this.stop();
                    this._ended();
                }
            }
        },

        ended: function () {
            if (this.playing) {
                this.stop();
                this._ended();
            }
        },

        _ended: function () {
            this.playing = false;

            var config = {
                name: this.name,
                alias: this.alias,
                part: this.sprite_part,
                start: this.start,
                duration: this.end
            };

            if (this.ended_callback && typeof this.ended_callback === "function") {
                this.ended_callback.call(this.scope, config);
            }

            if (this.loop) {
                setTimeout(this.looper.bind(this), 15);
            }
        },

        looper: function () {
            this.loop--;
            this.play();
        },

        clear: function () {
            this.start_time = 0;
            this.played_time = 0;
            this.paused_time = 0;
        },

        setVolume: function (options) {
            this.volume = options.volume;

            if (this.sound) {
                this.sound.volume = this.volume;
            }
        }
    };

} (window, navigator, window.jQuery || window.$));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var Ractive = __webpack_require__(0);
var component = module;

console.log('root.html');

  component.exports = {
    onrender: function () {
      var self = this;
      //window.scanhistorykv = {}; 

      //var sifarnik = {};
      //var scanhistory = [];      

      this.observe('scancode', function(n,o,k,i){
          setTimeout(function(){ self.set('scancode',null); }, 1);        
          if (!n) return;
          scancodeBtn(n);
      })

      var sc = document.getElementById('scancode');
        if (sc)
        sc.addEventListener("click", function(e){
          e.preventDefault();
          //sc.blur();
          //setTimeout(function(){sc.focus()} ,2000)
          //console.log('click')
          return false;
        });

      this.on('save2disk', function(){
  //        var blob = new Blob([scanhistoryfromserver], {type: "text/plain;charset=cp1252"});
          var cards = self.get('cards');
          var cardKeys = Object.keys(cards);
          for(var i=0; i<cardKeys.length; i++){
              var o = cards[ cardKeys[i] ];
              var out = o.txt.join('\r\n');
              var title = o.title;
              var blob = new Blob([out], {type: "text/plain;"}); //TODO: nije vise string
              FileSaver.saveAs(blob, title || 'sken.txt' );        
          }
      })

      this.on('clearscan', function(){
          socket.emit('clearscan');
          self.set('scanhistoryfromserver', []);       
          self.set('scanhistoryarr', []);      
          scanhistorykv = {}; 
      })

      this.on('save2server', function(){
          socket.emit('save2server');     
      })
      
      /*    ractive.on('scancodeBtn', function(e){
          var scancode = ractive.get('scancode');
          //scancodeBtn(scancode);
      }) */
      this.observe('scanhistoryfromserver', function(){
          if (isMobile.any) return;
          console.log('fixcards();')
          fixcards();
      })

      
      function fixcards(){
          var cards = {};//ractive.get('cards') || {};
          var scanhistoryfromserver = self.get('scanhistoryfromserver');
          for(var i=0; i<scanhistoryfromserver.length; i++){
              var k = scanhistoryfromserver[i][3];
              var k4 = (scanhistoryfromserver[i][1] == k) ? 'VP' :String(k).substr(0, 4);
              if (!cards[k4]) cards[k4] = { title:k4, arr:[], txt:[] };
  //            cards[k4]['arr'].splice(0,0,scanhistoryfromserver[i])
              cards[k4]['arr'].push(scanhistoryfromserver[i]);
              cards[k4]['txt'].push(scanhistoryfromserver[i][0] + ';' + scanhistoryfromserver[i][1] + ';' + scanhistoryfromserver[i][2] );
          }
          self.set('cards', cards);
      }
      //var scanhistorykv = {};

      function scancodeBtn(scancode){
          //console.log('scancodeBtn', scancode);
          if (scancode && sifarnik[scancode]){
              if (scanhistorykv[scancode]){
                  ion.sound.stop("vecpostoji");ion.sound.play("vecpostoji");
                  alertify.notify('Šifra '+scancode+' je vec očitana', 'warning', 3);
                  return
              }
              scanhistorykv[scancode] = true;
              //scanhistoryfromserverarr
              var scanhistoryarr = self.get('scanhistoryarr');
              scanhistoryarr.splice(0, 0, sifarnik[scancode]);
              self.set('scanhistoryarr', scanhistoryarr)

              //ractive.splice('scanhistoryarr',0,0, sifarnik[scancode]) // riknjava raktiv na splajs!
  //            ractive.push('scanhistoryarr', sifarnik[scancode])
              //var str = sifarnik[scancode].join(';')
              socket.emit('addscan', sifarnik[scancode]);


          } else {
              ion.sound.stop("no");ion.sound.play("no");
              alertify.notify('Šifra '+scancode+' nije nađena', 'error', 3);
          } 
          //ractive.set('scancode','')
      }


      this.prepareUpload = function (){
          var input = document.getElementById('myFile')
          console.log('myFile',input.files);
          var curFiles = input.files[0];

          // Parse local CSV file
          Papa.parse(curFiles, {
            // encoding:'cp1252',
              complete: function(results) {
                  console.log("Finished:", results.data);
                  
                  var arrdata = results.data;
                  var j={};
                  for (var i=0;i<arrdata.length;i++) {
                      //console.log(i, arrdata[i][1]);
                      
                      var kk = arrdata[i][1];
                      if (!kk) continue;
                      var k = kk.split('=')[0];
                      j[k] = arrdata[i];
                      j[k].push(k);// 4. je stripovana sifra
                  }
                  console.log(j);
                  // send to server 
                  socket.emit('sifarnik', j, function(){ 
                      alertify.notify('Sifarnik sacuvan', 'success', 3);
                  });
                  
                  //var txt = Papa.unparse(results.data,{encoding:'utf-8'});
                  //console.log(txt)
              }
          });        

    }

      
    },
    //data: {
    //  title: 'Hello World!'
    //}
  };
  
component.exports.template = {v:4,t:[{t:4,f:[{p:[2,1,17],t:7,e:"section",m:[{n:"style",f:"padding-bottom:0.5rem; padding-top: 0.5rem;",t:13}],f:[" ",{p:[5,5,145],t:7,e:"input",m:[{n:"value",f:[{t:2,r:"scancode",p:[5,19,159]}],t:13},{n:"type",f:"text",t:13},{n:"id",f:"scancode",t:13},{n:"placeholder",f:"Fokusiraj ovo polje i klikni dugme SCAN na skeneru",t:13}]}," "]}," ",{p:[8,1,393],t:7,e:"section",m:[{n:"style",f:"flex:1; padding-bottom:0.5rem; padding-top:0.5rem; overflow:auto",t:13}],f:[{p:[9,5,480],t:7,e:"table",f:[{t:4,f:[{p:[11,9,522],t:7,e:"tr",f:[{p:[12,13,539],t:7,e:"td",f:[{t:2,rx:{r:"scanhistoryarr",m:[{t:30,n:"i"},{r:[],s:"0"}]},p:[12,17,543]}]}," ",{p:[13,13,585],t:7,e:"td",m:[{n:"style",f:"font-size:1.2rem",t:13}],f:[{t:2,rx:{r:"scanhistoryarr",m:[{t:30,n:"i"},{r:[],s:"1"}]},p:[13,42,614]}]}," ",{p:[14,13,656],t:7,e:"td",m:[{n:"style",f:"text-align: right",t:13}],f:[{t:2,rx:{r:"scanhistoryarr",m:[{t:30,n:"i"},{r:[],s:"2"}]},p:[14,43,686]}]}]}],i:"i",r:"scanhistoryarr",p:[10,5,492]}]}]}," ",{p:[19,1,778],t:7,e:"section",m:[{n:"style",f:"padding-bottom:0.5rem; padding-top:0.5rem",t:13}],f:[{p:[20,5,842],t:7,e:"button",m:[{n:"m-full",f:0,t:13},{n:"click",f:{x:{r:["@this"],s:"[_0.fire(\"clearscan\")]"}},t:70}],f:["Obriši podatke sa skenera"]}," ",{p:[21,5,933],t:7,e:"button",m:[{n:"primary",f:0,t:13},{n:"m-full",f:0,t:13},{n:"click",f:{x:{r:["@this"],s:"[_0.fire(\"save2server\")]"}},t:70}],f:["Save to server"]}]}],n:50,r:"isMobile",p:[1,1,0]},{t:4,f:[{p:[26,1,1056],t:7,e:"section",f:[{p:[27,5,1070],t:7,e:"legend",f:["Upload šifarnika"]}," ",{p:[28,5,1108],t:7,e:"input",m:[{n:"name",f:"myFile",t:13},{n:"id",f:"myFile",t:13},{n:"type",f:"file",t:13},{n:"change",f:{x:{r:["@this"],s:"[_0.prepareUpload()]"}},t:70}]}]}," ",{p:[30,1,1209],t:7,e:"section",m:[{n:"style",f:"flex:1; padding-bottom:0.5rem; padding-top:0.5rem; display: flex; flex-flow: column; overflow-x: auto;",t:13}],f:[{p:[32,5,1335],t:7,e:"div",m:[{n:"class",f:"cardcont",t:13},{n:"style",f:["width:calc(36rem * ",{t:2,x:{r:["cards"],s:"Object.keys(_0).length"},p:[32,53,1383]}," )"],t:13}],f:[{t:4,f:[{p:[34,9,1446],t:7,e:"div",m:[{n:"class",f:"cardparent",t:13}],f:[{p:[35,13,1483],t:7,e:"card",f:[{p:[36,17,1506],t:7,e:"h5",m:[{n:"style",f:"margin:0;",t:13}],f:[{t:2,r:".title",p:[36,39,1528]},".txt"]}," ",{p:[37,17,1564],t:7,e:"hr"}," ",{p:[38,1,1569],t:7,e:"pre",f:[{t:4,f:[{t:2,rx:{r:"arr",m:[{t:30,n:"i"},{r:[],s:"0"}]},p:[38,17,1585]},";",{t:2,rx:{r:"arr",m:[{t:30,n:"i"},{r:[],s:"1"}]},p:[38,31,1599]},";",{t:2,rx:{r:"arr",m:[{t:30,n:"i"},{r:[],s:"2"}]},p:[38,45,1613]},"\n"],i:"i",r:".arr",p:[38,6,1574]}]}]}]}],i:"o",r:"cards",p:[33,9,1425]}]}," "]}," ",{p:[50,1,1896],t:7,e:"section",m:[{n:"style",f:"padding-bottom:0.5rem; padding-top:0.5rem",t:13}],f:[{p:[51,9,1964],t:7,e:"button",m:[{n:"click",f:{x:{r:["@this"],s:"[_0.fire(\"save2disk\")]"}},t:70}],f:["Save"]}," ",{p:[52,9,2029],t:7,e:"input",m:[{n:"type",f:"text",t:13},{n:"value",f:[{t:2,r:"filename",p:[52,35,2055]}],t:13},{n:"placeholder",f:"filename.txt",t:13},{n:"style",f:"width:20em",t:13}]}," ",{p:[53,9,2124],t:7,e:"button",m:[{n:"click",f:{x:{r:["@this"],s:"[_0.fire(\"clearscan\")]"}},t:70},{n:"style",f:"float:right",t:13}],f:["Obriši podatke sa skenera"]}]}],n:50,x:{r:["isMobile"],s:"!_0"},p:[25,1,1038]}],e:{"0":function (){return(0);},"1":function (){return(1);},"2":function (){return(2);},"[_0.fire(\"clearscan\")]":function (_0){return([_0.fire("clearscan")]);},"[_0.fire(\"save2server\")]":function (_0){return([_0.fire("save2server")]);},"[_0.prepareUpload()]":function (_0){return([_0.prepareUpload()]);},"Object.keys(_0).length":function (_0){return(Object.keys(_0).length);},"[_0.fire(\"save2disk\")]":function (_0){return([_0.fire("save2disk")]);},"!_0":function (_0){return(!_0);}}};
module.exports = Ractive.extend(component.exports);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);