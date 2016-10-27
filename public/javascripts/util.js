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





function renderLineStack(strippedData, el, KEY='data') {
    var days = strippedData.map( o => o.day );
    
    var legendArr = _
        .chain(strippedData)
        .map(KEY)
        .compact()
        .map( v => Object.keys(v) )
        .flatten()
        .uniq()
        .value();
    
    var seriesArr = legendArr.map( legend => {return {
        name: legend,
        type: 'line',
        data: []
    }} );
    
    for (var j=0; j<strippedData.length; j++) {
        if (strippedData[j][KEY]) {
            for(var i=0; i<legendArr.length; i++) {
                var legendName = legendArr[i];
                seriesArr[i].data.push( strippedData[j][KEY][legendName] );
            }
        }
    }
    
    _renderLineStack(el,legendArr,days,seriesArr);
}



function renderPieLine(strippedData, el, KEY='data') {
    
    var legendArr = _
        .chain(strippedData)
        .map(KEY)
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
        .chain(strippedData)
        .map(KEY)
        .reduce(function(map,c){
            for(k in c) {
                if (c[k])
                    map[k] = c[k] + map[k]
            }
            return map
        }, countMap)
        .map( (v,k) => v )
        .value();
    
    _renderLineStack(el,[],legendArr,[{
        name: '',
        type: 'line',
        data: seriesArr
    }])
}




function renderPie(strippedData, el, KEY='data') {
    
    var legendArr = _
        .chain(strippedData)
        .map(KEY)
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
        .chain(strippedData)
        .map(KEY)
        .reduce(function(map,c){
            for(k in c) {
                if (c[k])
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
    
    _renderPie(el,legendArr,seriesArr)
}





/**
 * 
 * @param {Object} el
 * @param {Object} legendArr
 * ['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
 * @param {Object} xArr
 * ['周一','周二','周三','周四','周五','周六','周日']
 * @param {Object} yArr
 * [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'视频广告',
            type:'line',
            stack: '总量',
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'直接访问',
            type:'line',
            stack: '总量',
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'搜索引擎',
            type:'line',
            stack: '总量',
            data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
 */
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



/**
 * 
 * @param {Object} el
 * @param {Object} legendArr
 * ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
 * @param {Object} serieArr
 * [
        {value:335, name:'直接访问'},
        {value:310, name:'邮件营销'},
        {value:234, name:'联盟广告'},
        {value:135, name:'视频广告'},
        {value:1548, name:'搜索引擎'}
    ]
 */
function _renderPie(el,legendArr,serieArr) {
    var myChart = echarts.init(el);
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            bottom: 50,
            data: legendArr
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
