// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: file-alt; share-sheet-inputs: plain-text, file-url;

if (!args.plainTexts.length || !args.plainTexts[0]) {
	const alert = new Alert()
	alert.title = 'Error'
	alert.message = 'No text has been supplied'
	alert.addCancelAction('OK')
	alert.present()
	return
}

if (!args.fileURLs.length || !args.fileURLs[0]) {
	const alert = new Alert()
	alert.title = 'Error'
	alert.message = 'No file URL has been supplied'
	alert.addCancelAction('OK')
	alert.present()
	return
}

const text = args.plainTexts[0]
const fileURL = args.fileURLs[0]

async function presentAlert(table, lines, i) {
	const alert = new Alert()
	alert.title = 'Edit line'
	alert.addTextField('', lines[i])
	alert.addDestructiveAction('Discard')
	alert.addAction('Save')
	const actionIndex = await alert.present()

	if (actionIndex === 0 || lines[i] === alert.textFieldValue(0)) {
		// No changes made, present the old table  
		await table.present(true)
		return
	}

	lines[i] = alert.textFieldValue(0)
	const newTable = buildTable(lines)
	await newTable.present(true)
}

function buildRow(table, lines, i) {
	const row = new UITableRow()
	row.addText(lines[i], null)
	row.onSelect = async () => {
		await presentAlert(table, lines, i)
	}
	return row
}

function buildTable(lines = []) {
	const table = new UITable()
	for (let i = 0; i < lines.length; i++) {
		table.addRow(buildRow(table, lines, i))
	}

	const saveFileRow = new UITableRow()
	saveFileRow.addButton('Save file')
	saveFileRow.onSelect(() => {

	})
	table.addRow(saveFileRow)

	return table
}

const table = buildTable(text.split('\n'))
await table.present(true)
