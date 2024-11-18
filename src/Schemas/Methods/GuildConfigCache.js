const GuildConfiguration = require('../GuildConfiguration');

const cache = new Map();

/**
 * Gets the guild configuration from the cache or database.
 * @param {string} guildId - The guild ID.
 * @returns {Promise<Object>} - The guild configuration.
 */
async function getGuildConfig(guildId) {
  try {
    if (cache.has(guildId)) {
      console.log('Cache hit for guild:', guildId);
      return cache.get(guildId);
    }

    console.log('Cache miss for guild:', guildId);
    let guildConfig = await GuildConfiguration.findOne({ guildId });

    try {
      if (!guildConfig) {
        guildConfig = new GuildConfiguration({
          guildId: guildId
        });
        await guildConfig.save();
        console.log(`New guild configuration created for guild: ${guildId}`);
      }
    } catch (error) {
      console.log("Unable to create new configuration");
    }

    cache.set(guildId, guildConfig);
    return guildConfig;

  } catch (error) {
    console.error('Error while fetching guild configuration:', error);
    throw new Error('Database error while fetching guild configuration');
  }
}

/**
 * Adds a trader to the guild's configuration.
 * @param {string} guildId - The guild ID.
 * @param {string} trader - The trader name.
 * @returns {Promise<void>}
 */
async function addTrader(guildId, trader) {
  const guildConfig = await getGuildConfig(guildId);

  if (!guildConfig.settings.traders.includes(trader)) {
    guildConfig.settings.traders.push(trader);
  }

  try {
    await guildConfig.save();

    cache.set(guildId, guildConfig);
    console.log(`Added trader ${trader} for guild ${guildId}`);
  } catch (error) {
    console.error('Error updating guild configuration:', error);
    throw new Error('Database error while adding trader');
  }
}

/**
 * Removes a trader from the guild's configuration.
 * @param {string} guildId - The guild ID.
 * @param {string} trader - The trader name.
 * @returns {Promise<void>}
 */
async function removeTrader(guildId, trader) {
  const guildConfig = await getGuildConfig(guildId);

  guildConfig.settings.traders = guildConfig.settings.traders.filter(item => item !== trader);

  try {
    await guildConfig.save();

    cache.set(guildId, guildConfig);
    console.log(`Removed trader ${trader} for guild ${guildId}`);
  } catch (error) {
    console.error('Error updating guild configuration:', error);
    throw new Error('Database error while removing trader');
  }
}

/**
 * Resets the traders for a guild's configuration.
 * @param {string} guildId - The guild ID.
 * @returns {Promise<void>}
 */
async function resetTraders(guildId) {
  const guildConfig = await getGuildConfig(guildId);
  guildConfig.settings.traders = [];

  try {
    await guildConfig.save();

    cache.set(guildId, guildConfig);
    console.log(`Reset traders for guild ${guildId}`);
  } catch (error) {
    console.error('Error updating guild configuration:', error);
    throw new Error('Database error while resetting traders');
  }
}

module.exports = {
  getGuildConfig,
  addTrader,
  removeTrader,
  resetTraders
};
