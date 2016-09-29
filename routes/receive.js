var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var util = require( path.join(__dirname, '..', 'dep', 'util') );

var router = express.Router();

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



function saveData(req, res, name) {
    var ip = getClientIp(req);
    
    if (!filterIp(ip)) {
        //return;
    }
    
    var projectName = req.query.project;
    
    var data = _.chain(req.query)
                .omit('project')
                .assign({'ip': ip})
                .map(function(v,k){
                    return decodeURIComponent(k) + '=' + decodeURIComponent(v);
                })
                .value()
                .join('|');
    
    var d = new Date();
    var year = d.getFullYear();
    var month = (d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + parseInt(d.getMonth() + 1);
    var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
    if (fs.existsSync(name + '/' + projectName)) {
        write();
    } else {
        fs.mkdirSync(name + '/' + projectName);
        write();
    }

    function write() {
        fs.appendFile(name + '/' + projectName + '/' + year + '-' + month + '-' + day + '.txt', data + '\r\n', 'utf8', function() {});
    }
    
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