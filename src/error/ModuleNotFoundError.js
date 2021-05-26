/**
 * Error thrown in case a module could not be found.
 */
class ModuleNotFoundError extends Error {

	name;

	constructor(message) {
		super(message);
		this.name = 'ModuleNotFoundError';
	}
}

module.exports = {
	ModuleNotFoundError,
};
