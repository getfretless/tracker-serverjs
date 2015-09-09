var fs = require('fs');
var path = require('path');

var loadQuery = function(filename) {
  return fs.readFileSync(
    path.join(__dirname + '/../db/queries/' + filename),
    'utf8'
  );
};

module.exports = loadQuery;
