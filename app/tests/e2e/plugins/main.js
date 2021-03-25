const dotenvPlugin = require('cypress-dotenv');

module.exports = function (on, config) {
	config = dotenvPlugin(config, undefined, true);
	return config;
};
