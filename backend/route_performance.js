var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



function analysis_callback(results, _PAGE) {
    
    function get_key(s, key) {
        var reg = new RegExp('(^|\|)' + key + '\=([^|]*)'),
            arr = s.match(reg);
        return (arr && arr[2]) ? arr[2] : null;
    }
    
    
    function is_curr_page(dataItem) {
        var page = get_key(dataItem,'page');
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
    
    
    function populate_arrs(dataItem, dnsArr, connArr, reqArr, resArr, rtArr, intrArr) {
        dnsArr .push( +get_key(dataItem,'dns')  || 0 );
        connArr.push( +get_key(dataItem,'conn') || 0 );
        reqArr .push( +get_key(dataItem,'req')  || 0 );
        resArr .push( +get_key(dataItem,'res')  || 0 );
        rtArr  .push( +get_key(dataItem,'rt')   || 0 );
        intrArr.push( +get_key(dataItem,'intr') || 0 );
    }
    
    
    function average(arr) {
        var t = _.chain(arr).
                  compact().
                  filter(function(d){return d<10000}).
                  value(),
            r = _.reduce(t, function(p,c){return p+c}) / t.length;
        return Math.floor(r);
    }
    
    
    function analy_data(data) {
        if (!data) {
            return {};
        }
        
        var dataArr = data.split('\r\n'),
            dnsArr = [],
            connArr = [],
            reqArr = [],
            resArr = [],
            rtArr = [],
            intrArr = [];
        
        dataArr = dataArr.filter(function(dataItem){
            // 存在_PAGE的话，则是查询每个页面的xv
            // 否则则是总xv
            if( _PAGE && !is_curr_page(dataItem) ) {
                return false;
            }
            populate_arrs(dataItem, dnsArr, connArr, reqArr, resArr, rtArr, intrArr);
            return true;
        });
        
        return {
            dns:  average(dnsArr),
            conn: average(connArr),
            req:  average(reqArr),
            res:  average(resArr),
            rt:   average(rtArr),
            intr: average(intrArr)
        }
    }
    
    
    results.forEach(function(result){
        result.data = analy_data(result.data);
    });
    
    return results;
}



function analysis_callback_proxy(page) {
    return function(results) {
        return analysis_callback(results, page);
    }
}



module.exports = function(req, res, next) {
    
    var category = 'infoData',
        project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime,
        page = req.query.page;
    
    _util_fs_async( category, project, startTime, endTime, 
                    page ? analysis_callback_proxy(page) : analysis_callback )
    
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