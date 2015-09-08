var pg = require('pg');
var fs = require('fs');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tracker-serverjs';

var client = new pg.Client(connectionString);
client.connect();


fs.readFile('db/structure.sql', 'utf8', function(err, data) {
  var query = client.query(data);
  query.on('end', function() { client.end(); });
});
