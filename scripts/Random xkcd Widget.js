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
const DEBUG = false;

const { NetworkUtil } = importModule('lib/util/NetworkUtil');

const { XkcdComicService } = importModule('lib/service/XkcdComicService');
const { XkcdWidgetService } = importModule('lib/service/XkcdWidgetService');

const comicService = new XkcdComicService();
const widgetService = new XkcdWidgetService();

const networkUtil = new NetworkUtil();
const IS_ONLINE = await networkUtil.isOnline();

let comic;
let widget;
if (IS_ONLINE) {
	comic = await comicService.getRandomComic();
	comicService.cacheComic(comic);
	widget = widgetService.createWidget(comic);
} else {
	widget = widgetService.createOfflineWidget();
}

if (config.runsInWidget) {
	Script.setWidget(widget);
	Script.complete();
} else if (DEBUG) {
	await widget.presentLarge();
} else if (IS_ONLINE) {
	Safari.open(comic.xkcdURL);
}
