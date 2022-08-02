// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: file-alt; share-sheet-inputs: plain-text, file-url;

const { ErrorAlert } = importModule('lib/util/Alert');

if (!args.plainTexts.length || !args.plainTexts[0]) {
	await ErrorAlert.presentError('No text has been supplied')
	return
}

if (!args.fileURLs.length || !args.fileURLs[0]) {
	await ErrorAlert.presentError('No file URL has been supplied')
	return
}

const text = args.plainTexts[0]
const fileURL = args.fileURLs[0]

async function presentEditPrompt(table, lines, i) {
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
	await presentTable(lines)
}

function buildRow(table, lines, i) {
	const row = new UITableRow()
	row.addText(lines[i], null)
	row.onSelect = async () => {
		await presentEditPrompt(table, lines, i)
	}
	return row
}

async function presentTable(lines = []) {
	const table = new UITable()
	for (let i = 0; i < lines.length; i++) {
		table.addRow(buildRow(table, lines, i))
	}

	const saveFileRow = new UITableRow()
	saveFileRow.addButton('Save file')
	table.addRow(saveFileRow)

	await table.present(true)
}

await presentTable(text.split('\n'))
