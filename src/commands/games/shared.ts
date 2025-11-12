import { SlashCommandIntegerOption } from "discord.js";

export function BetAmountOption(
  option: SlashCommandIntegerOption
): SlashCommandIntegerOption {
  return option
    .setName("bet")
    .setDescription("How much you wanna bet")
    .setMinValue(1)
    .setMaxValue(500)
    .setRequired(true);
}
