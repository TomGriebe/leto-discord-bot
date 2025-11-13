import { ChatInputCommandInteraction } from "discord.js";
import {
  ACTION_ON_COOLDOWN,
  BET_INSUFFICIENT_FUNDS,
} from "../../constants/messages";
import { addBalance, getBalance } from "../../user/server-user.service";
import {
  getRemainingMinigameCooldown,
  setMinigameCooldown,
} from "../../user/user-cooldown.service";
import { SlashCommandHandler } from "../SlashCommand";

interface GamblingHandlerOptions {
  resultAsNewMessage: boolean;
}

export function handleGambling(
  gameLogic: SlashCommandHandler<number>,
  options: Partial<GamblingHandlerOptions> = {}
): SlashCommandHandler {
  return async (interaction: ChatInputCommandInteraction) => {
    await checkBalance(interaction);
    if (interaction.replied) return;

    await checkCooldown(interaction);
    if (interaction.replied) return;

    try {
      let result = "";
      const payout = await gameLogic(interaction);

      if (payout > 0) {
        result = `You win **${payout} coins**!`;
      } else if (payout < 0) {
        result = `You lost **${-payout} coins**!`;
      } else {
        result = "It's a draw! You get back your bet!";
      }

      if (options.resultAsNewMessage === true) {
        await interaction.channel.send(result);
      } else if (!interaction.replied) {
        await interaction.reply(result);
      } else {
        await interaction.editReply(result);
      }

      await addBalance(interaction.user.id, interaction.guildId, payout);
    } catch (error) {
      if (error instanceof Error) {
        if (!interaction.replied) {
          await interaction.reply(error.message);
        } else {
          await interaction.editReply(error.message);
        }
      }
    }
  };
}

async function checkCooldown(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const serverId = interaction.guildId;
  const command = interaction.commandName;

  const cooldown = await getRemainingMinigameCooldown(
    userId,
    serverId,
    command
  );

  if (cooldown > 0) {
    await interaction.reply(ACTION_ON_COOLDOWN(cooldown));
  } else {
    await setMinigameCooldown(userId, serverId, command);
  }
}

async function checkBalance(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const serverId = interaction.guildId;
  const playerBet = interaction.options.getInteger("bet", true);

  const playerBalance = await getBalance(userId, serverId);

  if (playerBet > playerBalance) {
    await interaction.reply(BET_INSUFFICIENT_FUNDS);
  }
}
