const GuildConfiguration = require("../GuildConfiguration");

const cache = new Map();

/**
 * Handles the creation of a new guild configuration.
 * @param {string} guildId - The guild ID.
 * @returns {Promise<Object>} - The new or existing guild configuration.
 */
async function handleNewGuild(guildId) {
  try {
    let guildConfig = await GuildConfiguration.findOne({ guildId });

    if (guildConfig) {
      console.log(`Guild configuration already exists for guild: ${guildId}`);
      return guildConfig;
    }

    guildConfig = new GuildConfiguration({
      guildId,
      settings: { traders: [] },
      changelogs: [], // Empty changelogs by default
    });

    await guildConfig.save();
    cache.set(guildId, guildConfig);

    console.log(`New guild configuration created for guild: ${guildId}`);
    return guildConfig;
  } catch (error) {
    console.error(`Error creating configuration for guild ${guildId}:`, error);
    throw new Error("Failed to create new guild configuration");
  }
}

/**
 * Gets the guild configuration from the cache or database.
 * @param {string} guildId - The guild ID.
 * @returns {Promise<Object>} - The guild configuration.
 */
async function getGuildConfig(guildId) {
  try {
    if (cache.has(guildId)) {
      console.log("Cache hit for guild:", guildId);
      return cache.get(guildId);
    }

    console.log("Cache miss for guild:", guildId);
    let guildConfig = await GuildConfiguration.findOne({ guildId });

    if (!guildConfig) {
      guildConfig = await handleNewGuild(guildId);
    }

    cache.set(guildId, guildConfig);
    return guildConfig;
  } catch (error) {
    console.error("Error while fetching guild configuration:", error);
    throw new Error("Database error while fetching guild configuration");
  }
}

async function saveGuildConfigsToDatabase() {
  if (!cache) {
    console.log(`Cache Null`);
    return;
  }

  if (cache.size === 0) {
    console.log("No cached guild configurations to save.");
    return; // Exit the function early if no cached entries exist
  }

  const operations = [];

  for (const [guildId, guildConfig] of cache.entries()) {
    try {
      // Prepare update or insert operations
      operations.push({
        updateOne: {
          filter: { guildId },
          update: {
            $set: {
              settings: guildConfig.settings,
              changelogs: guildConfig.changelogs,
            },
          },
          upsert: true, // If the document doesn't exist, insert a new one
        },
      });
    } catch (error) {
      console.error(`Error preparing operation for guildId ${guildId}:`, error);
    }
  }

  if (operations.length > 0) {
    try {
      // Execute bulk write operation
      const result = await GuildConfiguration.bulkWrite(operations);
      console.log("Successfully saved guild configurations in bulk:", result);
    } catch (error) {
      console.error("Error saving guild configurations in bulk:", error);
    }
  }
}

// Function to load existing guild configurations from the database and populate the cache
async function populateCache() {
  try {
    console.log("Populating cache with existing guild configurations...");
    const guildConfigs = await GuildConfiguration.find();

    if (guildConfigs.length === 0) {
      console.log("No guild configurations found in the database.");
      return;
    }

    for (const config of guildConfigs) {
      cache.set(config.guildId, config);
    }

    console.log(`Cache populated with guild configurations. (${cache.size})`);

    setInterval(async () => {
      console.log("Saving changelogs to database...");
      await saveGuildConfigsToDatabase();
    }, 1200000); // Every 20 minutes = 1200000
  } catch (error) {
    console.error("Error while populating the cache:", error);
  }
}

module.exports = {
  handleNewGuild,
  getGuildConfig,
  saveGuildConfigsToDatabase,
  populateCache,
  cache,
};
