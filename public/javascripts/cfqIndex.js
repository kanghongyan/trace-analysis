var cfqIndex = Vue.extend({
    template: '#cfqIndex-template',
    components: {
        'search': search,
    },
    data: function () {
        return {
            columns: [],
            rows: [],
            okFun: this.getData
        }
    },
    methods: {
        getData: function (startTime, endTime, project) {
    
            if (!startTime || !endTime || !project) {
                alert('选择开始结束日期');
                return;
            }
    
            fetch_json.bind(this)('/api/cfqIndex', {
                    project: project,
                    startTime: startTime,
                    endTime: endTime,
                    page: 'https://chefenqi.58.com/'
                })
                .then( res => {
                    if (res.code===1 && res.data.length) {
                        
                        this.columns = res.data[0].columns;
                        this.rows = [];
                        
                        var originalData = res.data[0].data;
                        
                        
                        for (var city in originalData) {
                            
                            var channelMap = originalData[city];
                            
                            var displayArr = this.columns.map(function(channelName){
                                return channelMap[channelName] || ''
                            })
                            
                            // 首位显示城市名
                            displayArr.unshift(city);
                            
                            this.rows.push(displayArr);
                        }
                        
                    } else {
                        alert(res.msg);
                    }
                })
                .catch(function(e){
                    console.log(e);
                });
            
        },
        
        
        parseData: function (data) {
            
        }
    }
});