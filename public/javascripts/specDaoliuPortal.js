//var _AJAX_RET_ = {
//  "code" : 1,
//  "data" : [{
//          "date" : "2016-10-17",
//          "data" : {
//              "2" : 2978,
//              "4" : 1,
//              "5" : 3979,
//              "7" : 3060
//          },
//          "data2" : {
//              "借点钱" : 6043,
//              "钱站" : 6043,
//              "拍拍贷" : 7039,
//              "量化派-信用钱包" : 7040,
//              "读秒" : 7040,
//              "卡卡贷" : 7039,
//              "我来贷" : 7039
//          },
//          "data3" : {
//              "量化派-信用钱包" : 681,
//              "借点钱" : 1140,
//              "卡卡贷" : 479,
//              "拍拍贷" : 1024,
//              "我来贷" : 580,
//              "读秒" : 818,
//              "钱站" : 317
//          }
//      }
//  ]
//}

var specDaoliuPortal = Vue.extend({
    template: '#specDaoliuPortal-template',
    data: function() {
        return {
            data: '',
            showChart: false,
            okFun: this.getData,
            url: '/api/projectList'
        }
    },
    components: {
        'search': search
    },
    events: {
    },
    methods: {
        
        getData: function(startTime, endTime, selName) {
            var that = this;
            if (!startTime || !endTime || !selName) {
                return;
            }
            that.$dispatch('showLoading');
            that.showChart = true;
            
//          that.showCountChart(_AJAX_RET_.data, document.getElementById('spec-chart-main-1'), 'data');
//          that.showCountChart(_AJAX_RET_.data, document.getElementById('spec-chart-main-2'), 'data2');
//          that.showCountChart(_AJAX_RET_.data, document.getElementById('spec-chart-main-3'), 'data3');
            
            
            $.ajax({
                url: '/api/specDaoliuPortal',
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
                        that.$dispatch('hideLoading');
                        
                        that.showCountChart(msg.data, document.getElementById('spec-chart-main-1'), 'data1');
                        that.showCountChart(msg.data, document.getElementById('spec-chart-main-2'), 'data2');
                        that.showCountChart(msg.data, document.getElementById('spec-chart-main-3'), 'data3');
                    } else {
                        alert('查找失败');
                    }
                },
                error: function() {
                    alert('查找失败');
                }
            })
        },
        
        
        showCountChart: function(initData, domEl, dataK) {

            var r = initData[0][dataK]
            
            var myChart = echarts.init(domEl);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                series: [{
                    name: '展示量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: r
                }]
            };
            myChart.setOption(option);
        }
    }
})