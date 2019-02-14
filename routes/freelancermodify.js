var express = require('express');
var router = express.Router();
var sql = require('mysql')
var path = require('path')
var multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        var ext = file.originalname.slice(file.originalname.indexOf(".") + 1)
        cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + "." + ext)
    }
})
var upload = multer({storage: storage})

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

router.post('/external_update', upload.single('file'), (req, res, next) => {
    var uid = req.body.uid
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    var q1 = `SELECT max(portid) AS i FROM portfolio_external WHERE uid='${uid}'`
    connection.query(q1, (err, rows, fields) => {
        if (err){
            throw err
        } else {
            var portid = 0
            if (rows[0].i == null){
                portid = 0
            } else {
                portid = rows[0].i + 1
            }
            var filename = req.file.filename
            var development_info = req.body.development_info
            var q2 = `INSERT INTO portfolio_external(uid, portid, filename, development_info) VALUES('${uid}', ${portid}, '${filename}', '${development_info}')`
            connection.query(q2, (err, rows, fields) => {
                if (err){
                    throw err
                } else {
                    res.redirect('/freelancermodify_pg')
                }
            })
        }
    })
})


router.get('/freelancer_dropExternal', (req, res, next) =>{
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    var q1 = `DELETE FROM portfolio_external WHERE uid='${req.query.uid}' AND portid=${req.query.portid}`
    connection.query(q1, (err, rows, fields) =>{
        if (err){
            throw err
        }
        res.redirect('/freelancermodify_pg')
        connection.end()
    })
})

router.get('/freelancer_downExternal', (req, res, next) => {
    var file = __dirname + '/../uploads/' + req.query.filename
    res.download(file)
})

router.get('/freelancer_domodify', (req, res, next) => {

        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var deleting = req.query.delete
        var targetuid = req.session.uid
            var name = req.query.name
            var phone = req.query.phone
            var age = req.query.age
            var career = req.query.career
            var major = req.query.major
            var python = req.query.python
            var java = req.query.java
            var c = req.query.c
            var php = req.query.php
            var nodejs = req.query.nodejs


            var pw = req.query.pw
                if(pw != ''){
                  pw = pw.hashCode();
                  var query = `UPDATE freelancer
                  SET pw = '${pw}', name='${name}', phone='${phone}', age=${age}, career=${career}, major='${major}', python=${python}, java=${java}, c=${c}, php=${php}, nodejs=${nodejs}
                  WHERE uid='${targetuid}'`
                }
                else{
            var query = `UPDATE freelancer
            SET name='${name}', phone='${phone}', age=${age}, career=${career}, major='${major}', python=${python}, java=${java}, c=${c}, php=${php}, nodejs=${nodejs}
            WHERE uid='${targetuid}'`
          }
            connection.query(query, (err, rows, fields) =>{
                if (err){
                    throw err
                } else {
                  req.session.career =career
                  req.session.c = c
                  req.session.java = python
                  req.session.python = python
                  req.session.nodejs = nodejs
                  req.session.php = python
                    console.log('modify success')
                    res.redirect('/freelancermodify_pg')
                    connection.end();
                }
            })


})



module.exports = router;
