const { TimeUtil } = require('.')

describe('TimeUtil', () => {
	describe('when fetching future date', () => {
		afterEach(() => {
			jest.useRealTimers()
		})

		it('returns correct future date minutes from now', () => {
			const currentDate = new Date('2021-01-01T00:00:00.000Z')
			jest.useFakeTimers('modern').setSystemTime(currentDate.getTime())

			const result = TimeUtil.getDateMinutesFromNow(10)

			expect(result).toStrictEqual(new Date('2021-01-01T00:10:00.000Z'))
		})
	})
})
