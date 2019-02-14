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

var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    var uid = req.session.uid;


    var query = `SELECT qid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate, min_career, min_freenum, max_freenum, DATE_FORMAT(pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(pfinishdate, '%Y-%m-%d') AS pfinishdate FROM supercrack.quest WHERE uid='${uid}' ORDER BY pstartdate`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var first_table = rows;

        var query2 = `SELECT quest.qid, quest.qname, quest.qcost, DATE_FORMAT(quest.dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(quest.dfinishdate, '%Y-%m-%d') AS dfinishdate, quest.min_career, quest.min_freenum, quest.max_freenum, DATE_FORMAT(quest.pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(quest.pfinishdate, '%Y-%m-%d') AS pfinishdate, quest_approval.pid, participant.usertype, quest_approval.accepting FROM (quest RIGHT JOIN quest_approval ON quest.qid = quest_approval.qid) RIGHT JOIN participant ON quest_approval.pid = participant.pid WHERE uid='${uid}' ORDER BY pstartdate`;
        //usertype을 통해 3이면 팀, 1이면 프리랜서

        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2;


            // `SELECT tname, pid FROM team WHERE team.pid='${uid}' `
            var query3 = `SELECT tname, pid FROM team`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT name, pid FROM freelancer`;

                connection.query(query4, (err, rows4, field4) => {

                    if (err){
                        throw err
                    }

                    var freelancer_table = rows4;

                    var query5 = 'SELECT qid, pid, accepting FROM quest_approval';

                    connection.query(query5, (err, rows5, field5) => {

                    var check_status = rows5;

                    for(var a = 0; a < first_table.length; a++){
                        for(var b = 0; b < check_status.length; b++){
                            if(first_table[a].qid == check_status[b].qid){
                                if(check_status[b].accepting == 1)
                                {
                                    first_table[a].status = '진행완료';
                                    break;
                                }
                                else{
                                    first_table[a].status = '진행중';
                                    break;
                                }
                            }
                            else{
                                first_table[a].status = '미정';
                            }
                        }

                    }

                    for(var i = 0 ; i < ongoing_table.length; i++){
                        if (ongoing_table[i].usertype == '3')
                            {
                                for(var j = 0 ; j < team_table.length ; j++){
                                    if(ongoing_table[i].pid == team_table[j].pid)
                                        {
                                            ongoing_table[i].manager = team_table[j].tname;
                                        }
                                }
                            }
                        else{
                                for(var k = 0 ; k < freelancer_table.length ; k++){
                                    if(ongoing_table[i].pid == freelancer_table[k].pid)
                                        {
                                            ongoing_table[i].manager = freelancer_table[k].name;
                                        }
                                }
                        }
                    }
                    connection.end();
                    res.render('quest_list', {missions: first_table, missions2: ongoing_table});

                });

                });

            });

        });


    });

    });


router.get('/quest_cost', function(req, res, next) {

var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    var uid = req.session.uid;

    var query = `SELECT qid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate, min_career, min_freenum, max_freenum, DATE_FORMAT(pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(pfinishdate, '%Y-%m-%d') AS pfinishdate FROM supercrack.quest WHERE uid='${uid}' ORDER BY qcost`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var first_table = rows;

        var query2 = `SELECT quest.qid, quest.qname, quest.qcost, DATE_FORMAT(quest.dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(quest.dfinishdate, '%Y-%m-%d') AS dfinishdate, quest.min_career, quest.min_freenum, quest.max_freenum, DATE_FORMAT(quest.pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(quest.pfinishdate, '%Y-%m-%d') AS pfinishdate, quest_approval.pid, participant.usertype, quest_approval.accepting FROM (quest RIGHT JOIN quest_approval ON quest.qid = quest_approval.qid) RIGHT JOIN participant ON quest_approval.pid = participant.pid WHERE uid='${uid}' ORDER BY qcost`;
        //usertype을 통해 3이면 팀, 1이면 프리랜서

        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2;


            // `SELECT tname, pid FROM team WHERE team.pid='${uid}' `
            var query3 = `SELECT tname, pid FROM team`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT name, pid FROM freelancer`;

                connection.query(query4, (err, rows4, field4) => {

                    if (err){
                        throw err
                    }

                    var freelancer_table = rows4;

                    var query5 = 'SELECT qid, pid, accepting FROM quest_approval';

                    connection.query(query5, (err, rows5, field5) => {

                    var check_status = rows5;

                    for(var a = 0; a < first_table.length; a++){
                        for(var b = 0; b < check_status.length; b++){
                            if(first_table[a].qid == check_status[b].qid){
                                if(check_status[b].accepting == 1)
                                {
                                    first_table[a].status = '진행완료';
                                    break;
                                }
                                else{
                                    first_table[a].status = '진행중';
                                    break;
                                }
                            }
                            else{
                                first_table[a].status = '미정';
                            }
                        }

                    }

                    for(var i = 0 ; i < ongoing_table.length; i++){
                        if (ongoing_table[i].usertype == '3')
                            {
                                for(var j = 0 ; j < team_table.length ; j++){
                                    if(ongoing_table[i].pid == team_table[j].pid)
                                        {
                                            ongoing_table[i].manager = team_table[j].tname;
                                        }
                                }
                            }
                        else{
                                for(var k = 0 ; k < freelancer_table.length ; k++){
                                    if(ongoing_table[i].pid == freelancer_table[k].pid)
                                        {
                                            ongoing_table[i].manager = freelancer_table[k].name;
                                        }
                                }
                        }
                    }
                    connection.end();
                    res.render('quest_list', {missions: first_table, missions2: ongoing_table});

                });

                });

            });

        });


    });

    });


router.get('/quest_start_cost', function(req, res, next) {



var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    var uid = req.session.uid;

    var query = `SELECT qid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate, min_career, min_freenum, max_freenum, DATE_FORMAT(pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(pfinishdate, '%Y-%m-%d') AS pfinishdate FROM supercrack.quest WHERE uid='${uid}' ORDER BY pstartdate, qcost`;
    connection.query(query, (err, rows, fields) =>{

        if (err){
            throw err
            }

        var first_table = rows;

        var query2 = `SELECT quest.qid, quest.qname, quest.qcost, DATE_FORMAT(quest.dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(quest.dfinishdate, '%Y-%m-%d') AS dfinishdate, quest.min_career, quest.min_freenum, quest.max_freenum, DATE_FORMAT(quest.pstartdate, '%Y-%m-%d') AS pstartdate, DATE_FORMAT(quest.pfinishdate, '%Y-%m-%d') AS pfinishdate, quest_approval.pid, participant.usertype, quest_approval.accepting FROM (quest RIGHT JOIN quest_approval ON quest.qid = quest_approval.qid) RIGHT JOIN participant ON quest_approval.pid = participant.pid WHERE uid='${uid}' ORDER BY pstartdate, qcost`;
        //usertype을 통해 3이면 팀, 1이면 프리랜서

        connection.query(query2, (err, rows2, field2) =>{

            if (err){
                throw err
            }

            var ongoing_table = rows2;


            // `SELECT tname, pid FROM team WHERE team.pid='${uid}' `
            var query3 = `SELECT tname, pid FROM team`;

            connection.query(query3, (err, rows3, field3) =>{

                if (err){
                    throw err
                }

                var team_table = rows3;


                var query4 = `SELECT name, pid FROM freelancer`;

                connection.query(query4, (err, rows4, field4) => {

                    if (err){
                        throw err
                    }

                    var freelancer_table = rows4;

                    var query5 = 'SELECT qid, pid, accepting FROM quest_approval';

                    connection.query(query5, (err, rows5, field5) => {

                    var check_status = rows5;

                    for(var a = 0; a < first_table.length; a++){
                        for(var b = 0; b < check_status.length; b++){
                            if(first_table[a].qid == check_status[b].qid){
                                if(check_status[b].accepting == 1)
                                {
                                    first_table[a].status = '진행완료';
                                    break;
                                }
                                else{
                                    first_table[a].status = '진행중';
                                    break;
                                }
                            }
                            else{
                                first_table[a].status = '미정';
                            }
                        }

                    }

                    for(var i = 0 ; i < ongoing_table.length; i++){
                        if (ongoing_table[i].usertype == '3')
                            {
                                for(var j = 0 ; j < team_table.length ; j++){
                                    if(ongoing_table[i].pid == team_table[j].pid)
                                        {
                                            ongoing_table[i].manager = team_table[j].tname;
                                        }
                                }
                            }
                        else{
                                for(var k = 0 ; k < freelancer_table.length ; k++){
                                    if(ongoing_table[i].pid == freelancer_table[k].pid)
                                        {
                                            ongoing_table[i].manager = freelancer_table[k].name;
                                        }
                                }
                        }
                    }
                    connection.end();
                    res.render('quest_list', {missions: first_table, missions2: ongoing_table});

                });

                });

            });

        });


    });


    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/show_participant/:qid', function(req, res, next){

    var qid = req.params.qid;

    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    var query = `SELECT pid FROM quest_participant WHERE quest_participant.qid='${qid}' `;

    connection.query(query, (err, rows, field) => {


        var participants = rows; // 의뢰 참여 지원자들 pid
        var participant_pid ;
        var participants_number = participants.length;

        if(participants_number >0){
        var query2 = 'SELECT tname, leader FROM team WHERE ';

        for(var i = 0; i < participants.length ; i++){
            if(i != (participants.length - 1)){
                participant_pid = participants[i].pid;
                query2 += `pid='${participant_pid}' OR `;
            }else{
                participant_pid = participants[i].pid;
                query2 += `pid='${participant_pid}' `;
            }
        }

        connection.query(query2, (err, rows2, field2) => {

            var participant_teams = rows2;
            var team ;
            var participant_teams_number = participant_teams.length;

            var query3 = 'SELECT tname, uid FROM team_member WHERE ';

            if (participant_teams_number > 0){

            for(var j = 0; j < participant_teams.length; j++){
                if(j != (participant_teams.length - 1)){
                    team = participant_teams[j].tname;
                    query3 += `tname='${team}' OR `;
                }else{
                    team = participant_teams[j].tname;
                    query3 += `tname='${team}' `;
                }
            }

            connection.query(query3, (err, rows3, field3) =>{
                var participant_people = rows3;
                var person ;
                var query4 = 'SELECT * FROM freelancer WHERE ';
                var checking = participants_number - participant_teams_number;

                for(var a = 0; a < participant_people.length; a++ ){
                    if(a != (participant_people.length - 1)){
                        person = participant_people[a].uid;
                        query4 += `uid='${person}' OR `;
                       }else{
                        person = participant_people[a].uid;
                        if(checking != 0){
                           query4 += `uid='${person}' OR `;
                        }else{
                           query4 += `uid='${person}' `;
                            }
                       }

                }

                if(checking != 0){
                var surplus_participants = rows; // 의뢰 참여 지원자들 pid
                for(var b = 0; b < surplus_participants.length; b++ ){
                        if(b != (surplus_participants.length - 1)){
                            person = surplus_participants[b].pid;
                            query4 += `pid='${person}' OR `;
                        }else{
                            person = surplus_participants[b].pid;
                            query4 += `pid='${person}' `;
                        }
                    }
                }

                connection.query(query4, (err, rows4, field4) => {
                    var quest_workers = rows4; // team, 개인구분

                    for(var check1 = 0; check1 < quest_workers.length; check1++){
                        for(var check2 = 0; check2 < participant_people.length; check2++){
                            if(quest_workers[check1].uid == participant_people[check2].uid){
                                    quest_workers[check1].t_info = participant_people[check2].tname;
                                    break;
                               }else{
                                   quest_workers[check1].t_info = 'freelancer';
                               }
                        }
                    }

                    for(var check3 = 0; check3 < quest_workers.length; check3++){
                        for(var check4 = 0; check4 <  participant_teams.length; check4++ ){
                            if((quest_workers[check3].uid == participant_teams[check4].leader) || (quest_workers[check3].t_info == 'freelancer')){
                                quest_workers[check3].leading = 'yes';
                                break;
                            }else{
                                quest_workers[check3].leading = 'no';
                            }
                        }
                    }

                    var message = 'have';
                    connection.end();
                    res.render('check_participant', {people: quest_workers, message: message, qid: qid});
                });

            });

            }else{//모두 개인 지원자들인 경우
                    query3 = 'SELECT * FROM freelancer WHERE ';
                    var free_pid ;
                    for(var w = 0; w < participants.length; w++ ){
                        if(w != (participants.length - 1)){
                            free_pid = participants[w].pid;
                            query3 += `pid='${free_pid}' OR `;
                           }else{
                            free_pid = participants[w].pid;
                            query3 += `pid='${free_pid}'`;
                           }
                        }

                    connection.query(query3, (err, rows3, f) => {

                        var quest_workers = rows3;

                        for(var i=0; i < quest_workers.length; i++){
                            quest_workers[i].t_info = 'freelancer';
                            quest_workers[i].leading = 'yes';
                        }

                        var message = 'have';
                        connection.end();
                        res.render('check_participant', {people: quest_workers, message: message, qid: qid}); // 개인 참여자들로 구성된 값들 반환
                    });

                }
        });


    }else{
        var message = 'not';
        var quest_workers= [];
        connection.end();
        res.render('check_participant', {people: quest_workers, message: message, qid: qid});// 의뢰에 참여자가 없는 경우 대처
    }

    });

});

///////////////////////////////////////////////////////////////////////

router.get('/get_portfolio/:uid', function(req, res, next){
    var uid = req.params.uid;

    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();


    var query = `SELECT * FROM portfolio_internal WHERE uid='${uid}' `;

    connection.query(query, (err, rows, field) =>{
        // uid, pid, qid, grade

        if(rows.length != 0){
        var internal1 = rows;
        console.log('haha');
        var query2 = `SELECT * FROM portfolio_external WHERE uid='${uid}'`;

        connection.query(query2, (err, rows2, field2) => {
            if(rows2.length != 0){
                console.log('haha2');
                var external = rows2 ;
                var free_number ;
                var query3 = `SELECT qid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate FROM quest WHERE `;

                for (var i = 0; i < internal1.length; i++){
                    if(i != (internal1.length - 1)){
                        free_number = internal1[i].qid;
                        query3 += `qid='${free_number}' OR `;
                        }else{
                        free_number = internal1[i].qid;
                        query3 += `qid='${free_number}' `;
                        }
                    }

                connection.query(query3, (err, rows3, field3) => {
                    var internal2 = rows3;

                    for(var a = 0; a < internal2.length; a++){
                        for(var b =0; b < internal1.length; b++){
                            if(internal2[a].qid == internal1[b].qid){
                                internal2[a].grade = internal1[b].grade ;
                            }
                        }
                    }

                    connection.end();
                    res.render('show_portfolio', {external: external , internal: internal2});
                });
            }else{
                var free_number ;
                var query3 = `SELECT qid, qname, qcost, DATE_FORMAT(dstartdate, '%Y-%m-%d') AS dstartdate, DATE_FORMAT(dfinishdate, '%Y-%m-%d') AS dfinishdate FROM quest WHERE `;

                for (var i = 0; i < internal1.length; i++){
                    if(i != (internal1.length - 1)){
                        free_number = internal1[i].qid;
                        query3 += `qid='${free_number}' OR `;
                        }else{
                        free_number = internal1[i].qid;
                        query3 += `qid='${free_number}' `;
                        }
                    }

                    connection.query(query3, (err, rows3, field3) => {
                        var internal2 = rows3;

                        for(var a = 0; a < internal2.length; a++){
                            for(var b =0; b < internal1.length; b++){
                                if(internal2[a].qid == internal1[b].qid){
                                    internal2[a].grade = internal1[b].grade ;
                            }
                        }
                    }

                    var external;
                    console.log('haha3');
                    connection.end();
                    res.render('show_portfolio', {external: external , internal: internal2});
                });
            }
            });
        } else{
            var query2 = `SELECT * FROM portfolio_external WHERE uid='${uid}'`;

            connection.query(query2, (err, rows2, field2) =>{
                if(rows2.length != 0){
                    var external = rows2;
                    var internal;
                    console.log('haha4');
                    connection.end();
                    res.render('show_portfolio', {external: external , internal: internal});
                }
                else{
                    var external;
                    var internal;
                    console.log('haha5');
                    connection.end();
                    res.render('show_portfolio', {external: external , internal: internal});
                }
            });
        }

    });

    });




router.get('/get_external_portfolio/:filename', (req, res, next) => {

    var file = __dirname + '/../uploads/' + req.params.filename
    res.download(file)
});

////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_decline/:uid/:qid', (req, res, next) => {

  var uid = req.params.uid;
  var qid = req.params.qid;

  var connection = sql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'supercrack1',
  database : 'supercrack'
  });

  connection.connect();

  var query = `SELECT pid FROM freelancer WHERE uid='${uid}' `;

  connection.query(query, (err, rows, field) => {
      var participant_freelancer = rows[0].pid;
      var query2 = `DELETE FROM quest_participant WHERE qid='${qid}' AND pid='${participant_freelancer}'`;

          connection.query(query2, (err, rows2, field2) =>{

            if(err){
              throw err
            }
            connection.end();
            res.redirect('/quest_list');

           });
         });

});

router.get('/get_approval/:uid/:qid', (req, res, next) => {
    var uid = req.params.uid;
    var qid = req.params.qid;
    var datetime = new Date();

    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    var query = `SELECT pid FROM team WHERE leader='${uid}' `;


    connection.query(query, (err, rows, field) => {
        if(rows.length != 0){ // 선택한 의뢰 참여자가 팀인 경우
            var participant = rows[0].pid;
            var query2 = `UPDATE quest_participant SET pick = '1' WHERE qid='${qid}' AND pid='${participant}' `;

            connection.query(query2, (err, rows2, field2) =>{
                if (rows2.affectedRows != 0){ // 선택한 의뢰 참여자가 팀인 경우

                      var query3 = "INSERT INTO quest_approval(qid, pid, accepting, reject, resultreport) VALUES(?, ?, ?, ?, ?)";
                      var values = [qid, participant, '0', null, null ];

                      connection.query(query3, values, (err, rows3, field3) => {
                          var query4 = `UPDATE quest SET pstartdate = (SELECT NOW()) WHERE qid='${qid}' `;

                          connection.query(query4, (err, rows4, field4) => {
                            var query5 = `DELETE FROM quest_participant WHERE qid='${qid}' AND pid<>'${participant}'  `; // 선택된 의뢰 참여자를 제외한 나머지 참여자 전부 삭제

                              connection.query(query5, (err, rows5, field5) => {
                                  connection.end();
                              res.redirect('/quest_list');
                              });
                          });

                      });

                }
                else{ // 선택된 의뢰참여자가 팀의 리더이지만 팀으로 지원하지 않고 개인으로 지원했을 경우
                    var query3 = `SELECT pid FROM freelancer WHERE uid='${uid}' `;
                    connection.query(query3, (err, rows3, field3) => {
                       var participant_freelancer = rows3[0].pid;
                       var query4 = `UPDATE quest_participant SET pick = '1' WHERE qid='${qid}' AND pid='${participant_freelancer}'`;

                        connection.query(query4, (err, rows4, field4) => {
                          var query5 = "INSERT INTO quest_approval (qid, pid, accepting, reject, resultreport) VALUES(?, ?, ?, ?, ?)";
                          var values = [qid, participant_freelancer,'0', null, null ];


                           connection.query(query5, values, (err, rows5, field5) => {
                               var query6 = `UPDATE quest SET pstartdate = (SELECT NOW()) WHERE qid='${qid}' `;

                               connection.query(query6, (err, rows6, field6) => {
                               var query7 = `DELETE FROM quest_participant WHERE qid='${qid}' AND pid<>'${participant_freelancer}' `; // 선택된 의뢰 참여자를 제외한 나머지 참여자 전부 삭제

                                   connection.query(query7, (err, rows7, field7) => {

                                       connection.end();
                                       res.redirect('/quest_list');
                                   });



                               });

                           });
                       });

                    });
                }

            });

           }else{ // 선택한 의뢰 참여자가 팀이 아닌 경우
               var query2 = `SELECT pid FROM freelancer WHERE uid='${uid}' `;

               connection.query(query2, (err, rows2, field2) => {
                   var participant_freelancer = rows2[0].pid;
                   var query3 = `UPDATE quest_participant SET pick = '1' WHERE qid='${qid}' AND pid='${participant_freelancer}'`;

                   connection.query(query3, (err, rows3, field3) => {

                       var query4 = "INSERT INTO quest_approval (qid, pid, accepting, reject, resultreport) VALUES(?, ?, ?, ?, ?)";
                       var values = [qid, participant_freelancer,'0', null, null]; //초기 결과보고서 값은 '' 으로 설정

                        connection.query(query4, values, (err, rows4, field4) => {
                          var query5 = "INSERT INTO quest_approval (qid, pid, accepting, reject, resultreport) VALUES(?, ?, ?, ?, ?)";
                          var values = [qid, participant_freelancer,'0', null, null ];


                           connection.query(query5, values, (err, rows5, field5) => {
                               var query6 = `UPDATE quest SET pstartdate = (SELECT NOW()) WHERE qid='${qid}' `;

                               connection.query(query6, (err, rows6, field6) => {
                               var query7 = `DELETE FROM quest_participant WHERE qid='${qid}' AND pid<>'${participant_freelancer}' `; // 선택된 의뢰 참여자를 제외한 나머지 참여자 전부 삭제

                                   connection.query(query7, (err, rows7, field7) => {
                        connection.end();
                        res.redirect('/quest_list');
                       });
                   });
               });
             });
         });
     });

           }

    });

});

router.get('/show_complete_apply/:qid/:pid', function(req, res, next){
    var qid = req.params.qid;
    var pid = req.params.pid;
    var message;

    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    var query = `SELECT * FROM quest_approval WHERE qid='${qid}' AND pid='${pid}'`;

    connection.query(query, (err, rows, field) => {
        var partner = rows[0];

        var partner_pid = rows[0].pid ;
        var partner_qid = rows[0].qid ;
        var partner_resultreport = rows[0].resultreport;

        if (partner.resultreport){
            message = 'yes';
        }
        else{
            message = 'no';
        }

        console.log(partner.pid);

        connection.end();
        res.render('completed_quest', {partner_pid: partner_pid, partner_qid: partner_qid, partner_resultreport: partner_resultreport, message: message});

    });

});

//qfinish_date
router.get('/accept_complete_quest/:qid/:pid', function(req, res, next){
    var qid = req.params.qid;
    var pid = req.params.pid;

    var check = req.query.complete_accept;
    var grade = req.query.accept_grade;
    var reject_message = req.query.reject_message;

    console.log(check);
    console.log(grade);
    console.log(reject_message);

    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();

    if(check == 1){
        var query =  `UPDATE quest_approval SET accepting = '1' WHERE qid='${qid}' AND pid='${pid}' `;

        connection.query(query, (err, rows, field) => {
            var query2 = "INSERT INTO quest_finished(qid, clientgrade, participantgrade) VALUES(?, ?, ?)"; // 의뢰 완료를 승인했을 때, quest_finished 테이블에 완료 의뢰 추가
            var values = [qid,'0', grade];

            connection.query(query2, values , (err, rows2, field2) => {

                var query3 = `UPDATE quest SET pfinishdate = (SELECT NOW()) WHERE qid='${qid}' `;
                connection.query(query3, (err, rows3, field3) => {
                    connection.end();
                    res.redirect('/quest_list');
                });
            });

        });
    }
    else{
        var query =  `UPDATE quest_approval SET reject = '${reject_message}', resultreport = null WHERE qid='${qid}' AND pid='${pid}' `; // 의뢰인이 거절했을 때, 거절 메세지를 추가하고, 결과보고서를 공란으로 초기화

        connection.query(query, (err, rows, field) => {
            connection.end();
            res.redirect('/quest_list');
        });
    }

});


module.exports = router;
