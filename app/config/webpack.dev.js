const config = require('./config');
if (config.IS_PRODUCTION) console.warn('Waring: using webpack dev config in production env');

const common = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	target: common.webpack.target,
	devtool: config.IS_FAST ? 'eval-cheap-module-source-map' : 'source-map',

	context: common.webpack.context,
	entry: common.webpack.entry,
	output: common.webpack.output,
	resolve: common.webpack.resolve,
	cache: common.webpack.cache,

	module: { rules: common.webpack.module.rules },

	plugins: [
		...common.webpack.plugins,
		new HtmlWebpackPlugin({
			favicon: common.paths.htmlWebpackPluginFavicon,
			template: common.paths.htmlWebpackPluginTemplate,
		}),
	],

	optimization: {
		runtimeChunk: 'single',
		splitChunks: config.IS_FAST
			? false
			: {
					chunks: 'all',
					maxInitialRequests: Infinity,
					minSize: 0,
					cacheGroups: {
						vendor: {
							test: /node_modules\/.*/is,
							name: (module) => {
								const packageName = module.context.match(/\/node_modules\/(.*?)(\/|$)/is)[1].replace('@', '');
								if (packageName[0] == '.') packageName = packageName.substring(1);
								return `z.npm.${packageName}`;
							},
						},
					},
			  },
	},

	devServer: common.webpack.devServer,
};
