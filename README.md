# iOS Scriptable Scripts

- Scriptable app: <https://apps.apple.com/app/scriptable/id1405459188>
- Scriptable website: <https://scriptable.app>

## Importing a script through iCloud Drive

1. Save the script as a `.js` file.

   - Optionally, add Scriptable-specific directives at the top, similar to the
     following. Scriptable will do it automatically when the appearance will be
     adjusted from within the app.

     ```JavaScript
     // Variables used by Scriptable.
     // These must be at the very top of the file. Do not edit.
     // icon-color: deep-green; icon-glyph: magic;
     ```

   - The file name is the title of the script in visible the app.

1. Put the file in the `Scriptable` directory in iCloud Drive.

   The script should be visible inside the Scriptable app immediately after
   the directory has been synced.

## Importing modules

[There's a module importing functionality](https://docs.scriptable.app/module)
in the app.

Simply create an `index.js` file in a directory, where the directory name is
the module name. Take this directory structure for instance:

```text
SomeScriptableScript.js
lib/
├─ service/
│  ├─ FooBarService/
│     ├─ index.js
│  ├─ DifferentService/
│     ├─ index.js
```

Then, you import the module like so:

```javascript
// SomeScriptableScript.js
const FooBarService = importModule('lib/service/FooBarService');
```

Relative imports also work:

```javascript
// lib/service/DifferentService/index.js
const FooBarService = importModule('../FooBarService');
```

## Known issues

### Class fields

This doesn't work:

```javascript
// lib/const/FeatureFlag/index.js
class FeatureFlag {
    static LOG_MODULE_IMPORTS = true;
}
module.exports = FeatureFlag;

// Other file
const FeatureFlag = importModule('lib/const/FeatureFlag');
console.log(FeatureFlag.LOG_MODULE_IMPORTS); // undefined
```

According to [this website](https://javascript.info/class#class-fields), it's
unsupported in old browsers, which is what we might be dealing with here.

Instead, place 'class constants' in `module.exports` directly:

```javascript
// lib/const/FeatureFlag/index.js
module.exports = {
    LOG_MODULE_IMPORTS: true,
};

// Other file
const FeatureFlag = importModule('lib/const/FeatureFlag');
console.log(FeatureFlag.LOG_MODULE_IMPORTS); // true

// Or, more concisely
const { LOG_MODULE_IMPORTS } = importModule('lib/const/FeatureFlag');
console.log(LOG_MODULE_IMPORTS); // true
```

## Unit-testing

```console
yarn install
yarn test
```

### Scriptable's propriety library

Given the nature of Scriptable's propriety library, it's hard to unit test code
that has references to static objects from inside the library.

A workaround is to define global objects around the tests:

<!-- markdownlint-disable MD010 -->

```javascript
beforeEach(() => {
	global.Data = {};
});

afterEach(() => {
	// Can probably get away with not deleting the global object, but it's here just to be safe.
	delete global.Data;
})
```

Or, a bit cleaner:

```javascript
beforeEach(() => {
	Data = {};
});
```

Then, used in tests:

```javascript
test.each([JPG, PNG, 'unsupported'])('Should have got an empty string when base64 encoding fails', (type) => {
	Data.fromJPEG = jest.fn().mockReturnValueOnce(null);
	Data.fromPNG = jest.fn().mockReturnValueOnce(null);

	expect(ImageUtil.base64EncodeImage(null, type)).toBe('');

	expect(Data.fromJPEG).toBeCalledTimes(JPG === type ? 1 : 0);
	expect(Data.fromPNG).toBeCalledTimes(PNG === type ? 1 : 0);
});
```

Resources on global variables in JavaScript:

- <https://stackoverflow.com/q/6888570/10620237>
- <https://stackoverflow.com/q/500431/10620237>
