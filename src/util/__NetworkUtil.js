// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

const TEST_URL = 'https://duckduckgo.com';

/**
 * Internet/network related utility class.
 */
class NetworkUtil {

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

module.exports = {
	NetworkUtil,
};
