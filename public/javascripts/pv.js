var pv = Vue.extend({
	template: '#pvMain-template',
	components: {
		'search': search
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData
		}
	},
	events: {
		showChart: function() {
			this.showChart = true;
		}
	},
	methods: {
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			$.ajax({
				url: '/api/performanceData',
				data: {
					project: selName,
					startTime: startTime,
					endTime: endTime
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.showCountChart(msg.data);
					} else {
						alert('查找失败');
						that.$dispatch('hideLoading');
					}
				},
				erroe: function() {
					alert('查找失败');
					that.$dispatch('hideLoading');
				}
			})
		},
		showCountChart: function(initData) {
			var data = [];
			var date = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				var count = 0;
				for (var m in initData[j].data) {
					count = count + parseInt(initData[j].data[m].count || 0);
				}
				data.push(count);
			}
			var myChart = echarts.init(document.getElementById('pvchart-main'));
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
					data: ['pv']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'pv',
					type: 'bar',
					barMaxWidth: 30,
					data: data
				}]
			};
			myChart.setOption(option);
		}
	}
})