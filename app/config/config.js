const path = require('path');
const dotenv = require('dotenv');
const ip = require('ip');

const CONFIG_PATH = __dirname;
const ROOT_PATH = GET_ROOT_PATH();
const IS_PRODUCTION = GET_IS_PRODUCTION();
const IS_DEBUG = GET_IS_DEBUG();
const IS_ANALYZE = GET_IS_ANALYZE();
const IS_FAST = GET_IS_FAST();
const ENV = GET_ENV(ROOT_PATH);
const PACKAGE_JSON = GET_PACKAGE_JSON(ROOT_PATH);

const MORE = GET_MORE(CONFIG_PATH);

if ((IS_DEBUG && IS_FAST) || (IS_DEBUG && IS_ANALYZE) || (IS_FAST && IS_ANALYZE)) {
	console.log('Error: you can specify only one of those: DEBUG, FAST, ANALYZE');
	process.exit(1);
}

module.exports = {
	CONFIG_PATH,
	ROOT_PATH,
	IS_PRODUCTION,
	IS_DEBUG,
	IS_ANALYZE,
	IS_FAST,
	ENV,
	MORE,
	PACKAGE_JSON,
};

// import workarounds
const activateWorkarounds = require(path.resolve(MORE.WORKAROUNDS_PATH, 'workarounds.js'));
activateWorkarounds();

function GET_ROOT_PATH() {
	return path.resolve(__dirname, '..');
}

function GET_MORE(config_path) {
	const base = path.resolve(config_path, 'more');
	return {
		WORKAROUNDS_PATH: path.resolve(base, 'workarounds'),
		LOADERS_PATH: path.resolve(base, 'loaders'),
		BROWSER_SYNC_PLUGINS_PATH: path.resolve(base, 'browserSyncPlugins'),
	};
}

function GET_IS_PRODUCTION() {
	if (process.env.NODE_ENV == undefined) {
		console.log(`Error: you need to specify NODE_ENV, possible values: 'production', 'development'`);
		process.exit(1);
	}
	if (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development' && process.env.NODE_ENV != 'test') {
		console.log(`Error: possible values for NODE_ENV: 'production', 'development', 'test'`);
		process.exit(1);
	}
	return process.env.NODE_ENV == 'production' ? true : false;
}

function GET_IS_DEBUG() {
	return process.env.DEBUG == 'true' ? true : false;
}

function GET_IS_ANALYZE() {
	return process.env.ANALYZE == 'true' ? true : false;
}

function GET_IS_FAST() {
	return process.env.FAST == 'true' ? true : false;
}

function GET_PACKAGE_JSON(root_path) {
	return require(path.resolve(root_path, 'package.json'));
}

function GET_ENV(root_path) {
	const env = dotenv.config({ path: path.resolve(root_path, '.env') }).parsed || {};
	const prEnv = process.env || {};
	return {
		HOST: env.HOST || prEnv.HOST || ip.address() || 'localhost',
	};
}
