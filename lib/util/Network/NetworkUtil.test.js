const { NetworkUtil } = require('./NetworkUtil')

const Request = (global.Request = jest.fn())

describe('NetworkUtil', () => {
	describe('when checking online status', () => {
		beforeEach(() => {
			Request.mockReturnValueOnce(Request)
		})

		afterEach(() => {
			jest.resetAllMocks()
		})

		it.each([
			{ val: true, str: 'online' },
			{ val: false, str: 'offline' },
		])(`returns $val when the device is $str`, async ({ val: isOnline }) => {
			Request.load = jest.fn().mockImplementation(async () => {
				if (isOnline) {
					return new Promise(resolve => {
						resolve(true)
					})
				} else {
					throw new Error()
				}
			})

			const result = await NetworkUtil.isOnline()

			expect(result).toBe(isOnline)
			expect(Request.load).toHaveBeenCalledTimes(1)
		})
	})
})
