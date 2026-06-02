const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decline')
        .setDescription('decling someone request')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to decline")
            .setRequired(true)
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const target = interaction.options.getUser("user");
        if (typeof (data) !== "object") return
        if (typeof (data.users) !== "object") return
        if (typeof data.users[target.id] == "undefined") {
            interaction.reply("pizza")
            return;
        }

        if (typeof data.users[interaction.user.id] == "undefined") {
            interaction.reply("hamborgor")
            return;
        }

        if (typeof data.requests[interaction.user.id] == "undefined") {
            interaction.reply("apple\n-# (you dont have any request from them)")
            return;
        }

        delete data.requests[interaction.user.id];
        func.save_data(data)
        interaction.reply("You declined the request by <@" + target.id + ">")
    },
};