class ErrorAlert {

	static async presentError(message) {
		const alert = new Alert()
		alert.title = 'Error'
		alert.message = message
		alert.addCancelAction('OK')
		await alert.present()
	}
}

module.exports = {
	ErrorAlert,
}
