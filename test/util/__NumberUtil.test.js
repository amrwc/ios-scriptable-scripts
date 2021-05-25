const { NumberUtil } = require('../../src/util/__NumberUtil');

test('Should have randomised a number', () => {
	const result = NumberUtil.nextInt(1, 10);
	expect(result).toBeGreaterThanOrEqual(1);
	expect(result).toBeLessThanOrEqual(10);
});
