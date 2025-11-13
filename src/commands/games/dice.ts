import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../SlashCommand";
import { BetAmountOption } from "./shared";
import { randomInt } from "crypto";
import { delay } from "../../util/delay";
import { addBalance, getBalance } from "../../user/server-user.service";
import { BET_INSUFFICIENT_FUNDS } from "../../constants/messages";

export const diceGameCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("My favorite game :)")
    .addIntegerOption(BetAmountOption),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    const playerBalance = await getBalance(userId, serverId);
    const playerBet = interaction.options.getInteger("bet", true);

    if (playerBet > playerBalance) {
      await interaction.reply(BET_INSUFFICIENT_FUNDS);
      return;
    }

    const playerDice: [number, number] = [getRandomDie(), getRandomDie()];
    const botDice: [number, number] = [getRandomDie(), getRandomDie()];
    const playerScore = playerDice[0] + playerDice[1];
    const botScore = botDice[0] + botDice[1];

    await interaction.reply(
      `🎲 You've rolled a ${playerDice[0]} and ${playerDice[1]}!`
    );
    await delay(2000);

    await interaction.editReply(
      `🎲 I've rolled a ${botDice[0]} and ${botDice[1]}!`
    );
    await delay(2000);

    let payout = 0;
    let resultMsg = "";

    if (playerScore > botScore) {
      payout = playerBet;
      resultMsg = `You won **${playerBet} coins**! 🎉`;
    } else if (playerScore < botScore) {
      payout = -playerBet;
      resultMsg = `You lost **${playerBet} coins**, fricking loser 👎`;
    } else {
      resultMsg = `It's a draw! You get back your **${playerBet} coins** 🙃`;
    }

    await interaction.editReply(resultMsg);

    if (payout !== 0) {
      try {
        await addBalance(userId, interaction.guildId, payout);
      } catch (error) {
        console.error("Error while updating user balance:", error);
        await interaction.editReply("We've had trouble paying out, sorry!");
      }
    }
  },
};

function getRandomDie(): number {
  return randomInt(1, 7);
}
