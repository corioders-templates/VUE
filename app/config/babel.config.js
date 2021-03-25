// babel configs for js files needs to be in another file so eslint can use them
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config.js');

module.exports = {
	sourceType: 'unambiguous',
	presets: config.IS_FAST
		? []
		: [
				[
					'@babel/preset-env',
					{
						useBuiltIns: 'usage',
						corejs: 3,
						modules: 'auto',
					},
				],
		  ],
	plugins: [
		[
			'@babel/plugin-transform-runtime',
			{
				corejs: false,
				useESModules: true,
			},
		],
	],
};
