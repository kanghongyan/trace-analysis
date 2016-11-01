var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');




module.exports = function(req, res, next) {
    
    var category = 'infoData',
        project = req.query.project,
        startTime = req.query.startTime,
        endTime = req.query.endTime,
        page = req.query.page;
    
    var child_process = global.child_computer_1;
    var cb = function(d){
        child_process.removeListener('message',cb);
        res.send({
            code: 1,
            data: d
        })
    }
    child_process.send({
        category:category,
        project:project,
        page: page,
        startTime:startTime,
        endTime:endTime,
        type:'pageV'
    });
    child_process.on('message',cb);

}