const { FileUtil } = require('../../src/util/__FileUtil');

test('Should have got file correct file extension', () => {
	expect(FileUtil.getFileExtension('.././../foo-bar/baz.test.js')).toBe('js');
});

test('Should have got file correct file extension using custom spliterator', () => {
	expect(FileUtil.getFileExtension('.././../foo-bar/baz:test:js', ':')).toBe('js');
});
