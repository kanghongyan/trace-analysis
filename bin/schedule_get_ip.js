var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Promise = require("bluebird");
var schedule = require('node-schedule');
var moment = require('moment');
var request = require('request');

var _util_fs_async = require('../backend/_util_fs_async');



// 每日凌晨1点触发
var dailySchedule = schedule.scheduleJob('0 0 1 * * *', function() {
    
    readTrace().then(process)
});



/**
 * 读取日志数据
 */
function readTrace() {
    
    
    return new Promise(function(resolve, reject){
        
        /* 每天的日期文件名 */
        var fileName = moment().add(-1, 'day').format('YYYY-MM-DD');
        
        // read
        _util_fs_async('infoData', 'chedai-cfq-m', fileName, fileName ).then(function(results){
            
            
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
            
            
            if (results.length === 1 && results[0].data) {
                
                var ipArr = _
                    .chain(_.trim(results[0].data).split('\r\n'))
                    .map(function(item){
                        return get_key(item, 'page')
                    })
                    .compact()
                    .map(function(s){
                        return get_url_param_key(s, 'ip')
                    })
                    .compact()
                    .filter(function(s){
                        return s.split('.').length === 4
                    })
                    .map(function(s){
                        return s.replace(/(.*\.)(\d+)$/,'$10')
                    })
                    .compact()
                    .uniq()
                    .value();
        
                
                resolve(ipArr);
            }
                
        });
        // end of _util_fs_async
        
    });
    // end of new promise
}




function process(ipArr) {
    
    // 5次
    var ipChunk = _.chunk(ipArr, 5);
    
    // 每秒
    var reqJob = schedule.scheduleJob('* * * * * *', function () {
        
        if (ipChunk.length > 0) {
            main(ipChunk.shift());
        } else {
            reqJob.cancel();
        }

    });
    
    
    /*
     * 主逻辑
     */
    function main(ips, failedIps) {
        
        var reqs = ips.map(function(ip) {
            return getCityByIp(ip)
        })
        
        Promise
            .all(reqs)
            .then(function (ret) {
                saveToFile(ret.join(''));
            })
    }
    
    
    /*
     * 单次请求
     */
    function getCityByIp(ip) {
        
        return new Promise(function (resolve, reject) {
        
            request({
                url: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip
            }, function (error, response, body) {
                try {
                    var ret = JSON.parse(body);
                    
                    if (ret.code === 0 && ret.data && ret.data.region && ret.data.city) {
                        resolve(ip + '|' + ret.data.region + '|' + ret.data.city + '\r\n')
                    }
                
                } catch (e) {
                    resolve('')
                }
            });
            
        })
        
    }
    
    
    /*
     * 保存
     */
    function saveToFile(data) {
        
        var fileFolder = 'config';
        var fileName = 'ip_map.txt';
        var filePath = path.join(fileFolder, fileName);
        
        fs.appendFile(filePath, data, 'utf8', function() {});
    }
    

}




