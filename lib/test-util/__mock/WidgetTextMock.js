const { FontMock } = require('./FontMock');

/**
 * Mock used to replace Scriptable's built-in {@code WidgetText} class.
 */
class WidgetTextMock {

    /** @type {string} */
    text;
    /** @type {FontMock} */
    font;

    constructor(text) {
        this.text = text;
    }
}

module.exports = {
    WidgetTextMock,
};
