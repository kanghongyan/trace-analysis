var schedule = require('node-schedule');
var Promise = require("bluebird");
var moment = require('moment');
var fs = require('fs');
var _util_fs_async = require('../backend/_util_fs_async');
var _ = require('lodash');
var request = require('request');
var path = require('path');


var fileName = moment().add(-1, 'day').format('YYYY-MM-DD');
var ipChunk = [];
var gap = 2;

_util_fs_async('infoData', 'chedai-cfq-m', fileName, fileName )
    .then(function(results){
        
        if (results.length === 1 && results[0].data) {
            
            ipChunk = _
                .chain(_.trim(results[0].data).split('\r\n'))
                .map(function(item){
                    return get_key(item, 'page')
                })
                .map(function(s){
                    return get_url_param_key(s, 'ip').replace(/(\d+\.\d+\.\d+\.)\d+/,'$10')
                })
                .uniq()
                .filter(function (n) {
                    return n !== '无参数'
                })
                .chunk(gap)
                .value();
    
    
            // 每秒触发
            var j = schedule.scheduleJob('* * * * * *', function () {
        
                if (ipChunk.length !== 0) {
                    getIps(ipChunk.shift());
                } else {
                    j.cancel();
                }
        
            });
            
        }
        
    });


function getIps(ips, failedIps) {
    var pending = [];
    
    ips.forEach(function (ip) {
        pending.push(getCityByIp(ip))
    });
    
    Promise.all(pending)
        .then(function (ret) {
            saveToFile(ret.join(''));
        })
    
}

function get_url_param_key(s, key) {
    var reg = new RegExp('(&|\\?)' + key + '\=([^#&]*)'),
        arr = s.match(reg);
    return (arr && arr[2]) ? arr[2] : '无参数';
}

function get_key(s, key) {
    var reg = new RegExp('(^|\|)' + key + '\=([^|]*)'),
        arr = s.match(reg);
    return (arr && arr[2]) ? arr[2] : null;
}

function getCityByIp(ip) {
    
    return new Promise(function (resolve, reject) {
    
        request({
            url: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip,
            // gzip: true
        }, function (error, response, body) {
        
            var ret;
            try {
                ret = JSON.parse(body);
            
            } catch (e) {
                ret = { code: -1 }
            } finally {}
        
            if (ret.code === 0 && ret.data && ret.data.region && ret.data.city) {
                resolve(ip + '|' + ret.data.region + '|' + ret.data.city + '\r\n')
            }
        
        });
        
    })
    
    
}

function saveToFile(data) {
    
    var fileFolder = 'config';
    var fileName = 'ip_map.txt';
    var filePath = path.join(fileFolder, fileName);
    
    fs.exists(fileFolder, function(exists){
        if (exists) {
            fs.appendFile(filePath, data, 'utf8', function() {});
        } else {
            fs.mkdir(fileFolder, function(){
                fs.appendFile(filePath, data, 'utf8', function() {});
            });
        }
    });
}