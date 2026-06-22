import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  transferCommand,
  createPurseCommand,
  addKeyCommand,
  removeKeyCommand,
  setThresholdCommand,
  putNamedKeyCommand,
} from './commands';
import {
  handleTransferCommand,
  handleCreatePurseCommand,
  handleAddKeyCommand,
  handleRemoveKeyCommand,
  handleSetThresholdCommand,
  handlePutNamedKeyCommand,
} from './handler';

/**
 * Native CSPR Write Skill
 *
 * Handles native blockchain write operations:
 * - CSPR transfers
 * - Purse creation
 * - Account key management (add/remove associated keys)
 * - Action threshold configuration
 * - Named key binding
 */
export class NativeWriteSkill extends BaseSkill {
  constructor() {
    super({
      name: 'native-write',
      version: '1.0.0',
      description: 'Native CSPR blockchain write operations (transfers, keys, purses)',
      author: 'Casper Team',
      commands: [
        transferCommand,
        createPurseCommand,
        addKeyCommand,
        removeKeyCommand,
        setThresholdCommand,
        putNamedKeyCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'transfer':
        await handleTransferCommand(interaction);
        break;
      case 'create-purse':
        await handleCreatePurseCommand(interaction);
        break;
      case 'add-key':
        await handleAddKeyCommand(interaction);
        break;
      case 'remove-key':
        await handleRemoveKeyCommand(interaction);
        break;
      case 'set-threshold':
        await handleSetThresholdCommand(interaction);
        break;
      case 'put-named-key':
        await handlePutNamedKeyCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
