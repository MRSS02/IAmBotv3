const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello-world')
		.setDescription('Programmed to work and not to feel...'),
	async execute(interaction) {
		await interaction.reply(`Hello ${interaction.user.username}!`);
	},
};
