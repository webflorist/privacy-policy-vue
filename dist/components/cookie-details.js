import { h } from 'vue'
export default {
	props: {
		cookie: {
			type: Object,
			required: true,
		},
		processors: {
			type: Object,
			required: true,
		},
		type: {
			type: String, // first_party | third_party
			required: true,
		},
		t: {
			type: [Function],
			required: true,
		},
	},
	render(createElement) {
		let e = h
		let isVue3 = true
		if (typeof createElement === 'function') {
			e = createElement
			isVue3 = false
		}
		const getAttrs = (attrs) => {
			if (isVue3) {
				return attrs
			}
			return { attrs: attrs }
		}
		return e('section', [
			e('h4', this.cookie.name),
			e('dl', [
				e('dt', this.t('cookies.purpose.title')),
				e('dd', this.t('cookies.purpose.' + this.cookie.purpose)),
				this.type === 'third_party'
					? [
							e('dt', this.t('cookies.origin')),
							e('dd', [
								this.cookie.service,
								' (',
								e(
									'a',
									getAttrs({ href: '#processor-' + this.cookie.processor }),
									this.processors[this.cookie.processor].name
								),
								')',
							]),
					  ]
					: null,
				e('dt', this.t('cookies.written_on.title')),
				e('dd', this.t('cookies.written_on.' + this.cookie.written_on)),
				e('dt', this.t('cookies.duration.title')),
				e('dd', this.t('cookies.duration.' + this.cookie.duration)),
			]),
		])
	},
}
