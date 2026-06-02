const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('see da version!'),
    async execute(interaction) {
        await interaction.reply(`Version : ${fs.readFileSync("version",{
            encoding:"utf8"
        })}`);
    },
};