var platform = Vue.extend({
    template: '#platform-template',
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
            
            fetch_json.bind(this)('/api/platform', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    this.showCountChart(res.data);
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
        },
        showCountChart: function(initData) {
            var data = {};
            for (var j = 0; j < initData.length; j++) {
                for (var n in initData[j].data) {
                    data[n] ? data[n] += initData[j].data[n] : data[n] = initData[j].data[n];
                }
            }
            var r=[];
            for(var m in data){
                r.push({name:m,value:data[m]});
            }
            var myChart = echarts.init(document.getElementById('pvchart-main'));
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: r
                }]
            };
            myChart.setOption(option);
        }
    }
})