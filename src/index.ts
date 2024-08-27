import fs from "fs";
import path from "path";
import { Events, GatewayIntentBits } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import { config } from "./config";
import { ExtendedClient } from "./types/ExtendedClient";
import { Command } from "./types/Command";
import interactionCreate from "./events/interactionCreate";
import { Form } from "./models/Form";
import { FormField } from "./models/FormField";

const client = new ExtendedClient({
  intents: [GatewayIntentBits.Guilds],
});

const sequelize = new Sequelize("registration_forms", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

sequelize.addModels([Form, FormField]);

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Load commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    import(filePath)
      .then((commandModule) => {
        const command: Command = commandModule.default;

        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      })
      .catch((error) =>
        console.error(`Failed to load command ${filePath}: ${error}`)
      );
  }
}

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command",
//         ephemeral: true,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command",
//         ephemeral: true,
//       });
//     }
//   }
// });

client.on(Events.InteractionCreate, interactionCreate);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(config.DISCORD_TOKEN);
