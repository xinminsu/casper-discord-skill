import { SlashCommandBuilder } from 'discord.js';

// /account-info - Query account info
export const accountInfoCommand = new SlashCommandBuilder()
  .setName('account-info')
  .setDescription('Query Casper account info (keys, purses, named keys)')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Account public key (68 hex chars) or account hash (64 hex chars)')
      .setRequired(true)
  );

// /purse-balance - Query purse balance
export const purseBalanceCommand = new SlashCommandBuilder()
  .setName('purse-balance')
  .setDescription('Query CSPR balance of a specific purse URef')
  .addStringOption(option =>
    option.setName('purse-uref')
      .setDescription('Purse URef (e.g. uref-xxx-yyy)')
      .setRequired(true)
  );

// /named-keys - Query account named keys
export const namedKeysCommand = new SlashCommandBuilder()
  .setName('named-keys')
  .setDescription('Query all named keys of an account')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Account public key (68 hex chars)')
      .setRequired(true)
  );

// /account-balance - Query account CSPR balance
export const accountBalanceCommand = new SlashCommandBuilder()
  .setName('account-balance')
  .setDescription('Query CSPR balance for a public key or account hash')
  .addStringOption(option =>
    option.setName('address')
      .setDescription('Public key (68 hex) or account hash (64 hex)')
      .setRequired(true)
  );

// /purse-details - Query purse balance with full details
export const purseDetailsCommand = new SlashCommandBuilder()
  .setName('purse-details')
  .setDescription('Query purse balance with full proof details')
  .addStringOption(option =>
    option.setName('purse-uref')
      .setDescription('Purse URef (e.g. uref-xxx-yyy)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('state-root-hash')
      .setDescription('State root hash (optional, uses latest if empty)')
      .setRequired(false)
  );

// /global-state - Query global state by key
export const globalStateCommand = new SlashCommandBuilder()
  .setName('global-state')
  .setDescription('Query global state by key and path')
  .addStringOption(option =>
    option.setName('key')
      .setDescription('State key (e.g. account-hash-xxx, hash-xxx, uref-xxx)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('path')
      .setDescription('Path segments (comma-separated, e.g. field1,field2)')
      .setRequired(false)
  );
