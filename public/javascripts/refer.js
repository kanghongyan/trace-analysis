var refer = Vue.extend({
    template: '#refer-template',
    components: {
        'search': search
    },
    data: function () {
        return {
            showForm: false,
            okFun: this.getData,

            pageList: [],
            project: String,
            currentPage: String,
            startTime: String,
            endTime: String
        }
    },
    watch: {
        currentPage: function () {
            fetch_json.bind(this)('/api/refer', {
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime,
                page: this.currentPage
            })
            .then( res => {
                if (res.code == 1) {

                    // 将多天的数据合并，并统计
                    var responseData = [],
                        data = {};

                    _.map(res.data, (item) => {
                        responseData.push(item.data);
                    });

                    _.mergeWith(data, ...responseData, (objValue, srcValue) => {
                        if(typeof objValue === 'number' && typeof srcValue === 'number') {
                            return objValue + srcValue;
                        }
                    });


                    var referrerArr = [],
                        referrerObj = {};

                    for(var i in data) {
                        referrerArr.push([i, data[i]]);
                    }

                    // 获得TOP 10 Refer
                    // [ [url0, cnt0], [url1, cnt1], ... ]
                    referrerArr = _
                        .chain(referrerArr)
                        .orderBy(refer => refer[1], 'desc')
                        .filter((value, key) => key < 10)
                        .value();


                    // { url1: cnt1, url1: cnt2, ... }
                    _.map(referrerArr, (refer) => {
                        referrerObj[refer[0]] = refer[1];
                    })

                    console.log(referrerObj)


                    renderBar(referrerObj, document.getElementById('pvchart-main'))

                } else {
                    alert(res.msg);
                }
            })
            .catch(function(e){
                console.log(e);
            });

        }
    },
    methods: {
        getData: function (startTime, endTime, project) {
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
                .then(res => {
                    if (res.code == 1) {
                        this.showForm = true;
                        this.pageList = res.data;

                    } else {
                        alert(res.msg);
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
});