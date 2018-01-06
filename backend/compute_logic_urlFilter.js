var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');


var get_key = _util.getValueFromTraceData;

function analysis_callback(results, _PAGE, _FILTER) {

    
    
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

        var resData, pv, uv;

        resData = _
            .chain(data.split('\r\n'))
            .filter(is_curr_page)
            .map(function(item){
                return {
                    from: get_url_param_key(get_key(item, 'page'), _FILTER),
                    uid: get_key(item, 'uid')
                }
            })
            .groupBy(function (item) {
                return item.from
            });

        uv = resData
            .mapValues(function(valueArr){
                return _.uniqBy(valueArr, function (item) {
                    return item.uid
                }).length
            })
            .value();

        pv = resData
            .mapValues(function (valueArr) {
                return valueArr.length
            })
            .value();


        return {
            pv: pv || {},
            uv: uv || {}
        }
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


module.exports = analysis_callback_proxy;


