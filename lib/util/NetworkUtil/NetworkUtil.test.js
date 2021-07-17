const { RequestMock } = require('../../test-util/__mock/RequestMock');

const { NetworkUtil } = require('.');

describe('NetworkUtil', () => {
	let util;

	beforeEach(() => {
		global.Request = RequestMock;
		util = new NetworkUtil();
	});

	afterEach(() => {
		delete global.Request;
	});

	it.each([true, false])('should have checked whether the device is online', async isOnline => {
		RequestMock.prototype.load = jest.fn().mockImplementation(async () => {
			if (isOnline) {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			} else {
				throw new Error();
			}
		});

		expect(await util.isOnline()).toBe(isOnline);

		expect(RequestMock.prototype.load).toHaveBeenCalled();
	});
});
