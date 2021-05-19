# iOS Scriptable Scripts

- Scriptable app: <https://apps.apple.com/app/scriptable/id1405459188>
- Scriptable website: <https://scriptable.app>

## Importing a script through iCloud Drive

1. Save the script as a `.js` file.

    - Optionally, add Scriptable-specific directives at the top, similar to the
      following:

      ```JavaScript
      // Variables used by Scriptable.
      // These must be at the very top of the file. Do not edit.
      // icon-color: deep-green; icon-glyph: magic;
      ```

    - The file name is the title of the script in visible the app.

2. Put the file in the `Scriptable` directory in iCloud Drive.

The script should be automatically imported inside the Scriptable app.

## Importing modules

[There's a module importing functionality](https://docs.scriptable.app/module)
in the app.

So far, I wasn't able to make nested paths working, so I put all dependencies
in the main directory along the scripts. They have two underscores prepended in
their names to be easily distinguishable in the app.

### Class fields

This doesn't work:

```javascript
class Const {

	static LOCAL_CACHE_DIRNAME = 'cache';
}
module.exports = new Const();

// Other file
const Const = importModule('__Const');
console.log(Const.LOCAL_CACHE_DIRNAME); // undefined
```

According to [this website](https://javascript.info/class#class-fields), it's
unsupported in old browsers, which we might be dealing with here.

Instead, put just 'class constants' in `module.exports` directly:

```javascript
module.exports.LOCAL_CACHE_DIRNAME = 'cache';

// Other file
const { LOCAL_CACHE_DIRNAME } = importModule('__Const');
console.log(LOCAL_CACHE_DIRNAME); // 'cache'
```
