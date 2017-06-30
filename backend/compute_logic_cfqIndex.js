var fs = require('fs');
var path = require('path');
var Promise = require("bluebird");
var _ = require('lodash');
var moment = require('moment');

var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');
var CHANNEL_ID_NAME_MAP = require('./_util_read_xlsx');


/**
 * 日缓存
 * 自动清理require.cache
 */
function GET_REALTIME_IP_CITY_MAP() {
    
    require('../config/ip_map.json');
    
    
    var allCaches = require.cache;
    
    var cachedKey = _(allCaches)
        .keys()
        .filter(function(key){
            var filePath = path.join( __dirname, '..', 'config', 'ip_map.json' );
            return filePath == key;
        })
        .value()[0];
    
    var cachedItem = require.cache[cachedKey];
    
    var today = moment().format('YYYY-MM-DD');
    
    
    //----------
    // 第一次加载
    //----------
    if ( !cachedItem.lastModified ) {
        
        cachedItem.lastModified = today;
        
        return cachedItem.exports;
    
    
    //----------
    // 缓存过期
    //----------
    } else if ( cachedItem.lastModified && cachedItem.lastModified != today ) {
        
        delete require.cache[cachedKey];
        
        require('../config/ip_map.json');
        
        require.cache[cachedKey].lastModified == today;
        
        return require.cache[cachedKey].exports;
    
    
    //----------
    // 缓存有效
    //----------
    } else {
        
        return cachedItem.exports;
    }
    
}





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
        
        /*
         * items
         * {
         *    '123.123.123.23': {
         *        'channel_1': 3,
         *        'channel_2': 2
         *    },
         *    ...
         * }
         */
        
        var IP_CITY_MAP = GET_REALTIME_IP_CITY_MAP();
        
        
        var items =  _
            .chain(_.trim(data).split('\r\n'))
            .map(function(item){
                return get_key(item, 'page')
            })
            .map(function(s){
                var ip = get_url_param_key(s, 'ip').replace(/(\d+\.\d+\.\d+\.)\d+/,'$10');
                var channelId = get_url_param_key(s, 'channel');
                return {
                    city: IP_CITY_MAP[ip] || 'unknown_city',
                    channel: CHANNEL_ID_NAME_MAP[channelId] || 'unknown_channel'
                }
            })
            .groupBy(function (item) {
                return item.city
            })
            /*
             * { a: [ { city: 'a', channel: 'ershou' },
                      { city: 'a', channel: 'che' } ],
                 b: [ { city: 'b', channel: 'che' } ]
               }
             */
            .forEach(function (value, key, arr) {
                arr[key] =  _.countBy(value, function (item) {
                    return item.channel
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



function analysis_callback_proxy(page) {
    return function(results) {
        return analysis_callback(results, page);
    }
}


module.exports = analysis_callback_proxy;


