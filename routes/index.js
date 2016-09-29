var express = require('express');
var fs = require('fs');
var getData = require('../getData');
var isLogin = require('../dep/login');
var userInfo = require('../config/userConfig');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express1'
	});
});
router.get('/login', function(req, res, next) {
	res.render('login', {});
})
router.post('/login', function(req, res, next) {
	
	if (userInfo[req.body.name] && req.body.password == userInfo[req.body.name].password) {
		req.session.user = req.body.name;
		res.send({
			isLogin: true,
			msg: ''
		});
	} else {
		res.send({
			isLogin: false,
			msg: '密码或用户名不正确'
		});
	}
});
router.get('/home', function(req, res, next) {
	goHome(res);
})
router.get('/test', function(req, res, next) {
	res.render('test', {});
})
router.get('/getData', function(req, res, next) {
	isLogin(req, res);
	var projectName = req.query.projectName;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var data = '';
	if (fs.existsSync('allData/' + projectName + '.txt')) {
		data = fs.readFileSync('allData/' + projectName + '.txt', {
			'encoding': 'utf8'
		});
		data = getData.getRangeData(startTime, endTime, data);
	}
	res.send(data);
})



function goHome(res) {
	var projectsList = fs.readdirSync('allData/');
	var projectsList_name = [];
	var data = '';
	var lastTime = '';
	for (var j = 0; j < projectsList.length; j++) {
		projectsList_name.push(projectsList[j].replace('.txt', ''));
	}
	res.render('home', {
		projectsList: projectsList_name
	});
}




module.exports = router;