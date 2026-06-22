import { SlashCommandBuilder } from 'discord.js';

// DeFi AMM / Liquidity Commands

export const swapCommand = new SlashCommandBuilder()
  .setName('swap')
  .setDescription('Swap tokens on an AMM DEX')
  .addStringOption(o => o.setName('contract-hash').setDescription('DEX contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-in').setDescription('Input token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-out').setDescription('Output token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('amount-in').setDescription('Input amount').setRequired(true))
  .addStringOption(o => o.setName('min-amount-out').setDescription('Minimum output amount (slippage protection)').setRequired(true))
  .addIntegerOption(o => o.setName('decimals').setDescription('Token decimals (default: 9)').setRequired(false).setMinValue(0).setMaxValue(18));

export const addLiquidityCommand = new SlashCommandBuilder()
  .setName('add-liquidity')
  .setDescription('Add liquidity to an AMM pool')
  .addStringOption(o => o.setName('contract-hash').setDescription('DEX contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-a').setDescription('Token A contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-b').setDescription('Token B contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('amount-a').setDescription('Amount of token A').setRequired(true))
  .addStringOption(o => o.setName('amount-b').setDescription('Amount of token B').setRequired(true))
  .addIntegerOption(o => o.setName('decimals').setDescription('Token decimals (default: 9)').setRequired(false).setMinValue(0).setMaxValue(18));

export const removeLiquidityCommand = new SlashCommandBuilder()
  .setName('remove-liquidity')
  .setDescription('Remove liquidity from an AMM pool')
  .addStringOption(o => o.setName('contract-hash').setDescription('DEX contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('lp-token').setDescription('LP token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('lp-amount').setDescription('Amount of LP tokens to burn').setRequired(true))
  .addStringOption(o => o.setName('min-amount-a').setDescription('Min amount of token A to receive').setRequired(true))
  .addStringOption(o => o.setName('min-amount-b').setDescription('Min amount of token B to receive').setRequired(true))
  .addIntegerOption(o => o.setName('decimals').setDescription('Token decimals (default: 9)').setRequired(false).setMinValue(0).setMaxValue(18));

export const stakeLpCommand = new SlashCommandBuilder()
  .setName('stake-lp')
  .setDescription('Stake LP tokens for farming rewards')
  .addStringOption(o => o.setName('contract-hash').setDescription('Farming contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('lp-token').setDescription('LP token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('amount').setDescription('Amount of LP tokens to stake').setRequired(true))
  .addIntegerOption(o => o.setName('decimals').setDescription('Token decimals (default: 9)').setRequired(false).setMinValue(0).setMaxValue(18));

export const claimRewardCommand = new SlashCommandBuilder()
  .setName('claim-reward')
  .setDescription('Claim farming rewards')
  .addStringOption(o => o.setName('contract-hash').setDescription('Farming contract hash (hex)').setRequired(true));

export const createOrderCommand = new SlashCommandBuilder()
  .setName('create-order')
  .setDescription('Create a limit order on a DEX')
  .addStringOption(o => o.setName('contract-hash').setDescription('DEX contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-in').setDescription('Input token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-out').setDescription('Output token contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('amount-in').setDescription('Input amount').setRequired(true))
  .addStringOption(o => o.setName('price').setDescription('Price (output per input)').setRequired(true))
  .addIntegerOption(o => o.setName('decimals').setDescription('Token decimals (default: 9)').setRequired(false).setMinValue(0).setMaxValue(18));

export const cancelOrderCommand = new SlashCommandBuilder()
  .setName('cancel-order')
  .setDescription('Cancel a DEX limit order')
  .addStringOption(o => o.setName('contract-hash').setDescription('DEX contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('order-id').setDescription('Order ID to cancel').setRequired(true));

// General DApp Commands (Counter, KV, Governance, RWA)

export const counterIncrementCommand = new SlashCommandBuilder()
  .setName('counter-increment')
  .setDescription('Increment a counter contract')
  .addStringOption(o => o.setName('contract-hash').setDescription('Counter contract hash (hex)').setRequired(true));

export const counterDecrementCommand = new SlashCommandBuilder()
  .setName('counter-decrement')
  .setDescription('Decrement a counter contract')
  .addStringOption(o => o.setName('contract-hash').setDescription('Counter contract hash (hex)').setRequired(true));

export const dictPutCommand = new SlashCommandBuilder()
  .setName('dict-put')
  .setDescription('Write a key-value pair to a dictionary via contract')
  .addStringOption(o => o.setName('contract-hash').setDescription('Contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('key').setDescription('Dictionary key').setRequired(true))
  .addStringOption(o => o.setName('value').setDescription('Value to store').setRequired(true));

export const dictRemoveCommand = new SlashCommandBuilder()
  .setName('dict-remove')
  .setDescription('Remove a key from a dictionary via contract')
  .addStringOption(o => o.setName('contract-hash').setDescription('Contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('key').setDescription('Dictionary key to remove').setRequired(true));

export const createProposalCommand = new SlashCommandBuilder()
  .setName('create-proposal')
  .setDescription('Create a governance proposal')
  .addStringOption(o => o.setName('contract-hash').setDescription('Governance contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('title').setDescription('Proposal title').setRequired(true))
  .addStringOption(o => o.setName('description').setDescription('Proposal description').setRequired(true))
  .addIntegerOption(o => o.setName('voting-duration').setDescription('Voting duration in blocks').setRequired(true).setMinValue(1));

export const castVoteCommand = new SlashCommandBuilder()
  .setName('cast-vote')
  .setDescription('Cast a vote on a governance proposal')
  .addStringOption(o => o.setName('contract-hash').setDescription('Governance contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('proposal-id').setDescription('Proposal ID').setRequired(true))
  .addStringOption(o => o.setName('vote')
    .setDescription('Vote choice').setRequired(true)
    .addChoices({ name: 'For', value: 'for' }, { name: 'Against', value: 'against' }));

export const executeProposalCommand = new SlashCommandBuilder()
  .setName('execute-proposal')
  .setDescription('Execute a passed governance proposal')
  .addStringOption(o => o.setName('contract-hash').setDescription('Governance contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('proposal-id').setDescription('Proposal ID').setRequired(true));

export const saveAssetCommand = new SlashCommandBuilder()
  .setName('save-asset')
  .setDescription('Save an RWA asset record to the blockchain')
  .addStringOption(o => o.setName('contract-hash').setDescription('RWA contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('asset-id').setDescription('Asset ID').setRequired(true))
  .addStringOption(o => o.setName('owner-hash').setDescription('Owner account hash (hex, 64 chars)').setRequired(true))
  .addStringOption(o => o.setName('document-hash').setDescription('Document hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('metadata').setDescription('Additional metadata (optional)').setRequired(false));

// Contract lifecycle commands

export const callContractCommand = new SlashCommandBuilder()
  .setName('call-contract')
  .setDescription('Call a stored contract by hash (generic entry point)')
  .addStringOption(o => o.setName('contract-hash').setDescription('Contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('entry-point').setDescription('Entry point name (e.g., "mint", "transfer")').setRequired(true))
  .addStringOption(o => o.setName('args-json').setDescription('Arguments as JSON (e.g., {"key":"value"}). Note: only string values supported.').setRequired(false));
