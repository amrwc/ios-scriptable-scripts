const { XkcdComic } = require('../../dto/XkcdComic');
const { XkcdComicService } = require('../XkcdComicService');
const LocalPath = require('../../const/LocalPath');

jest.mock('../../dto/XkcdComic');

describe('XkcdComicService', () => {
	it('should get random comic', async () => {
		const Request = (global.Request = jest.fn());
		Request.mockReturnValue(Request);

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
		const fileUtil = {};
		const imageUtil = {};
		const numberUtil = jest.fn();
		const service = new XkcdComicService(fileUtil, imageUtil, numberUtil);

		const documentsDir = 'abcd/efgh';
		const cacheDir = documentsDir + '/' + LocalPath.LOCAL_CACHE_DIRNAME;
		const createDirectory = jest.fn();
		const cacheFilePath = cacheDir + '/' + LocalPath.XKCD_CACHE_FILENAME;
		const remove = jest.fn();
		const writeString = jest.fn();

		global.FileManager = {
			iCloud: () => ({
				documentsDirectory: jest.fn(() => documentsDir),
				joinPath: jest.fn((left, right) => left + '/' + right),
				isDirectory: path => isDirectory,
				createDirectory,
				fileExists: path => fileExists,
				remove,
				writeString,
			}),
		};

		const getFileExtension = jest.fn();
		fileUtil.getFileExtension = getFileExtension;
		getFileExtension.mockReturnValue('jpg');
		const base64EncodeImage = jest.fn();
		const base64EncodedImage = 'very-long-base64-string';
		imageUtil.base64EncodeImage = base64EncodeImage;
		base64EncodeImage.mockReturnValue(base64EncodedImage);

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
			expect(createDirectory).not.toHaveBeenCalled();
		} else {
			expect(createDirectory).toHaveBeenCalledWith(cacheDir, true);
		}
		if (fileExists) {
			expect(remove).toHaveBeenCalledWith(cacheFilePath);
		} else {
			expect(remove).not.toHaveBeenCalled();
		}

		expect(writeString).toHaveBeenCalledWith(
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

		delete global.FileManager;
	});
});
