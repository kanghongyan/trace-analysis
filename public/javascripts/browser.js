var browser = Vue.extend({
	template: '#browser-template',
	components: {
		'search': search,
		'constant-chart': constantChart
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/infoProjectList'
		}
	},
	events: {
		selPage: function(val) {
			var r = {};
			for (var i = 0; i < this.initData.length; i++) {
				var data = this.initData[i].data;
				if (data[val]) {
					for (var j in data[val]) {

						r[j] ? r[j] += data[val][j] : r[j] = data[val][j];

					}
				}
			}
			var a=[];
			for (var m in r) {
				a.push({
					name: m,
					value: r[m]
				});
			}
			option = {
				title:{
					text:'单页面访问情况',
					 x:'center'
				},
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
					data: a
				}]
			};
			this.$broadcast('showChartFun', option);
		}
	},
	methods: {
		formatData: function(initData) {
			var pageList = [];
			for (var i = 0; i < initData.length; i++) {
				for (var j in initData[i].data) {
					if (pageList.indexOf(j) === -1) {
						pageList.push(j);
					}
				}
			}
			this.selpages = pageList;
			this.initData = initData;
		},
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/browser',
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
						that.formatData(msg.data);
						setTimeout(function() {
							that.showCountChart(that.initData);
						}, 300)
						that.$broadcast('showChartCon', that.initData, that.selpages);

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
					for (var m in initData[j].data[n]) {
						data[m] ? data[m] += initData[j].data[n][m] : data[m] = initData[j].data[n][m];
					}
				}
			}
			var r = [];
			for (var m in data) {
				r.push({
					name: m,
					value: data[m]
				});
			}
			var myChart = echarts.init(document.getElementById('pvchart-main'));
			option = {
				title:{
					text:'总访问情况',
					x:'center'
				},
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