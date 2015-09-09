var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tracker-serverjs';

var withConnection = function(successCallback, failureCallback) {
  pg.connect(connectionString, function(err, client, done) {
    if (typeof(successCallback) == "function") {
      successCallback(client);
    }
    if (err) {
      handleError(error, failureCallback);
    }
  });
};

var handleError = function(error, failureCallback) {
  if (err) {
    if (typeof(failureCallback) == 'function') {
      failureCallback(err);
    } else {
      console.log(err);
    }
  }
};

module.exports = withConnection;
