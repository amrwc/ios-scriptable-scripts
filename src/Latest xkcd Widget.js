// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;
// Latest xkcd Widget

/**
 * Latest xkcd Widget
 *
 * Displays the latest xkcd comic in a widget.
 *
 * It's a modified version of
 * <a href="https://gist.github.com/rudotriton/9d11ce1101ff1269f56844871b3fd536">rudotriton's script</a>.
 */

const URL = 'https://xkcd.com/info.0.json';
// For development, displays the widget if run from the Scriptable app.
const DEBUG = false;

const comicRequest = new Request(URL);
const { img: imageURL } = await comicRequest.loadJSON();

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

function createWidget(image, widgetURL) {
	const widget = new ListWidget();
	widget.url = widgetURL;

	const [width, height] = getDimensions(config.widgetFamily);
	const widgetImage = widget.addImage(image);
	widgetImage.imageSize = new Size(width, height);
	widgetImage.centerAlignImage();

	return widget;
}

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
