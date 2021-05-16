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
const URL_LATEST = URL_PREFIX + URL_POSTFIX;
// For development, displays the widget if run from the Scriptable app.
const DEBUG = false;

const latestComicRequest = new Request(URL_LATEST);
const { num: latestComicNumber } = await latestComicRequest.loadJSON();

// Comic numbering starts at 1.
const randomComicNumber = getRandomNumber(1, latestComicNumber);
const randomComicURL = URL_PREFIX + randomComicNumber + '/' + URL_POSTFIX;
const randomComicRequest = new Request(randomComicURL);
const { img: imageURL } = await randomComicRequest.loadJSON();

const imageRequest = await new Request(imageURL);
const image = await imageRequest.loadImage();

if (config.runsInWidget) {
	// Create and show the widget on home screen.
	const widget = createWidget(image, imageURL);
	Script.setWidget(widget);
	Script.complete();
} else if (DEBUG) {
	const widget = createWidget(image, imageURL);
	await widget.presentMedium();
} else {
	Safari.open(imageURL);
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
 * @param {object} image The image to display.
 * @param {string} widgetURL URL for the widget to open.
 * @return {ListWidget} The newly created widget instance.
 */
function createWidget(image, widgetURL) {
	const widget = new ListWidget();
	widget.url = widgetURL;

	const [width, height] = getDimensions(config.widgetFamily);
	const widgetImage = widget.addImage(image);
	widgetImage.imageSize = new Size(width, height);
	widgetImage.centerAlignImage();

	return widget;
}

/**
 * @param {string} size Size of the widget image.
 * @returns {Array<number>} Width and height of the image.
 */
function getDimensions(size) {
	switch (size) {
		case 'large':
			return [300, 300];
		case 'medium':
			return [300, 150];
		case 'small':
		default:
			return [150, 150];
	}
}
