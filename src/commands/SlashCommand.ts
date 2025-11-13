import {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export type SlashCommandHandler<R = void> = (
  interaction: ChatInputCommandInteraction
) => Promise<R>;

export interface SlashCommand {
  data: SlashCommandOptionsOnlyBuilder;
  execute: SlashCommandHandler;
}
