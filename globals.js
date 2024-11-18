// globals.js

/**
 * @typedef {Object} Item
 * @property {number|null} buyPrice - The price to buy the item.
 * @property {number|null} sellPrice - The price to sell the item.
 * @property {boolean} missing - Whether the item is missing.
 * @property {boolean} reportedMissing - Whether the missing item is reported.
 * @property {boolean} confirmedSet - Whether the item is confirmed as set.
 */

/**
 * @typedef {Object} Trader
 * @property {string} name - The name of the trader.
 * @property {Map<string, Item>} items - A map of item names to their details.
 */

/**
 * @typedef {Object} GuildSettings
 * @property {Trader[]} traders - The list of traders.
 */

/**
 * @typedef {Object} GuildConfiguration
 * @property {string} guildId - The ID of the guild.
 * @property {GuildSettings} settings - The guild settings.
 * @property {Date} createdAt - When the configuration was created.
 * @property {Date} updatedAt - When the configuration was last updated.
 */
