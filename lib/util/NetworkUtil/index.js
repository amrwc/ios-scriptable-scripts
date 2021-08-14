const TEST_URL = 'https://duckduckgo.com';

/**
 * Internet/network related utility class.
 */
class NetworkUtil {

	constructor() {
	}

	/**
	 * @return {Promise<boolean>} Whether the device has internet access.
	 * @public
	 */
	async isOnline() {
		const request = new Request(TEST_URL);
		try {
			await request.load();
		} catch (exception) {
			return false;
		}
		return true;
	}
}

module.exports = {
	NetworkUtil,
};
