import {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  GuildMember,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
} from "discord.js";
import { Command } from "../../types/Command";

const verifyCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Brings up the welcome form for you to verify your account")
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId("verifyModal")
      .setTitle("Verification");

    const ageInput = new TextInputBuilder()
      .setCustomId("birthDate")
      .setLabel("What's your birth date? (Month/Day/Year)")
      .setPlaceholder("MM/DD/YYYY")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        ageInput
      );

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
};

export default verifyCommand;
