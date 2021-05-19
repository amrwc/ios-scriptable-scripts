const Const = importModule('__Const');
const TimeService = importModule('__TimeService');

// Whether to cache the downloaded comics locally for offline reuse.
const ENABLE_LOCAL_CACHE = true;

module.exports = class WidgetService {

	/**
	 * Creates a {@link ListWidget} displaying the given comic.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @param {object} comic Data of a randomised comic.
	 * @param {number} refreshAfter Minimum number of minutes the widget will refresh after.
	 * @return {ListWidget} The newly created widget instance.
	 */
	static createWidget(comic, refreshAfter = 30) {
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
		widget.refreshAfterDate = TimeService.getDateInNMinutes(refreshAfter);

		return widget;
	}

	static createOfflineWidget() {
		const fileManager = FileManager.iCloud();
		const documentsDir = fileManager.documentsDirectory();
		const cacheDir = fileManager.joinPath(documentsDir, Const.LOCAL_CACHE_DIRNAME);
		const cacheFilePath = fileManager.joinPath(cacheDir, Const.XKCD_CACHE_FILENAME);

		if (!ENABLE_LOCAL_CACHE || !fileManager.fileExists(cacheFilePath)) {
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
		const widget = WidgetService.createWidget(comic, 5);

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
