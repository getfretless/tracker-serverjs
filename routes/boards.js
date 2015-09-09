var express = require('express');
var fs = require('fs');
var path = require('path');
var withConnection = require('../lib/withConnection');
var router = express.Router();

/* GET boards listing. */
router.get('/', function(req, res, next) {
  var results = [];
  var sql = fs.readFileSync(path.join(__dirname + '/../db/queries/boardsIndex.sql'), 'utf8');
  withConnection(function(client) {
    client.query(sql)
      .on('row', function(row) {
        results.push(row.row_to_json);
      })
      .on('end', function() {
        client.end();
        return res.json(results);
      });
  });
});

router.post('/', function(req, res) {
  var results = [];
  var data = {title: req.body.title, description: req.body.description, position: req.body.position};
  var insertSQL = "INSERT INTO boards(title, description, position, created_at, updated_at) values($1, $2, $3, NOW(), NOW()) RETURNING id";
  withConnection(function(client) {
    client.query(insertSQL, [data.title, data.description, data.position])
    .on('row', function(row) {
      client.query("SELECT * FROM boards WHERE id = $1", [row.id])
      .on('row', function(row) {
        results.push(row);
      })
      .on('end', function() {
        client.end();
        return res.json(results);
      });
    });
  });
});

module.exports = router;
