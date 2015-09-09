var express = require('express');
var withConnection = require('../lib/withConnection');
var loadQuery = require('../lib/loadQuery');
var router = express.Router();

/* GET boards listing. */
router.get('/', function(req, res, next) {
  var results = [];
  var sql = loadQuery('boardsIndex.sql');
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
  var insertSQL = loadQuery('boardInsert.sql');
  var selectSQL = loadQuery('boardSelectById.sql');
  withConnection(function(client) {
    client.query(insertSQL, [data.title, data.description, data.position])
    .on('row', function(row) {
      client.query(selectSQL, [row.id])
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
