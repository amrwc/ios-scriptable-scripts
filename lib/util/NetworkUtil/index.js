const TEST_URL = 'https://duckduckgo.com';

/**
 * Internet/network related utility class.
 */
class NetworkUtil {

	/**
	 * @param {number} timeout Timeout in seconds.
	 * @return {Promise<boolean>} Whether the device has internet access.
	 * @public
	 */
	static async isOnline(timeout = 2) {
		const request = new Request(TEST_URL);
		request.timeoutInterval = timeout;
		try {
			await request.load();
			return true;
		} catch (exception) {
			return false;
		}
	}
}

module.exports = {
	NetworkUtil,
};
