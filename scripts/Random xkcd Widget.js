// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: user-tie;
// Random xkcd Widget

/**
 * Random xkcd Widget
 *
 * Displays a random xkcd comic in a widget.
 *
 * Inspired by
 * <a href="https://gist.github.com/rudotriton/9d11ce1101ff1269f56844871b3fd536">rudotriton's script</a>.
 */

// For development purposes. It displays the widget if run from the Scriptable app.
const DEBUG = false

const { NetworkUtil } = importModule('lib/util/NetworkUtil')
const { XkcdWidgetService } = importModule('lib/xkcd')

const widgetService = new XkcdWidgetService()

const widget = await widgetService.createWidget()

if (config.runsInWidget) {
	Script.setWidget(widget)
	Script.complete()
} else if (DEBUG) {
	await widget.presentLarge()
} else if (await NetworkUtil.isOnline()) {
	Safari.open(widget.url)
}
