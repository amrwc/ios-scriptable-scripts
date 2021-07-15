const { WidgetTextMock } = require('./WidgetTextMock');

/**
 * Mock used to replace Scriptable's built-in {@code WidgetStack} class.
 */
class WidgetStackMock {

    /** @type {Array<object>} */
    spacers;
    /** @type {WidgetTextMock} */
    text;
    /** @type {object} */
    image;

    constructor() {
        this.spacers = [];
    }

    /**
     * @param {object} spacer Spacer to append.
     * @public
     */
    addSpacer(spacer) {
        this.spacers.push(spacer);
    }

    /**
     * @param {string} text Text to add to the widget.
     * @returns {WidgetTextMock} The added text object.
     * @public
     */
    addText(text) {
        const widgetText = new WidgetTextMock(text);
        this.text = widgetText;
        return widgetText;
    }

    /**
     * @param {object} image Image be displayed by the stack.
     * @public
     */
    addImage(image) {
        this.image = image;
    }
}

module.exports = {
    WidgetStackMock,
};
