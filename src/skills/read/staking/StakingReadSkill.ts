import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  eraValidatorsCommand,
  validatorDetailCommand,
  delegationCommand,
  auctionInfoCommand,
  validatorChangesCommand,
  eraSummaryCommand,
} from './commands';
import {
  handleEraValidatorsCommand,
  handleValidatorDetailCommand,
  handleDelegationCommand,
  handleAuctionInfoCommand,
  handleValidatorChangesCommand,
  handleEraSummaryCommand,
} from './handler';

/**
 * Staking Read Skill
 *
 * Read-only queries for Casper staking and consensus information:
 * - Era validators listing
 * - Single validator detail (stake, delegation rate, delegators)
 * - Delegation info for a delegator
 * - Full auction state
 * - Validator set changes
 * - Era summary with rewards
 */
export class StakingReadSkill extends BaseSkill {
  constructor() {
    super({
      name: 'staking-read',
      version: '1.0.0',
      description: 'Query Casper staking, validators, and consensus information (read-only)',
      author: 'Casper Team',
      commands: [
        eraValidatorsCommand,
        validatorDetailCommand,
        delegationCommand,
        auctionInfoCommand,
        validatorChangesCommand,
        eraSummaryCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'era-validators':
        await handleEraValidatorsCommand(interaction);
        break;
      case 'validator-detail':
        await handleValidatorDetailCommand(interaction);
        break;
      case 'delegation':
        await handleDelegationCommand(interaction);
        break;
      case 'auction-info':
        await handleAuctionInfoCommand(interaction);
        break;
      case 'validator-changes':
        await handleValidatorChangesCommand(interaction);
        break;
      case 'era-summary':
        await handleEraSummaryCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
