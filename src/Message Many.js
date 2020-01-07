// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: envelope;
// Message Many

const RECIPIENTS = [
	// strings with phone numbers
];
const CONTENT = '';

const msg = new Message();
msg.recipients = RECIPIENTS;
msg.body = CONTENT;
msg.send();
