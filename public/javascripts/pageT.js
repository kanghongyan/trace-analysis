var pageT = Vue.extend({
    template: '#pageT-template',
    components: {
        'search': search,
        'page-t-chart': pageTChart,
    },
    data: function() {
        return {
            showChart: false,
            okFun: this.getData
        }
    },
    events: {
        showChart: function() {
            this.showChart = true;
        }
    },
    methods: {
        getData: function(startTime, endTime, project) {
            
            if (!startTime || !endTime || !project) {
                alert('选择开始结束日期');
                return;
            }
            
            fetch_json.bind(this)('/api/pageT', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    this.$broadcast('showChartCon', res.data);
                } else {
                    alert(res.msg);
                }
            })
            .catch(function(e){
                console.log(e);
            });
            
        }
    }
})