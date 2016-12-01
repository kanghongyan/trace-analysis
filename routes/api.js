var express = require('express');
var router = express.Router();
var fs = require('fs');

var Promise = require("bluebird");
var _ = require('lodash');

var userInfo = require('../config/userConfig');




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


/*特殊--导流portal页*/
router.get('/specDaoliuPortal', function(req, res, next) {
    var child_process_current = global.child_computer_spec;
    
    if (child_process_current.isUsing) {
        res.send({
            code: 2,
            msg: '系统繁忙，请稍后再试'
        })
        return;
    }
    child_process_current.isUsing = true;
    
    var _callback = function(d){
        child_process_current.removeListener('message', _callback);
        child_process_current.isUsing = false;
        
        res.send(d)
    }
    child_process_current.on('message', _callback);
    
    child_process_current.send(composeParamObj(req, res));
})


/*其他全部--使用全局process*/
router.get('/:route?', function(req, res, next) {
    if (!req.params.route) {
        next();
    }
    
    var child_process = global.child_computer;
    var child_process_2 = global.child_computer_2;
    var child_process_current;
    
    if (child_process.isUsing && child_process_2.isUsing) {
        res.send({
            code: 2,
            msg: '系统繁忙，请稍后再试'
        })
        return;
    }
    
    child_process_current = child_process.isUsing ? child_process_2 : child_process;
    child_process_current.isUsing = true;
    
    var _callback = function(d){
        child_process_current.removeListener('message', _callback);
        child_process_current.isUsing = false;
        
        res.send({
            code: 1,
            data: d
        })
    }
    child_process_current.on('message', _callback);
    child_process_current.send(composeParamObj(req, res));
})



function composeParamObj(req, res) {
    var totalParams = {
        category:  'infoData',
        project:   req.query.project,
        page:      req.query.page,
        filter:    req.query.filter,
        startTime: req.query.startTime,
        endTime:   req.query.endTime,
        route:     req.params.route
    }
    
    if (req.params.route==='totalV')
        totalParams.route = 'pageV'
    else if (req.params.route==='pageT')
        totalParams.category = 'traceData'
    
    return totalParams
}

///*公用--获取项目页面列表*/
//router.get('/pageList', route_pageList)
//
///*打点数据统计*/
//router.get('/pageT', route_pageT);
//
///*基本信息统计--总PV UV LV统计*/
//router.get('/totalV', route_pageV);
//
///*基本信息统计--页面级PV UV LV统计*/
//router.get('/pageV', route_pageV);
//
///*基本信息统计--页面级性能统计*/
//router.get('/performance', route_performance);
//
///*基本信息统计--浏览器统计*/
//router.get('/browser', route_browser)
//
///*基本信息统计--平台统计*/
//router.get('/platform', route_platform)
//
///*基本信息统计--屏幕大小统计*/
//router.get('/screenSize', route_screenSize);
//
///*基本信息统计--时峰值统计*/
//router.get('/hourPeak', route_hourPeak);
//
///*特殊信息统计--URL参数过滤*/
//router.get('/urlFilter', route_urlFilter);
//
///*特殊信息统计--导流我的贷款portal*/
//router.get('/specDaoliuPortal', route_specDaoliuPortal);



module.exports = router;