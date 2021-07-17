const { TimeUtil } = require('.');

describe('TimeUtil', () => {
	let util;

	beforeEach(() => {
		util = new TimeUtil();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should have got correct future date', () => {
		const currentDate = new Date('2021-01-01T00:00:00.000Z');
		const futureDate = new Date('2021-01-01T00:10:00.000Z');
		jest
			.useFakeTimers('modern')
			.setSystemTime(currentDate.getTime());
		expect(util.getDateInNMinutes(10)).toEqual(futureDate);
	});
});
