const fs = require('fs')
const path = require('path')
const showdown = require('showdown')

function* walkSync(dir) {
	const files = fs.readdirSync(dir, { withFileTypes: true })
	for (let i = 0; i < files.length; i++) {
		if (files[i].isDirectory()) {
			yield* walkSync(path.join(dir, files[i].name))
		} else {
			yield path.join(dir, files[i].name)
		}
	}
}

function checkDirectory(dir) {
	const dirname = path.dirname(dir)
	const exist = isExists(dir)

	if (!exist) {
		fs.mkdirSync(dirname, { recursive: true })
	}

	fs.mkdirSync(dirname, { recursive: true }, err => {
		if (err) throw err
	})
}

function isExists(file) {
	try {
		fs.accessSync(file)
		return true
	} catch (e) {
		return false
	}
}

function markdownToHTML(inputPath, outputPath) {
	if (fs.existsSync(inputPath)) {
		const data = fs.readFileSync(inputPath, 'utf8')
		const converter = new showdown.Converter()
		const html = converter.makeHtml(data)

		checkDirectory(outputPath)
		fs.writeFileSync(outputPath, html)
	}
}

module.exports = {
	walkSync,
	checkDirectory,
	isExists,
	markdownToHTML,
}
