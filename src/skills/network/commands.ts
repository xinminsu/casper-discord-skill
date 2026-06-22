import { SlashCommandBuilder } from 'discord.js';

// /node-status - Get node status
export const nodeStatusCommand = new SlashCommandBuilder()
  .setName('node-status')
  .setDescription('Get Casper node status and network information');

// /peers - Get network peers
export const peersCommand = new SlashCommandBuilder()
  .setName('peers')
  .setDescription('Get Casper network peer list');

// /block - Get block info
export const blockCommand = new SlashCommandBuilder()
  .setName('block')
  .setDescription('Query block information')
  .addStringOption(option =>
    option.setName('hash')
      .setDescription('Block hash (leave empty to get latest block)')
      .setRequired(false)
  )
  .addIntegerOption(option =>
    option.setName('height')
      .setDescription('Block height (alternative to hash)')
      .setRequired(false)
  );

// /deploy - Get deploy info
export const deployCommand = new SlashCommandBuilder()
  .setName('deploy')
  .setDescription('Query deploy/transaction information')
  .addStringOption(option =>
    option.setName('hash')
      .setDescription('Deploy hash')
      .setRequired(true)
  );

// /validators - Get validator list
export const validatorsCommand = new SlashCommandBuilder()
  .setName('validators')
  .setDescription('Get Casper network validators and auction info');

// /era - Get era information
export const eraCommand = new SlashCommandBuilder()
  .setName('era')
  .setDescription('Get current era information');

// /state-root-hash - Get latest state root hash
export const stateRootHashCommand = new SlashCommandBuilder()
  .setName('state-root-hash')
  .setDescription('Get latest state root hash');

// /transfers - Get block transfers
export const transfersCommand = new SlashCommandBuilder()
  .setName('transfers')
  .setDescription('Get transfers in a block')
  .addStringOption(option =>
    option.setName('block-hash')
      .setDescription('Block hash (leave empty for latest block)')
      .setRequired(false)
  );

// /chainspec - Get chainspec info
export const chainspecCommand = new SlashCommandBuilder()
  .setName('chainspec')
  .setDescription('Get Casper chainspec information');
