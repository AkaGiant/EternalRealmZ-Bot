const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } = require('discord.js');
const guildConfigCache = require('../Schemas/Methods/GuildConfigCache');

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
        const newTrader = {
          name: 'Consumables',
          items: new Map([
            ['Medkit', { buyPrice: 20.5, sellPrice: 15.0, missing: false, reportedMissing: false, confirmedSet: false }],
            ['Bandage', { buyPrice: 5.0, missing: false }]
          ])
        };
  
        guildConfigCache.addTrader(guildId, newTrader)

      } catch (error) {
        console.error('Error interacting with guild configuration:', error);
        await interaction.reply('There was an error adding the trader.');
      }
    },
  };