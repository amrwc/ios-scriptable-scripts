const { RequestMock } = require('../../test-util/__mock/RequestMock');

const { XkcdComic } = require('../../dto/XkcdComic');
jest.mock('../../dto/XkcdComic');
const { XkcdComicService } = require('../XkcdComicService');

let fileUtil = jest.fn();
let imageUtil = jest.fn();
let numberUtil = jest.fn();

let service;

beforeEach(() => {
	global.Request = RequestMock;
	service = new XkcdComicService(fileUtil, imageUtil, numberUtil);
});

afterEach(() => {
	delete global.Request;
});

// NOTE: This is a hacky unit test, because of the way the built-in `Request` object is monkey-patched/replaced with
//     `RequestMock`.
test('Should have got random comic', async () => {
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
});
