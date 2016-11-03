var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var route_receive = require('./routes/receive');
var route_homepage = require('./routes/homepage');
var route_api = require('./routes/api');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',
  resave: true,
  name: 'trace_jinrong_58',
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




app.use('/api', route_api);
app.use('/', route_receive);
app.use('/', route_homepage);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/homepage');
  return;
  var err = new Error('Request Path Not Found');
  err.status = 404; // 不设置200的话就被58改成302到404.58.com了
  next(err);
});


// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.stack);

    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





/**
 * 2016-10-31
 * 增加子进程
 */
var child_process = require('child_process');
global.child_computer = child_process.fork('./bin/child_computer.js');
global.child_computer_2 = child_process.fork('./bin/child_computer.js');

module.exports = app;