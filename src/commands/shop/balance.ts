import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../SlashCommand";
import { getUserBalance } from "../../shop/balance.service";

export const balanceCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("coins")
    .setDescription("See how many coins you or other users have")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member who's coins you wanna see")
    ),

  async execute(interaction) {
    const userOption = interaction.options.getUser("member");
    const targetMember = userOption || interaction.user;

    const balance = await getUserBalance(targetMember.id, interaction.guildId);

    const message = userOption
      ? `${targetMember.displayName} has ${balance} coins`
      : `${targetMember.displayName}, you have ${balance} coins`;

    await interaction.reply(message);
  },
};
