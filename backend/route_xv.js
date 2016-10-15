var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



function analysis_callback(results) {
    
    function get_key(s, key) {
        var reg = new RegExp('(^|\|)' + key + '\=([^|]*)'),
            arr = s.match(reg);
        return (arr && arr[2]) ? arr[2] : null;
    }
    
    
    function analy_data(data) {
        if (!data) {
            return {};
        }
        
        var dataArr = data.split('\r\n'),
            uvArr = [],
            lvArr = [];
        
        dataArr.forEach(function(data){
            var uv = get_key(data,'uid');
            uv && uvArr.push(uv);
            
            var lv = get_key(data,'loginuid');
            lv && lv!=='notlogin' && lvArr.push(lv);
        });
        
        return {
            pv: dataArr.length,
            uv: _.uniq(uvArr).length,
            lv: _.uniq(lvArr).length
        }
    }
    
    results.forEach(function(result){
        result.data = analy_data(result.data);
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