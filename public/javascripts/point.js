var point = Vue.extend({
	template: '#pointMain-template',
	components: {
		'search': search,
		'point-chart': pointChart,
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/projectList'
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
				alert('选择开始结束日期');
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/pageT',
				data: {
					project: selName,
					startTime: startTime,
					endTime: endTime
				},
				complete:function(){
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.$broadcast('showChartCon', msg.data);
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