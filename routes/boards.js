var express = require('express');
var withConnection = require('../lib/withConnection');
var router = express.Router();

/* GET boards listing. */
router.get('/', function(req, res, next) {
  var results = [];
  var sql =
    "select row_to_json(r) from (" +
    "  select *, " +
    "    ('http://localhost:3000/boards/' || boards.id) as url," +
    "    (select array_to_json(array_agg(row_to_json(s))) from (" +
    "        select *," +
    "          ('http://localhost:3000/stories/' || stories.id) as url," +
    "          (select row_to_json(u) from " +
    "            (select id, name, email, created_at, updated_at from users where stories.user_id = users.id) u" +
    "          ) as user" +
    "        from stories where board_id = boards.id" +
    "      ) s" +
    "    ) as stories" +
    "  from boards" +
    ") r;";
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
