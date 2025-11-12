import { REST, Routes } from "discord.js";
import commands from "../commands/global-commands";
import { applicationId, token } from "../util/environment";

async function registerGlobalCommands() {
  const rest = new REST().setToken(token);

  try {
    await rest.put(Routes.applicationCommands(applicationId), {
      body: [commands.map((cmd) => cmd.data.toJSON())],
    });
  } catch (error) {
    console.error(`Failed to register commands: ${error}`);
  }
}

registerGlobalCommands();
