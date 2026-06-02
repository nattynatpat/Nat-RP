const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('template')
        .setDescription('template')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("user")
            .setRequired(true)
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const target = interaction.options.getUser("user");
        delete data.requests[interaction.user.id];
        func.save_data(data)
        interaction.reply("You accepted the template request by <@" + target.id + ">")
    },
};