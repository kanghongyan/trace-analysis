var pageTChart = Vue.extend({
    template: '#pageTChart-template',
    props: {
        show: {
            type: Boolean
        }
    },
    data: function() {
        return {
            currentData: Object,
            pageList: [],
            currentPage: ''
        }
    },
    events: {
        showChartCon: function(initData) {
            this.currentData = initData;
            this.$dispatch('showChart');
            setTimeout( () => this.populateSelect(initData), 100);
        }
    },
    watch: {
        currentPage: function(page) {
            this.showChartFun(page, document.getElementById('pv-chart'), this.currentData, 'pv');
            this.showChartFun(page, document.getElementById('uv-chart'), this.currentData, 'uv');
            this.showChartFun(page, document.getElementById('lv-chart'), this.currentData, 'lv');
        }
    },
    methods: {
        populateSelect: function(initData) {
            this.pageList = _
                .chain(initData)
                .map('data')
                .compact()
                .map( v => Object.keys(v) )
                .flatten()
                .uniq()
                .value();
            // this.currentPage = this.pageList[0];
        },
        
        
        showChartFun: function(page, el, data, KEY) {
            var days = [];
            var tidList = [];
            for (var i = 0; i < data.length; i++) {
                days.push(data[i].day);
                if(data[i].data[page]){
                    tidList.push(data[i].data[page]);
                }
            }
            for (var k = 0; k < tidList.length; k++) {
                for (var m = 0; m < tidList[k].length; m++) {
                    tidList[k][m].name = tidList[k][m].tid;
                    tidList[k][m].type = 'bar';
                    tidList[k][m].data = tidList[k][m][KEY];
                }
            }
            var d = {};
            for (var n = 0; n < tidList.length; n++) {
                for (var a = 0; a < tidList[n].length; a++) {
                    if (!d[tidList[n][a].tid]) {
                        d[tidList[n][a].tid] = [];
                    }
                    var sub = n - d[tidList[n][a].tid].length;
                    for (var t = 0; t < sub - 1; t++) {
                        d[tidList[n][a].tid].push(0);
                    }
                    d[tidList[n][a].tid].push(tidList[n][a].data);
                }
            }
            var series = [];
            var legend = [];
            for (var h in d) {
                legend.push(h);
                series.push({
                    name: h,
                    type: 'bar',
                    barMaxWidth:30,
                    data: d[h]
                })
            }
            var myChart = echarts.init(el);
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: legend
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: days
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: series
            };
            myChart.setOption(option);
        }
    }
})