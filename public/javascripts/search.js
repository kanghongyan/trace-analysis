Date.prototype.format=function(){
    var _0=function(){
        return this<10?("0"+this):this;
    };
    return function(s){
        var map={
            y:this.getFullYear(),
            M:_0.call(this.getMonth()+1),
            d:_0.call(this.getDate()),
            H:_0.call(this.getHours()),
            m:_0.call(this.getMinutes()),
            s:_0.call(this.getSeconds())};
        return (s||"{y}-{M}-{d} {H}:{m}:{s}").replace( /{(y|M|d|H|m|s)+}/g, function(s,t){
            return map[t];
        });
    };
}();


var search = Vue.extend({
	template: '#search-template',
	data: function() {
	    
	    var today = (new Date()).format("{yyyy}-{MM}-{dd}");
	    
		return {
			objets: [],
			startTime: today,
			endTime: today,
			selName: '',
		}
	},
	props: {
		okfun: {
			type: Function,
			required: true
		},
		url: {
			type: String
		},
		onetime:{
			type: Boolean
		}
	},
	ready: function() {
		this.getObjet();
	},
	methods: {
		getObjet: function() {
			this.$dispatch('showLoading');
			var that = this;
			$.ajax({
				url: that.url,
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.objets = msg.projects;
						that.selName = that.objets[0];
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		getData: function() {
			if(this.onetime){
				this.okfun(this.startTime, this.selName);
			}else{
				this.okfun(this.startTime, this.endTime, this.selName);
			}
		}
	}
})