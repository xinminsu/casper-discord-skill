import { SlashCommandBuilder } from 'discord.js';

export const gasPriceCommand = new SlashCommandBuilder()
  .setName('gas-price')
  .setDescription('Query current Gas price');

export const gasEstimateCommand = new SlashCommandBuilder()
  .setName('gas-estimate')
  .setDescription('Estimate transaction Gas fees')
  .addStringOption(option =>
    option.setName('from')
      .setDescription('Sender address')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('to')
      .setDescription('Receiver address')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('value')
      .setDescription('Transfer amount (CSPR)')
      .setRequired(false)
  );
