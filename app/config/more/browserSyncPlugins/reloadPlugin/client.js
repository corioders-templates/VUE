((window, bs) => {
	const socket = bs.socket;
	let reloading = false;

	const onReload = () => {
		if (reloading) return;
		reloading = true;
		socket.emit('reloadPlugin:onbeforeunload');
	};

	socket.on('connection', function () {
		window.addEventListener('beforeunload', onReload);
		window.addEventListener('pagehide', onReload);

		socket.on('reloadPlugin:reload', () => {
			if (reloading) return;
			window.location.reload(true);
		});
	});
})(window, window.___browserSync___);
