var express = require('express');
var fs = require('fs');
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




function goHome(res) {
	res.render('home', {});
}




module.exports = router;