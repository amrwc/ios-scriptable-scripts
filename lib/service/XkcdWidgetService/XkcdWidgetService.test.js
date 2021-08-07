const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdWidgetService } = require('../XkcdWidgetService');

const { LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME } = require('../../const/LocalPath');

const DOCUMENTS_DIR = 'iCloud/files';
const YOURE_OFFLINE = "You're offline";

describe('XkcdWidgetService', () => {
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

	describe('when online', () => {
		it.each([true, false])('should create comic widget', withImage => {
			const image = withImage ? jest.fn() : null;
			const imageUrl = 'https://img.test.com/img1.jpg';
			const title = 'Comic Title';
			const comicNumber = 1234;
			const comic = new XkcdComic(image, imageUrl, title, comicNumber);
			const { widgetStack, widgetText } = mockListWidget();

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
	});

	describe('when offline', () => {
		describe('with cache disabled', () => {
			it.each([false, true])('should create offline comic widget', cacheEnabled => {
				setCacheFeatureFlag(cacheEnabled);
				const fileManager = mockFileManager();
				const { widgetStack, widgetText } = mockListWidget();

				const result = service.createOfflineWidget();

				expect(result.refreshAfterDate).toBe(5);
				expect(fileManager.joinPath).toHaveBeenCalledWith(DOCUMENTS_DIR, LOCAL_CACHE_DIRNAME);
				expect(fileManager.joinPath).toHaveBeenCalledWith(
					DOCUMENTS_DIR + '/' + LOCAL_CACHE_DIRNAME, XKCD_CACHE_FILENAME);
				expect(fileManager.readString).not.toHaveBeenCalled();
				expect(ListWidget.addStack).toHaveBeenCalledTimes(1);
				expect(widgetStack.addSpacer).toHaveBeenCalledTimes(2);
				expect(widgetStack.addText).toHaveBeenCalledTimes(1);
				expect(widgetStack.addText).toHaveBeenCalledWith(YOURE_OFFLINE);
				expect(widgetText.font).toBe(headlineFont);
			});
		});

		describe('with cache enabled', () => {
			it.each([true, false])('should create offline comic widget', withImage => {
				const image = withImage ? jest.fn() : null;
				const title = 'Comic Title';
				setCacheFeatureFlag(true);
				const fileManager = mockFileManager(true);
				const { widgetStack, widgetText } = mockListWidget();

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

	/**
	 * Overrides the global {@code importModule} function with the given feature flag value.
	 * @param status The {@code XKCD_WIDGET_ENABLE_LOCAL_CACHE} feature flag value.
	 */
	function setCacheFeatureFlag(status) {
		global.importModule = modulePath => {
			if (modulePath === '../../const/FeatureFlag') {
				return { XKCD_WIDGET_ENABLE_LOCAL_CACHE: status };
			}
			return require(modulePath);
		}
	}

	/**
	 * Mocks the global {@code ListWidget} object.
	 * @returns {{widgetText: jest.Mock, widgetStack: jest.Mock}} Widget(Stack|Text) mocks.
	 */
	function mockListWidget() {
		ListWidget.mockReturnValueOnce(ListWidget);
		const widgetStack = jest.fn();
		ListWidget.addStack = jest.fn().mockReturnValue(widgetStack);
		widgetStack.addSpacer = jest.fn();
		const widgetText = jest.fn();
		widgetStack.addText = jest.fn().mockImplementation(text => widgetText);
		widgetStack.addImage = jest.fn();
		return { widgetStack, widgetText };
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
	 * @returns {jest.Mock} FileManager.iCloud() mock instance.
	 */
	function mockFileManager(cacheExists = false) {
		const iCloudFileManager = jest.fn();
		FileManager.iCloud = jest.fn().mockReturnValueOnce(iCloudFileManager);
		iCloudFileManager.documentsDirectory = jest.fn().mockReturnValueOnce(DOCUMENTS_DIR);
		iCloudFileManager.joinPath = jest.fn().mockImplementation((left, right) => left + '/' + right);
		iCloudFileManager.fileExists = jest.fn().mockReturnValueOnce(cacheExists);
		iCloudFileManager.readString = jest.fn();
		return iCloudFileManager;
	}
});
