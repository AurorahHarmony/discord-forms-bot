import { CacheType, Interaction } from "discord.js";
import chatInputCommand from "./interactionCreate/chatInputCommand";
import modalSubmit from "./interactionCreate/modalSubmit";

export default async (interaction: Interaction<CacheType>) => {
  if (interaction.isChatInputCommand()) {
    chatInputCommand(interaction);
    return;
  }

  if (interaction.isModalSubmit()) {
    modalSubmit(interaction);
    return;
  }
};
