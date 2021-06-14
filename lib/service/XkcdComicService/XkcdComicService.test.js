const { RequestMock } = require('../../test-util/__mock/RequestMock');

const { XkcdComic } = require('../../dto/XkcdComic');
jest.mock('../../dto/XkcdComic');
const { XkcdComicService } = require('../XkcdComicService');
const LocalPath = require('../../const/LocalPath');

let fileUtil = jest.fn();
let imageUtil = jest.fn();
let numberUtil = jest.fn();

let service;

beforeEach(() => {
	service = new XkcdComicService(fileUtil, imageUtil, numberUtil);
});

// NOTE: This is a hacky unit test, because of the way the built-in `Request` object is monkey-patched/replaced with
//     `RequestMock`.
test('Should have got random comic', async () => {
	global.Request = RequestMock;

	const randomComicNumber = 1234;
	const comicRESTURL = 'https://xkcd.com/1234/info.0.json';
	const imageURL = 'https://imgs.xkcd.com/comics/ios_keyboard_2x.png';
	const title = 'abcdef';
	const image = new Object();

	jest.spyOn(service, 'getRandomComicNumber').mockImplementation(() => randomComicNumber);
	jest.spyOn(XkcdComic, 'getComicRESTURL').mockImplementation(() => comicRESTURL);

	const loadJSONMock = jest.fn();
	RequestMock.prototype.loadJSON = loadJSONMock;
	loadJSONMock.mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve({ img: imageURL, title });
		});
	});

	const loadImageMock = jest.fn();
	loadImageMock.mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve(image);
		});
	});
	RequestMock.prototype.loadImage = loadImageMock;

	const result = await service.getRandomComic();

	expect(result).toBeInstanceOf(XkcdComic);
	expect(loadJSONMock).toHaveBeenCalled();
	expect(loadImageMock).toHaveBeenCalled();
	expect(XkcdComic).toHaveBeenCalledWith(image, imageURL, title, randomComicNumber);

	expect(fileUtil).not.toHaveBeenCalled();
	expect(imageUtil).not.toHaveBeenCalled();
	expect(numberUtil).not.toHaveBeenCalled();

	delete global.Request;
});

test.each([
	[true, true],
	[true, false],
	[false, true],
	[false, false],
])('Should have cached comic', (isDirectory, fileExists) => {
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
			writeString
		}),
	};

	const getFileExtension = jest.fn();
	// TODO: Can't do this:
	this.fileUtil.getFileExtension = getFileExtension;
	getFileExtension.mockReturnValue('jpg');
	const base64EncodeImage = jest.fn();
	// TODO: Can't do this:
	this.imageUtil.base64EncodeImage = base64EncodeImage;
	base64EncodeImage.mockReturnValue('very-long-base64-string');

	// TODO: Add some random values
	const comic = {};
	service.cacheComic(comic);

	if (isDirectory) {
		expect(createDirectory).toHaveBeenCalledWith(cacheDir);
	} else {
		expect(createDirectory).not.toHaveBeenCalled();
	}
	if (fileExists) {
		expect(remove).toHaveBeenCalledWith(cacheFilePath);
	} else {
		expect(remove).not.toHaveBeenCalled();
	}
	// TODO: Chcek the arguments
	expect(writeString).toHaveBeenCalled();

	delete global.FileManager;
});
