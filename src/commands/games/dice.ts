import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../SlashCommand";
import { BetAmountOption } from "./shared";
import { randomInt } from "crypto";
import { delay } from "../../util/delay";

export const diceGameCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("My favorite game :)")
    .addIntegerOption(BetAmountOption),
  async execute(interaction) {
    const playerBet = interaction.options.getInteger("bet", true);

    const playerDice: [number, number] = [getRandomDie(), getRandomDie()];

    // -- just in case
    // if (interaction.user.id === "") {
    //   playerDice[0] = Math.min(6, playerDice[0] + 2);
    //   playerDice[1] = Math.min(6, playerDice[1] + 2);
    // }

    const reply = await interaction.reply({
      content: `You've rolled a ${playerDice[0]} and ${playerDice[1]}`,
    });
    await delay(2000);

    const botDice: [number, number] = [getRandomDie(), getRandomDie()];
    await reply.edit({
      content: `I've rolled a ${botDice[0]} and ${botDice[1]}`,
    });
    await delay(2000);

    const playerScore = playerDice[0] + playerDice[1];
    const botScore = botDice[0] + botDice[1];

    if (playerScore > botScore) {
      await reply.edit({
        content: `You won **${playerBet} coins**! 🎉`,
      });
    } else if (playerScore < botScore) {
      await reply.edit({
        content: `You lost **${playerBet} coins**, fricking loser 👎`,
      });
    } else {
      await reply.edit({
        content: `It's a draw! You get back your **${playerBet} coins** 🙃`,
      });
    }
  },
};

function getRandomDie(): number {
  return randomInt(1, 7);
}
