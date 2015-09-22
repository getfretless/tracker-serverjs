var express = require('express');
var withConnection = require('../lib/withConnection');
var router = express.Router();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
