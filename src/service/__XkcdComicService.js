const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = importModule('__LocalPath');
const { FileUtil } = importModule('__FileUtil');
const { ImageUtil } = importModule('__ImageUtil');
const { NumberUtil } = importModule('__NumberUtil');
const { XkcdComic } = importModule('__XkcdComic');

class XkcdComicService {

	/**
	 * @public
	 * @returns {Promise<{XkcdComic}>} Random xkcd comic.
	 */
	static async getRandomComic() {
		const randomComicNumber = await this.getRandomComicNumber();
		const randomComicURL = XkcdComic.getComicRESTURL(randomComicNumber);
		const randomComicRequest = new Request(randomComicURL);
		const { img: imageURL, title } = await randomComicRequest.loadJSON();

		const imageRequest = await new Request(imageURL);
		const image = await imageRequest.loadImage();

		return new XkcdComic(image, imageURL, title, randomComicNumber);
	}

	/**
	 * Caches the comic data on the device for offline use.
	 * @public
	 * @param {XkcdComic} comic Comic data.
	 */
	static cacheComic(comic) {
		// NOTE: This FileManager instance may not work if iCloud support is disabled as I don't think
		// it defaults to the `FileManager#local()`.
		const fileManager = FileManager.iCloud();
		// Path to the Scriptable directory in iCloud.
		const documentsDir = fileManager.documentsDirectory();
		const cacheDir = fileManager.joinPath(documentsDir, LOCAL_CACHE_DIRNAME);
		if (!fileManager.isDirectory(cacheDir)) {
			fileManager.createDirectory(cacheDir, true);
		}

		const cacheFilePath = fileManager.joinPath(cacheDir, XKCD_CACHE_FILENAME);
		if (fileManager.fileExists(cacheFilePath)) {
			fileManager.remove(cacheFilePath);
		}

		const imageType = FileUtil.getFileExtension(comic.imageURL);
		const base64 = ImageUtil.base64EncodeImage(comic.image, imageType);
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
	 * @private
	 * @return {Promise<number>} Random comic number.
	 */
	static async getRandomComicNumber() {
		const latestComicURL = XkcdComic.getLatestComicRESTURL();
		const latestComicRequest = new Request(latestComicURL);
		const { num: latestComicNumber } = await latestComicRequest.loadJSON();
		// Comic numbering starts at 1.
		return NumberUtil.nextInt(1, latestComicNumber);
	}
}

module.exports = {
	XkcdComicService,
}
