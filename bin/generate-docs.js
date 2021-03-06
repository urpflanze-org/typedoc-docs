#!/usr/bin/env node

const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { generateDocs } = require('../src/generate')

const bNoBase = process.argv.slice(2).includes('--nobase')

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

	const typedocData = JSON.parse(fs.readFileSync(tmpFilename, 'utf-8'))
	generateDocs(typedocData, bNoBase)

	fs.unlinkSync(tmpFilename)

	console.log('docs generated.')
})
