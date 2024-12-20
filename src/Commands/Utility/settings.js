const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} = require("discord.js");

const guildConfigCache = require("../../Schemas/Methods/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription(
      "Edit the settings for the guild."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "Utility",
  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction, client, handler }) => {
    /** @type {GuildConfiguration} */
    
  },
};
