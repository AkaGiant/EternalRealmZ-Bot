const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } = require('discord.js');

const guildConfigCache = require('../../Schemas/Methods/GuildConfigCache');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('missingitems')
          .setDescription('Check what items have been reported as missing from the traders.')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "Utility",
  // deleted: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  run: async ({ interaction, client, handler }) => {

    /** @type {GuildConfiguration} */
    const guildConfig = await guildConfigCache.getGuildConfig(interaction.guild.id);

    const traders = guildConfig.settings.traders.map(trader => {
      console.log(trader)
    })
  },
};