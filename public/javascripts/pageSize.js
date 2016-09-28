var pageSize = Vue.extend({
	template: '#pageSizeMain-template',
	components: {
		'pagesize-chart': pagesizeChart,
		'search': search
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun:this.getData
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
						that.$broadcast('showChartCon', msg.data);
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
		}
	}
})