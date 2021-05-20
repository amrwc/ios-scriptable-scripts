const PERIOD = '.';

class FileService {

	/**
	 * @param {string} path Path to the file.
	 * @param {string} separator Path parts separator. Defaults to period.
	 * @returns {string} File extension, without the preceding separator.
	 */
	static getFileExtension(path, separator = PERIOD) {
		return path.split(separator).pop();
	}
}

module.exports = {
	FileService,
}
