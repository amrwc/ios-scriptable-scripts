// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = importModule('__LocalPath');
const { XKCD_WIDGET_ENABLE_LOCAL_CACHE } = importModule('__FeatureFlag');
const { TimeUtil } = importModule('__TimeUtil');

/**
 * Service for managing xkcd widgets.
 */
class XkcdWidgetService {

	/**
	 * Creates a {@link ListWidget} displaying the given comic.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @param {XkcdComic} comic Data of a randomised comic.
	 * @param {number} refreshAfter Minimum number of minutes the widget will refresh after.
	 * @return {ListWidget} The newly created widget instance.
	 */
	createWidget(comic, refreshAfter = 30) {
		const widget = new ListWidget();

		/** @type {WidgetStack} */
		const titleStack = widget.addStack();
		titleStack.addSpacer(null);
		/** @type {WidgetText} */
		const titleStackText = titleStack.addText(comic.title);
		titleStackText.font = Font.headline();
		titleStack.addSpacer(null);

		/** @type {WidgetStack} */
		const imageStack = widget.addStack();
		imageStack.addSpacer(null);
		imageStack.addImage(comic.image);
		imageStack.addSpacer(null);

		widget.url = comic.xkcdURL;
		widget.refreshAfterDate = TimeUtil.getDateInNMinutes(refreshAfter);

		return widget;
	}

	createOfflineWidget() {
		const fileManager = FileManager.iCloud();
		const documentsDir = fileManager.documentsDirectory();
		const cacheDir = fileManager.joinPath(documentsDir, LOCAL_CACHE_DIRNAME);
		const cacheFilePath = fileManager.joinPath(cacheDir, XKCD_CACHE_FILENAME);

		if (!XKCD_WIDGET_ENABLE_LOCAL_CACHE || !fileManager.fileExists(cacheFilePath)) {
			const widget = new ListWidget();

			/** @type {WidgetStack} */
			const titleStack = widget.addStack();
			titleStack.addSpacer(null);
			/** @type {WidgetText} */
			const titleStackText = titleStack.addText("You're offline");
			titleStackText.font = Font.headline();
			titleStack.addSpacer(null);

			return widget;
		}

		const cacheDataStr = fileManager.readString(cacheFilePath);
		const cacheData = JSON.parse(cacheDataStr);

		const imageData = Data.fromBase64String(cacheData.image.base64);
		const image = Image.fromData(imageData);
		const comic = {
			image,
			title: cacheData.title,
			xkcdURL: cacheData.xkcdURL,
		};
		const widget = XkcdWidgetService.createWidget(comic, 5);

		/** @type {WidgetStack} */
		const titleStack = widget.addStack();
		titleStack.addSpacer(null);
		/** @type {WidgetText} */
		const titleStackText = titleStack.addText("You're offline");
		titleStackText.font = Font.italicSystemFont(8);
		titleStack.addSpacer(null);

		return widget;
	}
}

module.exports = {
	XkcdWidgetService,
};
