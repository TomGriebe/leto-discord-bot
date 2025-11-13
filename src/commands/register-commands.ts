import { REST, Routes } from "discord.js";
import { applicationId, guildId, token } from "../util/environment";
import commands from "./global-commands";

export async function registerCommands() {
  const rest = new REST().setToken(token);

  try {
    const body = commands.map((cmd) => cmd.data.toJSON());
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body,
    });
    console.info("Registered commands!");
  } catch (error) {
    console.error(`Failed to register commands: ${error}`);
  }
}
