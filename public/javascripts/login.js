var l = new Vue({
	el: '#loginCon',
	data: {
		name: '',
		password: ''
	},
	methods: {
		toLogin: function() {
			var that = this;
			if (!this.name || !this.password) {
				return;
			}
			$.ajax({
				url: '/login',
				type: 'post',
				data: {
					name: that.name,
					password: that.password
				},
				success: function(msg) {
					if (msg.isLogin == true) {
						location.href = '/home';
					} else {
						alert('密码错误！');
					}
				}
			})
		}
	}
})