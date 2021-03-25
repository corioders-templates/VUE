const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');

const { walkSync } = require('@nodelib/fs.walk');
const { lookpath } = require('lookpath');

const TOOLS_DIR = __dirname;
module.exports = async function main(ROOT_DIR, GO_OUT, JS_OUT) {
	const { includeDirs, protocCommand, protoFiles } = await configure(ROOT_DIR, TOOLS_DIR);

	const includeDirsString = includeDirs
		.map((val) => `--proto_path="${val.trim()}"`)
		.join(' ')
		.trim();

	const protoFilesString = protoFiles
		.map((val) => val.trim())
		.join(' ')
		.trim();

	fs.rmSync(GO_OUT, { recursive: true, force: true });
	fs.rmSync(JS_OUT, { recursive: true, force: true });

	fs.mkdirSync(GO_OUT, { recursive: true, force: true });
	fs.mkdirSync(JS_OUT, { recursive: true, force: true });

	const PROTOC_GEN_TS_PATH = path.resolve(__dirname, 'node_modules/.bin/protoc-gen-ts');
	const command =
		`${protocCommand} ${includeDirsString} --proto_path="${ROOT_DIR}" ` +
		`--plugin="${PROTOC_GEN_TS_PATH}" ` +
		`--go_out="${GO_OUT}" --go_opt=paths=source_relative --go-grpc_out="${GO_OUT}" --go-grpc_opt=paths=source_relative ` +
		`--js_out="import_style=commonjs,binary:${JS_OUT}" --ts_out="service=grpc-web:${JS_OUT}" ` +
		`${protoFilesString}`;

	await new Promise((resolve) => {
		exec(command, (err, stdout, stderr) => {
			if (err != undefined) {
				console.log(err.message);
				process.exit(1);
			}

			if (stdout != '') process.stdout.write(stdout);
			if (stderr != '') process.stderr.write(stderr);

			resolve();
		});
	});
};

async function configure(ROOT_DIR, TOOLS_DIR) {
	const INCLUDE_DIRS = [path.resolve(TOOLS_DIR, 'include/proto')];
	const PROTOC_COMMAND = 'protoc';
	const PROTOC_MINVER = '3.14.0';

	const installMessage =
		`Download and install protoc and the protobuf headers by installing protoc via a package manager\n` +
		`or downloading it from the protobuf releases page:\n` +
		`https://github.com/protocolbuffers/protobuf/releases/`;

	// check if protoc command exists
	const protocCommand = await lookpath(PROTOC_COMMAND);
	if (protocCommand == undefined) {
		console.error('Error: protoc not found');
		console.error(installMessage);
		process.exit(1);
	}

	// check protoc version
	const protocVersion = execSync(`${protocCommand} --version`).toString().split(' ')[1].trim();

	const protocMinverArr = PROTOC_MINVER.split('.');
	const protocVersionArr = protocVersion.split('.');
	for (let i = 0; i < 3; i++) {
		if (Number(protocMinverArr[i]) > Number(protocVersionArr[i])) {
			console.error(`Error: version: ${protocVersion} is lower than the required version: ${PROTOC_MINVER}`);
			console.error(installMessage);
			process.exit(1);
		}
	}

	const protoFiles = walkSync(ROOT_DIR)
		// filter out .proto files
		.filter((file) => {
			if (path.extname(file.name) == '.proto') {
				return true;
			}
			return false;
		})
		// map to absolute file path and relative protoc output path
		.map((file) => {
			return file.path;
		})
		// sort files so that the root files are on the top adn then so on
		.sort((a, b) => a.split('/').length - b.split('/').length);

	return { includeDirs: INCLUDE_DIRS, protocCommand, protoFiles };
}
