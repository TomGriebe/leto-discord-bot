import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../SlashCommand";
import { randomInt } from "crypto";

type RPSAnswer = "rock" | "paper" | "scissors";

export const rpsCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play rock, paper, scissors with me!")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("How much you wanna bet")
        .setMinValue(0)
        .setMaxValue(500)
        .setRequired(true)
    ),
  async execute(interaction) {
    const playerBet = interaction.options.getNumber("bet", true);

    const response = await interaction.reply({
      content: "Rock, paper, scissors, shoot!",
      components: [getActionRow().toJSON()],
      withResponse: true,
    });

    const answer = await response.resource?.message?.awaitMessageComponent({
      filter: rootInteractionUserId(interaction),
      time: 60_000,
    });

    if (!answer) {
      throw new Error("Didn't receive answer in time.");
    }

    const playerAnswer = answer.customId as RPSAnswer;
    const botAnswer = getRandomAnswer();
    const rpsResult = evaluateRps(playerAnswer, botAnswer);

    const resultDisplay = await answer.update({
      content: `You played ${idToEmoji(playerAnswer)}, I played ${idToEmoji(botAnswer)}`,
      components: [],
    });

    await new Promise((res) => setTimeout(res, 2_000));

    if (rpsResult > 0) {
      await resultDisplay.edit({
        content: `You won **${playerBet} coins**! 🎉`,
      });
    } else if (rpsResult < 0) {
      await resultDisplay.edit({
        content: `You lost **${playerBet} coins**, fricking loser 👎`,
      });
    } else {
      await resultDisplay.edit({
        content: `It's a draw! You get back your **${playerBet} coins** 🙃`,
      });
    }
  },
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
