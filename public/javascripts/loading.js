var Loading = Vue.extend({
	template: '#loading-template',
	props: {
		show: {
			type:Boolean
		}
	}
})
Vue.component('Loading', Loading);