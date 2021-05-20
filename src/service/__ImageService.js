/**
 * Service for manipulating images.
 */
class ImageService {

	/**
	 * Base64 encodes the given image.
	 * @param {Image} image Image data.
	 * @param {string} type Type of the image ({@code jpg} or {@code png}).
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
	ImageService,
}
