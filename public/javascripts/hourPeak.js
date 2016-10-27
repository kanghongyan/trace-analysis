var hourPeak = Vue.extend({
    template: '#hourPeak-template',
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
            
            if (!startTime ||!endTime || !project) {
                return;
            }
            
            fetch_json.bind(this)('/api/hourPeak', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    renderPieLine(res.data, document.getElementById('pvchart-main'))
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
        }
    }
})