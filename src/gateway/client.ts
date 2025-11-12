import { Client, Events, MessageFlags } from "discord.js";
import commands from "../commands/global-commands";
import { token } from "../util/environment";

export function createGatewayClient(): Client {
  const client = new Client({ intents: [] });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
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
      command.execute(interaction);
    } catch (error) {
      console.error(`Error while executing ${command.data.name}: ${error}`);
      const content = "There was an error while executing this command!";

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content, flags: MessageFlags.Ephemeral });
      }
    }
  });
}

export function runGateway(client: Client) {
  client.login(token);
}
