const { SlashCommandBuilder } = require('discord.js'),
log = global.log;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};