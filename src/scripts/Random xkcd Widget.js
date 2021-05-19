// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Random xkcd Widget

/**
 * Random xkcd Widget
 *
 * Displays a random xkcd comic in a widget.
 *
 * It's a <em>heavily</em> modified version of
 * <a href="https://gist.github.com/rudotriton/9d11ce1101ff1269f56844871b3fd536">rudotriton's script</a>.
 */

// For development purposes. It displays the widget if run from the Scriptable app.
const DEBUG = true;

const ComicService = importModule('__ComicService');
const NetworkService = importModule('__NetworkService');
const WidgetService = importModule('__WidgetService');

const IS_ONLINE = await NetworkService.isOnline();

if (IS_ONLINE) {
	const comic = await ComicService.getRandomComic();
	ComicService.cacheComic(comic);
	if (config.runsInWidget) {
		// Create and show the widget on home screen.
		const widget = WidgetService.createWidget(comic);
		Script.setWidget(widget);
		Script.complete();
	} else if (DEBUG) {
		const widget = WidgetService.createWidget(comic);
		await widget.presentLarge();
	} else {
		Safari.open(comic.xkcdURL);
	}
} else {
	if (config.runsInWidget) {
		// Create and show the widget on home screen.
		const widget = WidgetService.createOfflineWidget();
		Script.setWidget(widget);
		Script.complete();
	} else if (DEBUG) {
		const widget = WidgetService.createOfflineWidget();
		await widget.presentLarge();
	}
}
