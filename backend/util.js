function json2query(obj,splitter) {
    var arr;
    
    arr = Object.getOwnPropertyNames(obj).map( function(k){
        return encode(k) + '=' + encode(obj[k]);
    } );
    
    return arr.join(splitter||'&');
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


module.exports = {
    json2query: json2query,
    mixin     : mixin
};
