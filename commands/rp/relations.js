const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('relations')
        .setDescription('see someone relations')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("who you want to see their relations")
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
            interaction.reply("who?")
            return
        }

        let user = data.users[target.id]
        await interaction.deferReply()

        let relations = `# <@${target.id}> Relations`
        Object.keys(user.relations).forEach((val) => {
            let rel = user.relations[val]
            relations += `
Name : ${data.users[rel.id].name}
Type : ${rel.type}`
        })
        interaction.editReply(relations)
    },
};