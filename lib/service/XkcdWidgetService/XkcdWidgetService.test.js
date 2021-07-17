const { FontMock, FontSizeType } = require('../../test-util/__mock/FontMock');
const { ListWidgetMock } = require('../../test-util/__mock/ListWidgetMock');

const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

afterEach(() => {
	delete global.FileManager;
	delete global.ListWidget;
	delete global.Font;
})

test('Should have created comic widget', () => {
	global.ListWidget = ListWidgetMock;
	global.Font = FontMock;

	const refreshAfterDate = 300;
	const image = jest.fn();
	const imageUrl = 'https://img.test.com/img1.jpg';
	const title = 'Comic Title';
	const comicNumber = 1234;
	const comic = new XkcdComic(image, imageUrl, title, comicNumber);

	const timeUtil = jest.fn();
	timeUtil.getDateInNMinutes = jest.fn().mockReturnValueOnce(refreshAfterDate);
	const service = new XkcdWidgetService(timeUtil);

	const result = service.createWidget(comic);

	expect(timeUtil.getDateInNMinutes).toHaveBeenCalledTimes(1);
	expect(result.refreshAfterDate).toBe(refreshAfterDate);
	expect(result.stacks).toHaveLength(2);
	expect(result.stacks[0].text.text).toBe(title);
	expect(result.stacks[0].text.font.sizeType).toBe(FontSizeType.HEADLINE);
	expect(result.stacks[1].image).toBe(image);
	expect(result.url).toBe('https://xkcd.com/' + comicNumber);
});

test.each([false, true])('Should have created offline comic widget without cache', (cacheEnabled) => {
	global.importModule = modulePath => {
		if (modulePath === '../../const/FeatureFlag') {
			return { XKCD_WIDGET_ENABLE_LOCAL_CACHE: cacheEnabled };
		}
		return require(modulePath);
	}
	const FileManager = (global.FileManager = jest.fn());
	const ListWidget = (global.ListWidget = jest.fn());
	const Font = (global.Font = jest.fn());

	FileManager.iCloud = jest.fn();
	const iCloudFileManager = jest.fn();
	FileManager.iCloud.mockReturnValueOnce(iCloudFileManager);
	iCloudFileManager.documentsDirectory = jest.fn().mockReturnValueOnce('iCloud/files');
	iCloudFileManager.joinPath = jest.fn().mockImplementation((left, right) => left + '/' + right);
	iCloudFileManager.fileExists = jest.fn().mockReturnValueOnce(false);

	ListWidget.mockReturnValueOnce(ListWidget);
	const widgetStack = jest.fn();
	ListWidget.addStack = jest.fn().mockReturnValue(widgetStack);
	widgetStack.addSpacer = jest.fn();
	const widgetText = jest.fn();
	widgetStack.addText = jest.fn().mockImplementationOnce(text => widgetText);

	const headlineFont = jest.fn();
	Font.headline = jest.fn().mockReturnValueOnce(headlineFont);

	const timeUtil = jest.fn();
	timeUtil.getDateInNMinutes = jest.fn().mockImplementationOnce(ttl => ttl);

	const service = new XkcdWidgetService(timeUtil);
	const result = service.createOfflineWidget();

	expect(result.refreshAfterDate).toBe(5);
	expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
	expect(widgetStack.addText).toHaveBeenCalledTimes(1);
	expect(widgetText.font).toBe(headlineFont);
});
