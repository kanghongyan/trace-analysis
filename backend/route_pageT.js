var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');




module.exports = function(req, res, next) {
    
    var category = 'traceData',
        project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime,
        page = req.query.page;
    
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




function analysis_callback(results) {
    results = results.filter(function(result){
        return result && result.data
    })
    
    results.forEach(function(result){
        if (result.data) {
            result.data = getBaseData(result.data);
        }
    });
    
    return results;
}


function getBaseData(data) {
    if (!data) {
        return;
    }
    var list = data.split('\r\n');
    var result = {};
    for (var j = 0; j < list.length - 1; j++) {
        var row = list[j].split('|');
        var rowObj = {};
        for (var i = 0; i < row.length; i++) {
            rowObj[row[i].split('=')[0]] = row[i].split('=')[1];
        }
        var isHas = false; //标记是否已添加
        var obj = null;
        rowObj.page = decodeURIComponent(rowObj.page).replace(/(\/*((\?|#).*|$))/g, '') || '/';;

        if (result[rowObj.page]) {
            for (var k = 0; k < result[rowObj.page].length; k++) {
                if (result[rowObj.page][k].tid == rowObj.tid) {
                    isHas = true;
                    result[rowObj.page][k].number++;
                    if (result[rowObj.page][k].user[rowObj.uid]) {
                        result[rowObj.page][k].user[rowObj.uid]++
                    } else {
                        result[rowObj.page][k].user[rowObj.uid] = 1;
                        result[rowObj.page][k].user.length++;
                    }
                    if (result[rowObj.page][k].loginuser[rowObj.loginuid]) {
                        result[rowObj.page][k].loginuser[rowObj.loginuid]++
                    } else {
                        result[rowObj.page][k].loginuser[rowObj.loginuid] = 1;
                        result[rowObj.page][k].loginuser.length++;
                    }
                }
            }
            if (!isHas) {
                obj = {
                    tid: rowObj.tid,
                    number: 1,
                    user: {
                        length: 1
                    },
                    loginuser: {
                        length: 1
                    }
                };
                obj.user[rowObj.uid] = 1
                obj.loginuser[rowObj.loginuid] = 1
                result[rowObj.page].push(obj);
            }
        } else {
            obj = {
                tid: rowObj.tid,
                number: 1,
                user: {
                    length: 1
                },
                loginuser: {
                    length: 1
                }
            };
            obj.user[rowObj.uid] = 1
            obj.loginuser[rowObj.loginuid] = 1
            result[rowObj.page] = [obj];
        }
    }
    for (var h in result) {
        for (var m = 0; m < result[h].length; m++) {
            for (var n in result[h][m].user) {
                if (n != 'length') {
                    delete result[h][m].user[n];
                }
            }
            for (var n in result[h][m].loginuser) {
                if (n != 'length') {
                    delete result[h][m].loginuser[n];
                }
            }
        }
    }
    return result;
}