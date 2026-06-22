import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  bondCommand, delegateCommand, unbondCommand, undelegateCommand,
  withdrawRewardsCommand, setCommissionRateCommand,
} from './commands';
import {
  handleBondCommand, handleDelegateCommand, handleUnbondCommand,
  handleUndelegateCommand, handleWithdrawRewardsCommand, handleSetCommissionRateCommand,
} from './handler';

/**
 * Staking Write Skill
 *
 * Handles staking / consensus protocol write operations:
 * - Bond (self-stake to become validator)
 * - Delegate (delegate to validator)
 * - Unbond (withdraw self-stake)
 * - Undelegate (withdraw delegation)
 * - Withdraw rewards
 * - Set commission rate
 */
export class StakingWriteSkill extends BaseSkill {
  constructor() {
    super({
      name: 'staking-write',
      version: '1.0.0',
      description: 'Casper staking/consensus write operations (bond, delegate, unbond)',
      author: 'Casper Team',
      commands: [
        bondCommand, delegateCommand, unbondCommand, undelegateCommand,
        withdrawRewardsCommand, setCommissionRateCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      case 'bond': await handleBondCommand(interaction); break;
      case 'delegate': await handleDelegateCommand(interaction); break;
      case 'unbond': await handleUnbondCommand(interaction); break;
      case 'undelegate': await handleUndelegateCommand(interaction); break;
      case 'withdraw-rewards': await handleWithdrawRewardsCommand(interaction); break;
      case 'set-commission-rate': await handleSetCommissionRateCommand(interaction); break;
      default:
        await interaction.reply({ content: `❌ Unknown command: ${interaction.commandName}`, ephemeral: true });
    }
  }
}
