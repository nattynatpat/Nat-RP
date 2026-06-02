const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDescription('accept someone request')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to accept")
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

        if (data.requests[interaction.user.id].type=="divorce") {
            delete data.requests[interaction.user.id];
            func.save_data(data)
            interaction.reply("You divorced with <@" + target.id + ">")
            delete data.users[target.id].relations[interaction.user.id];
            delete data.users[interaction.user.id].relations[target.id];
            return;
        }

        data.users[target.id].relations[interaction.user.id] = {
            type: data.requests[interaction.user.id].type,
            id: interaction.user.id
        }
        data.users[interaction.user.id].relations[target.id] = {
            type: data.requests[interaction.user.id].type == "child" ? "parent" : data.requests[interaction.user.id].type,
            id: target.id
        }
        delete data.requests[interaction.user.id];
        func.save_data(data)
        interaction.reply("You accepted the request by <@" + target.id + ">")
    },
};