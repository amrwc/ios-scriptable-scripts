// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath)
}

const { TimeUtil } = importModule('./TimeUtil')

module.exports = {
	TimeUtil,
}
