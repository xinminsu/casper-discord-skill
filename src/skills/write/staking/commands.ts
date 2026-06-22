import { SlashCommandBuilder } from 'discord.js';

// Staking / Consensus Commands

export const bondCommand = new SlashCommandBuilder()
  .setName('bond')
  .setDescription('Bond CSPR to become a validator (self-stake)')
  .addStringOption(o => o.setName('amount').setDescription('Amount of CSPR to bond').setRequired(true))
  .addIntegerOption(o => o.setName('delegator-rate').setDescription('Delegator rate (0-100, optional)').setRequired(false).setMinValue(0).setMaxValue(100));

export const delegateCommand = new SlashCommandBuilder()
  .setName('delegate')
  .setDescription('Delegate CSPR to a validator')
  .addStringOption(o => o.setName('validator').setDescription('Validator public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('amount').setDescription('Amount of CSPR to delegate').setRequired(true));

export const unbondCommand = new SlashCommandBuilder()
  .setName('unbond')
  .setDescription('Unbond your self-staked CSPR')
  .addStringOption(o => o.setName('amount').setDescription('Amount of CSPR to unbond').setRequired(true));

export const undelegateCommand = new SlashCommandBuilder()
  .setName('undelegate')
  .setDescription('Withdraw delegation from a validator')
  .addStringOption(o => o.setName('validator').setDescription('Validator public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('amount').setDescription('Amount of CSPR to undelegate').setRequired(true));

export const withdrawRewardsCommand = new SlashCommandBuilder()
  .setName('withdraw-rewards')
  .setDescription('Withdraw staking rewards to your purse');

export const setCommissionRateCommand = new SlashCommandBuilder()
  .setName('set-commission-rate')
  .setDescription('Set validator commission rate (for validators only)')
  .addIntegerOption(o => o.setName('rate').setDescription('Commission rate (0-100)').setRequired(true).setMinValue(0).setMaxValue(100));
