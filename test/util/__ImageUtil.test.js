const { ImageUtil, JPG, PNG } = require('../../src/util/__ImageUtil');

beforeEach(() => {
	global.Data = {};
});

afterEach(() => {
	delete global.Data;
})

test.each([JPG, PNG, 'unsupported'])('Should have got an empty string when base64 encoding fails', (type) => {
	Data.fromJPEG = jest.fn().mockReturnValueOnce(null);
	Data.fromPNG = jest.fn().mockReturnValueOnce(null);

	expect(ImageUtil.base64EncodeImage(null, type)).toBe('');

	expect(Data.fromJPEG).toBeCalledTimes(JPG === type ? 1 : 0);
	expect(Data.fromPNG).toBeCalledTimes(PNG === type ? 1 : 0);
});

test.each([JPG, PNG])('Should have got a base64 encoded image', (type) => {
	const image = jest.fn();
	const base64Str = 'abcdef123';
	const data = {
		toBase64String: jest.fn().mockReturnValueOnce(base64Str),
	};
	Data.fromJPEG = jest.fn().mockReturnValueOnce(data);
	Data.fromPNG = jest.fn().mockReturnValueOnce(data);

	expect(ImageUtil.base64EncodeImage(image, type)).toBe(base64Str);

	if (JPG === type) {
		expect(Data.fromJPEG).toBeCalled();
		expect(Data.fromJPEG).toBeCalledWith(image);
	}
	if (PNG === type) {
		expect(Data.fromPNG).toBeCalled();
		expect(Data.fromPNG).toBeCalledWith(image);
	}
});
