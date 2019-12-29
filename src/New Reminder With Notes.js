// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: deep-green;
// icon-glyph: magic;
// New Reminder With Notes

const reminder = new Reminder();

const titlePrompt = new Alert();
titlePrompt.title = 'Title';
titlePrompt.addTextField();
titlePrompt.addCancelAction('Cancel');
titlePrompt.addAction('OK');
if (-1 === (await titlePrompt.present())) {
	return;
}
if (!titlePrompt.textFieldValue(0) || '' === titlePrompt.textFieldValue(0)) {
	await presentError('Reminder title must be provided');
	return;
}
reminder.title = titlePrompt.textFieldValue(0);

const isDueDatePrompt = new Alert();
isDueDatePrompt.title = 'Is there a due date?';
isDueDatePrompt.addCancelAction('No');
isDueDatePrompt.addAction('Yes');
if (-1 !== (await isDueDatePrompt.present())) {
	const datePicker = new DatePicker();
	reminder.dueDate = await datePicker.pickDateAndTime();
}

const hasNotesPrompt = new Alert();
hasNotesPrompt.title = 'Any notes to add?';
hasNotesPrompt.addCancelAction('No');
hasNotesPrompt.addAction('Yes');
if (-1 !== (await hasNotesPrompt.present())) {
	const textFieldPrompt = new Alert();
	textFieldPrompt.title = 'Notes';
	textFieldPrompt.addTextField();
	textFieldPrompt.addAction('OK');
	await textFieldValue.present();
	reminder.notes = textFieldPrompt.textFieldValue(0);
}

reminder.save();

/**
 * Presents an alert with the supplied error message.
 * @param {string} message error message
 */
async function presentError(message) {
	const alert = new Alert();
	alert.title = 'Error';
	alert.message = message;
	alert.addAction('OK');
	await alert.present();
}
