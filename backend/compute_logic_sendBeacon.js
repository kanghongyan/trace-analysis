var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



module.exports = function(results) {

    function analy_data(data) {
        if (!data) {
            return;
        }

        return _
            .chain(data.split('\r\n'))
            .map(function(item){
                return item.match(/(^|\|)sendType=([^|]*)/)
            })
            .filter(function(reArr){
                return reArr && reArr[2]
            })
            .map(function(reArr){
                return reArr[2]
            })
            .countBy(function(s){
                return s
            })
            .value();
    }

    results.forEach(function(result){
        result.data = analy_data(result.data);
        console.log(result.data);
    });

    return results;
}


