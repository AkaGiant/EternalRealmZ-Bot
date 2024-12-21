const {
  VoiceState,
  GuildMember,
  ChannelType,
  GuildChannel,
} = require("discord.js");

/**
 *
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @param {GuildMember} client
 * @param {GuildChannel} channel
 */
module.exports = async (oldState, newState, client) => {
  // Check if the user joined a voice channel

  if (!oldState.channelId && newState.channelId) {
    if (newState.channelId === "1319834392738271305")
      return createChannel(newState.member);
  }

  // Check if the user left a voice channel
  if (oldState.channelId && !newState.channelId) {
    if (oldState.channel.parent.name === "Temporary Voice Channels") {
      if (oldState.channel.members.size === 0) {
        return oldState.channel.delete();
      }
    }
  }

  // Check if the user switched voice channels
  if (
    oldState.channelId &&
    newState.channelId &&
    oldState.channelId !== newState.channelId
  ) {
    if (oldState.channel != null && oldState.channel.parent != null) {
      if (oldState.channel.parent.name === "Temporary Voice Channels") {
        if (oldState.channel.members.size === 0) {
          oldState.channel.delete();
        }
      }
    }
  }
};

async function createChannel(userToMove) {
  const targetUser = userToMove;
  const guild = targetUser.guild;

  const categoryName = "Temporary Voice Channels"; // Name of the category
  try {
    // Check if the category already exists
    let category = guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildCategory &&
        channel.name === categoryName
    );

    // If the category doesn't exist, create it
    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
        reason: "Needed a category for temporary voice channels",
      });
      console.log(`Created new category: ${category.name}`);
    }

    // Create a new voice channel in the category
    const newChannel = await guild.channels.create({
      name: "Temporary Voice Channel",
      type: ChannelType.GuildVoice,
      parent: category.id, // Set the category as the parent
      reason: "Created to move the user into it",
    });

    // Move the user to the new channel
    await targetUser.voice.setChannel(newChannel);

    console.log(
      `Created a new channel: **${newChannel.name}** in the category **${category.name}** and moved ${targetUser.user.tag} into it!`
    );
  } catch (error) {
    console.error(error);
  }
}
