var express = require('express');
var withConnection = require('../lib/withConnection');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', function(req, res, next) {
  var user;
  var data = { email: req.body.email, password: req.body.password };
  var sql = 'SELECT * FROM users WHERE email = $1 LIMIT 1;';
  withConnection(function(client) {
    client.query(sql, [data.email])
      .on('row', function(row) {
        user = row;
      })
      .on('end', function() {
        client.end();
        return res.json(user);
      });
  });
});

module.exports = router;
