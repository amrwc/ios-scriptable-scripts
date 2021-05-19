const TEST_URL = 'https://duckduckgo.com';

module.exports = class NetworkService {

	/**
	 * @public
	 * @return {Promise<boolean>} Whether the device has internet access.
	 */
	static async isOnline() {
		const request = new Request(TEST_URL);
		try {
			await request.load();
		} catch (exception) {
			return false;
		}
		return true;
	}
}
