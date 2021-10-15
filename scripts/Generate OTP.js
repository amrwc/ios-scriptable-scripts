// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: user-tie;
// Generate OTP

const { jsOTP } = importModule('lib/jsOTP');
const totp = new jsOTP.totp();

const totpSecretPrompt = new Alert();
totpSecretPrompt.title = 'TOTP Secret';
totpSecretPrompt.addTextField();
totpSecretPrompt.addCancelAction('Cancel');
totpSecretPrompt.addAction('OK');
if (-1 === (await totpSecretPrompt.present())) {
	return;
}
if (!totpSecretPrompt.textFieldValue(0)) {
	await presentError('TOTP secret must be provided');
	return;
}

const totpSecret = totpSecretPrompt.textFieldValue(0);
const otp = totp.getOtp(totpSecret);

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
