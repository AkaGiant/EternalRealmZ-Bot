const { handleNewGuild } = require("@Guild");

module.exports = async (argument, client, handler) => {
  handleNewGuild(argument.id);
};
