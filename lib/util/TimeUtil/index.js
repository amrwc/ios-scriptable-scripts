/**
 * Date/time-related utility class.
 */
class TimeUtil {

	/**
	 * @param {number} minutes Number of minutes into the future.
	 * @return {Date} Date instance the given number of minutes from now.
	 * @public
	 */
	static getDateMinutesFromNow(minutes) {
		const nowMs = Date.now()
		const timeMs = 1000 * 60 * minutes // ms * sec * min
		return new Date(nowMs + timeMs)
	}
}

module.exports = {
	TimeUtil,
}
