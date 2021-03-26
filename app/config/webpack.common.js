const path = require('path');

const config = require('./config.js');

const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const mergeSourceMapLoader = require(path.resolve(config.MORE.LOADERS_PATH, 'merge-source-map-loader'));

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

const browserSyncReloadPlugin = require(path.resolve(config.MORE.BROWSER_SYNC_PLUGINS_PATH, 'reloadPlugin'));

const paths = {
	src: path.resolve(config.ROOT_PATH, 'src'),
	out: path.resolve(config.ROOT_PATH, 'out'),
	cache: path.resolve(config.ROOT_PATH, 'node_modules/.cache/webpack'),

	eslintConfig: path.resolve(config.ROOT_PATH, '.eslintrc.js'),
	tsConfig: path.resolve(config.ROOT_PATH, 'tsconfig.json'),
	babelConfig: path.resolve(config.CONFIG_PATH, 'babel.config.js'),

	htmlWebpackPluginFavicon: path.resolve(config.ROOT_PATH, 'src/public/favicon.ico'),
	htmlWebpackPluginTemplate: path.resolve(config.ROOT_PATH, 'src/public/index.html'),
};

const options = {};
options.babel = {
	configFile: paths.babelConfig,
	cacheDirectory: true,
};
options.ts = {
	useCaseSensitiveFileNames: true,
	onlyCompileBundledFiles: true,
	configFile: paths.tsConfig,
};
options.postcss = {
	postcssOptions: { plugins: ['postcss-preset-env'] },
};
options.sass = {
	additionalData: `@use './scss/global/*.scss' as *;`,
	sassOptions: { includePaths: [paths.src], importer: require('node-sass-glob-importer')() },
};

const fileName = config.IS_PRODUCTION && !config.IS_ANALYZE ? '[contenthash]' : '[name]';
const target = config.IS_PRODUCTION ? 'browserslist' : 'web';

const aliases = require(path.resolve(config.CONFIG_PATH, 'webpackAlias.json'));
for (const key in aliases) aliases[key] = path.resolve(config.ROOT_PATH, aliases[key]);

const webpack = {
	context: config.ROOT_PATH,
	entry: {
		app: path.resolve(paths.src, 'index.ts'),
	},

	target: target,
	output: {
		path: paths.out,
		filename: `${fileName}.js`,
		publicPath: '',
		module: false,
		chunkLoadingGlobal: config.IS_PRODUCTION ? 'a' : undefined,
	},

	resolve: {
		alias: {
			...aliases,
		},
		extensions: ['.ts', '.js'],
	},

	cache: {
		type: 'memory',
		// type: 'filesystem',
		// name: `${config.IS_PRODUCTION ? 'production' : 'development'}-${config.IS_FAST ? 'fast' : 'nonFast'}-${config.IS_DEBUG ? 'debug' : 'nonDebug'}`,
		// cacheDirectory: paths.cache,
	},

	module: {
		rules: [
			// =========================================================================
			// loaders
			{
				test: /\.js$/,
				exclude: /node_modules\/(core-js).*/is,
				loader: 'babel-loader',
				options: options.babel,
				include: config.IS_FAST ? paths.src : undefined,
			},
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'babel-loader',
						options: options.babel,
					},
					{
						loader: mergeSourceMapLoader,
						options: { post: true },
					},
					{
						loader: 'ts-loader',
						options: options.ts,
					},
					{
						loader: mergeSourceMapLoader,
						options: { pre: true },
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: options.postcss,
					},
					{
						loader: 'sass-loader',
						options: options.sass,
					},
				],
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},

			// =========================================================================
			// webpack 5 asset-modules
			{
				test: /\/assets\//,
				type: 'asset',
			},
		],
	},

	plugins: [
		...(config.IS_ANALYZE ? [new BundleAnalyzerPlugin()] : []),

		new CleanWebpackPlugin(),

		new DefinePlugin({
			__IS_PRODUCTION__: config.IS_PRODUCTION,
		}),
		new MiniCssExtractPlugin({
			filename: `${fileName}.css`,
			chunkFilename: `${fileName}.css`,
		}),

		new BrowserSyncPlugin(
			{
				host: config.ENV.HOST,
				port: 8080,
				proxy: `http://${config.ENV.HOST}:8081/`,
				open: false,
				logLevel: 'silent',
				ui: { port: 8082 },
				plugins: [browserSyncReloadPlugin],
			},
			{ reload: false },
		),

		new ESLintPlugin({
			extensions: ['js', 'ts'],
		}),

		{
			PLUGIN_NAME: 'logging',
			/**
			 *
			 * @param {import('webpack').Compiler} compiler
			 */
			apply(compiler) {
				const chalk = require('chalk');

				const friendlyErrorsOutput = require('@soda/friendly-errors-webpack-plugin/src/output');
				class FriendlyErrorsWebpackPluginModified extends FriendlyErrorsWebpackPlugin {
					constructor() {
						super(...arguments);
					}
					displayDevServerInfo() {
						friendlyErrorsOutput.info(
							`Browser sync running at: ${chalk.cyan(`http://${config.ENV.HOST}:8080/`)} and ui: ${chalk.cyan(`http://${config.ENV.HOST}:8082/`)}`,
						);
						friendlyErrorsOutput.info(`Main app running at: ${chalk.cyan(`http://${config.ENV.HOST}:8081/`)}`);
					}
					displayErrors() {
						this.displayDevServerInfo();
						super.displayErrors.apply(this, arguments);
					}
					displaySuccess() {
						this.displayDevServerInfo();
						super.displaySuccess.apply(this, arguments);
					}
				}

				class WebpackBarModified extends WebpackBar {
					constructor() {
						super(...arguments);
					}

					updateProgress() {
						if (!this.state.done) super.updateProgress.apply(this, arguments);
					}
				}

				let once = false;
				const addLogging = (isWatching) => {
					if (once) return;
					once = true;

					const webpackBar = new WebpackBarModified();
					webpackBar._ensureState();
					webpackBar.apply(compiler);

					if (isWatching) {
						const friendlyErrors = new FriendlyErrorsWebpackPluginModified();
						friendlyErrors.apply(compiler);
					}
				};

				compiler.hooks.watchRun.tap(this.PLUGIN_NAME, addLogging.bind(undefined, true));
				compiler.hooks.beforeRun.tap(this.PLUGIN_NAME, addLogging.bind(undefined, false));
			},
		},
	],

	// keep in mind to update this for webpack-dev-server 4.x.x
	devServer: {
		host: config.ENV.HOST,
		port: 8081,
		writeToDisk: config.IS_DEBUG,
		publicPath: '/',
		hot: true,
		logLevel: 'silent',
		overlay: true,
		watchOptions: {
			ignored: ['scss/global/*.scss'],
		},
	},
};

module.exports = {
	webpack,
	paths,
};
