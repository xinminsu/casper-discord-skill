import { SlashCommandBuilder } from 'discord.js';

export const balanceCommand = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Query wallet balance')
  .addStringOption(option =>
    option.setName('address')
      .setDescription('Wallet address')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('token')
      .setDescription('Token contract address (optional, leave blank to query CSPR balance)')
      .setRequired(false)
  );
