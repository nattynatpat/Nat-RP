const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('see the leaderboard!'),
    async execute(interaction,data) {
        const array = Object.values(data.users).map(user => ({money: typeof(user.money)=="undefined"?100:user.money, name: user.name}))
                  .sort((a, b) => b.money - a.money)
                  .slice(0,10);
        let i = 1;
  await interaction.reply({ content:`
# Leaderboard
${array.map((user) => `${i++}. ${user.name} - **${user.money}**`).join('\n')}
` });
    },
};