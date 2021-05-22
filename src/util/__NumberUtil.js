// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

/**
 * Number-related utility class.
 */
class NumberUtil {

	/**
	 * @public
	 * @param {number} min Lower bound.
	 * @param {number} max Upper bound.
	 * @return {number} Random number between the given bounds inclusive.
	 */
	static nextInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

module.exports = {
	NumberUtil,
};
