module.exports = {
  data: {
    name: "ping",
    description: "Pong!",
    customCategory: "Misc",
  },

  run: ({ interaction, client, handler }) => {
    interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
  },

  options: {
    devOnly: true,
    userPermissions: ["Administrator", "AddReactions"],
    botPermissions: ["Administrator", "AddReactions"],
    deleted: false,
  },
};
