var hourPeak = Vue.extend({
	template: '#hourPeak-template',
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
	},
	methods: {
		showAll: function(initData) {
		    // {"code":1,"data":[{"data":{"0":146,"23":4},"day":"2016-10-12"},
		    //                   {"day":"2016-10-13"},
		    //                   {"data":{"0":11,"23":4},"day":"2016-10-14"}]}
		    if(!initData)
		        return;
		    
            var myChart = echarts.init(document.getElementById('allNumber'));
            
            function genHourMap() {
                var rtn = {};
                for (var i=0; i<24; i++) {
                    rtn[i+''] = 0;
                }
                return rtn;
            }
            
            var finalObj = genHourMap();
            
            initData.forEach(function(item){
                var data = item.data;
            
                for(var d in data) {
                    if (data[d]) {
                        finalObj[d] = finalObj[d] + data[d];
                    }
                }
            })
            
            
            var days = [];
            var data = [];
            
            for(var d in finalObj) {
                days.push(d+'时')
                data.push(finalObj[d])
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
                    data: ['总访问量']
                },
                xAxis: [{
                    type: 'category',
                    data: days
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '总访问量',
                    type: 'bar',
                    barMaxWidth: 30,
                    data: data
                }]
            };
            myChart.setOption(option);
        },
		
		
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime ||!endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/hourPeak',
				data: {
					project: selName,
					startTime: startTime,
					endTime, endTime
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.showChart = true;
						that.showAll(msg.data);

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