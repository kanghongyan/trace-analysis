var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



function analysis_callback(results, _PAGE, _FILTER) {
    
    function get_key(s, key) {
        var reg = new RegExp('(^|\|)' + key + '\=([^|]*)'),
            arr = s.match(reg);
        return (arr && arr[2]) ? arr[2] : null;
    }
    
    
    function get_url_param_key(s, key) {
        var reg = new RegExp('(&|\\?)' + key + '\=([^#&]*)'),
            arr = s.match(reg);
        return (arr && arr[2]) ? arr[2] : '无参数';
    }
    
    
    function is_curr_page(item) {
        var page = get_key(item, 'page');
        if (!page) {
            return false;
        }
        page = decodeURIComponent(page);
        page = page.replace(/\/*((\?|#).*|$)/g, '');
        if (page!==_PAGE) {
            return false;
        }
        return true;
    }
    
    
    function analy_data(data) {
        if (!data) {
            return;
        }
        
        return _
            .chain(data.split('\r\n'))
            .filter(is_curr_page)
            .map(function(item){
                return get_key(item, 'page')
            })
            .map(function(s){
                return get_url_param_key(s, _FILTER)
            })
            .countBy(function(s){
                return s
            })
            .value();
    }
    
    results.forEach(function(result){
        result.data = analy_data(result.data);
    });
    
    return results;
}



function analysis_callback_proxy(page, filter) {
    return function(results) {
        return analysis_callback(results, page, filter);
    }
}



module.exports = function(req, res, next) {
    
    var category = 'infoData',
        project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime,
        page = req.query.page,
        filter = req.query.filter;
    
    _util_fs_async( category, project, startTime, endTime, analysis_callback_proxy(page, filter) )
    
    .then(function(results){
        res.send({
            code: 1,
            data: results
        })
        
    }).catch(function(e){
        res.send({
            code: 1,
            data: []
        })
    });
    
}