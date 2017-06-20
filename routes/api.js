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




/*特殊--导流portal页
 * 已改为socket.io
 * jiajianrong
 * 2016-12-02
 * */





/*其他全部--使用全局process*/
router.get('/:route?', function(req, res, next) {
    if (!req.params.route) {
        next();
    }
    
    // 可用进程池
    var cp_factory = global.CP_COMPUTE_FACTORY;
    // 取出空闲进程
    var cp_curr = cp_factory.filter(function(cp){
        return !cp.isUsing
    }) [0];
    // 不存在空闲进程，向浏览器返回信息，结束会话
    if (!cp_curr) {
        res.send({ code: 2, msg: '系统繁忙，请稍后再试' })
        return;
    }
    // 标识进程为工作状态
    cp_curr.isUsing = true;
    // 向进程发送任务
    cp_curr.send( _parseParams(req, res) );
    // 注册结果钩子，标识进程为空闲状态，并将数据返回至浏览器，结束会话
    cp_curr.on('message', function _m(d){
        cp_curr.removeListener('message', _m);
        cp_curr.isUsing = false;
        // 向浏览器返回信息，结束会话
        res.send({ code: 1, data: d });
    });
    
})





function _parseParams(req, res) {
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
        totalParams.route = 'pageV';
    else if (req.params.route==='pageT')
        totalParams.category = 'traceData';
    else if (req.params.route === 'jsLoad')
        totalParams.category = 'jsLoadData';
    
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