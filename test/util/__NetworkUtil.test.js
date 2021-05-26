const { NetworkUtil } = require('../../src/util/__NetworkUtil');

class RequestMock {

	#url

	constructor(url) {
		this.#url = url;
	}
}

beforeEach(() => {
	global.Request = RequestMock;
});

afterEach(() => {
	delete global.Request;
})

test.each([true, false])('Should have checked whether the device is online', async (isOnline) => {
	RequestMock.prototype.load = jest.fn().mockImplementation(async () => {
		if (isOnline) {
			return new Promise((resolve, reject) => {
				resolve(true);
			});
		} else {
			throw new Error();
		}
	});

	expect(await NetworkUtil.isOnline()).toBe(isOnline);

	expect(RequestMock.prototype.load).toHaveBeenCalled();
});