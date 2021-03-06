#!/usr/bin/env node

const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { generateDocs } = require('../src/generate')

const tmpFilename = './__urpflanze__docs__tmp.json'
const tmpFilenameAbs = path.resolve('./__urpflanze__docs__tmp.json')

const bNoBase = process.argv.slice(2).includes('--nobase')

exec(`npx typedoc . --tsconfig ./tsconfig.json --json ${tmpFilename}`, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`)
		return
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`)
		return
	}

	const typedocData = JSON.parse(fs.readFileSync(tmpFilenameAbs, 'utf-8'))
	generateDocs(typedocData, bNoBase)

	fs.unlinkSync(tmpFilenameAbs)

	console.log('docs generated.')
})
