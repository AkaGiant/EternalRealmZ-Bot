const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('ping2')
          .setDescription('Pong2!')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "lol",
  // deleted: true,
  run: ({ interaction, client, handler }) => {
    interaction.reply(`Pong!2 ${client.ws.ping}ms`);
  },
};