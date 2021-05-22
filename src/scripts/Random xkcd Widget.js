// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: user-tie;
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
const DEBUG = false;

const { NetworkUtil } = importModule('__NetworkUtil');
const { XkcdComicService } = importModule('__XkcdComicService');
const { XkcdWidgetService } = importModule('__XkcdWidgetService');

const IS_ONLINE = await NetworkUtil.isOnline();

let comic;
let widget;
if (IS_ONLINE) {
	comic = await XkcdComicService.getRandomComic();
	XkcdComicService.cacheComic(comic);
	widget = XkcdWidgetService.createWidget(comic);
} else {
	widget = XkcdWidgetService.createOfflineWidget();
}

if (config.runsInWidget) {
	Script.setWidget(widget);
	Script.complete();
} else if (DEBUG) {
	await widget.presentLarge();
} else if (IS_ONLINE) {
	Safari.open(comic.xkcdURL);
}
