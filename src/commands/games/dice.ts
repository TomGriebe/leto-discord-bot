import { randomInt } from "crypto";
import { SlashCommandBuilder } from "discord.js";
import { delay } from "../../util/delay";
import { handleGambling } from "../blueprints/gambling";
import { SlashCommand } from "../SlashCommand";
import { BetAmountOption } from "./shared";

export const diceGameCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("My favorite game :)")
    .addIntegerOption(BetAmountOption),

  execute: handleGambling(async (interaction) => {
    const playerBet = interaction.options.getInteger("bet", true);

    await interaction.reply(
      "🎲 Welcome to the dice game! 🎲\nYou and me roll 2 dice each, highest score wins. Let's begin!"
    );
    await delay(2000);

    const playerDice: [number, number] = [getRandomDie(), getRandomDie()];
    const botDice: [number, number] = [getRandomDie(), getRandomDie()];

    const playerScore = playerDice[0] + playerDice[1];
    const botScore = botDice[0] + botDice[1];

    await interaction.editReply(
      `🎲 You've rolled a **${playerDice[0]}** and **${playerDice[1]}**!`
    );
    await delay(2000);

    await interaction.editReply(
      `🎲 I've rolled a **${botDice[0]}** and **${botDice[1]}**!`
    );
    await delay(2000);

    if (playerScore > botScore) {
      return playerBet;
    } else if (playerScore < botScore) {
      return -playerBet;
    } else {
      return 0;
    }
  }),
};

function getRandomDie(): number {
  return randomInt(1, 7);
}
