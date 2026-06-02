const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job_fire')
        .setDescription('fire someone')
        .addStringOption((option) => option
            .setName("name")
            .setDescription("the name of the job")
            .setRequired(true)
        )
        .addUserOption((option) => option
            .setName("user")
            .setRequired(true)
            .setDescription("who to hire")
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const name = interaction.options.getString("name");
        const target = interaction.options.getUser("user");

        if (typeof data.users[interaction.user.id] == "undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
        }
        if (typeof(data.users[target.id].job)=="undefined") {
            interaction.reply("they are unemployed")
            return;
        }

        if (data.users[target.id].job.hirer!==interaction.user.id) {
            interaction.reply("you arent their boss")
            return;
        }

        delete data.users[target.id].job;

        func.save_data(data)
        interaction.reply(`Fired <@${target.id}>`)
    },
};