import PrivacyPolicyText from '@webflorist/privacy-policy-text'
import {
	openBlock,
	createElementBlock,
	createElementVNode,
	toDisplayString,
	Fragment,
	createTextVNode,
	createCommentVNode,
	resolveComponent,
	renderSlot,
	renderList,
	createBlock,
} from 'vue'

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
const _hoisted_3$1 = /*#__PURE__*/ createTextVNode(') ')
const _hoisted_4$1 = ['innerHTML']
const _hoisted_5$1 = ['innerHTML']

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		openBlock(),
		createElementBlock('section', null, [
			createElementVNode(
				'h4',
				null,
				toDisplayString($props.cookie.name),
				1 /* TEXT */
			),
			createElementVNode('dl', null, [
				createElementVNode(
					'dt',
					null,
					toDisplayString($props.t('cookies.purpose.title')),
					1 /* TEXT */
				),
				createElementVNode(
					'dd',
					{
						innerHTML: $props.t('cookies.purpose.' + $props.cookie.purpose),
					},
					null,
					8 /* PROPS */,
					_hoisted_1$1
				),
				$props.type === 'third_party'
					? (openBlock(),
					  createElementBlock(
							Fragment,
							{ key: 0 },
							[
								createElementVNode(
									'dt',
									null,
									toDisplayString($props.t('cookies.origin')),
									1 /* TEXT */
								),
								createElementVNode('dd', null, [
									createTextVNode(
										toDisplayString($props.cookie.service) + ' (',
										1 /* TEXT */
									),
									createElementVNode(
										'a',
										{
											href: '#processor-' + $props.cookie.processor,
										},
										toDisplayString(
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
					: createCommentVNode('v-if', true),
				createElementVNode(
					'dt',
					null,
					toDisplayString($props.t('cookies.written_on.title')),
					1 /* TEXT */
				),
				createElementVNode(
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
				createElementVNode(
					'dt',
					null,
					toDisplayString($props.t('cookies.duration.title')),
					1 /* TEXT */
				),
				createElementVNode(
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
			? PrivacyPolicyText.curlyWrapSingular
			: PrivacyPolicyText.curlyWrapPlural

		// Throw error, if stated locale is not supported.
		if (!(this.locale in this.messages)) {
			throw new Error(
				`Package @webflorist/privacy-policy-vue does not support locale "${this.locale}"`
			)
		}

		// Merge custom processors with default ones.
		this.allProcessors = {
			...PrivacyPolicyText.processors,
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
			return PrivacyPolicyText.renderText(
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
const _hoisted_46 = /*#__PURE__*/ createTextVNode(', ')
const _hoisted_47 = ['href']
const _hoisted_48 = /*#__PURE__*/ createElementVNode(
	'dt',
	null,
	'Privacy Shield',
	-1 /* HOISTED */
)
const _hoisted_49 = ['href']

function render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_CookieDetails = resolveComponent('CookieDetails')

	return (
		openBlock(),
		createElementBlock('section', null, [
			createElementVNode(
				'p',
				{
					innerHTML: $options.t('intro_content.p1'),
				},
				null,
				8 /* PROPS */,
				_hoisted_1
			),
			createElementVNode(
				'p',
				{
					innerHTML: $options.t('intro_content.p2'),
				},
				null,
				8 /* PROPS */,
				_hoisted_2
			),
			renderSlot(_ctx.$slots, 'after_intro'),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('gdpr_rights.title')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'gdpr_rights_start'),
				createElementVNode(
					'p',
					{
						innerHTML: $options.t('gdpr_rights.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_3
				),
				createElementVNode('ul', null, [
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li1'),
						},
						null,
						8 /* PROPS */,
						_hoisted_4
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li2'),
						},
						null,
						8 /* PROPS */,
						_hoisted_5
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li3'),
						},
						null,
						8 /* PROPS */,
						_hoisted_6
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li4'),
						},
						null,
						8 /* PROPS */,
						_hoisted_7
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li5'),
						},
						null,
						8 /* PROPS */,
						_hoisted_8
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li6'),
						},
						null,
						8 /* PROPS */,
						_hoisted_9
					),
					createElementVNode(
						'li',
						{
							innerHTML: $options.t('gdpr_rights.content.ul1.li7'),
						},
						null,
						8 /* PROPS */,
						_hoisted_10
					),
				]),
				renderSlot(_ctx.$slots, 'gdpr_rights_end'),
			]),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('data_controller.title')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'data_controller_start'),
				createElementVNode(
					'p',
					{
						innerHTML: $options.t('data_controller.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_11
				),
				createElementVNode('address', null, [
					$props.dataController.organisation
						? (openBlock(),
						  createElementBlock(
								'div',
								_hoisted_12,
								toDisplayString($props.dataController.organisation),
								1 /* TEXT */
						  ))
						: createCommentVNode('v-if', true),
					$props.dataController.name
						? (openBlock(),
						  createElementBlock(
								'div',
								_hoisted_13,
								toDisplayString($props.dataController.name),
								1 /* TEXT */
						  ))
						: createCommentVNode('v-if', true),
					$props.dataController.address
						? (openBlock(),
						  createElementBlock(
								'div',
								_hoisted_14,
								toDisplayString($props.dataController.address),
								1 /* TEXT */
						  ))
						: createCommentVNode('v-if', true),
					$props.dataController.email
						? (openBlock(),
						  createElementBlock('div', _hoisted_15, [
								createElementVNode(
									'a',
									{
										href: 'mailto:' + $props.dataController.email,
									},
									toDisplayString($props.dataController.email),
									9 /* TEXT, PROPS */,
									_hoisted_16
								),
						  ]))
						: createCommentVNode('v-if', true),
					$props.dataController.phone
						? (openBlock(),
						  createElementBlock('div', _hoisted_17, [
								createElementVNode(
									'a',
									{
										href: 'tel:' + $props.dataController.phone,
									},
									toDisplayString($props.dataController.phone),
									9 /* TEXT, PROPS */,
									_hoisted_18
								),
						  ]))
						: createCommentVNode('v-if', true),
				]),
				renderSlot(_ctx.$slots, 'data_controller_end'),
			]),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('security.title')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'security_start'),
				createElementVNode(
					'p',
					{
						innerHTML: $options.t('security.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_19
				),
				createElementVNode(
					'p',
					{
						innerHTML: $options.t('security.content.p2'),
					},
					null,
					8 /* PROPS */,
					_hoisted_20
				),
				renderSlot(_ctx.$slots, 'security_end'),
			]),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('cookies.title')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'cookies_start'),
				$props.cookies === false
					? (openBlock(),
					  createElementBlock(
							'p',
							{
								key: 0,
								innerHTML: $options.t('cookies.no_cookies_content.p1'),
							},
							null,
							8 /* PROPS */,
							_hoisted_21
					  ))
					: (openBlock(),
					  createElementBlock(
							Fragment,
							{ key: 1 },
							[
								createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p1'),
									},
									null,
									8 /* PROPS */,
									_hoisted_22
								),
								createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p2'),
									},
									null,
									8 /* PROPS */,
									_hoisted_23
								),
								createElementVNode(
									'p',
									{
										innerHTML: $options.t('cookies.content.p3'),
									},
									null,
									8 /* PROPS */,
									_hoisted_24
								),
								(openBlock(true),
								createElementBlock(
									Fragment,
									null,
									renderList($options.cookieTypes, (cookieType) => {
										return (
											openBlock(),
											createElementBlock('section', { key: cookieType }, [
												createElementVNode(
													'h3',
													null,
													toDisplayString(
														$options.t('cookies.' + cookieType + '.title')
													),
													1 /* TEXT */
												),
												createElementVNode(
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
												(openBlock(true),
												createElementBlock(
													Fragment,
													null,
													renderList(
														$props.cookies[cookieType],
														(cookie, key) => {
															return (
																openBlock(),
																createBlock(
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
				renderSlot(_ctx.$slots, 'cookies_end'),
			]),
			Object.entries($props.dataProcessing).length > 0
				? (openBlock(),
				  createElementBlock('section', _hoisted_26, [
						createElementVNode(
							'h2',
							null,
							toDisplayString($options.t('data_processing.title')),
							1 /* TEXT */
						),
						renderSlot(_ctx.$slots, 'data_processing_start'),
						$props.dataProcessing.webhosting
							? (openBlock(),
							  createElementBlock('section', _hoisted_27, [
									createElementVNode(
										'h3',
										null,
										toDisplayString(
											$options.t('data_processing.webhosting.title')
										),
										1 /* TEXT */
									),
									renderSlot(_ctx.$slots, 'data_processing_webhosting_start'),
									createElementVNode(
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
									createElementVNode('ul', null, [
										createElementVNode(
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
										createElementVNode(
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
										createElementVNode(
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
										createElementVNode(
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
									createElementVNode(
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
									renderSlot(_ctx.$slots, 'data_processing_webhosting_end'),
							  ]))
							: createCommentVNode('v-if', true),
						$props.dataProcessing.analytics
							? (openBlock(),
							  createElementBlock('section', _hoisted_34, [
									createElementVNode(
										'h3',
										null,
										toDisplayString(
											$options.t('data_processing.analytics.title')
										),
										1 /* TEXT */
									),
									renderSlot(_ctx.$slots, 'data_processing_analytics_start'),
									createElementVNode(
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
									createElementVNode(
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
									renderSlot(_ctx.$slots, 'data_processing_analytics_end'),
							  ]))
							: createCommentVNode('v-if', true),
						$props.dataProcessing.maps
							? (openBlock(),
							  createElementBlock('section', _hoisted_37, [
									createElementVNode(
										'h3',
										null,
										toDisplayString($options.t('data_processing.maps.title')),
										1 /* TEXT */
									),
									renderSlot(_ctx.$slots, 'data_processing_maps_start'),
									createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p1'),
										},
										null,
										8 /* PROPS */,
										_hoisted_38
									),
									createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p2'),
										},
										null,
										8 /* PROPS */,
										_hoisted_39
									),
									createElementVNode(
										'p',
										{
											innerHTML: $options.t('data_processing.maps.content.p3'),
										},
										null,
										8 /* PROPS */,
										_hoisted_40
									),
									renderSlot(_ctx.$slots, 'data_processing_maps_end'),
							  ]))
							: createCommentVNode('v-if', true),
						$props.dataProcessing.send_emails
							? (openBlock(),
							  createElementBlock('section', _hoisted_41, [
									createElementVNode(
										'h3',
										null,
										toDisplayString(
											$options.t('data_processing.send_emails.title')
										),
										1 /* TEXT */
									),
									renderSlot(_ctx.$slots, 'data_processing_send_emails_start'),
									createElementVNode(
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
									renderSlot(_ctx.$slots, 'data_processing_send_emails_end'),
							  ]))
							: createCommentVNode('v-if', true),
						renderSlot(_ctx.$slots, 'data_processing_end'),
				  ]))
				: createCommentVNode('v-if', true),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('outgoing_links.title')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'outgoing_links_start'),
				createElementVNode(
					'p',
					{
						innerHTML: $options.t('outgoing_links.content.p1'),
					},
					null,
					8 /* PROPS */,
					_hoisted_43
				),
				renderSlot(_ctx.$slots, 'outgoing_links_end'),
			]),
			createElementVNode('section', null, [
				createElementVNode(
					'h2',
					null,
					toDisplayString($options.t('processor_list')),
					1 /* TEXT */
				),
				renderSlot(_ctx.$slots, 'processor_list_start'),
				(openBlock(true),
				createElementBlock(
					Fragment,
					null,
					renderList($data.usedProcessors, (processor, key) => {
						return (
							openBlock(),
							createElementBlock(
								'section',
								{
									key: key,
									id: 'processor-' + key,
								},
								[
									createElementVNode(
										'h3',
										null,
										toDisplayString(processor.name),
										1 /* TEXT */
									),
									createElementVNode('dl', null, [
										createElementVNode(
											'dt',
											null,
											toDisplayString($options.t('address')),
											1 /* TEXT */
										),
										createElementVNode(
											'dd',
											null,
											toDisplayString(processor.address),
											1 /* TEXT */
										),
										createElementVNode(
											'dt',
											null,
											toDisplayString($options.t('data_purpose.title')),
											1 /* TEXT */
										),
										createElementVNode('dd', null, [
											(openBlock(true),
											createElementBlock(
												Fragment,
												null,
												renderList(processor.purposes, (purpose, key) => {
													return (
														openBlock(),
														createElementBlock('div', { key: key }, [
															createElementVNode(
																'a',
																{
																	href: '#process-' + purpose,
																},
																toDisplayString(
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
										createElementVNode(
											'dt',
											null,
											toDisplayString($options.t('data_category.title')),
											1 /* TEXT */
										),
										createElementVNode('dd', null, [
											(openBlock(true),
											createElementBlock(
												Fragment,
												null,
												renderList(
													processor.data_categories,
													(category, key) => {
														return (
															openBlock(),
															createElementBlock('span', { key: key }, [
																key > 0 &&
																key < processor.data_categories.length
																	? (openBlock(),
																	  createElementBlock(
																			Fragment,
																			{ key: 0 },
																			[_hoisted_46],
																			2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
																	  ))
																	: createCommentVNode('v-if', true),
																createTextVNode(
																	' ' +
																		toDisplayString(
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
										createElementVNode(
											'dt',
											null,
											toDisplayString($options.t('privacy_policy')),
											1 /* TEXT */
										),
										createElementVNode('dd', null, [
											createElementVNode(
												'a',
												{
													href: processor.privacy_policy,
													target: '_blank',
													rel: 'noopener nofollower',
												},
												toDisplayString(processor.privacy_policy),
												9 /* TEXT, PROPS */,
												_hoisted_47
											),
										]),
										processor.privacy_shield
											? (openBlock(),
											  createElementBlock(
													Fragment,
													{ key: 0 },
													[
														_hoisted_48,
														createElementVNode('dd', null, [
															createElementVNode(
																'a',
																{
																	href: processor.privacy_shield,
																	target: '_blank',
																	rel: 'noopener nofollower',
																},
																toDisplayString(processor.privacy_shield),
																9 /* TEXT, PROPS */,
																_hoisted_49
															),
														]),
													],
													64 /* STABLE_FRAGMENT */
											  ))
											: createCommentVNode('v-if', true),
									]),
								],
								8 /* PROPS */,
								_hoisted_44
							)
						)
					}),
					128 /* KEYED_FRAGMENT */
				)),
				renderSlot(_ctx.$slots, 'processor_list_end'),
			]),
		])
	)
}

script.render = render
script.__file = 'src/components/PrivacyPolicy.vue'

export { script as default }
