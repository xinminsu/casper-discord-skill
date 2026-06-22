import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  accountInfoCommand,
  purseBalanceCommand,
  namedKeysCommand,
  accountBalanceCommand,
  purseDetailsCommand,
  globalStateCommand,
} from './commands';
import {
  handleAccountInfoCommand,
  handlePurseBalanceCommand,
  handleNamedKeysCommand,
  handleAccountBalanceCommand,
  handlePurseDetailsCommand,
  handleGlobalStateCommand,
} from './handler';

/**
 * Account Read Skill
 *
 * Read-only queries for Casper account and asset information:
 * - Account info (keys, purses, thresholds)
 * - Purse balance queries
 * - Named keys listing
 * - Account CSPR balance
 * - Purse balance with full details
 * - Global state queries
 */
export class AccountReadSkill extends BaseSkill {
  constructor() {
    super({
      name: 'account-read',
      version: '1.0.0',
      description: 'Query Casper account, balance, and asset information (read-only)',
      author: 'Casper Team',
      commands: [
        accountInfoCommand,
        purseBalanceCommand,
        namedKeysCommand,
        accountBalanceCommand,
        purseDetailsCommand,
        globalStateCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'account-info':
        await handleAccountInfoCommand(interaction);
        break;
      case 'purse-balance':
        await handlePurseBalanceCommand(interaction);
        break;
      case 'named-keys':
        await handleNamedKeysCommand(interaction);
        break;
      case 'account-balance':
        await handleAccountBalanceCommand(interaction);
        break;
      case 'purse-details':
        await handlePurseDetailsCommand(interaction);
        break;
      case 'global-state':
        await handleGlobalStateCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
