const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('divorce')
        .setDescription('divorce someone')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to divorce")
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
            interaction.reply("you arent married to this person")
            return
        }

        if (typeof data.requests[target.id] !== "undefined") {
            interaction.reply("someone already did a request to them but im too lazy to see if its you or a marry request or adopt request")
            return
        }

        if (user.relations[interaction.user.id].type !== "partner") {
            interaction.reply("you arent married to this person\n-# code : 2")
            return
        }
        data.requests[target.id] = {
            requester: interaction.user.id,
            type: "divorce"
        }
        func.save_data(data)
        interaction.reply("Sent divorce request to <@" + target.id + ">")
    },
};