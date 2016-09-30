var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var route_receive = require('./routes/receive');
var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',
  resave: true,
  name: 'log_jinrong_58',
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, //过期时间设置(单位毫秒)
    path: '/',
    httpOnly: true,
    secure: false
  }
}));


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api', api);
app.use('/', route_receive);
app.use('/', index);



app.use(function(err,req, res, next) {
  console.log(err);
  next(err)
});


//
//app.use(function(err, req, res, next) {
//  if(!err) return next(); // you also need this line
//  console.log("error!!!");
//  console.log(err);
//  console.log("error!!!");
//  //res.send("error!!!");
//  next(); 
//});

// catch 404 and forward to error handler
//app.use(function(err, req, res, next) {
//console.log("11111111");
//res.render('error', { error: err });
//});


// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  console.log("error!!!");
//  res.render('error', {
//    message: err.message,
//    error: err
//  });
//});
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//res.status(err.status || 500);
//console.log("error!!!");
//res.render('error', {
//  message: err.message,
//  error: {}
//});
//});
//
//console.log(app.get('env'));

module.exports = app;