var platform = Vue.extend({
    template: '#platform-template',
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
            
            fetch_json.bind(this)('/api/platform', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    renderPie(res.data, document.getElementById('pvchart-main'))
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