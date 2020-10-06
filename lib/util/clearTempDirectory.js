const fs = require('fs')
const rimraf = require('rimraf')

/**
 * Clear the temp directory by deleting and recreating it
 */
module.exports = () => {
	console.log(`Deleting directory ${__dirname}/../../temp`)
	rimraf.sync(`${__dirname}/../../temp`)

	console.log(`Recreating directory ${__dirname}/../../temp`)
	if (!fs.existsSync(`${__dirname}/../../temp`)) {
		fs.mkdirSync(`${__dirname}/../../temp`)
	}
}