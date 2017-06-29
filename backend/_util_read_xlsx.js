/**
 * 车分期专用
 */
var path = require('path');
var xlsx = require('node-xlsx').default;
var _ = require('lodash');

/**
 *
 * @return data
 *    {
 *       '1': '瓜子二手车',
 *       '2': 'xxxx',
 *       ...
 *    }
 */
var rtn_data = {};



var EXCEL_FILE = path.join(__dirname, '../config/cfq_channel.xlsx');

var workSheetsFromFile = xlsx.parse(EXCEL_FILE);
var sheet_1 = workSheetsFromFile[1];
var sheetData = sheet_1.data;


rtn_data = _
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


module.exports = rtn_data;