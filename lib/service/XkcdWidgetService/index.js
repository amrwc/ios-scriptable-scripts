// If running outside of Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath);
}

const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = importModule('../../const/LocalPath');
const { XKCD_WIDGET_ENABLE_LOCAL_CACHE } = importModule('../../const/FeatureFlag');

const ONLINE_COMIC_TTL = 30;
const OFFLINE_COMIC_TTL = 5;
const YOURE_OFFLINE = "You're offline";

/**
 * Service for managing xkcd widgets.
 */
class XkcdWidgetService {

	constructor(timeUtil) {
		this.timeUtil = timeUtil;
	}

	/**
	 * Creates a {@link ListWidget} displaying the given comic.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @param {XkcdComic} comic Data of a randomised comic.
	 * @return {ListWidget} The newly created widget instance.
	 * @public
	 */
	createWidget(comic) {
		const widget = this.buildWidget(comic.title, ONLINE_COMIC_TTL, comic.image)
		widget.url = comic.xkcdURL;
		return widget;
	}

	/**
	 * Creates a {@link ListWidget} displaying a locally cached comic, or a generic offline notice.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @return {ListWidget} The newly created widget instance.
	 * @public
	 */
	createOfflineWidget() {
		const fileManager = FileManager.iCloud();
		const documentsDir = fileManager.documentsDirectory();
		const cacheDir = fileManager.joinPath(documentsDir, LOCAL_CACHE_DIRNAME);
		const cacheFilePath = fileManager.joinPath(cacheDir, XKCD_CACHE_FILENAME);

		if (!XKCD_WIDGET_ENABLE_LOCAL_CACHE || !fileManager.fileExists(cacheFilePath)) {
			return this.buildWidget(YOURE_OFFLINE, OFFLINE_COMIC_TTL);
		}

		const cacheDataStr = fileManager.readString(cacheFilePath);
		const cacheData = JSON.parse(cacheDataStr);

		const imageData = Data.fromBase64String(cacheData.image.base64);
		const image = Image.fromData(imageData);

		const widget = this.buildWidget(cacheData.title, OFFLINE_COMIC_TTL, image)

		/** @type {WidgetStack} */
		const offlineMessageStack = widget.addStack();
		offlineMessageStack.addSpacer(null);
		/** @type {WidgetText} */
		const offlineMessageStackText = offlineMessageStack.addText(YOURE_OFFLINE);
		offlineMessageStackText.font = Font.italicSystemFont(8);
		offlineMessageStack.addSpacer(null);

		return widget;
	}

	/**
	 * Builds a widget with the given data.
	 * @param {string} title Comic title.
	 * @param {number} ttl Minimum time, in minutes, after which the widget should update.
	 * @param {Image} image Comic image to display.
	 * @return {ListWidget} Pre-built widget.
	 * @private
	 */
	buildWidget(title, ttl, image = undefined) {
		const widget = new ListWidget();
		widget.refreshAfterDate = this.timeUtil.getDateInNMinutes(ttl);

		/** @type {WidgetStack} */
		const titleStack = widget.addStack();
		titleStack.addSpacer(null);
		/** @type {WidgetText} */
		const titleStackText = titleStack.addText(title);
		titleStackText.font = Font.headline();
		titleStack.addSpacer(null);

		if (image) {
			/** @type {WidgetStack} */
			const imageStack = widget.addStack();
			imageStack.addSpacer(null);
			imageStack.addImage(image);
			imageStack.addSpacer(null);
		}

		return widget;
	}
}

module.exports = {
	XkcdWidgetService,
};
