var util = {
        initAjax: function() {
            //备份jquery的ajax方法  
            var _ajax = $.ajax;
            //重写jquery的ajax方法  
            $.ajax = function(opt) {
                //备份opt中error和success方法  
                var fn = {
                    error: function(XMLHttpRequest, textStatus, errorThrown) {},
                    success: function(data, textStatus) {},
                    complete:function(XMLHttpRequest, textStatus){}
                }
                if (opt.error) {
                    fn.error = opt.error;
                }
                if (opt.success) {
                    fn.success = opt.success;
                }
                if(opt.complete){
                    fn.complete = opt.complete;
                }
                //扩展增强处理  
                var _opt = $.extend(opt, {
                    complete:function(){

                        fn.complete(XMLHttpRequest);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        //错误方法增强处理  

                        fn.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function(data, textStatus) {
                        //成功回调方法增强处理  
                        if (data.code == -1) {
                            location.href = '/login';
                        }else{
                            fn.success(data, textStatus);
                        }
                    }
                });
                _ajax(_opt);
            }
        }
    }
util.initAjax();



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


Date.prototype.ago=function(long,ago){
    if(!long)return this;
    ago=!/day|week|month|year/i.test(ago)?"day":ago.toLowerCase();
    if(ago=="day")return new Date(this.getTime()-long*86400000);
    if(ago=="week")return new Date(this.getTime()-long*7*86400000);
    
    var y=this.getFullYear(),
        M=this.getMonth()+1,
        d=this.getDate(),
        time=this.getHours()+":"+this.getMinutes()+":"+this.getSeconds();
        
    if(ago=="month"){
        M-=long;
        y+=parseInt(M/12);
        M=M%12;
        if(M<=0){
            M=12+M;
            y--;
        }
    }else if(ago=="year"){
        y-=long;
    }
    var date=new Date(M+"/"+d+"/"+y+" "+time);
    
    
    return date.getDate()!=d ? 
        new Date((M+1)+"/1/"+y+" "+time).ago(1) : date;
};





function fetch_json(url, params) {
    
    function _format_url() {
        var a = document.createElement('a');
        a.href = url;
        url = new URL(a.href);
        Object.keys(params).forEach( key => url.searchParams.append(key, params[key]) );
    }
    
    // get请求包含参数?
    if (typeof url === 'string' && params) {
        _format_url();
    }
    // 展示loading模态
    this.$dispatch && this.$dispatch('showLoading');
    
    return fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    })
    .then( response => response.json() )
    .then( res => {
        // 关闭loading模态
        this.$dispatch && this.$dispatch('hideLoading');
        
        if (res.code == -1) {
            location.href = '/login';
            throw 'Session expires!'
        } else {
            return res;
        }
    })
}





function renderLineStack(data, el) {
    var days = data.map( o => o.day );
    
    var legendArr = _
        .chain(data)
        .map('data')
        .compact()
        .map( v => Object.keys(v) )
        .flatten()
        .uniq()
        .value();
    
    var serieMap = legendArr.map( legend => {return {
        name: legend,
        type: 'line',
        data: []
    }} );
    
    for (var j=0; j<data.length; j++) {
        if (data[j]['data']) {
            for(var i=0; i<legendArr.length; i++) {
                var legendName = legendArr[i];
                serieMap[i].data.push( data[j]['data'][legendName] );
            }
        }
    }
    
    _renderLineStack(el,legendArr,days,serieMap);
}


function _renderLineStack(el,legendArr,xArr,yArr) {
    var myChart = echarts.init(el);
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legendArr
        },
        xAxis: [{
            type: 'category',
            data: xArr
        }],
        yAxis: [{
            type: 'value'
        }],
        series: yArr
    };
    myChart.setOption(option);
}






function renderPie(initData, el) {
    
    var legendArr = _
        .chain(initData)
        .map('data')
        .compact()
        .map( v => Object.keys(v) )
        .flatten()
        .uniq()
        .value();
    
    var countMap = legendArr.reduce( (map, legend) => {
        map[legend] = 0
        return map
    }, {} );
    
    var seriesArr = _
        .chain(initData)
        .map('data')
        .reduce(function(map,c){
            for(k in c) {
                 map[k] = c[k] + map[k]
            }
            return map
        }, countMap)
        .map(function(v,k){
            return {
                name: k,
                value: v
            }
        })
        .value();
    
    _renderPie(el,seriesArr)
}


function _renderPie(el,serieArr) {
    var myChart = echarts.init(el);
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            name: '来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: serieArr
        }]
    };
    myChart.setOption(option);
}
