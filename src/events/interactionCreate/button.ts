import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
} from "discord.js";

export default async (interaction: ButtonInteraction<CacheType>) => {
  const messageId = interaction.message.id;

  console.log(`A button was pressed on message ${messageId}`);

  await interaction.reply({
    content: "User has been verified",
    ephemeral: true,
  });

  const verifyUserButton = new ButtonBuilder()
    .setCustomId("confirmVerify")
    .setLabel(`Username is verified`)
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    verifyUserButton
  );

  interaction.message.edit({ components: [row] });
};
