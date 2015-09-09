var express = require('express');
var pg = require('pg');
var router = express.Router();
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tracker-serverjs';

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
  pg.connect(connectionString, function(err, client, done) {
    var query = client.query(sql);
    query.on('row', function(row) {
      results.push(row.row_to_json);
    });
    query.on('end', function() {
      client.end();
      return res.json(results);
    });
    if(err) {
      console.log(err);
    }
  });
});

module.exports = router;
