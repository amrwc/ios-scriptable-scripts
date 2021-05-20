const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = importModule('__Const');
const ImageService = importModule('__ImageService');
const NumberService = importModule('__NumberService');

// Info here: https://xkcd.com/json.html
const URL_PREFIX = 'https://xkcd.com/';
const URL_POSTFIX = 'info.0.json';

module.exports = class XkcdComicService {

	/**
	 * @public
	 * @returns {Promise<{image: Image, imageURL: string, title: string, xkcdURL: string}>} Data of the
	 * randomised comic.
	 */
	static async getRandomComic() {
		const randomComicNumber = await this.getRandomComicNumber();
		const randomComicURL = URL_PREFIX + randomComicNumber + '/' + URL_POSTFIX;
		const randomComicRequest = new Request(randomComicURL);
		const { img: imageURL, title } = await randomComicRequest.loadJSON();

		const imageRequest = await new Request(imageURL);
		const image = await imageRequest.loadImage();

		return {
			image,
			imageURL,
			title,
			xkcdURL: URL_PREFIX + randomComicNumber,
		};
	}

	/**
	 * @private
	 * @return {Promise<number>} Random comic number.
	 */
	static async getRandomComicNumber() {
		const latestComicURL = URL_PREFIX + URL_POSTFIX;
		const latestComicRequest = new Request(latestComicURL);
		const { num: latestComicNumber } = await latestComicRequest.loadJSON();
		// Comic numbering starts at 1.
		return NumberService.nextInt(1, latestComicNumber);
	}

	/**
	 * Caches the comic data on the device for offline use.
	 * @public
	 * @param {object} comic Comic data.
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

		const base64 = ImageService.base64EncodeImage(comic);
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
}
