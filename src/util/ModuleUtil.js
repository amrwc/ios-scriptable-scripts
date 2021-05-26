const { resolve } = require('path');
const { readdir } = require('fs').promises;

const { ModuleNotFoundError } = require('../error/ModuleNotFoundError');

const SRC = 'src';

/**
 * Utility class for handling module importing outside of Scriptable environment.
 */
class ModuleUtil {

	/**
	 * Locates a module with the given name, and returns its absolute path.
	 * @public
	 * @param moduleName Name of the module.
	 * @param fileExtension File extension of the module. Defaults to <code>'js'</code>.
	 * @returns {Promise<string>} Path to the module.
	 * @throws ModuleNotFoundError in case the module has not been found.
	 */
	static async getModulePath(moduleName, fileExtension = 'js') {
		const files = await this.listFiles(SRC);
		const filesFiltered = files.filter(path => path.includes(`${moduleName}.${fileExtension}`));
		if (!filesFiltered) {
			throw new ModuleNotFoundError(`Module '${moduleName}' has not been found`);
		}
		if (filesFiltered.length > 1) {
			console.warn(`More than one module called '${moduleName}' found. Returning the first one`);
		}
		return filesFiltered[0].toString();
	}

	/**
	 * Lists absolute file paths in the given directory.
	 * @private
	 * @param {string} dir Directory path from root. E.g. <code>'src'</code>.
	 * @returns {Promise<FlatArray<string>[]>} List of file paths.
	 * @see Taken from <a href="https://stackoverflow.com/a/45130990/10620237">this SO answer</a>.
	 */
	static async listFiles(dir) {
		const dirEntries = await readdir(dir, { withFileTypes: true });
		const results = dirEntries.map(dirEntry => {
			const res = resolve(dir, dirEntry.name);
			return dirEntry.isDirectory() ? this.listFiles(res) : res;
		});
		const files = await Promise.all(results);
		return files.flat();
	}
}

module.exports = {
	ModuleUtil,
};
