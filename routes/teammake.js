var express = require('express');
var router = express.Router();
var sql = require('mysql')

router.get('/', (req, res, next) => {
  res.render('teammake_pg')
})

router.post('/teammake', function(req, res, next) {
    var id = req.session.uid
    var tname = req.body.tname
    var leader = req.session.uid
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
      })
      connection.connect()
      connection.query(`INSERT INTO participant (usertype) VALUES ('3')` , (err, rows, fields) => {
        if (err){
          throw err
        }
        console.log('success')
      })
      connection.query(`INSERT INTO team (tname, leader, pid)
      VALUES ('${tname}', '${id}', LAST_INSERT_ID())` , (err, rows, fields) => {
        if (err){
          throw err
        }
        console.log('success')
      })
      connection.query(`INSERT INTO team_member (tname, uid) VALUES ('${tname}', '${id}')` , (err, rows, fields) => {
        if (err){
          throw err
        }
        console.log('success')
        res.redirect('/freelancer')
      })
      connection.end()
});

module.exports = router;
