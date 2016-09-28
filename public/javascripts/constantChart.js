var constantChart = Vue.extend({
	template: '#constantChart-template',
	props: {
		show: {
			type: Boolean
		}
	},
	data: function() {
		return {
			selPages: [],
			currentPage: ''
		}
	},
	events: {
		showChartCon: function(initData, selPages) {
			var that = this;
			this.selPages = selPages;
			this.currentPage = this.selPages[0];
		},
		showChartFun: function(option) {

			var myChart = echarts.init(document.getElementById('pointMian'));

			myChart.setOption(option);
		}
	},
	watch: {
		currentPage: function() {
			this.$dispatch('selPage',this.currentPage);
		}
	}
})