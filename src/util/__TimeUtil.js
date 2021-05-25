// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

/**
 * Date/time-related utility class.
 */
class TimeUtil {

	/**
	 * @public
	 * @return {Date} Date instance the given number of minutes from now.
	 */
	static getDateInNMinutes(minutes) {
		const nowMs = Date.now();
		const timeMs = 1000 * 60 * minutes; // ms * sec * min
		return new Date(nowMs + timeMs);
	}
}

module.exports = {
	TimeUtil,
};
