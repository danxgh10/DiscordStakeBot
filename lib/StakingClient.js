const { MessageAttachment } = require('discord.js')
const MAX_HIT = 25

/**
 * A basic Staking client with methods to perform an embed stake session with simple hitsplat images
 */
class StakingClient {
	constructor(channel, player1, player2) {
		this.channel = channel
		this.player1 = player1
		this.player2 = player2
		this.player1HP = 100
		this.player2HP = 100
		this.hitter = Math.floor(Math.random() * 2) + 1 // Who hits first
		this.COINS_IMAGE = new MessageAttachment(`${__dirname}/../resources/images/staking/coins.png`)
	}

	/**
	 * Start a staking session in this.channel
	 */
	async stake() {
		// Inform players who has pid
		this.channel.send(`${this.hitter === 1 ? this.player1 : this.player2} has pid`)

		// Setup
		let stakingEmbed
		let lastEmbedMessage = { delete: () => {} }
		let lastDamageDone = 0
		let lastStakeImage = null

		// Game loop
		while (this.player1HP > 0 && this.player2HP > 0) {
			await new Promise(resolve => setTimeout(resolve, 1200)) // wait ~2 runescape ticks

			const damageDone = this.doTurn()
			const stakeImage = await this.nextStakeImage(damageDone)
			
			const embedMessage = await this.channel.send({
				files: [stakeImage, this.COINS_IMAGE],
				embed: this.generateEmbed(damageDone)
			})
			lastEmbedMessage.delete()

			lastEmbedMessage = embedMessage
			lastDamageDone = damageDone
			lastStakeImage = stakeImage

		}

		// Publish results
		await this.channel.send({
			files: [lastStakeImage, this.COINS_IMAGE],
			embed: this.generateEmbed(lastDamageDone, `${this.player1HP === 0 ? this.player2 : this.player1}`)
		})
		lastEmbedMessage.delete()
	}

	/**
	 * Get the next image to be used in the embed's main image field
	 *
	 * @param {number} damageDone the amount of damage done this turn
	 *
	 * @returns {MessageAttachment} the message attachment to be added to the embed
	 */
	async nextStakeImage(damageDone) {
		return new Promise.resolve(MessageAttachment(`${__dirname}/../resources/images/staking/hitsplats/${damageDone}.png`))
	}

	/**
	 * Perform a single turn of the stake, i.e 1 hit.
	 *
	 * @returns {number} the amount of damage that was dealt this turn
	 */
	doTurn() {
		let damageDone

		if (this.hitter === 1) {
			damageDone = this.getHit()
			this.player2HP -= damageDone
			this.player2HP = Math.max(0, this.player2HP)
			this.hitter = 2
		} else {
			damageDone = this.getHit()
			this.player1HP -= damageDone
			this.player1HP = Math.max(0, this.player1HP)
			this.hitter = 1
		}

		return damageDone
	}

	/**
	 * Get a random value between 0 and MAX_HIT to use as someone's hit value
	 *
	 * @returns {number} the value of the hit
	 */
	getHit() {
		return Math.floor(Math.random() * MAX_HIT)
	}

	/**
	 * Generate the embed message that will be send for each frame of the stake
	 *
	 * @param {number} damageDone the amount of damage done this turn
	 *
	 * @returns {object} an object to be passed to channel.send to generate an embed message
	 */
	generateEmbed(damageDone) {
		const embed = {
			color: 0x3a3325,
			title: 'Staking',
			thumbnail: {
				url: 'attachment://coins.png',
			},
			fields: [
				{
					name: this.player1,
					value: this.player1HP,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
				{
					name: this.player2,
					value: this.player2HP,
					inline: true,
				},
			],
			image: {
				url: `attachment://${damageDone}.png`,
			}
		}

		return embed
	}
}

module.exports = StakingClient
