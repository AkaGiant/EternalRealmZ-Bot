const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('missingitems')
          .setDescription('Check what items have been reported as missing from the traders.')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "Utility",
  // deleted: true,
  run: ({ interaction, client, handler }) => {
    interaction.reply(`Pong!2 ${client.ws.ping}ms`);
  },
};