const { CommandHandler } = require("djs-commander");
const { Client, GuildMemberManager } = require("discord.js");

const { getGuildConfig, cache, saveGuildConfigsToDatabase } = require("@Guild");

/**
 * @param {Client} client
 * @param {CommandHandler} handler
 * @param {GuildMemberManager} argument
 */
module.exports = async (argument, client, handler) => {
  /** @type {GuildConfiguration} */
  // const guildConfig = getGuildConfig(argument.guild.id);
  // guildConfig.settings.welcomeLeaveSettings.
};
