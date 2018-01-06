var urlFilter = Vue.extend({
    template: '#urlFilter-template',
    data: function() {
        return {
            showForm: false,
            okFun: this.getData,
            
            pageList: [],
            project: String,
            currentPage: String,
            filterStr: '',
            startTime: String,
            endTime: String
        }
    },
    components: {
        'search': search
    },
    methods: {
        clickSearchBtn: function() {
            fetch_json.bind(this)('/api/urlFilter', {
                project:   this.project,
                page:      this.currentPage,
                filter:    this.filterStr,
                startTime: this.startTime,
                endTime:   this.endTime
            })
            .then( res => {

                var resData = res.data ? res.data : [];

                var pvData = resData.map(function (item) {
                    return {
                        data: item.data.pv,
                        day: item.day
                    }
                });


                var uvData = resData.map(function (item) {
                    return {
                        data: item.data.uv,
                        day: item.day
                    }
                })


                if (res.code == 1) {
                    renderPie(pvData, document.getElementById('pvchart-main'));
                    renderPie(uvData, document.getElementById('uvchart-main'))
                } else {
                    alert(res.msg);
                }
            })
            .catch(function(e){
                console.log(e);
            });
        },
        
        
        getData: function(startTime, endTime, project) {
            if (!startTime || !endTime || !project) {
                return;
            }
            
            this.startTime = startTime;
            this.endTime = endTime;
            this.project = project;
            
            fetch_json.bind(this)('/api/pageList', {
                project: project,
                startTime: startTime,
                endTime: endTime
            })
            .then( res => {
                if (res.code == 1) {
                    this.showForm = true;
                    this.pageList = res.data;
                    //setTimeout( () => {
                    //    this.currentPage = res.data[0] || '';
                    //},300)
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