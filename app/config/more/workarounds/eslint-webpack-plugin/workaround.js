// A. the issue:
// when eslint webpack plugin sees file once
// it constantly reports errors that were in the file
// even if this file is not included in the bundle
//
// A. the solution:
// remove getting results from crossRunResultStorage
//
// A1. A solution creates issue:
// eslint webpack plugin checks only for rebuilded modules
//
// example:
//
// index.ts:
//	import './test.ts'
//
// test.ts:
//	some linting error
//
// 1. compilation starts
// 2. compilation finishes with errors from test.ts
// 3. user removes "import './test.ts'" from index.ts
// 4. compilation starts
// 5. compilation finishes without errors
// 6. user adds "import './test.ts'" to index.ts
// 7. compilation starts
// 8. compilation finishes without errors, expected behavior: compilation finishes with errors from test.ts
//
// as the test.ts module is not rebuilded as is wasn't changed eslint webpack plugin
// won't catch him
//
// A1. the solution:
// use other webpack hook for retrieving modules
// compilation.hooks.finishModules instead of compilation.hooks.succeedModule
//
// =========================================================================
// B. the issue:
// eslint webpack plugin lints file multiple times if the resource path is the same but resource query different:
//
// example:
//
// ./src/App.vue?target=js    (./src/App.vue for eslint webpack plugin)
// ./src/App.vue?target=html  (./src/App.vue for eslint webpack plugin)
//
// eslint webpack plugin will lint ./src/App.vue 2 times as it
// don't take into account resource query

const fs = require('fs');
const path = require('path');

const md5 = require('md5');

const config = require('../../../config');

const ESLintWebpackPluginPath = path.resolve(config.ROOT_PATH, 'node_modules/eslint-webpack-plugin');

const linterFile = {
	md5: {
		before: '3e1ddb5b802ebde7de643d4bd4a2fd97',
		after: 'cec7c7905a78938b5551cf2d256df587',
	},
	path: path.resolve(ESLintWebpackPluginPath, 'dist/linter.js'),
};

const indexFile = {
	md5: {
		before: '7aee48008cc909397d9deac17eb62a82',
		after: '25d5e211449fd8fe859946a2220b29b7',
	},
	path: path.resolve(ESLintWebpackPluginPath, 'dist/index.js'),
};

module.exports = function workaround() {
	if (check(linterFile)) {
		const linterFileSource = fs.readFileSync(linterFile.path).toString();

		const modifiedLinterModuleSource = linterFileSource
			// =========================================================================
			// solution A
			.replace(`    for (const file of asList(files)) {\n      delete crossRunResultStorage[file];\n    }`, ``) // lines 83-85
			.replace(`    for (const result of results) {\n      crossRunResultStorage[result.filePath] = result;\n    }`, ``) // lines 99-101
			.replace(`    results = Object.values(crossRunResultStorage); // do not analyze if there are no results or eslint config`, ``); // line 103

		fs.writeFileSync(linterFile.path, modifiedLinterModuleSource);
	}

	if (check(indexFile)) {
		const indexFileSource = fs.readFileSync(indexFile.path).toString();

		const modifiedIndexModuleSource = indexFileSource
			// =========================================================================
			// solution A1
			.replace(
				`compilation.hooks.succeedModule.tap(ESLINT_PLUGIN, processModule); // await and interpret results`, // line 104
				`compilation.hooks.finishModules.tap(ESLINT_PLUGIN, processModules);`,
			)
			// =========================================================================
			// solution B
			.replace(
				`      const processModule = module => {\n        if (module.resource) {\n          const file = module.resource.split('?')[0];\n\n          if (file && _micromatch.default.isMatch(file, wanted) && !_micromatch.default.isMatch(file, exclude)) {\n            // Queue file for linting.\n            lint(file);\n          }\n        }\n      }; // Gather Files to lint`, // lines 92-101
				`
				const processModules = (modules) => {
					const files = new Set();
					for (const module of modules) {
						if (!module.resource) continue;
						const file = module.resource.split('?')[0];
						if (file) files.add(file);
					}
	
					for (const file of files) {
						if (_micromatch.default.isMatch(file, wanted) && !_micromatch.default.isMatch(file, exclude)) {
							lint(file);
						}
					}
				}`,
			);

		fs.writeFileSync(indexFile.path, modifiedIndexModuleSource);
	}
};

function check(file) {
	const fileSource = fs.readFileSync(file.path).toString();
	const fileMd5 = md5(fileSource);
	if (fileMd5 == file.md5.after) return false;

	if (fileMd5 != file.md5.before) {
		console.error(`workarounds: eslint-webpack-plugin: lintedFiles: workaround not applied as md5 hash of file ${file.path} not matches`);
		return false;
	}

	return true;
}
