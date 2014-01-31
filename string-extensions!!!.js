// Extend String prototype w/ helpers
//
// Watch out devs!  `for in` loops over a string object may not behave as
// expected.  I suggest you run your code before shipping directly to
// production, and not including this file in your main app.
//
// I extend with:
//
// - colors.js
// - formatting functions like 'camelcase'
// - interpolate(data),  which is taken from: _.template
//
//////////////////////////////////////
// Borrow a few _.string functions
//////////////////////////////////////
var _s = {
	titleize: function(str){
		if (str == null) return '';
		return String(str).replace(/(?:^|\s)\S/g, function(c){ return c.toUpperCase(); });
	},
	camelize: function(str){
		return str.trim().replace(/[-_\s]+(.)?/g, function(match, c){ return c.toUpperCase(); });
	},
	underscored: function(str){
		return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	},
	dasherize: function(str){
		return str.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
	},
	classify: function(str){
		return _s.titleize(String(str).replace(/_/g, ' ')).replace(/\s/g, '');
	},
	capitalize : function(str){
		str = str == null ? '' : String(str);
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	humanize: function(str){
		return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
	},
}

for (k in _s) {
	addProperty(k, function() {
		return _s[k](this)
	})
	//console.log(k,": hello there, my man!"[k])
}


//////////////////////////////////////
// Borrow _.template
//////////////////////////////////////
String.prototype.interpolate = function(data) {
	return _.template(this, data)
}

//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
_ = {}
// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
//_.templateSettings = {
	//evaluate    : /<%([\s\S]+?)%>/g,
	//interpolate : /<%=([\s\S]+?)%>/g,
	//escape      : /<%-([\s\S]+?)%>/g
//};
_.templateSettings = {
	evaluate    : /<%([\s\S]+?)%>/g,
	interpolate : /{{([\s\S]+?)}}/g,
	escape      : /<%-([\s\S]+?)%>/g
};

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
	"'":      "'",
	'\\':     '\\',
	'\r':     'r',
	'\n':     'n',
	'\t':     't',
	'\u2028': 'u2028',
	'\u2029': 'u2029'
};

var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
_.template = function(text, data, settings) {
	var render;
	settings = _.templateSettings

	// Combine delimiters into one regular expression via alternation.
	var matcher = new RegExp([
		(settings.escape || noMatch).source,
		(settings.interpolate || noMatch).source,
		(settings.evaluate || noMatch).source
	].join('|') + '|$', 'g');

	// Compile the template source, escaping string literals appropriately.
	var index = 0;
	var source = "__p+='";
	text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
		source += text.slice(index, offset)
			.replace(escaper, function(match) { return '\\' + escapes[match]; });

		if (escape) {
			source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
		}
		if (interpolate) {
			source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
		}
		if (evaluate) {
			source += "';\n" + evaluate + "\n__p+='";
		}
		index = offset + match.length;
		return match;
	});
	source += "';\n";

	// If a variable is not specified, place data values in local scope.
	if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	source = "var __t,__p='',__j=Array.prototype.join," +
		"print=function(){__p+=__j.call(arguments,'');};\n" +
		source + "return __p;\n";

	try {
		render = new Function(settings.variable || 'obj', '_', source);
	} catch (e) {
		e.source = source;
		throw e;
	}

	if (data) return render(data, _);
	var template = function(data) {
		return render.call(this, data, _);
	};

	// Provide the compiled function source as a convenience for precompilation.
	template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

	return template;
};




//////////////////////////////////////
// Borrow some of colors.js
//////////////////////////////////////
/*
colors.js

Copyright (c) 2010

Marak Squires
Alexis Sellier (cloudhead)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
//
// Prototypes the string object to have additional method calls that add terminal colors
//
function addProperty(color, func) {
  exports[color] = function (str) {
    return func.apply(str);
  };
  String.prototype.__defineGetter__(color, func);
}

function stylize(str, style) {
  var styles = {
		//styles
		'bold'      : ['\x1B[1m',  '\x1B[22m'],
		'italic'    : ['\x1B[3m',  '\x1B[23m'],
		'underline' : ['\x1B[4m',  '\x1B[24m'],
		'inverse'   : ['\x1B[7m',  '\x1B[27m'],
		'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
		//text colors
		//grayscale
		'white'     : ['\x1B[37m', '\x1B[39m'],
		'grey'      : ['\x1B[90m', '\x1B[39m'],
		'black'     : ['\x1B[30m', '\x1B[39m'],
		//colors
		'blue'      : ['\x1B[34m', '\x1B[39m'],
		'cyan'      : ['\x1B[36m', '\x1B[39m'],
		'green'     : ['\x1B[32m', '\x1B[39m'],
		'magenta'   : ['\x1B[35m', '\x1B[39m'],
		'red'       : ['\x1B[31m', '\x1B[39m'],
		'yellow'    : ['\x1B[33m', '\x1B[39m'],
		//background colors
		//grayscale
		'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
		'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
		'blackBG'     : ['\x1B[40m', '\x1B[49m'],
		//colors
		'blueBG'      : ['\x1B[44m', '\x1B[49m'],
		'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
		'greenBG'     : ['\x1B[42m', '\x1B[49m'],
		'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
		'redBG'       : ['\x1B[41m', '\x1B[49m'],
		'yellowBG'    : ['\x1B[43m', '\x1B[49m']
	};
  return styles[style][0] + str + styles[style][1];
}

function applyTheme(theme) {

  //
  // Remark: This is a list of methods that exist
  // on String that you should not overwrite.
  //
  var stringPrototypeBlacklist = [
    '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
    'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
    'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
    'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
  ];

  Object.keys(theme).forEach(function (prop) {
    if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
      console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
    }
    else {
      if (typeof(theme[prop]) === 'string') {
        addProperty(prop, function () {
          return exports[theme[prop]](this);
        });
      }
      else {
        addProperty(prop, function () {
          var ret = this;
          for (var t = 0; t < theme[prop].length; t++) {
            ret = exports[theme[prop][t]](ret);
          }
          return ret;
        });
      }
    }
  });
}


//
// Iterate through all default styles and colors
//
var x = ['bold', 'underline', 'strikethrough', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta', 'greyBG', 'blackBG', 'yellowBG', 'redBG', 'greenBG', 'blueBG', 'whiteBG', 'cyanBG', 'magentaBG'];
x.forEach(function (style) {

  // __defineGetter__ at the least works in more browsers
  // http://robertnyman.com/javascript/javascript-getters-setters.html
  // Object.defineProperty only works in Chrome
  addProperty(style, function () {
    return stylize(this, style);
  });
});

function sequencer(map) {
  return function () {
    if (!isHeadless) {
      return this.replace(/( )/, '$1');
    }
    var exploded = this.split(""), i = 0;
    exploded = exploded.map(map);
    return exploded.join("");
  };
}

var rainbowMap = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return stylize(letter, rainbowColors[i++ % rainbowColors.length]);
    }
  };
})();

exports.themes = {};

exports.addSequencer = function (name, map) {
  addProperty(name, sequencer(map));
};

exports.addSequencer('rainbow', rainbowMap);
exports.addSequencer('zebra', function (letter, i, exploded) {
  return i % 2 === 0 ? letter : letter.inverse;
});

exports.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      exports.themes[theme] = require(theme);
      applyTheme(exports.themes[theme]);
      return exports.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};


addProperty('stripColors', function () {
  return ("" + this).replace(/\x1B\[\d+m/g, '');
});

