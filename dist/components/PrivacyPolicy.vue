<script>
import { useI18n } from 'vue-i18n'
import {
	curlyWrapSingular,
	curlyWrapPlural,
	defaultProcessors,
	renderText,
} from '@webflorist/privacy-policy-text'
import CookieList from './CookieList.vue'

export default {
	components: {
		CookieList,
	},
	props: {
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
	setup(props) {
		// Instantiate translation via Vue I18n
		// and language files provided from
		// @webflorist/privacy-policy-text
		const { t: i18t } = useI18n({
			messages: props.singular ? curlyWrapSingular : curlyWrapPlural,
		})

		// Custom translation function, which uses renderText
		// from @webflorist/privacy-policy-text after translation
		const t = (key) => {
			return renderText(i18t(key, interpolations))
		}

		// Merge custom processors with default ones.
		const allProcessors = {
			...defaultProcessors,
			...props.processors,
		}

		// Determine used processors and interpolations for translation
		const interpolations = {
			privacy_email: props.privacyEmail,
		}
		const usedProcessors = {}
		for (const [processType, process] of Object.entries(
			props.dataProcessing
		)) {
			// Retrieve processor data from allProcessors
			const processorKey = process.processor
			const processor = allProcessors[processorKey]

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
			usedProcessors[processorKey].purposes.push(processType)

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

		const cookieTypes = Object.keys(props.cookies) || []

		return {
			t,
			usedProcessors,
			cookieTypes,
		}
	},
}
</script>
<template>
	<p v-html="t('intro_content.p1')" />
	<p v-html="t('intro_content.p2')" />

	<slot name="after_intro"></slot>

	<section>
		<h2>{{ t('gdpr_rights.title') }}</h2>

		<slot name="gdpr_rights_start"></slot>

		<p v-html="t('gdpr_rights.content.p1')" />
		<ul>
			<li v-html="t('gdpr_rights.content.ul1.li1')" />
			<li v-html="t('gdpr_rights.content.ul1.li2')" />
			<li v-html="t('gdpr_rights.content.ul1.li3')" />
			<li v-html="t('gdpr_rights.content.ul1.li4')" />
			<li v-html="t('gdpr_rights.content.ul1.li5')" />
			<li v-html="t('gdpr_rights.content.ul1.li6')" />
			<li v-html="t('gdpr_rights.content.ul1.li7')" />
		</ul>
		<p v-html="t('gdpr_rights.content.p2')" />

		<slot name="gdpr_rights_end"></slot>
	</section>

	<section>
		<h2>{{ t('security.title') }}</h2>

		<slot name="security_start"></slot>

		<p v-html="t('security.content.p1')" />
		<p v-html="t('security.content.p2')" />

		<slot name="security_end"></slot>
	</section>

	<section>
		<h2>{{ t('cookies.title') }}</h2>

		<slot name="cookies_start"></slot>

		<p v-if="cookies === false" v-html="t('cookies.no_cookies.p1')" />
		<template v-else>
			<p v-html="t('cookies.content.p1')" />
			<p v-html="t('cookies.content.p2')" />
			<p v-html="t('cookies.content.p3')" />
			<section v-for="cookieType of cookieTypes" :key="cookieType">
				<h3>{{ t('cookies.' + cookieType + '.title') }}</h3>
				<p v-html="t('cookies.' + cookieType + '.content.p1')" />
				<CookieList
					:cookies="cookies[cookieType]"
					:t="t"
					:processors="usedProcessors"
					:type="cookieType"
				/>
			</section>
		</template>

		<slot name="cookies_end"></slot>
	</section>

	<section v-if="Object.entries(dataProcessing).length > 0">
		<h2>{{ t('data_processing.title') }}</h2>

		<slot name="data_processing_start"></slot>

		<section v-if="dataProcessing.webserver" id="process-webserver">
			<h3>{{ t('data_processing.webserver.title') }}</h3>

			<slot name="data_processing_webserver_start"></slot>

			<p v-html="t('data_processing.webserver.content.p1')" />
			<ul>
				<li v-html="t('data_processing.webserver.content.ul1.li1')" />
				<li v-html="t('data_processing.webserver.content.ul1.li2')" />
				<li v-html="t('data_processing.webserver.content.ul1.li3')" />
				<li v-html="t('data_processing.webserver.content.ul1.li4')" />
			</ul>
			<p v-html="t('data_processing.webserver.content.p2')" />

			<slot name="data_processing_webserver_end"></slot>
		</section>

		<section v-if="dataProcessing.analytics" id="process-analytics">
			<h3>{{ t('data_processing.analytics.title') }}</h3>

			<slot name="data_processing_analytics_start"></slot>

			<p v-html="t('data_processing.analytics.content.p1')" />
			<p v-html="t('data_processing.analytics.content.p2')" />

			<slot name="data_processing_analytics_end"></slot>
		</section>

		<section v-if="dataProcessing.maps" id="process-maps">
			<h3>{{ t('data_processing.maps.title') }}</h3>
			<slot name="data_processing_maps_start"></slot>
			<p v-html="t('data_processing.maps.content.p1')" />
			<p v-html="t('data_processing.maps.content.p2')" />
			<p v-html="t('data_processing.maps.content.p3')" />
			<slot name="data_processing_maps_end"></slot>
		</section>

		<section v-if="dataProcessing.send_emails" id="process-send_emails">
			<h3>{{ t('data_processing.send_emails.title') }}</h3>
			<slot name="data_processing_send_emails_start"></slot>
			<p v-html="t('data_processing.send_emails.content.p1')" />
			<slot name="data_processing_send_emails_end"></slot>
		</section>

		<slot name="data_processing_end"></slot>
	</section>

	<section>
		<h2>{{ t('outgoing_links.title') }}</h2>
		<slot name="outgoing_links_start"></slot>
		<section v-html="t('outgoing_links.content.p1')" />
		<slot name="outgoing_links_end"></slot>
	</section>

	<section>
		<h2>{{ t('processor_list') }}</h2>

		<slot name="processor_list_start"></slot>

		<section
			v-for="(processor, key) in usedProcessors"
			:key="key"
			:id="'processor-' + key"
		>
			<h3>{{ processor.name }}</h3>
			<dl>
				<dt>{{ t('address') }}</dt>
				<dd>
					{{ processor.address }}
				</dd>

				<dt>{{ t('data_purpose.title') }}</dt>
				<dd>
					<div
						v-for="(purpose, key) in processor.purposes"
						:key="key"
					>
						<a :href="'#process-' + purpose">{{
							t('data_purpose.' + purpose)
						}}</a>
					</div>
				</dd>

				<dt>{{ t('data_category.title') }}</dt>
				<dd>
					<span
						v-for="(category, key) in processor.data_categories"
						:key="key"
					>
						<template
							v-if="
								key > 0 &&
								key < processor.data_categories.length
							"
							>,
						</template>
						{{ t('data_category.' + category) }}
					</span>
				</dd>

				<dt>{{ t('privacy_policy') }}</dt>
				<dd>
					<a :href="processor.privacy_policy" target="_blank">{{
						processor.privacy_policy
					}}</a>
				</dd>
			</dl>
		</section>

		<slot name="processor_list_end"></slot>
	</section>
</template>
