// Messages
const { generalMessages } = require('../Configurations/messages.json')

// Utils
const {getDir} = require('./GeneralUtils')

function FormatReadyEvent(Message, Directory, Client, ServerSize) {
    Message = Message.replace('%SystemPrefix%', generalMessages.SystemPrefix)
    Message = Message.replace('%ServersSize%', ServerSize)
    if (Directory) Message = Message.replace('%Directory%', getDir(Directory))
    if (Client) Message = Message.replace('%ClientTag%', Client)

    return console.log(Message);
}

module.exports = {
    FormatReadyEvent
}