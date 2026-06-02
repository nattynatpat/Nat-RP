const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job_hire')
        .setDescription('hire someone')
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
        if (typeof(data.jobs[name]) == "undefined") {
            interaction.reply("job dont exists")
            return;
        }

        if (data.jobs[name].creator !== interaction.user.id) {
            interaction.reply("you didnt make this job")
            return;
        }

        if (typeof(data.applications[target.id]) == "undefined") {
            interaction.reply("person didnt applied")
            return;
        }

        if (data.applications[target.id].hirer !==interaction.user.id) {
            interaction.reply("poo")
            return;
        }

        delete data.applications[target.id];

        data.users[target.id].job = {
            job:name,
            hirer:interaction.user.id
        }

        func.save_data(data)
        interaction.reply(`Hired <@${target.id}>`)
    },
};