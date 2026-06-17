import { BaseSkill } from '../../skills/BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import { pushCommand } from './commands';
import { handlePushCommand } from './handler';

/**
 * Push Skill
 * 
 * Provides message push functionality to Discord channels.
 */
export class PushSkill extends BaseSkill {
  constructor() {
    super({
      name: 'push',
      version: '1.0.0',
      description: 'Push notification messages to Discord channels',
      author: 'Casper Team',
      commands: [pushCommand],
    });
  }
  
  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    await handlePushCommand(interaction);
  }
}
