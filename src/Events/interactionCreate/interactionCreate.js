const { Client, Guild, CommandInteraction } = require('discord.js');

const { CommandHandler } = require('djs-commander');

/**
 * @param {CommandInteraction} argument
 * @param {Client} client 
 * @param {CommandHandler} handler 
 */
module.exports = async (interaction, client, handler) => {

  if (interaction.isAutocomplete()) {
		const command = handler.commands.find(cmd => cmd.name == interaction.commandName);

    if (command && command.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error('Error handling autocomplete interaction:', error);
      }
    }
  };
};
