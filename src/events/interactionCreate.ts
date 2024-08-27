import { CacheType, Interaction } from "discord.js";
import chatInputCommand from "./interactionCreate/chatInputCommand";
import modalSubmit from "./interactionCreate/modalSubmit";
import button from "./interactionCreate/button";
import autoComplete from "./interactionCreate/autoComplete";

export default async (interaction: Interaction<CacheType>) => {
  if (interaction.isChatInputCommand()) {
    chatInputCommand(interaction);
    return;
  }

  if (interaction.isModalSubmit()) {
    modalSubmit(interaction);
    return;
  }

  if (interaction.isButton()) {
    button(interaction);
    return;
  }

  if (interaction.isAutocomplete()) {
    autoComplete(interaction);
  }
};
