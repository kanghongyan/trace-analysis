/**
 * 2017-4-20
 * jiajianrong@58.com
 * 公司xss扫描时，由于程序漏洞产生很大无效目录和文件
 * 清理
 */

var path = require('path');
var fs = require('fs');
var config = require('./config/userConfig');
var ALL_PROJECTS = config.superUser.project;
//console.log(ALL_PROJECTS)

var rmDirRecursive = function(path, isRoot) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        rmDirRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    !isRoot && fs.rmdirSync(path);
  }
};


var traceData = './traceData';
var topDirs = [];

function readRecursive(path) {
    
    fs.readdirSync(path).forEach(function(file,index){
        
        //console.log(file);
        
        var curPath = path + "/" + file;
        
        topDirs.push(file);
        
        //if(fs.lstatSync(curPath).isDirectory()) {
         //   readRecursive(curPath);
        //}
    });
}


readRecursive(traceData)

var unexpected = topDirs.filter(function(item){
    return ALL_PROJECTS.indexOf(item) == -1
})

unexpected = unexpected.map(function(item){
    return traceData + "/" + item;
})

//console.log(unexpected.join(','));
console.log(unexpected.length);


unexpected.forEach(function(item){
    rmDirRecursive(item)
})