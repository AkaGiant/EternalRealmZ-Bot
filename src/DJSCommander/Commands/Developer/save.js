const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { saveGuildConfigsToDatabase } = require("../../Schemas/Methods/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("save guild data")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "Developer",
  devOnly: true,

  run: ({ interaction, client, handler }) => {
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    saveGuildConfigsToDatabase();
    interaction.reply({
      embeds: [
        new EmbedBuilder().setColor("Aqua").setDescription(`Saved Guild Data`),
      ],
      ephemeral: false,
    });
  },
};
