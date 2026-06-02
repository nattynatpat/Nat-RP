const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job_create')
        .setDescription('create a job')
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
        if (name.length>100) {
            interaction.reply("i aint remembering all that")
            return;
        }
        if (typeof(data.jobs[name]) !== "undefined") {
            interaction.reply("already exists")
            return;
        }

        let characters = name.split("")
        let validcharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM "

        for (let index = 0; index < characters.length; index++) {
            const char = characters[index];
            if (!validcharacters.includes(char)) {
                interaction.reply(`the job name contains an invalid character : ${char}`)
                return;
            }
        }

        data.jobs[name] = {
            creator:interaction.user.id
        }

        func.save_data(data)
        interaction.reply(`Created the job ${name}`)
    },
};