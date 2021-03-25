// A. the issue:
// we want to include every file from app/src/scss/global to every other sass file
// but there isn't any simple way
//
// A. the solution:
// mock the fs read function for sass module
const mock = require('mock-require');

module.exports = function workaround() {
	const originalFs = require('fs');
	const fs = { ...originalFs };

	// =========================================================================
	// solution A
	fs.__readFileSync = fs.readFileSync;
	fs.readFileSync = function readFileSync(path, encoding) {
		const contents = fs.__readFileSync.apply(this, arguments);
		// exclude global files
		if (path.includes('scss/global')) {
			return contents;
		}

		return `@use './scss/global/*.scss' as *; /* <- added by scss workaround */ ` + contents;
	};

	mock('fs', fs);
	mock('sass', require('sass'));
	mock.stop('fs');
};
