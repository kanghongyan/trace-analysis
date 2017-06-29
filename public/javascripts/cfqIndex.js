var cfqIndex = Vue.extend({
    template: '#cfqIndex-template',
    components: {
        'search': search,
    },
    data: function () {
        return {
            cfqIndex_value: '',
            okFun: this.getData
        }
    },
    methods: {
        getData: function (startTime, endTime, project) {
    
            if (!startTime || !endTime || !project) {
                alert('选择开始结束日期');
                return;
            }
    
            fetch_json.bind(this)('/api/cfqIndex', {
                    project: project,
                    startTime: startTime,
                    endTime: endTime,
                    page: 'https://chefenqi.58.com/'
                })
                .then( res => {
                    if (res.code === 1) {
                        this.cfqIndex_value = res.data ? res.data : '';
                        var data = res.data ? res.data[0].data : '';
                        // todo: 只允许选择一天的数据
                        var citys = [];
                        var channels = [];
                        
                        _.forEach(data, function (value, key) {
                            citys.push(key);
                            channels.push(value)
                        });
    
                        
                        citys.sort();
                        
                        var legend = _
                            .chain(channels)
                            .map(function (n) {
                                return _.keys(n)
                            })
                            .reduce(function (ret, cur) {
                                return _.union(ret, cur)
                            }, [])
                            .value();
                        
                        var series = legend.map(function (value) {
                            
                            var d = channels.map(function (n) {
                                    return n[value] || ''
                                });
                            
                            return {
                                name: value,
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'insideRight'
                                    }
                                },
                                data: d
                            }
                        });
                        
                        console.log(citys.length)
                        
                        if (citys.length > 20) {
                            // 城市过多重新设置高度
                            document.getElementById('pvchart-main').style.height = citys.length * 30 + Math.ceil(legend.length / 5)  * 30 + 'px';
                        } else {
                            document.getElementById('pvchart-main').style.height = '480px'
                        }
    
    
                        // var myChart = echarts.init(document.getElementById('pvchart-main'));
                        // var option = {
                        //     tooltip : {
                        //         trigger: 'axis',
                        //         axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        //             type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        //         }
                        //     },
                        //     legend: {
                        //         data: legend
                        //     },
                        //     grid: {
                        //         left: '3%',
                        //         right: '4%',
                        //         bottom: '3%',
                        //         top: Math.ceil(legend.length / 5) * 30,
                        //         containLabel: true
                        //     },
                        //     xAxis:  {
                        //         type: 'value'
                        //     },
                        //     yAxis: {
                        //         type: 'category',
                        //         data: citys
                        //     },
                        //     series: series
                        // }
                        // myChart.setOption(option);
                    } else {
                        alert(res.msg);
                    }
                })
                .catch(function(e){
                    console.log(e);
                });
            
        },
        parseData: function (data) {
            
        }
    }
});