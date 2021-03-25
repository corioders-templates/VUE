const path = require('path');
const fs = require('fs');

const BROWSER_CLIENT = path.resolve(__dirname, 'client.js');

module.exports.plugin = (opts, bs) => {
	const io = bs.io.of(bs.options.getIn(['socket', 'namespace']));
	io.on('connection', (socket) => {
		socket.on('reloadPlugin:onbeforeunload', () => {
			io.emit('reloadPlugin:reload');
		});
	});
};

module.exports.hooks = {
	'client:js': fs.readFileSync(BROWSER_CLIENT),
};
