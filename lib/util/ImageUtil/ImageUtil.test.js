const { ImageUtil, JPG, PNG } = require('.');

let util;

beforeEach(() => {
	global.Data = {};
	util = new ImageUtil();
});

afterEach(() => {
	delete global.Data;
})

test.each([JPG, PNG, 'unsupported'])('Should have got an empty string when base64 encoding fails', (type) => {
	Data.fromJPEG = jest.fn().mockReturnValueOnce(null);
	Data.fromPNG = jest.fn().mockReturnValueOnce(null);

	expect(util.base64EncodeImage(null, type)).toBe('');

	expect(Data.fromJPEG).toHaveBeenCalledTimes(JPG === type ? 1 : 0);
	expect(Data.fromPNG).toHaveBeenCalledTimes(PNG === type ? 1 : 0);
});

test.each([JPG, PNG])('Should have got a base64 encoded image', (type) => {
	const image = jest.fn();
	const base64Str = 'abcdef123';
	const data = {
		toBase64String: jest.fn().mockReturnValueOnce(base64Str),
	};
	Data.fromJPEG = jest.fn().mockReturnValueOnce(data);
	Data.fromPNG = jest.fn().mockReturnValueOnce(data);

	expect(util.base64EncodeImage(image, type)).toBe(base64Str);

	if (JPG === type) {
		expect(Data.fromJPEG).toHaveBeenCalled();
		expect(Data.fromJPEG).toHaveBeenCalledWith(image);
	}
	if (PNG === type) {
		expect(Data.fromPNG).toHaveBeenCalled();
		expect(Data.fromPNG).toHaveBeenCalledWith(image);
	}
});
