import { SlashCommandBuilder } from "discord.js";
import { AppDataSource } from "../../data-source";
import { ServerUser } from "../../user/server-user.entity";
import {
  getTimeUntilNextShift,
  startWorkShift,
} from "../../user/server-user.service";
import { SlashCommand } from "../SlashCommand";

export const workCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn money"),

  async execute(interaction) {
    const userRepo = AppDataSource.getRepository(ServerUser);

    const serverUser = await userRepo.findOne({
      where: {
        discordId: interaction.user.id,
        server: { discordId: interaction.guildId },
      },
      relations: {
        cooldowns: true,
        server: { config: true },
      },
    });

    const timeUntilNextShift = await getTimeUntilNextShift(serverUser);

    if (timeUntilNextShift > 0) {
      return await interaction.reply(
        `You are already working. Come back in ${Math.ceil(timeUntilNextShift / 1000)} seconds, eager worker.`
      );
    }

    const { lastSalary, nextSalary, duration } =
      await startWorkShift(serverUser);
    const durationSec = Math.ceil(duration / 1000);

    await interaction.reply(
      lastSalary
        ? `You earn **${lastSalary} coins** for your last shift. Come back in ${durationSec} seconds to claim **${nextSalary} coins** for your current shift.`
        : `You started working! Come back in ${durationSec} seconds to claim your paycheck of **${nextSalary} coins**.`
    );
  },
};
