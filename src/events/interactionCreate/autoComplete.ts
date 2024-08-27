import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";

export default async (interaction: AutocompleteInteraction<CacheType>) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found`);
    return;
  }

  try {
    if (!command.autocomplete) {
      throw new Error("Autcomplete is not available for this command.");
    }
    await command.autocomplete(interaction);
  } catch (error) {
    console.error(error);
  }
};
