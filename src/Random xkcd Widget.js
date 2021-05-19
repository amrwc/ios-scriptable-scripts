// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Random xkcd Widget

/**
 * Random xkcd Widget
 *
 * Displays a random xkcd comic in a widget.
 *
 * It's a <em>heavily</em> modified version of
 * <a href="https://gist.github.com/rudotriton/9d11ce1101ff1269f56844871b3fd536">rudotriton's script</a>.
 */

// Info here: https://xkcd.com/json.html
const URL_PREFIX = 'https://xkcd.com/';
const URL_POSTFIX = 'info.0.json';
// For development purposes. It displays the widget if run from the Scriptable app.
const DEBUG = true;
// Whether to cache the downloaded comics locally for offline reuse.
const ENABLE_LOCAL_CACHE = true;
const LOCAL_CACHE_DIRNAME = 'cache';
const LOCAL_CACHE_FILENAME = 'random-xkcd-widget-cache.json';
const IS_ONLINE = await checkIsOnline();

if (IS_ONLINE) {
	const comic = await getRandomComic();
	cacheComic(comic);
	if (config.runsInWidget) {
		// Create and show the widget on home screen.
		const widget = createWidget(comic);
		Script.setWidget(widget);
		Script.complete();
	} else if (DEBUG) {
		const widget = createWidget(comic);
		await widget.presentLarge();
	} else {
		Safari.open(comic.xkcdURL);
	}
} else {
	if (config.runsInWidget) {
		// Create and show the widget on home screen.
		const widget = createOfflineWidget();
		Script.setWidget(widget);
		Script.complete();
	} else if (DEBUG) {
		const widget = createOfflineWidget();
		await widget.presentLarge();
	}
}

/** @return {Promise<boolean>} Whether the device has internet access. */
async function checkIsOnline() {
	const request = new Request('https://duckduckgo.com');
	try {
		await request.load();
	} catch (exception) {
		return false;
	}
	return true;
}

/**
 * @returns {Promise<{image: Image, imageURL: string, title: string, xkcdURL: string}>} Data of the
 * randomised comic.
 */
async function getRandomComic() {
	const randomComicNumber = await getRandomComicNumber();
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

/** @return {Promise<number>} Random comic number. */
async function getRandomComicNumber() {
	const latestComicURL = URL_PREFIX + URL_POSTFIX;
	const latestComicRequest = new Request(latestComicURL);
	const { num: latestComicNumber } = await latestComicRequest.loadJSON();
	// Comic numbering starts at 1.
	return getRandomNumber(1, latestComicNumber);
}

/**
 * @param {number} min Lower bound.
 * @param {number} max Upper bound.
 * @return {number} Random number between the given bounds inclusive.
 */
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a {@link ListWidget} displaying the given comic.
 * <p>
 * NOTE: The layout uses horizontal stacks to be able to centre the title and the image. For some
 * reason, `WidgetText#centerAlignText()` didn't work on home screen.
 * @param {object} comic Data of a randomised comic.
 * @param {number} refreshAfter Minimum number of minutes the widget will refresh after.
 * @return {ListWidget} The newly created widget instance.
 */
function createWidget(comic, refreshAfter = 30) {
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
	widget.refreshAfterDate = getDateInNMinutes(refreshAfter);

	return widget;
}

/**
 * Caches the comic data on the device for offline use.
 * @param {object} comic Comic data.
 */
function cacheComic(comic) {
	// NOTE: This FileManager instance may not work if iCloud support is disabled as I don't think
	// it defaults to the `FileManager#local()`.
	const fileManager = FileManager.iCloud();
	// Path to the Scriptable directory in iCloud.
	const documentsDir = fileManager.documentsDirectory();
	const cacheDir = fileManager.joinPath(documentsDir, LOCAL_CACHE_DIRNAME);
	if (!fileManager.isDirectory(cacheDir)) {
		fileManager.createDirectory(cacheDir, true);
	}

	const cacheFilePath = fileManager.joinPath(cacheDir, LOCAL_CACHE_FILENAME);
	if (fileManager.fileExists(cacheFilePath)) {
		fileManager.remove(cacheFilePath);
	}

	const base64 = base64EncodeImage(comic);
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
 * Base64 encodes the comic image.
 * @param {object} comic Comic data.
 * @returns {string}} Encode data, or empty string if the image has an unsupported type.
 */
function base64EncodeImage(comic) {
	const extension = comic.imageURL.split('.').pop();
	switch (extension) {
		case 'jpg':
			return Data.fromJPEG(comic.image).toBase64String();
		case 'png':
			return Data.fromPNG(comic.image).toBase64String();
		default:
			return '';
	}
}

/** @return {Date} Date instance the given number of minutes from now. */
function getDateInNMinutes(minutes) {
	const nowMs = new Date().getTime();
	const timeMs = 1000 * 60 * minutes; // ms * sec * min
	return new Date(nowMs + timeMs);
}

function createOfflineWidget() {
	const fileManager = FileManager.iCloud();
	const documentsDir = fileManager.documentsDirectory();
	const cacheDir = fileManager.joinPath(documentsDir, LOCAL_CACHE_DIRNAME);
	const cacheFilePath = fileManager.joinPath(cacheDir, LOCAL_CACHE_FILENAME);

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
	const widget = createWidget(comic, 5);

	/** @type {WidgetStack} */
	const titleStack = widget.addStack();
	titleStack.addSpacer(null);
	/** @type {WidgetText} */
	const titleStackText = titleStack.addText("You're offline");
	titleStackText.font = Font.italicSystemFont(8);
	titleStack.addSpacer(null);

	return widget;
}
