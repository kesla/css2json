var _ = require('underscore')._

//
// Parse a css-string to a json-object.
//
exports.parse = parse = function(css) {

  // @json is the return value
  var json = {};

  // Each instance gets parsed and then removed from the input @css, until the
  // length is 0 
  while(css.length > 0) {
    // save index to the left bracket
    var lbracket = css.indexOf('{');
    // save index to the right bracket
    var rbracket = css.indexOf('}');

    css.substr(0, lbracket).split(",").forEach(function(s) {
      var selectors = s.trim();
      // initialize standard value if it isn't set
      if (!json[selectors]) json[selectors] = {};
      // Collect the attribute to the selectors
      var attributes = css.substring(lbracket + 1, rbracket).split(";");
      // Make the attributes chainable
      _(attributes).chain()
        // Trim each attribute from unneccesary white space
        .map(function(elm){ return elm.trim() })
        // Remove all empty values, "" for example
        .compact()
        // Get the value back from the chaining
        .value()
        // Go through each attribute and insert the value in the css-object
        .forEach(function(attribute){
          var index = attribute.indexOf(":");
          json[selectors][attribute.substring(0, index)] =  
            attribute.substring(index + 1).trim().replace(/'/g, "");
        });

    });
    // Continue to next instance
    css = css.slice(rbracket + 1).trim()
  }
  // return the json data
  return json;
}
