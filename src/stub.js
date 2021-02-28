const fs = require('fs')
const path = require('path')
const { walkSync, checkDirectory } = require('./utilities')

/**
 *
 * @param {string} baseStubDirectory
 * @param {string} outputDirectory
 * @param {{[key: string | RegExp]: string}} replacingMap
 * @param {{ findAndReplaceFileName: boolean, findAndReplaceFileContent: boolean }} option
 */
function copyStub(
	baseStubDirectory,
	outputDirectory,
	replacingMap,
	option = { findAndReplaceFileName: true, findAndReplaceFileContent: true }
) {
	for (let stubFile of walkSync(baseStubDirectory)) {
		const stubName = stubFile.replace(baseStubDirectory, '')
		const stubData = fs.readFileSync(stubFile).toString()

		let outputName = stubName,
			outputData = stubData
		Object.entries(replacingMap).forEach(([key, value]) => {
			if (key[0] === '/') {
				const split = key.split('/')
				key = new RegExp(split[1], split[2])
			}

			if (option.findAndReplaceFileName) {
				outputName = outputName.replace(key, value)
			}
			if (option.findAndReplaceFileContent) {
				outputData = outputData.replace(key, value)
			}
		})

		const outputFile = path.join(outputDirectory, outputName)
		checkDirectory(outputFile)
		fs.writeFileSync(outputFile, outputData)
	}
}

module.exports = copyStub
