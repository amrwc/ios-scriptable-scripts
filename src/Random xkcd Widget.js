// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Random xkcd Widget

/**
 * Random xkcd Widget
 *
 * Displays a random xkcd comic in a widget.
 *
 * It's a modified version of
 * <a href="https://gist.github.com/rudotriton/9d11ce1101ff1269f56844871b3fd536">rudotriton's script</a>.
 */

// Info here: https://xkcd.com/json.html
const URL_PREFIX = 'https://xkcd.com/';
const URL_POSTFIX = 'info.0.json';
// For development, displays the widget if run from the Scriptable app.
const DEBUG = false;

const [image, title, imageURL] = await getRandomComic();

if (config.runsInWidget) {
	// Create and show the widget on home screen.
	const widget = createWidget(image, title, imageURL);
	Script.setWidget(widget);
	Script.complete();
} else if (DEBUG) {
	const widget = createWidget(image, title, imageURL);
	await widget.presentLarge();
} else {
	Safari.open(imageURL);
}

/** @return {Array<Image, string, string>} Random comic data. */
async function getRandomComic() {
	const randomComicNumber = await getRandomComicNumber();
	const randomComicURL = URL_PREFIX + randomComicNumber + '/' + URL_POSTFIX;
	const randomComicRequest = new Request(randomComicURL);
	const { img: imageURL, title } = await randomComicRequest.loadJSON();

	const imageRequest = await new Request(imageURL);
	const image = await imageRequest.loadImage();

	return [image, title, imageURL];
}

/** @return {number} Random comic number. */
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
 * @return {number} random number between the given bounds inclusive.
 */
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Image} image The image to display.
 * @param {string} title Title of the widget.
 * @param {string} widgetURL URL for the widget to open.
 * @return {ListWidget} The newly created widget instance.
 */
function createWidget(image, title, widgetURL) {
	const widget = new ListWidget();
	widget.url = widgetURL;
	widget.refreshAfterDate = getDateIn30Minutes();

	// The layout uses two horizontal stacks to be able to centre the title and the image. For some
	// reason, `WidgetTexts#centerAlignText()` didn't work on home screen.
	/** @type {WidgetStack} */
	const titleStack = widget.addStack();
	titleStack.addSpacer(null);
	/** @type {WidgetText} */
	const titleStackText = titleStack.addText(title);
	titleStackText.font = Font.headline();
	titleStack.addSpacer(null);

	/** @type {WidgetStack} */
	const imageStack = widget.addStack();
	imageStack.addSpacer(null);
	imageStack.addImage(image);
	imageStack.addSpacer(null);

	return widget;
}

/** @return {Date} Date instance 30 minutes from now. */
function getDateIn30Minutes() {
	const nowMs = new Date().getTime();
	const halfHourMs = 1000 * 60 * 30; // ms * sec * min
	return new Date(nowMs + halfHourMs);
}
