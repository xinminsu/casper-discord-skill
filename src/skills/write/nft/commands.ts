import { SlashCommandBuilder } from 'discord.js';

// CEP-47/CEP-78 NFT Commands

export const nftMintCommand = new SlashCommandBuilder()
  .setName('nft-mint')
  .setDescription('Mint a single NFT (CEP-47 standard)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('recipient').setDescription('Recipient public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Unique token ID').setRequired(true))
  .addStringOption(o => o.setName('metadata-key').setDescription('Optional metadata key (e.g., "name")').setRequired(false))
  .addStringOption(o => o.setName('metadata-value').setDescription('Optional metadata value (e.g., "My NFT")').setRequired(false));

export const nftMintCopiesCommand = new SlashCommandBuilder()
  .setName('nft-mint-copies')
  .setDescription('Mint multiple NFT copies (CEP-47 batch mint)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('recipient').setDescription('Recipient public key (68 hex chars)').setRequired(true))
  .addIntegerOption(o => o.setName('count').setDescription('Number of copies to mint').setRequired(true).setMinValue(1).setMaxValue(100));

export const nftBurnCommand = new SlashCommandBuilder()
  .setName('nft-burn')
  .setDescription('Burn an NFT (CEP-47 standard)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('owner').setDescription('Owner public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Token ID to burn').setRequired(true));

export const nftTransferCommand = new SlashCommandBuilder()
  .setName('nft-transfer')
  .setDescription('Transfer an NFT to another account (CEP-47)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('recipient').setDescription('Recipient public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Token ID to transfer').setRequired(true));

export const nftApproveCommand = new SlashCommandBuilder()
  .setName('nft-approve')
  .setDescription('Approve a spender for an NFT (CEP-47)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('spender').setDescription('Spender public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Token ID to approve').setRequired(true));

export const nftTransferFromCommand = new SlashCommandBuilder()
  .setName('nft-transfer-from')
  .setDescription('Transfer NFT from approved owner (CEP-47)')
  .addStringOption(o => o.setName('contract-hash').setDescription('NFT contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('owner').setDescription('Current owner public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('recipient').setDescription('Recipient public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Token ID to transfer').setRequired(true));

export const nftSetMetadataCommand = new SlashCommandBuilder()
  .setName('nft-set-metadata')
  .setDescription('Update NFT metadata (CEP-78 advanced)')
  .addStringOption(o => o.setName('contract-hash').setDescription('CEP-78 contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('token-id').setDescription('Token ID').setRequired(true))
  .addStringOption(o => o.setName('metadata-key').setDescription('Metadata key (e.g., "image_url")').setRequired(true))
  .addStringOption(o => o.setName('metadata-value').setDescription('Metadata value').setRequired(true));

export const nftBatchTransferCommand = new SlashCommandBuilder()
  .setName('nft-batch-transfer')
  .setDescription('Batch transfer multiple NFTs (CEP-78)')
  .addStringOption(o => o.setName('contract-hash').setDescription('CEP-78 contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('recipient').setDescription('Recipient public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-ids').setDescription('Comma-separated token IDs (e.g., "1,2,3")').setRequired(true));

export const nftBatchBurnCommand = new SlashCommandBuilder()
  .setName('nft-batch-burn')
  .setDescription('Batch burn multiple NFTs (CEP-78)')
  .addStringOption(o => o.setName('contract-hash').setDescription('CEP-78 contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('owner').setDescription('Owner public key (68 hex chars)').setRequired(true))
  .addStringOption(o => o.setName('token-ids').setDescription('Comma-separated token IDs to burn').setRequired(true));

export const nftSetAdminCommand = new SlashCommandBuilder()
  .setName('nft-set-admin')
  .setDescription('Set NFT contract admin (CEP-78)')
  .addStringOption(o => o.setName('contract-hash').setDescription('CEP-78 contract hash (hex)').setRequired(true))
  .addStringOption(o => o.setName('admin').setDescription('New admin public key (68 hex chars)').setRequired(true));
