import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../types/Command";
import { Form } from "../../models/Form";

const verifyCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("regform")
    .setDescription("Options for managing your registration forms")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new registration form")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of your new registration form")
            .setRequired(true)
            .setMinLength(3)
            .setMaxLength(20)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all of your registration forms")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("edit").setDescription("Edit a form")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case "create":
        handleCreateForm(interaction);
        break;
      case "list":
        showFormList(interaction);
        break;
      case "edit":
        await interaction.reply({
          content: "This command is not yet implemented",
          ephemeral: true,
        });
        break;
      default:
        await interaction.reply({
          content: "There was an error handling your command",
          ephemeral: true,
        });
        break;
    }
  },
};

const handleCreateForm = async (interaction: ChatInputCommandInteraction) => {
  const serverId = interaction.guildId;
  const formName = interaction.options.getString("name");

  try {
    await Form.create({
      server_id: serverId,
      name: formName,
    });

    await interaction.reply({
      content: `Form "${formName}" was created`,
      ephemeral: true,
    });
  } catch (error) {
    console.log("Failed to create form", error);
    await interaction.reply({
      content: "There was an error creating the form. Please try again later",
      ephemeral: true,
    });
  }
};

const showFormList = async (interaction: ChatInputCommandInteraction) => {
  const serverId = interaction.guildId;

  try {
    const forms = await Form.findAll({
      where: {
        server_id: serverId,
      },
    });

    if (forms.length === 0) {
      await interaction.reply({
        content: "No forms found for this server.",
        ephemeral: true,
      });
      return;
    }

    const formList = forms.map((form) => `- ${form.name}`).join("\n");

    await interaction.reply({
      content: `List of forms:\n${formList}`,
      ephemeral: true,
    });
  } catch (error) {
    console.log("Failed to list forms", error);
    await interaction.reply({
      content: "There was an listing forms. Please try again later",
      ephemeral: true,
    });
  }
};

export default verifyCommand;
