/**
 * 统计浏览器类型
 */
var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util_fs_async = require('../backend/_util_fs_async');

var computeMap = {
    browser: require('../backend/compute_logic_browser'),
    hourPeak: require('../backend/compute_logic_hourPeak'),
    pageList: require('../backend/compute_logic_pageList'),
    pageT: require('../backend/compute_logic_pageT'),
    pageV: require('../backend/compute_logic_pageV'),
    performance: require('../backend/compute_logic_performance'),
    platform: require('../backend/compute_logic_platform'),
    screenSize: require('../backend/compute_logic_screenSize'),
    urlFilter: require('../backend/compute_logic_urlFilter')
}



var category = 'infoData';
var project = 'cfq-crm';
var startTime = '2017-03-27';
var endTime = '2017-03-27';


process.chdir('../');

_util_fs_async( category, project, startTime, endTime )
.then(function(results){
    return computeMap['browser'](results)
})
.then(function(d){
    console.log(d)
})
.catch(function(e){
    console.log(e)
});





