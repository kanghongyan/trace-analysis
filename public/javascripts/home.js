var app = Vue.extend({
	data: function() {
		return {
			showLoading: false,
			isActive:1
		}
	},
	events: {
		showLoading: function() {
			this.showLoading = true;
		},
		hideLoading: function() {
			this.showLoading = false;
		}
	},
	methods:{
		changeRouter:function(e){
		}
	}
});
router.start(app, '#navList');