import { randomInt } from "crypto";
import {
  Channel,
  ChannelType,
  DMChannel,
  PartialDMChannel,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../SlashCommand";
import { BetAmountOption } from "./shared";

export const guessGameCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess my number and become rich!")
    .addIntegerOption(BetAmountOption),
  async execute(interaction) {
    const playerBet = interaction.options.getInteger("bet", true);
    const holyNumber = randomInt(1, 101);

    const channel = await interaction.client.channels.fetch(
      interaction.channelId
    );

    if (!isValidChannel(channel)) return;

    let attempts = 5;
    await interaction.reply(
      `I am thinking of a number between 1 and 100. You have ${attempts} attempts to guess it. Go!`
    );

    const collector = channel.createMessageCollector({
      filter: (msg) => msg.author.id === interaction.user.id,
      time: 5 * 60_000,
    });

    collector.on("collect", async (message) => {
      const guess = Number(message.content);
      if (Number.isNaN(guess)) return;

      if (guess === holyNumber) {
        await message.reply(
          `You've got it! The number is **${holyNumber}**, you win **${playerBet}** coins!`
        );
        collector.stop();
      } else if (--attempts <= 0) {
        await message.reply(
          `That's it, you lose **${playerBet}** coins! The number was **${holyNumber}**!`
        );
        collector.stop();
      } else if (holyNumber > guess) {
        await message.reply(
          `The number is **higher** than ${guess}. You've got **${attempts} attempts** left!`
        );
      } else {
        await message.reply(
          `The number is **lower** than ${guess}. You've got **${attempts} attempts** left!`
        );
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        await channel.send(
          `You ran out of time and lost your bet! The number was **${holyNumber}**`
        );
      }
    });
  },
};

function isValidChannel(
  channel: Channel | null | undefined
): channel is DMChannel | PartialDMChannel | TextChannel {
  return (
    channel?.type === ChannelType.GuildText || channel?.type === ChannelType.DM
  );
}
