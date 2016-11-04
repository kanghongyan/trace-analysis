var search = Vue.extend({
    template: '#search-template',
    data: function() {
        var today = (new Date().ago(1,'day')).format("{yyyy}-{MM}-{dd}");
        return {
            projects : [],
            startTime: today,
            endTime:   today,
            projectSelected: ''
        }
    },
    
    ready: function() {
        this.populateSelect();
    },
    
    props: {
        okfun: Function,
        singleMode: false
    },
    
    watch: {
        startTime: function() {
            if (this.singleMode) {
                this.endTime = this.startTime;
            }
        },
        endTime: function() {
            if (this.singleMode) {
                this.startTime = this.endTime;
            }
        }
    },
    
    methods: {
        populateSelect: function() {
            fetch_json('/api/projectList')
            .then( res => {
                if (res.code == 1) {
                    this.projects = res.data;
                    this.projectSelected = this.projects[0];
                }
            })
            .catch(function(e){
                console.log(e);
            });
        },
        
        clickSearchBtn: function() {
            this.okfun(this.startTime, this.endTime, this.projectSelected);
        }
    }
})