import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";
import { diceGameCommand } from "./games/dice";
import { guessGameCommand } from "./games/guess";
import { rpsCommand as rpsGameCommand } from "./games/rps";
import { balanceCommand } from "./money/balance";
import { workCommand } from "./money/work";

const commands = new Collection<string, SlashCommand>();

[
  rpsGameCommand,
  diceGameCommand,
  guessGameCommand,
  balanceCommand,
  workCommand,
].forEach((command) => {
  commands.set(command.data.name, command);
});

export default commands;
