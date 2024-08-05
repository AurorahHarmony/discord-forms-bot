import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";

export default async (interaction: ModalSubmitInteraction<CacheType>) => {
  if (interaction.customId === "verifyModal") {
    const user = {
      id: interaction.user.id,
      username: interaction.user.username,
    };

    const birthDate = interaction.fields.getTextInputValue("birthDate");

    const channelId = "1269940320800473158";
    const formSubmissionChannel =
      interaction.client.channels.cache.get(channelId);

    if (!formSubmissionChannel || !formSubmissionChannel.isTextBased()) {
      console.error(`Channel id ${channelId} is not a text-based channel.`);
      return;
    }

    const formSubmissionEmbed = new EmbedBuilder()
      .setTitle(user.username)
      .addFields({ name: "Birthdate", value: birthDate });

    const verifyUserButton = new ButtonBuilder()
      .setCustomId("confirmVerify")
      .setLabel(`Verify ${user.username}`)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      verifyUserButton
    );

    await formSubmissionChannel.send({
      embeds: [formSubmissionEmbed],
      components: [row],
    });

    await interaction.reply({
      content:
        "Your verification application was received successfully. A member of staff will verify you shortly.",
      ephemeral: true,
    });
  }
};
