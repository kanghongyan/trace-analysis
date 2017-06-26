var fs = require('fs');
var _util = require('../backend/_util');

var DataPool = {};

function add (fullPath, fileData) {
    
    DataPool[fullPath] = DataPool[fullPath] === undefined ? fileData : DataPool[fullPath] + fileData
}

function saveToFile () {
    
    Object.keys(DataPool).forEach(function (path) {

        var filePath = path.split('/').splice(0, 2).join('/');
        var fileData = DataPool[path];

        fs.exists(filePath, function (exists) {

            if (exists) {
                fs.appendFile(path, fileData, 'utf8', function () {});
                process.send('finish');
            } else {
                fs.mkdir(filePath, function () {
                    fs.appendFile(path, fileData, 'utf8', function () {});
                    process.send('finish')
                });
            }

        });
    })
    
}

process.on('message', function (msg) {
    
    DataPool = {};
    
    
    // saveToFile(data);
    msg.cacheData.forEach((item) => {
        
        add(
            item.fullPath,
            item.data
        );
        
    });
    
    saveToFile();
    
});
