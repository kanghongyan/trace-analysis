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
                    page: 'http://chefenqi.58.com'
                })
                .then( res => {
                    if (res.code===1 && res.data.length) {
                        
                        var originalData = res.data[0].data;
                        
                        var columns = res.data[0].columns;
                        var rows = [];
                        
                        columns = _.sortBy(columns, function(column){ return column; });
                        
                        for (var city in originalData) {
                            
                            var channelMap = originalData[city];
                            
                            var displayArr = columns.map(function(channelName){
                                return channelMap[channelName] || ''
                            })
                            
                            // 首位显示城市名 - row
                            displayArr.unshift(city);
                            
                            rows.push(displayArr);
                        }
                        
                        this.rows = _.sortBy(rows, function(row){ return row[0]; });
                        
                        // 首位显示城市名 - header
                        columns.unshift('');
                        this.columns = columns;
                        
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