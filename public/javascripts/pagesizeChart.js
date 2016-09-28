var pagesizeChart = Vue.extend({
	template: '#pagesize-template',
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
		}
	},
	methods: {
		formatData: function(initData) {
			var pageList = [];
			for (var j = 0; j < initData.length; j++) {
				for (var i in initData[j].data) {
					if (pageList.indexOf(i) == -1) {
						pageList.push(i);
					}
				}
			}
			this.pages = pageList;
			this.selPage = this.pages[0];
			this.showChartFun(this.pages[0], initData);
		},
		showChartFun: function(page, initData) {
			var date = [];
			var docSize = [];
			var headSize = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				docSize.push(initData[j].data[page] ? initData[j].data[page].docSize : 0);
				headSize.push(initData[j].data[page] ? initData[j].data[page].headSize : 0);
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
					data: ['docSize', 'headSize']
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
					name: 'docSize',
					type: 'line',
					data: docSize
				}, {
					name: 'headSize',
					type: 'line',
					data: headSize
				}]
			};
			myChart.setOption(option);
		}
	}
})