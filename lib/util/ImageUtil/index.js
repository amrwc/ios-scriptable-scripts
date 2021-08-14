/**
 * Utility class for manipulating images.
 */
class ImageUtil {

	constructor() {
	}

	/**
	 * Base64 encodes the given image.
	 * @param {Image} image Image data.
	 * @param {string} type Type of the image (<code>jpg</code> or <code>png</code>).
	 * @returns {string} Encoded image, or an empty string if the type is not supported.
	 * @public
	 */
	base64EncodeImage(image, type) {
		let data;
		switch (type) {
			case ImageType.JPG:
				data = Data.fromJPEG(image);
				break;
			case ImageType.PNG:
				data = Data.fromPNG(image);
				break;
			default:
				return '';
		}
		return data?.toBase64String() || '';
	}
}

class ImageType {

	static JPG = 'jpg';
	static PNG = 'png';
}

module.exports = {
	ImageUtil,
};
