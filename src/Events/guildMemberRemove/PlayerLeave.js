const { CommandHandler } = require('djs-commander');
const { Client, ActivityType, AttachmentBuilder, EmbedBuilder, GuildMemberManager } = require('discord.js');
/**
 * @param {Client} client 
 * @param {CommandHandler} handler 
 * @param {GuildMemberManager} argument
 */
module.exports = async (argument, client, handler) => {
    if (client.user.bot) return;
    
    const channel = await argument.guild.channels.cache.get('1305180043340939294');

    // Console log ready message
    const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
      { name: 'Regular field title', value: 'Some value here' },
      { name: '\u200B', value: '\u200B' },
      { name: 'Inline field title', value: 'Some value here', inline: true },
      { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Footer Text Here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
  
    channel.send({ embeds: [exampleEmbed] });
  };