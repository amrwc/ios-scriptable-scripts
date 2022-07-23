// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath);
}

const LocalPath = importModule('../../const/LocalPath');
const { XkcdComic } = importModule('../../dto/XkcdComic');
const { FileUtil } = importModule('../../util/FileUtil');
const { ImageUtil } = importModule('../../util/ImageUtil');
const { NumberUtil } = importModule('../../util/NumberUtil');

/**
 * Service for managing xkcd comics.
 */
class XkcdComicService {

	constructor(fileUtil, imageUtil, numberUtil) {
		this.fileUtil = fileUtil || new FileUtil();
		this.imageUtil = imageUtil || new ImageUtil();
		this.numberUtil = numberUtil || new NumberUtil();
	}

	/**
	 * @returns {Promise<XkcdComic>} Random xkcd comic.
	 * @public
	 */
	async getRandomComic() {
		const randomComicNumber = await this.getRandomComicNumber();
		const randomComicURL = XkcdComic.getComicURL(randomComicNumber);
		const randomComicRequest = new Request(randomComicURL);
		const { img: imageURL, title } = await randomComicRequest.loadJSON();

		const imageRequest = new Request(imageURL);
		const image = await imageRequest.loadImage();

		return new XkcdComic(image, imageURL, title, randomComicNumber);
	}

	/**
	 * Caches the comic data on the device for offline use.
	 * @param {XkcdComic} comic Comic data.
	 * @public
	 */
	cacheComic(comic) {
		// NOTE: This FileManager instance may not work if iCloud support is disabled as I don't think
		// it defaults to the `FileManager#local()`.
		const fileManager = FileManager.iCloud();
		// Path to the Scriptable directory in iCloud.
		const documentsDir = fileManager.documentsDirectory();
		const cacheDir = fileManager.joinPath(documentsDir, LocalPath.LOCAL_CACHE_DIRNAME);
		if (!fileManager.isDirectory(cacheDir)) {
			fileManager.createDirectory(cacheDir, true);
		}

		const cacheFilePath = fileManager.joinPath(cacheDir, LocalPath.XKCD_CACHE_FILENAME);
		if (fileManager.fileExists(cacheFilePath)) {
			fileManager.remove(cacheFilePath);
		}

		const imageType = this.fileUtil.getFileExtension(comic.imageURL);
		const base64 = this.imageUtil.base64EncodeImage(comic.image, imageType);
		const comicCacheData = {
			title: comic.title,
			xkcdURL: comic.xkcdURL,
			image: {
				url: comic.imageURL,
				base64,
			},
		};

		const comicCacheDataStr = JSON.stringify(comicCacheData, null, 4);
		fileManager.writeString(cacheFilePath, comicCacheDataStr);
	}

	/**
	 * @return {Promise<number>} Random comic number.
	 * @private
	 */
	async getRandomComicNumber() {
		const latestComicURL = XkcdComic.getLatestComicURL();
		const latestComicRequest = new Request(latestComicURL);
		const { num: latestComicNumber } = await latestComicRequest.loadJSON();
		// Comic numbering starts at 1.
		return this.numberUtil.nextInt(1, latestComicNumber);
	}
}

module.exports = {
	XkcdComicService,
};
