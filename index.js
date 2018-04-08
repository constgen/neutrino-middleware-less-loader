'use strict'

let path = require('path')
let arrify = require('arrify')
let merge = require('deepmerge')

module.exports = function (neutrino, settings = {}) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.less$/
	let config = neutrino.config
	let styleRule = config.module.rule('style')
	let lessRule = config.module.rule('less')
	let styleExtensions = arrify(styleRule.get('test')).concat(LOADER_EXTENSIONS)

	// default values
	if (!settings.include && !settings.exclude) {
		settings.include = [neutrino.options.source, neutrino.options.tests]
	}
	if (!settings.less) {
		settings.less = {}
	}

	styleRule
		.test(styleExtensions)

	lessRule
		.test(LOADER_EXTENSIONS)
		.include
			.merge(settings.include || [])
			.end()
		.exclude
			.add(NODE_MODULES)
			.merge(settings.exclude || [])
			.end()
		.use('less')
			.loader(require.resolve('less-loader'))
			.tap((options = {}) => options)
			.tap(options => merge({
				compress: true,
				strictImports: true,
				insecure: true,
				maxLineLen: -1,
				ieCompat: false,
				paths: [],
				// rootpath: ''
				sourceMap: true, // {
				// 	sourceMapRootpath: '',
				// 	sourceMapBasepath: '',
				// 	outputSourceFiles: true,
				// 	sourceMapFileInline: true,
				// 	sourceMapURL: ''
				// }
				relativeUrls: true,
				strictMath: false,
				strictUnits: false,
				globalVars: {},
				modifyVars: {},
				urlArgs: '',
				plugins: []
			}, options))
			.tap(options => merge(options, settings.less))
			.end()
		.use('less-var')
			.loader(require.resolve('js-to-styles-var-loader'))
			.end()

	config
		.resolve.extensions
			.add('.less')
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()
}