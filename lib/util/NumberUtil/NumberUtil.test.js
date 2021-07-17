const { NumberUtil } = require('.');

describe('NumberUtil', () => {
	let util;

	beforeEach(() => {
		util = new NumberUtil();
	});

	it('should have randomised a number', () => {
		const result = util.nextInt(1, 10);
		expect(result).toBeGreaterThanOrEqual(1);
		expect(result).toBeLessThanOrEqual(10);
	});
});
