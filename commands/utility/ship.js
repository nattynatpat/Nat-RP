const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('oh no')
        .addStringOption((option) => option
            .setName("thing1")
            .setDescription("thing")
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("thing2")
            .setDescription("thing")
            .setRequired(true)
        ),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction) {
        await interaction.reply(`The results are...`);
        setTimeout(()=>{
            let no = interaction.options.getString("thing1")+interaction.options.getString("thing2")
            if (no.includes("nat")||no.includes("1249028780463231097")) {
                interaction.editReply(`POO YOU`)
                return;
            }
            interaction.editReply(`${interaction.options.getString("thing1")} + ${interaction.options.getString("thing2")} = ${Math.floor(Math.random()*100)}%`)
        },10000)
    },
};