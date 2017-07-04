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
    
    
    function has_ip_and_channel(pageUrl) {
        return /channel=/.test(pageUrl) && /ip=/.test(pageUrl);
    }
    
    
    
    function analy_data(data) {
        if (!data) {
            return;
        }
        
        var IP_CITY_MAP = GET_REALTIME_IP_CITY_MAP();
        
        
        var items =  _
            .chain(_.trim(data).split('\r\n'))
            .filter(is_curr_page)
            .map(function(item){
                return get_key(item, 'page')
            })
            .filter(has_ip_and_channel)
            .map(function(s){
                var ip = get_url_param_key(s, 'ip').replace(/(.*\.)(\d+)$/,'$10');
                var channelId = get_url_param_key(s, 'channel');
                return {
                    city: IP_CITY_MAP[ip] || 'unknown_city',
                    channel: CHANNEL_ID_NAME_MAP[channelId] || 'unknown_channel'
                }
            })
            .groupBy(function(item){
                return item.city
            })
            /*
             * { a: [ { city: 'a', channel: 'ershou' },
                      { city: 'a', channel: 'che' } ],
                 b: [ { city: 'b', channel: 'che' } ]
               }
             */
            
            //-----------------------
            // 使用mapValues代替forEach
            .mapValues(function(valueArr){
                return _.countBy(valueArr, function (item) {
                    return item.channel
                })
            })
            /*.forEach(function (value, key, arr) {
                arr[key] =  _.countBy(value, function (item) {
                    return item.channel
                })
            })*/
            //-----------------------
            
            /*
             * {
             *    'city_a': {
             *        'channel_x': 3,
             *        'channel_y': 2
             *    },
             *    'city_b': {
             *        'channel_x': 3,
             *        'channel_y': 2
             *    },
             *    ...
             * }
             */
            .value();
        
        
        // 添加总和
        function attachSumRow(obj) {
            var rowSum = {};
            var rows = _.values(obj);
            _.forEach(rows, function(row){
                _.forEach(row, function(value, key){
                    rowSum[key] = (rowSum[key] || 0) + value;
                })
            })
            
            obj['total_sum'] = rowSum;
        }
        
        
        attachSumRow(items);
        
        return items;
        
    }
    
    
    results.forEach(function (result) {
        result.data = analy_data(result.data)
        result.columns = _.values(CHANNEL_ID_NAME_MAP);
    });
        
    return results;
}



function analysis_callback_proxy(page) {
    return function(results) {
        return analysis_callback(results, page);
    }
}


module.exports = analysis_callback_proxy;


