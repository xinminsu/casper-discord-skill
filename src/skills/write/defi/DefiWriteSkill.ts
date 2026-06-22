import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  swapCommand, addLiquidityCommand, removeLiquidityCommand, stakeLpCommand,
  claimRewardCommand, createOrderCommand, cancelOrderCommand,
  counterIncrementCommand, counterDecrementCommand,
  dictPutCommand, dictRemoveCommand,
  createProposalCommand, castVoteCommand, executeProposalCommand,
  saveAssetCommand, callContractCommand,
} from './commands';
import {
  handleSwapCommand, handleAddLiquidityCommand, handleRemoveLiquidityCommand,
  handleStakeLpCommand, handleClaimRewardCommand,
  handleCreateOrderCommand, handleCancelOrderCommand,
  handleCounterIncrementCommand, handleCounterDecrementCommand,
  handleDictPutCommand, handleDictRemoveCommand,
  handleCreateProposalCommand, handleCastVoteCommand, handleExecuteProposalCommand,
  handleSaveAssetCommand, handleCallContractCommand,
} from './handler';

/**
 * DeFi & DApp Write Skill
 *
 * Handles DeFi AMM/liquidity and general DApp write operations:
 *
 * DeFi:
 * - Swap, Add/Remove Liquidity, Stake LP, Claim Reward
 * - Create/Cancel Order
 *
 * DApp:
 * - Counter Increment/Decrement
 * - Dictionary Put/Remove
 * - Governance: Create Proposal, Cast Vote, Execute Proposal
 * - RWA: Save Asset Record
 * - Generic Contract Call
 */
export class DefiWriteSkill extends BaseSkill {
  constructor() {
    super({
      name: 'defi-dapp-write',
      version: '1.0.0',
      description: 'DeFi AMM, liquidity, governance, and general DApp write operations',
      author: 'Casper Team',
      commands: [
        // DeFi
        swapCommand, addLiquidityCommand, removeLiquidityCommand,
        stakeLpCommand, claimRewardCommand,
        createOrderCommand, cancelOrderCommand,
        // DApp
        counterIncrementCommand, counterDecrementCommand,
        dictPutCommand, dictRemoveCommand,
        createProposalCommand, castVoteCommand, executeProposalCommand,
        saveAssetCommand,
        // Generic
        callContractCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      // DeFi
      case 'swap': await handleSwapCommand(interaction); break;
      case 'add-liquidity': await handleAddLiquidityCommand(interaction); break;
      case 'remove-liquidity': await handleRemoveLiquidityCommand(interaction); break;
      case 'stake-lp': await handleStakeLpCommand(interaction); break;
      case 'claim-reward': await handleClaimRewardCommand(interaction); break;
      case 'create-order': await handleCreateOrderCommand(interaction); break;
      case 'cancel-order': await handleCancelOrderCommand(interaction); break;
      // DApp
      case 'counter-increment': await handleCounterIncrementCommand(interaction); break;
      case 'counter-decrement': await handleCounterDecrementCommand(interaction); break;
      case 'dict-put': await handleDictPutCommand(interaction); break;
      case 'dict-remove': await handleDictRemoveCommand(interaction); break;
      case 'create-proposal': await handleCreateProposalCommand(interaction); break;
      case 'cast-vote': await handleCastVoteCommand(interaction); break;
      case 'execute-proposal': await handleExecuteProposalCommand(interaction); break;
      case 'save-asset': await handleSaveAssetCommand(interaction); break;
      // Generic
      case 'call-contract': await handleCallContractCommand(interaction); break;
      default:
        await interaction.reply({ content: `❌ Unknown command: ${interaction.commandName}`, ephemeral: true });
    }
  }
}
