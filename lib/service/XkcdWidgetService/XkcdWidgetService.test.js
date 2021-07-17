const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

const FileManager = (global.FileManager = jest.fn());
const ListWidget = (global.ListWidget = jest.fn());
const Font = (global.Font = jest.fn());

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
	widgetStack.addImage = jest.fn().mockImplementationOnce(image => image);
	const headlineFont = mockFont();

	const timeUtil = jest.fn();
	timeUtil.getDateInNMinutes = jest.fn().mockImplementationOnce(ttl => ttl);

	const service = new XkcdWidgetService(timeUtil);
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

test.each([false, true])('Should have created offline comic widget without cache', (cacheEnabled) => {
	global.importModule = modulePath => {
		if (modulePath === '../../const/FeatureFlag') {
			return { XKCD_WIDGET_ENABLE_LOCAL_CACHE: cacheEnabled };
		}
		return require(modulePath);
	}

	mockFileManager();
	const { widgetStack, widgetText } = mockWidgetStack();
	const headlineFont = mockFont();

	const timeUtil = jest.fn();
	timeUtil.getDateInNMinutes = jest.fn().mockImplementationOnce(ttl => ttl);

	const service = new XkcdWidgetService(timeUtil);
	const result = service.createOfflineWidget();

	expect(result.refreshAfterDate).toBe(5);
	expect(ListWidget.addStack).toHaveBeenCalledTimes(1);
	expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
	expect(widgetStack.addText).toHaveBeenCalledTimes(1);
	expect(widgetStack.addText).toHaveBeenCalledWith("You're offline");
	expect(widgetText.font).toBe(headlineFont);
});

function mockWidgetStack() {
	ListWidget.mockReturnValueOnce(ListWidget);
	const widgetStack = jest.fn();
	ListWidget.addStack = jest.fn().mockReturnValue(widgetStack);
	widgetStack.addSpacer = jest.fn();
	const widgetText = jest.fn();
	widgetStack.addText = jest.fn().mockImplementationOnce(text => widgetText);
	return { widgetStack, widgetText };
}

function mockFont() {
	const headlineFont = jest.fn();
	Font.headline = jest.fn().mockReturnValueOnce(headlineFont);
	return headlineFont;
}

function mockFileManager() {
	FileManager.iCloud = jest.fn();
	const iCloudFileManager = jest.fn();
	FileManager.iCloud.mockReturnValueOnce(iCloudFileManager);
	iCloudFileManager.documentsDirectory = jest.fn().mockReturnValueOnce('iCloud/files');
	iCloudFileManager.joinPath = jest.fn().mockImplementation((left, right) => left + '/' + right);
	iCloudFileManager.fileExists = jest.fn().mockReturnValueOnce(false);
}
