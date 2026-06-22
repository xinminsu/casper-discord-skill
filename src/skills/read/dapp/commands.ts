import { SlashCommandBuilder } from 'discord.js';

// ==================== Counter Commands ====================

// /counter-value - Query counter current value
export const counterValueCommand = new SlashCommandBuilder()
  .setName('counter-value')
  .setDescription('Query the current value of a counter contract')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Counter contract hash (64 hex chars)')
      .setRequired(true)
  );

// ==================== AMM Commands ====================

// /amm-reserves - Query AMM pool reserves
export const ammReservesCommand = new SlashCommandBuilder()
  .setName('amm-reserves')
  .setDescription('Query AMM pool reserves (token balances and LP supply)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('AMM pool contract hash')
      .setRequired(true)
  );

// /amm-lp-balance - Query user LP token balance
export const ammLpBalanceCommand = new SlashCommandBuilder()
  .setName('amm-lp-balance')
  .setDescription('Query user LP token balance in an AMM pool')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('AMM pool contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('user')
      .setDescription('User public key (68 hex chars)')
      .setRequired(true)
  );

// /amm-stake-info - Query user staking info
export const ammStakeInfoCommand = new SlashCommandBuilder()
  .setName('amm-stake-info')
  .setDescription('Query user LP staking info (staked amount, pending rewards)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Staking contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('user')
      .setDescription('User public key (68 hex chars)')
      .setRequired(true)
  );

// ==================== Governance Commands ====================

// /all-proposals - Query all governance proposals
export const allProposalsCommand = new SlashCommandBuilder()
  .setName('all-proposals')
  .setDescription('Query all governance proposals')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Governance contract hash')
      .setRequired(true)
  );

// /proposal-detail - Query single proposal details
export const proposalDetailCommand = new SlashCommandBuilder()
  .setName('proposal-detail')
  .setDescription('Query details of a single governance proposal')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Governance contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('proposal-id')
      .setDescription('Proposal ID')
      .setRequired(true)
  );

// /vote-record - Query user vote record
export const voteRecordCommand = new SlashCommandBuilder()
  .setName('vote-record')
  .setDescription('Query a user vote record on a proposal')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Governance contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('proposal-id')
      .setDescription('Proposal ID')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('voter')
      .setDescription('Voter public key (68 hex chars)')
      .setRequired(true)
  );

// ==================== RWA Commands ====================

// /asset-record - Query RWA asset record
export const assetRecordCommand = new SlashCommandBuilder()
  .setName('asset-record')
  .setDescription('Query an RWA (Real World Asset) record on-chain')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('RWA contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('asset-id')
      .setDescription('Asset ID')
      .setRequired(true)
  );

// ==================== DEX Order Book Commands ====================

// /open-orders - Query user open orders
export const openOrdersCommand = new SlashCommandBuilder()
  .setName('open-orders')
  .setDescription('Query open orders for a user on a DEX')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('DEX contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('user')
      .setDescription('User public key (68 hex chars)')
      .setRequired(true)
  );
