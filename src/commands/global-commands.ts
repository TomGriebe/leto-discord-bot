import {
  ChatInputCommandInteraction,
  Collection,
  Interaction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

interface SlashCommand {
  data: SlashCommandOptionsOnlyBuilder;
  execute(interaction: Interaction): Promise<void>;
}

const helloCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Greets you :3")
    .addStringOption((option) =>
      option.setName("name").setDescription("Your name")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name") || "You";
    await interaction.reply(`Hello back, ${name}!`);
  },
};

const commands = new Collection<string, SlashCommand>();

[helloCommand].forEach((command) => {
  commands.set(command.data.name, command);
});

export default commands;
