const { FileUtil } = require('.');

describe('FileUtil', () => {
	let util;

	beforeEach(() => {
		util = new FileUtil();
	});

	describe('when getting a file extension from the given path', () => {
		it('should return correct file extension', () => {
			expect(util.getFileExtension('.././../foo-bar/baz.test.js')).toBe('js');
		});

		describe('using a custom separator', () => {
			it('should return correct file extension', () => {
				expect(util.getFileExtension('.././../foo-bar/baz:test:js', ':')).toBe('js');
			});
		});
	});
});
