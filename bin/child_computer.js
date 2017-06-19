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
    urlFilter: require('../backend/compute_logic_urlFilter'),
    refer: require('../backend/compute_logic_refer'),
    sendBeacon: require('../backend/compute_logic_sendBeacon'),
    loadAverage: require('../backend/compute_logic_loadAverage')
}



process.on('message', function(settings) {
    var route = settings.route
    var category = settings.category
    var project = settings.project
    var startTime = settings.startTime
    var endTime = settings.endTime
    var page = settings.page
    var filter = settings.filter


    var compute_logic_callback = computeMap[route];


    if (route==='pageV' || route==='performance' || route==='refer')
        compute_logic_callback = compute_logic_callback(page);

    else if (route==='urlFilter')
        compute_logic_callback = compute_logic_callback(page, filter);


    _util_fs_async( category, project, startTime, endTime )
    .then(function(results){
        return compute_logic_callback(results)
    }).then(function(d){
        process.send(d)
    }).catch(function(e){
        process.send([])
    });
})


