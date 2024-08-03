import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "../../types/Command";

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};

export default pingCommand;
