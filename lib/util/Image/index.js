// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath)
}

const { ImageType } = importModule('./ImageType')
const { ImageUtil } = importModule('./ImageUtil')

module.exports = {
	ImageType,
	ImageUtil,
}
