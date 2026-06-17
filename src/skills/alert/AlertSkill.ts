import { BaseSkill } from '../../skills/BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import { alertCommand } from './commands';
import { handleAlertAdd, handleAlertList, handleAlertRemove } from './handler';
import { startAlertService, stopAlertService } from './scheduler';

/**
 * Alert Skill
 * 
 * Provides blockchain event monitoring and notifications.
 */
export class AlertSkill extends BaseSkill {
  constructor() {
    super({
      name: 'alert',
      version: '1.0.0',
      description: 'Monitor blockchain events and send notifications',
      author: 'Casper Team',
      commands: [alertCommand],
    });
  }
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    // Start the alert monitoring service
    startAlertService();
  }
  
  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'add':
        await handleAlertAdd(interaction);
        break;
      case 'list':
        await handleAlertList(interaction);
        break;
      case 'remove':
        await handleAlertRemove(interaction);
        break;
      default:
        throw new Error(`Unknown subcommand: ${subcommand}`);
    }
  }
  
  async destroy(): Promise<void> {
    // Stop the alert monitoring service
    stopAlertService();
    
    await super.destroy();
  }
}
