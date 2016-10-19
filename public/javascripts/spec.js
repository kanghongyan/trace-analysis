var spec = Vue.extend({
	template: '#spec-template',
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/projectList'
		}
	},
	components: {
		'search': search
	},
	events: {},
	methods: {
		
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/spec',
				data: {
					project: selName,
					startTime: startTime,
					endTime: endTime
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.showChart = true;
						that.showCountChart(msg.data);
						that.showCountChart2(msg.data, document.getElementById('spec-chart-main-2'));
						that.showCountChart3(msg.data, document.getElementById('spec-chart-main-3'));
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		
		
		showCountChart: function(initData) {
            var data = {};
            var date = [];
            for (var j = 0; j < initData.length; j++) {
                date.push(initData[j].date);
                for (var n in initData[j].data) {
                    data[n] ? data[n] += initData[j].data[n] : data[n] = initData[j].data[n];
                }
            }
            var r=[];
            for(var m in data){
                r.push({name:'推荐条数为'+m+'的总量：'+data[m],value:data[m]});
            }
            var myChart = echarts.init(document.getElementById('spec-chart-main'));
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
                    name: '展示量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: r
                }]
            };
            myChart.setOption(option);
        },
        
        
        showCountChart2: function(initData, domEl) {
            var data = {};
            var date = [];
            for (var j = 0; j < initData.length; j++) {
                date.push(initData[j].date);
                for (var n in initData[j].data2) {
                    data[n] ? data[n] += initData[j].data2[n] : data[n] = initData[j].data2[n];
                }
            }
            var r=[];
            for(var m in data){
                r.push({name:m+'：'+data[m],value:data[m]});
            }
            var myChart = echarts.init(domEl);
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
                    name: '展示量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: r
                }]
            };
            myChart.setOption(option);
        },
        
        
        
        
        showCountChart3: function(initData, domEl) {
            var data = {};
            var date = [];
            for (var j = 0; j < initData.length; j++) {
                date.push(initData[j].date);
                for (var n in initData[j].data3) {
                    data[n] ? data[n] += initData[j].data3[n] : data[n] = initData[j].data3[n];
                }
            }
            var r=[];
            for(var m in data){
                r.push({name:m+'：'+data[m],value:data[m]});
            }
            var myChart = echarts.init(domEl);
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
                    name: '展示量',
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