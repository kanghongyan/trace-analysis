var performance = Vue.extend({
	template: '#performance-template',
	components: {
        'search': search
    },
	data: function() {
		return {
            showForm: false,
            okFun: this.getData,
            
            pageList: [],
            currentPage: String,
            startTime: String,
            endTime: String,
            project: String
		}
	},
	watch: {
        currentPage: function() {
            fetch_json.bind(this)('/api/performance', {
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime,
                page: this.currentPage
            })
            .then( res => {
                if (res.code == 1) {
                    renderLineStack(res.data, document.getElementById('pvchart-main'))
                } else {
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
        }
    },
	methods: {
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
                    alert('查找失败');
                }
            })
            .catch(function(e){
                console.log(e);
            });
            
        }
	    
	    
	}
})