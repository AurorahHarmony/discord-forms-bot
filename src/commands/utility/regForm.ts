import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { Command } from "../../types/Command";
import { Form } from "../../models/Form";
import { Op } from "sequelize";

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
      subcommand
        .setName("edit")
        .setDescription("Edit a form")
        .addStringOption((option) =>
          option
            .setName("form-name")
            .setRequired(true)
            .setDescription("Name of the form you want to edit")
            .setAutocomplete(true)
        )
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);

    let choices: { name: string; value: string }[] = [];

    if (focusedOption.name === "form-name") {
      const forms = await Form.findAll({
        where: {
          server_id: interaction.guildId,
          name: { [Op.like]: `${focusedOption.value.toLowerCase()}%` },
        },
        limit: 25,
      });

      choices = forms.map((form) => ({
        name: form.name,
        value: form.uuid,
      }));
    }

    if (choices.length === 0) {
      await interaction.respond([{ name: "No results", value: "no_results" }]);
    } else {
      await interaction.respond(choices);
    }
  },
  async execute(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case "create":
        handleCreateForm(interaction);
        break;
      case "list":
        showFormList(interaction);
        break;
      case "edit":
        showFormEditor(interaction);
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

const showFormEditor = async (interaction: ChatInputCommandInteraction) => {
  const formId = interaction.options.getString("form-name");

  const form = await Form.findOne({
    where: {
      uuid: formId,
      server_id: interaction.guildId,
    },
  });

  if (!form) {
    await interaction.reply({
      content: "Form not found",
      ephemeral: true,
    });
    return;
  }
  const select = new StringSelectMenuBuilder()
    .setCustomId("selection")
    .setPlaceholder("What field would you like to edit?")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Field 1")
        .setDescription("Description of field 1")
        .setValue("someid"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Field 2")
        .setDescription("Description of field 2")
        .setValue("someid2"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Field 3")
        .setDescription("Description of field 3")
        .setValue("someid3")
    );

  const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    select
  );

  const addField = new ButtonBuilder()
    .setCustomId("addField")
    .setLabel("Add Field")
    .setStyle(ButtonStyle.Secondary);
  const editField = new ButtonBuilder()
    .setCustomId("editField")
    .setLabel("Edit Field")
    .setStyle(ButtonStyle.Secondary);
  const deleteField = new ButtonBuilder()
    .setCustomId("deleteField")
    .setLabel("Delete Field")
    .setStyle(ButtonStyle.Secondary);

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    addField,
    editField,
    deleteField
  );

  await interaction.reply({
    content: "Now editing " + form.name,
    components: [row1, row2],
  });
};

export default verifyCommand;
