const { EmbedBuilder,InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ultra-rob')
        .setDescription('rob a bank millions of times'),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func,c) {
        if (typeof(data.users[interaction.user.id])=="undefined") {
            data.users[interaction.user.id] = {
                name: interaction.user.username,
                relations: {}
            }
        }
        
        if (typeof(data.users[interaction.user.id].money)=="undefined") {
            data.users[interaction.user.id].money = 100;
        }

        let mon = Math.floor(Math.random()*200)

        let succed = Math.round(Math.random()*100)>50

        if (!succed) {
            mon = -Math.floor(Math.random()*200)
            if (data.users[interaction.user.id].money-mon<0) {
                mon = 0
            }
            data.users[c].money -= mon
        }

        data.users[interaction.user.id].money += mon;
        interaction.reply(`You got \`${mon} Ǹ\``)
        func.save_data(data)
    },
};