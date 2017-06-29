var xlsx = require('node-xlsx').default;
var _ = require('lodash');

/**
 *
 * @param path
 * @return data
 *    {
 *       '1': '瓜子二手车',
 *       '2': 'xxxx',
 *       ...
 *    }
 */

module.exports = function (path) {
    
    var workSheetsFromFile = xlsx.parse(path);
    var sheet_1 = workSheetsFromFile[1];
    
    var sheetData = sheet_1.data;
    var data = _
        .chain(sheetData)
        .slice(2, sheetData.length - 1)
        .map(function (n) {
            return [n[2], n[1]]
        })
        .reduce(function (result, value, key) {
            result[value[0]] = value[1];
            return result
        }, {})
        .value();
    
    
    return data
};