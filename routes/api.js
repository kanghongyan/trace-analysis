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
var route_specDaoliuPortal = require('../backend/route_specDaoliuPortal');




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
router.get('/specDaoliuPortal', route_specDaoliuPortal);




function getTimeByDate(dateStr) { //2016-08-09
    var date = new Date(dateStr + ' 00:00');
    var time = date.getTime();
    return time;
}
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
function getParamer(listStr, paramer) {
    var reg = new RegExp('(?:^|\|)' + paramer + '\=([^|]*)');
    var name = listStr.match(reg);
    if (!name || !name[1]) {
        return '';
    } else {
        return name[1];
    }
}


/*屏幕尺寸数据*/
router.get('/screenSize', function(req, res, next) {
    var project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime,

        startTime_time = getTimeByDate(startTime),
        endTime_time = getTimeByDate(endTime), 
        result = {
        devicePixelRatio:{},
        screenSize:{}
    };
    if (fs.existsSync('infoData/' + project)) {
        for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
            var o = getTimePathByDate(i),
                year = o.year,
                mouth = o.mouth,
                day = o.day,
                path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt';
            if (!fs.existsSync(path)) {
                continue;
            }
            var data = fs.readFileSync(path, {'encoding': 'utf8'}),
                dataMap = getScreenData(data);
            for (var key in dataMap.devicePixelRatio){
                result['devicePixelRatio'][key] = result['devicePixelRatio'][key] ? 
                    result['devicePixelRatio'][key] + dataMap['devicePixelRatio'][key] : 
                    dataMap['devicePixelRatio'][key];
            }
            for (var key in dataMap.screenSize){
                if(!result['screenSize'][key]){
                    result['screenSize'][key] ={};
                }
                if(result['screenSize'][key]['num']){
                    result['screenSize'][key]['num'] += dataMap['screenSize'][key]['num'];
                }else{
                    result['screenSize'][key]['num'] = dataMap['screenSize'][key]['num'];
                }
            }
            result.num = result.num ? result.num + dataMap.num : dataMap.num;
        }
    }
    var num = result.num,
        dealData = {
           screenSize:{},
           devicePixelRatio:{}
        };    
        for(var key in result.devicePixelRatio){
            if(!dealData['devicePixelRatio'][key] && result['devicePixelRatio'][key]/num > 0.01){
                dealData['devicePixelRatio'][key] = result['devicePixelRatio'][key];
            }else if(dealData['devicePixelRatio'][key] && result['devicePixelRatio'][key]/num > 0.01){
                dealData['devicePixelRatio'][key] += result['devicePixelRatio'][key];
            }else if(!dealData['devicePixelRatio'][key] && result['devicePixelRatio'][key]/num < 0.01){
                if(dealData['devicePixelRatio']['其他']){
                    dealData['devicePixelRatio']['其他'] += result['devicePixelRatio'][key];
                }else{
                    dealData['devicePixelRatio']['其他'] = result['devicePixelRatio'][key];
                }
            }
        }
        dealData.num = num;
        for(var key in result.screenSize){
            if(!dealData['screenSize'][key] && result['screenSize'][key]['num']/num > 0.01){
                dealData['screenSize'][key] = {};
                dealData['screenSize'][key]['num'] = result['screenSize'][key]['num'];
                dealData['screenSize'][key]['rate'] = parseFloat(dealData['screenSize'][key]['num'] / num).toFixed(2) * 100 + '%';
            }else if(dealData['screenSize'][key] && result['screenSize'][key]['num']/num > 0.01){
                dealData['screenSize'][key]['num'] += result['screenSize'][key]['num'];
                dealData['screenSize'][key]['rate'] = parseFloat(dealData['screenSize'][key]['num'] / num).toFixed(2) * 100 + '%';
            }
        }       
    result = dealData;
    res.send({
        code: 1,
        data: result
    });       
})




//基本信息－屏幕信息
function getScreenData(data) {
    if (!data) {
        return;
    }
    var list = data.split('\n'),
        result = {
            devicePixelRatio:{},
            screenSize:{}  
        };
    for (var i = 0; i < list.length - 1; i++) {
        var scrsize = getParamer(list[i], 'scrsize'),
            splitArray = [],
            scrsizeArray = [];
        if (!scrsize) {
            continue;
        }
        result.num = result.num ? result.num + 1 : 1;
        splitArray = scrsize.split('*');
        scrsizeArray = splitArray.slice(0,2).reverse();
        //scrsizeArray[0] = scrsizeArray[0] % 30 <= 15 ? parseInt(scrsizeArray[0]/30) * 30 : (parseInt(scrsizeArray[0]/30) + 1) * 30;
        //scrsizeArray[1] = scrsizeArray[1]% 50 <= 25 ? parseInt(scrsizeArray[1]/50) * 50 : (parseInt(scrsizeArray[1]/50) + 1) * 50;
        scrsizeArray[0] = parseInt(scrsizeArray[0]/30) * 30 + 15;
        scrsizeArray[1] = parseInt(scrsizeArray[1]/50) * 50 + 25;
        //console.log('[' + (scrsizeArray[0] - 15) + '-' + (scrsizeArray[0] + 15) + ']' + '*' + '[' + (scrsizeArray[1] - 25) + '-' + (scrsizeArray[1] + 25) + ']' );
        result['devicePixelRatio'][splitArray[2]] = result['devicePixelRatio'][splitArray[2]] ? result['devicePixelRatio'][splitArray[2]] + 1 : 1;
        //var range = '[' + (scrsizeArray[0] - 15) + '-' + (scrsizeArray[0] + 15) + ']' + '*' + '[' + (scrsizeArray[1] - 25) + '-' + (scrsizeArray[1] + 25) + ']';
        if(!result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]]){
            result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]] = {};
        }
        if(!result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]]['num']){
            result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]]['num'] = 1;
        }else{
            result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]]['num'] += 1;
        }
        //result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]] = result['screenSize'][scrsizeArray[0] + 
        //'*' + scrsizeArray[1]] ? result['screenSize'][scrsizeArray[0] + '*' + scrsizeArray[1]] + 1 : 1;
    }
    return result;
}





module.exports = router;