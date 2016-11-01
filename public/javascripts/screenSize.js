var screenSize = Vue.extend({
    template: '#screenSize-template',
    components: {
        'search': search
    },
    data: function() {
        return {
            okFun: this.getData
        }
    },
    methods: {
        getData: function(startTime, endTime, project) {
            
            if (!startTime || !endTime || !project) {
                return;
            }
            
            fetch_json.bind(this)('/api/screenSize', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    // 屏幕尺寸气泡图
                    this.showScrSizeChart(res.data[0].data1, document.getElementById('screenChart-main'));
                    // dpr饼图
                    renderPie(res.data, document.getElementById('screenCake-main'), 'data2')
                } else {
                    alert(res.msg);
                }
            })
            .catch(function(e){
                console.log(e);
            });
        },
        
        
        showScrSizeChart: function(data,el) {
            var screenChart = echarts.init(el),
                dataArray = Object.keys(data),
                
                legendArray = dataArray.map(function(item){
                    var sa = item.split(','),
                        last = sa.length-1;
                    return sa[last]
                }),
                
                seriesArray = dataArray.map(function(k){
                    
                    var dataArr = k.split(',');
                    dataArr[0] = +dataArr[0];
                    dataArr[1] = +dataArr[1];
                    dataArr.splice(2,0,data[k]);
                    dataArr[2] = Math.floor( dataArr[2]*10000 );
                    dataArr = [dataArr];
                    
                    return {
                        name: dataArr[0][4],
                        data: dataArr,
                        type: 'scatter',
                        symbolSize: function (data) {
                            return Math.sqrt(data[2]);
                        },
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        }
                    }
                })
            
            
            var option = {
                title: {text: ''},
                legend: {right: 10, data: legendArray},
                xAxis: {splitLine: {lineStyle: {type: 'dashed'}}},
                yAxis: {splitLine: {lineStyle: {type: 'dashed'}}, scale: true},
                series: seriesArray
            };
            
            
            screenChart.setOption(option);
        }
    }
})