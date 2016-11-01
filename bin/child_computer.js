var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util_fs_async = require('../backend/_util_fs_async');

var compute_logic_browser = require('../backend/compute_logic_browser');
var compute_logic_hourPeak = require('../backend/compute_logic_hourPeak');
var compute_logic_pageList = require('../backend/compute_logic_pageList');
var compute_logic_pageT = require('../backend/compute_logic_pageT');
var compute_logic_pageV = require('../backend/compute_logic_pageV');
var compute_logic_performance = require('../backend/compute_logic_performance');
var compute_logic_platform = require('../backend/compute_logic_platform');
var compute_logic_screenSize = require('../backend/compute_logic_screenSize');
var compute_logic_urlFilter = require('../backend/compute_logic_urlFilter');
var compute_logic_specDaoliuPortal = require('../backend/compute_logic_specDaoliuPortal');


process.on('message', function(d) {
    
    console.log('child receive, ', arguments)
    
    var type = arguments[0].type
    var category = arguments[0].category
    var project = arguments[0].project
    var startTime = arguments[0].startTime
    var endTime = arguments[0].endTime
    var page = arguments[0].page
    var filter = arguments[0].filter
    
    
    var compute_logic_callback;
    
    if (type==='browser')
        compute_logic_callback = compute_logic_browser;
    
    if (type==='hourPeak')
        compute_logic_callback = compute_logic_hourPeak;
    
    if (type==='pageList')
        compute_logic_callback = compute_logic_pageList;
    
    if (type==='pageT')
        compute_logic_callback = compute_logic_pageT;
    
    if (type==='pageV')
        compute_logic_callback = compute_logic_pageV(page);
    
    if (type==='performance')
        compute_logic_callback = compute_logic_performance(page);
    
    if (type==='platform')
        compute_logic_callback = compute_logic_platform;
    
    if (type==='screenSize')
        compute_logic_callback = compute_logic_screenSize;
    
    if (type==='urlFilter')
        compute_logic_callback = compute_logic_urlFilter(page, filter);
    
    else if (type==='specDaoliuPortal') {
        var analysis_callback_1 = compute_logic_specDaoliuPortal.analysis_callback_1;
        var analysis_callback_2 = compute_logic_specDaoliuPortal.analysis_callback_2;
        
        var cb_1 = _util_fs_async( 'specData', project, startTime, endTime ).then(function(results){
               return analysis_callback_1(results);
            }),
            cb_2 = _util_fs_async( 'traceData', project, startTime, endTime ).then(function(results){
               return analysis_callback_2(results);
            });
        
        Promise
            .all([ cb_1, cb_2 ])
            .then(function(resultsArr){
                var rtn = {};
                rtn.data1 = resultsArr[0][0].data1;
                rtn.data2 = resultsArr[0][0].data2;
                rtn.data3 = resultsArr[1][0].data3;
                
                process.send([rtn])
            });
        
        return;
    }
        
    
    _util_fs_async( category, project, startTime, endTime )
    .then(function(results){
        return compute_logic_callback(results)
    }).then(function(d){
        process.send(d)
    }).catch(function(e){
        process.send([])
    });
})


