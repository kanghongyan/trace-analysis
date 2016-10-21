var screenSize = Vue.extend({
	template: '#screenSize-template',
	components: {
		'search': search
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/projectList'
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
						that.showCountChart(msg);
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		
		
		showCountChart: function(initData) {
			var screenChart = echarts.init(document.getElementById('screenChart-main')),
				cakeChart = echarts.init(document.getElementById('screenCake-main')),
				cakeData = [],
				keyArray = [],
				bubbleData = [];
				lengendArray = [],
				seriesArray = [],
				index = 0,
				colorArray = ['#FFCC00','#00FFCC','#663300','#FF6600','#663333','#CC6666','#FF6666',
				              '#FF0000','#FFCC66','#FF9900','#FF9966','#CC3300','#996666','#660000','#FF3300'];
			
			for(var key in initData.data.screenSize){
				var item = [],
					it = [],
					range,
					lengendTitle;
				if(key == '其他尺寸'){
					continue;
				}				
				item = key.split('*');
				lengendTitle = '[' + (parseInt(item[0]) - 15) + '-' + (parseInt(item[0]) + 15) + ']' + '*' + '[' + (parseInt(item[1]) - 25) + '-' + (parseInt(item[1]) + 25) + ']';
				range = lengendTitle + ':' + initData['data']['screenSize'][key]['rate'];				
				item.push(initData['data']['screenSize'][key]['num']);
				item.push(range);
				item.push(lengendTitle);
				lengendArray.push(lengendTitle);
				it.push(item);
				bubbleData.push(it);
				var colorIndex = index % colorArray.length,
					seriesItem = {
				        name: lengendArray[index],
				        data: bubbleData[index],
				        type: 'scatter',
				        symbolSize: function (data) {
				            return Math.sqrt(data[2])/5;
				        },
				        label: {
				            emphasis: {
				                show: true,
				                formatter: function (param) {
				                    return param.data[3];
				                },
				                position: 'top'
				            }
				        },
				        itemStyle: {
				            normal: {
				                shadowBlur: 10,
				                shadowColor: 'rgba(120, 36, 50, 0.5)',
				                shadowOffsetY: 5,
				                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
				                    offset: 0,
				                    color: colorArray[colorIndex]
				                }, {
				                    offset: 1,
				                    color: colorArray[colorIndex]
				                }])
				            }
				        }
				    };
				seriesArray.push(seriesItem);
				index ++;
			}
			screenOption = {
			    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
			        offset: 0,
			        color: '#f7f8fa'
			    }]),
			    title: {
			        text: '屏幕尺寸气泡图'
			    },
			    legend: {
			        left: 135,
			        data: lengendArray
			    },
			    xAxis: {
			        splitLine: {
			            lineStyle: {
			                type: 'dashed'
			            }
			        }
			    },
			    yAxis: {
			        splitLine: {
			            lineStyle: {
			                type: 'dashed'
			            }
			        },
			        scale: true
			    },
			    series: seriesArray
			};
			if(initData.data.devicePixelRatio){
				keyArray = Object.keys(initData.data.devicePixelRatio);
			} 
			for(var i = 0; i < keyArray.length; i++){
				var perfix = keyArray[i] == "其他" ? '' : '设备像素比为';
				cakeData.push({
					value:initData['data']['devicePixelRatio'][keyArray[i]],
					name: perfix + keyArray[i]
				})
				if(keyArray[i] != '其他'){
					keyArray[i] = '设备像素比为' + keyArray[i];
				}
				
			}
			var cakeOption = {
				    title : {
				        text: '设备像素比',
				        x:'center'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				        data:keyArray
				    },
				    series : [
				        {
				            name: '设备像素比值',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '60%'],
				            data:cakeData,
				            itemStyle: {
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				};
			screenChart.setOption(screenOption);
			cakeChart.setOption(cakeOption);
		}
	}
})