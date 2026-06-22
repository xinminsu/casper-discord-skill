import { BaseSkill } from '../../skills/BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  nodeStatusCommand,
  peersCommand,
  blockCommand,
  deployCommand,
  validatorsCommand,
  eraCommand,
  stateRootHashCommand,
  transfersCommand,
  chainspecCommand,
} from './commands';
import {
  handleNodeStatusCommand,
  handlePeersCommand,
  handleBlockCommand,
  handleDeployCommand,
  handleValidatorsCommand,
  handleEraCommand,
  handleStateRootHashCommand,
  handleTransfersCommand,
  handleChainspecCommand,
} from './handler';

/**
 * Network Skill
 *
 * Provides Casper blockchain network query functionality:
 * - Node status
 * - Network peers
 * - Block information
 * - Deploy/transaction info
 * - Validators/auction info
 * - Era information
 * - State root hash
 * - Block transfers
 * - Chainspec
 */
export class NetworkSkill extends BaseSkill {
  constructor() {
    super({
      name: 'network',
      version: '1.0.0',
      description: 'Query Casper blockchain network information',
      author: 'Casper Team',
      commands: [
        nodeStatusCommand,
        peersCommand,
        blockCommand,
        deployCommand,
        validatorsCommand,
        eraCommand,
        stateRootHashCommand,
        transfersCommand,
        chainspecCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const commandName = interaction.commandName;

    switch (commandName) {
      case 'node-status':
        await handleNodeStatusCommand(interaction);
        break;
      case 'peers':
        await handlePeersCommand(interaction);
        break;
      case 'block':
        await handleBlockCommand(interaction);
        break;
      case 'deploy':
        await handleDeployCommand(interaction);
        break;
      case 'validators':
        await handleValidatorsCommand(interaction);
        break;
      case 'era':
        await handleEraCommand(interaction);
        break;
      case 'state-root-hash':
        await handleStateRootHashCommand(interaction);
        break;
      case 'transfers':
        await handleTransfersCommand(interaction);
        break;
      case 'chainspec':
        await handleChainspecCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${commandName}`,
          ephemeral: true,
        });
    }
  }
}
