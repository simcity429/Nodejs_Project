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


router.get('/', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        res.render('admin_main')
    }
})
router.get('/freelancer', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var query = `SELECT * FROM freelancer`
        connection.query(query, (err, rows, fields) => {
            res.render('admin_freelancer', {data: rows})
        })
    }
})

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
                    res.redirect('freelancer') ////
                }
            })
        }
    })
})

router.get('/freelancer_dropInternal', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `DELETE FROM portfolio_internal WHERE uid='${req.query.uid}' AND qid='${req.query.qid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('freelancer')
            connection.end()
        })
    }
})
router.get('/freelancer_advancedmanage', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `SELECT * FROM freelancer WHERE uid='${req.query.uid}'`
        var q2 = `SELECT * FROM portfolio_external WHERE uid='${req.query.uid}'`
        var q3 = `SELECT *
        FROM portfolio_internal WHERE uid='${req.query.uid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            } else {
                var freelancer = rows[0]
                connection.query(q2, (err, rows, fields) => {
                    if (err){
                        throw err
                    } else {
                        var pe = rows
                        connection.query(q3, (err, rows, fields) => {
                            if (err){
                                throw err
                            } else {
                                var pi = rows
                                res.render('admin_freelancer_advanced', {freelancer: freelancer, pe: pe, pi: pi})
                                connection.end()
                            }
                        })
                    }
                })
            }
        })
    }
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
        res.redirect('freelancer')
        connection.end()
    })
})

router.get('/freelancer_downExternal', (req, res, next) => {
    var file = __dirname + '/../uploads/' + req.query.filename
    res.download(file)
})
router.get('/freelancer_domodify', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var deleting = req.query.delete
        var targetuid = req.query.uid
        if (deleting==1){
            var query = `DELETE FROM freelancer WHERE uid='${targetuid}'`
            connection.query(query, (err, rows, fields) =>{
                if (err){
                    throw err
                } else {
                    console.log('delete success')
                    res.redirect('freelancer')
                    connection.end();
                }
            })
        } else {
            var name = req.query.name
            var phone = req.query.phone
            var grade = req.query.grade
            var age = req.query.age
            var career = req.query.career
            var major = req.query.major
            var python = req.query.python
            var java = req.query.java
            var c = req.query.c
            var php = req.query.php
            var nodejs = req.query.nodejs
            var query = `UPDATE freelancer
            SET name='${name}', phone='${phone}', grade=${grade}, age=${age}, career=${career}, major='${major}', python=${python}, java=${java}, c=${c}, php=${php}, nodejs=${nodejs}
            WHERE uid='${targetuid}'`
            connection.query(query, (err, rows, fields) =>{
                if (err){
                    throw err
                } else {
                    console.log('modify success')
                    res.redirect('freelancer')
                    connection.end();
                }
            })
        }
    }
})

router.get('/client', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var query = `SELECT * FROM client`
        connection.query(query, (err, rows, fields) => {
            res.render('admin_client', {data: rows})
        })
    }
})

router.get('/client_advancedmanage', (req, res, next) =>{
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `SELECT * FROM client WHERE uid='${req.query.uid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            var client = rows[0]
            res.render('admin_client_advanced', {client: client})
        })
    }
})

router.get('/client_domodify', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var deleting = req.query.delete
        var targetuid = req.query.uid
        if (deleting==1){
            var query = `DELETE FROM client WHERE uid='${targetuid}'`
            connection.query(query, (err, rows, fields) =>{
                if (err){
                    throw err
                } else {
                    console.log('delete success')
                    res.redirect('client')
                    connection.end();
                }
            })
        } else {
            var name = req.query.name
            var phone = req.query.phone
            var grade = req.query.grade
            var query = `UPDATE client
            SET name='${name}', phone='${phone}', grade=${grade}
            WHERE uid='${targetuid}'`
            connection.query(query, (err, rows, fields) =>{
                if (err){
                    throw err
                } else {
                    console.log('modify success')
                    res.redirect('client')
                    connection.end();
                }
            })
        }
    }
})


router.get('/quest', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `SELECT qid, uid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate, min_career, min_freenum, max_freenum, python, java, c, php, nodejs, pstartdate, pfinishdate FROM quest`
        var q2 = `SELECT qid, reject FROM quest_approval`
        var data
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            data = rows
            connection.query(q2, (err, rows, fields) => {
                res.render('admin_quest', {data: data, reject: rows})
            })
        })
    }
})

router.get('/reject_delete', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `UPDATE quest_approval SET reject=NULL WHERE qid='${req.query.qid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('quest')
        })
    }
})

router.get('/quest_advancedmanage', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var q1 = `SELECT qid, uid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate, min_career, min_freenum, max_freenum, python, java, c, php, nodejs, pstartdate, pfinishdate FROM quest WHERE qid='${req.query.qid}'`
        var q2 = `SELECT * FROM quest_document WHERE qid='${req.query.qid}'`
        var q3 = `SELECT count(*) AS c FROM quest_participant WHERE qid='${req.query.qid}' AND pick=1`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            var quest = rows[0]
            connection.query(q2, (err, rows, fields) => {
                if (err){
                    throw err
                }
                var documents = rows
                connection.query(q3, (err, rows, fields) => {
                    if (err){
                        throw err
                    }
                    var canbemodify
                    if (rows[0].c > 0){
                        canbemodify = 0
                    } else {
                        canbemodify = 1
                    }
                    res.render('admin_quest_advanced', {quest: quest, documents: documents, canbemodify: canbemodify})
                    connection.end()
                })
            })
        })
    }
})

router.get('/quest_domodify', (req, res, next) =>{
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var qid = req.query.qid
        var q1 = `SELECT count(*) AS c FROM quest_participant WHERE qid='${qid}' AND pick=1`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            if (rows[0].c > 0){
                res.render('admin_quest_cannotModify')
                connection.end()
            } else {
                console.log(rows[0].c)
                if (req.query.delete == 0){
                    var uid = req.query.uid
                    var qname = req.query.qname
                    var qcost = req.query.qcost
                    var dstartdate = req.query.dstartdate
                    var dfinishdate = req.query.dfinishdate
                    var min_career = req.query.min_career
                    var min_freenum = req.query.min_freenum
                    var max_freenum = req.query.max_freenum
                    var python = req.query.python
                    var java = req.query.java
                    var c = req.query.c
                    var php = req.query.php
                    var nodejs = req.query.nodejs
                    var pstartdate = req.query.pstartdate
                    var pfinishdate = req.query.pfinishdate
                    var q2
                    if (dfinishdate==''){
                        q2 = `UPDATE quest SET uid='${uid}', qname='${qname}', qcost=${qcost}, dstartdate='${dstartdate}', dfinishdate=NULL, min_career='${min_career}', min_freenum='${min_freenum}', max_freenum='${max_freenum}', python='${python}', java='${java}', c='${c}', php='${php}', nodejs='${nodejs}' WHERE qid='${qid}'`
                    } else {
                        q2 = `UPDATE quest SET uid='${uid}', qname='${qname}', qcost=${qcost}, dstartdate='${dstartdate}', dfinishdate='${dfinishdate}', min_career=${min_career}, min_freenum=${min_freenum}, max_freenum=${max_freenum}, python=${python}, java=${java}, c=${c}, php=${php}, nodejs=${nodejs} WHERE qid='${qid}'`
                    }
                    connection.query(q2, (err, rows, fields) => {
                        if (err){
                            throw err
                        }
                        console.log(q2)
                        console.log('update succ')
                        res.redirect("quest")
                    })
                } else {//delete
                    var q2 = `DELETE FROM quest WHERE qid='${qid}'`
                    connection.query(q2, (err, rows, field) => {
                        if (err){
                            throw err
                        }
                        res.redirect('quest')
                        connection.end()
                    })
                }
            }
        })
    }
})
router.post('/document_update', upload.single('file'), (req, res, next) => {
    var qid = req.body.qid
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.body.canbemodify==0){
        res.render('admin_quest_cannotModify')
    } else {
        var q1 = `SELECT max(did) AS i FROM quest_document WHERE qid='${qid}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            } else {
                var did = 0
                if (rows[0].i == null){
                    did = 0
                } else {
                    did = rows[0].i + 1
                }
                var filename = req.file.filename
                var q2 = `INSERT INTO quest_document(did, qid, filename) VALUES(${did}, '${qid}', '${filename}')`
                connection.query(q2, (err, rows, fields) => {
                    if (err){
                        throw err
                    } else {
                        res.redirect('quest')
                    }
                })
            }
        })
    }
})
router.get('/quest_dropDocument', (req, res, next) =>{
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.query.canbemodify==0){
        res.render('admin_quest_cannotModify')
    } else {
        var q1 = `DELETE FROM quest_document WHERE qid='${req.query.qid}' AND did=${req.query.did}`
        connection.query(q1, (err, rows, fields) =>{
            if (err){
                throw err
            }
            res.redirect('quest')
            connection.end()
        })
    }
})

router.get('/quest_downDocument', (req, res, next) => {
    var file = __dirname + '/../uploads/' + req.query.filename
    res.download(file)
})

router.get('/team', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var query = `SELECT * FROM team`
        connection.query(query, (err, rows, fields) => {
            res.render('admin_team', {data: rows})
        })
    }
})

router.get('/team_advancedmanage', (req, res, next) => {
    if (req.session.usertype != 0){
        res.render('wrong_approach')
    } else {
        var connection = sql.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'supercrack1',
            port : 3306,
            database : 'supercrack'
        })
        connection.connect()
        var leader = req.query.leader
        var q1 = `SELECT * FROM team_member WHERE tname='${req.query.tname}'`
        var q2 = `SELECT count(*) AS c FROM quest_participant WHERE pid='${req.query.pid}' AND pick=1`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            var member = rows
            connection.query(q2, (err, rows, fields) => {
                if (err){
                    throw err
                }
                var canbemodify
                if (rows[0].c > 0){
                    canbemodify = 0
                } else {
                    canbemodify = 1
                }
                res.render('admin_team_advanced', {member: member, canbemodify: canbemodify, leader: leader})
                connection.end()
            })
        })
    }
})

router.get('/team_dropmember', (req, res, next) => {
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.query.canbemodify == 0){
        res.render('admin_team_err', {flag: 0})
    } else {
        var uid = req.query.uid
        var leader = req.query.leader
        if (uid === leader){
            res.render('admin_team_err', {flag: 1})
        } else {
            var tname = req.query.tname
            var q = `DELETE FROM team_member WHERE tname='${tname}' AND uid='${uid}'`
            connection.query(q, (err, rows, fields) => {
                if (err){
                    throw err
                }
                res.redirect('team')
            })
        }
    }
})

router.get('/team_addmember', (req, res, next) => {
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.query.canbemodify == 0){
        res.render('admin_team_err', {flag: 0})
    } else {
        var uid = req.query.uid
        var tname = req.query.tname
        var q = `INSERT INTO team_member(tname, uid) VALUES('${tname}', '${uid}')`
        console.log(q)
        connection.query(q, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('team')
        })
    }
})

router.get('/team_changeleader', (req, res, next) => {
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.query.canbemodify == 0){
        res.render('admin_team_err', {flag: 0})
    } else {
        var uid = req.query.uid
        var tname = req.query.tname
        var q1 = `SELECT COUNT(*) AS c FROM team_member WHERE tname='${tname}' AND uid='${uid}'`
        var q2 = `UPDATE team SET leader='${uid}' WHERE tname='${tname}'`
        connection.query(q1, (err, rows, fields) => {
            if (err){
                throw err
            }
            var c = rows[0].c
            if (c == 0){
                res.render('admin_team_err', {flag: 2})
            } else {
                connection.query(q2, (err, rows, fields) => {
                    if (err){
                        throw err
                    }
                    res.redirect('team')
                })
            }
        })
    }
})

router.get('/team_delete', (req, res, next) => {
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
    })
    connection.connect()
    if (req.query.canbemodify == 0){
        res.render('admin_team_err', {flag: 0})
    } else {
        var tname = req.query.tname
        var q = `DELETE FROM team WHERE tname='${tname}'`
        connection.query(q, (err, rows, fields) => {
            if (err){
                throw err
            }
            res.redirect('team')
        })
    }
})

module.exports = router;
