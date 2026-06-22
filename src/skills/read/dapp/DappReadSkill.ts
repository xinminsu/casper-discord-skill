import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  counterValueCommand,
  ammReservesCommand,
  ammLpBalanceCommand,
  ammStakeInfoCommand,
  allProposalsCommand,
  proposalDetailCommand,
  voteRecordCommand,
  assetRecordCommand,
  openOrdersCommand,
} from './commands';
import {
  handleCounterValueCommand,
  handleAmmReservesCommand,
  handleAmmLpBalanceCommand,
  handleAmmStakeInfoCommand,
  handleAllProposalsCommand,
  handleProposalDetailCommand,
  handleVoteRecordCommand,
  handleAssetRecordCommand,
  handleOpenOrdersCommand,
} from './handler';

/**
 * DApp Read Skill
 *
 * Read-only queries for general DApp business logic:
 * - Counter: query current count value
 * - AMM: pool reserves, LP balance, staking info
 * - Governance: all proposals, proposal detail, vote record
 * - RWA: asset record query
 * - DEX: open orders query
 */
export class DappReadSkill extends BaseSkill {
  constructor() {
    super({
      name: 'dapp-read',
      version: '1.0.0',
      description: 'Query DApp business data: counter, AMM, governance, RWA, DEX orders (read-only)',
      author: 'Casper Team',
      commands: [
        counterValueCommand,
        ammReservesCommand,
        ammLpBalanceCommand,
        ammStakeInfoCommand,
        allProposalsCommand,
        proposalDetailCommand,
        voteRecordCommand,
        assetRecordCommand,
        openOrdersCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'counter-value':
        await handleCounterValueCommand(interaction);
        break;
      case 'amm-reserves':
        await handleAmmReservesCommand(interaction);
        break;
      case 'amm-lp-balance':
        await handleAmmLpBalanceCommand(interaction);
        break;
      case 'amm-stake-info':
        await handleAmmStakeInfoCommand(interaction);
        break;
      case 'all-proposals':
        await handleAllProposalsCommand(interaction);
        break;
      case 'proposal-detail':
        await handleProposalDetailCommand(interaction);
        break;
      case 'vote-record':
        await handleVoteRecordCommand(interaction);
        break;
      case 'asset-record':
        await handleAssetRecordCommand(interaction);
        break;
      case 'open-orders':
        await handleOpenOrdersCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
