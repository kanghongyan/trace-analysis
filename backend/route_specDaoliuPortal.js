var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');


// 从specData里取展示条数: data1, data2
function analysis_callback(results) {
    
    function analy_data(data, result) {
        if (!data) {
            return;
        }
        
        var all = _
            .chain(data.split('\r\n'))
            .filter(function(item){
                var reArr = item.match(/(^|\|)loginuid\=([^|]*)/)
                return reArr && reArr[2] && reArr[2]!=='notlogin'
            })
            .map(function(item){
                var reLidArr    = item.match(/(^|\|)loginuid\=([^|]*)/)
                var reCountArr  = item.match(/(^|\|)recommendCount\=([^|]*)/)
                var reAgentsArr = item.match(/(^|\|)agentNames\=([^|]*)/)
                
                var lid    = reLidArr[2]
                var count  = reCountArr && reCountArr[2] ? +reCountArr[2] : 0
                var agents = reAgentsArr && reAgentsArr[2] ? reAgentsArr[2] : ''
                
                return [ lid, count, agents ]
            })
            .value();
            
        result.data1 = _
            .chain(all)
            .sortBy(function(arr){
                return arr[1]
            })
            .reverse()
            .uniqBy(function(arr){
                return arr[0]
            })
            .countBy(function(arr){
                return arr[1]
            })
            .mapKeys(function(v,k){
                return '推荐条数为'+k+'的总展示量(登录用户)'
            })
//          .transform(function(r,v,k){
//              r.push({name:k,value:v})
//          }, [])
            .value();
        
        var data2_temp/*lid:[agent1,agent2...]*/ = _
            .chain(all)
            .filter(function(arr){
                return arr[2]
            })
            .map(function(arr){
                return [ arr[0], arr[2].split(',') ]
            })
            .value();
        
        var data2_rtn_obj = {};
        
        data2_temp.forEach(function(arr){
            var lid = arr[0],
                vArr = arr[1];
            vArr.forEach(function(v){
                if (!data2_rtn_obj[v]) 
                    data2_rtn_obj[v] = [lid]
                else
                    data2_rtn_obj[v].push(lid)
            })
        })
        
//      result.data2 = _.map(data2_rtn_obj, function(v,k){
//          return {name: k, value: _.uniq(v).length}
//      })
        
        result.data2 = _.mapValues(data2_rtn_obj, function(v,k){
            return _.uniq(v).length
        })
        
        
// 下面代码在大量数据下 效率特别差
//      result.data2 = _
//          .chain(all)
//          .filter(function(arr){
//              return arr[2]
//          })
//          .map(function(arr){
//              var arr_0 = arr[0]
//              var arr_r = arr[2].split(',').map(function(s){
//                  return [arr_0, s]
//              })
//              return arr_r
//          })
//          .flatten()
//          .compact()
//          .uniqWith(_.isEqual)
//          .map(function(arr){
//              return arr[1]
//          })
//          .countBy()
//          .transform(function(r,v,k){
//              r.push({name:k,value:v})
//          }, [])
//          .value();
        
        delete result.data;
    }
    
    results.forEach(function(result){
        analy_data(result.data, result);
    });
    
    return results;
}



// 从traceData里取点击次数: data3
function analysis_callback_2(results) {
    
    function analy_data(data, result) {
        if (!data) {
            return;
        }
        
        result.data3 = _
            .chain(data.split('\r\n'))
            .map(function(item){
                var reLidArr   = item.match(/(^|\|)loginuid\=([^|]*)/)
                var reAgentArr = item.match(/(^|\|)agent\=([^|]*)/)
                
                if ( reLidArr && reLidArr[2] && reLidArr[2]!=='notlogin' && reAgentArr && reAgentArr[2] ) {
                    var lid   = reLidArr[2]
                    var agent = reAgentArr[2]
                    
                    return [ lid, agent ]
                } else {
                    return null
                }
            })
            .compact()
            .uniqWith(_.isEqual)
            .countBy(function(arr){
                return arr[1]
            })
//          .transform(function(r,v,k){
//              r.push({name:k,value:v})
//          }, [])
            .value();
        
        delete result.data;
    }
    
    results.forEach(function(result){
        analy_data(result.data, result);
    });
    
    return results;
}



module.exports = function(req, res, next) {
    
    var project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime;
    
    var cb   = _util_fs_async( 'specData', project, startTime, endTime ).then(function(results){
                   return analysis_callback(results);
               }),
        cb_2 = _util_fs_async( 'traceData', project, startTime, endTime ).then(function(results){
                   return analysis_callback_2(results);
               });
    
    
    Promise
        .all([ cb, cb_2 ])
        .then(function(resultsArr){
            var rtn = {};
            rtn.data1 = resultsArr[0][0].data1;
            rtn.data2 = resultsArr[0][0].data2;
            rtn.data3 = resultsArr[1][0].data3;
            
            res.send({
                code: 1,
                data: [rtn]
            })
        })
       
   .catch(function(e){
        res.send({
            code: 1,
            data: []
        })
    });





//  _util_fs_async( 'traceData', project, startTime, endTime, analysis_callback_2 )
//  
//  .then(function(results){
//      res.send({
//          code: 1,
//          data: results
//      })
//      
//  }).catch(function(e){
//      res.send({
//          code: 1,
//          data: []
//      })
//  });




//  _util_fs_async( 'specData', project, startTime, endTime, analysis_callback )
//  
//  .then(function(results){
//      res.send({
//          code: 1,
//          data: results
//      })
//      
//  }).catch(function(e){
//      res.send({
//          code: 1,
//          data: []
//      })
//  });

}