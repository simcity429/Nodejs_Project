const express = require('express');
const router = express.Router();
var sql = require('mysql');
const fs = require('fs');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        var ext = file.originalname.slice(file.originalname.indexOf(".") + 1)
        cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + "." + ext)
    }
});

var upload = multer({storage: storage});


router.get('/', function(req, res, next) {

  var passedVariable = req.query.valid;

  var connection = sql.createConnection({
      host : 'localhost',
      user : 'root',
      password : 'supercrack1',
      port : 3306,
      database : 'supercrack'
    })

    connection.connect();

    var uid = req.session.uid;
    var pid = req.session.pid;
    var session = req.session
    var career = req.session.career
    var c = req.session.c
    var java = req.session.java
    var python = req.session.python
    var nodejs = req.session.nodejs
    var php = req.session.php
    var today = Date.now();




    var query = `SELECT *, "완료" as on_status FROM supercrack.quest AS A JOIN supercrack.quest_finished AS B ON A.qid = B.qid`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var finished_table = rows; //

        var query2 = `SELECT *, "진행중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 1) AS B ON A.qid = B.qid`;


        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2; // 진행

            var query3 = `SELECT *, "지원가능" as on_status FROM supercrack.quest`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, B.reject, "진행중" as on_status FROM supercrack.quest AS A
                JOIN (SELECT qid, reject FROM supercrack.quest_approval WHERE accepting = 0 AND pid=${pid}) AS B ON A.qid = B.qid`;

                connection.query(query4, (err, rows4, field4) => {

                  if (err) {
                    throw err
                  }

                  var query5 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, "신청대기중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 0 AND pid = ${pid}) AS B ON A.qid = B.qid`;
                connection.query(query5, (err, rows5, field5) =>{

                    if (err){
                        throw err
                    }

                    var query6 = `SELECT C.qid, C.uid, C.qname, D.participantgrade FROM supercrack.quest AS C
JOIN
(SELECT A.qid, A.participantgrade FROM (SELECT * FROM supercrack.quest_finished WHERE clientgrade = 0) AS A
JOIN (SELECT * FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
ON A.qid = B.qid) AS D
ON C.qid = D.qid
`;
                  connection.query(query6, (err, rows6, field6) =>{

                      if (err){
                          throw err
                      }

                                            var query7 = `SELECT *, "처리중" as on_status FROM
                      (SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum
                      FROM supercrack.quest AS A, (SELECT qid FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
                      WHERE A.qid = B.qid) AS K,
                      (SELECT qid, pid, accepting, reject, resultreport FROM supercrack.quest_approval WHERE resultreport IS NOT NULL) AS O
                      WHERE K.qid = O.qid`;
                                            connection.query(query7, (err, rows7, field7) =>{

                                                if (err){
                                                    throw err
                                                }



                                            // rows - 전체 rows2 - 진행중 rows3 - 전 rows4 - 내가하고있는거 rows5 - 내가신청한거


                                          var temp = rows2.concat(rows);
                                          temp = temp.concat(rows5)
                                          for (var i = 0;i < temp.length;i++){
                                            for (var j = 0;i < rows3.length;j++){
                                              if(temp[i].qid == rows3[j].qid){
                                                rows3[j].on_status = temp[i].on_status;
                                                break;
                                              }
                                            }
                                          }
                                          console.log(rows7.length)

                                          for (var i = 0;i < rows4.length;i++){
                                            for (var j = 0;j < rows7.length;j++){
                                              if(rows4[i].qid == rows7[j].qid){
                                                rows4[i].on_status = rows7[j].on_status;
                                                break;
                                              }
                                            }
                                          }

                    rows3.sort((a,b) => (a.dstartdate > b.dstartdate) ? 1 : ((b.dstartdate > a.dstartdate) ? -1 : 0));
                    console.log(python)
                    connection.end();
                    res.render('freelancerquest_pg', {missions: rows3, missions2: rows4, passedVariable, missions3: rows6, python: python, c: c, nodejs: nodejs, php: php, java: java, career: career, today: today});
                  });

});
                });
              });

            });

        });


    });

    });


router.get('/quest_cost', function(req, res, next) {

  var connection = sql.createConnection({
      host : 'localhost',
      user : 'root',
      password : 'supercrack1',
      port : 3306,
      database : 'supercrack'
    })

    connection.connect();

    var uid = req.session.uid;
    var pid = req.session.pid;
    var session = req.session
    var career = req.session.career
    var c = req.session.c
    var java = req.session.java
    var python = req.session.python
    var nodejs = req.session.nodejs
    var php = req.session.php
    var today = Date.now();

    var query = `SELECT *, "완료" as on_status FROM supercrack.quest AS A JOIN supercrack.quest_finished AS B ON A.qid = B.qid`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var finished_table = rows; //

        var query2 = `SELECT *, "진행중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 1) AS B ON A.qid = B.qid`;


        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2; // 진행

            var query3 = `SELECT *, "지원가능" as on_status FROM supercrack.quest`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, B.reject, "진행중" as on_status FROM supercrack.quest AS A
                JOIN (SELECT qid, reject FROM supercrack.quest_approval WHERE accepting = 0 AND pid=${pid}) AS B ON A.qid = B.qid`;

                connection.query(query4, (err, rows4, field4) => {

                  if (err) {
                    throw err
                  }

                  var query5 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, "신청대기중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 0 AND pid = ${pid}) AS B ON A.qid = B.qid`;
                connection.query(query5, (err, rows5, field5) =>{

                    if (err){
                        throw err
                    }

                    var query6 = `SELECT C.qid, C.uid, C.qname, D.participantgrade FROM supercrack.quest AS C
JOIN
(SELECT A.qid, A.participantgrade FROM (SELECT * FROM supercrack.quest_finished WHERE clientgrade = 0) AS A
JOIN (SELECT * FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
ON A.qid = B.qid) AS D
ON C.qid = D.qid
`;
                  connection.query(query6, (err, rows6, field6) =>{

                      if (err){
                          throw err
                      }

                                            var query7 = `SELECT *, "처리중" as on_status FROM
                      (SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum
                      FROM supercrack.quest AS A, (SELECT qid FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
                      WHERE A.qid = B.qid) AS K,
                      (SELECT qid, pid, accepting, reject, resultreport FROM supercrack.quest_approval WHERE resultreport IS NOT NULL) AS O
                      WHERE K.qid = O.qid`;
                                            connection.query(query7, (err, rows7, field7) =>{

                                                if (err){
                                                    throw err
                                                }



                                            // rows - 전체 rows2 - 진행중 rows3 - 전 rows4 - 내가하고있는거 rows5 - 내가신청한거


                                          var temp = rows2.concat(rows);
                                          temp = temp.concat(rows5)
                                          for (var i = 0;i < temp.length;i++){
                                            for (var j = 0;i < rows3.length;j++){
                                              if(temp[i].qid == rows3[j].qid){
                                                rows3[j].on_status = temp[i].on_status;
                                                break;
                                              }
                                            }
                                          }
                                          console.log(rows7.length)

                                          for (var i = 0;i < rows4.length;i++){
                                            for (var j = 0;j < rows7.length;j++){
                                              if(rows4[i].qid == rows7[j].qid){
                                                rows4[i].on_status = rows7[j].on_status;
                                                break;
                                              }
                                            }
                                          }


                    rows3.sort((a,b) => (a.qcost < b.qcost) ? 1 : ((b.qcost < a.qcost) ? -1 : 0));

                    connection.end();
                    res.render('freelancerquest_pg', {missions: rows3, missions2: rows4, missions3: rows6, python: python, c: c, nodejs: nodejs, php: php, java: java, career: career, today: today});
});
});
                });
              });

            });

        });


    });

    });


router.get('/quest_start_cost', function(req, res, next) {


  var connection = sql.createConnection({
      host : 'localhost',
      user : 'root',
      password : 'supercrack1',
      port : 3306,
      database : 'supercrack'
    })

    connection.connect();

    var uid = req.session.uid;
    var pid = req.session.pid;
    var session = req.session
    var career = req.session.career
    var c = req.session.c
    var java = req.session.java
    var python = req.session.python
    var nodejs = req.session.nodejs
    var php = req.session.php
    var today = Date.now();



    var query = `SELECT *, "완료" as on_status FROM supercrack.quest AS A JOIN supercrack.quest_finished AS B ON A.qid = B.qid`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var finished_table = rows; //

        var query2 = `SELECT *, "진행중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 1) AS B ON A.qid = B.qid`;


        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2; // 진행

            var query3 = `SELECT *, "지원가능" as on_status FROM supercrack.quest`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, B.reject, "진행중" as on_status FROM supercrack.quest AS A
                JOIN (SELECT qid, reject FROM supercrack.quest_approval WHERE accepting = 0 AND pid=${pid}) AS B ON A.qid = B.qid`;

                connection.query(query4, (err, rows4, field4) => {

                  if (err) {
                    throw err
                  }

                  var query5 = `SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum, "신청대기중" as on_status FROM supercrack.quest AS A JOIN (SELECT qid FROM supercrack.quest_participant WHERE pick = 0 AND pid = ${pid}) AS B ON A.qid = B.qid`;
                connection.query(query5, (err, rows5, field5) =>{

                    if (err){
                        throw err
                    }

                    var query6 = `SELECT C.qid, C.uid, C.qname, D.participantgrade FROM supercrack.quest AS C
JOIN
(SELECT A.qid, A.participantgrade FROM (SELECT * FROM supercrack.quest_finished WHERE clientgrade = 0) AS A
JOIN (SELECT * FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
ON A.qid = B.qid) AS D
ON C.qid = D.qid
`;
                  connection.query(query6, (err, rows6, field6) =>{

                      if (err){
                          throw err
                      }

                                            var query7 = `SELECT *, "처리중" as on_status FROM
                      (SELECT A.qid, A.qname, A.uid, A.qcost, A.dstartdate, A.dfinishdate, A.min_career, A.min_freenum, A.max_freenum
                      FROM supercrack.quest AS A, (SELECT qid FROM supercrack.quest_participant WHERE pick = 1 AND pid = ${pid}) AS B
                      WHERE A.qid = B.qid) AS K,
                      (SELECT qid, pid, accepting, reject, resultreport FROM supercrack.quest_approval WHERE resultreport IS NOT NULL) AS O
                      WHERE K.qid = O.qid`;
                                            connection.query(query7, (err, rows7, field7) =>{

                                                if (err){
                                                    throw err
                                                }



                                            // rows - 전체 rows2 - 진행중 rows3 - 전 rows4 - 내가하고있는거 rows5 - 내가신청한거


                                          var temp = rows2.concat(rows);
                                          temp = temp.concat(rows5)
                                          for (var i = 0;i < temp.length;i++){
                                            for (var j = 0;i < rows3.length;j++){
                                              if(temp[i].qid == rows3[j].qid){
                                                rows3[j].on_status = temp[i].on_status;
                                                break;
                                              }
                                            }
                                          }
                                          console.log(rows7.length)

                                          for (var i = 0;i < rows4.length;i++){
                                            for (var j = 0;j < rows7.length;j++){
                                              if(rows4[i].qid == rows7[j].qid){
                                                rows4[i].on_status = rows7[j].on_status;
                                                break;
                                              }
                                            }
                                          }


                    rows3.sort((a,b) => (a.dstartdate > b.dstartdate) ? 1 : ((b.dstartdate > a.dstartdate) ? -1 : 0));
                    rows3.sort((a,b) => (a.qcost < b.qcost) ? 1 : ((b.qcost < a.qcost) ? -1 : 0));

                    connection.end();
                    res.render('freelancerquest_pg', {missions: rows3, missions2: rows4, missions3: rows6, python: python, c: c, nodejs: nodejs, php: php, java: java, career: career, today: today});
});
});

            });
          });

        });


    });
  });



    });

router.get('/quest_participate/:qid', function(req, res, next){

    var qid = req.params.qid;
    var pid = req.session.pid;

    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
      })

    connection.connect();

    var query = `SELECT * FROM quest WHERE quest.qid='${qid}' `;

    connection.query(query, (err, rows, field) => {

      var req_min_career = rows[0].min_career;
      var req_min_freenum = rows[0].min_freenum;
      var req_python = rows[0].python;
      var req_java = rows[0].java;
      var req_c = rows[0].c;
      var req_php = rows[0].php;
      var req_nodejs = rows[0].nodejs;

        var query2 = `SELECT * FROM freelancer WHERE pid = ${pid}`;

        connection.query(query2, (err, rows2, field2) => {

          if(req_min_career > rows2[0].career || req_min_freenum > 1 || req_python > rows2[0].python || req_c > rows2[0].c || req_php > rows2[0].php || req_java > rows2[0].java || req_nodejs > rows2[0].nodejs ){
            // not available;
            var string = encodeURIComponent('you should check your specification');
            connection.end();
            res.redirect('/freelancerquest?valid=' + string);
          }
          else {
            var query3 = `INSERT INTO quest_participant VALUES ('${qid}', ${pid}, 0)`;
            connection.query(query3, (err, rows3, field3) => {
              if (err){
                  throw err
              }
              connection.end();
              res.redirect('/freelancerquest');
            });
          }

    });

    });

});

///////////////////////////////////////////////////////////////////////
router.get('/rating_grade', function(req, res, next){
    var uid = req.session.uid;
    var qid = req.query.qid;
    var pid = req.session.pid;
    var clientgrade = req.query.clientgrade;

    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
      })

    connection.connect();

          if(clientgrade < 1 || clientgrade > 5){
            // not available;
            var string = encodeURIComponent('grade should be 1~5');
            connection.end();
            res.redirect('/freelancerquest?valid=' + string);
          }
          else {
            var query3 = `UPDATE quest_finished SET clientgrade = '${clientgrade}' WHERE qid='${qid}'`;
            connection.query(query3, (err, rows3, field3) => {
              if (err){
                  throw err
              }
              var query4 = `DELETE FROM quest_participant WHERE qid='${qid}' AND pid='${pid}'`;
              connection.query(query4, (err, rows4, field4) => {
                if (err){
                    throw err
                }
                var query5 = `SELECT participantgrade FROM quest_finished WHERE qid='${qid}'`;
                connection.query(query5, (err, rows5, field4) => {
                  if (err){
                      throw err
                  }
                var query6 = `INSERT INTO portfolio_internal VALUES ('${uid}', '${pid}', '${qid}', ${rows5[0].participantgrade})`
                connection.query(query6, (err, rows6, field6) => {
                if (err){
                    throw err
                }
                var query7 = `SELECT grade FROM portfolio_internal WHERE uid = '${uid}'`
                connection.query(query7, (err, rows7, field7) => {
                if (err){
                    throw err
                }
                var grade = 0

                for (var i = 0;i < rows7.length;i++){
                  console.log(Number(rows7[i].grade))
                  grade += Number(rows7[i].grade)
                  }
                grade /= rows7.length
                console.log(grade)

                var query9 = `SELECT uid FROM quest WHERE qid = '${qid}'`
                connection.query(query9, (err, rows9, field9) => {
                if (err){
                    throw err
                }

                var client = rows9[0].uid

                var query10 = `SELECT B.clientgrade FROM (SELECT * FROM quest WHERE uid = '${client}') AS A, (SELECT * FROM quest_finished WHERE clientgrade <> '0') AS B WHERE A.qid = B.qid`
                connection.query(query10, (err, rows10, field10) => {
                if (err){
                    throw err
                }

                var clientgrade = 0

                for (var i = 0;i < rows10.length;i++){
                  console.log(Number(rows10[i].clientgrade))
                  clientgrade += Number(rows10[i].clientgrade)
                  }
                clientgrade /= rows10.length
                console.log(grade)

                var query11 = `UPDATE client SET grade = '${clientgrade}' WHERE uid ='${client}'`
                connection.query(query11, (err, rows11, field11) => {
                if (err){
                    throw err
                }

                var query8 = `UPDATE freelancer SET grade = '${grade}' WHERE uid='${uid}'`
                connection.query(query8, (err, rows8, field8) => {
                if (err){
                    throw err
                }
              connection.end();
              res.redirect('/freelancerquest');
            });
          });
        });
      });

    });
  });
});

          });
        });
          }


});

///////////////////////////////////////////////////////////////////////

router.get('/quest_information/:qid', function(req, res, next){
    var qid = req.params.qid;

    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'supercrack1',
        port : 3306,
        database : 'supercrack'
      })

    connection.connect();


    var query = `SELECT * FROM quest WHERE qid='${qid}' `;

    connection.query(query, (err, rows, field) =>{
      if(err){
        throw err
      }else {
          var q2 = `SELECT * FROM quest_document WHERE qid='${qid}'`
          connection.query(q2, (err, rows2, fields2) => {
              if (err){
                  throw err
              } else {
                var q3 = `SELECT * FROM client WHERE uid='${rows[0].uid}'`
                connection.query(q3, (err, rows3, fields3) => {
                  console.log(rows3[0].grade)
                    if (err){
                        throw err
                    } else {
                    connection.end();
                  res.render('freelancerquestinfo_pg', {quest : rows[0], questdocument : rows2, clientgrade : rows3[0].grade})
              }
          })
      }


    });
  }
});
    });

  router.get('/quest_approval', (req, res, next) => {
      var qid = req.query.qid
      var resultreport = req.query.resultreport
      var pid = req.session.pid
      console.log(qid)
      var connection = sql.createConnection({
          host : 'localhost',
          user : 'root',
          password : 'supercrack1',
          port : 3306,
          database : 'supercrack'
      })
      connection.connect()
            var q2 = `UPDATE quest_approval SET reject = null, resultreport = '${resultreport}' WHERE qid = '${qid}'`
            connection.query(q2, (err, rows, fields) => {
                if (err){
                    throw err
                } else {
                    res.redirect('/freelancerquest')
                }
            })
  })

  router.get('/download_quest', (req, res, next) => {
      var file = __dirname + '/../uploads/' + req.query.filename
      res.download(file)
  })


module.exports = router;
