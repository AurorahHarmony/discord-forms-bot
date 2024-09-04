import { EmbedBuilder, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { ExtendedClient } from "./types/ExtendedClient";
import interactionCreate from "./events/interactionCreate";
import { commands } from "./commands/index";

const client = new ExtendedClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

for (const commandName in commands) {
  const command = commands[commandName];
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, interactionCreate);

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const channel = await member.guild.channels.fetch(
      config.VERIFICATION_CHANNEL
    );

    // const welcomeEmbed = new EmbedBuilder()
    //   // .setTitle(`Welcome ${member.user.username}`)
    //   .setDescription(
    //     `Please read the rules in ⁠<#${config.RULES_CHANNEL}> and use the /verify command once complete.\n\nA Staff member will then review your application and give you access to the rest of the server.\n\nIf you need help, ping Staff (@Night Guard).`
    //   )
    //   .setFooter({
    //     text: `${member.guild.memberCount} members on this server`,
    //   });

    const welcomeMessage = `## Welcome ${member.user.username}\nWelcome to ${config.SERVER_NAME} <@${member.user.id}>!\n\nPlease read the rules in ⁠<#${config.RULES_CHANNEL}> and use the \`/verify\` command in <#${config.VERIFICATION_CHANNEL}> once complete.\n\nA Staff member will then review your application and give you access to the rest of the server.\n\nIf you need help, ping Staff (@Night Guard).\n-# ${member.guild.memberCount} members on this server`;

    // Send Welcome in server
    if (channel?.isTextBased()) {
      channel.send({
        content: welcomeMessage,
      });
    }

    // DM welcome to user
    await member.send({ content: welcomeMessage });
  } catch (error) {
    console.error("Failed to send welcome message:", error);
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  try {
    const channel = await member.guild.channels.fetch(
      config.VERIFICATION_CHANNEL
    );

    // Send Welcome in server
    if (channel?.isTextBased()) {
      channel.send({
        content: `${member.user.username} (<@${member.user.id}>) has left the server.`,
      });
    }
  } catch (error) {
    console.error("Failed to send leave message:", error);
  }
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (
    !oldMember.roles.cache.has(config.BLACKLIST_ROLE) &&
    newMember.roles.cache.has(config.BLACKLIST_ROLE)
  ) {
    newMember.send(
      `Hi ${newMember.user.username}!\nYou've now been verified in ${config.SERVER_NAME}.\n\nI recommend you check out the <#${config.SERVER_MAP_CHANNEL}> to get an overview of all of the channels available.`
    );
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(config.DISCORD_TOKEN);
