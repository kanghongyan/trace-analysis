var performance = Vue.extend({
	template: '#performance-template',
	components: {
        'search': search
    },
	data: function() {
		return {
			data: '',
            show: false,
            okFun: this.getData,
            currentPage: '',
            pageList: []
		}
	},
	watch: {
        currentPage: function() {
            this.urlChange();
        }
    },
	
	events: {
	},
	methods: {
	    chart: function() {
            var days = [];
            var dns = [];
            var conn = [];
            var req = [];
            var res = [];
            var rt = [];
            var intr = [];
            
            for (var j = 0; j < this.data.length; j++) {
                days.push(this.data[j].day);
                dns.push(this.data[j].data.dns);
                conn.push(this.data[j].data.conn);
                req.push(this.data[j].data.req);
                res.push(this.data[j].data.res);
                rt.push(this.data[j].data.rt);
                intr.push(this.data[j].data.intr);
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
        
        
	    getData: function(startTime, endTime, selName) {
            var that = this;
            if (!startTime || !endTime || !selName) {
                return;
            }
            this.startTime = startTime;
            this.endTime = endTime;
            this.selName = selName;
            that.$dispatch('showLoading');
            $.ajax({
                url: '/api/pageList',
                cache: false,
                data: {
                    startTime: startTime,
                    endTime: endTime,
                    project: selName
                },
                complete: function() {
                    that.$dispatch('hideLoading');
                },
                success: function(msg) {
                    if (msg.code == 1) {
                        that.show = true;
                        that.pageList = msg.data;
                        setTimeout(function(){
                            that.currentPage = msg.data[0] || '';
                        },300)
                    } else {
                        alert('查找失败');
                    }

                },
                error: function() {
                    alert('查找失败');
                }
            })
        },
        
        
	    urlChange: function() {
            var that = this;
            that.$dispatch('showLoading');

            $.ajax({
                url: '/api/performance',
                data: {
                    startTime: that.startTime,
                    endTime: that.endTime,
                    project: that.selName,
                    page: that.currentPage
                },
                complete: function() {
                    that.$dispatch('hideLoading');
                },
                success: function(msg) {
                    if (msg.code == 1) {
                        that.data = msg.data;
                        that.chart();
                    } else {
                        alert('查找失败');
                    }
                },
                error: function() {
                    alert('查找失败');
                }
            })
	    }
	    
	    
	    
	}
})