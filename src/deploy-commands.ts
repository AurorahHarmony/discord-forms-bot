import {
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { config } from "./config";
import { commands as cmds } from "./commands/index";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

(async () => {
  for (const commandName in cmds) {
    const command = cmds[commandName];

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`
      );
    }
  }

  const rest = new REST().setToken(config.DISCORD_TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      // Routes.applicationGuildCommands(
      //   config.DISCORD_CLIENT_ID,
      //   config.DEV_SERVER_ID
      // ),
      Routes.applicationCommands(
        config.DISCORD_CLIENT_ID
        // config.DEV_SERVER_ID
      ),
      { body: commands }
    )) as RESTPostAPIApplicationCommandsJSONBody[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
