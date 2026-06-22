import { SlashCommandBuilder } from 'discord.js';

// ==================== CEP-18 Fungible Token Commands ====================

// /token-total-supply - Query CEP-18 total supply
export const tokenTotalSupplyCommand = new SlashCommandBuilder()
  .setName('token-total-supply')
  .setDescription('Query CEP-18 token total supply')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash (64 hex chars or hash-xxx)')
      .setRequired(true)
  );

// /token-balance - Query CEP-18 account balance
export const tokenBalanceCommand = new SlashCommandBuilder()
  .setName('token-balance')
  .setDescription('Query CEP-18 token balance of an account')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Token owner public key (68 hex chars)')
      .setRequired(true)
  );

// /token-allowance - Query CEP-18 allowance
export const tokenAllowanceCommand = new SlashCommandBuilder()
  .setName('token-allowance')
  .setDescription('Query CEP-18 allowance (approved spender amount)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Token owner public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('spender')
      .setDescription('Approved spender public key (68 hex chars)')
      .setRequired(true)
  );

// /token-meta - Query CEP-18 token metadata (name, symbol, decimals)
export const tokenMetaCommand = new SlashCommandBuilder()
  .setName('token-meta')
  .setDescription('Query CEP-18 token name, symbol, and decimals')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('CEP-18 contract hash')
      .setRequired(true)
  );

// ==================== CEP-47 / CEP-78 NFT Commands ====================

// /nft-total-supply - Query NFT total supply
export const nftTotalSupplyCommand = new SlashCommandBuilder()
  .setName('nft-total-supply')
  .setDescription('Query NFT contract total supply')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  );

// /nft-owner-of - Query NFT owner
export const nftOwnerOfCommand = new SlashCommandBuilder()
  .setName('nft-owner-of')
  .setDescription('Query the owner of a specific NFT')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('token-id')
      .setDescription('NFT token ID')
      .setRequired(true)
  );

// /nft-tokens-of - Query NFTs owned by an account
export const nftTokensOfCommand = new SlashCommandBuilder()
  .setName('nft-tokens-of')
  .setDescription('Query all NFT token IDs owned by an account')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('owner')
      .setDescription('Owner public key (68 hex chars)')
      .setRequired(true)
  );

// /nft-metadata - Query NFT metadata
export const nftMetadataCommand = new SlashCommandBuilder()
  .setName('nft-metadata')
  .setDescription('Query NFT metadata (image, attributes, etc.)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('token-id')
      .setDescription('NFT token ID')
      .setRequired(true)
  );

// /nft-approved - Query NFT approved spender
export const nftApprovedCommand = new SlashCommandBuilder()
  .setName('nft-approved')
  .setDescription('Query approved spender for an NFT')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('token-id')
      .setDescription('NFT token ID')
      .setRequired(true)
  );

// /nft-max-supply - Query NFT max supply (CEP-78)
export const nftMaxSupplyCommand = new SlashCommandBuilder()
  .setName('nft-max-supply')
  .setDescription('Query NFT contract max supply limit (CEP-78)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  );

// /nft-batch-owners - Query batch NFT owners (CEP-78)
export const nftBatchOwnersCommand = new SlashCommandBuilder()
  .setName('nft-batch-owners')
  .setDescription('Query owners of multiple NFTs at once (CEP-78)')
  .addStringOption(option =>
    option.setName('contract-hash')
      .setDescription('NFT contract hash')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('token-ids')
      .setDescription('Comma-separated token IDs (e.g. 1,2,3)')
      .setRequired(true)
  );
