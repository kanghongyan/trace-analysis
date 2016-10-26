var Loading = Vue.extend({
	template: '#loading-template',
	props: {
		show: Boolean
	}
})
Vue.component('Loading', Loading);