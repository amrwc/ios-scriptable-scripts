const fs = require('fs');
const path = require('path');

const { ModuleNotFoundError } = require('../error/ModuleNotFoundError');

const SRC = 'src';

/**
 * Utility class for handling module importing outside of Scriptable environment.
 * <p>
 * NOTE: Scriptable will break if the <code>await</code> keyword is present before the <code>importModule()</code>
 * method is called, no matter where and how it's defined. Therefore, keep the methods here synchronous.
 */
class ModuleUtil {

	/**
	 * Locates a module with the given name, and returns its absolute path.
	 * @public
	 * @param moduleName Name of the module.
	 * @param fileExtension File extension of the module. Defaults to <code>'js'</code>.
	 * @returns {string} Path to the module.
	 * @throws ModuleNotFoundError in case the module has not been found.
	 */
	static getModulePath(moduleName, fileExtension = 'js') {
		const files = this.listFiles(SRC);
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
	 * @returns {FlatArray<string>[]} List of file paths.
	 * @see Taken from <a href="https://stackoverflow.com/a/45130990/10620237">this SO answer</a>.
	 */
	static listFiles(dir) {
		const dirEntries = fs.readdirSync(dir, { withFileTypes: true });
		const filePaths = dirEntries.map(dirEntry => {
			const res = path.resolve(dir, dirEntry.name);
			return dirEntry.isDirectory() ? this.listFiles(res) : res;
		});
		return filePaths.flat();
	}
}

module.exports = {
	ModuleUtil,
};
