'use strict'

var PrivacyPolicyText = require('@webflorist/privacy-policy-text')
var vue = require('vue')

function _interopDefaultLegacy(e) {
	return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var PrivacyPolicyText__default =
	/*#__PURE__*/ _interopDefaultLegacy(PrivacyPolicyText)

var script$1 = {
	name: 'CookieDetails',
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
}

const _hoisted_1$1 = ['innerHTML']
const _hoisted_2$1 = ['href']
const _hoisted_3$1 = /*#__PURE__*/ vue.createTextVNode(') ')
const _hoisted_4$1 = ['innerHTML']
const _hoisted_5$1 = ['innerHTML']

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		vue.openBlock(),
		vue.createElementBlock('section', null, [
			vue.createElementVNode(
				'h4',
				null,
				vue.toDisplayString($props.cookie.name),
				1 /* TEXT */
			),
			vue.createElementVNode('dl', null, [
				vue.createElementVNode(
					'dt',
					null,
					vue.toDisplayString($props.t('cookies.purpose.title')),
					1 /* TEXT */
				),
				vue.createElementVNode(
					'dd',
					{
						innerHTML: $props.t('cookies.purpose.' + $props.cookie.purpose),
					},
					null,
					8 /* PROPS */,
					_hoisted_1$1
				),
				$props.type === 'third_party'
					? (vue.openBlock(),
					  vue.createElementBlock(
							vue.Fragment,
							{ key: 0 },
							[
								vue.createElementVNode(
									'dt',
									null,
									vue.toDisplayString($props.t('cookies.origin')),
									1 /* TEXT */
								),
								vue.createElementVNode('dd', null, [
									vue.createTextVNode(
										vue.toDisplayString($props.cookie.service) + ' (',
										1 /* TEXT */
									),
									vue.createElementVNode(
										'a',
										{
											href: '#processor-' + $props.cookie.processor,
										},
										vue.toDisplayString(
											$props.processors[$props.cookie.processor].name
										),
										9 /* TEXT, PROPS */,
										_hoisted_2$1
									),
									_hoisted_3$1,
								]),
							],
							64 /* STABLE_FRAGMENT */
					  ))
					: vue.createCommentVNode('v-if', true),
				vue.createElementVNode(
					'dt',
					null,
					vue.toDisplayString($props.t('cookies.written_on.title')),
					1 /* TEXT */
				),
				vue.createElementVNode(
					'dd',
					{
						innerHTML: $props.t(
							'cookies.written_on.' + $props.cookie.written_on
						),
					},
					null,
					8 /* PROPS */,
					_hoisted_4$1
				),
				vue.createElementVNode(
					'dt',
					null,
					vue.toDisplayString($props.t('cookies.duration.title')),
					1 /* TEXT */
				),
				vue.createElementVNode(
					'dd',
					{
						innerHTML: $props.t('cookies.duration.' + $props.cookie.duration),
					},
					null,
					8 /* PROPS */,
					_hoisted_5$1
				),
			]),
		])
	)
}

script$1.render = render$1
script$1.__file = 'src/components/CookieDetails.vue'

var script = {
	name: 'PrivacyPolicy',
	components: {
		CookieDetails: script$1,
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
		dataController: {
			type: Object,
			required: true,
			default: () => {
				return {
					organisation: null,
					name: null,
					address: null,
					email: null,
					phone: null,
				}
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
		this.messages = this.singular
			? PrivacyPolicyText__default['default'].curlyWrapSingular
			: PrivacyPolicyText__default['default'].curlyWrapPlural

		// Throw error, if stated locale is not supported.
		if (!(this.locale in this.messages)) {
			throw new Error(
				`Package @webflorist/privacy-policy-vue does not support locale "${this.locale}"`
			)
		}

		// Merge custom processors with default ones.
		this.allProcessors = {
			...PrivacyPolicyText__default['default'].processors,
			...this.processors,
		}

		// Determine used processors and interpolations for translation
		const interpolations = {}
		const usedProcessors = {}
		for (const [processType, process] of Object.entries(this.dataProcessing)) {
			const processors = Array.isArray(process.processor)
				? process.processor
				: [process.processor]

			// Create interpolations for translation of texts.
			const processorLinks = []
			for (const processorKey of processors) {
				if (!this.allProcessors[processorKey]) {
					throw new Error(
						`@webflorist/privacy-policy-vue: Processor "${processorKey}" used for data-processing "${processType}" not found in processor-list. Please state processor details via the "processors" property.`
					)
				}
				const processorName = this.allProcessors[processorKey].name
				processorLinks.push(
					'<a href="#processor-' + processorKey + '">' + processorName + '</a>'
				)
			}
			interpolations[processType + '_processor'] = processorLinks.join(', ')

			interpolations[processType + '_service'] =
				process.service || this.t('data_processing.' + processType + '.title')

			// Put processors in usedProcessors
			for (const processorKey of processors) {
				if (!usedProcessors[processorKey]) {
					usedProcessors[processorKey] = this.allProcessors[processorKey]
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
		}
		this.usedProcessors = usedProcessors
		this.interpolations = interpolations
	},
	methods: {
		t(key) {
			return PrivacyPolicyText__default['default'].renderText(
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
}

const _hoisted_1 = ['innerHTML']
const _hoisted_2 = ['innerHTML']
const _hoisted_3 = ['innerHTML']
const _hoisted_4 = ['innerHTML']
const _hoisted_5 = ['innerHTML']
const _hoisted_6 = ['innerHTML']
const _hoisted_7 = ['innerHTML']
const _hoisted_8 = ['innerHTML']
const _hoisted_9 = ['innerHTML']
const _hoisted_10 = ['innerHTML']
const _hoisted_11 = ['innerHTML']
const _hoisted_12 = { key: 0 }
const _hoisted_13 = { key: 1 }
const _hoisted_14 = { key: 2 }
const _hoisted_15 = { key: 3 }
const _hoisted_16 = ['href']
const _hoisted_17 = { key: 4 }
const _hoisted_18 = ['href']
const _hoisted_19 = ['innerHTML']
const _hoisted_20 = ['innerHTML']
const _hoisted_21 = ['innerHTML']
const _hoisted_22 = ['innerHTML']
const _hoisted_23 = ['innerHTML']
const _hoisted_24 = ['innerHTML']
const _hoisted_25 = ['innerHTML']
const _hoisted_26 = { key: 0 }
const _hoisted_27 = {
	key: 0,
	id: 'process-webhosting',
}
const _hoisted_28 = ['innerHTML']
const _hoisted_29 = ['innerHTML']
const _hoisted_30 = ['innerHTML']
const _hoisted_31 = ['innerHTML']
const _hoisted_32 = ['innerHTML']
const _hoisted_33 = ['innerHTML']
const _hoisted_34 = {
	key: 1,
	id: 'process-analytics',
}
const _hoisted_35 = ['innerHTML']
const _hoisted_36 = ['innerHTML']
const _hoisted_37 = {
	key: 2,
	id: 'process-maps',
}
const _hoisted_38 = ['innerHTML']
const _hoisted_39 = ['innerHTML']
const _hoisted_40 = ['innerHTML']
const _hoisted_41 = {
	key: 3,
	id: 'process-send_emails',
}
const _hoisted_42 = ['innerHTML']
const _hoisted_43 = ['innerHTML']
const _hoisted_44 = ['id']
const _hoisted_45 = ['href']
const _hoisted_46 = /*#__PURE__*/ vue.createTextVNode(', ')
const _hoisted_47 = ['href']
const _hoisted_48 = /*#__PURE__*/ vue.createElementVNode(
	'dt',
	null,
	'Privacy Shield',
	-1 /* HOISTED */
)
const _hoisted_49 = ['href']

function render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_CookieDetails = vue.resolveComponent('CookieDetails')

	return (
		vue.openBlock(),
		vue.createElementBlock('section', null, [
			vue.createElementVNode(
				'p',
				{
					innerHTML: $options.t('intro_content.p1'),
				},
				null,
				8 /* PROPS */,
				_hoisted_1
			),
			vue.createElementVNode(
				'p',
				{
					innerHTML: $options.t('intro_content.p2'),
				},
				null,
				8 /* PROPS */,
				_hoisted_2
			),
			vue.renderSlot(_ctx.$slots, 'after_intro'),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('gdpr_rights.title')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'gdpr_rights_start'),
				vue.createElementVNode(
					'p',
					{
						innerHTML: $options.t('gdpr_rights.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_3
				),
				vue.createElementVNode('ul', null, [
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li1'),
						},
						null,
						8 /* PROPS */,
						_hoisted_4
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li2'),
						},
						null,
						8 /* PROPS */,
						_hoisted_5
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li3'),
						},
						null,
						8 /* PROPS */,
						_hoisted_6
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li4'),
						},
						null,
						8 /* PROPS */,
						_hoisted_7
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li5'),
						},
						null,
						8 /* PROPS */,
						_hoisted_8
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li6'),
						},
						null,
						8 /* PROPS */,
						_hoisted_9
					),
					vue.createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li7'),
						},
						null,
						8 /* PROPS */,
						_hoisted_10
					),
				]),
				vue.renderSlot(_ctx.$slots, 'gdpr_rights_end'),
			]),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('data_controller.title')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'data_controller_start'),
				vue.createElementVNode(
					'p',
					{
						innerHTML: $options.t('data_controller.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_11
				),
				vue.createElementVNode('address', null, [
					$props.dataController.organisation
						? (vue.openBlock(),
						  vue.createElementBlock(
								'div',
								_hoisted_12,
								vue.toDisplayString($props.dataController.organisation),
								1 /* TEXT */
						  ))
						: vue.createCommentVNode('v-if', true),
					$props.dataController.name
						? (vue.openBlock(),
						  vue.createElementBlock(
								'div',
								_hoisted_13,
								vue.toDisplayString($props.dataController.name),
								1 /* TEXT */
						  ))
						: vue.createCommentVNode('v-if', true),
					$props.dataController.address
						? (vue.openBlock(),
						  vue.createElementBlock(
								'div',
								_hoisted_14,
								vue.toDisplayString($props.dataController.address),
								1 /* TEXT */
						  ))
						: vue.createCommentVNode('v-if', true),
					$props.dataController.email
						? (vue.openBlock(),
						  vue.createElementBlock('div', _hoisted_15, [
								vue.createElementVNode(
									'a',
									{
										href: 'mailto:' + $props.dataController.email,
									},
									vue.toDisplayString($props.dataController.email),
									9 /* TEXT, PROPS */,
									_hoisted_16
								),
						  ]))
						: vue.createCommentVNode('v-if', true),
					$props.dataController.phone
						? (vue.openBlock(),
						  vue.createElementBlock('div', _hoisted_17, [
								vue.createElementVNode(
									'a',
									{
										href: 'tel:' + $props.dataController.phone,
									},
									vue.toDisplayString($props.dataController.phone),
									9 /* TEXT, PROPS */,
									_hoisted_18
								),
						  ]))
						: vue.createCommentVNode('v-if', true),
				]),
				vue.renderSlot(_ctx.$slots, 'data_controller_end'),
			]),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('security.title')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'security_start'),
				vue.createElementVNode(
					'p',
					{
						innerHTML: $options.t('security.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_19
				),
				vue.createElementVNode(
					'p',
					{
						innerHTML: $options.t('security.content.p2'),
					},
					null,
					8 /* PROPS */,
					_hoisted_20
				),
				vue.renderSlot(_ctx.$slots, 'security_end'),
			]),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('cookies.title')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'cookies_start'),
				$props.cookies === false
					? (vue.openBlock(),
					  vue.createElementBlock(
							'p',
							{
								key: 0,
								innerHTML: $options.t('cookies.no_cookies_content.p1'),
							},
							null,
							8 /* PROPS */,
							_hoisted_21
					  ))
					: (vue.openBlock(),
					  vue.createElementBlock(
							vue.Fragment,
							{ key: 1 },
							[
								vue.createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p1'),
									},
									null,
									8 /* PROPS */,
									_hoisted_22
								),
								vue.createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p2'),
									},
									null,
									8 /* PROPS */,
									_hoisted_23
								),
								vue.createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p3'),
									},
									null,
									8 /* PROPS */,
									_hoisted_24
								),
								(vue.openBlock(true),
								vue.createElementBlock(
									vue.Fragment,
									null,
									vue.renderList($options.cookieTypes, (cookieType) => {
										return (
											vue.openBlock(),
											vue.createElementBlock('section', { key: cookieType }, [
												vue.createElementVNode(
													'h3',
													null,
													vue.toDisplayString(
														$options.t('cookies.' + cookieType + '.title')
													),
													1 /* TEXT */
												),
												vue.createElementVNode(
													'p',
													{
														innerHTML: $options.t(
															'cookies.' + cookieType + '.content.p1'
														),
													},
													null,
													8 /* PROPS */,
													_hoisted_25
												),
												(vue.openBlock(true),
												vue.createElementBlock(
													vue.Fragment,
													null,
													vue.renderList(
														$props.cookies[cookieType],
														(cookie, key) => {
															return (
																vue.openBlock(),
																vue.createBlock(
																	_component_CookieDetails,
																	{
																		key: key,
																		cookie: cookie,
																		t: $options.t,
																		processors: $data.usedProcessors,
																		type: cookieType,
																	},
																	null,
																	8 /* PROPS */,
																	['cookie', 't', 'processors', 'type']
																)
															)
														}
													),
													128 /* KEYED_FRAGMENT */
												)),
											])
										)
									}),
									128 /* KEYED_FRAGMENT */
								)),
							],
							64 /* STABLE_FRAGMENT */
					  )),
				vue.renderSlot(_ctx.$slots, 'cookies_end'),
			]),
			Object.entries($props.dataProcessing).length > 0
				? (vue.openBlock(),
				  vue.createElementBlock('section', _hoisted_26, [
						vue.createElementVNode(
							'h2',
							null,
							vue.toDisplayString($options.t('data_processing.title')),
							1 /* TEXT */
						),
						vue.renderSlot(_ctx.$slots, 'data_processing_start'),
						$props.dataProcessing.webhosting
							? (vue.openBlock(),
							  vue.createElementBlock('section', _hoisted_27, [
									vue.createElementVNode(
										'h3',
										null,
										vue.toDisplayString(
											$options.t('data_processing.webhosting.title')
										),
										1 /* TEXT */
									),
									vue.renderSlot(
										_ctx.$slots,
										'data_processing_webhosting_start'
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t(
												'data_processing.webhosting.content.p1'
											),
										},
										null,
										8 /* PROPS */,
										_hoisted_28
									),
									vue.createElementVNode('ul', null, [
										vue.createElementVNode(
											'li',
											{
												innerHTML: $options.t(
													'data_processing.webhosting.content.ul1.li1'
												),
											},
											null,
											8 /* PROPS */,
											_hoisted_29
										),
										vue.createElementVNode(
											'li',
											{
												innerHTML: $options.t(
													'data_processing.webhosting.content.ul1.li2'
												),
											},
											null,
											8 /* PROPS */,
											_hoisted_30
										),
										vue.createElementVNode(
											'li',
											{
												innerHTML: $options.t(
													'data_processing.webhosting.content.ul1.li3'
												),
											},
											null,
											8 /* PROPS */,
											_hoisted_31
										),
										vue.createElementVNode(
											'li',
											{
												innerHTML: $options.t(
													'data_processing.webhosting.content.ul1.li4'
												),
											},
											null,
											8 /* PROPS */,
											_hoisted_32
										),
									]),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t(
												'data_processing.webhosting.content.p2'
											),
										},
										null,
										8 /* PROPS */,
										_hoisted_33
									),
									vue.renderSlot(_ctx.$slots, 'data_processing_webhosting_end'),
							  ]))
							: vue.createCommentVNode('v-if', true),
						$props.dataProcessing.analytics
							? (vue.openBlock(),
							  vue.createElementBlock('section', _hoisted_34, [
									vue.createElementVNode(
										'h3',
										null,
										vue.toDisplayString(
											$options.t('data_processing.analytics.title')
										),
										1 /* TEXT */
									),
									vue.renderSlot(
										_ctx.$slots,
										'data_processing_analytics_start'
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t(
												'data_processing.analytics.content.p1'
											),
										},
										null,
										8 /* PROPS */,
										_hoisted_35
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t(
												'data_processing.analytics.content.p2'
											),
										},
										null,
										8 /* PROPS */,
										_hoisted_36
									),
									vue.renderSlot(_ctx.$slots, 'data_processing_analytics_end'),
							  ]))
							: vue.createCommentVNode('v-if', true),
						$props.dataProcessing.maps
							? (vue.openBlock(),
							  vue.createElementBlock('section', _hoisted_37, [
									vue.createElementVNode(
										'h3',
										null,
										vue.toDisplayString(
											$options.t('data_processing.maps.title')
										),
										1 /* TEXT */
									),
									vue.renderSlot(_ctx.$slots, 'data_processing_maps_start'),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p1'),
										},
										null,
										8 /* PROPS */,
										_hoisted_38
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p2'),
										},
										null,
										8 /* PROPS */,
										_hoisted_39
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p3'),
										},
										null,
										8 /* PROPS */,
										_hoisted_40
									),
									vue.renderSlot(_ctx.$slots, 'data_processing_maps_end'),
							  ]))
							: vue.createCommentVNode('v-if', true),
						$props.dataProcessing.send_emails
							? (vue.openBlock(),
							  vue.createElementBlock('section', _hoisted_41, [
									vue.createElementVNode(
										'h3',
										null,
										vue.toDisplayString(
											$options.t('data_processing.send_emails.title')
										),
										1 /* TEXT */
									),
									vue.renderSlot(
										_ctx.$slots,
										'data_processing_send_emails_start'
									),
									vue.createElementVNode(
										'p',
										{
											innerHTML: $options.t(
												'data_processing.send_emails.content.p1'
											),
										},
										null,
										8 /* PROPS */,
										_hoisted_42
									),
									vue.renderSlot(
										_ctx.$slots,
										'data_processing_send_emails_end'
									),
							  ]))
							: vue.createCommentVNode('v-if', true),
						vue.renderSlot(_ctx.$slots, 'data_processing_end'),
				  ]))
				: vue.createCommentVNode('v-if', true),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('outgoing_links.title')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'outgoing_links_start'),
				vue.createElementVNode(
					'p',
					{
						innerHTML: $options.t('outgoing_links.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_43
				),
				vue.renderSlot(_ctx.$slots, 'outgoing_links_end'),
			]),
			vue.createElementVNode('section', null, [
				vue.createElementVNode(
					'h2',
					null,
					vue.toDisplayString($options.t('processor_list')),
					1 /* TEXT */
				),
				vue.renderSlot(_ctx.$slots, 'processor_list_start'),
				(vue.openBlock(true),
				vue.createElementBlock(
					vue.Fragment,
					null,
					vue.renderList($data.usedProcessors, (processor, key) => {
						return (
							vue.openBlock(),
							vue.createElementBlock(
								'section',
								{
									key: key,
									id: 'processor-' + key,
								},
								[
									vue.createElementVNode(
										'h3',
										null,
										vue.toDisplayString(processor.name),
										1 /* TEXT */
									),
									vue.createElementVNode('dl', null, [
										vue.createElementVNode(
											'dt',
											null,
											vue.toDisplayString($options.t('address')),
											1 /* TEXT */
										),
										vue.createElementVNode(
											'dd',
											null,
											vue.toDisplayString(processor.address),
											1 /* TEXT */
										),
										vue.createElementVNode(
											'dt',
											null,
											vue.toDisplayString($options.t('data_purpose.title')),
											1 /* TEXT */
										),
										vue.createElementVNode('dd', null, [
											(vue.openBlock(true),
											vue.createElementBlock(
												vue.Fragment,
												null,
												vue.renderList(processor.purposes, (purpose, key) => {
													return (
														vue.openBlock(),
														vue.createElementBlock('div', { key: key }, [
															vue.createElementVNode(
																'a',
																{
																	href: '#process-' + purpose,
																},
																vue.toDisplayString(
																	$options.t('data_purpose.' + purpose)
																),
																9 /* TEXT, PROPS */,
																_hoisted_45
															),
														])
													)
												}),
												128 /* KEYED_FRAGMENT */
											)),
										]),
										vue.createElementVNode(
											'dt',
											null,
											vue.toDisplayString($options.t('data_category.title')),
											1 /* TEXT */
										),
										vue.createElementVNode('dd', null, [
											(vue.openBlock(true),
											vue.createElementBlock(
												vue.Fragment,
												null,
												vue.renderList(
													processor.data_categories,
													(category, key) => {
														return (
															vue.openBlock(),
															vue.createElementBlock('span', { key: key }, [
																key > 0 &&
																key < processor.data_categories.length
																	? (vue.openBlock(),
																	  vue.createElementBlock(
																			vue.Fragment,
																			{ key: 0 },
																			[_hoisted_46],
																			2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
																	  ))
																	: vue.createCommentVNode('v-if', true),
																vue.createTextVNode(
																	' ' +
																		vue.toDisplayString(
																			$options.t('data_category.' + category)
																		),
																	1 /* TEXT */
																),
															])
														)
													}
												),
												128 /* KEYED_FRAGMENT */
											)),
										]),
										vue.createElementVNode(
											'dt',
											null,
											vue.toDisplayString($options.t('privacy_policy')),
											1 /* TEXT */
										),
										vue.createElementVNode('dd', null, [
											vue.createElementVNode(
												'a',
												{
													href: processor.privacy_policy,
													target: '_blank',
													rel: 'noopener nofollower',
												},
												vue.toDisplayString(processor.privacy_policy),
												9 /* TEXT, PROPS */,
												_hoisted_47
											),
										]),
										processor.privacy_shield
											? (vue.openBlock(),
											  vue.createElementBlock(
													vue.Fragment,
													{ key: 0 },
													[
														_hoisted_48,
														vue.createElementVNode('dd', null, [
															vue.createElementVNode(
																'a',
																{
																	href: processor.privacy_shield,
																	target: '_blank',
																	rel: 'noopener nofollower',
																},
																vue.toDisplayString(processor.privacy_shield),
																9 /* TEXT, PROPS */,
																_hoisted_49
															),
														]),
													],
													64 /* STABLE_FRAGMENT */
											  ))
											: vue.createCommentVNode('v-if', true),
									]),
								],
								8 /* PROPS */,
								_hoisted_44
							)
						)
					}),
					128 /* KEYED_FRAGMENT */
				)),
				vue.renderSlot(_ctx.$slots, 'processor_list_end'),
			]),
		])
	)
}

script.render = render
script.__file = 'src/components/PrivacyPolicy.vue'

module.exports = script
