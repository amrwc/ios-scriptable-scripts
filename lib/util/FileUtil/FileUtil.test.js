const { FileUtil } = require('.');

let util;

beforeEach(() => {
	util = new FileUtil();
});

test('Should have got file correct file extension', () => {
	expect(util.getFileExtension('.././../foo-bar/baz.test.js')).toBe('js');
});

test('Should have got file correct file extension using custom spliterator', () => {
	expect(util.getFileExtension('.././../foo-bar/baz:test:js', ':')).toBe('js');
});
