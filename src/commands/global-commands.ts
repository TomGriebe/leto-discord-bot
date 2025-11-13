import { Collection } from "discord.js";
import { SlashCommand } from "./SlashCommand";
import { rpsCommand as rpsGameCommand } from "./games/rps";
import { diceGameCommand } from "./games/dice";
import { guessGameCommand } from "./games/guess";
import { balanceCommand } from "./shop/balance";

const commands = new Collection<string, SlashCommand>();

[rpsGameCommand, diceGameCommand, guessGameCommand, balanceCommand].forEach(
  (command) => {
    commands.set(command.data.name, command);
  }
);

export default commands;
