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
var route_screenSize = require('../backend/route_screenSize');
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

/*基本信息统计--页面级性能统计*/
router.get('/performance', route_performance);

/*基本信息统计--浏览器统计*/
router.get('/browser', route_browser)

/*基本信息统计--平台统计*/
router.get('/platform', route_platform)

/*基本信息统计--屏幕大小统计*/
router.get('/screenSize', route_screenSize);

/*基本信息统计--时峰值统计*/
router.get('/hourPeak', route_hourPeak);

/*特殊信息统计--URL参数过滤*/
router.get('/urlFilter', route_urlFilter);

/*特殊信息统计--导流我的贷款portal*/
router.get('/specDaoliuPortal', route_specDaoliuPortal);



module.exports = router;