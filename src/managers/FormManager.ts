import {
  ChatInputCommandInteraction,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import { Form } from "../models/Form";

export class FormManager {
  private formId;

  constructor(formId: string) {
    this.formId = formId;
  }

  public async showFormStateEmbed(
    interaction: ChatInputCommandInteraction,
    formId: string
  ): Promise<void> {
    try {
      const form = await Form.findByPk(formId);

      if (!form) {
        await interaction.reply({
          content: "Form not found.",
          ephemeral: true,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(form.name)
        .setDescription("This form has the following questions:")
        .setColor("#0099ff");

      form.fields.forEach((field, index) => {
        embed.addFields();
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching form:", error);
      await interaction.reply({
        content: "Failed to display the form.",
        ephemeral: true,
      });
    }
  }
}
