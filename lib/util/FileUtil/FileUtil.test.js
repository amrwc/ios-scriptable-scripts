const { ImageType } = require('../ImageUtil')

const { FileUtil } = require('.')

describe('FileUtil', () => {
	describe('when finding image by name', () => {
		const dirPath = '/foo/bar/baz'
		const name = 'image-name'

		let fileManager

		beforeEach(() => {
			fileManager = jest.fn()
			fileManager.joinPath = jest.fn().mockImplementation((...parts) => parts.join('/'))
		})

		describe('when no such image exists', () => {
			it('returns an empty string', () => {
				fileManager.fileExists = jest.fn().mockReturnValue(false)

				const result = FileUtil.findImageByName(fileManager, dirPath, name)

				expect(result).toStrictEqual('')
				expect(fileManager.fileExists).toHaveBeenCalledTimes(Object.values(ImageType).length)
			})
		})

		describe('when such image exists', () => {
			it('returns an absolute path to the image', () => {
				fileManager.fileExists = jest.fn().mockImplementation((path) => path.endsWith(ImageType.PNG))

				const result = FileUtil.findImageByName(fileManager, dirPath, name)

				expect(result).toStrictEqual('/foo/bar/baz/image-name.png')
			})
		})
	})

	describe('when deleting an image by directory path and name', () => {
		const dirPath = '/foo/bar/baz'
		const name = 'image-name'

		let fileManager

		beforeEach(() => {
			fileManager = jest.fn()
			fileManager.joinPath = jest.fn().mockImplementation((...parts) => parts.join('/'))
			fileManager.remove = jest.fn()
		})

		describe('when the file does not exist', () => {
			it('does nothing', () => {
				fileManager.fileExists = jest.fn().mockReturnValue(false)

				FileUtil.deleteImageByPathAndName(fileManager, dirPath, name)

				expect(fileManager.fileExists).toHaveBeenCalledTimes(2)
				expect(fileManager.remove).not.toHaveBeenCalled()
			})
		})

		describe('when an image with the given name exists', () => {
			it('removes the image', () => {
				fileManager.fileExists = jest.fn().mockImplementation((path) => path.endsWith('png'))

				FileUtil.deleteImageByPathAndName(fileManager, dirPath, name)

				expect(fileManager.fileExists).toHaveBeenCalledTimes(2)
				expect(fileManager.remove).toHaveBeenCalledTimes(1)
				expect(fileManager.remove).toHaveBeenCalledWith(`${dirPath}/${name}.png`)
			})
		})
	})

	describe('when getting a file extension from the given path', () => {
		it('returns correct file extension', () => {
			expect(FileUtil.getFileExtension('.././../foo-bar/baz.test.js')).toBe('js')
		})

		describe('using a custom separator', () => {
			it('returns correct file extension', () => {
				expect(FileUtil.getFileExtension('.././../foo-bar/baz:test:js', ':')).toBe('js')
			})
		})
	})
})
