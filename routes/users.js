var express = require('express');
var withConnection = require('../lib/withConnection');
var router = express.Router();
var loadQuery = require('../lib/loadQuery');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  var newUser;
  var data = {name: req.body.name, email: req.body.email, password: req.body.password};
  var insertSQL = loadQuery('userInsert.sql');
  var selectSQL = loadQuery('userSelectById.sql');
  withConnection(function(client) {
    client.query(insertSQL, [data.name, data.email, data.password])
    .on('row', function(row) {
      client.query(selectSQL, [row.id])
      .on('row', function(row) {
        newUser = row;
      })
      .on('end', function() {
        client.end();
        if (newUser) {
          return res.json(newUser);
        } else {
          res.send(500, 'Could not create user');
          return;
        }
      });
    });
  });
});

router.post('/authenticate', function(req, res, next) {
  var secret = 'shhhhhhhhared-secret'
  expressJWT({ secret: secret }); // setup secret
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
        if (user) {
          // sign token using secret and return token
          var token = jwt.sign(user, secret, { expiresInMinutes: 60*5 });
          return res.json({ token: token });
        } else {
          res.send(401, 'Wrong user or password');
          return;
        }
      });
  });
});

module.exports = router;
