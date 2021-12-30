import {
	curlyWrapSingular,
	curlyWrapPlural,
	processors as defaultProcessors,
	renderText,
} from '@webflorist/privacy-policy-text'
import { h } from 'vue'
import CookieDetails from './cookie-details.js'

const PrivacyPolicy = {
	name: 'PrivacyPolicy',
	components: {
		CookieDetails
	},
	props: {
		locale: {
			type: String,
			required: true,
		},
		singular: {
			type: Boolean,
			required: false,
			default: false,
		},
		privacyEmail: {
			type: String,
			required: true,
		},
		cookies: {
			type: [Object, Boolean],
			required: true,
		},
		processors: {
			type: Object,
			required: false,
			default: () => {
				return {}
			},
		},
		dataProcessing: {
			type: Object,
			required: false,
			default: () => {
				return {}
			},
		},
	},
	data() {
		return {
			allProcessors: {},
			messages: {},
			interpolations: {},
			usedProcessors: {},
		}
	},
	created() {
		// Get messages
		this.messages = this.singular ? curlyWrapSingular : curlyWrapPlural

		// Throw error, if stated locale is not supported.
		if (!(this.locale in this.messages)) {
			throw new Error(
				`Package @webflorist/privacy-policy-vue does not support locale "${this.locale}"`
			)
		}

		// Merge custom processors with default ones.
		this.allProcessors = {
			...defaultProcessors,
			...this.processors,
		}

		// Determine used processors and interpolations for translation
		const interpolations = {
			privacy_email: this.privacyEmail,
		}
		const usedProcessors = {}
		for (const [processType, process] of Object.entries(this.dataProcessing)) {
			// Retrieve processor data from allProcessors
			const processorKey = process.processor
			const processor = this.allProcessors[processorKey]

			// Create interpolations for translation of texts.
			interpolations[processType + '_processor_id'] = processorKey
			interpolations[processType + '_processor_name'] = processor.name
			interpolations[processType + '_service'] = process.service

			// Put processor in usedProcessors
			if (!usedProcessors[processorKey]) {
				usedProcessors[processorKey] = processor
			}

			// Add data purpose to processor.
			if (!usedProcessors[processorKey].purposes) {
				usedProcessors[processorKey].purposes = []
			}
			usedProcessors[processorKey].purposes = [
				...new Set([...usedProcessors[processorKey].purposes, processType]),
			]

			// Add data categories to processor.
			if (!usedProcessors[processorKey].data_categories) {
				usedProcessors[processorKey].data_categories = []
			}
			usedProcessors[processorKey].data_categories = [
				...new Set([
					...usedProcessors[processorKey].data_categories,
					...process.data_categories,
				]),
			]
		}
		this.usedProcessors = usedProcessors
		this.interpolations = interpolations
	},
	methods: {
		t(key) {
			return renderText(
				this.interpolate(this.accessNestedProp(key, this.messages[this.locale]))
			)
		},
		interpolate(text) {
			for (const [replaceThis, withThis] of Object.entries(
				this.interpolations
			)) {
				text = text.replaceAll(`{${replaceThis}}`, withThis)
			}
			return text
		},
		accessNestedProp(path, obj) {
			return path.split('.').reduce((p, c) => (p && p[c]) || null, obj)
		},
	},
	computed: {
		cookieTypes() {
			return Object.keys(this.cookies) || []
		},
	},
	render(createElement) {
		let e = h
		let isVue3 = true
		if(typeof createElement === 'function') {
			e = createElement
			isVue3 = false
		}
		const th = (key) => {
			if (isVue3) {
				return {innerHTML:this.t(key)}
			}
			return {domProps:{innerHTML:this.t(key)}}
		}
		const getProps = (props) => {
			if (isVue3) {
				return props
			}
			return {props:props}
		}
		const getAttrs = (attrs) => {
			if (isVue3) {
				return attrs
			}
			return {attrs:attrs}
		}
		const getSlot = (slot) => {
			if (typeof this.$slots[slot] === 'function') {
				return this.$slots[slot]()
			}
			if (typeof this.$slots[slot] === 'object') {
				return this.$slots[slot]
			}
			return null
		}
		const getCookieContent = () => {
			if (this.cookies === false) {
				return e('p', th('cookies.no_cookies_content.p1'))
			}

			const cookieSection = []
			for(const cookieType of this.cookieTypes) {

				const cookieDetails = []
				for(const cookie of this.cookies[cookieType]) {
					cookieDetails.push(
						e(CookieDetails,getProps({cookie: cookie, t: th, processors: this.usedProcessors, type:cookieType}))
					)
				}

				cookieSection.push(e('section',[
					e('h3',th('cookies.' + cookieType + '.title')),
					e('p',th('cookies.' + cookieType + '.content.p1')),
					cookieDetails
				]))
			}


			return [
				e('p',th('cookies.content.p1')),
				e('p',th('cookies.content.p2')),
				e('p',th('cookies.content.p3')),
				cookieSection
			]
		}
		const getProcessorList = () => {
			const processorList = []

			const renderDataPurposes = (purposes) => {
				const dataPurposes = []
				for(const purpose of purposes) {
					dataPurposes.push(
						e('div', [
							e('a', getAttrs({href:'#process-'+purpose}), [
								this.t('data_purpose.'+purpose)
							])
						])
					)
				}
				return dataPurposes
			}
			const renderDataCategories = (categories) => {
				const dataCategories = []
				for(const key in categories) {
					if (key > 0 && key < categories.length) {
						dataCategories.push(', ')
					}
					dataCategories.push(
						e('span', [
							this.t('data_category.'+categories[key])
						])
					)
				}
				return dataCategories
			}
			for (const [key,processor] of Object.entries(this.usedProcessors)) {
				processorList.push(
					e('section',getAttrs({id:'processor-'+key}),[
						e('h3',processor.name),
						e('dl',[
							e('dt',th('address')),
							e('dd',processor.address),
							e('dt',th('data_purpose.title')),
							e('dd',renderDataPurposes(processor.purposes)),
							e('dt',th('data_category.title')),
							e('dd',renderDataCategories(processor.data_categories)),
							e('dt',th('privacy_policy')),
							e('dd',[
								e('a',getAttrs({href:processor.privacy_policy, target:'_blank',rel:'noopener nofollower'}),[
									processor.privacy_policy
								])
							])
						])
					])
				)
			}
			return processorList
		}
		return e('section',[
			e('p',th('intro_content.p1')),
			e('p',th('intro_content.p2')),
			getSlot('after_intro'),
			e('section',[
				e('h2',th('gdpr_rights.title')),
				getSlot('gdpr_rights_start'),
				e('p',th('gdpr_rights.content.p1')),
				e('ul',[
					e('li', th('gdpr_rights.content.ul1.li1')),
					e('li', th('gdpr_rights.content.ul1.li2')),
					e('li', th('gdpr_rights.content.ul1.li3')),
					e('li', th('gdpr_rights.content.ul1.li4')),
					e('li', th('gdpr_rights.content.ul1.li5')),
					e('li', th('gdpr_rights.content.ul1.li6')),
					e('li', th('gdpr_rights.content.ul1.li7')),
				]),				
				e('p',th('gdpr_rights.content.p2')),
				getSlot('gdpr_rights_end')
			]),
			e('section',[
				e('h2',th('security.title')),
				getSlot('security_start'),
				e('p',th('security.content.p1')),
				e('p',th('security.content.p2')),
				getSlot('security_end'),
			]),
			e('section',[
				e('h2',th('cookies.title')),
				getCookieContent(),
				getSlot('cookies_end'),
			]),
			Object.entries(this.dataProcessing).length > 0 ?
				e('section', [
					e('h2',th('data_processing.title')),
					getSlot('data_processing_start'),
					this.dataProcessing.webserver ?
						e('section',getAttrs({id:'process-webserver'}),[
							e('h3',th('data_processing.webserver.title')),
							getSlot('data_processing_webserver_start'),
							e('p',th('data_processing.webserver.content.p1')),
							e('ul', [
								e('li',th('data_processing.webserver.content.ul1.li1')),
								e('li',th('data_processing.webserver.content.ul1.li2')),
								e('li',th('data_processing.webserver.content.ul1.li3')),
								e('li',th('data_processing.webserver.content.ul1.li4'))
							]),
							e('p',th('data_processing.webserver.content.p2')),
							getSlot('data_processing_webserver_end'),
						])
						: null,
					this.dataProcessing.analytics ?
						e('section',getAttrs({id:'process-analytics'}),[
							e('h3',th('data_processing.analytics.title')),
							getSlot('data_processing_analytics_start'),
							e('p',th('data_processing.analytics.content.p1')),
							e('p',th('data_processing.analytics.content.p2')),
							getSlot('data_processing_analytics_end'),
						])
						: null,
					this.dataProcessing.maps ?
						e('section',getAttrs({id:'process-maps'}),[
							e('h3',th('data_processing.maps.title')),
							getSlot('data_processing_maps_start'),
							e('p',th('data_processing.maps.content.p1')),
							e('p',th('data_processing.maps.content.p2')),
							e('p',th('data_processing.maps.content.p3')),
							getSlot('data_processing_maps_end'),
						])
						: null,
					this.dataProcessing.send_emails ?
						e('section',getAttrs({id:'process-send_emails'}),[
							e('h3',th('data_processing.send_emails.title')),
							getSlot('data_processing_send_emails_start'),
							e('p',th('data_processing.send_emails.content.p1')),
							getSlot('data_processing_send_emails_end'),
						])
						: null,					
					getSlot('data_processing_end'),
				])
				: null,
			e('section',[
				e('h2',th('processor_list')),
				getSlot('processor_list_start'),
				getProcessorList(),
				getSlot('processor_list_end'),
			])

		])
	  },
}
export { PrivacyPolicy }
