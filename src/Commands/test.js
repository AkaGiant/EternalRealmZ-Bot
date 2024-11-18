const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } = require('discord.js');
const guildConfigCache = require('../Schemas/Methods/GuildConfigCache'); // Import the cache class

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Pong2!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "lol",
  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction, client, handler }) => {
    const guildId = interaction.guild.id;

    try {
      // Fetch guild configuration from the cache
      const guildConfig = await guildConfigCache.getGuildConfig(guildId);

      // Add a new trader to the array
      guildConfig.settings.traders.push({
        name: 'Consumables',
        items: new Map([
          ['Medkit', { buyPrice: 20.5, sellPrice: 15.0, missing: false, reportedMissing: false, confirmedSet: false }],
          ['Bandage', { buyPrice: 5.0, missing: false }]
        ])
      });

      // Save the updated configuration to the database
      await guildConfig.save();

      // Optionally update the cache if required
      guildConfigCache.cache.set(guildId, guildConfig);

      console.log('Trader added and database updated successfully');
      await interaction.reply('Trader added successfully!');
    } catch (error) {
      console.error('Error interacting with guild configuration:', error);
      await interaction.reply('There was an error adding the trader.');
    }
  },
};
