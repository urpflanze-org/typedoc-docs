#!/usr/bin/env node

const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { generateDocs, generateReferences } = require('../src/generate')

const tmpFilename = '__urpflanze__docs__tmp.json'
const tmpFilenameAbs = path.resolve('./__urpflanze__docs__tmp.json')

exec(`npx typedoc . --json ./${tmpFilename}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`)
		return
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`)
		return
	}

	const typedocData = JSON.parse(fs.readFileSync(tmpFilename, 'utf-8'))
	generateReferences(typedocData, path.resolve('./references.json'))

	fs.unlinkSync(tmpFilenameAbs)
})
