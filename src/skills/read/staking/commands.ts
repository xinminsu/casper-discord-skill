import { SlashCommandBuilder } from 'discord.js';

// /era-validators - Get all validators for current era
export const eraValidatorsCommand = new SlashCommandBuilder()
  .setName('era-validators')
  .setDescription('Query all active validators for the current era')
  .addStringOption(option =>
    option.setName('block-hash')
      .setDescription('Block hash (optional, uses latest if empty)')
      .setRequired(false)
  );

// /validator-detail - Query single validator details
export const validatorDetailCommand = new SlashCommandBuilder()
  .setName('validator-detail')
  .setDescription('Query detailed information about a single validator')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Validator public key (68 hex chars)')
      .setRequired(true)
  );

// /delegation - Query delegation info for a delegator
export const delegationCommand = new SlashCommandBuilder()
  .setName('delegation')
  .setDescription('Query delegation information for a delegator')
  .addStringOption(option =>
    option.setName('delegator')
      .setDescription('Delegator public key (68 hex chars)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('validator')
      .setDescription('Validator public key (68 hex chars, optional)')
      .setRequired(false)
  );

// /auction-info - Get full auction state
export const auctionInfoCommand = new SlashCommandBuilder()
  .setName('auction-info')
  .setDescription('Query full auction state (all bids and delegators)')
  .addStringOption(option =>
    option.setName('block-hash')
      .setDescription('Block hash (optional)')
      .setRequired(false)
  );

// /validator-changes - Get validator changes
export const validatorChangesCommand = new SlashCommandBuilder()
  .setName('validator-changes')
  .setDescription('Query recent validator set changes');

// /era-summary - Get era summary
export const eraSummaryCommand = new SlashCommandBuilder()
  .setName('era-summary')
  .setDescription('Query era summary (validators, rewards, era info)')
  .addStringOption(option =>
    option.setName('block-hash')
      .setDescription('Block hash (optional, uses latest if empty)')
      .setRequired(false)
  );
