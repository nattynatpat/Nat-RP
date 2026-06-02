const { EmbedBuilder,InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('pay someone')
        .addUserOption((option) => option
            .setName("user")
            .setDescription("user")
            .setRequired(true)
        )
        .addNumberOption((option)=>option
            .setName("money")
            .setMinValue(0.00000000000001)
            .setRequired(true)
            .setDescription("money")
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func) {
        const target = interaction.options.getUser("user");
        let money = interaction.options.getNumber("money");

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

        if (typeof(data.users[target.id].money)=="undefined") {
            data.users[target.id].money = 100;
            func.save_data(data)
        }
        
        if (typeof(data.users[interaction.user.id].money)=="undefined") {
            data.users[interaction.user.id].money = 100;
            func.save_data(data)
        }

        if (data.users[interaction.user.id].money<money) {
            interaction.reply(`U NED MONEH`)
            return;
        }

        data.users[target.id].money += money;
        data.users[interaction.user.id].money -= money;
        interaction.reply(`Payed <@${target.id}> with \`${money} Ǹ\``)
        func.save_data(data)
    },
};