const { RequestMock } = require('../../test-util/__mock/RequestMock');

const { XkcdComic } = require('../../dto/XkcdComic');
jest.mock('../../dto/XkcdComic');
const { XkcdComicService } = require('../XkcdComicService');

let service;

beforeEach(() => {
	global.Request = RequestMock;
	service = new XkcdComicService();
});

afterEach(() => {
	delete global.Request;
});

// NOTE: This is a hacky unit test, because of the way the built-in `Request` object is monkey-patched/replaced with
//     `RequestMock`.
// NOTE 2: This is a pretty bad unit test, because I don't know how to effectively mock/replace the XkcdComic import to
//     hijack static calls to its functions.
test('Should have got random comic', async () => {
	const randomComicNumber = 1234;
	const comicRESTURL = 'https://xkcd.com/1234/info.0.json';
	const imageURL = 'https://imgs.xkcd.com/comics/ios_keyboard_2x.png';
	const title = 'abcdef';
	const image = new Object();

	jest.spyOn(service, 'getRandomComicNumber').mockImplementation(() => randomComicNumber);
	jest.spyOn(XkcdComic, 'getComicRESTURL').mockImplementation(() => comicRESTURL);

	RequestMock.prototype.loadJSON = jest.fn().mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve({ img: imageURL, title });
		});
	});
	RequestMock.prototype.loadImage = jest.fn().mockImplementation(() => {
		return new Promise((resolve, reject) => {
			resolve(image);
		});
	});

	const result = await service.getRandomComic();

	expect(result).toBeInstanceOf(XkcdComic);
	expect(XkcdComic).toHaveBeenCalledWith(image, imageURL, title, randomComicNumber);
});
