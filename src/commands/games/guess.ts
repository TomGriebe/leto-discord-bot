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
import { handleGambling } from "../blueprints/gambling";

export const guessGameCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess my number and become rich!")
    .addIntegerOption(BetAmountOption),

  execute: handleGambling(
    async (interaction) => {
      const playerBet = interaction.options.getInteger("bet", true);
      const holyNumber = randomInt(1, 101);

      const channel = await interaction.client.channels.fetch(
        interaction.channelId
      );

      if (!canCollectMessagesInChannel(channel)) {
        throw new Error(
          "You cannot play that game in this channel. Try somewhere else."
        );
      }

      let attempts = 5;
      await interaction.reply(
        `I am thinking of a number between 1 and 100. You have ${attempts} attempts to guess it. Go!`
      );

      return await new Promise<number>((resolve) => {
        const collector = channel.createMessageCollector({
          filter: (msg) => msg.author.id === interaction.user.id,
          time: 5 * 60_000,
        });

        collector.on("collect", async (message) => {
          const guess = Number(message.content);
          if (Number.isNaN(guess)) return;

          if (guess === holyNumber) {
            await message.reply(
              `You've got it! The number was **${holyNumber}**!`
            );
            collector.stop();
            return resolve(playerBet);
          }

          if (--attempts <= 0) {
            await message.reply(
              `You failed! The number was **${holyNumber}**!`
            );
            collector.stop();
            return resolve(-playerBet);
          }

          if (holyNumber > guess) {
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
            return resolve(-playerBet);
          }
        });
      });
    },
    { resultAsNewMessage: true }
  ),
};

function canCollectMessagesInChannel(
  channel: Channel | null | undefined
): channel is DMChannel | PartialDMChannel | TextChannel {
  return (
    channel?.type === ChannelType.GuildText || channel?.type === ChannelType.DM
  );
}
