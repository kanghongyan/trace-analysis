var express = require('express');
var router = express.Router();
var fs = require('fs');

var Promise = require("bluebird");
var _ = require('lodash');

var userInfo = require('../config/userConfig');
var _util = require('../backend/_util');
var _util_fs_async = require('../backend/_util_fs_async');

var route_pageList = require('../backend/route_pageList');
var route_pageV = require('../backend/route_pageV');
var route_pageT = require('../backend/route_pageT');
var route_performance = require('../backend/route_performance');
var route_platform = require('../backend/route_platform');
var route_browser = require('../backend/route_browser');
var route_hourPeak = require('../backend/route_hourPeak');
var route_urlFilter = require('../backend/route_urlFilter');




router.get('/*', function(req, res, next) {
    if (!req.session.user) {
        res.send({code:-1, message:'登录过期!'});
    } else {
        next();
    }
})

/*公用--获取项目列表*/
router.get('/projectList', function(req, res, next) {
    res.send({
        code: 1,
        data: userInfo[req.session.user] ? userInfo[req.session.user].project : []
    });
})


/*公用--获取项目页面列表*/
router.get('/pageList', route_pageList)

/*打点数据统计*/
router.get('/pageT', route_pageT);

/*基本信息统计--总PV UV LV统计*/
router.get('/totalV', route_pageV);

/*基本信息统计--页面级PV UV LV统计*/
router.get('/pageV', route_pageV);

/*基本信息统计--浏览器统计*/
router.get('/browser', route_browser)

/*基本信息统计--平台统计*/
router.get('/platform', route_platform)

/*基本信息统计--页面级性能统计*/
router.get('/performance', route_performance);

/*基本信息统计--时峰值统计*/
router.get('/hourPeak', route_hourPeak);

/*特殊信息统计--URL参数过滤*/
router.get('/urlFilter', route_urlFilter);





/*特殊信息统计--导流我的贷款portal*/
router.get('/specDaoliuPortal', function(req, res, next) {
    var project = req.query.project;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    var startTime_time = getTimeByDate(startTime);
    var endTime_time = getTimeByDate(endTime);

    var dataList = [];
    if (fs.existsSync('specData/' + project)) {
        for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
            var o = getTimePathByDate(i)
            var year = o.year;
            var mouth = o.mouth;
            var day = o.day;
            var path = 'specData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
            if (!fs.existsSync(path)) {
                continue;
            }
            var originData = fs.readFileSync(path, {
                'encoding': 'utf8'
            });
            
            var data = getSpecData(originData);
            data.data1 = formatSpecData(data.data1);
            
            if (data) {
                dataList.push({
                    date: year + '-' + mouth + '-' + day,
                    data1: data.data1,
                    data2: data.data2
                });
            }
        }
    }
    
    
    if (fs.existsSync('traceData/' + project)) {
        for (var i = startTime_time, j=0; i <= endTime_time; i += 1000 * 60 * 60 * 24,j++) {
            var o = getTimePathByDate(i)
            var year = o.year;
            var mouth = o.mouth;
            var day = o.day;
            var path = 'traceData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
            if (!fs.existsSync(path)) {
                continue;
            }
            var originData = fs.readFileSync(path, {
                'encoding': 'utf8'
            });
            
            var data = getSpecData2(originData);
            if (data) {
                console.log(dataList);
                dataList[j].data3 = data;
            }
            
        }
    }
    
    
    res.send({
        code: 1,
        data: dataList
    });
})







function getTimePathByDate(date) {
    var d = new Date(date);
    var year = d.getFullYear();
    var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
    var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
    return {
        year: year,
        mouth: mouth,
        day: day
    };
}



function getTimeByDate(dateStr) { //2016-08-09
    var date = new Date(dateStr + ' 00:00');
    var time = date.getTime();
    return time;
}




/*特殊信息统计--portal*/
function getSpecData(data) {
    if (!data) {
        return;
    }
    var list = data.split('\r\n');
    var result = {
        data1: {},
        data2: {}
    };
    for (var i = 0; i < list.length - 1; i++) {
        try{
        var loginuid = list[i].match(/(^|\|)loginuid\=([^|]*)/)[2];
        var count = list[i].match(/(^|\|)recommendCount\=([^|]*)/)[2];
        var agentNames = list[i].match(/(^|\|)agentNames\=([^|]*)/)[2];
        } catch(err) {
            console.log(err);
            continue;
        }
        
        if (loginuid=='notlogin' || !agentNames) 
            continue;
        
        result.data1[loginuid] = Math.max( count, result.data1[loginuid]?result.data1[loginuid]:0 );
        
        var agts = agentNames.split(',');
        
        for (var j=0;j<agts.length;j++) {
            if (!result.data2[agts[j]]) {
                result.data2[agts[j]] = [loginuid];
            } else {
                result.data2[agts[j]].push(loginuid);
            }
        }
    }
    
    for(var k in result.data2) {
        var vArr = result.data2[k];
        var uniqArr = uniq(vArr);
        result.data2[k] = uniqArr.length;
    }
    
    
    return result;
}



function uniq(array){ 
    return [].filter.call(array, function(item, idx){ 
        return array.indexOf(item) == idx 
    })
}



function formatSpecData(data) {
    if (!data) {
        return;
    }
    var result = {};
    for (var k in data) {
        var v = data[k];
        if ( result[v] ) {
            result[v]++
        } else {
            result[v] = 1
        }
    }
    return result;
}



// 获取机构点击
function getSpecData2(data) {
    if (!data) {
        return;
    }
    var list = data.split('\r\n');
    var result = {};
    for (var i = 0; i < list.length - 1; i++) {
        try{
        var loginuidArr = list[i].match(/(^|\|)loginuid\=([^|]*)/);
        var agentArr = list[i].match(/(^|\|)agent\=([^|]*)/);
        } catch(err) {
            console.log(err);
            continue;
        }
        
        if ( !loginuidArr || !agentArr || !loginuidArr.length || !agentArr.length )
            continue;
        
        var loginuid = loginuidArr[2];
        var agent = agentArr[2];
        
        if (loginuid=='notlogin' || !agent) 
            continue;
            
        result[agent] ? result[agent].push(loginuid) : result[agent] = [loginuid];
    }
    
    for (var k in result) {
        var v = result[k];
        v = uniq(v);
        result[k] = v.length;
    }
    
    return result;
}







module.exports = router;