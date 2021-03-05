const fs = require('fs')
const path = require('path')
const copyStub = require('./stub')
const typedocToReferences = require('./typedocToReferences')
const { markdownToHTML } = require('./utilities')

const stubsDirectory = path.resolve(__dirname, '../stubs')
const outputDirectory = path.resolve('./docs')

async function generateReferences(typedocJSON, outFilePath) {
	const references = typedocToReferences(typedocJSON)
	fs.writeFileSync(path.join(outFilePath), JSON.stringify(references, null, '\t'))
}

async function generateDocs(typedocJSON) {
	const package = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'))

	await copyStub(
		stubsDirectory,
		outputDirectory,
		{
			'/{NAME}/g': package.name,
			'/{VERSION}/g': package.version,
			'/{DESCRIPTION}/g': package.description,
			'/{URL}/g': package.homepage,
			'/{BASE_URL}/g': package.homepage.replace('https://urpflanze.org', ''),
			'/{GITHUB_URL}/g': package.repository.url,
		},
		{
			findAndReplaceFileName: true,
			findAndReplaceFileContent: true,
		}
	)

	// Put references
	generateReferences(typedocJSON, path.join(outputDirectory, 'assets/references.json'))

	// Convert README.md
	markdownToHTML(path.resolve('./README.md'), path.join(outputDirectory, 'pages/readme.html'), html => {
		html = html.replace(/\<pre\>/gim, '<pre class="prettyprint">')
		return html
	})
	// Convert CHANGELOG.md
	markdownToHTML(path.resolve('./CHANGELOG.md'), path.join(outputDirectory, 'pages/changelog.html'))
}

module.exports = {
	generateDocs,
	generateReferences,
}
