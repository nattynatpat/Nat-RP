const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shit')
        .setDescription(':poop:'),
    async execute(interaction) {
        await interaction.reply('You s**ted');
    },
};