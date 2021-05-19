module.exports = class ImageService {

	/**
	 * Base64 encodes the comic image.
	 * @param {object} comic Comic data.
	 * @returns {string}} Encode data, or empty string if the image has an unsupported type.
	 */
	static base64EncodeImage(comic) {
		const extension = comic.imageURL.split('.').pop();
		switch (extension) {
			case 'jpg':
				return Data.fromJPEG(comic.image).toBase64String();
			case 'png':
				return Data.fromPNG(comic.image).toBase64String();
			default:
				return '';
		}
	}
}
