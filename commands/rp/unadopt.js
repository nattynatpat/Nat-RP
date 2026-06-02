const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unadopt')
        .setDescription('unadopt someone')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to unadopt")
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
            data.users[target.id] = {
                name: target.username,
                relations: {}
            }
        }

        if (typeof data.users[interaction.user.id] == "undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
        }

        let user = data.users[target.id]

        if (typeof user.relations[interaction.user.id] == "undefined") {
            interaction.reply("they arent your child\n-# code : 1")
            return
        }

        if (user.relations[interaction.user.id].type !== "parent") {
            interaction.reply("they arent your child\n-# code : 2")
            return
        }

        delete data.users[target.id].relations[interaction.user.id];
        delete data.users[interaction.user.id].relations[target.id];
        func.save_data(data)
        interaction.reply("Unadopted <@" + target.id + ">")
    },
};