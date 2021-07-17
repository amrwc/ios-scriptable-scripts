const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

const FileManager = (global.FileManager = jest.fn());
const ListWidget = (global.ListWidget = jest.fn());
const Font = (global.Font = jest.fn());

let timeUtil;
let headlineFont;
let italicSystemFont;
let service;

beforeEach(() => {
	timeUtil = jest.fn();
	timeUtil.getDateInNMinutes = jest.fn().mockImplementationOnce(ttl => ttl);
	[headlineFont, italicSystemFont] = mockFont();
	service = new XkcdWidgetService(timeUtil);
})

afterEach(() => {
	jest.resetAllMocks();
})

test.each([true, false])('Should have created comic widget', withImage => {
	const image = withImage ? jest.fn() : null;
	const imageUrl = 'https://img.test.com/img1.jpg';
	const title = 'Comic Title';
	const comicNumber = 1234;
	const comic = new XkcdComic(image, imageUrl, title, comicNumber);
	const { widgetStack, widgetText } = mockWidgetStack();

	const result = service.createWidget(comic);

	expect(result.refreshAfterDate).toBe(30);
	expect(ListWidget.addStack).toHaveBeenCalledTimes(withImage ? 2 : 1);
	expect(widgetStack.addSpacer).toHaveBeenCalledTimes(withImage ? 4 : 2);
	expect(widgetStack.addText).toHaveBeenCalledTimes(1);
	expect(widgetStack.addText).toHaveBeenCalledWith(title);
	expect(widgetStack.addImage).toHaveBeenCalledTimes(withImage ? 1 : 0);
	if (withImage) {
		expect(widgetStack.addImage).toHaveBeenCalledWith(image);
	}
	expect(widgetText.font).toBe(headlineFont);
	expect(result.url).toBe('https://xkcd.com/' + comicNumber);
});

test.each([false, true])('Should have created offline comic widget without cache', cacheEnabled => {
	setCacheFeatureFlag(cacheEnabled);
	mockFileManager();
	const { widgetStack, widgetText } = mockWidgetStack();

	const result = service.createOfflineWidget();

	expect(result.refreshAfterDate).toBe(5);
	expect(ListWidget.addStack).toHaveBeenCalledTimes(1);
	expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
	expect(widgetStack.addText).toHaveBeenCalledTimes(1);
	expect(widgetStack.addText).toHaveBeenCalledWith("You're offline");
	expect(widgetText.font).toBe(headlineFont);
});

test.each([true, false])('Should have created offline comic widget with cache', withImage => {
	const image = withImage ? jest.fn() : null;
	const title = 'Comic Title';
	setCacheFeatureFlag(true);
	const fileManager = mockFileManager(true);
	const { widgetStack, widgetText } = mockWidgetStack();

	fileManager.readString = jest.fn().mockImplementationOnce(filePath => `
		{
			"title": "${title}",
			"image": {
				"base64": "base64-encoded-image"
			}
		}
	`);
	const Data = (global.Data = jest.fn());
	const imageData = jest.fn();
	Data.fromBase64String = jest.fn().mockImplementationOnce(base64 => imageData);
	const Image = (global.Image = jest.fn());
	Image.fromData = jest.fn().mockImplementationOnce(data => image);

	const result = service.createOfflineWidget();

	expect(result.refreshAfterDate).toBe(5);
	expect(ListWidget.addStack).toHaveBeenCalledTimes(withImage ? 3 : 2);
	expect(widgetStack.addSpacer).toHaveBeenCalledTimes(withImage ? 6 : 4);
	expect(widgetStack.addText).toHaveBeenCalledTimes(2);
	expect(widgetStack.addText).toHaveBeenCalledWith("You're offline");
	expect(widgetText.font).toBe(italicSystemFont);
});

function setCacheFeatureFlag(status) {
	global.importModule = modulePath => {
		if (modulePath === '../../const/FeatureFlag') {
			return { XKCD_WIDGET_ENABLE_LOCAL_CACHE: status };
		}
		return require(modulePath);
	}
}

function mockWidgetStack() {
	ListWidget.mockReturnValueOnce(ListWidget);
	const widgetStack = jest.fn();
	ListWidget.addStack = jest.fn().mockReturnValue(widgetStack);
	widgetStack.addSpacer = jest.fn();
	const widgetText = jest.fn();
	widgetStack.addText = jest.fn().mockImplementation(text => widgetText);
	widgetStack.addImage = jest.fn();
	return { widgetStack, widgetText };
}

function mockFont() {
	const headlineFont = jest.fn();
	Font.headline = jest.fn().mockReturnValueOnce(headlineFont);
	const italicSystemFont = jest.fn();
	Font.italicSystemFont = jest.fn().mockReturnValueOnce(italicSystemFont);
	return [headlineFont, italicSystemFont];
}

function mockFileManager(cacheExists = false) {
	FileManager.iCloud = jest.fn();
	const iCloudFileManager = jest.fn();
	FileManager.iCloud.mockReturnValueOnce(iCloudFileManager);
	iCloudFileManager.documentsDirectory = jest.fn().mockReturnValueOnce('iCloud/files');
	iCloudFileManager.joinPath = jest.fn().mockImplementation((left, right) => left + '/' + right);
	iCloudFileManager.fileExists = jest.fn().mockReturnValueOnce(cacheExists);
	return iCloudFileManager;
}
