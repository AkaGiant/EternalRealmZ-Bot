const { getGuildConfig } = require("./Guild");

/**
 * Adds a trader to the guild's configuration.
 * @param {string} guildId - The guild ID.
 * @param {Object} trader - The trader object.
 * @returns {Promise<void>}
 */
async function addTrader(guildId, trader) {
  const guildConfig = await getGuildConfig(guildId);

  const existingTrader = guildConfig.settings.traders.find(
    (t) => t.name === trader.name
  );
  if (existingTrader) {
    throw new Error(
      `A trader with the name "${trader.name}" already exists in this guild.`
    );
  }

  guildConfig.settings.traders.push(trader);

  try {
    await guildConfig.save();
    console.log(`Added trader ${trader.name} for guild ${guildId}`);
  } catch (error) {
    console.error("Error updating guild configuration:", error);
    throw new Error("Database error while adding trader");
  }
}

/**
 * Removes a trader from the guild's configuration.
 * @param {string} guildId - The guild ID.
 * @param {string} traderName - The trader name.
 * @returns {Promise<void>}
 */
async function removeTrader(guildId, traderName) {
  const guildConfig = await getGuildConfig(guildId);

  guildConfig.settings.traders = guildConfig.settings.traders.filter(
    (t) => t.name !== traderName
  );

  try {
    await guildConfig.save();
    console.log(`Removed trader ${traderName} for guild ${guildId}`);
  } catch (error) {
    console.error("Error updating guild configuration:", error);
    throw new Error("Database error while removing trader");
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
    console.log(`Reset traders for guild ${guildId}`);
  } catch (error) {
    console.error("Error updating guild configuration:", error);
    throw new Error("Database error while resetting traders");
  }
}

module.exports = { addTrader, removeTrader, resetTraders };
