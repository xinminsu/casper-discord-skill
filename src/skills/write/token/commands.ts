import { SlashCommandBuilder } from 'discord.js';

// ============================================================
// CEP-18 Fungible Token Commands
// ============================================================

export const mintCommand = new SlashCommandBuilder()
  .setName('mint')
  .setDescription('Mint CEP-18 fungible tokens to an account')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Token owner public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount of tokens to mint')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9 for CSPR-like)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const burnCommand = new SlashCommandBuilder()
  .setName('burn')
  .setDescription('Burn CEP-18 fungible tokens from an account')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Token owner public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount of tokens to burn')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const tokenTransferCommand = new SlashCommandBuilder()
  .setName('token-transfer')
  .setDescription('Transfer CEP-18 tokens to another account')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('recipient')
      .setDescription('Recipient public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount of tokens to transfer')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const approveCommand = new SlashCommandBuilder()
  .setName('approve')
  .setDescription('Approve a spender for CEP-18 tokens')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('spender')
      .setDescription('Spender public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount to approve')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const increaseAllowanceCommand = new SlashCommandBuilder()
  .setName('increase-allowance')
  .setDescription('Increase spending allowance for CEP-18 tokens')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('spender')
      .setDescription('Spender public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount to increase allowance by')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const decreaseAllowanceCommand = new SlashCommandBuilder()
  .setName('decrease-allowance')
  .setDescription('Decrease spending allowance for CEP-18 tokens')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('spender')
      .setDescription('Spender public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount to decrease allowance by')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );

export const transferFromCommand = new SlashCommandBuilder()
  .setName('transfer-from')
  .setDescription('Transfer CEP-18 tokens on behalf of an approved owner')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (hex)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Token owner public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('recipient')
      .setDescription('Recipient public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount of tokens to transfer')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('decimals')
      .setDescription('Token decimals (default: 9)')
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(18)
  );
