import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  contractInfoCommand,
  entryPointsCommand,
  dictItemCommand,
  dictByAccountCommand,
  dictByContractCommand,
  stateItemCommand,
  contractNamedKeysCommand,
} from './commands';
import {
  handleContractInfoCommand,
  handleEntryPointsCommand,
  handleDictItemCommand,
  handleDictByAccountCommand,
  handleDictByContractCommand,
  handleStateItemCommand,
  handleContractNamedKeysCommand,
} from './handler';

/**
 * Contract Read Skill
 *
 * Read-only queries for Casper smart contract information:
 * - Contract metadata (hash, version, entry points)
 * - Contract entry points listing
 * - Dictionary item queries (by URef, by account, by contract)
 * - State item queries
 * - Contract named keys
 */
export class ContractReadSkill extends BaseSkill {
  constructor() {
    super({
      name: 'contract-read',
      version: '1.0.0',
      description: 'Query Casper contract metadata, entry points, and dictionary items (read-only)',
      author: 'Casper Team',
      commands: [
        contractInfoCommand,
        entryPointsCommand,
        dictItemCommand,
        dictByAccountCommand,
        dictByContractCommand,
        stateItemCommand,
        contractNamedKeysCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'contract-info':
        await handleContractInfoCommand(interaction);
        break;
      case 'entry-points':
        await handleEntryPointsCommand(interaction);
        break;
      case 'dict-item':
        await handleDictItemCommand(interaction);
        break;
      case 'dict-by-account':
        await handleDictByAccountCommand(interaction);
        break;
      case 'dict-by-contract':
        await handleDictByContractCommand(interaction);
        break;
      case 'state-item':
        await handleStateItemCommand(interaction);
        break;
      case 'contract-named-keys':
        await handleContractNamedKeysCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
