var performance = Vue.extend({
	template: '#performance-template',
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
            fetch_json.bind(this)('/api/performance', {
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
            var dns = [];
            var conn = [];
            var req = [];
            var res = [];
            var rt = [];
            var intr = [];
            
            for (var j = 0; j < data.length; j++) {
                days.push(data[j].day);
                dns.push(data[j].data.dns);
                conn.push(data[j].data.conn);
                req.push(data[j].data.req);
                res.push(data[j].data.res);
                rt.push(data[j].data.rt);
                intr.push(data[j].data.intr);
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
                    data: ['DNS查找时间', '建立链接时间', '发送请求时间', '接受请求时间','加载完成时间','可响应时间']
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: days
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: 'DNS查找时间',
                    type: 'line',
                    data: dns
                }, {
                    name: '建立链接时间',
                    type: 'line',
                    data: conn
                }, {
                    name: '发送请求时间',
                    type: 'line',
                    data: req
                }, {
                    name: '接受请求时间',
                    type: 'line',
                    data: res
                }, {
                    name: '加载完成时间',
                    type: 'line',
                    data: rt
                }, {
                    name: '可响应时间',
                    type: 'line',
                    data: intr
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