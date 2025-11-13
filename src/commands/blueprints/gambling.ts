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

export function handleGambling(
  gameLogic: SlashCommandHandler<number>
): SlashCommandHandler {
  return async (interaction: ChatInputCommandInteraction) => {
    await checkCooldown(interaction);
    if (interaction.replied) return;

    await checkBalance(interaction);
    if (interaction.replied) return;

    const payout = await gameLogic(interaction);

    if (!interaction.replied) {
      await interaction.reply("The game is finished!");
    }

    if (payout > 0) {
      await interaction.editReply(`You win **${payout} coins**!`);
    } else if (payout < 0) {
      await interaction.editReply(`You lost **${-payout} coins**!`);
    } else {
      await interaction.editReply("It's a draw! You get back your bet!");
    }

    await addBalance(interaction.user.id, interaction.guildId, payout);
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
