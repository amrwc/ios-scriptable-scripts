const { TimeUtil } = require('.');

afterEach(() => {
	jest.useRealTimers();
})

test('Should have gotten correct future date', () => {
	const currentDate = new Date('2021-01-01T00:00:00.000Z');
	const futureDate = new Date('2021-01-01T00:10:00.000Z');
	jest
		.useFakeTimers('modern')
		.setSystemTime(currentDate.getTime());
	expect(TimeUtil.getDateInNMinutes(10)).toEqual(futureDate);
});
