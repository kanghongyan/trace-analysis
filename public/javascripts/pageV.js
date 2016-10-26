var pageV = Vue.extend({
    template: '#pageV-template',
    components: {
        'search': search
    },
    data: function() {
        return {
            showForm: false,
            okFun: this.getData,
            
            pageList: [],
            currentPage: String,
            startTime: String,
            endTime: String,
            project: String
        }
    },
    watch: {
        currentPage: function() {
            fetch_json.bind(this)('/api/pageV', {
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime,
                page: this.currentPage
            })
            .then( res => {
                if (res.code == 1) {
                    this.renderChart(res.data);
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
        }
    },
    methods: {
        renderChart: function(data) {
            var days = [];
            var uv = [];
            var pv = [];
            var lv = [];
            for (var j = 0; j < data.length; j++) {
                days.push(data[j].day);
                uv.push(data[j].data.uv);
                pv.push(data[j].data.pv);
                lv.push(data[j].data.lv);
            }
            var myChart = echarts.init(document.getElementById('pvchart-main'));
            var option = {
                tooltip: {
                    trigger: 'axis'
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
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['uv', 'pv', '登录数']
                },
                xAxis: [{
                    type: 'category',
                    data: days
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'pv',
                    type: 'line',
                    data: pv
                }, {
                    name: 'uv',
                    type: 'line',
                    data: uv
                }, {
                    name: '登录数',
                    type: 'line',
                    data: lv
                }]
            };
            myChart.setOption(option);
        },
        
        
        getData: function(startTime, endTime, project) {
            if (!startTime || !endTime || !project) {
                return;
            }
            
            this.startTime = startTime;
            this.endTime = endTime;
            this.project = project;
            
            fetch_json.bind(this)('/api/pageList', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    this.showForm = true;
                    this.pageList = res.data;
                    setTimeout( () => {
                        //this.currentPage = res.data[0] || '';
                    },300)
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
            
        }
    }
})