var performanceChart = Vue.extend({
	template: '#chart-template',
	props: {
		show: {
			type: Boolean
		}
	},
	data: function() {
		return {
			currentData: '',
			pages: [],
			selPage: ''
		}
	},
	events: {
		showChartCon: function(initData) {
			var that = this;
			that.currentData = initData;
			this.$dispatch('showChart');
			setTimeout(function() {
				that.formatData(initData);
			}, 100);
		}
	},
	watch: {
		selPage: function(val) {
			this.showChartFun(val, this.currentData);
			this.showCountChart(val, this.currentData);
		}
	},
	methods: {
		formatData: function(initData) {
			var pageList = {};
			for (var j = 0; j < initData.length; j++) {
				for (var i in initData[j].data) {
					if (pageList[i]) {
						pageList[i]++;
					} else {
						pageList[i] = 1;
					}
				}
			}
			var a = [];
			for (var n in pageList) {
				a.push(n);
			}
			this.pages = a;
			this.selPage = this.pages[0];
			this.showChartFun(this.pages[0], initData);
			this.showCountChart(this.pages[0], initData);
		},
		showChartFun: function(page, initData) {
			var date = [];
			var fileTime = [];
			var domTime = [];
			var jsTime = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				fileTime.push(initData[j].data[page] ? initData[j].data[page].headTime : 0);
				domTime.push(initData[j].data[page] ? initData[j].data[page].docTime : 0);
				jsTime.push(initData[j].data[page] ? initData[j].data[page].jsTime : 0);
			}
			var myChart = echarts.init(document.getElementById('chartMian'));
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
					data: ['白屏时间', 'DOM完成时间', 'js执行完时间', 'win完成时间']
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '白屏时间',
					type: 'line',
					data: fileTime
				}, {
					name: 'DOM完成时间',
					type: 'line',
					data: domTime
				}, {
					name: 'js执行完时间',
					type: 'line',
					data: jsTime
				}]
			};
			myChart.setOption(option);
		},
		showCountChart: function(page, initData) {
			var data = [];
			var date = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				data.push(initData[j].data[page] ? initData[j].data[page].count : 0);
			}
			var myChart = echarts.init(document.getElementById('countMain'));
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
					name: '访问次数',
					type: 'bar',
					barMaxWidth:30,
					data: data
				}]
			};
			myChart.setOption(option);
		}
	}
})