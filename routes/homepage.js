var express = require('express');
var fs = require('fs');
var isLogin = require('../dep/login');
var userInfo = require('../config/userConfig');

var router = express.Router();


router.get('/', function(req, res, next) {
    if (req.xhr) {
      res.status(404).send({ error: 'Dont use xhr request' });
    }
    res.redirect('/homepage');
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


router.get('/homepage', function(req, res, next) {
    res.render('homepage', {});
})



module.exports = router;