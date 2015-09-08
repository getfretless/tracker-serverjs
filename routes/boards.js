var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ data: [1, 3, { thing: "thingdata" }] });
});

module.exports = router;
