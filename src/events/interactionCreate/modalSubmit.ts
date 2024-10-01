import { CacheType, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { config } from "../../config";

export default async (interaction: ModalSubmitInteraction<CacheType>) => {
  if (interaction.customId === "verifyModal") {
    const user = {
      id: interaction.user.id,
      username: interaction.user.username,
    };

    const intent = interaction.fields.getTextInputValue("intent") || "-";
    const rulesRead = interaction.fields.getTextInputValue("rulesRead") || "-";
    const birthDate = interaction.fields.getTextInputValue("birthDate") || "-";
    const questions = interaction.fields.getTextInputValue("questions") || "-";

    const formSubmissionChannel = interaction.client.channels.cache.get(
      config.VERIFICATION_OUTPUT_CHANNEL
    );

    if (!formSubmissionChannel || !formSubmissionChannel.isTextBased()) {
      console.error(
        `Channel id ${config.VERIFICATION_OUTPUT_CHANNEL} is not a text-based channel.`
      );
      return;
    }

    const formSubmissionEmbed = new EmbedBuilder()
      .setTitle(`${user.username} (${user.id})`)
      .setDescription(`<@${user.id}>`)
      .addFields({ name: "What brings you to Hypnoponies?", value: intent })
      .addFields({
        name: "Have you read and agree to uphold our rules?",
        value: rulesRead,
      })
      .addFields({ name: "Birthdate", value: birthDate })
      .addFields({
        name: "Do you have any questions for staff?",
        value: questions,
      });

    await formSubmissionChannel.send({
      embeds: [formSubmissionEmbed],
    });

    await interaction.reply({
      content:
        "Your verification application was received successfully. A member of staff will verify you shortly.",
      ephemeral: true,
    });
  }
};
