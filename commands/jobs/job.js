const { EmbedBuilder,InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('see someone job')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("user")
            .setRequired(true)
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const target = interaction.options.getUser("user");
        const dat = data.users[target.id]

        if (typeof(data.users[target.id])=="undefined") {
            data.users[target.id] = {
                name: target.username,
                relations: {}
            }
            func.save_data(data)
        }

        if (typeof(data.users[interaction.user.id])=="undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
            func.save_data(data)
        }
        if (typeof(dat.money)=="undefined") {
            dat.money = 100;
            func.save_data(data)
        }
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                    .setTitle("Job")
                    .setColor(Colors.Blue)
                    .setAuthor({
                        name:target.displayName,
                        iconURL:target.avatarURL()
                    })
                    .setDescription(`**Job**: \`${typeof(dat.job)=="undefined"?"None":dat.job.job}\``)
            ]
        })
    },
};