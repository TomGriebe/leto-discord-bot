import { randomInt } from "crypto";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { delay } from "../../util/delay";
import { handleGambling } from "../blueprints/gambling";
import { SlashCommand } from "../SlashCommand";
import { BetAmountOption } from "./shared";

type RPSAnswer = "rock" | "paper" | "scissors";

export const rpsCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play rock, paper, scissors with me!")
    .addIntegerOption(BetAmountOption),

  execute: handleGambling(async (interaction) => {
    const playerBet = interaction.options.getInteger("bet", true);

    const gamePrompt = await interaction.reply({
      content: "Rock, paper, scissors, shoot!",
      components: [getActionRow().toJSON()],
      withResponse: true,
    });

    const answer = await gamePrompt.resource?.message?.awaitMessageComponent({
      filter: rootInteractionUserId(interaction),
      time: 60_000,
    });

    if (!answer) {
      throw new Error("Didn't receive answer in time.");
    }

    const playerAnswer = answer.customId as RPSAnswer;
    const botAnswer = getRandomAnswer();
    const rpsResult = evaluateRps(playerAnswer, botAnswer);

    await interaction.editReply({
      content: `You played ${idToEmoji(playerAnswer)}, I played ${idToEmoji(botAnswer)}`,
      components: [],
    });

    await delay(2000);
    return playerBet * rpsResult;
  }),
};

function getActionRow() {
  const rock = new ButtonBuilder()
    .setCustomId("rock")
    .setLabel("🪨")
    .setStyle(ButtonStyle.Primary);
  const paper = new ButtonBuilder()
    .setCustomId("paper")
    .setLabel("📃")
    .setStyle(ButtonStyle.Primary);
  const scissors = new ButtonBuilder()
    .setCustomId("scissors")
    .setLabel("✂️")
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder().addComponents(rock, paper, scissors);
}

function getRandomAnswer(): RPSAnswer {
  const options: RPSAnswer[] = ["rock", "paper", "scissors"];
  return options[randomInt(0, 3)]!;
}

function evaluateRps(player: RPSAnswer, bot: RPSAnswer): number {
  if (player === bot) return 0;

  if (player === "rock" && bot === "paper") {
    return -1;
  } else if (player === "paper" && bot === "scissors") {
    return -1;
  } else if (player === "scissors" && bot === "rock") {
    return -1;
  }

  if (bot === "rock" && player === "paper") {
    return 1;
  } else if (bot === "paper" && player === "scissors") {
    return 1;
  } else if (bot === "scissors" && player === "rock") {
    return 1;
  }

  return 0;
}

function idToEmoji(id: string): string {
  return (
    {
      rock: "🪨",
      paper: "📃",
      scissors: "✂️",
    }[id] || id
  );
}

function rootInteractionUserId(rootInteraction: Interaction) {
  return (interaction: Interaction) =>
    interaction.user.id === rootInteraction.user.id;
}
