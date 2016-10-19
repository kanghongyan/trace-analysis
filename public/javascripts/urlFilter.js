var urlFilter = Vue.extend({
	template: '#urlFilter-template',
	data: function() {
		return {
			data: '',
			okFun: this.getData,
			url: '/api/projectList',
			show: false,
			pageList: [],
			currentPage: '',
			filterStr: '',
			startTime: '',
			endTime: '',
			selName: ''
		}
	},
	components: {
		'search': search
	},
	events: {},
	methods: {
		showChart: function() {
			var data = {};
			var legend = [];
			var series = [];
			for (var j = 0; j < this.data.length; j++) {
				for (var m in this.data[j].data) {
					if (data[m]) {
						data[m] += this.data[j].data[m];
					} else {
						data[m] = this.data[j].data[m];
					}
				}
			}
			var other = 0;
			for (var k in data) {
				if (k == 'total') {
					continue;
				}
				other += data[k];
				legend.push(k);
				series.push({
					name: k,
					value: data[k]
				});
			}
			legend.push('其他');
				series.push({
					name: '其他',
					value: data.total-other
				});
			var myChart = echarts.init($('#pvchart-main').get(0));

			var option = {
				tooltip: {
					trigger: 'axis'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					data: legend
				},
				series: [{
					name: '访问量',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: series
				}]
			}
			myChart.setOption(option);
		},
		search: function() {
			var that = this;
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/urlFilter',
				data: {
					project: that.selName,
					startTime: that.startTime,
					endTime: that.endTime,
					page: that.currentPage,
					filter: that.filterStr
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.data = msg.data;
						that.showChart();
					}
				}
			})
		},
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.startTime = startTime;
			that.endTime = endTime;
			that.selName = selName;
			that.$dispatch('showLoading');
			that.show = false;
			$.ajax({
				url: '/api/pageList',
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
						that.show = true;
						that.currentPage = msg.data[0] || '';
						that.pageList = msg.data;
					} else {
						alert('查找失败');
					}
				},
				erroe: function() {
					alert('查找失败');
				}
			})
		}
	}
})