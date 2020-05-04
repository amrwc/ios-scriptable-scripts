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
if (!titlePrompt.textFieldValue(0)) {
	await presentError('Reminder title must be provided');
	return;
}
reminder.title = titlePrompt.textFieldValue(0);

const datePicker = new DatePicker();
let dueDate;
try {
	dueDate = await datePicker.pickDateAndTime();
} catch (ex) {
	if (ex.message.includes('Date picker was cancelled')) {
		return;
	} else {
		throw ex;
	}
}
// Set due date rounded to the closest 5 minutes
const coeff = 1000 * 60 * 5;
reminder.dueDate = new Date(Math.round(dueDate / coeff) * coeff);

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
