var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/freelancer', function(req, res, next) {
  console.log('freelancer called')
  res.render('freelancer')
  //res.render('index', { title: rows[0].id });
});

module.exports = router;
