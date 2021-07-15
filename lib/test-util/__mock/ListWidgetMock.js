const { WidgetStackMock } = require('./WidgetStackMock');

/**
 * Mock used to replace Scriptable's built-in {@code ListWidget} class.
 */
class ListWidgetMock {

	/** @type {number} */
	refreshAfterDate;
	/** @type {Array<WidgetStackMock>} */
	stacks;

	constructor() {
		this.stacks = [];
	}

	/**
	 * Appends new {@link WidgetStackMock} to the widget.
	 * @return {WidgetStackMock} The newly created {@link WidgetStackMock}.
	 * @public
	 */
	addStack() {
		const stack = new WidgetStackMock();
		this.stacks.push(stack);
		return stack;
	}
}

module.exports = {
	ListWidgetMock,
};
