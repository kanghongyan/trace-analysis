var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



module.exports = function(results) {

    function analy_data(data) {
        if (!data) {
            return [];
        }


        var referrerObj = _
            .chain(data.split('\r\n'))
            .map(function (item) {
                return item.match(/(^|\|)referrer\=([^|]*)/)
            })
            .filter(function (reArr) {
                return reArr;
            })
            .map(function (reArr) {
                return reArr[2]
            })
            .countBy(function (s) {
                return s ? s.match(/.*:\/\/([^\/]*)/)[0] : 'null';
            })
            .value();

        // var referrerArr = [];
        // var result = {};
        //
        // for (var i in referrerObj) {
        //     referrerArr.push([i, referrerObj[i]]);
        // }
        // referrerArr = _
        //     .orderBy(referrerArr, function (el) {
        //         return el[1];
        //     }, 'desc')
        //     .filter(function (value, key) {
        //         return key < 10;
        //     });
        //
        // _.map(referrerArr, function (el) {
        //     return result[el[0]] = el[1];
        // });
        //
        // console.log(result);
        return referrerObj;

    }

    results.forEach(function(result){
        result.data = analy_data(result.data);

    });

    return results;
}


