var screenSize = Vue.extend({
	template: '#screenSize-template',
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
	methods: {
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/screenSize',
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
						that.showScrSizeChart(msg.data[0].data1);
						that.showDprChart(msg.data[0].data2);
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		
		
		showScrSizeChart: function(data) {
		    var screenChart = echarts.init(document.getElementById('screenChart-main')),
                dataArray = Object.keys(data),
                
                legendArray = dataArray.map(function(item){
                    var sa = item.split(','),
                        last = sa.length-1;
                    return sa[last]
                }),
                
                seriesArray = dataArray.map(function(k){
                    
                    var dataArr = k.split(',');
                    dataArr[0] = +dataArr[0];
                    dataArr[1] = +dataArr[1];
                    dataArr.splice(2,0,data[k]);
                    dataArr[2] = Math.floor( dataArr[2]*10000 );
                    dataArr = [dataArr];
                    
                    return {
                        name: dataArr[0][4],
                        data: dataArr,
                        type: 'scatter',
                        symbolSize: function (data) {
                            return Math.sqrt(data[2]);
                        },
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[3];
                                },
                                position: 'top'
                            }
                        }
                    }
                })
            
            
            var option = {
                title: {text: ''},
                legend: {right: 10, data: legendArray},
                xAxis: {splitLine: {lineStyle: {type: 'dashed'}}},
                yAxis: {splitLine: {lineStyle: {type: 'dashed'}}, scale: true},
                series: seriesArray
            };
            
            
            screenChart.setOption(option);
		},
		
        
        
        showDprChart: function(data) {
            var cakeChart = echarts.init(document.getElementById('screenCake-main')),
                keyArray = Object.keys(data),
                cakeData = keyArray.map(function(k){
                    return { name: k, value: data[k] }
                });
            
            var cakeOption = {
                    title : {
                        text: 'DPR',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: keyArray
                    },
                    series : [{
                        name: 'DPR',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: cakeData,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
            };
            
            cakeChart.setOption(cakeOption);
        }
	}
})