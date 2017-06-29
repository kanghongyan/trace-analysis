var fs = require('fs');
var path = require('path');
var Promise = require("bluebird");
var _ = require('lodash');

var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');
var CHANNEL_MAP = require('./_util_read_xlsx');




/**
 * results: [
 *   {
 *     data: 'xxxxxxx',
 *     day: '2017-01-01'
 *   }
 * ]
 * @param results
 * @param _PAGE
 * @returns {*}
 */

function analysis_callback(results, _PAGE) {
    
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
    
    function analy_data(data) {
        if (!data) {
            return;
        }
        
        var ipMap;
        try {
            ipMap = require('../config/ip_map.json');
        } catch (e) {
            ipMap = {}
        }
        
        /*
         * items
         * {
         *    '123.123.123.23': {
         *        '11': 3,
         *        '22': 2
         *    },
         *    ...
         * }
         */
        var items =  _
            .chain(_.trim(data).split('\r\n'))
            .map(function(item){
                return get_key(item, 'page')
            })
            .map(function(s){
                return {
                    ip: ipMap[get_url_param_key(s, 'ip').replace(/(\d+\.\d+\.\d+\.)\d+/,'$10')] || 'unknown_ip',
                    channel: CHANNEL_MAP[get_url_param_key(s, 'channel')] || 'unknown_channel'
                }
            })
            .groupBy(function (item) {
                return item.ip
            })
            .forEach(function (n, key, arr) {
            
                arr[key] =  _.countBy(n, function (l) {
                    return l.channel
                })
            
            })
            .value();
    
        return items
        
    }
    
    
    results.forEach(function (result) {
        result.data = analy_data(result.data)
    });
    
    return results;
}



function analysis_callback_proxy(page, filter) {
    return function(results) {
        return analysis_callback(results, page);
    }
}


module.exports = analysis_callback_proxy;


