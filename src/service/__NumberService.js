module.exports = class NumberService {

	/**
	 * @param {number} min Lower bound.
	 * @param {number} max Upper bound.
	 * @return {number} Random number between the given bounds inclusive.
	 */
	static nextInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}
