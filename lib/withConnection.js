var pg = require('pg');
var database = require('../config/database.js')
var connectionString = database.connectionString;

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
