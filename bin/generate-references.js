#!/usr/bin/env node

const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { generateReferences } = require('../src/generate')

const root = process.cwd()
const packageTsConfigPath = path.resolve(root, 'tsconfig.json')
const tmpFilename = path.resolve(root, '__urpflanze__docs__tmp.json')
const typedoc = path.resolve(root, 'node_modules/.bin/typedoc')

exec(`${typedoc} . --tsconfig ${packageTsConfigPath} --json ${tmpFilename}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`)
		return
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`)
		return
	}

	const typedocData = JSON.parse(fs.readFileSync(tmpFilenameAbs, 'utf-8'))
	generateReferences(typedocData, path.resolve('./references.json'))

	fs.unlinkSync(tmpFilenameAbs)
})
