const { ButtonBuilder,ButtonStyle,ActionRowBuilder,EmbedBuilder,InteractionContextType, PermissionFlagsBits, SlashCommandBuilder, Interaction, InteractionCallback, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disown')
        .setDescription('disown your parent'),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction, data, func,c) {
        const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);
        const response = await interaction.reply({
	content: `Are you sure you want to disown your parents for 1000 \`Ǹ\``,
	components: [row],
	withResponse: true,
});

const collectorFilter = (i) => i.user.id === interaction.user.id;
try {
	const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

	if (confirmation.customId === 'confirm') {
        if (data.users[interaction.user.id].money<1000) {
		    await confirmation.update({ content: `Not enough money`, components: [] });
            return;
        }
        data.users[interaction.user.id].money -= 1000
            data.users[c].money += 1000;
        let rela = Object.keys(data.users[interaction.user.id].relations)

        for (let index2 = 0; index2 < rela.length; index2++) {
            let rel = data.users[interaction.user.id].relations[rela[index2]]
            if (rel.type=="parent") {
                delete data.users[rel.id].relations[interaction.user.id];
                delete data.users[interaction.user.id].relations[rela[index2]];
            }
        }


        func.save_data(data)

		await confirmation.update({ content: `Disowned parents`, components: [] });
	} else if (confirmation.customId === 'cancel') {
		await confirmation.update({ content: 'Action cancelled', components: [] });
	}
} catch {
	await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
}
    },
};