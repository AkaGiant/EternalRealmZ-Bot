module.exports = {
  data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("Manage changelogs")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create and select a new changelog")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Title of the changelog")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description2")
            .setDescription("Description of the changelog")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Type of update (major, minor, patch)")
            .setRequired(true)
            .addChoices(
              { name: "Major", value: "major" },
              { name: "Minor", value: "minor" },
              { name: "Patch", value: "patch" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a new change entry to the selected changelog")
        .addStringOption((option) =>
          option
            .setName("change")
            .setDescription("Change made")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the change")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all changes in the selected changelog")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a specific change from the selected changelog")
        .addStringOption((option) =>
          option
            .setName("change_id")
            .setDescription("ID of the change to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a specific change in the selected changelog")
        .addStringOption((option) =>
          option
            .setName("change_id")
            .setDescription("ID of the change to edit")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("new_info")
            .setDescription("New information for the change")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("listall")
        .setDescription("List all created changelogs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete an entire changelog")
        .addStringOption((option) =>
          option
            .setName("changelog_id")
            .setDescription("ID of the changelog to delete")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("push")
        .setDescription("Push a changelog for public view")
        .addStringOption((option) =>
          option
            .setName("changelog_id")
            .setDescription("ID of the changelog to push")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction, client, handler }) => {},
  /**
   * @param {CommandInteraction} interaction
   */
  autocomplete: async ({ interaction, client, handler }) => {
    const focusedOption = interaction.options.getFocused(true);
    let choices;

    const config = await getGuildConfig(interaction.guild.id);

    if (focusedOption.name === "changelog_id") {
      if (!config.changelogs) choices = [];
      else choices = config.changelogs.map((changelog) => changelog.version);
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
