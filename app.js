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


//2017-4-21 jiajianrong disable默认打印到服务台
//app.use(logger('dev'));
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
 * 
 * 2017-07-17
 * 限制子进程个数
 * 增加内存
 * 
 * jiajianrong@58.com
 */
var child_process = require('child_process');

global.CP_COMPUTE_FACTORY = [ /*child_process.fork('./bin/child_computer.js'),
                              child_process.fork('./bin/child_computer.js'),*/
                              child_process.fork('./bin/child_computer.js', {execArgv: ['--max-old-space-size=4096'/*, '--debug-brk'*/]} ) ];

global.CP_COMPUTE_SPEC_FACTORY = [ /*child_process.fork('./bin/child_computer_spec.js'),*/
                                   child_process.fork('./bin/child_computer_spec.js') ];

/**
 * 2017-7-1
 * 增加独立进程将ip翻译成city
 */
child_process.fork('./bin/child_process_ip2city.js').disconnect();

module.exports = app;