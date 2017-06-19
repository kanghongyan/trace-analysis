module.exports = function (results) {
    
    var count = 0;
    var allTime = 0;
    var dirtyData = {
        max: 3000,
        min: 0
    };
    
    var dataArr, value;
    
    results.forEach(function (ret, index) {
        
        dataArr = !(ret.data === null) ? ret.data.split('/r/n') : [];
        
        dataArr.forEach(function (d, i) {
            value = Number(d.split('|')[1].split('=')[1]);
            if (value <= dirtyData.max && value >= dirtyData.min) {
                count ++;
                allTime += value
            }
        })
        
    });
    
    // 整数加减相除
    return count === 0 ? {} : {
        time: allTime / count
    }
};