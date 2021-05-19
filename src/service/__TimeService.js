module.exports = class TimeService {

	/** @return {Date} Date instance the given number of minutes from now. */
	static getDateInNMinutes(minutes) {
		const nowMs = new Date().getTime();
		const timeMs = 1000 * 60 * minutes; // ms * sec * min
		return new Date(nowMs + timeMs);
	}
}
