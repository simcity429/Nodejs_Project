var express = require('express');
var router = express.Router();
var sql = require('mysql')

router.get('/', (req, res, next) => {

        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `SELECT * FROM freelancer, (SELECT * FROM team_member WHERE tname = '${req.query.tname}') AS A WHERE freelancer.uid = A.uid`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.render('teammanage_pg', {tname: req.query.tname, teammember: rows, pid: req.query.pid})
            connection.end()
        })

})


router.get('/delete', (req, res, next) => {

        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `DELETE FROM participant WHERE pid='${req.query.pid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('/freelancer')
            connection.end()
        })

})

router.get('/addmember', (req, res, next) => {

        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var member = req.query.member;
        var tname = req.query.tname;
        var q1 = `INSERT INTO team_member(tname, uid) VALUES('${tname}', '${member}')`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('/teammanage')
            connection.end()
        })

})

router.get('/memberdrop', (req, res, next) => {

        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `DELETE FROM team_member WHERE uid='${req.query.uid}' AND tname='${req.query.tname}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('/teammanage')
            connection.end()
        })

})

module.exports = router;
