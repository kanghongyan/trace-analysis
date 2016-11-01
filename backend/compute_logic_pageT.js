var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');




module.exports = function(results) {
    
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
                    result[rowObj.page][k].pv++;
                    if (result[rowObj.page][k].uv[rowObj.uid]) {
                        result[rowObj.page][k].uv[rowObj.uid]++
                    } else {
                        result[rowObj.page][k].uv[rowObj.uid] = 1;
                        result[rowObj.page][k].uv.length++;
                    }
                    if (result[rowObj.page][k].lv[rowObj.loginuid]) {
                        result[rowObj.page][k].lv[rowObj.loginuid]++
                    } else {
                        result[rowObj.page][k].lv[rowObj.loginuid] = 1;
                        result[rowObj.page][k].lv.length++;
                    }
                }
            }
            if (!isHas) {
                obj = {
                    tid: rowObj.tid,
                    pv: 1,
                    uv: {
                        length: 1
                    },
                    lv: {
                        length: 1
                    }
                };
                obj.uv[rowObj.uid] = 1
                obj.lv[rowObj.loginuid] = 1
                result[rowObj.page].push(obj);
            }
        } else {
            obj = {
                tid: rowObj.tid,
                pv: 1,
                uv: {
                    length: 1
                },
                lv: {
                    length: 1
                }
            };
            obj.uv[rowObj.uid] = 1
            obj.lv[rowObj.loginuid] = 1
            result[rowObj.page] = [obj];
        }
    }
    for (var h in result) {
        for (var m = 0; m < result[h].length; m++) {
            result[h][m].uv = result[h][m].uv.length;
            result[h][m].lv = result[h][m].lv.length;
        }
    }
    
    
    return result;
}