const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
var sql = require('mysql');



fs.readdir('uploads', (error) => {
    if (error){
        console.error('uploads 폴더가 없어 생성!');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({ // 프로젝트 내의 uploads 폴더로 경로를 지정해 사용자가 업로드하기 원하는 의뢰문서는 uploads 폴더에 저장하는 함수
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null,'uploads/');
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
});


router.post('/', upload.array('quest_document') , function(req, res, next) { // upload.array 로 다수의 문서를 받음. upload.single을 통해서는 하나의 파일만 받음.

    var qname = req.body.qname;
    var qcost = req.body.qcost;
    var dstartdate = req.body.dstartdate;
    var dfinishdate = req.body.dfinishdate;
    var minimumcareer = req.body.minimumcareer;
    var min_freenum = req.body.min_freenum;
    var max_freenum = req.body.max_freenum;
    var uid = req.session.uid;
    var qid = uid + qname;

    var c_pro = req.body.c_pro;
    var java_pro = req.body.java_pro;
    var python_pro = req.body.python_pro;
    var nodejs_pro = req.body.nodejs_pro;
    var php_pro = req.body.php_pro;


    var connection = sql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'supercrack1',
    database : 'supercrack'
    });

    connection.connect();


    var query1 = 'INSERT INTO supercrack.quest(qid, uid, qname, qcost, dstartdate, dfinishdate, min_career, min_freenum, max_freenum, python, java, c, php, nodejs, pstartdate, pfinishdate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params1 = [qid, uid, qname, qcost, dstartdate, dfinishdate, minimumcareer, min_freenum, max_freenum, python_pro, java_pro, c_pro, php_pro, nodejs_pro, null, null];


      connection.query(query1, params1 , (err, rows, fields) => {
        if (err){
          throw err
        }


                if(req.files.length > 0){ // 파일이 있다면, 의뢰문서 테이블에 등록
                      var query3 = 'INSERT INTO supercrack.quest_document(did, qid, filename) VALUES ?';
                var params3 = [ ];

                 if(req.files){
                console.log(req.files.length);
                for (var i = 0; i < req.files.length ; i++){
                        params3.push(['0', qid, req.files[i].filename]); // 만약 경로를 테이블에 넣고 싶다면 req.files[i].path -> ex) uploads/filename(파일이름)
                    }
                 } else {
                     console.log('not uploaded');
                 }

                connection.query(query3,[params3] , (err, results) =>{
              if (err){
                throw err
              }

                    console.log('의뢰생성');
                    connection.end();
                    res.redirect('/go_client');
                });

                }
                   else{
                    console.log('의뢰생성');
                    connection.end();
                    res.redirect('/go_client');
                   }



      });
});




module.exports = router;
