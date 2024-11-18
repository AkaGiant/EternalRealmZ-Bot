
// Utilities
const EventUtils = require('../../Utils/EventUtils');
// Messages
const { generalMessages } = require('../../Configurations/messages.json');

const { CommandHandler } = require('djs-commander');
const { Client, ActivityType } = require('discord.js');

const AsciiTable = require('ascii-table/ascii-table');

/**
 * @param {Client} client 
 * @param {CommandHandler} handler 
 */

module.exports = async (argument, client, handler) => {
  // Console log ready message
  EventUtils.FormatReadyEvent(generalMessages.BotOnline, " ", client.user.tag, client.guilds.cache.map(g => g.id).length)
  // Set bots status
  client.user.setActivity("EternalRealmZ", { type: ActivityType.Watching });

  createTable(handler)
};

function createTable(handler) {
  const table = new AsciiTable("Commands");
  table.setHeading("Name", "Category", "Description", "Permission Required")

  handler.commands.map(cmd => {
      table.addRow(cmd.name, 
        cmd.category == null ? "No Category" : cmd.category, cmd.description, 
        convertPermissions(cmd.default_member_permissions));
  })

  table.setAlign(0, AsciiTable.CENTER)
  table.setAlign(1, AsciiTable.CENTER)
  table.setAlign(2, AsciiTable.CENTER)
  table.setAlign(3, AsciiTable.CENTER)

  if (table.toString().length === 8) {
    console.log("No Commands Loaded");
    return;
  }
  console.log(table.toString())
}

const permissionMap = {
  1: 'CREATE_INSTANT_INVITE',
  2: 'KICK_MEMBERS',
  4: 'BAN_MEMBERS',
  8: 'ADMINISTRATOR',
  16: 'MANAGE_CHANNELS',
  32: 'MANAGE_GUILD',
  64: 'ADD_REACTIONS',
  128: 'VIEW_AUDIT_LOG',
  256: 'PRIORITY_SPEAKER',
  512: 'STREAM',
  1024: 'VIEW_CHANNEL',
  2048: 'SEND_MESSAGES',
  4096: 'SEND_TTS_MESSAGES',
  8192: 'MANAGE_MESSAGES',
  16384: 'EMBED_LINKS',
  32768: 'ATTACH_FILES',
  65536: 'READ_MESSAGE_HISTORY',
  131072: 'MENTION_EVERYONE',
  262144: 'USE_EXTERNAL_EMOJIS',
  524288: 'VIEW_GUILD_INSIGHTS',
  1048576: 'CONNECT',
  2097152: 'SPEAK',
  4194304: 'MUTE_MEMBERS',
  8388608: 'DEAFEN_MEMBERS',
  16777216: 'MOVE_MEMBERS',
  33554432: 'USE_VAD',
  67108864: 'CHANGE_NICKNAME',
  134217728: 'MANAGE_NICKNAMES',
  268435456: 'MANAGE_ROLES',
  536870912: 'MANAGE_WEBHOOKS',
  1073741824: 'MANAGE_EMOJIS_AND_STICKERS',
  2147483648: 'USE_APPLICATION_COMMANDS',
  4294967296: 'REQUEST_TO_SPEAK',
  8589934592: 'MANAGE_THREADS',
  17179869184: 'USE_PUBLIC_THREADS',
  34359738368: 'USE_PRIVATE_THREADS',
  68719476736: 'MANAGE_EVENTS'
};

function convertPermissions(permissionValue) {
  let permissions = [];
  
  for (let perm in permissionMap) {
      if (permissionValue & perm) {
          permissions.push(permissionMap[perm]);
      }
  }
  
  return permissions.length > 0 ? permissions.join(', ') : 'No Permissions';
}