// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: user-tie;
// Generate OTP

const { jsOTP } = importModule('lib/jsOTP');
const totp = new jsOTP.totp();

const totpSecretPrompt = new Alert();
totpSecretPrompt.title = 'TOTP Secret';
totpSecretPrompt.addSecureTextField();
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

const otpAlert = new Alert();
otpAlert.title = 'One-Time Password';
otpAlert.message = otp;
otpAlert.addAction('Copy'); // index := 0
otpAlert.addAction('OK'); // index := 1
if (0 === (await otpAlert.present())) {
	Pasteboard.copyString(otp);
}

async function presentError(message) {
	const alert = new Alert();
	alert.title = 'Error';
	alert.message = message;
	alert.addAction('OK');
	await alert.present();
}
