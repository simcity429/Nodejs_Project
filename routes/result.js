var express = require('express');
var router = express.Router();
var sql = require('mysql')
String.prototype.hashCode = () => {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
router.post('/', (req, res, next) => {
    var id = req.body.id
    var pw = req.body.pw.hashCode()
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    var login_query = `SELECT uid, usertype FROM(
      (SELECT uid, pw, usertype FROM administrator)
      UNION
      (SELECT uid, pw, usertype FROM freelancer)
      UNION
      (SELECT uid, pw, usertype FROM client)
      )tmp WHERE uid='${id}' AND pw='${pw}'`
    connection.query(login_query , (err, rows, fields) => {
      if (err){
        throw err
      }
      var auth
      if (rows.length == 1){
          req.session.auth=true
          req.session.uid=rows[0].uid
          req.session.usertype=rows[0].usertype
          if (rows[0].usertype == 0){ // 여기서 분기
            res.redirect('/admin')
          }
          else if(rows[0].usertype == 1) {

               connection.query(`SELECT * FROM freelancer WHERE uid='${id}' AND pw='${pw}' ` , (err, rows2, fields) => {
                if (err){
                    throw err
                    }

                    req.session.auth=true
                    req.session.uid =rows2[0].uid
                    req.session.name=rows2[0].name
                    req.session.usertype=rows2[0].usertype
                    req.session.pid =rows2[0].pid
                    req.session.career =rows2[0].career
                    req.session.c =rows2[0].c
                    req.session.java =rows2[0].python
                    req.session.python =rows2[0].python
                    req.session.nodejs =rows2[0].nodejs
                    req.session.php =rows2[0].python

                    connection.end();
                    res.redirect('/freelancer');
              });

          }
          else if(rows[0].usertype == 2) {
                  connection.end();
                  res.render('client', {name: rows[0].uid, auth: auth, usertype: rows[0].usertype});
              }
      } else {
          req.session.auth=false
          connection.end();
          res.render('no');
      }
    })
});
module.exports = router;
