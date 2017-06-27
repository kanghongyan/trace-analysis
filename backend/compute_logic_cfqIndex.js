var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');




function analysis_callback(results, _PAGE) {
    
    /*
     * todo：这里的逻辑可以参考compute_logic_urlFilter, 获取channel和ip来分析
     * 'channel' 和  'ip' 字段写死即可
     */
    
    results.forEach(function(result){
        result.data = {
            a: 1,
            b: 2
        };
    });
    
    return results;
}



function analysis_callback_proxy(page, filter) {
    return function(results) {
        return analysis_callback(results, page);
    }
}


module.exports = analysis_callback_proxy;


