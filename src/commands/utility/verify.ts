import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
} from "discord.js";
import { config } from "../../config";

import { Command } from "../../types/Command";

const verifyCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Brings up the welcome form for you to verify your account")
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (member?.roles.cache.has(config.BLACKLIST_ROLE)) {
      await interaction.reply({
        content: "You are already verified, and cannot re-verify.",
        ephemeral: true,
      });
      return;
    }

    if (interaction.channelId !== config.VERIFICATION_CHANNEL) {
      await interaction.reply({
        content: `Verification must be done in <#${config.VERIFICATION_CHANNEL}>`,
        ephemeral: true,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("verifyModal")
      .setTitle("Verification");

    const intentInput = new TextInputBuilder()
      .setCustomId("intent")
      .setLabel("Why did you join HP? How did you hear of us?")
      .setRequired(true)
      .setMaxLength(400)
      .setStyle(TextInputStyle.Paragraph);

    const rulesReadInput = new TextInputBuilder()
      .setCustomId("rulesRead")
      .setLabel("Have you read and agree to uphold our rules?")
      .setPlaceholder("YES/NO")
      .setRequired(true)
      .setMaxLength(3)
      .setStyle(TextInputStyle.Short);

    const ageInput = new TextInputBuilder()
      .setCustomId("birthDate")
      .setLabel("What's your birth date? (Month/Day/Year)")
      .setPlaceholder("MM/DD/YYYY")
      .setRequired(true)
      .setMaxLength(10)
      .setStyle(TextInputStyle.Short);

    const questionsInput = new TextInputBuilder()
      .setCustomId("questions")
      .setLabel("Do you have any questions for Staff?")
      .setRequired(false)
      .setMaxLength(400)
      .setStyle(TextInputStyle.Paragraph);

    const disclaimerDummy = new TextInputBuilder()
      .setCustomId("disclaimerDummy")
      .setLabel("Disclaimer")
      .setRequired(false)
      .setValue(
        "Hypnosis can have permanent effects on your life or identity which may be irreversible. Usage of hypno and our files should not be treated as roleplay. As such, by clicking submit you confirm that you understand and agree to take full responsibility for all files you listen to as well as their effects"
      )
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        intentInput
      );
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        rulesReadInput
      );
    const thirdActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        ageInput
      );
    const fourthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        questionsInput
      );
    const fifthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        disclaimerDummy
      );

    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow,
      fifthActionRow
    );

    await interaction.showModal(modal);
  },
};

export default verifyCommand;
