const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} = require("discord.js");

const GuildConfiguration = require("@Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Edit the settings for the guild."),
  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction, client, handler }) => {
    /** @type {GuildConfiguration} */
  },
  options: {
    deleted: false,
    category: "Configuration",
    userPerissions: ["Administrator"],
  },
};
