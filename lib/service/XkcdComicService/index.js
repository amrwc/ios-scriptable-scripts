// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath);
}

const LocalPath = importModule('../../const/LocalPath');
const { XkcdComic } = importModule('../../dto/XkcdComic');
const { FileUtil } = importModule('../../util/FileUtil');
const { NumberUtil } = importModule('../../util/NumberUtil');

/**
 * Service for managing xkcd comics.
 */
class XkcdComicService {

	constructor(params = {}) {
		const { numberUtil } = params;
		this.numberUtil = numberUtil || new NumberUtil();
	}

	/**
	 * @param {boolean} cacheComic Whether to cache the comic.
	 * @returns {Promise<XkcdComic>} Random xkcd comic.
	 * @public
	 */
	async getRandomComic(cacheComic = true) {
		const randomComicNumber = await this.getRandomComicNumber();
		const randomComicURL = XkcdComic.getComicURL(randomComicNumber);
		const randomComicRequest = new Request(randomComicURL);
		const { img: imageURL, title } = await randomComicRequest.loadJSON();

		const imageRequest = new Request(imageURL);
		const image = await imageRequest.loadImage();

		const xkcdComic = new XkcdComic(image, imageURL, title, randomComicNumber);

		if (cacheComic) {
			this.cacheComic(xkcdComic);
		}

		return xkcdComic;
	}

	/**
	 * Caches the comic data on the device for offline use.
	 * @param {XkcdComic} comic Comic data.
	 * @private
	 */
	cacheComic(comic) {
		// NOTE: This FileManager instance may not work if iCloud support is disabled as I don't think
		// it defaults to `FileManager#local()`.
		// https://docs.scriptable.app/filemanager/#icloud
		const fileManager = FileManager.iCloud();
		// Path to the Scriptable directory in iCloud.
		// https://docs.scriptable.app/filemanager/#-documentsdirectory
		const documentsDirPath = fileManager.documentsDirectory();
		const cacheDirPath = fileManager.joinPath(documentsDirPath, LocalPath.LOCAL_CACHE_DIRNAME);
		if (!fileManager.isDirectory(cacheDirPath)) {
			fileManager.createDirectory(cacheDirPath, true);
		}

		const cacheFilePath = fileManager.joinPath(cacheDirPath, LocalPath.XKCD_CACHE_FILENAME);
		if (fileManager.fileExists(cacheFilePath)) {
			fileManager.remove(cacheFilePath);
		}

		FileUtil.deleteImageByPathAndName(fileManager, cacheDirPath, LocalPath.XKCD_CACHE_IMAGE_FILENAME);
		const cacheImagePartialPath = fileManager.joinPath(cacheDirPath, LocalPath.XKCD_CACHE_IMAGE_FILENAME);

		const imageType = FileUtil.getFileExtension(comic.imageURL);
		const comicCacheData = {
			title: comic.title,
			xkcdURL: comic.xkcdURL,
			image: {
				url: comic.imageURL,
				filePath: `${cacheImagePartialPath}.${imageType}`,
			},
		};

		const comicCacheDataStr = JSON.stringify(comicCacheData, null, 4);
		fileManager.writeString(cacheFilePath, comicCacheDataStr);
		fileManager.writeImage(comicCacheData.image.filePath, comic.image);
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
