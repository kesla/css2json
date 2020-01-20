// @ts-check
'use strict';

// css2json transform CSS to JSON.
//
// css2json is a <a href="http://www.opensource.org/licenses/mit-license.php">open source</a>
// library for <a href="http://nodejs.org">Node.js</a> (with browser
// compability planned) hosted on <a href="https://github.com/kesla/css2json">github</a>
// and written by <a href="http://davidbjorklund.se">David Björklund</a>.

// Parse a string with css to a json-object.

/**
 * @param {string} input
 */
module.exports = function css2json(input) {
  var css = input;
  /**
   * @type {number}
   */
  var open;
  /**
   * @type {number}
   */
  var close;

  // Remove all comments from the css-file
  while((open = css.indexOf("/*")) !== -1 &&
      (close = css.indexOf("*/")) !== -1) {
    css = css.substring(0, open) + css.substring(close + 2);
  }

  // Initialize the return value _json_.
  var json = {};

  // Each rule gets parsed and then removed from _css_ until all rules have been
  // parsed.
  while(css.length > 0) {
    // Save the index of the first left bracket
    var lbracket = css.indexOf('{');

    // find the matching right bracket
    // bracketCount increases whenever we visit a left bracket
    // decreases whenever  we visit a right bracket
    // so when bracketCount is 0 that means we've found a match
    var bracketCount = 0;
    // maxBracketCount is used further down
    var maxBracketCount = bracketCount;
    var rbracket = lbracket;

    while (rbracket < css.length) {
      if (css[rbracket] === '{') {
        bracketCount = bracketCount + 1;
        maxBracketCount = Math.max(bracketCount, maxBracketCount);
      }

      if (css[rbracket] === '}') {
        bracketCount = bracketCount - 1;
        if (bracketCount === 0) {
          break;
        }
      }

      rbracket = rbracket + 1
    }

    /**
    * Each selector in the selectors block will be associated with the
    * declarations defined above. For example, `h1, p#bar {color: red}`<br/>
    * result in the object<br/>
    * {"h1": {color: red}, "p#bar": {color: red}}

    * Split the selectors block of the first rule into an array and remove
    * whitespace, e.g. `"h1, p#bar, span.foo"` get parsed to
    * `["h1", "p#bar", "span.foo"]`.
    */
    var selectors = css.substring(0, lbracket)
      .split(",")
      .map(function(selector){
        return selector.trim();
      });

    // Iterate through each selector from _selectors_.
    selectors.forEach(function(selector) {
      // Initialize the json-object representing the declaration block of
      // _selector_.
      if (!json[selector]) json[selector] = {};
      // Save the declarations to the right selector

      var declarations = maxBracketCount > 1 ?
        css2json(css.slice(lbracket + 1, rbracket)) :
        getDeclarations(css, lbracket, rbracket);      

        Object.keys(declarations).forEach(function(key) {
        json[selector][key] = declarations[key];
      });
    });
    // Continue to next instance
    css = css.slice(rbracket + 1).trim()
  }
  // return the json data
  return json;
}

/**
 * Helper method that transform an array to a object, by splitting each
 * declaration (_font: Arial_) into key (_font_) and value(_Arial_).
 * @param {string[]} array
 */
function toObject(array){
  var ret = {};
  array.forEach(function(elm) {
    var index = elm.indexOf(":");
    var property = elm.substring(0, index).trim();
    var value = elm.substring(index + 1).trim();
    ret[property] = value;
  });
  return ret;
}


/**
 * The declarations
 *
 * Transform the declarations to an object. For example, the declarations<br/>
 *  `font: 'Times New Roman' 1em; color: #ff0000; margin-top: 1em;`<br/>
 * result in the object<br/>
 * `{"font": "'Times New Roman' 1em", "color": "#ff0000", "margin-top": "1em"}`.
 * 
 * @param {string} css
 * @param {number} lbracket
 * @param {number} rbracket
 */
function getDeclarations(css, lbracket, rbracket) {
  // Split the declaration block of the first rule into an array and remove
  // whitespace from each declaration.
  var declarationList = css.substring(lbracket + 1, rbracket)
    .split(";")
    .map(function (declaration) {
      return declaration.trim();
    })
    .filter(function (declaration) {
      return declaration.length > 0;
    }); // Remove any empty ("") values from the array

    // _declaration_ is now an array reado to be transformed into an object.
  var declarations = toObject(declarationList);
  return declarations;
}

