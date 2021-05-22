// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

/**
 * Utility class for manipulating images.
 */
class ImageUtil {

	/**
	 * Base64 encodes the given image.
	 * @public
	 * @param {Image} image Image data.
	 * @param {string} type Type of the image (<code>jpg</code> or <code>png</code>).
	 * @returns {string} Encoded image, or an empty string if the type is not supported.
	 */
	static base64EncodeImage(image, type) {
		let data;
		switch (type) {
			case 'jpg':
				data = Data.fromJPEG(image);
				break;
			case 'png':
				data = Data.fromPNG(image);
				break;
			default:
				return '';
		}
		const base64Str = data?.toBase64String();
		return base64Str || '';
	}
}

module.exports = {
	ImageUtil,
};
