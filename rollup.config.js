import vue from 'rollup-plugin-vue'

let entries = []

function addEntry(inFile, outFile) {
	entries.push({
		input: 'src/components/' + inFile + '.vue',
		output: [
			{
				format: 'cjs',
				file: 'dist/components/' + outFile + '.cjs.js',
			},
			{
				format: 'esm',
				file: 'dist/components/' + outFile + '.esm.js',
			},
			{
				format: 'iife',
				name: '@webflorist/privacy-policy-vue.' + outFile,
				file: 'dist/components/' + outFile + '.js',
			},
		],
		plugins: [vue()],
	})
}

addEntry('CookieDetails', 'cookie-details')
addEntry('PrivacyPolicy', 'privacy-policy')

export default entries
