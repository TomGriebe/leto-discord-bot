import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";
import { rpsCommand as rpsGameCommand } from "./games/rps";
import { diceGameCommand } from "./games/dice";

const commands = new Collection<string, SlashCommand>();

[rpsGameCommand, diceGameCommand].forEach((command) => {
  commands.set(command.data.name, command);
});

export default commands;
