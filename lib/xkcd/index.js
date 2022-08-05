// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath)
}

const { XkcdWidgetService } = importModule('XkcdWidgetService')

module.exports = {
	XkcdWidgetService,
}
