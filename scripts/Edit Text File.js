// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: file-alt; share-sheet-inputs: plain-text, file-url;

const { ErrorAlert } = importModule('lib/util/Alert')

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

async function presentTable(lines = []) {
	await createTable(lines).present(true)
}

function createTable(lines) {
	const table = new UITable()

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		table.addRow(createRow(table, lines, lineIndex))
	}

	const saveFileRow = new UITableRow()
	saveFileRow.addButton('Save file')
	table.addRow(saveFileRow)

	return table
}

function createRow(table, lines, lineIndex) {
	const row = new UITableRow()
	row.addText(lines[lineIndex], null)
	row.onSelect = async () => {
		await onSelectRow(table, lines, lineIndex)
	}
	return row
}

async function onSelectRow(table, lines, lineIndex) {
	const line = lines[lineIndex]
	const [actionIndex, textFieldValue] = await presentEditPrompt(line)

	if (hasRowChanged(line, actionIndex, textFieldValue)) {
		lines[lineIndex] = textFieldValue
		await presentTable(lines)
	} else {
		await table.present(true)
	}
}

async function presentEditPrompt(line) {
	const alert = createEditPrompt(line)
	const actionIndex = await alert.present()

	return [actionIndex, alert.textFieldValue(0)]
}

function createEditPrompt(line) {
	const alert = new Alert()
	alert.title = 'Edit line'
	alert.addTextField('', line)
	alert.addDestructiveAction('Discard')
	alert.addAction('Save')
	return alert
}

function hasRowChanged(line, actionIndex, textFieldValue) {
	return actionIndex !== 0 && line !== textFieldValue
}

await presentTable(text.split('\n'))
