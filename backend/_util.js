function json2query(obj,splitter) {
    return Object.getOwnPropertyNames(obj)
        .map(function(k){
            return encode(k) + '=' + encode(obj[k]);
        })
        .join(splitter||'&');
};



function mixin(obj) {
    var ret = {};
    
    var mixins = Array.prototype.slice.call(arguments,0);
    
    mixins.forEach(function(o){
        for(var k in o){
            ret[k]=o[k];
        }
    });
    
    return ret;
};


/**
 * Return formatted date string.
 * 如果无形参则返回当前年月日，如 2016-09-10
 * @param {Object} d
 * @param {Object} f
 */
function stringifyDate(d,f) {
    var _d,
        _f,
        _DEFAULT_DATE = new Date(),
        _DEFAULT_FORMATTER = '{yyyy}-{MM}-{dd}';
    
    if (arguments.length>=2) {
        _d = d;
        _f = f;
    } else if (arguments.length==0) {
        _d = _DEFAULT_DATE;
        _f = _DEFAULT_FORMATTER;
    } else {
        var _p1 = arguments[0],
            _p1HasBrace = _p1.indexOf('{')!=-1;
        
        _d = _p1HasBrace ? _DEFAULT_DATE : _p1;
        _f = _p1HasBrace ? _p1 : _DEFAULT_FORMATTER;
    }
    
    return _d.format(_f);
};



Date.prototype.format=function(){
    var _0=function(){
        return this<10?("0"+this):this;
    };
    return function(s){
        var map={
            y:this.getFullYear(),
            M:_0.call(this.getMonth()+1),
            d:_0.call(this.getDate()),
            H:_0.call(this.getHours()),
            m:_0.call(this.getMinutes()),
            s:_0.call(this.getSeconds())};
        return (s||"{y}-{M}-{d} {H}:{m}:{s}").replace( /{(y|M|d|H|m|s)+}/g, function(s,t){
            return map[t];
        });
    };
}();



module.exports = {
    json2query   : json2query,
    mixin        : mixin,
    stringifyDate: stringifyDate
};
