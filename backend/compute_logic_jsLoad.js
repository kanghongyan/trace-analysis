var _ = require('lodash');

module.exports = function (results) {
    
    
    function average(items) {
        if (!items.length)
            return 0;
        
        var sum = _.reduce(items, function(result, item){
            return result + item;
        })
        
        return (sum/items.length).toFixed(2)
    }
    
    
    
    function analy_data(data) {
        if (!data) {
            return;
        }
        
        var items = _
            .chain(data.split('\r\n'))
            .map(function(item){
                return item.match(/(^|\|)value\=([^|]*)/)
            })
            .filter(function(reArr){
                return reArr && reArr[2]
            })
            .map(function(reArr){
                return +reArr[2]
            })
            .filter(function(n){
                return n>0 && n<5000
            })
            .value();
        
        return average(items);
    }
    
    
    
    results.forEach(function(result){
        result.data = analy_data(result.data);
    });
    
    return results;
};