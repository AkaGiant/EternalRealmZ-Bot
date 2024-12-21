const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} = require("discord.js");

const {
  getGuildConfig,
  cache,
  saveGuildConfigsToDatabase,
} = require("../Schemas/Methods/Guild");
const GuildConfiguration = require("../Schemas/GuildConfiguration");

let selectedChangelog = null;
const changelogs = {}; // In-memory cache to store changelogs

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

  category: "Developer",
  devOnly: true,
  /**
   * @param {CommandInteraction} interaction
   */
  async autocomplete(interaction) {
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
  /**
   * @param {CommandInteraction} interaction
   */
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create": {
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const updateType = interaction.options.getString("type");
        return createChangelog(interaction, title, description, updateType);
      }
      case "add": {
        const change = interaction.options.getString("change");
        const reason = interaction.options.getString("reason");
        return addChangelog(interaction, change, reason);
      }
      case "list": {
        return listChanges(interaction);
      }
      case "remove": {
        const changeId = interaction.options.getString("change_id");
        return removeChange(interaction, changeId);
      }
      case "edit": {
        const changeId = interaction.options.getString("change_id");
        const newInfo = interaction.options.getString("new_info");
        return editChange(interaction, changeId, newInfo);
      }
      case "listall": {
        return listAllChangelogs(interaction);
      }
      case "delete": {
        const changelogId = interaction.options.getString("changelog_id");
        return deleteChangelog(interaction, changelogId);
      }
      case "push": {
        const changelogId = interaction.options.getString("changelog_id");
        return pushChangelog(interaction, changelogId);
      }
      default:
        return interaction.reply({
          content: "Unknown subcommand",
          ephemeral: true,
        });
    }
  },
};

// Helper functions for command logic
async function createChangelog(interaction, title, description, type) {
  try {
    const guildId = interaction.guild.id;
    let guildConfig = await getGuildConfig(guildId);

    if (!guildConfig.changelogs) {
      guildConfig.changelogs = [];
    }

    // Extract all versions
    const versions = guildConfig.changelogs.map(
      (changelog) => changelog.version
    );
    const highest = findLargestVersion(versions);
    console.log(highest);

    const version = incrementVersion(type, highest);
    console.log(`New highest version is ${version}`);

    // Create a new changelog entry
    const newChangelog = {
      name: title,
      description,
      version: version, // TODO: Add logic for version
      type,
      changes: new Map(), // TODO: Add logic for changes
    };

    // Push the new changelog to the changelogs array
    guildConfig.changelogs.push(newChangelog);

    // Save the updated guildConfig
    await guildConfig.save();

    console.log(`New changelog created and saved for guildId ${guildId}`);
    return interaction.reply({
      content: `Created new changelog: ${title}`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(
      `Error creating changelog for guildId ${interaction.guild.id}:`,
      error
    );
    return interaction.reply({
      content: `An error occurred while creating the changelog.`,
      ephemeral: true,
    });
  }
}

function findLargestVersion(versions) {
  if (versions.length === 0) return "0.0.0";

  // Helper function to compare two versions
  function compareSemanticVersions(versionA, versionB) {
    const [majorA, minorA, patchA] = versionA.split(".").map(Number);
    const [majorB, minorB, patchB] = versionB.split(".").map(Number);

    if (majorA > majorB) return 1;
    if (majorA < majorB) return -1;

    if (minorA > minorB) return 1;
    if (minorA < minorB) return -1;

    if (patchA > patchB) return 1;
    if (patchA < patchB) return -1;

    return 0;
  }

  // Use reduce to find the largest version
  return versions.reduce((largest, current) =>
    compareSemanticVersions(largest, current) === 1 ? largest : current
  );
}

function incrementVersion(type, lastVersion) {
  // Validate the version format using a regex
  if (!/^\d+\.\d+\.\d+$/.test(lastVersion)) {
    throw new Error(
      `Invalid version format: ${lastVersion}. Expected format: "MAJOR.MINOR.PATCH"`
    );
  }

  const [major, minor, patch] = lastVersion.split(".").map((num) => {
    const parsedNum = parseInt(num, 10);
    if (isNaN(parsedNum)) {
      throw new Error(`Invalid version number component: ${num}`);
    }
    return parsedNum;
  });

  switch (type.toLowerCase()) {
    case "major":
      return `${major + 1}.${minor}.${patch}`; // Increment MAJOR, keep MINOR and PATCH
    case "minor":
      return `${major}.${minor + 1}.${patch}`; // Increment MINOR, keep MAJOR and PATCH
    case "patch":
      return `${major}.${minor}.${patch + 1}`; // Increment PATCH, keep MAJOR and MINOR
    default:
      throw new Error(
        'Invalid version type. Use "major", "minor", or "patch".'
      );
  }
}

async function addChangelog(interaction, change, reason) {
  if (!selectedChangelog) {
    return interaction.reply({
      content: "No changelog selected. Use /changelog create to create one.",
      ephemeral: true,
    });
  }
  changelogs[selectedChangelog].changes.push({
    id: `change-${Date.now()}`,
    change,
    reason,
  });
  return interaction.reply({
    content: `Added change to changelog ID ${selectedChangelog}: ${change}`,
    ephemeral: true,
  });
}

async function listChanges(interaction) {
  const config = getGuildConfig(interaction.guild.id);
  if (!config) {
    return interaction.reply({ content: "No Config Found" });
  }

  if (!selectedChangelog) {
    return interaction.reply({
      content: "No changelog selected. Use /changelog create to create one.",
      ephemeral: true,
    });
  }
  const changelog = changelogs[selectedChangelog];

  if (!changelog || !changelog.changes || changelog.changes.length === 0) {
    return interaction.reply({
      content: "No changes have been added to the selected changelog.",
      ephemeral: true,
    });
  }
  const changesList = changelog.changes
    .map((c) => `${c.id}: ${c.change} (Reason: ${c.reason})`)
    .join("\n");
  return interaction.reply({
    content: `Changes in changelog ${selectedChangelog}:\n${changesList}`,
    ephemeral: true,
  });
}

async function removeChange(interaction, changeId) {
  if (!selectedChangelog) {
    return interaction.reply({
      content: "No changelog selected. Use /changelog create to create one.",
      ephemeral: true,
    });
  }
  const changelog = changelogs[selectedChangelog];
  changelog.changes = changelog.changes.filter((c) => c.id !== changeId);
  return interaction.reply({
    content: `Removed change with ID ${changeId} from changelog ${selectedChangelog}`,
    ephemeral: true,
  });
}

async function editChange(interaction, changeId, newInfo) {
  if (!selectedChangelog) {
    return interaction.reply({
      content: "No changelog selected. Use /changelog create to create one.",
      ephemeral: true,
    });
  }
  const changelog = changelogs[selectedChangelog];
  const change = changelog.changes.find((c) => c.id === changeId);
  if (!change) {
    return interaction.reply({
      content: `Change ID ${changeId} not found in the selected changelog.`,
      ephemeral: true,
    });
  }
  change.change = newInfo;
  return interaction.reply({
    content: `Edited change ID ${changeId} in changelog ${selectedChangelog}`,
    ephemeral: true,
  });
}

async function listAllChangelogs(interaction) {
  if (Object.keys(changelogs).length === 0) {
    return interaction.reply({
      content: "No changelogs have been created yet.",
      ephemeral: true,
    });
  }
  const changelogList = Object.entries(changelogs)
    .map(([id, log]) => `${id}: ${log.title}`)
    .join("\n");
  return interaction.reply({
    content: `All created changelogs:\n${changelogList}`,
    ephemeral: true,
  });
}

async function deleteChangelog(interaction, changelogId) {
  try {
    const guildId = interaction.guild.id;
    let guildConfig = await getGuildConfig(guildId);

    if (!guildConfig.changelogs) {
      return interaction.reply({
        content: "No changelogs found.",
        ephemeral: true,
      });
    }

    const changelogIndex = guildConfig.changelogs.findIndex(
      (changelog) => changelog.version === changelogId
    );

    if (changelogIndex === -1) {
      return interaction.reply({
        content: `Changelog with version ${changelogId} not found.`,
        ephemeral: true,
      });
    }

    // Remove the changelog from the array
    guildConfig.changelogs.splice(changelogIndex, 1);

    // Save the updated guildConfig
    await guildConfig.save();

    return interaction.reply({
      content: `Changelog with version ${changelogId} has been deleted.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(
      `Error deleting changelog for guildId ${interaction.guild.id}:`,
      error
    );
    return interaction.reply({
      content: `An error occurred while deleting the changelog.`,
      ephemeral: true,
    });
  }
}

async function pushChangelog(interaction, changelogId) {
  if (!changelogs[changelogId]) {
    return interaction.reply({
      content: `Changelog ID ${changelogId} not found.`,
      ephemeral: true,
    });
  }
  // Here you might handle the changelog being pushed for public view
  return interaction.reply({
    content: `Changelog ID ${changelogId} pushed for public view.`,
    ephemeral: true,
  });
}
