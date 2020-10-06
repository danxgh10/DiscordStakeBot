const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')

const WIDTH = 60
const HEIGHT = 10
const MAX_HEALTH = 100

const HP_BAR_GREEN = '#00fe00'
const HP_BAR_RED = '#ff0000'

/**
 * Function used to generate the MAX_HEALTH + 1
 * health bars for player health, used in the staking command
 */
module.exports = () => {
	for (let currentHealth = 0; currentHealth <= MAX_HEALTH; currentHealth++) {
		// Calculate the width of the green health bar, making sure that 1HP gives some green bar
		const greenBarLength = currentHealth === 1 ? Math.ceil((currentHealth * WIDTH) / MAX_HEALTH) : Math.floor((currentHealth * WIDTH) / MAX_HEALTH)

		const canvas = createCanvas(WIDTH, HEIGHT)
		const context = canvas.getContext('2d')

		// Make a red background
		context.fillStyle = HP_BAR_RED
		context.fillRect(0, 0, WIDTH, HEIGHT)

		// Add the green health on top
		context.fillStyle = HP_BAR_GREEN
		context.fillRect(0, 0, greenBarLength, HEIGHT)

		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`${__dirname}/../../resources/images/staking/healthbars/${currentHealth}.png`, buffer)
	}
}