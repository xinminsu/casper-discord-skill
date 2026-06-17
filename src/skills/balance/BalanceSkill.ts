import { BaseSkill } from '../../skills/BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import { balanceCommand } from './commands';
import { handleBalanceCommand } from './handler';

/**
 * Balance Skill
 * 
 * Provides wallet balance query functionality for Casper blockchain.
 */
export class BalanceSkill extends BaseSkill {
  constructor() {
    super({
      name: 'balance',
      version: '1.0.0',
      description: 'Query wallet balance on Casper blockchain',
      author: 'Casper Team',
      commands: [balanceCommand],
    });
  }
  
  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    await handleBalanceCommand(interaction);
  }
}
