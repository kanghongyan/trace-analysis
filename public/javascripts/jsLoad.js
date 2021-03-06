var jsLoad = Vue.extend({
    template: '#jsLoad-template',
    components: {
        'search': search,
    },
    data: function () {
        return {
            value: '',
            okFun: this.getData
        }
    },
    methods: {
        getData: function (startTime, endTime, project) {
    
            if (!startTime || !endTime || !project) {
                alert('选择开始结束日期');
                return;
            }
    
            fetch_json.bind(this)('/api/jsLoad', {
                    project: project,
                    startTime: startTime,
                    endTime: endTime
                })
                .then( res => {
                    if (res.code === 1) {
                        this.value = res.data ? JSON.stringify(res.data) : '';
                    } else {
                        alert(res.msg);
                    }
                })
                .catch(function(e){
                    console.log(e);
                });
            
        }
    }
});