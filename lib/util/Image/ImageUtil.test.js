const { ImageUtil } = require('.')

const IMAGE_TYPES = ['jpg', 'png']

const Data = (global.Data = jest.fn())

describe('ImageUtil', () => {
	let util

	beforeEach(() => {
		util = new ImageUtil()
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	describe('when base64-encoding an image', () => {
		it.each([...IMAGE_TYPES, 'unsupported'])('should return an empty string when base64 encoding fails', (type) => {
			const image = jest.fn()
			mockImageMethods(null)

			const result = util.base64EncodeImage(image, type)

			expect(result).toBe('')
			if (type !== 'unsupported') {
				expect(getMockMethodByImageType(type)).toHaveBeenCalledWith(image)
			} else {
				IMAGE_TYPES.forEach(imageType => {
					expect(getMockMethodByImageType(imageType)).not.toHaveBeenCalled()
				})
			}
		})

		it.each([...IMAGE_TYPES])('should return a base64-encoded image', (type) => {
			const image = jest.fn()
			const base64Str = 'abcdef123'
			const dataObj = jest.fn()
			dataObj.toBase64String = jest.fn().mockReturnValueOnce(base64Str)
			mockImageMethods(dataObj)

			const result = util.base64EncodeImage(image, type)

			expect(result).toBe(base64Str)
			expect(getMockMethodByImageType(type)).toHaveBeenCalledWith(image)
		})
	})
})

function mockImageMethods(dataObj) {
	Data.fromJPEG = jest.fn().mockReturnValueOnce(dataObj)
	Data.fromPNG = jest.fn().mockReturnValueOnce(dataObj)
}

function getMockMethodByImageType(type) {
	switch (type) {
		case 'jpg':
			return Data.fromJPEG
		case 'png':
			return Data.fromPNG
	}
}
