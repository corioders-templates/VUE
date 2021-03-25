const eslintWebpackPluginWorkaround = require('./eslint-webpack-plugin/workaround.js');
const sassWorkaround = require('./sass/workaround.js');

module.exports = () => {
	eslintWebpackPluginWorkaround();
	sassWorkaround();
};
