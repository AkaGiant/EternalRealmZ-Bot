module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Find a pet from a list of pets.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tempvoice")
        .setDescription("Setup the Temporary Voice system")
        .addStringOption((option) =>
          option
            .setName("change")
            .setDescription("Change made")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the change")
            .setRequired(true)
        )
    )

  run: ({ interaction, client, handler }) => {
    const targetPetId = interaction.options.getString("pet");
    const targetPetObj = pets.find((pet) => pet.id === targetPetId);

    interaction.reply(`Your pet name is ${targetPetObj.name}.`);
  },

  autocomplete: ({ interaction, client, handler }) => {
    const focusedPetOption = interaction.options.getFocused(true);

    const filteredChoices = pets.filter((pet) =>
      pet.name.startsWith(focusedPetOption)
    );

    const results = filteredChoices.map((pet) => {
      return {
        name: `${pet.name} | ${pet.type}`,
        value: pet.id,
      };
    });

    interaction.respond(results.slice(0, 25));
  },
};
