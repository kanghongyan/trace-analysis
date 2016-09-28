var perform = Vue.extend({
	template: '#perform-template',
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/infoProjectList'
		}
	},
	components: {
		'constant-chart': constantChart,
		'search': search
	},
	events: {
		selPage: function(val) {
			var date = [];
			var dns = [];
			var conn = [];
			var req = [];
			var res = [];
			var tr = [];
			var intr = [];
			for (var j = 0; j < this.initData.length; j++) {
				date.push(this.initData[j].date);
				dns.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].dns/this.initData[j].data[val].length) : 0);
				conn.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].conn/this.initData[j].data[val].length) : 0);
				req.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].req/this.initData[j].data[val].length) : 0);
				res.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].res/this.initData[j].data[val].length) : 0);
				tr.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].tr/this.initData[j].data[val].length) : 0);
				intr.push(this.initData[j].data[val] ? parseInt(this.initData[j].data[val].intr/this.initData[j].data[val].length) : 0);
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
					data: ['DNS查找时间', '建立链接时间', '发送请求时间', '接受请求时间','加载完成时间','可响应时间']
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
				},
				{
					name: '接受请求时间',
					type: 'line',
					data: res
				},
				{
					name: '加载完成时间',
					type: 'line',
					data: tr
				},
				{
					name: '可响应时间',
					type: 'line',
					data: intr
				}]
			};
			this.$broadcast('showChartFun', option);
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
			this.selpages = a;
			this.initData = initData;
		},
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/performance',
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
						that.$broadcast('showChartCon', that.initData, that.selpages);
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