var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');




module.exports = function(results) {
    
    return _.chain(results)
            .map('data')
            .compact()
            .map(function(data){
                return data.split('\r\n')
            })
            .flatten()
            .map(function(item){
                return item.match(/(^|\|)page\=([^|]*)/)
            })
            .filter(function(reArr){
                return reArr && reArr[2]
            })
            .map(function(reArr){
                return reArr[2]
            })
            .map(function(s){
                return decodeURIComponent(s).replace(/\/*((\?|#).*|$)/g, '') || '/'
            })
            .uniq()
            .sortBy()
            .value();
}


