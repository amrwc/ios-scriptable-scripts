// If running outside the Scriptable environment...
if (typeof config === 'undefined') {
	// ... overwrite the `importModule()` global function.
	global.importModule = modulePath => require(modulePath)
}

const { ImageType } = importModule('../ImageUtil')

const PERIOD = '.'

/**
 * Utility class for handling files.
 */
class FileUtil {

	/**
	 * Attempts to find an image file on the given path with the given name.
	 * @param {FileManager} fileManager Instance of Scriptable’s {@code FileManager}.
	 * @param {string} path Path to the directory the image resides in.
	 * @param {string} name Image name without the file extension.
	 * @returns {string} Absolute path to the image file if found, or an empty string otherwise.
	 */
	static findImageByName(fileManager, path, name) {
		const partialPath = fileManager.joinPath(path, name)
		let filePath
		for (const type of Object.values(ImageType)) {
			filePath = `${partialPath}.${type}`
			if (fileManager.fileExists(filePath)) {
				return filePath
			}
		}
		return ''
	}

	/**
	 * Attempts to remove an image file in the given directory with the given name.
	 * @param {FileManager} fileManager Instance of Scriptable’s {@code FileManager}.
	 * @param {string} dirPath Path to the directory in which the image resides.
	 * @param {string} name Image name without the file extension.
	 */
	static deleteImageByPathAndName(fileManager, dirPath, name) {
		const partialPath = fileManager.joinPath(dirPath, name);
		[ImageType.JPG, ImageType.PNG].forEach(type => {
			const filePath = `${partialPath}.${type}`
			if (fileManager.fileExists(filePath)) {
				fileManager.remove(filePath)
			}
		})
	}

	/**
	 * NOTE: {@code FileManager#fileExtension} does not work with URLs. For instance, for ‘https://foo.bar/baz.jpg’, it
	 * would return an empty string, signifying that it’s a directory. This method returns ‘jpg’.
	 * @param {string} path Path to the file.
	 * @param {string} separator Path parts separator. Defaults to period.
	 * @returns {string} File extension, without the preceding separator.
	 * @public
	 */
	static getFileExtension(path, separator = PERIOD) {
		return path.split(separator).pop()
	}
}

module.exports = {
	FileUtil,
}
