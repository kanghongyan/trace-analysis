var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



function analysis_callback(results) {
    
    function analy_data(data, result) {
        if (!data) {
            return;
        }
        
        var all = _
                .chain(data.split('\r\n'))
                .map(function(item){
                    return item.match(/(^|\|)scrsize\=([^|]*)/)
                })
                .filter(function(reArr){
                    return reArr && reArr[2]
                })
                .map(function(reArr){
                    return reArr[2]
                })
                .map(function(s){
                    return s.split('*')
                })
                .filter(function(arr){
                    return arr[0] && arr[1] && arr[2]
                })
                .value();
        
        var len = all.length;
        
        var sizes = _
                .chain(all)
                .map(function(arr){
                    var h = Math.floor(arr[0]/40) * 40 + 20
                    var w = Math.floor(arr[1]/30) * 30 + 15
                    return [h,w]
                })
                .countBy(function(arr){
                    var h = arr[0]
                    var w = arr[1]
                    var label = '[长:' + (h-20) + '-' + (h+19) + ' 宽:' + (w-15) + '-' + (w+14) + '] 占比: '
                    return [ w, h, label ]
                })
                .mapValues(function(v,k){
                    return v/len
                })
                .mapKeys(function(v,k){
                    v = (v*100+'').substring(0,5) + '%'
                    return k + v + ',' + v
                })
                .pickBy(function(v){
                    return v>0.001
                })
                .value();
        
        var dprs = _
                .chain(all)
                .map(2)
                .countBy()
                .mapKeys(function(v,k){
                    return 'dpr='+k
                })
                .mapValues(function(v,k){
                    return v/len
                })
                .pickBy(function(v){
                    return v>0.001
                })
                .value();
        
        dprs['others'] = _.reduce(dprs, function(r,v,k){
            var x = Math.abs(r-v)
            return x > 0.000001 ? x : 0
        }, 1)
        
        result.data1 = sizes;
        result.data2 = dprs;
        delete result.data;
    }

    
    results.forEach(function(result){
        analy_data(result.data, result);
    });
    
    return results;
}






module.exports = function(req, res, next) {
    
    var category = 'infoData',
        project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime;
    
    _util_fs_async( category, project, startTime, endTime, analysis_callback )
    
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