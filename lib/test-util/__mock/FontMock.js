/**
 * Mock used to replace Scriptable's built-in {@code Font} class.
 */
class FontMock {

	/** @type {string} */
	sizeType;

	/**
	 * @param {string} sizeType Size type.
	 * @private
	 */
	constructor(sizeType) {
		this.sizeType = sizeType;
	}

	/**
	 * Instantiates {@link FontMock} with headline size.
	 * @returns {FontMock} New instance.
	 * @public
	 */
	static headline() {
		return new FontMock(FontSizeType.HEADLINE);
	}
}

/**
 * Enum representing 'size types'.
 */
class FontSizeType {

	/** @type {string} */
	static HEADLINE = 'headline';
}

module.exports = {
	FontMock,
	FontSizeType,
};
