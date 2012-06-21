var assert = require('assert'),
    css2json = require('../lib/css2json'),
    fs = require('fs'),
    JSON2 = require("json-san"),
    path = require('path');

var bases = ['simple', 'advanced', 'advanced2', 'comments'];

bases.forEach(function(base){
  var basePath = path.join(__dirname, "fixtures", base);
  var css = fs.readFileSync(basePath + '.css', 'utf8'),
     json = JSON2.parse(fs.readFileSync(basePath + '.json', 'utf8'));

  assert.deepEqual(css2json(css), json);
});
