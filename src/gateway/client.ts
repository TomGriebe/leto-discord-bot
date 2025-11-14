import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import commands from "../commands/commands";
import { createUserIfNotExists } from "../user/server-user.service";
import { token } from "../util/environment";

export function createGatewayClient(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.info(`Logged in as ${readyClient.user.tag}`);
  });

  return client;
}

export function addCommandHandlers(client: Client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);

    if (!command) {
      console.error(`${interaction.commandName} is not a registered command.`);
      return;
    }

    try {
      await createUserIfNotExists(interaction.user.id, interaction.guildId);
    } catch (error) {
      console.error("Failed to create user in database:", error);
      await interaction.reply(
        "We've run into an issue, please try again later!"
      );
      return;
    }

    try {
      command.execute(interaction);
    } catch (error) {
      console.error(`Error while executing ${command.data.name}:`, error);
      const content = "There was an error while executing this command!";

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content, flags: MessageFlags.Ephemeral });
      }
    }
  });
}

export async function runGateway(client: Client) {
  await client.login(token);
}
