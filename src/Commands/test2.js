const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} = require("discord.js");
const guildConfigCache = require("../Schemas/Methods/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Search discordjs.guide!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Phrase to search for")
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      "Popular Topics: Threads",
      "Sharding: Getting started",
      "Library: Voice Connections",
      "Interactions: Replying to slash commands",
      "Popular Topics: Embed preview",
    ];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  run: async ({ interaction, client, handler }) => {
    return interaction.reply({ content: "lol" });
  },
};
