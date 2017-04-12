var fs = require('fs');
var Promise = require("bluebird");
var _ = require('lodash');
var _util = require('./_util');
var _util_fs_async = require('./_util_fs_async');


function analysis_callback(results, _PAGE) {

    function getKey(dataItem, key) {
        var reg = new RegExp('(^|\|)'+key+'=([^|]*)'),
            arr = dataItem.match(reg);

        return (arr && arr[2]) ? arr[2] : null;
    }

    function is_curr_page(dataItem) {
        var page = getKey(dataItem, 'page');

        if(!page) {
            return false;
        }

        page = decodeURIComponent(page);
        page = page.replace(/\/*((\?|#).*|$)/g, '');

        if(page != _PAGE) {
            return false;
        }

        return true;

    }

    function analy_data(data) {
        if (!data) {
            return [];
        }


        var dataArr = data.split('\r\n');

        dataArr = dataArr.filter(function (dataItem) {
            // 过滤指定页面
            if(_PAGE && !is_curr_page(dataItem)) {
                return false;
            }

            return true;
        })


        return _
            .chain(dataArr)
            .map(function (item) {
                return item.match(/(^|\|)referrer=([^|]*)/)
            })
            .filter(function (reArr) {
                return reArr;
            })
            .map(function (reArr) {
                return reArr[2];
            })
            .countBy(function (s) {
                return s ? s.match(/[^\/]*:\/\/([^\?#\|]*)/)[0] : 'null';
            })
            .value();


    }

    results.forEach(function (result) {
        result.data = analy_data(result.data);

    });

    return results;
}


function analysis_callback_proxy(page) {
    return page ?
        function(results) {
            return analysis_callback(results, page);
        } :
        analysis_callback
}

module.exports = analysis_callback_proxy;


