const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs')

registerFont(`${__dirname}/../../resources/fonts/runescape_uf.ttf`, { family: 'Runescape Font' })

/**
 * Code used to generate the runescape hitsplats used in this project
 *
 * @param {number} numToGenerate the number of hitsplats to generate, starting at 0
 */
module.exports = async numToGenerate => {
	for (let i = 0; i < numToGenerate; i++) {
		const width = (48 * 3) / 4
		const height = (44 * 3) / 4

		const canvas = createCanvas(width, height)
		const context = canvas.getContext('2d')

		let hitsplatImage
		if (i === 0) {
			hitsplatImage = await loadImage(`${__dirname}/../../resources/images/staking/hitsplats/plain_blue_hitsplat.png`)
		} else {
			hitsplatImage = await loadImage(`${__dirname}/../../resources/images/staking/hitsplats/plain_red_hitsplat.png`)
		}

		context.drawImage(hitsplatImage, 0, 0, width, height)

		context.font = '18px "Runescape Font"'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillStyle = '#fff'

		const text = i.toString()

		context.fillText(text, width/2, height/2)

		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`${__dirname}/../../resources/images/staking/smaller_hitsplats/${i}.png`, buffer)
	}
}
