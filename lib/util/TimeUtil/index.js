/**
 * Date/time-related utility class.
 */
class TimeUtil {

	constructor() {
	}

	/**
	 * @return {Date} Date instance the given number of minutes from now.
	 * @public
	 */
	getDateInNMinutes(minutes) {
		const nowMs = Date.now();
		const timeMs = 1000 * 60 * minutes; // ms * sec * min
		return new Date(nowMs + timeMs);
	}
}

module.exports = {
	TimeUtil,
};
