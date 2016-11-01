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
    specDaoliuPortal: require('../backend/compute_logic_specDaoliuPortal')
}



process.on('message', function(settings) {
    
    var type = settings.type
    var category = settings.category
    var project = settings.project
    var startTime = settings.startTime
    var endTime = settings.endTime
    var page = settings.page
    var filter = settings.filter
    
    
    var compute_logic_callback = computeMap[type];
    
    
    if (type==='pageV' || type==='performance')
        compute_logic_callback = compute_logic_callback(page);
    
    else if (type==='urlFilter')
        compute_logic_callback = compute_logic_callback(page, filter);
    
    else if (type==='specDaoliuPortal') {
        var analysis_callback_1 = compute_logic_callback.analysis_callback_1;
        var analysis_callback_2 = compute_logic_callback.analysis_callback_2;
        
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


