// Info here: https://xkcd.com/json.html
const BASE_URL = 'https://xkcd.com/';
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
	 * @returns {string} REST API URL for the latest comic.
	 * @public
	 */
	static getLatestComicURL() {
		return `${BASE_URL}${URL_POSTFIX}`;
	}

	/**
	 * Builds a xkcd REST API URL for the given comic number.
	 * @param {number} comicNumber Number (ID) of the xkcd comic.
	 * @returns {string} REST API URL for the given comic.
	 * @public
	 */
	static getComicURL(comicNumber) {
		return `${BASE_URL}${comicNumber}/${URL_POSTFIX}`;
	}

	get xkcdURL() {
		return `${BASE_URL}${this.comicNumber}`;
	}
}

module.exports = {
	XkcdComic,
};
