const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('marry someone')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to marry")
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

        if (typeof user.relations[interaction.user.id] !== "undefined") {
            interaction.reply("you already in relation with this person")
            return
        }

        if (typeof data.requests[target.id] !== "undefined") {
            interaction.reply("someone already did a request to them but im too lazy to see if its you or a marry request or adopt request")
            return
        }

        if (target.id == interaction.user.id) {
            interaction.reply("why are you marrying yourself")
            return
        }

        if (target.bot) {
            interaction.reply("no ai partner for you")
            return
        }
        data.requests[target.id] = {
            requester: interaction.user.id,
            type: "partner"
        }
        func.save_data(data)
        interaction.reply("Sent marriage request to <@" + target.id + ">")
    },
};