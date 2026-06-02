const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('POOOOONG!'),
    async execute(interaction) {
        await interaction.reply('POOOOOOOOOOOOOOONG!!!!11111111!!!1!!!!!!11!1!!');
    },
};