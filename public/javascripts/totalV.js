var totalV = Vue.extend({
	template: '#totalV-template',
	components: {
		'search': search
	},
	data: function() {
		return {
			okFun: this.getData
		}
	},
	methods: {
		getData: function(startTime, endTime, project) {
			
			if (!startTime || !endTime || !project) {
				return;
			}
			
			fetch_json.bind(this)('/api/totalV', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    this.renderChart(res.data);
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
		},
		
		
		renderChart: function(data) {
			var days = [];
			var uv=[];
			var pv=[];
			var lv=[];
			for (var j = 0; j < data.length; j++) {
				days.push(data[j].day);
				uv.push(data[j].data.uv);
				pv.push(data[j].data.pv);
				lv.push(data[j].data.lv);
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
					data: ['uv','pv','登录数']
				},
				xAxis: [{
					type: 'category',
					data: days
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'uv',
					type: 'line',
					data: uv
				},{
					name: 'pv',
					type: 'line',
					data: pv
				},{
					name: '登录数',
					type: 'line',
					data: lv
				}]
			};
			myChart.setOption(option);
		}
	}
})