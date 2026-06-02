const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job_quit')
        .setDescription('quit your job'),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {

        if (typeof data.users[interaction.user.id] == "undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
        }
        if (typeof(data.users[interaction.user.id].job)=="undefined") {
            interaction.reply("you are unemployed")
            return;
        }

        delete data.users[interaction.user.id].job;

        func.save_data(data)
        interaction.reply(`Quitted your job`)
    },
};