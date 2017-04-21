var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var _ = require('lodash');

var userInfo = require('../config/userConfig');
var _util = require('../backend/_util');
// var _util = require( path.join(__dirname, '..', 'backend', '_util') );

var TYPE_MAP = {
    'info': 'infoData',
    'trace': 'traceData',
    'spec': 'specData'
};

var ALL_PROJECTS = userInfo.superUser.project;

/*
router.get('/trace', function(req, res, next) {
    res.send('');
    saveData(req, res, 'traceData');
})
router.get('/info', function(req, res, next) {
    res.send('');
    saveData(req, res, 'infoData');
})
router.get('/spec', function(req, res, next) {
    res.send('');
    saveData(req, res, 'specData');
})
*/

// router.get('/:type?', function(req, res, next) {
//     var type = TYPE_MAP[req.params.type];
//     if (type) {
//         saveData(req, res, type);
//         res.send('');
//     } else {
//         next();
//     }
// })


router.route('/:type?')
    .get(getHandler)
    .post(postHandler)

function getHandler(req, res, next) {
    var type = TYPE_MAP[req.params.type];
    if (type) {
        var r = saveData(req, res, type);
        res.send(r);
    } else {
        next();
    }
}

function postHandler(req, res, next) {
    var type = TYPE_MAP[req.params.type];
    if (type) {
        var r = saveData(req, res, type);
        res.status(204).end(r);
    } else {
        next();
    }
}



function saveData(req, res, categoryName) {
    var ip = getClientIp(req);
    
    if (!filterIp(ip)) {
        return 'ip blacklist';
    }
    
    var projName = req.query.project,
        fileName = _util.stringifyDate() + '.txt',
        full_path = path.join( categoryName, projName ),
        full_file = path.join( categoryName, projName, fileName );
    
    if (ALL_PROJECTS.indexOf(projName)==-1) {
        return 'project blacklist';
    }
    
    var data = _
        .chain(req.query)
        .omit('project')
        .assign({'ip': ip})
        .map(function(v,k){
            return decodeURIComponent(k) + '=' + decodeURIComponent(v);
        })
        .value()
        .join('|');
    
    
    
    
    fs.exists(full_path, function(exists){
        if (exists) {
            append()
        } else {
            fs.mkdir(full_path, function(){
                append()
            });
        }
    });
    
    function append() {
        fs.appendFile(full_file, data + '\r\n', 'utf8', function() {});
    }
    
    return '';
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
    } else if (/^36\.110\.35\.(\d+)/.test(ip)) {
        if (RegExp.$1 >= 77 && RegExp.$1 <= 78) {
            return '';
        }
    } else if (/^223\.72\.148\.(\d+)/.test(ip)) {
        if (RegExp.$1 >= 161 && RegExp.$1 <= 162) {
            return '';
        }
    } else if (/^123\.125\.250\.(\d+)/.test(ip)) {
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