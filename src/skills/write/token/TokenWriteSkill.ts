import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  mintCommand, burnCommand, tokenTransferCommand,
  approveCommand, increaseAllowanceCommand, decreaseAllowanceCommand,
  transferFromCommand,
} from './commands';
import {
  handleMintCommand, handleBurnCommand, handleTokenTransferCommand,
  handleApproveCommand, handleIncreaseAllowanceCommand, handleDecreaseAllowanceCommand,
  handleTransferFromCommand,
} from './handler';

/**
 * CEP-18 Token Write Skill
 *
 * Handles fungible token (CEP-18 standard) write operations:
 * - Mint / Burn tokens
 * - Transfer tokens
 * - Approve / Increase / Decrease allowance
 * - Transfer from (approved spender)
 */
export class TokenWriteSkill extends BaseSkill {
  constructor() {
    super({
      name: 'token-write',
      version: '1.0.0',
      description: 'CEP-18 fungible token write operations (mint, burn, transfer, approve)',
      author: 'Casper Team',
      commands: [
        mintCommand, burnCommand, tokenTransferCommand,
        approveCommand, increaseAllowanceCommand, decreaseAllowanceCommand,
        transferFromCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'mint': await handleMintCommand(interaction); break;
      case 'burn': await handleBurnCommand(interaction); break;
      case 'token-transfer': await handleTokenTransferCommand(interaction); break;
      case 'approve': await handleApproveCommand(interaction); break;
      case 'increase-allowance': await handleIncreaseAllowanceCommand(interaction); break;
      case 'decrease-allowance': await handleDecreaseAllowanceCommand(interaction); break;
      case 'transfer-from': await handleTransferFromCommand(interaction); break;
      default:
        await interaction.reply({ content: `❌ Unknown command: ${interaction.commandName}`, ephemeral: true });
    }
  }
}
