const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job_apply')
        .setDescription('apply to a job')
        .addStringOption((option) => option
            .setName("name")
            .setDescription("the name of the job")
            .setRequired(true)
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const name = interaction.options.getString("name");

        if (typeof data.users[interaction.user.id] == "undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
        }
        if (typeof(data.jobs[name]) == "undefined") {
            interaction.reply("dont exists")
            return;
        }

        if (data.jobs[name].creator == interaction.user.id) {
            interaction.reply("you made this job")
            return;
        }

        if (typeof(data.applications[interaction.user.id]) !== "undefined") {
            interaction.reply("already applied")
            return;
        }

        data.applications[interaction.user.id] = {
            job:name,
            hirer:data.jobs[name].creator
        }

        func.save_data(data)
        interaction.reply(`Applied for the job ${name} created by <@${data.jobs[name].creator}>`)
    },
};