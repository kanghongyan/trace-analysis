var express = require('express');
var fs = require('fs');
var getData = require('../getData');
var isLogin = require('../dep/login');
var userInfo = require('../config/userConfig');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
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
router.get('/saveTime', function(req, res, next) {
	var data = '';
	//http://10.252.57.93:3000?project=test&page=/demo/fileUpLoadTest&headTime=5828&docTime=5828&jsTime=22081&winTime=33951

	data += 'page=' + decodeURIComponent(req.query.page) + '|headTime=' + req.query.headTime + '|docTime=' + req.query.docTime + '|jsTime=' + req.query.jsTime + '|winTime=' + req.query.winTime + '|headSize=' + req.query.headSize + '|docSize=' + req.query.docSize;
	var d = new Date();
	var year = d.getFullYear();
	var month = (d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + parseInt(d.getMonth() + 1);
	var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
	console.log(req.query['project']);
	if (fs.existsSync('data/' + req.query['project'])) {
		write();
	} else {
		fs.mkdirSync('data/' + req.query['project']);
		write();
	}

	function write() {
		fs.appendFile('data/' + req.query['project'] + '/' + year + '-' + month + '-' + day + '.txt', data + '\r\n', 'utf8', function() {});
	}
	res.send('');
})
router.get('/trace', function(req, res, next) {
	saveData(req, res, 'traceData');
})
router.get('/info', function(req, res, next) {
	saveData(req, res, 'infoData');
})
router.get('/spec', function(req, res, next) {
    saveData(req, res, 'specData');
})





function saveData(req, res, name) {
	var project = req.query.project;
	var data = '';
	for (var i in req.query) {
		if (i != 'project') {
			data += i + '=' + decodeURIComponent(req.query[i]) + '|';
		}
	};

	var ip = getClientIp(req);
	if (filterIp(ip)) {
		if (name == 'infoData') {
			data += 'ip=' + ip + '|';
		}
	} else {
		res.send('');
		return;
	}
	data = data.replace(/(\|)$/, '');
	var d = new Date();
	var year = d.getFullYear();
	var month = (d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + parseInt(d.getMonth() + 1);
	var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
	if (fs.existsSync(name + '/' + project)) {
		write();
	} else {
		fs.mkdirSync(name + '/' + project);
		write();
	}

	function write() {
		fs.appendFile(name + '/' + project + '/' + year + '-' + month + '-' + day + '.txt', data + '\r\n', 'utf8', function() {});
	}
	res.send('');
}

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

function filterIp(ip) {
	/*过滤
			36.110.51.97-110
			36.110.35.77-78
			223.72.148.161-162
			123.125.250.164-174
		*/
	if (/^36\.110\.51\.(\d+)/.test(ip)) {
		if (RegExp.$1 >= 97 && RegExp.$1 <= 110) {
			return '';
		}
	} else if (/36\.110\.35\.(\d+)/.test(ip)) {
		if (RegExp.$1 >= 77 && RegExp.$1 <= 78) {
			return '';
		}
	} else if (/223\.72\.148\.(\d+)/.test(ip)) {
		if (RegExp.$1 >= 161 && RegExp.$1 <= 162) {
			return '';
		}
	} else if (/123\.125\.250\.(\d+)/.test(ip)) {
		if (RegExp.$1 >= 164 && RegExp.$1 <= 174) {
			return '';
		}
	} else if (ip == '127.0.0.1') {
		return '';
	}
	return ip;
}

function getClientIp(req) {
	var ipAddress;
	var forwardedIpsStr = req.header('x-forwarded-for');
	if (forwardedIpsStr) {
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
	}
	ipAddress = ipAddress.match(/((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/);
	return ipAddress[0];
};
module.exports = router;