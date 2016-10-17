var byPage = Vue.extend({
	template: '#bypage-template',
	components: {
		'search': search
	},
	data: function() {
		return {
			data: '',
			show: false,
			okFun: this.getData,
			currentPage: '',
			url: '/api/infoProjectList',
			pageList: ''
		}
	},
	watch: {
		currentPage: function() {
			this.urlChange();
		}
	},
	methods: {
		chart: function() {
			var date = [];
			var uv = [];
			var pv = [];
			var lv = [];
			for (var j = 0; j < this.data.length; j++) {
				date.push(this.data[j].day);
				uv.push(this.data[j].data.uv);
				pv.push(this.data[j].data.pv);
				lv.push(this.data[j].data.lv);
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
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'uv',
					type: 'line',
					data: uv
				}, {
					name: 'pv',
					type: 'line',
					data: pv
				}, {
					name: '登录数',
					type: 'line',
					data: lv
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
				url: '/api/pageInfo',
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