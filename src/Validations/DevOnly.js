require('dotenv').config();

const {Client} = require('discord.js');
const {CommandHandler} = require('djs-commander')

/**
 * @param {*} interaction 
 * @param {*} commandObj 
 * @param {CommandHandler} handler 
 * @param {Client} client 
 */
module.exports = (interaction, commandObj, handler, client) => {
    if (!commandObj.devOnly) return;

    if (interaction.member.user.id != `${process.env.DEVELOPER_USER_ID}`) {
        interaction.reply({content: "This is a developer only command", ephemeral: true})
        return true;
    }
}