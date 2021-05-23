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

1. Put the file in the `Scriptable` directory in iCloud Drive.

   The script should be visible inside the Scriptable app soon after.

1. If using external modules, place them along the scripts. (Read more below.)

## Importing modules

[There's a module importing functionality](https://docs.scriptable.app/module)
in the app.

NOTE: So far, I wasn't able to make nested paths working, so I put all
dependencies in the main directory along the scripts. They have two underscores
prepended in their names to be easily distinguishable in the app.

### Class fields

This doesn't work:

```javascript
// __FeatureFlag.js
class FeatureFlag {
    static LOG_MODULE_IMPORTS = true;
}
module.exports = FeatureFlag;

// Other file
const FeatureFlag = importModule('__FeatureFlag');
console.log(FeatureFlag.LOG_MODULE_IMPORTS); // undefined
```

According to [this website](https://javascript.info/class#class-fields), it's
unsupported in old browsers, which is what we might be dealing with here.

Instead, place 'class constants' in `module.exports` directly:

```javascript
// __FeatureFlag.js
module.exports = {
    LOG_MODULE_IMPORTS: true,
};

// Other file
const FeatureFlag = importModule('__FeatureFlag');
console.log(FeatureFlag.LOG_MODULE_IMPORTS); // true

// Or, more concisely
const { LOG_MODULE_IMPORTS } = importModule('__FeatureFlag');
console.log(LOG_MODULE_IMPORTS); // true
```
