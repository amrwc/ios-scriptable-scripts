// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath)
}

const { NumberUtil } = importModule('./NumberUtil')

module.exports = {
	NumberUtil,
}
