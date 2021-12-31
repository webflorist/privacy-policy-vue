<template>
	<section>
		<h4>{{ cookie.name }}</h4>

		<dl>
			<dt>{{ t('cookies.purpose.title') }}</dt>
			<dd v-html="t('cookies.purpose.' + cookie.purpose)" />

			<template v-if="type === 'third_party'">
				<dt>{{ t('cookies.origin') }}</dt>
				<dd>
					{{ cookie.service }}
					(<a :href="'#processor-' + cookie.processor">{{
						processors[cookie.processor].name
					}}</a
					>)
				</dd>
			</template>

			<dt>{{ t('cookies.written_on.title') }}</dt>
			<dd v-html="t('cookies.written_on.' + cookie.written_on)" />

			<dt>{{ t('cookies.duration.title') }}</dt>
			<dd v-html="t('cookies.duration.' + cookie.duration)" />
		</dl>
	</section>
</template>
<script>
export default {
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
</script>
