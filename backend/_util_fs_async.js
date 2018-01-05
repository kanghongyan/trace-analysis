var fs = require('fs');
var Promise = require("bluebird");
var _util = require('./_util');
var logger = require('../log');


function isDir(path) {
    return new Promise(function(resolve, reject){
        fs.lstat(path, function(err, stats){
            resolve( err ? false : stats.isDirectory() )
        })
    });
}


function getCont(filename, day) {
    var promise = Promise.pending();
    fs.readFile(filename, "utf8", function(err, content) {
        promise.resolve({data: content||null, day: day})
    })
    return promise.promise
}




module.exports = function(category, project, startTime, endTime) {
    
    return isDir(category + '/' + project)
    
    .then(function(yes){
        if (!yes) return [];
        var days = _util.getDaysBetween(startTime, endTime);
        var proms = days.map(function(day){
            return getCont(category + '/' + project + '/' + day + '.txt', day);
        });
        return Promise.all(proms)
    })
    
    .catch(function(err){
        console.log('_util_fs_async throws', err);
        // console.log(err.stack);
        logger.error(err.stack);
        return '';
    });
    
    
}