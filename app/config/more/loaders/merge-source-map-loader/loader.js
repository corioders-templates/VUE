const mergeSourceMap = require('@babel/core/lib/transformation/file/merge-map').default;
const oldSourceMaps = new Map();

/** @this {import("@types/webpack").loader.LoaderContext} */
module.exports = function (code, map) {
	this.cacheable(true);

	const options = this.getOptions();
	if (!options || (options && options.pre == undefined && options.post == undefined)) {
		this.callback(new Error('source-map-loader: options: post or pre properties are required'));
		return;
	}

	if (!this.sourceMap) {
		this.callback(null, code, map);
		return;
	}

	const { pre, post } = options;
	const key = this.resourcePath;

	if (post && oldSourceMaps.has(key)) {
		const oldMap = oldSourceMaps.get(key);
		const mergedMap = mergeSourceMap(oldMap, map);
		map = mergedMap;
		oldSourceMaps.delete(key);
	} else if (pre && map) {
		oldSourceMaps.set(key, map);
	}

	this.callback(null, code, map);
};
