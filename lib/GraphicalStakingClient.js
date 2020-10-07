const { createCanvas, loadImage, registerFont } = require('canvas')
const { MessageAttachment } = require('discord.js')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const rimraf = require('rimraf')

const StakingClient = require('./StakingClient.js')

registerFont(`${__dirname}/../resources/fonts/runescape_uf.ttf`, { family: 'Runescape Font' })

// Feel free to add more backgrounds. This one is 175 x 190, and you should probably keep any other ones this size or
// change the code because it isn't currently generalized. PR a fix if you go down that route! :)
const templateMetadata = [
	{
		fileName: `${__dirname}/../resources/images/staking/templates/duelTemplate.png`,
		templateDimensions: {
			width: 175,
			height: 190
		},
		player1: {
			nameLocation: { x: 34, y: 8 }, // Center point for the player1 name text
			hitsplatLocation: { x: 4, y: 76 }, // Top left location for the player 1 hitsplat image
			healthLocation: { x: 4, y: 16 } // Top left location for the player 1 health bar image
		},
		player2: {
			nameLocation: { x: 146, y: 22 },
			hitsplatLocation: { x: 136, y: 106 },
			healthLocation: { x: 114, y: 33 }
		}
	}
]

// The template to use - if you add more, try making this random
const TEMPLATE_TO_USE = 0

/**
 * A graphical staking client that extends the base client. Produces images with hitsplats and health bars and player
 * names for each frame of the stake
 */
class GraphicalStakingClient extends StakingClient {
	/**
	 * Create a GraphicalStakingClient
	 *
	 * @param {object} channel the channel object for the channel to perform the stake in
	 * @param {string} player1 the name of the 1st player
	 * @param {string} player2 the name of the 2nd player
	 *
	 * @returns {GraphicStakingClient} a graphical staking client
	 */
	constructor(channel, player1, player2) {
		super(channel, player1, player2)
		this.stakeId = uuid()
	}

	/**
	 * @inheritdoc
	 */
	async stake() {
		this.generateStakeTemplate()
		super.stake()
		console.log(`Deleting stake directory ${__dirname}/../../temp/${this.stakeId}`)
		rimraf.sync(`${__dirname}/../../temp/${this.stakeId}`)
	}

	/**
	 * @inheritdoc
	 */
	async nextStakeImage(damageDone) {
		// Create the canvas and context
		const canvasDimensions = templateMetadata[TEMPLATE_TO_USE].templateDimensions
		const canvas = createCanvas(canvasDimensions.width, canvasDimensions.height)
		const context = canvas.getContext('2d')

		// Add the background template image (which already has player names)
		const templateBackground = await loadImage(`${__dirname}/../temp/${this.stakeId}/template.png`)
		context.drawImage(templateBackground, 0, 0, canvasDimensions.width, canvasDimensions.height)

		// Draw the HP bars
		const player1HPBarLocation = templateMetadata[TEMPLATE_TO_USE].player1.healthLocation
		const player2HPBarLocation = templateMetadata[TEMPLATE_TO_USE].player2.healthLocation
		const player1HPBar = await loadImage(`${__dirname}/../resources/images/staking/healthbars/${this.player1HP}.png`)
		const player2HPBar = await loadImage(`${__dirname}/../resources/images/staking/healthbars/${this.player2HP}.png`)
		context.drawImage(player1HPBar, player1HPBarLocation.x, player1HPBarLocation.y)
		context.drawImage(player2HPBar, player2HPBarLocation.x, player2HPBarLocation.y)

		// Draw the hit splat on whoever is being hit
		const hitsplatImage = await loadImage(`${__dirname}/../resources/images/staking/smaller_hitsplats/${damageDone}.png`)
		let hitsplatLocation
		if (this.hitter === 1) {
			hitsplatLocation = templateMetadata[TEMPLATE_TO_USE].player1.hitsplatLocation
		} else {
			hitsplatLocation = templateMetadata[TEMPLATE_TO_USE].player2.hitsplatLocation
		}
		context.drawImage(hitsplatImage, hitsplatLocation.x, hitsplatLocation.y)

		// Save the image to this stake's temp folder
		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`${__dirname}/../temp/${this.stakeId}/${damageDone}.png`, buffer)

		return new MessageAttachment(`${__dirname}/../temp/${this.stakeId}/${damageDone}.png`)
	}

	/**
	 * Generate a template composed of the base background image from the templateMetadata and the player names.
	 * This is done to save resources, because we dont have to add the names to each frame of the stake this way.
	 * Should be called once at the start of the stake. This function also creates a temp folder for this stake
	 * session's dynamically generated data to live
	 */
	async generateStakeTemplate() {
		// Create the canvas and context
		const canvasDimensions = templateMetadata[TEMPLATE_TO_USE].templateDimensions
		const canvas = createCanvas(canvasDimensions.width, canvasDimensions.height)
		const context = canvas.getContext('2d')

		// Add the background template image
		const templateBackground = await loadImage(templateMetadata[TEMPLATE_TO_USE].fileName)
		context.drawImage(templateBackground, 0, 0, canvasDimensions.width, canvasDimensions.height)

		// Add the names on top of the background template image
		context.font = '15px "Runescape Font"'
		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillStyle = '#fff'
		const player1NameLocation = templateMetadata[TEMPLATE_TO_USE].player1.nameLocation
		const player2NameLocation = templateMetadata[TEMPLATE_TO_USE].player2.nameLocation
		context.fillText(this.player1, player1NameLocation.x, player1NameLocation.y)
		context.fillText(this.player2, player2NameLocation.x, player2NameLocation.y)

		// Create the temp folder for this stake's files to live in
		if (!fs.existsSync(`${__dirname}/../temp/${this.stakeId}`)) {
			fs.mkdirSync(`${__dirname}/../temp/${this.stakeId}`)
		}

		// Save the image as a png file to the temp folder
		const buffer = canvas.toBuffer('image/png')
		fs.writeFileSync(`${__dirname}/../temp/${this.stakeId}/template.png`, buffer)
	}
}

module.exports = GraphicalStakingClient
