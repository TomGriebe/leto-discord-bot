import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";
import { rpsCommand } from "./games/rps";

const commands = new Collection<string, SlashCommand>();

[rpsCommand].forEach((command) => {
  commands.set(command.data.name, command);
});

export default commands;
