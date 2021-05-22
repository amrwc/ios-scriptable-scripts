// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

// Info here: https://xkcd.com/json.html
const URL_PREFIX = 'https://xkcd.com/';
const URL_POSTFIX = 'info.0.json';

/**
 * POJO for holding comic details.
 */
class XkcdComic {

	constructor(image, imageURL, title, comicNumber) {
		this.image = image;
		this.imageURL = imageURL;
		this.title = title;
		this.comicNumber = comicNumber;
	}

	/**
	 * Builds a xkcd REST API URL for the latest comic.
	 * @public
	 * @returns {string} REST API URL for the latest comic.
	 */
	static getLatestComicRESTURL() {
		return URL_PREFIX + URL_POSTFIX;
	}

	/**
	 * Builds a xkcd REST API URL for the given comic number.
	 * @public
	 * @param {number} comicNumber Number (ID) of the xkcd comic.
	 * @returns {string} REST API URL for the given comic.
	 */
	static getComicRESTURL(comicNumber) {
		return URL_PREFIX + comicNumber + '/' + URL_POSTFIX;
	}

	get xkcdURL() {
		return URL_PREFIX + this.comicNumber;
	}
}

module.exports = {
	XkcdComic,
};
