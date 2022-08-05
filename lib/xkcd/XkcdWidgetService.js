const FeatureFlag = importModule('../const/FeatureFlag')
const LocalPath = importModule('../const/LocalPath')
const { XkcdComicService } = importModule('./XkcdComicService')
const { FileUtil } = importModule('../util/File')
const { NetworkUtil } = importModule('../util/Network')
const { TimeUtil } = importModule('../util/Time')

const ONLINE_COMIC_TTL = 30
const OFFLINE_COMIC_TTL = 5
const YOURE_OFFLINE = 'You’re offline'

/**
 * Service for managing xkcd widgets.
 */
class XkcdWidgetService {

	constructor() {
		this.comicService = new XkcdComicService()
	}

	/**
	 * Creates a {@link ListWidget} displaying the given comic.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @return {ListWidget} The newly created widget instance.
	 * @public
	 */
	async createWidget() {
		if (await NetworkUtil.isOnline()) {
			const comic = await this.comicService.getRandomComic()
			const widget = this.buildWidget({ ...comic, ttl: ONLINE_COMIC_TTL })
			widget.url = comic.xkcdURL
			return widget
		} else {
			return this.createOfflineWidget()
		}
	}

	/**
	 * Creates a {@link ListWidget} displaying a locally cached comic, or a generic offline notice.
	 * <p>
	 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
	 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
	 * @return {ListWidget} The newly created widget instance.
	 * @private
	 */
	createOfflineWidget() {
		const fileManager = FileManager.iCloud()
		const documentsDir = fileManager.documentsDirectory()
		const cacheDir = fileManager.joinPath(documentsDir, LocalPath.LOCAL_CACHE_DIRNAME)
		const cacheFilePath = fileManager.joinPath(cacheDir, LocalPath.XKCD_CACHE_FILENAME)
		const cacheImagePath = FileUtil.findImageByName(fileManager, cacheDir, LocalPath.XKCD_CACHE_IMAGE_FILENAME)

		if (!FeatureFlag.XKCD_WIDGET_ENABLE_LOCAL_CACHE || !fileManager.fileExists(cacheFilePath) || !cacheImagePath) {
			return this.buildWidget({ title: YOURE_OFFLINE, ttl: OFFLINE_COMIC_TTL })
		}

		const cacheDataStr = fileManager.readString(cacheFilePath)
		const cacheData = JSON.parse(cacheDataStr)

		/** @type {ListWidget} */
		const widget = this.buildWidget({
			title: cacheData.title,
			ttl: OFFLINE_COMIC_TTL,
			image: Image.fromFile(cacheImagePath),
		})

		/** @type {WidgetStack} */
		const offlineMessageStack = widget.addStack()
		offlineMessageStack.addSpacer(null)
		/** @type {WidgetText} */
		const offlineMessageStackText = offlineMessageStack.addText(YOURE_OFFLINE)
		offlineMessageStackText.font = Font.italicSystemFont(8)
		offlineMessageStack.addSpacer(null)

		return widget
	}

	/**
	 * Builds a widget with the given data.
	 * @param {string} title Comic title.
	 * @param {number} ttl Minimum time, in minutes, after which the widget should update.
	 * @param {Image} image Comic image to display.
	 * @return {ListWidget} Pre-built widget.
	 * @private
	 */
	buildWidget({ title, ttl, image }) {
		const widget = new ListWidget()
		widget.refreshAfterDate = TimeUtil.getDateMinutesFromNow(ttl)

		/** @type {WidgetStack} */
		const titleStack = widget.addStack()
		titleStack.addSpacer(null)
		/** @type {WidgetText} */
		const titleStackText = titleStack.addText(title)
		titleStackText.font = Font.headline()
		titleStack.addSpacer(null)

		if (image) {
			/** @type {WidgetStack} */
			const imageStack = widget.addStack()
			imageStack.addSpacer(null)
			imageStack.addImage(image)
			imageStack.addSpacer(null)
		}

		return widget
	}
}

module.exports = {
	XkcdWidgetService,
}
