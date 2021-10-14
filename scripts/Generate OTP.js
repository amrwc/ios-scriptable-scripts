// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: user-tie;
// Generate OTP

const { authenticator } = importModule('lib/node-modules/otplib');

const secretPrompt = new Alert();
secretPrompt.title = 'TOTP Secret';
secretPrompt.addTextField();
secretPrompt.addCancelAction('Cancel');
secretPrompt.addAction('OK');
if (-1 === (await secretPrompt.present())) {
	return;
}
if (!secretPrompt.textFieldValue(0)) {
	await presentError('TOTP secret must be provided');
	return;
}

const secret = secretPrompt.textFieldValue(0);
const otp = authenticator.generate(secret);

const alert = new Alert();
alert.title = 'One-Time Password';
alert.message = otp;
alert.addAction('OK');
await alert.present();

async function presentError(message) {
	const alert = new Alert();
	alert.title = 'Error';
	alert.message = message;
	alert.addAction('OK');
	await alert.present();
}
