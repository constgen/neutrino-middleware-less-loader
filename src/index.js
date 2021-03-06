let arrify    = require('arrify')
let deepmerge = require('deepmerge')
let less      = require('less')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const LESS_EXTENSIONS        = /\.less$/
		const LESS_MODULE_EXTENSIONS = /\.module\.less$/
		let { config }               = neutrino
		let styleRule                = config.module.rules.get('style')
		let lessRule                 = config.module.rule('less')
		let styleExtensions          = styleRule && styleRule.get('test')
		let defaultSettings          = {
			include: [neutrino.options.source, neutrino.options.tests],
			exclude: [],
			less   : {}
		}
		let settings                 = deepmerge(defaultSettings, customSettings)

		if (styleExtensions) {
			let extensions = arrify(styleExtensions).concat(LESS_EXTENSIONS)

			styleRule.test(extensions)
		}
		if (styleRule) {
			let oneOfs        = styleRule.oneOfs.values().filter(oneOf => oneOf.get('test'))
			let moduleOneOfs  = oneOfs.filter(oneOf => oneOf.uses.get('css').get('options').modules)
			let defaultOneOfs = oneOfs.filter(oneOf => !oneOf.uses.get('css').get('options').modules)

			moduleOneOfs.forEach(function (oneOf) {
				let extensions = arrify(oneOf.get('test')).concat(LESS_MODULE_EXTENSIONS)

				styleRule.oneOf(oneOf.name).test(extensions)
			})
			defaultOneOfs.forEach(function (oneOf) {
				let extensions = arrify(oneOf.get('test')).concat(LESS_EXTENSIONS)

				styleRule.oneOf(oneOf.name).test(extensions)
			})
		}

		lessRule
			.test(LESS_EXTENSIONS)
			.include
				.merge(settings.include || [])
				.end()
			.exclude
				.merge(settings.exclude || [])
				.end()
			.use('less')
				.loader(require.resolve('less-loader'))
				.tap((options = {}) => options)
				.tap(options => deepmerge({
					sourceMap      : true,
					webpackImporter: true,
					lessOptions    : {
						insecure   : true,
						paths      : [],
						rewriteUrls: 'all',
						math       : 'always',
						strictUnits: false,
						globalVars : {},
						modifyVars : {},
						urlArgs    : '',
						plugins    : []
					}
				}, options))
				.tap(options => deepmerge(options, { lessOptions: settings.less }))
				.tap(options => Object.assign(options, { implementation: options.implementation || less })) // prevent destruction of original Less instance
				.end()
			.use('less-var')
				.loader(require.resolve('js-to-styles-var-loader'))
				.end()
	}
}