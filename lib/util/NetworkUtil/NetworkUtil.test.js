const { NetworkUtil } = require('.');

describe('NetworkUtil', () => {
	const Request = (global.Request = jest.fn());

	let util;

	beforeEach(() => {
		Request.mockReturnValueOnce(Request);
		util = new NetworkUtil();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it.each([true, false])('should have checked whether the device is online', async isOnline => {
		Request.load = jest.fn().mockImplementation(async () => {
			if (isOnline) {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			} else {
				throw new Error();
			}
		});

		expect(await util.isOnline()).toBe(isOnline);

		expect(Request.load).toHaveBeenCalled();
	});
});
