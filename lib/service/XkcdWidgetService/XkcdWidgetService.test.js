const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = require('../../const/LocalPath');

const DOCUMENTS_DIR = 'iCloud/files';
const YOURE_OFFLINE = "You're offline";

const FileManager = (global.FileManager = jest.fn());
const ListWidget = (global.ListWidget = jest.fn());
const Font = (global.Font = jest.fn());

describe('XkcdWidgetService', () => {
	let timeUtil;
	let headlineFont;
	let italicSystemFont;
	let service;

	let widgetStack;
	let widgetText;

	beforeEach(() => {
		timeUtil = jest.fn();
		timeUtil.getDateInNMinutes = jest.fn().mockImplementationOnce(ttl => ttl);
		[headlineFont, italicSystemFont] = mockFont();
		service = new XkcdWidgetService(timeUtil);

		[widgetStack, widgetText] = mockListWidget();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('when online', () => {
		it.each([true, false])('should create comic widget', withImage => {
			const image = withImage ? jest.fn() : null;
			const imageUrl = 'https://img.test.com/img1.jpg';
			const title = 'Comic Title';
			const comicNumber = 1234;
			const comic = new XkcdComic(image, imageUrl, title, comicNumber);

			const result = service.createWidget(comic);

			expect(result.refreshAfterDate).toBe(30);
			expect(ListWidget.addStack).toHaveBeenCalledTimes(withImage ? 2 : 1);
			expect(widgetStack.addSpacer).toHaveBeenCalledTimes(withImage ? 4 : 2);
			expect(widgetStack.addText.mock.calls).toEqual([[title]]);
			if (withImage) {
				expect(widgetStack.addImage.mock.calls).toEqual([[image]]);
			} else {
				expect(widgetStack.addImage).not.toHaveBeenCalled();
			}
			expect(widgetText.font).toBe(headlineFont);
			expect(result.url).toBe('https://xkcd.com/' + comicNumber);
		});
	});

	describe('when offline', () => {
		describe('with cache disabled', () => {
			// FIXME: This test doesn't work, because I don't know how to mock the `XKCD_WIDGET_ENABLE_LOCAL_CACHE`
			//  feature toggle to be `false`. The usual advice of using `jest.mock('../../const/FeatureFlag')` failed.
			it.skip('should create offline comic widget', () => {
				const fileManager = mockFileManager(false);

				const result = service.createOfflineWidget();

				expect(result.refreshAfterDate).toBe(5);
				expect(fileManager.joinPath).toHaveBeenCalledWith(DOCUMENTS_DIR, LOCAL_CACHE_DIRNAME);
				expect(fileManager.joinPath).toHaveBeenCalledWith(
					DOCUMENTS_DIR + '/' + LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME);
				expect(fileManager.readString).not.toHaveBeenCalled();
				expect(fileManager.fileExists).not.toHaveBeenCalled();
				expect(ListWidget.addStack).toHaveBeenCalledTimes(1);
				expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
				expect(widgetStack.addText.mock.calls).toEqual([[YOURE_OFFLINE]]);
				expect(widgetText.font).toBe(headlineFont);
			});
		});

		describe('with cache enabled', () => {
			describe('but the cache file missing', () => {
				it('should create offline comic widget', () => {
					const fileManager = mockFileManager(false);

					const result = service.createOfflineWidget();

					expect(result.refreshAfterDate).toBe(5);
					expect(fileManager.joinPath).toHaveBeenCalledWith(DOCUMENTS_DIR, LOCAL_CACHE_DIRNAME);
					expect(fileManager.joinPath).toHaveBeenCalledWith(
						DOCUMENTS_DIR + '/' + LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME);
					expect(fileManager.readString).not.toHaveBeenCalled();
					expect(ListWidget.addStack).toHaveBeenCalledTimes(1);
					expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
					expect(widgetStack.addText.mock.calls).toEqual([[YOURE_OFFLINE]]);
					expect(widgetText.font).toBe(headlineFont);
				});
			});

			it.each([true, false])('should create offline comic widget', withImage => {
				const image = withImage ? jest.fn() : null;
				const title = 'Comic Title';
				const fileManager = mockFileManager(true);

				fileManager.readString.mockReturnValueOnce(`
					{
						"title": "${title}",
						"image": {
							"base64": "base64-encoded-image"
						}
					}
				`);
				const Data = (global.Data = jest.fn());
				const imageData = jest.fn();
				Data.fromBase64String = jest.fn().mockReturnValueOnce(imageData);
				const Image = (global.Image = jest.fn());
				Image.fromData = jest.fn().mockReturnValueOnce(image);

				const result = service.createOfflineWidget();

				expect(result.refreshAfterDate).toBe(5);
				expect(fileManager.joinPath).toHaveBeenCalledWith(DOCUMENTS_DIR, LOCAL_CACHE_DIRNAME);
				expect(fileManager.joinPath).toHaveBeenCalledWith(
					DOCUMENTS_DIR + '/' + LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME);
				expect(ListWidget.addStack).toHaveBeenCalledTimes(withImage ? 3 : 2);
				expect(widgetStack.addSpacer).toHaveBeenCalledTimes(withImage ? 6 : 4);
				expect(widgetStack.addText).toHaveBeenCalledTimes(2);
				expect(widgetStack.addText).toHaveBeenCalledWith(YOURE_OFFLINE);
				expect(Font.italicSystemFont).toHaveBeenCalledWith(8);
				expect(widgetText.font).toBe(italicSystemFont);
			});
		});
	});
});

/**
 * Mocks the global {@code ListWidget} object.
 * @returns {({addSpacer: jest.Mock, addText: jest.Mock<any, any>, addImage: jest.Mock}|{})[]} Widget(Stack|Text) mocks.
 */
function mockListWidget() {
	const widgetText = { font: '' };
	const widgetStack = {
		addSpacer: jest.fn(),
		addText: jest.fn().mockImplementation(() => widgetText),
		addImage: jest.fn(),
	};
	ListWidget.mockReturnValueOnce(ListWidget);
	ListWidget.addStack = jest.fn().mockReturnValue(widgetStack);
	return [widgetStack, widgetText];
}

/**
 * Mocks the global {@code Font} object.
 * @returns {jest.Mock[]} Font.(headline|italicsSystemFont) mocks.
 */
function mockFont() {
	const headlineFont = jest.fn();
	Font.headline = jest.fn().mockReturnValueOnce(headlineFont);
	const italicSystemFont = jest.fn();
	Font.italicSystemFont = jest.fn().mockReturnValueOnce(italicSystemFont);
	return [headlineFont, italicSystemFont];
}

/**
 * Mocks the global {@code FileManager} object.
 * @param cacheExists Whether the cache file exists in current execution.
 * @returns {Object} FileManager.iCloud() mock instance.
 */
function mockFileManager(cacheExists) {
	const iCloudFileManager = {
		documentsDirectory: jest.fn().mockReturnValueOnce(DOCUMENTS_DIR),
		joinPath: jest.fn().mockImplementation((left, right) => left + '/' + right),
		fileExists: jest.fn().mockReturnValueOnce(cacheExists),
		readString: jest.fn(),
	};
	FileManager.iCloud = jest.fn(() => iCloudFileManager);
	return iCloudFileManager;
}
