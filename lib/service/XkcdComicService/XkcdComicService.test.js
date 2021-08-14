const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdComicService } = require('../XkcdComicService');
const LocalPath = require('../../const/LocalPath');

jest.mock('../../dto/XkcdComic');

describe('XkcdComicService', () => {
	it('should get random comic', async () => {
		const Request = (global.Request = jest.fn(() => Request));

		const fileUtil = jest.fn();
		const imageUtil = jest.fn();
		const numberUtil = jest.fn();
		const service = new XkcdComicService(fileUtil, imageUtil, numberUtil);

		const randomComicNumber = 1234;
		const comicRESTURL = 'https://xkcd.com/1234/info.0.json';
		const imageURL = 'https://imgs.xkcd.com/comics/ios_keyboard_2x.png';
		const title = 'abcdef';
		const image = new Object();

		jest.spyOn(service, 'getRandomComicNumber').mockReturnValueOnce(randomComicNumber);
		jest.spyOn(XkcdComic, 'getComicRESTURL').mockReturnValueOnce(comicRESTURL);

		Request.loadJSON = jest.fn();
		Request.loadJSON.mockImplementation(() => {
			return new Promise((resolve, reject) => {
				resolve({ img: imageURL, title });
			});
		});

		Request.loadImage = jest.fn();
		Request.loadImage.mockImplementation(() => {
			return new Promise((resolve, reject) => {
				resolve(image);
			});
		});

		const result = await service.getRandomComic();

		expect(result).toBeInstanceOf(XkcdComic);
		expect(Request.loadJSON).toHaveBeenCalled();
		expect(Request.loadImage).toHaveBeenCalled();
		expect(XkcdComic).toHaveBeenCalledWith(image, imageURL, title, randomComicNumber);

		expect(fileUtil).not.toHaveBeenCalled();
		expect(imageUtil).not.toHaveBeenCalled();
		expect(numberUtil).not.toHaveBeenCalled();
	});

	it.each([
		[true, true],
		[true, false],
		[false, true],
		[false, false],
	])('should cache comic', (isDirectory, fileExists) => {
		const fileUtil = jest.fn();
		const imageUtil = jest.fn();
		const numberUtil = jest.fn();
		const service = new XkcdComicService(fileUtil, imageUtil, numberUtil);

		const documentsDir = 'abcd/efgh';
		const cacheDir = documentsDir + '/' + LocalPath.LOCAL_CACHE_DIRNAME;
		const cacheFilePath = cacheDir + '/' + LocalPath.XKCD_CACHE_FILENAME;

		const FileManager = (global.FileManager = jest.fn(() => FileManager));

		const iCloudMock = {
			documentsDirectory: jest.fn().mockReturnValueOnce(documentsDir),
			joinPath: jest.fn((left, right) => left + '/' + right),
			isDirectory: jest.fn().mockReturnValueOnce(isDirectory),
			createDirectory: jest.fn(),
			fileExists: jest.fn().mockReturnValueOnce(fileExists),
			remove: jest.fn(),
			writeString: jest.fn(),
		};
		FileManager.iCloud = jest.fn(() => iCloudMock);

		fileUtil.getFileExtension = jest.fn();
		fileUtil.getFileExtension.mockReturnValue('jpg');
		const base64EncodedImage = 'very-long-base64-string';
		imageUtil.base64EncodeImage = jest.fn();
		imageUtil.base64EncodeImage.mockReturnValue(base64EncodedImage);

		const title = 'foo';
		const xkcdURL = 'https://aksjdnkasd.com';
		const imageURL = 'https://abc.com/foo.jpg';
		const comic = {
			title,
			xkcdURL,
			imageURL,
		};
		service.cacheComic(comic);

		if (isDirectory) {
			expect(iCloudMock.createDirectory).not.toHaveBeenCalled();
		} else {
			expect(iCloudMock.createDirectory).toHaveBeenCalledWith(cacheDir, true);
		}
		if (fileExists) {
			expect(iCloudMock.remove).toHaveBeenCalledWith(cacheFilePath);
		} else {
			expect(iCloudMock.remove).not.toHaveBeenCalled();
		}

		expect(iCloudMock.writeString).toHaveBeenCalledWith(
			cacheFilePath,
			JSON.stringify(
				{
					title,
					xkcdURL,
					image: {
						url: imageURL,
						base64: base64EncodedImage,
					},
				},
				null,
				4
			)
		);
		expect(numberUtil).not.toHaveBeenCalled();
	});
});
