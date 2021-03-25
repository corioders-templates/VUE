const path = require('path');
const fs = require('fs')

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./config/config.js');

const aliases = require(path.resolve(config.CONFIG_PATH, 'webpackAlias.json'));
for (const key in aliases) aliases[key] = path.resolve(config.ROOT_PATH, aliases[key]);

// Setup aliases in 'jest' way.
const moduleNameMapper = {};
for (const key in aliases) {
	const from = `^${key}/(.*)$`;
	const to = `${aliases[key]}/$1`;
	moduleNameMapper[from] = to;
}

module.exports = {
	testEnvironment: 'node',
	moduleNameMapper: moduleNameMapper,
	// Ignore every file and folder except src.
	testPathIgnorePatterns: [...fs.readdirSync(__dirname).filter((name) => name != 'src')],
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			tsconfig: {
				types: ['./node_modules/@types/jest'],
				esModuleInterop: true,
			},
		},
	},
};
