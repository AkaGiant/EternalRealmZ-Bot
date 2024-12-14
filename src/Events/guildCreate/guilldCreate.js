const { CommandHandler } = require("djs-commander");
const {
  Client,
  ActivityType,
  AttachmentBuilder,
  EmbedBuilder,
  GuildMemberManager,
} = require("discord.js");
const Guild = require("../../Schemas/Methods/Guild");
/**
 * @param {Client} client
 * @param {CommandHandler} handler
 * @param {Guild} argument
 */
module.exports = async (argument, client, handler) => {
  Guild.handleNewGuild(argument.id);
};
