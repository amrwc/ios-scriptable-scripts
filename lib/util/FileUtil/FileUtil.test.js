const { FileUtil } = require('.');

describe('FileUtil', () => {
	let util;

	beforeEach(() => {
		util = new FileUtil();
	});

	it('should have got file correct file extension', () => {
		expect(util.getFileExtension('.././../foo-bar/baz.test.js')).toBe('js');
	});

	it('should have got file correct file extension using custom spliterator', () => {
		expect(util.getFileExtension('.././../foo-bar/baz:test:js', ':')).toBe('js');
	});
});
