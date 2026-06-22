import { SlashCommandBuilder } from 'discord.js';

// /contract-info - Query contract metadata
export const contractInfoCommand = new SlashCommandBuilder()
  .setName('contract-info')
  .setDescription('Query Casper contract metadata (hash, version, entry points)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Contract hash (64 hex chars or hash-xxx format)')
      .setRequired(true)
  );

// /entry-points - Query contract entry points
export const entryPointsCommand = new SlashCommandBuilder()
  .setName('entry-points')
  .setDescription('Query all callable entry points of a contract')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Contract hash (64 hex chars or hash-xxx format)')
      .setRequired(true)
  );

// /dict-item - Query dictionary item by URef
export const dictItemCommand = new SlashCommandBuilder()
  .setName('dict-item')
  .setDescription('Query a dictionary item by seed URef and dictionary key')
  .addStringOption(option =>
    option.setName('uref')
      .setDescription('Seed URef (e.g. uref-xxx-yyy)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('dict-key')
      .setDescription('Dictionary key to query')
      .setRequired(true)
  );

// /dict-by-account - Query dictionary item via account named key
export const dictByAccountCommand = new SlashCommandBuilder()
  .setName('dict-by-account')
  .setDescription('Query dictionary item via account named key')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Account public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('named-key')
      .setDescription('Named key in the account that references the dictionary URef')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('dict-key')
      .setDescription('Dictionary key to query')
      .setRequired(true)
  );

// /dict-by-contract - Query dictionary item via contract named key
export const dictByContractCommand = new SlashCommandBuilder()
  .setName('dict-by-contract')
  .setDescription('Query dictionary item via contract named key')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Contract hash (64 hex chars or hash-xxx format)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('named-key')
      .setDescription('Named key in the contract that references the dictionary URef')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('dict-key')
      .setDescription('Dictionary key to query')
      .setRequired(true)
  );

// /state-item - Query state item by key (legacy state_get_item)
export const stateItemCommand = new SlashCommandBuilder()
  .setName('state-item')
  .setDescription('Query a stored state item by key and path')
  .addStringOption(option =>
    option.setName('key')
      .setDescription('State key (e.g. account-hash-xxx, hash-xxx, uref-xxx)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('path')
      .setDescription('Path segments (comma-separated)')
      .setRequired(false)
  );

// /contract-named-keys - Query contract named keys
export const contractNamedKeysCommand = new SlashCommandBuilder()
  .setName('contract-named-keys')
  .setDescription('Query all named keys of a contract')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('Contract hash (64 hex chars or hash-xxx format)')
      .setRequired(true)
  );
