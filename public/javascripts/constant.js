var constant = Vue.extend({
	template: '#constant-template',
	components: {
		'search': search,
		'constant-chart': constantChart
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			oneTime: true,
			url: '/api/infoProjectList'
		}
	},
	events: {
		selPage: function(val) {
			var date = [];
			var data = [];
			for (var j in this.initData[val]) {
				date.push(j + '时');
				data.push(this.initData[val][j]);
			}
			option = {
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
					data: ['访问次数']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '访问量',
					type: 'line',
					data: data
				}]
			};
			this.$broadcast('showChartFun', option);
		}
	},
	methods: {
		showAll: function(data) {
			var myChart = echarts.init(document.getElementById('allNumber'));
			var date = [];

			var dataR = {};
			for (var i in data) {
				for (var h in data[i]) {
					dataR[h] ? dataR[h] += data[i][h] : dataR[h] = data[i][h];
				}
			}
			var data = [];
			for (var j in dataR) {
				date.push(j + '时');
				data.push(dataR[j]);
			}
			option = {
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
					data: ['总访问量']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '总访问量',
					type: 'bar',
					barMaxWidth: 30,
					data: data
				}]
			};
			myChart.setOption(option);
		},
		formatData: function(initData) {
			var pageList = [];
			for (var i in initData) {
				pageList.push(i);
			}
			this.selpages = pageList;
			this.initData = initData;
		},
		getData: function(time, selName) {
			var that = this;
			if (!time || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/dayData',
				data: {
					project: selName,
					time: time
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.showChart = true;
						that.formatData(msg.data);
						setTimeout(function() {
							that.showAll(that.initData);
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
		}
	}
})