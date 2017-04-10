var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');



module.exports = function(results) {

    var test = 'os=iphone|browser=Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1|scrsize=1024*768*2|dns=0|conn=0|req=22|res=3|rt=37|intr=531|referrer=http://127.0.0.1:8080/v5/user/bankcardui?from=58jinrong|page=http://127.0.0.1:8080/v5/user/baseinfoui?from=58jinrong|_=1491817458759|uid=1270018080.14918174586350.3576773710031458|ip=127.0.0.1';
    console.log(test.match(/(^|\|)referrer\=([^|]*)/)
        .filter(function(reArr){
            return reArr && reArr[2]
        })
        .map(function(reArr){
            return reArr[2]
        }));

    function analy_data(data) {
        if (!data) {
            return [];
        }

        return _
            .chain(data.split('\r\n'))
            .map(function(item){
                return item.match(/(^|\|)referrer\=([^|]*)/)
            })
            .filter(function(reArr){
                return reArr && reArr[2]
            })
            .map(function(reArr){
                return reArr[2]
            })
            .map(function(s){
                return ['android','iphone'].indexOf(s) == -1 ? 'others' : s
            })
            .countBy(function(s){
                return s
            })
            .value();
    }

    results.forEach(function(result){
        result.data = analy_data(result.data);

    });

    return results;
}


