var express = require('express');
var router = express.Router();
var sql = require('mysql')
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
router.post('/', function(req, res, next) {
    var id = req.body.id
    var pw = req.body.pw.hashCode()
    console.log(pw)
    var name = req.body.name
    var phone_number = req.body.phone_number
    var usertype = req.body.usertype
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    var q1= `SELECT uid FROM(
      (SELECT uid FROM administrator)
      UNION
      (SELECT uid FROM freelancer)
      UNION
      (SELECT uid FROM client)
      )tmp WHERE uid='${id}'`

    connection.query(q1, (err, rows, field)=>{
      if (err){
        throw err
      }
      if (rows.length > 0){
        res.render('signup_err')
        connection.end()
      } else {
        if (usertype == "freelancer"){
          var age = req.body.age
          var career = req.body.career
          var major = req.body.major
          var c = req.body.c
          var python = req.body.python
          var java = req.body.java
          var php = req.body.php
          var nodejs = req.body.nodejs
          var query1 = `INSERT INTO supercrack.participant(usertype) VALUES (1)`
          var query2 = `INSERT INTO supercrack.freelancer(uid, pw, name, phone, usertype, grade, age, career, major, python, c, java, php, nodejs, pid)
          VALUES ('${id}', '${pw}', '${name}', '${phone_number}', 1, 0, ${age}, ${career}, '${major}', ${python}, ${c}, ${java}, ${php}, ${nodejs}, LAST_INSERT_ID())`
          connection.query(query1, (err, rows, fields) => {
            if (err){
              throw err
            }
            connection.query(query2, (err, rows, fields) => {
              if (err){
                throw err
              }
              res.redirect('/')
              connection.end()
            })
          });
        } else {
          connection.query(`INSERT INTO client(uid, pw, name, phone, usertype, grade) VALUES ('${id}', '${pw}', '${name}', '${phone_number}', 2, 0)` , (err, rows, fields) => {
            if (err){
              throw err
            }
            console.log('success')
            res.redirect('/')
            connection.end()
        });
      }
    }
  });
});
module.exports = router;
