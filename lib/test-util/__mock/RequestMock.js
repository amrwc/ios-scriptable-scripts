/**
 * Mock used to replace the built-in {@link Request} object.
 */
class RequestMock {

	#url

	constructor(url) {
		this.#url = url;
	}
}

module.exports = {
	RequestMock,
};
