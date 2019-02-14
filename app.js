var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var sql = require('mysql');


var resultRouter = require('./routes/result');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var adminRouter = require('./routes/admin');

var freelancerRouter = require('./routes/freelancer');
var freelancerquestRouter = require('./routes/freelancerquest');
var freelancermodifyRouter = require('./routes/freelancermodify');
var teammakeRouter = require('./routes/teammake');
var teammanageRouter = require('./routes/teammanage');


// client colloection
var quest_applyRouter = require('./routes/quest_apply');
var quest_listRouter = require('./routes/quest_list');

var app = express();
app.locals.moment = require('moment');

function getMySQLConnection() {
	return sql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'supercrack1',
    port : 3306,
    database : 'supercrack'
	});
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'kaily',
  resave: false,
  saveUninitialized: true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/result', resultRouter);
app.use('/admin', adminRouter);
app.use('/signup_freelancer_pg', (req, res) => {
  res.render('signup_freelancer_pg')
});
app.use('/signup_client_pg', (req, res) => {
  res.render('signup_client_pg')
});

app.use('/signup', signupRouter);
app.use('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err){
      throw err;
    }
  })
  res.redirect('/')
});

// client part
app.use('/go_client', (req, res) => {
    res.render('client');
});

app.use('/go_quest_apply', (req, res) => {
    res.render('quest_apply');
});

app.use('/go_quest_list', (req, res) => {
    res.render('quest_list');
});

app.use('/quest_apply', quest_applyRouter);
app.use('/quest_list',quest_listRouter);




// freelancer part
app.use('/freelancer', (req, res) => {
  if (req.session.auth=true){
    res.render('freelancer', {name: req.session.name})
  } else{
    res.render('no')
  }
});
app.use('/freelancermodify', freelancermodifyRouter)

app.use('/freelancermodify_pg', (req, res) => {

					var connection = sql.createConnection({
							host : 'localhost',
							user : 'root',
							password : 'supercrack1',
							port : 3306,
							database : 'supercrack'
					})
					connection.connect()
					var q1 = `SELECT * FROM freelancer WHERE uid='${req.session.uid}'`
					var q2 = `SELECT * FROM portfolio_external WHERE uid='${req.session.uid}'`
					var q3 = `SELECT * FROM QUEST AS Q, (SELECT A.qid, A.resultreport, B.participantgrade FROM (SELECT * FROM quest_approval WHERE pid = '${req.session.pid}' AND accepting = 1) AS A, quest_finished AS B WHERE A.qid = B.qid) AS C WHERE Q.qid = C.qid`
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
																	res.render('freelancermodify_pg', {freelancer: freelancer, pe: pe, pi: pi, uid: req.session.uid})
																	connection.end()
															}
													})
											}
									})
							}
					})

	})



app.use('/freelancerquest',freelancerquestRouter)

app.use('/teammake', teammakeRouter)
app.use('/teammanage', teammanageRouter)


app.use('/team_pg', (req, res) => {

	var connection = sql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'supercrack1',
			port : 3306,
			database : 'supercrack'
	})
	connection.connect()

	var q1 = `SELECT * FROM team WHERE leader = '${req.session.uid}'`
	connection.query(q1, (err, rows, fields) => {
			if (err){
					throw err
			} else {

  if (rows.length < 1){
    res.render('teammake_pg', {name: req.session.name})
  } else{
			res.render('teamlist_pg', {uid: req.session.uid, teamlist: rows})
  }
}
});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
